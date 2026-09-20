"""
Rine Forge Systems V5 - Unified AI Provider Interface & Types
Standardized request, response, streaming, and health models for all providers.
"""
from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional, AsyncIterator
from pydantic import BaseModel, Field

class ChatMessage(BaseModel):
    role: str # "system", "user", "assistant", "tool"
    content: str
    name: Optional[str] = None

class TokenUsage(BaseModel):
    prompt_tokens: int = 0
    completion_tokens: int = 0
    total_tokens: int = 0

class AIOptions(BaseModel):
    model: Optional[str] = None
    tier: Optional[str] = "FAST_MODEL" # FAST_MODEL, QUALITY_MODEL, CHEAP_MODEL, LOCAL_MODEL
    temperature: float = 0.2
    max_tokens: int = 800
    timeout_seconds: float = 30.0
    tools: Optional[List[Dict[str, Any]]] = None
    response_format: Optional[str] = None # e.g. "json_object"
    metadata: Optional[Dict[str, Any]] = None

class AIResponse(BaseModel):
    text: str
    finish_reason: Optional[str] = "stop"
    usage: TokenUsage = Field(default_factory=TokenUsage)
    latency_ms: int = 0
    provider: str
    model: str
    tool_calls: Optional[List[Dict[str, Any]]] = None
    raw_metadata: Dict[str, Any] = Field(default_factory=dict)

class AIStreamChunk(BaseModel):
    text: str = ""
    finish_reason: Optional[str] = None
    usage: Optional[TokenUsage] = None
    is_final: bool = False
    tool_calls: Optional[List[Dict[str, Any]]] = None

class ProviderHealth(BaseModel):
    provider: str
    status: str # "AVAILABLE", "UNAVAILABLE", "NOT_CONFIGURED", "ERROR"
    models: List[str] = Field(default_factory=list)
    latency_ms: Optional[int] = None
    error_message: Optional[str] = None

class BaseAIProvider(ABC):
    """
    Standard contract for all AI model providers.
    Ensures provider-agnostic text generation, streaming, token budgeting, and diagnostics.
    """
    provider_name: str = "base"

    @abstractmethod
    def is_configured(self) -> bool:
        """Returns True if required credentials/endpoints are set."""
        pass

    @abstractmethod
    async def generate(
        self,
        messages: List[ChatMessage],
        options: Optional[AIOptions] = None
    ) -> AIResponse:
        """Generates a complete response."""
        pass

    @abstractmethod
    async def generate_stream(
        self,
        messages: List[ChatMessage],
        options: Optional[AIOptions] = None
    ) -> AsyncIterator[AIStreamChunk]:
        """Streams token-by-token chunks."""
        pass

    @abstractmethod
    def count_tokens(self, text: str) -> int:
        """Estimates or counts token usage."""
        pass

    @abstractmethod
    async def health_check(self) -> ProviderHealth:
        """Checks connectivity and returns status."""
        pass

    @abstractmethod
    def get_model_info(self) -> Dict[str, Any]:
        """Returns metadata about supported models and limits."""
        pass
