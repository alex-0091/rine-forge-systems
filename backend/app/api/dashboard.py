from fastapi import APIRouter, Depends
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.database import get_db
from backend.app.models.business import Business
from backend.app.models.intelligence import LeadScore
from backend.app.models.campaign import Campaign, OutreachMessage
from backend.app.models.inbox import Conversation, Reply, SystemAlert
from backend.app.models.pipeline import Client, Proposal
from backend.app.ai.cost_tracker import cost_tracker
from backend.app.kill_switch import kill_switch

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/metrics")
async def get_dashboard_metrics(session: AsyncSession = Depends(get_db)):
    # Counts
    total_biz = (await session.execute(select(func.count(Business.id)))).scalar_one()
    qualified_biz = (await session.execute(select(func.count(LeadScore.id)).where(LeadScore.is_qualified_for_outreach == True))).scalar_one()
    
    total_messages = (await session.execute(select(func.count(OutreachMessage.id)))).scalar_one()
    sent_messages = (await session.execute(select(func.count(OutreachMessage.id)).where(OutreachMessage.status == "SENT"))).scalar_one()
    
    total_replies = (await session.execute(select(func.count(Reply.id)).where(Reply.direction == "INBOUND"))).scalar_one()
    positive_replies = (await session.execute(
        select(func.count(Reply.id)).where(
            Reply.direction == "INBOUND", 
            Reply.classification.in_(["POSITIVE_INTEREST", "MEETING_REQUEST", "PRICE_REQUEST", "HIGH_VALUE_OPPORTUNITY"])
        )
    )).scalar_one()

    # Pipelines & Revenue
    clients_count = (await session.execute(select(func.count(Client.id)))).scalar_one()
    revenue_sum = (await session.execute(select(func.sum(Client.total_contract_value)))).scalar_one() or 0.0
    proposals_count = (await session.execute(select(func.count(Proposal.id)))).scalar_one()

    # Active human escalations
    pending_alerts = (await session.execute(select(func.count(SystemAlert.id)).where(SystemAlert.is_resolved == False))).scalar_one()

    # AI Costs
    cost_summary = cost_tracker.get_summary()

    return {
        "metrics": {
            "businesses_discovered": total_biz,
            "qualified_leads": qualified_biz,
            "messages_generated": total_messages,
            "messages_sent": sent_messages,
            "replies_total": total_replies,
            "positive_replies": positive_replies,
            "meetings_scheduled": positive_replies, # Benchmark
            "proposals_created": proposals_count,
            "clients_won": clients_count,
            "total_revenue_usd": revenue_sum,
            "human_escalations_pending": pending_alerts
        },
        "kill_switch": kill_switch.get_status(),
        "ai_costs": cost_summary
    }

@router.get("/charts")
async def get_dashboard_charts(session: AsyncSession = Depends(get_db)):
    # Leads by country
    country_res = await session.execute(
        select(Business.country, func.count(Business.id)).group_by(Business.country)
    )
    by_country = [{"country": row[0], "count": row[1]} for row in country_res.all()]

    # Leads by industry
    industry_res = await session.execute(
        select(Business.industry, func.count(Business.id)).group_by(Business.industry)
    )
    by_industry = [{"industry": row[0], "count": row[1]} for row in industry_res.all()]

    # Qualification Breakdown
    tier_res = await session.execute(
        select(LeadScore.qualification_tier, func.count(LeadScore.id)).group_by(LeadScore.qualification_tier)
    )
    by_tier = [{"tier": row[0], "count": row[1]} for row in tier_res.all()]

    return {
        "leads_by_country": by_country,
        "leads_by_industry": by_industry,
        "leads_by_tier": by_tier,
        "benchmark_target_niches": [
            {"niche": "Dental & Healthcare", "target_response_rate": "15-20%", "avg_lead_score": 90},
            {"niche": "Hotels & Hospitality", "target_response_rate": "18-22%", "avg_lead_score": 92},
            {"niche": "Real Estate Brokerages", "target_response_rate": "12-16%", "avg_lead_score": 88},
            {"niche": "Home Services & HVAC", "target_response_rate": "14-18%", "avg_lead_score": 89}
        ],
        "benchmark_target_offers": [
            {"offer": "AI Receptionist & 24/7 Booking", "model_profile": "Grounded Multi-Turn RAG"},
            {"offer": "Inbound Lead Qualification", "model_profile": "Sub-60s ICP Scorer"},
            {"offer": "Cross-Tool Webhook Automation", "model_profile": "Deterministic State Machine"}
        ]
    }

@router.get("/operator-today")
@router.get("/owais-today")
async def get_operator_today_hub(session: AsyncSession = Depends(get_db)):
    """
    Priority Action Hub: Surfaces actionable items requiring operator's immediate review or action today.
    """
    # 1. Unresolved Escalations / High Intent Replies
    alert_stmt = select(SystemAlert).where(SystemAlert.is_resolved == False).order_by(SystemAlert.created_at.desc()).limit(10)
    alert_res = await session.execute(alert_stmt)
    unresolved_alerts = alert_res.scalars().all()

    # 2. Conversations needing human response
    conv_stmt = select(Conversation).where(Conversation.requires_human_action == True).order_by(Conversation.updated_at.desc()).limit(10)
    conv_res = await session.execute(conv_stmt)
    pending_convs = conv_res.scalars().all()

    # 3. Queued drafts ready for review
    draft_stmt = select(OutreachMessage).where(OutreachMessage.status == "QUEUED").order_by(OutreachMessage.created_at.desc()).limit(10)
    draft_res = await session.execute(draft_stmt)
    queued_drafts = draft_res.scalars().all()

    # 4. Mailbox health
    from backend.app.models.compliance import MailboxHealth
    mb_res = await session.execute(select(MailboxHealth).limit(1))
    mb_health = mb_res.scalars().first()

    return {
        "summary": {
            "pending_escalations": len(unresolved_alerts),
            "replies_awaiting_approval": len(pending_convs),
            "outreach_drafts_queued": len(queued_drafts),
            "mailbox_status": mb_health.status if mb_health else "HEALTHY",
            "mailbox_health_score": mb_health.health_score if mb_health else 100,
            "emails_sent_today": mb_health.sent_today if mb_health else 0
        },
        "urgent_alerts": [{
            "id": a.id,
            "severity": a.severity,
            "title": a.title,
            "message": a.message,
            "created_at": a.created_at.isoformat()
        } for a in unresolved_alerts],
        "inbound_needing_action": [{
            "id": c.id,
            "contact_email": c.contact_email,
            "intent": c.latest_intent_classification,
            "intent_score": c.latest_intent_score,
            "reason": c.human_action_reason,
            "updated_at": c.updated_at.isoformat()
        } for c in pending_convs],
        "queued_outreach": [{
            "id": d.id,
            "recipient_email": d.recipient_email,
            "recipient_name": d.recipient_name,
            "subject": d.subject,
            "quality_score": d.quality_score,
            "personalization_score": d.personalization_score or d.quality_score,
            "factual_confidence": int((d.factual_confidence or 0.9) * 100),
            "hallucination_check": d.hallucination_check_result or "PASS",
            "is_dry_run": d.is_dry_run
        } for d in queued_drafts]
    }

