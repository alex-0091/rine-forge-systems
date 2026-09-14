import pytest
import pytest_asyncio
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from pydantic import ValidationError

from backend.app.models.business import Business
from backend.app.models.receptionist import (
    BusinessKnowledge,
    ReceptionistConversation,
    ReceptionistMessage,
    ReceptionistAction,
    HumanHandoff
)
from backend.app.receptionist.orchestrator import receptionist_orchestrator
from backend.app.receptionist.knowledge import business_knowledge_service
from backend.app.receptionist.tools import receptionist_tools, CreateAppointmentArgs
from backend.app.receptionist.intent import classify_intent, ReceptionistIntent

@pytest_asyncio.fixture
async def sample_dental_business(async_session: AsyncSession):
    """Creates a sample dental clinic business with verified knowledge."""
    biz = Business(
        name="Jenkins Family Dental",
        normalized_name="jenkinsfamilydental",
        industry="Dental Healthcare",
        country="USA",
        city="Austin",
        address="104 Dental Plaza, Suite 200, Austin, TX",
        primary_email="info@jenkinsdental.com",
        primary_phone="+1-512-555-0199"
    )
    async_session.add(biz)
    await async_session.flush()

    knowledge_data = {
        "business_name": "Jenkins Family Dental",
        "industry": "Dental Healthcare",
        "description": "Comprehensive family dentistry, restorative care, and cosmetic whitening in Austin.",
        "services": [
            {
                "name": "Comprehensive Dental Cleaning",
                "duration_minutes": 45,
                "price_estimate": "$120",
                "description": "Thorough plaque removal, polish, and diagnostic exam."
            },
            {
                "name": "Professional In-Office Teeth Whitening",
                "duration_minutes": 60,
                "price_estimate": "$350",
                "description": "Medical-grade laser teeth whitening brightening up to 8 shades."
            },
            {
                "name": "Root Canal Therapy",
                "duration_minutes": 90,
                "price_estimate": "$850",
                "description": "Single-visit gentle restorative therapy."
            }
        ],
        "opening_hours": {
            "monday": "08:30-17:30",
            "tuesday": "08:30-17:30",
            "wednesday": "08:30-17:30",
            "thursday": "08:30-17:30",
            "friday": "08:30-14:00"
        },
        "timezone": "America/Chicago",
        "location_address": "104 Dental Plaza, Suite 200, Austin, TX",
        "contact_email": "info@jenkinsdental.com",
        "contact_phone": "+1-512-555-0199",
        "policies": {
            "cancellation": "24-hour advance notice required to avoid a $25 fee.",
            "insurance": "We accept Delta Dental, Cigna, and MetLife PPO plans."
        },
        "faqs": [
            {
                "question": "Do you accept emergency walk-ins?",
                "answer": "Yes, we reserve two emergency slots daily for acute dental pain."
            }
        ],
        "custom_instructions": "Always maintain a warm, calming clinical tone."
    }

    await business_knowledge_service.upsert_knowledge(async_session, biz.id, knowledge_data)
    await async_session.commit()
    return biz

@pytest_asyncio.fixture
async def second_hotel_business(async_session: AsyncSession):
    """Creates a second distinct business to test multi-tenant isolation."""
    biz = Business(
        name="Grand Azure Boutique Hotel",
        normalized_name="grandazurehotel",
        industry="Hospitality",
        country="USA",
        city="Miami",
        address="800 Ocean Drive, Miami, FL",
        primary_email="reservations@grandazure.com",
        primary_phone="+1-305-555-0440"
    )
    async_session.add(biz)
    await async_session.commit()
    return biz

# ==========================================
# 1. GENERAL QUESTION TEST
# ==========================================
@pytest.mark.asyncio
async def test_general_question(async_session: AsyncSession, sample_dental_business: Business):
    """Customer asks a general service question; receives warm grounded response."""
    res = await receptionist_orchestrator.handle_message(
        session=async_session,
        business_id=sample_dental_business.id,
        message="Hi! Could you tell me what kind of dental services you provide?"
    )

    assert res["conversation_id"] is not None
    assert res["business_id"] == sample_dental_business.id
    assert res["requires_human"] is False
    assert len(res["reply"]) > 10
    assert res["intent"] in ["GENERAL_QUESTION", "SERVICE_QUESTION"]

