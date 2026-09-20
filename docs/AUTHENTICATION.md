# Rine Forge Systems V5 — Authentication & Authorization Specification

> **Document Version**: 5.1 (Phase 1 Baseline)  
> **Last Updated**: September 17, 2026  
> **Status**: Authoritative Authentication & RBAC Documentation

---

## 1. Authentication Architecture

Rine Forge Systems implements a stateless, token-based authentication architecture utilizing industry-standard cryptographic libraries:

* **Password Hashing**: `passlib` with `bcrypt` (salted, slow-hash algorithm protecting against rainbow table attacks).
* **Token Issuance**: `python-jose` with `HS256` symmetric signing.
* **Token Expiration**: Configured via `ACCESS_TOKEN_EXPIRE_MINUTES = 1440` (24 hours).
* **Identity Resolution**: Server-side resolution via `require_user` dependency. The server never trusts client-supplied user identifiers.

### JWT Payload Structure:
```json
{
  "sub": "b2f6b8c9-4d2a-4f51-8e99-1a2b3c4d5e6f",
  "email": "dr.smith@apexclinic.com",
  "role": "BUSINESS_OWNER",
  "exp": 1789654800
}
```

---

## 2. Authentication API Endpoints

### 1. User Registration (`POST /api/v1/auth/signup`)
* **Request**:
  ```json
  {
    "email": "owner@company.com",
    "name": "Alex Owner",
    "password": "StrongPassword123!",
    "business_name": "Acme Automation Inc",
    "role": "BUSINESS_OWNER"
  }
  ```
* **Validation**:
  - `email`: Valid RFC email string via Pydantic `EmailStr`.
  - `password`: String (min length enforced).
  - Uniqueness: Checks `v5_users` table; returns `400 Bad Request` if duplicate.
* **Automatic Provisioning**:
  1. Creates record in `v5_users`.
  2. Creates primary organization in `v5_businesses`.
  3. Establishes owner membership in `v5_business_users` (`role="BUSINESS_OWNER"`, `permissions=["ALL"]`).
  4. Auto-provisions "Default Workspace" in `v5_workspaces`.
  5. Auto-provisions default Elena AI Receptionist in `v5_ai_employees`.
* **Response (HTTP 201)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "business_id": "00000000-0000-0000-0000-000000000001",
    "user": {
      "id": "b2f6b8c9-4d2a-4f51-8e99-1a2b3c4d5e6f",
      "email": "owner@company.com",
      "name": "Alex Owner",
      "role": "BUSINESS_OWNER"
    }
  }
  ```

### 2. User Login (`POST /api/v1/auth/login`)
* **Request**:
  ```json
  {
    "email": "owner@company.com",
    "password": "StrongPassword123!"
  }
  ```
* **Behavior**: Looks up user by email, verifies bcrypt hash via `passlib.verify_password`. If invalid or user is suspended: returns `401 Unauthorized`.
* **Response (HTTP 200)**: Returns Bearer JWT and token type.

### 3. Current User Profile (`GET /api/v1/auth/me`)
* **Headers**: `Authorization: Bearer <token>`
* **Behavior**: Validates JWT, queries database for active user.
* **Response (HTTP 200)**: User profile metadata (ID, email, name, role, status).

### 4. Logout (`POST /api/v1/auth/logout`)
* **Behavior**: Acknowledges session termination for client-side token clearance.

---

## 3. Centralized Authorization Layer (`backend/app/auth/dependencies.py`)

All route access and data boundaries are guarded by reusable dependency factories:

| Dependency | Purpose | Failure Behavior |
| :--- | :--- | :--- |
| `require_user` / `get_current_user` | Ensures a valid JWT is present and user is `ACTIVE`. | `401 Unauthorized` if missing/expired; `403 Forbidden` if suspended. |
| `require_organization_access` / `require_tenant` | Validates that the requested organization exists and user is an authorized member or Super Admin. | `403 Forbidden` on cross-tenant access attempts. |
| `require_workspace_access` | Ensures the target workspace belongs to the user's verified organization. | `403 Forbidden` if workspace belongs to another tenant; `404 Not Found` if missing. |
| `require_role(allowed_roles)` | Enforces platform-level role requirements (e.g. `SUPER_ADMIN`). | `403 Forbidden` if role is insufficient. |
| `require_organization_role(min_role)` | Enforces tenant-level role hierarchy (`OWNER` > `ADMIN` > `MEMBER`). | `403 Forbidden` if user's membership role is lower than `min_role`. |

---

## 4. Role Hierarchy

```
Level 4: SUPER_ADMIN      (Cross-tenant platform supervisor)
Level 3: BUSINESS_OWNER   (Tenant creator, billing manager, full admin rights)
Level 2: BUSINESS_ADMIN   (Service, staff, and AI employee manager)
Level 1: STAFF / MEMBER   (Operational staff, appointment calendar viewer)
```
