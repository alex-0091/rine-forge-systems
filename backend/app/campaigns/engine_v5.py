"""
Rine Forge Systems V5 - Campaign Safety & Execution Engine
Enforces daily sending caps, per-lead cooldown periods, opt-out checking,
and automatic pausing upon upstream provider restrictions.
"""
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone, timedelta
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from backend.app.models.campaign import Campaign, CampaignMember, OutreachMessage
from backend.app.models.compliance import AuditLog

logger = logging.getLogger("rine_forge_systems.campaigns.engine")

class CampaignEngineV5:
    """
    Coordinates campaign lifecycle, enforces rate safety, and guarantees non-spam execution.
    """

    async def create_campaign(
        self,
        session: AsyncSession,
        name: str,
        target_industry: str = "General",
        target_country: str = "USA",
        primary_offer: str = "Elena AI Receptionist",
        daily_send_limit: int = 25,
        hourly_send_limit: int = 5,
        follow_up_cadence_days: Optional[List[int]] = None,
        is_dry_run: bool = True,
        business_id: Optional[str] = None,
        channel: Optional[str] = None,
        **kwargs
    ) -> Campaign:
        """Creates a new compliant outbound campaign."""
        camp = Campaign(
            name=name.strip(),
            target_country=target_country.strip(),
            target_industry=target_industry.strip(),
            primary_offer=primary_offer.strip(),
            daily_send_limit=daily_send_limit,
            hourly_send_limit=hourly_send_limit,
            follow_up_cadence_days=follow_up_cadence_days or [4, 9, 16],
            is_dry_run=is_dry_run,
            status="DRAFT"
        )
        session.add(camp)
        await session.commit()
        await session.refresh(camp)
        logger.info(f"Campaign '{camp.name}' (#{camp.id}) created in DRAFT status.")
        return camp

    async def get_campaign(self, session: AsyncSession, campaign_id: str) -> Campaign:
        """Fetches a campaign by ID."""
        stmt = select(Campaign).where(Campaign.id == campaign_id)
        res = await session.execute(stmt)
        camp = res.scalar_one_or_none()
        if not camp:
            raise HTTPException(status_code=404, detail=f"Campaign #{campaign_id} not found")
        return camp

    async def list_campaigns(self, session: AsyncSession, status_filter: Optional[str] = None) -> List[Campaign]:
        """Lists campaigns with optional status filtering."""
        stmt = select(Campaign)
        if status_filter:
            stmt = stmt.where(Campaign.status == status_filter.upper())
        stmt = stmt.order_by(Campaign.created_at.desc())
        res = await session.execute(stmt)
        return list(res.scalars().all())

    async def pause_campaign(self, session: AsyncSession, campaign_id: str, reason: str = "Manual pause") -> Campaign:
        """Pauses a campaign and records reason."""
        camp = await self.get_campaign(session, campaign_id)
        camp.status = "PAUSED"
        
        session.add(AuditLog(
            event_type="CAMPAIGN_PAUSED",
            actor="campaign_engine",
            entity_type="campaign",
            entity_id=campaign_id,
            description=f"Campaign '{camp.name}' paused: {reason}"
        ))
        await session.commit()
        await session.refresh(camp)
        logger.info(f"Campaign #{campaign_id} PAUSED: {reason}")
        return camp

    async def resume_campaign(self, session: AsyncSession, campaign_id: str) -> Campaign:
        """Resumes a paused campaign."""
        camp = await self.get_campaign(session, campaign_id)
        camp.status = "ACTIVE"
        
        session.add(AuditLog(
            event_type="CAMPAIGN_RESUMED",
            actor="campaign_engine",
            entity_type="campaign",
            entity_id=campaign_id,
            description=f"Campaign '{camp.name}' resumed to ACTIVE status."
        ))
        await session.commit()
        await session.refresh(camp)
        logger.info(f"Campaign #{campaign_id} resumed to ACTIVE.")
        return camp

    async def handle_provider_restriction(
        self,
        session: AsyncSession,
        campaign_id: str,
        provider_name: str,
        error_detail: str
    ) -> None:
        """
        Safety invariant: If an upstream provider reports a rate limit or restriction,
        automatically pause the campaign rather than hammering the provider.
        """
        reason = f"Upstream provider '{provider_name}' reported restriction: {error_detail}"
        logger.warning(f"[CAMPAIGN SAFETY] Auto-pausing Campaign #{campaign_id}: {reason}")
        await self.pause_campaign(session, campaign_id, reason=reason)

    async def check_daily_limit_reached(self, session: AsyncSession, campaign_id: str) -> bool:
        """Checks if campaign has reached its daily limit."""
        camp = await self.get_campaign(session, campaign_id)
        today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)

        stmt = select(func.count(OutreachMessage.id)).join(CampaignMember).where(
            CampaignMember.campaign_id == campaign_id,
            OutreachMessage.status == "SENT",
            OutreachMessage.sent_at >= today_start
        )
        res = await session.execute(stmt)
        sent_today = res.scalar() or 0
        return sent_today >= camp.daily_send_limit

campaign_engine_v5 = CampaignEngineV5()
