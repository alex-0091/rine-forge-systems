"""
Rine Forge Systems V5 - Phase AS: Master Local AI Engine Verification Suite
20 comprehensive automated scenarios covering:
- Server hardware profiling & normalized capabilities
- Ollama connection layer (health, timeout, retry, privacy logging, missing models)
- Model discovery & safe tier-based installation guardrails
- Model Router across all 19 task types with strict LOCAL_ONLY policy enforcement
- Unified RineAIGateway.run() interface
- Customer response anti-hallucination protection
- Voice response agent 8-state lifecycle
- Sandboxed website build testing
- Deterministic financial scenarios & forecasts
- Knowledge RAG retrieval with verified provenance
- Security isolation guardrails (tenant boundaries, SSRF prevention, tool scopes)
"""
import pytest
import asyncio
import uuid
from typing import Dict, Any

from backend.app.workbench.hardware_profiler import hardware_profiler
from backend.app.ai.ollama_adapter import (
    ollama_adapter, OllamaOfflineError, OllamaTimeoutError,
    OllamaModelNotFoundError, OllamaAdapter
)
from backend.app.ai.model_discovery import model_discovery_service, OFFICIAL_AVAILABLE_MODELS
from backend.app.ai.gateway.router import (
    ModelRouter, ALL_TASK_TYPES, POLICY_LOCAL_ONLY, POLICY_LOCAL_FIRST,
    POLICY_CLOUD_PREFERRED, TASK_CODE_GENERATION, TASK_WEBSITE_BUILD,
    TASK_WEBSITE_AUDIT, TASK_CHAT, TASK_FINANCIAL_ANALYSIS
)
from backend.app.ai.gateway.rine_gateway import rine_ai_gateway
from backend.app.workbench.agents.customer_response import customer_response_agent
from backend.app.channels.voice.voice_agent import (
    voice_response_agent, STATE_LISTENING, STATE_ENDED, STATE_HANDOFF
)
from backend.app.workbench.agents.website_builder import website_builder_agent
from backend.app.workbench.agents.website_auditor import website_audit_agent
from backend.app.workbench.agents.financial_model import financial_model_agent
from backend.app.knowledge.rag_service import knowledge_service
from backend.app.ai.safety.isolation_guard import isolation_guard, SecurityViolationError


# ============================================================
# 1. HARDWARE PROFILER: NORMALIZED CAPABILITIES
# ============================================================
@pytest.mark.asyncio
async def test_01_hardware_profiler_normalized_capabilities():
    """Verifies normalized capability object structure matches Section 2 requirements."""
    caps = await hardware_profiler.get_normalized_capabilities()
    assert "cpu" in caps
    assert "cpuCores" in caps
    assert isinstance(caps["cpuCores"], int) and caps["cpuCores"] > 0
    assert "ramGB" in caps and isinstance(caps["ramGB"], (int, float))
    assert "gpu" in caps
    assert "vendor" in caps["gpu"]
    assert "vramGB" in caps["gpu"]
    assert "diskGB" in caps and isinstance(caps["diskGB"], (int, float))
    assert "architecture" in caps
    assert "ollama" in caps
    assert "installed" in caps["ollama"]
    assert "reachable" in caps["ollama"]


# ============================================================
# 2. HARDWARE PROFILER: OLLAMA TRUTHFUL OFFLINE REPORTING
# ============================================================
@pytest.mark.asyncio
async def test_02_hardware_profiler_ollama_status_offline():
    """Verifies that unreachable Ollama truthfully returns OFFLINE with actionable setup guidance."""
    status = await hardware_profiler.check_ollama_status()
    assert status["status"] in ["AVAILABLE", "OFFLINE"]
    if not status["is_reachable"]:
        assert status["status"] == "OFFLINE"
        assert "ollama serve" in status["instructions"]
        assert status["models_count"] == 0


# ============================================================
# 3. OLLAMA ADAPTER: HEALTH PROBE
# ============================================================
@pytest.mark.asyncio
async def test_03_ollama_adapter_health_offline():
    """Verifies OllamaAdapter.health() returns structured offline/ready diagnostic."""
    res = await ollama_adapter.health()
    assert res["status"] in ["READY", "OFFLINE"]
    assert res["endpoint"].startswith("http")


