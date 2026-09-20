"""
Rine Forge Systems V5 - Phase AR: Built-In Free Local AI Core Test Suite
Exhaustive verification across all 20 required system scenarios:
1. Normal conversation
2. Business question
3. Customer-targeted response
4. Tool calling
5. Voice transcription
6. Voice response
7. Website generation
8. Logo generation
9. Website audit
10. Business plan
11. Financial calculations
12. Artifact creation
13. Project management
14. Knowledge retrieval
15. Model failure
16. Ollama offline
17. Missing model
18. Sandbox failure
19. Multi-tenant isolation
20. Security boundaries
"""
import uuid
import pytest
from datetime import datetime, date, timezone
from sqlalchemy import select
from httpx import AsyncClient, ASGITransport

from backend.app.main import app
from backend.app.models.v5 import (
    Business, Customer, Appointment, V5Project, V5WorkbenchArtifact,
    V5RegisteredModel, AuditLog
)
from backend.app.ai.gateway.core import ai_gateway
from backend.app.ai.gateway.interface import ChatMessage, AIOptions
from backend.app.ai.gateway.router import (
    ModelRouter, CAPABILITY_CHAT, CAPABILITY_CODING, CAPABILITY_VISION,
    POLICY_LOCAL_ONLY
)
from backend.app.ai.tool_registry import tool_registry
from backend.app.channels.voice.engine import (
    LocalSpeechToTextProvider, LocalTextToSpeechProvider
)
from backend.app.ai.memory_manager import memory_manager
from backend.app.workbench.agents.project_manager import project_manager_agent
from backend.app.workbench.agents.website_builder import website_builder_agent
from backend.app.workbench.agents.brand_generator import brand_generator_agent
from backend.app.workbench.agents.financial_model import financial_model_agent
from backend.app.workbench.agents.website_auditor import website_audit_agent
from backend.app.workbench.agents.business_plan import business_plan_agent
from backend.app.workbench.agents.customer_response import customer_response_agent
from backend.app.workbench.hardware_profiler import hardware_profiler
from backend.app.workbench.intelligence_orchestrator import ForgeVerifier


# ============================================================
# 1. NORMAL CONVERSATION
# ============================================================
@pytest.mark.asyncio
async def test_01_normal_conversation():
    """Verifies standard conversational turn through AI gateway using local/mock adapter."""
    messages = [
        ChatMessage(role="system", content="You are a helpful AI business assistant."),
        ChatMessage(role="user", content="Hello Rine Forge, what can you do for my business?")
    ]
    resp = await ai_gateway.generate(messages, AIOptions(tier="LOCAL_MODEL"))
    assert resp.text is not None
    assert len(resp.text) > 0
    assert resp.provider in ["ollama", "mock"]


# ============================================================
# 2. BUSINESS QUESTION
# ============================================================
@pytest.mark.asyncio
async def test_02_business_question(async_session):
    """Verifies business information retrieval tool answers questions accurately."""
    biz = Business(
        id=str(uuid.uuid4()),
        name="Austin Family Smiles",
        industry="Dental Clinic",
        business_hours={"mon_fri": "9am-5pm", "sat": "10am-2pm"}
    )
    async_session.add(biz)
    await async_session.commit()

    res = await tool_registry.execute_tool(
        session=async_session,
        business_id=biz.id,
        tool_name="check_business_hours",
        arguments={}
    )
    assert res["status"] == "success"
    assert res["name"] == "Austin Family Smiles"
    assert "business_hours" in res


# ============================================================
# 3. CUSTOMER-TARGETED RESPONSE
# ============================================================
@pytest.mark.asyncio
async def test_03_customer_targeted_response():
    """Verifies that customer intent is answered directly without robotic filler loops."""
    resp = await customer_response_agent.generate_response(
        business={"name": "Austin Smiles", "business_hours": "Saturday: 9am - 2pm"},
        customer_message="What are your Saturday hours?"
    )
    assert "Saturday" in resp["response"]
    assert resp["intent"] == "HOURS_INQUIRY"


# ============================================================
# 4. TOOL CALLING
# ============================================================
@pytest.mark.asyncio
async def test_04_tool_calling(async_session):
    """Verifies database-backed tool execution for appointments and lead creation."""
    biz = Business(id=str(uuid.uuid4()), name="Downtown Clinic", industry="Dental")
    cust = Customer(id=str(uuid.uuid4()), business_id=biz.id, name="Sarah Jenkins", email="sarah@example.com")
    async_session.add_all([biz, cust])
    await async_session.commit()

    # 1. Check appointments
    slots = await tool_registry.execute_tool(
        session=async_session,
        business_id=biz.id,
        tool_name="check_appointments",
        arguments={"date": date.today().isoformat()}
    )
    assert slots["status"] == "success"
    assert "available_slots" in slots

    # 2. Create lead
    lead_res = await tool_registry.execute_tool(
        session=async_session,
        business_id=biz.id,
        tool_name="create_lead",
        arguments={"message": "Interested in tooth whitening"},
        customer_id=cust.id
    )
    assert lead_res["status"] == "success"
    assert "lead_id" in lead_res


