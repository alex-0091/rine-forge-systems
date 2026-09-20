# WhatsApp Cloud API Integration Guide

> **Path**: `/docs/WHATSAPP.md`  
> **Version**: Rine Forge Systems V5  
> **Component**: `backend/app/channels/whatsapp/`

---

## 1. Overview

Rine Forge Systems connects natively to Meta's official WhatsApp Cloud API, enabling Elena (AI Receptionist) to converse with patients and prospective clients, answer clinical practice questions, and schedule conflict-free appointments.

---

## 2. Configuration & Environment Variables

Add the following credentials to your `.env` file:

```env
META_ACCESS_TOKEN="EAAxxxxxxx..."
META_PHONE_NUMBER_ID="108xxxxxxxxxxxx"
META_VERIFY_TOKEN="rine_forge_custom_verify_token_2026"
META_APP_SECRET="0123456789abcdef0123456789abcdef"
META_API_VERSION="v20.0"
```

---

## 3. Webhook Setup in Meta App Dashboard

1. Navigate to **Developers.facebook.com** > Your App > **WhatsApp** > **Configuration**.
2. Set **Callback URL** to:
   ```
   https://api.yourdomain.com/api/whatsapp/webhook
   ```
3. Set **Verify Token** to match your `META_VERIFY_TOKEN`.
4. Subscribe to Webhook fields:
   - `messages`
   - `message_deliveries`
   - `message_reads`

---

## 4. Message Flow & Execution Lifecycle

```
Meta WhatsApp Server
  ↓ HTTPS POST (Webhook)
/api/whatsapp/webhook
  ↓
Meta Payload Parser (parse_meta_webhook)
  ↓
Conversation State Resolver (ReceptionistConversation)
  ↓
Elena AI Orchestrator (Safe tools: business hours, appointment booking)
  ↓
Meta Outbound Sender (/messages via Graph API)
```