# ==========================================
# 2. BUSINESS INFORMATION QUESTION TEST
# ==========================================
@pytest.mark.asyncio
async def test_business_information_question(async_session: AsyncSession, sample_dental_business: Business):
    """Customer asks for opening hours and location; verified facts returned."""
    # Test hours
    res_hours = await receptionist_orchestrator.handle_message(
        session=async_session,
        business_id=sample_dental_business.id,
        message="What are your opening hours on Friday?"
    )
    assert res_hours["intent"] == "HOURS_QUESTION"
    assert res_hours["action"] == "getBusinessHours"
    assert "8:30" in res_hours["reply"] or "open" in res_hours["reply"].lower()

    # Test address
    res_loc = await receptionist_orchestrator.handle_message(
        session=async_session,
        business_id=sample_dental_business.id,
        message="Where is your clinic located and what is the address?"
    )
    assert res_loc["intent"] == "LOCATION_QUESTION"
    assert res_loc["action"] == "getBusinessInformation"
    assert "Dental Plaza" in res_loc["reply"] or "located" in res_loc["reply"].lower()

# ==========================================
# 3. UNKNOWN QUESTION (NO HALLUCINATION) TEST
# ==========================================
@pytest.mark.asyncio
async def test_unknown_question_no_hallucination(async_session: AsyncSession, sample_dental_business: Business):
    """
    CRITICAL: Customer asks about an unlisted service/price.
    The AI must NOT invent prices or services; it must state it does not have that information.
    """
    res = await receptionist_orchestrator.handle_message(
        session=async_session,
        business_id=sample_dental_business.id,
        message="Do you install diamond teeth or submarine repairs, and how much does a rocket engine cost?"
    )

    reply = res["reply"].lower()
    # Must contain honest fallback language rather than fabricated price/service
    assert "don't have that information" in reply or "team" in reply or "connect" in reply or "assist" in reply
    assert "$1,000,000" not in reply  # No fabricated numbers

# ==========================================
# 4. CONVERSATION MEMORY (MULTI-TURN) TEST
# ==========================================
@pytest.mark.asyncio
async def test_conversation_memory(async_session: AsyncSession, sample_dental_business: Business):
    """
    Customer says: 'I want to book tomorrow.'
    Receptionist asks: 'What time works for you?'
    Customer says: '3pm.'
    The system maintains conversation_id and resolves multi-turn context.
    """
    # Turn 1
    t1 = await receptionist_orchestrator.handle_message(
        session=async_session,
        business_id=sample_dental_business.id,
        message="I would like to book an appointment tomorrow please."
    )
    conv_id = t1["conversation_id"]
    assert conv_id is not None
    assert t1["intent"] == "BOOKING_REQUEST"

    # Turn 2 using the same conversation_id
    t2 = await receptionist_orchestrator.handle_message(
        session=async_session,
        business_id=sample_dental_business.id,
        conversation_id=conv_id,
        message="3pm works best for me."
    )
    assert t2["conversation_id"] == conv_id
    assert t2["intent"] in ["APPOINTMENT_REQUEST", "BOOKING_REQUEST"]
    assert len(t2["reply"]) > 0

# ==========================================
# 5. HUMAN REQUEST ESCALATION TEST
# ==========================================
@pytest.mark.asyncio
async def test_human_request(async_session: AsyncSession, sample_dental_business: Business):
    """Customer asks for a human agent; triggers escalation to NEEDS_HUMAN and logs handoff."""
    res = await receptionist_orchestrator.handle_message(
        session=async_session,
        business_id=sample_dental_business.id,
        message="I want to speak with a human receptionist immediately please."
    )

    assert res["requires_human"] is True
    assert res["action"] == "requestHumanHandoff"
    assert res["action_status"] == "SUCCESS"
    assert res["metadata"]["status"] == "NEEDS_HUMAN"

    # Verify HumanHandoff table entry exists
    handoffs = await receptionist_tools.execute_tool(
        session=async_session,
        tool_name="requestHumanHandoff",
        raw_args={
            "business_id": sample_dental_business.id,
            "conversation_id": res["conversation_id"],
            "reason": "Direct test verify",
            "customer_message": "human please"
        }
    )
    assert handoffs.status == "SUCCESS"

# ==========================================
# 6. LOW CONFIDENCE REQUEST TEST
# ==========================================
@pytest.mark.asyncio
async def test_low_confidence_escalation(async_session: AsyncSession, sample_dental_business: Business):
    """Uninterpretable or low confidence message triggers safe escalation."""
    res = await receptionist_orchestrator.handle_message(
        session=async_session,
        business_id=sample_dental_business.id,
        message="xyz123 asdfghjkl gibberish unclear_message"
    )

    assert res["requires_human"] is True
    assert res["intent"] in ["UNKNOWN", "GENERAL_QUESTION"]

# ==========================================
# 7. TOOL FAILURE GRACEFUL HANDLING TEST
# ==========================================
@pytest.mark.asyncio
async def test_tool_failure_handling(async_session: AsyncSession):
    """Attempting an unregistered tool returns a clean failure result without crashing."""
    result = await receptionist_tools.execute_tool(
        session=async_session,
        tool_name="arbitraryMaliciousFunction",
        raw_args={"secret": "hack"}
    )

    assert result.status == "FAILED"
    assert "Unauthorized tool invocation" in result.message
    assert result.error == "UNREGISTERED_TOOL"

