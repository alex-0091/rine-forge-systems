"""
Rine Forge Systems V5 - Forge Intelligence Fabric: Intent Engine
Analyzes user objectives, extracts parameters, identifies expected outputs,
detects missing context, and flags side effects and human approval gates.
"""
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

from backend.app.ai.fabric.constants import TaskCategory, RiskLevel


class IntentEngine:
    """Extracts business intent, expected outputs, missing data, and approval requirements."""

    @classmethod
    def evaluate(
        cls,
        request: str,
        category: str,
        business_context: Optional[Dict[str, Any]] = None,
        attachments: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        req_lower = (request or "").lower().strip()
        biz = business_context or {}
        attachments = attachments or []

        # 1. Detect Business Parameters
        biz_name = biz.get("name") or "Forge Business"
        if not biz.get("name"):
            if "clinic" in req_lower:
                biz_name = "Austin Dental & Aesthetics"
            elif "law" in req_lower:
                biz_name = "Apex Legal Partners"
            elif "roofing" in req_lower:
                biz_name = "Austin Premier Roofing"

        # 2. Determine Expected Output
        expected_output = "DIRECT_ANSWER"
        if category == TaskCategory.WEBSITE_BUILD.value:
            expected_output = "WEBSITE_ARTIFACT"
        elif category == TaskCategory.WEBSITE_AUDIT.value:
            expected_output = "AUDIT_REPORT"
        elif category == TaskCategory.CUSTOMER_RESPONSE.value:
            expected_output = "CUSTOMER_READY_MESSAGE"
        elif category == TaskCategory.BUSINESS_PLAN.value:
            expected_output = "BUSINESS_PLAN_DOCUMENT"
        elif category == TaskCategory.FINANCIAL_ANALYSIS.value:
            expected_output = "FINANCIAL_PROJECTION_MODEL"
        elif category in [TaskCategory.AI_AGENT_CREATION.value, TaskCategory.VOICE_AGENT_CREATION.value]:
            expected_output = "AI_EMPLOYEE_BLUEPRINT"
        elif category == TaskCategory.LEAD_QUALIFICATION.value:
            expected_output = "QUALIFIED_LEAD_DATASET"
        elif category == TaskCategory.CODE_GENERATION.value:
            expected_output = "CODE_ARTIFACT"
        elif category == TaskCategory.AUTOMATION.value:
            expected_output = "AUTOMATION_WORKFLOW"

        # 3. Detect Missing Information
        missing_info: List[str] = []
        if category == TaskCategory.WEBSITE_BUILD.value and not biz.get("services"):
            missing_info.append("business_services_list")
        if category == TaskCategory.FINANCIAL_ANALYSIS.value and not any(k in biz for k in ["pricing", "revenue", "cogs"]):
            missing_info.append("financial_baseline_metrics")
        if category == TaskCategory.CUSTOMER_RESPONSE.value and "what are your hours" not in req_lower and not biz.get("business_hours"):
            missing_info.append("operating_hours_policy")
        if category == TaskCategory.WEBSITE_AUDIT.value and not attachments and "http" not in req_lower:
            missing_info.append("target_url_or_screenshot")

        # 4. Determine Tools Needed
        tools_needed: List[str] = []
        if category == TaskCategory.WEBSITE_BUILD.value:
            tools_needed.extend(["runSandboxBuild", "createArtifact"])
        elif category == TaskCategory.WEBSITE_AUDIT.value:
            tools_needed.extend(["fetchWebsite", "analyzeImage" if attachments else "createArtifact"])
        elif category == TaskCategory.FINANCIAL_ANALYSIS.value:
            tools_needed.extend(["calculateFinance", "createArtifact"])
        elif category == TaskCategory.LEAD_QUALIFICATION.value:
            tools_needed.extend(["searchWeb", "createLead"])
        elif category == TaskCategory.CUSTOMER_RESPONSE.value:
            tools_needed.extend(["searchKnowledge"])
            if any(w in req_lower for w in ["book", "appointment", "schedule"]):
                tools_needed.append("createAppointment")
        elif category == TaskCategory.QUESTION.value:
            tools_needed.append("searchKnowledge")
        elif category == TaskCategory.AUTOMATION.value:
            if "whatsapp" in req_lower:
                tools_needed.append("sendWhatsApp")
            elif "email" in req_lower:
                tools_needed.append("sendEmail")
            elif "sms" in req_lower:
                tools_needed.append("sendSMS")

        # 5. External Side Effects & Human Approval Requirement
        has_side_effects = False
        side_effect_desc = None
        human_approval_required = False
        risk_level = RiskLevel.LOW.value

        consequential_tools = {"sendWhatsApp", "sendEmail", "sendSMS", "createAppointment", "updateCRM"}
        active_consequential = consequential_tools.intersection(set(tools_needed))

        if active_consequential or any(w in req_lower for w in ["send", "whatsapp", "email", "sms", "charge", "publish", "delete"]):
            has_side_effects = True
            human_approval_required = True
            risk_level = RiskLevel.HIGH.value
            side_effect_desc = f"External communication or persistent state modification: {', '.join(active_consequential or ['EXTERNAL_DISPATCH'])}"
        elif category in [TaskCategory.WEBSITE_BUILD.value, TaskCategory.AI_AGENT_CREATION.value, TaskCategory.BUSINESS_PLAN.value]:
            risk_level = RiskLevel.MEDIUM.value

        # External Info Needed
        external_info_needed = category in [
            TaskCategory.RESEARCH.value,
            TaskCategory.COMPETITOR_ANALYSIS.value,
            TaskCategory.LEAD_QUALIFICATION.value,
            TaskCategory.SEO.value
        ]

        return {
            "business_name": biz_name,
            "user_goal": request,
            "category": category,
            "expected_output": expected_output,
            "missing_information": missing_info,
            "tools_needed": tools_needed,
            "external_info_needed": external_info_needed,
            "has_side_effects": has_side_effects,
            "side_effect_description": side_effect_desc,
            "human_approval_required": human_approval_required,
            "risk_level": risk_level,
            "evaluated_at": datetime.now(timezone.utc).isoformat()
        }
