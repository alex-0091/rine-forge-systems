# Rine Forge Systems V5 — Architecture & System Design

> **Document Version**: 5.1 (Phase 1 Baseline)  
> **Last Updated**: September 17, 2026  
> **Status**: Authoritative Production Architecture Specification

---

## 1. Executive Architectural Overview

Rine Forge Systems is an enterprise-grade autonomous client acquisition operating system and AI employee platform. The platform is engineered around strict defense-in-depth principles, multi-tenant isolation, structured execution pipelines, and deterministic anti-hallucination guardrails.

### The Canonical Request Pipeline:
```
Client (Web Browser / API Consumer / Webhook)
  │
  ▼
[Request ID & Telemetry Middleware]
  ├── Assigns or validates RF-XXXXXX request identifier
  ├── Measures execution duration in milliseconds
  └── Logs structured metadata with sensitive fields redacted
  │
  ▼
[Security Headers Middleware]
  ├── X-Content-Type-Options: nosniff
  ├── X-Frame-Options: DENY
  ├── Referrer-Policy: strict-origin-when-cross-origin
  └── Permissions-Policy: camera=(), microphone=(), geolocation=()
  │
  ▼
[CORS Security Layer]
  └── Enforces explicit origin whitelist (Disables wildcard '*' with credentials)
  │
  ▼
[Rate Limiting Layer]
  └── Sliding-window rate limiting on auth, public APIs, and webhooks
  │
  ▼
[Authentication Layer]
  └── Validates Bearer JWT, extracts sub (user_id), confirms active user in DB
  │
  ▼
[Authorization & Multi-Tenant Scoping]
  ├── require_user()
  ├── require_organization_access() -> strictly binds tenant to user membership
  ├── require_workspace_access() -> scopes data boundary within organization
  └── require_role() / require_organization_role() -> OWNER, ADMIN, MEMBER
  │
  ▼
[Validation Layer]
  └── Strict Pydantic v2 schemas reject malformed inputs before business logic
  │
  ▼
[Service Layer]
  └── Encapsulates core business rules, pipeline coordinators, and AI agents
  │
  ▼
[Repository Layer]
  └── Abstract async CRUD isolating SQLAlchemy queries from HTTP handlers
  │
  ▼
[Database / AI Providers / External Channels]
  └── PostgreSQL (asyncpg) / SQLite (aiosqlite) | OpenAI / Gemini | Meta WhatsApp / SMTP
  │
  ▼
[Standard Error & Response Envelopes]
  └── Returns predictable payloads with traceable RF-XXXXXX reference codes
```

---

## 2. Directory Structure

