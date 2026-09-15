import logging
from typing import Dict, Any, Optional
import httpx

from backend.app.config import settings

logger = logging.getLogger("rine_forge_systems.whatsapp.service")

class WhatsAppService:
    """
    Client for the official Meta WhatsApp Cloud API.
    Sends text messages, template messages, and interactive replies.
    Supports dry-run/mock mode when META_ACCESS_TOKEN is not configured.
    """

    def __init__(
        self,
        access_token: Optional[str] = None,
        phone_number_id: Optional[str] = None,
        api_version: Optional[str] = None
    ):
        self.access_token = access_token or settings.META_ACCESS_TOKEN
        self.phone_number_id = phone_number_id or settings.META_PHONE_NUMBER_ID
        self.api_version = api_version or settings.META_API_VERSION
        self.base_url = f"https://graph.facebook.com/{self.api_version}"

    @property
    def is_configured(self) -> bool:
        """Returns True only if both token and phone number ID are set."""
        return bool(self.access_token and self.phone_number_id)

    async def send_text_message(
        self,
        to_phone: str,
        text: str,
        preview_url: bool = False
    ) -> Dict[str, Any]:
        """
        Sends an outbound text message to a WhatsApp user.
        If credentials are not configured, logs the message and returns a mock success payload.
        """
        # Normalize phone: Meta expects digits only, no leading '+'
        clean_phone = to_phone.replace("+", "").replace(" ", "").replace("-", "").strip()

        if not self.is_configured:
            logger.info(
                f"[WhatsApp Mock/Dev Mode] Outbound text to {clean_phone}: '{text[:80]}...' "
                "(META_ACCESS_TOKEN not set; message logged locally)"
            )
            return {
                "status": "mock_sent",
                "to": clean_phone,
                "text": text,
                "messages": [{"id": f"mock_wamid_{clean_phone}"}]
            }

        url = f"{self.base_url}/{self.phone_number_id}/messages"
        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }
        payload = {
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": clean_phone,
            "type": "text",
            "text": {
                "preview_url": preview_url,
                "body": text
            }
        }

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(url, headers=headers, json=payload)
                if response.status_code >= 400:
                    logger.error(f"[WhatsApp Cloud API Error] {response.status_code}: {response.text}")
                    return {
                        "status": "error",
                        "code": response.status_code,
                        "error": response.text
                    }
                data = response.json()
                logger.info(f"[WhatsApp Cloud API] Message sent successfully to {clean_phone}: {data.get('messages')}")
                return {
                    "status": "sent",
                    "data": data
                }
        except Exception as e:
            logger.error(f"[WhatsApp Network Failure] Could not send message to {clean_phone}: {e}")
            return {
                "status": "network_error",
                "error": str(e)
            }

whatsapp_service = WhatsAppService()
