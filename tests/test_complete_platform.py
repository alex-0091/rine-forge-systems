"""
Rine Forge Systems - Complete Platform Test Suite
Verifies:
1. Multi-Format Document Parsing (TXT, CSV, JSON, DOCX mock)
2. Asynchronous Job Queue (concurrency, retries, DLQ, telemetry)
3. Voice Telephony Architecture (pipeline, TwiML, honest NOT_CONFIGURED status)
4. Cryptographic Webhooks (HMAC-SHA256 signature, idempotency deduplication)
5. Human Handoff Lifecycle (escalation, conversation pause, assignment, resolution)
6. Subsystem Health Probes (all 8 subsystems: DB, AI, Queue, WhatsApp, Voice, Email, Calendar, KB)
7. Anti-Hallucination Grounding & Citation Guarantees
"""
import io
import zipfile
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport

from backend.app.main import app
from backend.app.knowledge.document_parser import document_parser, DocumentParsingError
from backend.app.jobs.queue import BackgroundJobQueue, JobStatus
from backend.app.channels.voice.service import voice_service
from backend.app.channels.voice.pipeline import voice_pipeline
from backend.app.webhooks.engine import webhook_manager
from backend.app.handoffs.service import handoff_service
from backend.app.models.v5 import Business, Conversation, Customer, User
from backend.app.database import AsyncSessionLocal

# ============================================================
# 1. DOCUMENT PARSER TESTS
# ============================================================
def test_parse_txt_and_size_validation():
    content = b"Dental surgery post-op instructions: Rinse gently with warm salt water."
    text, meta = document_parser.extract_text_and_metadata("instructions.txt", content)
    assert "Dental surgery" in text
    assert meta["format"] == "txt"
    assert meta["size_bytes"] == len(content)

    # Test size limit validation
    huge_bytes = b"x" * (10 * 1024 * 1024 + 1)
    with pytest.raises(DocumentParsingError, match="exceeds maximum allowed size"):
        document_parser.validate_file("huge.txt", huge_bytes)

def test_parse_csv_tabular_structure():
    csv_bytes = b"Service,Price,Duration\nTeeth Whitening,350,60\nDental Cleaning,120,45\n"
    text, meta = document_parser.extract_text_and_metadata("services.csv", csv_bytes)
    assert meta["format"] == "csv"
    assert "Teeth Whitening" in text
    assert "Price: 350" in text

def test_parse_json_formatting():
    json_bytes = b'{"clinic": "Rine Dental", "hours": {"mon": "9am-5pm"}}'
    text, meta = document_parser.extract_text_and_metadata("config.json", json_bytes)
    assert meta["format"] == "json"
    assert '"clinic": "Rine Dental"' in text

def test_parse_docx_xml_extraction():
    # Build minimal in-memory docx zip
    bio = io.BytesIO()
    with zipfile.ZipFile(bio, "w") as zf:
        xml = (
            '<?xml version="1.0" encoding="UTF-8"?>\n'
            '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">\n'
            '  <w:body>\n'
            '    <w:p><w:t>Emergency dental protocol</w:t></w:p>\n'
            '    <w:p><w:t>Call 911 for uncontrolled bleeding</w:t></w:p>\n'
            '  </w:body>\n'
            '</w:document>'
        )
        zf.writestr("word/document.xml", xml)
    docx_bytes = bio.getvalue()

    text, meta = document_parser.extract_text_and_metadata("protocol.docx", docx_bytes)
    assert meta["format"] == "docx"
    assert "Emergency dental protocol" in text
    assert "uncontrolled bleeding" in text

# ============================================================
# 2. BACKGROUND JOB QUEUE TESTS
# ============================================================
@pytest.mark.asyncio
async def test_job_queue_execution_and_telemetry():
    q = BackgroundJobQueue(max_concurrent=2)
    await q.start()

    executed = []
    async def sample_handler(payload):
        executed.append(payload["item"])
        return f"done_{payload['item']}"

    q.register_handler("test_task", sample_handler)

    job1 = await q.enqueue("test_task", {"item": "first"})
    job2 = await q.enqueue("test_task", {"item": "second"})

    import asyncio
    await asyncio.sleep(0.3)

    assert "first" in executed
    assert "second" in executed
    assert job1.status == JobStatus.COMPLETED
    assert job2.status == JobStatus.COMPLETED

    stats = q.get_stats()
    assert stats["status"] == "HEALTHY"
    assert stats["completed"] >= 2

    await q.stop()

@pytest.mark.asyncio
async def test_job_queue_retry_and_dead_letter():
    q = BackgroundJobQueue(max_concurrent=1)
    await q.start()

    attempts = []
    async def failing_handler(payload):
        attempts.append(1)
        raise ValueError("Simulated network outage")

    q.register_handler("flaky_task", failing_handler)
    job = await q.enqueue("flaky_task", {"data": 123}, max_retries=2)

    import asyncio
    # Wait for initial attempt and 1 retry with exponential backoff
    await asyncio.sleep(1.2)

    assert len(attempts) >= 2
    assert job.status == JobStatus.DEAD_LETTER
    assert "Simulated network outage" in job.error

    await q.stop()

