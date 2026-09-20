# Rine Forge Systems — Phase AS Pre-Implementation Audit

## 1. Executive Summary
This audit evaluates the codebase prior to implementing **Phase AS: Production Local AI Engine**. The objective is to turn the local AI architecture established in Phase AR into an active, robust, production-grade local AI engine with automatic hardware detection, real model discovery, safe model installation tiers, capability routing, health checks, and a unified Rine Forge AI interface—without breaking existing working systems or introducing fake statuses.

---

## 2. Existing AI Architecture

1. **AI Gateway (`backend/app/ai/gateway/`)**:
   - `core.py`: `AIGateway` manages request timeout, retries, fallbacks, and telemetry logging with correlation request IDs.
   - `interface.py`: Defines `BaseAIProvider`, `ChatMessage`, `AIOptions`, `AIResponse`, `AIStreamChunk`, `ProviderHealth`.
   - `router.py`: `ModelRouter` supports fast/quality/cheap/local tiers and Phase AR capability-based routing (`resolve_route_by_capability`).
   - `errors.py`: Exception hierarchy for timeout, authentication, rate limits, and provider unavailability.

2. **Orchestrator & Intelligence Fabric (`backend/app/workbench/intelligence_orchestrator.py`)**:
   - `ForgeIntelligenceOrchestrator`: 12-stage cognitive pipeline from classification to artifact delivery.

3. **Domain Agents (`backend/app/workbench/agents/`)**:
   - `website_builder.py`: Responsive multi-page Tailwind CSS generator with sandboxed iframe preview.
   - `website_auditor.py`: 8-dimension scorecard with verified facts and honest unmeasurable disclosures.
   - `brand_generator.py`: 4 parametric SVG logo concepts and semantic color palettes.
   - `financial_model.py`: Deterministic Python financial calculations (12-month projections, zero hallucination).
   - `business_plan.py`: 8-section strategic plan with labeled assumption boundaries.
   - `customer_response.py`: Targeted customer intent resolver with tool dispatch.
   - `project_manager.py`: 8 dependency-ordered execution stages.

4. **Voice Engine (`backend/app/channels/voice/engine.py`)**:
   - `LocalSpeechToTextProvider`: Audio transcription for PCM/WAV/Base64.
   - `LocalTextToSpeechProvider`: Local speech synthesis with 5 business voice profiles (`professional`, `friendly`, `warm`, `energetic`, `calm`).

---

## 3. Existing Ollama Integration

1. **`backend/app/ai/gateway/providers/ollama_provider.py`**:
   - Implements `BaseAIProvider` connecting to `http://localhost:11434` (configurable via `settings.OLLAMA_BASE_URL`).
   - Supports `generate()`, `generate_stream()` using `/api/chat`, and `health_check()` using `/api/tags`.
   - Lacks comprehensive model lifecycle management (e.g. `deleteModel`, `getModel`, `embeddings`, tool-calling abstractions, cancelation handles, and rate/timeout guardrails).

2. **`backend/app/workbench/hardware_profiler.py`**:
   - Contains `HardwareProfiler` with RAM detection (Windows ctypes, Linux `/proc/meminfo`, macOS `sysctl`), GPU detection (`nvidia-smi`, `torch.cuda`, Windows CimInstance), storage check, and 4 hardware capability tiers.
   - Contains `check_ollama_status()` and `trigger_pull_model()`.

---

## 4. Existing Provider Abstraction & Model Hub

1. **Provider Abstraction (`backend/app/ai/gateway/interface.py`)**:
   - Clean standard interface for providers: `generate`, `generate_stream`, `health_check`, `count_tokens`.
   - Implementations: `OpenAIProvider`, `GeminiProvider`, `OllamaProvider`, `MockProvider`.

2. **Model Hub (`backend/app/workbench/model_hub.py`)**:
   - Defines `ModelSelectionPolicy` (`FREE_FIRST`, `QUALITY_FIRST`, `SPEED_FIRST`, `LOCAL_ONLY`, `ENTERPRISE_SECURE`).
   - In-memory model catalog and task routing rules.

3. **Relational Model Registry (`backend/app/ai/model_registry.py`)**:
   - Database-backed model catalog querying `V5RegisteredModel`.
   - Auto-seeds default models (`llama3:8b`, `phi3:mini`, `qwen2.5:14b`, `deepseek-coder:6.7b`, `llava:7b`, `llama3.1:8b`).

---

## 5. Existing Database Models

- **`v5_registered_models` (`V5RegisteredModel`)**: `id`, `name`, `provider`, `capabilities` (JSON), `context_length`, `vision`, `tools`, `reasoning`, `coding`, `speed_class`, `memory_requirement`, `enabled`, `is_default`, `metadata_json`.
- **`v5_projects` (`V5Project`)**: Tracks business projects, natural language input, planner outputs, status (`PLANNING`, `IN_PROGRESS`, `COMPLETED`, `ARCHIVED`).
- **`v5_workbench_tasks` (`V5WorkbenchTask`)**: Discrete tasks executed by specialized agent pipelines.
- **`v5_workbench_artifacts` (`V5WorkbenchArtifact`)**: Persistent deliverables (`WEBSITE`, `LOGO`, `DOCUMENT`, `SPREADSHEET`, `REPORT`, `AI_AGENT`).
- **`audit_logs` (`AuditLog`)**: Transactional audit records with tool name, arguments, user, workspace, and timestamp.

---

## 6. Existing Relevant API Routes

