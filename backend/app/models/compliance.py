from datetime import datetime, timezone
from typing import Optional, Dict, Any
from sqlalchemy import String, Integer, Float, Boolean, Text, JSON, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from backend.app.database import Base, TimestampMixin

class SuppressionEntry(Base, TimestampMixin):
    __tablename__ = "suppression_list"

    entry_type: Mapped[str] = mapped_column(String(50), default="EMAIL", index=True) # EMAIL, DOMAIN, COMPANY
    value: Mapped[str] = mapped_column(String(255), unique=True, index=True) # e.g. "sarah@example.com" or "example.com"
    reason: Mapped[str] = mapped_column(String(100), default="USER_OPTOUT") # USER_OPTOUT, HARD_BOUNCE, SPAM_COMPLAINT, MANUAL, COMPLIANCE_RULE
    source: Mapped[str] = mapped_column(String(100), default="inbound_reply")
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

class AuditLog(Base, TimestampMixin):
    __tablename__ = "audit_logs"

    event_type: Mapped[str] = mapped_column(String(100), index=True) 
    # LEAD_DISCOVERED, RESEARCH_COMPLETED, LEAD_SCORED, OUTREACH_GENERATED, QUALITY_CHECK, COMPLIANCE_CHECK, 
    # EMAIL_QUEUED, EMAIL_SENT, REPLY_CLASSIFIED, ESCALATED_TO_OWNER, SUPPRESSION_TRIGGERED, KILL_SWITCH_ACTIVATED
    
    actor: Mapped[str] = mapped_column(String(100), default="system") # system, worker, owais
    entity_type: Mapped[Optional[str]] = mapped_column(String(100), nullable=True) # business, campaign, message, reply
    entity_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True, index=True)
    description: Mapped[str] = mapped_column(Text)
    
    # Cost and Token Tracking
    llm_model: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    input_tokens: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    output_tokens: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    estimated_cost_usd: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    
    metadata_json: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)

class SystemState(Base, TimestampMixin):
    __tablename__ = "system_states"

    key: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    value_json: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)

class MailboxHealth(Base, TimestampMixin):
    __tablename__ = "mailbox_health"

    mailbox_address: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    sent_today: Mapped[int] = mapped_column(Integer, default=0)
    delivered_count: Mapped[int] = mapped_column(Integer, default=0)
    bounce_count: Mapped[int] = mapped_column(Integer, default=0)
    complaint_count: Mapped[int] = mapped_column(Integer, default=0)
    health_score: Mapped[int] = mapped_column(Integer, default=100) # 0-100
    status: Mapped[str] = mapped_column(String(50), default="HEALTHY") # HEALTHY, WARNING, PAUSED
