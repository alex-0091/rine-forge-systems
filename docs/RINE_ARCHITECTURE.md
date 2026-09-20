# Rine Forge Systems — Master Architecture Design (Phase B)

> **Document Path**: `/docs/RINE_ARCHITECTURE.md`  
> **Date**: September 17, 2026  
> **Architecture Version**: Rine Forge Systems V5  
> **Platform Classification**: Multi-Tenant Autonomous AI Workforce & Automation Engine

---

## 1. System Architecture Overview

Rine Forge Systems is engineered around a strict tiered architecture where all privileged services, AI credentials, and database interactions reside behind a secure, authenticated API layer.

```
                                  BROWSER / PUBLIC CLIENTS
                                             │
                                             │ HTTPS / WSS / SSE
                                             ▼
                             ┌───────────────────────────────┐
                             │    FASTAPI MASTER GATEWAY     │
                             │  (CORS, Request-ID, RateLim)  │
                             └───────────────┬───────────────┘
                                             │
                   ┌─────────────────────────┴─────────────────────────┐
                   ▼                                                   ▼
       ┌───────────────────────┐                           ┌───────────────────────┐
       │   AUTH & RBAC ENGINE  │                           │  WEBHOOK VERIFICATION │
       │ (JWT, Passwords, Keys)│                           │  (HMAC-SHA256, Idemp) │
       └───────────┬───────────┘                           └───────────┬───────────┘
                   │                                                   │
                   └─────────────────────────┬─────────────────────────┘
                                             │
                                             ▼
                             ┌───────────────────────────────┐
                             │       APPLICATION CORE        │
                             │  (Multi-Tenant Context Scope) │
                             └───────────────┬───────────────┘
                                             │
         ┌───────────────────┬───────────────┴───────────────┬───────────────────┐
         ▼                   ▼                               ▼                   ▼
┌─────────────────┐ ┌─────────────────┐             ┌─────────────────┐ ┌─────────────────┐
│   AI GATEWAY    │ │ KNOWLEDGE BASE  │             │ CHANNEL ADAPTERS│ │AUTOMATION ENGINE│
│ ┌─────────────┐ │ │ ┌─────────────┐ │             │ ┌─────────────┐ │ │ ┌─────────────┐ │
│ │Model Router │ │ │ │Doc Extract  │ │             │ │WhatsApp Meta│ │ │ │Trigger / Cnd│ │
│ └──────┬──────┘ │ │ └──────┬──────┘ │             │ └─────────────┘ │ │ └──────┬──────┘ │
│ ┌──────▼──────┐ │ │ ┌──────▼──────┐ │             │ ┌─────────────┐ │ │ ┌──────▼──────┐ │
│ │Agent Runtime│ │ │ │Chunk/Embed  │ │             │ │Voice Twilio │ │ │ │Async Queue  │ │
│ └──────┬──────┘ │ │ └──────┬──────┘ │             │ └─────────────┘ │ │ └─────────────┘ │
│ ┌──────▼──────┐ │ │ ┌──────▼──────┐ │             │ ┌─────────────┐ │ └─────────────────┘
│ │Tool Whitelist││ │ │Grounded RAG │ │             │ │Email / Cal  │ │
│ └─────────────┘ │ │ └─────────────┘ │             │ └─────────────┘ │
└────────┬────────┘ └────────┬────────┘             └────────┬────────┘
         │                   │                               │
         └───────────────────┼───────────────────────────────┘
                             │
                             ▼
              ┌─────────────────────────────┐
              │      DATA PERSISTENCE       │
              │  PostgreSQL 16 + pgvector   │
              │   (SQLite Dev Compatible)   │
              └─────────────────────────────┘
```

---

## 2. Strict Architectural Boundaries

