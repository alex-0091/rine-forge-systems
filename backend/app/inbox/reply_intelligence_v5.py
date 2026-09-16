"""
Rine Forge Systems V5 - Reply Intelligence & Intent Classifier (Module 55)
Classifies inbound prospect replies into 5 authoritative intents and executes
immediate downstream automation: instant suppression for opt-outs, CRM pipeline
updates, objection-handling drafts, and staff notifications.
"""
import re
import logging
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, Optional, Tuple, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.models.v5 import (
    V5Prospect,
    V5ProspectOutreach,
    V5OutreachEvent,
    V5Notification
)
from backend.app.compliance.suppression_service import suppression_service
from backend.app.outreach.followup_engine import followup_engine

logger = logging.getLogger(__name__)

OPTOUT_PATTERNS = [
    r'\bstop\b', r'\bunsubscribe\b', r'\bremove\b', r'\bdo not contact\b',
    r'\bdont email\b', r'\bdon\'t email\b', r'\btake me off\b', r'\bspam\b',
    r'\bleave me alone\b', r'\bnot authorized\b', r'\bcease\b'
]

POSITIVE_PATTERNS = [
    r'\byes\b', r'\bsend me\b', r'\bhow much\b', r'\bpricing\b', r'\bcost\b',
    r'\bdemo\b', r'\binterested\b', r'\btalk next week\b', r'\bcall me\b',
    r'\bschedule\b', r'\bsounds good\b', r'\btell me more\b', r'\bavailable\b',
    r'\blet\'s connect\b', r'\bset up\b'
]

QUESTION_PATTERNS = [
    r'\bhow does\b', r'\bdoes it work\b', r'\bwork with\b', r'\bdentrix\b',
    r'\beaglesoft\b', r'\bpodium\b', r'\bbirdeye\b', r'\banswering service\b',
    r'\bhipaa\b', r'\bintegrat', r'\bsetup time\b', r'\bcontracts?\b'
]

REFERRAL_PATTERNS = [
    r'\btalk to\b', r'\bcontact\b', r'\breach out to\b', r'\boffice manager\b',
    r'\bforwarding to\b', r'\bspeak with\b', r'\bmy partner\b'
]

BAD_TIMING_PATTERNS = [
    r'\bnot right now\b', r'\bnext quarter\b', r'\bq[1-4]\b', r'\blater this year\b',
    r'\bbusy right now\b', r'\bcheck back\b', r'\bfall\b', r'\bspring\b', r'\bsummer\b'
]