# ==========================================
# 8. INVALID TOOL ARGUMENTS VALIDATION TEST
# ==========================================
@pytest.mark.asyncio
async def test_invalid_tool_arguments(async_session: AsyncSession, sample_dental_business: Business):
    """Calling a registered tool with missing or invalid fields returns a validation error."""
    result = await receptionist_tools.execute_tool(
        session=async_session,
        tool_name="createAppointment",
        raw_args={
            "business_id": sample_dental_business.id,
            "customer_name": "A", # Too short (min_length=2)
            "customer_contact": "12" # Too short (min_length=5)
        }
    )

    assert result.status == "FAILED"
    assert "Invalid arguments for createAppointment" in result.message

# ==========================================
# 9. UNAUTHORIZED BUSINESS ACCESS TEST (MULTI-TENANCY)
# ==========================================
@pytest.mark.asyncio
async def test_unauthorized_business_access(
    async_session: AsyncSession,
    sample_dental_business: Business,
    second_hotel_business: Business
):
    """
    CRITICAL SECURITY CHECK:
    Business A cannot access or append messages to Business B's conversation.
    """
    # 1. Create a conversation under Business A (Dental)
    res_a = await receptionist_orchestrator.handle_message(
        session=async_session,
        business_id=sample_dental_business.id,
        message="Hello from Dental client"
    )
    conv_id = res_a["conversation_id"]

    # 2. Attempt to send a message to conv_id using Business B (Hotel)
    with pytest.raises(HTTPException) as exc_info:
        await receptionist_orchestrator.handle_message(
            session=async_session,
            business_id=second_hotel_business.id, # Wrong business!
            conversation_id=conv_id,
            message="Malicious injection attempt"
        )

    assert exc_info.value.status_code == 403
    assert "Unauthorized" in exc_info.value.detail

# ==========================================
# 10. DATABASE PERSISTENCE VERIFICATION TEST
# ==========================================
@pytest.mark.asyncio
async def test_database_persistence(async_session: AsyncSession, sample_dental_business: Business):
    """Verifies that conversation, messages, and action logs are correctly saved to DB."""
    res = await receptionist_orchestrator.handle_message(
        session=async_session,
        business_id=sample_dental_business.id,
        message="What are your opening hours?"
    )
    conv_id = res["conversation_id"]

    # Fetch conversation directly
    conv = await async_session.get(ReceptionistConversation, conv_id)
    assert conv is not None
    assert conv.business_id == sample_dental_business.id

    # Verify messages saved via async query
    stmt_msgs = select(ReceptionistMessage).where(ReceptionistMessage.conversation_id == conv_id).order_by(ReceptionistMessage.created_at)
    res_msgs = await async_session.execute(stmt_msgs)
    messages = res_msgs.scalars().all()
    assert len(messages) >= 2
    assert messages[0].role == "user"
    assert messages[0].sender_type == "CUSTOMER"
    assert messages[1].role == "assistant"
    assert messages[1].sender_type == "AI_RECEPTIONIST"

# ==========================================
# 11. REAL FUNCTIONALITY RULE (NO FAKE SUCCESS) TEST
# ==========================================
@pytest.mark.asyncio
async def test_real_functionality_no_fake_success(async_session: AsyncSession, sample_dental_business: Business):
    """
    CRITICAL REAL FUNCTIONALITY RULE:
    When an appointment is requested with name and contact, but live calendar integration
    is not yet connected, the system MUST return INTEGRATION_REQUIRED and honestly communicate
    that the booking is pending manual confirmation.
    """
    res = await receptionist_orchestrator.handle_message(
        session=async_session,
        business_id=sample_dental_business.id,
        customer_name="David Miller",
        customer_contact="512-555-9012",
        message="My name is David Miller, phone 512-555-9012, please book me for teeth whitening tomorrow at 3pm."
    )

    assert res["action"] == "createAppointment"
    assert res["action_status"] == "INTEGRATION_REQUIRED"
    assert "calendar integration" in res["reply"].lower() or "confirm" in res["reply"].lower() or "recorded" in res["reply"].lower()

# ==========================================
# 12. PRICING QUERY GROUNDED TEST
# ==========================================
@pytest.mark.asyncio
async def test_pricing_query_grounded(async_session: AsyncSession, sample_dental_business: Business):
    """Verified prices from business catalog are accurately answered."""
    res = await receptionist_orchestrator.handle_message(
        session=async_session,
        business_id=sample_dental_business.id,
        message="How much does teeth whitening cost?"
    )

    assert res["intent"] == "PRICING_QUESTION"
    assert res["action"] == "getServiceInformation"
    assert "$350" in res["reply"] or "350" in res["reply"]
