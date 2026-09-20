# Rine Forge Systems V5 — API Standards & Foundation Endpoints

> **Document Version**: 5.1 (Phase 1 Baseline)  
> **Last Updated**: September 17, 2026  
> **Status**: Authoritative API Specification

---

## 1. Global API Standards & Conventions

Every endpoint across the Rine Forge Systems API conforms to strict protocol standards:

### 1. Request Identifiers (`X-Request-ID`)
Every HTTP interaction is tagged with a traceable reference code formatted as `RF-` followed by 6 alphanumeric characters (e.g. `RF-8F31A2`).
* Returned in every response header: `X-Request-ID: RF-8F31A2`.
* Included in all structured server logs.
* Bound to all error envelopes for client support correlation.

### 2. Header Conventions
* **`Authorization`**: `Bearer <token>` (Required for all protected endpoints).
* **`X-Business-ID`** / **`X-Organization-ID`**: Explicit tenant override for authorized cross-organization operators or multi-business users.
* **`X-Workspace-ID`**: Scopes requests to a specific workspace within the authenticated organization.

### 3. Standard Error Envelope
All error responses return a standardized JSON structure with human-friendly messaging:
```json
{
  "detail": "Human-friendly error message.",
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-friendly error message.",
    "reference": "RF-8F31A2",
    "details": {}
  }
}
```

#### Standard Error Codes:
| Error Code | HTTP Status | Trigger Scenario |
| :--- | :--- | :--- |
| `VALIDATION_ERROR` | 422 | Request body or parameter failed Pydantic schema validation. |
| `UNAUTHORIZED` | 401 | Missing, malformed, or expired Bearer JWT token. |
| `FORBIDDEN` | 403 | Cross-tenant access attempt or insufficient RBAC permissions. |
| `NOT_FOUND` | 404 | Requested entity or workspace does not exist. |
| `CONFLICT` | 409 | Unique constraint violation (e.g. appointment double-booking). |
| `RATE_LIMITED` | 429 | Sliding-window request threshold exceeded. Includes `retry_after_seconds`. |
| `INTEGRATION_ERROR` | 502 | Upstream third-party integration failure (SMTP, Meta Graph API). |
| `AI_ERROR` | 502 | LLM provider timeout or API rejection. |
| `DATABASE_ERROR` | 503 | Database connection unavailable or transaction failure. |
| `INTERNAL_ERROR` | 500 | Unhandled server exception with reference code. |

---

## 2. Foundation API Endpoints

### 1. Multi-Component Health Probe (`GET /api/health`)
* **Access**: Public
* **Purpose**: Verifies runtime health and reports component readiness.
* **Response (HTTP 200)**:
  ```json
  {
    "status": "healthy",
    "platform": "RINE FORGE SYSTEMS",
    "version": "1.0.0",
    "environment": "development",
    "dry_run": true,
    "timestamp": "2026-09-17T21:20:00.000000+00:00",
    "components": {
      "database": {
        "configured": true,
        "reachable": true,
        "status": "healthy",
        "engine": "sqlite"
      },
      "ai": {
        "configured": false,
        "provider": "auto",
        "status": "fallback_mock",
        "default_model": "gpt-4o-mini"
      },
      "rate_limiter": {
        "backend": "in_memory",
        "status": "active"
      },
      "queue": {
        "backend": "in_memory",
        "status": "active"
      }
    }
  }
  ```

### 2. User Signup (`POST /api/v1/auth/signup`)
* **Access**: Public (Rate-limited: 5 req/min)
* **Payload**:
  ```json
  {
    "email": "user@example.com",
    "name": "Alex Rine",
    "password": "SecurePassword123!",
    "business_name": "Rine Dental Studio",
    "role": "BUSINESS_OWNER"
  }
  ```
* **Response (HTTP 201)**: Returns Bearer token, primary `business_id`, and user profile.

### 3. User Login (`POST /api/v1/auth/login`)
* **Access**: Public (Rate-limited: 10 req/min)
* **Payload**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }
  ```
* **Response (HTTP 200)**: Returns Bearer token and token type.

### 4. Authenticated Profile (`GET /api/v1/auth/me`)
* **Access**: Protected (`require_user`)
* **Response (HTTP 200)**: Returns user ID, email, name, role, and account status.
