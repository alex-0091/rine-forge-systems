from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, desc
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.database import get_db
from backend.app.models.campaign import Campaign, CampaignMember, OutreachMessage
from backend.app.models.business import Business, Contact
from backend.app.models.intelligence import LeadScore, PainPoint, AIOpportunity
from backend.app.schemas.schemas import CampaignCreate
from backend.app.compliance.country_policies import get_country_policy
from backend.app.ai.pipeline import outreach_pipeline
from backend.app.kill_switch import kill_switch

router = APIRouter(prefix="/api/campaigns", tags=["Campaigns"])

@router.get("")
async def list_campaigns(session: AsyncSession = Depends(get_db)):
    stmt = select(Campaign).options(
        selectinload(Campaign.members).selectinload(CampaignMember.messages)
    ).order_by(desc(Campaign.created_at))
    res = await session.execute(stmt)
    campaigns = res.scalars().all()

    results = []
    for c in campaigns:
        total_members = len(c.members)
        sent_count = sum(1 for m in c.members for msg in m.messages if msg.status == "SENT")
        replied_count = sum(1 for m in c.members if m.status == "REPLIED")

        results.append({
            "id": c.id,
            "name": c.name,
            "target_country": c.target_country,
            "target_industry": c.target_industry,
            "min_lead_score": c.min_lead_score,
            "primary_offer": c.primary_offer,
            "daily_send_limit": c.daily_send_limit,
            "is_dry_run": c.is_dry_run,
            "status": c.status,
            "members_count": total_members,
            "messages_sent": sent_count,
            "replied_count": replied_count,
            "created_at": c.created_at.isoformat()
        })
    return results

@router.post("")
async def create_campaign(req: CampaignCreate, session: AsyncSession = Depends(get_db)):
    # Check country policy
    policy = get_country_policy(req.target_country)
    
    camp = Campaign(
        name=req.name,
        target_country=req.target_country,
        target_industry=req.target_industry,
        min_lead_score=req.min_lead_score,
        primary_offer=req.primary_offer,
        daily_send_limit=req.daily_send_limit,
        hourly_send_limit=req.hourly_send_limit,
        is_dry_run=req.is_dry_run,
        follow_up_cadence_days=req.follow_up_cadence_days,
        status="ACTIVE" if policy.ALLOWED_FOR_COLD_B2B else "PAUSED"
    )
    session.add(camp)
    await session.commit()
    await session.refresh(camp)

    # Auto-enroll matching qualified leads
    lead_stmt = select(Business).join(LeadScore).where(
        Business.country.ilike(f"%{req.target_country}%"),
        Business.industry.ilike(f"%{req.target_industry}%"),
        LeadScore.total_score >= req.min_lead_score,
        Business.status.in_(["QUALIFIED", "RESEARCHED", "DISCOVERED"])
    ).options(
        selectinload(Business.contacts),
        selectinload(Business.pain_points),
        selectinload(Business.ai_opportunities)
    )

    lead_res = await session.execute(lead_stmt)
    matching_leads = lead_res.scalars().all()

    enrolled = 0
    for biz in matching_leads:
        member = CampaignMember(
            campaign_id=camp.id,
            business_id=biz.id,
            contact_id=biz.contacts[0].id if biz.contacts else None,
            status="QUEUED"
        )
        session.add(member)
        await session.flush()

        # Generate outreach draft immediately
        contact = biz.contacts[0] if biz.contacts else None
        pain = biz.pain_points[0] if biz.pain_points else None
        opp = biz.ai_opportunities[0] if biz.ai_opportunities else None

        msg, gen_meta = await outreach_pipeline.generate_message_for_lead(
            session=session,
            campaign_member=member,
            business=biz,
            contact=contact,
            pain_point=pain,
            opportunity=opp,
            is_dry_run=camp.is_dry_run
        )
        enrolled += 1

    await session.commit()

    return {
        "id": camp.id,
        "name": camp.name,
        "status": camp.status,
        "enrolled_leads": enrolled,
        "is_dry_run": camp.is_dry_run,
        "policy_allowed": policy.ALLOWED_FOR_COLD_B2B,
        "policy_note": "Activated" if policy.ALLOWED_FOR_COLD_B2B else f"Paused pending {req.target_country} compliance review"
    }

@router.post("/{campaign_id}/toggle-status")
async def toggle_campaign_status(campaign_id: str, session: AsyncSession = Depends(get_db)):
    stmt = select(Campaign).where(Campaign.id == campaign_id)
    res = await session.execute(stmt)
    camp = res.scalars().first()
    if not camp:
        raise HTTPException(status_code=404, detail="Campaign not found")

    new_status = "PAUSED" if camp.status == "ACTIVE" else "ACTIVE"
    
    # Check compliance if activating
    if new_status == "ACTIVE":
        policy = get_country_policy(camp.target_country)
        if not policy.ALLOWED_FOR_COLD_B2B:
            raise HTTPException(
                status_code=400,
                detail=f"Cannot activate campaign for {camp.target_country}: Country policy requires manual compliance approval."
            )

    camp.status = new_status
    await session.commit()
    return {"id": camp.id, "status": camp.status}
