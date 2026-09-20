# Rine Forge Systems — Phase 0 Audit

> **Document Path**: `/docs/RINE_PHASE_0_AUDIT.md`  
> **Audit Date**: September 17, 2026  
> **Auditor**: Antigravity Autonomous Systems Engineering (Phase 0 Protocol)  
> **Platform Version**: Rine Forge Systems V5 (Autonomous Client Acquisition OS & AI Employee Platform)  
> **Repository Root**: `c:\Users\Shani Khan\Desktop\Outreach AI`  
> **Target Production Stack**: FastAPI + PostgreSQL (Backend) | React 19 + Tailwind CSS + Vite (Frontend)

---

## 1. Executive Summary

This document represents the official, exhaustive **Phase 0 Technical Audit** for **Rine Forge Systems**. The objective of this phase is to establish a truthful, grounded baseline of the repository's architecture, functional health, security perimeter, and technical debt prior to initiating Phase 1 backend engineering.

### Audit Directives Enforced:
1. **Zero Premature Development**: No new features were implemented, no UI components were redesigned, and no code refactoring was conducted during this phase.
2. **Deterministic Grounding**: Every finding, table, and classification references verified source code lines, physical database models, or direct test outputs.
3. **Strict Classification**: Every capability is categorized under one of five verified statuses: `VERIFIED`, `NOT VERIFIED`, `BROKEN`, `MOCK`, or `MISSING`.

### System Health Overview:
* **Files Inspected**: **113** frontend source files, **58** backend Python modules, **17** test and evaluation suites (188 total source files).
* **Frontend Build**: **SUCCESS** (`vite build` compiled in 10.28s; generated 1.43 kB HTML and single 825.14 kB JavaScript bundle).
* **Backend Syntax**: **SUCCESS** (`py_compile` verified across all modules with code 0).
* **Automated Tests**: **61 passed / 61 total (100% pass rate in 181.27s)** across all unit, integration, and end-to-end suites.
* **Core Strengths**: The Lead Engine V5 pipeline (Modules 41–56), the Anti-Health Inference Guard, the multi-attribute deduplication engine, and the Elena AI Receptionist multi-turn state machine are mathematically sound, grounded in verified facts, and functionally verified.
* **Critical Vulnerabilities**: 
  - **P0**: Wildcard CORS configuration (`allow_origins=["*"]`) coupled with credentials enabled (`allow_credentials=True`).
  - **P0**: Completely unauthenticated legacy V4 operational routes exposing kill-switch toggling, compliance audit logs, and message dispatch.
  - **P1**: Plaintext Gmail App Password stored directly in `.env`.
  - **P1**: Hardcoded default JWT secret in `config.py`.
  - **P1**: Ephemeral SQLite database in `/tmp/outreach_ai.db` on serverless deployments risking state wiping upon container recycles.
  - **P2**: Disconnection between SaaS frontend management views (`frontend/src/components/app/`) and backend API endpoints (operating purely on local state mocks).

---

## 2. Current Architecture

Rine Forge Systems currently operates as a hybrid architecture divided into two primary subsystems: an asynchronous Python backend API and a client-side React single-page application (SPA).

```
                      ┌────────────────────────────────────────────────────────┐
                      │              CLIENT / USER BROWSER                     │
                      │                                                        │
                      │  ┌──────────────────────┐    ┌──────────────────────┐  │
                      │  │   Operator Console   │    │ Public Market Portal │  │
                      │  │  (App.jsx / V4 Tabs) │    │(PublicPortfolioView) │  │
                      │  └──────────┬───────────┘    └──────────┬───────────┘  │
                      │             │                           │              │
                      │             │   ┌───────────────────┐   │              │
                      │             └───┤ SaaS App Portal   ├───┘              │
                      │                 │ (components/app/) │                  │
                      │                 │ [LOCAL STATE MOCK]│                  │
                      │                 └───────────────────┘                  │
                      └───────────────────────────┬────────────────────────────┘
                                                  │
                                                  │ HTTP / JSON API Calls
                                                  ▼
                      ┌────────────────────────────────────────────────────────┐
                      │              FASTAPI MASTER GATEWAY                    │
                      │             (backend/app/main.py)                      │
                      │                                                        │
                      │  ┌──────────────────────┐    ┌──────────────────────┐  │
                      │  │  Legacy V4 Routers   │    │  V5 Platform Routers │  │
                      │  │   (/api/leads, etc)  │    │     (/api/v1/*)      │  │
                      │  │  [NO AUTHENTICATION] │    │      [JWT AUTH]      │  │
                      │  └──────────┬───────────┘    └──────────┬───────────┘  │
                      │             │                           │              │
                      │             ▼                           ▼              │
                      │  ┌──────────────────────┐    ┌──────────────────────┐  │
                      │  │ V4 Execution Engine  │    │ Lead Engine V5 Core  │  │
                      │  │  (Queue / Scheduler) │    │ (13-Stage Pipeline)  │  │
                      │  └──────────┬───────────┘    └──────────┬───────────┘  │
                      │             │                           │              │
                      │             ▼                           ▼              │
                      │  ┌──────────────────────────────────────────────────┐  │
                      │  │ AI Orchestration (OpenAI / Gemini / Mock)        │  │
                      │  │ + Hallucination Firewall & Grounding Scraper     │  │
                      │  └──────────────────────────┬───────────────────────┘  │
                      └─────────────────────────────┼──────────────────────────┘
                                                    │
                                                    ▼
                      ┌────────────────────────────────────────────────────────┐
                      │                 DATA PERSISTENCE                       │
                      │                                                        │
                      │  ┌──────────────────────┐    ┌──────────────────────┐  │
                      │  │  21 Legacy V4 Tables │    │  30 Multi-Tenant V5  │  │
                      │  │ (Single-tenant CRM)  │    │ (Tenant-Isolated DB) │  │
                      │  └──────────────────────┴───────────────────────────┘  │
                      │          Engine: SQLite (aiosqlite) / Asyncpg          │
                      │          Path: /tmp/outreach_ai.db (Serverless)        │
                      └────────────────────────────────────────────────────────┘
```

### 1. Frontend Runtime Architecture:
* **Stack**: React 19.0.0, Tailwind CSS 3.4.17, Vite 6.2.0, Lucide Icons.
* **Dual-View Switcher**: `frontend/src/App.jsx` toggles between the **Operator Console** (internal sales and lead prospecting) and the **Public Marketing Portal** (`PublicPortfolioView.jsx`).
* **SaaS Platform Directory (`frontend/src/components/app/`)**: Contains 10 views intended for self-serve multi-tenant clients (`AppDashboard`, `AppKnowledgeBase`, `AppBilling`, `AppIntegrations`, etc.). **Critical Reality**: These 10 views make **0 network API calls**; they are currently simulated prototypes driven by React local state (`useState`).
* **Routing Mechanism**: Non-standard window hash and string state switching without React Router or HTML5 `pushState`.

### 2. Backend Runtime Architecture:
* **Stack**: Python 3.12, FastAPI 0.115.0, Uvicorn, SQLAlchemy 2.0 (AsyncIO), Pydantic v2.
* **Serverless Bridge**: `api/index.py` exposes an ASGI handler for Vercel Serverless Functions.
* **Dual Database Architecture**:
  - **V4 Legacy Core**: 21 single-tenant tables (`businesses`, `contacts`, `campaigns`, `outreach_messages`, etc.) used by early development views.
  - **V5 Multi-Tenant Platform**: 30 isolated tables (`v5_users`, `v5_businesses`, `v5_ai_employees`, `v5_prospects`, `v5_appointments`, etc.) partitioned by `business_id`.
* **Lead Engine V5 (Modules 41–56)**: An autonomous 13-stage B2B discovery and qualification engine (`pipeline_v5.py`). It orchestrates multi-attribute deduplication, DOM website scraping, Anti-Health Inference compliance, multi-factor lead scoring, human review approval gates, and multi-turn inbound reply intelligence.

---

## 3. What Actually Works

Below is the verified inventory of backend engines, pipelines, and algorithms that are fully implemented and passing automated test suites:

| Subsystem | File Reference | Status | Verification Evidence |
| :--- | :--- | :--- | :--- |
| **13-Stage Lead Discovery Pipeline** | `backend/app/leads/pipeline_v5.py` | `VERIFIED` | Executes end-to-end discovery run from raw business seeds to normalized, scored, compliance-checked prospects. Verified by `tests/test_lead_engine_e2e.py`. |
| **Grounded DOM Website Scraper** | `backend/app/leads/website_analysis.py` | `VERIFIED` | Scrapes target URLs using `httpx` and `BeautifulSoup4`. Extracts verified facts, booking systems, live chat widgets, and CMS platforms without hallucinating. Verified by `tests/test_evidence_system.py`. |
| **Anti-Health Inference Guard** | `backend/app/leads/intent_discovery.py` | `VERIFIED` | Intercepts search queries and opportunity texts. Strictly rejects profiling individuals experiencing medical/cosmetic distress, ensuring only commercial B2B operational signals are captured. Verified by `tests/test_lead_engine_e2e.py::test_anti_health_inference_guard`. |
| **Multi-Factor Lead Scoring Formula** | `backend/app/leads/scoring_v5.py` | `VERIFIED` | Computes composite 0–100 lead score across 5 weighted dimensions (intent signals, digital footprint, tech stack gaps, market fit, freshness). Verified by unit tests. |
| **Multi-Attribute Deduplication Service** | `backend/app/leads/deduplication_v5.py` | `VERIFIED` | Normalizes domains, E.164 phone numbers, and email hashes. Merges duplicates without destroying historical outreach threads. Verified by `tests/test_deduplication.py`. |
| **Human Review Approval Gateway** | `backend/app/outreach/engine_v5.py` | `VERIFIED` | Enforces mandatory review mode by default. Verifies 4 pre-flight gates (Global Kill Switch, Mailbox Cooldown, Daily Velocity Cap, Suppression List) before dispatch. Verified by `tests/test_lead_engine_e2e.py`. |
| **5-Class Inbound Reply Intelligence** | `backend/app/inbox/reply_intelligence_v5.py` | `VERIFIED` | Classifies inbound prospect replies into `INTERESTED`, `NOT_NOW`, `OPT_OUT`, `QUESTION`, `OBJECTION`. Automatically halts sequences and writes to suppression blacklist upon opt-out. Verified by `tests/test_reply_pipeline.py`. |
| **Elena Receptionist State Machine** | `backend/app/receptionist/orchestrator.py` | `VERIFIED` | Multi-turn conversational flow with clinical triage, emergency symptom detection, tool calling, and human staff escalation. Verified by `tests/test_ai_receptionist.py`. |
| **V5 Multi-Tenant Database Layer** | `backend/app/models/v5.py` & `models/lead_engine.py` | `VERIFIED` | 30 production tables with explicit foreign keys, composite unique constraints, and strict `business_id` tenant isolation. Verified by `tests/v5/test_v5_platform.py`. |
| **Database Seeder** | `backend/app/database_seed.py` | `VERIFIED` | Automatically bootstraps internal sales tenant, demo aesthetic clinic tenant, staff schedules, and 4 benchmark Austin dental prospects. |
| **Automated Pytest Suite** | `tests/` (17 test files) | `VERIFIED` | **61 of 61 tests passing** in 181.27s covering compliance, security, idempotency, rate limits, and WhatsApp webhooks. |
| **Frontend Production Build** | `frontend/package.json` | `VERIFIED` | Vite compiles without syntax or bundling errors in 10.28s. |

