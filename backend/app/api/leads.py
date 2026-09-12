from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, desc
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.database import get_db
from backend.app.models.business import Business, Contact, BusinessResearch
from backend.app.models.intelligence import PainPoint, AIOpportunity, LeadScore
from backend.app.models.campaign import OutreachMessage, CampaignMember
from backend.app.models.inbox import Conversation
from backend.app.schemas.schemas import LeadCreate, DiscoveryRequest, ResearchTriggerRequest
from backend.app.discovery.engine import discovery_engine
from backend.app.research.engine import research_engine
from backend.app.intelligence.pain_point_engine import pain_point_engine
from backend.app.intelligence.opportunity_scorer import opportunity_scorer
from backend.app.intelligence.lead_scorer import lead_scorer

router = APIRouter(prefix="/api/leads", tags=["Leads"])

@router.get("")
async def list_leads(
    industry: Optional[str] = None,
    country: Optional[str] = None,
    status: Optional[str] = None,
    min_score: Optional[int] = None,
    limit: int = 50,
    offset: int = 0,
    session: AsyncSession = Depends(get_db)
):
    query = select(Business).options(
        selectinload(Business.lead_score),
        selectinload(Business.contacts),
        selectinload(Business.ai_opportunities)
    ).order_by(desc(Business.created_at))

    if industry:
        query = query.where(Business.industry.ilike(f"%{industry}%"))
    if country:
        query = query.where(Business.country.ilike(f"%{country}%"))
    if status:
        query = query.where(Business.status == status)

    query = query.limit(limit).offset(offset)
    res = await session.execute(query)
    businesses = res.scalars().all()

    # Filter by score if requested
    results = []
    for b in businesses:
        score_val = b.lead_score.total_score if b.lead_score else None
        if min_score is not None and (score_val is None or score_val < min_score):
            continue
            
        primary_contact = b.contacts[0] if b.contacts else None
        top_opp = b.ai_opportunities[0] if b.ai_opportunities else None

        results.append({
            "id": b.id,
            "name": b.name,
            "industry": b.industry,
            "country": b.country,
            "city": b.city,
            "website_url": b.website_url,
            "primary_email": b.primary_email,
            "status": b.status,
            "has_booking": b.has_online_booking,
            "has_chat": b.has_live_chat,
            "detected_cms": b.detected_cms,
            "contact_name": primary_contact.full_name if primary_contact else None,
            "contact_role": primary_contact.role_title if primary_contact else None,
            "lead_score": score_val,
            "qualification_tier": b.lead_score.qualification_tier if b.lead_score else "UNSCORED",
            "top_opportunity": top_opp.solution_name if top_opp else None,
            "created_at": b.created_at.isoformat()
        })

    return {"count": len(results), "leads": results}

@router.post("/discover")
async def trigger_discovery(req: DiscoveryRequest, session: AsyncSession = Depends(get_db)):
    result = await discovery_engine.run_discovery(
        session=session,
        industry=req.industry,
        country=req.country,
        limit=req.limit
    )
    return result

@router.post("/pipeline-full-process/{business_id}")
async def process_single_lead_full_pipeline(business_id: str, session: AsyncSession = Depends(get_db)):
    """Runs research, pain point detection, AI opportunity scoring, and lead scoring in one shot."""
    stmt = select(Business).options(selectinload(Business.contacts)).where(Business.id == business_id)
    res = await session.execute(stmt)
    biz = res.scalars().first()
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found.")

    # 1. Research
    research = await research_engine.conduct_research(session=session, business=biz)
    
    # 2. Pain points
    pain_points = await pain_point_engine.analyze_pain_points(session=session, business=biz, research=research)
    
    # 3. AI Opportunities
    opportunities = await opportunity_scorer.detect_opportunities(session=session, business=biz, pain_points=pain_points)
    
    # 4. Lead Score
    score = await lead_scorer.score_lead(session=session, business=biz, pain_points=pain_points, opportunities=opportunities)

    return {
        "success": True,
        "business_id": biz.id,
        "business_name": biz.name,
        "status": biz.status,
        "total_score": score.total_score,
        "tier": score.qualification_tier,
        "pain_points_count": len(pain_points),
        "opportunities_count": len(opportunities)
    }

