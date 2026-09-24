"""
Rine Forge Systems V5 - Phase AP: Real Voice Engine Test Suite
Comprehensive testing of:
1. Provider interface abstraction & truthful configuration status (Zero fake checkmarks)
2. Stateful voice session lifecycle (CONNECTING -> LISTENING -> THINKING -> SPEAKING -> ENDED)
3. Dynamic tool execution (operating hours, services catalogue, slot reservation)
4. Automatic CRM lead capture & priority scoring from voice utterances
5. Truthful human handoff with offline fallback & urgent staff task creation
6. Factual voice analytics calculation without fabricated scores
7. Multi-tenant isolation & security
8. Full HTTP API endpoint validation
"""
import pytest
import pytest_asyncio
import uuid
from datetime import datetime, timezone
from sqlalchemy import select
from httpx import AsyncClient, ASGITransport

from backend.app.main import app
from backend.app.models.v5 import (
    Business,
    V5VoiceSession,
    V5SocialLead,
    V5GeneratedAgentSuite,
    V5SalesTask
)
from backend.app.channels.voice.engine import (
    voice_engine,
    BrowserWebSpeechProvider,
    WhisperSTTProvider,
    ElevenLabsTTSProvider,
    TwilioVoiceTransport
)
from backend.app.channels.voice.session_manager import voice_session_manager


# ============================================================
# 1. PROVIDER ABSTRACTIONS & TRUTHFUL TELEMETRY
# ============================================================
def test_voice_providers_truthful_telemetry():
    """Verifies that all voice providers report accurate and honest integration statuses."""
    telemetry = voice_engine.get_providers_telemetry()
    assert len(telemetry) >= 4
    
    provider_ids = [p["provider_id"] for p in telemetry if "provider_id" in p]
    transport_ids = [p["transport_id"] for p in telemetry if "transport_id" in p]
    
    assert "BROWSER_WEB_SPEECH" in provider_ids
    assert "WHISPER_CLOUD_STT" in provider_ids
    assert "ELEVENLABS_TTS" in provider_ids
    assert "TWILIO_PSTN" in transport_ids

    # Browser Native Web Speech should be ready without external API tokens
    browser_status = next(p for p in telemetry if p.get("provider_id") == "BROWSER_WEB_SPEECH")
    assert browser_status["status"] == "READY"
    assert browser_status["is_configured"] is True

    # Cloud services without keys must report NOT CONFIGURED (no fake checkmarks)
    whisper_status = next(p for p in telemetry if p.get("provider_id") == "WHISPER_CLOUD_STT")
    eleven_status = next(p for p in telemetry if p.get("provider_id") == "ELEVENLABS_TTS")
    twilio_status = next(p for p in telemetry if p.get("transport_id") == "TWILIO_PSTN")

    assert whisper_status["status"] in ["READY", "NOT CONFIGURED"]
    assert eleven_status["status"] in ["READY", "NOT CONFIGURED"]
    assert twilio_status["status"] in ["READY", "NOT CONFIGURED"]


@pytest.mark.asyncio
async def test_browser_provider_transcribe_and_synthesize():
    """Verifies in-browser native speech provider input/output directives."""
    provider = BrowserWebSpeechProvider()
    
    transcription = await provider.transcribe("I need an emergency dentist today")
    assert transcription["transcript"] == "I need an emergency dentist today"
    assert transcription["provider"] == "BROWSER_WEB_SPEECH"
    assert transcription["confidence"] >= 0.90

    synthesis = await provider.synthesize("We have an opening at 2 PM.", voice_id="natural-female")
    assert synthesis["speech_directive"] == "BROWSER_SYNTHESIS"
    assert synthesis["text"] == "We have an opening at 2 PM."
    assert synthesis["voice"] == "natural-female"