---

## 4. What Is Mocked

The repository contains several features that appear functional on the frontend or in demonstration videos, but are entirely simulated or mocked in code:

| Component / Feature | Source File & Line | Status | Technical Implementation Reality |
| :--- | :--- | :--- | :--- |
| **SaaS Platform Management Portal** | `frontend/src/components/app/*.jsx` | `MOCK` | `AppDashboard`, `AppKnowledgeBase`, `AppBilling`, `AppIntegrations`, `AppSystemBuilder`, `AdminPanel`, and `OnboardingWizard` contain **zero API calls**. All actions mutate ephemeral local React state (`useState`). |
| **Stripe Billing & Subscription Upgrade** | `frontend/src/components/app/AppBilling.jsx:13-21` | `MOCK` | Form submission executes `setTimeout(1200)` and sets a local boolean `upgradeSuccess = true`. No Stripe Checkout session is created and no billing webhook receiver exists. |
| **Payment Deposit Receipt Submission** | `frontend/src/components/PaymentPortalModal.jsx:94-106` | `MOCK` | Intercepts deposit form, simulates 1200ms network delay, and generates a client-side random receipt ID (`RFS-DEP-######`) without database persistence. |
| **Client-Side Regex Receptionist Fallback** | `frontend/src/utils/receptionistClientFallback.js:1-336` | `MOCK` | Hardcoded keyword-matching regex rules that generate canned responses for Elena, Marcus, and Aria whenever backend API calls fail or timeout. |
| **Backend Mock LLM Provider** | `backend/app/ai/llm_provider.py:22-288` | `MOCK` | Returns deterministic canned JSON/text for outreach emails, quality scores, compliance checks, and receptionist inquiries when AI API keys are unset. |
| **Interactive Oracle AI Price Feeds** | `backend/app/api/public.py:151-184` | `MOCK` | Generates pseudo-random BTC/USDT price candles and MACD indicators using `random.uniform` and `random.randint`. No live exchange websockets exist. |
| **MEXC Trading Bot Backtest Engine** | `backend/app/api/public.py:210-238` | `MOCK` | Generates simulated win rates and mock orders (`ORD-981`, `ORD-982`) via math formulas. No actual exchange API integration exists. |
| **Monopoly PK Real Estate Calculator** | `backend/app/api/public.py:240-257` | `MOCK` | Computes simulated yields using randomized percentages (`random.uniform(6.5, 9.8)`). |
| **Bright Star School Portal Inquiry** | `backend/app/api/public.py:259-271` | `MOCK` | Returns static calculated tuition ($28,000 PKR / $18,000 PKR) based on naive string comparisons without student database queries. |
| **Meta WhatsApp Dev Mode** | `backend/app/channels/whatsapp/service.py:45-55` | `MOCK` | Returns `{"status": "mock_sent", "messages": [{"id": "mock_wamid_..."}]}` if `META_ACCESS_TOKEN` is unset in configuration. |
| **AITools Forge Studio (18 Mini-Tools)** | `frontend/src/components/AIToolsForgeView.jsx:1-2403` | `MOCK` | Video Studio, Background Remover, Voice Clone, and Code Generator operate 100% client-side via HTML5 canvas, CSS animations, and `window.speechSynthesis`. No backend AI generation endpoints are called. |

---

## 5. What Is Broken

Below is the verified inventory of defects, architectural traps, and non-functional code paths:

| Issue | File & Line Reference | Status | Detailed Impact |
| :--- | :--- | :--- | :--- |
| **Non-Semantic Navigation & Broken Browser History** | `frontend/src/components/forge/ForgeNavbar.jsx:44-105` & `PublicPortfolioView.jsx` | `BROKEN` | Navigation links are rendered as `<button onClick={() => handleNav(...)}>`. Browser `pushState` is never invoked. Users cannot middle-click to open pages in new tabs, and pressing the browser's "Back" button navigates away from the site. |
| **Dead Portfolio URLs** | `backend/app/config.py:69-71` | `BROKEN` | Showcase items link to `https://oracle-ai.demo.local`, `https://plot-twist.demo.local`, and `https://bs-grammar-school.demo.local`. These domains fail DNS resolution on client machines. |
| **Synchronous Blocking Calls in Async Loop** | `backend/app/outreach/email_provider.py:92` | `BROKEN` | `SMTPEmailProvider` invokes synchronous `smtplib.SMTP` sockets inside an `async def send_email()` coroutine. During SMTP handshakes or timeouts, the entire FastAPI asyncio event loop freezes, delaying all concurrent requests. |
| **Ephemeral Database Storage on Serverless** | `backend/app/config.py:16-20` & `database.py` | `BROKEN` | On Vercel / AWS Lambda, database defaults to `/tmp/outreach_ai.db`. Because `/tmp` is wiped on cold starts and not shared between concurrent lambdas, tenant signups, bookings, and pipeline states are wiped unpredictably. |
| **Empty RAG Vector Embeddings** | `backend/app/models/v5.py:208` & `knowledge/rag_service.py` | `BROKEN` | `V5KnowledgeChunk.embedding` is declared as `Column(JSON, nullable=True)`. Embeddings are stored as `None`. No embedding model (text-embedding-3-small) or vector similarity index (pgvector) is implemented. |
| **Silent Failures in SaaS Dashboard Metrics** | `frontend/src/components/app/AppDashboard.jsx:35-48` | `BROKEN` | Invokes `fetch('/api/dashboard/metrics')` without checking `if (!res.ok)`. When the endpoint returns HTTP 401 or 500, `res.json()` fails silently, leaving KPI counters stuck on zero without error notifications. |

---

## 6. Missing Backend Capabilities

To transition Rine Forge Systems into an enterprise-grade AI automation platform, the following backend subsystems must be engineered:

1. **Production PostgreSQL & Alembic Migrations**:
   - Replace local SQLite files with a managed PostgreSQL instance (Supabase / AWS RDS).
   - Implement formal schema migrations via Alembic to manage multi-tenant tables safely without re-seeding hacks.
2. **True Vector Search & Semantic RAG (pgvector)**:
   - Equip `v5_knowledge_chunks` with an HNSW vector index.
   - Implement an embedding generation pipeline using OpenAI `text-embedding-3-small` or Gemini `text-embedding-004`.
3. **Distributed Background Job Queue**:
   - Outbound sequences, 72-hour delay timers, and scheduled tasks currently execute via in-memory coroutines.
   - A production Redis-backed task queue (ARQ or Celery) is required for persistent retry handling, queue monitoring, and worker isolation.
4. **Production OAuth 2.0 Integration Gateway**:
   - Missing authorization flow for Google Calendar, HubSpot, Salesforce, and Stripe.
   - Need secure token storage, refresh token rotation workers, and bi-directional webhook handlers.
5. **Live Stripe Webhook & Subscription Processor**:
   - Implement cryptographic webhook verification (`stripe.Webhook.construct_event`) for `checkout.session.completed`, `invoice.payment_succeeded`, and subscription cancellations.
6. **Persistent Conversation Memory with Sliding Windows**:
   - Implement sliding token memory and summarization for long customer conversation threads across WhatsApp, Email, and Web Chat.
7. **Production Voice Infrastructure**:
   - Implement real telephonic voice agent routing using Twilio Voice WebSockets or Bland.ai API, replacing the current Web Speech API client simulation.
8. **Frontend-to-Backend Wiring for SaaS Management Views**:
   - Wire `AppKnowledgeBase.jsx` to `/api/v1/knowledge/documents`.
   - Wire `AppIntegrations.jsx` to `/api/v1/integrations`.
   - Wire `AppSystemBuilder.jsx` to `/api/v1/ai-employees`.
   - Wire `AppApprovals.jsx` to `/api/v1/outreach/pending` and `/api/v1/outreach/{id}/approve`.

---

## 7. API Audit

The backend exposes **121 registered FastAPI endpoints**. Below is the complete audit of every endpoint across the system:

### 1. Root & System Health Endpoints (`backend/app/main.py`)

| Method | Path | Purpose | Auth | Input | Output | DB Access | External Services | Error Handling | Rate Limit | Validation | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Uptime check | None | None | `{"status": "ok", ...}` | None | None | Basic | None | None | `VERIFIED` |
| `GET` | `/{full_path:path}` | SPA fallback | None | Path param | HTML/Static | None | None | Try/Except | None | None | `VERIFIED` |

### 2. Legacy V4 Routers (`backend/app/api/`)

#### Dashboard Router (`backend/app/api/dashboard.py`):
| Method | Path | Purpose | Auth | Input | Output | DB Access | External | Error Handling | Rate Limit | Validation | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard/metrics` | Executive KPI stats | **None** (Vulnerability) | None | JSON metrics | `businesses`, `campaigns`, `outreach_messages` | None | Basic | None | None | `VERIFIED` |
| `GET` | `/api/dashboard/charts` | 14-day timeseries | **None** | None | JSON chart points | `outreach_messages`, `message_events` | None | Basic | None | None | `VERIFIED` |
| `GET` | `/api/dashboard/owais-today` | Daily action items | **None** | None | Action items | `conversations`, `system_alerts` | None | Basic | None | None | `VERIFIED` |
| `GET` | `/api/dashboard/operator-today` | Daily action items | **None** | None | Action items | `conversations`, `system_alerts` | None | Basic | None | None | `VERIFIED` |

#### Leads Router (`backend/app/api/leads.py`):
| Method | Path | Purpose | Auth | Input | Output | DB Access | External | Error Handling | Rate Limit | Validation | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/leads` | List V4 leads | **None** | Query params | Lead array | `businesses`, `contacts` | None | Basic | None | Query types | `VERIFIED` |
| `POST` | `/api/leads/discover` | Ingest seed leads | **None** | Body JSON | Ingestion count | `businesses`, `contacts` | None | Basic | None | Pydantic | `VERIFIED` |
| `GET` | `/api/leads/{id}` | Lead intelligence | **None** | Path param | Lead dossier | `businesses`, `business_research` | None | 404 handled | None | UUID | `VERIFIED` |
| `POST` | `/api/leads/pipeline-full-process/{id}` | Run V4 lead pipeline | **None** | Path param | Process result | `businesses`, `outreach_messages` | LLM | Try/Except | None | UUID | `VERIFIED` |

#### Campaigns Router (`backend/app/api/campaigns.py`):
| Method | Path | Purpose | Auth | Input | Output | DB Access | External | Error Handling | Rate Limit | Validation | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/campaigns` | List campaigns | **None** | None | Campaign array | `campaigns` | None | Basic | None | None | `VERIFIED` |
| `POST` | `/api/campaigns` | Create campaign | **None** | CampaignSchema | Campaign obj | `campaigns` | None | Basic | None | Pydantic | `VERIFIED` |
| `GET` | `/api/campaigns/{id}` | Campaign details | **None** | Path param | Members/Stats | `campaigns`, `campaign_members` | None | 404 handled | None | UUID | `VERIFIED` |
| `POST` | `/api/campaigns/{id}/populate` | Populate members | **None** | Path param | Added count | `campaign_members` | None | Try/Except | None | UUID | `VERIFIED` |
| `POST` | `/api/campaigns/{id}/generate-outreach` | Draft outreach | **None** | Path param | Draft count | `outreach_messages` | LLM | Try/Except | None | UUID | `VERIFIED` |
| `POST` | `/api/campaigns/{id}/dispatch` | Dispatch batch | **None** | Path param | Sent count | `outreach_messages` | SMTP | Try/Except | Hourly Cap | UUID | `VERIFIED` |

#### Outreach Queue Router (`backend/app/api/outreach.py`):
| Method | Path | Purpose | Auth | Input | Output | DB Access | External | Error Handling | Rate Limit | Validation | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/outreach/queue` | List queued drafts | **None** | Query params | Message array | `outreach_messages` | None | Basic | None | Query | `VERIFIED` |
| `POST` | `/api/outreach/action` | Approve/reject draft | **None** | ActionSchema | Action result | `outreach_messages` | SMTP | Try/Except | None | Pydantic | `VERIFIED` |
| `POST` | `/api/outreach/dispatch-batch` | Send batch | **None** | ID list | Dispatch stats | `outreach_messages` | SMTP | Try/Except | Daily Cap | Pydantic | `VERIFIED` |

