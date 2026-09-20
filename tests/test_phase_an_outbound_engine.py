"""
Rine Forge Systems V5 - Phase AN: Compliant B2B Outbound Lead Engine Test Suite
Tests:
1. Ideal Customer Profile (ICP) Lifecycle & Discovery Trigger
2. Data Quality Engine (Syntax, Disposable Domain Rejection, Status, Facts vs Inferences)
3. Multi-Channel Pitch Generator (Email, WhatsApp, SMS, Opt-out compliance, Length)
4. 11-Step Pre-Flight Outreach Compliance Gate (Opt-Out, Suppression, Human Approval, Cooldown, Limits)
5. Campaign Safety Engine (Safety Pause & Resume)
6. Safe CSV Import & Export (Syntax, In-File Dedup, DB Dedup, Multi-Tenant Isolation)
7. Internal AI Sales Assistant (Grounded CRM Queries, 'No data yet.' Empty State)
"""
import pytest
import pytest_asyncio
import uuid
import csv
import io
from datetime import datetime, timezone, timedelta
from sqlalchemy import select

from backend.app.models.v5 import (
    Business, V5Prospect, V5ProspectObservation, V5ProspectOpportunity,
    V5ProspectOutreach, V5OutreachEvent, V5SuppressionEntry
)
from backend.app.models.lead_engine import (
    V5IdealCustomerProfile, V5OutreachApproval, V5SalesTask
)
from backend.app.discovery.icp_service import icp_service
from backend.app.discovery.quality_engine import data_quality_engine
from backend.app.outreach.pitch_generator import pitch_generator
from backend.app.compliance.outreach_compliance import outreach_compliance_layer
from backend.app.campaigns.engine_v5 import campaign_engine_v5
from backend.app.discovery.csv_import_export import csv_service
from backend.app.sales.assistant import SalesAssistantService
from backend.app.compliance.suppression_service import suppression_service


# ============================================================
# 1. IDEAL CUSTOMER PROFILE (ICP) LIFECYCLE TESTS
# ============================================================
@pytest.mark.asyncio
async def test_icp_lifecycle_and_tenant_isolation(async_session):
    """Verifies ICP creation, read, update, delete, and strict tenant isolation."""
    biz_a_id = str(uuid.uuid4())
    biz_b_id = str(uuid.uuid4())
    async_session.add(Business(id=biz_a_id, name="Tenant A", industry="Dental"))
    async_session.add(Business(id=biz_b_id, name="Tenant B", industry="Legal"))
    await async_session.commit()

    # Create ICP for Tenant A
    icp_a = await icp_service.create_icp(
        session=async_session,
        business_id=biz_a_id,
        name="Texas Dental Clinics",
        industry="Dental",
        company_size="5-20",
        country="USA",
        city_region="Austin, TX",
        services=["Teeth Whitening", "Invisalign"],
        target_roles=["Practice Owner", "Office Manager"]
    )
    assert icp_a.id is not None
    assert icp_a.name == "Texas Dental Clinics"
    assert icp_a.business_id == biz_a_id
    assert icp_a.is_active is True

    # Tenant A can list its ICP
    icps_a = await icp_service.list_icps(async_session, biz_a_id)
    assert len(icps_a) == 1
    assert icps_a[0].id == icp_a.id

    # Tenant B lists ICPs -> Empty (strict isolation)
    icps_b = await icp_service.list_icps(async_session, biz_b_id)
    assert len(icps_b) == 0

    # Tenant B cannot access Tenant A's ICP
    with pytest.raises(Exception):
        await icp_service.get_icp(async_session, biz_b_id, icp_a.id)

    # Update ICP
    updated = await icp_service.update_icp(
        async_session, biz_a_id, icp_a.id,
        {"company_size": "10-50", "city_region": "Dallas, TX"}
    )
    assert updated.company_size == "10-50"
    assert updated.city_region == "Dallas, TX"

    # Delete ICP
    deleted = await icp_service.delete_icp(async_session, biz_a_id, icp_a.id)
    assert deleted is True
    icps_after = await icp_service.list_icps(async_session, biz_a_id)
    assert len(icps_after) == 0


