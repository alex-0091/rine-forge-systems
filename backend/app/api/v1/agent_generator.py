"""
Rine Forge Systems V5 - Phase AO: Auto Lead -> Auto Bot Generator API Router
Exposes enterprise endpoints for business agent generation, unified knowledge base inspection,
signal provider telemetry, multi-signal ingestion, fact vs inference qualification,
transparent lead prioritization, and 10-gate outbound compliance routing.
"""
import uuid
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status, Query, Header
from pydantic import BaseModel, Field
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.database import get_db
from backend.app.models.v5 import (
    Business,
    V5GeneratedAgentSuite,
    V5SocialSignal,
    V5SocialLead
)
from backend.app.agents.generator import (
    agent_generator_service,
    BusinessProfileInput
)
from backend.app.signals.providers import signal_ingestion_service
from backend.app.signals.qualification_agent import lead_qualification_agent
from backend.app.signals.response_generator import response_generator
from backend.app.signals.policy_engine import outbound_policy_engine
from backend.app.signals.prioritization import lead_prioritization_engine

logger = logging.getLogger("rine_forge.api.agent_generator")

router = APIRouter(prefix="/agent-generator", tags=["Agent Generator & Lead Intelligence"])


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

    stmt = select(Business).order_by(Business.created_at.asc()).limit(1)
    res = await session.execute(stmt)
    biz = res.scalar_one_or_none()
    if biz:
        return biz

    raise HTTPException(status_code=400, detail="Tenant context required")


# ============================================================
# SCHEMAS
# ============================================================
class GenerateSuiteRequest(BusinessProfileInput):
    pass


class IngestSignalsRequest(BaseModel):
    signals: List[Dict[str, Any]]
    source_platform: Optional[str] = "CUSTOMER_FEED"


class LeadActionRequest(BaseModel):
    action: str # APPROVE, EDIT, REJECT, DISPATCH
    edited_draft: Optional[str] = None
    rejection_reason: Optional[str] = None
    channel: Optional[str] = None


# ============================================================
# 1. AGENT GENERATOR ENDPOINTS
# ============================================================
@router.post("/generate")
async def generate_agent_suite(
    payload: GenerateSuiteRequest,
    business: Business = Depends(resolve_tenant),
    session: AsyncSession = Depends(get_db)
):
    """
    Generates or updates the coordinated 6-agent suite and authoritative knowledge base
    from the business configuration profile.
    """
    suite = await agent_generator_service.create_or_update_suite(
        session=session,
        business_id=business.id,
        profile_data=payload.dict()
    )
    readiness = agent_generator_service.verify_suite_readiness(suite)
    return {
        "success": True,
        "suite_id": suite.id,
        "business_name": suite.business_name,
        "category": suite.business_category,
        "status": suite.status,
        "readiness": readiness,
        "knowledge_base": suite.knowledge_base,
        "agents_config": suite.agents_config
    }


@router.get("/suites")
async def list_agent_suites(
    business: Business = Depends(resolve_tenant),
    session: AsyncSession = Depends(get_db)
):
    """Lists all generated agent suites for the tenant."""
    suites = await agent_generator_service.list_suites(session, business.id)
    return [
        {
            "id": s.id,
            "suite_name": s.suite_name,
            "business_name": s.business_name,
            "business_category": s.business_category,
            "location_area": s.location_area,
            "service_radius_miles": s.service_radius_miles,
            "services_count": len(s.services or []),
            "status": s.status,
            "created_at": s.created_at.isoformat() if s.created_at else None
        }
        for s in suites
    ]


@router.get("/suite/{suite_id}")
async def get_agent_suite(
    suite_id: str,
    business: Business = Depends(resolve_tenant),
    session: AsyncSession = Depends(get_db)
):
    """Retrieves a single generated agent suite with full configurations."""
    suite = await agent_generator_service.get_suite(session, suite_id, business.id)
    if not suite:
        raise HTTPException(status_code=404, detail="Agent suite not found")
    readiness = agent_generator_service.verify_suite_readiness(suite)
    return {
        "id": suite.id,
        "business_id": suite.business_id,
        "suite_name": suite.suite_name,
        "business_name": suite.business_name,
        "business_category": suite.business_category,
        "website": suite.website,
        "location_area": suite.location_area,
        "service_radius_miles": suite.service_radius_miles,
        "services": suite.services,
        "target_customer": suite.target_customer,
        "keywords": suite.keywords,
        "excluded_keywords": suite.excluded_keywords,
        "preferred_channels": suite.preferred_channels,
        "business_hours": suite.business_hours,
        "ai_tone": suite.ai_tone,
        "qualification_rules": suite.qualification_rules,
        "knowledge_base": suite.knowledge_base,
        "agents_config": suite.agents_config,
        "readiness": readiness,
        "status": suite.status
    }


