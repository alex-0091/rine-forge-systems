"""
Rine Forge Systems V5 - Forge Intelligence Fabric: Tool Registry
Master declaration of 18 authoritative tools.
Declares input/output schemas, permission keys, risk levels, workspace isolation,
and audit requirements.
"""
from typing import Dict, Any, List, Optional
from dataclasses import dataclass
from backend.app.ai.fabric.constants import RiskLevel


@dataclass
class ToolDescriptor:
    name: str
    description: str
    input_schema: Dict[str, Any]
    output_schema: Dict[str, Any]
    permission: str
    risk_level: str
    requires_workspace: bool
    requires_audit: bool
    has_side_effects: bool


class ForgeToolRegistry:
    """Authoritative registry of executable tools within the Forge Intelligence Fabric."""

    _tools: Dict[str, ToolDescriptor] = {}

    @classmethod
    def register(cls, tool: ToolDescriptor):
        cls._tools[tool.name] = tool

    @classmethod
    def get(cls, name: str) -> Optional[ToolDescriptor]:
        return cls._tools.get(name)

    @classmethod
    def list_all(cls) -> List[ToolDescriptor]:
        return list(cls._tools.values())


# ============================================================
# INITIALIZE 18 CORE TOOLS
# ============================================================
_INITIAL_TOOLS = [
    ToolDescriptor(
        name="searchKnowledge",
        description="Queries grounded business knowledge base, FAQs, and service schedules.",
        input_schema={"type": "object", "properties": {"query": {"type": "string"}}, "required": ["query"]},
        output_schema={"type": "object", "properties": {"matches": {"type": "array"}}},
        permission="knowledge.read",
        risk_level=RiskLevel.LOW.value,
        requires_workspace=True,
        requires_audit=False,
        has_side_effects=False
    ),
    ToolDescriptor(
        name="readDocument",
        description="Extracts textual content and metadata from uploaded PDFs and docs.",
        input_schema={"type": "object", "properties": {"doc_id": {"type": "string"}}, "required": ["doc_id"]},
        output_schema={"type": "object", "properties": {"text": {"type": "string"}}},
        permission="documents.read",
        risk_level=RiskLevel.LOW.value,
        requires_workspace=True,
        requires_audit=False,
        has_side_effects=False
    ),
    ToolDescriptor(
        name="createArtifact",
        description="Commits a finalized deliverable artifact to the workspace repository.",
        input_schema={"type": "object", "properties": {"name": {"type": "string"}, "type": {"type": "string"}, "data": {"type": "object"}}, "required": ["name", "type", "data"]},
        output_schema={"type": "object", "properties": {"artifact_id": {"type": "string"}, "status": {"type": "string"}}},
        permission="artifacts.create",
        risk_level=RiskLevel.MEDIUM.value,
        requires_workspace=True,
        requires_audit=True,
        has_side_effects=True
    ),
    ToolDescriptor(
        name="updateArtifact",
        description="Updates an existing deliverable artifact with new versioning.",
        input_schema={"type": "object", "properties": {"artifact_id": {"type": "string"}, "data": {"type": "object"}}, "required": ["artifact_id", "data"]},
        output_schema={"type": "object", "properties": {"version": {"type": "integer"}}},
        permission="artifacts.update",
        risk_level=RiskLevel.MEDIUM.value,
        requires_workspace=True,
        requires_audit=True,
        has_side_effects=True
    ),
    ToolDescriptor(
        name="sendEmail",
        description="Dispatches a verified outbound marketing or transactional email.",
        input_schema={"type": "object", "properties": {"recipient": {"type": "string"}, "subject": {"type": "string"}, "body": {"type": "string"}}, "required": ["recipient", "subject", "body"]},
        output_schema={"type": "object", "properties": {"message_id": {"type": "string"}, "status": {"type": "string"}}},
        permission="communications.send_email",
        risk_level=RiskLevel.HIGH.value,
        requires_workspace=True,
        requires_audit=True,
        has_side_effects=True
    ),
    ToolDescriptor(
        name="sendWhatsApp",
        description="Sends a customer outreach or confirmation WhatsApp message.",
        input_schema={"type": "object", "properties": {"phone_number": {"type": "string"}, "message": {"type": "string"}}, "required": ["phone_number", "message"]},
        output_schema={"type": "object", "properties": {"message_sid": {"type": "string"}, "status": {"type": "string"}}},
        permission="communications.send_whatsapp",
        risk_level=RiskLevel.HIGH.value,
        requires_workspace=True,
        requires_audit=True,
        has_side_effects=True
    ),
    ToolDescriptor(
        name="sendSMS",
        description="Dispatches an SMS notification to a verified phone number.",
        input_schema={"type": "object", "properties": {"phone_number": {"type": "string"}, "message": {"type": "string"}}, "required": ["phone_number", "message"]},
        output_schema={"type": "object", "properties": {"sid": {"type": "string"}, "status": {"type": "string"}}},
        permission="communications.send_sms",
        risk_level=RiskLevel.HIGH.value,
        requires_workspace=True,
        requires_audit=True,
        has_side_effects=True
    ),
    ToolDescriptor(
        name="createLead",
        description="Records a newly discovered prospect in the workspace CRM.",
        input_schema={"type": "object", "properties": {"company_name": {"type": "string"}, "contact_email": {"type": "string"}}, "required": ["company_name"]},
        output_schema={"type": "object", "properties": {"lead_id": {"type": "string"}}},
        permission="crm.create_lead",
        risk_level=RiskLevel.LOW.value,
        requires_workspace=True,
        requires_audit=True,
        has_side_effects=True
    ),
    ToolDescriptor(
        name="updateCRM",
        description="Updates contact status, lead stage, or deal notes in the workspace CRM.",
        input_schema={"type": "object", "properties": {"entity_id": {"type": "string"}, "updates": {"type": "object"}}, "required": ["entity_id", "updates"]},
        output_schema={"type": "object", "properties": {"status": {"type": "string"}}},
        permission="crm.update",
        risk_level=RiskLevel.HIGH.value,
        requires_workspace=True,
        requires_audit=True,
        has_side_effects=True
    ),
    ToolDescriptor(
        name="createAppointment",
        description="Reserves an appointment slot in the business scheduling calendar.",
        input_schema={"type": "object", "properties": {"service": {"type": "string"}, "slot": {"type": "string"}, "customer_name": {"type": "string"}}, "required": ["service", "slot"]},
        output_schema={"type": "object", "properties": {"appointment_id": {"type": "string"}, "status": {"type": "string"}}},
        permission="calendar.create_appointment",
        risk_level=RiskLevel.HIGH.value,
        requires_workspace=True,
        requires_audit=True,
        has_side_effects=True
    ),
    ToolDescriptor(
        name="searchWeb",
        description="Conducts public search engine queries for market information and competitors.",
        input_schema={"type": "object", "properties": {"query": {"type": "string"}}, "required": ["query"]},
        output_schema={"type": "object", "properties": {"results": {"type": "array"}}},
        permission="web.search",
        risk_level=RiskLevel.LOW.value,
        requires_workspace=False,
        requires_audit=False,
        has_side_effects=False
    ),
    ToolDescriptor(
        name="fetchWebsite",
        description="Fetches raw HTML DOM of a public website for technical analysis.",
        input_schema={"type": "object", "properties": {"url": {"type": "string"}}, "required": ["url"]},
        output_schema={"type": "object", "properties": {"html": {"type": "string"}, "status_code": {"type": "integer"}}},
        permission="web.fetch",
        risk_level=RiskLevel.LOW.value,
        requires_workspace=False,
        requires_audit=False,
        has_side_effects=False
    ),
    ToolDescriptor(
        name="analyzeImage",
        description="Processes an image or screenshot for visual elements, OCR, and UX layout.",
        input_schema={"type": "object", "properties": {"image_url": {"type": "string"}}, "required": ["image_url"]},
        output_schema={"type": "object", "properties": {"analysis": {"type": "string"}}},
        permission="vision.analyze",
        risk_level=RiskLevel.LOW.value,
        requires_workspace=False,
        requires_audit=False,
        has_side_effects=False
    ),
    ToolDescriptor(
        name="generateImage",
        description="Synthesizes visual assets, branding elements, or placeholder graphics.",
        input_schema={"type": "object", "properties": {"prompt": {"type": "string"}}, "required": ["prompt"]},
        output_schema={"type": "object", "properties": {"image_base64": {"type": "string"}}},
        permission="vision.generate",
        risk_level=RiskLevel.LOW.value,
        requires_workspace=True,
        requires_audit=False,
        has_side_effects=False
    ),
    ToolDescriptor(
        name="runSandboxBuild",
        description="Performs an isolated AST syntax, security, and rendering check on HTML code.",
        input_schema={"type": "object", "properties": {"code": {"type": "string"}}, "required": ["code"]},
        output_schema={"type": "object", "properties": {"status": {"type": "string"}, "is_safe": {"type": "boolean"}}},
        permission="sandbox.build",
        risk_level=RiskLevel.LOW.value,
        requires_workspace=True,
        requires_audit=True,
        has_side_effects=False
    ),
    ToolDescriptor(
        name="runTests",
        description="Executes automated unit or behavioral simulation tests against an artifact.",
        input_schema={"type": "object", "properties": {"target": {"type": "string"}, "suite": {"type": "string"}}, "required": ["target"]},
        output_schema={"type": "object", "properties": {"passed": {"type": "integer"}, "failed": {"type": "integer"}}},
        permission="sandbox.test",
        risk_level=RiskLevel.LOW.value,
        requires_workspace=True,
        requires_audit=False,
        has_side_effects=False
    ),
    ToolDescriptor(
        name="calculateFinance",
        description="Runs exact deterministic arithmetic formulas for financial projections and COGS.",
        input_schema={"type": "object", "properties": {"revenue": {"type": "number"}, "cogs": {"type": "number"}}, "required": ["revenue"]},
        output_schema={"type": "object", "properties": {"gross_profit": {"type": "number"}, "margin": {"type": "number"}}},
        permission="finance.calculate",
        risk_level=RiskLevel.LOW.value,
        requires_workspace=False,
        requires_audit=False,
        has_side_effects=False
    ),
    ToolDescriptor(
        name="createVoiceSession",
        description="Allocates a real-time conversational voice turn session with STT and TTS buffers.",
        input_schema={"type": "object", "properties": {"business_name": {"type": "string"}}, "required": ["business_name"]},
        output_schema={"type": "object", "properties": {"session_id": {"type": "string"}, "state": {"type": "string"}}},
        permission="voice.session",
        risk_level=RiskLevel.LOW.value,
        requires_workspace=True,
        requires_audit=True,
        has_side_effects=True
    )
]

for tool in _INITIAL_TOOLS:
    ForgeToolRegistry.register(tool)
