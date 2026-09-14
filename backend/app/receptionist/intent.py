import re
import logging
from enum import Enum
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field
from backend.app.ai.llm_provider import get_llm_provider

logger = logging.getLogger(__name__)

class ReceptionistIntent(str, Enum):
    """
    Canonical intent enumeration for the AI Receptionist.
    Extensible for future specialized agents (Sales, Support, Operations).
    """
    GENERAL_QUESTION = "GENERAL_QUESTION"
    APPOINTMENT_REQUEST = "APPOINTMENT_REQUEST"
    BOOKING_REQUEST = "BOOKING_REQUEST"
    RESCHEDULE_REQUEST = "RESCHEDULE_REQUEST"
    CANCELLATION_REQUEST = "CANCELLATION_REQUEST"
    PRICING_QUESTION = "PRICING_QUESTION"
    SERVICE_QUESTION = "SERVICE_QUESTION"
    LOCATION_QUESTION = "LOCATION_QUESTION"
    HOURS_QUESTION = "HOURS_QUESTION"
    LEAD_INQUIRY = "LEAD_INQUIRY"
    HUMAN_REQUEST = "HUMAN_REQUEST"
    UNKNOWN = "UNKNOWN"

class IntentClassificationResult(BaseModel):
    intent: ReceptionistIntent
    confidence: float = Field(default=0.90, ge=0.0, le=1.0)
    entities: Dict[str, Any] = Field(default_factory=dict)
    requires_human: bool = False
    escalation_reason: Optional[str] = None
    suggested_tool: Optional[str] = None

# Fast-path pattern heuristics for instant low-latency classification (<5ms)
HUMAN_PATTERNS = [
    r"\b(speak|talk)\s+to\s+(a\s+)?(human|person|agent|representative|manager|someone|real\s+person|receptionist)\b",
    r"\bhuman\s+please\b",
    r"\btransfer\s+me\b",
    r"\bconnect\s+me\s+with\s+(someone|human|person|agent)\b",
    r"\bi\s+want\s+a\s+human\b",
    r"\boperator\b",
    r"\blive\s+agent\b"
]

HOURS_PATTERNS = [
    r"\b(what\s+are\s+your|what\s+time\s+do\s+you|are\s+you)\s+(open|close|hours)\b",
    r"\b(opening|business|working)\s+hours\b",
    r"\bwhen\s+do\s+you\s+(open|close)\b",
    r"\bare\s+you\s+open\s+(today|tomorrow|now|on|saturday|sunday)\b"
]

LOCATION_PATTERNS = [
    r"\b(where\s+are\s+you|what\s+is\s+your|how\s+to\s+get\s+to\s+your)\s+(located|location|address|office|clinic|directions)\b",
    r"\bwhere\s+is\s+(the\s+clinic|the\s+office|the\s+hotel|your\s+place)\b",
    r"\bwhat('s|\s+is)\s+the\s+address\b"
]

PRICING_PATTERNS = [
    r"\b(how\s+much\s+(is|does|do|for)|what\s+is\s+the\s+cost|what\s+are\s+the\s+(prices|rates))\b",
    r"\b(pricing|rate\s+card|estimate|fee|fees|cost)\b"
]

CANCELLATION_PATTERNS = [
    r"\b(cancel|cancellation|call\s+off)\s+(my|the)?\s*(appointment|booking|reservation)\b",
    r"\bi\s+need\s+to\s+cancel\b"
]

RESCHEDULE_PATTERNS = [
    r"\b(reschedule|change|move|postpone)\s+(my|the)?\s*(appointment|booking|reservation|date|time)\b",
    r"\bneed\s+to\s+reschedule\b"
]

BOOKING_PATTERNS = [
    r"\b(book|schedule|make|reserve|set\s+up)\s+(an?|my)?\s*(appointment|consultation|slot|visit|booking|room|session|meeting)\b",
    r"\bi('d|\s+would)\s+like\s+to\s+(book|schedule|reserve|come\s+in)\b",
    r"\bavailable\s+slots?\b",
    r"\bopenings?\s+(this|next|on|tomorrow)\b"
]

