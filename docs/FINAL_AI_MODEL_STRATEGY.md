# Rine Forge Systems — Final AI Model Strategy

**Document Version:** 1.0.0  
**Release Target:** Rine Forge V5 Enterprise Production  
**Date:** September 19, 2026  
**Auditor:** AI Systems Architecture Panel & Gemini Principal Reviewer  

---

## 1. Core Philosophy: Free-First, Local-First, Zero-Lock-In

Rine Forge Systems was engineered to dismantle the myth that an enterprise AI operating system requires expensive monthly cloud API bills. Small businesses cannot tolerate unpredictable monthly token costs where customer chat spikes result in hundreds of dollars in API charges.

Rine Forge establishes **Ollama and local open-weights neural models** as its non-negotiable primary engine. Cloud models (OpenAI, Gemini, Anthropic) are treated as **strictly optional external adapters** that can be activated if the enterprise possesses existing enterprise keys, but are never required for core functionality.

---

## 2. Hardware-Aware 4-Tier Model Selection Architecture

The `HardwareProfiler` (`backend/app/workbench/hardware_profiler.py`) inspects physical host memory and GPU presence to automatically classify the host into one of four capability tiers:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        HOST HARDWARE TELEMETRY                         │
│       (Physical RAM via ctypes / proc / sysctl; GPU VRAM via SMI)      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      4-TIER HARDWARE CLASSIFIER                        │
└─────┬───────────────────┬───────────────────┬───────────────────┬──────┘
      │                   │                   │                   │
      ▼                   ▼                   ▼                   ▼
┌───────────┐       ┌───────────┐       ┌───────────┐       ┌───────────┐
│  TIER 1   │       │  TIER 2   │       │  TIER 3   │       │  TIER 4   │
│ Low-Res   │       │ Consumer  │       │Workstation│       │Enterprise │
│  (<8GB)   │       │ (8-16GB)  │       │ (16-32GB) │       │ (>32GB)   │
└─────┬─────┘       └─────┬─────┘       └─────┬─────┘       └─────┬─────┘
      │                   │                   │                   │
      ▼                   ▼                   ▼                   ▼
  1B - 3.8B            7B - 8B             8B - 14B            32B - 70B
  phi3:mini           llama3:8b          llama3.1:8b          llama3.3:70b
  qwen2:1.5b          mistral:7b         qwen2.5:14b          qwen2.5:32b
                                         deepseek-coder:6.7b
```

### Tier 1: Low-Resource Hosts (<8 GB RAM, CPU-Only)
- **Target Hardware:** Basic office PCs, low-end VPS, Intel i3/i5 with 4–8GB RAM.
- **Recommended Models:** `phi3:mini` (3.8B, Q4_K_M quantization) or `qwen2:1.5b`.
- **Supported Workflows:** Intent classification, keyword extraction, routine customer FAQs, scheduling queries.
- **Context Limit:** 4,096 tokens. Execution is ultra-fast and consumes under 2.5GB RAM.

### Tier 2: Consumer Standard (8–16 GB RAM or 4–6 GB VRAM)
- **Target Hardware:** Modern business laptops, MacBook Air (M1/M2/M3), desktop with GTX 1660 / RTX 3050.
- **Recommended Models:** `llama3:8b` (Q4_K_M) or `mistral:7b`.
- **Supported Workflows:** Balanced business strategy, professional customer email drafts, CRM lead qualification, marketing copy.
- **Context Limit:** 8,192 tokens. Provides high fidelity and natural conversational tone.

### Tier 3: High-Performance Workstation (16–32 GB RAM or 8–16 GB VRAM)
- **Target Hardware:** Dedicated business server, Mac Studio (32GB), workstations with RTX 3060/4070.
- **Recommended Models:** `llama3.1:8b` (128k context support), `qwen2.5:14b`, or `deepseek-coder:6.7b`.
- **Supported Workflows:** Complex website code generation, comprehensive multi-page business plans, deep document RAG synthesis.
- **Context Limit:** 16,384 tokens.

### Tier 4: Enterprise Server (>32 GB RAM or >16 GB VRAM)
- **Target Hardware:** On-premise server cluster, dual-GPU workstations with RTX 4090 or A5000.
- **Recommended Models:** `qwen2.5:32b` or `llama3.3:70b` (Q4_K_M).
- **Supported Workflows:** Autonomous enterprise orchestration, exhaustive competitor dossier synthesis.

---

## 3. Dynamic Task-to-Model Routing Rules

The `ForgeModelRouter` maps incoming business tasks according to their computational intensity:

1. **TRIVIAL & FAST PATH:**
   - *Tasks:* Classification, intent determination, sentiment check, operating hours check.
   - *Route:* Smallest local model (`phi3:mini` or `qwen2:1.5b`). Target latency: <200ms.
2. **STANDARD BUSINESS OPERATIONS:**
   - *Tasks:* Customer replies, CRM updates, appointment slot matching, lead scoring.
   - *Route:* Standard local model (`llama3:8b`). Target latency: 500ms–1.5s.
3. **HEAVY GENERATIVE & CODE:**
   - *Tasks:* Multi-section HTML/CSS/JS website generation, 8-section business plans.
   - *Route:* Local coding model (`qwen2.5:14b` or `deepseek-coder:6.7b`) or configured cloud provider.
4. **MATHEMATICAL & FINANCIAL:**
   - *Tasks:* Cash flow, break-even, margins, runway calculations.
   - *Route:* **Bypasses LLM token prediction entirely.** Routes to deterministic Python calculation engine (`financial_model.py`) to guarantee 0% arithmetic hallucination.

---

## 4. Multi-Model Quality & Critic Loop

For high-stakes deliverables (e.g. corporate business plans, client marketing campaigns), Rine Forge supports an automated multi-model refinement loop:
1. **Draft Stage:** Local fast model generates initial candidate output.
2. **Critic Stage:** Second model or deterministic validator reviews against business rules and AST syntax criteria.
3. **Repair Stage:** If issues are flagged, targeted edits are applied automatically before user delivery.
4. **Cost Protection:** Multi-model checks are strictly reserved for complex, high-value tasks and never invoked for simple inquiries.