@router.get("/suite/{suite_id}/readiness")
async def check_suite_readiness(
    suite_id: str,
    business: Business = Depends(resolve_tenant),
    session: AsyncSession = Depends(get_db)
):
    """Verifies operational readiness of all 6 bots in the suite."""
    suite = await agent_generator_service.get_suite(session, suite_id, business.id)
    if not suite:
        raise HTTPException(status_code=404, detail="Agent suite not found")
    return agent_generator_service.verify_suite_readiness(suite)


# ============================================================
# 2. SIGNAL PROVIDERS & TELEMETRY
# ============================================================
@router.get("/providers")
async def get_signal_providers():
    """Lists registered signal providers and their live configuration/connection statuses."""
    return signal_ingestion_service.get_providers_status()


@router.post("/signals/ingest")
async def ingest_signals(
    payload: IngestSignalsRequest,
    business: Business = Depends(resolve_tenant),
    session: AsyncSession = Depends(get_db)
):
    """Ingests raw signals from customer feeds or authorized streams."""
    signals_data = payload.signals
    for s in signals_data:
        if "source_platform" not in s:
            s["source_platform"] = payload.source_platform

    ingested = await signal_ingestion_service.ingest_signals(
        session=session,
        business_id=business.id,
        signals_data=signals_data
    )
    return {
        "success": True,
        "ingested_count": len(ingested),
        "signals": [
            {
                "id": s.id,
                "source_platform": s.source_platform,
                "source_id": s.source_id,
                "content": s.content,
                "location_raw": s.location_raw,
                "data_provenance": s.data_provenance
            }
            for s in ingested
        ]
    }


@router.get("/signals")
async def list_signals(
    processed: Optional[bool] = None,
    business: Business = Depends(resolve_tenant),
    session: AsyncSession = Depends(get_db)
):
    """Lists stored signals for the business."""
    stmt = select(V5SocialSignal).where(V5SocialSignal.business_id == business.id)
    if processed is not None:
        stmt = stmt.where(V5SocialSignal.processed == processed)
    stmt = stmt.order_by(V5SocialSignal.created_at.desc()).limit(100)
    res = await session.execute(stmt)
    signals = res.scalars().all()
    return [
        {
            "id": s.id,
            "source_platform": s.source_platform,
            "source_id": s.source_id,
            "source_url": s.source_url,
            "author_id": s.author_id,
            "author_name": s.author_name,
            "content": s.content,
            "location_raw": s.location_raw,
            "relevance_score": s.relevance_score,
            "intent_category": s.intent_category,
            "data_provenance": s.data_provenance,
            "processed": s.processed,
            "created_at": s.created_at.isoformat() if s.created_at else None
        }
        for s in signals
    ]


@router.post("/signals/webhook")
async def receive_signal_webhook(
    payload: Dict[str, Any],
    business_id: Optional[str] = Query(None),
    session: AsyncSession = Depends(get_db)
):
    """Receives inbound webhooks from authorized platforms."""
    target_biz_id = business_id
    if not target_biz_id:
        # Fallback to first business
        stmt = select(Business).order_by(Business.created_at.asc()).limit(1)
        res = await session.execute(stmt)
        biz = res.scalar_one_or_none()
        if not biz:
            raise HTTPException(status_code=400, detail="No business registered")
        target_biz_id = biz.id

    content = payload.get("content") or payload.get("text") or payload.get("message")
    if not content:
        return {"received": False, "error": "No text content found in webhook"}

    signal_item = {
        "source_platform": "WEBHOOK",
        "source_id": payload.get("id") or str(uuid.uuid4()),
        "source_url": payload.get("url"),
        "author_id": payload.get("author_id") or payload.get("user_id"),
        "author_name": payload.get("author_name") or payload.get("user_name"),
        "content": content,
        "location_raw": payload.get("location"),
        "data_provenance": "AUTHORIZED_WEBHOOK",
        "meta_json": payload
    }

    ingested = await signal_ingestion_service.ingest_signals(
        session=session,
        business_id=target_biz_id,
        signals_data=[signal_item]
    )
    return {"received": True, "signal_id": ingested[0].id if ingested else None}


