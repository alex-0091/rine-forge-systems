"""
Rine Forge Systems V5 - Google Gemini Provider Adapter
Production integration for Gemini models (gemini-1.5-flash, gemini-2.0-flash).
Supports generation, streaming, token counting, and standardized error mapping.
"""
import time
import logging
import asyncio
from typing import List, Dict, Any, Optional, AsyncIterator

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

logger = logging.getLogger("rine_forge_systems.ai.providers.gemini")

class GeminiProvider(BaseAIProvider):
    provider_name: str = "gemini"

    def __init__(self, api_key: Optional[str] = None, default_model: Optional[str] = None):
        # If api_key is explicitly passed (even as ""), use it as-is without settings fallback
        # This allows tests to force unconfigured state even when settings has a key
        if api_key is None:
            self.api_key = (settings.GEMINI_API_KEY or "").strip() or None
        else:
            self.api_key = api_key.strip() or None
        self.default_model = default_model or settings.GEMINI_MODEL or "gemini-3.6-flash"
        self._client = None
        self.supported_models = ["gemini-3.6-flash", "gemini-flash-latest", "gemini-2.5-flash-lite"]

        if self.api_key:
            try:
                from google import genai
                self._client = genai.Client(api_key=self.api_key)
            except Exception as e:
                logger.warning(f"Could not initialize google.genai Client: {e}")

    def _ensure_model_prefix(self, model: str) -> str:
        """Ensures model name has 'models/' prefix and maps deprecated models to active ones."""
        clean = model.replace("models/", "")
        # Map retired/deprecated models to active gemini-3.6-flash
        if clean in ("gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash", "gemini-2.5-flash"):
            clean = "gemini-3.6-flash"
        return f"models/{clean}"

    def is_configured(self) -> bool:
        return bool(self.api_key and self._client)

    def count_tokens(self, text: str) -> int:
        if not text:
            return 0
        return max(1, len(text.split()) * 4 // 3)

    def _format_prompt(self, messages: List[ChatMessage]) -> str:
        parts = []
        for m in messages:
            prefix = "System: " if m.role == "system" else ("User: " if m.role == "user" else "Assistant: ")
            parts.append(f"{prefix}{m.content}")
        return "\n\n".join(parts)

    def _map_gemini_error(self, err: Exception) -> Exception:
        err_str = str(err).lower()
        if "api_key" in err_str or "unauthenticated" in err_str or "auth" in err_str:
            return AIProviderAuthenticationError(provider=self.provider_name, technical_error=str(err))
        elif "resource_exhausted" in err_str or "429" in err_str or "quota" in err_str:
            return AIProviderRateLimitError(provider=self.provider_name, technical_error=str(err))
        elif "deadline" in err_str or "timeout" in err_str:
            return AIProviderTimeoutError(provider=self.provider_name, timeout_seconds=30.0, technical_error=str(err))
        elif "unavailable" in err_str or "503" in err_str:
            return AIProviderUnavailableError(provider=self.provider_name, technical_error=str(err))
        elif "invalid_argument" in err_str or "400" in err_str:
            return AIInvalidPromptError(message=str(err), provider=self.provider_name, technical_error=str(err))
        return AIGatewayError(message=f"Gemini error: {err}", provider=self.provider_name, technical_error=str(err))

    async def generate(
        self,
        messages: List[ChatMessage],
        options: Optional[AIOptions] = None
    ) -> AIResponse:
        if not self.is_configured():
            raise AIProviderAuthenticationError(
                provider=self.provider_name,
                technical_error="GEMINI_API_KEY is not configured"
            )

        t0 = time.time()
        opts = options or AIOptions()
        target_model = self._ensure_model_prefix(opts.model or self.default_model)
        prompt = self._format_prompt(messages)

        try:
            loop = asyncio.get_running_loop()
            res = await loop.run_in_executor(
                None,
                lambda: self._client.models.generate_content(
                    model=target_model,
                    contents=prompt
                )
            )

            latency = int((time.time() - t0) * 1000)
            reply_text = (res.text or "").strip()

            in_tokens = sum(self.count_tokens(m.content) for m in messages)
            out_tokens = self.count_tokens(reply_text)

            return AIResponse(
                text=reply_text,
                finish_reason="stop",
                usage=TokenUsage(
                    prompt_tokens=in_tokens,
                    completion_tokens=out_tokens,
                    total_tokens=in_tokens + out_tokens
                ),
                latency_ms=latency,
                provider=self.provider_name,
                model=target_model
            )

        except Exception as e:
            raise self._map_gemini_error(e)

    async def generate_stream(
        self,
        messages: List[ChatMessage],
        options: Optional[AIOptions] = None
    ) -> AsyncIterator[AIStreamChunk]:
        if not self.is_configured():
            raise AIProviderAuthenticationError(
                provider=self.provider_name,
                technical_error="GEMINI_API_KEY is not configured"
            )

        opts = options or AIOptions()
        target_model = self._ensure_model_prefix(opts.model or self.default_model)
        prompt = self._format_prompt(messages)

        try:
            loop = asyncio.get_running_loop()
            stream = await loop.run_in_executor(
                None,
                lambda: self._client.models.generate_content_stream(
                    model=target_model,
                    contents=prompt
                )
            )

            accumulated = []
            for chunk in stream:
                token_text = chunk.text or ""
                if token_text:
                    accumulated.append(token_text)
                    yield AIStreamChunk(text=token_text, is_final=False)

            full_text = "".join(accumulated)
            in_tokens = sum(self.count_tokens(m.content) for m in messages)
            out_tokens = self.count_tokens(full_text)

            yield AIStreamChunk(
                text="",
                finish_reason="stop",
                usage=TokenUsage(
                    prompt_tokens=in_tokens,
                    completion_tokens=out_tokens,
                    total_tokens=in_tokens + out_tokens
                ),
                is_final=True
            )

        except Exception as e:
            raise self._map_gemini_error(e)

    async def health_check(self) -> ProviderHealth:
        if not self.is_configured():
            return ProviderHealth(
                provider=self.provider_name,
                status="NOT_CONFIGURED",
                error_message="GEMINI_API_KEY is not configured"
            )

        t0 = time.time()
        try:
            loop = asyncio.get_running_loop()
            # Fast ping
            await loop.run_in_executor(
                None,
                lambda: self._client.models.generate_content(
                    model=self._ensure_model_prefix(self.default_model),
                    contents="ping"
                )
            )
            latency = int((time.time() - t0) * 1000)
            return ProviderHealth(
                provider=self.provider_name,
                status="AVAILABLE",
                models=self.supported_models,
                latency_ms=latency
            )
        except Exception as e:
            return ProviderHealth(
                provider=self.provider_name,
                status="ERROR",
                models=self.supported_models,
                error_message=str(e)
            )

    def get_model_info(self) -> Dict[str, Any]:
        return {
            "provider": self.provider_name,
            "models": self.supported_models,
            "default_model": self.default_model,
            "max_context_window": 1000000,
            "supports_streaming": True,
            "supports_tools": True
        }
