"""
Rine Forge Systems V5 - Phase AQ: AI Business Workbench Test Suite
Comprehensive testing of:
1. BusinessRequestPlanner natural language decomposition, fact vs assumption separation, missing info detection.
2. ModelHub free-first routing policy, workspace limits, and fallback telemetry.
3. TaskRouter catalog validation across all 23 defined task types.
4. WebsiteBuilderAgent multi-page responsive architecture & sandboxed markup.
5. WebsiteAuditAgent 8-dimension scorecard, verified facts vs recommendations, and honest disclosure of unmeasurable metrics.
6. BrandGeneratorAgent parametric SVG vector generation, palette contrast, and style transformations.
7. FinancialModelAgent deterministic mathematical accuracy (100% exact math formulas, zero AI arithmetic hallucinations) and CSV generation.
8. CustomerResponseAgent direct intent resolution and tool execution.
9. WorkbenchExecutionService project & task execution lifecycle, step logging, and artifact creation.
10. Universal Command Box ("Ask Rine Forge") execution.
11. Full HTTP API endpoint validation under `/api/v1/workbench/*`.
"""
import pytest
import pytest_asyncio
import uuid
from datetime import datetime, timezone
from sqlalchemy import select
from httpx import AsyncClient, ASGITransport

from backend.app.main import app
from backend.app.models.v5 import (
    Business,
    V5Project,
    V5WorkbenchTask,
    V5WorkbenchArtifact
)
from backend.app.workbench.planner import business_request_planner, PlannedProject
from backend.app.workbench.model_hub import model_hub, ModelSelectionPolicy, WorkspaceLimits
from backend.app.workbench.task_router import task_router
from backend.app.workbench.agents.website_builder import website_builder_agent
from backend.app.workbench.agents.website_auditor import website_audit_agent
from backend.app.workbench.agents.brand_generator import brand_generator_agent
from backend.app.workbench.agents.financial_model import financial_model_agent
from backend.app.workbench.agents.customer_response import customer_response_agent
from backend.app.workbench.agents.business_plan import business_plan_agent
from backend.app.workbench.agents.marketing import marketing_agent
from backend.app.workbench.agents.market_research import market_research_agent
from backend.app.workbench.execution_service import workbench_execution_service


# ============================================================
# 1. BUSINESS REQUEST PLANNER DECOMPOSITION & FACT SEPARATION
# ============================================================
def test_business_request_planner_decomposition():
    """Verifies that natural language requests are decomposed with fact/assumption segregation."""
    prompt = (
        "I run a dental clinic in Austin. Build me a modern website, create a logo concept, "
        "audit my current website, prepare a basic marketing strategy, and compute a 12-month financial model."
    )
    plan: PlannedProject = business_request_planner.plan_request(prompt)

    assert plan.project_name is not None
    assert len(plan.tasks) >= 5

    task_types = [t.type for t in plan.tasks]
    assert "WEBSITE_BUILD" in task_types
    assert "LOGO_GENERATION" in task_types
    assert "WEBSITE_AUDIT" in task_types
    assert "FINANCIAL_MODEL" in task_types
    assert "MARKETING_PLAN" in task_types

    # Strict Fact vs Assumption Separation
    assert len(plan.facts_identified) >= 1
    # Industry and location should be identified as facts
    facts_str = " ".join(plan.facts_identified).lower()
    assert "dental" in facts_str or "facial" in facts_str
    assert "austin" in facts_str

    # Assumptions should be documented
    assert len(plan.assumptions_made) >= 1

    # Missing information should be flagged rather than hallucinated
    assert len(plan.missing_information) >= 1

    # Tasks should have priority ordering
    priorities = [t.priority for t in plan.tasks]
    assert priorities == sorted(priorities)


