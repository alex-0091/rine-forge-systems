# RINE FORGE SYSTEMS — V5 SECURITY & COMPLIANCE

## 1. Multi-Tenant Isolation Guarantees
Tenant isolation is strictly enforced at two distinct security perimeters:
1. **API Dependency Injection Layer (`get_current_tenant`)**:
   - The user's JWT bearer token is decoded and validated.
   - The user's tenant memberships (`v5_business_users`) are checked.
   - Any attempt by User A to supply or access Business B's tenant context returns **HTTP 403 Forbidden** or **HTTP 404 Not Found**.
2. **Database Query Layer**:
   - Every SELECT, UPDATE, and DELETE query includes `business_id == tenant.id`.
   - Foreign keys enforce cascade deletes within the tenant boundary (`ondelete="CASCADE"`).

---

## 2. Authentication & Password Security
- **Password Hashing**: PBKDF2 with HMAC-SHA256 (600,000 iterations), using unique cryptographically random salt per user.
- **Session Tokens**: Signed JWT (JSON Web Tokens) with HMAC-SHA256 signature using `SECRET_KEY`.
- **Token Expiry**: Configured via `ACCESS_TOKEN_EXPIRE_MINUTES` (default: 10,080 minutes / 7 days).

---

## 3. Role-Based Access Control (RBAC)
The platform defines 4 standard roles:
- `SUPER_ADMIN`: Platform operators with cross-tenant management and telemetry audit access.
- `BUSINESS_OWNER`: Full administrative control over tenant settings, staff, services, and billing.
- `BUSINESS_ADMIN`: Operational control over appointments, leads, knowledge documents, and automations.
- `STAFF`: View schedules, manage individual appointments, and take over customer conversations.

---

## 4. Healthcare & Regulatory Compliance
- **Data Protection**: Patient and client phone numbers, emails, and notes are partitioned by tenant.
- **Audit Trail (`v5_audit_logs`)**: Security events (logins, user creations, policy changes, access denials) are permanently logged.
- **AI Observability (`v5_ai_events`)**: Every generative call records prompt tokens, completion tokens, latency in milliseconds, model version, and tool calls.
