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
    contact_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    job_title: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    social_links: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)
    
    # Discovery Sourcing & Evidence Transparency
    source: Mapped[str] = mapped_column(String(100), default="PUBLIC_BUSINESS_DATA", index=True)
    source_record_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    source_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    data_provenance: Mapped[str] = mapped_column(String(100), default="PUBLIC_VERIFIED_DIRECTORY")
    data_quality_status: Mapped[str] = mapped_column(String(50), default="UNVERIFIED", index=True) # UNVERIFIED, PARTIALLY_VERIFIED, VERIFIED, INVALID, OPTED_OUT
    last_verified_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    opt_out_status: Mapped[str] = mapped_column(String(50), default="NOT_OPTED_OUT", index=True) # NOT_OPTED_OUT, EMAIL_OPT_OUT, SMS_OPT_OUT, WHATSAPP_OPT_OUT, GLOBAL_OPT_OUT
    
    # Fact vs Inference Transparency
    factual_signals: Mapped[List[str]] = mapped_column(JSON, default=list)
    inferred_qualifications: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list)
    
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


# ============================================================
# 7. IDEAL CUSTOMER PROFILE (ICP Specification)
# ============================================================
class V5IdealCustomerProfile(Base, TimestampMixin):
    """
    Search specification and target criteria defining high-value B2B prospects.
    """
    __tablename__ = "v5_ideal_customer_profiles"

    business_id: Mapped[str] = mapped_column(String(36), ForeignKey("v5_businesses.id", ondelete="CASCADE"), index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    industry: Mapped[str] = mapped_column(String(100), index=True, nullable=False) # e.g. "Dental Clinics"
    company_size: Mapped[str] = mapped_column(String(100), default="5-50") # e.g. "5-50 employees"
    country: Mapped[str] = mapped_column(String(100), default="USA")
    city_region: Mapped[str] = mapped_column(String(255), default="Austin, TX")
    services: Mapped[List[str]] = mapped_column(JSON, default=list) # e.g. ["Teeth Whitening", "Cosmetic Dentistry"]
    technologies: Mapped[List[str]] = mapped_column(JSON, default=list) # e.g. ["Online Scheduling"]
    revenue_range: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    target_roles: Mapped[List[str]] = mapped_column(JSON, default=lambda: ["Owner", "Practice Manager"])
    keywords: Mapped[List[str]] = mapped_column(JSON, default=list)
    business_characteristics: Mapped[List[str]] = mapped_column(JSON, default=list)
    exclusions: Mapped[List[str]] = mapped_column(JSON, default=list)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, index=True)


# ============================================================
# 8. OUTREACH APPROVAL (Human-in-the-Loop Gate)
# ============================================================
class V5OutreachApproval(Base, TimestampMixin):
    """
    Tracks human operator review and explicit approval before any outbound message is sent.
    """
    __tablename__ = "v5_outreach_approvals"

    business_id: Mapped[str] = mapped_column(String(36), ForeignKey("v5_businesses.id", ondelete="CASCADE"), index=True, nullable=False)
    prospect_id: Mapped[str] = mapped_column(String(36), ForeignKey("v5_prospects.id", ondelete="CASCADE"), index=True, nullable=False)
    outreach_id: Mapped[str] = mapped_column(String(36), ForeignKey("v5_prospect_outreach.id", ondelete="CASCADE"), index=True, nullable=False)
    channel: Mapped[str] = mapped_column(String(50), default="EMAIL", index=True)
    draft_subject: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    draft_body: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="PENDING", index=True) # PENDING, APPROVED, REJECTED, EDITED
    approved_by: Mapped[Optional[str]] = mapped_column(String(36), nullable=True) # User ID who approved
    approved_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    rejection_reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationships
    prospect: Mapped["V5Prospect"] = relationship("V5Prospect")
    outreach: Mapped["V5ProspectOutreach"] = relationship("V5ProspectOutreach")


