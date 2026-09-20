"""
Rine Forge Systems V5 - Structured Logging & Request ID Middleware
Injects RF-XXXXXX request IDs into all requests/responses and logs structured telemetry.
"""
import time
import uuid
import logging
from typing import Callable
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from backend.app.logging.context import set_current_request_id

logger = logging.getLogger("rine_forge_systems.access")

SENSITIVE_HEADERS = {"authorization", "x-api-key", "cookie", "set-cookie"}
SENSITIVE_QUERY_PARAMS = {"token", "password", "secret", "key", "api_key"}

def generate_request_id() -> str:
    """Generates deterministic human-friendly request ID e.g. RF-8F31A2."""
    return f"RF-{uuid.uuid4().hex[:6].upper()}"

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware that:
    1. Extracts or generates a unique Request ID (RF-XXXXXX).
    2. Binds it to request.state and context variable.
    3. Measures execution duration.
    4. Logs structured access details without sensitive data.
    5. Appends X-Request-ID to the outgoing response headers.
    """
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        req_id = request.headers.get("X-Request-ID")
        if not req_id or not req_id.startswith("RF-"):
            req_id = generate_request_id()

        request.state.request_id = req_id
        set_current_request_id(req_id)

        start_time = time.perf_counter()

        try:
            response = await call_next(request)
        except Exception:
            duration_ms = round((time.perf_counter() - start_time) * 1000, 2)
            logger.error(
                f"[{req_id}] {request.method} {request.url.path} - FAILED ({duration_ms}ms)"
            )
            raise

        duration_ms = round((time.perf_counter() - start_time) * 1000, 2)
        response.headers["X-Request-ID"] = req_id

        # Redact query params if sensitive
        query = request.url.query
        for param in SENSITIVE_QUERY_PARAMS:
            if param in query.lower():
                query = "[REDACTED]"
                break

        path_with_query = f"{request.url.path}?{query}" if query and query != "[REDACTED]" else request.url.path

        log_level = logging.INFO if response.status_code < 400 else (
            logging.WARNING if response.status_code < 500 else logging.ERROR
        )

        logger.log(
            log_level,
            f"[{req_id}] {request.method} {path_with_query} -> {response.status_code} ({duration_ms}ms)"
        )

        return response
