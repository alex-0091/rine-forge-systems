import json
import logging
import re
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from backend.app.config import settings
from backend.app.ai.cost_tracker import cost_tracker

logger = logging.getLogger(__name__)

class LLMProvider(ABC):
    @abstractmethod
    async def generate_json(self, prompt: str, system_instruction: Optional[str] = None, model: Optional[str] = None, operation_name: str = "llm_generate") -> Dict[str, Any]:
        """Generate structured JSON from prompt."""
        pass

    @abstractmethod
    async def generate_text(self, prompt: str, system_instruction: Optional[str] = None, model: Optional[str] = None, operation_name: str = "llm_text") -> str:
        """Generate freeform text."""
        pass

class MockLLMProvider(LLMProvider):
    """
    High-fidelity deterministic Mock LLM Provider for offline testing, dry-runs, and instant CI runs.
    """
    async def generate_json(self, prompt: str, system_instruction: Optional[str] = None, model: Optional[str] = None, operation_name: str = "mock_json") -> Dict[str, Any]:
        cost_tracker.record_usage(operation_name, "mock", 150, 80)
        
        # Determine intent by inspecting keywords in prompt
        if "outreach_generation" in prompt or "Why this business?" in prompt or "Cold B2B email" in prompt:
            # Extract business name if present
            biz_name = "Target Business"
            m = re.search(r'"business_name":\s*"([^"]+)"', prompt)
            if m:
                biz_name = m.group(1)
            city = "your area"
            m_city = re.search(r'"city":\s*"([^"]+)"', prompt)
            if m_city:
                city = m_city.group(1)
                
            return {
                "subject": f"quick question regarding {biz_name} inquiries",
                "body": (
                    f"Hi there,\n\n"
                    f"I came across {biz_name} while reviewing services in {city}.\n\n"
                    f"I noticed you have online inquiry channels, but after-hours visitors often have to wait for follow-up on routine service questions.\n\n"
                    f"We build conversational AI assistants that qualify inquiries 24/7 and route booked appointments directly into your schedule.\n\n"
                    f"I prepared a quick concept for {biz_name}—would you like me to send over a 2-minute preview?\n\n"
                    f"Best,\nOwais\nOwais AI (owais-ai.com)"
                ),
                "word_count": 82,
                "primary_cta": "Would you like me to send over a 2-minute preview?",
                "hook_used": f"Online inquiries require manual follow-up for after-hours questions"
            }
            
        elif "outreach_quality_check" in prompt:
            return {
                "passed": True,
                "score": 94,
                "detected_issues": [],
                "grounding_verified": True,
                "recommendations": "High quality, concise, and grounded in verified digital presence."
            }
            
        elif "compliance_check" in prompt:
            return {
                "compliant": True,
                "jurisdiction": "USA",
                "checks": {
                    "sender_identity_present": True,
                    "physical_address_included": True,
                    "optout_mechanism_included": True,
                    "subject_non_deceptive": True,
                    "b2b_role_relevant": True
                },
                "reasons": ["Fully complies with commercial B2B email standards."]
            }
            
        elif "reply_classification" in prompt or "Inbound Sales Intelligence" in prompt:
            # Extract specific reply_text from input JSON block
            m = re.search(r'"reply_text":\s*"([^"]+)"', prompt)
            raw_text = m.group(1) if m else prompt
            r_lower = raw_text.lower()
            
            if any(w in r_lower for w in ["stop", "unsubscribe", "remove me", "don't email", "do not email"]):
                return {
                    "classification": "STOP",
                    "intent_score": 0,
                    "human_escalation_required": False,
                    "escalation_reason": None,
                    "extracted_sentiment": "Opt-out",
                    "key_points_mentioned": ["Requested immediate removal"]
                }
            elif any(w in r_lower for w in ["$10,000", "$5,000", "enterprise", "hire you", "urgent project", "contract"]):
                return {
                    "classification": "HIGH_VALUE_OPPORTUNITY",
                    "intent_score": 98,
                    "human_escalation_required": True,
                    "escalation_reason": "High-budget / enterprise opportunity detected ($5k+). Immediate alert to Owais.",
                    "extracted_sentiment": "Urgent / High Value",
                    "key_points_mentioned": ["High budget project mentioned"]
                }
            elif any(w in r_lower for w in ["call", "meeting", "schedule", "calendar", "zoom"]):
                return {
                    "classification": "MEETING_REQUEST",
                    "intent_score": 95,
                    "human_escalation_required": True,
                    "escalation_reason": "Prospect requested scheduling a discovery call.",
                    "extracted_sentiment": "Very High Intent",
                    "key_points_mentioned": ["Requested appointment call"]
                }
            elif any(w in r_lower for w in ["how much", "cost", "price", "pricing", "rates"]):
                return {
                    "classification": "PRICE_REQUEST",
                    "intent_score": 85,
                    "human_escalation_required": True,
                    "escalation_reason": "Prospect requested pricing. Requires custom scope quote by Owais.",
                    "extracted_sentiment": "Positive / Inquiring",
                    "key_points_mentioned": ["Requested cost / pricing breakdown"]
                }
            elif any(w in r_lower for w in ["interested", "sounds good", "send info", "tell me more", "send over"]):
                return {
                    "classification": "POSITIVE_INTEREST",
                    "intent_score": 88,
                    "human_escalation_required": False,
                    "escalation_reason": None,
                    "extracted_sentiment": "High Interest",
                    "key_points_mentioned": ["Requested preview / walkthrough"]
                }
            else:
                return {
                    "classification": "QUESTION",
                    "intent_score": 70,
                    "human_escalation_required": False,
                    "escalation_reason": None,
                    "extracted_sentiment": "Inquiring",
                    "key_points_mentioned": ["General capability question"]
                }
                
        elif "reply_generation" in prompt:
            return {
                "suggested_response": (
                    "Hi there,\n\n"
                    "Thanks for getting back to me! Glad you found the concept interesting.\n\n"
                    "Our AI assistant integrates directly with your website and booking calendar to answer patient/client questions and schedule inquiries automatically. Deployment typically takes 3-5 business days.\n\n"
                    "Would you have 10-15 minutes this Thursday or Friday for a quick walkthrough?\n\n"
                    "Best,\nOwais\nOwais AI (owais-ai.com)"
                ),
                "rationale": "Direct, consultative response proposing a quick exploratory call.",
                "contains_pricing": False
            }
            
        elif "receptionist_demo" in prompt:
            return {
                "response": "Hello and welcome! I am the 24/7 AI Receptionist demo built by Owais AI. I can answer common service questions, provide pricing guidance, or take your details to schedule a consultation with the team. How can I assist you today?"
            }
            
        return {"status": "ok", "message": "Mock analysis generated successfully."}

    async def generate_text(self, prompt: str, system_instruction: Optional[str] = None, model: Optional[str] = None, operation_name: str = "mock_text") -> str:
        cost_tracker.record_usage(operation_name, "mock", 100, 50)
        return "Hello! I am Owais AI's interactive demonstration assistant. How can I help you today?"

