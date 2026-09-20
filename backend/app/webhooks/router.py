"""
Rine Forge Systems - Inbound Webhook Endpoints
Routes external incoming events (Stripe, WhatsApp, Calendly, Custom) with signature validation and deduplication.
"""
import logging
from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, Header, Request, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.database import get_db
from backend.app.webhooks.engine import webhook_manager

logger = logging.getLogger("rine_forge_systems.webhooks.router")

router = APIRouter(prefix="/webhooks", tags=["Webhooks"])

@router.post("/inbound/{source}")
async def receive_inbound_webhook(
    source: str,
    request: Request,
    idempotency_key: Optional[str] = Header(None, alias="X-Idempotency-Key"),
    signature: Optional[str] = Header(None, alias="X-Signature-256"),
    session: AsyncSession = Depends(get_db)
):
    """
    Generic webhook receiver with idempotency enforcement.
    """
    raw_body = await request.body()
    try:
        payload: Dict[str, Any] = await request.json()
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid JSON payload")

    # Generate fallback idempotency key if not in header
    effective_key = idempotency_key or payload.get("id") or payload.get("event_id") or f"{source}_{hash(raw_body)}"
    event_type = payload.get("event_type") or payload.get("type") or "generic_event"
    business_id = payload.get("business_id")

    result = await webhook_manager.ingest_inbound_webhook(
        session=session,
        source=source,
        event_type=event_type,
        idempotency_key=effective_key,
        payload=payload,
        business_id=business_id,
        signature=signature
    )
    return result
