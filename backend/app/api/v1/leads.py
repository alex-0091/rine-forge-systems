"""
Rine Forge Systems V5 - Leads API Router
Manages lead pipeline, intent scores, urgency tracking, and deal conversion.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.database import get_db
from backend.app.models.v5 import Lead, Business, Customer
from backend.app.auth.dependencies import get_current_tenant

router = APIRouter(prefix="/leads", tags=["V5 Leads"])

class UpdateLeadRequest(BaseModel):
    status: Optional[str] = None # NEW, CONTACTED, QUALIFIED, WON, LOST
    score: Optional[int] = None
    urgency: Optional[str] = None # LOW, MEDIUM, HIGH
    notes: Optional[str] = None

@router.get("")
async def list_leads(
    status: Optional[str] = None,
    min_score: Optional[int] = None,
    limit: int = Query(50, le=100),
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(get_current_tenant)
):
    """Lists scored leads for current tenant ordered by highest potential."""
    query = (
        select(Lead)
        .where(Lead.business_id == tenant.id)
        .options(selectinload(Lead.customer))
    )
    if status:
        query = query.where(Lead.status == status)
    if min_score is not None:
        query = query.where(Lead.score >= min_score)

    query = query.order_by(Lead.score.desc(), Lead.updated_at.desc()).limit(limit)
    res = await session.execute(query)
    leads = res.scalars().all()

    return [
        {
            "id": l.id,
            "customer": {
                "id": l.customer.id if l.customer else None,
                "name": l.customer.name if l.customer else None,
                "phone": l.customer.phone if l.customer else None,
                "email": l.customer.email if l.customer else None
            },
            "status": l.status,
            "score": l.score,
            "intent": l.intent,
            "urgency": l.urgency,
            "notes": l.notes,
            "updated_at": l.updated_at.isoformat() if l.updated_at else None
        }
        for l in leads
    ]

@router.put("/{lead_id}")
async def update_lead(
    lead_id: str,
    payload: UpdateLeadRequest,
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(get_current_tenant)
):
    """Updates lead qualification status or CRM notes."""
    stmt = select(Lead).where(Lead.id == lead_id, Lead.business_id == tenant.id)
    res = await session.execute(stmt)
    lead = res.scalar_one_or_none()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found in tenant")

    if payload.status is not None: lead.status = payload.status
    if payload.score is not None: lead.score = payload.score
    if payload.urgency is not None: lead.urgency = payload.urgency
    if payload.notes is not None: lead.notes = payload.notes

    await session.commit()
    return {"status": "success", "lead_id": lead.id, "current_status": lead.status}
