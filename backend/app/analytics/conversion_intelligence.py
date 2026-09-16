"""
Rine Forge Systems V5 - Conversion Intelligence & Quality Protection (Module 51)
Calculates real-time pipeline funnel metrics, deliverability health,
approval velocity, and automated circuit breakers for bounce/opt-out rates.
"""
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone, timedelta
from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.models.v5 import (
    V5Prospect,
    V5ProspectOutreach,
    V5OutreachEvent,
    V5SuppressionEntry
)

logger = logging.getLogger(__name__)

class ConversionIntelligenceService:
    """
    Authoritative analytics and deliverability watchdog for Rine Forge Lead Engine.
    """

    MAX_BOUNCE_RATE_THRESHOLD = 0.02 # 2% max
    MAX_OPTOUT_RATE_THRESHOLD = 0.01 # 1% max

    async def get_dashboard_metrics(
        self,
        session: AsyncSession,
        business_id: str,
        timeframe_days: int = 30
    ) -> Dict[str, Any]:
        """
        Computes comprehensive discovery, outreach, response, conversion,
        and deliverability health metrics.
        """
        since_date = datetime.now(timezone.utc) - timedelta(days=timeframe_days)

        # 1. DISCOVERY METRICS
        prospects_stmt = select(V5Prospect).where(
            V5Prospect.business_id == business_id,
            V5Prospect.created_at >= since_date
        )
        p_res = await session.execute(prospects_stmt)
        prospects = p_res.scalars().all()

        total_discovered = len(prospects)
        verified_contacts = len([p for p in prospects if p.email or p.phone])
        verification_rate = (verified_contacts / total_discovered) if total_discovered > 0 else 0.0
        avg_score = (sum(p.score for p in prospects) / total_discovered) if total_discovered > 0 else 0.0

        by_source: Dict[str, int] = {}
        by_stage: Dict[str, int] = {
            "DISCOVERED": 0, "REVIEW": 0, "CONTACTED": 0, "RESPONDED": 0,
            "INTERESTED": 0, "APPOINTMENT": 0, "CONVERTED": 0,
            "DISQUALIFIED": 0, "NO_RESPONSE": 0, "OPTED_OUT": 0
        }
        for p in prospects:
            by_source[p.source] = by_source.get(p.source, 0) + 1
            if p.pipeline_stage in by_stage:
                by_stage[p.pipeline_stage] += 1
            else:
                by_stage[p.pipeline_stage] = 1

        # 2. OUTREACH METRICS
        outreach_stmt = select(V5ProspectOutreach).where(
            V5ProspectOutreach.business_id == business_id,
            V5ProspectOutreach.created_at >= since_date
        )
        o_res = await session.execute(outreach_stmt)
        messages = o_res.scalars().all()

        total_messages = len(messages)
        sent_messages = len([m for m in messages if m.status in ["SENT", "DELIVERED", "OPENED", "REPLIED"]])
        approved_messages = len([m for m in messages if m.status in ["APPROVED", "SENT", "DELIVERED", "OPENED", "REPLIED"]])
        rejected_messages = len([m for m in messages if m.status == "REJECTED"])
        reviewed_total = approved_messages + rejected_messages
        approval_rate = (approved_messages / reviewed_total) if reviewed_total > 0 else 1.0

        opened_messages = len([m for m in messages if m.status in ["OPENED", "REPLIED"]])
        replied_messages = len([m for m in messages if m.status == "REPLIED"])
        bounced_messages = len([m for m in messages if m.status == "BOUNCED"])
        opted_out_prospects = len([p for p in prospects if p.outreach_status == "OPTED_OUT"])

        delivery_rate = ((sent_messages - bounced_messages) / sent_messages) if sent_messages > 0 else 1.0
        open_rate = (opened_messages / sent_messages) if sent_messages > 0 else 0.0
        reply_rate = (replied_messages / sent_messages) if sent_messages > 0 else 0.0
        bounce_rate = (bounced_messages / sent_messages) if sent_messages > 0 else 0.0
        optout_rate = (opted_out_prospects / sent_messages) if sent_messages > 0 else 0.0

        # 3. QUALITY & DELIVERABILITY CIRCUIT BREAKERS
        alerts = []
        is_paused = False

        if bounce_rate > self.MAX_BOUNCE_RATE_THRESHOLD:
            is_paused = True
            alerts.append({
                "severity": "CRITICAL",
                "code": "HIGH_BOUNCE_RATE",
                "message": f"Bounce rate ({bounce_rate:.1%}) exceeds safety threshold (2.0%). Outbound sending is paused to protect sender reputation."
            })

        if optout_rate > self.MAX_OPTOUT_RATE_THRESHOLD:
            is_paused = True
            alerts.append({
                "severity": "CRITICAL",
                "code": "HIGH_OPTOUT_RATE",
                "message": f"Opt-out rate ({optout_rate:.1%}) exceeds limit (1.0%). Review messaging resonance."
            })

        # 4. CONVERSIONS
        demos_booked = by_stage.get("APPOINTMENT", 0) + by_stage.get("CONVERTED", 0)
        clients_acquired = by_stage.get("CONVERTED", 0)
        est_revenue = clients_acquired * 497.0 # $497/mo base plan

        return {
            "timeframe_days": timeframe_days,
            "status": "PAUSED" if is_paused else "HEALTHY",
            "discovery": {
                "total_discovered": total_discovered,
                "verified_contacts": verified_contacts,
                "verification_rate": round(verification_rate, 4),
                "avg_lead_score": round(avg_score, 1),
                "by_source": by_source,
                "by_stage": by_stage
            },
            "outreach": {
                "total_drafted": total_messages,
                "sent_count": sent_messages,
                "review_approval_rate": round(approval_rate, 4),
                "delivery_rate": round(delivery_rate, 4),
                "open_rate": round(open_rate, 4),
                "reply_rate": round(reply_rate, 4),
                "bounce_rate": round(bounce_rate, 4),
                "optout_rate": round(optout_rate, 4)
            },
            "conversions": {
                "interested_count": by_stage.get("INTERESTED", 0),
                "demos_booked": demos_booked,
                "clients_acquired": clients_acquired,
                "projected_monthly_revenue": est_revenue
            },
            "circuit_breakers": {
                "sending_paused": is_paused,
                "active_alerts": alerts
            }
        }

conversion_intelligence = ConversionIntelligenceService()
