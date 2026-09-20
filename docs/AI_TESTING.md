# Rine Forge Systems V5 — AI Core Testing Strategy

## 1. Zero-Cost Provider Mocking Policy

To ensure high-speed, repeatable CI runs and prevent burning real API credits during automated verification, all unit and integration tests execute against `MockProvider` or mocked network adapters.

The test suite runs with `pytest` and `pytest-asyncio`:
```powershell
.\venv\Scripts\python.exe -m pytest tests/test_phase2_ai_core.py -v
```

---

## 2. Test Coverage Matrix

The Phase 2 AI Core test suite ([`tests/test_phase2_ai_core.py`](file:///c:/Users/Shani%20Khan/Desktop/Outreach%20AI/tests/test_phase2_ai_core.py)) verifies all 16 critical subsystem behaviors:

| Test Case | Subsystem Tested | Verification Criteria |
| :--- | :--- | :--- |
| `test_mock_provider_generation_and_streaming` | `BaseAIProvider` Contract | Verifies full generation, token counts, SSE chunk streaming, and health checks. |
| `test_openai_and_gemini_unconfigured_graceful` | Error Handling & Startup | Asserts that missing API keys gracefully report `NOT_CONFIGURED` without crashing. |
| `test_model_router_tier_resolution` | `ModelRouter` | Validates routing across `FAST_MODEL`, `QUALITY_MODEL`, `LOCAL_MODEL`, and model overrides. |
| `test_model_router_fallback` | `ModelRouter` Failover | Asserts secondary provider fallback resolution when primary fails. |
| `test_ai_gateway_bounded_retries` | `AIGateway` Reliability | Simulates 429 RateLimit on attempt 1, verifying automatic retry succeeds on attempt 2. |
| `test_ai_gateway_timeout_enforcement` | `AIGateway` Timeout Guard | Simulates 300ms model latency with 100ms timeout; asserts `AIProviderTimeoutError` (504). |
| `test_prompt_injection_sanitization` | Input Safety | Verifies control character stripping and neutralization of injected closing XML tags. |
| `test_adversarial_pattern_detection` | Adversarial Defense | Tests detection of jailbreak phrases ("ignore all instructions", "developer mode"). |
| `test_format_safe_user_message` | Boundary Encapsulation | Asserts user content is wrapped with `<untrusted_user_input>` XML tags. |
| `test_structured_output_parsing` | Pydantic Schema Output | Validates JSON schema adherence, code block stripping, and Pydantic object extraction. |
| `test_sliding_window_context_truncation` | Token Budget Management | Asserts system prompt & latest input are preserved while oldest history is truncated. |
| `test_agent_configurations` | `AgentConfig` Engine | Verifies predefined configurations for Elena, Marcus, Aria, and Kael. |
| `test_safe_tool_registry` | Tool Security Sandbox | Verifies safe tool execution, handoff escalation, and rejection of non-whitelisted tools. |
| `test_ai_status_and_agents_endpoints` | API Diagnostics | Tests `GET /api/v1/ai/status` and `GET /api/v1/ai/agents` responses. |
| `test_ai_chat_endpoint` | Conversational Pipeline | Tests `POST /api/v1/ai/chat` end-to-end conversational turn with metadata. |
| `test_ai_chat_streaming_endpoint` | SSE Streaming Endpoint | Tests `POST /api/v1/ai/chat/stream` emitting valid `text/event-stream` token chunks. |

---

## 3. Regression Verification

All Phase 1 security foundation tests ([`tests/test_phase1_foundation.py`](file:///c:/Users/Shani%20Khan/Desktop/Outreach%20AI/tests/test_phase1_foundation.py)) and existing business logic tests run in conjunction with Phase 2 tests:

```powershell
.\venv\Scripts\python.exe -m pytest tests/test_phase1_foundation.py tests/test_phase2_ai_core.py -q
```
**Result**: 27 passed in 63.37s (100% pass rate).

### Frontend Build Verification
The React frontend is verified by running the Vite production build:
```powershell
npm --prefix frontend run build
```
**Result**: 1,969 modules transformed, bundled cleanly in 11.65s with 0 errors.
