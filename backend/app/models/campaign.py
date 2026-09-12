from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from sqlalchemy import String, Integer, Float, Boolean, Text, JSON, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.database import Base, TimestampMixin

class Campaign(Base, TimestampMixin):
    __tablename__ = "campaigns"

    name: Mapped[str] = mapped_column(String(255), index=True)
    target_country: Mapped[str] = mapped_column(String(50), index=True) # USA, UK, Canada, Australia, etc.
    target_industry: Mapped[str] = mapped_column(String(100), index=True) # Dental, Real Estate, Hotel, etc.
    min_lead_score: Mapped[int] = mapped_column(Integer, default=75)
    primary_offer: Mapped[str] = mapped_column(String(150), default="AI Receptionist")
    
    daily_send_limit: Mapped[int] = mapped_column(Integer, default=25)
    hourly_send_limit: Mapped[int] = mapped_column(Integer, default=5)
    follow_up_cadence_days: Mapped[List[int]] = mapped_column(JSON, default=lambda: [4, 9, 16])
    
    is_dry_run: Mapped[bool] = mapped_column(Boolean, default=True)
    status: Mapped[str] = mapped_column(String(50), default="DRAFT", index=True) # DRAFT, ACTIVE, PAUSED, COMPLETED, ARCHIVED

    members: Mapped[List["CampaignMember"]] = relationship("CampaignMember", back_populates="campaign", cascade="all, delete-orphan")

class CampaignMember(Base, TimestampMixin):
    __tablename__ = "campaign_members"
    __table_args__ = (
        UniqueConstraint('campaign_id', 'business_id', name='uq_campaign_business'),
    )

    campaign_id: Mapped[str] = mapped_column(String(36), ForeignKey("campaigns.id", ondelete="CASCADE"), index=True)
    business_id: Mapped[str] = mapped_column(String(36), ForeignKey("businesses.id", ondelete="CASCADE"), index=True)
    contact_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("contacts.id", ondelete="SET NULL"), nullable=True)
    
    status: Mapped[str] = mapped_column(String(50), default="QUEUED", index=True) 
    # QUEUED, OUTREACH_GENERATED, APPROVED, IN_SEQUENCE, REPLIED, BOUNCED, OPTED_OUT, WON, LOST, STOPPED
    current_sequence_step: Mapped[int] = mapped_column(Integer, default=0)
    next_scheduled_touch: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    
    campaign: Mapped["Campaign"] = relationship("Campaign", back_populates="members")
    business: Mapped["Business"] = relationship("Business", back_populates="campaign_memberships")
    messages: Mapped[List["OutreachMessage"]] = relationship("OutreachMessage", back_populates="campaign_member", cascade="all, delete-orphan")

class OutreachMessage(Base, TimestampMixin):
    __tablename__ = "outreach_messages"
    __table_args__ = (
        UniqueConstraint('campaign_member_id', 'step_number', name='uq_member_step'),
    )

    campaign_member_id: Mapped[str] = mapped_column(String(36), ForeignKey("campaign_members.id", ondelete="CASCADE"), index=True)
    step_number: Mapped[int] = mapped_column(Integer, default=1) # 1 = initial, 2 = day 4, 3 = day 9, 4 = day 16
    
    recipient_email: Mapped[str] = mapped_column(String(255), index=True)
    recipient_name: Mapped[str] = mapped_column(String(255))
    subject: Mapped[str] = mapped_column(String(500))
    body_text: Mapped[str] = mapped_column(Text)
    
    personalized_hook: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    primary_cta: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    
    # Advanced Quality & Factuality metrics
    compliance_passed: Mapped[bool] = mapped_column(Boolean, default=True)
    quality_score: Mapped[int] = mapped_column(Integer, default=90) # 0-100
    personalization_score: Mapped[int] = mapped_column(Integer, default=90) # 0-100
    factual_confidence: Mapped[int] = mapped_column(Integer, default=95) # 0-100
    hallucination_check_result: Mapped[str] = mapped_column(String(20), default="PASS") # PASS, FAIL, UNCERTAIN
    
    # Idempotency & Delivery
    idempotency_key: Mapped[Optional[str]] = mapped_column(String(100), unique=True, nullable=True, index=True)
    is_dry_run: Mapped[bool] = mapped_column(Boolean, default=True)
    status: Mapped[str] = mapped_column(String(50), default="DRAFT", index=True) 
    # DRAFT, APPROVED, QUEUED, SCHEDULED, SENT, FAILED, CANCELLED
    
    scheduled_for: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    sent_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    
    message_id_header: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    tracking_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    campaign_member: Mapped["CampaignMember"] = relationship("CampaignMember", back_populates="messages")
    events: Mapped[List["MessageEvent"]] = relationship("MessageEvent", back_populates="message", cascade="all, delete-orphan")

class MessageEvent(Base, TimestampMixin):
    __tablename__ = "message_events"

    message_id: Mapped[str] = mapped_column(String(36), ForeignKey("outreach_messages.id", ondelete="CASCADE"), index=True)
    event_type: Mapped[str] = mapped_column(String(50), index=True) # QUEUED, SENT, DELIVERED, OPENED, CLICKED, BOUNCED, REPLIED
    metadata_json: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)

    message: Mapped["OutreachMessage"] = relationship("OutreachMessage", back_populates="events")