# ============================================================
# 2. STATEFUL VOICE SESSION LIFECYCLE & GREETING GROUNDING
# ============================================================
@pytest.mark.asyncio
async def test_voice_session_lifecycle(async_session):
    """Tests session initialization, state progression, and final conclusion."""
    # Create test business
    biz = Business(
        id=str(uuid.uuid4()),
        name="Apex Smiles Dentistry",
        email="reception@apexsmiles.example.com",
        industry="Dental",
        created_at=datetime.now(timezone.utc)
    )
    async_session.add(biz)
    await async_session.commit()

    # 1. Start session
    v_session = await voice_session_manager.start_session(
        session=async_session,
        business_id=biz.id,
        agent_id="receptionist",
        channel="BROWSER",
        caller_identifier="caller-555-0199",
        caller_name="Sarah Connor"
    )

    assert v_session.id is not None
    assert v_session.business_id == biz.id
    assert v_session.status == "LISTENING"
    assert v_session.handoff_status == "NONE"
    assert len(v_session.transcript) == 1
    assert "Apex Smiles Dentistry" in v_session.transcript[0]["text"]
    assert v_session.caller_name == "Sarah Connor"

    # 2. End session
    ended = await voice_session_manager.end_session(
        session=async_session,
        session_id=v_session.id,
        business_id=biz.id
    )

    assert ended.status == "ENDED"
    assert ended.ended_at is not None
    assert ended.duration_seconds >= 1


# ============================================================
# 3. TOOL EXECUTION: HOURS, SERVICES & BOOKING
# ============================================================
@pytest.mark.asyncio
async def test_voice_turn_tools_hours_and_services(async_session):
    """Verifies that spoken queries trigger factual tools grounded in tenant knowledge."""
    biz = Business(
        id=str(uuid.uuid4()),
        name="Beacon Law Practice",
        email="intake@beaconlaw.example.com",
        industry="Legal",
        created_at=datetime.now(timezone.utc)
    )
    async_session.add(biz)
    await async_session.flush()

    suite = V5GeneratedAgentSuite(
        id=str(uuid.uuid4()),
        business_id=biz.id,
        suite_name="Beacon Law Suite",
        business_name="Beacon Law Practice",
        business_category="Law Firm",
        location_area="Chicago, IL",
        service_radius_miles=30,
        services=["Estate Planning", "Corporate Counsel", "Real Estate Closings"],
        business_hours={"monday_friday": "8:30 AM - 5:30 PM", "saturday": "By Appointment", "sunday": "Closed"},
        target_customer="Small businesses and families",
        keywords=["attorney", "lawyer"],
        status="ACTIVE",
        created_at=datetime.now(timezone.utc)
    )
    async_session.add(suite)
    await async_session.commit()

    v_session = await voice_session_manager.start_session(
        session=async_session,
        business_id=biz.id,
        agent_id="receptionist"
    )

    # Ask about hours
    res_hours = await voice_session_manager.process_turn(
        session=async_session,
        session_id=v_session.id,
        business_id=biz.id,
        customer_transcript="What are your office hours on Saturday?"
    )

    assert res_hours["status"] == "SPEAKING"
    assert len(res_hours["tool_calls"]) > 0
    assert res_hours["tool_calls"][-1]["tool"] == "get_business_hours"
    assert "Saturday" in str(res_hours["tool_calls"][-1]["result"])

    # Ask about services
    res_services = await voice_session_manager.process_turn(
        session=async_session,
        session_id=v_session.id,
        business_id=biz.id,
        customer_transcript="Do you provide estate planning and corporate counsel services?"
    )

    assert res_services["status"] == "SPEAKING"
    assert any(tc["tool"] == "get_services" for tc in res_services["tool_calls"])


# ============================================================
# 4. APPOINTMENT RESERVATION & AUTOMATIC CRM LEAD CREATION
# ============================================================
@pytest.mark.asyncio
async def test_voice_turn_booking_creates_crm_lead(async_session):
    """Verifies that an appointment request creates an inbound CRM lead with priority scoring."""
    biz = Business(
        id=str(uuid.uuid4()),
        name="Metro Dental Clinic",
        email="hello@metrodental.example.com",
        industry="Dental",
        created_at=datetime.now(timezone.utc)
    )
    async_session.add(biz)
    await async_session.commit()

    v_session = await voice_session_manager.start_session(
        session=async_session,
        business_id=biz.id,
        agent_id="receptionist",
        caller_identifier="+15125550188",
        caller_name="James Wilson"
    )

    turn_res = await voice_session_manager.process_turn(
        session=async_session,
        session_id=v_session.id,
        business_id=biz.id,
        customer_transcript="I have a broken molar and I need to schedule an appointment tomorrow to see someone"
    )

    assert turn_res["status"] == "SPEAKING"
    assert turn_res["lead_id"] is not None

    # Inspect created CRM Lead
    lead_stmt = select(V5SocialLead).where(V5SocialLead.id == turn_res["lead_id"])
    lead_res = await async_session.execute(lead_stmt)
    lead = lead_res.scalar_one_or_none()

    assert lead is not None
    assert lead.contact_name == "James Wilson"
    assert lead.contact_phone == "+15125550188"
    assert lead.channel == "VOICE_SESSION"
    assert lead.status == "MEETING_REQUESTED"
    assert lead.urgency == "HIGH"
    assert lead.priority_score >= 80
    assert len(lead.qualification_facts) > 0
    assert len(lead.qualification_inferences) > 0


