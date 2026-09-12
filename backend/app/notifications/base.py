import logging
from typing import Dict, Any, Optional
import httpx
from backend.app.config import settings

logger = logging.getLogger(__name__)

class NotificationProvider:
    """
    Sends owner alerts (Telegram, Webhooks, Console) for high-intent replies and urgent escalations.
    """

    async def notify_high_intent_reply(
        self,
        sender_email: str,
        business_name: str,
        intent_type: str,
        snippet: str
    ) -> Dict[str, Any]:
        message = (
            f"🚨 HIGH-INTENT REPLY DETECTED!\n"
            f"Business: {business_name}\n"
            f"From: {sender_email}\n"
            f"Intent: {intent_type}\n"
            f"Message: \"{snippet[:200]}...\"\n"
            f"Action: Review draft & approve in OWAIS TODAY dashboard."
        )

        logger.info(f"NOTIFICATION SENT: {message}")

        # If Telegram configured
        tg_token = getattr(settings, "TELEGRAM_BOT_TOKEN", None)
        tg_chat_id = getattr(settings, "TELEGRAM_CHAT_ID", None)
        
        if tg_token and tg_chat_id:
            try:
                async with httpx.AsyncClient(timeout=5.0) as client:
                    await client.post(
                        f"https://api.telegram.org/bot{tg_token}/sendMessage",
                        json={"chat_id": tg_chat_id, "text": message}
                    )
            except Exception as e:
                logger.warning(f"Failed to send Telegram alert: {e}")

        return {"notified": True, "channel": "TELEGRAM" if tg_token else "CONSOLE"}

notification_provider = NotificationProvider()
