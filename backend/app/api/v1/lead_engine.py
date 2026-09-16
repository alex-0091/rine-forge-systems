"""
Rine Forge Systems V5 - Lead Engine Master API Router (Modules 41-56)
Authoritative REST API endpoints for:
- B2B Prospects & Import
- Discovery Search & URL Analysis
- Outreach Review, Approval & Telemetry
- Suppression List Management
- Conversion Intelligence & Pipeline Analytics
"""
import logging
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status, Query, Header
from pydantic import BaseModel
from sqlalchemy import select, func, or_, delete
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.database import get_db
from backend.app.models.v5 import (
    Business,
    V5Prospect,
    V5ProspectObservation,
    V5ProspectOpportunity,
    V5ProspectOutreach,
    V5OutreachEvent,
    V5LeadSearch,
    V5LeadSearchResult,
    V5SuppressionEntry
)
from backend.app.discovery.pipeline_v5 import lead_discovery_pipeline
from backend.app.discovery.website_analysis import website_analysis_service
from backend.app.discovery.opportunity_analyzer import opportunity_analyzer
from backend.app.discovery.providers_v5 import LeadSourceType, PublicBusinessDataProvider
from backend.app.outreach.engine_v5 import outreach_engine_v5
from backend.app.compliance.suppression_service import suppression_service
from backend.app.analytics.conversion_intelligence import conversion_intelligence
from backend.app.outreach.rate_limiter_v5 import frequency_controller
from backend.app.discovery.deduplication_v5 import prospect_deduplicator

logger = logging.getLogger(__name__)

router = APIRouter(tags=["V5 Lead Engine"])

# Dependency: resolves tenant from auth token, X-Business-ID header, or query param
async def resolve_tenant(
    x_business_id: Optional[str] = Header(None, alias="X-Business-ID"),
    query_biz_id: Optional[str] = Query(None, alias="business_id"),
    session: AsyncSession = Depends(get_db)
) -> Business:
    target_id = x_business_id or query_biz_id
    if target_id:
        stmt = select(Business).where(Business.id == target_id)
        res = await session.execute(stmt)
        biz = res.scalar_one_or_none()
        if biz:
            return biz

    # Fallback to internal or first business
    stmt = select(Business).order_by(Business.created_at.asc()).limit(1)
    res = await session.execute(stmt)
    biz = res.scalar_one_or_none()
    if biz:
        return biz

    raise HTTPException(status_code=400, detail="Tenant context required")

# ============================================================
# PYDANTIC SCHEMAS
# ============================================================
class CreateProspectRequest(BaseModel):
    company_name: str
    website: Optional[str] = None
    industry: str = "General"
    location: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    notes: Optional[str] = None

class ImportProspectsRequest(BaseModel):
    prospects: List[CreateProspectRequest]

class UpdateProspectRequest(BaseModel):
    pipeline_stage: Optional[str] = None
    outreach_status: Optional[str] = None
    contact_status: Optional[str] = None
    review_mode: Optional[str] = None
    notes: Optional[str] = None
    score: Optional[int] = None

class DiscoverySearchRequest(BaseModel):
    industry: str
    location: str
    services: Optional[List[str]] = None
    source_type: str = "PUBLIC_BUSINESS_DATA"
    max_results: int = 10
    auto_draft_outreach: bool = True

class AnalyzeUrlRequest(BaseModel):
    url: str
    business_name: Optional[str] = None
    industry: Optional[str] = "General"

class ApproveOutreachRequest(BaseModel):
    approver_id: Optional[str] = None
    custom_subject: Optional[str] = None
    custom_message: Optional[str] = None

class EditOutreachRequest(BaseModel):
    subject: Optional[str] = None
    message: str

class RejectOutreachRequest(BaseModel):
    reason: str = "Rejected by user"

class BulkApproveRequest(BaseModel):
    outreach_ids: List[str]
    approver_id: Optional[str] = None

class CreateSuppressionRequest(BaseModel):
    entry_type: str # EMAIL, PHONE, DOMAIN
    value: str
    reason: str = "MANUAL_ENTRY"

