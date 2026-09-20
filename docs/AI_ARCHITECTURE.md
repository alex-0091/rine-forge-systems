# Rine Forge Systems V5 — AI Core Architecture

## 1. Architectural Overview

The Rine Forge AI Core provides a centralized, resilient, provider-agnostic runtime that decouples high-level business logic and user-facing widgets from underlying LLM vendors.

```
Client Browser / Chat Widget (RealAiReceptionistChat.jsx)
  │
  │ HTTP POST / Server-Sent Events (SSE)
  ▼
Rine Forge API Master Layer
  ├── POST /api/v1/ai/chat          (Synchronous conversational turn)
  ├── POST /api/v1/ai/chat/stream   (Token-by-token SSE streaming)
  ├── GET  /api/v1/ai/status        (Truthful provider health probe)
  └── GET  /api/v1/ai/agents        (Agent blueprint discovery)
  │
  ▼
Agent Runtime (`backend/app/ai/agents/runtime.py`)
  ├── Resolves AgentConfig (Elena, Marcus, Aria, Kael)
  ├── Scopes conversation to Tenant (`V5Conversation` / `V5Message`)
  └── Loads verified tenant facts & approved service catalog
  │
  ▼
Context & Safety Layer (`backend/app/ai/conversation/`, `backend/app/ai/safety/`)
  ├── Sliding window token budgeting (oldest turns truncated first)
  ├── Prompt injection defense (untrusted XML tag isolation)
  └── Defensive system directive attachment
  │
  ▼
AI Gateway (`backend/app/ai/gateway/core.py`)
  ├── Request timeout enforcement (default 30s)
  ├── Bounded exponential retries on transient errors (429, 503, connection drops)
  ├── Structured output schema enforcement & 1-turn repair reprompting
  └── Diagnostic logging with tenant-scoped Request ID (`RF-XXXXXX`)
  │
  ▼
Model Router (`backend/app/ai/gateway/router.py`)
  ├── Policy-based routing by requirement tiers (FAST, QUALITY, CHEAP, LOCAL)
  ├── Automatic fallback to alternative configured providers
  └── Model name override resolution
  │
  ▼
Provider Adapters (`backend/app/ai/gateway/providers/`)
  ├── OpenAI Adapter      (AsyncOpenAI, gpt-4o-mini, gpt-4o)
  ├── Gemini Adapter      (Google GenAI, gemini-1.5-flash, gemini-2.0-flash)
  ├── Ollama Adapter      (Local inference, localhost:11434, llama3, mistral)
  └── Mock Adapter        (Deterministic, zero-cost unit testing & CI)
```

---

## 2. Standard Provider Interface

