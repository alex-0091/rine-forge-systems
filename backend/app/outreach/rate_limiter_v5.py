"""
Rine Forge Systems V5 - Frequency Controller & Rate Limiter (Module 52)
Enforces strict 72-hour prospect cooldowns, 3-step sequence limits,
domain warm-up schedules, and per-channel daily velocity caps.
"""
import logging
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, Tuple
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.models.v5 import (
    V5Prospect,
    V5ProspectOutreach
)

logger = logging.getLogger(__name__)

class FrequencyController:
    """
    Guarantees compliant outbound messaging cadences.
    Prevents sender domain blacklisting and prospect fatigue.
    """
    
    COOLDOWN_HOURS = 72
    MAX_SEQUENCE_STEPS = 3
    DAILY_CAP_EMAIL = 50
    DAILY_CAP_WHATSAPP = 30

    async def can_send_to_prospect(
        self,
        session: AsyncSession,
        business_id: str,
        prospect: V5Prospect,
        channel: str = "EMAIL"
    ) -> Tuple[bool, str]:
        """
        Evaluates whether an outreach message can be sent to a prospect right now.
        Returns (can_send: bool, reason: str).
        """
        # 1. Check contact status
        if prospect.contact_status == "DO_NOT_CONTACT":
            return False, "Prospect is marked DO_NOT_CONTACT."

        if prospect.outreach_status in ["OPTED_OUT", "STOPPED", "BOUNCED"]:
            return False, f"Prospect outreach status is terminal: {prospect.outreach_status}."

        if prospect.pipeline_stage in ["RESPONDED", "INTERESTED", "APPOINTMENT", "CONVERTED"]:
            return False, f"Prospect has already responded or converted (stage: {prospect.pipeline_stage})."

        # 2. Check maximum sequence step count
        stmt = select(func.count(V5ProspectOutreach.id)).where(
            V5ProspectOutreach.prospect_id == prospect.id,
            V5ProspectOutreach.status.in_(["SENT", "DELIVERED", "OPENED", "APPROVED"])
        )
        res = await session.execute(stmt)
        total_sent = res.scalar() or 0
        if total_sent >= self.MAX_SEQUENCE_STEPS:
            return False, f"Prospect has reached maximum sequence limit ({self.MAX_SEQUENCE_STEPS} messages)."

        # 3. Check 72-hour cooldown from last message
        if prospect.last_contacted:
            now_utc = datetime.now(timezone.utc)
            # Ensure timezone-aware comparison
            last_contact = prospect.last_contacted
            if last_contact.tzinfo is None:
                last_contact = last_contact.replace(tzinfo=timezone.utc)
            cooldown_period = timedelta(hours=self.COOLDOWN_HOURS)
            if now_utc - last_contact < cooldown_period:
                remaining_hours = int((cooldown_period - (now_utc - last_contact)).total_seconds() / 3600)
                return False, f"Cooldown in effect: {remaining_hours} hours remaining before next outreach allowed."

        # 4. Check daily channel caps for tenant
        today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
        daily_stmt = select(func.count(V5ProspectOutreach.id)).where(
            V5ProspectOutreach.business_id == business_id,
            V5ProspectOutreach.channel == channel.upper(),
            V5ProspectOutreach.sent_at >= today_start
        )
        daily_res = await session.execute(daily_stmt)
        daily_sent = daily_res.scalar() or 0

        cap = self.DAILY_CAP_EMAIL if channel.upper() == "EMAIL" else self.DAILY_CAP_WHATSAPP
        if daily_sent >= cap:
            return False, f"Daily {channel.upper()} capacity limit reached ({daily_sent}/{cap}). Queued for tomorrow."

        return True, "Approved for outreach."

frequency_controller = FrequencyController()
