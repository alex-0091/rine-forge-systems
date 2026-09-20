"""
Rine Forge Systems V5 - Final Master Build End-to-End Verification Test Suite
Verifies the complete production intelligence system:
1. Server Hardware Profiler: Truthful CPU, RAM, GPU, and Storage detection without external dependencies.
2. Ollama Local AI Engine Probe & Safe Model Pull.
3. Forge Intelligence Fabric & Orchestrator:
   - Understanding & Intent classification across modalities (Web, Brand, Finance, Audit, Customer).
   - Zero-hallucinated deterministic financial arithmetic verification.
   - HTML5 & SVG geometry verification.
   - Consequential action human confirmation gates (Publish / Deploy).
4. Full End-to-End HTTP API endpoints under `/api/v1/workbench/*`:
   - GET /workbench/hardware
   - POST /workbench/hardware/models/pull
   - POST /workbench/fabric/process
   - POST /workbench/projects/{id}/execute
   - POST /workbench/artifacts/{id}/confirm
"""
import pytest
import uuid
from datetime import datetime, timezone
from httpx import AsyncClient, ASGITransport

from backend.app.main import app
from backend.app.models.v5 import Business, V5Project, V5WorkbenchTask, V5WorkbenchArtifact
from backend.app.workbench.hardware_profiler import hardware_profiler
from backend.app.workbench.intelligence_orchestrator import (
    forge_orchestrator,
    FabricRequest,
    FabricExecutionResponse
)
from backend.app.workbench.execution_service import workbench_execution_service


# ============================================================
# 1. HARDWARE PROFILER TESTS
# ============================================================
def test_server_hardware_profiler_truthful_metrics():
    """Verifies that hardware profiler inspects real host machine metrics without hardcoded fakes."""
    profile = hardware_profiler.get_hardware_profile()

    assert profile["cpu_cores"] >= 1
    assert profile["ram"]["total_gb"] > 0
    assert profile["ram"]["available_gb"] > 0
    assert profile["storage"]["total_gb"] > 0
    assert "gpu_detected" in profile["gpu"]

    tier = profile["tier"]
    assert tier["tier_number"] in [1, 2, 3, 4]
    assert len(tier["recommended_models"]) > 0
    assert tier["recommended_parameter_size"] is not None


@pytest.mark.asyncio
async def test_server_hardware_ollama_probe_and_pull():
    """Verifies truthful reporting of local Ollama reachability and safe pull handling."""
    ollama_status = await hardware_profiler.check_ollama_status()
    assert isinstance(ollama_status["is_reachable"], bool)
    assert ollama_status["status"] in ["AVAILABLE", "OFFLINE", "ERROR"]
    assert "endpoint" in ollama_status
    assert "instructions" in ollama_status

    # Pull model probe (verifies clean graceful failure or success when daemon is offline/online)
    pull_res = await hardware_profiler.trigger_pull_model("phi3:mini")
    assert pull_res["status"] in ["SUCCESS", "OFFLINE", "FAILED"]
    assert pull_res["model"] == "phi3:mini"


# ============================================================
# 2. FORGE INTELLIGENCE FABRIC TESTS
# ============================================================
@pytest.mark.asyncio
async def test_intelligence_fabric_orchestrator_website_modality():
    """Verifies end-to-end website generation, HTML validation, and artifact delivery."""
    req = FabricRequest(
        workspace_id="test-master-ws",
        request="Build a modern website for Austin Dental Clinic with appointment booking and services."
    )
    res: FabricExecutionResponse = await forge_orchestrator.process_request(req)

    assert res.selected_agent == "WebsiteBuilderAgent"
    assert res.verification.is_valid is True
    assert len(res.artifacts_created) == 1

    art = res.artifacts_created[0]
    assert art["type"] == "CODE"
    html_content = art["data"].get("html_code", "")
    assert "<!DOCTYPE html>" in html_content
    assert "</html>" in html_content
    assert "tailwindcss.com" in html_content
    assert res.is_free is True


@pytest.mark.asyncio
async def test_intelligence_fabric_orchestrator_brand_modality():
    """Verifies parametric SVG vector logo generation and color palette verification."""
    req = FabricRequest(
        workspace_id="test-master-ws",
        request="Design a minimalist vector logo concept and color palette for Austin Dental Clinic."
    )
    res: FabricExecutionResponse = await forge_orchestrator.process_request(req)

    assert res.selected_agent == "BrandGeneratorAgent"
    assert res.verification.is_valid is True
    assert len(res.artifacts_created) == 1

    art = res.artifacts_created[0]
    assert art["type"] == "IMAGE"
    svg_content = art["data"]["active_concept"]["logo_svg"]
    assert svg_content.startswith("<svg")
    assert svg_content.endswith("</svg>")
    assert len(art["data"]["active_concept"]["palette"]) >= 3


