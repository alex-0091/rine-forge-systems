import logging
from typing import Optional, Dict, Any
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.models.v5 import Lead, Customer, Service

logger = logging.getLogger("rine_forge_systems.leads.engine")

class LeadEngine:
    """
    Authoritative Lead Qualification & Scoring Engine.
    Evaluates customer intent, urgency, and purchasing power to assign
    a deterministic 0–100 lead score.
    """

    async def process_and_score_lead(
        self,
        session: AsyncSession,
        business_id: str,
        customer_id: str,
        message: str,
        intent: str,
        service_id: Optional[str] = None,
        source: str = "website_chat"
    ) -> Lead:
        msg_lower = message.lower()

        # 1. Base score by intent
        score = 30
        if intent in ["BOOK_APPOINTMENT", "RESCHEDULE_APPOINTMENT"]:
            score += 40
        elif intent in ["PRICE_INQUIRY", "SERVICES_INQUIRY"]:
            score += 25
        elif intent in ["HOURS_INQUIRY", "LOCATION_INQUIRY"]:
            score += 15

        # 2. Urgency signals
        urgent_keywords = ["urgent", "emergency", "today", "tomorrow", "asap", "pain", "now", "immediately"]
        is_urgent = any(w in msg_lower for w in urgent_keywords)
        if is_urgent:
            score += 20
        urgency = "HIGH" if is_urgent else ("MEDIUM" if score >= 50 else "LOW")

        # 3. Estimated customer value from service catalog
        estimated_value = 150.0 # Default benchmark
        if service_id:
            stmt_svc = select(Service).where(Service.id == service_id, Service.business_id == business_id)
            res_svc = await session.execute(stmt_svc)
            svc = res_svc.scalar_one_or_none()
            if svc and svc.price > 0:
                estimated_value = svc.price
                score += 10

        # Bound score between 0 and 100
        final_score = max(5, min(99, score))

        # 4. Check if lead record exists for customer
        stmt_lead = select(Lead).where(
            Lead.business_id == business_id,
            Lead.customer_id == customer_id
        )
        res_lead = await session.execute(stmt_lead)
        lead = res_lead.scalar_one_or_none()

        if not lead:
            lead = Lead(
                business_id=business_id,
                customer_id=customer_id,
                source=source,
                status="NEW" if final_score < 70 else "QUALIFIED",
                score=final_score,
                urgency=urgency,
                intent=intent,
                value=estimated_value,
                notes=f"Auto-scored by AI Lead Engine based on intent '{intent}'."
            )
            session.add(lead)
        else:
            # Update lead score if increased
            if final_score > lead.score:
                lead.score = final_score
            lead.urgency = urgency
            lead.intent = intent
            if estimated_value > lead.value:
                lead.value = estimated_value
            if final_score >= 70 and lead.status == "NEW":
                lead.status = "QUALIFIED"

        await session.commit()
        await session.refresh(lead)
        logger.info(f"Lead #{lead.id} updated: score {lead.score}/100, status {lead.status}")
        return lead

lead_engine = LeadEngine()
