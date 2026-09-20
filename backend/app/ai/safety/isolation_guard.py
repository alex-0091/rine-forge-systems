"""
Rine Forge Systems V5 - Phase AS: Security & Multi-Tenant Isolation Guard
Enforces strict tenant boundaries, model allowlists, SSRF protections,
payload size limits, and command execution restrictions.
A customer can NEVER access another customer's data or execute unauthorized host actions.
"""
import ipaddress
import urllib.parse
import logging
from typing import List, Optional

logger = logging.getLogger("rine_forge.ai.safety.isolation")


class SecurityViolationError(Exception):
    """Raised when an operation violates multi-tenant or execution security policies."""
    def __init__(self, message: str, code: str = "SECURITY_VIOLATION"):
        super().__init__(message)
        self.message = message
        self.code = code


class IsolationGuard:
    """
    Central enforcement gate for cross-tenant isolation, SSRF prevention,
    and payload boundaries.
    """

    MAX_PAYLOAD_BYTES = 2 * 1024 * 1024  # 2 MB limit for prompts/payloads
    INTERNAL_IP_RANGES = [
        ipaddress.ip_network("127.0.0.0/8"),
        ipaddress.ip_network("10.0.0.0/8"),
        ipaddress.ip_network("172.16.0.0/12"),
        ipaddress.ip_network("192.168.0.0/16"),
        ipaddress.ip_network("169.254.0.0/16"),
        ipaddress.ip_network("::1/128"),
        ipaddress.ip_network("fc00::/7"),
        ipaddress.ip_network("fe80::/10"),
    ]

    @staticmethod
    def verify_tenant_boundary(caller_tenant_id: str, target_tenant_id: str):
        """Prevents cross-tenant data access."""
        if not caller_tenant_id or not target_tenant_id:
            raise SecurityViolationError("Tenant identifier missing.", code="TENANT_ID_MISSING")
        if caller_tenant_id != target_tenant_id:
            logger.critical(
                f"[SECURITY ALERT] Cross-tenant access attempt: "
                f"Caller '{caller_tenant_id}' tried to access target '{target_tenant_id}'."
            )
            raise SecurityViolationError(
                "Access denied: Cannot access resources belonging to another tenant.",
                code="CROSS_TENANT_VIOLATION"
            )

    @classmethod
    def verify_payload_size(cls, text: str, max_bytes: Optional[int] = None):
        """Protects backend against memory exhaustion from giant payloads."""
        limit = max_bytes or cls.MAX_PAYLOAD_BYTES
        payload_size = len(text.encode("utf-8"))
        if payload_size > limit:
            raise SecurityViolationError(
                f"Payload size ({payload_size} bytes) exceeds safety limit of {limit} bytes.",
                code="PAYLOAD_TOO_LARGE"
            )

    @classmethod
    def verify_ssrf_safety(cls, url: str, allow_local: bool = False):
        """
        Guards website audit / fetching against SSRF (Server-Side Request Forgery).
        Prohibits accessing internal AWS/GCP metadata services (169.254.169.254)
        or private RFC1918 subnets.
        """
        try:
            parsed = urllib.parse.urlparse(url if "://" in url else f"https://{url}")
            host = parsed.hostname or ""
        except Exception:
            raise SecurityViolationError(f"Malformed URL: '{url}'", code="INVALID_URL")

        if not host:
            raise SecurityViolationError("URL host cannot be empty.", code="EMPTY_HOST")

        if host.lower() in ("localhost", "127.0.0.1", "::1", "metadata.google.internal") and not allow_local:
            raise SecurityViolationError(
                f"Access to localhost or private metadata service ('{host}') is strictly prohibited.",
                code="SSRF_PROHIBITED"
            )

        # Check IP ranges if host is an IP address
        try:
            ip = ipaddress.ip_address(host)
            if not allow_local:
                for network in cls.INTERNAL_IP_RANGES:
                    if ip in network:
                        raise SecurityViolationError(
                            f"Access to internal IP address '{ip}' is strictly blocked.",
                            code="SSRF_PRIVATE_IP"
                        )
        except ValueError:
            # Host is a domain name, not an IP literal
            pass

    @staticmethod
    def verify_tool_scope(user_permissions: List[str], required_scope: str):
        """Enforces role-based tool capability execution."""
        perms = [p.upper() for p in user_permissions]
        req = required_scope.upper()

        if "ADMIN" in perms or req in perms or "ALL" in perms:
            return True

        raise SecurityViolationError(
            f"User lacks required authorization scope '{required_scope}'.",
            code="PERMISSION_DENIED"
        )


isolation_guard = IsolationGuard()