# ============================================================
# 9. SALES TASKS (Human & AI Action Items)
# ============================================================
class V5SalesTask(Base, TimestampMixin):
    """
    Actionable tasks assigned to human operators or system agents
    for prospect follow-up, call scheduling, research, or review.
    """
    __tablename__ = "v5_sales_tasks"

    business_id: Mapped[str] = mapped_column(String(36), ForeignKey("v5_businesses.id", ondelete="CASCADE"), index=True, nullable=False)
    prospect_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("v5_prospects.id", ondelete="SET NULL"), index=True, nullable=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    task_type: Mapped[str] = mapped_column(String(50), default="FOLLOW_UP", index=True) # FOLLOW_UP, REVIEW_DRAFT, CALL_PROSPECT, RESEARCH, MANUAL_OUTREACH
    priority: Mapped[str] = mapped_column(String(20), default="MEDIUM", index=True) # LOW, MEDIUM, HIGH, URGENT
    status: Mapped[str] = mapped_column(String(50), default="PENDING", index=True) # PENDING, IN_PROGRESS, COMPLETED, CANCELLED
    assigned_to: Mapped[Optional[str]] = mapped_column(String(36), nullable=True) # User ID
    due_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    prospect: Mapped[Optional["V5Prospect"]] = relationship("V5Prospect")


# ============================================================
# 10. SOCIAL SIGNALS (Public / Authorized / Feed Ingestion)
# ============================================================
class V5SocialSignal(Base, TimestampMixin):
    """
    Normalized social / intent signal ingested strictly through authorized APIs,
    licensed providers, customer-provided feeds, or public commercial forums.
    Prohibits unauthorized scraping, private data harvesting, and CAPTCHA bypass.
    """
    __tablename__ = "v5_social_signals"

    business_id: Mapped[str] = mapped_column(String(36), ForeignKey("v5_businesses.id", ondelete="CASCADE"), index=True, nullable=False)
    source_platform: Mapped[str] = mapped_column(String(50), default="CUSTOMER_FEED", index=True) # CUSTOMER_FEED, PUBLIC_DIRECTORY, WEBHOOK, X_API, REDDIT_API, NEXTDOOR_API
    source_id: Mapped[Optional[str]] = mapped_column(String(255), nullable=True, index=True)
    source_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    author_id: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    author_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    location_raw: Mapped[Optional[str]] = mapped_column(String(255), nullable=True, index=True)
    detected_keywords: Mapped[List[str]] = mapped_column(JSON, default=list)
    relevance_score: Mapped[float] = mapped_column(Float, default=0.0, index=True)
    data_provenance: Mapped[str] = mapped_column(String(100), default="AUTHORIZED_FEED")
    source_permission_verified: Mapped[bool] = mapped_column(Boolean, default=True)
    intent_category: Mapped[str] = mapped_column(String(50), default="POSSIBLE_INTENT", index=True) # HIGH_INTENT, POSSIBLE_INTENT, INFORMATIONAL, IRRELEVANT, NEGATIVE
    processed: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    processed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    meta_json: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)

    # Relationships
    leads: Mapped[List["V5SocialLead"]] = relationship("V5SocialLead", back_populates="signal", cascade="all, delete-orphan")


# ============================================================
# 11. GENERATED AGENT SUITE (Auto Lead -> Auto Bot Generator)
# ============================================================
class V5GeneratedAgentSuite(Base, TimestampMixin):
    """
    Stores the coordinated 6-bot agent configuration and shared business knowledge base
    generated from a business configuration profile.
    """
    __tablename__ = "v5_generated_agent_suites"

    business_id: Mapped[str] = mapped_column(String(36), ForeignKey("v5_businesses.id", ondelete="CASCADE"), index=True, nullable=False)
    suite_name: Mapped[str] = mapped_column(String(255), nullable=False)
    business_name: Mapped[str] = mapped_column(String(255), nullable=False)
    business_category: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    website: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    location_area: Mapped[str] = mapped_column(String(255), default="Austin, TX", nullable=False)
    service_radius_miles: Mapped[int] = mapped_column(Integer, default=25)
    services: Mapped[List[str]] = mapped_column(JSON, default=list)
    target_customer: Mapped[str] = mapped_column(String(255), default="Local customers seeking services")
    keywords: Mapped[List[str]] = mapped_column(JSON, default=list)
    excluded_keywords: Mapped[List[str]] = mapped_column(JSON, default=list)
    preferred_channels: Mapped[List[str]] = mapped_column(JSON, default=lambda: ["SOCIAL_REPLY", "EMAIL"])
    business_hours: Mapped[Dict[str, str]] = mapped_column(JSON, default=dict)
    ai_tone: Mapped[str] = mapped_column(String(50), default="PROFESSIONAL_HELPFUL") # PROFESSIONAL_HELPFUL, WARM_EMPATHETIC, DIRECT_EFFICIENT, CASUAL_FRIENDLY
    qualification_rules: Mapped[List[str]] = mapped_column(JSON, default=list)
    
    # Unified Business Knowledge Base & 6 Bot Configurations
    knowledge_base: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)
    agents_config: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)
    
    status: Mapped[str] = mapped_column(String(50), default="ACTIVE", index=True) # ACTIVE, INACTIVE, DRAFT
    is_verified: Mapped[bool] = mapped_column(Boolean, default=True)
    meta_json: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)

    # Relationships
    leads: Mapped[List["V5SocialLead"]] = relationship("V5SocialLead", back_populates="suite", cascade="all, delete-orphan")


