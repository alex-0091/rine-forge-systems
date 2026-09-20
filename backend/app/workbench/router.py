"""
Rine Forge Systems V5 - Phase AQ: AI Business Workbench Master Router
Exposes enterprise endpoints for natural-language business request planning,
project & task execution, artifact management, universal command interpretation,
and transparent model hub introspection.
"""
import uuid
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status, Query, Header
from pydantic import BaseModel, Field
from sqlalchemy import select, desc
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.database import get_db
from backend.app.models.v5 import (
    Business,
    V5Project,
    V5WorkbenchTask,
    V5WorkbenchArtifact
)
from backend.app.workbench.planner import business_request_planner, PlannedProject
from backend.app.workbench.task_router import task_router
from backend.app.workbench.model_hub import model_hub, ModelSelectionPolicy
from backend.app.workbench.execution_service import workbench_execution_service
from backend.app.workbench.hardware_profiler import hardware_profiler
from backend.app.workbench.intelligence_orchestrator import (
    forge_orchestrator,
    FabricRequest,
    FabricExecutionResponse
)
from backend.app.ai.model_discovery import model_discovery_service
from backend.app.ai.ollama_adapter import ollama_adapter

logger = logging.getLogger("rine_forge.workbench.router")

router = APIRouter(prefix="/workbench", tags=["AI Business Workbench"])


# ============================================================
# TENANT CONTEXT RESOLUTION
# ============================================================
async def resolve_tenant(
    x_business_id: Optional[str] = Header(None, alias="X-Business-ID"),
    query_biz_id: Optional[str] = Query(None, alias="business_id"),
    session: AsyncSession = Depends(get_db)
) -> Business:
    target_id = x_business_id or query_biz_id
    if target_id:
        stmt = select(Business).where(Business.id == target_id)
        res = await session.execute(stmt)
        biz = res.scalar_one_or_none()
        if biz:
            return biz

    # Fallback to primary business
    stmt = select(Business).order_by(Business.created_at.asc()).limit(1)
    res = await session.execute(stmt)
    biz = res.scalar_one_or_none()
    if biz:
        return biz

    # Auto-seed default business if none exists
    default_biz = Business(
        id=str(uuid.uuid4()),
        name="Rine Forge Studio",
        industry="Technology & Business Consulting",
        email="operator@rineforge.internal",
        status="ACTIVE"
    )
    session.add(default_biz)
    await session.commit()
    await session.refresh(default_biz)
    return default_biz


# ============================================================
# PYDANTIC SCHEMAS
# ============================================================
class PlanRequest(BaseModel):
    natural_language_request: str = Field(..., description="Business owner's natural-language objective")
    business_id: Optional[str] = None


class CreateProjectRequest(BaseModel):
    natural_language_request: str = Field(..., description="Business owner's natural-language objective")
    name: Optional[str] = Field(None, description="Optional override for project name")
    business_id: Optional[str] = None


class UniversalCommandRequest(BaseModel):
    command: str = Field(..., description="Natural language command / prompt for Rine Forge")
    project_id: Optional[str] = None
    business_id: Optional[str] = None


class UpdateArtifactRequest(BaseModel):
    content_text: Optional[str] = None
    data_json: Optional[Dict[str, Any]] = None
    status: Optional[str] = None


class ConfirmArtifactRequest(BaseModel):
    action: str = Field("PUBLISH", description="Action to confirm: e.g. PUBLISH, DEPLOY, SEND_OUTREACH")


# ============================================================
# ENDPOINTS
# ============================================================

@router.post("/plan", response_model=Dict[str, Any])
async def plan_business_request(
    payload: PlanRequest,
    tenant: Business = Depends(resolve_tenant)
) -> Dict[str, Any]:
    """
    Analyzes a natural language request and decomposes it into a structured
    project plan with tasks, facts identified, assumptions made, and missing information.
    """
    biz_profile = {
        "name": tenant.name,
        "industry": tenant.industry
    }
    plan: PlannedProject = business_request_planner.plan_request(
        natural_language_request=payload.natural_language_request,
        business_profile=biz_profile
    )
    return plan.model_dump()