# ============================================================
# 5. VOICE TRANSCRIPTION
# ============================================================
@pytest.mark.asyncio
async def test_05_voice_transcription():
    """Verifies LocalSpeechToTextProvider audio-to-text transcription and confidence scoring."""
    stt = LocalSpeechToTextProvider()
    res = await stt.transcribe("I would like to schedule a consultation for Friday.")
    assert res["transcript"] == "I would like to schedule a consultation for Friday."
    assert res["confidence"] >= 0.9
    assert res["is_local"] is True
    assert res["provider"] == "LOCAL_STT"


# ============================================================
# 6. VOICE RESPONSE
# ============================================================
@pytest.mark.asyncio
async def test_06_voice_response():
    """Verifies LocalTextToSpeechProvider voice profiles: professional, friendly, warm, energetic, calm."""
    tts = LocalTextToSpeechProvider()
    status = tts.get_status()
    assert "professional" in status["available_profiles"]
    assert "friendly" in status["available_profiles"]
    assert "warm" in status["available_profiles"]

    synth = await tts.synthesize("Welcome to Austin Dental. How can we care for you today?", voice_id="warm")
    assert synth["speech_directive"] == "LOCAL_SYNTHESIS"
    assert synth["voice_profile"] == "warm"
    assert synth["is_local"] is True


# ============================================================
# 7. WEBSITE GENERATION
# ============================================================
@pytest.mark.asyncio
async def test_07_website_generation():
    """Verifies responsive multi-page Tailwind website code generation."""
    site = await website_builder_agent.build_website(
        business_name="Austin Dental Studio",
        business_category="Dental Clinic",
        location="Austin, TX"
    )
    assert len(site["pages"]) >= 5
    html = site["html_code"]
    assert "<!DOCTYPE html>" in html
    assert "tailwindcss.com" in html
    assert "Austin Dental Studio" in html


# ============================================================
# 8. LOGO GENERATION
# ============================================================
@pytest.mark.asyncio
async def test_08_logo_generation():
    """Verifies parametric SVG vector logo marks and accessible palettes."""
    brand = await brand_generator_agent.generate_brand_identity(
        business_name="Apex Dental",
        industry="Dental Clinic"
    )
    assert len(brand["concepts"]) >= 4
    svg = brand["active_concept"]["logo_svg"]
    assert svg.startswith("<svg")
    assert svg.endswith("</svg>")
    assert len(brand["active_concept"]["palette"]) >= 3


# ============================================================
# 9. WEBSITE AUDIT
# ============================================================
@pytest.mark.asyncio
async def test_09_website_audit():
    """Verifies 8-dimension scorecard with verified facts and honest unmeasurable disclosures."""
    audit = await website_audit_agent.audit_website(
        business_context={"name": "Austin Dental Care", "category": "Dental"}
    )
    assert len(audit["dimensions"]) >= 6
    assert "unmeasurable_metrics" in audit
    assert len(audit["verified_facts"]) > 0


# ============================================================
# 10. BUSINESS PLAN
# ============================================================
@pytest.mark.asyncio
async def test_10_business_plan():
    """Verifies strategic business plan with clearly isolated assumption boundaries."""
    plan = await business_plan_agent.generate_business_plan(
        business_name="Lone Star Dental",
        business_category="Dental Clinic",
        location="Austin, TX"
    )
    assert "executive_summary" in plan["sections"]
    assert len(plan["sections"]) >= 4
    assert plan["status"] == "READY"


# ============================================================
# 11. FINANCIAL CALCULATIONS
# ============================================================
def test_11_financial_calculations():
    """Verifies 100% deterministic mathematical formulas (Zero AI arithmetic hallucination)."""
    fin = financial_model_agent.calculate_financials(
        monthly_revenue=50000.0,
        cogs_rate=0.20
    )
    metrics = fin["metrics"]
    assert metrics["cogs"] == 10000.0
    assert metrics["gross_profit"] == 40000.0
    assert metrics["gross_margin_pct"] == 80.0
    assert "csv_content" in fin
    assert len(fin["csv_content"].splitlines()) == 13


# ============================================================
# 12. ARTIFACT CREATION
# ============================================================
@pytest.mark.asyncio
async def test_12_artifact_creation(async_session):
    """Verifies deliverable artifact persistence in V5WorkbenchArtifact."""
    biz = Business(id=str(uuid.uuid4()), name="Test Dental", industry="Dental")
    proj = V5Project(
        id=str(uuid.uuid4()),
        business_id=biz.id,
        name="Website Revamp",
        status="PLANNING",
        input_request="Revamp dental website design and branding"
    )
    art = V5WorkbenchArtifact(
        id=str(uuid.uuid4()),
        project_id=proj.id,
        business_id=biz.id,
        artifact_type="CODE",
        name="Homepage HTML",
        content_text="<html><body>Hello</body></html>",
        status="READY"
    )
    async_session.add_all([biz, proj, art])
    await async_session.commit()

    stmt = select(V5WorkbenchArtifact).where(V5WorkbenchArtifact.id == art.id)
    res = await async_session.execute(stmt)
    saved = res.scalar_one()
    assert saved.artifact_type == "CODE"
    assert saved.status == "READY"


