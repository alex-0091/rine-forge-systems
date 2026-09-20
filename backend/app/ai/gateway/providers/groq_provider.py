"""
Rine Forge Systems V5 - Groq Provider Adapter
Ultra-fast inference via Groq LPU for open-weight models (Llama 3.3, DeepSeek, etc.).
Free tier: 30 RPM, generous daily limits - no credit card required.
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

logger = logging.getLogger("rine_forge_systems.ai.providers.groq")

# Best free Groq models ranked by quality/speed
GROQ_DEFAULT_MODEL = "llama-3.3-70b-versatile"  # Best quality, generous free tier
GROQ_FAST_MODEL = "llama-3.1-8b-instant"         # Fastest, lowest latency
GROQ_SUPPORTED_MODELS = [
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
    "llama3-8b-8192",
    "mixtral-8x7b-32768",
    "gemma2-9b-it",
]


class GroqProvider(BaseAIProvider):
    provider_name: str = "groq"

    def __init__(self, api_key: Optional[str] = None, default_model: Optional[str] = None):
        self.api_key = api_key or getattr(settings, 'GROQ_API_KEY', None)
        self.default_model = default_model or GROQ_DEFAULT_MODEL
        self._client = None
        self.supported_models = GROQ_SUPPORTED_MODELS

        if self.api_key:
            try:
                from groq import Groq
                self._client = Groq(api_key=self.api_key)
                logger.info("Groq provider initialized successfully.")
            except ImportError:
                logger.warning("groq package not installed. Run: pip install groq")
            except Exception as e:
                logger.warning(f"Could not initialize Groq client: {e}")

    def is_configured(self) -> bool:
        return bool(self.api_key and self._client)

    def count_tokens(self, text: str) -> int:
        if not text:
            return 0
        return max(1, len(text.split()) * 4 // 3)

    def _build_messages(self, messages: List[ChatMessage]) -> List[Dict[str, str]]:
        """Convert ChatMessage objects to Groq-compatible dict format."""
        result = []
        for m in messages:
            role = m.role if m.role in ("system", "user", "assistant") else "user"
            result.append({"role": role, "content": m.content})
        return result

    def _map_groq_error(self, err: Exception) -> Exception:
        err_str = str(err).lower()
        if "authentication" in err_str or "api_key" in err_str or "unauthorized" in err_str:
            return AIProviderAuthenticationError(provider=self.provider_name, technical_error=str(err))
        elif "rate_limit" in err_str or "429" in err_str or "quota" in err_str or "too many" in err_str:
            return AIProviderRateLimitError(provider=self.provider_name, technical_error=str(err))
        elif "timeout" in err_str or "deadline" in err_str:
            return AIProviderTimeoutError(provider=self.provider_name, timeout_seconds=30.0, technical_error=str(err))
        elif "unavailable" in err_str or "503" in err_str or "502" in err_str:
            return AIProviderUnavailableError(provider=self.provider_name, technical_error=str(err))
        elif "invalid" in err_str or "400" in err_str:
            return AIInvalidPromptError(message=str(err), provider=self.provider_name, technical_error=str(err))
        return AIGatewayError(message=f"Groq error: {err}", provider=self.provider_name, technical_error=str(err))

    async def generate(
        self,
        messages: List[ChatMessage],
        options: Optional[AIOptions] = None
    ) -> AIResponse:
        if not self.is_configured():
            raise AIProviderAuthenticationError(
                provider=self.provider_name,
                technical_error="GROQ_API_KEY is not configured"
            )

        t0 = time.time()
        opts = options or AIOptions()
        target_model = opts.model or self.default_model
        # Use fast model for FAST_MODEL tier
        if opts.tier == "FAST_MODEL" and target_model == GROQ_DEFAULT_MODEL:
            target_model = GROQ_FAST_MODEL

        groq_messages = self._build_messages(messages)

        try:
            loop = asyncio.get_running_loop()
            response = await loop.run_in_executor(
                None,
                lambda: self._client.chat.completions.create(
                    messages=groq_messages,
                    model=target_model,
                    max_tokens=opts.max_tokens or 1024,
                    temperature=opts.temperature or 0.7,
                )
            )

            latency = int((time.time() - t0) * 1000)
            reply_text = response.choices[0].message.content or ""
            usage = response.usage

            return AIResponse(
                text=reply_text.strip(),
                finish_reason=response.choices[0].finish_reason or "stop",
                usage=TokenUsage(
                    prompt_tokens=usage.prompt_tokens if usage else self.count_tokens(str(groq_messages)),
                    completion_tokens=usage.completion_tokens if usage else self.count_tokens(reply_text),
                    total_tokens=usage.total_tokens if usage else 0
                ),
                latency_ms=latency,
                provider=self.provider_name,
                model=target_model
            )

        except Exception as e:
            raise self._map_groq_error(e)

    async def generate_stream(
        self,
        messages: List[ChatMessage],
        options: Optional[AIOptions] = None
    ) -> AsyncIterator[AIStreamChunk]:
        if not self.is_configured():
            raise AIProviderAuthenticationError(
                provider=self.provider_name,
                technical_error="GROQ_API_KEY is not configured"
            )

        opts = options or AIOptions()
        target_model = opts.model or self.default_model
        groq_messages = self._build_messages(messages)

        try:
            loop = asyncio.get_running_loop()
            stream = await loop.run_in_executor(
                None,
                lambda: self._client.chat.completions.create(
                    messages=groq_messages,
                    model=target_model,
                    max_tokens=opts.max_tokens or 1024,
                    temperature=opts.temperature or 0.7,
                    stream=True,
                )
            )

            accumulated = []
            for chunk in stream:
                delta = chunk.choices[0].delta.content or "" if chunk.choices else ""
                if delta:
                    accumulated.append(delta)
                    yield AIStreamChunk(text=delta, is_final=False)

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
            raise self._map_groq_error(e)

    async def health_check(self) -> ProviderHealth:
        if not self.is_configured():
            return ProviderHealth(
                provider=self.provider_name,
                status="NOT_CONFIGURED",
                error_message="GROQ_API_KEY is not configured"
            )

        t0 = time.time()
        try:
            loop = asyncio.get_running_loop()
            await loop.run_in_executor(
                None,
                lambda: self._client.chat.completions.create(
                    messages=[{"role": "user", "content": "hi"}],
                    model=GROQ_FAST_MODEL,
                    max_tokens=5
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
            "max_context_window": 131072,
            "supports_streaming": True,
            "supports_tools": False,
            "pricing": "FREE - No credit card required"
        }
