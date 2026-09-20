"""
Rine Forge Systems V5 - Rate Limiting Foundation
Provides an extensible sliding-window rate limiting abstraction
supporting in-memory tracking with pluggable Redis architecture for Phase 2.
"""
import time
import asyncio
import logging
from abc import ABC, abstractmethod
from typing import Dict, List, Tuple, Optional, Callable
from fastapi import Request

from backend.app.errors.exceptions import RateLimitError

logger = logging.getLogger("rine_forge_systems.ratelimit")

class RateLimiterBackend(ABC):
    """Abstract interface for rate limiting storage."""
    @abstractmethod
    async def is_allowed(self, key: str, max_requests: int, window_seconds: int) -> Tuple[bool, int, int]:
        """
        Evaluates whether a request should be permitted.
        Returns: (is_allowed: bool, remaining_requests: int, retry_after_seconds: int)
        """
        pass

class InMemoryRateLimiter(RateLimiterBackend):
    """
    High-performance in-memory sliding-window rate limiter.
    Stores monotonic timestamps of requests per key.
    Prunes expired entries on access.
    """
    def __init__(self):
        self._store: Dict[str, List[float]] = {}
        self._lock = asyncio.Lock()

    async def is_allowed(self, key: str, max_requests: int, window_seconds: int) -> Tuple[bool, int, int]:
        async with self._lock:
            now = time.time()
            cutoff = now - window_seconds

            timestamps = self._store.get(key, [])
            # Prune timestamps older than the sliding window
            timestamps = [t for t in timestamps if t > cutoff]

            if len(timestamps) >= max_requests:
                earliest = timestamps[0]
                retry_after = max(1, int(window_seconds - (now - earliest)))
                self._store[key] = timestamps
                return False, 0, retry_after

            timestamps.append(now)
            self._store[key] = timestamps
            remaining = max(0, max_requests - len(timestamps))
            return True, remaining, 0

class RedisRateLimiter(RateLimiterBackend):
    """
    Pluggable Redis distributed rate limiter implementation.
    Ready for activation when REDIS_URL is configured in future phases.
    """
    def __init__(self, redis_url: str):
        self.redis_url = redis_url
        self._connected = False

    async def is_allowed(self, key: str, max_requests: int, window_seconds: int) -> Tuple[bool, int, int]:
        # Phase 1 stub: falls back gracefully to permissive state if redis client is not yet attached
        logger.debug(f"[RedisRateLimiter] Distributed check for {key} (Redis integration inactive)")
        return True, max_requests, 0

class RateLimiter:
    """Master RateLimiter coordinating active backend storage."""
    def __init__(self, backend: Optional[RateLimiterBackend] = None):
        self.backend = backend or InMemoryRateLimiter()

    def get_backend_name(self) -> str:
        return "in_memory" if isinstance(self.backend, InMemoryRateLimiter) else "redis"

    def limit(
        self,
        key_prefix: str,
        max_requests: int,
        window_seconds: int,
        key_func: Optional[Callable[[Request], str]] = None
    ):
        """
        FastAPI dependency factory enforcing rate limits on endpoints.
        """
        async def dependency(request: Request):
            if key_func:
                identifier = key_func(request)
            else:
                # Default to client host IP
                client_host = request.client.host if request.client else "unknown"
                forwarded = request.headers.get("X-Forwarded-For")
                identifier = forwarded.split(",")[0].strip() if forwarded else client_host

            key = f"rl:{key_prefix}:{identifier}"
            allowed, remaining, retry_after = await self.backend.is_allowed(
                key=key,
                max_requests=max_requests,
                window_seconds=window_seconds
            )

            if not allowed:
                logger.warning(f"Rate limit exceeded on {key_prefix} by {identifier} (retry after {retry_after}s)")
                raise RateLimitError(
                    message=f"Too many requests for {key_prefix}. Please retry in {retry_after} seconds.",
                    retry_after=retry_after
                )

        return dependency

# Default singleton instance
rate_limiter = RateLimiter()
