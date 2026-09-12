from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from sqlalchemy import String, Integer, Float, Boolean, Text, JSON, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.database import Base, TimestampMixin

class Conversation(Base, TimestampMixin):
    __tablename__ = "conversations"

    business_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("businesses.id", ondelete="CASCADE"), nullable=True, index=True)
    contact_email: Mapped[str] = mapped_column(String(255), index=True)
    subject: Mapped[str] = mapped_column(String(500))
    status: Mapped[str] = mapped_column(String(50), default="OPEN", index=True) # OPEN, ESCALATED_TO_OWNER, AUTO_HANDLED, CLOSED, WON
    latest_intent_classification: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    latest_intent_score: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    requires_human_action: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    human_action_reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    business: Mapped["Business"] = relationship("Business", back_populates="conversations")
    replies: Mapped[List["Reply"]] = relationship("Reply", back_populates="conversation", cascade="all, delete-orphan")

class Reply(Base, TimestampMixin):
    __tablename__ = "replies"

    conversation_id: Mapped[str] = mapped_column(String(36), ForeignKey("conversations.id", ondelete="CASCADE"), index=True)
    direction: Mapped[str] = mapped_column(String(20), default="INBOUND") # INBOUND, OUTBOUND
    sender_email: Mapped[str] = mapped_column(String(255))
    recipient_email: Mapped[str] = mapped_column(String(255))
    raw_body: Mapped[str] = mapped_column(Text)
    
    # Classification
    classification: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    intent_score: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    sentiment: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    
    # Gemini assistance
    suggested_reply: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    auto_responded: Mapped[bool] = mapped_column(Boolean, default=False)
    human_approved: Mapped[bool] = mapped_column(Boolean, default=False)

    conversation: Mapped["Conversation"] = relationship("Conversation", back_populates="replies")

class SystemAlert(Base, TimestampMixin):
    __tablename__ = "system_alerts"

    alert_type: Mapped[str] = mapped_column(String(100), index=True) # HIGH_INTENT_LEAD, KILL_SWITCH_TRIGGERED, COMPLIANCE_BREACH, BOUNCE_SPIKE
    severity: Mapped[str] = mapped_column(String(50), default="HIGH") # INFO, WARNING, HIGH, CRITICAL
    title: Mapped[str] = mapped_column(String(255))
    message: Mapped[str] = mapped_column(Text)
    is_resolved: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    metadata_json: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)

class HumanCorrection(Base, TimestampMixin):
    __tablename__ = "human_corrections"

    conversation_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("conversations.id", ondelete="SET NULL"), nullable=True, index=True)
    reply_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("replies.id", ondelete="SET NULL"), nullable=True)
    ai_draft: Mapped[str] = mapped_column(Text)
    owais_edit: Mapped[str] = mapped_column(Text)
    diff_summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    reason: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    prompt_version: Mapped[str] = mapped_column(String(50), default="v1.0")
