"""
Rine Forge Systems V5 - Forge Intelligence Fabric: Knowledge Router
Selects and filters strictly necessary context domains to avoid prompt bloat.
Only retrieves context relevant to the classified task.
"""
from typing import Dict, Any, List, Optional
from backend.app.ai.fabric.constants import TaskCategory


class KnowledgeRouter:
    """Routes and filters knowledge retrieval according to task requirements."""

    REQUIREMENTS_MAP: Dict[str, List[str]] = {
        TaskCategory.CUSTOMER_RESPONSE.value: ["conversation_history", "business_profile", "business_knowledge"],
        TaskCategory.QUESTION.value: ["business_profile", "business_knowledge"],
        TaskCategory.WEBSITE_BUILD.value: ["business_profile", "previous_artifacts"],
        TaskCategory.WEBSITE_AUDIT.value: ["website", "uploaded_files"],
        TaskCategory.FINANCIAL_ANALYSIS.value: ["business_profile", "previous_artifacts"],
        TaskCategory.LEAD_QUALIFICATION.value: ["business_profile", "crm", "external_research"],
        TaskCategory.BUSINESS_PLAN.value: ["business_profile", "business_knowledge", "previous_artifacts"],
        TaskCategory.MARKETING_PLAN.value: ["business_profile", "business_knowledge"],
        TaskCategory.AI_AGENT_CREATION.value: ["business_profile", "business_knowledge"],
        TaskCategory.AUTOMATION.value: ["crm", "business_profile"]
    }

    @classmethod
    def determine_needed_knowledge(cls, category: str) -> List[str]:
        return cls.REQUIREMENTS_MAP.get(category, ["business_profile"])

    @classmethod
    def route_knowledge(
        cls,
        category: str,
        workspace_id: str,
        business_context: Optional[Dict[str, Any]] = None,
        conversation_history: Optional[List[Dict[str, str]]] = None,
        uploaded_files: Optional[List[Dict[str, Any]]] = None,
        crm_data: Optional[Dict[str, Any]] = None,
        project_memory: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Retrieves and packages only the required knowledge subsets."""
        needed = cls.determine_needed_knowledge(category)
        packaged: Dict[str, Any] = {
            "required_domains": needed,
            "workspace_id": workspace_id
        }

        biz = business_context or {}

        if "business_profile" in needed:
            packaged["business_profile"] = {
                "name": biz.get("name", "Forge Business"),
                "industry": biz.get("industry", "General Business Services"),
                "location": biz.get("location", "Austin, TX"),
                "services": biz.get("services", ["Consultations", "Emergency Service"]),
                "hours": biz.get("business_hours", "Mon-Fri 8:00 AM - 6:00 PM")
            }

        if "conversation_history" in needed:
            packaged["conversation_history"] = (conversation_history or [])[-5:]  # Only last 5 turns to prevent bloat

        if "uploaded_files" in needed:
            packaged["uploaded_files"] = [
                {"name": f.get("name"), "size": f.get("size"), "type": f.get("type")}
                for f in (uploaded_files or [])
            ]

        if "crm_data" in needed and crm_data:
            packaged["crm_data"] = {
                "lead_count": crm_data.get("lead_count", 0),
                "active_pipeline": crm_data.get("active_pipeline", "Default")
            }

        if "previous_artifacts" in needed and project_memory:
            packaged["previous_artifacts"] = {
                "last_artifact_id": project_memory.get("last_artifact_id"),
                "approved_brand_colors": project_memory.get("approved_brand_colors", ["#1E40AF", "#F8FAFC"])
            }

        return packaged