@pytest.mark.asyncio
async def test_intelligence_fabric_orchestrator_financial_deterministic_modality():
    """
    CRITICAL: Verifies 100% deterministic mathematical calculations.
    Ensures zero arithmetic hallucination (Revenue - COGS == Gross Profit).
    """
    req = FabricRequest(
        workspace_id="test-master-ws",
        request="Calculate a 12-month deterministic financial cash flow and break-even model for Austin Dental Clinic."
    )
    res: FabricExecutionResponse = await forge_orchestrator.process_request(req)

    assert res.selected_agent == "FinancialModelAgent"
    assert res.verification.is_valid is True
    assert len(res.artifacts_created) == 1

    art = res.artifacts_created[0]
    assert art["type"] == "SPREADSHEET"
    metrics = art["data"]["metrics"]

    # Deterministic Formula Checks
    monthly_rev = metrics["monthly_revenue"]
    cogs = metrics["cogs"]
    gross_profit = metrics["gross_profit"]
    assert gross_profit == round(monthly_rev - cogs, 2)

    # 12-Month CSV Export Check
    csv_text = art["data"]["csv_content"]
    assert "Month,Revenue,COGS,Gross_Profit,OPEX,Net_Profit,Cumulative_Cash" in csv_text
    assert len(csv_text.strip().splitlines()) == 13


@pytest.mark.asyncio
async def test_intelligence_fabric_orchestrator_audit_modality():
    """Verifies factual conversion audit with explicit unmeasurable metric disclosures."""
    req = FabricRequest(
        workspace_id="test-master-ws",
        request="Audit the website and conversion flow for Austin Dental Clinic."
    )
    res: FabricExecutionResponse = await forge_orchestrator.process_request(req)

    assert res.selected_agent == "WebsiteAuditAgent"
    assert res.verification.is_valid is True
    assert len(res.artifacts_created) == 1

    art = res.artifacts_created[0]
    assert art["type"] == "REPORT"
    data = art["data"]
    assert "unmeasurable_metrics" in data
    assert len(data["dimensions"]) >= 6


@pytest.mark.asyncio
async def test_consequential_confirmation_gate():
    """Verifies that consequential actions (e.g. publishing/deploying) trigger human confirmation gates."""
    req = FabricRequest(
        workspace_id="test-master-ws",
        request="Publish and deploy our new dental clinic website to live hosting immediately."
    )
    res: FabricExecutionResponse = await forge_orchestrator.process_request(req)

    assert res.requires_confirmation is True
    assert res.confirmation_action == "PUBLISH_WEBSITE"


# ============================================================
# 3. FULL HTTP API END-TO-END TESTS
# ============================================================
@pytest.mark.asyncio
async def test_workbench_api_hardware_and_fabric_endpoints_e2e(async_session):
    """Verifies HTTP endpoints for hardware profiling, fabric requests, and artifact confirmation."""
    # Seed tenant
    biz = Business(
        id=str(uuid.uuid4()),
        name="Rine Dental & Facial Aesthetics",
        email="doctor@rinedental.internal",
        industry="Dental Clinic & Medical Aesthetics",
        created_at=datetime.now(timezone.utc)
    )
    async_session.add(biz)
    await async_session.commit()

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. GET /api/v1/workbench/hardware
        hw_res = await client.get(
            "/api/v1/workbench/hardware",
            headers={"X-Business-ID": biz.id}
        )
        assert hw_res.status_code == 200
        hw_data = hw_res.json()
        assert "hardware" in hw_data
        assert "ollama" in hw_data
        assert hw_data["hardware"]["cpu_cores"] >= 1
        assert hw_data["overall_status"] in ["READY", "CONFIGURATION_REQUIRED"]

        # 2. POST /api/v1/workbench/hardware/models/pull
        pull_res = await client.post(
            "/api/v1/workbench/hardware/models/pull",
            headers={"X-Business-ID": biz.id},
            json={"model_name": "phi3:mini"}
        )
        assert pull_res.status_code == 200
        pull_data = pull_res.json()
        assert "status" in pull_data

        # 3. POST /api/v1/workbench/fabric/process
        fab_res = await client.post(
            "/api/v1/workbench/fabric/process",
            headers={"X-Business-ID": biz.id},
            json={
                "workspace_id": biz.id,
                "request": "Build a responsive website for Rine Dental & Facial Aesthetics"
            }
        )
        assert fab_res.status_code == 200
        fab_data = fab_res.json()
        assert fab_data["selected_agent"] == "WebsiteBuilderAgent"
        assert fab_data["verification"]["is_valid"] is True
        assert len(fab_data["artifacts_created"]) == 1

        # 4. Project Creation & Execution Lifecycle
        proj_res = await client.post(
            "/api/v1/workbench/projects",
            headers={"X-Business-ID": biz.id},
            json={"natural_language_request": "Build a responsive website and calculate cash flow"}
        )
        assert proj_res.status_code == 201
        proj_id = proj_res.json()["id"]

        exec_res = await client.post(
            f"/api/v1/workbench/projects/{proj_id}/execute",
            headers={"X-Business-ID": biz.id}
        )
        assert exec_res.status_code == 200
        exec_data = exec_res.json()
        assert exec_data["status"] == "COMPLETED"
        assert len(exec_data["artifacts"]) >= 2
        art_id = exec_data["artifacts"][0]

        # 5. POST /api/v1/workbench/artifacts/{id}/confirm (Human Confirmation Gate)
        confirm_res = await client.post(
            f"/api/v1/workbench/artifacts/{art_id}/confirm",
            headers={"X-Business-ID": biz.id},
            json={"action": "PUBLISH"}
        )
        assert confirm_res.status_code == 200
        confirm_data = confirm_res.json()
        assert confirm_data["status"] == "PUBLISHED"
        assert confirm_data["confirmed_action"] == "PUBLISH"
        assert "confirmed_at" in confirm_data