class GeminiProvider(LLMProvider):
    """
    Google Gemini LLM Provider with automatic fallback to MockLLMProvider if no API key is provided.
    """
    def __init__(self, api_key: Optional[str] = None, default_model: str = "gemini-1.5-flash"):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.default_model = default_model
        self.fallback = MockLLMProvider()
        
        self.client = None
        if self.api_key:
            try:
                from google import genai
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                logger.warning(f"Could not initialize google.genai Client: {e}. Falling back to HTTP/Mock.")

    async def generate_json(self, prompt: str, system_instruction: Optional[str] = None, model: Optional[str] = None, operation_name: str = "gemini_json") -> Dict[str, Any]:
        if not self.api_key or not self.client:
            return await self.fallback.generate_json(prompt, system_instruction, model, operation_name)
            
        target_model = model or self.default_model
        try:
            full_prompt = f"{system_instruction}\n\n{prompt}\n\nRespond strictly with valid JSON without markdown formatting." if system_instruction else f"{prompt}\n\nRespond strictly with valid JSON without markdown formatting."
            
            response = self.client.models.generate_content(
                model=target_model,
                contents=full_prompt,
            )
            
            # Count tokens / estimate
            in_tokens = len(full_prompt.split()) * 2
            out_tokens = len(response.text.split()) * 2 if response.text else 100
            cost_tracker.record_usage(operation_name, target_model, in_tokens, out_tokens)
            
            # Clean JSON from backticks
            cleaned = response.text.strip()
            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            elif cleaned.startswith("```"):
                cleaned = cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            cleaned = cleaned.strip()
            
            return json.loads(cleaned)
        except Exception as e:
            logger.error(f"Gemini generation error: {e}. Using fallback provider.")
            return await self.fallback.generate_json(prompt, system_instruction, model, operation_name)

    async def generate_text(self, prompt: str, system_instruction: Optional[str] = None, model: Optional[str] = None, operation_name: str = "gemini_text") -> str:
        if not self.api_key or not self.client:
            return await self.fallback.generate_text(prompt, system_instruction, model, operation_name)
            
        target_model = model or self.default_model
        try:
            full_prompt = f"{system_instruction}\n\n{prompt}" if system_instruction else prompt
            response = self.client.models.generate_content(
                model=target_model,
                contents=full_prompt
            )
            
            in_tokens = len(full_prompt.split()) * 2
            out_tokens = len(response.text.split()) * 2 if response.text else 50
            cost_tracker.record_usage(operation_name, target_model, in_tokens, out_tokens)
            
            return response.text.strip()
        except Exception as e:
            logger.error(f"Gemini text error: {e}. Using fallback provider.")
            return await self.fallback.generate_text(prompt, system_instruction, model, operation_name)

def get_llm_provider() -> LLMProvider:
    if settings.GEMINI_API_KEY:
        return GeminiProvider(api_key=settings.GEMINI_API_KEY, default_model=settings.DEFAULT_MODEL)
    return MockLLMProvider()
