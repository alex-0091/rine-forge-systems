"""
Rine Forge Systems V5 - Staff API Router
Manages internal practitioners and scheduling availability per tenant.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.database import get_db
from backend.app.models.v5 import Staff, Business
from backend.app.auth.dependencies import get_current_tenant, require_role

router = APIRouter(prefix="/staff", tags=["V5 Staff"])

class StaffCreateRequest(BaseModel):
    name: str
    role: str = "Practitioner"
    email: Optional[str] = None
    phone: Optional[str] = None
    working_hours: Optional[Dict[str, str]] = None

class StaffUpdateRequest(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    working_hours: Optional[Dict[str, str]] = None
    active: Optional[bool] = None

@router.get("")
async def list_staff(
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(get_current_tenant)
):
    """Lists all active staff practitioners for the tenant."""
    stmt = select(Staff).where(Staff.business_id == tenant.id, Staff.active == True)
    res = await session.execute(stmt)
    staff = res.scalars().all()
    return [
        {
            "id": st.id,
            "name": st.name,
            "role": st.role,
            "email": st.email,
            "phone": st.phone,
            "working_hours": st.working_hours,
            "active": st.active
        }
        for st in staff
    ]

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_staff(
    payload: StaffCreateRequest,
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(get_current_tenant),
    _role = Depends(require_role(["BUSINESS_OWNER", "BUSINESS_ADMIN"]))
):
    """Adds a new staff practitioner."""
    staff = Staff(
        business_id=tenant.id,
        name=payload.name,
        role=payload.role,
        email=payload.email,
        phone=payload.phone,
        working_hours=payload.working_hours or {
            "monday": "09:00-17:00",
            "tuesday": "09:00-17:00",
            "wednesday": "09:00-17:00",
            "thursday": "09:00-17:00",
            "friday": "09:00-17:00"
        },
        active=True
    )
    session.add(staff)
    await session.commit()
    await session.refresh(staff)

    return {"id": staff.id, "name": staff.name, "role": staff.role}

@router.put("/{staff_id}")
async def update_staff(
    staff_id: str,
    payload: StaffUpdateRequest,
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(get_current_tenant),
    _role = Depends(require_role(["BUSINESS_OWNER", "BUSINESS_ADMIN"]))
):
    """Updates staff details or working hours."""
    stmt = select(Staff).where(Staff.id == staff_id, Staff.business_id == tenant.id)
    res = await session.execute(stmt)
    staff = res.scalar_one_or_none()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff member not found in tenant")

    if payload.name is not None: staff.name = payload.name
    if payload.role is not None: staff.role = payload.role
    if payload.email is not None: staff.email = payload.email
    if payload.phone is not None: staff.phone = payload.phone
    if payload.working_hours is not None: staff.working_hours = payload.working_hours
    if payload.active is not None: staff.active = payload.active

    await session.commit()
    return {"status": "success", "staff_id": staff.id}

@router.delete("/{staff_id}")
async def delete_staff(
    staff_id: str,
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(get_current_tenant),
    _role = Depends(require_role(["BUSINESS_OWNER", "BUSINESS_ADMIN"]))
):
    """Deactivates a staff practitioner."""
    stmt = select(Staff).where(Staff.id == staff_id, Staff.business_id == tenant.id)
    res = await session.execute(stmt)
    staff = res.scalar_one_or_none()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff member not found in tenant")

    staff.active = False
    await session.commit()
    return {"status": "success", "message": f"Staff {staff_id} deactivated"}
