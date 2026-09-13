import logging
from typing import Dict, Any, Optional
from backend.app.config import settings
from backend.app.ai.llm_provider import get_llm_provider

logger = logging.getLogger(__name__)

class InboundAIAutoResponder:
    """
    Autonomous Email Responder & Prototype Delivery Engine:
    1. Analyzes incoming prospect emails.
    2. Identifies customer problem & requested service.
    3. Crafts a personalized response with instant working demo links.
    4. Guides high-intent prospects to the 50% milestone deposit portal.
    """

    BANK_SETTLEMENT_INFO = {
        "euro_iban": "TR61 0020 3000 1164 1361 0000 04",
        "usd_iban": "TR88 0020 3000 1164 1361 0000 03",
        "beneficiary": "Owais ahmed",
        "bank_name": "Albaraka Türk (Istanbul, Turkey)",
        "crypto_usdt_bep20": "0x3102200218a860c5057270afa3504ee4dc318f8f",
        "demo_hub_url": "https://rine-forge-systems-19pm-eight.vercel.app/#showcase",
        "tools_forge_url": "https://rine-forge-systems-19pm-eight.vercel.app/#tools-forge"
    }

    async def generate_auto_response(
        self,
        sender_email: str,
        subject: str,
        body_text: str,
        business_name: Optional[str] = None
    ) -> Dict[str, Any]:
        llm = get_llm_provider()
        biz = business_name or "your team"

        system_prompt = (
            f"You are Alex Rine, Principal Systems Architect at Rine Forge Systems (rineforge.ai).\n"
            f"Official Contact Email: {settings.SENDER_EMAIL}\n"
            f"Your goal is to warmly welcome the prospect, provide them with direct free interactive demo links tailored to what they asked for, and explain our 100% transparent 50% milestone delivery model.\n"
            f"Key facts to remember:\n"
            f"- We offer a 100% Free 48-Hour Custom Working Prototype with zero financial commitment.\n"
            f"- Our production builds are priced substantially lower than typical US/EU agencies ($499 - $899 total, with only a 50% milestone deposit to begin).\n"
            f"- If they asked about payments: We accept Albaraka Türk Euro (TR61 0020 3000 1164 1361 0000 04) & USD (TR88 0020 3000 1164 1361 0000 03) to Beneficiary 'Owais ahmed', and USDT BEP20 (0x3102200218a860c5057270afa3504ee4dc318f8f).\n"
            f"- Keep the email professional, human, concise (under 160 words), and encouraging."
        )

        prompt = (
            f"Prospect Email: {sender_email}\n"
            f"Subject: {subject}\n"
            f"Body:\n{body_text}\n\n"
            f"Draft an immediate, personalized email response addressing their specific need, including the working demo link ({self.BANK_SETTLEMENT_INFO['demo_hub_url']})."
        )

        reply_body = await llm.generate_text(
            prompt=prompt,
            system_instruction=system_prompt,
            operation_name="inbound_auto_respond"
        )

        return {
            "reply_subject": f"re: {subject}" if not subject.lower().startswith("re:") else subject,
            "reply_body": reply_body,
            "demo_link": self.BANK_SETTLEMENT_INFO["demo_hub_url"],
            "settlement_info": self.BANK_SETTLEMENT_INFO
        }

inbound_auto_responder = InboundAIAutoResponder()
