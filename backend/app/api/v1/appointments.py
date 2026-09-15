"""
Rine Forge Systems V5 - Appointments API Router
Authoritative appointment scheduling, availability calculation, and conflict-free booking.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime, date
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.database import get_db
from backend.app.models.v5 import Appointment, Business, Customer, Service, Staff
from backend.app.auth.dependencies import get_current_tenant
from backend.app.appointments.engine import appointment_engine

router = APIRouter(prefix="/appointments", tags=["V5 Appointments"])

class CreateAppointmentRequest(BaseModel):
    customer_id: str
    service_id: Optional[str] = None
    staff_id: Optional[str] = None
    start_time: datetime
    end_time: datetime
    notes: Optional[str] = None

class CancelAppointmentRequest(BaseModel):
    reason: Optional[str] = None

class RescheduleAppointmentRequest(BaseModel):
    new_start_time: datetime
    new_end_time: datetime

@router.get("")
async def list_appointments(
    start_date: Optional[date] = None,
    status: Optional[str] = None,
    limit: int = Query(50, le=100),
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(get_current_tenant)
):
    """Lists appointments for current tenant with customer and service details."""
    query = (
        select(Appointment)
        .where(Appointment.business_id == tenant.id)
        .options(
            selectinload(Appointment.customer),
            selectinload(Appointment.service),
            selectinload(Appointment.staff)
        )
    )
    if start_date:
        start_dt = datetime.combine(start_date, datetime.min.time())
        query = query.where(Appointment.start_time >= start_dt)
    if status:
        query = query.where(Appointment.status == status)

    query = query.order_by(Appointment.start_time.asc()).limit(limit)
    res = await session.execute(query)
    appts = res.scalars().all()

    return [
        {
            "id": a.id,
            "customer": {"id": a.customer.id, "name": a.customer.name, "phone": a.customer.phone} if a.customer else None,
            "service": {"id": a.service.id, "name": a.service.name, "price": a.service.price} if a.service else None,
            "staff": {"id": a.staff.id, "name": a.staff.name} if a.staff else None,
            "start_time": a.start_time.isoformat(),
            "end_time": a.end_time.isoformat(),
            "status": a.status,
            "notes": a.notes
        }
        for a in appts
    ]

@router.get("/availability")
async def get_availability(
    target_date: Optional[date] = None,
    service_id: Optional[str] = None,
    staff_id: Optional[str] = None,
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(get_current_tenant)
):
    """Calculates factual open appointment slots based on business hours and existing bookings."""
    d = target_date or date.today()
    slots = await appointment_engine.get_available_slots(
        session=session,
        business_id=tenant.id,
        target_date=d,
        service_id=service_id,
        staff_id=staff_id
    )
    return {"date": d.isoformat(), "available_slots": slots}

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_appointment(
    payload: CreateAppointmentRequest,
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(get_current_tenant)
):
    """
    Creates an appointment atomically.
    Guarantees no double-booking: returns HTTP 409 Conflict if slot is occupied.
    """
    appt = await appointment_engine.create_appointment(
        session=session,
        business_id=tenant.id,
        customer_id=payload.customer_id,
        start_time=payload.start_time,
        end_time=payload.end_time,
        service_id=payload.service_id,
        staff_id=payload.staff_id,
        notes=payload.notes
    )
    return {
        "status": "success",
        "appointment_id": appt.id,
        "start_time": appt.start_time.isoformat(),
        "end_time": appt.end_time.isoformat(),
        "status_label": appt.status
    }

@router.post("/{appointment_id}/cancel")
async def cancel_appointment(
    appointment_id: str,
    payload: CancelAppointmentRequest,
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(get_current_tenant)
):
    """Cancels an appointment within the tenant scope."""
    appt = await appointment_engine.cancel_appointment(
        session=session,
        business_id=tenant.id,
        appointment_id=appointment_id,
        reason=payload.reason
    )
    return {"status": "success", "appointment_id": appt.id, "status_label": appt.status}

@router.post("/{appointment_id}/reschedule")
async def reschedule_appointment(
    appointment_id: str,
    payload: RescheduleAppointmentRequest,
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(get_current_tenant)
):
    """Reschedules an appointment to a new conflict-free time slot."""
    # Cancel old appointment
    old_appt = await appointment_engine.cancel_appointment(
        session=session,
        business_id=tenant.id,
        appointment_id=appointment_id,
        reason="Rescheduled by customer or staff"
    )
    # Book new appointment
    new_appt = await appointment_engine.create_appointment(
        session=session,
        business_id=tenant.id,
        customer_id=old_appt.customer_id,
        start_time=payload.new_start_time,
        end_time=payload.new_end_time,
        service_id=old_appt.service_id,
        staff_id=old_appt.staff_id,
        notes=f"Rescheduled from {old_appt.id}"
    )
    return {
        "status": "success",
        "rescheduled_appointment_id": new_appt.id,
        "new_start_time": new_appt.start_time.isoformat(),
        "new_end_time": new_appt.end_time.isoformat()
    }
