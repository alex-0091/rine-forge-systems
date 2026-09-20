"""
Rine Forge Systems V5 - Phase AS5 Master Test Suite
Verifies the complete Forge Intelligence Fabric:
10 End-to-End Task Flows, Adversarial Resilience, Verification & Self-Repair,
Permission Engine & Human Approval Gates, Epistemological Memory, and Resource Governor.
"""
import pytest
from typing import Dict, Any

from backend.app.ai.fabric import (
    forge_orchestrator,
    FabricRequest,
    TaskClassifier,
    TaskCategory,
    TaskComplexity,
    IntentEngine,
    ExecutionPlanner,
    AgentRegistry,
    ForgeToolRegistry,
    ToolPermissionEngine,
    PermissionDecision,
    KnowledgeRouter,
    ContextBuilder,
    ForgeVerifier,
    ArtifactEngine,
    ArtifactType,
    ForgeProjectMemory,
    FactProvenance,
    HumanApprovalGate,
    BusinessToAICompanyEngine,
    AIEmployeeGeneratorEngine,
    SimulationEngine,
    ForgeEventBus,
    ResourceGovernor
)


# ============================================================
# 1. TEST 1: FAST-PATH INQUIRY ("What time do we close?")
# ============================================================
@pytest.mark.asyncio
async def test_01_fast_path_operating_hours():
    biz = {
        "name": "Austin Dental Care",
        "business_hours": "Mon-Fri 8am-6pm, Sat 9am-2pm",
        "services": ["Implant Care", "Emergency Relief"]
    }
    req = FabricRequest(
        workspace_id="ws_dentist_01",
        request="What time do we close?",
        business_context=biz
    )
    res = await forge_orchestrator.process_request(req)
    assert res.status == "COMPLETED"
    assert res.requires_approval is False
    assert "8am-6pm" in res.response_text or "close" in res.response_text.lower() or "open" in res.response_text.lower()
    assert "searchKnowledge" in res.tools_invoked


# ============================================================
# 2. TEST 2: CUSTOMER RESPONSE ("Reply to this customer.")
# ============================================================
@pytest.mark.asyncio
async def test_02_customer_response_intent():
    biz = {
        "name": "Austin Dental Care",
        "business_hours": "Mon-Fri 8am-6pm",
        "services": ["Implant Care", "General Consultation"]
    }
    req = FabricRequest(
        workspace_id="ws_dentist_01",
        request="Reply to this customer asking for an appointment tomorrow.",
        business_context=biz
    )
    res = await forge_orchestrator.process_request(req)
    assert res.status == "COMPLETED"
    assert res.selected_agent == "CustomerResponseAgent"
    assert len(res.response_text) > 10


# ============================================================
# 3. TEST 3: WEBSITE BUILD ("Build a website.")
# ============================================================
@pytest.mark.asyncio
async def test_03_website_build_pipeline():
    biz = {
        "name": "Austin Dental Implants",
        "services": ["Titanium Implants", "All-on-4"]
    }
    req = FabricRequest(
        workspace_id="ws_dentist_01",
        request="Build a website for my dental clinic in Austin.",
        business_context=biz
    )
    res = await forge_orchestrator.process_request(req)
    assert res.status == "COMPLETED"
    assert res.selected_agent == "WebsiteBuilderAgent"
    assert len(res.artifacts_created) >= 1
    assert res.artifacts_created[0]["artifact_type"] == ArtifactType.WEBSITE.value
    assert "runSandboxBuild" in res.tools_invoked


# ============================================================
# 4. TEST 4: AUDIT SCREENSHOT ("Audit this screenshot.")
# ============================================================
@pytest.mark.asyncio
async def test_04_audit_screenshot_flow():
    biz = {"name": "Austin Smile Design"}
    attachments = [{"name": "hero.png", "type": "image/png", "data": "base64placeholder"}]
    req = FabricRequest(
        workspace_id="ws_dentist_01",
        request="Audit this screenshot of our landing page.",
        business_context=biz,
        attachments=attachments
    )
    res = await forge_orchestrator.process_request(req)
    assert res.status == "COMPLETED"
    assert res.selected_agent == "WebsiteAuditAgent"
    assert "facts" in res.deliverable_data
    assert "recommendations" in res.deliverable_data


# ============================================================
# 5. TEST 5: BUSINESS PLAN ("Create a business plan.")
# ============================================================
@pytest.mark.asyncio
async def test_05_business_plan_generation():
    biz = {"name": "Austin Orthopedic Care"}
    req = FabricRequest(
        workspace_id="ws_ortho_01",
        request="Create a business plan for our clinic.",
        business_context=biz
    )
    res = await forge_orchestrator.process_request(req)
    assert res.status == "COMPLETED"
    assert res.selected_agent == "BusinessPlanAgent"
    assert len(res.artifacts_created) >= 1
    assert res.artifacts_created[0]["artifact_type"] == ArtifactType.BUSINESS_PLAN.value


# ============================================================
# 6. TEST 6: FINANCIAL ANALYSIS ("Analyze these finances.")
# ============================================================
@pytest.mark.asyncio
async def test_06_financial_analysis_determinism():
    biz = {"name": "Apex SaaS Corp"}
    req = FabricRequest(
        workspace_id="ws_saas_01",
        request="Analyze these finances with 12-month projections.",
        business_context=biz
    )
    res = await forge_orchestrator.process_request(req)
    assert res.status == "COMPLETED"
    assert res.selected_agent in ["FinancialAgent", "FinancialModelAgent"]
    metrics = res.deliverable_data.get("metrics", {})
    assert metrics.get("gross_profit") == round(metrics.get("monthly_revenue", 0) - metrics.get("cogs", 0), 2)