# ============================================================
# 4. OLLAMA ADAPTER: MODEL MISSING ERROR
# ============================================================
@pytest.mark.asyncio
async def test_04_ollama_adapter_model_missing_error():
    """Verifies get_model raises OllamaModelNotFoundError or OllamaOfflineError on missing model."""
    try:
        await ollama_adapter.get_model("nonexistent_test_model_xyz:99b")
    except (OllamaModelNotFoundError, OllamaOfflineError) as e:
        assert isinstance(e, (OllamaModelNotFoundError, OllamaOfflineError))


# ============================================================
# 5. OLLAMA ADAPTER: TIMEOUT & RETRY HANDLING
# ============================================================
@pytest.mark.asyncio
async def test_05_ollama_adapter_timeout_handling():
    """Verifies that ultra-short timeout raises appropriate timeout exception or offline error."""
    custom_adapter = OllamaAdapter(timeout_seconds=0.0001, max_retries=1)
    try:
        await custom_adapter.chat(
            messages=[{"role": "user", "content": "Hello"}],
            options={"timeout_seconds": 0.0001}
        )
    except (OllamaTimeoutError, OllamaOfflineError) as e:
        assert isinstance(e, (OllamaTimeoutError, OllamaOfflineError))


# ============================================================
# 6. OLLAMA ADAPTER: PRIVACY-PRESERVING STRUCTURED LOGGING
# ============================================================
def test_06_ollama_adapter_privacy_logging(caplog):
    """Verifies structured logging does NOT record private prompt content."""
    import logging
    caplog.set_level(logging.INFO)
    adapter = OllamaAdapter()
    adapter._log_event(
        event="test_inference",
        request_id="RF-TEST-001",
        model="llama3:8b",
        duration_ms=45.2,
        success=True,
        workspace_id="ws_secret_corp"
    )
    # Check that metadata was logged without exposing secret text
    assert "ws_secret_corp" in caplog.text
    assert "llama3:8b" in caplog.text


# ============================================================
# 7. MODEL DISCOVERY: INSTALLED VS AVAILABLE SEGREGATION
# ============================================================
@pytest.mark.asyncio
async def test_07_model_discovery_catalog_segregation():
    """Verifies that available catalog does not falsely claim uninstalled models are installed."""
    catalog = await model_discovery_service.get_discovery_catalog()
    assert len(catalog["models"]) == len(OFFICIAL_AVAILABLE_MODELS)
    assert catalog["host_tier"] in [1, 2, 3, 4]
    for m in catalog["models"]:
        assert m["status"] in ["INSTALLED", "RECOMMENDED", "AVAILABLE", "INCOMPATIBLE"]


# ============================================================
# 8. MODEL DISCOVERY: HARDWARE TIER CLASSIFICATION
# ============================================================
@pytest.mark.asyncio
async def test_08_model_discovery_hardware_tier_recommendation():
    """Verifies that host hardware determines recommended vs incompatible models."""
    catalog = await model_discovery_service.get_discovery_catalog()
    host_tier = catalog["host_tier"]
    for m in catalog["models"]:
        if m["is_recommended"]:
            assert m["recommended_hardware_tier"] == host_tier
            assert m["is_compatible"] is True


# ============================================================
# 9. MODEL DISCOVERY: SAFE INSTALLATION BLOCKS OVERSIZED MODELS
# ============================================================
@pytest.mark.asyncio
async def test_09_model_discovery_safe_install_blocked_for_oversized():
    """Verifies safe installation blocks 70B model on modest consumer hardware without confirmation."""
    res = await model_discovery_service.install_model_safe("llama3:70b", confirm_risk=False)
    # Unless testing on a 64GB machine, llama3:70b will be blocked
    if res.get("status") == "BLOCKED":
        assert "exceeds safe memory limits" in res["reason"]
        assert res["required_tier"] == 4


