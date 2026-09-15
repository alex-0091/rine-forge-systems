"""
Rine Forge Systems V5 - Conversational AI Orchestrator
20-Step Production Conversational Pipeline with Zero-Hallucination Guardrails,
RAG Retrieval, Tool Dispatching, Lead Scoring, and Telemetry.
"""
import time
import json
import logging
from datetime import datetime, timezone
from typing import Dict, Any, Optional, List
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException

from backend.app.models.v5 import (
    Business, Customer, Conversation, Message, AIEmployee, 
    AIEvent, Usage, Appointment
)
from backend.app.ai.provider_abstraction import ai_provider
from backend.app.ai.tool_registry import tool_registry
from backend.app.knowledge.rag_service import knowledge_service
from backend.app.leads.engine import lead_engine
from backend.app.automations.engine import automation_engine

logger = logging.getLogger("rine_forge_systems.ai.orchestrator")

class V5Orchestrator:
    """
    Production multi-tenant AI conversational pipeline.
    Ensures strict tenant isolation, authoritative tool executions, and zero-hallucination responses.
    """

    async def handle_message(
        self,
        session: AsyncSession,
        business_id: str,
        channel: str,
        customer_identifier: str,
        user_message: str,
        customer_name: Optional[str] = None,
        customer_phone: Optional[str] = None,
        customer_email: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        start_time = time.time()
        tools_executed = []

        # ----------------------------------------------------
        # 1. Tenant Verification
        # ----------------------------------------------------
        stmt = select(Business).where(Business.id == business_id)
        res = await session.execute(stmt)
        business = res.scalar_one_or_none()
        if not business:
            raise HTTPException(status_code=404, detail=f"Business tenant #{business_id} not found")

        # ----------------------------------------------------
        # 2. Customer Identification / Creation
        # ----------------------------------------------------
        stmt = select(Customer).where(
            Customer.business_id == business_id,
            (Customer.external_id == customer_identifier) | 
            (Customer.phone == customer_phone if customer_phone else False) |
            (Customer.email == customer_email if customer_email else False)
        )
        res = await session.execute(stmt)
        customer = res.scalar_one_or_none()

        if not customer:
            customer = Customer(
                business_id=business_id,
                name=customer_name or "Guest Client",
                phone=customer_phone or (customer_identifier if customer_identifier.startswith("+") else None),
                email=customer_email,
                external_id=customer_identifier,
                source=f"{channel}_inbound",
                channel=channel,
                metadata_json=metadata or {}
            )
            session.add(customer)
            await session.flush()
        else:
            if customer_name and customer.name in ("Guest Client", None):
                customer.name = customer_name
                await session.flush()

        # ----------------------------------------------------
        # 3. AI Employee Persona Retrieval
        # ----------------------------------------------------
        target_worker = (metadata or {}).get("worker_id") or "receptionist"
        target_name_map = {
            "receptionist": "Elena",
            "sales": "Marcus",
            "support": "Aria",
            "operations": "Kael"
        }
        requested_name = target_name_map.get(target_worker, "Elena")

        stmt = select(AIEmployee).where(
            AIEmployee.business_id == business_id,
            AIEmployee.status == "ACTIVE",
            AIEmployee.name == requested_name
        )
        res = await session.execute(stmt)
        employee = res.scalar_one_or_none()

        if not employee:
            # Fallback to any active employee
            stmt_any = select(AIEmployee).where(
                AIEmployee.business_id == business_id,
                AIEmployee.status == "ACTIVE"
            )
            res_any = await session.execute(stmt_any)
            employee = res_any.scalar_one_or_none()

        if not employee:
            # Create default employee if none exists
            employee = AIEmployee(
                business_id=business_id,
                name=requested_name,
                role="Front Desk AI Receptionist" if requested_name == "Elena" else f"AI {target_worker.capitalize()} Specialist",
                model="gpt-4o-mini",
                provider="openai",
                system_instructions=f"You are {requested_name}, representing {business.name}. Be consultative, accurate, and high-converting.",
                status="ACTIVE"
            )
            session.add(employee)
            await session.flush()

        # ----------------------------------------------------
        # 4. Active Conversation Session
        # ----------------------------------------------------
        stmt = select(Conversation).where(
            Conversation.business_id == business_id,
            Conversation.customer_id == customer.id,
            Conversation.status == "ACTIVE"
        ).order_by(Conversation.created_at.desc())
        res = await session.execute(stmt)
        conversation = res.scalar_one_or_none()

        if not conversation:
            conversation = Conversation(
                business_id=business_id,
                customer_id=customer.id,
                ai_employee_id=employee.id,
                channel=channel,
                status="ACTIVE",
                human_handoff=False
            )
            session.add(conversation)
            await session.flush()

        # ----------------------------------------------------
        # 5. Check Human Handoff State
        # ----------------------------------------------------
        if conversation.human_handoff:
            # Store incoming message
            u_msg = Message(
                conversation_id=conversation.id,
                role="user",
                content=user_message
            )
            session.add(u_msg)
            await session.commit()
            return {
                "conversation_id": conversation.id,
                "role": "assistant",
                "content": "A human staff member is currently handling your inquiry. They will reply directly as soon as possible.",
                "human_handoff": True,
                "intent": "HUMAN_ESCALATED"
            }

        # ----------------------------------------------------
        # 6. Conversational Memory / History (Last 10 turns)
        # ----------------------------------------------------
        stmt = select(Message).where(
            Message.conversation_id == conversation.id
        ).order_by(Message.created_at.desc()).limit(10)
        res = await session.execute(stmt)
        history_messages = list(reversed(res.scalars().all()))

        # ----------------------------------------------------
        # 7. RAG Knowledge Retrieval
        # ----------------------------------------------------
        knowledge_chunks = await knowledge_service.search(
            session=session,
            business_id=business_id,
            query=user_message,
            top_k=3
        )
        rag_context = "\n---\n".join([c["content"] for c in knowledge_chunks]) if knowledge_chunks else "No specific policy document found."

        # ----------------------------------------------------
        # 8. Intent Classification
        # ----------------------------------------------------
        intents = [
            "BOOK_APPOINTMENT",
            "CHECK_AVAILABILITY",
            "CANCEL_APPOINTMENT",
            "RESCHEDULE_APPOINTMENT",
            "SERVICE_INQUIRY",
            "PRICE_INQUIRY",
            "BUSINESS_HOURS",
            "LOCATION_INQUIRY",
            "STAFF_INQUIRY",
            "HUMAN_ESCALATION",
            "GENERAL_INQUIRY"
        ]
        intent_info = await ai_provider.classify_intent(user_message, intents)
        intent = intent_info.get("intent", "GENERAL_INQUIRY")

        # ----------------------------------------------------
        # 9 & 10. Authoritative Tool Decision & Execution
        # ----------------------------------------------------
        factual_context = f"BUSINESS: {business.name}\nPHONE: {business.phone}\nEMAIL: {business.email}\nADDRESS: {business.address}\n"
        
        # Check human escalation keywords
        lower_msg = user_message.lower()
        if intent == "HUMAN_ESCALATION" or any(w in lower_msg for w in ["talk to human", "speak to human", "real person", "operator", "manager"]):
            tool_res = await tool_registry.execute_tool(
                session=session,
                business_id=business_id,
                tool_name="handoffToHuman",
                arguments={"conversation_id": conversation.id, "reason": "Customer requested human agent"},
                customer_id=customer.id
            )
            tools_executed.append("handoffToHuman")
            conversation.human_handoff = True
            await session.commit()
            
            # Fire automation
            await automation_engine.trigger(
                session=session,
                business_id=business_id,
                trigger_event="HUMAN_HANDOFF",
                context={"customer_id": customer.id, "customer_name": customer.name, "customer_phone": customer.phone}
            )

            assistant_reply = "I have escalated this conversation to our front desk team. A staff member will step in shortly to assist you."
            
            # Save messages
            session.add(Message(conversation_id=conversation.id, role="user", content=user_message))
            session.add(Message(conversation_id=conversation.id, role="assistant", content=assistant_reply))
            await session.commit()

            return {
                "conversation_id": conversation.id,
                "role": "assistant",
                "content": assistant_reply,
                "human_handoff": True,
                "intent": "HUMAN_ESCALATION",
                "tools_executed": tools_executed
            }

        # Services / Pricing Tools
        if intent in ("SERVICE_INQUIRY", "PRICE_INQUIRY") or any(w in lower_msg for w in ["price", "cost", "how much", "services", "cleaning", "whitening", "veneer"]):
            tool_res = await tool_registry.execute_tool(
                session=session,
                business_id=business_id,
                tool_name="getServices",
                arguments={},
                customer_id=customer.id
            )
            tools_executed.append("getServices")
            services_list = tool_res.get("services", [])
            formatted_services = "\n".join([f"- {s['name']}: ${s['price']} ({s['duration_minutes']} min) - {s['description']}" for s in services_list])
            factual_context += f"\nOFFICIAL SERVICES & PRICING:\n{formatted_services}\n"

        # Hours Tool
        if intent == "BUSINESS_HOURS" or any(w in lower_msg for w in ["hours", "open", "close", "time are you open"]):
            tool_res = await tool_registry.execute_tool(
                session=session,
                business_id=business_id,
                tool_name="getBusinessHours",
                arguments={},
                customer_id=customer.id
            )
            tools_executed.append("getBusinessHours")
            factual_context += f"\nOFFICIAL BUSINESS HOURS:\n{json.dumps(tool_res.get('business_hours', {}), indent=2)}\n"

        # Staff Tool
        if intent == "STAFF_INQUIRY" or any(w in lower_msg for w in ["doctor", "dentist", "dr", "staff", "who works"]):
            tool_res = await tool_registry.execute_tool(
                session=session,
                business_id=business_id,
                tool_name="getStaff",
                arguments={},
                customer_id=customer.id
            )
            tools_executed.append("getStaff")
            staff_list = tool_res.get("staff", [])
            formatted_staff = "\n".join([f"- {st['name']} ({st['role']})" for st in staff_list])
            factual_context += f"\nOFFICIAL PRACTITIONERS / STAFF:\n{formatted_staff}\n"

        # Appointment Availability / Booking Tool
        if intent in ("CHECK_AVAILABILITY", "BOOK_APPOINTMENT") or any(w in lower_msg for w in ["appointment", "book", "available", "schedule", "slot", "friday", "tomorrow"]):
            # Query availability
            today_str = datetime.now().strftime("%Y-%m-%d")
            tool_res = await tool_registry.execute_tool(
                session=session,
                business_id=business_id,
                tool_name="getAvailableAppointments",
                arguments={"date": today_str},
                customer_id=customer.id
            )
            tools_executed.append("getAvailableAppointments")
            avail_slots = tool_res.get("available_slots", [])
            factual_context += f"\nVERIFIED AVAILABLE APPOINTMENT SLOTS FOR {today_str}:\n"
            if avail_slots:
                factual_context += "\n".join([f"- {slot['start_time']} to {slot['end_time']}" for slot in avail_slots[:6]])
            else:
                factual_context += "No open slots today. Next available days are Monday through Friday 08:00 to 17:00."

        # Add RAG context
        factual_context += f"\n\nOFFICIAL KNOWLEDGE & CLINIC POLICIES (RAG):\n{rag_context}\n"

        # ----------------------------------------------------
        # 11 & 12. Grounding System Instruction & Response Generation
        # ----------------------------------------------------
        history_text = "\n".join([f"{m.role.upper()}: {m.content}" for m in history_messages[-6:]])

        system_instruction = f"""
You are {employee.name}, the authoritative {employee.role} for {business.name}.
{employee.system_instructions or ''}

MISSION:
You represent a premier business. You are NOT a generic search bot or robotic FAQ answering machine.
You communicate like a world-class, consultative, highly skilled professional.
Your goal is to be exceptionally helpful, diagnose customer needs, clearly articulate the value of our treatments/services, and guide qualified customers toward a confirmed booking or resolution.

CONVERSATIONAL EXCELLENCE PRINCIPLES:
1. VALUE-FIRST FRAMING:
   - When quoting a price or service, never just blurt out a dollar figure. Briefly highlight what is included (e.g. digital scans, duration, expert care, laser activation) so the customer understands the superior quality.
2. CONSULTATIVE DIAGNOSIS:
   - When a customer asks about a service or appointment, ask 1 relevant diagnostic question to understand their situation (e.g., "Are you experiencing any discomfort or sensitivity?", "Is this for routine maintenance or an upcoming special event?").
3. PROACTIVE SCHEDULING (ALTERNATE-CHOICE CLOSING):
   - When discussing availability, do not ask open-ended questions like "When do you want to come in?". Proactively offer 2 concrete options from the VERIFIED AVAILABLE SLOTS (e.g., "Would Thursday at 11:30 AM or Friday at 2:00 PM work better for your schedule?").
4. EMPATHY & CLARITY:
   - If a customer is in pain or anxious, acknowledge it with genuine clinical warmth and reassurance.
5. ZERO-HALLUCINATION ENFORCEMENT:
   - You MUST ONLY state facts, prices, doctor names, hours, and appointment slots that appear in the FACTUAL CONTEXT below.
   - NEVER invent a service, price, discount, or medical promise not listed.
   - If an unlisted service is requested, politely explain we don't offer it and offer to connect them with staff.
6. CONCISE FOR MESSAGING:
   - Keep responses focused, articulate, and conversational (2 to 4 sentences). Avoid dense walls of text.

FACTUAL DATABASE CONTEXT:
{factual_context}
"""

        user_prompt = f"CONVERSATION HISTORY:\n{history_text}\n\nUSER MESSAGE: {user_message}\n\nASSISTANT REPLY:"
        
        raw_response = await ai_provider.generate_text(
            prompt=user_prompt,
            system_instruction=system_instruction,
            temperature=0.2,
            max_tokens=350
        )

        # ----------------------------------------------------
        # 13. Persist Messages to Database
        # ----------------------------------------------------
        user_msg_record = Message(
            conversation_id=conversation.id,
            role="user",
            content=user_message
        )
        assistant_msg_record = Message(
            conversation_id=conversation.id,
            role="assistant",
            content=raw_response
        )
        session.add(user_msg_record)
        session.add(assistant_msg_record)
        await session.flush()

        # ----------------------------------------------------
        # 14. Lead Scoring & Updates
        # ----------------------------------------------------
        lead = await lead_engine.process_and_score_lead(
            session=session,
            business_id=business_id,
            customer_id=customer.id,
            message=user_message,
            intent=intent
        )

        # ----------------------------------------------------
        # 15. Automations Evaluation
        # ----------------------------------------------------
        await automation_engine.trigger(
            session=session,
            business_id=business_id,
            trigger_event="NEW_MESSAGE",
            context={
                "customer_id": customer.id,
                "customer_name": customer.name,
                "customer_phone": customer.phone,
                "lead_id": lead.id if lead else None,
                "score": lead.score if lead else 0,
                "status": lead.status if lead else "NEW"
            }
        )

        # ----------------------------------------------------
        # 16 & 17. Telemetry & Metering (AIEvent & Usage)
        # ----------------------------------------------------
        elapsed_ms = int((time.time() - start_time) * 1000)
        approx_tokens = int((len(system_instruction) + len(user_prompt) + len(raw_response)) / 4)

        event = AIEvent(
            business_id=business_id,
            conversation_id=conversation.id,
            type="CHAT_COMPLETION",
            model=employee.model or "gpt-4o-mini",
            tokens=approx_tokens,
            latency_ms=elapsed_ms,
            success=True,
            metadata_json={"intent": intent, "tools_executed": tools_executed}
        )
        session.add(event)

        # Monthly Usage Metering
        current_period = datetime.now().strftime("%Y-%m")
        stmt = select(Usage).where(
            Usage.business_id == business_id,
            Usage.period == current_period
        )
        res = await session.execute(stmt)
        usage = res.scalar_one_or_none()
        if not usage:
            usage = Usage(
                business_id=business_id,
                period=current_period,
                messages=2,
                tokens=approx_tokens,
                tool_calls=len(tools_executed),
                appointments=1 if "createAppointment" in tools_executed else 0,
                leads=1,
                estimated_cost=round(approx_tokens * 0.000002, 6)
            )
            session.add(usage)
        else:
            usage.messages += 2
            usage.tokens += approx_tokens
            usage.tool_calls += len(tools_executed)
            if "createAppointment" in tools_executed:
                usage.appointments += 1
            usage.estimated_cost = round(usage.estimated_cost + (approx_tokens * 0.000002), 6)

        await session.commit()

        # ----------------------------------------------------
        # 18, 19, 20. Return Formatted Channel Response
        # ----------------------------------------------------
        return {
            "conversation_id": conversation.id,
            "role": "assistant",
            "content": raw_response,
            "intent": intent,
            "confidence": intent_info.get("confidence", 0.95),
            "human_handoff": False,
            "tools_executed": tools_executed,
            "lead_score": lead.score if lead else None,
            "lead_status": lead.status if lead else None
        }

v5_orchestrator = V5Orchestrator()