async def classify_intent(
    message: str,
    conversation_history: Optional[list] = None,
    business_context: Optional[str] = None
) -> IntentClassificationResult:
    """
    Classifies customer message into a canonical intent using fast heuristics
    with LLM semantic fallback.
    """
    clean_msg = message.strip()
    msg_lower = clean_msg.lower()

    # 1. Fast-Path Heuristic Checks (Immediate sub-millisecond execution)
    for p in HUMAN_PATTERNS:
        if re.search(p, msg_lower):
            return IntentClassificationResult(
                intent=ReceptionistIntent.HUMAN_REQUEST,
                confidence=0.99,
                requires_human=True,
                escalation_reason="Customer explicitly requested to speak with a human agent.",
                suggested_tool="requestHumanHandoff"
            )

    for p in CANCELLATION_PATTERNS:
        if re.search(p, msg_lower):
            return IntentClassificationResult(
                intent=ReceptionistIntent.CANCELLATION_REQUEST,
                confidence=0.95,
                suggested_tool="cancelAppointment"
            )

    for p in RESCHEDULE_PATTERNS:
        if re.search(p, msg_lower):
            return IntentClassificationResult(
                intent=ReceptionistIntent.RESCHEDULE_REQUEST,
                confidence=0.95,
                suggested_tool="rescheduleAppointment"
            )

    for p in HOURS_PATTERNS:
        if re.search(p, msg_lower):
            return IntentClassificationResult(
                intent=ReceptionistIntent.HOURS_QUESTION,
                confidence=0.95,
                suggested_tool="getBusinessHours"
            )

    for p in LOCATION_PATTERNS:
        if re.search(p, msg_lower):
            return IntentClassificationResult(
                intent=ReceptionistIntent.LOCATION_QUESTION,
                confidence=0.95,
                suggested_tool="getBusinessInformation"
            )

    for p in PRICING_PATTERNS:
        if re.search(p, msg_lower):
            return IntentClassificationResult(
                intent=ReceptionistIntent.PRICING_QUESTION,
                confidence=0.92,
                suggested_tool="getServiceInformation"
            )

    for p in BOOKING_PATTERNS:
        if re.search(p, msg_lower):
            return IntentClassificationResult(
                intent=ReceptionistIntent.BOOKING_REQUEST,
                confidence=0.95,
                suggested_tool="checkAvailability"
            )

    # 2. Context-Aware Multi-Turn Followup Heuristics
    # If the user provides a short response like "3pm", "tomorrow", or "yes please"
    if conversation_history and len(conversation_history) > 0:
        last_turn = conversation_history[-1]
        last_intent = last_turn.get("intent")
        
        time_or_day = re.search(r"\b(\d{1,2}(:\d{2})?\s*(am|pm)?|tomorrow|today|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b", msg_lower)
        if time_or_day and last_intent in [ReceptionistIntent.BOOKING_REQUEST, ReceptionistIntent.APPOINTMENT_REQUEST, ReceptionistIntent.RESCHEDULE_REQUEST]:
            return IntentClassificationResult(
                intent=ReceptionistIntent.APPOINTMENT_REQUEST,
                confidence=0.90,
                entities={"date_or_time_spec": time_or_day.group(0)},
                suggested_tool="checkAvailability"
            )

    # 3. LLM Semantic Classification
    prompt = (
        f"You are the Intent Classification engine for an AI Receptionist.\n"
        f"Analyze this customer message and classify it into exactly one canonical intent:\n"
        f"Allowed intents: {[i.value for i in ReceptionistIntent]}\n\n"
        f"Customer Message: \"{clean_msg}\"\n"
        f"Business Context: {business_context or 'General Business Services'}\n\n"
        f"Return strict JSON with keys: intent, confidence (0.0 to 1.0), entities (dictionary), requires_human (boolean), escalation_reason (string or null), suggested_tool (string or null)."
    )

    try:
        llm = get_llm_provider()
        res = await llm.generate_json(prompt=prompt, operation_name="receptionist_intent_classification")
        
        raw_intent = res.get("intent", "GENERAL_QUESTION")
        try:
            intent_enum = ReceptionistIntent(raw_intent)
        except ValueError:
            intent_enum = ReceptionistIntent.GENERAL_QUESTION

        confidence = float(res.get("confidence", 0.85))
        requires_human = bool(res.get("requires_human", False) or confidence < 0.60 or intent_enum == ReceptionistIntent.HUMAN_REQUEST)
        
        return IntentClassificationResult(
            intent=intent_enum,
            confidence=confidence,
            entities=res.get("entities", {}),
            requires_human=requires_human,
            escalation_reason=res.get("escalation_reason") if requires_human else None,
            suggested_tool=res.get("suggested_tool")
        )
    except Exception as e:
        logger.warning(f"Semantic intent classification fallback: {e}")
        return IntentClassificationResult(
            intent=ReceptionistIntent.GENERAL_QUESTION,
            confidence=0.75,
            suggested_tool="getBusinessInformation"
        )
