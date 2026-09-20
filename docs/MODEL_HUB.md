# Model & Tool Hub Architecture (Phase AQ)

## 1. Overview
The **Model & Tool Hub** (`backend/app/workbench/model_hub.py`) provides an abstract, vendor-independent routing layer for all AI and generative capabilities across Rine Forge Systems.

It ensures:
1. **Free-First Routing**: Default prioritization of zero-cost, private, locally hosted or parametric engines (e.g. Local Ollama, built-in vector SVG generator, Tailwind sandbox generator).
2. **Transparent Telemetry**: Provider status, latency, costs, and token consumption are tracked honestly. No expensive cloud API generation is ever falsely marked as free.
3. **Resilient Failure Fallback**: Upstream provider failures automatically trigger fallbacks to secondary local or alternative engines, with comprehensive execution traces.
4. **Workspace Resource Limits**: Per-workspace constraints on tasks, images, video duration, voice minutes, and token allowances prevent runaway compute costs.

---

## 2. Selection Policies

| Policy | Logic | Default Use Case |
|---|---|---|
| `FREE_FIRST` | Selects local/parametric providers first; falls back to cloud only when required. | Default platform policy for all standard workbench initiatives. |
| `LOCAL_ONLY` | Strictly forbids external cloud API calls; fails if local engine is offline. | Privacy-sensitive or on-premise healthcare/legal deployments. |
| `QUALITY_FIRST` | Routes directly to high-capacity cloud models (e.g. OpenAI / Replicate) if configured. | High-stakes marketing presentations or photorealistic diffusion tasks. |
| `FASTEST` | Selects lowest-latency provider based on historical telemetry response times. | Interactive live voice turns and conversational web chat. |
| `PAID_ALLOWED` | Permits paid cloud API generation with transparent cost accounting. | Custom enterprise tenant configurations with dedicated API keys. |

---

## 3. Registered Providers

### Text / Reasoning Providers
- **`LOCAL_OLLAMA`**: Local or self-hosted Ollama neural engine. 100% free, private, zero external data transmission.
- **`OPENAI_CLOUD`**: Cloud-hosted high-capacity foundation models. Transparently reports integration status (`READY` if API key configured, `NOT CONFIGURED` otherwise).

### Image / Visual Providers
- **`BUILTIN_SVG_VECTOR`**: Rine Forge Vector Studio. Parametric, mathematical SVG mark generator producing infinite-resolution vector logos, color palettes, and typographic pairings at zero cost.
- **`REPLICATE_IMAGE`**: Cloud diffusion model provider for photorealistic imagery.

### Code & Sandbox Providers
- **`TAILWIND_SANDBOX_GEN`**: Component layout engine generating multi-page responsive web applications styled with Tailwind CSS, sandboxed for security.

---

## 4. Workspace Resource Limits

The `WorkspaceLimits` engine enforces multi-tenant boundaries:
- `max_tasks`: 50 tasks per initiative.
- `max_images`: 20 generated visual concepts.
- `max_video_seconds`: 60 seconds of synthetic media.
- `max_voice_minutes`: 30 minutes of synthesized/transcribed voice runtime.
- `max_model_tokens`: 200,000 tokens per project.
- `max_storage_mb`: 500 MB per workspace.