@router.get("/{business_id}")
async def get_lead_details(business_id: str, session: AsyncSession = Depends(get_db)):
    stmt = select(Business).options(
        selectinload(Business.contacts),
        selectinload(Business.research_records),
        selectinload(Business.pain_points),
        selectinload(Business.ai_opportunities),
        selectinload(Business.lead_score),
        selectinload(Business.campaign_memberships).selectinload(CampaignMember.messages),
        selectinload(Business.conversations).selectinload(Conversation.replies)
    ).where(Business.id == business_id)

    res = await session.execute(stmt)
    biz = res.scalars().first()
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found")

    research = biz.research_records[0] if biz.research_records else None
    
    return {
        "business": {
            "id": biz.id,
            "name": biz.name,
            "industry": biz.industry,
            "country": biz.country,
            "city": biz.city,
            "website_url": biz.website_url,
            "primary_email": biz.primary_email,
            "primary_phone": biz.primary_phone,
            "status": biz.status,
            "has_online_booking": biz.has_online_booking,
            "has_live_chat": biz.has_live_chat,
            "detected_cms": biz.detected_cms,
            "detected_booking_system": biz.detected_booking_system,
            "technology_stack": biz.technology_stack
        },
        "contacts": [{
            "id": c.id,
            "name": c.full_name,
            "role": c.role_title,
            "email": c.email,
            "is_decision_maker": c.is_decision_maker
        } for c in biz.contacts],
        "research": {
            "page_title": research.page_title if research else None,
            "meta_description": research.meta_description if research else None,
            "verified_facts": research.verified_facts if research else [],
            "faq_extracted": research.faq_extracted if research else [],
            "confidence": research.research_confidence if research else None
        } if research else None,
        "pain_points": [{
            "id": p.id,
            "observed_fact": p.observed_fact,
            "business_problem": p.business_problem,
            "severity_score": p.severity_score
        } for p in biz.pain_points],
        "ai_opportunities": [{
            "id": o.id,
            "solution_name": o.solution_name,
            "service_category": o.service_category,
            "business_benefit": o.business_benefit,
            "business_value": o.business_value,
            "feasibility": o.implementation_feasibility,
            "purchase_likelihood": o.purchase_likelihood,
            "confidence": o.confidence,
            "overall_score": o.overall_score,
            "recommended_pitch": o.recommended_pitch_angle
        } for o in biz.ai_opportunities],
        "lead_score": {
            "total_score": biz.lead_score.total_score,
            "tier": biz.lead_score.qualification_tier,
            "breakdown": biz.lead_score.score_breakdown,
            "rationale": biz.lead_score.rationale,
            "is_qualified": biz.lead_score.is_qualified_for_outreach
        } if biz.lead_score else None,
        "outreach_history": [{
            "id": m.id,
            "step": m.step_number,
            "subject": m.subject,
            "body": m.body_text,
            "quality_score": m.quality_score,
            "status": m.status,
            "sent_at": m.sent_at.isoformat() if m.sent_at else None
        } for cm in biz.campaign_memberships for m in cm.messages],
        "conversations": [{
            "id": conv.id,
            "subject": conv.subject,
            "status": conv.status,
            "requires_human_action": conv.requires_human_action,
            "reason": conv.human_action_reason,
            "replies": [{
                "id": r.id,
                "direction": r.direction,
                "sender": r.sender_email,
                "body": r.raw_body,
                "classification": r.classification,
                "intent_score": r.intent_score,
                "suggested_reply": r.suggested_reply,
                "created_at": r.created_at.isoformat()
            } for r in conv.replies]
        } for conv in biz.conversations]
    }
