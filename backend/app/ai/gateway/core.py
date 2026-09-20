"""
Rine Forge Systems V5 - Centralized AI Gateway
Executes resilient LLM requests with request timeouts, bounded retries,
automatic fallback routing, and structured logging tied to request IDs.
"""
import asyncio
import logging
import time
from typing import List, Dict, Any, Optional, AsyncIterator

from backend.app.ai.gateway.interface import (
    ChatMessage, AIOptions, AIResponse, AIStreamChunk, ProviderHealth
)
from backend.app.ai.gateway.router import ModelRouter
from backend.app.ai.gateway.errors import (
    AIGatewayError, AIProviderRateLimitError, AIProviderUnavailableError,
    AIProviderTimeoutError, AIProviderAuthenticationError
)
from backend.app.logging.context import get_request_id

logger = logging.getLogger("rine_forge_systems.ai.gateway")

class AIGateway:
    """
    Production AI Gateway.
    Guarantees that all AI interactions pass through timeouts, bounded retries,
    fallback routing, and telemetry logging before reaching the application.
    """

    def __init__(self, router: Optional[ModelRouter] = None, max_retries: int = 2):
        self.router = router or ModelRouter()
        self.max_retries = max_retries
        self.default_timeout = 30.0

    async def generate(
        self,
        messages: List[ChatMessage],
        options: Optional[AIOptions] = None
    ) -> AIResponse:
        opts = options or AIOptions()
        timeout = opts.timeout_seconds or self.default_timeout
        request_id = get_request_id() or "RF-INTERNAL"

        provider, model_name = self.router.resolve_route(opts)
        effective_opts = opts.model_copy(update={"model": model_name})

        # Retry & Fallback Execution Loop
        attempt = 0
        backoff_delays = [0.4, 0.8]

        while attempt <= self.max_retries:
            try:
                logger.info(
                    f"[{request_id}] AI Gateway dispatch -> Provider='{provider.provider_name}' "
                    f"Model='{model_name}' (Attempt {attempt + 1}/{self.max_retries + 1})"
                )

                response = await asyncio.wait_for(
                    provider.generate(messages, effective_opts),
                    timeout=timeout
                )
                logger.info(
                    f"[{request_id}] AI Gateway success -> Provider='{provider.provider_name}' "
                    f"Latency={response.latency_ms}ms Tokens={response.usage.total_tokens}"
                )
                return response

            except asyncio.TimeoutError:
                err = AIProviderTimeoutError(provider=provider.provider_name, timeout_seconds=timeout)
                logger.warning(f"[{request_id}] Provider '{provider.provider_name}' timed out after {timeout}s.")
                if attempt < self.max_retries:
                    attempt += 1
                    await asyncio.sleep(backoff_delays[min(attempt - 1, len(backoff_delays) - 1)])
                    continue
                # Try fallback provider on timeout
                fallback = self.router.get_fallback_route(provider.provider_name, effective_opts)
                if fallback:
                    fb_provider, fb_model = fallback
                    return await asyncio.wait_for(
                        fb_provider.generate(messages, effective_opts.model_copy(update={"model": fb_model})),
                        timeout=timeout
                    )
                raise err

            except (AIProviderRateLimitError, AIProviderUnavailableError) as transient_err:
                logger.warning(
                    f"[{request_id}] Transient AI error on '{provider.provider_name}': {transient_err}. "
                    f"Attempt {attempt + 1}/{self.max_retries + 1}"
                )
                if attempt < self.max_retries:
                    attempt += 1
                    delay = backoff_delays[min(attempt - 1, len(backoff_delays) - 1)]
                    await asyncio.sleep(delay)
                    continue

                # Attempts exhausted; attempt fallback provider
                fallback = self.router.get_fallback_route(provider.provider_name, effective_opts)
                if fallback:
                    fb_provider, fb_model = fallback
                    logger.info(f"[{request_id}] Falling back to '{fb_provider.provider_name}' ({fb_model})")
                    try:
                        return await fb_provider.generate(messages, effective_opts.model_copy(update={"model": fb_model}))
                    except Exception as fb_err:
                        logger.error(f"[{request_id}] Fallback provider also failed: {fb_err}")
                raise transient_err

            except Exception as non_transient:
                logger.error(f"[{request_id}] AI Gateway error on '{provider.provider_name}': {non_transient}")
                # For non-transient failures (e.g. invalid API key), attempt immediate fallback once
                fallback = self.router.get_fallback_route(provider.provider_name, effective_opts)
                if fallback:
                    fb_provider, fb_model = fallback
                    logger.info(f"[{request_id}] Primary failed with non-transient error, attempting fallback to '{fb_provider.provider_name}'")
                    try:
                        return await fb_provider.generate(messages, effective_opts.model_copy(update={"model": fb_model}))
                    except Exception as fb_err:
                        logger.error(f"[{request_id}] Fallback provider failed: {fb_err}")
                raise non_transient

        raise AIGatewayError(message="Exhausted maximum retry attempts without response", provider=provider.provider_name)

    async def generate_stream(
        self,
        messages: List[ChatMessage],
        options: Optional[AIOptions] = None
    ) -> AsyncIterator[AIStreamChunk]:
        opts = options or AIOptions()
        request_id = get_request_id() or "RF-STREAM"

        provider, model_name = self.router.resolve_route(opts)
        effective_opts = opts.model_copy(update={"model": model_name})

        logger.info(f"[{request_id}] AI Gateway streaming -> Provider='{provider.provider_name}' Model='{model_name}'")

        try:
            async for chunk in provider.generate_stream(messages, effective_opts):
                yield chunk
        except Exception as e:
            logger.error(f"[{request_id}] Streaming error from '{provider.provider_name}': {e}")
            # Check fallback
            fallback = self.router.get_fallback_route(provider.provider_name, effective_opts)
            if fallback:
                fb_provider, fb_model = fallback
                logger.info(f"[{request_id}] Streaming fallback -> '{fb_provider.provider_name}'")
                async for chunk in fb_provider.generate_stream(messages, effective_opts.model_copy(update={"model": fb_model})):
                    yield chunk
            else:
                raise

    async def get_health_status(self) -> Dict[str, Any]:
        """Deep health and configuration report of all AI adapters."""
        healths = await self.router.check_all_health()
        primary_provider, primary_model = self.router.resolve_route()

        return {
            "gateway_status": "ONLINE",
            "active_provider": primary_provider.provider_name,
            "active_model": primary_model,
            "providers": {k: v.model_dump() for k, v in healths.items()}
        }

# Global AI Gateway Singleton
ai_gateway = AIGateway()
