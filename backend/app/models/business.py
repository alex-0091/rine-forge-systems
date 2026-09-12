import re
import uuid
from typing import Optional, List, Dict, Any
from sqlalchemy import String, Integer, Float, Boolean, Text, JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.database import Base, TimestampMixin

class Business(Base, TimestampMixin):
    __tablename__ = "businesses"

    name: Mapped[str] = mapped_column(String(255), index=True)
    normalized_name: Mapped[str] = mapped_column(String(255), default="unknown", index=True)
    industry: Mapped[str] = mapped_column(String(100), default="General", index=True)
    country: Mapped[str] = mapped_column(String(50), default="US", index=True)
    city: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    def __init__(self, **kwargs):
        if "normalized_name" not in kwargs or not kwargs.get("normalized_name"):
            n = kwargs.get("name", "")
            kwargs["normalized_name"] = re.sub(r'[^a-zA-Z0-9]', '', n).lower() if n else "unknown"
        super().__init__(**kwargs)
    state_province: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    address: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    website_url: Mapped[Optional[str]] = mapped_column(String(500), index=True, nullable=True)
    normalized_domain: Mapped[Optional[str]] = mapped_column(String(255), index=True, nullable=True)
    primary_email: Mapped[Optional[str]] = mapped_column(String(255), index=True, nullable=True)
    primary_phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    
    employees_estimate: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    estimated_revenue: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    
    # Technical & Digital presence indicators
    has_online_booking: Mapped[bool] = mapped_column(Boolean, default=False)
    has_contact_form: Mapped[bool] = mapped_column(Boolean, default=False)
    has_live_chat: Mapped[bool] = mapped_column(Boolean, default=False)
    has_ai_assistant: Mapped[bool] = mapped_column(Boolean, default=False)
    has_whatsapp_widget: Mapped[bool] = mapped_column(Boolean, default=False)
    is_multilingual: Mapped[bool] = mapped_column(Boolean, default=False)
    
    detected_cms: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    detected_booking_system: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    detected_chat_tool: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    technology_stack: Mapped[List[str]] = mapped_column(JSON, default=list)
    
    website_quality_score: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    mobile_friendly: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)
    
    # Discovery & State
    source: Mapped[str] = mapped_column(String(100), default="curated_discovery")
    status: Mapped[str] = mapped_column(String(50), default="DISCOVERED", index=True)
    # Statuses: DISCOVERED, RESEARCHED, QUALIFIED, OUTREACH_READY, CONTACTED, REPLIED, INTERESTED, WON, LOST, SUPPRESSED

    # Relationships
    contacts: Mapped[List["Contact"]] = relationship("Contact", back_populates="business", cascade="all, delete-orphan")
    research_records: Mapped[List["BusinessResearch"]] = relationship("BusinessResearch", back_populates="business", cascade="all, delete-orphan")
    pain_points: Mapped[List["PainPoint"]] = relationship("PainPoint", back_populates="business", cascade="all, delete-orphan")
    ai_opportunities: Mapped[List["AIOpportunity"]] = relationship("AIOpportunity", back_populates="business", cascade="all, delete-orphan")
    evidences: Mapped[List["Evidence"]] = relationship("Evidence", back_populates="business", cascade="all, delete-orphan")
    lead_score: Mapped[Optional["LeadScore"]] = relationship("LeadScore", back_populates="business", uselist=False, cascade="all, delete-orphan")
    campaign_memberships: Mapped[List["CampaignMember"]] = relationship("CampaignMember", back_populates="business", cascade="all, delete-orphan")
    conversations: Mapped[List["Conversation"]] = relationship("Conversation", back_populates="business", cascade="all, delete-orphan")

class Contact(Base, TimestampMixin):
    __tablename__ = "contacts"

    business_id: Mapped[str] = mapped_column(String(36), ForeignKey("businesses.id", ondelete="CASCADE"), index=True)
    full_name: Mapped[str] = mapped_column(String(255))
    first_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    last_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    role_title: Mapped[Optional[str]] = mapped_column(String(150), nullable=True) # e.g. Owner, Managing Director
    email: Mapped[Optional[str]] = mapped_column(String(255), index=True, nullable=True)
    phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    linkedin_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    is_decision_maker: Mapped[bool] = mapped_column(Boolean, default=False)
    source: Mapped[str] = mapped_column(String(100), default="website_crawl")
    
    business: Mapped["Business"] = relationship("Business", back_populates="contacts")

class BusinessResearch(Base, TimestampMixin):
    __tablename__ = "business_research"

    business_id: Mapped[str] = mapped_column(String(36), ForeignKey("businesses.id", ondelete="CASCADE"), index=True)
    page_title: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    meta_description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    raw_extracted_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    services_detected: Mapped[List[str]] = mapped_column(JSON, default=list)
    faq_extracted: Mapped[List[Dict[str, str]]] = mapped_column(JSON, default=list)
    trust_signals: Mapped[List[str]] = mapped_column(JSON, default=list)
    social_profiles: Mapped[Dict[str, str]] = mapped_column(JSON, default=dict)
    
    verified_facts: Mapped[List[str]] = mapped_column(JSON, default=list)
    research_confidence: Mapped[int] = mapped_column(Integer, default=80)
    researcher_model: Mapped[str] = mapped_column(String(100), default="gemini-1.5-flash")

    business: Mapped["Business"] = relationship("Business", back_populates="research_records")
