"""
Rine Forge Systems - Human Handoff Service
Orchestrates live escalation from autonomous AI to human staff.
Pauses agent turns, dispatches operator alerts, and tracks resolution lifecycle.
"""
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from backend.app.models.v5 import V5HumanHandoff, V5Conversation, V5Notification

logger = logging.getLogger("rine_forge_systems.handoffs.service")

class HumanHandoffService:
    """
    Manages operator queue and status transitions for live customer escalations.
    """

    async def trigger_handoff(
        self,
        session: AsyncSession,
        business_id: str,
        conversation_id: str,
        reason: str = "CUSTOMER_REQUEST",
        priority: str = "MEDIUM",
        customer_id: Optional[str] = None,
        notes: Optional[str] = None
    ) -> V5HumanHandoff:
        """
        Escalates a conversation: pauses AI auto-reply and creates operator ticket.
        """
        # 1. Update conversation status
        stmt_conv = select(V5Conversation).where(
            V5Conversation.id == conversation_id,
            V5Conversation.business_id == business_id
        )
        res_conv = await session.execute(stmt_conv)
        conv = res_conv.scalar_one_or_none()

        if conv:
            conv.human_handoff = True
            conv.status = "PAUSED"

        # 2. Check if active handoff ticket already exists
        stmt_existing = select(V5HumanHandoff).where(
            V5HumanHandoff.conversation_id == conversation_id,
            V5HumanHandoff.status.in_(["PENDING", "ASSIGNED"])
        )
        res_existing = await session.execute(stmt_existing)
        existing_ticket = res_existing.scalar_one_or_none()

        if existing_ticket:
            logger.info(f"Handoff ticket #{existing_ticket.id} already active for conv #{conversation_id}")
            return existing_ticket

        # 3. Create ticket
        ticket = V5HumanHandoff(
            business_id=business_id,
            conversation_id=conversation_id,
            customer_id=customer_id or (conv.customer_id if conv else None),
            reason=reason,
            priority=priority.upper(),
            status="PENDING",
            notes=notes
        )
        session.add(ticket)

        # 4. Dispatch operator alert notification
        notif = V5Notification(
            business_id=business_id,
            type="IN_APP",
            recipient="operator_pool",
            message=f"Urgent: Human handoff requested ({reason}) for Conversation #{conversation_id}",
            status="SENT"
        )
        session.add(notif)

        await session.commit()
        await session.refresh(ticket)
        logger.info(f"Escalation ticket #{ticket.id} created for conversation #{conversation_id}")
        return ticket

    async def list_handoffs(
        self,
        session: AsyncSession,
        business_id: str,
        status_filter: Optional[str] = None
    ) -> List[V5HumanHandoff]:
        """Lists handoffs scoped to business tenant."""
        stmt = select(V5HumanHandoff).where(V5HumanHandoff.business_id == business_id)
        if status_filter:
            stmt = stmt.where(V5HumanHandoff.status == status_filter.upper())
        stmt = stmt.order_by(V5HumanHandoff.created_at.desc())
        res = await session.execute(stmt)
        return list(res.scalars().all())

    async def assign_operator(
        self,
        session: AsyncSession,
        business_id: str,
        ticket_id: str,
        user_id: str
    ) -> V5HumanHandoff:
        """Assigns an operator user to handle the escalation."""
        stmt = select(V5HumanHandoff).where(
            V5HumanHandoff.id == ticket_id,
            V5HumanHandoff.business_id == business_id
        )
        res = await session.execute(stmt)
        ticket = res.scalar_one_or_none()

        if not ticket:
            raise HTTPException(status_code=404, detail=f"Handoff ticket #{ticket_id} not found")

        ticket.assigned_user_id = user_id
        ticket.status = "ASSIGNED"
        await session.commit()
        await session.refresh(ticket)
        return ticket

    async def resolve_handoff(
        self,
        session: AsyncSession,
        business_id: str,
        ticket_id: str,
        notes: Optional[str] = None,
        resume_ai: bool = True
    ) -> V5HumanHandoff:
        """Resolves handoff and optionally resumes AI agent turns."""
        stmt = select(V5HumanHandoff).where(
            V5HumanHandoff.id == ticket_id,
            V5HumanHandoff.business_id == business_id
        )
        res = await session.execute(stmt)
        ticket = res.scalar_one_or_none()

        if not ticket:
            raise HTTPException(status_code=404, detail=f"Handoff ticket #{ticket_id} not found")

        ticket.status = "RESOLVED"
        ticket.resolved_at = datetime.now(timezone.utc)
        if notes:
            ticket.notes = f"{ticket.notes or ''}\nResolution: {notes}".strip()

        # Update underlying conversation
        stmt_conv = select(V5Conversation).where(V5Conversation.id == ticket.conversation_id)
        res_conv = await session.execute(stmt_conv)
        conv = res_conv.scalar_one_or_none()
        if conv:
            conv.human_handoff = False
            conv.status = "ACTIVE" if resume_ai else "RESOLVED"

        await session.commit()
        await session.refresh(ticket)
        return ticket

handoff_service = HumanHandoffService()