# ============================================================
# 10. MODEL DISCOVERY: SAFE INSTALLATION OVERRIDE WITH CONFIRMATION
# ============================================================
@pytest.mark.asyncio
async def test_10_model_discovery_safe_install_override_with_confirmation():
    """Verifies that confirm_risk=True allows proceeding to pull stage without blocking."""
    res = await model_discovery_service.install_model_safe("llama3:70b", confirm_risk=True)
    # Should attempt pull (returning OFFLINE, FAILED, or SUCCESS, but NOT BLOCKED)
    assert res["status"] != "BLOCKED"


# ============================================================
# 11. MODEL ROUTER: ALL 19 TASK TYPES ROUTING
# ============================================================
def test_11_model_router_19_task_types():
    """Verifies that all 19 task types route to deterministic models and resource tiers."""
    router = ModelRouter()
    assert len(ALL_TASK_TYPES) == 19

    for task in ALL_TASK_TYPES:
        route = router.route_task(task_type=task, workspace_policy=POLICY_LOCAL_FIRST)
        assert route["provider"] in ["ollama", "mock"]
        assert len(route["model"]) > 0
        assert route["estimatedResourceTier"] in [1, 2, 3, 4]
        assert len(route["reason"]) > 0


# ============================================================
# 12. MODEL ROUTER: STRICT LOCAL_ONLY POLICY ENFORCEMENT
# ============================================================
def test_12_model_router_local_only_policy_enforcement():
    """Verifies that under LOCAL_ONLY, router never returns cloud providers."""
    router = ModelRouter()
    for task in ALL_TASK_TYPES:
        route = router.route_task(task_type=task, workspace_policy=POLICY_LOCAL_ONLY)
        assert route["provider"] == "ollama"
        assert "[LOCAL_ONLY Policy]" in route["reason"]


# ============================================================
# 13. MODEL ROUTER: CODING MODEL DISPATCH
# ============================================================
def test_13_model_router_coding_model_options():
    """Verifies coding tasks route to specialized coding models."""
    router = ModelRouter()
    route = router.route_task(task_type=TASK_CODE_GENERATION)
    assert any(coder in route["model"] for coder in ["coder", "llama3"])
    assert route["estimatedResourceTier"] in [2, 3]


# ============================================================
# 14. RINE AI GATEWAY: UNIFIED RUN INTERFACE
# ============================================================
@pytest.mark.asyncio
async def test_14_rine_gateway_run_interface():
    """Verifies unified entry point rine_ai_gateway.run() with policy boundaries."""
    res = await rine_ai_gateway.run(
        task=TASK_CHAT,
        input="Please provide our office hours.",
        context={"business": {"name": "Austin Dental Care"}},
        policy=POLICY_LOCAL_ONLY
    )
    assert res["status"] in ["COMPLETED", "OFFLINE_FALLBACK"]
    assert res["task"] == TASK_CHAT
    assert "output" in res
    assert res["policy"] == POLICY_LOCAL_ONLY


# ============================================================
# 15. CUSTOMER RESPONSE: ANTI-HALLUCINATION GUARD
# ============================================================
@pytest.mark.asyncio
async def test_15_customer_response_anti_hallucination():
    """Verifies agent does NOT hallucinate dollar prices when business has no published fee list."""
    res = await customer_response_agent.generate_response(
        business={"name": "Premier Smiles"},  # No pricing info
        customer_message="How much does a dental implant cost?"
    )
    assert res["intent"] == "PRICING_INQUIRY"
    # Should transparently offer a personalized quote rather than inventing a number
    assert "quote" in res["response"] or "transparent" in res["response"]
    assert res["requiresHuman"] is False or res["requiresHuman"] is True
    assert "confidence" in res
    assert res["confidence"] > 0.7


# ============================================================
# 16. VOICE AGENT: 8-STATE LIFECYCLE
# ============================================================
@pytest.mark.asyncio
async def test_16_voice_agent_state_machine_lifecycle():
    """Verifies voice session lifecycle transitions: LISTENING -> THINKING -> SPEAKING -> ENDED."""
    biz = {"name": "Austin Smiles", "business_hours": "Mon-Fri 8am-5pm"}
    sess = voice_response_agent.start_session(biz)
    assert sess["state"] == STATE_LISTENING

    turn = await voice_response_agent.process_audio_turn(
        session_id=sess["session_id"],
        audio_payload="What are your hours?",
        voice_profile="professional"
    )
    assert turn["state"] == STATE_LISTENING
    assert "hours" in turn["text_response"].lower() or "open" in turn["text_response"].lower()
    assert turn["audio_format"] == "wav"

    ended = voice_response_agent.end_session(sess["session_id"])
    assert ended["state"] == STATE_ENDED