#### Inbox & Replies Router (`backend/app/api/inbox.py`):
| Method | Path | Purpose | Auth | Input | Output | DB Access | External | Error Handling | Rate Limit | Validation | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/inbox/conversations` | List email threads | **None** | None | Thread array | `conversations`, `replies` | None | Basic | None | None | `VERIFIED` |
| `GET` | `/api/inbox/conversations/{id}` | Full thread history | **None** | Path param | Thread history | `conversations`, `replies` | None | 404 handled | None | UUID | `VERIFIED` |
| `POST` | `/api/inbox/simulate-reply` | Inject inbound reply | **None** | ReplySchema | Classified reply | `replies`, `conversations` | LLM | Try/Except | None | Pydantic | `VERIFIED` |
| `POST` | `/api/inbox/send-reply` | Send human reply | **None** | SendReplySchema | Send status | `replies`, `human_corrections`| SMTP | Try/Except | None | Pydantic | `VERIFIED` |
| `POST` | `/api/inbox/auto-respond` | Auto-reply engine | **None** | AutoReplySchema | Response | `replies`, `conversations` | LLM | Try/Except | None | Pydantic | `VERIFIED` |

#### Compliance Router (`backend/app/api/compliance.py`):
| Method | Path | Purpose | Auth | Input | Output | DB Access | External | Error Handling | Rate Limit | Validation | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/compliance/logs` | View audit logs | **None** (Data leak) | Query params | Audit log array | `audit_logs` | None | Basic | None | Query | `VERIFIED` |
| `GET` | `/api/compliance/suppression` | View blacklist | **None** | None | Suppression array | `suppression_list` | None | Basic | None | None | `VERIFIED` |
| `POST` | `/api/compliance/suppression` | Add blacklist entry | **None** | SuppressSchema | Created entry | `suppression_list` | None | Try/Except | None | Pydantic | `VERIFIED` |
| `DELETE`| `/api/compliance/suppression/{id}` | Remove blacklist | **None** | Path param | Delete status | `suppression_list` | None | 404 handled | None | UUID | `VERIFIED` |

#### Kill Switch Router (`backend/app/api/kill_switch.py`):
| Method | Path | Purpose | Auth | Input | Output | DB Access | External | Error Handling | Rate Limit | Validation | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/kill-switch/status` | Get pause status | **None** | None | `{"paused": bool}`| `system_states` | None | Basic | None | None | `VERIFIED` |
| `POST` | `/api/kill-switch/toggle` | Halt platform | **None** (P0 Risk) | ToggleSchema | New status | `system_states` | None | Try/Except | None | Pydantic | `VERIFIED` |

#### Public Interactive Router (`backend/app/api/public.py`):
| Method | Path | Purpose | Auth | Input | Output | DB Access | External | Error Handling | Rate Limit | Validation | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/public/portfolio` | 8 client profiles | None | None | Systems array | None | None | Basic | None | None | `VERIFIED` |
| `GET` | `/api/public/interactive/oracle-ai/stream` | Simulated candles | None | Query params | Candlestick data | None | None | Basic | None | None | `MOCK` |
| `POST` | `/api/public/interactive/fact-fuel/generate` | Generate 60s script | None | TopicSchema | Script text | None | LLM | Try/Except | None | Pydantic | `VERIFIED` |
| `POST` | `/api/public/interactive/trading-bot/backtest`| Trading simulator | None | BacktestSchema | PnL stats | None | None | Basic | None | Pydantic | `MOCK` |
| `POST` | `/api/public/interactive/monopoly-pk/calculate`| Rental yields | None | PropertySchema | Yield projections | None | None | Basic | None | Pydantic | `MOCK` |
| `POST` | `/api/public/interactive/school-portal/inquiry`| Tuition calculator | None | InquirySchema | Tuition quote | None | None | Basic | None | Pydantic | `MOCK` |
| `POST` | `/api/public/receptionist-demo/chat` | Demo chat widget | None | ChatSchema | Assistant reply | `receptionist_conversations`| LLM | Try/Except | None | Pydantic | `VERIFIED` |
| `POST` | `/api/public/contact-booking` | Lead booking form | None | BookingSchema | Booking confirm | `businesses`, `contacts` | None | Try/Except | None | Pydantic | `VERIFIED` |

#### Legacy Receptionist Router (`backend/app/api/receptionist.py`):
| Method | Path | Purpose | Auth | Input | Output | DB Access | External | Error Handling | Rate Limit | Validation | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/receptionist/demo-business` | Clinic profile | None | None | Clinic config | `businesses`, `business_knowledge` | None | Basic | None | None | `VERIFIED` |
| `POST` | `/api/receptionist/message` | Clinic triage chat | None | MessageSchema | Elena response | `receptionist_conversations` | LLM | Try/Except | None | Pydantic | `VERIFIED` |
| `GET` | `/api/receptionist/conversations/{id}` | View thread | None | Path param | Conversation | `receptionist_conversations` | None | 404 handled | None | UUID | `VERIFIED` |
| `GET` | `/api/receptionist/handoffs` | Escaped handoffs | None | None | Handoff array | `receptionist_human_handoffs`| None | Basic | None | None | `VERIFIED` |
| `POST` | `/api/receptionist/handoffs/{id}/resolve`| Resolve handoff | None | Path param | Status | `receptionist_human_handoffs`| None | 404 handled | None | UUID | `VERIFIED` |
| `GET` | `/api/receptionist/businesses/{id}/knowledge`| Clinic knowledge | None | Path param | Knowledge obj | `business_knowledge` | None | 404 handled | None | UUID | `VERIFIED` |
| `POST` | `/api/receptionist/businesses/{id}/knowledge`| Update knowledge | None | KnowledgeSchema | Updated obj | `business_knowledge` | None | Try/Except | None | Pydantic | `VERIFIED` |

#### WhatsApp Webhook Router (`backend/app/channels/whatsapp/router.py`):
| Method | Path | Purpose | Auth | Input | Output | DB Access | External | Error Handling | Rate Limit | Validation | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/whatsapp/webhook` | Meta verification | Verify Token | Hub query params| Challenge echo | None | None | Token check | None | Query | `VERIFIED` |
| `POST` | `/api/whatsapp/webhook` | Receive WhatsApp msg| **None** (Missing HMAC) | Meta Webhook JSON| `{"status": "ok"}`| `receptionist_conversations`| LLM, Meta Graph | Try/Except | None | Dict | `PARTIALLY CONNECTED` |

---

### 3. Production V5 Multi-Tenant API Routers (`backend/app/api/v1/`)

#### Authentication Router (`backend/app/api/v1/auth.py`):
| Method | Path | Purpose | Auth | Input | Output | DB Access | External | Error Handling | Rate Limit | Validation | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/signup` | Register user | None | UserSignupSchema | User object | `v5_users` | None | 400 on dupe | None | Pydantic | `VERIFIED` |
| `POST` | `/api/v1/auth/login` | JWT Login | None | LoginSchema | Access token | `v5_users` | None | 401 on bad pw | None | Pydantic | `VERIFIED` |
| `GET` | `/api/v1/auth/me` | Current user profile | Bearer JWT | None | User profile | `v5_users` | None | 401 on expire| None | JWT | `VERIFIED` |
| `POST` | `/api/v1/auth/logout` | Revoke session | Bearer JWT | None | Success status | None | None | Basic | None | None | `VERIFIED` |

#### Businesses Router (`backend/app/api/v1/businesses.py`):
| Method | Path | Purpose | Auth | Input | Output | DB Access | External | Error Handling | Rate Limit | Validation | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/businesses/current` | Current tenant info | Bearer JWT | None | Tenant config | `v5_businesses` | None | 404 handled | None | Tenant scope| `VERIFIED` |
| `PUT` | `/api/v1/businesses/current` | Update tenant info | Bearer JWT | TenantUpdateSchema| Updated config | `v5_businesses` | None | Try/Except | None | Pydantic | `VERIFIED` |
| `GET` | `/api/v1/businesses/{id}/public` | Public tenant config| None | Path param | Public branding | `v5_businesses` | None | 404 handled | None | UUID | `VERIFIED` |

#### AI Employees Router (`backend/app/api/v1/ai_employees.py`):
| Method | Path | Purpose | Auth | Input | Output | DB Access | External | Error Handling | Rate Limit | Validation | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/ai-employees` | List tenant personas| Bearer JWT | None | Employee array | `v5_ai_employees` | None | Basic | None | Tenant scope| `VERIFIED` |
| `POST` | `/api/v1/ai-employees` | Create employee | Bearer JWT | EmployeeSchema | Created employee | `v5_ai_employees` | None | Try/Except | None | Pydantic | `VERIFIED` |
| `PUT` | `/api/v1/ai-employees/{id}` | Update prompt/persona| Bearer JWT | UpdateSchema | Updated employee | `v5_ai_employees` | None | 404 handled | None | Pydantic | `VERIFIED` |
| `POST` | `/api/v1/ai-employees/chat` | Customer chat | None | InboundChatSchema| Assistant reply | `v5_ai_employees`, `v5_conversations`| LLM | Try/Except | None | Pydantic | `VERIFIED` |

#### Services Catalog Router (`backend/app/api/v1/services.py`):
| Method | Path | Purpose | Auth | Input | Output | DB Access | External | Error Handling | Rate Limit | Validation | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/services` | List billable items | Bearer JWT | None | Service array | `v5_services` | None | Basic | None | Tenant scope| `VERIFIED` |
| `POST` | `/api/v1/services` | Add service | Bearer JWT | ServiceSchema | Created service | `v5_services` | None | Try/Except | None | Pydantic | `VERIFIED` |
| `PUT` | `/api/v1/services/{id}` | Update service/price| Bearer JWT | UpdateService | Updated service | `v5_services` | None | 404 handled | None | Pydantic | `VERIFIED` |
| `DELETE`| `/api/v1/services/{id}` | Archive service | Bearer JWT | Path param | Archive status | `v5_services` | None | 404 handled | None | UUID | `VERIFIED` |

