import uuid
from datetime import datetime, timezone
from enum import Enum
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field

class ChannelType(str, Enum):
    """
    Supported inbound and outbound communication channels for Forge AI Employees.
    """
    WHATSAPP = "whatsapp"
    WEB_CHAT = "web_chat"
    PHONE = "phone"
    EMAIL = "email"
    SMS = "sms"

class MessageContentType(str, Enum):
    """
    Standardized payload content type across channels.
    """
    TEXT = "text"
    AUDIO = "audio"
    IMAGE = "image"
    DOCUMENT = "document"
    VIDEO = "video"
    LOCATION = "location"
    INTERACTIVE = "interactive"
    SYSTEM = "system"

class CustomerIdentity(BaseModel):
    """
    Normalized customer identification envelope.
    """
    id: Optional[str] = None
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    wa_id: Optional[str] = None  # WhatsApp phone ID / JID
    metadata: Dict[str, Any] = Field(default_factory=dict)

class MediaAttachment(BaseModel):
    """
    Normalized media metadata for voice notes, images, PDFs, and documents.
    """
    type: MessageContentType = MessageContentType.TEXT
    mime_type: Optional[str] = None
    url: Optional[str] = None
    provider_media_id: Optional[str] = None
    file_size_bytes: Optional[int] = None
    filename: Optional[str] = None
    sha256: Optional[str] = None

class MessagePayload(BaseModel):
    """
    Normalized message turn payload.
    """
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    type: MessageContentType = MessageContentType.TEXT
    text: Optional[str] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    raw_channel_payload: Optional[Dict[str, Any]] = None

class NormalizedInboundMessage(BaseModel):
    """
    Universal channel-agnostic inbound message envelope.
    All channels (WhatsApp, Web Chat, Phone, Email) MUST normalize their inputs to this contract.
    Ensures the Elena AI Receptionist core never has channel-specific coupling.
    """
    channel: ChannelType = ChannelType.WHATSAPP
    business_id: Optional[str] = None
    conversation_id: Optional[str] = None
    customer: CustomerIdentity = Field(default_factory=CustomerIdentity)
    message: MessagePayload = Field(default_factory=MessagePayload)
    media: Optional[MediaAttachment] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

class NormalizedOutboundResponse(BaseModel):
    """
    Universal channel-agnostic outbound response envelope.
    Elena and other Forge AI agents return this structure to the respective channel dispatcher.
    """
    conversation_id: str
    business_id: str
    reply_text: str
    intent: str = "GENERAL_QUESTION"
    confidence: float = 1.0
    action: Optional[str] = None
    action_status: Optional[str] = None
    action_details: Dict[str, Any] = Field(default_factory=dict)
    requires_human: bool = False
    human_reason: Optional[str] = None
    latency_ms: int = 0
    channel: ChannelType = ChannelType.WHATSAPP
    metadata: Dict[str, Any] = Field(default_factory=dict)
