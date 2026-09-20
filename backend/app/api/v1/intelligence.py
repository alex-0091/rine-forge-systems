"""
Rine Forge Systems V5 - Phase AS5: Forge Intelligence Fabric API Router
Exposes enterprise endpoints for cognitive orchestration, approval gates,
agent and tool registries, AI employee generation, simulation scorecards,
and resource governor monitoring.
"""
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from backend.app.ai.fabric import (
    forge_orchestrator,
    FabricRequest,
    FabricExecutionResponse,
    AgentRegistry,
    ForgeToolRegistry,
    HumanApprovalGate,
    BusinessToAICompanyEngine,
    AIEmployeeGeneratorEngine,
    SimulationEngine,
    ForgeEventBus,
    ResourceGovernor,
    ExecutionPlanner
)

router = APIRouter(prefix="/intelligence", tags=["Forge Intelligence Fabric"])


class PlanRequest(BaseModel):
    category: str
    user_goal: str
    business_context: Optional[Dict[str, Any]] = None


class ApprovalResolution(BaseModel):
    approved: bool
    operator_id: str = "operator"
    reason: Optional[str] = None


class EmployeeGenerationRequest(BaseModel):
    employee_type: str
    business_name: str = "Forge Business"


class BusinessDeconstructRequest(BaseModel):
    business_description: str


# ============================================================
# 1. CENTRAL PIPELINE
# ============================================================
@router.post("/process", response_model=FabricExecutionResponse)
async def process_natural_language_request(payload: FabricRequest):
    """
    Main cognitive pipeline ("Tell Forge what you need").
    Executes the 13-stage cognitive orchestration cycle.
    """
    return await forge_orchestrator.process_request(payload)


@router.post("/plan")
async def generate_and_validate_plan(payload: PlanRequest):
    """Generates and validates an internal execution plan for a specified task."""
    intent = {"user_goal": payload.user_goal}
    plan = ExecutionPlanner.generate_plan(payload.category, intent, payload.business_context)
    allowed_tools = [t.name for t in ForgeToolRegistry.list_all()]
    validation = ExecutionPlanner.validate_plan(plan, allowed_tools, permissions=["read", "write"])
    return {
        "plan": plan,
        "validation": validation
    }


# ============================================================
# 2. AGENTS & TOOLS INTROSPECTION
# ============================================================
@router.get("/agents")
async def list_registered_agents():
    """Lists all 21 specialized agents with their tools, models, and risk levels."""
    return [
        {
            "name": a.name,
            "description": a.description,
            "capabilities": a.capabilities,
            "allowed_tools": a.allowed_tools,
            "allowed_models": a.allowed_models,
            "risk_level": a.risk_level,
            "requires_human_approval": a.requires_human_approval
        }
        for a in AgentRegistry.list_all()
    ]


@router.get("/tools")
async def list_registered_tools():
    """Lists all 18 registered tools with permissions and risk levels."""
    return [
        {
            "name": t.name,
            "description": t.description,
            "permission": t.permission,
            "risk_level": t.risk_level,
            "has_side_effects": t.has_side_effects,
            "requires_audit": t.requires_audit
        }
        for t in ForgeToolRegistry.list_all()
    ]


# ============================================================
# 3. HUMAN APPROVAL QUEUE
# ============================================================
@router.get("/approvals")
async def list_pending_approvals(workspace_id: Optional[str] = None):
    """Lists all pending human approval requests for consequential actions."""
    return HumanApprovalGate.list_pending(workspace_id)


@router.post("/approvals/{approval_id}/resolve")
async def resolve_approval(approval_id: str, payload: ApprovalResolution):
    """Resolves an approval gate request (approving or rejecting consequential execution)."""
    res = HumanApprovalGate.resolve_request(
        approval_id=approval_id,
        approved=payload.approved,
        operator_id=payload.operator_id,
        reason=payload.reason
    )
    if not res:
        raise HTTPException(status_code=404, detail=f"Approval request '{approval_id}' not found.")
    return res


# ============================================================
# 4. BUSINESS TO AI COMPANY & EMPLOYEE GENERATOR
# ============================================================
@router.post("/company/deconstruct")
async def deconstruct_business_description(payload: BusinessDeconstructRequest):
    """Transforms a single sentence business description into a complete structured AI profile."""
    return BusinessToAICompanyEngine.generate_company_profile(payload.business_description)


@router.post("/employees/generate")
async def generate_ai_employee(payload: EmployeeGenerationRequest):
    """Generates turnkey blueprint for one of 10 autonomous AI employees."""
    return AIEmployeeGeneratorEngine.generate_blueprint(
        employee_type=payload.employee_type,
        business_name=payload.business_name
    )


@router.post("/employees/simulate")
async def simulate_ai_employee(blueprint: Dict[str, Any]):
    """Executes 10 synthetic customer scenarios against an employee blueprint."""
    return SimulationEngine.run_simulation(blueprint)


# ============================================================
# 5. RESOURCE GOVERNOR & EVENT BUS
# ============================================================
@router.get("/governor")
async def get_resource_governor_status():
    """Returns live hardware pressure and active AI concurrency metrics."""
    return ResourceGovernor.get_system_pressure()


@router.get("/events")
async def get_fabric_events(workspace_id: Optional[str] = None, limit: int = 25):
    """Returns recent internal fabric events for auditing and monitoring."""
    return ForgeEventBus.get_recent_events(workspace_id, limit)
