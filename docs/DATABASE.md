# Rine Forge Systems V5 — Database Architecture & Data Access Layer

> **Document Version**: 5.1 (Phase 1 Baseline)  
> **Last Updated**: September 17, 2026  
> **Status**: Authoritative Database Specification

---

## 1. Relational Architecture & Multi-Tenancy

Rine Forge Systems V5 uses a strictly partitioned multi-tenant relational schema. Every operational record is bound to an `Organization` (represented in the data layer by `V5Business`) and a `Workspace` (`V5Workspace`).

### The 4-Tier Tenancy Hierarchy:
```
┌────────────────────────────────────────────────────────┐
│                   v5_users (User)                      │
│             id, email, password_hash, role             │
└──────────────────────────┬─────────────────────────────┘
                           │ 1:N
                           ▼
┌────────────────────────────────────────────────────────┐
│              v5_business_users (Membership)            │
│         user_id, business_id, role, permissions        │
└──────────────────────────┬─────────────────────────────┘
                           │ N:1
                           ▼
┌────────────────────────────────────────────────────────┐
│               v5_businesses (Organization)             │
│        id, owner_id, name, industry, business_hours    │
└──────────────────────────┬─────────────────────────────┘
                           │ 1:N
                           ▼
┌────────────────────────────────────────────────────────┐
│                 v5_workspaces (Workspace)              │
│               id, business_id, name, slug              │
└──────────────────────────┬─────────────────────────────┘
                           │ 1:N
                           ▼
┌────────────────────────────────────────────────────────┐
│                 Tenant Domain Resources                │
│   Services, Staff, Appointments, Prospects, RAG Docs   │
└────────────────────────────────────────────────────────┘
```

---

## 2. Database Engines & Connection Lifecycle

* **Local Development & Testing**: SQLite using `aiosqlite` async driver (`sqlite+aiosqlite:///./outreach_ai.db`).
* **Production Deployment**: PostgreSQL using `asyncpg` driver (`postgresql+asyncpg://...`).
* **Session Lifecycle (`backend/app/database.py`)**:
  - `engine = create_async_engine(DATABASE_URL, echo=False, pool_pre_ping=True)`
  - `AsyncSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)`
  - FastAPI dependency `get_db()` yields an async session wrapped in context managers with automated rollback on unhandled exceptions.

---

## 3. Data Access Layer (Repository Pattern)

To avoid scattering raw SQLAlchemy queries across API routers, Phase 1 establishes an async repository layer:

### 1. `BaseRepository[T]` (`backend/app/db/repository.py`)
Provides generic async CRUD operations with standardized error handling:
* `get_by_id(session, id)`: Fetches single record by primary key.
* `list_all(session, limit, offset, **filters)`: Lists filtered records.
* `create(session, **attributes)`: Inserts and flushes a new model instance.
* `update(session, id, **attributes)`: Updates attributes on existing record.
* `delete(session, id)`: Removes record.
* **Exception Translation**: Catches raw `SQLAlchemyError` and raises human-friendly `DatabaseError`.

### 2. Domain Repositories (`backend/app/repositories/`)
* **`user_repository` (`user_repo.py`)**: Specialized methods for email lookup and user creation.
* **`organization_repository` (`organization_repo.py`)**: Manages tenant profiles, memberships, and cross-tenant access checks.
* **`workspace_repository` (`workspace_repo.py`)**: Manages workspace boundaries, default workspace retrieval, and scoped queries.

---

## 4. Database Seeder (`backend/app/database_seed.py`)

The platform contains an idempotent seeder that initializes:
1. **Demo Clinic Tenant**: Rine Dental & Facial Aesthetics (`00000000-0000-0000-0000-000000000001`), with its default workspace, staff, services, and Elena AI Receptionist.
2. **Internal Sales Tenant**: Rine Forge Systems Sales Engine (`00000000-0000-0000-0000-000000000002`), with its default workspace and benchmark Austin prospects.
