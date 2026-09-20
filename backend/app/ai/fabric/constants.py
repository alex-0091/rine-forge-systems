"""
Rine Forge Systems V5 - Forge Intelligence Fabric: Constants & Enums
Defines authoritative task categories, complexity tiers, risk levels,
artifact types, event types, and epistemological memory tags.
"""
from enum import Enum
from typing import List, Dict, Any


# ============================================================
# 1. TASK CATEGORIES (25 Canonical Domains)
# ============================================================
class TaskCategory(str, Enum):
    CHAT = "CHAT"
    QUESTION = "QUESTION"
    RESEARCH = "RESEARCH"
    CUSTOMER_RESPONSE = "CUSTOMER_RESPONSE"
    CUSTOMER_SUPPORT = "CUSTOMER_SUPPORT"
    SALES = "SALES"
    LEAD_QUALIFICATION = "LEAD_QUALIFICATION"
    WEBSITE_BUILD = "WEBSITE_BUILD"
    WEBSITE_AUDIT = "WEBSITE_AUDIT"
    CODE_GENERATION = "CODE_GENERATION"
    CODE_REVIEW = "CODE_REVIEW"
    DOCUMENT_GENERATION = "DOCUMENT_GENERATION"
    IMAGE_ANALYSIS = "IMAGE_ANALYSIS"
    VISION = "VISION"
    VOICE = "VOICE"
    BUSINESS_PLAN = "BUSINESS_PLAN"
    MARKETING_PLAN = "MARKETING_PLAN"
    FINANCIAL_ANALYSIS = "FINANCIAL_ANALYSIS"
    SEO = "SEO"
    COMPETITOR_ANALYSIS = "COMPETITOR_ANALYSIS"
    AUTOMATION = "AUTOMATION"
    AI_AGENT_CREATION = "AI_AGENT_CREATION"
    VOICE_AGENT_CREATION = "VOICE_AGENT_CREATION"
    LEAD_AGENT_CREATION = "LEAD_AGENT_CREATION"
    DATA_ANALYSIS = "DATA_ANALYSIS"
    BRAND_DESIGN = "BRAND_DESIGN"


ALL_TASK_CATEGORIES = [c.value for c in TaskCategory]


# ============================================================
# 2. TASK COMPLEXITY TIERS
# ============================================================
class TaskComplexity(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


# ============================================================
# 3. RISK LEVELS & HUMAN APPROVAL
# ============================================================
class RiskLevel(str, Enum):
    LOW = "LOW"             # Draft text, internal formatting
    MEDIUM = "MEDIUM"       # Generate artifact, save draft
    HIGH = "HIGH"           # Send communications, update CRM, create appointment
    CRITICAL = "CRITICAL"   # Financial transactions, destructive actions, security changes


# ============================================================
# 4. ARTIFACT TYPES (16 Canonical Deliverables)
# ============================================================
class ArtifactType(str, Enum):
    TEXT = "TEXT"
    DOCUMENT = "DOCUMENT"
    WEBSITE = "WEBSITE"
    CODE = "CODE"
    IMAGE = "IMAGE"
    VIDEO = "VIDEO"
    BUSINESS_PLAN = "BUSINESS_PLAN"
    MARKETING_PLAN = "MARKETING_PLAN"
    FINANCIAL_MODEL = "FINANCIAL_MODEL"
    AUDIT = "AUDIT"
    LEAD_LIST = "LEAD_LIST"
    CRM_WORKFLOW = "CRM_WORKFLOW"
    AI_AGENT = "AI_AGENT"
    VOICE_AGENT = "VOICE_AGENT"
    AUTOMATION = "AUTOMATION"
    REPORT = "REPORT"
    SPREADSHEET = "SPREADSHEET"
    LOGO = "LOGO"


ALL_ARTIFACT_TYPES = [a.value for a in ArtifactType]


# ============================================================
# 5. INTERNAL EVENT TYPES (14 Core Events)
# ============================================================
class FabricEvent(str, Enum):
    AI_REQUESTED = "AI_REQUESTED"
    TASK_CLASSIFIED = "TASK_CLASSIFIED"
    PLAN_CREATED = "PLAN_CREATED"
    MODEL_SELECTED = "MODEL_SELECTED"
    TOOL_REQUESTED = "TOOL_REQUESTED"
    TOOL_EXECUTED = "TOOL_EXECUTED"
    VERIFICATION_STARTED = "VERIFICATION_STARTED"
    VERIFICATION_FAILED = "VERIFICATION_FAILED"
    REPAIR_STARTED = "REPAIR_STARTED"
    ARTIFACT_CREATED = "ARTIFACT_CREATED"
    APPROVAL_REQUIRED = "APPROVAL_REQUIRED"
    TASK_COMPLETED = "TASK_COMPLETED"
    TASK_FAILED = "TASK_FAILED"
    HUMAN_HANDOFF = "HUMAN_HANDOFF"


ALL_FABRIC_EVENTS = [e.value for e in FabricEvent]


# ============================================================
# 6. EPISTEMOLOGICAL MEMORY TAGS
# ============================================================
class FactProvenance(str, Enum):
    USER_PROVIDED = "USER_PROVIDED"       # Directly stated by the client
    AI_GENERATED = "AI_GENERATED"         # Synthesized by an AI model
    AI_INFERRED = "AI_INFERRED"           # Deduced/suggested by an AI model
    VERIFIED = "VERIFIED"                 # Validated by test or code execution
    APPROVED = "APPROVED"                 # Explicitly confirmed by human operator


# ============================================================
# 7. VERIFICATION CATEGORIES (9 Checks)
# ============================================================
class VerificationCategory(str, Enum):
    SCHEMA = "SCHEMA"
    FACTUALITY = "FACTUALITY"
    BUSINESS_RULES = "BUSINESS_RULES"
    SECURITY = "SECURITY"
    BUILD = "BUILD"
    TEST = "TEST"
    CALCULATION = "CALCULATION"
    POLICY = "POLICY"
    QUALITY = "QUALITY"