@pytest.mark.asyncio
async def test_icp_discovery_run_trigger(async_session):
    """Verifies that running discovery from an ICP triggers the 13-stage discovery pipeline."""
    biz_id = str(uuid.uuid4())
    async_session.add(Business(id=biz_id, name="Austin Smiles", industry="Dental"))
    await async_session.commit()

    icp = await icp_service.create_icp(
        session=async_session,
        business_id=biz_id,
        name="Austin Family Dental",
        industry="Dental",
        city_region="Austin, TX",
        services=["Cosmetic Dentistry"]
    )

    result = await icp_service.run_discovery_from_icp(
        session=async_session,
        business_id=biz_id,
        icp_id=icp.id,
        max_results=3,
        auto_draft_outreach=True
    )

    assert result["status"] == "COMPLETED"
    assert result["discovered_count"] > 0
    assert "search_id" in result


# ============================================================
# 2. DATA QUALITY ENGINE TESTS
# ============================================================
def test_data_quality_email_validation():
    """Verifies email syntax validation and disposable domain rejection."""
    # Valid emails
    valid, _ = data_quality_engine.validate_email("dr.smith@austinsmile.com")
    assert valid is True
    valid, _ = data_quality_engine.validate_email("contact@practice-health.org")
    assert valid is True

    # Invalid syntax
    valid, msg = data_quality_engine.validate_email("invalid-email")
    assert valid is False
    assert "Invalid email format" in msg

    valid, msg = data_quality_engine.validate_email(None)
    assert valid is False
    assert "missing" in msg.lower()

    # Disposable / temporary domains strictly rejected
    disposable_emails = [
        "scammer@mailinator.com",
        "bot@trashmail.com",
        "throwaway@10minutemail.com",
        "fake@guerrillamail.com"
    ]
    for bad_email in disposable_emails:
        valid, msg = data_quality_engine.validate_email(bad_email)
        assert valid is False
        assert "Disposable or temporary domain rejected" in msg


def test_data_quality_phone_validation():
    """Verifies phone number format and length validation."""
    valid, _ = data_quality_engine.validate_phone("512-555-0199")
    assert valid is True
    valid, _ = data_quality_engine.validate_phone("+1 (512) 555-0199")
    assert valid is True

    # Short / invalid phone
    valid, msg = data_quality_engine.validate_phone("12345")
    assert valid is False
    assert "Invalid phone length" in msg

    valid, msg = data_quality_engine.validate_phone(None)
    assert valid is False
    assert "missing" in msg.lower()


def test_data_quality_status_assignment():
    """Verifies authoritative status assignment (VERIFIED, PARTIALLY_VERIFIED, UNVERIFIED, INVALID, OPTED_OUT)."""
    # 1. OPTED_OUT status takes absolute precedence
    status, _ = data_quality_engine.evaluate_quality_status(
        company_name="Lone Star Dental",
        website="https://lonestardental.com",
        email="info@lonestardental.com",
        phone="512-555-0100",
        opt_out_status="GLOBAL_OPT_OUT"
    )
    assert status == "OPTED_OUT"

    # 2. VERIFIED: company name + website + valid contact channel
    status, _ = data_quality_engine.evaluate_quality_status(
        company_name="Lone Star Dental",
        website="https://lonestardental.com",
        email="info@lonestardental.com",
        phone="512-555-0100"
    )
    assert status == "VERIFIED"

    # 3. PARTIALLY_VERIFIED: website only or contact only
    status, _ = data_quality_engine.evaluate_quality_status(
        company_name="Lone Star Dental",
        website="https://lonestardental.com",
        email=None,
        phone=None
    )
    assert status == "PARTIALLY_VERIFIED"

    # 4. UNVERIFIED: company name only
    status, _ = data_quality_engine.evaluate_quality_status(
        company_name="Lone Star Dental",
        website=None,
        email=None,
        phone=None
    )
    assert status == "UNVERIFIED"

    # 5. INVALID: empty or malformed company name
    status, _ = data_quality_engine.evaluate_quality_status(
        company_name="X",
        website="https://lonestardental.com",
        email="info@lonestardental.com",
        phone="512-555-0100"
    )
    assert status == "INVALID"


