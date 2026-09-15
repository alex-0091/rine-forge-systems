import logging
from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, Query, Request, Response
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.config import settings
from backend.app.database import get_db
from backend.app.models.receptionist import ReceptionistConversation
from backend.app.api.receptionist import ensure_demo_business, DEMO_BUSINESS_ID
from backend.app.receptionist.orchestrator import receptionist_orchestrator
from backend.app.channels.whatsapp.parser import parse_meta_webhook
from backend.app.channels.whatsapp.service import whatsapp_service

logger = logging.getLogger("rine_forge_systems.channels.whatsapp.router")

router = APIRouter(prefix="/api/whatsapp", tags=["WhatsApp Channel"])


@router.get("/webhook")
async def verify_webhook(
    hub_mode: Optional[str] = Query(None, alias="hub.mode"),
    hub_challenge: Optional[str] = Query(None, alias="hub.challenge"),
    hub_verify_token: Optional[str] = Query(None, alias="hub.verify_token"),
):
    """
    Meta WhatsApp Cloud API Webhook verification challenge.
    Meta sends GET request with hub.mode='subscribe', hub.verify_token, and hub.challenge.
    Must return the exact plain-text challenge when verify token matches.
    """
    expected_token = settings.META_VERIFY_TOKEN

    if hub_mode == "subscribe" and hub_verify_token == expected_token:
        logger.info("[WhatsApp Webhook] Verification successful.")
        return Response(content=hub_challenge or "", media_type="text/plain", status_code=200)

    logger.warning(f"[WhatsApp Webhook] Verification failed: received '{hub_verify_token}', expected '{expected_token}'")
    return Response(content="Forbidden: Invalid verification token", media_type="text/plain", status_code=403)


@router.post("/webhook")
async def receive_webhook(
    request: Request,
    session: AsyncSession = Depends(get_db)
):
    """
    Receives incoming webhook events from Meta WhatsApp Cloud API.
    Parses inbound messages, routes them into Elena AI Receptionist orchestrator,
    and returns a 200 OK immediately to satisfy Meta's webhook timeout requirement.
    """
    try:
        payload: Dict[str, Any] = await request.json()
    except Exception as e:
        logger.warning(f"[WhatsApp Webhook] Invalid JSON payload received: {e}")
        return {"status": "error", "message": "Invalid JSON"}

    # Parse raw Meta payload into normalized message envelopes
    normalized_messages = parse_meta_webhook(payload)

    if not normalized_messages:
        # Gracefully accept receipts (read, delivered, sent) and non-message pings
        return {"status": "ok", "processed": 0}

    # Ensure demo business (Rine Dental & Facial Aesthetics) exists in DB
    demo_biz = await ensure_demo_business(session)
    business_id = demo_biz.id

    processed_count = 0
    results = []

    for norm_msg in normalized_messages:
        sender_phone = norm_msg.customer.phone
        if not sender_phone:
            logger.warning("[WhatsApp Webhook] Skipping message without sender phone number.")
            continue

        message_text = norm_msg.message.text or "[Message Received]"
        customer_name = norm_msg.customer.name or "WhatsApp Patient"

        try:
            # 1. Resolve existing active conversation for this customer on WhatsApp
            stmt = select(ReceptionistConversation).where(
                ReceptionistConversation.business_id == business_id,
                ReceptionistConversation.channel == "whatsapp",
                ReceptionistConversation.customer_contact == sender_phone,
                ReceptionistConversation.status == "ACTIVE"
            ).order_by(ReceptionistConversation.created_at.desc()).limit(1)

            res = await session.execute(stmt)
            existing_conv = res.scalar_one_or_none()
            conversation_id = existing_conv.id if existing_conv else None

            # 2. Hand off to Elena AI Receptionist Orchestrator
            orch_response = await receptionist_orchestrator.handle_message(
                session=session,
                business_id=business_id,
                message=message_text,
                conversation_id=conversation_id,
                customer_id=norm_msg.customer.wa_id or sender_phone,
                customer_name=customer_name,
                customer_contact=sender_phone,
                channel="whatsapp",
                metadata=norm_msg.metadata
            )

            reply_text = orch_response.get("reply", "")

            # 3. Send outbound reply to patient via WhatsApp Cloud API
            dispatch_res = await whatsapp_service.send_text_message(
                to_phone=sender_phone,
                text=reply_text
            )

            results.append({
                "from": sender_phone,
                "conversation_id": orch_response.get("conversation_id"),
                "intent": orch_response.get("intent"),
                "dispatch_status": dispatch_res.get("status")
            })
            processed_count += 1

        except Exception as msg_err:
            logger.error(f"[WhatsApp Webhook] Error processing message from {sender_phone}: {msg_err}", exc_info=True)
            results.append({
                "from": sender_phone,
                "error": str(msg_err)
            })

    return {
        "status": "ok",
        "processed": processed_count,
        "results": results
    }
