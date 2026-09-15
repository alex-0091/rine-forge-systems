"""
Rine Forge Systems V5 - SuperAdmin & Multi-Tenant Management API Router
Accessible strictly by SUPERADMIN or PLATFORM_ADMIN users.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.database import get_db
from backend.app.models.v5 import Business, User, AuditLog, AIEvent
from backend.app.auth.dependencies import get_current_user, require_role

router = APIRouter(prefix="/admin", tags=["V5 Admin"])

@router.get("/tenants")
async def list_all_tenants(
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_role(["SUPERADMIN", "PLATFORM_ADMIN"]))
):
    """Lists all business tenants across the platform (SuperAdmin only)."""
    stmt = select(Business).order_by(Business.created_at.desc())
    res = await session.execute(stmt)
    tenants = res.scalars().all()

    return [
        {
            "id": b.id,
            "name": b.name,
            "industry": b.industry,
            "status": b.status,
            "created_at": b.created_at.isoformat() if b.created_at else None
        }
        for b in tenants
    ]

@router.get("/audit-logs")
async def get_audit_logs(
    limit: int = 50,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_role(["SUPERADMIN", "PLATFORM_ADMIN"]))
):
    """Returns platform security and cross-tenant audit trail."""
    stmt = select(AuditLog).order_by(AuditLog.created_at.desc()).limit(limit)
    res = await session.execute(stmt)
    logs = res.scalars().all()

    return [
        {
            "id": l.id,
            "business_id": l.business_id,
            "user_id": l.user_id,
            "action": l.action,
            "resource": l.resource,
            "resource_id": l.resource_id,
            "metadata": l.metadata_json,
            "timestamp": l.created_at.isoformat() if l.created_at else None
        }
        for l in logs
    ]

@router.get("/system-health")
async def get_system_health(
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_role(["SUPERADMIN", "PLATFORM_ADMIN"]))
):
    """Aggregates platform wide metrics."""
    tenant_count = (await session.execute(select(func.count(Business.id)))).scalar() or 0
    user_count = (await session.execute(select(func.count(User.id)))).scalar() or 0
    event_count = (await session.execute(select(func.count(AIEvent.id)))).scalar() or 0

    return {
        "status": "healthy",
        "tenants": tenant_count,
        "users": user_count,
        "ai_events": event_count
    }