def test_data_quality_strict_fact_inference_separation():
    """Verifies that verifiable public facts are strictly partitioned from AI inferences."""
    result = data_quality_engine.structure_facts_and_inferences(
        company_name="Capital Dental Care",
        website="https://capitaldental.com",
        industry="Dental Clinics",
        location="Austin, TX",
        observations=["Online contact form quotes 24-48 hour response time"],
        opportunities=[{
            "type": "SPEED_TO_LEAD",
            "reason": "Eliminates 24-48h form turnaround with instant patient triage",
            "evidence": "Observed on contact page",
            "confidence": 0.92
        }]
    )

    facts = result["factual_signals"]
    inferences = result["inferred_qualifications"]

    assert any("Capital Dental Care" in f for f in facts)
    assert any("24-48 hour response time" in f for f in facts)

    assert len(inferences) == 1
    inf = inferences[0]
    assert inf["category"] == "SPEED_TO_LEAD"
    assert "disclaimer" in inf
    assert "not a guaranteed outcome" in inf["disclaimer"]


# ============================================================
# 3. MULTI-CHANNEL PITCH GENERATOR TESTS
# ============================================================
def test_pitch_generator_email():
    """Verifies email pitch generation with clear evidence citation and opt-out instructions."""
    prospect = {
        "company_name": "Austin Modern Dental",
        "contact_name": "Dr. Miller",
        "opportunities": [{
            "reason": "contact form displays a 24-48 hour response time delay",
            "evidence": "24-48 hours on contact page"
        }]
    }

    pitch = pitch_generator.generate_email_pitch(prospect)
    assert pitch["channel"] == "EMAIL"
    assert "Austin Modern Dental" in pitch["subject"]
    assert "24-48 hour response time delay" in pitch["body_text"]
    # Opt-out instructions present
    assert "STOP" in pitch["body_text"]
    assert "optout@rineforge.com" in pitch["body_text"]
    # No false urgency or guaranteed ROI claims
    assert "guaranteed" not in pitch["body_text"].lower()
    assert "100% free" not in pitch["body_text"].lower()


def test_pitch_generator_whatsapp():
    """Verifies conversational WhatsApp message with opt-out footer."""
    prospect = {
        "company_name": "Smile Pros Austin",
        "contact_name": "Dr. Sarah",
        "opportunities": [{
            "reason": "no after-hours live receptionist channel",
            "evidence": "Contact page Mon-Fri 9-5"
        }]
    }

    pitch = pitch_generator.generate_whatsapp_pitch(prospect)
    assert pitch["channel"] == "WHATSAPP"
    assert "Smile Pros Austin" in pitch["body_text"]
    assert "Reply STOP to opt out" in pitch["body_text"]


def test_pitch_generator_sms_length_constraint():
    """Verifies SMS pitch is strictly under 160 characters and includes opt-out."""
    prospect = {
        "company_name": "Apex Dental Implants and Family Practice Center",
        "contact_name": "Manager"
    }

    pitch = pitch_generator.generate_sms_pitch(prospect)
    assert pitch["channel"] == "SMS"
    assert len(pitch["body_text"]) <= 160
    assert "STOP" in pitch["body_text"]


# ============================================================
# 4. 11-STEP PRE-FLIGHT OUTREACH COMPLIANCE GATE TESTS
# ============================================================
@pytest.mark.asyncio
async def test_compliance_preflight_all_gates_pass(async_session):
    """Verifies a fully compliant message passes all 11 gates."""
    biz_id = str(uuid.uuid4())
    async_session.add(Business(id=biz_id, name="Compliant Clinic", industry="Dental"))
    
    prospect = V5Prospect(
        id=str(uuid.uuid4()),
        business_id=biz_id,
        company_name="Compliant Dental",
        email="reception@compliantdental.com",
        source="PUBLIC_BUSINESS_DATA",
        contact_status="UNCONTACTED",
        opt_out_status="NOT_OPTED_OUT",
        score=75
    )
    async_session.add(prospect)
    
    outreach = V5ProspectOutreach(
        id=str(uuid.uuid4()),
        business_id=biz_id,
        prospect_id=prospect.id,
        channel="EMAIL",
        subject="Workflow inquiry for Compliant Dental",
        message="Hi team, observed your scheduling flow. Would love to discuss Elena AI.",
        status="APPROVED",
        approved_by="operator-1"
    )
    async_session.add(outreach)
    await async_session.commit()

    result = await outreach_compliance_layer.evaluate_preflight(
        session=async_session,
        business_id=biz_id,
        prospect=prospect,
        outreach=outreach,
        channel="EMAIL",
        skip_provider_credential_check=True
    )
    assert result.passed is True, f"Preflight failed at Gate {result.failed_gate}: {result.reason}"
    assert result.failed_gate is None
    assert "recipient" in result.details


