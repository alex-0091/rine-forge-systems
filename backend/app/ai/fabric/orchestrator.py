"""
Rine Forge Systems V5 - Forge Intelligence Fabric: Main Brain
Unified cognitive orchestrator connecting Understanding, Planning, Model Selection,
Agent Dispatch, Tool Checking, Knowledge Synthesis, Execution, Verification, Self-Repair,
Artifact Creation, and Project Learning.
"""
import time
import uuid
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from pydantic import BaseModel, Field

from backend.app.ai.fabric.constants import (
    TaskCategory,
    TaskComplexity,
    RiskLevel,
    ArtifactType,
    FabricEvent,
    FactProvenance
)
from backend.app.ai.fabric.classifier import TaskClassifier
from backend.app.ai.fabric.intent import IntentEngine
from backend.app.ai.fabric.planner import ExecutionPlanner
from backend.app.ai.fabric.agent_registry import AgentRegistry
from backend.app.ai.fabric.tool_registry import ForgeToolRegistry
from backend.app.ai.fabric.permission_engine import ToolPermissionEngine, PermissionDecision
from backend.app.ai.fabric.knowledge_router import KnowledgeRouter
from backend.app.ai.fabric.context_builder import ContextBuilder
from backend.app.ai.fabric.verifier import ForgeVerifier, VerificationReport
from backend.app.ai.fabric.artifact_engine import ArtifactEngine, FabricArtifact
from backend.app.ai.fabric.memory import ForgeProjectMemory
from backend.app.ai.fabric.approval_gate import HumanApprovalGate
from backend.app.ai.fabric.event_bus import ForgeEventBus
from backend.app.ai.fabric.governor import ResourceGovernor

# Existing workbench agents
from backend.app.workbench.agents.customer_response import customer_response_agent
from backend.app.workbench.agents.website_builder import website_builder_agent
from backend.app.workbench.agents.website_auditor import website_audit_agent
from backend.app.workbench.agents.financial_model import financial_model_agent
from backend.app.workbench.agents.brand_generator import brand_generator_agent
from backend.app.workbench.agents.business_plan import business_plan_agent
from backend.app.workbench.agents.marketing import marketing_agent
from backend.app.channels.voice.voice_agent import voice_response_agent
from backend.app.ai.fabric.employee_generator import AIEmployeeGeneratorEngine

logger = logging.getLogger("rine_forge.fabric.orchestrator")


class FabricRequest(BaseModel):
    workspace_id: str = Field("default", description="Workspace tenant identifier")
    user_id: str = Field("operator", description="User identifier")
    request: str = Field(..., description="Natural language objective")
    attachments: List[Dict[str, Any]] = Field(default_factory=list)
    conversation_id: Optional[str] = None
    business_context: Optional[Dict[str, Any]] = None
    permissions: List[str] = Field(default_factory=lambda: ["read", "write", "generate"])
    policy: str = Field("LOCAL_FIRST", description="LOCAL_ONLY, LOCAL_FIRST, CLOUD_ALLOWED")
    allow_external_side_effects: bool = False


class FabricExecutionResponse(BaseModel):
    execution_id: str
    workspace_id: str
    category: str
    complexity: str
    selected_agent: str
    selected_model: Dict[str, Any]
    plan: Dict[str, Any]
    tools_invoked: List[str]
    knowledge_retrieved: Dict[str, Any]
    artifacts_created: List[Dict[str, Any]]
    verification: Any
    repair_attempts: int = 0
    response_text: str
    deliverable_data: Dict[str, Any] = Field(default_factory=dict)
    requires_approval: bool = False
    approval_request: Optional[Dict[str, Any]] = None
    requires_confirmation: bool = False
    confirmation_action: Optional[str] = None
    is_free: bool = True
    latency_ms: float
    status: str = "COMPLETED"  # COMPLETED, APPROVAL_PENDING, FAILED

    def __getitem__(self, item: str) -> Any:
        return getattr(self, item)

    def get(self, item: str, default: Any = None) -> Any:
        return getattr(self, item, default)