# ============================================================
# 3. QUALIFICATION & CRM LEADS
# ============================================================
@router.post("/signals/{signal_id}/qualify")
async def qualify_signal(
    signal_id: str,
    business: Business = Depends(resolve_tenant),
    session: AsyncSession = Depends(get_db)
):
    """
    Qualifies a signal against the active suite, segregating verifiable facts from inferences,
    and creates or updates a V5SocialLead in the CRM.
    """
    stmt = select(V5SocialSignal).where(
        V5SocialSignal.id == signal_id,
        V5SocialSignal.business_id == business.id
    )
    res = await session.execute(stmt)
    sig = res.scalars().first()
    if not sig:
        raise HTTPException(status_code=404, detail="Signal not found")

    # Fetch active suite
    suite_stmt = select(V5GeneratedAgentSuite).where(
        V5GeneratedAgentSuite.business_id == business.id,
        V5GeneratedAgentSuite.status == "ACTIVE"
    )
    suite_res = await session.execute(suite_stmt)
    suite = suite_res.scalars().first()

    lead = await lead_qualification_agent.qualify_and_persist(
        session=session,
        signal=sig,
        suite=suite
    )

    # Automatically generate draft response if qualified
    if lead.status in ["QUALIFIED", "NEEDS_REVIEW"] and not lead.draft_response:
        draft = response_generator.generate_response(lead=lead, suite=suite)
        lead.draft_response = draft.body
        lead.response_status = "DRAFT"
        await session.commit()
        await session.refresh(lead)

    return {
        "success": True,
        "lead_id": lead.id,
        "status": lead.status,
        "service_needed": lead.service_needed,
        "location": lead.location,
        "urgency": lead.urgency,
        "priority_score": lead.priority_score,
        "priority_factors": lead.priority_factors,
        "facts": lead.qualification_facts,
        "inferences": lead.qualification_inferences,
        "recommended_action": lead.recommended_action,
        "draft_response": lead.draft_response
    }


@router.get("/leads")
async def list_social_leads(
    status_filter: Optional[str] = Query(None, alias="status"),
    business: Business = Depends(resolve_tenant),
    session: AsyncSession = Depends(get_db)
):
    """Lists social leads across the 9 lifecycle states."""
    stmt = select(V5SocialLead).where(V5SocialLead.business_id == business.id)
    if status_filter:
        stmt = stmt.where(V5SocialLead.status == status_filter.upper())
    stmt = stmt.order_by(V5SocialLead.priority_score.desc(), V5SocialLead.created_at.desc())
    res = await session.execute(stmt)
    leads = res.scalars().all()
    return [
        {
            "id": l.id,
            "signal_id": l.signal_id,
            "contact_name": l.contact_name,
            "contact_handle": l.contact_handle,
            "channel": l.channel,
            "status": l.status,
            "service_needed": l.service_needed,
            "location": l.location,
            "urgency": l.urgency,
            "priority_score": l.priority_score,
            "priority_factors": l.priority_factors,
            "recommended_action": l.recommended_action,
            "draft_response": l.draft_response,
            "response_status": l.response_status,
            "opt_out_status": l.opt_out_status,
            "created_at": l.created_at.isoformat() if l.created_at else None
        }
        for l in leads
    ]


