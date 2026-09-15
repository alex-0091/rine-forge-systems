"""
Rine Forge Systems V5 - AI Employee API Router
Manages digital worker configuration (Elena, Marcus, etc.) and inbound conversational interaction.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.database import get_db
from backend.app.models.v5 import AIEmployee, Business
from backend.app.auth.dependencies import get_current_tenant, require_role
from backend.app.ai.orchestrator_v5 import v5_orchestrator

router = APIRouter(prefix="/ai-employees", tags=["V5 AI Employees"])

class CreateEmployeeRequest(BaseModel):
    name: str
    role: str = "AI Receptionist"
    avatar: Optional[str] = None
    personality: Optional[str] = None
    system_instructions: Optional[str] = None
    model: str = "gpt-4o-mini"
    provider: str = "openai"
    language: str = "en"

class UpdateEmployeeRequest(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    avatar: Optional[str] = None
    personality: Optional[str] = None
    system_instructions: Optional[str] = None
    model: Optional[str] = None
    provider: Optional[str] = None
    status: Optional[str] = None
    language: Optional[str] = None

class InboundChatRequest(BaseModel):
    business_id: Optional[str] = None
    channel: str = "website" # website, whatsapp, demo
    customer_identifier: str # phone, email, or session id
    message: str
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    customer_email: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

@router.get("")
async def list_ai_employees(
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(get_current_tenant)
):
    """Lists all configured AI employees for the authenticated tenant."""
    stmt = select(AIEmployee).where(AIEmployee.business_id == tenant.id)
    res = await session.execute(stmt)
    employees = res.scalars().all()
    return [
        {
            "id": e.id,
            "name": e.name,
            "role": e.role,
            "avatar": e.avatar,
            "model": e.model,
            "provider": e.provider,
            "status": e.status,
            "system_instructions": e.system_instructions
        }
        for e in employees
    ]

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_ai_employee(
    payload: CreateEmployeeRequest,
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(get_current_tenant),
    _role = Depends(require_role(["BUSINESS_OWNER", "BUSINESS_ADMIN"]))
):
    """Creates a new AI worker persona scoped to this business tenant."""
    emp = AIEmployee(
        business_id=tenant.id,
        name=payload.name,
        role=payload.role,
        avatar=payload.avatar,
        personality=payload.personality,
        system_instructions=payload.system_instructions,
        model=payload.model,
        provider=payload.provider,
        language=payload.language,
        status="ACTIVE"
    )
    session.add(emp)
    await session.commit()
    await session.refresh(emp)

    return {
        "id": emp.id,
        "name": emp.name,
        "role": emp.role,
        "status": emp.status
    }

@router.put("/{employee_id}")
async def update_ai_employee(
    employee_id: str,
    payload: UpdateEmployeeRequest,
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(get_current_tenant),
    _role = Depends(require_role(["BUSINESS_OWNER", "BUSINESS_ADMIN"]))
):
    """Updates AI employee prompt, model, or operational status."""
    stmt = select(AIEmployee).where(AIEmployee.id == employee_id, AIEmployee.business_id == tenant.id)
    res = await session.execute(stmt)
    emp = res.scalar_one_or_none()
    if not emp:
        raise HTTPException(status_code=404, detail="AI Employee not found in tenant")

    if payload.name is not None: emp.name = payload.name
    if payload.role is not None: emp.role = payload.role
    if payload.avatar is not None: emp.avatar = payload.avatar
    if payload.personality is not None: emp.personality = payload.personality
    if payload.system_instructions is not None: emp.system_instructions = payload.system_instructions
    if payload.model is not None: emp.model = payload.model
    if payload.provider is not None: emp.provider = payload.provider
    if payload.status is not None: emp.status = payload.status
    if payload.language is not None: emp.language = payload.language

    await session.commit()
    return {"status": "success", "employee_id": emp.id}

@router.post("/chat")
async def inbound_chat(
    payload: InboundChatRequest,
    session: AsyncSession = Depends(get_db)
):
    """
    Direct inbound chat interface for website widgets, customer portal, or public tests.
    Dispatches to the 20-step V5 AI Orchestrator pipeline.
    """
    # If business_id not supplied in payload, default to demo clinic
    biz_id = payload.business_id or "00000000-0000-0000-0000-000000000001"

    response = await v5_orchestrator.handle_message(
        session=session,
        business_id=biz_id,
        channel=payload.channel,
        customer_identifier=payload.customer_identifier,
        user_message=payload.message,
        customer_name=payload.customer_name,
        customer_phone=payload.customer_phone,
        customer_email=payload.customer_email,
        metadata=payload.metadata
    )
    return response