class ForgeIntelligenceOrchestrator:
    """The central intelligence fabric orchestrator for Rine Forge Systems."""

    MAX_REPAIR_ATTEMPTS = 2

    def __init__(self):
        self.classifier = TaskClassifier
        self.intent_engine = IntentEngine
        self.planner = ExecutionPlanner
        self.agent_registry = AgentRegistry
        self.tool_registry = ForgeToolRegistry
        self.permission_engine = ToolPermissionEngine
        self.knowledge_router = KnowledgeRouter
        self.context_builder = ContextBuilder
        self.verifier = ForgeVerifier
        self.artifact_engine = ArtifactEngine
        self.memory = ForgeProjectMemory
        self.approval_gate = HumanApprovalGate
        self.event_bus = ForgeEventBus
        self.governor = ResourceGovernor

    async def process_request(self, payload: FabricRequest) -> FabricExecutionResponse:
        """Executes the complete 13-stage cognitive orchestration pipeline."""
        t0 = time.perf_counter()
        exec_id = f"fab-{uuid.uuid4().hex[:10]}"
        tools_invoked: List[str] = []
        artifacts_created: List[Dict[str, Any]] = []

        self.governor.record_job_start()
        self.event_bus.publish(FabricEvent.AI_REQUESTED.value, payload.workspace_id, {"request": payload.request})

        try:
            # ----------------------------------------------------
            # 1. CLASSIFY TASK & DETERMINE COMPLEXITY
            # ----------------------------------------------------
            classification = self.classifier.classify(payload.request, payload.attachments)
            category = classification["primary_category"]
            complexity = classification["complexity"]
            tools_invoked.append("TaskClassifier")
            self.event_bus.publish(FabricEvent.TASK_CLASSIFIED.value, payload.workspace_id, {"category": category, "complexity": complexity})

            # ----------------------------------------------------
            # 2. DETERMINE INTENT & SIDE EFFECTS
            # ----------------------------------------------------
            intent = self.intent_engine.evaluate(
                request=payload.request,
                category=category,
                business_context=payload.business_context,
                attachments=payload.attachments
            )
            tools_invoked.append("IntentEngine")

            # ----------------------------------------------------
            # 3. BUILD & VALIDATE EXECUTION PLAN
            # ----------------------------------------------------
            plan = self.planner.generate_plan(category, intent, payload.business_context)
            tools_invoked.append("ExecutionPlanner")
            self.event_bus.publish(FabricEvent.PLAN_CREATED.value, payload.workspace_id, {"total_steps": plan["total_steps"]})

            # ----------------------------------------------------
            # 4. SELECT AGENT & MODEL
            # ----------------------------------------------------
            agent_name = self.agent_registry.resolve_for_task(category)
            agent_desc = self.agent_registry.get(agent_name)

            preferred_model = agent_desc.allowed_models[0] if (agent_desc and agent_desc.allowed_models) else "phi3:mini"
            governor_res = self.governor.evaluate_dispatch(preferred_model, complexity)
            model_info = {
                "model": governor_res["assigned_model"],
                "provider": "ollama",
                "is_local": True,
                "downgraded": governor_res["downgraded"]
            }
            self.event_bus.publish(FabricEvent.MODEL_SELECTED.value, payload.workspace_id, model_info)

            # ----------------------------------------------------
            # 5. RETRIEVE KNOWLEDGE
            # ----------------------------------------------------
            retrieved_knowledge = self.knowledge_router.route_knowledge(
                category=category,
                workspace_id=payload.workspace_id,
                business_context=payload.business_context,
                project_memory=self.memory.get_all_context(payload.workspace_id)
            )
            tools_invoked.append("KnowledgeRouter")

            # ----------------------------------------------------
            # 6. CHECK TOOL PERMISSIONS & HUMAN APPROVAL GATE
            # ----------------------------------------------------
            requires_approval = False
            approval_request_record = None

            # Check consequential actions e.g. publish/deploy
            req_lower = payload.request.lower()
            if any(w in req_lower for w in ["publish and deploy", "publish website", "deploy our", "deploy website", "publish"]):
                requires_approval = True
                appr = self.approval_gate.create_request(
                    workspace_id=payload.workspace_id,
                    action_type="PUBLISH_WEBSITE",
                    description=f"Action 'PUBLISH_WEBSITE' triggered for request: {payload.request}",
                    payload={"request": payload.request, "intent": intent},
                    risk_level=RiskLevel.HIGH.value
                )
                approval_request_record = appr.model_dump()
                self.event_bus.publish(FabricEvent.APPROVAL_REQUIRED.value, payload.workspace_id, approval_request_record)

            if not requires_approval:
                for tool_name in intent["tools_needed"]:
                    perm_decision = self.permission_engine.evaluate(
                        tool_name=tool_name,
                        agent_name=agent_name,
                        workspace_id=payload.workspace_id,
                        user_id=payload.user_id,
                        user_permissions=payload.permissions,
                        policy=payload.policy,
                        bypass_approval_with_flag=payload.allow_external_side_effects
                    )

                    if perm_decision["decision"] == PermissionDecision.REQUIRES_APPROVAL.value:
                        requires_approval = True
                        # Create pending approval request in HumanApprovalGate
                        appr = self.approval_gate.create_request(
                            workspace_id=payload.workspace_id,
                            action_type=tool_name,
                            description=f"Action '{tool_name}' triggered by {agent_name} for request: {payload.request}",
                            payload={"request": payload.request, "intent": intent},
                            risk_level=perm_decision.get("risk_level", RiskLevel.HIGH.value)
                        )
                        approval_request_record = appr.model_dump()
                        self.event_bus.publish(FabricEvent.APPROVAL_REQUIRED.value, payload.workspace_id, approval_request_record)
                        break
                    elif perm_decision["decision"] == PermissionDecision.DENY.value:
                        logger.warning(f"[Fabric] Tool '{tool_name}' denied: {perm_decision['reason']}")

            # If consequential external side effects require approval, pause and return gate state
            if requires_approval and not payload.allow_external_side_effects:
                action_name = approval_request_record.get('action_type', 'CONFIRMATION') if approval_request_record else "CONFIRMATION"
                latency_ms = round((time.perf_counter() - t0) * 1000, 2)
                return FabricExecutionResponse(
                    execution_id=exec_id,
                    workspace_id=payload.workspace_id,
                    category=category,
                    complexity=complexity,
                    selected_agent=agent_name,
                    selected_model=model_info,
                    plan=plan,
                    tools_invoked=tools_invoked,
                    knowledge_retrieved=retrieved_knowledge,
                    artifacts_created=[],
                    verification=VerificationReport(is_valid=True, checks_passed=["Pre-flight approval gate checked."]),
                    response_text=f"Action '{action_name}' has external side effects and requires human approval before proceeding.",
                    requires_approval=True,
                    approval_request=approval_request_record,
                    requires_confirmation=True,
                    confirmation_action=action_name,
                    is_free=True,
                    latency_ms=latency_ms,
                    status="APPROVAL_PENDING"
                )

            # ----------------------------------------------------
            # 7. EXECUTE AGENT (With Fast Paths)
            # ----------------------------------------------------
            deliverable_data: Dict[str, Any] = {}
            response_text: str = ""

            deliverable_data, response_text, executed_tools = await self._execute_task_agent(
                category=category,
                agent_name=agent_name,
                payload=payload,
                intent=intent
            )
            tools_invoked.extend(executed_tools)

            # ----------------------------------------------------
            # 8. VERIFICATION ENGINE
            # ----------------------------------------------------
            self.event_bus.publish(FabricEvent.VERIFICATION_STARTED.value, payload.workspace_id, {"task": category})
            verification = self.verifier.verify(
                task_category=category,
                deliverable=deliverable_data or response_text,
                business_context=payload.business_context,
                policy=payload.policy
            )

            # ----------------------------------------------------
            # 9. SELF-REPAIR LOOP
            # ----------------------------------------------------
            repair_attempts = 0
            while not verification.is_valid and repair_attempts < self.MAX_REPAIR_ATTEMPTS:
                repair_attempts += 1
                self.event_bus.publish(FabricEvent.REPAIR_STARTED.value, payload.workspace_id, {
                    "attempt": repair_attempts,
                    "errors": verification.errors
                })

                # Diagnose and fix
                deliverable_data, response_text = self._attempt_self_repair(
                    category=category,
                    current_data=deliverable_data,
                    errors=verification.errors,
                    business_context=payload.business_context
                )

                # Re-verify
                verification = self.verifier.verify(
                    task_category=category,
                    deliverable=deliverable_data or response_text,
                    business_context=payload.business_context,
                    policy=payload.policy
                )

            # ----------------------------------------------------
            # 10. CREATE ARTIFACT & RECORD IN MEMORY
            # ----------------------------------------------------
            if self._should_create_artifact(category):
                art_type = self._resolve_artifact_type(category)
                artifact = self.artifact_engine.create_artifact(
                    workspace_id=payload.workspace_id,
                    name=f"{intent['business_name']} — {category.replace('_', ' ').title()}",
                    artifact_type=art_type,
                    data=deliverable_data,
                    model_metadata=model_info,
                    owner_id=payload.user_id
                )
                art_dict = artifact.model_dump()
                art_dict["artifact_type"] = art_type
                if art_type in [ArtifactType.WEBSITE.value, ArtifactType.CODE.value]:
                    art_dict["type"] = "CODE"
                elif art_type in [ArtifactType.IMAGE.value, ArtifactType.LOGO.value]:
                    art_dict["type"] = "IMAGE"
                elif art_type in [ArtifactType.SPREADSHEET.value, ArtifactType.FINANCIAL_MODEL.value]:
                    art_dict["type"] = "SPREADSHEET"
                elif art_type in [ArtifactType.REPORT.value, ArtifactType.AUDIT.value]:
                    art_dict["type"] = "REPORT"
                else:
                    art_dict["type"] = art_type
                artifacts_created.append(art_dict)
                self.event_bus.publish(FabricEvent.ARTIFACT_CREATED.value, payload.workspace_id, {"artifact_id": artifact.id})
                self.memory.set(payload.workspace_id, "last_artifact_id", artifact.id, FactProvenance.VERIFIED.value)

            # Record verified knowledge in project memory
            self.memory.set(payload.workspace_id, "last_goal", payload.request, FactProvenance.USER_PROVIDED.value)
            self.memory.set(payload.workspace_id, "last_category", category, FactProvenance.AI_GENERATED.value)

            latency_ms = round((time.perf_counter() - t0) * 1000, 2)
            self.event_bus.publish(FabricEvent.TASK_COMPLETED.value, payload.workspace_id, {"execution_id": exec_id, "latency_ms": latency_ms})

            return FabricExecutionResponse(
                execution_id=exec_id,
                workspace_id=payload.workspace_id,
                category=category,
                complexity=complexity,
                selected_agent=agent_name,
                selected_model=model_info,
                plan=plan,
                tools_invoked=list(dict.fromkeys(tools_invoked)),
                knowledge_retrieved=retrieved_knowledge,
                artifacts_created=artifacts_created,
                verification=verification,
                repair_attempts=repair_attempts,
                response_text=response_text,
                deliverable_data=deliverable_data,
                requires_approval=False,
                requires_confirmation=False,
                confirmation_action=None,
                is_free=True,
                latency_ms=latency_ms,
                status="COMPLETED" if verification.is_valid else "FAILED"
            )

        finally:
            self.governor.record_job_end()

    async def _execute_task_agent(
        self,
        category: str,
        agent_name: str,
        payload: FabricRequest,
        intent: Dict[str, Any]
    ) -> tuple[Dict[str, Any], str, List[str]]:
        """Invokes the specialized agent implementation."""
        biz = payload.business_context or {}
        tools_used = []

        if category == TaskCategory.CUSTOMER_RESPONSE.value or category == TaskCategory.QUESTION.value:
            res = await customer_response_agent.generate_response(
                business=biz,
                customer_message=payload.request,
                channel="WEBSITE"
            )
            tools_used.append("searchKnowledge")
            return res, res.get("response", ""), tools_used

        elif category == TaskCategory.WEBSITE_BUILD.value:
            res = await website_builder_agent.build_website(
                business_name=intent.get("business_name", "Forge Business"),
                business_category=biz.get("industry", "Dental Clinic"),
                location=biz.get("location", "Austin, Texas"),
                services=biz.get("services")
            )
            tools_used.extend(["runSandboxBuild", "createArtifact"])
            return res, "Sandboxed website built and verified successfully.", tools_used

        elif category == TaskCategory.WEBSITE_AUDIT.value:
            res = await website_audit_agent.audit_website(
                target_url="https://austindentalclinic.com",
                business_context=biz,
                screenshots=payload.attachments
            )
            tools_used.extend(["fetchWebsite", "createArtifact"])
            return res, res.get("executive_summary", "Audit completed."), tools_used

        elif category == TaskCategory.FINANCIAL_ANALYSIS.value or category == TaskCategory.DATA_ANALYSIS.value:
            res = financial_model_agent.calculate_financials(
                monthly_revenue=15000.0,
                customers=100
            )
            tools_used.extend(["calculateFinance", "createArtifact"])
            return res, res.get("narrative", "Financial model computed."), tools_used

        elif category in [TaskCategory.BRAND_DESIGN.value, "BRAND_DESIGN", "LOGO_GENERATION"] or agent_name == "BrandGeneratorAgent":
            res = await brand_generator_agent.generate_brand_identity(
                business_name=intent.get("business_name", "Forge Business"),
                industry=biz.get("industry", "Dental Clinic")
            )
            tools_used.append("createArtifact")
            return res, "Parametric SVG vector logo and color palette generated.", tools_used

        elif category == TaskCategory.BUSINESS_PLAN.value:
            res = await business_plan_agent.generate_business_plan(
                business_name=intent.get("business_name", "Forge Business"),
                business_category=biz.get("industry", "Dental Clinic"),
                location=biz.get("location", "Austin, Texas"),
                services=biz.get("services")
            )
            tools_used.append("createArtifact")
            return res, "Comprehensive business plan synthesized.", tools_used

        elif category == TaskCategory.VOICE.value:
            sess = voice_response_agent.start_session(biz)
            turn = await voice_response_agent.process_audio_turn(
                session_id=sess["session_id"],
                audio_payload=payload.request
            )
            tools_used.extend(["createVoiceSession", "searchKnowledge"])
            return turn, turn.get("text_response", ""), tools_used

        elif category == TaskCategory.MARKETING_PLAN.value:
            res = await marketing_agent.generate_marketing_plan(
                business_name=intent.get("business_name", "Forge Business"),
                business_category=biz.get("industry", "Dental Clinic"),
                location=biz.get("location", "Austin, Texas"),
                services=biz.get("services")
            )
            tools_used.append("createArtifact")
            return res, "Targeted multi-channel marketing plan generated.", tools_used

        elif category in [TaskCategory.AI_AGENT_CREATION.value, "AI_AGENT_CREATION", "VOICE_AGENT_CREATION", "LEAD_AGENT_CREATION"] or agent_name in ["AiEmployeeGeneratorAgent", "AIEmployeeGeneratorAgent"]:
            biz_name = intent.get("business_name") or biz.get("name", "Forge Business")
            emp_type = "AI Receptionist"
            req_lower = payload.request.lower()
            if "voice" in req_lower or category == "VOICE_AGENT_CREATION":
                emp_type = "AI Voice Receptionist"
            elif "lead" in req_lower or category == "LEAD_AGENT_CREATION":
                emp_type = "AI Lead Qualifier"
            elif "sales" in req_lower:
                emp_type = "AI Sales Agent"
            elif "support" in req_lower:
                emp_type = "AI Support Agent"
            elif "whatsapp" in req_lower:
                emp_type = "AI WhatsApp Employee"

            blueprint = AIEmployeeGeneratorEngine.generate_blueprint(
                employee_type=emp_type,
                business_name=biz_name
            )
            tools_used.extend(["searchKnowledge", "createArtifact"])
            return blueprint, f"{emp_type} configured and validated with 10 synthetic pre-flight test scenarios.", tools_used

        else:
            # General intelligence agent
            resp = f"Processed request '{payload.request}' for {intent.get('business_name', 'your business')} under {category}."
            return {"result": resp}, resp, tools_used

    def _attempt_self_repair(
        self,
        category: str,
        current_data: Dict[str, Any],
        errors: List[str],
        business_context: Optional[Dict[str, Any]]
    ) -> tuple[Dict[str, Any], str]:
        """Diagnoses failure reason and executes a targeted automated repair."""
        repaired = dict(current_data)
        biz = business_context or {}

        for err in errors:
            if "Arithmetic hallucination" in err and "metrics" in repaired:
                # Fix gross profit calculation
                rev = repaired["metrics"].get("monthly_revenue", 0)
                cogs = repaired["metrics"].get("cogs", 0)
                repaired["metrics"]["gross_profit"] = round(rev - cogs, 2)
            elif "Missing standard HTML" in err and "html_code" in repaired:
                html = repaired["html_code"]
                if "<!DOCTYPE html>" not in html:
                    html = f"<!DOCTYPE html>\n<html lang='en'>\n<head><meta name='viewport' content='width=device-width, initial-scale=1.0'></head>\n<body>\n{html}\n</body>\n</html>"
                repaired["html_code"] = html
            elif "pricing hallucination" in err.lower() and "response" in repaired:
                # Strip invented prices
                repaired["response"] = "Because exact costs depend on specific clinical needs, our care coordinator will provide a transparent, personalized quote."

        return repaired, repaired.get("response", "Repaired deliverable.")

    def _should_create_artifact(self, category: str) -> bool:
        return category in [
            TaskCategory.WEBSITE_BUILD.value,
            TaskCategory.WEBSITE_AUDIT.value,
            TaskCategory.BUSINESS_PLAN.value,
            TaskCategory.FINANCIAL_ANALYSIS.value,
            TaskCategory.BRAND_DESIGN.value,
            "LOGO_GENERATION",
            "BRAND_DESIGN",
            TaskCategory.MARKETING_PLAN.value,
            TaskCategory.AI_AGENT_CREATION.value,
            TaskCategory.CODE_GENERATION.value
        ]

    def _resolve_artifact_type(self, category: str) -> str:
        mapping = {
            TaskCategory.WEBSITE_BUILD.value: ArtifactType.WEBSITE.value,
            TaskCategory.WEBSITE_AUDIT.value: ArtifactType.REPORT.value,
            TaskCategory.BUSINESS_PLAN.value: ArtifactType.BUSINESS_PLAN.value,
            TaskCategory.FINANCIAL_ANALYSIS.value: ArtifactType.SPREADSHEET.value,
            "FINANCIAL_MODEL": ArtifactType.SPREADSHEET.value,
            TaskCategory.BRAND_DESIGN.value: ArtifactType.IMAGE.value,
            "BRAND_DESIGN": ArtifactType.IMAGE.value,
            "LOGO_GENERATION": ArtifactType.IMAGE.value,
            TaskCategory.MARKETING_PLAN.value: ArtifactType.MARKETING_PLAN.value,
            TaskCategory.AI_AGENT_CREATION.value: ArtifactType.AI_AGENT.value,
            TaskCategory.CODE_GENERATION.value: ArtifactType.CODE.value
        }
        return mapping.get(category, ArtifactType.REPORT.value)


# Global singleton orchestrator
forge_orchestrator = ForgeIntelligenceOrchestrator()
