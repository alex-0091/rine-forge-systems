"""
Rine Forge Systems V5 - Forge Intelligence Fabric: Execution Planner
Generates structured multi-step execution plans and validates each step
against tool permission policies before execution.
"""
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

from backend.app.ai.fabric.constants import TaskCategory, TaskComplexity


class ExecutionPlanner:
    """Generates and validates structured internal plans before executing multi-step tasks."""

    STANDARD_TEMPLATES: Dict[str, List[Dict[str, Any]]] = {
        TaskCategory.WEBSITE_BUILD.value: [
            {"name": "extract_business_information", "desc": "Retrieve business profile, service catalog, and tone", "tools": ["searchKnowledge"]},
            {"name": "generate_sitemap", "desc": "Synthesize page section hierarchy and navigation layout", "tools": []},
            {"name": "generate_design_specification", "desc": "Define Tailwind color palette and responsive typography", "tools": []},
            {"name": "generate_copy", "desc": "Draft conversion-focused headline and section body copy", "tools": []},
            {"name": "generate_code", "desc": "Synthesize complete HTML5/Tailwind semantic document", "tools": []},
            {"name": "run_sandbox_build", "desc": "Execute sandboxed AST security check and HTML parsing", "tools": ["runSandboxBuild"]},
            {"name": "run_accessibility_checks", "desc": "Verify viewport, alt tags, and contrast standards", "tools": ["runTests"]},
            {"name": "generate_preview", "desc": "Prepare sandboxed interactive web preview", "tools": []},
            {"name": "create_artifact", "desc": "Commit deliverable to workspace artifact store", "tools": ["createArtifact"]}
        ],
        TaskCategory.WEBSITE_AUDIT.value: [
            {"name": "fetch_site_or_screenshot", "desc": "Extract target DOM markup or visual viewport screenshot", "tools": ["fetchWebsite", "analyzeImage"]},
            {"name": "extract_technical_facts", "desc": "Verify SSL, viewport meta, header tags, and phone CTA anchors", "tools": []},
            {"name": "evaluate_8_dimensions", "desc": "Score UX, Mobile, Speed, SEO, Conversion, Trust, Messaging, Structure", "tools": []},
            {"name": "segregate_inferences_and_fixes", "desc": "Separate verified facts from deductive observations and recommendations", "tools": []},
            {"name": "create_audit_artifact", "desc": "Save comprehensive audit scorecard artifact", "tools": ["createArtifact"]}
        ],
        TaskCategory.BUSINESS_PLAN.value: [
            {"name": "extract_market_context", "desc": "Query target audience, location demographics, and services", "tools": ["searchKnowledge"]},
            {"name": "formulate_executive_summary", "desc": "Draft value proposition and mission statement", "tools": []},
            {"name": "structure_operating_model", "desc": "Draft staff roles, operating hours, and supplier logic", "tools": []},
            {"name": "synthesize_risk_analysis", "desc": "Identify regulatory, financial, and operational risks", "tools": []},
            {"name": "create_plan_artifact", "desc": "Generate and save complete business plan document", "tools": ["createArtifact"]}
        ],
        TaskCategory.FINANCIAL_ANALYSIS.value: [
            {"name": "extract_financial_variables", "desc": "Load unit pricing, average volumes, fixed costs, and variable margins", "tools": ["searchKnowledge"]},
            {"name": "compute_deterministic_scenarios", "desc": "Execute exact formulas for Conservative, Base, and Optimistic cases", "tools": ["calculateFinance"]},
            {"name": "generate_12_month_csv", "desc": "Build monthly ramp table with zero mathematical hallucination", "tools": ["calculateFinance"]},
            {"name": "narrative_explanation", "desc": "Synthesize plain-language summary explaining key levers and breakeven", "tools": []},
            {"name": "create_financial_artifact", "desc": "Save structured financial model artifact", "tools": ["createArtifact"]}
        ],
        TaskCategory.AI_AGENT_CREATION.value: [
            {"name": "extract_role_requirements", "desc": "Identify employee role, channels, and business boundaries", "tools": ["searchKnowledge"]},
            {"name": "compile_system_instructions", "desc": "Generate strict system prompt with anti-hallucination guards", "tools": []},
            {"name": "assign_tools_and_permissions", "desc": "Scope allowed tool registry functions and approval gates", "tools": []},
            {"name": "generate_simulation_scenarios", "desc": "Create synthetic customer test suite (10 scenarios)", "tools": ["runTests"]},
            {"name": "create_agent_blueprint", "desc": "Save agent blueprint artifact for preview & deployment", "tools": ["createArtifact"]}
        ]
    }

    @classmethod
    def generate_plan(
        cls,
        category: str,
        intent: Dict[str, Any],
        business_context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Generates an internal multi-step execution plan."""
        steps_template = cls.STANDARD_TEMPLATES.get(category)

        if not steps_template:
            # Standard single/dual-step plan for direct inquiries or customer turns
            steps_template = [
                {"name": "retrieve_context", "desc": f"Retrieve authoritative context for {category}", "tools": ["searchKnowledge"]},
                {"name": "synthesize_response", "desc": "Generate grounded response according to policy", "tools": []}
            ]

        steps: List[Dict[str, Any]] = []
        for i, stp in enumerate(steps_template, start=1):
            steps.append({
                "step_number": i,
                "name": stp["name"],
                "description": stp["desc"],
                "required_tools": stp["tools"],
                "is_safe": True,
                "requires_approval": any(t in ["sendWhatsApp", "sendEmail", "sendSMS", "createAppointment"] for t in stp["tools"])
            })

        return {
            "task": intent.get("user_goal", "Execute Task"),
            "category": category,
            "total_steps": len(steps),
            "steps": steps,
            "created_at": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def validate_plan(
        cls,
        plan: Dict[str, Any],
        allowed_tools: List[str],
        permissions: List[str]
    ) -> Dict[str, Any]:
        """Validates that a plan does not execute prohibited or out-of-scope tools."""
        errors: List[str] = []
        validated_steps: List[Dict[str, Any]] = []

        allowed_set = set(allowed_tools)

        for step in plan.get("steps", []):
            for tool in step.get("required_tools", []):
                if tool not in allowed_set:
                    errors.append(f"Step '{step['name']}' requests tool '{tool}' which is not in allowed tool scope.")
            validated_steps.append(step)

        is_valid = len(errors) == 0
        return {
            "is_valid": is_valid,
            "errors": errors,
            "validated_steps": validated_steps
        }
