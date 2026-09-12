import logging
from typing import Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.models.inbox import SystemAlert
from backend.app.models.compliance import AuditLog

logger = logging.getLogger(__name__)

class EscalationManager:
    """
    Emits alerts when a conversation requires direct action from Owais.
    """

    @classmethod
    async def trigger_escalation(
        cls,
        session: AsyncSession,
        business_name: str,
        contact_name: str,
        contact_email: str,
        message_snippet: str,
        reason: str,
        intent_score: int
    ) -> SystemAlert:
        title = f"🚨 OWAIS: HUMAN ACTION REQUIRED - {business_name}"
        msg = (
            f"High intent reply received from {contact_name} ({contact_email}) at {business_name}.\n"
            f"Intent Score: {intent_score}/100\n"
            f"Reason: {reason}\n"
            f"Prospect Message: \"{message_snippet}\""
        )

        alert = SystemAlert(
            alert_type="HIGH_INTENT_LEAD",
            severity="HIGH",
            title=title,
            message=msg,
            metadata_json={
                "business_name": business_name,
                "contact_email": contact_email,
                "intent_score": intent_score,
                "reason": reason
            }
        )
        session.add(alert)

        audit = AuditLog(
            event_type="ESCALATED_TO_OWNER",
            actor="escalation_manager",
            entity_type="alert",
            description=f"Escalated lead {business_name} ({contact_email}) to Owais. Reason: {reason}"
        )
        session.add(audit)

        await session.commit()
        await session.refresh(alert)
        logger.warning(f"🚨 EMITTED OWNER ESCALATION ALERT: {title}")
        return alert

escalation_manager = EscalationManager()
