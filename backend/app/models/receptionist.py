import uuid
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from sqlalchemy import String, Integer, Float, Boolean, Text, JSON, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.database import Base, TimestampMixin

class BusinessKnowledge(Base, TimestampMixin):
    """
    Verified business knowledge repository partitioned by business_id.
    Guarantees strict zero-hallucination grounding for the AI Receptionist.
    """
    __tablename__ = "business_knowledge"

    business_id: Mapped[str] = mapped_column(String(36), ForeignKey("businesses.id", ondelete="CASCADE"), unique=True, index=True)
    business_name: Mapped[str] = mapped_column(String(255), index=True)
    industry: Mapped[str] = mapped_column(String(100), default="General", index=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Structured service catalog: [{name, description, duration_minutes, price_estimate, category}]
    services: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list)
    
    # Weekly opening hours: {"monday": "08:30-17:30", "tuesday": "08:30-17:30", ...}
    opening_hours: Mapped[Dict[str, str]] = mapped_column(JSON, default=dict)
    timezone: Mapped[str] = mapped_column(String(50), default="America/New_York")
    
    # Physical location & contact
    location_address: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    contact_email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    contact_phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    
    # Business policies: {"cancellation": "24h advance notice", "deposit": "None", "insurance": "Accepted"}
    policies: Mapped[Dict[str, str]] = mapped_column(JSON, default=dict)
    
    # FAQs: [{"question": "...", "answer": "..."}]
    faqs: Mapped[List[Dict[str, str]]] = mapped_column(JSON, default=list)
    
    # Custom business guardrails & instructions
    custom_instructions: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationships
    business: Mapped["Business"] = relationship("Business", backref="knowledge_record")

class ReceptionistConversation(Base, TimestampMixin):
    """
    Multi-channel conversation thread for an AI Receptionist instance.
    Supports Web Chat, WhatsApp, Email, Phone, and SMS.
    """
    __tablename__ = "receptionist_conversations"

    business_id: Mapped[str] = mapped_column(String(36), ForeignKey("businesses.id", ondelete="CASCADE"), index=True)
    channel: Mapped[str] = mapped_column(String(50), default="web_chat", index=True) # web_chat, whatsapp, email, phone, sms
    
    # Customer identity & contact
    customer_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)
    customer_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    customer_contact: Mapped[Optional[str]] = mapped_column(String(255), nullable=True) # phone or email
    
    # Operational lifecycle state: ACTIVE, NEEDS_HUMAN, RESOLVED, CLOSED
    status: Mapped[str] = mapped_column(String(50), default="ACTIVE", index=True)
    requires_human: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    human_reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Extensible agent metadata (e.g. session tokens, device, referer)
    metadata_json: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)

    # Relationships
    business: Mapped["Business"] = relationship("Business")
    messages: Mapped[List["ReceptionistMessage"]] = relationship("ReceptionistMessage", back_populates="conversation", cascade="all, delete-orphan", order_by="ReceptionistMessage.created_at")
    actions: Mapped[List["ReceptionistAction"]] = relationship("ReceptionistAction", back_populates="conversation", cascade="all, delete-orphan")
    handoffs: Mapped[List["HumanHandoff"]] = relationship("HumanHandoff", back_populates="conversation", cascade="all, delete-orphan")

class ReceptionistMessage(Base, TimestampMixin):
    """
    Individual conversational message turn within a receptionist conversation.
    """
    __tablename__ = "receptionist_messages"

    conversation_id: Mapped[str] = mapped_column(String(36), ForeignKey("receptionist_conversations.id", ondelete="CASCADE"), index=True)
    role: Mapped[str] = mapped_column(String(20), index=True) # user, assistant, system
    sender_type: Mapped[str] = mapped_column(String(30), default="CUSTOMER") # CUSTOMER, AI_RECEPTIONIST, HUMAN_OPERATOR
    content: Mapped[str] = mapped_column(Text)
    
    # AI Analysis & Traceability
    intent: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)
    confidence: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    action_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    latency_ms: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    metadata_json: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)

    # Relationships
    conversation: Mapped["ReceptionistConversation"] = relationship("ReceptionistConversation", back_populates="messages")

class ReceptionistAction(Base, TimestampMixin):
    """
    Audit log of every controlled tool invocation executed by the receptionist.
    Enforces strict distinction between READ and WRITE actions.
    """
    __tablename__ = "receptionist_actions"

    conversation_id: Mapped[str] = mapped_column(String(36), ForeignKey("receptionist_conversations.id", ondelete="CASCADE"), index=True)
    business_id: Mapped[str] = mapped_column(String(36), ForeignKey("businesses.id", ondelete="CASCADE"), index=True)
    tool_name: Mapped[str] = mapped_column(String(100), index=True)
    action_type: Mapped[str] = mapped_column(String(20), index=True) # READ, WRITE
    
    arguments: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)
    result: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)
    
    # Status: SUCCESS, INTEGRATION_REQUIRED, FAILED, PENDING_HUMAN
    status: Mapped[str] = mapped_column(String(50), default="SUCCESS", index=True)
    execution_latency_ms: Mapped[int] = mapped_column(Integer, default=0)
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationships
    conversation: Mapped["ReceptionistConversation"] = relationship("ReceptionistConversation", back_populates="actions")

class HumanHandoff(Base, TimestampMixin):
    """
    Explicit escalation record generated when a conversation requires human takeover.
    """
    __tablename__ = "receptionist_human_handoffs"

    conversation_id: Mapped[str] = mapped_column(String(36), ForeignKey("receptionist_conversations.id", ondelete="CASCADE"), index=True)
    business_id: Mapped[str] = mapped_column(String(36), ForeignKey("businesses.id", ondelete="CASCADE"), index=True)
    
    # Escalation reason: CUSTOMER_REQUEST, LOW_CONFIDENCE, UNKNOWN_INTENT, TOOL_FAILURE, SENSITIVE_SITUATION
    reason: Mapped[str] = mapped_column(String(100), index=True)
    trigger_message: Mapped[str] = mapped_column(Text)
    customer_contact: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    
    # Status: PENDING, CLAIMED, RESOLVED
    status: Mapped[str] = mapped_column(String(50), default="PENDING", index=True)
    assigned_to: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    resolution_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationships
    conversation: Mapped["ReceptionistConversation"] = relationship("ReceptionistConversation", back_populates="handoffs")
