"""
Rine Forge Systems V5 - OpenAI Provider Adapter
Production integration for OpenAI models (gpt-4o-mini, gpt-4o).
Supports text completions, SSE streaming, function calling, and granular error mapping.
"""
import time
import logging
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

logger = logging.getLogger("rine_forge_systems.ai.providers.openai")

class OpenAIProvider(BaseAIProvider):
    provider_name: str = "openai"

    def __init__(self, api_key: Optional[str] = None, default_model: Optional[str] = None):
        self.api_key = api_key or settings.OPENAI_API_KEY
        self.default_model = default_model or settings.OPENAI_MODEL or "gpt-4o-mini"
        self._client = None
        self.supported_models = ["gpt-4o-mini", "gpt-4o", "gpt-3.5-turbo"]

        if self.api_key:
            try:
                from openai import AsyncOpenAI
                self._client = AsyncOpenAI(api_key=self.api_key, timeout=30.0)
            except Exception as e:
                logger.warning(f"Failed to initialize AsyncOpenAI: {e}")

    def is_configured(self) -> bool:
        return bool(self.api_key and self._client)

    def count_tokens(self, text: str) -> int:
        if not text:
            return 0
        try:
            import tiktoken
            encoding = tiktoken.get_encoding("cl100k_base")
            return len(encoding.encode(text))
        except Exception:
            return max(1, len(text.split()) * 4 // 3)

    def _convert_messages(self, messages: List[ChatMessage]) -> List[Dict[str, Any]]:
        formatted = []
        for m in messages:
            msg_dict = {"role": m.role, "content": m.content}
            if m.name:
                msg_dict["name"] = m.name
            formatted.append(msg_dict)
        return formatted

    def _map_openai_error(self, err: Exception) -> Exception:
        err_str = str(err).lower()
        err_type = type(err).__name__

        if "auth" in err_type.lower() or "authentication" in err_str or "api key" in err_str:
            return AIProviderAuthenticationError(provider=self.provider_name, technical_error=str(err))
        elif "ratelimit" in err_type.lower() or "429" in err_str:
            return AIProviderRateLimitError(provider=self.provider_name, technical_error=str(err))
        elif "timeout" in err_type.lower() or "timed out" in err_str:
            return AIProviderTimeoutError(provider=self.provider_name, timeout_seconds=30.0, technical_error=str(err))
        elif "connection" in err_type.lower() or "unavailable" in err_str or "503" in err_str:
            return AIProviderUnavailableError(provider=self.provider_name, technical_error=str(err))
        elif "badrequest" in err_type.lower() or "400" in err_str:
            return AIInvalidPromptError(message=str(err), provider=self.provider_name, technical_error=str(err))
        return AIGatewayError(message=f"OpenAI error: {err}", provider=self.provider_name, technical_error=str(err))

    async def generate(
        self,
        messages: List[ChatMessage],
        options: Optional[AIOptions] = None
    ) -> AIResponse:
        if not self.is_configured():
            raise AIProviderAuthenticationError(
                provider=self.provider_name,
                technical_error="OPENAI_API_KEY is not configured"
            )

        t0 = time.time()
        opts = options or AIOptions()
        target_model = opts.model or self.default_model

        kwargs: Dict[str, Any] = {
            "model": target_model,
            "messages": self._convert_messages(messages),
            "temperature": opts.temperature,
            "max_tokens": opts.max_tokens,
            "timeout": opts.timeout_seconds
        }

        if opts.response_format == "json_object":
            kwargs["response_format"] = {"type": "json_object"}

        if opts.tools:
            kwargs["tools"] = opts.tools

        try:
            res = await self._client.chat.completions.create(**kwargs)
            latency = int((time.time() - t0) * 1000)

            choice = res.choices[0]
            reply_text = choice.message.content or ""
            finish_reason = choice.finish_reason

            usage = TokenUsage(
                prompt_tokens=res.usage.prompt_tokens if res.usage else 0,
                completion_tokens=res.usage.completion_tokens if res.usage else 0,
                total_tokens=res.usage.total_tokens if res.usage else 0
            )

            tool_calls = None
            if choice.message.tool_calls:
                tool_calls = [
                    {
                        "id": tc.id,
                        "type": tc.type,
                        "function": {
                            "name": tc.function.name,
                            "arguments": tc.function.arguments
                        }
                    }
                    for tc in choice.message.tool_calls
                ]

            return AIResponse(
                text=reply_text,
                finish_reason=finish_reason,
                usage=usage,
                latency_ms=latency,
                provider=self.provider_name,
                model=target_model,
                tool_calls=tool_calls,
                raw_metadata={"system_fingerprint": getattr(res, "system_fingerprint", None)}
            )

        except Exception as e:
            raise self._map_openai_error(e)

    async def generate_stream(
        self,
        messages: List[ChatMessage],
        options: Optional[AIOptions] = None
    ) -> AsyncIterator[AIStreamChunk]:
        if not self.is_configured():
            raise AIProviderAuthenticationError(
                provider=self.provider_name,
                technical_error="OPENAI_API_KEY is not configured"
            )

        opts = options or AIOptions()
        target_model = opts.model or self.default_model

        kwargs: Dict[str, Any] = {
            "model": target_model,
            "messages": self._convert_messages(messages),
            "temperature": opts.temperature,
            "max_tokens": opts.max_tokens,
            "stream": True,
            "timeout": opts.timeout_seconds
        }

        if opts.response_format == "json_object":
            kwargs["response_format"] = {"type": "json_object"}

        accumulated_text = []

        try:
            stream = await self._client.chat.completions.create(**kwargs)
            async for chunk in stream:
                if not chunk.choices:
                    continue
                delta = chunk.choices[0].delta
                finish_reason = chunk.choices[0].finish_reason
                token_text = delta.content or ""
                if token_text:
                    accumulated_text.append(token_text)

                if finish_reason:
                    full_text = "".join(accumulated_text)
                    in_tokens = sum(self.count_tokens(m.content) for m in messages)
                    out_tokens = self.count_tokens(full_text)
                    usage = TokenUsage(
                        prompt_tokens=in_tokens,
                        completion_tokens=out_tokens,
                        total_tokens=in_tokens + out_tokens
                    )
                    yield AIStreamChunk(
                        text=token_text,
                        finish_reason=finish_reason,
                        usage=usage,
                        is_final=True
                    )
                else:
                    yield AIStreamChunk(text=token_text, is_final=False)

        except Exception as e:
            raise self._map_openai_error(e)

    async def health_check(self) -> ProviderHealth:
        if not self.is_configured():
            return ProviderHealth(
                provider=self.provider_name,
                status="NOT_CONFIGURED",
                error_message="OPENAI_API_KEY is not configured"
            )

        t0 = time.time()
        try:
            # Lightweight test with models.list or 1-token probe
            await self._client.models.list()
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
            "max_context_window": 128000,
            "supports_streaming": True,
            "supports_tools": True,
            "supports_json_mode": True
        }