@router.get("/leads/{lead_id}")
async def get_social_lead(
    lead_id: str,
    business: Business = Depends(resolve_tenant),
    session: AsyncSession = Depends(get_db)
):
    """Retrieves full lead details including facts, inferences, priority checklist, and draft."""
    stmt = select(V5SocialLead).where(
        V5SocialLead.id == lead_id,
        V5SocialLead.business_id == business.id
    )
    res = await session.execute(stmt)
    lead = res.scalars().first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    # Fetch associated signal
    sig = None
    if lead.signal_id:
        sig_stmt = select(V5SocialSignal).where(V5SocialSignal.id == lead.signal_id)
        sig_res = await session.execute(sig_stmt)
        sig = sig_res.scalars().first()

    return {
        "id": lead.id,
        "business_id": lead.business_id,
        "signal": {
            "id": sig.id,
            "content": sig.content,
            "source_platform": sig.source_platform,
            "source_url": sig.source_url,
            "author_id": sig.author_id,
            "author_name": sig.author_name,
            "location_raw": sig.location_raw,
            "data_provenance": sig.data_provenance
        } if sig else None,
        "contact_name": lead.contact_name,
        "contact_handle": lead.contact_handle,
        "contact_email": lead.contact_email,
        "contact_phone": lead.contact_phone,
        "channel": lead.channel,
        "status": lead.status,
        "service_needed": lead.service_needed,
        "location": lead.location,
        "urgency": lead.urgency,
        "priority_score": lead.priority_score,
        "priority_factors": lead.priority_factors,
        "facts": lead.qualification_facts,
        "inferences": lead.qualification_inferences,
        "recommended_action": lead.recommended_action,
        "draft_response": lead.draft_response,
        "response_status": lead.response_status,
        "response_sent_at": lead.response_sent_at.isoformat() if lead.response_sent_at else None,
        "opt_out_status": lead.opt_out_status,
        "created_at": lead.created_at.isoformat() if lead.created_at else None
    }


# ============================================================
# 4. RESPONSE DRAFTING & COMPLIANT DISPATCH
# ============================================================
@router.post("/leads/{lead_id}/draft-response")
async def generate_lead_response_draft(
    lead_id: str,
    channel: Optional[str] = Query(None),
    business: Business = Depends(resolve_tenant),
    session: AsyncSession = Depends(get_db)
):
    """Generates a grounded response draft for the lead."""
    stmt = select(V5SocialLead).where(
        V5SocialLead.id == lead_id,
        V5SocialLead.business_id == business.id
    )
    res = await session.execute(stmt)
    lead = res.scalars().first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    suite_stmt = select(V5GeneratedAgentSuite).where(
        V5GeneratedAgentSuite.business_id == business.id,
        V5GeneratedAgentSuite.status == "ACTIVE"
    )
    suite_res = await session.execute(suite_stmt)
    suite = suite_res.scalars().first()

    draft = response_generator.generate_response(lead=lead, suite=suite, channel=channel)
    lead.draft_response = draft.body
    lead.response_status = "DRAFT"
    if channel:
        lead.channel = channel.upper()
    await session.commit()
    await session.refresh(lead)

    return {
        "success": True,
        "draft": draft.dict(),
        "lead_status": lead.status,
        "response_status": lead.response_status
    }


@router.post("/leads/{lead_id}/action")
async def execute_lead_action(
    lead_id: str,
    payload: LeadActionRequest,
    business: Business = Depends(resolve_tenant),
    session: AsyncSession = Depends(get_db)
):
    """
    Executes human operator review: [APPROVE], [EDIT], [REJECT], or [DISPATCH].
    If approved and dispatched, runs the 10-Gate Pre-Flight check.
    """
    stmt = select(V5SocialLead).where(
        V5SocialLead.id == lead_id,
        V5SocialLead.business_id == business.id
    )
    res = await session.execute(stmt)
    lead = res.scalars().first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    suite_stmt = select(V5GeneratedAgentSuite).where(
        V5GeneratedAgentSuite.business_id == business.id,
        V5GeneratedAgentSuite.status == "ACTIVE"
    )
    suite_res = await session.execute(suite_stmt)
    suite = suite_res.scalars().first()

    action = payload.action.upper()

    if action == "REJECT":
        lead.response_status = "REJECTED"
        lead.status = "DISQUALIFIED"
        await session.commit()
        return {"success": True, "lead_id": lead.id, "action": "REJECT", "status": lead.status}

    if action == "EDIT":
        if payload.edited_draft:
            lead.draft_response = payload.edited_draft
        lead.response_status = "APPROVED"
        await session.commit()
        return {"success": True, "lead_id": lead.id, "action": "EDIT", "response_status": lead.response_status}

    if action in ["APPROVE", "DISPATCH"]:
        lead.response_status = "APPROVED"
        if payload.edited_draft:
            lead.draft_response = payload.edited_draft

        # Run 10-gate dispatch
        dispatch_result = await outbound_policy_engine.dispatch_approved_response(
            session=session,
            lead=lead,
            suite=suite,
            custom_content=payload.edited_draft
        )
        return {
            "success": dispatch_result.get("success", False),
            "lead_id": lead.id,
            "action": action,
            "dispatch_result": dispatch_result
        }

    raise HTTPException(status_code=400, detail=f"Unsupported action '{payload.action}'")
