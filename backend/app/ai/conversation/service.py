"""
Rine Forge Systems V5 - Conversation Persistence Service
Handles database persistence of conversations, messages, token metrics, and handoffs.
"""
import logging
from typing import List, Optional, Dict, Any
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.models.v5 import V5Conversation, V5Message
from backend.app.ai.gateway.interface import ChatMessage

logger = logging.getLogger("rine_forge_systems.ai.conversation")

class ConversationService:
    async def get_or_create_conversation(
        self,
        session: AsyncSession,
        business_id: str,
        conversation_id: Optional[str] = None,
        customer_id: Optional[str] = None,
        channel: str = "website",
        ai_employee_id: Optional[str] = None
    ) -> V5Conversation:
        """Retrieves existing active conversation or creates a new persistent session."""
        if conversation_id:
            stmt = select(V5Conversation).where(
                V5Conversation.id == conversation_id,
                V5Conversation.business_id == business_id
            )
            res = await session.execute(stmt)
            conv = res.scalar_one_or_none()
            if conv:
                return conv

        # Create new conversation
        conv = V5Conversation(
            business_id=business_id,
            customer_id=customer_id,
            channel=channel,
            ai_employee_id=ai_employee_id,
            status="ACTIVE"
        )
        session.add(conv)
        await session.flush()
        return conv

    async def add_message(
        self,
        session: AsyncSession,
        conversation_id: str,
        role: str,
        content: str,
        model: Optional[str] = None,
        tokens: Optional[int] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> V5Message:
        """Appends a turn to the conversation history."""
        msg = V5Message(
            conversation_id=conversation_id,
            role=role,
            content=content,
            model=model,
            tokens=tokens,
            metadata_json=metadata or {}
        )
        session.add(msg)
        await session.flush()
        return msg

    async def get_recent_chat_messages(
        self,
        session: AsyncSession,
        conversation_id: str,
        limit: int = 20
    ) -> List[ChatMessage]:
        """Fetches recent conversation turns converted to standard ChatMessage models."""
        stmt = (
            select(V5Message)
            .where(V5Message.conversation_id == conversation_id)
            .order_by(V5Message.created_at.desc())
            .limit(limit)
        )
        res = await session.execute(stmt)
        db_messages = list(reversed(res.scalars().all()))

        return [
            ChatMessage(
                role=m.role,
                content=m.content
            )
            for m in db_messages
        ]

    async def mark_human_handoff(
        self,
        session: AsyncSession,
        conversation_id: str,
        reason: Optional[str] = None
    ):
        """Flags conversation as requiring human staff intervention."""
        stmt = select(V5Conversation).where(V5Conversation.id == conversation_id)
        res = await session.execute(stmt)
        conv = res.scalar_one_or_none()
        if conv:
            conv.human_handoff = True
            if reason and not conv.summary:
                conv.summary = f"Escalated to human: {reason}"
            await session.flush()

conversation_service = ConversationService()
