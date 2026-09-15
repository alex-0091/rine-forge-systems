import logging
from datetime import datetime, date
from typing import Dict, Any, Optional, Callable, Awaitable
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException

from backend.app.models.v5 import (
    Business, Service, Staff, Appointment, Customer, 
    Lead, Task, Notification, Conversation
)
from backend.app.knowledge.rag_service import knowledge_service
from backend.app.appointments.engine import appointment_engine
from backend.app.leads.engine import lead_engine

logger = logging.getLogger("rine_forge_systems.ai.tools")

class ToolRegistry:
    """
    Secure registry of authorized backend tools.
    Guarantees strict separation between AI reasoning and database state:
    TOOL REQUEST -> INPUT VALIDATION -> BACKEND DB EXECUTION -> RESULT -> AI REASONING
    """

    async def execute_tool(
        self,
        session: AsyncSession,
        business_id: str,
        tool_name: str,
        arguments: Dict[str, Any],
        customer_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Dispatches and executes an authorized tool within the tenant business_id scope.
        """
        logger.info(f"[Tool Execution] Business #{business_id} -> {tool_name}({arguments})")

        try:
            # 1. searchKnowledge
            if tool_name == "searchKnowledge":
                query = arguments.get("query", "")
                chunks = await knowledge_service.search(session, business_id, query=query, top_k=3)
                return {"status": "success", "results": [c["content"] for c in chunks]}

            # 2. getBusinessInformation
            elif tool_name == "getBusinessInformation":
                stmt = select(Business).where(Business.id == business_id)
                res = await session.execute(stmt)
                biz = res.scalar_one_or_none()
                if not biz:
                    return {"status": "error", "message": "Business not found"}
                return {
                    "status": "success",
                    "name": biz.name,
                    "industry": biz.industry,
                    "description": biz.description,
                    "phone": biz.phone,
                    "email": biz.email,
                    "address": biz.address,
                    "timezone": biz.timezone
                }

            # 3. getBusinessHours
            elif tool_name == "getBusinessHours":
                stmt = select(Business).where(Business.id == business_id)
                res = await session.execute(stmt)
                biz = res.scalar_one_or_none()
                return {"status": "success", "business_hours": biz.business_hours if biz else {}}

            # 4. getServices
            elif tool_name == "getServices":
                stmt = select(Service).where(Service.business_id == business_id, Service.active == True)
                res = await session.execute(stmt)
                services = res.scalars().all()
                return {
                    "status": "success",
                    "services": [
                        {
                            "id": s.id,
                            "name": s.name,
                            "description": s.description,
                            "price": s.price,
                            "duration_minutes": s.duration,
                            "currency": s.currency
                        }
                        for s in services
                    ]
                }

            # 5. getStaff
            elif tool_name == "getStaff":
                stmt = select(Staff).where(Staff.business_id == business_id, Staff.active == True)
                res = await session.execute(stmt)
                staff = res.scalars().all()
                return {
                    "status": "success",
                    "staff": [{"id": st.id, "name": st.name, "role": st.role} for st in staff]
                }

            # 6. getAvailableAppointments
            elif tool_name == "getAvailableAppointments":
                date_str = arguments.get("date")
                target_date = date.fromisoformat(date_str) if date_str else date.today()
                service_id = arguments.get("service_id")
                staff_id = arguments.get("staff_id")
                slots = await appointment_engine.get_available_slots(
                    session, business_id, target_date, service_id=service_id, staff_id=staff_id
                )
                return {"status": "success", "date": target_date.isoformat(), "available_slots": slots}

            # 7. createAppointment
            elif tool_name == "createAppointment":
                cid = customer_id or arguments.get("customer_id")
                if not cid:
                    return {"status": "error", "message": "Customer ID required to book appointment"}

                start_dt = datetime.fromisoformat(arguments["start_time"])
                end_dt = datetime.fromisoformat(arguments["end_time"])
                appt = await appointment_engine.create_appointment(
                    session=session,
                    business_id=business_id,
                    customer_id=cid,
                    start_time=start_dt,
                    end_time=end_dt,
                    service_id=arguments.get("service_id"),
                    staff_id=arguments.get("staff_id"),
                    notes=arguments.get("notes")
                )
                return {
                    "status": "success",
                    "appointment_id": appt.id,
                    "start_time": appt.start_time.isoformat(),
                    "end_time": appt.end_time.isoformat(),
                    "status_label": appt.status
                }

            # 8. cancelAppointment
            elif tool_name == "cancelAppointment":
                appt_id = arguments["appointment_id"]
                appt = await appointment_engine.cancel_appointment(
                    session, business_id, appt_id, reason=arguments.get("reason")
                )
                return {"status": "success", "appointment_id": appt.id, "status_label": "CANCELLED"}

            # 9. rescheduleAppointment
            elif tool_name == "rescheduleAppointment":
                appt_id = arguments["appointment_id"]
                new_start = datetime.fromisoformat(arguments["new_start_time"])
                new_end = datetime.fromisoformat(arguments["new_end_time"])
                await appointment_engine.cancel_appointment(session, business_id, appt_id, reason="Rescheduled")
                cid = customer_id or arguments.get("customer_id")
                new_appt = await appointment_engine.create_appointment(
                    session, business_id, cid, new_start, new_end, notes=f"Rescheduled from {appt_id}"
                )
                return {"status": "success", "rescheduled_appointment_id": new_appt.id}

            # 10. createLead
            elif tool_name == "createLead":
                cid = customer_id or arguments.get("customer_id")
                msg = arguments.get("message", "Customer inquiry")
                lead = await lead_engine.process_and_score_lead(
                    session, business_id, cid, message=msg, intent=arguments.get("intent", "GENERAL_INQUIRY")
                )
                return {"status": "success", "lead_id": lead.id, "score": lead.score, "status_label": lead.status}

            # 11. updateLead
            elif tool_name == "updateLead":
                lead_id = arguments["lead_id"]
                stmt = select(Lead).where(Lead.id == lead_id, Lead.business_id == business_id)
                res = await session.execute(stmt)
                lead = res.scalar_one_or_none()
                if lead:
                    if "status" in arguments: lead.status = arguments["status"]
                    if "notes" in arguments: lead.notes = arguments["notes"]
                    await session.commit()
                    return {"status": "success", "lead_id": lead.id}
                return {"status": "error", "message": "Lead not found"}

            # 12. getCustomer
            elif tool_name == "getCustomer":
                cid = customer_id or arguments.get("customer_id")
                stmt = select(Customer).where(Customer.id == cid, Customer.business_id == business_id)
                res = await session.execute(stmt)
                cust = res.scalar_one_or_none()
                if not cust:
                    return {"status": "error", "message": "Customer not found"}
                return {"status": "success", "name": cust.name, "phone": cust.phone, "email": cust.email}

            # 13. updateCustomer
            elif tool_name == "updateCustomer":
                cid = customer_id or arguments.get("customer_id")
                stmt = select(Customer).where(Customer.id == cid, Customer.business_id == business_id)
                res = await session.execute(stmt)
                cust = res.scalar_one_or_none()
                if cust:
                    if "name" in arguments: cust.name = arguments["name"]
                    if "phone" in arguments: cust.phone = arguments["phone"]
                    if "email" in arguments: cust.email = arguments["email"]
                    await session.commit()
                    return {"status": "success", "customer_id": cust.id}
                return {"status": "error", "message": "Customer not found"}

            # 14. sendNotification
            elif tool_name == "sendNotification":
                notif = Notification(
                    business_id=business_id,
                    type=arguments.get("type", "EMAIL"),
                    recipient=arguments.get("recipient", "admin@rineforge.ai"),
                    message=arguments.get("message", "Customer update"),
                    status="SENT"
                )
                session.add(notif)
                await session.commit()
                return {"status": "success", "notification_id": notif.id}

            # 15. createTask
            elif tool_name == "createTask":
                task = Task(
                    business_id=business_id,
                    customer_id=customer_id or arguments.get("customer_id"),
                    type=arguments.get("type", "FOLLOW_UP"),
                    scheduled_for=datetime.fromisoformat(arguments.get("scheduled_for", datetime.now().isoformat())),
                    payload=arguments.get("payload", {})
                )
                session.add(task)
                await session.commit()
                return {"status": "success", "task_id": task.id}

            # 16. handoffToHuman
            elif tool_name == "handoffToHuman":
                conv_id = arguments.get("conversation_id")
                if conv_id:
                    stmt = select(Conversation).where(Conversation.id == conv_id, Conversation.business_id == business_id)
                    res = await session.execute(stmt)
                    conv = res.scalar_one_or_none()
                    if conv:
                        conv.human_handoff = True
                        conv.status = "PAUSED"
                        await session.commit()
                return {"status": "success", "human_handoff": True, "reason": arguments.get("reason")}

            else:
                return {"status": "error", "message": f"Unknown tool: {tool_name}"}

        except Exception as e:
            logger.error(f"Error executing tool {tool_name}: {e}", exc_info=True)
            return {"status": "error", "error": str(e)}

tool_registry = ToolRegistry()
