import logging
from typing import Dict, Any
from backend.app.ai.llm_provider import get_llm_provider
from backend.app.ai.prompts import prompt_manager

logger = logging.getLogger(__name__)

class ReplyClassifier:
    """
    Classifies prospect email replies using Gemini and assigns an intent score (0-100),
    identifying critical human escalation triggers.
    """
    def __init__(self):
        self.llm = get_llm_provider()

    async def classify_reply(self, reply_body: str, lead_context: Dict[str, Any] = None) -> Dict[str, Any]:
        prompt_data = {
            "reply_text": reply_body,
            "business_name": (lead_context or {}).get("business_name", "Target Company"),
            "industry": (lead_context or {}).get("industry", "Business"),
            "original_offer": (lead_context or {}).get("offer", "AI Receptionist")
        }

        rendered_prompt = prompt_manager.render_prompt("reply_classification", prompt_data)
        
        result = await self.llm.generate_json(
            prompt=rendered_prompt,
            operation_name="reply_classification"
        )

        classification = result.get("classification", "QUESTION")
        intent_score = result.get("intent_score", 50)
        human_req = result.get("human_escalation_required", False)
        escalation_reason = result.get("escalation_reason")

        # Deterministic override for high-priority intents
        if classification in ["HIGH_VALUE_OPPORTUNITY", "PRICE_REQUEST", "MEETING_REQUEST"]:
            human_req = True

        return {
            "classification": classification,
            "intent_score": intent_score,
            "human_escalation_required": human_req,
            "escalation_reason": escalation_reason,
            "sentiment": result.get("extracted_sentiment", "Neutral"),
            "key_points": result.get("key_points_mentioned", [])
        }

reply_classifier = ReplyClassifier()
