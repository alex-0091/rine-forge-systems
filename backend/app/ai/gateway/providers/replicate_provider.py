"""
Rine Forge Systems V5 - Replicate Provider Adapter
Production integration for Replicate models (meta-llama-3-70b-instruct, etc.).
"""
import time
import logging
import asyncio
from typing import List, Dict, Any, Optional, AsyncIterator

import replicate
from replicate.exceptions import ReplicateError
from backend.app.config import settings
from backend.app.ai.gateway.interface import (
    BaseAIProvider, ChatMessage, AIOptions, AIResponse,
    AIStreamChunk, TokenUsage, ProviderHealth
)
from backend.app.ai.gateway.errors import (
    AIProviderAuthenticationError, AIProviderRateLimitError,
    AIProviderTimeoutError, AIProviderUnavailableError,
    AIInvalidPromptError, AIGatewayError
)

logger = logging.getLogger("rine_forge_systems.ai.providers.replicate")

class ReplicateProvider(BaseAIProvider):
    provider_name: str = "replicate"

    def __init__(self, api_key: Optional[str] = None, default_model: Optional[str] = None):
        self.api_key = api_key or getattr(settings, "REPLICATE_API_TOKEN", None)
        self.default_model = default_model or getattr(settings, "REPLICATE_MODEL", "meta/meta-llama-3-70b-instruct")
        self.supported_models = ["meta/meta-llama-3-70b-instruct", "meta/meta-llama-3-8b-instruct"]

    def is_configured(self) -> bool:
        return bool(self.api_key)

    def count_tokens(self, text: str) -> int:
        if not text:
            return 0
        return max(1, len(text.split()) * 4 // 3)

    def _convert_messages(self, messages: List[ChatMessage]) -> str:
        # Simple converter to a single prompt string since replicate often expects a prompt string
        # For Llama 3 instruct format:
        prompt = ""
        for m in messages:
            if m.role == "system":
                prompt += f"<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n{m.content}<|eot_id|>"
            elif m.role == "user":
                prompt += f"<|start_header_id|>user<|end_header_id|>\n\n{m.content}<|eot_id|>"
            elif m.role == "assistant":
                prompt += f"<|start_header_id|>assistant<|end_header_id|>\n\n{m.content}<|eot_id|>"
        prompt += "<|start_header_id|>assistant<|end_header_id|>\n\n"
        return prompt

    def _map_replicate_error(self, err: Exception) -> Exception:
        err_str = str(err).lower()
        
        if "unauthorized" in err_str or "authentication" in err_str:
            return AIProviderAuthenticationError(provider=self.provider_name, technical_error=str(err))
        elif "rate limit" in err_str or "429" in err_str:
            return AIProviderRateLimitError(provider=self.provider_name, technical_error=str(err))
        elif "timeout" in err_str:
            return AIProviderTimeoutError(provider=self.provider_name, timeout_seconds=30.0, technical_error=str(err))
        
        return AIGatewayError(message=f"Replicate error: {err}", provider=self.provider_name, technical_error=str(err))

    async def generate(
        self,
        messages: List[ChatMessage],
        options: Optional[AIOptions] = None
    ) -> AIResponse:
        if not self.is_configured():
            raise AIProviderAuthenticationError(
                provider=self.provider_name,
                technical_error="REPLICATE_API_TOKEN is not configured"
            )

        t0 = time.time()
        opts = options or AIOptions()
        target_model = opts.model or self.default_model

        prompt = self._convert_messages(messages)
        
        input_data = {
            "prompt": prompt,
            "max_tokens": opts.max_tokens or 1024,
            "temperature": opts.temperature or 0.7,
        }

        try:
            client = replicate.Client(api_token=self.api_key)
            # replicate.async_run is available in newer replicate python versions
            output = await client.async_run(
                target_model,
                input=input_data
            )
            latency = int((time.time() - t0) * 1000)

            reply_text = "".join(output) if isinstance(output, list) else str(output)

            in_tokens = self.count_tokens(prompt)
            out_tokens = self.count_tokens(reply_text)
            
            usage = TokenUsage(
                prompt_tokens=in_tokens,
                completion_tokens=out_tokens,
                total_tokens=in_tokens + out_tokens
            )

            return AIResponse(
                text=reply_text,
                finish_reason="stop",
                usage=usage,
                latency_ms=latency,
                provider=self.provider_name,
                model=target_model,
                tool_calls=None,
                raw_metadata={}
            )

        except Exception as e:
            raise self._map_replicate_error(e)

    async def generate_stream(
        self,
        messages: List[ChatMessage],
        options: Optional[AIOptions] = None
    ) -> AsyncIterator[AIStreamChunk]:
        if not self.is_configured():
            raise AIProviderAuthenticationError(
                provider=self.provider_name,
                technical_error="REPLICATE_API_TOKEN is not configured"
            )

        opts = options or AIOptions()
        target_model = opts.model or self.default_model

        prompt = self._convert_messages(messages)
        
        input_data = {
            "prompt": prompt,
            "max_tokens": opts.max_tokens or 1024,
            "temperature": opts.temperature or 0.7,
        }

        accumulated_text = []

        try:
            client = replicate.Client(api_token=self.api_key)
            async for event in await client.async_stream(target_model, input=input_data):
                token_text = str(event)
                if token_text:
                    accumulated_text.append(token_text)
                    yield AIStreamChunk(text=token_text, is_final=False)

            full_text = "".join(accumulated_text)
            in_tokens = self.count_tokens(prompt)
            out_tokens = self.count_tokens(full_text)
            usage = TokenUsage(
                prompt_tokens=in_tokens,
                completion_tokens=out_tokens,
                total_tokens=in_tokens + out_tokens
            )
            yield AIStreamChunk(
                text="",
                finish_reason="stop",
                usage=usage,
                is_final=True
            )

        except Exception as e:
            raise self._map_replicate_error(e)

    async def health_check(self) -> ProviderHealth:
        if not self.is_configured():
            return ProviderHealth(
                provider=self.provider_name,
                status="NOT_CONFIGURED",
                error_message="REPLICATE_API_TOKEN is not configured"
            )

        return ProviderHealth(
            provider=self.provider_name,
            status="AVAILABLE",
            models=self.supported_models,
            latency_ms=0
        )

    def get_model_info(self) -> Dict[str, Any]:
        return {
            "provider": self.provider_name,
            "models": self.supported_models,
            "default_model": self.default_model,
            "max_context_window": 8192,
            "supports_streaming": True,
            "supports_tools": False,
            "supports_json_mode": False
        }