#### Staff Router (`backend/app/api/v1/staff.py`):
| Method | Path | Purpose | Auth | Input | Output | DB Access | External | Error Handling | Rate Limit | Validation | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/staff` | List staff members | Bearer JWT | None | Staff array | `v5_staff` | None | Basic | None | Tenant scope| `VERIFIED` |
| `POST` | `/api/v1/staff` | Register staff | Bearer JWT | StaffSchema | Created staff | `v5_staff` | None | Try/Except | None | Pydantic | `VERIFIED` |
| `PUT` | `/api/v1/staff/{id}` | Update schedule | Bearer JWT | UpdateStaff | Updated staff | `v5_staff` | None | 404 handled | None | Pydantic | `VERIFIED` |
| `DELETE`| `/api/v1/staff/{id}` | Deactivate staff | Bearer JWT | Path param | Status | `v5_staff` | None | 404 handled | None | UUID | `VERIFIED` |

#### Knowledge Base Router (`backend/app/api/v1/knowledge.py`):
| Method | Path | Purpose | Auth | Input | Output | DB Access | External | Error Handling | Rate Limit | Validation | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/knowledge/documents`| List documents | Bearer JWT | None | Document array | `v5_knowledge_documents` | None | Basic | None | Tenant scope| `VERIFIED` |
| `POST` | `/api/v1/knowledge/documents`| Ingest text/document| Bearer JWT | IngestDocSchema | Doc + chunk count| `v5_knowledge_documents`, `v5_knowledge_chunks`| None | Try/Except | None | Pydantic | `VERIFIED` |
| `DELETE`| `/api/v1/knowledge/documents/{id}`| Delete doc + chunks| Bearer JWT | Path param | Delete status | `v5_knowledge_documents`, `v5_knowledge_chunks`| None | 404 handled | None | UUID | `VERIFIED` |
| `POST` | `/api/v1/knowledge/search` | RAG keyword search | Bearer JWT | QuerySchema | Matching chunks | `v5_knowledge_chunks`| None | Try/Except | None | Pydantic | `VERIFIED` |

#### Customers Router (`backend/app/api/v1/customers.py`):
| Method | Path | Purpose | Auth | Input | Output | DB Access | External | Error Handling | Rate Limit | Validation | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/customers` | List customers | Bearer JWT | Query params | Customer array | `v5_customers` | None | Basic | None | Tenant scope| `VERIFIED` |
| `GET` | `/api/v1/customers/{id}` | Customer dossier | Bearer JWT | Path param | Full dossier | `v5_customers`, `v5_appointments`| None | 404 handled | None | UUID | `VERIFIED` |
| `PUT` | `/api/v1/customers/{id}` | Update customer info| Bearer JWT | UpdateCustSchema | Updated customer| `v5_customers` | None | 404 handled | None | Pydantic | `VERIFIED` |

#### Conversations Router (`backend/app/api/v1/conversations.py`):
| Method | Path | Purpose | Auth | Input | Output | DB Access | External | Error Handling | Rate Limit | Validation | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/conversations` | List conversations | Bearer JWT | Query params | Thread array | `v5_conversations` | None | Basic | None | Tenant scope| `VERIFIED` |
| `GET` | `/api/v1/conversations/{id}/messages`| Thread messages | Bearer JWT | Path param | Message array | `v5_messages` | None | 404 handled | None | UUID | `VERIFIED` |
| `POST` | `/api/v1/conversations/{id}/reply`| Staff manual reply | Bearer JWT | ReplySchema | Sent message | `v5_messages` | Meta / SMTP | Try/Except | None | Pydantic | `VERIFIED` |
| `POST` | `/api/v1/conversations/{id}/handoff`| Toggle human lock| Bearer JWT | Path param | Lock state | `v5_conversations` | None | 404 handled | None | UUID | `VERIFIED` |

#### Appointments Router (`backend/app/api/v1/appointments.py`):
| Method | Path | Purpose | Auth | Input | Output | DB Access | External | Error Handling | Rate Limit | Validation | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/appointments` | List appointments | Bearer JWT | Query params | Booking array | `v5_appointments` | None | Basic | None | Tenant scope| `VERIFIED` |
| `POST` | `/api/v1/appointments` | Atomic slot booking| None | BookApptSchema | Confirmed booking| `v5_appointments` | None | 409 on conflict| None | Pydantic | `VERIFIED` |
| `GET` | `/api/v1/appointments/availability`| Free slot finder | None | Date query | Free time slots | `v5_appointments`, `v5_staff`| None | Try/Except | None | Query dates | `VERIFIED` |
| `POST` | `/api/v1/appointments/{id}/reschedule`| Atomic reschedule | Bearer JWT | ReschedSchema | Updated booking | `v5_appointments` | None | 409 on conflict| None | Pydantic | `VERIFIED` |
| `POST` | `/api/v1/appointments/{id}/cancel`| Cancel booking | Bearer JWT | Path param | Cancel status | `v5_appointments` | None | 404 handled | None | UUID | `VERIFIED` |

#### Integrations Router (`backend/app/api/v1/integrations.py`):
| Method | Path | Purpose | Auth | Input | Output | DB Access | External | Error Handling | Rate Limit | Validation | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/integrations` | List connectors | Bearer JWT | None | Provider array | `v5_integrations` | None | Basic | None | Tenant scope| `VERIFIED` |
| `POST` | `/api/v1/integrations` | Save API credentials| Bearer JWT | ConfigSchema | Saved status | `v5_integrations` | None | Try/Except | None | Pydantic | `VERIFIED` |

#### Automations Router (`backend/app/api/v1/automations.py`):
| Method | Path | Purpose | Auth | Input | Output | DB Access | External | Error Handling | Rate Limit | Validation | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/automations` | List workflow rules| Bearer JWT | None | Automation array| `v5_automations` | None | Basic | None | Tenant scope| `VERIFIED` |
| `POST` | `/api/v1/automations` | Create workflow | Bearer JWT | AutoSchema | Created workflow| `v5_automations` | None | Try/Except | None | Pydantic | `VERIFIED` |
| `PUT` | `/api/v1/automations/{id}` | Update workflow | Bearer JWT | UpdateAuto | Updated workflow| `v5_automations` | None | 404 handled | None | Pydantic | `VERIFIED` |
| `DELETE`| `/api/v1/automations/{id}` | Delete workflow | Bearer JWT | Path param | Delete status | `v5_automations` | None | 404 handled | None | UUID | `VERIFIED` |

#### Super-Admin Router (`backend/app/api/v1/admin.py`):
| Method | Path | Purpose | Auth | Input | Output | DB Access | External | Error Handling | Rate Limit | Validation | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/admin/tenants` | Platform tenants | Super-Admin JWT| None | Tenant array | `v5_businesses`, `v5_users`| None | 403 on non-admin| None| None | `VERIFIED` |
| `GET` | `/api/v1/admin/system-health`| Server telemetry | Super-Admin JWT| None | CPU, RAM, DB stats| None | None | Basic | None | None | `VERIFIED` |
| `GET` | `/api/v1/admin/audit-logs` | Global audit trail | Super-Admin JWT| Query params | Audit log array | `v5_audit_logs` | None | Basic | None | Query | `VERIFIED` |

