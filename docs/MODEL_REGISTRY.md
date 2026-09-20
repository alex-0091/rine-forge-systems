# Rine Forge Systems V5 — Local Model Registry & Discovery Catalog

## 1. Catalog Overview

The Model Registry (`backend/app/ai/model_discovery.py`) maintains an authoritative directory of vetted open models optimized for the local Ollama execution runtime.

Models are classified into **4 Hardware Compatibility Tiers** to match physical RAM and compute constraints.

---

## 2. Master Model Directory

| Model Identifier | Provider | Parameter Size | Min RAM (GB) | Recommended Tier | Primary Capabilities | Context Window | Coding Support |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `phi3:mini` | LOCAL_OLLAMA | 3.8B | 4.0 GB | Tier 1 (<8GB) | Fast chat, tool use, general Q&A | 4,096 | No |
| `qwen2:1.5b` | LOCAL_OLLAMA | 1.5B | 2.5 GB | Tier 1 (<8GB) | Ultralight triage, classification | 32,768 | No |
| `llama3:8b` | LOCAL_OLLAMA | 8.0B | 8.0 GB | Tier 2 (8-16GB) | Balanced reasoning, synthesis, tools | 8,192 | Yes (Basic) |
| `mistral:7b` | LOCAL_OLLAMA | 7.0B | 7.5 GB | Tier 2 (8-16GB) | General business reasoning, planning | 8,192 | No |
| `gemma2:9b` | LOCAL_OLLAMA | 9.0B | 9.5 GB | Tier 2 (8-16GB) | High-accuracy business comprehension | 8,192 | No |
| `qwen2.5-coder:7b` | LOCAL_OLLAMA | 7.0B | 8.0 GB | Tier 2 (8-16GB) | HTML/CSS/JS frontend code, tools | 32,768 | Yes (Specialized) |
| `deepseek-coder:6.7b` | LOCAL_OLLAMA | 6.7B | 7.5 GB | Tier 2 (8-16GB) | Code refactoring, validation, scripts | 16,384 | Yes (Specialized) |
| `qwen3-coder:latest` | LOCAL_OLLAMA | 14.0B | 15.0 GB | Tier 3 (16-32GB) | Enterprise full-stack software coding | 65,536 | Yes (Advanced) |
| `command-r:35b` | LOCAL_OLLAMA | 35.0B | 22.0 GB | Tier 3 (16-32GB) | Multi-hop RAG, complex workflows | 128,000 | No |
| `mixtral:8x7b` | LOCAL_OLLAMA | 46.7B | 32.0 GB | Tier 3 (16-32GB) | Mixture-of-experts complex analysis | 32,768 | Yes (Basic) |
| `llama3:70b` | LOCAL_OLLAMA | 70.0B | 48.0 GB | Tier 4 (>32GB) | Deep reasoning, legal/financial plans | 8,192 | Yes (Advanced) |
| `deepseek-v2:236b` | LOCAL_OLLAMA | 236.0B | 120.0 GB | Tier 4 (>32GB) | Enterprise cluster architecture | 128,000 | Yes (Advanced) |

---

## 3. Dynamic Hardware Status Mapping

When queried via `GET /api/v1/workbench/discovery`, each model is assigned one of 4 dynamic statuses relative to the current host:

1. **`INSTALLED`**: The model is already pulled into the local Ollama storage and ready for instant inference.
2. **`RECOMMENDED`**: The model fits within the host's hardware tier and RAM capacity, and provides optimal performance for the system profile.
3. **`AVAILABLE`**: The model can run on the host hardware, but may be slower or secondary to the recommended models.
4. **`INCOMPATIBLE`**: The model's RAM or VRAM requirements exceed detected host resources. Installation is blocked by default to protect host stability.

---

## 4. Coding Model Options

For automated code generation (`website_build`, `sandbox_evaluation`, `schema_design`), Rine Forge explicitly supports and prioritizes modern open coding models:
- **`qwen2.5-coder:7b`**: Excellent for React/HTML/CSS and fast script generation on consumer laptops.
- **`deepseek-coder:6.7b`**: High accuracy on Python, API schemas, and validation routines.
- **`qwen3-coder:latest`**: Production-grade full-stack model for multi-file generation on 16GB+ systems.
