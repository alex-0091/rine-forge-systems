import logging
from typing import Dict, Any, Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy import select, desc
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.database import get_db
from backend.app.models.business import Business
from backend.app.receptionist.orchestrator import receptionist_orchestrator
from backend.app.receptionist.knowledge import business_knowledge_service
from backend.app.models.receptionist import (
    ReceptionistConversation,
    ReceptionistMessage,
    HumanHandoff
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/receptionist", tags=["AI Receptionist"])

DEMO_BUSINESS_ID = "00000000-0000-0000-0000-000000000001"

async def ensure_demo_business(session: AsyncSession) -> Business:
    """Ensures verified demo business exists with rich facts for public demonstrations."""
    from backend.app.database import init_db
    try:
        stmt = select(Business).where(Business.id == DEMO_BUSINESS_ID)
        res = await session.execute(stmt)
        biz = res.scalar_one_or_none()
    except Exception as e:
        logger.info(f"Cold-start database auto-init: {e}")
        await init_db()
        stmt = select(Business).where(Business.id == DEMO_BUSINESS_ID)
        res = await session.execute(stmt)
        biz = res.scalar_one_or_none()

    if not biz:
        biz = Business(
            id=DEMO_BUSINESS_ID,
            name="Rine Dental & Facial Aesthetics",
            normalized_name="rinedentalfacialaesthetics",
            industry="Dental & Healthcare",
            country="USA",
            city="Austin",
            address="100 Innovation Way, Suite 400, Austin, TX",
            primary_email="reception@rineforge.ai",
            primary_phone="+1 (512) 555-0199",
            source="demo_seed"
        )
        session.add(biz)
        await session.flush()

        knowledge_data = {
            "business_name": "Rine Dental & Facial Aesthetics",
            "industry": "Dental & Healthcare",
            "description": "Premier restorative dentistry, laser teeth whitening, and facial aesthetics in Austin, TX.",
            "services": [
                {
                    "name": "Comprehensive Dental Cleaning & Exam",
                    "duration_minutes": 45,
                    "price_estimate": "$120",
                    "description": "Thorough ultrasonic plaque removal, polish, oral cancer screening, and digital X-ray scan."
                },
                {
                    "name": "Professional In-Office Laser Teeth Whitening",
                    "duration_minutes": 60,
                    "price_estimate": "$350",
                    "description": "Medical-grade LED laser whitening brightening smiles up to 8 shades in a single comfortable session."
                },
                {
                    "name": "Dental Implants Consultation",
                    "duration_minutes": 30,
                    "price_estimate": "$80",
                    "description": "Comprehensive 3D CBCT imaging, bone density evaluation, and restorative treatment plan."
                },
                {
                    "name": "Invisalign Clear Aligners Assessment",
                    "duration_minutes": 30,
                    "price_estimate": "Complimentary",
                    "description": "Digital smile simulation, bite assessment, and customized orthodontic alignment roadmap."
                }
            ],
            "opening_hours": {
                "monday": "08:30 - 17:30",
                "tuesday": "08:30 - 17:30",
                "wednesday": "08:30 - 17:30",
                "thursday": "08:30 - 17:30",
                "friday": "08:30 - 17:00",
                "saturday": "09:00 - 16:00",
                "sunday": "Closed (Emergency on-call only)"
            },
            "timezone": "America/Chicago",
            "location_address": "100 Innovation Way, Suite 400, Austin, TX",
            "contact_email": "reception@rineforge.ai",
            "contact_phone": "+1 (512) 555-0199",
            "policies": {
                "cancellation": "24-hour advance notice requested to avoid a $25 late cancellation fee.",
                "insurance": "We accept major PPO insurance plans including Delta Dental, Cigna, MetLife, Guardian, and Aetna.",
                "emergencies": "Two daily acute walk-in slots reserved at 11:00 AM and 3:30 PM."
            },
            "faqs": [
                {
                    "question": "Is free parking available?",
                    "answer": "Yes, complimentary underground and surface visitor parking is available at Innovation Plaza."
                },
                {
                    "question": "Do you accept new patients?",
                    "answer": "Yes, we are currently accepting new adult and pediatric patients with immediate availability this week."
                }
            ],
            "custom_instructions": "Always maintain a warm, welcoming, and reassuring clinical tone. Inform patients that live calendar booking is currently being connected, and our team confirms requests promptly."
        }
        await business_knowledge_service.upsert_knowledge(session, DEMO_BUSINESS_ID, knowledge_data)
        await session.commit()
    return biz

# --- Request / Response Schemas ---

class ReceptionistMessageRequest(BaseModel):
    business_id: Optional[str] = Field(default=DEMO_BUSINESS_ID, description="UUID of the target business")
    message: str = Field(min_length=1, description="Customer message text")
    conversation_id: Optional[str] = Field(default=None, description="Existing conversation UUID for multi-turn threads")
    customer_id: Optional[str] = None
    customer_name: Optional[str] = None
    customer_contact: Optional[str] = None
    channel: str = Field(default="web_chat", description="Channel: web_chat, whatsapp, email, phone, sms")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)

