# Rine Forge Systems V5 — Phase AS: Production Local AI Engine

## 1. Executive Overview

Phase AS turns the local AI foundation of Rine Forge Systems into an active, robust, production-grade local AI engine using **Ollama**, real hardware telemetry, safe model installation tiers, 19 specialized task types, and zero reliance on commercial cloud APIs.

```text
Rine Forge Frontend UI / Workbench
              │
              ▼
   Rine AI Gateway (Unified Interface)
              │
              ▼
   Model Router (19 Task Types + Local Policy)
              │
              ▼
   Ollama Adapter (Local Inference Engine)
              │
              ▼
   Local Open Models (Phi-3, Qwen, DeepSeek, Llama 3)
              │
              ▼
   Business Tools, Knowledge Base & Sandboxed Execution
```

---

## 2. Core Architectural Pillars

### 2.1 Truthful Hardware Detection & Profiling
The system does not guess or hardcode hardware specifications. Through `backend/app/workbench/hardware_profiler.py`, it samples:
- **CPU:** Physical and logical core count (e.g. 8 cores) and frequency.
- **RAM:** Total physical capacity, available capacity, and percentage used.
- **GPU:** Device vendor, GPU model, and dedicated VRAM via WMI/DirectX on Windows or NVML on Linux.
- **Storage:** Disk capacity and free space on the host volume.
- **Ollama Host Daemon:** Binary presence via PATH resolution (`shutil.which("ollama")`) and live HTTP health check (`GET http://localhost:11434/api/version`).

### 2.2 Four-Tier Safe Model Installation Matrix
To prevent Out-Of-Memory (OOM) crashes, system freezes, or kernel thrashing, Rine Forge categorizes hosts into 4 hardware tiers:
- **Tier 1 (Low-Resource / Ultralight):** `< 8 GB RAM`. Recommended models: `phi3:mini` (3.8B, ~4GB RAM), `qwen2:1.5b` (1.5B, ~2GB RAM).
- **Tier 2 (Consumer / Balanced):** `8 - 16 GB RAM`. Recommended models: `llama3:8b` (8B, ~8GB RAM), `mistral:7b` (7B, ~7GB RAM), `qwen2.5-coder:7b` (7B, ~8GB RAM).
- **Tier 3 (Workstation / Heavy Reasoning):** `16 - 32 GB RAM`. Recommended models: `deepseek-coder:6.7b`, `command-r:35b` (quantized).
- **Tier 4 (Server / Enterprise):** `> 32 GB RAM`. Recommended models: `llama3:70b` (70B, ~48GB RAM), `deepseek-v2:236b`.

**Safety Lock:**
Any attempt to install an oversized model (e.g. a 48 GB model on an 8 GB host) is strictly blocked by `ModelDiscoveryService.install_model_safe()` with status `BLOCKED` and a detailed warning, unless the operator explicitly passes `confirm_risk=True`.

### 2.3 19 Authoritative Task Types
`backend/app/ai/gateway/router.py` maps business requests across 19 canonical task types to appropriate models and resource constraints:
1. `chat`
2. `business_qa`
3. `customer_response`
4. `voice_turn`
5. `website_build`
6. `website_audit`
7. `brand_generation`
8. `business_plan`
9. `financial_model`
10. `knowledge_qa`
11. `code_generation`
12. `lead_qualification`
13. `workflow_automation`
14. `sentiment_analysis`
15. `document_summarization`
16. `marketing_copy`
17. `schema_design`
18. `sandbox_evaluation`
19. `project_breakdown`

### 2.4 Strictly Local & Privacy-Preserving
Under the default `LOCAL_ONLY` and `LOCAL_FIRST` policies:
- No customer data, conversation history, or business knowledge ever egresses to external cloud APIs.
- Telemetry logs record only structured performance metrics (`requestId`, `model`, `durationMs`, `success`, `errorCategory`). Raw prompts and outputs are completely omitted from logs.

### 2.5 Deterministic Financial Calculations & Anti-Hallucination
- **Financial Projections:** 100% computed via deterministic math (`Conservative`, `Base`, `Optimistic` scenarios and 12-month linear ramp). The LLM is restricted to narrative formatting.
- **Customer Response Guard:** The AI receptionist refuses to hallucinate pricing, guarantees, or medical outcomes if the business profile lacks documented fee schedules.
- **Website Auditor:** Strictly separates verified technical facts (SSL, viewport, CTA) from deductive inferences and recommendations.