@pytest.mark.asyncio
async def test_compliance_gate_10_missing_credentials_blocks_send(async_session):
    """Verifies Gate 10 blocks live send when SMTP credentials are not configured."""
    biz_id = str(uuid.uuid4())
    async_session.add(Business(id=biz_id, name="Cred Clinic", industry="Dental"))

    prospect = V5Prospect(
        id=str(uuid.uuid4()),
        business_id=biz_id,
        company_name="Valid Dental",
        email="reception@validdental.com",
        source="PUBLIC_BUSINESS_DATA",
        contact_status="UNCONTACTED",
        opt_out_status="NOT_OPTED_OUT",
        score=75
    )
    async_session.add(prospect)

    outreach = V5ProspectOutreach(
        id=str(uuid.uuid4()),
        business_id=biz_id,
        prospect_id=prospect.id,
        channel="EMAIL",
        subject="Workflow inquiry",
        message="Hi team, observed your scheduling flow.",
        status="APPROVED",
        approved_by="operator-1"
    )
    async_session.add(outreach)
    await async_session.commit()

    result = await outreach_compliance_layer.evaluate_preflight(
        session=async_session,
        business_id=biz_id,
        prospect=prospect,
        outreach=outreach,
        channel="EMAIL",
        skip_provider_credential_check=False
    )
    # Since SMTP_PASSWORD is not set and DRY_RUN is False in .env, Gate 10 must block
    assert result.passed is False
    assert result.failed_gate == 10
    assert "credentials missing" in result.reason.lower()


@pytest.mark.asyncio
async def test_compliance_gate_4_opt_out_blocks_send(async_session):
    """
    CRITICAL INVARIANT:
    Opted-out lead requesting send must be immediately and irreversibly BLOCKED at Gate 4.
    """
    biz_id = str(uuid.uuid4())
    async_session.add(Business(id=biz_id, name="Safety Clinic", industry="Dental"))

    prospect = V5Prospect(
        id=str(uuid.uuid4()),
        business_id=biz_id,
        company_name="Opted Out Dental",
        email="optout@opteddental.com",
        source="PUBLIC_BUSINESS_DATA",
        contact_status="UNCONTACTED",
        opt_out_status="GLOBAL_OPT_OUT", # Opted out!
        score=75
    )
    async_session.add(prospect)

    outreach = V5ProspectOutreach(
        id=str(uuid.uuid4()),
        business_id=biz_id,
        prospect_id=prospect.id,
        channel="EMAIL",
        subject="Should be blocked",
        message="Hello team, checking in.",
        status="APPROVED",
        approved_by="operator-1"
    )
    async_session.add(outreach)
    await async_session.commit()

    result = await outreach_compliance_layer.evaluate_preflight(
        session=async_session,
        business_id=biz_id,
        prospect=prospect,
        outreach=outreach,
        channel="EMAIL"
    )
    assert result.passed is False
    assert result.failed_gate == 4
    assert "opted out" in result.reason.lower()


@pytest.mark.asyncio
async def test_compliance_gate_4_suppressed_email_blocks_send(async_session):
    """Verifies that an email on the tenant suppression list is BLOCKED at Gate 4."""
    biz_id = str(uuid.uuid4())
    async_session.add(Business(id=biz_id, name="Suppression Test", industry="Dental"))

    suppressed_email = "blocked@practice.com"
    await suppression_service.add_to_suppression(
        async_session, biz_id, "EMAIL", suppressed_email, reason="UNSUBSCRIBE"
    )

    prospect = V5Prospect(
        id=str(uuid.uuid4()),
        business_id=biz_id,
        company_name="Practice LLC",
        email=suppressed_email,
        source="PUBLIC_BUSINESS_DATA",
        contact_status="UNCONTACTED",
        opt_out_status="NOT_OPTED_OUT"
    )
    async_session.add(prospect)

    outreach = V5ProspectOutreach(
        id=str(uuid.uuid4()),
        business_id=biz_id,
        prospect_id=prospect.id,
        channel="EMAIL",
        subject="Test inquiry",
        message="Hi team, quick inquiry.",
        status="APPROVED",
        approved_by="operator-1"
    )
    async_session.add(outreach)
    await async_session.commit()

    result = await outreach_compliance_layer.evaluate_preflight(
        session=async_session,
        business_id=biz_id,
        prospect=prospect,
        outreach=outreach,
        channel="EMAIL"
    )
    assert result.passed is False
    assert result.failed_gate == 4
    assert "suppressed" in result.reason.lower()


