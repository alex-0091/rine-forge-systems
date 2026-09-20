"""
Rine Forge Systems V5 - Forge Intelligence Fabric: Agent Registry
Authoritative registry of 21 specialized agents.
Each agent declares its capabilities, tools, allowed models, input/output schemas,
risk level, and human approval gates.
"""
from typing import Dict, Any, List, Optional
from dataclasses import dataclass, field
from backend.app.ai.fabric.constants import RiskLevel


@dataclass
class AgentDescriptor:
    name: str
    description: str
    capabilities: List[str]
    allowed_tools: List[str]
    allowed_models: List[str]
    input_schema: Dict[str, Any]
    output_schema: Dict[str, Any]
    risk_level: str
    requires_human_approval: bool


class AgentRegistry:
    """Central registry of all 21 specialized agents in the Forge Intelligence Fabric."""

    _agents: Dict[str, AgentDescriptor] = {}

    @classmethod
    def register(cls, agent: AgentDescriptor):
        cls._agents[agent.name] = agent

    @classmethod
    def get(cls, name: str) -> Optional[AgentDescriptor]:
        return cls._agents.get(name)

    @classmethod
    def list_all(cls) -> List[AgentDescriptor]:
        return list(cls._agents.values())

    @classmethod
    def resolve_for_task(cls, category: str) -> str:
        """Maps a task category to its authoritative agent."""
        mapping = {
            "CHAT": "ForgeGeneralAgent",
            "QUESTION": "ForgeGeneralAgent",
            "RESEARCH": "ResearchAgent",
            "CUSTOMER_RESPONSE": "CustomerResponseAgent",
            "CUSTOMER_SUPPORT": "CustomerSupportAgent",
            "SALES": "SalesAgent",
            "LEAD_QUALIFICATION": "LeadQualificationAgent",
            "WEBSITE_BUILD": "WebsiteBuilderAgent",
            "WEBSITE_AUDIT": "WebsiteAuditAgent",
            "CODE_GENERATION": "CodingAgent",
            "CODE_REVIEW": "CodingAgent",
            "DOCUMENT_GENERATION": "DocumentAgent",
            "IMAGE_ANALYSIS": "VisionAgent",
            "VISION": "VisionAgent",
            "VOICE": "VoiceAgent",
            "BUSINESS_PLAN": "BusinessPlanAgent",
            "MARKETING_PLAN": "MarketingAgent",
            "FINANCIAL_ANALYSIS": "FinancialModelAgent",
            "FINANCIAL_MODEL": "FinancialModelAgent",
            "BRAND_DESIGN": "BrandGeneratorAgent",
            "LOGO_GENERATION": "BrandGeneratorAgent",
            "SEO": "SEOAgent",
            "COMPETITOR_ANALYSIS": "CompetitorAnalysisAgent",
            "AUTOMATION": "AutomationAgent",
            "AI_AGENT_CREATION": "AIEmployeeGeneratorAgent",
            "VOICE_AGENT_CREATION": "VoiceEmployeeGeneratorAgent",
            "LEAD_AGENT_CREATION": "LeadEmployeeGeneratorAgent",
            "DATA_ANALYSIS": "FinancialModelAgent"
        }
        return mapping.get(category, "ForgeGeneralAgent")


