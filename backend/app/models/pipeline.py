from typing import Optional, List, Dict, Any
from sqlalchemy import String, Integer, Float, Boolean, Text, JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.database import Base, TimestampMixin

class Proposal(Base, TimestampMixin):
    __tablename__ = "proposals"

    business_id: Mapped[str] = mapped_column(String(36), ForeignKey("businesses.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(255))
    service_offering: Mapped[str] = mapped_column(String(150))
    problem_statement: Mapped[Text] = mapped_column(Text)
    recommended_solution: Mapped[Text] = mapped_column(Text)
    scope_deliverables: Mapped[List[str]] = mapped_column(JSON, default=list)
    timeline_weeks: Mapped[int] = mapped_column(Integer, default=2)
    
    currency: Mapped[str] = mapped_column(String(10), default="USD")
    total_investment: Mapped[float] = mapped_column(Float, default=1500.0)
    payment_terms: Mapped[str] = mapped_column(String(255), default="50% kickoff, 50% upon deployment")
    
    status: Mapped[str] = mapped_column(String(50), default="DRAFT", index=True) # DRAFT, APPROVED_BY_OWNER, SENT, ACCEPTED, DECLINED
    owner_approved: Mapped[bool] = mapped_column(Boolean, default=False)

class Client(Base, TimestampMixin):
    __tablename__ = "clients"

    business_id: Mapped[str] = mapped_column(String(36), ForeignKey("businesses.id", ondelete="CASCADE"), unique=True, index=True)
    status: Mapped[str] = mapped_column(String(50), default="ACTIVE") # ACTIVE, ONBOARDING, COMPLETED, PAUSED
    total_contract_value: Mapped[float] = mapped_column(Float, default=0.0)
    primary_project_type: Mapped[str] = mapped_column(String(150), default="AI Receptionist")
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

class Payment(Base, TimestampMixin):
    __tablename__ = "payments"

    client_id: Mapped[str] = mapped_column(String(36), ForeignKey("clients.id", ondelete="CASCADE"), index=True)
    amount: Mapped[float] = mapped_column(Float)
    currency: Mapped[str] = mapped_column(String(10), default="USD")
    provider: Mapped[str] = mapped_column(String(50), default="stripe") # stripe, paypal, wire
    status: Mapped[str] = mapped_column(String(50), default="PAID") # PENDING, PAID, REFUNDED
    transaction_reference: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
