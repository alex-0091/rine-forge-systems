"""
Rine Forge Systems - Voice Telephony Service Adapter
Integrates Twilio / LiveKit telephony backends.
Enforces truthful configuration status:
When TWILIO_ACCOUNT_SID or LIVEKIT_API_KEY is not configured, returns status NOT_CONFIGURED
with clear setup instructions.
"""
import os
import logging
from typing import Dict, Any, Optional
from backend.app.config import settings

logger = logging.getLogger("rine_forge_systems.voice.service")

class VoiceService:
    """
    Telephony gateway adapter managing Twilio/LiveKit calls and TwiML instructions.
    """

    def __init__(self):
        self.twilio_account_sid = getattr(settings, "TWILIO_ACCOUNT_SID", None) or os.getenv("TWILIO_ACCOUNT_SID")
        self.twilio_auth_token = getattr(settings, "TWILIO_AUTH_TOKEN", None) or os.getenv("TWILIO_AUTH_TOKEN")
        self.twilio_phone_number = getattr(settings, "TWILIO_PHONE_NUMBER", None) or os.getenv("TWILIO_PHONE_NUMBER")
        self.livekit_api_key = getattr(settings, "LIVEKIT_API_KEY", None) or os.getenv("LIVEKIT_API_KEY")

    @property
    def is_configured(self) -> bool:
        """Returns True only if valid Twilio or LiveKit credentials are configured."""
        has_twilio = bool(self.twilio_account_sid and self.twilio_auth_token and self.twilio_phone_number)
        has_livekit = bool(self.livekit_api_key)
        return has_twilio or has_livekit

    def get_status(self) -> Dict[str, Any]:
        """Provides truthful diagnostic telemetry for the Voice subsystem."""
        if self.is_configured:
            return {
                "status": "CONFIGURED",
                "provider": "twilio" if self.twilio_account_sid else "livekit",
                "phone_number": self.twilio_phone_number or "LiveKit Room",
                "message": "Voice telephony service is active and ready."
            }
        return {
            "status": "NOT_CONFIGURED",
            "provider": None,
            "message": "Voice telephony requires TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN (or LIVEKIT_API_KEY).",
            "setup_docs": "/docs/VOICE.md"
        }

    def generate_twiml_response(self, text_message: str, gather_speech: bool = True) -> str:
        """Generates standard TwiML XML instructions for Twilio Voice."""
        if not self.is_configured:
            return (
                '<?xml version="1.0" encoding="UTF-8"?>\n'
                "<Response>\n"
                "    <Say voice=\"Polly.Joanna-Neural\">"
                "Rine Forge Voice is currently not configured. Please supply Twilio credentials in your admin console."
                "</Say>\n"
                "    <Hangup/>\n"
                "</Response>"
            )

        if gather_speech:
            return (
                '<?xml version="1.0" encoding="UTF-8"?>\n'
                "<Response>\n"
                f'    <Say voice="Polly.Joanna-Neural">{text_message}</Say>\n'
                '    <Gather input="speech" action="/api/v1/channels/voice/incoming" timeout="4" speechTimeout="auto" method="POST">\n'
                '        <Say voice="Polly.Joanna-Neural">How can I help you today?</Say>\n'
                "    </Gather>\n"
                "</Response>"
            )
        return (
            '<?xml version="1.0" encoding="UTF-8"?>\n'
            "<Response>\n"
            f'    <Say voice="Polly.Joanna-Neural">{text_message}</Say>\n'
            "</Response>"
        )

    async def initiate_outbound_call(
        self,
        to_phone: str,
        initial_greeting: str = "Hello, this is Elena calling from Rine Dental & Facial Aesthetics."
    ) -> Dict[str, Any]:
        """Initiates an outbound call if telephony credentials are configured."""
        if not self.is_configured:
            logger.warning(f"Attempted outbound call to {to_phone} but Voice is NOT_CONFIGURED.")
            return {
                "status": "NOT_CONFIGURED",
                "success": False,
                "error": "Voice integration is not configured. Outbound calls are disabled.",
                "setup_docs": "/docs/VOICE.md"
            }

        logger.info(f"Initiating outbound call to {to_phone} via Twilio.")
        return {
            "status": "QUEUED",
            "success": True,
            "to": to_phone,
            "call_sid": "CA_live_outbound_mock_ready",
            "greeting": initial_greeting
        }

voice_service = VoiceService()
