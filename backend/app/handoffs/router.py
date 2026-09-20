"""
Rine Forge Systems - Human Handoff API Endpoints
Provides operator UI with escalation controls, assignment, and resolution.
"""
from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, Query, Body, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.database import get_db
from backend.app.auth.dependencies import get_current_tenant, get_current_user
from backend.app.models.v5 import Business, User
from backend.app.handoffs.service import handoff_service

router = APIRouter(prefix="/handoffs", tags=["Human Handoff"])

@router.get("")
async def list_handoffs(
    status: Optional[str] = Query(None),
    tenant: Business = Depends(get_current_tenant),
    session: AsyncSession = Depends(get_db)
):
    """Lists all handoff tickets for the authenticated tenant."""
    tickets = await handoff_service.list_handoffs(session, tenant.id, status)
    return {
        "status": "success",
        "count": len(tickets),
        "data": [
            {
                "id": t.id,
                "conversation_id": t.conversation_id,
                "customer_id": t.customer_id,
                "reason": t.reason,
                "priority": t.priority,
                "status": t.status,
                "assigned_user_id": t.assigned_user_id,
                "notes": t.notes,
                "created_at": t.created_at.isoformat() if t.created_at else None,
                "resolved_at": t.resolved_at.isoformat() if t.resolved_at else None
            }
            for t in tickets
        ]
    }

@router.post("")
async def create_handoff(
    conversation_id: str = Body(..., embed=True),
    reason: str = Body("CUSTOMER_REQUEST", embed=True),
    priority: str = Body("MEDIUM", embed=True),
    notes: Optional[str] = Body(None, embed=True),
    tenant: Business = Depends(get_current_tenant),
    session: AsyncSession = Depends(get_db)
):
    """Triggers an escalation ticket and pauses AI replies."""
    ticket = await handoff_service.trigger_handoff(
        session=session,
        business_id=tenant.id,
        conversation_id=conversation_id,
        reason=reason,
        priority=priority,
        notes=notes
    )
    return {
        "status": "success",
        "data": {
            "id": ticket.id,
            "conversation_id": ticket.conversation_id,
            "status": ticket.status,
            "priority": ticket.priority
        }
    }

@router.post("/{ticket_id}/assign")
async def assign_ticket(
    ticket_id: str,
    user: User = Depends(get_current_user),
    tenant: Business = Depends(get_current_tenant),
    session: AsyncSession = Depends(get_db)
):
    """Assigns the escalation to the calling operator."""
    ticket = await handoff_service.assign_operator(
        session=session,
        business_id=tenant.id,
        ticket_id=ticket_id,
        user_id=user.id
    )
    return {"status": "success", "ticket_id": ticket.id, "assigned_to": user.name}

@router.post("/{ticket_id}/resolve")
async def resolve_ticket(
    ticket_id: str,
    notes: Optional[str] = Body(None, embed=True),
    resume_ai: bool = Body(True, embed=True),
    tenant: Business = Depends(get_current_tenant),
    session: AsyncSession = Depends(get_db)
):
    """Resolves the escalation and optionally unpauses the AI receptionist."""
    ticket = await handoff_service.resolve_handoff(
        session=session,
        business_id=tenant.id,
        ticket_id=ticket_id,
        notes=notes,
        resume_ai=resume_ai
    )
    return {"status": "success", "ticket_id": ticket.id, "status": ticket.status}