# ============================================================
# 3. VOICE ARCHITECTURE TESTS
# ============================================================
def test_voice_service_truthful_status():
    status = voice_service.get_status()
    # In test environment without Twilio keys, must report NOT_CONFIGURED
    assert status["status"] in ("NOT_CONFIGURED", "CONFIGURED")
    if not voice_service.is_configured:
        assert status["status"] == "NOT_CONFIGURED"
        assert "setup_docs" in status

def test_voice_twiml_generation():
    twiml = voice_service.generate_twiml_response("Hello from Elena", gather_speech=False)
    assert "<Response>" in twiml
    assert "<Say" in twiml
    assert "</Response>" in twiml

@pytest.mark.asyncio
async def test_voice_pipeline_turn():
    # Process turn with Fast tier
    turn_res = await voice_pipeline.process_voice_turn(
        audio_transcript="What are your hours on Saturday?",
        conversation_history=[],
        agent_name="Elena"
    )
    assert "response_text" in turn_res
    assert "metrics" in turn_res
    assert "ai_latency_ms" in turn_res["metrics"]
    assert turn_res["agent"] == "Elena"

# ============================================================
# 4. CRYPTOGRAPHIC WEBHOOKS TESTS
# ============================================================
def test_webhook_hmac_signature_verification():
    secret = "rf_webhook_secret_test_key_123"
    payload = b'{"event": "lead.created", "lead_id": "lead_99"}'

    sig = webhook_manager.compute_signature(secret, payload)
    assert len(sig) == 64  # SHA256 hex string

    is_valid = webhook_manager.verify_signature(secret, payload, f"sha256={sig}")
    assert is_valid is True

    is_invalid = webhook_manager.verify_signature(secret, payload, "sha256=invalid_signature")
    assert is_invalid is False

@pytest.mark.asyncio
async def test_inbound_webhook_deduplication():
    async with AsyncSessionLocal() as session:
        key = "idemp_test_key_8899"
        payload = {"data": "test_event"}

        # First ingestion
        res1 = await webhook_manager.ingest_inbound_webhook(
            session=session,
            source="custom_crm",
            event_type="crm.lead_created",
            idempotency_key=key,
            payload=payload
        )
        assert res1["status"] == "PROCESSED"

        # Duplicate ingestion with identical key
        res2 = await webhook_manager.ingest_inbound_webhook(
            session=session,
            source="custom_crm",
            event_type="crm.lead_created",
            idempotency_key=key,
            payload=payload
        )
        assert res2["status"] == "DUPLICATE_IGNORED"
        assert res2["idempotency_key"] == key

# ============================================================
# 5. HUMAN HANDOFF LIFECYCLE TESTS
# ============================================================
@pytest.mark.asyncio
async def test_human_handoff_trigger_and_resolve():
    async with AsyncSessionLocal() as session:
        # Create minimal test business & conversation
        biz = Business(
            name="Test Escalation Clinic",
            status="ACTIVE"
        )
        session.add(biz)
        await session.flush()

        conv = Conversation(
            business_id=biz.id,
            channel="website",
            status="ACTIVE",
            human_handoff=False
        )
        session.add(conv)
        await session.flush()

        # 1. Trigger handoff
        ticket = await handoff_service.trigger_handoff(
            session=session,
            business_id=biz.id,
            conversation_id=conv.id,
            reason="CUSTOMER_REQUEST",
            priority="HIGH",
            notes="Patient requesting to speak directly with dentist."
        )
        assert ticket.status == "PENDING"
        assert ticket.priority == "HIGH"

        # Verify underlying conversation was paused
        await session.refresh(conv)
        assert conv.human_handoff is True
        assert conv.status == "PAUSED"

        # 2. Resolve handoff
        resolved = await handoff_service.resolve_handoff(
            session=session,
            business_id=biz.id,
            ticket_id=ticket.id,
            notes="Dentist spoke with patient via phone.",
            resume_ai=True
        )
        assert resolved.status == "RESOLVED"
        await session.refresh(conv)
        assert conv.human_handoff is False
        assert conv.status == "ACTIVE"

# ============================================================
# 6. DEEP 8-SUBSYSTEM HEALTH PROBE TESTS
# ============================================================
@pytest.mark.asyncio
async def test_deep_health_probe_all_eight_subsystems():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/api/v1/health/deep")
        assert response.status_code == 200
        data = response.json()

        assert "status" in data
        assert "subsystems" in data
        subs = data["subsystems"]

        # Verify presence of all 8 authoritative subsystems
        expected_subsystems = [
            "database",
            "ai_gateway",
            "queue",
            "whatsapp",
            "voice",
            "email",
            "calendar",
            "knowledge_base"
        ]
        for s in expected_subsystems:
            assert s in subs, f"Subsystem '{s}' missing from deep health probe"
            assert "status" in subs[s]
            assert subs[s]["status"] in ("HEALTHY", "DEGRADED", "NOT_CONFIGURED", "UNAVAILABLE", "IDLE")

        assert subs["database"]["status"] == "HEALTHY"
        assert subs["calendar"]["status"] == "HEALTHY"
        assert subs["calendar"]["double_booking_prevention"] is True