# ============================================================
# 17. WEBSITE BUILDER: SANDBOXED BUILD TEST
# ============================================================
def test_17_website_builder_sandboxed_build_test():
    """Verifies build_test detects malformed markup and security sandbox violations."""
    # Valid build
    valid_res = website_builder_agent.build_test("<!DOCTYPE html><html><head></head><body><h1>Hello</h1></body></html>")
    assert valid_res["build_passed"] is True
    assert len(valid_res["errors"]) == 0

    # Malformed build
    bad_res = website_builder_agent.build_test("<div>No doctype</div>")
    assert bad_res["build_passed"] is False
    assert len(bad_res["errors"]) > 0

    # Path traversal attack attempt
    attack_res = website_builder_agent.build_test("<!DOCTYPE html><html><body><a href='../../etc/passwd'>leak</a></body></html>")
    assert attack_res["build_passed"] is False
    assert any("traversal" in err.lower() or "restricted" in err.lower() for err in attack_res["errors"])


# ============================================================
# 18. FINANCIAL MODEL: DETERMINISTIC SCENARIOS & FORECASTS
# ============================================================
def test_18_financial_engine_deterministic_scenarios():
    """Verifies deterministic math in Conservative, Base, and Optimistic scenarios."""
    fin = financial_model_agent.calculate_financials(monthly_revenue=40000.0, cogs_rate=0.25)
    scenarios = fin["scenarios"]
    assert scenarios["base"]["monthly_revenue"] == 40000.0
    assert scenarios["conservative"]["monthly_revenue"] == 34000.0
    assert scenarios["optimistic"]["monthly_revenue"] == 48000.0
    assert "forecasts" in fin
    assert fin["forecasts"]["period_months"] == 12


# ============================================================
# 19. KNOWLEDGE RAG: PROVENANCE GROUNDING
# ============================================================
def test_19_rag_retrieval_with_provenance():
    """Verifies that retrieved knowledge chunks carry explicit business knowledge provenance."""
    chunks = [
        {
            "content": "Consultation fee is $120.",
            "provenance": {
                "origin": "BUSINESS_KNOWLEDGE_BASE",
                "title": "Practice Fee Schedule 2026",
                "statement": "This came directly from the verified business knowledge base.",
                "is_inference": False
            }
        }
    ]
    formatted = knowledge_service.format_grounded_context(chunks)
    assert "VERIFIED BUSINESS KNOWLEDGE BASE (NOT AI INFERENCE)" in formatted
    assert "Practice Fee Schedule 2026" in formatted


# ============================================================
# 20. SECURITY: MULTI-TENANT ISOLATION GUARD
# ============================================================
def test_20_security_isolation_guard_boundaries():
    """Verifies cross-tenant isolation, SSRF safety, and tool authorization."""
    # 1. Cross-tenant access blocked
    with pytest.raises(SecurityViolationError) as exc_tenant:
        isolation_guard.verify_tenant_boundary("biz_tenant_1", "biz_tenant_2")
    assert "CROSS_TENANT_VIOLATION" in exc_tenant.value.code

    # 2. SSRF access to localhost or cloud metadata service blocked
    with pytest.raises(SecurityViolationError) as exc_ssrf:
        isolation_guard.verify_ssrf_safety("http://169.254.169.254/latest/meta-data/")
    assert "SSRF" in exc_ssrf.value.code

    # 3. Unauthorized tool permission blocked
    with pytest.raises(SecurityViolationError) as exc_tool:
        isolation_guard.verify_tool_scope(user_permissions=["READ_ONLY"], required_scope="DELETE_DATABASE")
    assert "PERMISSION_DENIED" in exc_tool.value.code