class ReplyIntelligenceService:
    """
    Classifies prospect email/WhatsApp replies and automates lifecycle state transitions.
    """

    def classify_intent(self, text: str) -> Dict[str, Any]:
        """
        Classifies message into 1 of 5 intent classes:
        1. OPTOUT_HOSTILE
        2. POSITIVE_INTERESTED
        3. QUESTION_OBJECTION
        4. WRONG_PERSON_REFERRAL
        5. NOT_INTERESTED_BAD_TIMING
        """
        clean = text.lower().strip()

        # 1. Immediate Opt-Out / Hostile Check (Priority 1)
        for pat in OPTOUT_PATTERNS:
            if re.search(pat, clean):
                return {
                    "intent": "OPTOUT_HOSTILE",
                    "confidence": 0.99,
                    "matched_pattern": pat,
                    "action_required": "IMMEDIATE_SUPPRESSION_NO_REPLY"
                }

        # 2. Referral / Wrong Person Check
        for pat in REFERRAL_PATTERNS:
            if re.search(pat, clean):
                # Check if email is provided
                emails = re.findall(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', text)
                return {
                    "intent": "WRONG_PERSON_REFERRAL",
                    "confidence": 0.90,
                    "matched_pattern": pat,
                    "referral_emails": emails,
                    "action_required": "UPDATE_CONTACT_TARGET"
                }

        # 3. Positive / Interested Check (Priority over general inquiry questions)
        for pat in POSITIVE_PATTERNS:
            if re.search(pat, clean):
                return {
                    "intent": "POSITIVE_INTERESTED",
                    "confidence": 0.94,
                    "matched_pattern": pat,
                    "action_required": "ALERT_OWNER_MOVE_INTERESTED"
                }

        # 4. Question / Objection Check
        for pat in QUESTION_PATTERNS:
            if re.search(pat, clean):
                return {
                    "intent": "QUESTION_OBJECTION",
                    "confidence": 0.91,
                    "matched_pattern": pat,
                    "action_required": "DRAFT_OBJECTION_ANSWER"
                }


        # 5. Bad Timing or General Not Interested
        for pat in BAD_TIMING_PATTERNS:
            if re.search(pat, clean):
                return {
                    "intent": "NOT_INTERESTED_BAD_TIMING",
                    "sub_type": "BAD_TIMING",
                    "confidence": 0.88,
                    "action_required": "RESCHEDULE_FOLLOWUP"
                }

        # Default fallback
        if "not interested" in clean or "no thanks" in clean or "pass" in clean:
            return {
                "intent": "NOT_INTERESTED_BAD_TIMING",
                "sub_type": "NOT_INTERESTED",
                "confidence": 0.92,
                "action_required": "ARCHIVE_DISQUALIFIED"
            }

        return {
            "intent": "QUESTION_OBJECTION",
            "confidence": 0.70,
            "matched_pattern": "unclassified_inbound",
            "action_required": "FLAG_FOR_STAFF_REVIEW"
        }

    async def process_inbound_reply(
        self,
        session: AsyncSession,
        business_id: str,
        prospect_id: str,
        reply_text: str,
        channel: str = "EMAIL",
        sender_contact: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Executes end-to-end reply handling with safety guards.
        """
        prospect = await session.get(V5Prospect, prospect_id)
        if not prospect:
            raise ValueError(f"Prospect {prospect_id} not found.")

        classification = self.classify_intent(reply_text)
        intent = classification["intent"]
        now = datetime.now(timezone.utc)

        # Record telemetry on last outreach message
        last_outreach_stmt = (
            select(V5ProspectOutreach)
            .where(V5ProspectOutreach.prospect_id == prospect.id)
            .order_by(V5ProspectOutreach.created_at.desc())
        )
        res = await session.execute(last_outreach_stmt)
        last_outreach = res.scalars().first()

        if last_outreach:
            last_outreach.status = "REPLIED"
            last_outreach.replied_at = now
            session.add(V5OutreachEvent(
                outreach_id=last_outreach.id,
                event_type="REPLIED",
                payload={"reply_snippet": reply_text[:200], "intent": intent}
            ))

        # Cancel any active pending follow-ups
        await followup_engine.cancel_sequence(
            session=session,
            prospect_id=prospect.id,
            reason=f"Inbound reply received ({intent})"
        )

        # -------------------------------------------------------------
        # 1. OPT-OUT / HOSTILE
        # -------------------------------------------------------------
        if intent == "OPTOUT_HOSTILE":
            prospect.outreach_status = "OPTED_OUT"
            prospect.contact_status = "DO_NOT_CONTACT"
            prospect.pipeline_stage = "OPTED_OUT"
            prospect.next_action = "SUPPRESSED"

            suppress_val = sender_contact or prospect.email or prospect.phone
            if suppress_val:
                entry_type = "EMAIL" if "@" in suppress_val else "PHONE"
                await suppression_service.add_to_suppression(
                    session=session,
                    business_id=business_id,
                    entry_type=entry_type,
                    value=suppress_val,
                    reason="USER_OPTOUT"
                )

            await session.commit()
            return {
                "intent": intent,
                "action": "SUPPRESSED_AND_HALTED",
                "prospect_id": prospect.id,
                "reply_sent": False
            }

        # -------------------------------------------------------------
        # 2. POSITIVE / INTERESTED
        # -------------------------------------------------------------
        elif intent == "POSITIVE_INTERESTED":
            prospect.pipeline_stage = "INTERESTED"
            prospect.outreach_status = "REPLIED"
            prospect.contact_status = "ENGAGED"
            prospect.next_action = "BOOKING_DEMO_OR_CALL"

            # Create Alert / Notification for Business Owner
            session.add(V5Notification(
                business_id=business_id,
                type="EMAIL",
                recipient="owner@rineforge.com",
                message=f"[Interested Lead: {prospect.company_name}] Positive reply: '{reply_text[:120]}...'",
                status="SENT"
            ))

            # Suggest AI drafted demo response
            drafted_reply = (
                f"Hi team,\n\n"
                f"Delighted to hear! You can test Elena live directly here: https://rineforge.com/demo\n"
                f"Alternatively, Dr./Office Manager can book a 10-minute calendar walkthrough at: https://calendly.com/rineforge/demo\n\n"
                f"Looking forward to connecting!"
            )

            await session.commit()
            return {
                "intent": intent,
                "action": "MOVED_TO_INTERESTED_ALERTED_OWNER",
                "prospect_id": prospect.id,
                "suggested_draft": drafted_reply
            }

        # -------------------------------------------------------------
        # 3. QUESTION / OBJECTION
        # -------------------------------------------------------------
        elif intent == "QUESTION_OBJECTION":
            prospect.pipeline_stage = "RESPONDED"
            prospect.outreach_status = "REPLIED"
            prospect.next_action = "STAFF_REVIEW_OBJECTION_REPLY"

            # Draft objection answer
            drafted_reply = self._draft_objection_answer(reply_text, prospect)

            session.add(V5Notification(
                business_id=business_id,
                type="EMAIL",
                recipient="owner@rineforge.com",
                message=f"[Question from {prospect.company_name}] Inquiry: '{reply_text[:120]}...'",
                status="SENT"
            ))


            await session.commit()
            return {
                "intent": intent,
                "action": "OBJECTION_DRAFTED_PENDING_REVIEW",
                "prospect_id": prospect.id,
                "suggested_draft": drafted_reply
            }

        # -------------------------------------------------------------
        # 4. WRONG PERSON / REFERRAL
        # -------------------------------------------------------------
        elif intent == "WRONG_PERSON_REFERRAL":
            ref_emails = classification.get("referral_emails", [])
            prospect.pipeline_stage = "DISCOVERED"
            prospect.outreach_status = "DRAFT"
            meta = dict(prospect.meta_json or {})
            if ref_emails:
                meta["referred_to"] = ref_emails[0]
                prospect.email = ref_emails[0]
                prospect.next_action = f"REASSIGNED_TO_{ref_emails[0]}"
            prospect.meta_json = meta

            await session.commit()
            return {
                "intent": intent,
                "action": "REASSIGNED_PROSPECT_TARGET",
                "prospect_id": prospect.id,
                "referred_email": ref_emails[0] if ref_emails else None
            }

        # -------------------------------------------------------------
        # 5. NOT INTERESTED / BAD TIMING
        # -------------------------------------------------------------
        else:
            if classification.get("sub_type") == "BAD_TIMING":
                prospect.pipeline_stage = "CONTACTED"
                prospect.next_action = "FOLLOWUP_IN_90_DAYS"
                prospect.notes = f"Prospect requested future follow-up: '{reply_text[:100]}'"
            else:
                prospect.pipeline_stage = "DISQUALIFIED"
                prospect.outreach_status = "STOPPED"
                prospect.contact_status = "DO_NOT_CONTACT"
                prospect.next_action = "ARCHIVED_NOT_INTERESTED"

            await session.commit()
            return {
                "intent": intent,
                "action": "ARCHIVED_OR_RESCHEDULED",
                "prospect_id": prospect.id
            }

    def _draft_objection_answer(self, text: str, prospect: V5Prospect) -> str:
        clean = text.lower()
        if "dentrix" in clean or "eaglesoft" in clean or "pms" in clean or "software" in clean:
            return (
                "Elena integrates directly with Dentrix, Eaglesoft, and standard dental practice management "
                "systems via our sync connector, reading open chair availability and inserting confirmed appointments."
            )
        elif "podium" in clean or "birdeye" in clean:
            return (
                "While tools like Podium focus primarily on review generation and SMS routing to your busy desk staff, "
                "Elena is an autonomous AI employee that actually resolves inquiries and books the appointment in real-time."
            )
        elif "answering service" in clean:
            return (
                "Unlike a traditional call center that only takes messages and emails your front desk later, "
                "Elena provides conversational answers to specific procedures and books appointments directly into your calendar 24/7."
            )
        elif "price" in clean or "cost" in clean or "how much" in clean:
            return (
                "Our AI Receptionist packages start at $497/month with full 24/7 coverage, unlimited conversations, "
                "and no setup fees. Would you like a quick breakdown based on your expected inquiry volume?"
            )
        else:
            return (
                f"Thank you for the note. Elena provides 24/7 automated receptionist coverage across Web and WhatsApp "
                f"specifically tailored to {prospect.industry or 'professional'} workflows. Would you be open to a quick 5-minute call?"
            )

reply_intelligence_service = ReplyIntelligenceService()
