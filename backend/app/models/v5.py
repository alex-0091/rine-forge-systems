"""
Rine Forge Systems V5 - Multi-Tenant Relational Data Architecture
Defines the 20 authoritative enterprise entities required for production AI employees.
All models are strictly isolated by `business_id` (Tenant Partitioning).
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
# 1. USER & IDENTITY
# ============================================================
class V5User(Base, TimestampMixin):
    """
    Platform user: Super Admin, Business Owner, Admin, or Staff.
    """
    __tablename__ = "v5_users"

    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(50), default="BUSINESS_OWNER", index=True) 
    # Roles: SUPER_ADMIN, BUSINESS_OWNER, BUSINESS_ADMIN, STAFF
    status: Mapped[str] = mapped_column(String(50), default="ACTIVE", index=True) # ACTIVE, INACTIVE, SUSPENDED

    # Relationships
    business_memberships: Mapped[List["V5BusinessUser"]] = relationship(
        "V5BusinessUser", back_populates="user", cascade="all, delete-orphan"
    )

# ============================================================
# 2. BUSINESS / TENANT (Root Multi-Tenant Object)
# ============================================================
class V5Business(Base, TimestampMixin):
    """
    Authoritative Business Tenant. Every operational object belongs to a Business.
    """
    __tablename__ = "v5_businesses"

    owner_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("v5_users.id", ondelete="SET NULL"), nullable=True, index=True)
    name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    legal_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    industry: Mapped[str] = mapped_column(String(100), default="General", index=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    website: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    address: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    timezone: Mapped[str] = mapped_column(String(50), default="America/Chicago")
    currency: Mapped[str] = mapped_column(String(10), default="USD")
    language: Mapped[str] = mapped_column(String(10), default="en")
    
    # Weekly opening hours: {"monday": "08:00-17:00", ...}
    business_hours: Mapped[Dict[str, str]] = mapped_column(JSON, default=dict)
    status: Mapped[str] = mapped_column(String(50), default="ACTIVE", index=True) # ACTIVE, SUSPENDED, TRIAL
    settings_json: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)

    # Relationships
    users: Mapped[List["V5BusinessUser"]] = relationship("V5BusinessUser", back_populates="business", cascade="all, delete-orphan")
    ai_employees: Mapped[List["V5AIEmployee"]] = relationship("V5AIEmployee", back_populates="business", cascade="all, delete-orphan")
    services: Mapped[List["V5Service"]] = relationship("V5Service", back_populates="business", cascade="all, delete-orphan")
    staff_members: Mapped[List["V5Staff"]] = relationship("V5Staff", back_populates="business", cascade="all, delete-orphan")
    knowledge_documents: Mapped[List["V5KnowledgeDocument"]] = relationship("V5KnowledgeDocument", back_populates="business", cascade="all, delete-orphan")
    customers: Mapped[List["V5Customer"]] = relationship("V5Customer", back_populates="business", cascade="all, delete-orphan")
    appointments: Mapped[List["V5Appointment"]] = relationship("V5Appointment", back_populates="business", cascade="all, delete-orphan")
    leads: Mapped[List["V5Lead"]] = relationship("V5Lead", back_populates="business", cascade="all, delete-orphan")
    integrations: Mapped[List["V5Integration"]] = relationship("V5Integration", back_populates="business", cascade="all, delete-orphan")
    automations: Mapped[List["V5Automation"]] = relationship("V5Automation", back_populates="business", cascade="all, delete-orphan")

# ============================================================
# 3. BUSINESS USER (Tenant-User Link & RBAC)
# ============================================================
class V5BusinessUser(Base, TimestampMixin):
    """
    Associates a User with a Business with specific tenant-level permissions.
    """
    __tablename__ = "v5_business_users"

    business_id: Mapped[str] = mapped_column(String(36), ForeignKey("v5_businesses.id", ondelete="CASCADE"), index=True, nullable=False)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("v5_users.id", ondelete="CASCADE"), index=True, nullable=False)
    role: Mapped[str] = mapped_column(String(50), default="BUSINESS_ADMIN") # BUSINESS_OWNER, BUSINESS_ADMIN, STAFF
    permissions: Mapped[List[str]] = mapped_column(JSON, default=list)

    # Relationships
    business: Mapped["V5Business"] = relationship("V5Business", back_populates="users")
    user: Mapped["V5User"] = relationship("V5User", back_populates="business_memberships")

# ============================================================
# 4. AI EMPLOYEE
# ============================================================
class V5AIEmployee(Base, TimestampMixin):
    """
    Configured digital worker (e.g. Elena Receptionist, Marcus Sales Lead).
    """
    __tablename__ = "v5_ai_employees"

    business_id: Mapped[str] = mapped_column(String(36), ForeignKey("v5_businesses.id", ondelete="CASCADE"), index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), default="Elena", nullable=False)
    role: Mapped[str] = mapped_column(String(100), default="AI Receptionist")
    avatar: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    personality: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    system_instructions: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    model: Mapped[str] = mapped_column(String(100), default="gpt-4o-mini")
    provider: Mapped[str] = mapped_column(String(50), default="openai") # openai, gemini
    status: Mapped[str] = mapped_column(String(50), default="ACTIVE") # ACTIVE, PAUSED, TRAINING
    language: Mapped[str] = mapped_column(String(20), default="en")
    handoff_rules: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)

    # Relationships
    business: Mapped["V5Business"] = relationship("V5Business", back_populates="ai_employees")
    conversations: Mapped[List["V5Conversation"]] = relationship("V5Conversation", back_populates="ai_employee")

# ============================================================
# 5. SERVICES
# ============================================================
class V5Service(Base, TimestampMixin):
    """
    Authoritative service catalog item for pricing & appointment duration.
    """
    __tablename__ = "v5_services"

    business_id: Mapped[str] = mapped_column(String(36), ForeignKey("v5_businesses.id", ondelete="CASCADE"), index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    price: Mapped[float] = mapped_column(Float, default=0.0)
    duration: Mapped[int] = mapped_column(Integer, default=30) # Duration in minutes
    currency: Mapped[str] = mapped_column(String(10), default="USD")
    availability: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)
    active: Mapped[bool] = mapped_column(Boolean, default=True, index=True)

    # Relationships
    business: Mapped["V5Business"] = relationship("V5Business", back_populates="services")
    appointments: Mapped[List["V5Appointment"]] = relationship("V5Appointment", back_populates="service")

# ============================================================
# 6. STAFF
# ============================================================
class V5Staff(Base, TimestampMixin):
    """
    Internal clinic/practice staff available for appointment bookings.
    """
    __tablename__ = "v5_staff"

    business_id: Mapped[str] = mapped_column(String(36), ForeignKey("v5_businesses.id", ondelete="CASCADE"), index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(100), default="Practitioner")
    email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    calendar_id: Mapped[Optional[str]] = mapped_column(String(255), nullable=True) # Google/Outlook ID
    working_hours: Mapped[Dict[str, str]] = mapped_column(JSON, default=dict) # e.g. {"monday": "09:00-17:00"}
    active: Mapped[bool] = mapped_column(Boolean, default=True, index=True)

    # Relationships
    business: Mapped["V5Business"] = relationship("V5Business", back_populates="staff_members")
    appointments: Mapped[List["V5Appointment"]] = relationship("V5Appointment", back_populates="staff")

# ============================================================
# 7. KNOWLEDGE DOCUMENT & 8. KNOWLEDGE CHUNK (RAG Vector Store)
# ============================================================
class V5KnowledgeDocument(Base, TimestampMixin):
    """
    Ingested business documentation (PDF, TXT, website, FAQ, clinic manuals).
    """
    __tablename__ = "v5_knowledge_documents"

    business_id: Mapped[str] = mapped_column(String(36), ForeignKey("v5_businesses.id", ondelete="CASCADE"), index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    type: Mapped[str] = mapped_column(String(50), default="text") # pdf, txt, website, manual, faq
    source: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    metadata_json: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)
    status: Mapped[str] = mapped_column(String(50), default="INDEXED") # INDEXED, PROCESSING, ERROR

    # Relationships
    business: Mapped["V5Business"] = relationship("V5Business", back_populates="knowledge_documents")
    chunks: Mapped[List["V5KnowledgeChunk"]] = relationship("V5KnowledgeChunk", back_populates="document", cascade="all, delete-orphan")

class V5KnowledgeChunk(Base, TimestampMixin):
    """
    Embedded text chunk with dense vector embedding representation for semantic retrieval.
    """
    __tablename__ = "v5_knowledge_chunks"

    document_id: Mapped[str] = mapped_column(String(36), ForeignKey("v5_knowledge_documents.id", ondelete="CASCADE"), index=True, nullable=False)
    business_id: Mapped[str] = mapped_column(String(36), ForeignKey("v5_businesses.id", ondelete="CASCADE"), index=True, nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    embedding: Mapped[List[float]] = mapped_column(JSON, default=list) # Float embedding vector
    metadata_json: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)

    # Relationships
    document: Mapped["V5KnowledgeDocument"] = relationship("V5KnowledgeDocument", back_populates="chunks")

# ============================================================
# 9. CUSTOMER
# ============================================================
class V5Customer(Base, TimestampMixin):
    """
    Patient or client identity unified across WhatsApp, Web, Phone, and Email.
    """
    __tablename__ = "v5_customers"

    business_id: Mapped[str] = mapped_column(String(36), ForeignKey("v5_businesses.id", ondelete="CASCADE"), index=True, nullable=False)
    name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    email: Mapped[Optional[str]] = mapped_column(String(255), index=True, nullable=True)
    phone: Mapped[Optional[str]] = mapped_column(String(50), index=True, nullable=True)
    external_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True) # WhatsApp WA_ID, PMS ID
    source: Mapped[str] = mapped_column(String(100), default="website_chat")
    channel: Mapped[str] = mapped_column(String(50), default="website") # website, whatsapp, instagram, phone, email
    metadata_json: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)

    # Relationships
    business: Mapped["V5Business"] = relationship("V5Business", back_populates="customers")
    conversations: Mapped[List["V5Conversation"]] = relationship("V5Conversation", back_populates="customer", cascade="all, delete-orphan")
    appointments: Mapped[List["V5Appointment"]] = relationship("V5Appointment", back_populates="customer", cascade="all, delete-orphan")
    leads: Mapped[List["V5Lead"]] = relationship("V5Lead", back_populates="customer", cascade="all, delete-orphan")
    tasks: Mapped[List["V5Task"]] = relationship("V5Task", back_populates="customer", cascade="all, delete-orphan")

# ============================================================
# 10. CONVERSATION & 11. MESSAGE
# ============================================================
class V5Conversation(Base, TimestampMixin):
    """
    Persistent conversational session between Customer and AI Employee.
    """
    __tablename__ = "v5_conversations"

    business_id: Mapped[str] = mapped_column(String(36), ForeignKey("v5_businesses.id", ondelete="CASCADE"), index=True, nullable=False)
    ai_employee_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("v5_ai_employees.id", ondelete="SET NULL"), nullable=True, index=True)
    customer_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("v5_customers.id", ondelete="CASCADE"), nullable=True, index=True)
    channel: Mapped[str] = mapped_column(String(50), default="website", index=True) # website, whatsapp, instagram, email, phone
    status: Mapped[str] = mapped_column(String(50), default="ACTIVE", index=True) # ACTIVE, PAUSED, RESOLVED, CLOSED
    human_handoff: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    # Relationships
    business: Mapped["V5Business"] = relationship("V5Business")
    ai_employee: Mapped[Optional["V5AIEmployee"]] = relationship("V5AIEmployee", back_populates="conversations")
    customer: Mapped[Optional["V5Customer"]] = relationship("V5Customer", back_populates="conversations")
    messages: Mapped[List["V5Message"]] = relationship("V5Message", back_populates="conversation", cascade="all, delete-orphan", order_by="V5Message.created_at")

class V5Message(Base, TimestampMixin):
    """
    Individual conversational turn.
    """
    __tablename__ = "v5_messages"

    conversation_id: Mapped[str] = mapped_column(String(36), ForeignKey("v5_conversations.id", ondelete="CASCADE"), index=True, nullable=False)
    role: Mapped[str] = mapped_column(String(20), index=True, nullable=False) # user, assistant, system
    content: Mapped[str] = mapped_column(Text, nullable=False)
    model: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    tokens: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    metadata_json: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)

    # Relationships
    conversation: Mapped["V5Conversation"] = relationship("V5Conversation", back_populates="messages")

# ============================================================
# 12. LEAD (Lead Qualification & Scoring)
# ============================================================
class V5Lead(Base, TimestampMixin):
    """
    Authoritative lead detected from customer intent with AI scoring.
    """
    __tablename__ = "v5_leads"

    business_id: Mapped[str] = mapped_column(String(36), ForeignKey("v5_businesses.id", ondelete="CASCADE"), index=True, nullable=False)
    customer_id: Mapped[str] = mapped_column(String(36), ForeignKey("v5_customers.id", ondelete="CASCADE"), index=True, nullable=False)
    source: Mapped[str] = mapped_column(String(100), default="website_chat")
    status: Mapped[str] = mapped_column(String(50), default="NEW", index=True) # NEW, QUALIFIED, CONTACTED, BOOKED, LOST
    score: Mapped[int] = mapped_column(Integer, default=50) # 0–30 cold, 31–60 warm, 61–80 hot, 81–100 very hot
    urgency: Mapped[str] = mapped_column(String(50), default="MEDIUM", index=True) # LOW, MEDIUM, HIGH
    intent: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    value: Mapped[float] = mapped_column(Float, default=0.0) # Estimated customer deal value
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    assigned_to: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("v5_staff.id", ondelete="SET NULL"), nullable=True)

    # Relationships
    business: Mapped["V5Business"] = relationship("V5Business", back_populates="leads")
    customer: Mapped["V5Customer"] = relationship("V5Customer", back_populates="leads")

# ============================================================
# 13. APPOINTMENT (Authoritative Booking Engine)
# ============================================================
class V5Appointment(Base, TimestampMixin):
    """
    Authoritative appointment slot locked in the database. Prevents double-booking.
    """
    __tablename__ = "v5_appointments"

    business_id: Mapped[str] = mapped_column(String(36), ForeignKey("v5_businesses.id", ondelete="CASCADE"), index=True, nullable=False)
    customer_id: Mapped[str] = mapped_column(String(36), ForeignKey("v5_customers.id", ondelete="CASCADE"), index=True, nullable=False)
    staff_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("v5_staff.id", ondelete="SET NULL"), nullable=True, index=True)
    service_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("v5_services.id", ondelete="SET NULL"), nullable=True, index=True)
    
    start_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    end_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(50), default="CONFIRMED", index=True) # CONFIRMED, CANCELLED, RESCHEDULED, COMPLETED
    source: Mapped[str] = mapped_column(String(50), default="ai_receptionist") # ai_receptionist, whatsapp, staff_manual
    external_id: Mapped[Optional[str]] = mapped_column(String(255), nullable=True) # External Google Calendar / Dentrix Event ID
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationships
    business: Mapped["V5Business"] = relationship("V5Business", back_populates="appointments")
    customer: Mapped["V5Customer"] = relationship("V5Customer", back_populates="appointments")
    staff: Mapped[Optional["V5Staff"]] = relationship("V5Staff", back_populates="appointments")
    service: Mapped[Optional["V5Service"]] = relationship("V5Service", back_populates="appointments")

    __table_args__ = (
        Index("idx_v5_appointment_conflict", "business_id", "staff_id", "start_time", "end_time"),
    )

# ============================================================
# 14. INTEGRATION
# ============================================================
class V5Integration(Base, TimestampMixin):
    """
    Connected external provider credentials reference (WhatsApp, Google Calendar, HubSpot).
    """
    __tablename__ = "v5_integrations"

    business_id: Mapped[str] = mapped_column(String(36), ForeignKey("v5_businesses.id", ondelete="CASCADE"), index=True, nullable=False)
    provider: Mapped[str] = mapped_column(String(100), nullable=False) # meta_whatsapp, google_calendar, hubspot, stripe
    type: Mapped[str] = mapped_column(String(50), default="messaging") # messaging, calendar, crm, payments
    status: Mapped[str] = mapped_column(String(50), default="NOT_CONNECTED") # CONNECTED, PARTIALLY_CONNECTED, NOT_CONNECTED
    credentials_reference: Mapped[Optional[str]] = mapped_column(String(255), nullable=True) # Env variable or vault ref
    metadata_json: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)

    # Relationships
    business: Mapped["V5Business"] = relationship("V5Business", back_populates="integrations")

# ============================================================
# 15. AUTOMATION
# ============================================================
class V5Automation(Base, TimestampMixin):
    """
    Configured trigger-condition-action automation rule.
    """
    __tablename__ = "v5_automations"

    business_id: Mapped[str] = mapped_column(String(36), ForeignKey("v5_businesses.id", ondelete="CASCADE"), index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    trigger: Mapped[str] = mapped_column(String(100), nullable=False) 
    # Triggers: NEW_LEAD, NEW_MESSAGE, MISSED_MESSAGE, APPOINTMENT_CREATED, APPOINTMENT_CANCELLED, HUMAN_HANDOFF
    conditions: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list)
    actions: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list)
    enabled: Mapped[bool] = mapped_column(Boolean, default=True, index=True)

    # Relationships
    business: Mapped["V5Business"] = relationship("V5Business", back_populates="automations")

# ============================================================
# 16. TASK
# ============================================================
class V5Task(Base, TimestampMixin):
    """
    Scheduled background task or human staff follow-up item.
    """
    __tablename__ = "v5_tasks"

    business_id: Mapped[str] = mapped_column(String(36), ForeignKey("v5_businesses.id", ondelete="CASCADE"), index=True, nullable=False)
    customer_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("v5_customers.id", ondelete="CASCADE"), nullable=True, index=True)
    type: Mapped[str] = mapped_column(String(100), nullable=False) # FOLLOW_UP, REMINDER, CALL_BACK
    status: Mapped[str] = mapped_column(String(50), default="PENDING", index=True) # PENDING, EXECUTING, COMPLETED, FAILED
    scheduled_for: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    payload: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)

    # Relationships
    customer: Mapped[Optional["V5Customer"]] = relationship("V5Customer", back_populates="tasks")

# ============================================================
# 17. NOTIFICATION
# ============================================================
class V5Notification(Base, TimestampMixin):
    """
    Staff or owner dispatch notification (Email, SMS, Push, Slack).
    """
    __tablename__ = "v5_notifications"

    business_id: Mapped[str] = mapped_column(String(36), ForeignKey("v5_businesses.id", ondelete="CASCADE"), index=True, nullable=False)
    type: Mapped[str] = mapped_column(String(50), default="EMAIL") # EMAIL, SMS, PUSH, SLACK
    recipient: Mapped[str] = mapped_column(String(255), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="SENT") # PENDING, SENT, FAILED

# ============================================================
# 18. AI EVENT (Observability & Telemetry)
# ============================================================
class V5AIEvent(Base, TimestampMixin):
    """
    Audited AI call telemetry tracking model, token usage, tool invocation, and latency.
    """
    __tablename__ = "v5_ai_events"

    business_id: Mapped[str] = mapped_column(String(36), ForeignKey("v5_businesses.id", ondelete="CASCADE"), index=True, nullable=False)
    conversation_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True, index=True)
    type: Mapped[str] = mapped_column(String(100), default="CHAT_COMPLETION")
    model: Mapped[str] = mapped_column(String(100), default="gpt-4o-mini")
    tokens: Mapped[int] = mapped_column(Integer, default=0)
    latency_ms: Mapped[int] = mapped_column(Integer, default=0)
    success: Mapped[bool] = mapped_column(Boolean, default=True)
    metadata_json: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)

# ============================================================
# 19. AUDIT LOG (Security & Compliance)
# ============================================================
class V5AuditLog(Base, TimestampMixin):
    """
    Security audit log for administrative, authentication, and cross-tenant events.
    """
    __tablename__ = "v5_audit_logs"

    business_id: Mapped[Optional[str]] = mapped_column(String(36), index=True, nullable=True)
    user_id: Mapped[Optional[str]] = mapped_column(String(36), index=True, nullable=True)
    action: Mapped[str] = mapped_column(String(100), nullable=False) # LOGIN, CREATE_USER, CHANGE_POLICY, ACCESS_DENIED
    resource: Mapped[str] = mapped_column(String(100), nullable=False)
    resource_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    metadata_json: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)

# ============================================================
# 20. USAGE (Billing & Metering Foundation)
# ============================================================
class V5Usage(Base, TimestampMixin):
    """
    Aggregated billing and usage telemetry by period (monthly/daily).
    """
    __tablename__ = "v5_usage"

    business_id: Mapped[str] = mapped_column(String(36), ForeignKey("v5_businesses.id", ondelete="CASCADE"), index=True, nullable=False)
    period: Mapped[str] = mapped_column(String(20), index=True, nullable=False) # e.g. "2026-09"
    messages: Mapped[int] = mapped_column(Integer, default=0)
    tokens: Mapped[int] = mapped_column(Integer, default=0)
    tool_calls: Mapped[int] = mapped_column(Integer, default=0)
    appointments: Mapped[int] = mapped_column(Integer, default=0)
    leads: Mapped[int] = mapped_column(Integer, default=0)
    estimated_cost: Mapped[float] = mapped_column(Float, default=0.0)


# ============================================================
# EXPORTED ALIASES (Backward-Compatibility for V5 Subsystems)
# ============================================================
User = V5User
Business = V5Business
BusinessUser = V5BusinessUser
AIEmployee = V5AIEmployee
Service = V5Service
Staff = V5Staff
KnowledgeDocument = V5KnowledgeDocument
KnowledgeChunk = V5KnowledgeChunk
Customer = V5Customer
Conversation = V5Conversation
Message = V5Message
Lead = V5Lead
Appointment = V5Appointment
Integration = V5Integration
Automation = V5Automation
Task = V5Task
Notification = V5Notification
AIEvent = V5AIEvent
AuditLog = V5AuditLog
Usage = V5Usage