# ============================================================
# INITIALIZE 21 AGENT BLUEPRINTS
# ============================================================
_INITIAL_AGENTS = [
    AgentDescriptor(
        name="ForgeGeneralAgent",
        description="General business question answering, conversation, and high-level routing.",
        capabilities=["GENERAL_QA", "CONVERSATION", "REASONING"],
        allowed_tools=["searchKnowledge", "createArtifact"],
        allowed_models=["phi3:mini", "llama3:8b", "mistral:7b"],
        input_schema={"type": "object", "properties": {"prompt": {"type": "string"}}},
        output_schema={"type": "object", "properties": {"response": {"type": "string"}}},
        risk_level=RiskLevel.LOW.value,
        requires_human_approval=False
    ),
    AgentDescriptor(
        name="CustomerResponseAgent",
        description="Customer reception, intent routing, and appointment availability checking.",
        capabilities=["CUSTOMER_RECEPTION", "HOURS_LOOKUP", "APPOINTMENT_TRIAGE"],
        allowed_tools=["searchKnowledge", "createAppointment"],
        allowed_models=["phi3:mini", "llama3:8b"],
        input_schema={"type": "object", "properties": {"message": {"type": "string"}}},
        output_schema={"type": "object", "properties": {"response": {"type": "string"}, "intent": {"type": "string"}}},
        risk_level=RiskLevel.LOW.value,
        requires_human_approval=False
    ),
    AgentDescriptor(
        name="CustomerSupportAgent",
        description="Resolves support tickets, troubleshoots service issues, and manages refunds.",
        capabilities=["TROUBLESHOOTING", "TICKET_MANAGEMENT", "ESCALATION"],
        allowed_tools=["searchKnowledge", "updateCRM"],
        allowed_models=["llama3:8b", "mistral:7b"],
        input_schema={"type": "object", "properties": {"ticket_id": {"type": "string"}}},
        output_schema={"type": "object", "properties": {"resolution": {"type": "string"}}},
        risk_level=RiskLevel.MEDIUM.value,
        requires_human_approval=False
    ),
    AgentDescriptor(
        name="SalesAgent",
        description="Generates tailored business proposals, outreach pitches, and closing strategies.",
        capabilities=["PITCH_SYNTHESIS", "PROPOSAL_DRAFTING", "OBJECTION_HANDLING"],
        allowed_tools=["searchKnowledge", "createArtifact"],
        allowed_models=["llama3:8b", "command-r:35b"],
        input_schema={"type": "object", "properties": {"target_lead": {"type": "object"}}},
        output_schema={"type": "object", "properties": {"proposal": {"type": "string"}}},
        risk_level=RiskLevel.MEDIUM.value,
        requires_human_approval=False
    ),
    AgentDescriptor(
        name="LeadQualificationAgent",
        description="Evaluates prospect ICP fit, industry signals, and scoring criteria.",
        capabilities=["LEAD_SCORING", "ICP_MATCHING", "PROSPECT_ENRICHMENT"],
        allowed_tools=["searchWeb", "createLead"],
        allowed_models=["phi3:mini", "llama3:8b"],
        input_schema={"type": "object", "properties": {"prospect_data": {"type": "object"}}},
        output_schema={"type": "object", "properties": {"fit_score": {"type": "number"}}},
        risk_level=RiskLevel.LOW.value,
        requires_human_approval=False
    ),
    AgentDescriptor(
        name="WebsiteBuilderAgent",
        description="Synthesizes responsive HTML5 and Tailwind CSS websites with sandboxed testing.",
        capabilities=["HTML_SYNTHESIS", "TAILWIND_DESIGN", "SANDBOX_BUILD"],
        allowed_tools=["runSandboxBuild", "runTests", "createArtifact"],
        allowed_models=["qwen2.5-coder:7b", "deepseek-coder:6.7b", "qwen3-coder:latest"],
        input_schema={"type": "object", "properties": {"business_context": {"type": "object"}}},
        output_schema={"type": "object", "properties": {"html_code": {"type": "string"}, "status": {"type": "string"}}},
        risk_level=RiskLevel.MEDIUM.value,
        requires_human_approval=False
    ),
    AgentDescriptor(
        name="WebsiteAuditAgent",
        description="Inspects sites and screenshots, separating verified technical facts from recommendations.",
        capabilities=["CONVERSION_AUDIT", "SEO_INSPECTION", "FACT_VERIFICATION"],
        allowed_tools=["fetchWebsite", "analyzeImage", "createArtifact"],
        allowed_models=["llama3:8b", "llava:7b"],
        input_schema={"type": "object", "properties": {"target_url": {"type": "string"}}},
        output_schema={"type": "object", "properties": {"facts": {"type": "array"}, "recommendations": {"type": "array"}}},
        risk_level=RiskLevel.LOW.value,
        requires_human_approval=False
    ),
    AgentDescriptor(
        name="CodingAgent",
        description="Generates, validates, and refactors backend scripts, schemas, and endpoints.",
        capabilities=["PYTHON_SYNTHESIS", "SCHEMA_DESIGN", "CODE_VERIFICATION"],
        allowed_tools=["runTests", "createArtifact"],
        allowed_models=["deepseek-coder:6.7b", "qwen2.5-coder:7b", "qwen3-coder:latest"],
        input_schema={"type": "object", "properties": {"code_spec": {"type": "string"}}},
        output_schema={"type": "object", "properties": {"code": {"type": "string"}}},
        risk_level=RiskLevel.MEDIUM.value,
        requires_human_approval=False
    ),
    AgentDescriptor(
        name="ResearchAgent",
        description="Performs in-depth multi-source market, technical, and regulatory research.",
        capabilities=["MARKET_RESEARCH", "SYNTHESIS", "CITATION_EXTRACT"],
        allowed_tools=["searchWeb", "readDocument", "createArtifact"],
        allowed_models=["llama3:8b", "command-r:35b"],
        input_schema={"type": "object", "properties": {"query": {"type": "string"}}},
        output_schema={"type": "object", "properties": {"summary": {"type": "string"}}},
        risk_level=RiskLevel.LOW.value,
        requires_human_approval=False
    ),
    AgentDescriptor(
        name="VisionAgent",
        description="Visual analysis of layouts, designs, charts, and user interface screenshots.",
        capabilities=["IMAGE_INSPECTION", "OCR", "LAYOUT_AUDIT"],
        allowed_tools=["analyzeImage", "createArtifact"],
        allowed_models=["llava:7b", "llama3:8b"],
        input_schema={"type": "object", "properties": {"image_url": {"type": "string"}}},
        output_schema={"type": "object", "properties": {"visual_analysis": {"type": "string"}}},
        risk_level=RiskLevel.LOW.value,
        requires_human_approval=False
    ),
    AgentDescriptor(
        name="VoiceAgent",
        description="Low-latency conversational voice receptionist turns (STT -> Thinking -> TTS).",
        capabilities=["STT_TRANSCRIPTION", "INTENT_EVAL", "TTS_SYNTHESIS"],
        allowed_tools=["createVoiceSession", "searchKnowledge"],
        allowed_models=["phi3:mini", "llama3:8b"],
        input_schema={"type": "object", "properties": {"audio_payload": {"type": "string"}}},
        output_schema={"type": "object", "properties": {"text_response": {"type": "string"}}},
        risk_level=RiskLevel.LOW.value,
        requires_human_approval=False
    ),
    AgentDescriptor(
        name="BusinessPlanAgent",
        description="Drafts comprehensive multi-section operational and commercial business plans.",
        capabilities=["PLANNING", "OPERATING_MODEL", "RISK_ANALYSIS"],
        allowed_tools=["searchKnowledge", "createArtifact"],
        allowed_models=["llama3:8b", "command-r:35b"],
        input_schema={"type": "object", "properties": {"business_name": {"type": "string"}}},
        output_schema={"type": "object", "properties": {"sections": {"type": "object"}}},
        risk_level=RiskLevel.MEDIUM.value,
        requires_human_approval=False
    ),
    AgentDescriptor(
        name="MarketingAgent",
        description="Generates ad campaigns, email sequences, and multi-channel marketing calendars.",
        capabilities=["CAMPAIGN_DESIGN", "COPYWRITING", "FUNNEL_OPTIMIZATION"],
        allowed_tools=["searchKnowledge", "createArtifact"],
        allowed_models=["llama3:8b", "mistral:7b"],
        input_schema={"type": "object", "properties": {"target_audience": {"type": "string"}}},
        output_schema={"type": "object", "properties": {"campaign": {"type": "object"}}},
        risk_level=RiskLevel.LOW.value,
        requires_human_approval=False
    ),
    AgentDescriptor(
        name="FinancialAgent",
        description="Computes deterministic 12-month projections and explains financial levers.",
        capabilities=["DETERMINISTIC_MATH", "SCENARIOS", "PROJECTIONS"],
        allowed_tools=["calculateFinance", "createArtifact"],
        allowed_models=["llama3:8b", "phi3:mini"],
        input_schema={"type": "object", "properties": {"monthly_revenue": {"type": "number"}}},
        output_schema={"type": "object", "properties": {"metrics": {"type": "object"}, "csv_content": {"type": "string"}}},
        risk_level=RiskLevel.LOW.value,
        requires_human_approval=False
    ),
    AgentDescriptor(
        name="FinancialModelAgent",
        description="Deterministic mathematical modeling engine for cash flow, margins, and breakeven.",
        capabilities=["DETERMINISTIC_MATH", "SCENARIOS", "PROJECTIONS", "CSV_EXPORT"],
        allowed_tools=["calculateFinance", "createArtifact"],
        allowed_models=["llama3:8b", "phi3:mini"],
        input_schema={"type": "object", "properties": {"monthly_revenue": {"type": "number"}}},
        output_schema={"type": "object", "properties": {"metrics": {"type": "object"}, "csv_content": {"type": "string"}}},
        risk_level=RiskLevel.LOW.value,
        requires_human_approval=False
    ),
    AgentDescriptor(
        name="BrandGeneratorAgent",
        description="Creates multi-concept visual identity packages with parametric SVG vector logos and color palettes.",
        capabilities=["LOGO_DESIGN", "SVG_GENERATION", "PALETTE_SYNTHESIS"],
        allowed_tools=["createArtifact"],
        allowed_models=["llama3:8b", "phi3:mini"],
        input_schema={"type": "object", "properties": {"business_name": {"type": "string"}}},
        output_schema={"type": "object", "properties": {"active_concept": {"type": "object"}}},
        risk_level=RiskLevel.LOW.value,
        requires_human_approval=False
    ),
    AgentDescriptor(
        name="SEOAgent",
        description="Audits meta tags, keyword positioning, sitemaps, and search engine visibility.",
        capabilities=["METATAG_AUDIT", "KEYWORD_ANALYSIS", "SERP_READINESS"],
        allowed_tools=["fetchWebsite", "createArtifact"],
        allowed_models=["llama3:8b"],
        input_schema={"type": "object", "properties": {"domain": {"type": "string"}}},
        output_schema={"type": "object", "properties": {"seo_score": {"type": "number"}}},
        risk_level=RiskLevel.LOW.value,
        requires_human_approval=False
    ),
    AgentDescriptor(
        name="CompetitorAnalysisAgent",
        description="Analyzes rival offerings, pricing models, market positioning, and weaknesses.",
        capabilities=["COMPETITOR_BENCHMARKING", "PRICING_COMPARISON", "GAP_ANALYSIS"],
        allowed_tools=["searchWeb", "createArtifact"],
        allowed_models=["llama3:8b", "command-r:35b"],
        input_schema={"type": "object", "properties": {"industry": {"type": "string"}}},
        output_schema={"type": "object", "properties": {"rival_matrix": {"type": "array"}}},
        risk_level=RiskLevel.LOW.value,
        requires_human_approval=False
    ),
    AgentDescriptor(
        name="DocumentAgent",
        description="Compiles formal reports, contracts, executive summaries, and legal disclosures.",
        capabilities=["REPORT_SYNTHESIS", "CONTRACT_FORMATTING", "LEGAL_STRUCTURE"],
        allowed_tools=["readDocument", "createArtifact"],
        allowed_models=["llama3:8b", "command-r:35b"],
        input_schema={"type": "object", "properties": {"doc_type": {"type": "string"}}},
        output_schema={"type": "object", "properties": {"content": {"type": "string"}}},
        risk_level=RiskLevel.LOW.value,
        requires_human_approval=False
    ),
    AgentDescriptor(
        name="AutomationAgent",
        description="Configures and dispatches webhooks, CRM updates, and outbound messages.",
        capabilities=["WEBHOOK_DISPATCH", "MESSAGING", "INTEGRATION_ROUTING"],
        allowed_tools=["sendWhatsApp", "sendEmail", "sendSMS", "updateCRM"],
        allowed_models=["llama3:8b", "phi3:mini"],
        input_schema={"type": "object", "properties": {"action": {"type": "string"}}},
        output_schema={"type": "object", "properties": {"status": {"type": "string"}}},
        risk_level=RiskLevel.HIGH.value,
        requires_human_approval=True
    ),
    AgentDescriptor(
        name="AIEmployeeGeneratorAgent",
        description="Generates complete system blueprints for autonomous AI employees.",
        capabilities=["AGENT_BLUEPRINTING", "INSTRUCTION_COMPILATION", "SIMULATION_SETUP"],
        allowed_tools=["createArtifact", "runTests"],
        allowed_models=["llama3:8b", "command-r:35b"],
        input_schema={"type": "object", "properties": {"employee_role": {"type": "string"}}},
        output_schema={"type": "object", "properties": {"blueprint": {"type": "object"}}},
        risk_level=RiskLevel.MEDIUM.value,
        requires_human_approval=False
    ),
    AgentDescriptor(
        name="VoiceEmployeeGeneratorAgent",
        description="Compiles voice-specialized employee configurations, speech parameters, and call flows.",
        capabilities=["VOICE_PIPELINE_SETUP", "CALL_FLOW_DESIGN", "LATENCY_TUNING"],
        allowed_tools=["createArtifact", "createVoiceSession"],
        allowed_models=["llama3:8b"],
        input_schema={"type": "object", "properties": {"voice_profile": {"type": "string"}}},
        output_schema={"type": "object", "properties": {"voice_config": {"type": "object"}}},
        risk_level=RiskLevel.MEDIUM.value,
        requires_human_approval=False
    ),
    AgentDescriptor(
        name="LeadEmployeeGeneratorAgent",
        description="Creates automated lead research, qualification, and scoring worker bots.",
        capabilities=["LEAD_BOT_DESIGN", "ICP_ENRICHMENT", "DISCOVERY_PIPELINES"],
        allowed_tools=["createArtifact", "createLead"],
        allowed_models=["llama3:8b"],
        input_schema={"type": "object", "properties": {"target_icp": {"type": "object"}}},
        output_schema={"type": "object", "properties": {"bot_config": {"type": "object"}}},
        risk_level=RiskLevel.MEDIUM.value,
        requires_human_approval=False
    )
]

# Populate registry
for agent in _INITIAL_AGENTS:
    AgentRegistry.register(agent)
