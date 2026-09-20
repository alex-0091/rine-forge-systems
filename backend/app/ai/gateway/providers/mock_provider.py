"""
Rine Forge Systems V5 - Mock AI Provider
Deterministic, zero-cost test provider for automated tests and offline verification.
Supports simulated latency, errors, token generation, streaming, and tool calls.
"""
import asyncio
import time
from typing import List, Dict, Any, Optional, AsyncIterator

from backend.app.ai.gateway.interface import (
    BaseAIProvider, ChatMessage, AIOptions, AIResponse,
    AIStreamChunk, TokenUsage, ProviderHealth
)
from backend.app.ai.gateway.errors import (
    AIProviderRateLimitError, AIProviderUnavailableError,
    AIProviderTimeoutError, AIProviderAuthenticationError
)

class MockProvider(BaseAIProvider):
    provider_name: str = "mock"

    def __init__(
        self,
        default_response: str = "This is a deterministic response from the Rine Forge AI mock engine.",
        simulate_error: Optional[str] = None,
        simulate_latency_ms: int = 0
    ):
        self.default_response = default_response
        self.simulate_error = simulate_error
        self.simulate_latency_ms = simulate_latency_ms
        self.call_count = 0
        self.supported_models = ["mock-fast", "mock-quality"]

    def is_configured(self) -> bool:
        return True

    def count_tokens(self, text: str) -> int:
        if not text:
            return 0
        # Standard token heuristic: ~4 chars per token or ~1.3 tokens per word
        return max(1, len(text.split()) * 4 // 3)

    def _maybe_raise_simulated_error(self):
        if self.simulate_error == "rate_limit":
            raise AIProviderRateLimitError(provider=self.provider_name, retry_after=1)
        elif self.simulate_error == "unavailable":
            raise AIProviderUnavailableError(provider=self.provider_name, technical_error="503 Service Unavailable")
        elif self.simulate_error == "timeout":
            raise AIProviderTimeoutError(provider=self.provider_name, timeout_seconds=1.0)
        elif self.simulate_error == "auth":
            raise AIProviderAuthenticationError(provider=self.provider_name)

    async def generate(
        self,
        messages: List[ChatMessage],
        options: Optional[AIOptions] = None
    ) -> AIResponse:
        self.call_count += 1
        t0 = time.time()

        if self.simulate_latency_ms > 0:
            await asyncio.sleep(self.simulate_latency_ms / 1000.0)

        self._maybe_raise_simulated_error()

        last_user_msg = next((m.content for m in reversed(messages) if m.role == "user"), "")
        target_model = (options.model if options and options.model else "mock-fast")

        # Deterministic reply generation based on content
        if "hours" in last_user_msg.lower():
            reply_text = "We are open Monday through Friday from 8:30 AM to 5:30 PM."
        elif "price" in last_user_msg.lower() or "cost" in last_user_msg.lower():
            reply_text = "Comprehensive service options start from $120. Would you like to schedule an appointment?"
        elif options and options.response_format == "json_object":
            reply_text = '{"status": "ok", "intent": "inquiry", "summary": "mock structured reply"}'
        else:
            reply_text = self.default_response

        in_tokens = sum(self.count_tokens(m.content) for m in messages)
        out_tokens = self.count_tokens(reply_text)
        latency = int((time.time() - t0) * 1000)

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
            model=target_model,
            raw_metadata={"mock": True, "call_count": self.call_count}
        )

    async def generate_stream(
        self,
        messages: List[ChatMessage],
        options: Optional[AIOptions] = None
    ) -> AsyncIterator[AIStreamChunk]:
        self.call_count += 1
        self._maybe_raise_simulated_error()

        response = await self.generate(messages, options)
        words = response.text.split(" ")

        for idx, word in enumerate(words):
            chunk_text = word if idx == len(words) - 1 else word + " "
            if self.simulate_latency_ms > 0:
                await asyncio.sleep(self.simulate_latency_ms / (1000.0 * len(words)))
            yield AIStreamChunk(text=chunk_text, is_final=False)

        # Final chunk with metrics
        yield AIStreamChunk(
            text="",
            finish_reason="stop",
            usage=response.usage,
            is_final=True
        )

    async def health_check(self) -> ProviderHealth:
        if self.simulate_error == "unavailable":
            return ProviderHealth(
                provider=self.provider_name,
                status="UNAVAILABLE",
                error_message="Mock provider configured as unavailable"
            )
        return ProviderHealth(
            provider=self.provider_name,
            status="AVAILABLE",
            models=self.supported_models,
            latency_ms=1
        )

    def get_model_info(self) -> Dict[str, Any]:
        return {
            "provider": self.provider_name,
            "models": self.supported_models,
            "max_context_window": 8192,
            "supports_streaming": True,
            "supports_tools": True
        }
