"""
Rine Forge Systems V5 - Business Tenant API Router
Manages business profiles, operating hours, settings, and public storefront details.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.database import get_db
from backend.app.models.v5 import Business, Service, Staff
from backend.app.auth.dependencies import get_current_tenant, require_role

router = APIRouter(prefix="/businesses", tags=["V5 Businesses"])

class BusinessUpdateRequest(BaseModel):
    name: Optional[str] = None
    industry: Optional[str] = None
    description: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    business_hours: Optional[Dict[str, Any]] = None
    timezone: Optional[str] = None
    settings_json: Optional[Dict[str, Any]] = None

@router.get("/current")
async def get_current_business(
    tenant: Business = Depends(get_current_tenant)
):
    """Returns profile and settings for current authenticated business tenant."""
    return {
        "id": tenant.id,
        "name": tenant.name,
        "industry": tenant.industry,
        "description": tenant.description,
        "phone": tenant.phone,
        "email": tenant.email,
        "address": tenant.address,
        "business_hours": tenant.business_hours,
        "timezone": tenant.timezone,
        "settings": tenant.settings_json,
        "status": tenant.status
    }

@router.put("/current")
async def update_current_business(
    payload: BusinessUpdateRequest,
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(get_current_tenant),
    _role = Depends(require_role(["BUSINESS_OWNER", "BUSINESS_ADMIN"]))
):
    """Updates profile and operational configuration for current business."""
    if payload.name is not None: tenant.name = payload.name
    if payload.industry is not None: tenant.industry = payload.industry
    if payload.description is not None: tenant.description = payload.description
    if payload.phone is not None: tenant.phone = payload.phone
    if payload.email is not None: tenant.email = payload.email
    if payload.address is not None: tenant.address = payload.address
    if payload.business_hours is not None: tenant.business_hours = payload.business_hours
    if payload.timezone is not None: tenant.timezone = payload.timezone
    if payload.settings_json is not None: tenant.settings_json = payload.settings_json

    await session.commit()
    await session.refresh(tenant)

    return {
        "status": "success",
        "business": {
            "id": tenant.id,
            "name": tenant.name,
            "industry": tenant.industry,
            "phone": tenant.phone,
            "business_hours": tenant.business_hours
        }
    }

@router.get("/{business_id}/public")
async def get_public_business_info(
    business_id: str,
    session: AsyncSession = Depends(get_db)
):
    """Public storefront data for customer booking widgets and web chat."""
    stmt = select(Business).where(Business.id == business_id)
    res = await session.execute(stmt)
    biz = res.scalar_one_or_none()
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found")

    # Fetch active services
    stmt_s = select(Service).where(Service.business_id == business_id, Service.active == True)
    res_s = await session.execute(stmt_s)
    services = res_s.scalars().all()

    # Fetch active staff
    stmt_st = select(Staff).where(Staff.business_id == business_id, Staff.active == True)
    res_st = await session.execute(stmt_st)
    staff = res_st.scalars().all()

    return {
        "id": biz.id,
        "name": biz.name,
        "industry": biz.industry,
        "description": biz.description,
        "phone": biz.phone,
        "email": biz.email,
        "address": biz.address,
        "business_hours": biz.business_hours,
        "timezone": biz.timezone,
        "services": [
            {"id": s.id, "name": s.name, "description": s.description, "price": s.price, "duration": s.duration, "currency": s.currency}
            for s in services
        ],
        "staff": [
            {"id": st.id, "name": st.name, "role": st.role}
            for st in staff
        ]
    }
