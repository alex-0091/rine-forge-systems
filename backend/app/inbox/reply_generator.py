import logging
from typing import Dict, Any, Optional
from backend.app.config import settings
from backend.app.ai.llm_provider import get_llm_provider
from backend.app.ai.prompts import prompt_manager

logger = logging.getLogger(__name__)

class ReplyGenerator:
    """
    Drafts contextual, policy-compliant suggested responses for inbound leads.
    """
    def __init__(self):
        self.llm = get_llm_provider()

    async def generate_suggested_reply(
        self,
        inbound_message: str,
        business_profile: Dict[str, Any],
        intent_class: str
    ) -> Dict[str, Any]:
        prompt_data = {
            "business_name": business_profile.get("business_name", "your company"),
            "contact_name": business_profile.get("contact_name", "there"),
            "industry": business_profile.get("industry", "Business"),
            "inbound_message": inbound_message,
            "intent_class": intent_class,
            "portfolio_oracle": settings.PORTFOLIO_ORACLE_AI_URL,
            "portfolio_plot_twist": settings.PORTFOLIO_PLOT_TWIST_URL,
            "portfolio_bright_star": settings.PORTFOLIO_BRIGHT_STAR_URL
        }

        rendered_prompt = prompt_manager.render_prompt("reply_generation", prompt_data)
        
        result = await self.llm.generate_json(
            prompt=rendered_prompt,
            operation_name="reply_generation"
        )

        return {
            "suggested_response": result.get("suggested_response", "Thank you for reaching out. We will get back to you shortly."),
            "rationale": result.get("rationale", "Standard consultative response."),
            "contains_pricing": result.get("contains_pricing", False)
        }

reply_generator = ReplyGenerator()
