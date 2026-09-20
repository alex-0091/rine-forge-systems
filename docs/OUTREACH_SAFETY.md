# Rine Forge Systems — Outreach Safety, Compliance & Opt-Out Protocols (`OUTREACH_SAFETY.md`)

## Executive Summary
Rine Forge Systems enforces a zero-tolerance policy against unsolicited bulk spam, deceptive communications, and automated harassment. Every outbound transmission across every channel (Email, WhatsApp, SMS) must pass an uncompromising 11-step pre-flight compliance check, honor irreversible opt-out suppression rules, enforce 72-hour contact cooldowns, and respect campaign safety caps.

---

## 1. The 11-Step Pre-Flight Outreach Compliance Gate

Before any message can be transmitted by an official provider, it must pass through `OutreachComplianceLayer.evaluate_preflight` (`backend/app/compliance/outreach_compliance.py`):

| Gate # | Gate Name | Validation Check | Failure Action |
| :---: | :--- | :--- | :--- |
| **Gate 1** | **Identify Recipient** | Email syntax or phone format validated via `DataQualityEngine`. | **BLOCK SEND** (Gate 1 Failed) |
| **Gate 2** | **Identify Source** | Verifies prospect data origin and provenance tracking. | **BLOCK SEND** (Gate 2 Failed) |
| **Gate 3** | **Communication Permission** | Checks if prospect is marked `DO_NOT_CONTACT`. | **BLOCK SEND** (Gate 3 Failed) |
| **Gate 4** | **Opt-Out & Suppression** | Checks global/channel opt-out status and tenant suppression database. | **BLOCK SEND** (Gate 4 Failed) |
| **Gate 5** | **Channel Rules** | Confirms channel is supported (`EMAIL`, `WHATSAPP`, `SMS`). | **BLOCK SEND** (Gate 5 Failed) |
| **Gate 6** | **Campaign Daily Limits** | Confirms tenant has not exceeded daily dispatches. | **BLOCK SEND** (Gate 6 Failed) |
| **Gate 7** | **Duplicate / Cooldown** | Enforces minimum 72-hour contact spacing. | **BLOCK SEND** (Gate 7 Failed) |
| **Gate 8** | **Content Grounding** | Verifies message is non-empty, tailored, and evidence-grounded. | **BLOCK SEND** (Gate 8 Failed) |
| **Gate 9** | **Human Approval** | Confirms outreach draft has explicit operator approval (`APPROVED`). | **BLOCK SEND** (Gate 9 Failed) |
| **Gate 10** | **Provider Verification** | Verifies official sender credentials are configured (e.g. SMTP password). | **BLOCK SEND** (Gate 10 Failed) |
| **Gate 11** | **Audit Trail Logging** | Generates detailed telemetry record with recipient, operator, and timestamp. | Dispatches message |

---

## 2. Invariant: Opt-Out & Suppression Enforcement

The platform maintains an absolute, irreversible invariant:
> **An opted-out lead must NEVER receive another outbound message.**

### Opt-Out Triggers
1. **Keyword Detection**: The inbound reply intelligence engine monitors inbound messages for keywords:
   - `STOP`, `UNSUBSCRIBE`, `CANCEL`, `END`, `QUIT`, `REMOVE ME`, `OPT OUT`, `DO NOT CONTACT`, `LEAVE ME ALONE`.
2. **Operator Action**: Operators can manually set `prospect.opt_out_status = "GLOBAL_OPT_OUT"` or add values to `v5_suppression_entries`.
3. **Bounce & Complaint Handlers**: Hard bounces and spam complaints automatically populate the suppression database.

### Scope of Suppression
- **`GLOBAL_OPT_OUT`**: Blocks all channels (Email, WhatsApp, SMS).
- **`EMAIL_OPT_OUT`**: Blocks all email dispatches to the address and domain.
- **`WHATSAPP_OPT_OUT`**: Blocks WhatsApp dispatches to the phone number.
- **`SMS_OPT_OUT`**: Blocks SMS dispatches to the phone number.

Any attempt to initiate pre-flight verification on a suppressed entity immediately halts at **Gate 4**.

---

## 3. Frequency Controls & Rate Limiting

To prevent contact fatigue and protect sender reputation:
- **72-Hour Cooldown (Gate 7)**: No prospect may be contacted twice within 72 hours, across any channel.
- **3-Step Sequence Cap**: Outbound sequences are capped at 3 total touches (Initial Touch, Follow-Up 1, Graceful Exit). After 3 touches without a reply, the prospect transitions to `pipeline_stage="NO_RESPONSE"` and outreach is halted.
- **Daily Sending Caps (Gate 6)**: Tenants are restricted to maximum daily quotas (default 25-50 messages/day) to prevent bulk blasting.
- **Sending Windows**: Outbound dispatches are restricted to standard business operating hours (9:00 AM – 5:00 PM recipient local time) with jitter delays (180–600 seconds) between messages.

---

## 4. Campaign Safety Engine & Auto-Pause

The `CampaignEngineV5` (`backend/app/campaigns/engine_v5.py`) continuously monitors upstream provider responses:
- **Provider Restriction Detection**: If an upstream provider (e.g., SMTP host, Meta WhatsApp Cloud API) returns a rate-limit error, account notice, or temporary hold, the campaign engine triggers `handle_provider_restriction`.
- **Automatic Pause**: The campaign is instantly switched to `status="PAUSED"`. No further messages are dequeued.
- **Audit Logging**: An audit event (`CAMPAIGN_PAUSED`) is stored with the exact provider error details for operator review.
- **Operator Resumption**: Once the root cause is resolved, the operator can safely resume the campaign via `POST /api/v1/lead-engine/campaigns/{id}/resume`.

---

## 5. Bounce Handling & Reputation Guard

Outbound email delivery tracks webhooks and SMTP reply codes:
- **Hard Bounces (5xx)**: Immediately marks prospect `outreach_status="BOUNCED"`, inserts the email into `v5_suppression_entries`, and halts further touches.
- **Soft Bounces (4xx)**: Logged as delivery retries with exponential backoff (up to 2 retries before suppression).
- **Spam Complaints**: Immediately triggers `GLOBAL_OPT_OUT`, suppressing the entire recipient domain.