@pytest.mark.asyncio
async def test_compliance_gate_9_human_approval_required(async_session):
    """Verifies that unapproved drafts are strictly BLOCKED at Gate 9."""
    biz_id = str(uuid.uuid4())
    async_session.add(Business(id=biz_id, name="Approval Test Clinic", industry="Dental"))

    prospect = V5Prospect(
        id=str(uuid.uuid4()),
        business_id=biz_id,
        company_name="Unreviewed Dental",
        email="info@unrevieweddental.com",
        source="PUBLIC_BUSINESS_DATA",
        contact_status="UNCONTACTED",
        opt_out_status="NOT_OPTED_OUT"
    )
    async_session.add(prospect)

    outreach = V5ProspectOutreach(
        id=str(uuid.uuid4()),
        business_id=biz_id,
        prospect_id=prospect.id,
        channel="EMAIL",
        subject="Draft inquiry",
        message="Unapproved message awaiting operator review.",
        status="PENDING_REVIEW" # Not approved!
    )
    async_session.add(outreach)
    await async_session.commit()

    result = await outreach_compliance_layer.evaluate_preflight(
        session=async_session,
        business_id=biz_id,
        prospect=prospect,
        outreach=outreach,
        channel="EMAIL"
    )
    assert result.passed is False
    assert result.failed_gate == 9
    assert "requires human approval" in result.reason.lower()


@pytest.mark.asyncio
async def test_compliance_gate_7_cooldown_enforced(async_session):
    """Verifies that contacting a prospect during active 72h cooldown is BLOCKED at Gate 7."""
    biz_id = str(uuid.uuid4())
    async_session.add(Business(id=biz_id, name="Cooldown Test Clinic", industry="Dental"))

    prospect = V5Prospect(
        id=str(uuid.uuid4()),
        business_id=biz_id,
        company_name="Recently Contacted Dental",
        email="info@recentdental.com",
        source="PUBLIC_BUSINESS_DATA",
        contact_status="IN_PROGRESS",
        opt_out_status="NOT_OPTED_OUT",
        last_contacted=datetime.now(timezone.utc) - timedelta(hours=12) # Contacted 12 hours ago
    )
    async_session.add(prospect)

    outreach = V5ProspectOutreach(
        id=str(uuid.uuid4()),
        business_id=biz_id,
        prospect_id=prospect.id,
        channel="EMAIL",
        subject="Too Soon",
        message="Follow up message sent too soon.",
        status="APPROVED",
        approved_by="operator-1"
    )
    async_session.add(outreach)
    await async_session.commit()

    result = await outreach_compliance_layer.evaluate_preflight(
        session=async_session,
        business_id=biz_id,
        prospect=prospect,
        outreach=outreach,
        channel="EMAIL",
        cooldown_days=3
    )
    assert result.passed is False
    assert result.failed_gate == 7
    assert "cooldown active" in result.reason.lower()


# ============================================================
# 5. CAMPAIGN SAFETY ENGINE TESTS
# ============================================================
@pytest.mark.asyncio
async def test_campaign_safety_pause_and_resume(async_session):
    """Verifies campaign pause on provider limitation and manual resume."""
    biz_id = str(uuid.uuid4())
    async_session.add(Business(id=biz_id, name="Campaign Clinic", industry="Dental"))
    await async_session.commit()

    campaign = await campaign_engine_v5.create_campaign(
        session=async_session,
        name="Austin Dental Q3 Outreach",
        target_industry="Dental",
        daily_send_limit=25
    )
    # Activate campaign
    campaign.status = "ACTIVE"
    await async_session.commit()

    # Trigger safety pause
    paused = await campaign_engine_v5.pause_campaign(
        session=async_session,
        campaign_id=campaign.id,
        reason="Rate limit threshold reached on SMTP"
    )
    assert paused.status == "PAUSED"

    # Resume campaign
    resumed = await campaign_engine_v5.resume_campaign(
        session=async_session,
        campaign_id=campaign.id
    )
    assert resumed.status == "ACTIVE"


