import logging
from datetime import datetime, timezone
from typing import Dict, Any, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.kill_switch import kill_switch
from backend.app.compliance.suppression import suppression_manager
from backend.app.outreach.rate_limiter import rate_controller
from backend.app.outreach.email_provider import get_email_provider
from backend.app.outreach.scheduler import outreach_scheduler
from backend.app.models.campaign import OutreachMessage, MessageEvent, CampaignMember
from backend.app.models.compliance import AuditLog, MailboxHealth
from backend.app.config import settings

logger = logging.getLogger(__name__)

class OutreachQueueWorker:
    """
    Controlled dispatcher for queued outreach messages with safety checks:
    - Global Kill Switch verification
    - Real-time Suppression verification
    - Idempotency deduplication check
    - Rate Controller & Timezone verification
    - Mailbox Health metric updates
    - State transition and audit logging
    """

    async def dispatch_message(self, session: AsyncSession, message_id: str, manual_override: bool = False) -> Dict[str, Any]:
        # 1. Kill switch check
        if kill_switch.is_paused():
            return {
                "success": False,
                "reason": "Global Kill Switch is ACTIVE. All outreach is paused.",
                "status": "HALTED_BY_KILL_SWITCH"
            }

        # 2. Fetch message
        stmt = select(OutreachMessage).where(OutreachMessage.id == message_id)
        res = await session.execute(stmt)
        message = res.scalars().first()
        if not message:
            return {"success": False, "reason": "Message not found."}

        if message.status in ["SENT", "CANCELLED"]:
            return {"success": False, "reason": f"Message is already in '{message.status}' state."}

        # 3. Idempotency Check
        if message.idempotency_key:
            dup_stmt = select(OutreachMessage).where(
                OutreachMessage.idempotency_key == message.idempotency_key,
                OutreachMessage.status == "SENT",
                OutreachMessage.id != message.id
            )
            dup_res = await session.execute(dup_stmt)
            if dup_res.scalars().first():
                message.status = "CANCELLED"
                await session.commit()
                return {
                    "success": False,
                    "reason": f"Duplicate dispatch prevented by idempotency key '{message.idempotency_key}'.",
                    "status": "DUPLICATE_PREVENTED"
                }

        # 4. Real-time Suppression Check
        is_supp = await suppression_manager.is_suppressed(
            session=session,
            email=message.recipient_email
        )
        if is_supp:
            message.status = "CANCELLED"
            await session.commit()
            return {
                "success": False,
                "reason": f"Recipient '{message.recipient_email}' is on suppression list. Dispatch blocked.",
                "status": "SUPPRESSED"
            }

        # 5. Rate Controller Check
        can_send, rate_reason = rate_controller.can_send()
        if not can_send and not manual_override:
            return {
                "success": False,
                "reason": rate_reason,
                "status": "RATE_LIMITED"
            }

        # 6. Dispatch through EmailProvider
        provider = get_email_provider(is_dry_run=getattr(message, "is_dry_run", False))
        dispatch_result = await provider.send_email(
            to_email=message.recipient_email,
            to_name=message.recipient_name,
            subject=message.subject,
            body_text=message.body_text
        )

        mailbox_addr = getattr(settings, "SMTP_FROM_EMAIL", "outreach@owais.ai")
        mb_stmt = select(MailboxHealth).where(MailboxHealth.mailbox_address == mailbox_addr)
        mb_res = await session.execute(mb_stmt)
        mb_health = mb_res.scalars().first()
        if not mb_health:
            mb_health = MailboxHealth(mailbox_address=mailbox_addr, sent_today=0, delivered_count=0, bounce_count=0, complaint_count=0, health_score=100, status="HEALTHY")
            session.add(mb_health)

        if dispatch_result.get("delivered", False):
            message.status = "SENT"
            message.sent_at = datetime.now(timezone.utc)
            message.message_id_header = dispatch_result.get("message_id")
            
            rate_controller.record_send()
            mb_health.sent_today += 1
            mb_health.delivered_count += 1

            # Record MessageEvent
            event = MessageEvent(
                message_id=message.id,
                event_type="SENT",
                metadata_json=dispatch_result
            )
            session.add(event)

            # Update CampaignMember status
            member_stmt = select(CampaignMember).where(CampaignMember.id == message.campaign_member_id)
            mem_res = await session.execute(member_stmt)
            member = mem_res.scalars().first()
            if member:
                member.status = "IN_SEQUENCE"
                member.current_sequence_step = message.step_number

            audit = AuditLog(
                event_type="EMAIL_SENT",
                actor="queue_worker",
                entity_type="message",
                entity_id=message.id,
                description=f"Sent outreach step {message.step_number} to {message.recipient_email} (DryRun: {dispatch_result.get('dry_run')})"
            )
            session.add(audit)

            await session.commit()
            return {
                "success": True,
                "message_id": message.id,
                "dispatch": dispatch_result,
                "status": "SENT"
            }
        else:
            message.status = "FAILED"
            mb_health.bounce_count += 1
            if mb_health.bounce_count > 3:
                mb_health.status = "WARNING"
                mb_health.health_score = max(50, mb_health.health_score - 10)
            await session.commit()
            return {
                "success": False,
                "reason": dispatch_result.get("error", "Dispatch failed"),
                "status": "FAILED"
            }

queue_worker = OutreachQueueWorker()