# ============================================================
# 12. SOCIAL LEADS (Signal-Derived Qualified Leads)
# ============================================================
class V5SocialLead(Base, TimestampMixin):
    """
    Lead discovered and qualified from intent signals across 9 lifecycle states.
    Separates verifiable facts from AI inferences.
    """
    __tablename__ = "v5_social_leads"

    business_id: Mapped[str] = mapped_column(String(36), ForeignKey("v5_businesses.id", ondelete="CASCADE"), index=True, nullable=False)
    signal_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("v5_social_signals.id", ondelete="SET NULL"), nullable=True, index=True)
    suite_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("v5_generated_agent_suites.id", ondelete="SET NULL"), nullable=True, index=True)
    
    contact_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    contact_handle: Mapped[Optional[str]] = mapped_column(String(255), nullable=True, index=True)
    contact_email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True, index=True)
    contact_phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True, index=True)
    channel: Mapped[str] = mapped_column(String(50), default="SOCIAL_REPLY", index=True) # SOCIAL_REPLY, EMAIL, WHATSAPP, SMS, WEB_CHAT
    
    # 9 Lifecycle States
    status: Mapped[str] = mapped_column(String(50), default="NEW", index=True) 
    # NEW, QUALIFIED, NEEDS_REVIEW, CONTACTED, REPLIED, MEETING_REQUESTED, CUSTOMER, DISQUALIFIED, OPTED_OUT
    
    # Qualification: Strictly separated Facts vs Inferences
    qualification_facts: Mapped[List[str]] = mapped_column(JSON, default=list)
    qualification_inferences: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list)
    
    service_needed: Mapped[Optional[str]] = mapped_column(String(255), nullable=True, index=True)
    location: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    urgency: Mapped[str] = mapped_column(String(20), default="MEDIUM", index=True) # HIGH, MEDIUM, LOW
    priority_score: Mapped[int] = mapped_column(Integer, default=50, index=True) # 0-100
    priority_factors: Mapped[List[str]] = mapped_column(JSON, default=list)
    
    recommended_action: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    draft_response: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    response_status: Mapped[str] = mapped_column(String(50), default="DRAFT", index=True) # DRAFT, APPROVED, SENT, REJECTED, NONE
    response_sent_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    opt_out_status: Mapped[str] = mapped_column(String(50), default="NOT_OPTED_OUT", index=True)
    
    meta_json: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)

    # Relationships
    signal: Mapped[Optional["V5SocialSignal"]] = relationship("V5SocialSignal", back_populates="leads")
    suite: Mapped[Optional["V5GeneratedAgentSuite"]] = relationship("V5GeneratedAgentSuite", back_populates="leads")


