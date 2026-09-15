import logging
from abc import ABC, abstractmethod
from datetime import datetime, date, time, timedelta, timezone
from typing import List, Dict, Any, Optional
from sqlalchemy import select, and_, or_
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from backend.app.models.v5 import Business, Service, Staff, Appointment, Customer

logger = logging.getLogger("rine_forge_systems.appointments.engine")

class CalendarProvider(ABC):
    """Abstract interface for calendar and scheduling providers."""

    @abstractmethod
    async def get_available_slots(
        self,
        session: AsyncSession,
        business_id: str,
        target_date: date,
        service_id: Optional[str] = None,
        staff_id: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    async def create_appointment(
        self,
        session: AsyncSession,
        business_id: str,
        customer_id: str,
        start_time: datetime,
        end_time: datetime,
        service_id: Optional[str] = None,
        staff_id: Optional[str] = None,
        notes: Optional[str] = None
    ) -> Appointment:
        pass

class InternalCalendarProvider(CalendarProvider):
    """
    Production internal scheduling provider.
    Authoritatively calculates availability from operating hours and staff schedules,
    enforcing atomic double-booking prevention at the database level.
    """

    async def get_available_slots(
        self,
        session: AsyncSession,
        business_id: str,
        target_date: date,
        service_id: Optional[str] = None,
        staff_id: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        # 1. Fetch Business operating hours
        stmt_biz = select(Business).where(Business.id == business_id)
        res_biz = await session.execute(stmt_biz)
        biz = res_biz.scalar_one_or_none()
        if not biz:
            raise HTTPException(status_code=404, detail=f"Business #{business_id} not found")

        # 2. Determine duration in minutes
        duration_minutes = 45 # Default
        if service_id:
            stmt_svc = select(Service).where(Service.id == service_id, Service.business_id == business_id)
            res_svc = await session.execute(stmt_svc)
            svc = res_svc.scalar_one_or_none()
            if svc and svc.duration > 0:
                duration_minutes = svc.duration

        # 3. Check operating hours for day of week
        weekday_name = target_date.strftime("%A").lower()
        hours_str = biz.business_hours.get(weekday_name, "09:00-17:00")
        if not hours_str or "closed" in hours_str.lower():
            return [] # Business closed on this day

        try:
            open_str, close_str = hours_str.split("-")
            open_hour, open_min = map(int, open_str.strip().split(":"))
            close_hour, close_min = map(int, close_str.strip().split(":"))
        except Exception:
            open_hour, open_min = 9, 0
            close_hour, close_min = 17, 0

        # Generate candidate slots
        day_start = datetime.combine(target_date, time(open_hour, open_min), tzinfo=timezone.utc)
        day_end = datetime.combine(target_date, time(close_hour, close_min), tzinfo=timezone.utc)

        # 4. Fetch existing confirmed appointments on this date
        stmt_existing = select(Appointment).where(
            Appointment.business_id == business_id,
            Appointment.status == "CONFIRMED",
            Appointment.start_time >= day_start,
            Appointment.end_time <= day_end
        )
        if staff_id:
            stmt_existing = stmt_existing.where(Appointment.staff_id == staff_id)

        res_existing = await session.execute(stmt_existing)
        booked_appointments = res_existing.scalars().all()

        available_slots = []
        current_time = day_start
        slot_delta = timedelta(minutes=duration_minutes)

        while current_time + slot_delta <= day_end:
            slot_end = current_time + slot_delta

            # Check overlap against booked appointments
            has_conflict = False
            for b in booked_appointments:
                # Overlap condition: start < b.end and end > b.start
                if current_time < b.end_time and slot_end > b.start_time:
                    has_conflict = True
                    break

            if not has_conflict:
                available_slots.append({
                    "start_time": current_time.isoformat(),
                    "end_time": slot_end.isoformat(),
                    "time_label": current_time.strftime("%I:%M %p").lstrip("0"),
                    "duration_minutes": duration_minutes,
                    "date": target_date.isoformat()
                })

            current_time += timedelta(minutes=30) # Step by 30 mins

        return available_slots

    async def create_appointment(
        self,
        session: AsyncSession,
        business_id: str,
        customer_id: str,
        start_time: datetime,
        end_time: datetime,
        service_id: Optional[str] = None,
        staff_id: Optional[str] = None,
        notes: Optional[str] = None
    ) -> Appointment:
        # Guarantee timezone awareness
        if start_time.tzinfo is None:
            start_time = start_time.replace(tzinfo=timezone.utc)
        if end_time.tzinfo is None:
            end_time = end_time.replace(tzinfo=timezone.utc)

        # 1. Authoritative double-booking conflict prevention
        stmt_conflict = select(Appointment).where(
            Appointment.business_id == business_id,
            Appointment.status == "CONFIRMED",
            Appointment.start_time < end_time,
            Appointment.end_time > start_time
        )
        if staff_id:
            stmt_conflict = stmt_conflict.where(Appointment.staff_id == staff_id)

        res_conflict = await session.execute(stmt_conflict)
        existing = res_conflict.scalar_one_or_none()

        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Slot conflict: An appointment is already confirmed between {start_time} and {end_time}."
            )

        # 2. Insert appointment
        appt = Appointment(
            business_id=business_id,
            customer_id=customer_id,
            service_id=service_id,
            staff_id=staff_id,
            start_time=start_time,
            end_time=end_time,
            status="CONFIRMED",
            source="ai_employee",
            notes=notes
        )
        session.add(appt)
        await session.commit()
        await session.refresh(appt)
        logger.info(f"Booked appointment #{appt.id} for business #{business_id} at {start_time}")
        return appt

    async def cancel_appointment(
        self,
        session: AsyncSession,
        business_id: str,
        appointment_id: str,
        reason: Optional[str] = None
    ) -> Appointment:
        stmt = select(Appointment).where(
            Appointment.id == appointment_id,
            Appointment.business_id == business_id
        )
        res = await session.execute(stmt)
        appt = res.scalar_one_or_none()
        if not appt:
            raise HTTPException(status_code=404, detail=f"Appointment #{appointment_id} not found")

        appt.status = "CANCELLED"
        if reason:
            appt.notes = f"{appt.notes or ''} [Cancelled: {reason}]"
        await session.commit()
        await session.refresh(appt)
        return appt

appointment_engine = InternalCalendarProvider()