# ============================================================
# 2. MODEL HUB POLICIES, RESOURCE LIMITS & TELEMETRY
# ============================================================
@pytest.mark.asyncio
async def test_model_hub_policies_and_limits():
    """Verifies free-first default routing, workspace resource limits, and fallback tracking."""
    # 1. Policy selection defaults to FREE_FIRST
    provider = model_hub.select_ai_provider(ModelSelectionPolicy.FREE_FIRST)
    assert provider.provider_id == "LOCAL_OLLAMA"
    status = provider.get_status()
    assert status["is_free"] is True
    assert status["cost_tier"] == "FREE"

    # 2. Workspace limits checking
    limits = WorkspaceLimits(max_tasks=10)
    allowed, err = limits.check_task_limit(5)
    assert allowed is True
    assert err is None

    exceeded, err = limits.check_task_limit(10)
    assert exceeded is False
    assert "Workspace limit reached" in err

    # 3. Fallback execution with telemetry trace
    async def primary_fail():
        raise ConnectionError("Primary upstream timeout")

    async def fallback_ok():
        return {"result": "fallback_data"}

    res, trace = await model_hub.execute_with_fallback(
        primary_callable=primary_fail,
        fallback_callable=fallback_ok,
        task_label="test_fallback"
    )
    assert res == {"result": "fallback_data"}
    assert len(trace) == 2
    assert trace[0]["status"] == "FAILED"
    assert trace[1]["status"] == "FALLBACK_SUCCESS"

    # 4. Manifest introspection
    manifest = model_hub.get_providers_manifest()
    assert manifest["free_first_default"] is True
    assert manifest["total_registered"] >= 4
    assert "limits" in manifest


# ============================================================
# 3. TASK ROUTER CATALOG VALIDATION (23 TASK TYPES)
# ============================================================
def test_task_router_catalog_all_types():
    """Validates that all 23 defined capability task types have complete metadata."""
    expected_tasks = [
        "WEBSITE_BUILD", "WEBSITE_AUDIT", "LOGO_GENERATION", "IMAGE_GENERATION",
        "VIDEO_GENERATION", "COPYWRITING", "SOCIAL_CONTENT", "BUSINESS_PLAN",
        "MARKETING_PLAN", "FINANCIAL_MODEL", "COMPETITOR_ANALYSIS", "SEO_AUDIT",
        "BRAND_ANALYSIS", "DOCUMENT_GENERATION", "PRESENTATION_GENERATION",
        "DATA_ANALYSIS", "AI_AGENT_GENERATION", "VOICE_AGENT_GENERATION",
        "LEAD_AGENT_GENERATION", "CRM_WORKFLOW", "CHAT", "CUSTOMER_RESPONSE",
        "VOICE_RESPONSE"
    ]

    for t_type in expected_tasks:
        meta = task_router.get_task_metadata(t_type)
        assert meta is not None, f"Missing metadata for {t_type}"
        assert "agent_handler" in meta
        assert "artifact_type" in meta
        assert "default_model" in meta
        assert "requires_confirmation" in meta
        assert "deliverable" in meta


# ============================================================
# 4. WEBSITE BUILDER AGENT: MULTI-PAGE & SANDBOXED CODE
# ============================================================
@pytest.mark.asyncio
async def test_website_builder_agent():
    """Verifies responsive multi-page architecture and sandboxed markup generation."""
    res = await website_builder_agent.build_website(
        business_name="Austin Smiles Dentistry",
        business_category="Dental & Facial Aesthetics",
        location="Austin, Texas"
    )

    assert "html_code" in res
    assert "architecture" in res
    assert len(res["architecture"]) >= 5 # Home, Services, Pricing, About, Contact, FAQ, Booking

    html = res["html_code"]
    assert "Austin Smiles Dentistry" in html
    assert "cdn.tailwindcss.com" in html
    assert "<!DOCTYPE html>" in html
    assert "meta name=\"viewport\"" in html


