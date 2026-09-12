import logging
from typing import List, Dict, Any, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.config import settings
from backend.app.models.business import Business, Contact
from backend.app.models.intelligence import PainPoint, AIOpportunity, LeadScore
from backend.app.models.compliance import AuditLog

logger = logging.getLogger(__name__)

TIER_1_INDUSTRIES = [
    "dental", "dentist", "real estate", "hotel", "hospitality", "law firm", "legal", 
    "accounting", "accountant", "construction", "hvac", "plumbing", "electrical", "private school", "academy"
]

class LeadScorer:
    """
    Weighted 0-100 Lead Scoring Engine:
    - Business Fit (20%)
    - Clear Pain Point (20%)
    - AI Opportunity (20%)
    - Ability to Pay (15%)
    - Decision Maker Identified (10%)
    - Online Presence (10%)
    - Research Confidence (5%)
    """

    async def score_lead(
        self,
        session: AsyncSession,
        business: Business,
        pain_points: List[PainPoint],
        opportunities: List[AIOpportunity]
    ) -> LeadScore:
        ind_clean = business.industry.lower()
        
        # 1. Business Fit (0-20)
        is_tier_1 = any(t in ind_clean for t in TIER_1_INDUSTRIES)
        score_fit = 20 if is_tier_1 else 14

        # 2. Clear Pain Point (0-20)
        if pain_points:
            max_severity = max(p.severity_score for p in pain_points)
            score_pain = int((max_severity / 100.0) * 20)
        else:
            score_pain = 8

        # 3. AI Opportunity (0-20)
        if opportunities:
            max_opp_score = max(o.overall_score for o in opportunities)
            score_opp = int((max_opp_score / 100.0) * 20)
        else:
            score_opp = 10

        # 4. Ability to Pay (0-15)
        # Established commercial signals (physical location, booking system, phone, domain)
        score_pay = 10
        if business.website_url:
            score_pay += 2
        if business.city and business.country:
            score_pay += 2
        if business.has_online_booking:
            score_pay += 1
        score_pay = min(15, score_pay)

        # 5. Decision Maker Identified (0-10)
        # Check contacts
        stmt = select(Contact).where(Contact.business_id == business.id, Contact.is_decision_maker == True)
        res = await session.execute(stmt)
        has_decision_maker = res.scalars().first() is not None
        score_dm = 10 if has_decision_maker else 4

        # 6. Online Presence (0-10)
        score_presence = 8
        if business.website_url:
            score_presence += 1
        if business.technology_stack:
            score_presence += 1
        score_presence = min(10, score_presence)

        # 7. Research Confidence (0-5)
        score_conf = 5 if (business.website_url and len(pain_points) > 0) else 3

        total = score_fit + score_pain + score_opp + score_pay + score_dm + score_presence + score_conf
        total = max(0, min(100, total))

        # Qualification tier
        if total >= 90:
            tier = "VERY_HIGH_PRIORITY"
        elif total >= 75:
            tier = "HIGH_PRIORITY"
        elif total >= 60:
            tier = "NORMAL"
        elif total >= 40:
            tier = "LOW_PRIORITY"
        else:
            tier = "DO_NOT_CONTACT"

        is_qualified = total >= settings.DEFAULT_LEAD_THRESHOLD

        breakdown = {
            "business_fit": score_fit,
            "clear_pain_point": score_pain,
            "ai_opportunity": score_opp,
            "ability_to_pay": score_pay,
            "decision_maker": score_dm,
            "online_presence": score_presence,
            "research_confidence": score_conf
        }

        # Save or update LeadScore
        existing_stmt = select(LeadScore).where(LeadScore.business_id == business.id)
        existing_res = await session.execute(existing_stmt)
        lead_score = existing_res.scalars().first()

        rationale = f"Evaluated {business.name} in {business.industry} ({tier}). Grounded pain point severity: {score_pain}/20, AI Opportunity score: {score_opp}/20."

        if lead_score:
            lead_score.total_score = total
            lead_score.qualification_tier = tier
            lead_score.score_breakdown = breakdown
            lead_score.rationale = rationale
            lead_score.is_qualified_for_outreach = is_qualified
        else:
            lead_score = LeadScore(
                business_id=business.id,
                total_score=total,
                qualification_tier=tier,
                score_breakdown=breakdown,
                rationale=rationale,
                is_qualified_for_outreach=is_qualified
            )
            session.add(lead_score)

        if is_qualified:
            business.status = "QUALIFIED"

        audit = AuditLog(
            event_type="LEAD_SCORED",
            actor="lead_scorer",
            entity_type="business",
            entity_id=business.id,
            description=f"Scored {business.name}: {total}/100 ({tier}, Qualified: {is_qualified})"
        )
        session.add(audit)

        await session.commit()
        await session.refresh(lead_score)
        return lead_score

lead_scorer = LeadScorer()