@router.post("/projects", status_code=status.HTTP_201_CREATED)
async def create_project(
    payload: CreateProjectRequest,
    tenant: Business = Depends(resolve_tenant),
    session: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """
    Creates a new project and associated task queue from a natural language request.
    """
    project = await workbench_execution_service.create_project_from_request(
        session=session,
        business_id=tenant.id,
        natural_language_request=payload.natural_language_request,
        project_name_override=payload.name
    )

    # Fetch tasks
    task_stmt = select(V5WorkbenchTask).where(V5WorkbenchTask.project_id == project.id).order_by(V5WorkbenchTask.priority.asc())
    task_res = await session.execute(task_stmt)
    tasks = task_res.scalars().all()

    return {
        "id": project.id,
        "business_id": project.business_id,
        "name": project.name,
        "description": project.description,
        "status": project.status,
        "input_request": project.input_request,
        "planner_output": project.planner_output,
        "meta_json": project.meta_json,
        "created_at": project.created_at.isoformat() if project.created_at else None,
        "tasks": [
            {
                "id": t.id,
                "task_type": t.task_type,
                "priority": t.priority,
                "status": t.status,
                "provider_id": t.provider_id,
                "model_id": t.model_id,
                "progress_step": t.progress_step,
                "result_summary": t.result_summary,
                "requires_confirmation": t.requires_confirmation,
                "meta_json": t.meta_json
            }
            for t in tasks
        ]
    }


@router.get("/projects")
async def list_projects(
    tenant: Business = Depends(resolve_tenant),
    session: AsyncSession = Depends(get_db)
) -> List[Dict[str, Any]]:
    """
    Lists all projects for the tenant with task and artifact counts.
    """
    stmt = (
        select(V5Project)
        .where(V5Project.business_id == tenant.id)
        .options(selectinload(V5Project.tasks), selectinload(V5Project.artifacts))
        .order_by(desc(V5Project.created_at))
    )
    res = await session.execute(stmt)
    projects = res.scalars().all()

    return [
        {
            "id": p.id,
            "business_id": p.business_id,
            "name": p.name,
            "description": p.description,
            "status": p.status,
            "input_request": p.input_request,
            "tasks_count": len(p.tasks),
            "completed_tasks_count": sum(1 for t in p.tasks if t.status == "COMPLETED"),
            "artifacts_count": len(p.artifacts),
            "created_at": p.created_at.isoformat() if p.created_at else None,
            "updated_at": p.updated_at.isoformat() if p.updated_at else None,
            "meta_json": p.meta_json
        }
        for p in projects
    ]


@router.get("/projects/{project_id}")
async def get_project(
    project_id: str,
    tenant: Business = Depends(resolve_tenant),
    session: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """
    Retrieves full details of a project, its task statuses, and generated artifacts.
    """
    stmt = (
        select(V5Project)
        .where(V5Project.id == project_id, V5Project.business_id == tenant.id)
        .options(selectinload(V5Project.tasks), selectinload(V5Project.artifacts))
    )
    res = await session.execute(stmt)
    project = res.scalars().first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    return {
        "id": project.id,
        "business_id": project.business_id,
        "name": project.name,
        "description": project.description,
        "status": project.status,
        "input_request": project.input_request,
        "planner_output": project.planner_output,
        "meta_json": project.meta_json,
        "created_at": project.created_at.isoformat() if project.created_at else None,
        "updated_at": project.updated_at.isoformat() if project.updated_at else None,
        "tasks": [
            {
                "id": t.id,
                "task_type": t.task_type,
                "priority": t.priority,
                "status": t.status,
                "provider_id": t.provider_id,
                "model_id": t.model_id,
                "progress_step": t.progress_step,
                "error_message": t.error_message,
                "execution_log": t.execution_log,
                "result_summary": t.result_summary,
                "requires_confirmation": t.requires_confirmation,
                "meta_json": t.meta_json,
                "updated_at": t.updated_at.isoformat() if t.updated_at else None
            }
            for t in project.tasks
        ],
        "artifacts": [
            {
                "id": a.id,
                "task_id": a.task_id,
                "artifact_type": a.artifact_type,
                "name": a.name,
                "version": a.version,
                "status": a.status,
                "content_text": a.content_text,
                "data_json": a.data_json,
                "storage_url": a.storage_url,
                "provider_id": a.provider_id,
                "model_name": a.model_name,
                "cost_estimate": a.cost_estimate,
                "is_free": a.is_free,
                "metadata_json": a.metadata_json,
                "created_at": a.created_at.isoformat() if a.created_at else None,
                "updated_at": a.updated_at.isoformat() if a.updated_at else None
            }
            for a in project.artifacts
        ]
    }


@router.post("/projects/{project_id}/execute")
async def execute_project(
    project_id: str,
    tenant: Business = Depends(resolve_tenant),
    session: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """
    Executes all queued capability tasks for the specified project, producing real deliverables.
    """
    res = await workbench_execution_service.execute_project(
        session=session,
        project_id=project_id,
        business_id=tenant.id
    )
    if "error" in res:
        raise HTTPException(status_code=404, detail=res["error"])
    return res


@router.get("/artifacts/{artifact_id}")
async def get_artifact(
    artifact_id: str,
    tenant: Business = Depends(resolve_tenant),
    session: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """
    Retrieves deliverable artifact by ID.
    """
    stmt = select(V5WorkbenchArtifact).where(
        V5WorkbenchArtifact.id == artifact_id,
        V5WorkbenchArtifact.business_id == tenant.id
    )
    res = await session.execute(stmt)
    artifact = res.scalar_one_or_none()
    if not artifact:
        raise HTTPException(status_code=404, detail="Artifact not found")

    return {
        "id": artifact.id,
        "project_id": artifact.project_id,
        "task_id": artifact.task_id,
        "artifact_type": artifact.artifact_type,
        "name": artifact.name,
        "version": artifact.version,
        "status": artifact.status,
        "content_text": artifact.content_text,
        "data_json": artifact.data_json,
        "storage_url": artifact.storage_url,
        "provider_id": artifact.provider_id,
        "model_name": artifact.model_name,
        "cost_estimate": artifact.cost_estimate,
        "is_free": artifact.is_free,
        "metadata_json": artifact.metadata_json,
        "created_at": artifact.created_at.isoformat() if artifact.created_at else None,
        "updated_at": artifact.updated_at.isoformat() if artifact.updated_at else None
    }


@router.put("/artifacts/{artifact_id}")
async def update_artifact(
    artifact_id: str,
    payload: UpdateArtifactRequest,
    tenant: Business = Depends(resolve_tenant),
    session: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """
    Updates the content or structured data of an artifact (increments version).
    """
    stmt = select(V5WorkbenchArtifact).where(
        V5WorkbenchArtifact.id == artifact_id,
        V5WorkbenchArtifact.business_id == tenant.id
    )
    res = await session.execute(stmt)
    artifact = res.scalar_one_or_none()
    if not artifact:
        raise HTTPException(status_code=404, detail="Artifact not found")

    if payload.content_text is not None:
        artifact.content_text = payload.content_text
    if payload.data_json is not None:
        artifact.data_json = payload.data_json
    if payload.status is not None:
        artifact.status = payload.status

    artifact.version += 1
    await session.commit()
    await session.refresh(artifact)

    return {
        "id": artifact.id,
        "version": artifact.version,
        "status": artifact.status,
        "message": "Artifact updated successfully"
    }


@router.post("/artifacts/{artifact_id}/confirm")
async def confirm_artifact(
    artifact_id: str,
    payload: ConfirmArtifactRequest,
    tenant: Business = Depends(resolve_tenant),
    session: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """
    Human-in-the-loop operator confirmation gate for publishing or executing consequential deliverables.
    """
    stmt = select(V5WorkbenchArtifact).where(
        V5WorkbenchArtifact.id == artifact_id,
        V5WorkbenchArtifact.business_id == tenant.id
    )
    res = await session.execute(stmt)
    artifact = res.scalar_one_or_none()
    if not artifact:
        raise HTTPException(status_code=404, detail="Artifact not found")

    artifact.status = "PUBLISHED"
    meta = dict(artifact.metadata_json or {})
    meta["confirmed_at"] = datetime.now(timezone.utc).isoformat()
    meta["confirmed_action"] = payload.action
    artifact.metadata_json = meta

    await session.commit()
    await session.refresh(artifact)

    return {
        "id": artifact.id,
        "name": artifact.name,
        "status": artifact.status,
        "confirmed_action": payload.action,
        "confirmed_at": meta["confirmed_at"]
    }


@router.post("/command")
async def execute_universal_command(
    payload: UniversalCommandRequest,
    tenant: Business = Depends(resolve_tenant),
    session: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """
    Universal Command Box ("Ask Rine Forge").
    Accepts quick natural-language directives and executes immediate generation or modifications.
    """
    res = await workbench_execution_service.execute_universal_command(
        session=session,
        business_id=tenant.id,
        command_text=payload.command,
        active_project_id=payload.project_id
    )
    return res


@router.get("/models")
async def list_model_manifest() -> Dict[str, Any]:
    """
    Returns transparent manifest of all registered model providers,
    active selection policies, and workspace limits.
    """
    return model_hub.get_providers_manifest()


@router.get("/tasks/{task_id}")
async def get_task_status(
    task_id: str,
    tenant: Business = Depends(resolve_tenant),
    session: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """
    Returns discrete task status and execution log.
    """
    stmt = select(V5WorkbenchTask).where(
        V5WorkbenchTask.id == task_id,
        V5WorkbenchTask.business_id == tenant.id
    )
    res = await session.execute(stmt)
    task = res.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    return {
        "id": task.id,
        "project_id": task.project_id,
        "task_type": task.task_type,
        "priority": task.priority,
        "status": task.status,
        "progress_step": task.progress_step,
        "provider_id": task.provider_id,
        "model_id": task.model_id,
        "error_message": task.error_message,
        "execution_log": task.execution_log,
        "result_summary": task.result_summary,
        "requires_confirmation": task.requires_confirmation,
        "meta_json": task.meta_json
    }


# ============================================================
# HARDWARE & LOCAL AI DISCOVERY
# ============================================================
class PullModelRequest(BaseModel):
    model_name: str = Field(..., description="Ollama model name to pull e.g. llama3:8b, phi3:mini")


@router.get("/hardware")
async def get_hardware_system_profile() -> Dict[str, Any]:
    """
    Truthful server-side hardware profiling and live Ollama connectivity probe.
    Returns host CPU, RAM, GPU, storage, detected capability tier, and installed models.
    """
    return await hardware_profiler.get_full_system_profile()


@router.post("/hardware/models/pull")
async def pull_local_model(payload: PullModelRequest) -> Dict[str, Any]:
    """
    Triggers installation / download of an open model into the local Ollama instance.
    """
    return await hardware_profiler.trigger_pull_model(payload.model_name)


# ============================================================
# FORGE INTELLIGENCE FABRIC
# ============================================================
@router.post("/fabric/process", response_model=FabricExecutionResponse)
async def process_intelligence_fabric_request(
    payload: FabricRequest,
    tenant: Business = Depends(resolve_tenant)
) -> FabricExecutionResponse:
    """
    Unified Forge Intelligence Fabric request execution.
    Executes the 12-stage cognitive pipeline:
    Understand -> Plan -> Choose Model -> Choose Agent -> Choose Tools ->
    Retrieve Knowledge -> Execute -> Verify -> Deliver Artifact -> Learn.
    """
    if not payload.workspace_id:
        payload.workspace_id = tenant.id
    if not payload.business_context:
        payload.business_context = {
            "name": tenant.name,
            "industry": tenant.industry
        }
    return await forge_orchestrator.process_request(payload)


# ============================================================
# PHASE AS: MODEL DISCOVERY & SAFE MODEL MANAGEMENT
# ============================================================
class SafeInstallRequest(BaseModel):
    model_id: str
    confirm_risk: bool = False


@router.get("/discovery")
async def get_model_discovery_catalog() -> Dict[str, Any]:
    """
    Returns discovered local models compared against available open model library.
    Classified into safe hardware tiers (Installed, Recommended, Available, Incompatible).
    """
    return await model_discovery_service.get_discovery_catalog()


@router.post("/models/install")
async def install_local_model_safe(payload: SafeInstallRequest) -> Dict[str, Any]:
    """
    Installs an open model with hardware safety guardrails.
    Blocks oversized models unless confirm_risk is explicitly passed.
    """
    return await model_discovery_service.install_model_safe(
        model_id=payload.model_id,
        confirm_risk=payload.confirm_risk
    )


@router.delete("/models/{name}")
async def delete_local_model(name: str) -> Dict[str, Any]:
    """
    Deletes an installed model from local Ollama to reclaim host storage.
    """
    return await ollama_adapter.delete_model(name)

