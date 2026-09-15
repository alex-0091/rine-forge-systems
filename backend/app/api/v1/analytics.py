"""
Rine Forge Systems V5 - Analytics & Telemetry API Router
Provides executive metrics, AI usage tracking, appointment volume, and cost accounting.
"""
from fastapi import APIRouter, Depends
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.database import get_db
from backend.app.models.v5 import Appointment, Lead, Conversation, Usage, Business
from backend.app.auth.dependencies import get_current_tenant

router = APIRouter(prefix="/analytics", tags=["V5 Analytics"])

@router.get("/overview")
async def get_overview_metrics(
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(get_current_tenant)
):
    """Returns high-level business performance metrics for current tenant."""
    # Count Appointments
    stmt_appts = select(func.count(Appointment.id)).where(Appointment.business_id == tenant.id)
    total_appts = (await session.execute(stmt_appts)).scalar() or 0

    # Count Confirmed Appointments
    stmt_confirmed = select(func.count(Appointment.id)).where(
        Appointment.business_id == tenant.id,
        Appointment.status == "CONFIRMED"
    )
    confirmed_appts = (await session.execute(stmt_confirmed)).scalar() or 0

    # Count Leads
    stmt_leads = select(func.count(Lead.id)).where(Lead.business_id == tenant.id)
    total_leads = (await session.execute(stmt_leads)).scalar() or 0

    # Average Lead Score
    stmt_avg_score = select(func.avg(Lead.score)).where(Lead.business_id == tenant.id)
    avg_score = (await session.execute(stmt_avg_score)).scalar() or 0.0

    # Active Conversations
    stmt_convs = select(func.count(Conversation.id)).where(
        Conversation.business_id == tenant.id,
        Conversation.status == "ACTIVE"
    )
    active_convs = (await session.execute(stmt_convs)).scalar() or 0

    return {
        "business_id": tenant.id,
        "business_name": tenant.name,
        "total_appointments": total_appts,
        "confirmed_appointments": confirmed_appts,
        "total_leads": total_leads,
        "average_lead_score": round(float(avg_score), 1),
        "active_conversations": active_convs,
        "estimated_hours_saved": round(total_appts * 0.5 + total_leads * 0.35, 1)
    }

@router.get("/usage")
async def get_usage_records(
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(get_current_tenant)
):
    """Returns monthly usage records for token tracking and billing."""
    stmt = select(Usage).where(Usage.business_id == tenant.id).order_by(Usage.period.desc())
    res = await session.execute(stmt)
    records = res.scalars().all()

    return [
        {
            "period": u.period,
            "messages": u.messages,
            "tokens": u.tokens,
            "tool_calls": u.tool_calls,
            "appointments": u.appointments,
            "leads": u.leads,
            "estimated_cost": u.estimated_cost
        }
        for u in records
    ]
