"""
Rine Forge Systems V5 - Ollama Local AI Provider Adapter
Provides local, privacy-first inference through Ollama (localhost:11434).
Supports text generation, streaming, model discovery, and offline graceful degradation.
"""
import time
import json
import logging
import httpx
from typing import List, Dict, Any, Optional, AsyncIterator

from backend.app.config import settings
from backend.app.ai.gateway.interface import (
    BaseAIProvider, ChatMessage, AIOptions, AIResponse,
    AIStreamChunk, TokenUsage, ProviderHealth
)
from backend.app.ai.gateway.errors import (
    AIProviderUnavailableError, AIProviderTimeoutError,
    AIInvalidPromptError, AIGatewayError
)

logger = logging.getLogger("rine_forge_systems.ai.providers.ollama")

class OllamaProvider(BaseAIProvider):
    provider_name: str = "ollama"

    def __init__(
        self,
        base_url: Optional[str] = None,
        default_model: Optional[str] = None
    ):
        self.base_url = (base_url or getattr(settings, "OLLAMA_BASE_URL", "http://localhost:11434")).rstrip("/")
        self.default_model = default_model or getattr(settings, "OLLAMA_MODEL", "llama3")
        self.supported_models = [self.default_model, "mistral", "phi3"]

    def is_configured(self) -> bool:
        # Ollama is configured by endpoint availability (local default)
        return True

    def count_tokens(self, text: str) -> int:
        if not text:
            return 0
        return max(1, len(text.split()) * 4 // 3)

    def _convert_messages(self, messages: List[ChatMessage]) -> List[Dict[str, str]]:
        return [{"role": m.role, "content": m.content} for m in messages]

    async def generate(
        self,
        messages: List[ChatMessage],
        options: Optional[AIOptions] = None
    ) -> AIResponse:
        t0 = time.time()
        opts = options or AIOptions()
        target_model = opts.model or self.default_model

        payload = {
            "model": target_model,
            "messages": self._convert_messages(messages),
            "stream": False,
            "options": {
                "temperature": opts.temperature,
                "num_predict": opts.max_tokens
            }
        }
        if opts.response_format == "json_object":
            payload["format"] = "json"

        try:
            async with httpx.AsyncClient(timeout=opts.timeout_seconds) as client:
                res = await client.post(f"{self.base_url}/api/chat", json=payload)
                if res.status_code != 200:
                    raise AIGatewayError(
                        message=f"Ollama returned HTTP {res.status_code}: {res.text}",
                        provider=self.provider_name,
                        status_code=502
                    )

                data = res.json()
                latency = int((time.time() - t0) * 1000)
                reply_text = data.get("message", {}).get("content", "")

                prompt_tokens = data.get("prompt_eval_count", sum(self.count_tokens(m.content) for m in messages))
                eval_tokens = data.get("eval_count", self.count_tokens(reply_text))

                return AIResponse(
                    text=reply_text,
                    finish_reason="stop" if data.get("done") else None,
                    usage=TokenUsage(
                        prompt_tokens=prompt_tokens,
                        completion_tokens=eval_tokens,
                        total_tokens=prompt_tokens + eval_tokens
                    ),
                    latency_ms=latency,
                    provider=self.provider_name,
                    model=target_model,
                    raw_metadata={"total_duration": data.get("total_duration")}
                )

        except httpx.ConnectError as e:
            raise AIProviderUnavailableError(
                provider=self.provider_name,
                technical_error=f"Cannot connect to Ollama at {self.base_url}. Ensure Ollama is running locally: {e}"
            )
        except httpx.TimeoutException as e:
            raise AIProviderTimeoutError(
                provider=self.provider_name,
                timeout_seconds=opts.timeout_seconds,
                technical_error=str(e)
            )
        except Exception as e:
            if isinstance(e, AIGatewayError):
                raise
            raise AIGatewayError(message=str(e), provider=self.provider_name, technical_error=str(e))

    async def generate_stream(
        self,
        messages: List[ChatMessage],
        options: Optional[AIOptions] = None
    ) -> AsyncIterator[AIStreamChunk]:
        opts = options or AIOptions()
        target_model = opts.model or self.default_model

        payload = {
            "model": target_model,
            "messages": self._convert_messages(messages),
            "stream": True,
            "options": {
                "temperature": opts.temperature,
                "num_predict": opts.max_tokens
            }
        }
        if opts.response_format == "json_object":
            payload["format"] = "json"

        try:
            async with httpx.AsyncClient(timeout=opts.timeout_seconds) as client:
                async with client.stream("POST", f"{self.base_url}/api/chat", json=payload) as response:
                    if response.status_code != 200:
                        raise AIGatewayError(
                            message=f"Ollama stream returned HTTP {response.status_code}",
                            provider=self.provider_name,
                            status_code=502
                        )

                    async for line in response.aiter_lines():
                        if not line:
                            continue
                        chunk_data = json.loads(line)
                        token_text = chunk_data.get("message", {}).get("content", "")
                        is_done = chunk_data.get("done", False)

                        if is_done:
                            prompt_tokens = chunk_data.get("prompt_eval_count", 0)
                            eval_tokens = chunk_data.get("eval_count", 0)
                            yield AIStreamChunk(
                                text=token_text,
                                finish_reason="stop",
                                usage=TokenUsage(
                                    prompt_tokens=prompt_tokens,
                                    completion_tokens=eval_tokens,
                                    total_tokens=prompt_tokens + eval_tokens
                                ),
                                is_final=True
                            )
                        else:
                            yield AIStreamChunk(text=token_text, is_final=False)

        except httpx.ConnectError as e:
            raise AIProviderUnavailableError(
                provider=self.provider_name,
                technical_error=f"Ollama stream unreachable at {self.base_url}: {e}"
            )
        except Exception as e:
            if isinstance(e, AIGatewayError):
                raise
            raise AIGatewayError(message=str(e), provider=self.provider_name, technical_error=str(e))

    async def health_check(self) -> ProviderHealth:
        t0 = time.time()
        try:
            async with httpx.AsyncClient(timeout=2.0) as client:
                res = await client.get(f"{self.base_url}/api/tags")
                if res.status_code == 200:
                    data = res.json()
                    models = [m.get("name") for m in data.get("models", [])]
                    latency = int((time.time() - t0) * 1000)
                    return ProviderHealth(
                        provider=self.provider_name,
                        status="AVAILABLE",
                        models=models or self.supported_models,
                        latency_ms=latency
                    )
                return ProviderHealth(
                    provider=self.provider_name,
                    status="ERROR",
                    error_message=f"Ollama returned status code {res.status_code}"
                )
        except Exception as e:
            return ProviderHealth(
                provider=self.provider_name,
                status="UNAVAILABLE",
                error_message=f"Ollama is offline or unreachable at {self.base_url}"
            )

    def get_model_info(self) -> Dict[str, Any]:
        return {
            "provider": self.provider_name,
            "base_url": self.base_url,
            "models": self.supported_models,
            "default_model": self.default_model,
            "max_context_window": 8192,
            "supports_streaming": True,
            "supports_tools": False
        }
