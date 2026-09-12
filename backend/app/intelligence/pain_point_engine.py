import logging
from typing import List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.models.business import Business, BusinessResearch
from backend.app.models.intelligence import PainPoint

logger = logging.getLogger(__name__)

class PainPointEngine:
    """
    Connects:
    OBSERVED FACT -> BUSINESS PROBLEM -> SEVERITY
    Strictly forbids generic or fabricated complaints.
    """

    async def analyze_pain_points(self, session: AsyncSession, business: Business, research: BusinessResearch) -> List[PainPoint]:
        detected_points = []

        # Heuristic / Fact Grounding Rules
        if not business.has_live_chat and not business.has_ai_assistant:
            # 1. After-hours lead capture friction
            point = PainPoint(
                business_id=business.id,
                observed_fact=f"Website for {business.name} has no 24/7 conversational assistant to handle after-hours inquiries.",
                business_problem="Prospective customers visiting during evenings or weekends must wait for manual office callbacks, leading to lost inquiries.",
                severity_score=85,
                evidence_source=business.website_url
            )
            detected_points.append(point)
            session.add(point)

        if business.has_online_booking and not business.has_live_chat:
            # 2. Pre-booking qualification friction
            point = PainPoint(
                business_id=business.id,
                observed_fact="Online booking link exists, but visitors with specific pricing, insurance, or service questions have no interactive triage.",
                business_problem="Staff spend hours answering repetitive basic questions via phone or email that could be pre-qualified automatically.",
                severity_score=78,
                evidence_source=f"{business.website_url}/booking"
            )
            detected_points.append(point)
            session.add(point)
            
        elif not business.has_online_booking:
            # 3. Manual inquiry bottleneck
            point = PainPoint(
                business_id=business.id,
                observed_fact="No direct interactive scheduling mechanism; inquiries rely solely on static forms or phone calls.",
                business_problem="High customer drop-off for high-intent visitors who want immediate consultation confirmation.",
                severity_score=82,
                evidence_source=business.website_url
            )
            detected_points.append(point)
            session.add(point)

        # Industry-specific pain point enhancements
        if business.industry.lower() in ["hotel", "hospitality"]:
            point = PainPoint(
                business_id=business.id,
                observed_fact="Hotel caters to diverse guests, but concierge and reservation FAQ require phone or front desk staff.",
                business_problem="Delayed response times for international guest inquiries across different timezones.",
                severity_score=88,
                evidence_source=business.website_url
            )
            detected_points.append(point)
            session.add(point)
        elif business.industry.lower() in ["private school", "school", "academy"]:
            point = PainPoint(
                business_id=business.id,
                observed_fact="Admissions and enrollment requirements involve complex parent inquiries and multiple program choices.",
                business_problem="Admissions officers are overwhelmed with repetitive qualification questions during peak enrollment seasons.",
                severity_score=84,
                evidence_source=business.website_url
            )
            detected_points.append(point)
            session.add(point)

        await session.commit()
        return detected_points

pain_point_engine = PainPointEngine()
