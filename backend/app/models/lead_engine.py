"""
Rine Forge Systems V5 - Lead Engine & Prospect Data Models (Module 41-56)
Authoritative schemas for B2B prospect discovery, website observations,
observable automation opportunities, compliant outreach, and conversion intelligence.
"""
import uuid
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from sqlalchemy import (
    String, Integer, Float, Boolean, Text, JSON, 
    ForeignKey, DateTime, Index
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.database import Base, TimestampMixin

# ============================================================
# 1. PROSPECT (Discovered Commercial Business or Intent Opportunity)
# ============================================================
class V5Prospect(Base, TimestampMixin):
    """
    Authoritative B2B Prospect or Public Intent Opportunity.
    Strictly isolated by business_id (tenant).
    """
    __tablename__ = "v5_prospects"

    business_id: Mapped[str] = mapped_column(String(36), ForeignKey("v5_businesses.id", ondelete="CASCADE"), index=True, nullable=False)
    prospect_type: Mapped[str] = mapped_column(String(50), default="B2B_BUSINESS", index=True) # B2B_BUSINESS, PUBLIC_INTENT, INBOUND_LEAD
    company_name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    website: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    industry: Mapped[str] = mapped_column(String(100), default="General", index=True)
    location: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    city: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)
    state: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    country: Mapped[str] = mapped_column(String(100), default="USA")
    email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True, index=True)
    phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True, index=True)
    social_links: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)
    
    # Discovery Sourcing & Evidence Transparency
    source: Mapped[str] = mapped_column(String(100), default="PUBLIC_BUSINESS_DATA", index=True)
    source_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    
    # Multi-Dimensional Scoring
    score: Mapped[int] = mapped_column(Integer, default=50, index=True) # 0-100
    score_breakdown: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)
    
    # Workflow & Lifecycle Status
    outreach_status: Mapped[str] = mapped_column(String(50), default="DRAFT", index=True) # DRAFT, PENDING_REVIEW, APPROVED, SENT, DELIVERED, OPENED, REPLIED, BOUNCED, OPTED_OUT, STOPPED
    contact_status: Mapped[str] = mapped_column(String(50), default="UNCONTACTED", index=True) # UNCONTACTED, IN_PROGRESS, ENGAGED, CONVERTED, DO_NOT_CONTACT
    consent_status: Mapped[str] = mapped_column(String(50), default="PUBLIC_COMMERCIAL") # PUBLIC_COMMERCIAL, CONSENTED, OPTED_IN, UNKNOWN
    pipeline_stage: Mapped[str] = mapped_column(String(50), default="DISCOVERED", index=True) # DISCOVERED, QUALIFIED, REVIEW, CONTACTED, RESPONDED, INTERESTED, APPOINTMENT, CONVERTED, DISQUALIFIED, NO_RESPONSE, OPTED_OUT
    review_mode: Mapped[str] = mapped_column(String(20), default="REVIEW") # MANUAL, REVIEW, AUTO (Defaults to REVIEW)
    
    last_contacted: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    next_action: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    meta_json: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)

    # Relationships
    observations: Mapped[List["V5ProspectObservation"]] = relationship("V5ProspectObservation", back_populates="prospect", cascade="all, delete-orphan")
    opportunities: Mapped[List["V5ProspectOpportunity"]] = relationship("V5ProspectOpportunity", back_populates="prospect", cascade="all, delete-orphan")
    outreach_messages: Mapped[List["V5ProspectOutreach"]] = relationship("V5ProspectOutreach", back_populates="prospect", cascade="all, delete-orphan")


# ============================================================
# 2. PROSPECT OBSERVATION (Observable Website / Journey Facts)
# ============================================================
class V5ProspectObservation(Base, TimestampMixin):
    """
    Observable factual finding from public website/profile analysis with evidence citation.
    Guarantees zero hallucination.
    """
    __tablename__ = "v5_prospect_observations"

    prospect_id: Mapped[str] = mapped_column(String(36), ForeignKey("v5_prospects.id", ondelete="CASCADE"), index=True, nullable=False)
    observation: Mapped[str] = mapped_column(Text, nullable=False)
    source: Mapped[str] = mapped_column(String(500), nullable=False) # e.g. "https://example.com/contact"
    confidence: Mapped[float] = mapped_column(Float, default=0.90)
    category: Mapped[str] = mapped_column(String(100), default="WEBSITE_JOURNEY") # BOOKING_FLOW, LIVE_CHAT, WHATSAPP, CONTACT_METHODS, MOBILE_UX, FAQ


    prospect: Mapped["V5Prospect"] = relationship("V5Prospect", back_populates="observations")


# ============================================================
# 3. PROSPECT OPPORTUNITY (Automation Potential)
# ============================================================
class V5ProspectOpportunity(Base, TimestampMixin):
    """
    Specific operational or revenue gap Rine Forge can automate for the prospect.
    """
    __tablename__ = "v5_prospect_opportunities"

    prospect_id: Mapped[str] = mapped_column(String(36), ForeignKey("v5_prospects.id", ondelete="CASCADE"), index=True, nullable=False)
    type: Mapped[str] = mapped_column(String(100), nullable=False) # AI_RECEPTIONIST, APPOINTMENT_AUTOMATION, SPEED_TO_LEAD, WHATSAPP_EMPLOYEE, OMNICHANNEL_SYNC
    reason: Mapped[str] = mapped_column(Text, nullable=False)
    evidence: Mapped[str] = mapped_column(Text, nullable=False)
    confidence: Mapped[float] = mapped_column(Float, default=0.85)

    prospect: Mapped["V5Prospect"] = relationship("V5Prospect", back_populates="opportunities")