class BusinessKnowledgeUpsertRequest(BaseModel):
    business_name: str
    industry: str
    description: Optional[str] = None
    services: List[Dict[str, Any]] = Field(default_factory=list)
    opening_hours: Dict[str, str] = Field(default_factory=dict)
    timezone: str = "America/New_York"
    location_address: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    policies: Dict[str, str] = Field(default_factory=dict)
    faqs: List[Dict[str, str]] = Field(default_factory=list)
    custom_instructions: Optional[str] = None

class ResolveHandoffRequest(BaseModel):
    assigned_to: Optional[str] = "Operator"
    resolution_notes: Optional[str] = "Handled and resolved by human agent."

# --- Endpoints ---

@router.get("/demo-business")
async def get_demo_business_info(session: AsyncSession = Depends(get_db)):
    """
    Returns public demo business credentials, verified profile, and starter questions.
    """
    try:
        biz = await ensure_demo_business(session)
        knowledge = await business_knowledge_service.get_knowledge(session, biz.id)

        return {
            "business_id": biz.id,
            "business_name": biz.name,
            "industry": biz.industry,
            "city": biz.city,
            "starter_prompts": [
                "What are your opening hours on Saturday?",
                "What services do you offer?",
                "How much does teeth whitening cost?",
                "I'd like to book an appointment tomorrow at 3pm.",
                "Can I speak with a human receptionist?"
            ],
            "verified_services_count": len(knowledge.services) if knowledge else 4
        }
    except Exception as err:
        logger.warning(f"Returning static demo fallback: {err}")
        return {
            "business_id": DEMO_BUSINESS_ID,
            "business_name": "Rine Dental & Facial Aesthetics",
            "industry": "Dental & Healthcare",
            "city": "Austin",
            "starter_prompts": [
                "What are your opening hours on Saturday?",
                "What services do you offer?",
                "How much does teeth whitening cost?",
                "I'd like to book an appointment tomorrow at 3pm.",
                "Can I speak with a human receptionist?"
            ],
            "verified_services_count": 4
        }

@router.post("/message")
@router.post("/chat")
async def send_receptionist_message(
    req: ReceptionistMessageRequest,
    session: AsyncSession = Depends(get_db)
):
    """
    Main conversational intake for the AI Receptionist.
    Receives customer message, loads memory, queries grounded knowledge,
    determines tools, and returns structured result.
    """
    biz_id = req.business_id or DEMO_BUSINESS_ID
    if biz_id in ["demo", "default", "forge-demo-clinic", DEMO_BUSINESS_ID]:
        biz_id = DEMO_BUSINESS_ID
        await ensure_demo_business(session)

    # Public Demo Rate Limiting: Max 20 turns per conversation to prevent quota depletion
    if req.conversation_id:
        stmt_count = select(ReceptionistMessage).where(ReceptionistMessage.conversation_id == req.conversation_id)
        res_count = await session.execute(stmt_count)
        msg_count = len(res_count.scalars().all())
        if msg_count >= 20:
            return {
                "conversation_id": req.conversation_id,
                "business_id": biz_id,
                "reply": "You have reached the demo session limit (20 messages). To deploy a dedicated custom AI Receptionist for your business with unlimited conversations, please request a free AI audit or contact our team.",
                "intent": "GENERAL_QUESTION",
                "confidence": 1.0,
                "requires_human": True,
                "human_reason": "Public demo conversation turn limit reached.",
                "action": "sessionLimitReached",
                "action_status": "LIMIT_REACHED",
                "action_details": {"turns_used": msg_count, "max_allowed": 20},
                "latency_ms": 12,
                "metadata": {"status": "LIMIT_REACHED"}
            }

    return await receptionist_orchestrator.handle_message(
        session=session,
        business_id=biz_id,
        message=req.message,
        conversation_id=req.conversation_id,
        customer_id=req.customer_id,
        customer_name=req.customer_name,
        customer_contact=req.customer_contact,
        channel=req.channel,
        metadata=req.metadata
    )

