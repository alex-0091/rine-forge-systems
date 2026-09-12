from typing import Optional, List, Dict, Any
from sqlalchemy import String, Integer, Float, Boolean, Text, JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.database import Base, TimestampMixin

class PainPoint(Base, TimestampMixin):
    __tablename__ = "pain_points"

    business_id: Mapped[str] = mapped_column(String(36), ForeignKey("businesses.id", ondelete="CASCADE"), index=True)
    observed_fact: Mapped[str] = mapped_column(Text)
    business_problem: Mapped[str] = mapped_column(Text)
    severity_score: Mapped[int] = mapped_column(Integer, default=70) # 0-100
    evidence_source: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    business: Mapped["Business"] = relationship("Business", back_populates="pain_points")

class AIOpportunity(Base, TimestampMixin):
    __tablename__ = "ai_opportunities"

    business_id: Mapped[str] = mapped_column(String(36), ForeignKey("businesses.id", ondelete="CASCADE"), index=True)
    solution_name: Mapped[str] = mapped_column(String(200)) # e.g. "AI Receptionist & 24/7 Lead Capture"
    service_category: Mapped[str] = mapped_column(String(100)) # "AI Receptionists", "Business Automation", etc.
    pain_point_addressed: Mapped[str] = mapped_column(Text)
    business_benefit: Mapped[str] = mapped_column(Text)
    
    business_value: Mapped[int] = mapped_column(Integer, default=80) # 0-100
    implementation_feasibility: Mapped[int] = mapped_column(Integer, default=90) # 0-100
    purchase_likelihood: Mapped[int] = mapped_column(Integer, default=75) # 0-100
    confidence: Mapped[int] = mapped_column(Integer, default=85) # 0-100
    overall_score: Mapped[float] = mapped_column(Float, default=80.0) # 0-100
    recommended_pitch_angle: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    business: Mapped["Business"] = relationship("Business", back_populates="ai_opportunities")

class LeadScore(Base, TimestampMixin):
    __tablename__ = "lead_scores"

    business_id: Mapped[str] = mapped_column(String(36), ForeignKey("businesses.id", ondelete="CASCADE"), unique=True, index=True)
    total_score: Mapped[int] = mapped_column(Integer, default=0, index=True) # 0-100
    qualification_tier: Mapped[str] = mapped_column(String(50), default="NORMAL") 
    # DO_NOT_CONTACT (0-39), LOW_PRIORITY (40-59), NORMAL (60-74), HIGH_PRIORITY (75-89), VERY_HIGH_PRIORITY (90-100)
    
    score_breakdown: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)
    # { business_fit: 18, clear_pain_point: 18, ai_opportunity: 19, ability_to_pay: 14, decision_maker: 8, online_presence: 9, research_confidence: 4 }
    
    rationale: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_qualified_for_outreach: Mapped[bool] = mapped_column(Boolean, default=False)

    business: Mapped["Business"] = relationship("Business", back_populates="lead_score")

class Evidence(Base, TimestampMixin):
    __tablename__ = "evidences"

    business_id: Mapped[str] = mapped_column(String(36), ForeignKey("businesses.id", ondelete="CASCADE"), index=True)
    claim_text: Mapped[str] = mapped_column(Text) # e.g. "Website has no 24/7 conversational assistant"
    source_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    observed_snippet: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    confidence_score: Mapped[float] = mapped_column(Float, default=0.90) # 0.0 - 1.0
    evidence_type: Mapped[str] = mapped_column(String(50), default="WEBSITE") # WEBSITE, TECH_STACK, BOOKING, CHAT, SOCIAL
    is_verified: Mapped[bool] = mapped_column(Boolean, default=True)

    business: Mapped["Business"] = relationship("Business", back_populates="evidences")
