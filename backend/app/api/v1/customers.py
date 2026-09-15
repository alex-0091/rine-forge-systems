"""
Rine Forge Systems V5 - Customer API Router
Unified patient/client management across WhatsApp, Web, Phone, and Email.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.database import get_db
from backend.app.models.v5 import Customer, Business
from backend.app.auth.dependencies import get_current_tenant

router = APIRouter(prefix="/customers", tags=["V5 Customers"])

class CustomerUpdateRequest(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

@router.get("")
async def list_customers(
    search: Optional[str] = None,
    limit: int = Query(50, le=100),
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(get_current_tenant)
):
    """Lists customers belonging to the tenant."""
    query = select(Customer).where(Customer.business_id == tenant.id)
    if search:
        s = f"%{search}%"
        query = query.where((Customer.name.ilike(s)) | (Customer.phone.ilike(s)) | (Customer.email.ilike(s)))
    query = query.order_by(Customer.created_at.desc()).limit(limit)

    res = await session.execute(query)
    customers = res.scalars().all()
    return [
        {
            "id": c.id,
            "name": c.name,
            "email": c.email,
            "phone": c.phone,
            "channel": c.channel,
            "source": c.source,
            "created_at": c.created_at.isoformat() if c.created_at else None
        }
        for c in customers
    ]

@router.get("/{customer_id}")
async def get_customer(
    customer_id: str,
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(get_current_tenant)
):
    """Retrieves full profile for customer including history."""
    stmt = (
        select(Customer)
        .where(Customer.id == customer_id, Customer.business_id == tenant.id)
        .options(
            selectinload(Customer.appointments),
            selectinload(Customer.conversations),
            selectinload(Customer.leads)
        )
    )
    res = await session.execute(stmt)
    customer = res.scalar_one_or_none()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found in tenant")

    return {
        "id": customer.id,
        "name": customer.name,
        "email": customer.email,
        "phone": customer.phone,
        "channel": customer.channel,
        "source": customer.source,
        "metadata": customer.metadata_json,
        "appointments": [
            {"id": a.id, "start_time": a.start_time.isoformat(), "end_time": a.end_time.isoformat(), "status": a.status}
            for a in customer.appointments
        ],
        "leads": [
            {"id": l.id, "status": l.status, "score": l.score, "urgency": l.urgency}
            for l in customer.leads
        ],
        "conversations": [
            {"id": cv.id, "channel": cv.channel, "status": cv.status, "human_handoff": cv.human_handoff}
            for cv in customer.conversations
        ]
    }

@router.put("/{customer_id}")
async def update_customer(
    customer_id: str,
    payload: CustomerUpdateRequest,
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(get_current_tenant)
):
    """Updates customer contact records."""
    stmt = select(Customer).where(Customer.id == customer_id, Customer.business_id == tenant.id)
    res = await session.execute(stmt)
    customer = res.scalar_one_or_none()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found in tenant")

    if payload.name is not None: customer.name = payload.name
    if payload.email is not None: customer.email = payload.email
    if payload.phone is not None: customer.phone = payload.phone
    if payload.metadata is not None: customer.metadata_json = payload.metadata

    await session.commit()
    return {"status": "success", "customer_id": customer.id}
