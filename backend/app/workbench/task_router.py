"""
Rine Forge Systems V5 - Phase AQ: Task Router
Routes structured business tasks to their corresponding specialized execution pipelines.
Supports all 23 authoritative capability task types defined in Section 3.
"""
import logging
from typing import Dict, Any, List, Optional, Tuple

logger = logging.getLogger("rine_forge.workbench.task_router")


class TaskRouter:
    """
    Directs tasks to specialized agents, sets execution priorities,
    and identifies required output artifacts and human approval gates.
    """

    SUPPORTED_TASK_TYPES = [
        "CHAT",
        "CUSTOMER_RESPONSE",
        "VOICE_RESPONSE",
        "WEBSITE_BUILD",
        "WEBSITE_AUDIT",
        "LOGO_GENERATION",
        "IMAGE_GENERATION",
        "VIDEO_GENERATION",
        "COPYWRITING",
        "SOCIAL_CONTENT",
        "BUSINESS_PLAN",
        "MARKETING_PLAN",
        "FINANCIAL_MODEL",
        "COMPETITOR_ANALYSIS",
        "SEO_AUDIT",
        "BRAND_ANALYSIS",
        "DOCUMENT_GENERATION",
        "PRESENTATION_GENERATION",
        "DATA_ANALYSIS",
        "AI_AGENT_GENERATION",
        "VOICE_AGENT_GENERATION",
        "LEAD_AGENT_GENERATION",
        "CRM_WORKFLOW"
    ]

    TASK_METADATA: Dict[str, Dict[str, Any]] = {
        "WEBSITE_BUILD": {
            "agent_handler": "WebsiteBuilderAgent",
            "artifact_type": "WEBSITE",
            "default_model": "TAILWIND_SANDBOX_GEN",
            "requires_confirmation": False,
            "estimated_seconds": 3,
            "deliverable": "Responsive HTML/Tailwind multi-page site structure with live sandboxed preview."
        },
        "WEBSITE_AUDIT": {
            "agent_handler": "WebsiteAuditAgent",
            "artifact_type": "REPORT",
            "default_model": "LOCAL_OLLAMA",
            "requires_confirmation": False,
            "estimated_seconds": 2,
            "deliverable": "Technical & UX audit report separating verified facts from recommendations."
        },
        "LOGO_GENERATION": {
            "agent_handler": "BrandGeneratorAgent",
            "artifact_type": "LOGO",
            "default_model": "BUILTIN_SVG_VECTOR",
            "requires_confirmation": False,
            "estimated_seconds": 1,
            "deliverable": "Parametric SVG vector logos, color palette, typography guidelines, and favicon."
        },
        "BRAND_ANALYSIS": {
            "agent_handler": "BrandGeneratorAgent",
            "artifact_type": "DOCUMENT",
            "default_model": "LOCAL_OLLAMA",
            "requires_confirmation": False,
            "estimated_seconds": 2,
            "deliverable": "Brand positioning narrative, tone of voice, and competitive visual differentiation."
        },
        "BUSINESS_PLAN": {
            "agent_handler": "BusinessPlanAgent",
            "artifact_type": "DOCUMENT",
            "default_model": "LOCAL_OLLAMA",
            "requires_confirmation": False,
            "estimated_seconds": 3,
            "deliverable": "Full strategic business plan with executive summary, market fit, operations, and labeled assumptions."
        },
        "FINANCIAL_MODEL": {
            "agent_handler": "FinancialModelAgent",
            "artifact_type": "SPREADSHEET",
            "default_model": "DETERMINISTIC_CALCULATOR",
            "requires_confirmation": False,
            "estimated_seconds": 1,
            "deliverable": "Deterministic revenue, expense, breakeven, and 12-month cash-flow projection table with CSV export."
        },
        "MARKETING_PLAN": {
            "agent_handler": "MarketingAgent",
            "artifact_type": "DOCUMENT",
            "default_model": "LOCAL_OLLAMA",
            "requires_confirmation": False,
            "estimated_seconds": 2,
            "deliverable": "Multi-channel marketing plan, campaign concepts, landing page copy, and email sequences."
        },
        "COMPETITOR_ANALYSIS": {
            "agent_handler": "MarketResearchAgent",
            "artifact_type": "REPORT",
            "default_model": "LOCAL_OLLAMA",
            "requires_confirmation": False,
            "estimated_seconds": 2,
            "deliverable": "Competitive landscape report with service differentiation and sourced market facts."
        },
        "CUSTOMER_RESPONSE": {
            "agent_handler": "CustomerResponseAgent",
            "artifact_type": "DOCUMENT",
            "default_model": "LOCAL_OLLAMA",
            "requires_confirmation": False,
            "estimated_seconds": 1,
            "deliverable": "Direct solution response with intent detection and tool-assisted action."
        },
        "VOICE_RESPONSE": {
            "agent_handler": "VoiceEngineCoordinator",
            "artifact_type": "VOICE_AGENT",
            "default_model": "BROWSER_WEB_SPEECH",
            "requires_confirmation": False,
            "estimated_seconds": 1,
            "deliverable": "Voice conversation turn with STT/TTS and real tool execution."
        },
        "AI_AGENT_GENERATION": {
            "agent_handler": "AgentGeneratorService",
            "artifact_type": "AI_AGENT",
            "default_model": "LOCAL_OLLAMA",
            "requires_confirmation": False,
            "estimated_seconds": 3,
            "deliverable": "Full 6-bot coordinated suite with unified knowledge base, CRM lead capture, and handoff logic."
        },
        "VOICE_AGENT_GENERATION": {
            "agent_handler": "VoiceEngineCoordinator",
            "artifact_type": "VOICE_AGENT",
            "default_model": "BROWSER_WEB_SPEECH",
            "requires_confirmation": False,
            "estimated_seconds": 2,
            "deliverable": "Grounded phone receptionist instance with office hours and appointment booking tools."
        },
        "LEAD_AGENT_GENERATION": {
            "agent_handler": "AgentGeneratorService",
            "artifact_type": "AI_AGENT",
            "default_model": "LOCAL_OLLAMA",
            "requires_confirmation": False,
            "estimated_seconds": 2,
            "deliverable": "Autonomous social & public directory intent signal monitor with 10-gate outbound compliance."
        },
        "CRM_WORKFLOW": {
            "agent_handler": "LeadEngineCoordinator",
            "artifact_type": "DOCUMENT",
            "default_model": "LOCAL_OLLAMA",
            "requires_confirmation": True,
            "estimated_seconds": 2,
            "deliverable": "Automated pipeline deal stages, notification rules, and operator task generation."
        },
        "COPYWRITING": {
            "agent_handler": "MarketingAgent",
            "artifact_type": "DOCUMENT",
            "default_model": "LOCAL_OLLAMA",
            "requires_confirmation": False,
            "estimated_seconds": 2,
            "deliverable": "High-converting sales copy, value propositions, and headline variants."
        },
        "SOCIAL_CONTENT": {
            "agent_handler": "MarketingAgent",
            "artifact_type": "DOCUMENT",
            "default_model": "LOCAL_OLLAMA",
            "requires_confirmation": False,
            "estimated_seconds": 2,
            "deliverable": "Educational social media carousel drafts and thought-leadership posts."
        },
        "SEO_AUDIT": {
            "agent_handler": "WebsiteAuditAgent",
            "artifact_type": "REPORT",
            "default_model": "LOCAL_OLLAMA",
            "requires_confirmation": False,
            "estimated_seconds": 2,
            "deliverable": "Keyword visibility evaluation, meta tags analysis, and technical indexing audit."
        },
        "IMAGE_GENERATION": {
            "agent_handler": "BrandGeneratorAgent",
            "artifact_type": "IMAGE",
            "default_model": "BUILTIN_SVG_VECTOR",
            "requires_confirmation": False,
            "estimated_seconds": 1,
            "deliverable": "Parametric vector graphic or raster visual asset."
        },
        "VIDEO_GENERATION": {
            "agent_handler": "MarketingAgent",
            "artifact_type": "VIDEO",
            "default_model": "LOCAL_OLLAMA",
            "requires_confirmation": False,
            "estimated_seconds": 2,
            "deliverable": "Storyboard script, shot list, and narration blueprint for marketing video."
        },
        "DOCUMENT_GENERATION": {
            "agent_handler": "BusinessPlanAgent",
            "artifact_type": "DOCUMENT",
            "default_model": "LOCAL_OLLAMA",
            "requires_confirmation": False,
            "estimated_seconds": 2,
            "deliverable": "Standard operating procedure or business policy documentation."
        },
        "PRESENTATION_GENERATION": {
            "agent_handler": "BusinessPlanAgent",
            "artifact_type": "PRESENTATION",
            "default_model": "LOCAL_OLLAMA",
            "requires_confirmation": False,
            "estimated_seconds": 2,
            "deliverable": "Investor pitch deck outline and slide-by-slide narrative structure."
        },
        "DATA_ANALYSIS": {
            "agent_handler": "FinancialModelAgent",
            "artifact_type": "REPORT",
            "default_model": "DETERMINISTIC_CALCULATOR",
            "requires_confirmation": False,
            "estimated_seconds": 2,
            "deliverable": "Cohort conversion analysis, retention rates, and operational bottleneck report."
        },
        "CHAT": {
            "agent_handler": "CustomerResponseAgent",
            "artifact_type": "DOCUMENT",
            "default_model": "LOCAL_OLLAMA",
            "requires_confirmation": False,
            "estimated_seconds": 1,
            "deliverable": "Consultative strategic response."
        }
    }

    def validate_task_type(self, task_type: str) -> bool:
        return task_type.upper() in self.SUPPORTED_TASK_TYPES

    def get_task_metadata(self, task_type: str) -> Dict[str, Any]:
        return self.TASK_METADATA.get(task_type.upper(), {
            "agent_handler": "GenericWorkbenchAgent",
            "artifact_type": "DOCUMENT",
            "default_model": "LOCAL_OLLAMA",
            "requires_confirmation": False,
            "estimated_seconds": 2,
            "deliverable": "Business asset deliverable."
        })


task_router = TaskRouter()