# ============================================================
# 4. PROSPECT OUTREACH (Outbound Messages & Approval History)
# ============================================================
class V5ProspectOutreach(Base, TimestampMixin):
    """
    Audited outreach communications dispatched to a prospect across compliant channels.
    """
    __tablename__ = "v5_prospect_outreach"

    business_id: Mapped[str] = mapped_column(String(36), ForeignKey("v5_businesses.id", ondelete="CASCADE"), index=True, nullable=False)
    prospect_id: Mapped[str] = mapped_column(String(36), ForeignKey("v5_prospects.id", ondelete="CASCADE"), index=True, nullable=False)
    channel: Mapped[str] = mapped_column(String(50), default="EMAIL", index=True) # EMAIL, WHATSAPP, INSTAGRAM, SMS
    subject: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    reason: Mapped[str] = mapped_column(Text, default="Automated evidence-backed outreach")
    status: Mapped[str] = mapped_column(String(50), default="PENDING_REVIEW", index=True) # DRAFT, PENDING_REVIEW, APPROVED, SENT, DELIVERED, OPENED, REPLIED, BOUNCED, OPTED_OUT, BLOCKED
    provider: Mapped[str] = mapped_column(String(100), default="EmailOutreachProvider")
    external_message_id: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    step_number: Mapped[int] = mapped_column(Integer, default=0) # 0 = Initial, 1 = Follow-up 1, 2 = Follow-up 2
    
    scheduled_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    sent_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    delivered_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    opened_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    replied_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    approved_by: Mapped[Optional[str]] = mapped_column(String(36), nullable=True) # Staff/User ID who approved
    
    meta_json: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)

    prospect: Mapped["V5Prospect"] = relationship("V5Prospect", back_populates="outreach_messages")
    events: Mapped[List["V5OutreachEvent"]] = relationship("V5OutreachEvent", back_populates="outreach", cascade="all, delete-orphan")


# ============================================================
# 5. OUTREACH EVENT (Audit & Telemetry Log)
# ============================================================
class V5OutreachEvent(Base, TimestampMixin):
    """
    Granular event logging for outreach lifecycle (delivery, opens, clicks, replies).
    """
    __tablename__ = "v5_outreach_events"

    outreach_id: Mapped[str] = mapped_column(String(36), ForeignKey("v5_prospect_outreach.id", ondelete="CASCADE"), index=True, nullable=False)
    event_type: Mapped[str] = mapped_column(String(50), nullable=False, index=True) # DRAFTED, APPROVED, SENT, DELIVERED, OPENED, CLICKED, REPLIED, BOUNCED, OPTED_OUT
    payload: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)

    outreach: Mapped["V5ProspectOutreach"] = relationship("V5ProspectOutreach", back_populates="events")


# ============================================================
# 6. LEAD SEARCH & SEARCH RESULTS (Batch Discovery Audit Trail)
# ============================================================
class V5LeadSearch(Base, TimestampMixin):
    """
    Audit record of automated or manual lead search runs.
    """
    __tablename__ = "v5_lead_searches"

    business_id: Mapped[str] = mapped_column(String(36), ForeignKey("v5_businesses.id", ondelete="CASCADE"), index=True, nullable=False)
    query: Mapped[str] = mapped_column(String(255), nullable=False)
    industry: Mapped[str] = mapped_column(String(100), nullable=False)
    location: Mapped[str] = mapped_column(String(100), nullable=False)
    services: Mapped[List[str]] = mapped_column(JSON, default=list)
    results_count: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[str] = mapped_column(String(50), default="COMPLETED")

    results: Mapped[List["V5LeadSearchResult"]] = relationship("V5LeadSearchResult", back_populates="search", cascade="all, delete-orphan")


class V5LeadSearchResult(Base, TimestampMixin):
    """
    Junction mapping a discovered prospect to a search query run.
    """
    __tablename__ = "v5_lead_search_results"

    search_id: Mapped[str] = mapped_column(String(36), ForeignKey("v5_lead_searches.id", ondelete="CASCADE"), index=True, nullable=False)
    prospect_id: Mapped[str] = mapped_column(String(36), ForeignKey("v5_prospects.id", ondelete="CASCADE"), index=True, nullable=False)

    search: Mapped["V5LeadSearch"] = relationship("V5LeadSearch", back_populates="results")
    prospect: Mapped["V5Prospect"] = relationship("V5Prospect")


# Exported Aliases
Prospect = V5Prospect
ProspectObservation = V5ProspectObservation
ProspectOpportunity = V5ProspectOpportunity
ProspectOutreach = V5ProspectOutreach
OutreachEvent = V5OutreachEvent
LeadSearch = V5LeadSearch
LeadSearchResult = V5LeadSearchResult