# ============================================================
# 1. PROSPECTS ENDPOINTS
# ============================================================
@router.get("/prospects")
async def list_prospects(
    stage: Optional[str] = None,
    outreach_status: Optional[str] = None,
    min_score: Optional[int] = None,
    location: Optional[str] = None,
    industry: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = Query(50, le=200),
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(resolve_tenant)
):
    """Lists discovered prospects with observations and current review stage."""
    stmt = (
        select(V5Prospect)
        .where(V5Prospect.business_id == tenant.id)
        .options(
            selectinload(V5Prospect.observations),
            selectinload(V5Prospect.opportunities),
            selectinload(V5Prospect.outreach_messages)
        )
    )
    if stage:
        stmt = stmt.where(V5Prospect.pipeline_stage == stage.upper())
    if outreach_status:
        stmt = stmt.where(V5Prospect.outreach_status == outreach_status.upper())
    if min_score is not None:
        stmt = stmt.where(V5Prospect.score >= min_score)
    if industry:
        stmt = stmt.where(V5Prospect.industry.ilike(f"%{industry}%"))
    if location:
        stmt = stmt.where(or_(V5Prospect.city.ilike(f"%{location}%"), V5Prospect.location.ilike(f"%{location}%")))
    if search:
        stmt = stmt.where(V5Prospect.company_name.ilike(f"%{search}%"))

    stmt = stmt.order_by(V5Prospect.score.desc(), V5Prospect.created_at.desc()).limit(limit)
    res = await session.execute(stmt)
    prospects = res.scalars().all()

    return [
        {
            "id": p.id,
            "company_name": p.company_name,
            "website": p.website,
            "industry": p.industry,
            "location": p.location,
            "city": p.city,
            "email": p.email,
            "phone": p.phone,
            "source": p.source,
            "source_url": p.source_url,
            "score": p.score,
            "score_breakdown": p.score_breakdown,
            "outreach_status": p.outreach_status,
            "contact_status": p.contact_status,
            "pipeline_stage": p.pipeline_stage,
            "review_mode": p.review_mode,
            "last_contacted": p.last_contacted.isoformat() if p.last_contacted else None,
            "next_action": p.next_action,
            "observations_count": len(p.observations),
            "opportunities_count": len(p.opportunities),
            "outreach_messages_count": len(p.outreach_messages),
            "created_at": p.created_at.isoformat() if p.created_at else None
        }
        for p in prospects
    ]

@router.get("/prospects/{prospect_id}")
async def get_prospect_detail(
    prospect_id: str,
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(resolve_tenant)
):
    """Returns full prospect intelligence dossier: verified observations, opportunities, and history."""
    stmt = (
        select(V5Prospect)
        .where(V5Prospect.id == prospect_id, V5Prospect.business_id == tenant.id)
        .options(
            selectinload(V5Prospect.observations),
            selectinload(V5Prospect.opportunities),
            selectinload(V5Prospect.outreach_messages).selectinload(V5ProspectOutreach.events)
        )
    )
    res = await session.execute(stmt)
    prospect = res.scalar_one_or_none()
    if not prospect:
        raise HTTPException(status_code=404, detail="Prospect not found")

    compliance = await outreach_engine_v5.get_compliance_status(
        session=session, business_id=tenant.id, prospect=prospect
    )

    return {
        "id": prospect.id,
        "business_id": prospect.business_id,
        "company_name": prospect.company_name,
        "website": prospect.website,
        "industry": prospect.industry,
        "location": prospect.location,
        "city": prospect.city,
        "state": prospect.state,
        "email": prospect.email,
        "phone": prospect.phone,
        "social_links": prospect.social_links,
        "source": prospect.source,
        "source_url": prospect.source_url,
        "score": prospect.score,
        "score_breakdown": prospect.score_breakdown,
        "outreach_status": prospect.outreach_status,
        "contact_status": prospect.contact_status,
        "consent_status": prospect.consent_status,
        "pipeline_stage": prospect.pipeline_stage,
        "review_mode": prospect.review_mode,
        "last_contacted": prospect.last_contacted.isoformat() if prospect.last_contacted else None,
        "next_action": prospect.next_action,
        "notes": prospect.notes,
        "compliance": compliance,
        "observations": [
            {
                "id": o.id,
                "observation": o.observation,
                "source": o.source,
                "confidence": o.confidence,
                "category": o.category
            }
            for o in prospect.observations
        ],
        "opportunities": [
            {
                "id": op.id,
                "type": op.type,
                "reason": op.reason,
                "evidence": op.evidence,
                "confidence": op.confidence
            }
            for op in prospect.opportunities
        ],
        "outreach_history": [
            {
                "id": m.id,
                "channel": m.channel,
                "subject": m.subject,
                "message": m.message,
                "status": m.status,
                "step_number": m.step_number,
                "sent_at": m.sent_at.isoformat() if m.sent_at else None,
                "delivered_at": m.delivered_at.isoformat() if m.delivered_at else None,
                "opened_at": m.opened_at.isoformat() if m.opened_at else None,
                "replied_at": m.replied_at.isoformat() if m.replied_at else None,
                "events": [{"type": e.event_type, "timestamp": e.created_at.isoformat() if e.created_at else None} for e in m.events]
            }
            for m in prospect.outreach_messages
        ]
    }