# ============================================================
# 7. TEST 7: AI RECEPTIONIST BLUEPRINT ("Create an AI receptionist.")
# ============================================================
def test_07_ai_receptionist_generation():
    blueprint = AIEmployeeGeneratorEngine.generate_blueprint(
        employee_type="AI Receptionist",
        business_name="Austin Smiles"
    )
    assert blueprint["role"] == "Front Desk & Inquiry Receptionist"
    assert "searchKnowledge" in blueprint["tools"]
    assert "createAppointment" in blueprint["tools"]
    assert len(blueprint["test_scenarios"]) == 10
    assert blueprint["lifecycle_state"] == "PREVIEW"


# ============================================================
# 8. TEST 8: VOICE RECEPTIONIST BLUEPRINT ("Create a voice receptionist.")
# ============================================================
def test_08_voice_receptionist_generation():
    blueprint = AIEmployeeGeneratorEngine.generate_blueprint(
        employee_type="AI Voice Receptionist",
        business_name="Austin Smiles"
    )
    assert blueprint["role"] == "Telephony Voice Response Agent"
    assert "createVoiceSession" in blueprint["tools"]


# ============================================================
# 9. TEST 9: LEAD QUALIFICATION ("Find and qualify leads.")
# ============================================================
@pytest.mark.asyncio
async def test_09_lead_qualification_flow():
    biz = {"name": "Austin Dental Implants"}
    req = FabricRequest(
        workspace_id="ws_dentist_01",
        request="Find and qualify leads in Austin for dental implants.",
        business_context=biz
    )
    res = await forge_orchestrator.process_request(req)
    assert res.category == TaskCategory.LEAD_QUALIFICATION.value
    assert res.selected_agent == "LeadQualificationAgent"


# ============================================================
# 10. TEST 10: APPROVAL STOP GATE ("Send this customer a WhatsApp.")
# ============================================================
@pytest.mark.asyncio
async def test_10_approval_stop_for_whatsapp():
    biz = {"name": "Austin Dental Care"}
    req = FabricRequest(
        workspace_id="ws_dentist_01",
        request="Send this customer a WhatsApp message confirming their booking tomorrow.",
        business_context=biz,
        allow_external_side_effects=False
    )
    res = await forge_orchestrator.process_request(req)
    # MUST stop at approval gate!
    assert res.status == "APPROVAL_PENDING"
    assert res.requires_approval is True
    assert res.approval_request is not None
    assert res.approval_request["action_type"] == "sendWhatsApp"

    # Verify pending queue in HumanApprovalGate
    pending = HumanApprovalGate.list_pending(workspace_id="ws_dentist_01")
    assert len(pending) >= 1
    assert any(p.action_type == "sendWhatsApp" for p in pending)

    # Resolve approval
    appr_id = res.approval_request["id"]
    resolved = HumanApprovalGate.resolve_request(appr_id, approved=True, operator_id="admin")
    assert resolved.status == "APPROVED"


# ============================================================
# 11. ADVERSARIAL: PROMPT INJECTION RESISTANCE
# ============================================================
def test_11_adversarial_prompt_injection_simulation():
    blueprint = AIEmployeeGeneratorEngine.generate_blueprint("AI Receptionist", "Austin Smiles")
    scorecard = SimulationEngine.run_simulation(blueprint)
    assert scorecard.total_scenarios == 10
    # Scenario 8 is prompt injection
    scen_8 = next(s for s in scorecard.results if s.test_type == "prompt_injection" or s.scenario_id == "sim-08")
    assert scen_8.verdict == "PASS"
    assert "role boundaries" in scen_8.reason


# ============================================================
# 12. PERMISSION ENGINE: UNREGISTERED / DENIED TOOLS
# ============================================================
def test_12_permission_engine_denial():
    decision = ToolPermissionEngine.evaluate(
        tool_name="unregistered_malicious_tool",
        agent_name="CustomerResponseAgent",
        workspace_id="ws_test"
    )
    assert decision["decision"] == PermissionDecision.DENY.value


# ============================================================
# 13. EPISTEMOLOGICAL MEMORY SEPARATION
# ============================================================
def test_13_epistemological_memory_separation():
    ws = "ws_epistemic_01"
    ForgeProjectMemory.set(ws, "brand_color", "#1E40AF", FactProvenance.USER_PROVIDED.value)
    ForgeProjectMemory.set(ws, "inferred_budget", "$10,000", FactProvenance.AI_INFERRED.value)

    ctx = ForgeProjectMemory.get_all_context(ws)
    assert "brand_color" in ctx["authoritative_facts"]
    assert "inferred_budget" in ctx["inferences"]
    assert "inferred_budget" not in ctx["authoritative_facts"]


# ============================================================
# 14. VERIFIER & SELF-REPAIR LOOP
# ============================================================
def test_14_verifier_arithmetic_hallucination_detection():
    flawed_data = {
        "metrics": {
            "monthly_revenue": 10000.0,
            "cogs": 3000.0,
            "gross_profit": 9500.0  # Obvious math hallucination (should be 7000)
        }
    }
    report = ForgeVerifier.verify(TaskCategory.FINANCIAL_ANALYSIS.value, flawed_data)
    assert report.is_valid is False
    assert any("Arithmetic hallucination" in e for e in report.errors)


# ============================================================
# 15. RESOURCE GOVERNOR PRESSURE EVALUATION
# ============================================================
def test_15_resource_governor_pressure():
    pressure = ResourceGovernor.get_system_pressure()
    assert "ram_used_pct" in pressure
    assert "ram_available_gb" in pressure
    assert "active_jobs" in pressure
    assert pressure["max_concurrent_jobs"] >= 1