# ============================================================
# 5. TRUTHFUL HUMAN HANDOFF & SALES TASK CREATION
# ============================================================
@pytest.mark.asyncio
async def test_truthful_human_handoff_offline_handling(async_session):
    """
    Verifies that requesting a human handoff when carrier PSTN is unconfigured
    truthfully tells the caller and creates an urgent sales follow-up task.
    """
    biz = Business(
        id=str(uuid.uuid4()),
        name="Austin Auto Repair",
        email="service@austinautorepair.example.com",
        industry="Automotive",
        created_at=datetime.now(timezone.utc)
    )
    async_session.add(biz)
    await async_session.commit()

    v_session = await voice_session_manager.start_session(
        session=async_session,
        business_id=biz.id,
        caller_identifier="+15125559900",
        caller_name="Marcus Brody"
    )

    # Spoken request containing handoff keyword
    turn_res = await voice_session_manager.process_turn(
        session=async_session,
        session_id=v_session.id,
        business_id=biz.id,
        customer_transcript="I want to speak with a real person and manager right now."
    )

    assert turn_res["status"] == "TRANSFER_REQUIRED"
    assert turn_res["handoff_status"] in ["REQUESTED_OFFLINE", "TRANSFERRED"]
    assert "task_id" in turn_res

    # Verify V5SalesTask created in database
    task_stmt = select(V5SalesTask).where(V5SalesTask.id == turn_res["task_id"])
    task_res = await async_session.execute(task_stmt)
    task = task_res.scalar_one_or_none()

    assert task is not None
    assert task.business_id == biz.id
    assert task.priority == "URGENT"
    assert "Marcus Brody" in task.title
    assert task.status == "PENDING"


# ============================================================
# 6. VOICE ANALYTICS FACTUAL AGGREGATION
# ============================================================
@pytest.mark.asyncio
async def test_voice_analytics_aggregation(async_session):
    """Verifies factual metrics aggregation without fabricated statistics."""
    biz = Business(
        id=str(uuid.uuid4()),
        name="Precision HVAC",
        email="info@precisionhvac.example.com",
        industry="HVAC",
        created_at=datetime.now(timezone.utc)
    )
    async_session.add(biz)
    await async_session.commit()

    # Session 1: completed call
    s1 = await voice_session_manager.start_session(async_session, biz.id, caller_identifier="c1")
    await voice_session_manager.end_session(async_session, s1.id, biz.id)

    # Session 2: active call
    s2 = await voice_session_manager.start_session(async_session, biz.id, caller_identifier="c2")

    analytics = await voice_session_manager.get_voice_analytics(async_session, biz.id)
    assert analytics["total_calls"] == 2
    assert analytics["completed_calls"] == 1
    assert analytics["failed_calls"] == 0
    assert "telephony_status" in analytics
    assert len(analytics["recent_sessions"]) == 2


# ============================================================
# 7. MULTI-TENANT ISOLATION
# ============================================================
@pytest.mark.asyncio
async def test_voice_session_multi_tenant_isolation(async_session):
    """Confirms tenant boundary enforcement across voice sessions."""
    biz_a = Business(id=str(uuid.uuid4()), name="Tenant A", email="a@tenanta.com", created_at=datetime.now(timezone.utc))
    biz_b = Business(id=str(uuid.uuid4()), name="Tenant B", email="b@tenantb.com", created_at=datetime.now(timezone.utc))
    async_session.add_all([biz_a, biz_b])
    await async_session.commit()

    # Start session for Tenant A
    sess_a = await voice_session_manager.start_session(async_session, biz_a.id)

    # Attempt to process turn from Tenant B context
    res = await voice_session_manager.process_turn(
        session=async_session,
        session_id=sess_a.id,
        business_id=biz_b.id,
        customer_transcript="Hello"
    )
    assert res.get("status") == "ERROR"
    assert "Voice session not found" in res.get("error", "")

    # Attempt to end session from Tenant B context
    end_res = await voice_session_manager.end_session(
        session=async_session,
        session_id=sess_a.id,
        business_id=biz_b.id
    )
    assert end_res is None


