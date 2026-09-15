"""
Rine Forge Systems V5 - Services API Router
Authoritative service catalog (pricing, durations, descriptions) per tenant.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.database import get_db
from backend.app.models.v5 import Service, Business
from backend.app.auth.dependencies import get_current_tenant, require_role

router = APIRouter(prefix="/services", tags=["V5 Services"])

class ServiceCreateRequest(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    duration: int = 30 # minutes
    currency: str = "USD"

class ServiceUpdateRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    duration: Optional[int] = None
    currency: Optional[str] = None
    active: Optional[bool] = None

@router.get("")
async def list_services(
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(get_current_tenant)
):
    """Lists all active services in the business tenant's catalog."""
    stmt = select(Service).where(Service.business_id == tenant.id, Service.active == True)
    res = await session.execute(stmt)
    services = res.scalars().all()
    return [
        {
            "id": s.id,
            "name": s.name,
            "description": s.description,
            "price": s.price,
            "duration": s.duration,
            "currency": s.currency,
            "active": s.active
        }
        for s in services
    ]

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_service(
    payload: ServiceCreateRequest,
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(get_current_tenant),
    _role = Depends(require_role(["BUSINESS_OWNER", "BUSINESS_ADMIN"]))
):
    """Adds a new authoritative service entry."""
    service = Service(
        business_id=tenant.id,
        name=payload.name,
        description=payload.description,
        price=payload.price,
        duration=payload.duration,
        currency=payload.currency,
        active=True
    )
    session.add(service)
    await session.commit()
    await session.refresh(service)

    return {"id": service.id, "name": service.name, "price": service.price, "duration": service.duration}

@router.put("/{service_id}")
async def update_service(
    service_id: str,
    payload: ServiceUpdateRequest,
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(get_current_tenant),
    _role = Depends(require_role(["BUSINESS_OWNER", "BUSINESS_ADMIN"]))
):
    """Updates service details or pricing."""
    stmt = select(Service).where(Service.id == service_id, Service.business_id == tenant.id)
    res = await session.execute(stmt)
    service = res.scalar_one_or_none()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found in tenant")

    if payload.name is not None: service.name = payload.name
    if payload.description is not None: service.description = payload.description
    if payload.price is not None: service.price = payload.price
    if payload.duration is not None: service.duration = payload.duration
    if payload.currency is not None: service.currency = payload.currency
    if payload.active is not None: service.active = payload.active

    await session.commit()
    return {"status": "success", "service_id": service.id}

@router.delete("/{service_id}")
async def delete_service(
    service_id: str,
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(get_current_tenant),
    _role = Depends(require_role(["BUSINESS_OWNER", "BUSINESS_ADMIN"]))
):
    """Deactivates a service."""
    stmt = select(Service).where(Service.id == service_id, Service.business_id == tenant.id)
    res = await session.execute(stmt)
    service = res.scalar_one_or_none()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found in tenant")

    service.active = False
    await session.commit()
    return {"status": "success", "message": f"Service {service_id} deactivated"}
