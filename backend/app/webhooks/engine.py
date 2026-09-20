"""
Rine Forge Systems - Cryptographic Webhooks Engine
Handles idempotent inbound webhook ingestion and HMAC-SHA256 signed outbound deliveries.
"""
import hmac
import hashlib
import json
import logging
from typing import Dict, Any, Optional
from datetime import datetime, timezone
import httpx
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.models.v5 import V5WebhookEvent
from backend.app.automations.engine import automation_engine

logger = logging.getLogger("rine_forge_systems.webhooks.engine")

class WebhookManager:
    """
    Manages cryptographic verification, deduplication, and outbound webhook delivery.
    """

    def compute_signature(self, secret: str, payload_bytes: bytes) -> str:
        """Computes HMAC-SHA256 hex signature for payload verification."""
        return hmac.new(secret.encode("utf-8"), payload_bytes, hashlib.sha256).hexdigest()

    def verify_signature(self, secret: str, payload_bytes: bytes, signature_header: str) -> bool:
        """Constant-time verification of webhook signature."""
        expected = self.compute_signature(secret, payload_bytes)
        clean_sig = signature_header.replace("sha256=", "").strip()
        return hmac.compare_digest(expected, clean_sig)

    async def ingest_inbound_webhook(
        self,
        session: AsyncSession,
        source: str,
        event_type: str,
        idempotency_key: str,
        payload: Dict[str, Any],
        business_id: Optional[str] = None,
        signature: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Idempotently logs and processes incoming webhook events.
        Prevents duplicate execution by checking idempotency_key.
        """
        # 1. Deduplication check
        stmt = select(V5WebhookEvent).where(V5WebhookEvent.idempotency_key == idempotency_key)
        res = await session.execute(stmt)
        existing = res.scalar_one_or_none()

        if existing:
            logger.info(f"Duplicate inbound webhook ignored: key='{idempotency_key}' (status={existing.status})")
            return {
                "status": "DUPLICATE_IGNORED",
                "idempotency_key": idempotency_key,
                "event_id": existing.id,
                "detail": "Event previously processed."
            }

        # 2. Record new webhook event
        event = V5WebhookEvent(
            business_id=business_id,
            source=source,
            event_type=event_type,
            idempotency_key=idempotency_key,
            signature=signature,
            payload=payload,
            status="PROCESSING"
        )
        session.add(event)
        await session.flush()

        # 3. Trigger corresponding automations if business_id is present
        automation_results = []
        if business_id:
            try:
                automation_results = await automation_engine.trigger(
                    session=session,
                    business_id=business_id,
                    trigger_event=event_type,
                    context=payload
                )
            except Exception as e:
                logger.error(f"Automation execution failed for webhook #{event.id}: {e}", exc_info=True)

        event.status = "PROCESSED"
        await session.commit()
        await session.refresh(event)

        logger.info(f"Successfully processed inbound webhook event #{event.id} ({source}:{event_type})")
        return {
            "status": "PROCESSED",
            "event_id": event.id,
            "idempotency_key": idempotency_key,
            "automations_triggered": len(automation_results)
        }

    async def dispatch_outbound_webhook(
        self,
        target_url: str,
        secret: str,
        event_type: str,
        payload: Dict[str, Any],
        max_retries: int = 3
    ) -> Dict[str, Any]:
        """
        Dispatches an HMAC-SHA256 signed POST request to external subscriber URL.
        """
        payload_bytes = json.dumps(payload, separators=(",", ":")).encode("utf-8")
        signature = self.compute_signature(secret, payload_bytes)

        headers = {
            "Content-Type": "application/json",
            "X-Rine-Signature": f"sha256={signature}",
            "X-Rine-Event": event_type,
            "X-Rine-Timestamp": datetime.now(timezone.utc).isoformat()
        }

        attempt = 0
        last_error = None
        while attempt < max_retries:
            attempt += 1
            try:
                async with httpx.AsyncClient(timeout=8.0) as client:
                    resp = await client.post(target_url, content=payload_bytes, headers=headers)
                    if resp.status_code in (200, 201, 202, 204):
                        logger.info(f"Outbound webhook delivered to {target_url} (HTTP {resp.status_code})")
                        return {
                            "status": "DELIVERED",
                            "http_code": resp.status_code,
                            "attempts": attempt,
                            "target_url": target_url
                        }
                    last_error = f"HTTP {resp.status_code}: {resp.text[:100]}"
            except Exception as e:
                last_error = str(e)

        logger.warning(f"Outbound webhook delivery failed to {target_url} after {attempt} attempts: {last_error}")
        return {
            "status": "FAILED",
            "attempts": attempt,
            "error": last_error,
            "target_url": target_url
        }

webhook_manager = WebhookManager()
