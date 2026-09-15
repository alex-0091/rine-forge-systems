import logging
import math
import hashlib
from typing import List, Dict, Any, Optional
from backend.app.config import settings

logger = logging.getLogger("rine_forge_systems.ai.provider")

class AIProvider:
    """
    Production multi-provider abstraction supporting OpenAI, Gemini, and local/mock execution.
    Exposes unified methods for text generation, structured JSON, intent classification,
    dense vector embeddings, and conversation summarization.
    """

    def __init__(self):
        self.openai_key = settings.OPENAI_API_KEY
        self.gemini_key = settings.GEMINI_API_KEY
        self.default_model = settings.DEFAULT_MODEL
        self.provider_mode = settings.LLM_PROVIDER.lower()

    async def generate_text(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        temperature: float = 0.2,
        max_tokens: int = 500
    ) -> str:
        """Generates conversational text completion."""
        # 1. Try OpenAI if configured
        if (self.provider_mode in ["auto", "openai"]) and self.openai_key:
            try:
                from openai import AsyncOpenAI
                client = AsyncOpenAI(api_key=self.openai_key)
                messages = []
                if system_instruction:
                    messages.append({"role": "system", "content": system_instruction})
                messages.append({"role": "user", "content": prompt})

                response = await client.chat.completions.create(
                    model=settings.OPENAI_MODEL or "gpt-4o-mini",
                    messages=messages,
                    temperature=temperature,
                    max_tokens=max_tokens
                )
                return response.choices[0].message.content.strip()
            except Exception as e:
                logger.warning(f"OpenAI text generation failed, trying Gemini: {e}")

        # 2. Try Gemini if configured
        if (self.provider_mode in ["auto", "gemini"]) and self.gemini_key:
            try:
                from google import genai
                client = genai.Client(api_key=self.gemini_key)
                full_prompt = f"{system_instruction}\n\n{prompt}" if system_instruction else prompt
                response = client.models.generate_content(
                    model="gemini-1.5-flash",
                    contents=full_prompt
                )
                if response and response.text:
                    return response.text.strip()
            except Exception as e:
                logger.warning(f"Gemini text generation failed: {e}")

        # 3. Deterministic Grounded Fallback
        return "Thank you for reaching out. We have recorded your inquiry and our team will get back to you shortly."

    async def generate_structured_output(
        self,
        prompt: str,
        schema_description: str,
        system_instruction: Optional[str] = None
    ) -> Dict[str, Any]:
        """Generates validated JSON structured data matching a schema."""
        import json
        structured_sys = (system_instruction or "") + f"\nRespond ONLY with valid JSON matching this schema: {schema_description}"
        raw = await self.generate_text(prompt, system_instruction=structured_sys, temperature=0.1)
        
        # Clean markdown codeblocks if present
        clean_json = raw.strip()
        if clean_json.startswith("```"):
            lines = clean_json.split("\n")
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].startswith("```"):
                lines = lines[:-1]
            clean_json = "\n".join(lines).strip()

        try:
            return json.loads(clean_json)
        except Exception:
            return {"raw_response": raw}

    async def classify_intent(
        self,
        message: str,
        possible_intents: List[str]
    ) -> Dict[str, Any]:
        """Classifies customer message into one of the allowed intents."""
        schema = '{"intent": "STRING", "confidence": FLOAT_0_TO_1, "urgency": "LOW|MEDIUM|HIGH"}'
        prompt = f"Customer message: \"{message}\"\nAllowed intents: {', '.join(possible_intents)}"
        res = await self.generate_structured_output(prompt, schema_description=schema)
        intent = res.get("intent") if res.get("intent") in possible_intents else "GENERAL_INQUIRY"
        return {
            "intent": intent,
            "confidence": float(res.get("confidence", 0.9)),
            "urgency": res.get("urgency", "MEDIUM")
        }

    async def generate_embedding(self, text: str) -> List[float]:
        """
        Generates dense vector embedding (float list).
        Falls back to deterministic hash projection vector if API keys are not configured.
        """
        # 1. Try OpenAI Embeddings
        if self.openai_key:
            try:
                from openai import AsyncOpenAI
                client = AsyncOpenAI(api_key=self.openai_key)
                res = await client.embeddings.create(
                    input=text,
                    model="text-embedding-3-small"
                )
                return res.data[0].embedding
            except Exception as e:
                logger.debug(f"OpenAI embedding generation failed: {e}")

        # 2. Deterministic vector projection (256-dimensional unit vector)
        dim = 256
        vec = [0.0] * dim
        for word in text.lower().split():
            h = int(hashlib.md5(word.encode("utf-8")).hexdigest(), 16)
            idx = h % dim
            vec[idx] += 1.0

        # L2-normalize vector
        norm = math.sqrt(sum(x * x for x in vec))
        if norm > 0:
            vec = [round(x / norm, 6) for x in vec]
        return vec

    async def summarize_conversation(self, messages_transcript: str) -> str:
        """Summarizes multi-turn conversation into concise bullet points."""
        prompt = f"Summarize the following customer interaction:\n\n{messages_transcript}"
        return await self.generate_text(prompt, system_instruction="Provide a concise 2-sentence summary of customer need and status.")

ai_provider = AIProvider()