# ============================================================
# 5. WEBSITE AUDITOR AGENT: 8 DIMENSIONS & UNMEASURABLE HONESTY
# ============================================================
@pytest.mark.asyncio
async def test_website_audit_agent():
    """Verifies 8-dimension evaluation, fact vs recommendation separation, and unmeasurable disclosure."""
    audit = await website_audit_agent.audit_website(
        business_context={"name": "Austin Smiles Dentistry", "category": "Dental"}
    )

    assert "dimensions" in audit
    assert len(audit["dimensions"]) == 8
    assert "verified_facts" in audit
    assert "unmeasurable_metrics" in audit
    assert "prioritized_fixes" in audit

    # 8 core dimensions
    dim_keys = list(audit["dimensions"].keys())
    assert "UX" in dim_keys
    assert "MOBILE" in dim_keys
    assert "PERFORMANCE" in dim_keys
    assert "SEO" in dim_keys
    assert "ACCESSIBILITY" in dim_keys
    assert "CONVERSION" in dim_keys
    assert "CONTENT" in dim_keys
    assert "BRANDING" in dim_keys

    # Must disclose unmeasurable metrics honestly
    disclosed = audit.get("unmeasurable_metrics", [])
    assert len(disclosed) >= 1
    disclosed_str = " ".join(disclosed).lower()
    assert "dom" in disclosed_str or "browser" in disclosed_str or "vitals" in disclosed_str


# ============================================================
# 6. BRAND GENERATOR AGENT: SVG LOGOS & PALETTE CONTRAST
# ============================================================
@pytest.mark.asyncio
async def test_brand_generator_agent():
    """Verifies parametric SVG vector creation, contrast ratios, and style variants."""
    brand = await brand_generator_agent.generate_brand_identity(
        business_name="Austin Smiles",
        industry="Dental",
        style="PREMIUM"
    )

    assert brand["style"] == "PREMIUM"
    assert "active_concept" in brand
    concept = brand["active_concept"]
    assert "<svg" in concept["logo_svg"]
    assert "</svg>" in concept["logo_svg"]

    # Color palette
    palette = concept["palette"]
    assert "primary" in palette
    assert palette["primary"].startswith("#")
    assert len(palette["primary"]) == 7

    # Style transformations
    bold_brand = await brand_generator_agent.generate_brand_identity(
        business_name="Austin Smiles",
        industry="Dental",
        style="BOLD"
    )
    assert bold_brand["style"] == "BOLD"


# ============================================================
# 7. FINANCIAL MODEL AGENT: DETERMINISTIC MATH ACCURACY & CSV
# ============================================================
def test_financial_model_deterministic_math():
    """
    CRITICAL: Verifies 100% deterministic mathematical accuracy.
    Zero AI arithmetic hallucinations allowed.
    """
    monthly_rev = 60000.0
    cogs_rate = 0.25

    fin = financial_model_agent.calculate_financials(
        monthly_revenue=monthly_rev,
        cogs_rate=cogs_rate,
        employees=3,
        salary=4500.0,
        rent=3500.0,
        marketing=2000.0,
        software=600.0,
        other_costs=400.0
    )

    metrics = fin["metrics"]
    projections = fin["monthly_projections"]
    assert len(projections) == 12

    # Deterministic Arithmetic Verification:
    # 1. Annual Revenue == Monthly Revenue * 12
    assert round(metrics["annual_revenue"], 2) == round(monthly_rev * 12.0, 2)

    # 2. Monthly COGS == Monthly Revenue * cogs_rate
    expected_cogs = round(monthly_rev * cogs_rate, 2)
    assert metrics["cogs"] == expected_cogs

    # 3. Gross Profit == Monthly Revenue - Monthly COGS
    expected_gp = round(monthly_rev - expected_cogs, 2)
    assert metrics["gross_profit"] == expected_gp

    # 4. Gross Margin % == (Gross Profit / Monthly Revenue) * 100
    expected_gm_pct = round((expected_gp / monthly_rev) * 100.0, 1)
    assert metrics["gross_margin_pct"] == expected_gm_pct

    # 5. Net Profit == Gross Profit - Operating Expenses
    expected_np = round(expected_gp - metrics["operating_expenses"], 2)
    assert metrics["net_profit"] == expected_np

    # 6. Break-even Revenue == Fixed OPEX / (Gross Margin / 100)
    expected_breakeven = round(metrics["operating_expenses"] / (metrics["gross_margin_pct"] / 100.0), 2)
    assert metrics["breakeven_revenue"] == expected_breakeven

    # 7. CSV Export
    csv_text = fin["csv_content"]
    assert "Month,Revenue,COGS,Gross_Profit,OPEX,Net_Profit,Cumulative_Cash" in csv_text
    lines = csv_text.strip().split("\n")
    assert len(lines) == 13 # header + 12 rows