# ============================================================
# 6. SAFE CSV IMPORT & EXPORT TESTS
# ============================================================
def test_csv_import_preview_validation():
    """Verifies CSV import preview correctly identifies valid, invalid, and duplicate entries."""
    csv_data = (
        "company_name,email,phone,website,industry\n"
        "Valid Smiles Dental,dr.valid@smiles.com,512-555-1000,https://smiles.com,Dental\n"
        "Disposable Mail LLC,test@mailinator.com,512-555-2000,https://disposable.com,Legal\n"
        "Bad Syntax Dental,not-an-email,512-555-3000,,Dental\n"
        "Valid Smiles Dental,dr.valid@smiles.com,512-555-1000,https://smiles.com,Dental\n" # Duplicate in file
        ",no.company@test.com,512-555-4000,,General\n" # Missing company name
    )

    preview = csv_service.preview_csv_import(csv_data)
    assert preview["total_rows"] == 5
    assert preview["valid_count"] == 1
    assert preview["invalid_count"] == 4
    
    # Check invalid reasons
    invalid_reasons = [r["reasons"] for r in preview["invalid_rows"]]
    flat_reasons = [reason for sublist in invalid_reasons for reason in sublist]
    assert any("Disposable" in r for r in flat_reasons)
    assert any("Duplicate entry" in r for r in flat_reasons)
    assert any("company name" in r for r in flat_reasons)


@pytest.mark.asyncio
async def test_csv_import_commit_and_tenant_export_isolation(async_session):
    """Verifies that CSV commit adds prospects with deduplication and export preserves tenant isolation."""
    biz_a_id = str(uuid.uuid4())
    biz_b_id = str(uuid.uuid4())
    async_session.add(Business(id=biz_a_id, name="Tenant A Clinic", industry="Dental"))
    async_session.add(Business(id=biz_b_id, name="Tenant B Clinic", industry="Dental"))
    await async_session.commit()

    valid_rows = [
        {
            "company_name": "Imported Dental 1",
            "email": "contact1@imported.com",
            "phone": "512-555-8888",
            "website": "https://imported1.com",
            "industry": "Dental",
            "location": "Austin, TX"
        },
        {
            "company_name": "Imported Dental 2",
            "email": "contact2@imported.com",
            "phone": "512-555-9999",
            "website": "https://imported2.com",
            "industry": "Dental",
            "location": "Dallas, TX"
        }
    ]

    # Commit import for Tenant A
    res = await csv_service.commit_csv_import(async_session, biz_a_id, valid_rows)
    assert res["imported_count"] == 2
    assert res["skipped_duplicates"] == 0

    # Commit again -> All should be skipped as duplicates
    res2 = await csv_service.commit_csv_import(async_session, biz_a_id, valid_rows)
    assert res2["imported_count"] == 0
    assert res2["skipped_duplicates"] == 2

    # Export Tenant A CSV
    csv_a = await csv_service.export_prospects_csv(async_session, biz_a_id)
    assert "Imported Dental 1" in csv_a
    assert "Imported Dental 2" in csv_a

    # Export Tenant B CSV -> MUST BE EMPTY of Tenant A data
    csv_b = await csv_service.export_prospects_csv(async_session, biz_b_id)
    assert "Imported Dental 1" not in csv_b
    assert "Imported Dental 2" not in csv_b


