"""
Rine Forge Systems V5 - Automations API Router
Configures event-driven rules: triggers (NEW_LEAD, APPOINTMENT_CREATED), conditions, and automated actions.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.database import get_db
from backend.app.models.v5 import Automation, Business
from backend.app.auth.dependencies import get_current_tenant, require_role

router = APIRouter(prefix="/automations", tags=["V5 Automations"])

class AutomationCreateRequest(BaseModel):
    name: str
    trigger: str # NEW_LEAD, NEW_MESSAGE, APPOINTMENT_CREATED, APPOINTMENT_CANCELLED, HUMAN_HANDOFF
    conditions: List[Dict[str, Any]] = []
    actions: List[Dict[str, Any]] = []
    enabled: bool = True

class AutomationUpdateRequest(BaseModel):
    name: Optional[str] = None
    trigger: Optional[str] = None
    conditions: Optional[List[Dict[str, Any]]] = None
    actions: Optional[List[Dict[str, Any]]] = None
    enabled: Optional[bool] = None

@router.get("")
async def list_automations(
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(get_current_tenant)
):
    """Lists configured automations for current tenant."""
    stmt = select(Automation).where(Automation.business_id == tenant.id)
    res = await session.execute(stmt)
    automations = res.scalars().all()
    return [
        {
            "id": a.id,
            "name": a.name,
            "trigger": a.trigger,
            "conditions": a.conditions,
            "actions": a.actions,
            "enabled": a.enabled,
            "created_at": a.created_at.isoformat() if a.created_at else None
        }
        for a in automations
    ]

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_automation(
    payload: AutomationCreateRequest,
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(get_current_tenant),
    _role = Depends(require_role(["BUSINESS_OWNER", "BUSINESS_ADMIN"]))
):
    """Creates a new automated workflow rule."""
    rule = Automation(
        business_id=tenant.id,
        name=payload.name,
        trigger=payload.trigger,
        conditions=payload.conditions,
        actions=payload.actions,
        enabled=payload.enabled
    )
    session.add(rule)
    await session.commit()
    await session.refresh(rule)

    return {"id": rule.id, "name": rule.name, "trigger": rule.trigger, "enabled": rule.enabled}

@router.put("/{automation_id}")
async def update_automation(
    automation_id: str,
    payload: AutomationUpdateRequest,
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(get_current_tenant),
    _role = Depends(require_role(["BUSINESS_OWNER", "BUSINESS_ADMIN"]))
):
    """Updates automation trigger, conditions, or actions."""
    stmt = select(Automation).where(Automation.id == automation_id, Automation.business_id == tenant.id)
    res = await session.execute(stmt)
    rule = res.scalar_one_or_none()
    if not rule:
        raise HTTPException(status_code=404, detail="Automation not found in tenant")

    if payload.name is not None: rule.name = payload.name
    if payload.trigger is not None: rule.trigger = payload.trigger
    if payload.conditions is not None: rule.conditions = payload.conditions
    if payload.actions is not None: rule.actions = payload.actions
    if payload.enabled is not None: rule.enabled = payload.enabled

    await session.commit()
    return {"status": "success", "automation_id": rule.id, "enabled": rule.enabled}

@router.delete("/{automation_id}")
async def delete_automation(
    automation_id: str,
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(get_current_tenant),
    _role = Depends(require_role(["BUSINESS_OWNER", "BUSINESS_ADMIN"]))
):
    """Deletes an automation rule."""
    stmt = select(Automation).where(Automation.id == automation_id, Automation.business_id == tenant.id)
    res = await session.execute(stmt)
    rule = res.scalar_one_or_none()
    if not rule:
        raise HTTPException(status_code=404, detail="Automation not found in tenant")

    await session.delete(rule)
    await session.commit()
    return {"status": "success", "message": f"Automation {automation_id} deleted"}
