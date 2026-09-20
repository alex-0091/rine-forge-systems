"""
Rine Forge Systems V5 - Phase AR: AI Project Manager Agent
Decomposes complex, multi-faceted business objectives into dependency-ordered task graphs.
Coordinates execution across specialized agents while maintaining real task states (no fake percentages).
"""
import uuid
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

from backend.app.workbench.task_router import task_router
from backend.app.workbench.agents.website_builder import website_builder_agent
from backend.app.workbench.agents.brand_generator import brand_generator_agent
from backend.app.workbench.agents.financial_model import financial_model_agent
from backend.app.workbench.agents.website_auditor import website_audit_agent
from backend.app.workbench.agents.business_plan import business_plan_agent
from backend.app.workbench.agents.marketing import marketing_agent

logger = logging.getLogger("rine_forge.workbench.project_manager")


class ProjectManagerAgent:
    """
    Autonomous enterprise project management and decomposition engine.
    Transforms broad requests into dependency-ordered capability pipelines.
    """

    DEFAULT_BUSINESS_INITIATIVE_STAGES = [
        {"stage": "BUSINESS_ANALYSIS", "name": "Business & Competitive Analysis", "task_type": "BUSINESS_PLAN", "priority": 1},
        {"stage": "BRAND_DIRECTION", "name": "Brand Identity & Palette", "task_type": "BRAND_IDENTITY", "priority": 2},
        {"stage": "LOGO_GENERATION", "name": "Parametric Vector Logo", "task_type": "LOGO_DESIGN", "priority": 3},
        {"stage": "WEBSITE_SYNTHESIS", "name": "Responsive Multi-Page Website", "task_type": "WEBSITE_CREATION", "priority": 4},
        {"stage": "FINANCIAL_MODEL", "name": "12-Month Financial Projections", "task_type": "FINANCIAL_MODEL", "priority": 5},
        {"stage": "SEO_AND_AUDIT", "name": "Conversion & SEO Audit", "task_type": "WEBSITE_AUDIT", "priority": 6},
        {"stage": "MARKETING_PLAN", "name": "Multi-Channel Customer Acquisition", "task_type": "MARKETING_PLAN", "priority": 7},
        {"stage": "AI_RECEPTIONIST", "name": "24/7 AI Receptionist Employee", "task_type": "CUSTOMER_SUPPORT", "priority": 8}
    ]

    def formulate_project_plan(
        self,
        request: str,
        business_name: str = "Modern Business",
        industry: str = "General Business",
        location: str = "Metro Area"
    ) -> Dict[str, Any]:
        """
        Decomposes request into dependency-ordered stages.
        """
        req_lower = request.lower()
        stages = []

        # If user gives broad directive ("build my new restaurant online", "launch my dental clinic")
        is_broad = any(w in req_lower for w in ["build my new", "launch my", "start a new", "set up my", "create my business"])

        for item in self.DEFAULT_BUSINESS_INITIATIVE_STAGES:
            stage_key = item["stage"]
            # Include stage if broad directive or explicitly requested
            should_include = is_broad
            if "analysis" in req_lower or "business plan" in req_lower:
                if stage_key == "BUSINESS_ANALYSIS": should_include = True
            if "brand" in req_lower or "palette" in req_lower:
                if stage_key == "BRAND_DIRECTION": should_include = True
            if "logo" in req_lower:
                if stage_key == "LOGO_GENERATION": should_include = True
            if "website" in req_lower or "site" in req_lower:
                if stage_key == "WEBSITE_SYNTHESIS": should_include = True
            if "financial" in req_lower or "revenue" in req_lower or "cash flow" in req_lower:
                if stage_key == "FINANCIAL_MODEL": should_include = True
            if "audit" in req_lower or "seo" in req_lower:
                if stage_key == "SEO_AND_AUDIT": should_include = True
            if "marketing" in req_lower or "acquisition" in req_lower:
                if stage_key == "MARKETING_PLAN": should_include = True
            if "receptionist" in req_lower or "support" in req_lower or "agent" in req_lower:
                if stage_key == "AI_RECEPTIONIST": should_include = True

            if should_include:
                stages.append({
                    "id": f"task-{uuid.uuid4().hex[:6]}",
                    "stage": stage_key,
                    "name": item["name"],
                    "task_type": item["task_type"],
                    "priority": item["priority"],
                    "status": "WAITING", # WAITING, GENERATING, COMPLETE, FAILED
                    "step_details": "Queued in dependency graph"
                })

        # Ensure minimum stages if none matched
        if not stages:
            stages = [
                {"id": f"task-{uuid.uuid4().hex[:6]}", "stage": "WEBSITE_SYNTHESIS", "name": "Responsive Multi-Page Website", "task_type": "WEBSITE_CREATION", "priority": 1, "status": "WAITING", "step_details": "Queued"},
                {"id": f"task-{uuid.uuid4().hex[:6]}", "stage": "FINANCIAL_MODEL", "name": "12-Month Financial Projections", "task_type": "FINANCIAL_MODEL", "priority": 2, "status": "WAITING", "step_details": "Queued"}
            ]

        # Sort by priority
        stages.sort(key=lambda s: s["priority"])

        return {
            "project_id": f"proj-{uuid.uuid4().hex[:8]}",
            "business_name": business_name,
            "industry": industry,
            "location": location,
            "input_objective": request,
            "stages_count": len(stages),
            "stages": stages,
            "created_at": datetime.now(timezone.utc).isoformat()
        }

    async def execute_task_stage(
        self,
        task: Dict[str, Any],
        business_name: str,
        industry: str,
        location: str
    ) -> Dict[str, Any]:
        """
        Executes a discrete stage and updates real task state.
        """
        task_type = task.get("task_type")
        task["status"] = "GENERATING"
        task["step_details"] = "Active generation in local engine"

        try:
            if task_type in ["WEBSITE_CREATION", "WEBSITE_BUILD"]:
                res = await website_builder_agent.build_website(business_name, industry, location)
                task["status"] = "COMPLETE"
                task["step_details"] = f"Generated {len(res.get('pages', {}))} responsive pages"
                return {"result": res, "artifact_type": "CODE"}

            elif task_type in ["LOGO_DESIGN", "BRAND_IDENTITY"]:
                res = await brand_generator_agent.generate_brand_identity(business_name, industry)
                task["status"] = "COMPLETE"
                task["step_details"] = f"Generated {len(res.get('concepts', []))} SVG concepts"
                return {"result": res, "artifact_type": "IMAGE"}

            elif task_type == "FINANCIAL_MODEL":
                res = financial_model_agent.calculate_financials()
                task["status"] = "COMPLETE"
                task["step_details"] = f"Calculated exact cash flow (Breakeven: ${res['metrics']['breakeven_revenue']:,.2f})"
                return {"result": res, "artifact_type": "SPREADSHEET"}

            elif task_type == "WEBSITE_AUDIT":
                res = await website_audit_agent.audit_website(business_context={"name": business_name, "category": industry})
                task["status"] = "COMPLETE"
                task["step_details"] = "Completed 8-dimension conversion audit"
                return {"result": res, "artifact_type": "REPORT"}

            elif task_type == "MARKETING_PLAN":
                res = await marketing_agent.generate_marketing_plan(business_name, industry, location)
                task["status"] = "COMPLETE"
                task["step_details"] = "Formulated acquisition strategy"
                return {"result": res, "artifact_type": "DOCUMENT"}

            else:
                res = await business_plan_agent.generate_business_plan(business_name, industry, location)
                task["status"] = "COMPLETE"
                task["step_details"] = "Formulated operational strategy"
                return {"result": res, "artifact_type": "DOCUMENT"}

        except Exception as e:
            logger.error(f"Task stage {task_type} failed: {e}")
            task["status"] = "FAILED"
            task["step_details"] = str(e)
            return {"error": str(e)}


project_manager_agent = ProjectManagerAgent()