# ============================================================
# 7. INTERNAL AI SALES ASSISTANT TESTS
# ============================================================
@pytest.mark.asyncio
async def test_sales_assistant_grounded_crm_queries(async_session):
    """Verifies AI sales assistant answers from live CRM data and returns 'No data yet.' when empty."""
    biz_id = str(uuid.uuid4())
    async_session.add(Business(id=biz_id, name="Sales Assistant Clinic", industry="Dental"))
    await async_session.commit()

    sales_assistant = SalesAssistantService()

    # 1. Empty state query -> Truthfully returns "No data yet."
    empty_res = await sales_assistant.answer_sales_query(
        session=async_session,
        business_id=biz_id,
        query="Who needs follow up?"
    )
    assert "No data yet." in empty_res["answer"]
    assert empty_res["count"] == 0

    # 2. Add prospects needing follow up
    prospect1 = V5Prospect(
        id=str(uuid.uuid4()),
        business_id=biz_id,
        company_name="Hill Country Dental",
        email="info@hillcountrydental.com",
        pipeline_stage="CONTACTED",
        score=82,
        next_action="Follow up regarding Elena AI demo"
    )
    async_session.add(prospect1)
    await async_session.commit()

    # Query again
    follow_up_res = await sales_assistant.answer_sales_query(
        session=async_session,
        business_id=biz_id,
        query="Which prospects need follow up?"
    )
    assert "Hill Country Dental" in follow_up_res["answer"]
    assert follow_up_res["count"] == 1

    # 3. Query for replies
    reply_res = await sales_assistant.answer_sales_query(
        session=async_session,
        business_id=biz_id,
        query="Show me prospects that have replied"
    )
    assert "No data yet." in reply_res["answer"]

    # Mark prospect as replied
    prospect1.outreach_status = "REPLIED"
    prospect1.pipeline_stage = "RESPONDED"
    await async_session.commit()

    reply_res2 = await sales_assistant.answer_sales_query(
        session=async_session,
        business_id=biz_id,
        query="Show me prospects that replied"
    )
    assert "Hill Country Dental" in reply_res2["answer"]
    assert reply_res2["count"] == 1


# ============================================================
# 8. SALES TASKS (Human-in-the-Loop CRM Actions)
# ============================================================
@pytest.mark.asyncio
async def test_sales_tasks_crud_and_tenant_isolation(async_session):
    """Verifies creating, querying, updating, and deleting sales tasks with tenant isolation."""
    biz_a_id = str(uuid.uuid4())
    biz_b_id = str(uuid.uuid4())
    async_session.add(Business(id=biz_a_id, name="Task Clinic A", industry="Dental"))
    async_session.add(Business(id=biz_b_id, name="Task Clinic B", industry="Legal"))

    prospect_a = V5Prospect(
        id=str(uuid.uuid4()),
        business_id=biz_a_id,
        company_name="Austin Dental Care",
        email="info@austindentalcare.com"
    )
    async_session.add(prospect_a)
    await async_session.commit()

    # 1. Create Sales Task for Tenant A
    task = V5SalesTask(
        business_id=biz_a_id,
        prospect_id=prospect_a.id,
        title="Follow up with Dr. Miller",
        description="Call practice manager regarding after-hours triage",
        task_type="FOLLOW_UP",
        priority="HIGH",
        status="PENDING",
        assigned_to="operator-1"
    )
    async_session.add(task)
    await async_session.commit()
    await async_session.refresh(task)

    assert task.id is not None
    assert task.status == "PENDING"
    assert task.priority == "HIGH"

    # 2. Query tasks for Tenant A -> 1 task
    stmt_a = select(V5SalesTask).where(V5SalesTask.business_id == biz_a_id)
    res_a = await async_session.execute(stmt_a)
    tasks_a = res_a.scalars().all()
    assert len(tasks_a) == 1
    assert tasks_a[0].title == "Follow up with Dr. Miller"

    # 3. Query tasks for Tenant B -> 0 tasks (strict tenant isolation)
    stmt_b = select(V5SalesTask).where(V5SalesTask.business_id == biz_b_id)
    res_b = await async_session.execute(stmt_b)
    tasks_b = res_b.scalars().all()
    assert len(tasks_b) == 0

    # 4. Update task to COMPLETED
    task.status = "COMPLETED"
    task.completed_at = datetime.now(timezone.utc)
    await async_session.commit()
    await async_session.refresh(task)
    assert task.status == "COMPLETED"
    assert task.completed_at is not None

    # 5. Delete task
    await async_session.delete(task)
    await async_session.commit()
    res_after = await async_session.execute(stmt_a)
    assert len(res_after.scalars().all()) == 0
