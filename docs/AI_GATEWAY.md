# Rine Forge Systems V5 — AI Gateway Architecture

## 1. Single Unified Entry Point

All AI operations in Rine Forge Systems converge into the **Rine AI Gateway** (`backend/app/ai/gateway/rine_gateway.py`). No agent or endpoint is permitted to call LLM providers or Ollama directly.

```text
Requesting Component (Workbench / Chat / Receptionist)
                       │
                       ▼
            rine_ai_gateway.run()
                       │
      ┌────────────────┼────────────────┐
      ▼                ▼                ▼
Policy Enforcement  RAG Context    Tool Registry
 (Isolation Guard)   (Provenance)    Execution
      │                │                │
      └────────────────┼────────────────┘
                       │
                       ▼
                 Model Router
              (19 Task Types)
                       │
                       ▼
                 Ollama Adapter
                       │
                       ▼
               Structured Result
```

---

## 2. Interface Specification

```python
async def run(
    self,
    task: str,
    input: str,
    context: Optional[Dict[str, Any]] = None,
    tools: Optional[List[str]] = None,
    attachments: Optional[List[Dict[str, Any]]] = None,
    workspace_id: str = "default",
    policy: str = "LOCAL_FIRST",
    user_id: str = "system",
    session: Optional[Any] = None
) -> Dict[str, Any]:
```

### Parameters
- **`task`**: One of the 19 authoritative task types (e.g. `business_qa`, `website_build`, `customer_response`).
- **`input`**: Raw user prompt or query.
- **`context`**: Business profile, financial variables, or operating hours.
- **`tools`**: Allowed tool identifiers (e.g. `["get_operating_hours", "calculate_mortgage"]`).
- **`attachments`**: Base64 screenshots, uploaded website files, or document references.
- **`workspace_id`**: Multi-tenant workspace identifier for data isolation.
- **`policy`**: `LOCAL_ONLY` (default), `LOCAL_FIRST`, `CLOUD_ALLOWED`, or `CLOUD_PREFERRED`.

---

## 3. Execution Pipeline

1. **Security & Boundary Check:** Validates tenant ID, payload size limits (e.g. 50 MB max), and disallows SSRF target addresses (`isolation_guard.py`).
2. **Context Grounding & RAG:** Formats verified business facts and explicit provenance metadata (`source: BUSINESS_KNOWLEDGE_BASE`, `is_inference: False`).
3. **Task Routing:** Selects optimal local model and resource parameters via `model_router.route_task(task_type, workspace_policy)`.
4. **Tool Execution:** Executes declared tools from `tool_registry` within safe parameter sandboxes.
5. **Inference Execution:** Sends payload to `ollama_adapter.chat()` or `ollama_adapter.generate()`. If Ollama is offline, gracefully handles fallback without breaking the runtime.
6. **Privacy Telemetry:** Emits structured event metrics (`requestId`, `model`, `durationMs`, `success`) omitting customer prompt content.