# ============================================================
# 13. VOICE SESSIONS (Real-Time Conversational Voice Engine)
# ============================================================
class V5VoiceSession(Base, TimestampMixin):
    """
    Authoritative stateful voice session tracking real-time conversations,
    turn latency, speech-to-text transcripts, tool executions, and handoffs.
    Strictly isolated by business_id (tenant).
    """
    __tablename__ = "v5_voice_sessions"

    business_id: Mapped[str] = mapped_column(String(36), ForeignKey("v5_businesses.id", ondelete="CASCADE"), index=True, nullable=False)
    agent_id: Mapped[str] = mapped_column(String(50), default="receptionist", index=True) # e.g. "receptionist", "Elena"
    channel: Mapped[str] = mapped_column(String(50), default="BROWSER", index=True) # BROWSER, PHONE_TWILIO, PHONE_LIVEKIT, WEBSOCKET
    status: Mapped[str] = mapped_column(String(50), default="CONNECTING", index=True) # CONNECTING, LISTENING, THINKING, SPEAKING, TRANSFER_REQUIRED, ENDED, ERROR
    caller_identifier: Mapped[Optional[str]] = mapped_column(String(255), nullable=True, index=True) # phone number or browser session token
    caller_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    ended_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    duration_seconds: Mapped[int] = mapped_column(Integer, default=0)
    transcript: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list) # [{"role": "customer", "text": "..."}, {"role": "agent", "text": "..."}]
    lead_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True, index=True)
    handoff_status: Mapped[str] = mapped_column(String(50), default="NONE", index=True) # NONE, REQUESTED, TRANSFERRED, FAILED, REQUESTED_OFFLINE
    tool_calls: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list)
    metrics: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict) # {"ai_latency_ms": 280, "stt_latency_ms": 110}
    meta_json: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)


# ============================================================
# 14. WORKBENCH PROJECTS & ARTIFACTS (Phase AQ)
# ============================================================
class V5Project(Base, TimestampMixin):
    """
    Authoritative multi-task business initiative generated by the AI Business Workbench.
    Contains plans, tasks, artifacts, and AI employee generation records.
    Strictly tenant-scoped.
    """
    __tablename__ = "v5_projects"

    business_id: Mapped[str] = mapped_column(String(36), ForeignKey("v5_businesses.id", ondelete="CASCADE"), index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="PLANNING", index=True) # PLANNING, IN_PROGRESS, COMPLETED, ARCHIVED
    input_request: Mapped[str] = mapped_column(Text, nullable=False)
    planner_output: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict) # Structured plan from BusinessRequestPlanner
    meta_json: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)

    # Relationships
    tasks: Mapped[List["V5WorkbenchTask"]] = relationship("V5WorkbenchTask", back_populates="project", cascade="all, delete-orphan")
    artifacts: Mapped[List["V5WorkbenchArtifact"]] = relationship("V5WorkbenchArtifact", back_populates="project", cascade="all, delete-orphan")


class V5WorkbenchTask(Base, TimestampMixin):
    """
    Discrete capability task executed by specialized workbench agents.
    Tracks live execution steps, provider models, and human confirmation requirements.
    """
    __tablename__ = "v5_workbench_tasks"

    project_id: Mapped[str] = mapped_column(String(36), ForeignKey("v5_projects.id", ondelete="CASCADE"), index=True, nullable=False)
    business_id: Mapped[str] = mapped_column(String(36), ForeignKey("v5_businesses.id", ondelete="CASCADE"), index=True, nullable=False)
    task_type: Mapped[str] = mapped_column(String(100), index=True, nullable=False) 
    # WEBSITE_BUILD, WEBSITE_AUDIT, LOGO_GENERATION, IMAGE_GENERATION, VIDEO_GENERATION,
    # COPYWRITING, SOCIAL_CONTENT, BUSINESS_PLAN, MARKETING_PLAN, FINANCIAL_MODEL,
    # COMPETITOR_ANALYSIS, SEO_AUDIT, BRAND_ANALYSIS, DOCUMENT_GENERATION,
    # PRESENTATION_GENERATION, DATA_ANALYSIS, AI_AGENT_GENERATION, VOICE_AGENT_GENERATION,
    # LEAD_AGENT_GENERATION, CRM_WORKFLOW, CHAT, CUSTOMER_RESPONSE, VOICE_RESPONSE
    priority: Mapped[int] = mapped_column(Integer, default=1)
    status: Mapped[str] = mapped_column(String(50), default="QUEUED", index=True) # QUEUED, RUNNING, WAITING, COMPLETED, FAILED, CANCELLED
    provider_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    model_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    progress_step: Mapped[str] = mapped_column(String(255), default="Initialized")
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    execution_log: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list) # [{"step": "Site architecture", "status": "DONE", "timestamp": "..."}]
    result_summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    requires_confirmation: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    meta_json: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)

    # Relationships
    project: Mapped["V5Project"] = relationship("V5Project", back_populates="tasks")
    artifacts: Mapped[List["V5WorkbenchArtifact"]] = relationship("V5WorkbenchArtifact", back_populates="task")