- `backend/app/api/v1/ai.py`: `/ai/status`, `/ai/agents`, `/ai/chat`, `/ai/stream`.
- `backend/app/api/v1/admin.py`: `/admin/models`, `/admin/models/install`, `/admin/models/default`, `/admin/models/test`, `/admin/ai-health`.
- `backend/app/workbench/router.py`:
  - `/workbench/hardware`: Server hardware metrics and Ollama probe.
  - `/workbench/hardware/models/pull`: Model download trigger.
  - `/workbench/fabric/process`: 12-stage cognitive pipeline execution.
  - `/workbench/plan`: NL request decomposition.
  - `/workbench/projects`: Project and task lifecycle.
  - `/workbench/artifacts/{id}/confirm`: Consequential action confirmation gates.

---

## 7. Existing Frontend AI Components

- `frontend/src/components/workbench/WorkbenchView.jsx`: Universal command box, project workflow cards, artifact previews, server hardware specs, Ollama probe button, and model inventory.
- `frontend/src/components/workbench/ModelTransparencyBadge.jsx`: Truthful model identification and token/cost disclosures.
- `frontend/src/components/workbench/BrandAssetViewer.jsx`: SVG logo inspection and palette display.
- `frontend/src/components/workbench/FinancialModelViewer.jsx`: Deterministic projection tables and CSV export.
- `frontend/src/components/workbench/WebsiteAuditViewer.jsx`: Scorecard display.

---

## 8. Conflicts & Gaps to Address in Phase AS

1. **Ollama Connection Layer Incompleteness**:
   - `OllamaProvider` currently lacks `listModels()`, `getModel()`, `deleteModel()`, `embeddings()`, tool-capable request schemas, abort/cancellation tokens, structured logging without sensitive data, and request correlation IDs.
   - We will build a dedicated `OllamaAdapter` (`backend/app/ai/ollama_adapter.py`) implementing these methods.

2. **Model Discovery vs Installed Segregation**:
   - The system must explicitly distinguish between **Local Installed Models** (queried via `/api/tags`) and **Available Open Models** (queried from Ollama catalog or predefined registry).
   - We will create `ModelDiscoveryService` (`backend/app/ai/model_discovery.py`) to categorize models into `Installed`, `Available`, `Recommended`, `Incompatible`, `Installing`, `Failed`, `Ready`.

3. **Safe Model Installation Tiers**:
   - Section 5 mandate: Do NOT download huge models automatically.
   - Must evaluate hardware capabilities against 4 tiers (Tier 1: <8GB, Tier 2: 8-16GB, Tier 3: 16-32GB, Tier 4: >32GB) and recommend appropriate models with confirmation before installation.

4. **19 Task Types in Model Router**:
   - The Model Router must support the full catalog of 19 task types (`CHAT`, `CUSTOMER_RESPONSE`, `CUSTOMER_ANALYSIS`, `VOICE_RESPONSE`, `WEBSITE_BUILD`, `CODE_GENERATION`, `CODE_REVIEW`, `WEBSITE_AUDIT`, `BUSINESS_PLAN`, `MARKETING_PLAN`, `FINANCIAL_ANALYSIS`, `DOCUMENT_ANALYSIS`, `VISION_ANALYSIS`, `IMAGE_ANALYSIS`, `RAG`, `EMBEDDINGS`, `LEAD_QUALIFICATION`, `SALES_ASSISTANT`, `AI_EMPLOYEE_GENERATION`).
   - Must support coding models like `Qwen3-Coder`, `deepseek-coder`, `qwen2.5-coder` dynamically.

5. **Unified `RineAIGateway.run()` Interface**:
   - Provide `RineAIGateway.run({ task, input, context, tools, attachments, workspaceId, policy })` enforcing `LOCAL_ONLY` policy where no data leaves the host.

6. **Truthful Status System**:
   - Replace any unverified status badges with real states: `READY`, `DEGRADED`, `OFFLINE`, `CONFIGURATION_REQUIRED`, `INSTALLING`, `ERROR`.

---

## 9. File Modification Plan

### Files to Create:
1. `backend/app/ai/ollama_adapter.py`: Production-grade Ollama connection layer with full API suite.
2. `backend/app/ai/model_discovery.py`: Service separating installed from available models and calculating hardware tier compatibility.
3. `backend/app/ai/gateway/rine_gateway.py`: Unified `RineAIGateway` runtime with `.run()` interface.
4. `backend/app/channels/voice/voice_agent.py`: `VoiceResponseAgent` with the 8 discrete states.
5. `tests/test_phase_as_local_ai.py`: 20+ automated tests covering Phase AS requirements.

### Files to Modify:
1. `backend/app/workbench/hardware_profiler.py`: Add `get_normalized_capabilities()` matching the required schema and Ollama CLI/version detection.
2. `backend/app/ai/gateway/router.py`: Support all 19 task types, policy enforcement (`LOCAL_ONLY`, `LOCAL_FIRST`), and coding model adaptability.
3. `backend/app/ai/model_registry.py`: Enhance registry with rich metadata and discovery integration.
4. `backend/app/workbench/agents/customer_response.py`: Strict anti-hallucination rules and Gateway connection.
5. `backend/app/workbench/agents/website_auditor.py`: Explicit separation of FACT, INFERENCE, and RECOMMENDATION.
6. `frontend/src/components/workbench/WorkbenchView.jsx`: Unified status system and Model Management UI updates.

### Files That Should Remain Untouched:
- Existing core database schema (`v5.py`, `lead_engine.py`) to prevent breaking changes.
- Existing stable APIs (`auth.py`, `campaigns.py`, `inbox.py`).
- Existing deterministic mathematical formulas in `financial_model.py`.
- Working tests in `test_phase_ar_local_ai.py` and `test_phase_aq_workbench.py`.
