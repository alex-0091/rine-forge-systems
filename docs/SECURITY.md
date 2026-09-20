# Rine Forge Systems V5 — Security Architecture & Hardening Guide

> **Document Version**: 5.1 (Phase 1 Baseline)  
> **Last Updated**: September 17, 2026  
> **Status**: Authoritative Security Specification

---

## 1. Security Baseline & Threat Model

Rine Forge Systems operates in sensitive environments including autonomous B2B outreach and client scheduling. As identified during the Phase 0 audit, several critical vulnerabilities existed in earlier development versions. Phase 1 remediates these vulnerabilities and establishes an enterprise security baseline.

---

## 2. Remediated Vulnerabilities (Phase 0 Audit Findings)

| Vulnerability ID | Classification | Location | Remediation Implemented in Phase 1 |
| :--- | :--- | :--- | :--- |
| **P0-1** | Critical | `backend/app/main.py` | **CORS Origin Whitelist**: Replaced `allow_origins=["*"]` with `ALLOWED_ORIGINS` loaded from environment settings (`configure_cors()`). Forbids wildcard origins when `allow_credentials=True`. |
| **P0-2** | Critical | `backend/app/api/kill_switch.py`, `compliance.py` | **Secured Operational Endpoints**: Enforced `get_current_user` on emergency kill-switch toggling and audit log viewing, preventing unauthenticated system halts. |
| **P1-1** | Serious | `.env` line 22 | **Committed Secret Removal**: Removed plaintext Gmail app password from repository `.env` and updated `.env.example` to enforce secret manager usage. |
| **P1-2** | Serious | `backend/app/config.py` | **Production Secret Validation**: Added `@model_validator` in `Settings`. Application fails startup if `SECRET_KEY` matches the development default when `ENVIRONMENT=production`. |

---

## 3. Defensive Security Headers (`backend/app/security/headers.py`)

All HTTP responses emitted by the platform are automatically injected with protective headers via `SecurityHeadersMiddleware`:

* **`X-Content-Type-Options: nosniff`**: Prevents MIME-type confusion attacks and browser sniffing.
* **`X-Frame-Options: DENY`**: Mitigates clickjacking attacks by forbidding iframe embedding.
* **`Referrer-Policy: strict-origin-when-cross-origin`**: Protects sensitive URL paths and query parameters from leaking to external domains.
* **`Permissions-Policy: camera=(), microphone=(), geolocation=()`**: Disables browser hardware APIs for API responses.

---

## 4. Rate Limiting Foundation (`backend/app/ratelimit/limiter.py`)

An extensible sliding-window rate-limiting subsystem protects against denial-of-service, brute force credential attacks, and API abuse:

* **In-Memory Sliding Window (`InMemoryRateLimiter`)**:
  - Tracks monotonic timestamps per request key.
  - Automatically prunes expired timestamps on access.
  - Calculates precise `retry_after_seconds` on limit breaches.
* **Pluggable Redis Architecture (`RedisRateLimiter`)**:
  - Encapsulated behind `RateLimiterBackend` abstract interface.
  - Ready to switch to distributed Redis in Phase 2 without rewriting route decorators.
* **Protected Routes**:
  - `POST /api/v1/auth/login`: 10 req/min per IP.
  - `POST /api/v1/auth/signup`: 5 req/min per IP.
  - Public demo endpoints (`/api/public/*`): 30 req/min per IP.
  - Webhooks (`/api/whatsapp/webhook`): 60 req/min.

---

## 5. Request Tracking & Audit Logging

Every inbound request is assigned a unique identifier (`RF-XXXXXX`) via `RequestLoggingMiddleware`:
* The request ID is stored in request state and the context variable `current_request_id`.
* The ID is returned in the `X-Request-ID` response header.
* Structured logs record duration, status, and route.
* Sensitive fields (`authorization`, `password`, `token`, `secret`) are automatically redacted from logs.
* All error responses include the reference ID, enabling instant correlation during support inquiries.
