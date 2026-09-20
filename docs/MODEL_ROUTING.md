# Rine Forge Systems V5 — Capability & Task-Based Model Routing

## 1. Overview

Rine Forge Systems decouples business applications and agents from individual model identifiers. Agents declare the **Task Type** or **Capability** required for their objective, and the **Model Router** (`backend/app/ai/gateway/router.py`) evaluates local hardware, model catalog availability, and tenant policy to select the optimal model.

```text
Request (e.g. Task: website_build)
                │
                ▼
      [ ModelRouter.route_task ]
      ├── Evaluate Tenant Policy (LOCAL_ONLY, LOCAL_FIRST, CLOUD_ALLOWED)
      ├── Check Hardware Memory Footprint (Tiers 1-4)
      ├── Query Installed Models in ModelDiscoveryService
      └── Select Primary Local Match or Safe Installation Path
                │
                ▼
      Execute via Rine AI Gateway
```

---

## 2. The 19 Authoritative Task Types

Every AI operation in Rine Forge maps to one of 19 standardized task types:

| Task Type | Recommended Model | Resource Tier | Primary Role |
| :--- | :--- | :--- | :--- |
| `chat` | `phi3:mini` | Tier 1 (Low) | Low-latency conversational turns, reception |
| `business_qa` | `llama3:8b` | Tier 2 (Balanced) | General business inquiries, operating rules |
| `customer_response` | `phi3:mini` | Tier 1 (Low) | Receptionist intent routing & scheduling |
| `voice_turn` | `phi3:mini` | Tier 1 (Low) | Ultra-low latency voice transcription turns |
| `website_build` | `qwen2.5-coder:7b` | Tier 2 (Balanced) | Production HTML/Tailwind component generation |
| `website_audit` | `llama3:8b` | Tier 2 (Balanced) | Fact vs inference vs recommendation auditing |
| `brand_generation` | `llama3:8b` | Tier 2 (Balanced) | Tone, palette, logo descriptions, positioning |
| `business_plan` | `llama3:8b` | Tier 2 (Balanced) | Multi-section business model generation |
| `financial_model` | `llama3:8b` | Tier 2 (Balanced) | Explaining deterministic financial scenarios |
| `knowledge_qa` | `llama3:8b` | Tier 2 (Balanced) | Grounded RAG with strict provenance tags |
| `code_generation` | `deepseek-coder:6.7b`| Tier 2 (Balanced) | Backend functions, API schemas, validation scripts |
| `lead_qualification` | `phi3:mini` | Tier 1 (Low) | B2B lead scoring, ICP fit scoring |
| `workflow_automation`| `llama3:8b` | Tier 2 (Balanced) | Webhook trigger logic, conditional actions |
| `sentiment_analysis` | `qwen2:1.5b` | Tier 1 (Low) | Review triage, urgency rating |
| `document_summarization`| `llama3:8b` | Tier 2 (Balanced) | Legal, operational, and transcript summaries |
| `marketing_copy` | `llama3:8b` | Tier 2 (Balanced) | Email campaigns, SMS copy, landing page hero copy |
| `schema_design` | `deepseek-coder:6.7b`| Tier 2 (Balanced) | JSON schemas, SQL table designs, validation types |
| `sandbox_evaluation` | `qwen2.5-coder:7b` | Tier 2 (Balanced) | Automated build verification and safety testing |
| `project_breakdown` | `llama3:8b` | Tier 2 (Balanced) | Decomposing business requests into subtasks |

---

## 3. Dedicated Coding Models

For software engineering and web development tasks (`website_build`, `code_generation`, `schema_design`, `sandbox_evaluation`), Rine Forge provides dedicated support for state-of-the-art open coding models:

1. **`qwen2.5-coder:7b`**: Default frontend code generation engine. Excellent at responsive Tailwind CSS and semantic HTML5.
2. **`deepseek-coder:6.7b`**: Default backend code generation engine. High accuracy on Python logic and validation routines.
3. **`qwen3-coder:latest`**: High-capacity multi-file full-stack coding model for Tier 3/4 environments.

---

## 4. Policy Enforcement & Privacy

- **`POLICY_LOCAL_ONLY`**: Strictly blocks any cloud API calls. If an Ollama model is missing or offline, returns structured guidance or offline status without cloud egress.
- **`POLICY_LOCAL_FIRST`**: Always attempts local Ollama execution first. Only falls back if explicitly permitted and configured.
- **`POLICY_CLOUD_ALLOWED` / `POLICY_CLOUD_PREFERRED`**: Permits routing to external providers if local models are uninstalled and operator has configured API keys.
