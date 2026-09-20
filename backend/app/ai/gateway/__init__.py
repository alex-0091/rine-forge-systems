"""
Rine Forge Systems V5 - AI Gateway Module
Centralized entry point for provider-independent model routing, execution, and structured generation.
"""
from .interface import (
    BaseAIProvider, ChatMessage, AIOptions, AIResponse,
    AIStreamChunk, TokenUsage, ProviderHealth
)
from .errors import (
    AIGatewayError, AIProviderAuthenticationError, AIProviderRateLimitError,
    AIProviderQuotaExceededError, AIProviderTimeoutError, AIProviderUnavailableError,
    AIInvalidPromptError, AIContextLengthExceededError
)
from .router import (
    ModelRouter, TIER_FAST, TIER_QUALITY, TIER_CHEAP, TIER_LOCAL, TIER_EMBEDDING
)
from .core import AIGateway, ai_gateway
from .structured import generate_structured

__all__ = [
    "BaseAIProvider",
    "ChatMessage",
    "AIOptions",
    "AIResponse",
    "AIStreamChunk",
    "TokenUsage",
    "ProviderHealth",
    "AIGatewayError",
    "AIProviderAuthenticationError",
    "AIProviderRateLimitError",
    "AIProviderQuotaExceededError",
    "AIProviderTimeoutError",
    "AIProviderUnavailableError",
    "AIInvalidPromptError",
    "AIContextLengthExceededError",
    "ModelRouter",
    "TIER_FAST",
    "TIER_QUALITY",
    "TIER_CHEAP",
    "TIER_LOCAL",
    "TIER_EMBEDDING",
    "AIGateway",
    "ai_gateway",
    "generate_structured"
]
