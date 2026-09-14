import time
import re
import logging
from typing import Dict, Any, Optional, List
from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.models.business import Business
from backend.app.models.receptionist import (
    BusinessKnowledge,
    ReceptionistConversation,
    ReceptionistMessage,
    ReceptionistAction,
    HumanHandoff
)
from backend.app.receptionist.intent import ReceptionistIntent, classify_intent
from backend.app.receptionist.knowledge import business_knowledge_service
from backend.app.receptionist.tools import receptionist_tools
from backend.app.ai.llm_provider import get_llm_provider

logger = logging.getLogger(__name__)

class ReceptionistOrchestrator:
    """
    Central orchestration engine for the AI Receptionist.
    Coordinates multi-tenancy, conversation memory, business knowledge grounding,
    controlled tool calls, human escalation, and end-to-end latency tracking.
    """

    async def handle_message(
        self,
        session: AsyncSession,
        business_id: str,
        message: str,
        conversation_id: Optional[str] = None,
        customer_id: Optional[str] = None,
        customer_name: Optional[str] = None,
        customer_contact: Optional[str] = None,
        channel: str = "web_chat",
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Executes full receptionist pipeline for an incoming message.
        """
        start_time = time.time()
        meta = metadata or {}

        # 1. Multi-Tenant Validation: Verify business exists
        stmt_biz = select(Business).where(Business.id == business_id)
        res_biz = await session.execute(stmt_biz)
        business = res_biz.scalar_one_or_none()
        if not business:
            raise HTTPException(status_code=404, detail=f"Business #{business_id} not found.")

        # 2. Multi-Tenant Conversation Security: Ensure conversation belongs to this business
        conversation = None
        if conversation_id:
            stmt_conv = select(ReceptionistConversation).options(
                selectinload(ReceptionistConversation.messages)
            ).where(ReceptionistConversation.id == conversation_id)
            res_conv = await session.execute(stmt_conv)
            conversation = res_conv.scalar_one_or_none()
            if not conversation:
                raise HTTPException(status_code=404, detail=f"Conversation #{conversation_id} not found.")
            if conversation.business_id != business_id:
                # Strictly prevent Business A from accessing Business B's conversations
                raise HTTPException(
                    status_code=403,
                    detail="Unauthorized: Access to conversation belonging to another business is prohibited."
                )

        if not conversation:
            conversation = ReceptionistConversation(
                business_id=business_id,
                channel=channel,
                customer_id=customer_id,
                customer_name=customer_name,
                customer_contact=customer_contact,
                status="ACTIVE",
                metadata_json=meta
            )
            session.add(conversation)
            await session.flush()
        else:
            # Update customer details if new info arrived
            if customer_name and not conversation.customer_name:
                conversation.customer_name = customer_name
            if customer_contact and not conversation.customer_contact:
                conversation.customer_contact = customer_contact

        # 3. Conversation Memory: Load recent message turns
        recent_turns = []
        stmt_msgs = select(ReceptionistMessage).where(
            ReceptionistMessage.conversation_id == conversation.id
        ).order_by(ReceptionistMessage.created_at.desc()).limit(8)
        res_msgs = await session.execute(stmt_msgs)
        past_msgs = list(reversed(res_msgs.scalars().all()))
        for m in past_msgs:
            recent_turns.append({
                "role": m.role,
                "content": m.content,
                "intent": m.intent
            })

        # 4. Business Knowledge Retrieval & Strict Grounding Context
        knowledge = await business_knowledge_service.get_knowledge(session, business_id)
        grounded_context = business_knowledge_service.format_grounded_context(knowledge, business)

        # 5. Intent Classification
        classification = await classify_intent(
            message=message,
            conversation_history=recent_turns,
            business_context=grounded_context
        )

        # Extract customer contact details if mentioned directly in user message
        inferred_contact = customer_contact or conversation.customer_contact
        if not inferred_contact:
            email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', message)
            phone_match = re.search(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', message)
            if email_match:
                inferred_contact = email_match.group(0)
                conversation.customer_contact = inferred_contact
            elif phone_match:
                inferred_contact = phone_match.group(0)
                conversation.customer_contact = inferred_contact

        # Extract customer name if mentioned (e.g. "I am John Doe", "my name is Sarah")
        inferred_name = customer_name or conversation.customer_name
        if not inferred_name:
            name_match = re.search(r'(?:i am|my name is|this is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)', message, re.IGNORECASE)
            if name_match:
                inferred_name = name_match.group(1)
                conversation.customer_name = inferred_name

        # 6. Tool Determination & Safe Execution Layer
        executed_action: Optional[ReceptionistAction] = None
        action_name: Optional[str] = None
        action_status: Optional[str] = None
        action_details: Optional[Dict[str, Any]] = None
        tool_result_message: Optional[str] = None

        # Check for Human Escalation Triggers
        if classification.intent == ReceptionistIntent.HUMAN_REQUEST or classification.requires_human or classification.confidence < 0.60:
            reason = classification.escalation_reason or "Customer request or low confidence threshold."
            tool_res = await receptionist_tools.execute_tool(
                session=session,
                tool_name="requestHumanHandoff",
                raw_args={
                    "business_id": business_id,
                    "conversation_id": conversation.id,
                    "reason": reason,
                    "customer_message": message
                }
            )
            conversation.requires_human = True
            conversation.status = "NEEDS_HUMAN"
            conversation.human_reason = reason
            action_name = "requestHumanHandoff"
            action_status = tool_res.status
            action_details = tool_res.data
            tool_result_message = tool_res.message

            executed_action = ReceptionistAction(
                conversation_id=conversation.id,
                business_id=business_id,
                tool_name="requestHumanHandoff",
                action_type="WRITE",
                arguments={"reason": reason, "trigger": message},
                result=tool_res.data,
                status=tool_res.status,
                execution_latency_ms=tool_res.execution_latency_ms
            )
            session.add(executed_action)

        # Check for Hours Request
        elif classification.intent == ReceptionistIntent.HOURS_QUESTION:
            tool_res = await receptionist_tools.execute_tool(
                session=session,
                tool_name="getBusinessHours",
                raw_args={"business_id": business_id}
            )
            action_name = "getBusinessHours"
            action_status = tool_res.status
            action_details = tool_res.data
            tool_result_message = tool_res.message

            executed_action = ReceptionistAction(
                conversation_id=conversation.id,
                business_id=business_id,
                tool_name="getBusinessHours",
                action_type="READ",
                arguments={"business_id": business_id},
                result=tool_res.data,
                status=tool_res.status,
                execution_latency_ms=tool_res.execution_latency_ms
            )
            session.add(executed_action)

        # Check for Location Request
        elif classification.intent == ReceptionistIntent.LOCATION_QUESTION:
            tool_res = await receptionist_tools.execute_tool(
                session=session,
                tool_name="getBusinessInformation",
                raw_args={"business_id": business_id}
            )
            action_name = "getBusinessInformation"
            action_status = tool_res.status
            action_details = tool_res.data
            tool_result_message = tool_res.message

            executed_action = ReceptionistAction(
                conversation_id=conversation.id,
                business_id=business_id,
                tool_name="getBusinessInformation",
                action_type="READ",
                arguments={"business_id": business_id},
                result=tool_res.data,
                status=tool_res.status,
                execution_latency_ms=tool_res.execution_latency_ms
            )
            session.add(executed_action)

        # Check for Services / Pricing Request
        elif classification.intent in [ReceptionistIntent.PRICING_QUESTION, ReceptionistIntent.SERVICE_QUESTION]:
            tool_res = await receptionist_tools.execute_tool(
                session=session,
                tool_name="getServiceInformation",
                raw_args={"business_id": business_id}
            )
            action_name = "getServiceInformation"
            action_status = tool_res.status
            action_details = tool_res.data
            tool_result_message = tool_res.message

            executed_action = ReceptionistAction(
                conversation_id=conversation.id,
                business_id=business_id,
                tool_name="getServiceInformation",
                action_type="READ",
                arguments={"business_id": business_id},
                result=tool_res.data,
                status=tool_res.status,
                execution_latency_ms=tool_res.execution_latency_ms
            )
            session.add(executed_action)

        # Check for Appointment / Booking Execution
        elif classification.intent in [ReceptionistIntent.BOOKING_REQUEST, ReceptionistIntent.APPOINTMENT_REQUEST]:
            # If customer provided name, contact, and requested time, execute createAppointment (returns honest INTEGRATION_REQUIRED)
            if inferred_name and inferred_contact and any(w in message.lower() for w in ["tomorrow", "pm", "am", "tuesday", "monday", "wednesday", "thursday", "friday", "saturday", "sunday", "3:00"]):
                tool_res = await receptionist_tools.execute_tool(
                    session=session,
                    tool_name="createAppointment",
                    raw_args={
                        "business_id": business_id,
                        "customer_name": inferred_name,
                        "customer_contact": inferred_contact,
                        "requested_datetime": message,
                        "service_name": "Consultation / Service",
                        "notes": f"Channel: {channel}"
                    }
                )
                action_name = "createAppointment"
                action_status = tool_res.status
                action_details = tool_res.data
                tool_result_message = tool_res.message

                executed_action = ReceptionistAction(
                    conversation_id=conversation.id,
                    business_id=business_id,
                    tool_name="createAppointment",
                    action_type="WRITE",
                    arguments={"name": inferred_name, "contact": inferred_contact, "time": message},
                    result=tool_res.data,
                    status=tool_res.status,
                    execution_latency_ms=tool_res.execution_latency_ms
                )
                session.add(executed_action)
            else:
                # Check availability first
                tool_res = await receptionist_tools.execute_tool(
                    session=session,
                    tool_name="checkAvailability",
                    raw_args={"business_id": business_id, "requested_date": message}
                )
                action_name = "checkAvailability"
                action_status = tool_res.status
                action_details = tool_res.data
                tool_result_message = tool_res.message

                executed_action = ReceptionistAction(
                    conversation_id=conversation.id,
                    business_id=business_id,
                    tool_name="checkAvailability",
                    action_type="READ",
                    arguments={"requested_date": message},
                    result=tool_res.data,
                    status=tool_res.status,
                    execution_latency_ms=tool_res.execution_latency_ms
                )
                session.add(executed_action)

        # 7. Generate Natural, Grounded Customer Response
        reply_text = ""
        llm = get_llm_provider()

        # Build prompt with conversation history and grounded context
        system_instruction = (
            f"You are the autonomous AI Receptionist for {business.name}.\n"
            f"{grounded_context}\n\n"
            f"Current conversation status: {conversation.status}\n"
            f"Customer Intent: {classification.intent.value}\n"
            f"Tool Execution Info: {tool_result_message or 'No tool needed'}\n\n"
            f"Instructions:\n"
            f"- Reply warmly, professionally, and concisely (under 3 sentences).\n"
            f"- If tool executed successfully, communicate the findings or confirm the request accurately.\n"
            f"- If an action requires human integration, communicate honestly: explain the request was recorded and staff will confirm.\n"
            f"- NEVER fake calendar bookings or invent unverified information.\n"
            f"- If information is missing from verified business facts, say you don't have that information in records and offer staff connection."
        )

        # For write actions or integration-required actions, use verified tool message directly
        if action_status == "INTEGRATION_REQUIRED" and tool_result_message:
            reply_text = tool_result_message
        elif action_name == "requestHumanHandoff" and tool_result_message:
            reply_text = "Certainly. I am connecting you with a member of our team right now so they can assist you personally."
        else:
            history_context = "\n".join([f"{t['role'].capitalize()}: {t['content']}" for t in recent_turns])
            user_prompt = f"Previous Conversation:\n{history_context}\n\nCustomer: {message}\nAI Receptionist:"

            try:
                reply_text = await llm.generate_text(
                    prompt=user_prompt,
                    system_instruction=system_instruction,
                    operation_name="receptionist_generate"
                )
            except Exception as e:
                logger.error(f"Error during response generation: {e}")
                reply_text = "Thank you for reaching out. I have recorded your message and our team will get back to you shortly."

        # Ensure reply_text is clean
        if not reply_text or not reply_text.strip():
            reply_text = tool_result_message or "Thank you for reaching out to us. How can I assist you today?"

        total_latency_ms = int((time.time() - start_time) * 1000)

        # 8. Persist User and Assistant Messages
        user_msg = ReceptionistMessage(
            conversation_id=conversation.id,
            role="user",
            sender_type="CUSTOMER",
            content=message,
            intent=classification.intent.value,
            confidence=classification.confidence,
            latency_ms=total_latency_ms
        )
        session.add(user_msg)

        assistant_msg = ReceptionistMessage(
            conversation_id=conversation.id,
            role="assistant",
            sender_type="AI_RECEPTIONIST",
            content=reply_text,
            intent=classification.intent.value,
            confidence=classification.confidence,
            action_id=executed_action.id if executed_action else None,
            latency_ms=total_latency_ms
        )
        session.add(assistant_msg)

        # Commit conversation updates
        await session.commit()

        return {
            "conversation_id": conversation.id,
            "business_id": business_id,
            "reply": reply_text,
            "intent": classification.intent.value,
            "confidence": classification.confidence,
            "requires_human": conversation.requires_human,
            "human_reason": conversation.human_reason,
            "action": action_name,
            "action_status": action_status,
            "action_details": action_details,
            "latency_ms": total_latency_ms,
            "metadata": {
                "channel": channel,
                "status": conversation.status
            }
        }

receptionist_orchestrator = ReceptionistOrchestrator()
