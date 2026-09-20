# Rine Forge Systems — Final Canonical Architecture

**Document Version:** 1.0.0  
**Release Target:** Rine Forge V5 Production  
**Date:** September 19, 2026  
**Auditor:** AI Systems Architecture Panel & Gemini Principal Reviewer  

---

## 1. Architectural Blueprint: The 15 Canonical Core Systems

Rine Forge Systems consolidates all business AI operations into **15 authoritative subsystems**. Competing, fragmented, or legacy duplicates have been strictly eliminated or merged:

```text
                                 ┌─────────────────────────────────┐
                                 │         USER INTERFACE          │
                                 │     ("Tell Forge Omni-Bar")     │
                                 └────────────────┬────────────────┘
                                                  │
                                                  ▼
                                 ┌─────────────────────────────────┐
                                 │       1. FORGE API GATEWAY      │
                                 │   (FastAPI, Async, CORS, Auth)  │
                                 └────────────────┬────────────────┘
                                                  │
                                                  ▼
                                 ┌─────────────────────────────────┐
                                 │  2. FORGE INTELLIGENCE FABRIC   │
                                 │ (Classifier, Intent, Complexity)│
                                 └────────────────┬────────────────┘
                                                  │
                                                  ▼
                                 ┌─────────────────────────────────┐
                                 │     3. FORGE MODEL ROUTER       │
                                 │(Hardware Tiers, Latency Budgets)│
                                 └────────────────┬────────────────┘
                                                  │
                     ┌────────────────────────────┼────────────────────────────┐
                     ▼                            ▼                            ▼
      ┌─────────────────────────────┐ ┌───────────────────────┐ ┌─────────────────────────────┐
      │  4. FORGE AGENT REGISTRY    │ │ 5. FORGE TOOL REGISTRY│ │   6. FORGE KNOWLEDGE RAG    │
      │    (21 Specialized Agents)  │ │ (18 Governed Tools)   │ │  (Hybrid Vector Search)     │
      └──────────────┬──────────────┘ └───────────┬───────────┘ └──────────────┬──────────────┘
                     │                            │                            │
                     └────────────────────────────┼────────────────────────────┘
                                                  │
                                                  ▼
                                 ┌─────────────────────────────────┐
                                 │   7. FORGE VERIFICATION ENGINE  │
                                 │ (9 AST, Syntax & Math Checks)   │
                                 └────────────────┬────────────────┘
                                                  │
                                                  ▼
                                 ┌─────────────────────────────────┐
                                 │ 8. FORGE APPROVAL SYSTEM (GATE) │
                                 │(Human Confirmation for Actions) │
                                 └────────────────┬────────────────┘
                                                  │
                                                  ▼
                                 ┌─────────────────────────────────┐
                                 │   9. FORGE ARTIFACT SYSTEM      │
                                 │  (16 Usable Deliverable Types)  │
                                 └────────────────┬────────────────┘
                                                  │
                     ┌────────────────────────────┼────────────────────────────┐
                     ▼                            ▼                            ▼
      ┌─────────────────────────────┐ ┌───────────────────────┐ ┌─────────────────────────────┐
      │   10. FORGE MEMORY SYSTEM   │ │ 11. FORGE CRM & LEADS │ │  12. FORGE EVENT BUS        │
      │   (Epistemic Provenance)    │ │ (Relational Tenant DB)│ │  (Async Activity Queue)     │
      └─────────────────────────────┘ └───────────────────────┘ └─────────────────────────────┘
                     │                            │                            │
                     ┌────────────────────────────┼────────────────────────────┘
                     ▼                            ▼
      ┌─────────────────────────────┐ ┌───────────────────────┐
      │ 13. FORGE AUTOMATION ENGINE │ │ 14. RESOURCE GOVERNOR │
      │  (Event-Driven Workflows)   │ │ (RAM & Concurrency)   │
      └─────────────────────────────┘ └───────────────────────┘
                                                  │
                                                  ▼
                                     ┌─────────────────────────┐
                                     │ 15. FORGE PROJECT SYSTEM│
                                     │(Stateful Workspace Hub) │
                                     └─────────────────────────┘
```

---

## 2. Deep Dive into the 15 Canonical Subsystems

### 1. Forge API Gateway (`backend/app/main.py`)
Single entry point with ASGI asynchronous request dispatching. Enforces origin-restricted CORS, CSP security headers, `X-Request-ID` tracing, rate limiting, and multi-tenant database session injection.

