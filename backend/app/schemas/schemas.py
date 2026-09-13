from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

# Leads
class LeadCreate(BaseModel):
    name: str
    industry: str
    country: str
    city: Optional[str] = None
    state_province: Optional[str] = None
    website_url: Optional[str] = None
    primary_email: Optional[str] = None
    primary_phone: Optional[str] = None
    contact_name: Optional[str] = None
    contact_role: Optional[str] = None

class DiscoveryRequest(BaseModel):
    industry: str
    country: str
    limit: int = 10

class ResearchTriggerRequest(BaseModel):
    business_id: str

# Campaigns
class CampaignCreate(BaseModel):
    name: str
    target_country: str = "USA"
    target_industry: str = "Dental"
    min_lead_score: int = 75
    primary_offer: str = "AI Receptionist"
    daily_send_limit: int = 25
    hourly_send_limit: int = 5
    is_dry_run: bool = True
    follow_up_cadence_days: List[int] = Field(default_factory=lambda: [4, 9, 16])

# Outreach & Dispatch
class MessageActionRequest(BaseModel):
    message_id: str
    action: str # "APPROVE", "REJECT", "SEND_NOW"
    edited_subject: Optional[str] = None
    edited_body: Optional[str] = None

class BatchDispatchRequest(BaseModel):
    campaign_id: Optional[str] = None
    limit: int = 10

# Inbound & Replies
class SimulateReplyRequest(BaseModel):
    sender_email: str
    subject: str = "re: your inquiry"
    body_text: str

class SendReplyRequest(BaseModel):
    conversation_id: str
    reply_body: str

class AutoRespondRequest(BaseModel):
    sender_email: str
    subject: str = "Inquiry regarding AI automation prototype"
    body_text: str
    business_name: Optional[str] = None
    auto_send: bool = False

# Compliance & Kill Switch
class KillSwitchRequest(BaseModel):
    activate: bool
    reason: Optional[str] = "Manual action by Owais"

class SuppressionCreate(BaseModel):
    entry_type: str = "EMAIL" # EMAIL, DOMAIN, COMPANY
    value: str
    reason: str = "MANUAL"
    notes: Optional[str] = None

# Public Demo
class DemoChatRequest(BaseModel):
    industry: str = "Dental"
    business_name: str = "Biscayne Dental"
    message: str
    conversation_history: List[Dict[str, str]] = Field(default_factory=list)

class ContactBookingRequest(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    company_name: Optional[str] = None
    service_interested: str = "AI Receptionist"
    message: Optional[str] = None
