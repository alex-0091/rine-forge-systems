"""
Rine Forge Systems V5 - Standard Application Exceptions
Defines standardized exception classes with human-friendly messaging,
deterministic error codes, and technical detail preservation.
"""
from typing import Optional, Dict, Any

class AppException(Exception):
    """Base application exception for all domain errors."""
    def __init__(
        self,
        message: str,
        error_code: str = "INTERNAL_ERROR",
        status_code: int = 500,
        details: Optional[Dict[str, Any]] = None,
        technical_error: Optional[str] = None
    ):
        super().__init__(message)
        self.message = message
        self.error_code = error_code
        self.status_code = status_code
        self.details = details or {}
        self.technical_error = technical_error

class ValidationError(AppException):
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            error_code="VALIDATION_ERROR",
            status_code=422,
            details=details
        )

class UnauthorizedError(AppException):
    def __init__(self, message: str = "Authentication credentials required or invalid"):
        super().__init__(
            message=message,
            error_code="UNAUTHORIZED",
            status_code=401
        )

class ForbiddenError(AppException):
    def __init__(self, message: str = "Access to this resource or organization is forbidden"):
        super().__init__(
            message=message,
            error_code="FORBIDDEN",
            status_code=403
        )

class NotFoundError(AppException):
    def __init__(self, resource: str, resource_id: Optional[str] = None):
        msg = f"{resource} '{resource_id}' was not found" if resource_id else f"{resource} not found"
        super().__init__(
            message=msg,
            error_code="NOT_FOUND",
            status_code=404,
            details={"resource": resource, "resource_id": resource_id}
        )

class ConflictError(AppException):
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            error_code="CONFLICT",
            status_code=409,
            details=details
        )

class RateLimitError(AppException):
    def __init__(self, message: str = "Too many requests. Please try again later.", retry_after: int = 60):
        super().__init__(
            message=message,
            error_code="RATE_LIMITED",
            status_code=429,
            details={"retry_after_seconds": retry_after}
        )

class IntegrationError(AppException):
    def __init__(self, message: str, provider: str, technical_error: Optional[str] = None):
        super().__init__(
            message=message,
            error_code="INTEGRATION_ERROR",
            status_code=502,
            details={"provider": provider},
            technical_error=technical_error
        )

class AIError(AppException):
    def __init__(self, message: str, provider: str = "llm", technical_error: Optional[str] = None):
        super().__init__(
            message=message,
            error_code="AI_ERROR",
            status_code=502,
            details={"provider": provider},
            technical_error=technical_error
        )

class DatabaseError(AppException):
    def __init__(self, message: str = "Database connection is temporarily unavailable.", technical_error: Optional[str] = None):
        super().__init__(
            message=message,
            error_code="DATABASE_ERROR",
            status_code=503,
            technical_error=technical_error
        )

class InternalError(AppException):
    def __init__(self, message: str = "An unexpected error occurred. Please contact support with the reference code.", technical_error: Optional[str] = None):
        super().__init__(
            message=message,
            error_code="INTERNAL_ERROR",
            status_code=500,
            technical_error=technical_error
        )
