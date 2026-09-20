# Rine Forge Systems — Third-Party Integrations Architecture

> **Path**: `/docs/INTEGRATIONS.md`  
> **Version**: Rine Forge Systems V5  
> **Component**: `backend/app/api/v1/integrations.py` & `backend/app/channels/`

---

## 1. Architecture & Security Perimeter

All third-party integrations operate under strict isolation principles:
1. **Server-Side Credential Custody**: Third-party API keys and OAuth tokens are never returned in cleartext to client browsers.
2. **Tenant Scoping**: Integration records are bound to `v5_integrations.business_id`.
3. **Truthful State Reporting**: Integrations report `NOT_CONFIGURED` when required secrets are missing, rather than faking active states.

---

## 2. Integration Catalog & Protocols

| Integration | Provider | Protocol | Status |
| :--- | :--- | :--- | :--- |
| **WhatsApp Business** | Meta Cloud API | Webhook + REST | Implemented (Requires `META_ACCESS_TOKEN`) |
| **Voice Telephony** | Twilio / LiveKit | TwiML / WebRTC | Implemented (Requires `TWILIO_ACCOUNT_SID`) |
| **Email Dispatch** | SMTP / Resend | RFC 2822 / REST | Implemented (Active via SMTP/DryRun) |
| **Calendar Sync** | Google Calendar / CalDAV | OAuth2 / iCal | Implemented (Internal engine active) |
| **CRM Webhooks** | HubSpot / Custom | Signed HMAC | Implemented (`/api/v1/webhooks/inbound`) |
| **Payment Gateway** | Stripe | Webhook + SDK | Schema ready (`V5Integration`) |

---

## 3. Webhook Security Standards

External webhooks received by Rine Forge Systems require:
1. **Cryptographic Validation**: HMAC-SHA256 signature checking against tenant webhook secret.
2. **Idempotency Deduplication**: Unique `X-Idempotency-Key` or event ID recorded in `v5_webhook_events`. Duplicates are gracefully acknowledged without re-executing actions.
3. **Immediate Acknowledgment**: Webhook endpoints respond within 2000ms, dispatching intensive operations to `job_queue`.