@router.post("/prospects")
async def create_prospect(
    payload: CreateProspectRequest,
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(resolve_tenant)
):
    """Manually adds a single B2B prospect to tenant Lead Engine."""
    prospect, is_new = await prospect_deduplicator.merge_or_create_prospect(
        session=session,
        business_id=tenant.id,
        prospect_data={
            "company_name": payload.company_name,
            "website": payload.website,
            "industry": payload.industry,
            "location": payload.location,
            "city": payload.city,
            "state": payload.state,
            "email": payload.email,
            "phone": payload.phone,
            "source": "USER_PROVIDED_LEADS",
            "score": 60,
            "consent_status": "PUBLIC_COMMERCIAL"
        }
    )
    return {"success": True, "prospect_id": prospect.id, "is_new": is_new}

@router.post("/prospects/import")
async def import_prospects(
    payload: ImportProspectsRequest,
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(resolve_tenant)
):
    """Bulk imports prospects from user CSV or JSON data."""
    imported = []
    for item in payload.prospects:
        p, is_new = await prospect_deduplicator.merge_or_create_prospect(
            session=session,
            business_id=tenant.id,
            prospect_data={
                "company_name": item.company_name,
                "website": item.website,
                "industry": item.industry,
                "location": item.location,
                "city": item.city,
                "state": item.state,
                "email": item.email,
                "phone": item.phone,
                "source": "USER_PROVIDED_LEADS",
                "score": 60,
                "consent_status": "PUBLIC_COMMERCIAL"
            }
        )
        imported.append({"id": p.id, "company_name": p.company_name, "is_new": is_new})
    return {"success": True, "total_imported": len(imported), "results": imported}

@router.patch("/prospects/{prospect_id}")
async def update_prospect(
    prospect_id: str,
    payload: UpdateProspectRequest,
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(resolve_tenant)
):
    """Updates prospect pipeline stage, review mode, or notes."""
    prospect = await session.get(V5Prospect, prospect_id)
    if not prospect or prospect.business_id != tenant.id:
        raise HTTPException(status_code=404, detail="Prospect not found")

    if payload.pipeline_stage:
        prospect.pipeline_stage = payload.pipeline_stage.upper()
    if payload.outreach_status:
        prospect.outreach_status = payload.outreach_status.upper()
    if payload.contact_status:
        prospect.contact_status = payload.contact_status.upper()
    if payload.review_mode:
        prospect.review_mode = payload.review_mode.upper()
    if payload.notes is not None:
        prospect.notes = payload.notes
    if payload.score is not None:
        prospect.score = payload.score

    await session.commit()
    return {"success": True, "prospect_id": prospect.id, "pipeline_stage": prospect.pipeline_stage}

@router.delete("/prospects/{prospect_id}")
async def archive_prospect(
    prospect_id: str,
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(resolve_tenant)
):
    """Archives a prospect by moving to DISQUALIFIED stage and stopping active outreach."""
    res = await outreach_engine_v5.disqualify_prospect(
        session=session, prospect_id=prospect_id, reason="Archived by user"
    )
    return res

# ============================================================
# 2. DISCOVERY ENDPOINTS
# ============================================================
@router.post("/discovery/search")
async def trigger_discovery_search(
    payload: DiscoverySearchRequest,
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(resolve_tenant)
):
    """Triggers an end-to-end 13-stage discovery search run."""
    run_result = await lead_discovery_pipeline.execute_discovery_run(
        session=session,
        business_id=tenant.id,
        industry=payload.industry,
        location=payload.location,
        services=payload.services,
        source_type=payload.source_type,
        max_results=payload.max_results,
        auto_draft_outreach=payload.auto_draft_outreach
    )
    return run_result