Every AI provider adapter implements the `BaseAIProvider` abstract contract defined in [`backend/app/ai/gateway/interface.py`](file:///c:/Users/Shani%20Khan/Desktop/Outreach%20AI/backend/app/ai/gateway/interface.py):

```python
class BaseAIProvider(ABC):
    @abstractmethod
    def is_configured(self) -> bool:
        """Returns True if required credentials and endpoints are valid."""

    @abstractmethod
    async def generate(self, messages: List[ChatMessage], options: Optional[AIOptions] = None) -> AIResponse:
        """Executes a complete generation turn."""

    @abstractmethod
    async def generate_stream(self, messages: List[ChatMessage], options: Optional[AIOptions] = None) -> AsyncIterator[AIStreamChunk]:
        """Streams token chunks in real-time."""

    @abstractmethod
    def count_tokens(self, text: str) -> int:
        """Estimates or calculates token usage."""

    @abstractmethod
    async def health_check(self) -> ProviderHealth:
        """Probes provider latency and status."""
```

### Standardized Response Envelope (`AIResponse`)
No vendor-specific raw payloads are leaked to the application. All providers return the unified `AIResponse` model:
- `text`: Extracted completion string.
- `finish_reason`: `stop`, `length`, or `tool_calls`.
- `usage`: `TokenUsage` object containing `prompt_tokens`, `completion_tokens`, and `total_tokens`.
- `latency_ms`: Total external call duration in milliseconds.
- `provider`: String identifier (`openai`, `gemini`, `ollama`, `mock`).
- `model`: Exact model executed (e.g., `gpt-4o-mini`, `gemini-1.5-flash`, `llama3`).
- `tool_calls`: Standardized function call list if tools were requested.
- `raw_metadata`: Diagnostic metadata for debugging.

---

## 3. Intelligent Model Router

The `ModelRouter` ([`backend/app/ai/gateway/router.py`](file:///c:/Users/Shani%20Khan/Desktop/Outreach%20AI/backend/app/ai/gateway/router.py)) replaces hardcoded model strings with policy-driven task tiers:

| Requirement Tier | Primary Purpose | Default Primary | Default Fallback |
| :--- | :--- | :--- | :--- |
| `FAST_MODEL` | Triage, booking classification, interactive web chat | `gpt-4o-mini` | `gemini-1.5-flash` |
| `QUALITY_MODEL` | Complex reasoning, contract review, policy disputes | `gpt-4o` | `gemini-1.5-pro` |
| `CHEAP_MODEL` | High-volume batch summaries, offline scoring | `gpt-4o-mini` | `gemini-1.5-flash` |
| `LOCAL_MODEL` | Privacy-first on-premises execution via Ollama | `llama3` (local) | `mistral` (local) |

### Routing & Fallback Logic
1. **Explicit Override**: If a caller explicitly specifies `options.model="gpt-4o"`, the router routes directly to that model's adapter.
2. **Tier-Based Mapping**: If no model override is provided, the router maps the requested tier to configured providers in order of preference.
3. **Graceful Fallback**: If the primary provider experiences a rate limit (429), service unavailability (503), or timeout, the AI Gateway queries `router.get_fallback_route()` and automatically routes the request to the secondary provider, recording the failover in structured logs.

---

## 4. Reliability & Fault Tolerance

The `AIGateway` core ([`backend/app/ai/gateway/core.py`](file:///c:/Users/Shani%20Khan/Desktop/Outreach%20AI/backend/app/ai/gateway/core.py)) enforces resilience guarantees across all model calls:

- **Strict Timeout Guard**: Configurable deadline (default 30 seconds, or per-request override). Calls exceeding this duration are cancelled immediately with an `AIProviderTimeoutError` (HTTP 504), preventing slow external APIs from hanging application workers.
- **Bounded Exponential Backoff**: Transient errors (429 rate limit, 503 service unavailable, network socket drops) are retried up to 2 times with exponential delays (400ms, 800ms) before triggering provider failover.
- **Domain Error Mapping**: Vendor exceptions are normalized into standard application exceptions subclassing `AIError` and `AppException`:
  - `AIProviderAuthenticationError` (502)
  - `AIProviderRateLimitError` (429)
  - `AIProviderQuotaExceededError` (502)
  - `AIProviderTimeoutError` (504)
  - `AIProviderUnavailableError` (503)
  - `AIInvalidPromptError` (400)
  - `AIContextLengthExceededError` (400)

---

## 5. Structured Outputs & Tool Execution Safety

### Structured JSON Validation
The `generate_structured` function ([`backend/app/ai/gateway/structured.py`](file:///c:/Users/Shani%20Khan/Desktop/Outreach%20AI/backend/app/ai/gateway/structured.py)) enforces schema guarantees:
1. Injects JSON schema directives generated directly from Pydantic models.
2. Strips markdown code block wrappers (````json ... ````).
3. Validates the output against the Pydantic schema.
4. **One-Turn Self-Correction**: If the model output fails schema validation or JSON syntax, the gateway reprompts the model once with the exact validation error, allowing the model to repair its output before failing.
5. **Zero Fake Metrics**: No synthetic or fabricated "99% confidence" metrics are created.

### Safe Tool Registry
Tool calling ([`backend/app/ai/tools/`](file:///c:/Users/Shani%20Khan/Desktop/Outreach%20AI/backend/app/ai/tools/)) enforces strict security constraints:
- **Explicit Whitelisting**: Only tools registered in `SafeToolRegistry` can be invoked.
- **Tenant Scope Isolation**: All tools require a valid `business_id` and database session, preventing cross-tenant data leaks.
- **Execution Timeout**: Tools are bounded by a 5.0s timeout.
- **Permission Checking**: Sensitive tools require caller permissions.
- **Zero Arbitrary Execution**: The agent is strictly prohibited from running shell commands, raw SQL, or arbitrary Python code.

---

## 6. Server-Sent Events (SSE) Streaming

The streaming endpoint `POST /api/v1/ai/chat/stream` provides real-time token streaming using standard HTTP SSE:
- `event: token`: Emits each incremental text chunk as generated by the provider:
  ```json
  {"text": "Hello", "conversation_id": "conv-uuid"}
  ```
- `event: done`: Emitted once generation finishes, containing final usage and latency metrics:
  ```json
  {"text": "", "finish_reason": "stop", "conversation_id": "conv-uuid", "latency_ms": 420, "usage": {"prompt_tokens": 120, "completion_tokens": 25, "total_tokens": 145}}
  ```
- `event: error`: Emitted if external provider failure occurs mid-stream.
- **Client Disconnect Handling**: Listens for `request.is_disconnected()` and terminates background model generation loops immediately upon client abort.
