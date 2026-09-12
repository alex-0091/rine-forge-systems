import logging
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.models.campaign import CampaignMember, OutreachMessage
from backend.app.models.compliance import AuditLog

logger = logging.getLogger(__name__)

FOLLOW_UP_TEMPLATES = {
    2: {
        "subject_prefix": "re: ",
        "body": "Hi {{first_name}},\n\nWanted to quickly follow up on my previous note. Did you have a chance to review the concept for {{business_name}}?\n\nHappy to share a quick 2-minute video walkthrough if you're open to exploring it.\n\nBest,\nOwais"
    },
    3: {
        "subject_prefix": "quick thought for ",
        "body": "Hi {{first_name}},\n\nFollowing up with a brief idea: for practices like {{business_name}}, capturing even 2-3 additional appointments a week from after-hours traffic typically covers the entire assistant setup.\n\nWould you be open to a 10-minute preview this week?\n\nBest,\nOwais"
    },
    4: {
        "subject_prefix": "final note for ",
        "body": "Hi {{first_name}},\n\nI realize you're likely busy managing {{business_name}}, so I won't follow up further. If 24/7 inquiry automation or custom digital systems ever become a priority down the road, feel free to reach out anytime at owais-ai.com.\n\nWishing you and {{business_name}} continued success.\n\nBest,\nOwais"
    }
}

class FollowUpScheduler:
    """
    Manages multi-touch outreach sequences and ensures instant stop upon receipt of a reply or opt-out.
    """

    async def cancel_all_pending_followups_for_member(self, session: AsyncSession, campaign_member_id: str, reason: str = "Lead Replied") -> int:
        """
        Immediately cancels all scheduled or queued future messages for a campaign member.
        """
        stmt = select(OutreachMessage).where(
            OutreachMessage.campaign_member_id == campaign_member_id,
            OutreachMessage.status.in_(["DRAFT", "APPROVED", "QUEUED", "SCHEDULED"])
        )
        res = await session.execute(stmt)
        pending_messages = res.scalars().all()
        
        count = 0
        for msg in pending_messages:
            msg.status = "CANCELLED"
            count += 1

        # Update member state
        mem_stmt = select(CampaignMember).where(CampaignMember.id == campaign_member_id)
        mem_res = await session.execute(mem_stmt)
        member = mem_res.scalars().first()
        if member:
            member.status = "STOPPED"

        audit = AuditLog(
            event_type="FOLLOWUP_CANCELLED",
            actor="followup_scheduler",
            entity_type="campaign_member",
            entity_id=campaign_member_id,
            description=f"Cancelled {count} pending follow-ups. Reason: {reason}"
        )
        session.add(audit)

        await session.commit()
        logger.info(f"🛑 Cancelled {count} pending follow-up steps for member {campaign_member_id} ({reason})")
        return count

followup_scheduler = FollowUpScheduler()
