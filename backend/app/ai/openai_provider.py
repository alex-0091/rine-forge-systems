import json
import logging
import time
from typing import Dict, Any, Optional
from backend.app.config import settings
from backend.app.ai.cost_tracker import cost_tracker

logger = logging.getLogger(__name__)

class OpenAIProvider:
    """
    Production OpenAI LLM Provider supporting modern models (gpt-4o-mini, gpt-4o),
    structured JSON outputs, and token/cost instrumentation.
    """
    def __init__(
        self,
        api_key: Optional[str] = None,
        default_model: Optional[str] = None,
        fallback_provider: Optional[Any] = None
    ):
        self.api_key = api_key or settings.OPENAI_API_KEY
        self.default_model = default_model or settings.OPENAI_MODEL or "gpt-4o-mini"
        self.fallback = fallback_provider
        self.client = None

        if self.api_key:
            try:
                from openai import AsyncOpenAI
                self.client = AsyncOpenAI(api_key=self.api_key, timeout=20.0)
                logger.info(f"OpenAIProvider initialized with model '{self.default_model}'.")
            except Exception as e:
                logger.warning(f"Could not initialize AsyncOpenAI client: {e}. Fallback active.")

    async def generate_json(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        model: Optional[str] = None,
        operation_name: str = "openai_json"
    ) -> Dict[str, Any]:
        """
        Generate strict, validated JSON utilizing OpenAI's json_object response format.
        """
        target_model = model or self.default_model
        if not self.api_key or not self.client:
            if self.fallback:
                return await self.fallback.generate_json(prompt, system_instruction, model, operation_name)
            raise ValueError("OpenAI API key not configured and no fallback provider available.")

        messages = []
        sys_prompt = system_instruction or "You are a professional business automation system. Respond strictly with valid JSON."
        if "json" not in sys_prompt.lower():
            sys_prompt += " You must respond strictly with valid JSON."
        messages.append({"role": "system", "content": sys_prompt})
        messages.append({"role": "user", "content": prompt})

        t0 = time.time()
        try:
            response = await self.client.chat.completions.create(
                model=target_model,
                messages=messages,
                response_format={"type": "json_object"},
                temperature=0.2,
            )

            latency_ms = int((time.time() - t0) * 1000)
            in_tokens = response.usage.prompt_tokens if response.usage else len(prompt.split()) * 2
            out_tokens = response.usage.completion_tokens if response.usage else 100
            cost_tracker.record_usage(operation_name, target_model, in_tokens, out_tokens)

            raw_text = response.choices[0].message.content or "{}"
            cleaned = raw_text.strip()
            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            elif cleaned.startswith("```"):
                cleaned = cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            cleaned = cleaned.strip()

            parsed = json.loads(cleaned)
            logger.info(f"[OpenAI JSON] {operation_name} completed via {target_model} in {latency_ms}ms ({in_tokens}+{out_tokens} tokens)")
            return parsed

        except Exception as e:
            logger.error(f"[OpenAI JSON Error] {operation_name} failed on {target_model}: {e}. Triggering fallback chain.")
            if self.fallback:
                return await self.fallback.generate_json(prompt, system_instruction, model, operation_name)
            raise

    async def generate_text(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        model: Optional[str] = None,
        operation_name: str = "openai_text"
    ) -> str:
        """
        Generate clear, natural, professional text.
        """
        target_model = model or self.default_model
        if not self.api_key or not self.client:
            if self.fallback:
                return await self.fallback.generate_text(prompt, system_instruction, model, operation_name)
            raise ValueError("OpenAI API key not configured and no fallback provider available.")

        messages = []
        if system_instruction:
            messages.append({"role": "system", "content": system_instruction})
        messages.append({"role": "user", "content": prompt})

        t0 = time.time()
        try:
            response = await self.client.chat.completions.create(
                model=target_model,
                messages=messages,
                temperature=0.3,
            )

            latency_ms = int((time.time() - t0) * 1000)
            in_tokens = response.usage.prompt_tokens if response.usage else len(prompt.split()) * 2
            out_tokens = response.usage.completion_tokens if response.usage else 50
            cost_tracker.record_usage(operation_name, target_model, in_tokens, out_tokens)

            text = (response.choices[0].message.content or "").strip()
            logger.info(f"[OpenAI Text] {operation_name} completed via {target_model} in {latency_ms}ms")
            return text

        except Exception as e:
            logger.error(f"[OpenAI Text Error] {operation_name} failed on {target_model}: {e}. Triggering fallback chain.")
            if self.fallback:
                return await self.fallback.generate_text(prompt, system_instruction, model, operation_name)
            raise