class V5WorkbenchArtifact(Base, TimestampMixin):
    """
    Concrete deliverable produced by a workbench agent (website markup, SVG logos,
    business plans, financial projection CSV, AI agent definitions).
    """
    __tablename__ = "v5_workbench_artifacts"

    project_id: Mapped[str] = mapped_column(String(36), ForeignKey("v5_projects.id", ondelete="CASCADE"), index=True, nullable=False)
    task_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("v5_workbench_tasks.id", ondelete="SET NULL"), index=True, nullable=True)
    business_id: Mapped[str] = mapped_column(String(36), ForeignKey("v5_businesses.id", ondelete="CASCADE"), index=True, nullable=False)
    artifact_type: Mapped[str] = mapped_column(String(50), index=True, nullable=False)
    # WEBSITE, LOGO, DOCUMENT, SPREADSHEET, PRESENTATION, AUDIO, VIDEO, REPORT, AI_AGENT, VOICE_AGENT, CODE
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    version: Mapped[int] = mapped_column(Integer, default=1)
    status: Mapped[str] = mapped_column(String(50), default="READY", index=True) # DRAFT, READY, PUBLISHED, ARCHIVED
    content_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    data_json: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)
    storage_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    provider_id: Mapped[str] = mapped_column(String(100), default="LOCAL_DEFAULT")
    model_name: Mapped[str] = mapped_column(String(100), default="standard")
    cost_estimate: Mapped[str] = mapped_column(String(50), default="FREE")
    is_free: Mapped[bool] = mapped_column(Boolean, default=True)
    metadata_json: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)

    # Relationships
    project: Mapped["V5Project"] = relationship("V5Project", back_populates="artifacts")
    task: Mapped[Optional["V5WorkbenchTask"]] = relationship("V5WorkbenchTask", back_populates="artifacts")


class V5RegisteredModel(Base, TimestampMixin):
    """
    Database-backed model registry tracking model capabilities, speed classes,
    context lengths, and memory requirements.
    """
    __tablename__ = "v5_registered_models"

    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True, index=True)
    provider: Mapped[str] = mapped_column(String(50), default="LOCAL_OLLAMA", index=True)
    capabilities: Mapped[List[str]] = mapped_column(JSON, default=list) # CHAT, REASONING, CODING, VISION, TOOLS, JSON, LONG_CONTEXT
    context_length: Mapped[int] = mapped_column(Integer, default=8192)
    vision: Mapped[bool] = mapped_column(Boolean, default=False)
    tools: Mapped[bool] = mapped_column(Boolean, default=True)
    reasoning: Mapped[bool] = mapped_column(Boolean, default=True)
    coding: Mapped[bool] = mapped_column(Boolean, default=False)
    speed_class: Mapped[str] = mapped_column(String(50), default="BALANCED") # FAST, BALANCED, DEEP_REASONING
    memory_requirement: Mapped[str] = mapped_column(String(100), default="8 GB RAM")
    enabled: Mapped[bool] = mapped_column(Boolean, default=True, index=True)
    is_default: Mapped[bool] = mapped_column(Boolean, default=False)
    metadata_json: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)


# Exported Aliases
Prospect = V5Prospect
ProspectObservation = V5ProspectObservation
ProspectOpportunity = V5ProspectOpportunity
ProspectOutreach = V5ProspectOutreach
OutreachEvent = V5OutreachEvent
LeadSearch = V5LeadSearch
LeadSearchResult = V5LeadSearchResult
IdealCustomerProfile = V5IdealCustomerProfile
OutreachApproval = V5OutreachApproval
ICP = V5IdealCustomerProfile
SalesTask = V5SalesTask
SocialSignal = V5SocialSignal
SocialLead = V5SocialLead
GeneratedAgentSuite = V5GeneratedAgentSuite
VoiceSession = V5VoiceSession
Project = V5Project
WorkbenchTask = V5WorkbenchTask
WorkbenchArtifact = V5WorkbenchArtifact
RegisteredModel = V5RegisteredModel


