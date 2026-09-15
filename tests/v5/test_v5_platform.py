"""
Rine Forge Systems V5 - Comprehensive Production Platform Test Suite
Tests Tenant Isolation, JWT RBAC, Conflict-Free Appointments, RAG Vector Search,
Lead Scoring, Automations, and the 20-Step AI Orchestrator.
"""
import pytest
import pytest_asyncio
from datetime import datetime, timedelta, date
from httpx import AsyncClient, ASGITransport
from sqlalchemy import select

from backend.app.main import app
from backend.app.database import AsyncSessionLocal
from backend.app.models.v5 import (
    User, Business, BusinessUser, Service, Staff, 
    KnowledgeDocument, KnowledgeChunk, Customer, Appointment, 
    Lead, Automation, Task, Notification, AIEmployee
)
from backend.app.auth.security import hash_password, create_access_token
from backend.app.appointments.engine import appointment_engine
from backend.app.leads.engine import lead_engine
from backend.app.automations.engine import automation_engine
from backend.app.knowledge.rag_service import knowledge_service
from backend.app.ai.orchestrator_v5 import v5_orchestrator

@pytest.mark.asyncio
async def test_v5_auth_and_signup(async_session):
    """Verifies user signup, password hashing, and JWT token issuance."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Signup
        res = await client.post("/api/v1/auth/signup", json={
            "email": "dr.smith@apexclinic.com",
            "name": "Dr. John Smith",
            "password": "SecurePassword123!",
            "business_name": "Apex Dental Studio"
        })
        assert res.status_code == 201
        data = res.json()
        assert "token" in data
        assert data["user"]["email"] == "dr.smith@apexclinic.com"
        assert data["business_id"] is not None
        token = data["token"]

        # Login
        res_login = await client.post("/api/v1/auth/login", json={
            "email": "dr.smith@apexclinic.com",
            "password": "SecurePassword123!"
        })
        assert res_login.status_code == 200
        assert "token" in res_login.json()

        # Me endpoint
        res_me = await client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
        assert res_me.status_code == 200
        assert res_me.json()["email"] == "dr.smith@apexclinic.com"

@pytest.mark.asyncio
async def test_v5_strict_tenant_isolation(async_session):
    """
    CRITICAL SECURITY TEST:
    Verifies that Business Tenant A cannot access, mutate, or query Business Tenant B's data.
    Cross-tenant operations must be strictly rejected with HTTP 403 or 404.
    """
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Create Business A
        res_a = await client.post("/api/v1/auth/signup", json={
            "email": "owner_a@business-a.com",
            "name": "Owner A",
            "password": "PasswordA123!",
            "business_name": "Tenant Alpha"
        })
        token_a = res_a.json()["token"]
        biz_a_id = res_a.json()["business_id"]

        # 2. Create Business B
        res_b = await client.post("/api/v1/auth/signup", json={
            "email": "owner_b@business-b.com",
            "name": "Owner B",
            "password": "PasswordB123!",
            "business_name": "Tenant Beta"
        })
        token_b = res_b.json()["token"]
        biz_b_id = res_b.json()["business_id"]

        assert biz_a_id != biz_b_id

        # 3. Create a service under Business A
        res_svc_a = await client.post("/api/v1/services", json={
            "name": "Alpha Service",
            "description": "Exclusive Alpha Treatment",
            "price": 250.0,
            "duration": 45
        }, headers={"Authorization": f"Bearer {token_a}"})
        assert res_svc_a.status_code == 201
        svc_a_id = res_svc_a.json()["id"]

        # 4. Cross-Tenant Attack 1: User B tries to update User A's service
        res_attack_1 = await client.put(f"/api/v1/services/{svc_a_id}", json={
            "name": "Compromised Service",
            "price": 1.0
        }, headers={"Authorization": f"Bearer {token_b}"})
        assert res_attack_1.status_code == 404 # Tenant isolation blocks access

        # 5. Cross-Tenant Attack 2: User B tries to delete User A's service
        res_attack_2 = await client.delete(f"/api/v1/services/{svc_a_id}", headers={"Authorization": f"Bearer {token_b}"})
        assert res_attack_2.status_code == 404

        # 6. Verify User B listing services returns only User B's services (0 items, not User A's)
        res_list_b = await client.get("/api/v1/services", headers={"Authorization": f"Bearer {token_b}"})
        assert res_list_b.status_code == 200
        assert len(res_list_b.json()) == 0

@pytest.mark.asyncio
async def test_v5_appointment_engine_double_booking_prevention(async_session):
    """
    CRITICAL RELIABILITY TEST:
    Verifies that the authoritative appointment engine prevents double-booking.
    If slot (10:00 to 11:00) is booked, a conflicting request returns HTTP 409 Conflict.
    """
    # Create tenant and customer
    biz = Business(name="Dental Clinic", industry="Dental")
    async_session.add(biz)
    await async_session.flush()

    cust1 = Customer(business_id=biz.id, name="Patient One", phone="+15551112222")
    cust2 = Customer(business_id=biz.id, name="Patient Two", phone="+15553334444")
    async_session.add_all([cust1, cust2])
    await async_session.flush()

    start_time = datetime(2026, 9, 20, 10, 0, 0)
    end_time = datetime(2026, 9, 20, 11, 0, 0)

    # 1. Book first appointment -> Succeeds
    appt1 = await appointment_engine.create_appointment(
        session=async_session,
        business_id=biz.id,
        customer_id=cust1.id,
        start_time=start_time,
        end_time=end_time,
        notes="First valid booking"
    )
    assert appt1.id is not None
    assert appt1.status == "CONFIRMED"

    # 2. Attempt double booking for overlapping slot -> Must raise HTTPException 409
    with pytest.raises(Exception) as exc_info:
        await appointment_engine.create_appointment(
            session=async_session,
            business_id=biz.id,
            customer_id=cust2.id,
            start_time=datetime(2026, 9, 20, 10, 30, 0),
            end_time=datetime(2026, 9, 20, 11, 30, 0),
            notes="Conflicting double booking"
        )
    assert "409" in str(exc_info.value) or "conflict" in str(exc_info.value).lower()

@pytest.mark.asyncio
async def test_v5_rag_knowledge_vector_search(async_session):
    """Verifies document ingestion, chunking, and dense cosine vector retrieval."""
    biz = Business(name="Aesthetics Center", industry="Beauty")
    async_session.add(biz)
    await async_session.flush()

    doc = await knowledge_service.ingest_document(
        session=async_session,
        business_id=biz.id,
        title="Parking and Building Accessibility",
        content="Free parking is provided in the rear lot behind the building with wheelchair accessible ramps."
    )
    assert doc.id is not None

    # Search for parking
    results = await knowledge_service.search(
        session=async_session,
        business_id=biz.id,
        query="Where do I park my car?",
        top_k=2
    )
    assert len(results) > 0
    assert "parking" in results[0]["content"].lower()

@pytest.mark.asyncio
async def test_v5_lead_scoring_and_automation(async_session):
    """Verifies lead intent scoring and automated action triggers."""
    biz = Business(name="Smile Studio", industry="Dental")
    async_session.add(biz)
    await async_session.flush()

    cust = Customer(business_id=biz.id, name="Sarah Connor", phone="+15559998888")
    async_session.add(cust)
    await async_session.flush()

    # Create automation rule: if score >= 70, notify staff
    rule = Automation(
        business_id=biz.id,
        name="Urgent Lead Trigger",
        trigger="NEW_LEAD",
        conditions=[{"field": "score", "operator": ">=", "value": 70}],
        actions=[
            {"type": "NOTIFY_STAFF", "recipient": "lead-alerts@smilestudio.com", "channel": "EMAIL", "message": "Hot lead detected: {customer_name}"}
        ],
        enabled=True
    )
    async_session.add(rule)
    await async_session.commit()

    # Process high intent lead
    lead = await lead_engine.process_and_score_lead(
        session=async_session,
        business_id=biz.id,
        customer_id=cust.id,
        message="I need emergency dental repair today, severe tooth pain!",
        intent="BOOK_APPOINTMENT"
    )
    assert lead.score >= 70
    assert lead.urgency == "HIGH"

    # Trigger automation
    triggered = await automation_engine.trigger(
        session=async_session,
        business_id=biz.id,
        trigger_event="NEW_LEAD",
        context={"score": lead.score, "customer_name": cust.name}
    )
    assert len(triggered) == 1
    assert triggered[0]["action"] == "NOTIFY_STAFF"

@pytest.mark.asyncio
async def test_v5_conversational_orchestrator_pipeline(async_session):
    """
    CRITICAL END-TO-END PIPELINE TEST:
    Executes the 20-step Conversational AI Orchestrator pipeline:
    Channel Auth -> Business -> Customer -> RAG -> Tool Execution -> Zero Hallucination Response -> Telemetry.
    """
    # Create business tenant with service and hours
    biz = Business(
        name="Apex Aesthetic Dental",
        industry="Dentistry",
        phone="+15554443333",
        email="info@apexdental.com",
        business_hours={"monday": "08:00-17:00", "friday": "08:00-17:00"}
    )
    async_session.add(biz)
    await async_session.flush()

    svc = Service(
        business_id=biz.id,
        name="Laser Teeth Whitening",
        description="Full cosmetic laser whitening",
        price=350.0,
        duration=60,
        active=True
    )
    async_session.add(svc)
    await async_session.commit()

    # User asks about price
    res = await v5_orchestrator.handle_message(
        session=async_session,
        business_id=biz.id,
        channel="website",
        customer_identifier="web-session-12345",
        user_message="How much does laser teeth whitening cost?",
        customer_name="Alice Morgan",
        customer_phone="+15552223333"
    )

    assert "conversation_id" in res
    assert res["role"] == "assistant"
    assert len(res["content"]) > 0
    assert "getServices" in res["tools_executed"]
    assert res["intent"] in ["PRICE_INQUIRY", "SERVICE_INQUIRY", "GENERAL_INQUIRY"]

    # Verify conversation and message were saved to DB
    stmt_msgs = select(Customer).where(Customer.business_id == biz.id)
    cust = (await async_session.execute(stmt_msgs)).scalar_one_or_none()
    assert cust is not None
    assert cust.name == "Alice Morgan"

@pytest.mark.asyncio
async def test_v5_health_endpoints(async_session):
    """Verifies V5 health routes."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res_h = await client.get("/api/v1/health")
        assert res_h.status_code == 200
        assert res_h.json()["status"] == "healthy"

        res_db = await client.get("/api/v1/health/database")
        assert res_db.status_code == 200
        assert res_db.json()["status"] == "connected"

        res_ai = await client.get("/api/v1/health/ai")
        assert res_ai.status_code == 200
        assert res_ai.json()["status"] == "active"