1. **Client Isolation**: The browser client *never* directly accesses external AI providers, database tables, or messaging APIs.
2. **Tenant Scoping**: All database transactions, file ingestions, and agent executions are strictly scoped to an `organization_id` and `workspace_id`. The backend resolves tenant identity directly from the authenticated session context, *never* trusting arbitrary IDs from the request payload.
3. **Truthful State Enforcers**: If third-party credentials (`META_ACCESS_TOKEN`, `TWILIO_AUTH_TOKEN`, `OPENAI_API_KEY`) are unconfigured, the system returns explicit `NOT_CONFIGURED` or `UNAVAILABLE` statuses rather than silent failures or simulated mock replies.
4. **Adversarial Hardening**: Untrusted user inputs are sanitized and wrapped in `<untrusted_user_input>` XML tags. The system prompts instruct LLM agents never to obey user instructions contained inside these untrusted blocks.

---

## 3. Subsystem Architecture

### 3.1 Centralized AI Gateway & Model Router
- **Multi-Tier Routing**:
  - `FAST`: Low latency routing (e.g. `gpt-4o-mini`, `gemini-1.5-flash`) for real-time conversation.
  - `QUALITY`: Complex reasoning (e.g. `gpt-4o`, `gemini-1.5-pro`) for qualification and document analysis.
  - `CHEAP`: High-volume cost-effective tasks.
  - `LOCAL`: Zero-cost private deployment via local Ollama.
  - `MOCK`: Deterministic, offline provider for automated testing and CI.
- **Failover**: Automatic fallback to secondary provider on transient 5xx or rate limit (429) errors.
- **Structured Schema Enforcer**: Pydantic validation on model outputs with 1-turn repair reprompting on JSON parse failures.

### 3.2 Grounded Knowledge Base & Anti-Hallucination RAG
- **Parsing Pipeline**: Multi-format extraction for `.pdf`, `.docx`, `.txt`, `.csv`.
- **Chunking**: Semantic recursive chunking (500-1000 tokens) with 10% overlap.
- **Embedding & Search**: pgvector cosine distance `<->` with fallback to in-memory cosine similarity for development.
- **Grounding Invariant**: Agent prompts enforce strict citation of knowledge chunks. If retrieved chunks fail similarity thresholds, agents reply: *"I don't have verified information about that in the knowledge base."*

### 3.3 Channel Integrations
- **WhatsApp Cloud API**: Webhook verification via SHA256 HMAC (`X-Hub-Signature-256`), inbound message parsing (text, location, interactive buttons), idempotent outbound dispatch with delivery status tracking.
- **Voice Telephony Pipeline**: `Incoming Call -> Speech-to-Text (STT) -> AgentRuntime -> Tool Execution -> Text-to-Speech (TTS) -> Outbound Audio Stream`. Honest `VOICE NOT CONFIGURED` when Twilio/LiveKit credentials are absent.
- **Email Dispatch**: Unified email adapter supporting SMTP and Resend with bounce handling, domain verification, and DryRun support.
- **Calendar & Appointments**: Conflict-free scheduling engine with double-booking prevention, configurable buffers, and external CalDAV/Google sync adapters.

### 3.4 Automation & Background Processing
- **Queue**: Asynchronous job queue handling retries with exponential backoff and dead-letter queue (DLQ) state persistence.
- **Automation Pipeline**: Event-driven rules following `Trigger -> Filter Condition -> Action Sequence -> Scheduled Delay`.
- **Webhooks**: Signed outbound webhooks with HMAC signatures and exponential retry policies.

---

## 4. Observability & Admin Operations
- **Deep Health Probes**: Comprehensive subsystem monitoring across 8 core domains (`DATABASE`, `AI`, `QUEUE`, `WHATSAPP`, `VOICE`, `EMAIL`, `CALENDAR`, `KNOWLEDGE BASE`).
- **Telemetry**: Structured JSON logs enriched with correlation IDs (`RF-XXXXXX`), user context, and latency metrics.
- **Emergency Controls**: System-wide and tenant-level kill switches to halt outbound communications during anomalies.