### 2. Forge Intelligence Fabric (`backend/app/ai/fabric/orchestrator.py`)
Central cognitive coordinator. Executes the 13-stage pipeline: Task Classification (25 categories) -> Intent Extraction -> Complexity Assessment -> Planning -> Agent Resolution -> Tool Permission Enforcement -> Context Assembly -> Multi-Model Loop -> Verification -> Self-Repair -> Deliverable Persistence.

### 3. Forge Model Router (`backend/app/workbench/model_hub.py`)
Dynamic hardware-aware model selection engine. Interacts with the host hardware profiler to map tasks to parameter sizes matching host capabilities:
- Tier 1 (Low-Resource <8GB RAM): 1B–3B local models (`phi3:mini`, `qwen2:1.5b`).
- Tier 2 (Consumer 8–16GB RAM): 7B–8B local models (`llama3:8b`, `mistral:7b`).
- Tier 3 (Workstation 16–32GB RAM): 8B–14B local models (`llama3.1:8b`, `qwen2.5:14b`).
- Tier 4 (Server >32GB RAM): 32B–70B local models.

### 4. Forge Agent Registry (`backend/app/ai/fabric/agent_registry.py`)
Defines 21 domain-specialized agents with strict capability boundaries, allowed models, input schemas, and risk tiers. Agents include WebsiteBuilder, WebsiteAuditor, FinancialModel, BrandGenerator, VoiceResponse, CustomerResponse, and AiEmployeeGenerator.

### 5. Forge Tool Registry (`backend/app/ai/fabric/tool_registry.py`)
Authoritative collection of 18 sandboxed tools. High-risk side-effect tools (`sendWhatsApp`, `sendEmail`, `updateCRM`, `publishWebsite`, `chargeCard`) are strictly forbidden from autonomous execution without human operator signature.

### 6. Forge Knowledge System (`backend/app/ai/fabric/context_builder.py` & `knowledge/`)
Multi-tenant document ingestion, chunking, and hybrid search. Separates authoritative business facts from AI inferential allowances, preventing customer-facing hallucinations.

### 7. Forge Verification Engine (`backend/app/ai/fabric/verifier.py`)
Enforces 9 automated quality gates including HTML AST parsing, mandatory viewport tags, SVG syntax parsing, and pure deterministic arithmetic verification (Revenue − COGS == Gross Profit). Includes an automated self-repair loop that diagnoses and repairs defects up to 2 times.

### 8. Forge Approval System (`backend/app/ai/fabric/approval_gate.py`)
Human-in-the-loop safety interceptor. Holds consequential external mutations in an immutable queue with full transparency (target recipient, payload, impact rationale) awaiting operator approval.

### 9. Forge Artifact System (`backend/app/ai/fabric/artifact_engine.py`)
Produces 16 exportable business deliverable types (CODE, DOCUMENT, SPREADSHEET, IMAGE, REPORT, PRESENTATION, etc.) with workspace tenant isolation, versioning, and dual-key normalization (`type` and `artifact_type`).

### 10. Forge Memory System (`backend/app/ai/fabric/project_memory.py`)
Epistemological memory repository. Enforces provenance tagging (`USER_PROVIDED`, `VERIFIED`, `AI_GENERATED`, `AI_INFERRED`, `APPROVED`) and provides operator controls to view, edit, or delete stored facts.

### 11. Forge CRM & Lead System (`backend/app/crm/` & `backend/app/lead_engine/`)
Persistent multi-tenant customer and lead records. Manages contacts, companies, opportunities, activities, and interaction notes with strict organization isolation. Includes compliant B2B ICP scoring and lead factor evaluation.

### 12. Forge Event System (`backend/app/ai/fabric/event_bus.py`)
Lightweight internal publish-subscribe bus decoupling long-running agent tasks from HTTP request timeouts. Emits audit events (`TASK_STARTED`, `ARTIFACT_CREATED`, `APPROVAL_REQUIRED`, `TASK_COMPLETED`).

### 13. Forge Automation Engine (`backend/app/automations/`)
Event-driven workflow execution engine. Evaluates triggers, conditions, AI steps, tools, and actions with backoff retries and loop prevention.

### 14. Forge Resource Governor (`backend/app/ai/fabric/resource_governor.py`)
Native host RAM and concurrency monitor. Uses native Windows/Linux kernel calls to probe physical RAM, throttling generation if available system RAM falls below 1.5GB to avoid OS freezing.

### 15. Forge Project System (`backend/app/workbench/execution_service.py`)
Stateful workspace management coordinating multi-task projects, artifact collections, task dependency graphs, and historical execution records.