# ============================================================
# 13. PROJECT MANAGEMENT
# ============================================================
def test_13_project_management():
    """Verifies ProjectManagerAgent decomposes broad requests into dependency-ordered stages."""
    plan = project_manager_agent.formulate_project_plan(
        "Build my new restaurant business online.",
        business_name="Austin Trattoria",
        industry="Restaurant"
    )
    assert plan["stages_count"] >= 6
    priorities = [s["priority"] for s in plan["stages"]]
    assert priorities == sorted(priorities)
    assert all(s["status"] == "WAITING" for s in plan["stages"])


# ============================================================
# 14. KNOWLEDGE RETRIEVAL
# ============================================================
@pytest.mark.asyncio
async def test_14_knowledge_retrieval(async_session):
    """Verifies multi-tenant knowledge retrieval via search_knowledge tool."""
    biz = Business(id=str(uuid.uuid4()), name="Knowledge Test Biz", industry="Consulting")
    async_session.add(biz)
    await async_session.commit()

    res = await tool_registry.execute_tool(
        session=async_session,
        business_id=biz.id,
        tool_name="search_knowledge",
        arguments={"query": "What are your refund policies?"}
    )
    assert res["status"] == "success"
    assert "results" in res


# ============================================================
# 15. MODEL FAILURE HANDLING
# ============================================================
def test_15_model_failure_handling():
    """Verifies model router provides safe fallback without crashing."""
    router = ModelRouter()
    fb = router.get_fallback_route("ollama")
    assert fb is not None
    assert fb[0] is not None


# ============================================================
# 16. OLLAMA OFFLINE
# ============================================================
@pytest.mark.asyncio
async def test_16_ollama_offline():
    """Verifies truthful reporting of OFFLINE status with setup instructions when Ollama is down."""
    status = await hardware_profiler.check_ollama_status()
    assert "status" in status
    assert status["status"] in ["AVAILABLE", "OFFLINE", "ERROR"]
    if not status["is_reachable"]:
        assert "instructions" in status
        assert "ollama serve" in status["instructions"]


# ============================================================
# 17. MISSING MODEL
# ============================================================
def test_17_missing_model():
    """Verifies MODEL_REQUIRED response when preferred model is not installed."""
    router = ModelRouter()
    provider, model, meta = router.resolve_route_by_capability(
        CAPABILITY_VISION,
        policy=POLICY_LOCAL_ONLY,
        installed_models=["llama3:8b"]
    )
    assert meta["status"] == "MODEL_REQUIRED"
    assert "ollama pull" in meta["instructions"]


# ============================================================
# 18. SANDBOX FAILURE GUARDRAILS
# ============================================================
def test_18_sandbox_failure_guardrail():
    """Verifies ForgeVerifier detects malicious or broken markup in generated sandbox code."""
    malicious_data = {
        "html_code": "<!DOCTYPE html><html><body><script>eval('malicious()')</script></body></html>"
    }
    ver = ForgeVerifier.verify_deliverable("WEBSITE_CREATION", malicious_data)
    assert ver.is_valid is False
    assert any("Disallowed script" in err for err in ver.errors)


# ============================================================
# 19. MULTI-TENANT ISOLATION
# ============================================================
def test_19_multi_tenant_isolation():
    """Verifies business memory strictly isolates data between different workspaces."""
    memory_manager.business.set_rule("workspace-A", "vip_discount", 20)
    memory_manager.business.set_rule("workspace-B", "vip_discount", 5)

    ctx_a = memory_manager.business.get_business_context("workspace-A")
    ctx_b = memory_manager.business.get_business_context("workspace-B")

    assert ctx_a["rules"]["vip_discount"] == 20
    assert ctx_b["rules"]["vip_discount"] == 5
    assert ctx_a != ctx_b


# ============================================================
# 20. SECURITY BOUNDARIES & AUDIT LOGGING
# ============================================================
@pytest.mark.asyncio
async def test_20_security_boundaries(async_session):
    """Verifies that tool executions record security audit trail in AuditLog."""
    biz = Business(id=str(uuid.uuid4()), name="Secure Tenant", industry="Finance")
    async_session.add(biz)
    await async_session.commit()

    # Execute tool
    await tool_registry.execute_tool(
        session=async_session,
        business_id=biz.id,
        tool_name="check_business_hours",
        arguments={},
        user_id="operator-test"
    )

    # Verify audit log was recorded
    stmt = select(AuditLog).where(AuditLog.business_id == biz.id)
    res = await async_session.execute(stmt)
    logs = res.scalars().all()
    assert len(logs) >= 1
    assert "TOOL_EXECUTION" in logs[0].action