@router.get("/discovery/searches")
async def list_discovery_searches(
    limit: int = Query(20, le=100),
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(resolve_tenant)
):
    """Returns history of automated and manual discovery search runs."""
    stmt = (
        select(V5LeadSearch)
        .where(V5LeadSearch.business_id == tenant.id)
        .order_by(V5LeadSearch.created_at.desc())
        .limit(limit)
    )
    res = await session.execute(stmt)
    searches = res.scalars().all()
    return [
        {
            "id": s.id,
            "query": s.query,
            "industry": s.industry,
            "location": s.location,
            "services": s.services,
            "results_count": s.results_count,
            "status": s.status,
            "created_at": s.created_at.isoformat() if s.created_at else None
        }
        for s in searches
    ]

@router.post("/discovery/analyze-url")
async def analyze_website_on_demand(
    payload: AnalyzeUrlRequest
):
    """Inspects a target website URL in real time and extracts grounded observations + opportunities."""
    analysis = await website_analysis_service.analyze(
        url=payload.url,
        fallback_name=payload.business_name or "",
        target_industry=payload.industry or "General"
    )
    opps = opportunity_analyzer.analyze_opportunities(
        analysis=analysis,
        business_profile={"industry": payload.industry}
    )
    return {
        "analysis": analysis.to_dict(),
        "opportunities": opps
    }

@router.get("/discovery/sources")
async def list_discovery_sources():
    """Lists all 10 official lead sources and their API capability/compliance status."""
    return [
        {"source": LeadSourceType.WEBSITE_FORMS.value, "status": "ACTIVE", "type": "INBOUND"},
        {"source": LeadSourceType.INBOUND_CHAT.value, "status": "ACTIVE", "type": "INBOUND"},
        {"source": LeadSourceType.CRM.value, "status": "AVAILABLE", "type": "INTEGRATION"},
        {"source": LeadSourceType.EMAIL.value, "status": "ACTIVE", "type": "INBOUND"},
        {"source": LeadSourceType.REFERRALS.value, "status": "AVAILABLE", "type": "USER"},
        {"source": LeadSourceType.PUBLIC_BUSINESS_DATA.value, "status": "ACTIVE", "type": "DISCOVERY"},
        {"source": LeadSourceType.AUTHORIZED_LEAD_APIS.value, "status": "CONFIGURED", "type": "API"},
        {"source": LeadSourceType.AD_PLATFORMS.value, "status": "WEBHOOK_READY", "type": "PAID"},
        {"source": LeadSourceType.SOCIAL_PLATFORM_APIS.value, "status": "NOT AVAILABLE THROUGH OFFICIAL API", "type": "RESTRICTED", "note": "Zero scraping enforced"},
        {"source": LeadSourceType.USER_PROVIDED_LEADS.value, "status": "ACTIVE", "type": "IMPORT"}
    ]

# ============================================================
# 3. OUTREACH & REVIEW ENDPOINTS
# ============================================================
@router.get("/outreach/pending")
async def list_pending_outreach(
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(resolve_tenant)
):
    """Returns all drafted outreach messages awaiting human review."""
    stmt = (
        select(V5ProspectOutreach)
        .where(
            V5ProspectOutreach.business_id == tenant.id,
            V5ProspectOutreach.status == "PENDING_REVIEW"
        )
        .options(
            selectinload(V5ProspectOutreach.prospect).selectinload(V5Prospect.observations),
            selectinload(V5ProspectOutreach.prospect).selectinload(V5Prospect.opportunities)
        )
        .order_by(V5ProspectOutreach.created_at.desc())
    )
    res = await session.execute(stmt)
    pending = res.scalars().all()

    results = []
    for m in pending:
        compliance = await outreach_engine_v5.get_compliance_status(
            session=session, business_id=tenant.id, prospect=m.prospect, channel=m.channel
        )
        results.append({
            "outreach_id": m.id,
            "prospect": {
                "id": m.prospect.id,
                "company_name": m.prospect.company_name,
                "website": m.prospect.website,
                "email": m.prospect.email,
                "phone": m.prospect.phone,
                "score": m.prospect.score,
                "observations": [{"observation": o.observation, "source": o.source} for o in m.prospect.observations],
                "opportunities": [{"type": op.type, "reason": op.reason, "evidence": op.evidence} for op in m.prospect.opportunities]
            },
            "channel": m.channel,
            "subject": m.subject,
            "message": m.message,
            "step_number": m.step_number,
            "compliance": compliance,
            "created_at": m.created_at.isoformat() if m.created_at else None
        })
    return results