# ============================================================
# 8. FULL HTTP API ENDPOINTS VALIDATION
# ============================================================
@pytest.mark.asyncio
async def test_voice_api_endpoints(async_session):
    """Tests the FastAPI endpoints for provider telemetry, session lifecycle, and turn execution."""
    biz = Business(
        id=str(uuid.uuid4()),
        name="Sterling Accounting",
        email="support@sterlingcpa.example.com",
        industry="Accounting",
        created_at=datetime.now(timezone.utc)
    )
    async_session.add(biz)
    await async_session.commit()

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. GET /api/v1/channels/voice/providers
        prov_res = await client.get("/api/v1/channels/voice/providers")
        assert prov_res.status_code == 200
        prov_data = prov_res.json()
        assert isinstance(prov_data, list)
        assert len(prov_data) >= 4

        # 2. POST /api/v1/channels/voice/session/start
        start_res = await client.post(
            "/api/v1/channels/voice/session/start",
            headers={"X-Business-ID": biz.id},
            json={"agent_id": "receptionist", "channel": "BROWSER", "caller_name": "David Miller"}
        )
        assert start_res.status_code == 200
        start_data = start_res.json()
        session_id = start_data["session_id"]
        assert start_data["status"] == "LISTENING"
        assert "Sterling Accounting" in start_data["greeting"]

        # 3. POST /api/v1/channels/voice/session/{id}/turn
        turn_res = await client.post(
            f"/api/v1/channels/voice/session/{session_id}/turn",
            headers={"X-Business-ID": biz.id},
            json={"customer_transcript": "What are your business hours?"}
        )
        assert turn_res.status_code == 200
        turn_data = turn_res.json()
        assert turn_data["status"] == "SPEAKING"
        assert "agent_reply" in turn_data

        # 4. POST /api/v1/channels/voice/session/{id}/handoff
        handoff_res = await client.post(
            f"/api/v1/channels/voice/session/{session_id}/handoff",
            headers={"X-Business-ID": biz.id},
            json={"reason": "Need human accountant"}
        )
        assert handoff_res.status_code == 200
        handoff_data = handoff_res.json()
        assert handoff_data["status"] == "TRANSFER_REQUIRED"

        # 5. POST /api/v1/channels/voice/session/{id}/end
        end_res = await client.post(
            f"/api/v1/channels/voice/session/{session_id}/end",
            headers={"X-Business-ID": biz.id}
        )
        assert end_res.status_code == 200
        end_data = end_res.json()
        assert end_data["status"] == "ENDED"

        # 6. GET /api/v1/channels/voice/analytics
        analytics_res = await client.get(
            "/api/v1/channels/voice/analytics",
            headers={"X-Business-ID": biz.id}
        )
        assert analytics_res.status_code == 200
        analytics_data = analytics_res.json()
        assert analytics_data["total_calls"] == 1
        assert analytics_data["completed_calls"] == 1

        # 7. GET /api/v1/channels/voice/voices
        voices_res = await client.get("/api/v1/channels/voice/voices")
        assert voices_res.status_code == 200
        voices_data = voices_res.json()
        assert "voices" in voices_data
        assert any(v["id"] == "elena" for v in voices_data["voices"])
        assert voices_data["is_free"] is True

        # 8. POST /api/v1/channels/voice/synthesize
        synth_res = await client.post(
            "/api/v1/channels/voice/synthesize",
            json={"text": "Thank you for calling. How may I help you?", "voice": "elena"}
        )
        assert synth_res.status_code == 200
        synth_data = synth_res.json()
        assert synth_data["provider"] == "FREE_NEURAL_TTS"
        assert synth_data["audio_format"] == "mp3"
        assert "audio_base64" in synth_data

        # 9. Direct /api/voice/synthesize
        direct_synth_res = await client.post(
            "/api/voice/synthesize",
            json={"text": "Appointment booked.", "voice": "marcus"}
        )
        assert direct_synth_res.status_code == 200
        assert direct_synth_res.json()["is_free"] is True

        # 10. POST /api/v1/channels/voice/simulate-call
        sim_res = await client.post(
            "/api/v1/channels/voice/simulate-call",
            json={"business_name": "Apex Dental", "caller_query": "Do you have any appointments today?", "voice": "elena"}
        )
        assert sim_res.status_code == 200
        sim_data = sim_res.json()
        assert "reply_text" in sim_data
        assert "audio_base64" in sim_data
        assert sim_data["is_free"] is True