```text
c:\Users\Shani Khan\Desktop\Outreach AI\
├── .env                              # Local runtime environment configuration
├── .env.example                      # 3-tier configuration template (Zero secrets)
├── package.json                      # Root npm orchestrator
├── pytest.ini                        # Pytest configuration
├── requirements.txt                  # Python dependencies
├── vercel.json                       # Serverless routing manifest
│
├── api/
│   └── index.py                      # Vercel serverless ASGI entrypoint bridge
│
├── backend/
│   ├── app/
│   │   ├── config.py                 # Pydantic BaseSettings & startup validation
│   │   ├── database.py               # Async SQLAlchemy engine & sessionmaker
│   │   ├── database_seed.py          # Idempotent multi-tenant database seeder
│   │   ├── kill_switch.py            # Global emergency pause state machine
│   │   ├── main.py                   # FastAPI master application & router aggregator
│   │   │
│   │   ├── ai/                       # LLM Orchestration & Firewalls
│   │   │   ├── cost_tracker.py       # Token counting & billing telemetry
│   │   │   ├── hallucination_firewall.py # Factuality verification before outreach
│   │   │   ├── llm_provider.py       # Provider abstraction (OpenAI, Gemini, Mock)
│   │   │   ├── openai_provider.py    # OpenAI SDK client
│   │   │   ├── orchestrator_v5.py    # 20-step AI employee execution engine
│   │   │   ├── prompts.py            # System prompts & generation templates
│   │   │   └── tool_registry.py      # AI tool definitions & executor
│   │   │
│   │   ├── api/                      # Legacy V4 Routers (Protected)
│   │   │   ├── campaigns.py          # Campaign management
│   │   │   ├── compliance.py         # Suppression blacklist & audit logs
│   │   │   ├── dashboard.py          # Operator KPI metrics
│   │   │   ├── inbox.py              # Inbound thread viewer
│   │   │   ├── kill_switch.py        # Emergency pause toggle
│   │   │   ├── leads.py              # Lead explorer
│   │   │   ├── outreach.py           # Message queue
│   │   │   ├── public.py             # Public portfolio & interactive demos
│   │   │   └── receptionist.py       # Elena receptionist demo chat
│   │   │
│   │   ├── api/v1/                   # Production V5 Multi-Tenant Routers
│   │   │   ├── admin.py              # Super-admin platform telemetry
│   │   │   ├── ai_employees.py       # Persona configuration & chat
│   │   │   ├── appointments.py       # Conflict-free booking engine
│   │   │   ├── auth.py               # Signup, login, profile, logout
│   │   │   ├── automations.py        # Workflow trigger/action rules
│   │   │   ├── businesses.py         # Tenant configuration
│   │   │   ├── conversations.py      # Omnichannel conversation threads
│   │   │   ├── customers.py          # CRM customer dossiers
│   │   │   ├── integrations.py       # External credentials storage
│   │   │   ├── knowledge.py          # RAG document management
│   │   │   ├── lead_engine.py        # Modules 41-56 Lead Discovery Engine
│   │   │   ├── services.py           # Billable service catalog
│   │   │   └── staff.py              # Staff working hours & calendars
│   │   │
│   │   ├── auth/                     # Authentication & Authorization Layer
│   │   │   ├── dependencies.py       # require_user, require_org, require_workspace, require_role
│   │   │   ├── security.py           # Passlib bcrypt hashing & JWT token handling
│   │   │   └── service.py            # User registration & credential authentication
│   │   │
│   │   ├── channels/                 # Multi-Channel Ingestion Gateways
│   │   │   └── whatsapp/             # Meta WhatsApp Cloud API webhook & service
│   │   │
│   │   ├── db/                       # Database Abstraction
│   │   │   └── repository.py         # Generic BaseRepository[T]
│   │   │
│   │   ├── errors/                   # Standard Application Error System
│   │   │   ├── exceptions.py         # AppException and domain error subclasses
│   │   │   └── handlers.py           # Global exception handlers with RF-XXXXXX codes
│   │   │
│   │   ├── logging/                  # Structured Logging & Telemetry
│   │   │   ├── context.py            # ContextVar request ID tracking
│   │   │   └── structured.py         # RequestLoggingMiddleware with sensitive field redaction
│   │   │
│   │   ├── models/                   # SQLAlchemy Authoritative Data Models
│   │   │   ├── v5.py                 # Multi-tenant models & User/Org/Workspace
│   │   │   └── lead_engine.py        # Prospect, observation & discovery models
│   │   │
│   │   ├── ratelimit/                # Rate Limiting Subsystem
│   │   │   └── limiter.py            # InMemoryRateLimiter & pluggable Redis backend
│   │   │
│   │   ├── repositories/             # Domain Repositories
│   │   │   ├── organization_repo.py  # Tenant data access & membership checks
│   │   │   ├── user_repo.py          # User lookups & registration
│   │   │   └── workspace_repo.py     # Workspace boundary queries
│   │   │
│   │   └── security/                 # Network & Perimeter Security
│   │       ├── cors.py               # Whitelist CORS configuration
│   │       └── headers.py            # SecurityHeadersMiddleware
│   │
│   └── eval/                         # Benchmark Evaluations & Prompts
│
├── docs/                             # Authoritative Documentation
│   ├── ARCHITECTURE.md
│   ├── AUTHENTICATION.md
│   ├── SECURITY.md
│   ├── DATABASE.md
│   ├── API.md
│   ├── RINE_PHASE_0_AUDIT.md
│   └── RINE_PHASE_1_REPORT.md
│
├── frontend/                         # React 19 Client SPA
│   ├── src/
│   │   ├── App.jsx                   # Operator console root
│   │   ├── components/app/           # SaaS platform management views
│   │   ├── components/forge/         # Public website & interactive showcases
│   │   └── data/                     # Systems catalog & static showcase metadata
│   ├── package.json
│   └── vite.config.js
│
└── tests/                            # Automated Pytest Suite
    ├── conftest.py                   # Async database fixtures
    ├── test_phase1_foundation.py     # Foundation test suite (11 test cases)
    ├── test_lead_engine_e2e.py       # Lead Engine E2E tests
    └── v5/test_v5_platform.py        # Multi-tenant platform tests
```

---

## 3. Multi-Tenant Ownership Model

Rine Forge enforces a strict 4-tier hierarchy:
```
User (v5_users)
  │
  ▼ [v5_business_users] (Membership: Role = OWNER, ADMIN, MEMBER)
Organization (v5_businesses)
  │
  ▼ [v5_workspaces]
Workspace (v5_workspaces: "Default Workspace", etc.)
  │
  ▼
Business Resources (Services, Staff, AI Employees, Appointments, Prospects, RAG Docs)
```

1. **User Identity**: Extracted strictly from the signed, cryptographic JWT. Client-supplied `user_id` headers are ignored.
2. **Organization Boundary**: Validated by confirming active membership between `user_id` and `business_id`. Cross-tenant requests return `403 Forbidden`.
3. **Workspace Boundary**: Every resource belongs to a specific workspace within an organization. A workspace cannot be accessed by users outside the parent organization.
