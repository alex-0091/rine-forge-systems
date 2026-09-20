# Rine Forge Systems V5 — AI Provider Integration Guide

## 1. Supported Providers & Configuration

Rine Forge Systems supports commercial cloud LLM APIs, local private models, and a deterministic offline test provider.

### Environment Variables

| Variable | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `LLM_PROVIDER` | string | `auto` | Preferred provider selection (`auto`, `openai`, `gemini`, `ollama`, `mock`). |
| `OPENAI_API_KEY` | string | `None` | Privileged secret key for OpenAI API access. |
| `OPENAI_MODEL` | string | `gpt-4o-mini` | Default primary model for OpenAI requests. |
| `OPENAI_REASONING_MODEL` | string | `gpt-4o` | High-reasoning model for complex synthesis. |
| `GEMINI_API_KEY` | string | `None` | Google GenAI API key. |
| `GEMINI_MODEL` | string | `gemini-1.5-flash`| Default model for Google Gemini requests. |
| `OLLAMA_BASE_URL` | string | `http://localhost:11434` | Endpoint for local private Ollama runtime. |
| `OLLAMA_MODEL` | string | `llama3` | Default local model deployed on Ollama. |
| `DRY_RUN` | boolean| `True` (dev) | When active and no external keys exist, routes safely to `mock`. |

---

## 2. Provider Lifecycle & Statuses

The AI Core never crashes on startup if an API key is missing. Each adapter self-reports its state via `health_check()`:

- **`CONFIGURED` / `AVAILABLE`**: Valid credentials supplied and the model endpoint responded successfully to the health ping probe.
- **`NOT_CONFIGURED`**: The required environment variable (e.g., `OPENAI_API_KEY`) is absent or empty. The adapter logs a clear warning and disables itself gracefully.
- **`UNAVAILABLE`**: The provider endpoint is unreachable or down (e.g., local Ollama daemon is not running on port 11434).
- **`ERROR`**: The provider returned an authentication failure or API exception during health probing.

### Status Diagnostic Endpoint
Querying `GET /api/v1/ai/status` returns the live state of all adapters:
```json
{
  "gateway_status": "ONLINE",
  "active_provider": "openai",
  "active_model": "gpt-4o-mini",
  "providers": {
    "openai": {
      "provider": "openai",
      "status": "AVAILABLE",
      "models": ["gpt-4o-mini", "gpt-4o"],
      "latency_ms": 142,
      "error_message": null
    },
    "gemini": {
      "provider": "gemini",
      "status": "NOT_CONFIGURED",
      "models": ["gemini-1.5-flash", "gemini-2.0-flash"],
      "latency_ms": null,
      "error_message": "GEMINI_API_KEY is not configured"
    },
    "ollama": {
      "provider": "ollama",
      "status": "UNAVAILABLE",
      "models": ["llama3", "mistral"],
      "latency_ms": null,
      "error_message": "Ollama is offline or unreachable at http://localhost:11434"
    },
    "mock": {
      "provider": "mock",
      "status": "AVAILABLE",
      "models": ["mock-fast", "mock-quality"],
      "latency_ms": 1,
      "error_message": null
    }
  }
}
```

---

## 3. Provider Adapters

### 3.1 OpenAI Adapter (`backend/app/ai/gateway/providers/openai_provider.py`)
- **SDK**: Uses official `openai.AsyncOpenAI`.
- **Supported Capabilities**: Non-streaming completions, SSE token streaming (`stream: True`), native JSON mode (`response_format={"type": "json_object"}`), function/tool calling.
- **Token Counting**: Uses `tiktoken` (`cl100k_base`) with character-based heuristic fallback.
- **Error Mapping**: Maps `openai.AuthenticationError` to `AIProviderAuthenticationError`, `openai.RateLimitError` to `AIProviderRateLimitError`, and timeouts to `AIProviderTimeoutError`.

### 3.2 Google Gemini Adapter (`backend/app/ai/gateway/providers/gemini_provider.py`)
- **SDK**: Uses `google.genai` Client.
- **Supported Capabilities**: Text generation, real-time content streaming, zero-overhead JSON extraction.
- **Error Mapping**: Normalizes Google API quota exhausted (429) and deadline exceeded errors into standard domain exceptions.

### 3.3 Ollama Local Adapter (`backend/app/ai/gateway/providers/ollama_provider.py`)
- **Execution**: Direct asynchronous HTTP client (`httpx.AsyncClient`) communicating with the Ollama REST API (`/api/chat`, `/api/tags`).
- **Privacy-First**: Operates strictly within localhost boundaries; zero data egresses to third-party servers.
- **Local Setup Instructions**:
  1. Install Ollama from [ollama.com](https://ollama.com).
  2. Pull the desired model: `ollama pull llama3`.
  3. Start the Ollama daemon: `ollama serve`.
  4. Rine Forge will automatically detect Ollama on `http://localhost:11434` and mark status as `AVAILABLE`.

### 3.4 Mock Provider (`backend/app/ai/gateway/providers/mock_provider.py`)
- **Execution**: In-memory deterministic responder with zero external API dependencies and zero token cost.
- **Use Case**: Powers automated test suites, CI/CD pipelines, and local dry-run modes.
- **Simulation Features**: Supports programmatic simulation of latency, 429 rate limits, 503 unavailability, and timeouts for fault-tolerance verification.