#### Lead Engine Master Router (`backend/app/api/v1/lead_engine.py` - Modules 41–56):
| Method | Path | Purpose | Auth | Input | Output | DB Access | External | Error Handling | Rate Limit | Validation | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/prospects` | List B2B prospects | Bearer JWT | Filter query | Prospect array | `v5_prospects` | None | Basic | None | Tenant scope| `VERIFIED` |
| `GET` | `/api/v1/prospects/{id}` | Full lead dossier | Bearer JWT | Path param | Facts + Drafts | `v5_prospects`, `v5_prospect_observations`| None | 404 handled | None | UUID | `VERIFIED` |
| `POST` | `/api/v1/prospects` | Add single lead | Bearer JWT | ProspectCreate | Created prospect | `v5_prospects` | None | Dupe checks | None | Pydantic | `VERIFIED` |
| `POST` | `/api/v1/prospects/import` | Bulk import CSV/JSON| Bearer JWT | ImportSchema | Import counts | `v5_prospects` | None | Try/Except | None | Pydantic | `VERIFIED` |
| `PATCH`| `/api/v1/prospects/{id}` | Update pipeline stage| Bearer JWT| PatchProspect | Updated prospect | `v5_prospects` | None | 404 handled | None | Pydantic | `VERIFIED` |
| `DELETE`| `/api/v1/prospects/{id}` | Disqualify prospect| Bearer JWT| Path param | Archive status | `v5_prospects` | None | 404 handled | None | UUID | `VERIFIED` |
| `POST` | `/api/v1/discovery/search` | Run 13-stage engine | Bearer JWT | SearchQuerySchema| Run results | `v5_prospects`, `v5_lead_searches`| HTTP scraper, LLM| Try/Except | Cooldown | Pydantic | `VERIFIED` |
| `GET` | `/api/v1/discovery/searches`| Search audit logs | Bearer JWT | None | Search run array | `v5_lead_searches`| None | Basic | None | Tenant scope| `VERIFIED` |
| `POST` | `/api/v1/discovery/analyze-url`| On-demand scraper | Bearer JWT | URLSchema | Extracted facts | `v5_prospect_observations`| HTTP scraper | Try/Except | None | Pydantic URL | `VERIFIED` |
| `GET` | `/api/v1/discovery/sources` | Status of 10 sources | Bearer JWT| None | Provider status | None | None | Basic | None | None | `VERIFIED` |
| `GET` | `/api/v1/outreach/pending` | Awaiting human approval| Bearer JWT| None | Pending drafts | `v5_prospect_outreach`| None | Basic | None | Tenant scope| `VERIFIED` |
| `POST` | `/api/v1/outreach/{id}/approve`| Human approval send | Bearer JWT | Path param | Dispatch status | `v5_prospect_outreach`| SMTP | 4 Pre-flight gates| Daily Cap | UUID | `VERIFIED` |
| `POST` | `/api/v1/outreach/{id}/reject` | Reject pending draft| Bearer JWT | Path param | Reject status | `v5_prospect_outreach`| None | 404 handled | None | UUID | `VERIFIED` |
| `POST` | `/api/v1/outreach/{id}/edit` | Modify draft copy | Bearer JWT | EditDraftSchema | Updated draft | `v5_prospect_outreach`| None | 404 handled | None | Pydantic | `VERIFIED` |
| `POST` | `/api/v1/outreach/bulk-approve`| Batch approve send | Bearer JWT | BulkApproveSchema| Sent count | `v5_prospect_outreach`| SMTP | Pre-flight loop | Daily Cap | Pydantic | `VERIFIED` |
| `GET` | `/api/v1/outreach/history` | Sent message history| Bearer JWT | Query params | Outreach event log| `v5_outreach_events` | None | Basic | None | Tenant scope| `VERIFIED` |
| `GET` | `/api/v1/outreach/status` | Rate limits & cooldown| Bearer JWT| None | Velocity telemetry| `v5_outreach_events` | None | Basic | None | Tenant scope| `VERIFIED` |
| `GET` | `/api/v1/suppression` | Multi-tenant blacklist| Bearer JWT| None | Blacklist array | `v5_suppression_entries`| None | Basic | None | Tenant scope| `VERIFIED` |
| `POST` | `/api/v1/suppression` | Add blacklist entry | Bearer JWT | SuppressSchema | Created entry | `v5_suppression_entries`| None | Try/Except | None | Pydantic | `VERIFIED` |
| `DELETE`| `/api/v1/suppression/{id}` | Delete blacklist | Bearer JWT | Path param | Delete status | `v5_suppression_entries`| None | 404 handled | None | UUID | `VERIFIED` |
| `GET` | `/api/v1/analytics/pipeline` | 8-stage funnel stats| Bearer JWT | None | Funnel counts | `v5_prospects` | None | Basic | None | Tenant scope| `VERIFIED` |
| `GET` | `/api/v1/analytics/deliverability`| Bounce/open watchdog| Bearer JWT| None | Deliverability stats| `v5_outreach_events`| None | Basic | None | Tenant scope| `VERIFIED` |
| `GET` | `/api/v1/analytics/roi` | Pipeline revenue | Bearer JWT | None | Financial metrics| `v5_prospects`, `v5_appointments`| None | Basic | None | Tenant scope| `VERIFIED` |

---

## 8. Database Audit

### 1. Database Engine & Schema Isolation
* **Driver**: SQLite (`sqlite+aiosqlite`) default; PostgreSQL (`asyncpg`) configuration ready.
* **Storage Location**:
  - Local Dev: `./outreach_ai.db` (Persistent on local machine).
  - Vercel Serverless / AWS Lambda: `/tmp/outreach_ai.db` (**Critical Defect**: Ephemeral storage wiped on cold starts).
* **Total Physical Tables**: **51 tables** across two distinct architectures:
  - **Legacy V4 (21 tables)**: Single-tenant CRM, email campaigns, and early receptionist stubs.
  - **Production V5 (30 tables)**: Multi-tenant, strictly isolated by `business_id` foreign keys.

### 2. Physical Database Table Inventory (All 51 Tables)

| # | Physical Table Name | SQLAlchemy Model Class | Module Reference | Architecture Era | Primary Purpose |
| :- | :--- | :--- | :--- | :--- | :--- |
| 1 | `businesses` | `Business` | `backend/app/models/business.py` | Legacy V4 | Single-tenant business targets |
| 2 | `contacts` | `Contact` | `backend/app/models/business.py` | Legacy V4 | Decision-maker email/phone records |
| 3 | `business_research` | `BusinessResearch` | `backend/app/models/business.py` | Legacy V4 | Web scraper observation notes |
| 4 | `campaigns` | `Campaign` | `backend/app/models/campaign.py` | Legacy V4 | Outreach campaign containers |
| 5 | `campaign_members` | `CampaignMember` | `backend/app/models/campaign.py` | Legacy V4 | Campaign-to-contact association |
| 6 | `outreach_messages` | `OutreachMessage` | `backend/app/models/campaign.py` | Legacy V4 | Drafted & sent outbound messages |
| 7 | `message_events` | `MessageEvent` | `backend/app/models/campaign.py` | Legacy V4 | Open, click, bounce tracking |
| 8 | `conversations` | `Conversation` | `backend/app/models/inbox.py` | Legacy V4 | Two-way email thread headers |
| 9 | `replies` | `Reply` | `backend/app/models/inbox.py` | Legacy V4 | Individual message turns in threads |
| 10 | `system_alerts` | `SystemAlert` | `backend/app/models/inbox.py` | Legacy V4 | Operator notification alerts |
| 11 | `human_corrections` | `HumanCorrection` | `backend/app/models/inbox.py` | Legacy V4 | Human operator edit diff store |
| 12 | `suppression_list` | `SuppressionEntry` | `backend/app/models/compliance.py`| Legacy V4 | Global do-not-contact blacklist |
| 13 | `audit_logs` | `AuditLog` | `backend/app/models/compliance.py`| Legacy V4 | System compliance audit trail |
| 14 | `system_states` | `SystemState` | `backend/app/models/compliance.py`| Legacy V4 | Key-value store (kill switch) |
| 15 | `mailbox_health` | `MailboxHealth` | `backend/app/models/compliance.py`| Legacy V4 | Daily sending volume counters |
| 16 | `proposals` | `Proposal` | `backend/app/models/pipeline.py` | Legacy V4 | Generated sales proposals |
| 17 | `clients` | `Client` | `backend/app/models/pipeline.py` | Legacy V4 | Closed client contracts |
| 18 | `payments` | `Payment` | `backend/app/models/pipeline.py` | Legacy V4 | Client invoice & payment logs |
| 19 | `business_knowledge` | `BusinessKnowledge` | `backend/app/models/receptionist.py`| Legacy V4 | Clinic hours, address, services |
| 20 | `receptionist_conversations`| `ReceptionistConversation`| `backend/app/models/receptionist.py`| Legacy V4| Front-desk chat session threads |
| 21 | `receptionist_messages` | `ReceptionistMessage` | `backend/app/models/receptionist.py`| Legacy V4| Front-desk individual chat turns |
| 22 | `receptionist_actions` | `ReceptionistAction` | `backend/app/models/receptionist.py`| Legacy V4| AI tool executions |
| 23 | `receptionist_human_handoffs`| `HumanHandoff` | `backend/app/models/receptionist.py`| Legacy V4| Triage staff escalation tickets |
| 24 | `v5_users` | `V5User` | `backend/app/models/v5.py` | Authoritative V5 | Multi-tenant auth & passwords |
| 25 | `v5_businesses` | `V5Business` | `backend/app/models/v5.py` | Authoritative V5 | Client business profiles |
| 26 | `v5_business_users` | `V5BusinessUser` | `backend/app/models/v5.py` | Authoritative V5 | Tenant user membership & roles |
| 27 | `v5_ai_employees` | `V5AIEmployee` | `backend/app/models/v5.py` | Authoritative V5 | Elena, Marcus, Aria, Kael config |
| 28 | `v5_services` | `V5Service` | `backend/app/models/v5.py` | Authoritative V5 | Billable services & pricing |
| 29 | `v5_staff` | `V5Staff` | `backend/app/models/v5.py` | Authoritative V5 | Staff working hours & calendars |
| 30 | `v5_knowledge_documents`| `V5KnowledgeDocument` | `backend/app/models/v5.py` | Authoritative V5 | Uploaded PDF/text documents |
| 31 | `v5_knowledge_chunks` | `V5KnowledgeChunk` | `backend/app/models/v5.py` | Authoritative V5 | 500-token chunks for RAG |
| 32 | `v5_customers` | `V5Customer` | `backend/app/models/v5.py` | Authoritative V5 | End-user customer profiles |
| 33 | `v5_conversations` | `V5Conversation` | `backend/app/models/v5.py` | Authoritative V5 | Omnichannel conversation threads |
| 34 | `v5_messages` | `V5Message` | `backend/app/models/v5.py` | Authoritative V5 | Individual chat messages & tokens |
| 35 | `v5_leads` | `V5Lead` | `backend/app/models/v5.py` | Authoritative V5 | Inbound captured leads |
| 36 | `v5_appointments` | `V5Appointment` | `backend/app/models/v5.py` | Authoritative V5 | Atomic calendar bookings |
| 37 | `v5_integrations` | `V5Integration` | `backend/app/models/v5.py` | Authoritative V5 | Third-party API credentials |
| 38 | `v5_automations` | `V5Automation` | `backend/app/models/v5.py` | Authoritative V5 | Trigger-condition-action rules |
| 39 | `v5_tasks` | `V5Task` | `backend/app/models/v5.py` | Authoritative V5 | Scheduled follow-up tasks |
| 40 | `v5_notifications` | `V5Notification` | `backend/app/models/v5.py` | Authoritative V5 | Notification queue & alerts |
| 41 | `v5_ai_events` | `V5AIEvent` | `backend/app/models/v5.py` | Authoritative V5 | LLM token, cost & latency logs |
| 42 | `v5_audit_logs` | `V5AuditLog` | `backend/app/models/v5.py` | Authoritative V5 | Multi-tenant security audit logs |
| 43 | `v5_usage` | `V5Usage` | `backend/app/models/v5.py` | Authoritative V5 | Monthly billing usage counters |
| 44 | `v5_geo_targeting_configs`| `V5GeoTargetingConfig`| `backend/app/models/v5.py` | Authoritative V5 | Geo radius & service areas |
| 45 | `v5_outreach_messages` | `V5OutreachMessage` | `backend/app/models/v5.py` | Authoritative V5 | Omnichannel dispatch logs |
| 46 | `v5_suppression_entries`| `V5SuppressionEntry` | `backend/app/models/v5.py` | Authoritative V5 | Multi-tenant blacklist |
| 47 | `v5_prospects` | `V5Prospect` | `backend/app/models/lead_engine.py`| Authoritative V5 | B2B prospect intelligence records |
| 48 | `v5_prospect_observations`| `V5ProspectObservation`| `backend/app/models/lead_engine.py`| Authoritative V5| Scraped website facts & tech |
| 49 | `v5_prospect_opportunities`| `V5ProspectOpportunity`| `backend/app/models/lead_engine.py`| Authoritative V5| Automation angles & citations |
| 50 | `v5_prospect_outreach` | `V5ProspectOutreach` | `backend/app/models/lead_engine.py`| Authoritative V5 | Sequence drafts & review states |
| 51 | `v5_outreach_events` | `V5OutreachEvent` | `backend/app/models/lead_engine.py`| Authoritative V5 | Delivery tracking & bounces |
| 52 | `v5_lead_searches` | `V5LeadSearch` | `backend/app/models/lead_engine.py`| Authoritative V5 | Search run history & filters |
| 53 | `v5_lead_search_results`| `V5LeadSearchResult` | `backend/app/models/lead_engine.py`| Authoritative V5| Search-to-prospect junction |

### 3. Evaluation Against Required Capabilities Checklist
* **Users**: `SUPPORTED` (`v5_users`, `v5_business_users`).
* **Organizations**: `SUPPORTED` (`v5_businesses` encapsulates client organizations).
* **Workspaces**: `MISSING` (Workspaces are currently synonymous with single businesses; sub-workspace hierarchy does not exist).
* **Agents**: `SUPPORTED` (`v5_ai_employees`).
* **Conversations**: `SUPPORTED` (`v5_conversations`).
* **Messages**: `SUPPORTED` (`v5_messages`).
* **Contacts**: `SUPPORTED` (`contacts` in V4, `v5_customers` in V5).
* **Leads**: `SUPPORTED` (`v5_leads` inbound, `v5_prospects` outbound discovery).
* **Appointments**: `SUPPORTED` (`v5_appointments`).
* **Knowledge Documents**: `SUPPORTED` (`v5_knowledge_documents`).
* **Embeddings**: `SCHEMA ONLY` (`v5_knowledge_chunks.embedding` column exists, but values are null; vector index missing).
* **Automations**: `SUPPORTED` (`v5_automations`).
* **Automation Runs**: `PARTIALLY SUPPORTED` (`v5_tasks` tracks tasks, but dedicated run execution logs table is missing).
* **Integrations**: `SUPPORTED` (`v5_integrations`).
* **Webhooks**: `PARTIALLY SUPPORTED` (`backend/app/channels/whatsapp/router.py`, but missing general inbound webhook log table).
* **Audit Logs**: `SUPPORTED` (`v5_audit_logs`, `audit_logs`).

---

## 9. AI Audit

### 1. Model Configuration & Orchestration
* **Primary Models**: OpenAI `gpt-4o-mini` (General/Receptionist), OpenAI `gpt-4o` (Complex Reasoning), Google Gemini `gemini-1.5-flash` / `gemini-1.5-pro`.
* **Provider Abstraction**: Implemented in `backend/app/ai/llm_provider.py` and `provider_abstraction.py`. Automatically falls back from OpenAI -> Gemini -> MockLLMProvider when credentials are unavailable.
* **Cost & Latency Telemetry**: Logged asynchronously in `backend/app/ai/cost_tracker.py` and persisted to `v5_ai_events`.

### 2. Exhaustive AI Integration Matrix

| Subsystem | Model & Provider | Prompt Location | Input Data | Output Data | Streaming? | Memory? | RAG? | Tool Calling? | Timeout | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Elena Receptionist Chat** | `gpt-4o-mini` (OpenAI / Gemini) | `prompts/receptionist_demo.md` | User message, clinic knowledge, conversation history | Natural language reply, triage action | No | Last 10 turns | Yes (Keyword) | Yes (Availability, Emergency) | 30s | `REAL` |
| **Prospect Opportunity Analyzer** | `gpt-4o` (OpenAI) | `prompts/opportunity_detection.md` | Scraped website facts, booking widget, CMS | Automation angles, impact rationale | No | No | No | No | 45s | `REAL` |
| **Personalized Outreach Generator** | `gpt-4o-mini` (OpenAI) | `prompts/outreach_generation.md` | Prospect facts, pain points, sender identity | Subject line, RFC 2822 email draft | No | No | No | No | 30s | `REAL` |
| **Anti-Hallucination Firewall** | `gpt-4o-mini` (OpenAI) | `prompts/factuality_validation.md` | Generated email draft, verified observations | Binary pass/fail, unsupported claims list | No | No | No | No | 20s | `REAL` |
| **Inbound Reply Classifier** | `gpt-4o-mini` (OpenAI) | `prompts/reply_classification.md` | Inbound prospect email text | Intent category (INTERESTED, OPT_OUT, etc.) | No | No | No | No | 15s | `REAL` |
| **Fact-Fuel Video Script Gen** | `gpt-4o-mini` (OpenAI) | Inline prompt in `public.py:186` | Topic string, duration | 60-second video script | No | No | No | No | 30s | `REAL` |
| **AITools Studio (18 Mini-Tools)**| None (Client-side Canvas) | None | User text/sliders | Canvas pixels, speech synth | No | No | No | No | N/A | `MOCK` |

### 3. Hallucination Risks & Defense Architecture
* **Risk Scenario**: Outbound email generation hallucinating customer claims (e.g., claiming a dentist has bad Google reviews when reviews were not scraped).
* **Firewall Defense (`backend/app/ai/hallucination_firewall.py`)**: All generated drafts pass through a pre-dispatch validation pipeline. Every factual claim is verified against `v5_prospect_observations`. If an ungrounded claim is detected, the draft is rejected and escalated to human review.

---

## 10. Integration Audit

| Service Category | Provider / Technology | Implementation File | Verification Status | Code Evidence & Operational Reality |
| :--- | :--- | :--- | :--- | :--- |
| **WhatsApp** | Meta WhatsApp Cloud API (Graph API v21.0) | `backend/app/channels/whatsapp/service.py` & `router.py` | `PARTIALLY CONNECTED` | Webhook verification challenge (`hub.mode='subscribe'`) is fully implemented. Outbound dispatch uses `httpx.AsyncClient` to Meta endpoints when `META_ACCESS_TOKEN` is configured. **Defect**: POST webhook payload HMAC-SHA256 signature is not verified. |
| **Voice** | Web Speech API / Simulated Bland.ai | `frontend/src/utils/speechEngine.js` | `NOT CONNECTED` | Speech synthesis and speech recognition run entirely inside the client browser. No backend telephony gateway (Twilio Voice, Bland.ai, Retell) is initialized. |
| **Email** | Gmail SMTP / Dry Run | `backend/app/outreach/email_provider.py` | `CONNECTED` | Sends real emails over SMTP port 587 when `DRY_RUN=False` and `SMTP_PASSWORD` is configured. **Defect**: Synchronous `smtplib` blocks the asyncio event loop. |
| **Calendar** | Local Database Conflict Engine | `backend/app/appointments/engine.py` | `PARTIALLY CONNECTED` | Double-booking prevention and atomic slot reservation are fully functional in local database (`v5_appointments`). Google Calendar / Outlook CalDAV synchronization is missing. |
| **CRM** | HubSpot / Salesforce | `backend/app/api/v1/integrations.py` | `NOT CONNECTED` | Credentials rows can be created in `v5_integrations`. No bi-directional contact sync, deal pipeline sync, or token refresh workers exist. |
| **SMS** | Twilio SMS | `backend/app/api/public.py` | `NOT CONNECTED` | Mentioned in showcase metadata for Bright Star Grammar School; no Twilio SMS client is initialized in backend code. |
| **AI Providers** | OpenAI & Google Gemini | `backend/app/ai/llm_provider.py` | `CONNECTED` | Both official SDKs (`openai` and `google-genai`) are implemented with error handling and fallback to mock provider when offline. |
| **Storage** | Local SQLite Text Columns | `backend/app/models/v5.py` | `NOT CONNECTED` | Uploaded knowledge base documents are stored directly as plain text in SQLite database columns. Cloud object storage (AWS S3, Cloudflare R2) is missing. |
| **Database** | SQLite via `aiosqlite` | `backend/app/database.py` | `CONNECTED` | Active SQLite connection engine executes all queries. PostgreSQL configuration is scaffolded in code but currently inactive. |
| **Authentication** | Passlib (Bcrypt) & Python-Jose (JWT) | `backend/app/auth/security.py` | `CONNECTED` | Password hashing and JWT generation/validation operate cleanly for V5 endpoints. |

---

## 11. Authentication & Authorization

### 1. Implemented Capabilities:
* **Password Hashing**: `passlib.context.CryptContext(schemes=["bcrypt"])` securely hashes passwords with salt.
* **Token Issuance**: `python-jose` generates HS256 JWT tokens containing `user_id`, `email`, and expiration timestamp (`ACCESS_TOKEN_EXPIRE_MINUTES = 1440`).
* **Tenant Scoping Dependency (`backend/app/api/v1/deps.py`)**: `get_current_tenant` extracts token, verifies signature, confirms user existence, and enforces `business_id` scoping across all database queries.

### 2. Architectural Gaps & Vulnerabilities:
* **Unauthenticated Legacy V4 API Routes**: The legacy routers (`/api/kill-switch/*`, `/api/dashboard/*`, `/api/compliance/*`, `/api/leads/*`, `/api/outreach/*`, `/api/inbox/*`) do not declare authentication dependencies. Any internet user can access sensitive lead data or toggle the kill switch.
* **Missing Role-Based Access Control (RBAC)**: While `V5UserRole` defines `SUPER_ADMIN`, `ADMIN`, `OPERATOR`, and `VIEWER`, endpoints only verify that a user exists. Fine-grained permission checks (e.g., preventing a Viewer from deleting documents or triggering outreach) are not enforced.

---

## 12. Security Findings

All security vulnerabilities identified during Phase 0 are classified below according to industry severity standards:

### P0 — Critical Vulnerabilities (Immediate Exploitation Risk)
1. **Wildcard CORS with Credentials Enabled**:
   - **File**: `backend/app/main.py:50-56`
   - **Code**: `CORSMiddleware(allow_origins=["*"], allow_credentials=True, ...)`
   - **Vulnerability**: Browser security policies forbid wildcard origins when credentials are enabled. Malicious websites can make cross-origin authenticated requests and steal tenant data.
2. **Unauthenticated Operational & Control Endpoints**:
   - **Files**: `backend/app/api/kill_switch.py:28`, `backend/app/api/compliance.py:20`, `backend/app/api/leads.py:35`
   - **Vulnerability**: Endpoints that toggle platform sending or dump audit logs require no JWT tokens or API keys. Anyone can trigger `POST /api/kill-switch/toggle` and shut down outreach operations.

### P1 — Serious Vulnerabilities (High Impact Risk)
1. **Plaintext Gmail App Password in Repository**:
   - **File**: `.env` line 22
   - **Vulnerability**: An active 16-character Google App Password (`SMTP_PASSWORD=...`) is stored in plaintext on disk, granting unauthorized email sending rights.
2. **Default JWT Secret Key in Source Code**:
   - **File**: `backend/app/config.py:12`
   - **Code**: `SECRET_KEY = "rine_forge_jwt_secret_key_prod_2026_change_in_production"`
   - **Vulnerability**: If not overridden in production environment variables, attackers can sign their own administrative JWT tokens.
3. **Ephemeral SQLite Storage on Serverless**:
   - **File**: `backend/app/config.py:16-20`
   - **Vulnerability**: In serverless runtimes (Vercel, AWS Lambda), database path defaults to `/tmp/outreach_ai.db`. Cold restarts wipe tenant registrations, customer bookings, and audit records.

### P2 — Important Vulnerabilities (Operational & Data Integrity Risk)
1. **Synchronous Blocking Calls Inside Async Loop**:
   - **File**: `backend/app/outreach/email_provider.py:92`
   - **Vulnerability**: `smtplib.SMTP` connects over raw synchronous network sockets inside an `async def` function, freezing the FastAPI asyncio event loop during network delays.
2. **Missing WhatsApp Webhook HMAC Signature Verification**:
   - **File**: `backend/app/channels/whatsapp/router.py:41-56`
   - **Vulnerability**: `POST /api/whatsapp/webhook` does not validate the `X-Hub-Signature-256` header against an application secret. Attackers can forge fake inbound customer messages.
3. **Missing Rate Limiting on Public Endpoints**:
   - **Files**: `backend/app/api/v1/auth.py`, `backend/app/api/public.py`
   - **Vulnerability**: Public authentication and LLM script generation endpoints lack IP-based rate limiting, exposing the platform to credential brute-forcing and token exhaustion.
4. **Disconnected SaaS Management Portal**:
   - **Files**: `frontend/src/components/app/*.jsx`
   - **Vulnerability**: Self-serve portal views operate on local React mocks, presenting an illusion of multi-tenant management without persisting state.

### P3 — Improvement Items (Best Practice & Hygiene)
1. **Missing Content Security Policy (CSP) Headers**: No CSP or HSTS headers configured in FastAPI middleware.
2. **Single Monolithic Frontend Bundle (825.14 kB)**: Missing route-based dynamic `import()` code splitting.
3. **In-Memory Rate Limiting**: Sending rate limits are tracked in in-memory dictionaries that reset on container restarts.
4. **Verbose Debug Mode Default**: `DEBUG = True` enabled in `config.py`, leaking tracebacks during unhandled exceptions.
5. **Dead Local Portfolio URLs**: Broken `.demo.local` links in public showcase views.

---

## 13. Environment Variables

Below is the complete audit of all environment variables referenced in `backend/app/config.py`.  
*(In accordance with audit directives, no secret values are displayed).*

| Variable Name | Used Where | Required? | Secret? | Currently Configured? | What Breaks If Missing? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `ENVIRONMENT` | `config.py` | No | No | Yes (`development`) | Defaults to `development`. |
| `DEBUG` | `config.py` | No | No | Yes (`True`) | Defaults to `True`; affects traceback verbosity. |
| `PORT` | `config.py` | No | No | Yes (`8000`) | Defaults to port 8000. |
| `HOST` | `config.py` | No | No | Yes (`0.0.0.0`) | Defaults to binding on all network interfaces. |
| `SECRET_KEY` | `config.py`, `security.py` | **Yes** | **Yes** | Uses Default | **CRITICAL**: Uses insecure hardcoded default key. |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `config.py` | No | No | Yes (`1440`) | Defaults to 24 hours. |
| `DATABASE_URL` | `config.py`, `database.py`| No | No | Auto-detected | Defaults to SQLite (`./outreach_ai.db` or `/tmp/`). |
| `OPENAI_API_KEY` | `openai_provider.py` | Cond. | **Yes** | Unset | Falls back to Gemini or Mock provider. |
| `OPENAI_MODEL` | `config.py` | No | No | Yes (`gpt-4o-mini`) | Defaults to `gpt-4o-mini`. |
| `OPENAI_REASONING_MODEL` | `config.py` | No | No | Yes (`gpt-4o`) | Defaults to `gpt-4o`. |
| `GEMINI_API_KEY` | `llm_provider.py` | Cond. | **Yes** | Unset | Falls back to Mock provider. |
| `LLM_PROVIDER` | `config.py` | No | No | Yes (`auto`) | Defaults to auto-provider selection. |
| `DEFAULT_MODEL` | `config.py` | No | No | Yes (`gpt-4o-mini`) | Defaults to `gpt-4o-mini`. |
| `REASONING_MODEL` | `config.py` | No | No | Yes (`gpt-4o`) | Defaults to `gpt-4o`. |
| `DRY_RUN` | `config.py`, `engine_v5.py` | No | No | Yes (`True`) | **Safety Flag**: Prevents real email sending. |
| `AUTO_REPLY_ENABLED` | `config.py` | No | No | Yes (`False`) | Autonomous reply engine remains dormant. |
| `GLOBAL_KILL_SWITCH` | `config.py` | No | No | Yes (`False`) | Outbound message sequences operate normally. |
| `MAX_DAILY_EMAILS` | `rate_limiter_v5.py` | No | No | Yes (`50`) | Caps daily email volume per tenant. |
| `MAX_HOURLY_EMAILS` | `rate_limiter_v5.py` | No | No | Yes (`10`) | Caps hourly email burst rate. |
| `MIN_SEND_DELAY_SECONDS` | `config.py` | No | No | Yes (`180`) | Sets lower bound of randomized dispatch delays. |
| `MAX_SEND_DELAY_SECONDS` | `config.py` | No | No | Yes (`600`) | Sets upper bound of randomized dispatch delays. |
| `SENDING_HOURS_START` | `config.py` | No | No | Yes (`9`) | Prevents outreach before 9:00 AM. |
| `SENDING_HOURS_END` | `config.py` | No | No | Yes (`17`) | Prevents outreach after 5:00 PM. |
| `SENDING_TIMEZONE` | `config.py` | No | No | Yes (`UTC`) | Governs sending window timezone calculations. |
| `DEFAULT_LEAD_THRESHOLD` | `config.py` | No | No | Yes (`75`) | Leads scoring below 75 are excluded from outreach. |
| `DEFAULT_COUNTRY` | `config.py` | No | No | Yes (`USA`) | Default country for geographic compliance policies. |
| `EMAIL_PROVIDER` | `config.py` | No | No | Yes (`dry_run`) | When set to `smtp`, attempts live relay. |
| `SMTP_HOST` | `email_provider.py` | Cond. | No | Yes (`smtp.gmail.com`)| SMTP server hostname. |
| `SMTP_PORT` | `email_provider.py` | Cond. | No | Yes (`587`) | SMTP port. |
| `SMTP_USERNAME` | `email_provider.py` | Cond. | No | Yes (`alexrine691@...`)| Outbound SMTP authentication username. |
| `SMTP_PASSWORD` | `email_provider.py` | Cond. | **Yes** | **Configured in .env**| SMTP password. If missing, SMTP dispatch fails. |
| `SMTP_USE_TLS` | `email_provider.py` | No | No | Yes (`True`) | Enforces STARTTLS encryption. |
| `SENDER_NAME` | `email_provider_v5.py` | No | No | Yes (`Alex Rine`) | Outbound email header display name. |
| `SENDER_EMAIL` | `email_provider_v5.py` | No | No | Yes (`alexrine691@...`)| RFC 2822 From address. |
| `SENDER_COMPANY` | `email_provider_v5.py` | No | No | Yes (`Rine Forge`) | Corporate entity in email footer. |
| `SENDER_PHYSICAL_ADDRESS` | `email_provider_v5.py` | No | No | Yes (Austin TX) | CAN-SPAM physical postal address in footer. |
| `REPLY_TO_EMAIL` | `email_provider_v5.py` | No | No | Yes (`alexrine691@...`)| RFC 2822 Reply-To header. |
| `ESCALATION_EMAIL_ALERT` | `notifications/base.py`| No | No | Yes (`True`) | Enables high-intent lead notifications. |
| `ALERT_RECIPIENT_EMAIL` | `notifications/base.py`| No | No | Yes (`alexrine691@...`)| Recipient email for urgent alerts. |
| `PORTFOLIO_ORACLE_AI_URL` | `config.py` | No | No | Yes (`.demo.local`) | Portfolio showcase external link. |
| `PORTFOLIO_PLOT_TWIST_URL` | `config.py` | No | No | Yes (`.demo.local`) | Portfolio showcase external link. |
| `PORTFOLIO_BRIGHT_STAR_URL`| `config.py` | No | No | Yes (`.demo.local`) | Portfolio showcase external link. |
| `META_VERIFY_TOKEN` | `whatsapp/router.py` | Cond. | **Yes** | Uses Default | WhatsApp webhook verification challenge token. |
| `META_ACCESS_TOKEN` | `whatsapp/service.py` | Cond. | **Yes** | Unset | Falls back to mock WhatsApp responses. |
| `META_PHONE_NUMBER_ID` | `whatsapp/service.py` | Cond. | No | Unset | WhatsApp sender phone identifier. |
| `META_WABA_ID` | `whatsapp/service.py` | Cond. | No | Unset | WhatsApp Business Account identifier. |
| `META_API_VERSION` | `whatsapp/service.py` | No | No | Yes (`v21.0`) | Graph API version. |
| `VERCEL` | `config.py` | No | No | Injected by Vercel | Switches SQLite database to `/tmp/`. |
| `AWS_LAMBDA_FUNCTION_NAME` | `config.py` | No | No | Injected by AWS | Switches SQLite database to `/tmp/`. |

---

## 14. UX / Reliability Findings

1. **User Interaction Dead-Ends**:
   - In `frontend/src/components/app/AdminPanel.jsx`, buttons labeled "Refresh System Metrics", "Export System Audit", and "Purge Stale Cache" have no click handlers attached.
   - In `frontend/src/components/app/AppControlCenter.jsx`, buttons labeled "Download Telemetry Log" and "Reset Emergency Counters" are purely cosmetic.
2. **Missing Loading States**:
   - In `frontend/src/components/app/AppApprovals.jsx`, clicking "Approve" or "Reject" immediately mutates local React state without displaying an intermediate loading spinner.
   - In `frontend/src/components/forge/AuditPage.jsx`, while the submit button is disabled during submission, the input fields remain active and can be altered while the request is in flight.
3. **Missing Empty States**:
   - In `frontend/src/components/app/AppIntegrations.jsx`, when no integrations are configured, the container renders blank whitespace without an empty state illustration or "Add Integration" CTA.
   - In `frontend/src/components/app/AdminPanel.jsx`, the audit logs table renders empty table headers with no fallback message when zero logs exist.
4. **Form Submission Without Feedback**:
   - In `frontend/src/components/app/AppBilling.jsx`, clicking "Upgrade Subscription" triggers a 1200ms timeout and shows a success banner, but does not persist anything to the backend or update user billing limits.

---

## 15. Performance Findings

1. **Monolithic Frontend Bundle (825.14 kB)**:
   - The production build outputs a single large JavaScript chunk (`dist/assets/index-C2x4erL2.js`).
   - All 113 components—including the 2,403-line `AIToolsForgeView` and all 10 SaaS management views—are loaded on initial page load. Route-based code splitting using `React.lazy()` and dynamic `import()` is absent.
2. **Event Loop Blocking During Outbound Email Delivery**:
   - `backend/app/outreach/email_provider.py` connects synchronously to Gmail SMTP over port 587 inside an `async def` handler. Under network latency, concurrent web requests stall while waiting for the SMTP handshake to complete.
3. **Continuous Animation Canvas CPU Cycles**:
   - `frontend/src/components/forge/AgentNetworkVisualizer.jsx` runs a continuous `requestAnimationFrame` render loop even when scrolled completely off-screen, consuming client CPU cycles unnecessarily.

---

## 16. Mobile Findings

1. **Kanban Horizontal Viewport Breakage**:
   - In `frontend/src/components/PipelineView.jsx:185`, the 8 pipeline columns define `min-w-[220px]` without a dedicated mobile tab switcher. On mobile screens (<640px), the layout forces horizontal page scrolling, stretching the navigation bar and footer.
2. **Modal Viewport Height Overflows**:
   - In `frontend/src/components/PaymentPortalModal.jsx` and `RealAiReceptionistChat.jsx`, modals use fixed padding (`p-6`) and viewport height calculations that clip beneath mobile browser bottom address bars on iOS Safari.
3. **Three-Column Fixed Grid Overflows**:
   - In `frontend/src/components/AIToolsForgeView.jsx`, multi-pane studio layouts use fixed 3-column CSS grids that collapse improperly on screens below 768px.

---

## 17. Dependency Findings

### Frontend Dependencies (`frontend/package.json`):
* `react`: `^19.0.0` (Active)
* `react-dom`: `^19.0.0` (Active)
* `lucide-react`: `^1.16.0` (Active)
* **Assessment**: The frontend dependency tree is exceptionally lightweight (3 packages). However, `typescript` is absent (untyped codebase) and no linting package (`eslint`) is installed.

### Backend Dependencies (`requirements.txt`):
* `fastapi>=0.115.0`: Active & core.
* `uvicorn>=0.30.0`: Active ASGI server.
* `sqlalchemy>=2.0.30`: Active ORM.
* `aiosqlite>=0.20.0`: Active SQLite driver.
* `pydantic>=2.7.0`: Active data modeling.
* `pydantic-settings>=2.3.0`: Active configuration loader.
* `python-jose>=3.3.0`: Active JWT handling.
* `passlib>=1.7.4` & `bcrypt>=4.0.0`: Active password hashing.
* `google-genai>=0.2.0`: **Risky Dependency**. Experimental SDK with breaking API changes across versions.
* `openai>=1.40.0`: Active OpenAI client.
* `beautifulsoup4>=4.12.0`: Active website scraper parser.
* `httpx>=0.27.0`: Active async HTTP client.
* `asyncpg>=0.29.0`: **Unused Dependency**. Installed for PostgreSQL support, but currently inactive while platform runs on SQLite.
* **Missing Package**: `aiosmtplib` is missing. Standard library `smtplib` is used synchronously inside async functions.

---

## 18. Technical Debt

1. **V4 vs V5 Architectural Duality**:
   - The database contains 21 legacy V4 tables alongside 30 authoritative V5 tables.
   - The API contains legacy V4 routers (`/api/leads`, `/api/campaigns`) alongside V5 multi-tenant routers (`/api/v1/prospects`, `/api/v1/ai-employees`).
   - Maintaining two concurrent schemas complicates migrations and increases test surface area.
2. **Untyped JavaScript Frontend**:
   - All 113 frontend source files are written in pure JavaScript JSX without TypeScript interfaces or PropTypes. Type errors in API response contracts can only be discovered at runtime.
3. **Client-Side Regex Fallback Stubs**:
   - `receptionistClientFallback.js` (336 lines) masks backend connectivity failures by returning canned responses instead of bubbling connection status to the operator.
4. **Lack of Database Migration Tracking**:
   - No Alembic migration folder (`alembic/`) exists. Database initialization relies on `Base.metadata.create_all()`, preventing schema modifications in production without dropping tables or writing manual SQL scripts.

---

## 19. P0 Issues

| Issue ID | Category | Location | Description | Remediation Required |
| :--- | :--- | :--- | :--- | :--- |
| **P0-1** | Security | `backend/app/main.py:50-56` | **Wildcard CORS with Credentials Enabled**: `allow_origins=["*"]` combined with `allow_credentials=True` violates browser security models and permits unauthorized cross-origin data extraction. | Restrict `allow_origins` to explicitly configured domain whitelists (`https://rine-forge-systems.vercel.app`, `http://localhost:5173`). |
| **P0-2** | Security | `backend/app/api/kill_switch.py:28`, `compliance.py:20`, `leads.py:35` | **Unauthenticated Operational & Control Endpoints**: Legacy V4 routers lack authentication dependencies. Unauthenticated external users can halt the system or scrape lead logs. | Apply `get_current_tenant` dependency across all legacy operational routers. |

---

## 20. P1 Issues

| Issue ID | Category | Location | Description | Remediation Required |
| :--- | :--- | :--- | :--- | :--- |
| **P1-1** | Security | `.env` line 22 | **Plaintext Google App Password Committed**: An active SMTP password granting mail sending access to `alexrine691@gmail.com` is committed in plaintext. | Revoke password in Google Account console; rotate to environment secret manager. |
| **P1-2** | Security | `backend/app/config.py:12` | **Hardcoded JWT Secret Default**: `SECRET_KEY = "rine_forge_jwt_secret_key_prod_2026_change_in_production"` allows arbitrary admin JWT token forgery if unset. | Enforce startup crash if `SECRET_KEY` is not provided via environment variable in production. |
| **P1-3** | Data Loss | `backend/app/config.py:16-20`, `database.py` | **Ephemeral Serverless SQLite Database**: Storing the database in `/tmp/outreach_ai.db` leads to total data wiping upon serverless cold restart. | Migrate database to managed PostgreSQL instance (Supabase / AWS RDS). |

---

## 21. P2 Issues

| Issue ID | Category | Location | Description | Remediation Required |
| :--- | :--- | :--- | :--- | :--- |
| **P2-1** | Performance | `backend/app/outreach/email_provider.py:92` | **Synchronous Blocking Calls in Async Loop**: `smtplib.SMTP` connects synchronously inside async coroutines, stalling concurrent requests. | Replace standard library `smtplib` with asynchronous `aiosmtplib`. |
| **P2-2** | Security | `backend/app/channels/whatsapp/router.py:41-56` | **Missing Webhook Signature Verification**: Inbound WhatsApp webhook accepts arbitrary unverified JSON payloads without validating `X-Hub-Signature-256`. | Implement HMAC-SHA256 signature verification against Meta App Secret. |
| **P2-3** | Security | `backend/app/api/v1/auth.py`, `public.py` | **Unbounded Public Endpoints (Missing Rate Limiting)**: Login and public LLM script endpoints lack IP-based rate limiting. | Implement Redis/memory-backed sliding window rate limiter. |
| **P2-4** | Integrity | `frontend/src/components/app/*.jsx` | **Disconnected SaaS Portal Views**: All 10 views in `components/app/` operate on local React mocks rather than backend V5 endpoints. | Connect SaaS views to `/api/v1/` endpoints. |

---

## 22. P3 Issues

| Issue ID | Category | Location | Description | Remediation Required |
| :--- | :--- | :--- | :--- | :--- |
| **P3-1** | Performance | `frontend/dist/assets/index-C2x4erL2.js` | **Single Monolithic Frontend Bundle (825.14 kB)**: Vite builds single large bundle without dynamic imports. | Implement route-based lazy loading (`React.lazy()`). |
| **P3-2** | Quality | `frontend/src/` | **Pure Untyped JavaScript**: Lack of TypeScript interfaces increases runtime bug probability. | Introduce TypeScript (`tsconfig.json`) and type contracts. |
| **P3-3** | Integrity | `backend/app/config.py:69-71` | **Dead Portfolio URLs**: Links point to unresolvable `.demo.local` domains. | Replace with active production URLs or modal previews. |
| **P3-4** | Architecture | `backend/app/` | **Missing Alembic Migration Framework**: Database relies on `create_all()`. | Initialize Alembic with versioned schema migrations. |
| **P3-5** | Security | `backend/app/config.py:9` | **Verbose Debug Mode Enabled by Default**: `DEBUG = True` exposes full tracebacks. | Enforce `DEBUG = False` by default in production. |

---

## 23. Recommended Backend Architecture

The target production architecture must unify all operational subsystems into a resilient, asynchronous, multi-tenant platform:

```
                                  INBOUND CHANNELS
              [Meta WhatsApp]    [Twilio Voice]    [Inbound Email]    [Web Chat]
                     │                 │                  │                │
                     ▼                 ▼                  ▼                ▼
            ┌──────────────────────────────────────────────────────────────────┐
            │               FASTAPI ASYNC GATEWAY & MIDDLEWARE                 │
            │  - Origin Whitelist CORS            - Security Headers (CSP)     │
            │  - JWT Auth & Role-Based RBAC       - IP/Tenant Rate Limiter     │
            │  - HMAC Webhook Verification        - Prometheus Telemetry       │
            └──────────────────────────────────┬───────────────────────────────┘
                                               │
                   ┌───────────────────────────┴───────────────────────────┐
                   ▼                                                       ▼
        ┌─────────────────────┐                                 ┌─────────────────────┐
        │ SYNCHRONOUS ROUTERS │                                 │ ASYNC TASK QUEUE    │
        │ - Auth (/v1/auth)   │                                 │ (Redis + ARQ/Celery)│
        │ - Leads (/v1/leads) │                                 │ - 13-Stage Pipeline │
        │ - Booking Engine    │                                 │ - 72h Cooldown Loop │
        │ - AI Chat (Elena)   │                                 │ - Sequence Worker   │
        └──────────┬──────────┘                                 └──────────┬──────────┘
                   │                                                       │
                   ▼                                                       ▼
        ┌─────────────────────────────────────────────────────────────────────────────┐
        │                           APPLICATION CORE SERVICES                         │
        │  ┌───────────────────────┐  ┌───────────────────────┐  ┌─────────────────┐  │
        │  │ Grounded Web Scraper  │  │ AI Orchestrator &     │  │ Double-Booking  │  │
        │  │ (DOM / CMS Inspector) │  │ Hallucination Guard   │  │ Calendar Engine │  │
        │  └───────────────────────┘  └───────────────────────┘  └─────────────────┘  │
        └──────────────────────────────────────┬──────────────────────────────────────┘
                                               │
                                               ▼
        ┌─────────────────────────────────────────────────────────────────────────────┐
        │                         PRODUCTION PERSISTENCE LAYER                        │
        │                                                                             │
        │  ┌─────────────────────────────────┐   ┌─────────────────────────────────┐  │
        │  │ PostgreSQL 16 (Relational DB)   │   │ pgvector (Vector Storage)       │  │
        │  │ - 30 Multi-Tenant V5 Tables     │   │ - 1536-dim OpenAI Embeddings    │  │
        │  │ - Row-Level Tenant Security     │   │ - HNSW Vector Distance Index    │  │
        │  │ - Alembic Schema Migrations     │   │ - Semantic Document Chunks      │  │
        │  └─────────────────────────────────┘   └─────────────────────────────────┘  │
        └─────────────────────────────────────────────────────────────────────────────┘
```

### Core Architecture Specifications:
1. **Security & Ingestion**:
   - Restrict CORS origins to trusted production domains.
   - Enforce cryptographic HMAC-SHA256 signature verification on all incoming webhook requests.
   - Apply JWT authentication dependencies across all internal and administrative routes.
2. **Persistence**:
   - Migrate from SQLite to managed PostgreSQL 16 with `asyncpg` connection pooling.
   - Equip `v5_knowledge_chunks` with `pgvector` HNSW indexes for sub-100ms semantic document retrieval.
   - Version schema evolutions using Alembic migrations.
3. **Asynchronous Execution**:
   - Deploy a Redis-backed distributed task queue (ARQ or Celery) to execute the 13-stage discovery pipeline, 72-hour sequence delays, and batch email dispatch outside the HTTP request/response cycle.
4. **Outbound Dispatch**:
   - Replace blocking `smtplib` with `aiosmtplib` or an enterprise email API provider (Resend / AWS SES).

---

## 24. Phase 1 Build Plan

Below is the structured, prioritized implementation roadmap for Phase 1 backend engineering:

### Milestone 1: Security Hardening & Authentication Unification (Day 1)
1. **Fix CORS Security Violation**:
   - Update `backend/app/main.py` to replace `allow_origins=["*"]` with an explicit domain whitelist loaded from environment variables (`ALLOWED_ORIGINS`).
2. **Secure Credentials & Rotate Secrets**:
   - Remove plaintext secrets from `.env`. Require `SECRET_KEY` and `SMTP_PASSWORD` via runtime environment variables with strict entropy validation.
3. **Lock Down Legacy Routes**:
   - Add authentication dependencies (`get_current_tenant`) to `/api/kill-switch/*`, `/api/compliance/*`, `/api/leads/*`, and `/api/outreach/*`.
4. **Implement Webhook Signature Verification**:
   - Add HMAC-SHA256 signature check to `POST /api/whatsapp/webhook` using `META_APP_SECRET`.

### Milestone 2: Async I/O & Network Optimization (Day 2)
1. **Migrate to Async SMTP (`aiosmtplib`)**:
   - Replace synchronous `smtplib.SMTP` in `backend/app/outreach/email_provider.py` with `aiosmtplib.send()`.
2. **Implement API Rate Limiting**:
   - Add slowapi / memory-backed rate limiting middleware to `/api/v1/auth/login`, `/api/v1/auth/signup`, and `/api/public/*`.

### Milestone 3: Database Migration & Schema Versioning (Day 3–4)
1. **Configure Managed PostgreSQL**:
   - Establish PostgreSQL database connection string via `asyncpg`.
2. **Initialize Alembic**:
   - Generate initial baseline migration reflecting authoritative V5 tables (`models/v5.py` and `models/lead_engine.py`).
3. **Implement Vector Search (pgvector)**:
   - Add pgvector extension support and integrate OpenAI `text-embedding-3-small` embedding generator for `v5_knowledge_chunks`.

### Milestone 4: SaaS Portal Frontend-to-Backend Wiring (Day 5)
1. **Connect Knowledge Base**:
   - Wire `AppKnowledgeBase.jsx` to `/api/v1/knowledge/documents` for real document ingestion and chunk browsing.
2. **Connect Integrations Hub**:
   - Wire `AppIntegrations.jsx` to `/api/v1/integrations` to display live connection states and save credentials.
3. **Connect System Builder & Onboarding**:
   - Wire `AppSystemBuilder.jsx` and `OnboardingWizard.jsx` to persist businesses and AI employees in database.

---

## PHASE 0 COMPLETE

Files inspected: 113 frontend, 58 backend, 17 test/eval files
Build status: SUCCESS (Vite 6.2.0 in 10.28s)
Typecheck status: N/A (Pure JS/JSX, Python syntax verified)
Lint status: N/A (No linter configured)
Tests status: 61/61 PASSED (100% in 181.27s)
P0 issues: 2
P1 issues: 3
P2 issues: 4
P3 issues: 5
Major missing systems: PostgreSQL/pgvector migration, real Stripe/Google/HubSpot OAuth, persistent worker queue, SaaS portal frontend-to-backend wiring.