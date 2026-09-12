import logging
from datetime import datetime, timezone
from typing import Dict, Any, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.config import settings
from backend.app.models.business import Business, Contact
from backend.app.models.campaign import CampaignMember
from backend.app.models.inbox import Conversation, Reply
from backend.app.models.compliance import AuditLog
from backend.app.compliance.suppression import suppression_manager
from backend.app.outreach.followup import followup_scheduler
from backend.app.inbox.reply_classifier import reply_classifier
from backend.app.inbox.reply_generator import reply_generator
from backend.app.inbox.escalation import escalation_manager
from backend.app.inbox.buying_signals import buying_signal_extractor
from backend.app.notifications.base import notification_provider

logger = logging.getLogger(__name__)

class ReplyMonitor:
    """
    Ingests and processes incoming prospect replies:
    1. Finds or initializes Conversation
    2. Immediately halts scheduled follow-ups for this lead
    3. Detects Opt-Out / Suppression keywords and suppresses immediately if requested
    4. Runs Gemini classification & intent scoring
    5. Extracts high-intent commercial buying signals
    6. Generates suggested response
    7. Triggers Owais Escalation Alert & Push Notifications for high-intent signals
    """

    async def process_inbound_reply(
        self,
        session: AsyncSession,
        sender_email: str,
        subject: str,
        body_text: str,
        recipient_email: str = None
    ) -> Dict[str, Any]:
        clean_email = sender_email.strip().lower()
        recip_email = recipient_email or settings.SENDER_EMAIL

        # 1. Match business by email or domain
        biz_stmt = select(Business).where(Business.primary_email == clean_email)
        res = await session.execute(biz_stmt)
        business = res.scalars().first()

        if not business and "@" in clean_email:
            dom = clean_email.split("@")[-1]
            dom_stmt = select(Business).where(Business.normalized_domain == dom)
            dom_res = await session.execute(dom_stmt)
            business = dom_res.scalars().first()

        biz_name = business.name if business else clean_email
        biz_id = business.id if business else None

        # 2. Cancel any pending follow-ups for all memberships of this business
        if business:
            mem_stmt = select(CampaignMember).where(CampaignMember.business_id == business.id)
            mem_res = await session.execute(mem_stmt)
            memberships = mem_res.scalars().all()
            for mem in memberships:
                await followup_scheduler.cancel_all_pending_followups_for_member(
                    session=session,
                    campaign_member_id=mem.id,
                    reason="Inbound Reply Received"
                )
                mem.status = "REPLIED"

        # 3. Check for Opt-Out / Stop keywords
        is_optout = suppression_manager.is_optout_intent(body_text) or suppression_manager.is_optout_intent(subject)
        if is_optout:
            await suppression_manager.add_suppression(
                session=session,
                value=clean_email,
                entry_type="EMAIL",
                reason="USER_OPTOUT",
                source="inbound_reply",
                notes=f"Auto-suppressed from inbound reply: '{body_text[:100]}'"
            )
            if business:
                business.status = "SUPPRESSED"

        # 4. Classify intent via Gemini / LLM & Extract Buying Signals
        signal_res = buying_signal_extractor.analyze_signals(body_text)
        
        if is_optout:
            intent_class = "STOP"
            intent_score = 0
            human_required = False
            escalation_reason = None
            classification_res = {"sentiment": "Opt-out"}
        else:
            classification_res = await reply_classifier.classify_reply(
                reply_body=body_text,
                lead_context={"business_name": biz_name, "industry": business.industry if business else "Business"}
            )
            intent_class = classification_res["classification"]
            intent_score = classification_res["intent_score"]
            human_required = classification_res["human_escalation_required"] or signal_res["requires_owner_attention"]
            escalation_reason = classification_res.get("escalation_reason") or (f"Detected buying signals: {', '.join(signal_res['signals'])}" if signal_res['has_buying_signal'] else None)

        # 5. Generate suggested response
        suggested_draft = await reply_generator.generate_suggested_reply(
            inbound_message=body_text,
            business_profile={"business_name": biz_name, "contact_name": "there", "industry": business.industry if business else "Business"},
            intent_class=intent_class
        )

        # 6. Save or update Conversation & Reply
        conv_stmt = select(Conversation).where(Conversation.contact_email == clean_email)
        c_res = await session.execute(conv_stmt)
        conversation = c_res.scalars().first()

        if not conversation:
            conversation = Conversation(
                business_id=biz_id,
                contact_email=clean_email,
                subject=subject,
                status="OPEN"
            )
            session.add(conversation)
            await session.flush()

        conversation.latest_intent_classification = intent_class
        conversation.latest_intent_score = intent_score
        conversation.requires_human_action = human_required
        conversation.human_action_reason = escalation_reason

        reply_record = Reply(
            conversation_id=conversation.id,
            direction="INBOUND",
            sender_email=clean_email,
            recipient_email=recip_email,
            raw_body=body_text,
            classification=intent_class,
            intent_score=intent_score,
            sentiment=classification_res.get("sentiment"),
            suggested_reply=suggested_draft.get("suggested_response"),
            auto_responded=False,
            human_approved=False
        )
        session.add(reply_record)

        # Update business status
        if business:
            if is_optout:
                business.status = "SUPPRESSED"
            elif intent_score >= 80 or signal_res["has_buying_signal"]:
                business.status = "INTERESTED"
            else:
                business.status = "REPLIED"

        # 7. Escalation Alert & Notification to Owais
        if human_required:
            await escalation_manager.trigger_escalation(
                session=session,
                business_name=biz_name,
                contact_name="Prospect",
                contact_email=clean_email,
                message_snippet=body_text[:180],
                reason=escalation_reason or f"High intent classification: {intent_class}",
                intent_score=intent_score
            )
            await notification_provider.notify_high_intent_reply(
                sender_email=clean_email,
                business_name=biz_name,
                intent_type=intent_class,
                snippet=body_text
            )

        audit = AuditLog(
            event_type="REPLY_CLASSIFIED",
            actor="reply_monitor",
            entity_type="reply",
            description=f"Classified reply from {clean_email} as '{intent_class}' (Score: {intent_score}, Signals: {signal_res['signals']}, Human Required: {human_required})"
        )
        session.add(audit)

        await session.commit()
        await session.refresh(reply_record)

        return {
            "conversation_id": conversation.id,
            "reply_id": reply_record.id,
            "classification": intent_class,
            "intent_score": intent_score,
            "buying_signals": signal_res["signals"],
            "human_action_required": human_required,
            "suggested_response": suggested_draft.get("suggested_response"),
            "suppressed": is_optout
        }

reply_monitor = ReplyMonitor()