# ============================================================
# 8. CUSTOMER RESPONSE AGENT: DIRECT RESOLUTION
# ============================================================
@pytest.mark.asyncio
async def test_customer_response_agent():
    """Verifies direct problem-solving without robotic fluff or canned greetings."""
    resp = await customer_response_agent.generate_response(
        business={"name": "Austin Smiles", "business_hours": "Saturday: 9am - 2pm"},
        customer_message="What are your hours on Saturday?"
    )
    assert "response" in resp
    text = resp["response"]
    assert "Saturday" in text
    assert "Austin Smiles" in text
    assert resp["intent"] == "HOURS_INQUIRY"


# ============================================================
# 9. WORKBENCH EXECUTION SERVICE LIFECYCLE
# ============================================================
@pytest.mark.asyncio
async def test_workbench_execution_lifecycle(async_session):
    """Verifies project creation from request, task progression, artifact creation, and command execution."""
    biz = Business(
        id=str(uuid.uuid4()),
        name="Apex Smiles Austin",
        email="owner@apexsmiles.example.com",
        industry="Dental",
        created_at=datetime.now(timezone.utc)
    )
    async_session.add(biz)
    await async_session.commit()

    # 1. Create project from request
    prompt = "I run a dental clinic in Austin. Build me a website and generate a brand logo."
    project = await workbench_execution_service.create_project_from_request(
        session=async_session,
        business_id=biz.id,
        natural_language_request=prompt
    )
    assert project.id is not None
    assert project.status == "PLANNING"

    # Query tasks
    task_stmt = select(V5WorkbenchTask).where(V5WorkbenchTask.project_id == project.id)
    task_res = await async_session.execute(task_stmt)
    tasks = task_res.scalars().all()
    assert len(tasks) >= 2

    # 2. Execute project
    exec_res = await workbench_execution_service.execute_project(
        session=async_session,
        project_id=project.id,
        business_id=biz.id
    )
    assert exec_res["status"] == "COMPLETED"
    assert exec_res["completed_artifacts_count"] >= 2

    # Verify artifacts saved in DB
    art_stmt = select(V5WorkbenchArtifact).where(V5WorkbenchArtifact.project_id == project.id)
    art_res = await async_session.execute(art_stmt)
    artifacts = art_res.scalars().all()
    assert len(artifacts) >= 2

    types = [a.artifact_type for a in artifacts]
    assert "WEBSITE" in types or "LOGO" in types

    # 3. Universal Command Execution ("Ask Rine Forge")
    cmd_res = await workbench_execution_service.execute_universal_command(
        session=async_session,
        business_id=biz.id,
        command_text="make the logo more premium",
        active_project_id=project.id
    )
    assert cmd_res["action"] == "BRAND_UPDATED"
    assert "data" in cmd_res


