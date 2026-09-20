# Rine Forge Systems — Built-in Local AI Core

## 1. Executive Summary

Rine Forge Systems features a fully built-in, local-first artificial intelligence runtime powered by **Ollama and open local models** (including Llama 3, Mistral, Phi-3, Qwen 2.5, DeepSeek-Coder, and LLaVA). Cloud AI providers (OpenAI, Anthropic, Gemini, Replicate) are strictly optional secondary adapters. 

Rine Forge provides complete operational autonomy: a business can run autonomous receptionists, business analysts, website builders, financial modelers, and automation engines completely offline and free of per-token API charges.

---

## 2. Core Architecture

Raw Ollama or provider calls are strictly prohibited across business domain code. All interactions flow through the centralized **Rine AI Gateway**:

```text
               +----------------------------------+
               |        RINE FORGE CLIENT         |
               | (Chat / Voice / Workbench / API) |
               +-----------------+----------------+
                                 |
                                 v
               +----------------------------------+
               |         RINE AI GATEWAY          |
               |  - Policy & Permission Guard     |
               |  - Intent & Capability Detection |
               |  - 3-Tier Memory Manager         |
               +-----------------+----------------+
                                 |
                                 v
               +----------------------------------+
               |          MODEL ROUTER            |
               |  - Capability Matching           |
               |  - Local Hardware Constraints    |
               |  - Fallback & Model Guidance     |
               +-----------------+----------------+
                                 |
                                 v
               +----------------------------------+
               |          OLLAMA ENGINE           |
               |    http://localhost:11434        |
               +-----------------+----------------+
                                 |
        +------------------------+------------------------+
        |                        |                        |
        v                        v                        v
+---------------+        +---------------+        +---------------+
|    LLAMA 3    |        |   PHI-3/QWEN  |        | DEEPSEEK-CODER|
| (Reason/Plan) |        |  (Chat/Fast)  |        | (Coding/Code) |
+-------+-------+        +-------+-------+        +-------+-------+
        |                        |                        |
        +------------------------+------------------------+
                                 |
                                 v
               +----------------------------------+
               |     17-TOOL REGISTRY & AGENTS    |
               |  - Knowledge Base (RAG)          |
               |  - Lead Engine / CRM             |
               |  - Calendar / Appointments       |
               |  - Multi-page Website Generator  |
               |  - Deterministic Financial Math  |
               |  - Vector SVG Logo Designer      |
               +----------------------------------+
```

---

## 3. Local-First & Zero-Leakage Policy

1. **`LOCAL_ONLY` Default**: By default, workspaces operate in local-only mode. If a requested capability cannot be satisfied locally, the system yields `MODEL_REQUIRED` with precise installation commands (e.g. `ollama pull llama3:8b`) rather than silently leaking business data or customer queries to external cloud APIs.
2. **Model Registry (`V5RegisteredModel`)**: Models are managed in SQLite/PostgreSQL with attributes including `is_installed`, `context_window`, `vram_mb`, `capabilities`, `is_active`, and `is_default`.
3. **Hardware-Aware Dispatch**: The router checks host memory (via OS APIs) to prevent loading models exceeding available hardware limits.

---

## 4. Key Subsystems

### A. Capability-Based Routing
Workloads are assigned to models optimized for the specific task:
- **`CHAT`**: `phi3:mini`, `qwen2:1.5b`, `llama3:8b` (low latency)
- **`REASONING`**: `llama3.1:8b`, `qwen2.5:14b`, `llama3:8b` (deep logic)
- **`CODING`**: `deepseek-coder:6.7b`, `qwen2.5-coder:7b`, `llama3:8b` (precise syntax)
- **`VISION`**: `llava:7b` (image and layout analysis)
- **`LONG_CONTEXT`**: `llama3.1:8b` (128k token context window)

### B. Three-Layer Memory Manager
- **Session Memory**: In-memory ephemeral buffer for immediate turn-by-turn conversational flow.
- **Conversation Memory**: Database-backed message history (`V5Message`) persisted with token budgeting.
- **Business Memory**: Tenant-isolated knowledge store (`business_context`) containing core company metadata, business hours, services, and policies.

### C. Local Voice Engine
- **Speech-to-Text (`LocalSpeechToTextProvider`)**: Fully local audio transcription supporting raw PCM, WAV, and Base64 payloads with automatic language tagging.
- **Text-to-Speech (`LocalTextToSpeechProvider`)**: Local speech synthesis supporting 5 distinct business profiles:
  1. `professional`: Clear, measured cadence for corporate interactions.
  2. `friendly`: Warm, engaging tone for retail and hospitality.
  3. `warm`: Reassuring and empathetic for healthcare and client services.
  4. `energetic`: Dynamic, upbeat pacing for fitness and real estate.
  5. `calm`: Soothing, deliberate pitch for wellness and legal advisory.

### D. Deterministic Financial Modeling
- Calculations for break-even, net margin, and unit economics are strictly handled by deterministic Python mathematics (`backend/app/workbench/agents/financial_model.py`). Models are prohibited from hallucinating financial figures.

---

## 5. Security & Isolation

- **Transaction Audit Logging**: Every tool execution is recorded in `AuditLog` with workspace ID, user ID, tool name, input arguments, and execution status.
- **Role-Based Execution**: Tools declare mandatory permission scopes (e.g., `MANAGE_LEADS`, `MANAGE_BOOKINGS`, `ADMIN`). Calls lacking sufficient permissions are rejected prior to invocation.