@router.get("/conversations/{conversation_id}")
async def get_conversation(
    conversation_id: str,
    business_id: str = Query(..., description="Business ID required for multi-tenant isolation check"),
    session: AsyncSession = Depends(get_db)
):
    """
    Retrieves complete message history for a conversation thread.
    Enforces strict multi-tenant access control.
    """
    stmt = select(ReceptionistConversation).options(
        selectinload(ReceptionistConversation.messages),
        selectinload(ReceptionistConversation.actions),
        selectinload(ReceptionistConversation.handoffs)
    ).where(ReceptionistConversation.id == conversation_id)

    res = await session.execute(stmt)
    conv = res.scalar_one_or_none()

    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found.")

    if conv.business_id != business_id:
        raise HTTPException(status_code=403, detail="Unauthorized access to another business's conversation.")

    return {
        "id": conv.id,
        "business_id": conv.business_id,
        "channel": conv.channel,
        "customer_name": conv.customer_name,
        "customer_contact": conv.customer_contact,
        "status": conv.status,
        "requires_human": conv.requires_human,
        "human_reason": conv.human_reason,
        "created_at": conv.created_at.isoformat() if conv.created_at else None,
        "messages": [
            {
                "id": m.id,
                "role": m.role,
                "sender_type": m.sender_type,
                "content": m.content,
                "intent": m.intent,
                "confidence": m.confidence,
                "latency_ms": m.latency_ms,
                "created_at": m.created_at.isoformat() if m.created_at else None
            }
            for m in conv.messages
        ],
        "actions": [
            {
                "id": a.id,
                "tool_name": a.tool_name,
                "action_type": a.action_type,
                "status": a.status,
                "arguments": a.arguments,
                "result": a.result,
                "execution_latency_ms": a.execution_latency_ms
            }
            for a in conv.actions
        ],
        "handoffs": [
            {
                "id": h.id,
                "reason": h.reason,
                "trigger_message": h.trigger_message,
                "status": h.status,
                "assigned_to": h.assigned_to
            }
            for h in conv.handoffs
        ]
    }

@router.get("/businesses/{business_id}/knowledge")
async def get_business_knowledge(
    business_id: str,
    session: AsyncSession = Depends(get_db)
):
    """
    Retrieves verified business knowledge for a given business.
    """
    knowledge = await business_knowledge_service.get_knowledge(session, business_id)
    if not knowledge:
        return {"business_id": business_id, "has_knowledge": False, "knowledge": None}

    return {
        "business_id": business_id,
        "has_knowledge": True,
        "knowledge": {
            "business_name": knowledge.business_name,
            "industry": knowledge.industry,
            "description": knowledge.description,
            "services": knowledge.services,
            "opening_hours": knowledge.opening_hours,
            "timezone": knowledge.timezone,
            "location_address": knowledge.location_address,
            "contact_email": knowledge.contact_email,
            "contact_phone": knowledge.contact_phone,
            "policies": knowledge.policies,
            "faqs": knowledge.faqs,
            "custom_instructions": knowledge.custom_instructions
        }
    }

@router.post("/businesses/{business_id}/knowledge")
async def upsert_business_knowledge(
    business_id: str,
    req: BusinessKnowledgeUpsertRequest,
    session: AsyncSession = Depends(get_db)
):
    """
    Configures or updates verified business facts used for anti-hallucination grounding.
    """
    knowledge = await business_knowledge_service.upsert_knowledge(
        session=session,
        business_id=business_id,
        data=req.model_dump()
    )
    await session.commit()
    return {"success": True, "business_id": business_id, "message": "Business knowledge saved and cached."}

@router.get("/handoffs")
async def list_handoffs(
    business_id: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    session: AsyncSession = Depends(get_db)
):
    """
    Lists human escalation tickets for operator intervention.
    """
    stmt = select(HumanHandoff).order_by(desc(HumanHandoff.created_at))
    if business_id:
        stmt = stmt.where(HumanHandoff.business_id == business_id)
    if status:
        stmt = stmt.where(HumanHandoff.status == status)

    res = await session.execute(stmt)
    records = res.scalars().all()

    return [
        {
            "id": h.id,
            "conversation_id": h.conversation_id,
            "business_id": h.business_id,
            "reason": h.reason,
            "trigger_message": h.trigger_message,
            "customer_contact": h.customer_contact,
            "status": h.status,
            "assigned_to": h.assigned_to,
            "resolution_notes": h.resolution_notes,
            "created_at": h.created_at.isoformat() if h.created_at else None
        }
        for h in records
    ]

@router.post("/handoffs/{handoff_id}/resolve")
async def resolve_handoff(
    handoff_id: str,
    req: ResolveHandoffRequest,
    session: AsyncSession = Depends(get_db)
):
    """
    Marks a human handoff ticket as resolved and returns conversation to ACTIVE/RESOLVED.
    """
    stmt = select(HumanHandoff).where(HumanHandoff.id == handoff_id)
    res = await session.execute(stmt)
    handoff = res.scalar_one_or_none()

    if not handoff:
        raise HTTPException(status_code=404, detail="Handoff record not found.")

    handoff.status = "RESOLVED"
    handoff.assigned_to = req.assigned_to
    handoff.resolution_notes = req.resolution_notes

    # Update conversation status as well
    stmt_conv = select(ReceptionistConversation).where(ReceptionistConversation.id == handoff.conversation_id)
    res_conv = await session.execute(stmt_conv)
    conv = res_conv.scalar_one_or_none()
    if conv:
        conv.status = "RESOLVED"
        conv.requires_human = False

    await session.commit()
    return {"success": True, "handoff_id": handoff_id, "message": "Handoff resolved successfully."}