@router.post("/outreach/{outreach_id}/approve")
async def approve_outreach_message(
    outreach_id: str,
    payload: ApproveOutreachRequest,
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(resolve_tenant)
):
    """Human approval: dispatches message across verified channel."""
    return await outreach_engine_v5.approve_and_send(
        session=session,
        outreach_id=outreach_id,
        approver_id=payload.approver_id,
        custom_subject=payload.custom_subject,
        custom_message=payload.custom_message
    )

@router.post("/outreach/{outreach_id}/reject")
async def reject_outreach_message(
    outreach_id: str,
    payload: RejectOutreachRequest,
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(resolve_tenant)
):
    """Rejects drafted message."""
    return await outreach_engine_v5.reject_outreach(
        session=session, outreach_id=outreach_id, reason=payload.reason
    )

@router.post("/outreach/{outreach_id}/edit")
async def edit_outreach_draft(
    outreach_id: str,
    payload: EditOutreachRequest,
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(resolve_tenant)
):
    """Saves edits to a pending review message."""
    outreach = await session.get(V5ProspectOutreach, outreach_id)
    if not outreach or outreach.business_id != tenant.id:
        raise HTTPException(status_code=404, detail="Outreach draft not found")

    if payload.subject is not None:
        outreach.subject = payload.subject
    outreach.message = payload.message
    meta = dict(outreach.meta_json or {})
    meta["body_html"] = f"<p>{payload.message.replace(chr(10), '<br>')}</p>"
    outreach.meta_json = meta

    await session.commit()
    return {"success": True, "outreach_id": outreach.id}

@router.post("/outreach/bulk-approve")
async def bulk_approve_outreach(
    payload: BulkApproveRequest,
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(resolve_tenant)
):
    """Bulk approves multiple messages."""
    results = []
    for oid in payload.outreach_ids:
        try:
            res = await outreach_engine_v5.approve_and_send(
                session=session, outreach_id=oid, approver_id=payload.approver_id
            )
            results.append({"outreach_id": oid, "success": res.get("success", False)})
        except Exception as e:
            results.append({"outreach_id": oid, "success": False, "error": str(e)})
    return {"results": results}

@router.get("/outreach/history")
async def list_outreach_history(
    limit: int = Query(50, le=100),
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(resolve_tenant)
):
    """Returns history of sent outreach communications."""
    stmt = (
        select(V5ProspectOutreach)
        .where(
            V5ProspectOutreach.business_id == tenant.id,
            V5ProspectOutreach.status.in_(["SENT", "DELIVERED", "OPENED", "REPLIED", "BOUNCED"])
        )
        .options(selectinload(V5ProspectOutreach.prospect))
        .order_by(V5ProspectOutreach.sent_at.desc())
        .limit(limit)
    )
    res = await session.execute(stmt)
    history = res.scalars().all()
    return [
        {
            "id": h.id,
            "prospect_name": h.prospect.company_name if h.prospect else "Unknown",
            "channel": h.channel,
            "subject": h.subject,
            "status": h.status,
            "step_number": h.step_number,
            "sent_at": h.sent_at.isoformat() if h.sent_at else None,
            "replied_at": h.replied_at.isoformat() if h.replied_at else None
        }
        for h in history
    ]

