"""
Rine Forge Systems V5 - AI Gateway Domain Errors
Provides clear, distinct error types for all AI provider and model failures.
"""
from typing import Optional, Dict, Any
from backend.app.errors.exceptions import AIError

class AIGatewayError(AIError):
    """Base error for all AI Gateway failures."""
    def __init__(
        self,
        message: str,
        error_code: str = "AI_GATEWAY_ERROR",
        provider: str = "unknown",
        model: Optional[str] = None,
        technical_error: Optional[str] = None,
        status_code: int = 502,
        details: Optional[Dict[str, Any]] = None
    ):
        det = details or {}
        det["provider"] = provider
        if model:
            det["model"] = model
        super().__init__(message=message, provider=provider, technical_error=technical_error)
        self.error_code = error_code
        self.status_code = status_code
        self.details = det

class AIProviderAuthenticationError(AIGatewayError):
    """Provider rejected credentials or API key is invalid/missing."""
    def __init__(self, provider: str, technical_error: Optional[str] = None):
        super().__init__(
            message=f"Authentication failed for AI provider '{provider}'. Please check API key configuration.",
            error_code="AI_PROVIDER_AUTHENTICATION_ERROR",
            provider=provider,
            technical_error=technical_error,
            status_code=502
        )

class AIProviderRateLimitError(AIGatewayError):
    """Provider rate limit (429) hit."""
    def __init__(self, provider: str, retry_after: int = 5, technical_error: Optional[str] = None):
        super().__init__(
            message=f"AI provider '{provider}' rate limit exceeded. Please try again shortly.",
            error_code="AI_PROVIDER_RATE_LIMIT_ERROR",
            provider=provider,
            technical_error=technical_error,
            status_code=429,
            details={"retry_after_seconds": retry_after}
        )

class AIProviderQuotaExceededError(AIGatewayError):
    """Provider account credit or quota exhausted."""
    def __init__(self, provider: str, technical_error: Optional[str] = None):
        super().__init__(
            message=f"AI provider '{provider}' quota or credit limit exhausted.",
            error_code="AI_PROVIDER_QUOTA_EXCEEDED",
            provider=provider,
            technical_error=technical_error,
            status_code=502
        )

class AIProviderTimeoutError(AIGatewayError):
    """Call to AI provider timed out."""
    def __init__(self, provider: str, timeout_seconds: float, technical_error: Optional[str] = None):
        super().__init__(
            message=f"AI provider '{provider}' did not respond within {timeout_seconds} seconds.",
            error_code="AI_PROVIDER_TIMEOUT",
            provider=provider,
            technical_error=technical_error,
            status_code=504,
            details={"timeout_seconds": timeout_seconds}
        )

class AIProviderUnavailableError(AIGatewayError):
    """Provider is unreachable, offline, or service 503."""
    def __init__(self, provider: str, technical_error: Optional[str] = None):
        super().__init__(
            message=f"AI provider '{provider}' is currently unavailable or offline.",
            error_code="AI_PROVIDER_UNAVAILABLE",
            provider=provider,
            technical_error=technical_error,
            status_code=503
        )

class AIInvalidPromptError(AIGatewayError):
    """Prompt or messages format invalid or rejected."""
    def __init__(self, message: str = "Invalid prompt or message payload", provider: str = "unknown", technical_error: Optional[str] = None):
        super().__init__(
            message=message,
            error_code="AI_INVALID_PROMPT",
            provider=provider,
            technical_error=technical_error,
            status_code=400
        )

class AIContextLengthExceededError(AIGatewayError):
    """Context exceeds maximum supported window."""
    def __init__(self, provider: str, token_count: int, max_tokens: int):
        super().__init__(
            message=f"Conversation context ({token_count} tokens) exceeds model limit ({max_tokens} tokens).",
            error_code="AI_CONTEXT_LENGTH_EXCEEDED",
            provider=provider,
            technical_error=f"Tokens {token_count} > Max {max_tokens}",
            status_code=400,
            details={"token_count": token_count, "max_tokens": max_tokens}
        )