# ============================================================
# 10. WORKBENCH HTTP API ENDPOINTS
# ============================================================
@pytest.mark.asyncio
async def test_workbench_api_endpoints(async_session):
    """Validates full HTTP API suite for the AI Business Workbench."""
    biz = Business(
        id=str(uuid.uuid4()),
        name="Horizon Logistics",
        email="ops@horizon.example.com",
        industry="Logistics & Supply Chain",
        created_at=datetime.now(timezone.utc)
    )
    async_session.add(biz)
    await async_session.commit()

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. POST /api/v1/workbench/plan
        plan_res = await client.post(
            "/api/v1/workbench/plan",
            headers={"X-Business-ID": biz.id},
            json={"natural_language_request": "Build a modern website and calculate financial projections"}
        )
        assert plan_res.status_code == 200
        plan_data = plan_res.json()
        assert "tasks" in plan_data
        assert "facts_identified" in plan_data

        # 2. POST /api/v1/workbench/projects (Create)
        create_res = await client.post(
            "/api/v1/workbench/projects",
            headers={"X-Business-ID": biz.id},
            json={"natural_language_request": "Build a modern logistics landing page and logo"}
        )
        assert create_res.status_code == 201
        project_data = create_res.json()
        proj_id = project_data["id"]
        assert project_data["status"] == "PLANNING"
        assert len(project_data["tasks"]) >= 2

        # 3. GET /api/v1/workbench/projects (List)
        list_res = await client.get(
            "/api/v1/workbench/projects",
            headers={"X-Business-ID": biz.id}
        )
        assert list_res.status_code == 200
        projects_list = list_res.json()
        assert any(p["id"] == proj_id for p in projects_list)

        # 4. POST /api/v1/workbench/projects/{id}/execute
        exec_res = await client.post(
            f"/api/v1/workbench/projects/{proj_id}/execute",
            headers={"X-Business-ID": biz.id}
        )
        assert exec_res.status_code == 200
        exec_data = exec_res.json()
        assert exec_data["status"] == "COMPLETED"
        assert len(exec_data["artifacts"]) >= 2
        art_id = exec_data["artifacts"][0]

        # 5. GET /api/v1/workbench/projects/{id}
        get_res = await client.get(
            f"/api/v1/workbench/projects/{proj_id}",
            headers={"X-Business-ID": biz.id}
        )
        assert get_res.status_code == 200
        proj_detail = get_res.json()
        assert proj_detail["status"] == "COMPLETED"
        assert len(proj_detail["artifacts"]) >= 2

        # 6. GET /api/v1/workbench/artifacts/{id}
        art_res = await client.get(
            f"/api/v1/workbench/artifacts/{art_id}",
            headers={"X-Business-ID": biz.id}
        )
        assert art_res.status_code == 200
        artifact_detail = art_res.json()
        assert artifact_detail["id"] == art_id
        assert artifact_detail["version"] == 1

        # 7. PUT /api/v1/workbench/artifacts/{id} (Update)
        update_res = await client.put(
            f"/api/v1/workbench/artifacts/{art_id}",
            headers={"X-Business-ID": biz.id},
            json={"content_text": "Updated content text from operator"}
        )
        assert update_res.status_code == 200
        update_data = update_res.json()
        assert update_data["version"] == 2

        # 8. POST /api/v1/workbench/artifacts/{id}/confirm (Human Confirmation Gate)
        confirm_res = await client.post(
            f"/api/v1/workbench/artifacts/{art_id}/confirm",
            headers={"X-Business-ID": biz.id},
            json={"action": "PUBLISH"}
        )
        assert confirm_res.status_code == 200
        confirm_data = confirm_res.json()
        assert confirm_data["status"] == "PUBLISHED"

        # 9. POST /api/v1/workbench/command (Universal Command Box)
        cmd_res = await client.post(
            "/api/v1/workbench/command",
            headers={"X-Business-ID": biz.id},
            json={"command": "build website"}
        )
        assert cmd_res.status_code == 200
        cmd_data = cmd_res.json()
        assert cmd_data["action"] == "WEBSITE_GENERATED"

        # 10. GET /api/v1/workbench/models (Model Manifest)
        models_res = await client.get("/api/v1/workbench/models")
        assert models_res.status_code == 200
        models_data = models_res.json()
        assert models_data["free_first_default"] is True
        assert len(models_data["providers"]) >= 4
