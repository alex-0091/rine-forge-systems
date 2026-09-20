# Autonomous Workflow Engine & Event Triggers

> **Path**: `/docs/AUTOMATIONS.md`  
> **Version**: Rine Forge Systems V5  
> **Component**: `backend/app/automations/` & `backend/app/jobs/`

---

## 1. Overview

Rine Forge Systems features a rule-based deterministic automation and workflow engine. Every automation follows a standardized event execution schema:
```
Event Trigger -> Conditions Evaluation -> Actions Execution -> Background Queue Dispatch
```

---

## 2. Trigger Events

Supported event triggers:
- `NEW_LEAD`: Dispatched when a new customer inquiry is scored.
- `NEW_MESSAGE`: Dispatched upon incoming WhatsApp, SMS, or web chat.
- `APPOINTMENT_CREATED`: Triggered when an appointment slot is confirmed.
- `APPOINTMENT_CANCELLED`: Triggered upon cancellation or reschedule.
- `HUMAN_HANDOFF`: Triggered when conversation sentiment or direct customer request requests a human operator.

---

## 3. Condition Operators

Conditions evaluate context fields against operator thresholds:
- `==`, `!=`: Exact match comparison.
- `>=`, `<=`, `>`, `<`: Numeric range checks (e.g. `score >= 70`).
- `contains`: Substring matching.
- `in`: Membership checks against configured lists.

---

## 4. Supported Actions

- `NOTIFY_STAFF`: Sends in-app, Slack, or email notifications to human operators.
- `CREATE_TASK`: Schedules a timed follow-up task in `v5_tasks`.
- `UPDATE_LEAD`: Adjusts lead qualification status or increments lead score.
- `DISPATCH_WEBHOOK`: Posts signed HMAC-SHA256 payload to external webhook subscribers.

---

## 5. Execution Logging & Telemetry

Every workflow trigger creates an immutable trace record in `v5_automation_runs` tracking execution duration in milliseconds, status (`SUCCESS`, `FAILED`), and per-step output payloads.
