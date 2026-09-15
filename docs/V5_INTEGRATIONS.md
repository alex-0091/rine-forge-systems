# RINE FORGE SYSTEMS — V5 INTEGRATIONS SPECIFICATION

## 1. Meta Cloud WhatsApp Business API
Rine Forge Systems V5 provides native two-way integration with the official Meta Cloud API.

### Inbound Architecture:
1. Meta sends webhooks to `/webhook/whatsapp`.
2. The payload is verified against `WHATSAPP_VERIFY_TOKEN` (HMAC SHA-256 signature verification).
3. Inbound message is parsed into normalized customer identifier (`from` phone number), message text, and timestamp.
4. Message is dispatched directly to the 20-step Conversational AI Orchestrator.
5. Outbound reply is returned via Meta Graph API `/v18.0/{phone_number_id}/messages`.

---

## 2. Google Calendar / PMS Engine
The appointment engine supports bi-directional calendar synchronization:
- `InternalCalendarProvider`: Built-in zero-latency relational calendar with conflict detection.
- `GoogleCalendarProvider`: OAuth2 synchronization with external Google Calendar IDs stored in `v5_staff.calendar_id`.
- Supported Dental Practice Management Systems (PMS): OpenDental, Dentrix, Eaglesoft via REST/HL7 bridge.

---

## 3. Stripe Billing & Usage Metering
- Usage records in `v5_usage` aggregate monthly token volume, message count, tool calls, and confirmed appointments.
- Provides webhook endpoints for subscription lifecycle events (`customer.subscription.created`, `invoice.payment_succeeded`).
- Secrets and tokens are securely isolated in environment variables and never stored unencrypted in frontend code.

---

## 4. Webhook & CRM Connectors
- HubSpot / Salesforce / GoHighLevel:
  - Automations can trigger external webhooks upon `NEW_LEAD` or `APPOINTMENT_CREATED`.
  - Configured via `/api/v1/integrations` with masked credential storage.
