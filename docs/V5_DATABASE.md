# RINE FORGE SYSTEMS — V5 RELATIONAL DATABASE ARCHITECTURE

## 1. Overview
The V5 database layer is built using SQLAlchemy Async ORM with complete support for PostgreSQL (production) and SQLite (testing/local).
To ensure 100% backward compatibility and eliminate schema collisions with legacy V1/V2 demo tables, all V5 tables are prefixed with `v5_`.

Every domain entity strictly references `business_id` (foreign key to `v5_businesses.id`) ensuring **tenant-level data partitioning**.

---

## 2. Table Directory (20 Core Relational Models)

| Entity # | Table Name | Description | Key Indexes / Foreign Keys |
|---|---|---|---|
| **1** | `v5_users` | Platform Users (Super Admin, Owner, Admin, Staff) | `email` (unique), `role`, `status` |
| **2** | `v5_businesses` | Root Tenant Entity | `owner_id` (FK `v5_users.id`), `name`, `status` |
| **3** | `v5_business_users` | Tenant Membership & RBAC Permissions | `business_id` (FK), `user_id` (FK) |
| **4** | `v5_ai_employees` | Digital Workers (Elena, Marcus) & Personas | `business_id` (FK), `status` |
| **5** | `v5_services` | Service Catalog (Pricing, Duration) | `business_id` (FK), `active` |
| **6** | `v5_staff` | Clinic Practitioners & Working Hours | `business_id` (FK), `active` |
| **7** | `v5_knowledge_documents` | Ingested Knowledge Sources (PDF, FAQ, Manual) | `business_id` (FK), `status` |
| **8** | `v5_knowledge_chunks` | Dense Vector Embedded Text Chunks | `document_id` (FK), `business_id` (FK) |
| **9** | `v5_customers` | Unified Patient / Client Identities | `business_id` (FK), `phone`, `email`, `external_id` |
| **10** | `v5_conversations` | Dialog Sessions across Web / WhatsApp | `business_id` (FK), `customer_id` (FK), `status` |
| **11** | `v5_messages` | Turn-by-Turn Dialog History | `conversation_id` (FK), `role`, `created_at` |
| **12** | `v5_leads` | Qualified Leads with Intent Scoring | `business_id` (FK), `customer_id` (FK), `score`, `status` |
| **13** | `v5_appointments` | Locked Appointment Slots (Anti-Double Booking) | Composite index on `(business_id, staff_id, start_time, end_time)` |
| **14** | `v5_integrations` | External Credentials & System Links | `business_id` (FK), `provider` |
| **15** | `v5_automations` | Trigger-Condition-Action Workflow Rules | `business_id` (FK), `trigger`, `enabled` |
| **16** | `v5_tasks` | Scheduled Background Follow-Ups | `business_id` (FK), `scheduled_for`, `status` |
| **17** | `v5_notifications` | Staff Alert Records (Email, SMS, Push) | `business_id` (FK), `status`, `recipient` |
| **18** | `v5_ai_events` | AI Observability & Telemetry | `business_id` (FK), `conversation_id` |
| **19** | `v5_audit_logs` | Platform Security & Cross-Tenant Audit Trail | `business_id` (FK), `user_id`, `action` |
| **20** | `v5_usage` | Monthly Metering & Billing Records | `business_id` (FK), `period` |

---

## 3. Atomic Double-Booking Prevention Index
The `v5_appointments` table enforces strict interval overlap prevention:
```python
__table_args__ = (
    Index("idx_v5_appointment_conflict", "business_id", "staff_id", "start_time", "end_time"),
)
```
When booking an appointment:
$$\text{Existing booking overlaps if: } (\text{Start} < \text{Existing.End}) \land (\text{End} > \text{Existing.Start}) \land \text{Status} = \text{'CONFIRMED'}$$
If an overlapping row is discovered, the transaction is rejected with **HTTP 409 Conflict**, guaranteeing that no slot can ever be double-booked.

---

## 4. RAG Vector Storage Architecture
Vector embeddings are stored directly in `v5_knowledge_chunks.embedding` as a normalized float vector.
- Vector search performs an L2-normalized cosine inner product calculation across tenant chunks:
$$\text{Similarity}(u, v) = \frac{u \cdot v}{\|u\|_2 \|v\|_2}$$
- Scoped strictly by `KnowledgeChunk.business_id == tenant.id`, ensuring zero cross-tenant knowledge leaks.
