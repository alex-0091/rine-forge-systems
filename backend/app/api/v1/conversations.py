"""
Rine Forge Systems V5 - Conversation API Router
Manages ongoing dialog sessions, human handoffs, and live messaging transcripts.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.database import get_db
from backend.app.models.v5 import Conversation, Message, Business, Customer
from backend.app.auth.dependencies import get_current_tenant

router = APIRouter(prefix="/conversations", tags=["V5 Conversations"])

class StaffReplyRequest(BaseModel):
    message: str

class HandoffToggleRequest(BaseModel):
    enabled: bool
    reason: Optional[str] = None

@router.get("")
async def list_conversations(
    channel: Optional[str] = None,
    status: Optional[str] = None,
    human_handoff: Optional[bool] = None,
    limit: int = Query(50, le=100),
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(get_current_tenant)
):
    """Lists conversations for the business tenant with optional status/channel filters."""
    query = (
        select(Conversation)
        .where(Conversation.business_id == tenant.id)
        .options(selectinload(Conversation.customer))
    )
    if channel:
        query = query.where(Conversation.channel == channel)
    if status:
        query = query.where(Conversation.status == status)
    if human_handoff is not None:
        query = query.where(Conversation.human_handoff == human_handoff)

    query = query.order_by(Conversation.updated_at.desc()).limit(limit)
    res = await session.execute(query)
    conversations = res.scalars().all()

    return [
        {
            "id": c.id,
            "channel": c.channel,
            "status": c.status,
            "human_handoff": c.human_handoff,
            "summary": c.summary,
            "customer": {
                "id": c.customer.id if c.customer else None,
                "name": c.customer.name if c.customer else None,
                "phone": c.customer.phone if c.customer else None
            },
            "started_at": c.started_at.isoformat() if c.started_at else None,
            "updated_at": c.updated_at.isoformat() if c.updated_at else None
        }
        for c in conversations
    ]

@router.get("/{conversation_id}/messages")
async def get_conversation_messages(
    conversation_id: str,
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(get_current_tenant)
):
    """Retrieves full chronological message history for a conversation."""
    stmt = select(Conversation).where(
        Conversation.id == conversation_id,
        Conversation.business_id == tenant.id
    )
    res = await session.execute(stmt)
    conv = res.scalar_one_or_none()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found in tenant")

    stmt_m = select(Message).where(
        Message.conversation_id == conversation_id
    ).order_by(Message.created_at.asc())
    res_m = await session.execute(stmt_m)
    messages = res_m.scalars().all()

    return {
        "conversation_id": conv.id,
        "channel": conv.channel,
        "human_handoff": conv.human_handoff,
        "status": conv.status,
        "messages": [
            {
                "id": m.id,
                "role": m.role,
                "content": m.content,
                "created_at": m.created_at.isoformat() if m.created_at else None
            }
            for m in messages
        ]
    }

@router.post("/{conversation_id}/handoff")
async def toggle_handoff(
    conversation_id: str,
    payload: HandoffToggleRequest,
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(get_current_tenant)
):
    """Enables or disables human intervention mode for this conversation."""
    stmt = select(Conversation).where(
        Conversation.id == conversation_id,
        Conversation.business_id == tenant.id
    )
    res = await session.execute(stmt)
    conv = res.scalar_one_or_none()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found in tenant")

    conv.human_handoff = payload.enabled
    if payload.enabled:
        conv.status = "PAUSED"
    else:
        conv.status = "ACTIVE"

    await session.commit()
    return {"status": "success", "conversation_id": conv.id, "human_handoff": conv.human_handoff}

@router.post("/{conversation_id}/reply")
async def staff_reply(
    conversation_id: str,
    payload: StaffReplyRequest,
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(get_current_tenant)
):
    """Allows clinic staff to send a message directly into the conversation."""
    stmt = select(Conversation).where(
        Conversation.id == conversation_id,
        Conversation.business_id == tenant.id
    )
    res = await session.execute(stmt)
    conv = res.scalar_one_or_none()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found in tenant")

    msg = Message(
        conversation_id=conv.id,
        role="assistant",
        content=payload.message
    )
    session.add(msg)
    await session.commit()
    await session.refresh(msg)

    return {
        "status": "success",
        "message_id": msg.id,
        "conversation_id": conv.id,
        "role": msg.role,
        "content": msg.content
    }