@router.get("/outreach/status")
async def get_outreach_status(
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(resolve_tenant)
):
    """Returns today's sent volume, daily velocity caps, and auto-mode qualification."""
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    
    email_stmt = select(func.count(V5ProspectOutreach.id)).where(
        V5ProspectOutreach.business_id == tenant.id,
        V5ProspectOutreach.channel == "EMAIL",
        V5ProspectOutreach.sent_at >= today_start
    )
    email_res = await session.execute(email_stmt)
    emails_today = email_res.scalar() or 0

    whatsapp_stmt = select(func.count(V5ProspectOutreach.id)).where(
        V5ProspectOutreach.business_id == tenant.id,
        V5ProspectOutreach.channel == "WHATSAPP",
        V5ProspectOutreach.sent_at >= today_start
    )
    wa_res = await session.execute(whatsapp_stmt)
    wa_today = wa_res.scalar() or 0

    auto_eligibility = await outreach_engine_v5.check_auto_mode_eligibility(
        session=session, business_id=tenant.id
    )

    return {
        "today": {
            "email_sent": emails_today,
            "email_cap": frequency_controller.DAILY_CAP_EMAIL,
            "whatsapp_sent": wa_today,
            "whatsapp_cap": frequency_controller.DAILY_CAP_WHATSAPP
        },
        "cooldown_policy_hours": frequency_controller.COOLDOWN_HOURS,
        "max_sequence_steps": frequency_controller.MAX_SEQUENCE_STEPS,
        "auto_mode": auto_eligibility
    }

# ============================================================
# 4. SUPPRESSION ENDPOINTS
# ============================================================
@router.get("/suppression")
async def list_suppression(
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(resolve_tenant)
):
    """Lists suppressed emails, numbers, and domains."""
    stmt = (
        select(V5SuppressionEntry)
        .where(V5SuppressionEntry.business_id == tenant.id)
        .order_by(V5SuppressionEntry.created_at.desc())
    )
    res = await session.execute(stmt)
    entries = res.scalars().all()
    return [
        {
            "id": e.id,
            "entry_type": e.entry_type,
            "value": e.value,
            "reason": e.reason,
            "created_at": e.created_at.isoformat() if e.created_at else None
        }
        for e in entries
    ]

@router.post("/suppression")
async def add_suppression_entry(
    payload: CreateSuppressionRequest,
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(resolve_tenant)
):
    """Manually adds an email/phone/domain to suppression list."""
    entry = await suppression_service.add_to_suppression(
        session=session,
        business_id=tenant.id,
        entry_type=payload.entry_type,
        value=payload.value,
        reason=payload.reason
    )
    return {"success": True, "id": entry.id, "value": entry.value}

@router.delete("/suppression/{entry_id}")
async def delete_suppression_entry(
    entry_id: str,
    reason: str = Query(..., min_length=5),
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(resolve_tenant)
):
    """Removes an entry from suppression list (requires reason)."""
    entry = await session.get(V5SuppressionEntry, entry_id)
    if not entry or entry.business_id != tenant.id:
        raise HTTPException(status_code=404, detail="Suppression entry not found")

    logger.info(f"Admin removed suppression {entry.value} for reason: {reason}")
    await session.delete(entry)
    await session.commit()
    return {"success": True, "deleted_id": entry_id, "reason": reason}

# ============================================================
# 5. ANALYTICS ENDPOINTS
# ============================================================
@router.get("/analytics/pipeline")
async def get_pipeline_analytics(
    timeframe_days: int = Query(30, ge=1, le=365),
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(resolve_tenant)
):
    """Returns conversion funnel and pipeline stage breakdown."""
    metrics = await conversion_intelligence.get_dashboard_metrics(
        session=session, business_id=tenant.id, timeframe_days=timeframe_days
    )
    return metrics["discovery"]

@router.get("/analytics/deliverability")
async def get_deliverability_analytics(
    timeframe_days: int = Query(30, ge=1, le=365),
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(resolve_tenant)
):
    """Returns bounce rate, open rate, reply rate, and circuit breaker status."""
    metrics = await conversion_intelligence.get_dashboard_metrics(
        session=session, business_id=tenant.id, timeframe_days=timeframe_days
    )
    return {
        "status": metrics["status"],
        "outreach": metrics["outreach"],
        "circuit_breakers": metrics["circuit_breakers"]
    }

@router.get("/analytics/roi")
async def get_roi_analytics(
    timeframe_days: int = Query(30, ge=1, le=365),
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(resolve_tenant)
):
    """Returns pipeline value, demos booked, and estimated revenue."""
    metrics = await conversion_intelligence.get_dashboard_metrics(
        session=session, business_id=tenant.id, timeframe_days=timeframe_days
    )
    return metrics["conversions"]
