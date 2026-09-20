"""
Rine Forge Systems V5 - Global Exception Handlers
Formats all errors into predictable, human-friendly JSON envelopes
with traceable RF-XXXXXX reference codes.
"""
import logging
import uuid
from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from backend.app.errors.exceptions import AppException

logger = logging.getLogger("rine_forge_systems.errors")

def get_request_id(request: Request) -> str:
    """Retrieves or creates a traceable request identifier."""
    if hasattr(request.state, "request_id"):
        return request.state.request_id
    return f"RF-{uuid.uuid4().hex[:6].upper()}"

async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    req_id = get_request_id(request)
    if exc.technical_error:
        logger.error(f"[{req_id}] {exc.error_code}: {exc.message} | Technical: {exc.technical_error}")
    else:
        logger.warning(f"[{req_id}] {exc.error_code}: {exc.message}")

    content = {
        "detail": exc.message,
        "error": {
            "code": exc.error_code,
            "message": exc.message,
            "reference": req_id,
            "details": exc.details
        }
    }
    return JSONResponse(
        status_code=exc.status_code,
        content=content,
        headers={"X-Request-ID": req_id}
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    req_id = get_request_id(request)
    errors = exc.errors()
    formatted_errors = []
    for err in errors:
        loc = " -> ".join(str(l) for l in err.get("loc", []))
        msg = err.get("msg", "Invalid value")
        formatted_errors.append(f"{loc}: {msg}")

    user_message = f"Validation failed: {'; '.join(formatted_errors)}" if formatted_errors else "Invalid request data."
    logger.info(f"[{req_id}] VALIDATION_ERROR on {request.method} {request.url.path}: {user_message}")

    content = {
        "detail": user_message,
        "error": {
            "code": "VALIDATION_ERROR",
            "message": user_message,
            "reference": req_id,
            "details": {"validation_errors": errors}
        }
    }
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_CONTENT if hasattr(status, "HTTP_422_UNPROCESSABLE_CONTENT") else 422,
        content=content,
        headers={"X-Request-ID": req_id}
    )

async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    req_id = get_request_id(request)
    code_map = {
        400: "BAD_REQUEST",
        401: "UNAUTHORIZED",
        403: "FORBIDDEN",
        404: "NOT_FOUND",
        409: "CONFLICT",
        422: "VALIDATION_ERROR",
        429: "RATE_LIMITED",
        500: "INTERNAL_ERROR",
        502: "INTEGRATION_ERROR",
        503: "DATABASE_ERROR"
    }
    error_code = code_map.get(exc.status_code, f"HTTP_{exc.status_code}")
    message = str(exc.detail) if exc.detail else "An HTTP error occurred"

    logger.warning(f"[{req_id}] {error_code} ({exc.status_code}) on {request.method} {request.url.path}: {message}")

    content = {
        "detail": message,
        "error": {
            "code": error_code,
            "message": message,
            "reference": req_id,
            "details": {}
        }
    }
    return JSONResponse(
        status_code=exc.status_code,
        content=content,
        headers={"X-Request-ID": req_id, **(exc.headers or {})}
    )

async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    req_id = get_request_id(request)
    logger.exception(f"[{req_id}] Unhandled INTERNAL_ERROR on {request.method} {request.url.path}: {exc}")

    content = {
        "detail": f"Something went wrong. Reference: {req_id}",
        "error": {
            "code": "INTERNAL_ERROR",
            "message": f"Something went wrong. Reference: {req_id}",
            "reference": req_id,
            "details": {}
        }
    }
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=content,
        headers={"X-Request-ID": req_id}
    )
