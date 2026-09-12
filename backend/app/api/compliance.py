from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.database import get_db
from backend.app.models.compliance import SuppressionEntry, AuditLog
from backend.app.schemas.schemas import SuppressionCreate
from backend.app.compliance.suppression import suppression_manager
from backend.app.compliance.country_policies import POLICY_REGISTRY

router = APIRouter(prefix="/api/compliance", tags=["Compliance & Audit"])

@router.get("/suppression")
async def list_suppression_list(session: AsyncSession = Depends(get_db)):
    stmt = select(SuppressionEntry).order_by(desc(SuppressionEntry.created_at)).limit(100)
    res = await session.execute(stmt)
    entries = res.scalars().all()
    return [{
        "id": e.id,
        "entry_type": e.entry_type,
        "value": e.value,
        "reason": e.reason,
        "source": e.source,
        "notes": e.notes,
        "created_at": e.created_at.isoformat()
    } for e in entries]

@router.post("/suppression")
async def add_manual_suppression(req: SuppressionCreate, session: AsyncSession = Depends(get_db)):
    entry = await suppression_manager.add_suppression(
        session=session,
        value=req.value,
        entry_type=req.entry_type,
        reason=req.reason,
        source="manual_admin",
        notes=req.notes
    )
    return {"success": True, "entry_id": entry.id, "value": entry.value}

@router.delete("/suppression/{entry_id}")
async def remove_suppression(entry_id: str, session: AsyncSession = Depends(get_db)):
    stmt = select(SuppressionEntry).where(SuppressionEntry.id == entry_id)
    res = await session.execute(stmt)
    entry = res.scalars().first()
    if not entry:
        raise HTTPException(status_code=404, detail="Suppression entry not found")
    await session.delete(entry)
    await session.commit()
    return {"success": True, "deleted_id": entry_id}

@router.get("/audit-logs")
async def list_audit_logs(limit: int = 100, session: AsyncSession = Depends(get_db)):
    stmt = select(AuditLog).order_by(desc(AuditLog.created_at)).limit(limit)
    res = await session.execute(stmt)
    logs = res.scalars().all()
    return [{
        "id": l.id,
        "event_type": l.event_type,
        "actor": l.actor,
        "entity_type": l.entity_type,
        "entity_id": l.entity_id,
        "description": l.description,
        "tokens": {"in": l.input_tokens, "out": l.output_tokens},
        "cost_usd": l.estimated_cost_usd,
        "created_at": l.created_at.isoformat()
    } for l in logs]

@router.get("/policies")
async def list_country_policies():
    result = []
    for code, policy in POLICY_REGISTRY.items():
        if code not in ["US", "United States", "UK", "NZ", "UAE", "United Arab Emirates"]: # Deduplicate aliases
            result.append({
                "country": policy.COUNTRY_CODE,
                "cold_b2b_allowed": policy.ALLOWED_FOR_COLD_B2B,
                "requires_physical_address": policy.REQUIRES_PHYSICAL_ADDRESS,
                "requires_optout_link": policy.REQUIRES_OPTOUT_LINK,
                "requires_prior_consent": policy.REQUIRES_PRIOR_CONSENT
            })
    return result
