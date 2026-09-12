import logging
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.models.business import Business
from backend.app.models.intelligence import PainPoint, AIOpportunity

logger = logging.getLogger(__name__)

class AIOpportunityScorer:
    """
    Evaluates concrete AI / automation opportunities:
    - business_value (0-100)
    - implementation_feasibility (0-100)
    - purchase_likelihood (0-100)
    - confidence (0-100)
    - overall_score (weighted composite)
    """

    async def detect_opportunities(self, session: AsyncSession, business: Business, pain_points: List[PainPoint]) -> List[AIOpportunity]:
        opportunities = []
        ind_lower = business.industry.lower()

        # Tailor based on industry & detected pain points
        if ind_lower in ["dental", "healthcare", "medical", "clinic"]:
            opp = AIOpportunity(
                business_id=business.id,
                solution_name="AI Patient Receptionist & 24/7 Booking Assistant",
                service_category="AI Receptionists",
                pain_point_addressed="After-hours patient questions & appointment intake",
                business_benefit="Captures evening/weekend patient bookings and answers common insurance/procedure FAQs automatically.",
                business_value=92,
                implementation_feasibility=95,
                purchase_likelihood=86,
                confidence=90,
                overall_score=91.0,
                recommended_pitch_angle="How a customized 24/7 AI receptionist could capture after-hours patient inquiries without extra front-desk overhead."
            )
            opportunities.append(opp)
            session.add(opp)

        elif ind_lower in ["hotel", "hospitality", "resort"]:
            opp = AIOpportunity(
                business_id=business.id,
                solution_name="AI Hotel Concierge & Direct Reservation Assistant",
                service_category="AI Receptionists",
                pain_point_addressed="Multilingual international guest inquiries & direct booking optimization",
                business_benefit="Pre-answers amenity/room FAQs instantly in multiple languages and drives higher margin direct bookings.",
                business_value=94,
                implementation_feasibility=90,
                purchase_likelihood=88,
                confidence=92,
                overall_score=91.5,
                recommended_pitch_angle="A multilingual AI concierge to handle guest questions 24/7 and boost direct booking conversion."
            )
            opportunities.append(opp)
            session.add(opp)

        elif ind_lower in ["real estate", "property management"]:
            opp = AIOpportunity(
                business_id=business.id,
                solution_name="AI Property Navigator & Buyer Lead Qualifier",
                service_category="AI Lead Qualification",
                pain_point_addressed="High inquiry volume with low qualification speed for luxury listings",
                business_benefit="Instantly qualifies prospective buyers by budget and timeline, scheduling viewing tours automatically.",
                business_value=90,
                implementation_feasibility=94,
                purchase_likelihood=84,
                confidence=89,
                overall_score=89.5,
                recommended_pitch_angle="Conversational AI qualification that routes serious buyers directly to broker calendars."
            )
            opportunities.append(opp)
            session.add(opp)

        elif ind_lower in ["private school", "school", "academy", "education"]:
            opp = AIOpportunity(
                business_id=business.id,
                solution_name="AI Admissions Navigator & Campus Tour Scheduler",
                service_category="AI Receptionists",
                pain_point_addressed="Repetitive admissions inquiries & campus tour scheduling bottlenecks",
                business_benefit="Guides parents through grade requirements and books school tours into admissions calendars 24/7.",
                business_value=88,
                implementation_feasibility=95,
                purchase_likelihood=82,
                confidence=88,
                overall_score=88.5,
                recommended_pitch_angle="An interactive admissions assistant that answers parent queries and books campus tours around the clock."
            )
            opportunities.append(opp)
            session.add(opp)

        else: # Default Professional Services / Trade (Law, HVAC, Accounting, Construction, etc.)
            opp = AIOpportunity(
                business_id=business.id,
                solution_name=f"AI Client Intake & {business.industry} Lead Assistant",
                service_category="AI Lead Qualification",
                pain_point_addressed="Delayed response to high-intent web inquiries",
                business_benefit="Pre-screens customer project scope and books consultations directly into dispatch/owner calendar.",
                business_value=89,
                implementation_feasibility=92,
                purchase_likelihood=80,
                confidence=85,
                overall_score=87.0,
                recommended_pitch_angle=f"Automating instant qualification and consultation scheduling for {business.industry} clients."
            )
            opportunities.append(opp)
            session.add(opp)

        await session.commit()
        return opportunities

opportunity_scorer = AIOpportunityScorer()
