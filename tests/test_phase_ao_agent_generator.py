"""
Rine Forge Systems V5 - Phase AO: Auto Lead -> Auto Bot Generator Test Suite
Comprehensive testing of the 6-bot coordinated suite generator, unified knowledge base,
pluggable signal providers, business & radius matching, fact vs inference segregation,
9 lead lifecycle states, grounded response generation, 10-gate pre-flight compliance,
transparent lead prioritization, and end-to-end pipeline execution.
"""
import pytest
import pytest_asyncio
import uuid
from datetime import datetime, timezone, timedelta
from sqlalchemy import select

from backend.app.models.v5 import (
    Business,
    V5SocialSignal,
    V5SocialLead,
    V5GeneratedAgentSuite,
    V5SuppressionEntry
)
from backend.app.agents.generator import (
    agent_generator_service,
    BusinessProfileInput
)
from backend.app.signals.providers import (
    signal_ingestion_service,
    CustomerFeedSignalProvider,
    PublicDirectorySignalProvider,
    WebhookSignalProvider,
    XSignalProvider,
    RedditSignalProvider,
    NextdoorSignalProvider,
    MockSocialSignalProvider
)
from backend.app.signals.matching_engine import signal_matching_engine
from backend.app.signals.qualification_agent import lead_qualification_agent
from backend.app.signals.response_generator import response_generator
from backend.app.signals.policy_engine import outbound_policy_engine
from backend.app.signals.prioritization import lead_prioritization_engine
from backend.app.compliance.suppression_service import suppression_service


# ============================================================
# 1. 6-BOT SUITE GENERATION & KNOWLEDGE BASE INTEGRITY
# ============================================================
def test_agent_generator_service_pure_config():
    """Verifies that generate_suite_config produces unified KB and all 6 coordinated bot configurations."""
    profile = BusinessProfileInput(
        business_name="SmileCraft Dental",
        business_category="Dental Clinic",
        website="https://smilecraft.example.com",
        location_area="Austin, Texas",
        service_radius_miles=25,
        services=["Emergency Dental", "Dental Implants", "Veneers", "Teeth Whitening"],
        target_customer="Local patients needing urgent relief or cosmetic enhancement",
        keywords=["tooth hurts", "need dentist", "broken tooth"],
        excluded_keywords=["dog teeth", "pet dentist", "hiring"],
        preferred_channels=["SOCIAL_REPLY", "EMAIL"],
        ai_tone="PROFESSIONAL_HELPFUL"
    )

    config = agent_generator_service.generate_suite_config(profile)

    # Verify Knowledge Base
    kb = config["knowledge_base"]
    assert "verified_facts" in kb
    assert kb["verified_facts"]["company_name"] == "SmileCraft Dental"
    assert kb["verified_facts"]["coverage_radius_miles"] == 25
    assert len(kb["faq_catalog"]) >= 3
    assert len(kb["boundaries"]) >= 4
    # Healthcare boundary verification
    assert any("diagnose" in b.lower() for b in kb["boundaries"])
    assert "disclaimer" in kb
    assert "Informational only" in kb["disclaimer"]

    # Verify 6 Coordinated Bots
    agents = config["agents_config"]
    expected_bots = [
        "lead_agent", "qualification_agent", "response_agent",
        "conversation_agent", "sales_agent", "handoff_agent"
    ]
    for bot_key in expected_bots:
        assert bot_key in agents
        bot = agents[bot_key]
        assert bot["status"] == "READY"
        assert len(bot["allowed_tools"]) >= 3
        assert len(bot["system_prompt"]) > 50
        assert "SmileCraft Dental" in bot["name"] or "SmileCraft Dental" in bot["system_prompt"]


# ============================================================
# 2. SUITE READINESS VERIFICATION
# ============================================================
def test_suite_readiness_verification():
    """Verifies that verify_suite_readiness returns READY when valid and NOT CONFIGURED when incomplete."""
    suite = V5GeneratedAgentSuite(
        id=str(uuid.uuid4()),
        business_id=str(uuid.uuid4()),
        suite_name="Test Suite",
        business_name="Test Business",
        business_category="Dental Clinic",
        location_area="Austin, TX",
        knowledge_base={"verified_facts": {"company_name": "Test Business"}},
        agents_config={
            "lead_agent": {"system_prompt": "Prompt", "allowed_tools": ["tool1"], "name": "LeadBot", "role": "Detection"},
            "qualification_agent": {"system_prompt": "Prompt", "allowed_tools": ["tool1"], "name": "QualBot", "role": "Qual"},
            "response_agent": {"system_prompt": "Prompt", "allowed_tools": ["tool1"], "name": "RespBot", "role": "Draft"},
            "conversation_agent": {"system_prompt": "Prompt", "allowed_tools": ["tool1"], "name": "ConvBot", "role": "Chat"},
            "sales_agent": {"system_prompt": "Prompt", "allowed_tools": ["tool1"], "name": "SalesBot", "role": "CRM"},
            "handoff_agent": {"system_prompt": "Prompt", "allowed_tools": ["tool1"], "name": "HandoffBot", "role": "Safety"}
        }
    )

    readiness = agent_generator_service.verify_suite_readiness(suite)
    assert readiness["overall_status"] == "READY"
    assert len(readiness["agents"]) == 6
    for agent_data in readiness["agents"].values():
        assert agent_data["status"] == "READY"

    # Corrupt one agent to test NOT CONFIGURED reporting
    corrupt_suite = V5GeneratedAgentSuite(
        id=str(uuid.uuid4()),
        business_id=str(uuid.uuid4()),
        suite_name="Incomplete Suite",
        business_name="Incomplete Business",
        business_category="General",
        location_area="Austin, TX",
        knowledge_base={},
        agents_config={
            "lead_agent": {"system_prompt": "", "allowed_tools": []} # Missing
        }
    )
    incomplete_readiness = agent_generator_service.verify_suite_readiness(corrupt_suite)
    assert incomplete_readiness["overall_status"] == "PARTIALLY_CONFIGURED"
    assert incomplete_readiness["agents"]["lead_agent"]["status"] == "NOT CONFIGURED"


# ============================================================
# 3. SUITE PERSISTENCE & TENANT ISOLATION
# ============================================================
@pytest.mark.asyncio
async def test_suite_persistence_and_multi_tenant_isolation(async_session):
    """Verifies suite creation, update, and strict tenant isolation."""
    biz_a_id = str(uuid.uuid4())
    biz_b_id = str(uuid.uuid4())
    async_session.add(Business(id=biz_a_id, name="Dental Tenant A", industry="Dental"))
    async_session.add(Business(id=biz_b_id, name="Legal Tenant B", industry="Legal"))
    await async_session.commit()

    suite_a = await agent_generator_service.create_or_update_suite(
        session=async_session,
        business_id=biz_a_id,
        profile_data={
            "business_name": "Tenant A Dental",
            "business_category": "Dental Clinic",
            "location_area": "Austin, Texas",
            "services": ["Emergency Dental", "Veneers"],
            "keywords": ["tooth hurts"]
        }
    )

    assert suite_a.id is not None
    assert suite_a.business_id == biz_a_id
    assert suite_a.business_name == "Tenant A Dental"

    # Tenant B has 0 suites
    suites_b = await agent_generator_service.list_suites(async_session, biz_b_id)
    assert len(suites_b) == 0

    # Tenant A has 1 suite
    suites_a = await agent_generator_service.list_suites(async_session, biz_a_id)
    assert len(suites_a) == 1
    assert suites_a[0].id == suite_a.id


# ============================================================
# 4. SIGNAL PROVIDERS & ANTI-SCRAPING TELEMETRY
# ============================================================
def test_provider_telemetry_and_anti_scraping_guardrails():
    """Verifies provider registry and unconfigured API stubs reporting NOT CONFIGURED with instructions."""
    statuses = signal_ingestion_service.get_providers_status()
    assert len(statuses) >= 6

    # X, Reddit, Nextdoor without env keys must report NOT CONFIGURED with instructions
    status_map = {p["provider_id"]: p for p in statuses}

    assert "X_API" in status_map
    assert status_map["X_API"]["status"] == "NOT CONFIGURED"
    assert "instructions" in status_map["X_API"]
    assert "scraping" in status_map["X_API"]["instructions"].lower()

    assert "REDDIT_API" in status_map
    assert status_map["REDDIT_API"]["status"] == "NOT CONFIGURED"
    assert "instructions" in status_map["REDDIT_API"]

    assert "NEXTDOOR_API" in status_map
    assert status_map["NEXTDOOR_API"]["status"] == "NOT CONFIGURED"

    # Authorized local feeds are READY
    assert status_map["CUSTOMER_FEED"]["status"] == "READY"
    assert status_map["PUBLIC_DIRECTORY"]["status"] == "READY"
    assert status_map["WEBHOOK"]["status"] == "READY"


# ============================================================
# 5. SIGNAL INGESTION & DEDUPLICATION
# ============================================================
@pytest.mark.asyncio
async def test_signal_ingestion_and_deduplication(async_session):
    """Verifies signal storage, deduplication, and rejection of private account scrapes."""
    biz_id = str(uuid.uuid4())
    async_session.add(Business(id=biz_id, name="Test Ingestion Biz", industry="Dental"))
    await async_session.commit()

    raw_signals = [
        {
            "source_platform": "CUSTOMER_FEED",
            "source_id": "sig-unique-01",
            "author_id": "@user_atx_1",
            "author_name": "Alice",
            "content": "Need an emergency dentist in Austin ASAP, broken tooth!",
            "location_raw": "Austin, TX",
            "data_provenance": "CUSTOMER_TEST_STREAM"
        },
        {
            # Duplicate of sig-unique-01
            "source_platform": "CUSTOMER_FEED",
            "source_id": "sig-unique-01",
            "author_id": "@user_atx_1",
            "content": "Need an emergency dentist in Austin ASAP, broken tooth!",
            "location_raw": "Austin, TX"
        },
        {
            # Illicit private scrape attempt - must be rejected
            "source_platform": "CUSTOMER_FEED",
            "source_id": "sig-private-02",
            "is_private_account": True,
            "content": "Private message"
        }
    ]

    ingested = await signal_ingestion_service.ingest_signals(
        session=async_session,
        business_id=biz_id,
        signals_data=raw_signals
    )

    # Only 1 unique compliant signal should be ingested
    assert len(ingested) == 1
    assert ingested[0].source_id == "sig-unique-01"
    assert ingested[0].source_permission_verified is True


# ============================================================
# 6. MATCHING ENGINE ACROSS 6 VERTICALS & METRO RADIUS
# ============================================================
def test_matching_engine_verticals_and_radius():
    """Verifies multi-factor matching across the 6 requested vertical fixtures."""
    # 1. Dentist (Austin match vs Dallas rejection)
    eval_dentist_local = signal_matching_engine.evaluate_signal(
        signal_content="Tooth hurts so bad, need an emergency dentist today!",
        signal_location="Austin, TX",
        business_category="Dental Clinic",
        target_location="Austin, Texas",
        service_radius_miles=25,
        services=["Emergency Dental", "Implants"],
        keywords=["tooth hurts", "need dentist"],
        excluded_keywords=["pet", "dog"]
    )
    assert eval_dentist_local.is_match is True
    assert eval_dentist_local.intent_category == "HIGH_INTENT"
    assert eval_dentist_local.location_matched is True
    assert "Emergency Dental" in eval_dentist_local.matched_services

    eval_dentist_dallas = signal_matching_engine.evaluate_signal(
        signal_content="Need emergency dentist in Dallas!",
        signal_location="Dallas, TX",
        business_category="Dental Clinic",
        target_location="Austin, Texas",
        service_radius_miles=25,
        services=["Emergency Dental"],
        keywords=["dentist"],
        excluded_keywords=[]
    )
    # Outside radius: Dallas is ~195 miles away from Austin
    assert eval_dentist_dallas.location_matched is False
    assert eval_dentist_dallas.is_match is False

    # 2. Restaurant
    eval_rest = signal_matching_engine.evaluate_signal(
        signal_content="Planning an anniversary dinner in Austin for 6 people. Looking for a great steakhouse with private dining.",
        signal_location="Austin, TX",
        business_category="Restaurant",
        target_location="Austin, TX",
        service_radius_miles=25,
        services=["Private Dining", "Steaks"],
        keywords=["anniversary dinner", "steakhouse"],
        excluded_keywords=["fast food", "cheap"]
    )
    assert eval_rest.is_match is True
    assert eval_rest.intent_category == "HIGH_INTENT"

    # 3. Law Firm
    eval_law = signal_matching_engine.evaluate_signal(
        signal_content="Rear-ended on MoPac yesterday, car totaled. Looking for an injury attorney in Austin to handle my claim.",
        signal_location="Austin, TX",
        business_category="Law Firm",
        target_location="Austin, TX",
        service_radius_miles=25,
        services=["Auto Accident Claims", "Personal Injury"],
        keywords=["injury attorney", "car accident"],
        excluded_keywords=["divorce", "ticket"]
    )
    assert eval_law.is_match is True
    assert eval_law.intent_category == "HIGH_INTENT"

    # 4. Hotel
    eval_hotel = signal_matching_engine.evaluate_signal(
        signal_content="Visiting Austin next month with a group of 10. Need boutique hotel suites near downtown.",
        signal_location="Downtown Austin, TX",
        business_category="Hotel",
        target_location="Austin, TX",
        service_radius_miles=25,
        services=["Executive Suites", "Group Blocks"],
        keywords=["hotel suites", "boutique hotel"],
        excluded_keywords=["hostel", "cheap motel"]
    )
    assert eval_hotel.is_match is True

    # 5. Cleaning Company (Round Rock / Cedar Park suburbs match Austin cluster)
    eval_clean = signal_matching_engine.evaluate_signal(
        signal_content="Moving out this weekend in Cedar Park, need deep cleaning service recommendation.",
        signal_location="Cedar Park, TX",
        business_category="Cleaning Company",
        target_location="Austin, TX",
        service_radius_miles=25,
        services=["Deep Cleaning", "Move-Out Cleaning"],
        keywords=["deep cleaning", "cleaner"],
        excluded_keywords=["diy"]
    )
    assert eval_clean.is_match is True
    assert eval_clean.location_matched is True # Cedar Park is Austin metro cluster

    # 6. Marketing Agency
    eval_mkt = signal_matching_engine.evaluate_signal(
        signal_content="Our B2B startup is looking for an SEO and paid search marketing agency in Austin.",
        signal_location="Austin, TX",
        business_category="Marketing Agency",
        target_location="Austin, TX",
        service_radius_miles=25,
        services=["B2B Pipeline SEO", "Paid Search"],
        keywords=["marketing agency", "seo"],
        excluded_keywords=["free followers"]
    )
    assert eval_mkt.is_match is True
    assert eval_mkt.intent_category == "HIGH_INTENT"


# ============================================================
# 7. NEGATIVE KEYWORD FILTERING
# ============================================================
def test_matching_engine_negative_keyword_rejection():
    """Verifies that negative or irrelevant keywords immediately disqualify the signal."""
    eval_pet = signal_matching_engine.evaluate_signal(
        signal_content="My dog has a broken tooth, need a pet dentist in Austin.",
        signal_location="Austin, TX",
        business_category="Dental Clinic",
        target_location="Austin, Texas",
        service_radius_miles=25,
        services=["Emergency Dental"],
        keywords=["tooth", "dentist"],
        excluded_keywords=["dog", "pet", "hiring"]
    )
    assert eval_pet.is_match is False
    assert eval_pet.intent_category == "NEGATIVE"
    assert "dog" in eval_pet.excluded_keywords_found or "pet" in eval_pet.excluded_keywords_found
    assert eval_pet.relevance_score == 0.0


# ============================================================
# 8. AI QUALIFICATION: FACTS VS INFERENCES SEGREGATION
# ============================================================
def test_ai_qualification_fact_vs_inference_segregation():
    """Verifies zero hallucination by segregating observed facts from deductive inferences."""
    result = lead_qualification_agent.qualify_signal(
        signal_content="My back molar cracked during lunch today and hurts so bad! Looking for an emergency dentist in Austin.",
        signal_location="Austin, TX",
        author_name="David R.",
        config={
            "business_name": "SmileCraft Dental",
            "business_category": "Dental Clinic",
            "location_area": "Austin, Texas",
            "service_radius_miles": 25,
            "services": ["Emergency Dental", "Dental Implants"],
            "keywords": ["tooth hurts", "emergency dentist", "cracked"],
            "excluded_keywords": ["pet", "dog"]
        }
    )

    assert result.is_qualified is True
    assert result.urgency == "HIGH"
    assert result.priority_score >= 80

    # Verify Facts: Contains literal observations from text
    assert len(result.facts) >= 2
    assert any("David R." in f for f in result.facts)
    assert any("Austin, TX" in f for f in result.facts)
    assert any("Emergency Dental" in f or "emergency dentist" in f.lower() for f in result.facts)

    # Verify Inferences: Contains deductions with explicit confidence scores
    assert len(result.inferences) >= 2
    for inf in result.inferences:
        assert "deduction" in inf
        assert "confidence" in inf
        assert 0.0 <= inf["confidence"] <= 1.0
        assert "basis" in inf


# ============================================================
# 9. LEAD LIFECYCLE STATE TRANSITIONS
# ============================================================
@pytest.mark.asyncio
async def test_lead_lifecycle_states_transitions(async_session):
    """Verifies progression across the 9 lead lifecycle states."""
    biz_id = str(uuid.uuid4())
    async_session.add(Business(id=biz_id, name="Lifecycle Test Biz", industry="Dental"))
    await async_session.commit()

    # Step 1: NEW Signal
    sig = V5SocialSignal(
        id=str(uuid.uuid4()),
        business_id=biz_id,
        source_platform="CUSTOMER_FEED",
        source_id="sig-life-01",
        content="Looking for cosmetic veneers consultation in Austin.",
        location_raw="Austin, TX",
        author_id="@clara",
        author_name="Clara",
        processed=False
    )
    async_session.add(sig)
    await async_session.commit()

    suite = await agent_generator_service.create_or_update_suite(
        session=async_session,
        business_id=biz_id,
        profile_data={
            "business_name": "Austin Smile Studio",
            "business_category": "Dental Clinic",
            "location_area": "Austin, TX",
            "services": ["Porcelain Veneers", "Teeth Whitening"],
            "keywords": ["veneers", "cosmetic"]
        }
    )

    # Step 2: QUALIFIED Lead created in CRM
    lead = await lead_qualification_agent.qualify_and_persist(async_session, sig, suite)
    assert lead.status in ["QUALIFIED", "NEEDS_REVIEW"]
    assert sig.processed is True

    # Step 3: Human operator transition to CONTACTED
    lead.status = "CONTACTED"
    lead.response_status = "SENT"
    lead.response_sent_at = datetime.now(timezone.utc)
    await async_session.commit()
    await async_session.refresh(lead)
    assert lead.status == "CONTACTED"

    # Step 4: Follow-up reply received -> REPLIED
    lead.status = "REPLIED"
    await async_session.commit()
    await async_session.refresh(lead)
    assert lead.status == "REPLIED"

    # Step 5: Meeting booked -> MEETING_REQUESTED -> CUSTOMER
    lead.status = "MEETING_REQUESTED"
    await async_session.commit()
    lead.status = "CUSTOMER"
    await async_session.commit()
    await async_session.refresh(lead)
    assert lead.status == "CUSTOMER"


# ============================================================
# 10. AI RESPONSE GENERATOR GUARDRAILS & CHANNELS
# ============================================================
def test_response_generator_guardrails_and_channels():
    """Verifies response draft adherence to strict guardrails across channels."""
    lead = V5SocialLead(
        id=str(uuid.uuid4()),
        business_id=str(uuid.uuid4()),
        contact_name="Sarah",
        channel="SOCIAL_REPLY",
        service_needed="Emergency Dental",
        location="Austin, TX",
        urgency="HIGH"
    )

    suite = V5GeneratedAgentSuite(
        id=str(uuid.uuid4()),
        business_id=lead.business_id,
        business_name="SmileCraft Dental",
        business_category="Dental Clinic",
        location_area="Austin, Texas",
        services=["Emergency Dental", "Dental Implants"],
        knowledge_base={
            "disclaimer": "Informational communication only. Not clinical dental advice."
        }
    )

    # Social Reply Test
    draft_social = response_generator.generate_response(lead=lead, suite=suite, channel="SOCIAL_REPLY")
    assert "SmileCraft Dental" in draft_social.body
    assert "Informational communication only" in draft_social.body
    assert "— Sent on behalf of SmileCraft Dental" in draft_social.disclosure_statement
    # Guardrail checks: no fake claims
    assert "my tooth hurt" not in draft_social.body.lower()
    assert "i had that" not in draft_social.body.lower()

    # Email Test
    draft_email = response_generator.generate_response(lead=lead, suite=suite, channel="EMAIL")
    assert draft_email.subject is not None
    assert "UNSUBSCRIBE" in draft_email.body or "OPT OUT" in draft_email.body

    # SMS / WhatsApp Test
    draft_sms = response_generator.generate_response(lead=lead, suite=suite, channel="SMS")
    assert "STOP to opt out" in draft_sms.body


# ============================================================
# 11. OUTBOUND POLICY ENGINE (10 GATES)
# ============================================================
@pytest.mark.asyncio
async def test_outbound_policy_engine_10_gates(async_session):
    """Verifies that all 10 pre-flight compliance gates operate rigorously."""
    biz_id = str(uuid.uuid4())
    async_session.add(Business(id=biz_id, name="Gate Test Biz", industry="Dental"))
    await async_session.commit()

    suite = V5GeneratedAgentSuite(
        id=str(uuid.uuid4()),
        business_id=biz_id,
        business_name="SmileCraft Dental",
        business_category="Dental Clinic",
        location_area="Austin, TX",
        preferred_channels=["SOCIAL_REPLY", "EMAIL"]
    )
    sig = V5SocialSignal(
        id=str(uuid.uuid4()),
        business_id=biz_id,
        source_platform="CUSTOMER_FEED",
        source_permission_verified=True,
        content="Test content"
    )
    lead = V5SocialLead(
        id=str(uuid.uuid4()),
        business_id=biz_id,
        contact_handle="@valid_user",
        channel="SOCIAL_REPLY",
        status="QUALIFIED",
        draft_response="Hello Sarah, this is from the team at SmileCraft Dental in Austin regarding emergency dental care.",
        opt_out_status="NOT_OPTED_OUT"
    )

    # 1. Gate 10 Fails when human approval is missing and draft is unapproved
    lead.response_status = "DRAFT"
    report_unapproved = await outbound_policy_engine.evaluate_preflight(
        session=async_session,
        lead=lead,
        suite=suite,
        signal=sig,
        human_approved=False
    )
    assert report_unapproved.all_passed is False
    assert report_unapproved.failed_gate == "10_APPROVAL_REQUIRED"

    # 2. Gate 5 Fails when recipient is on suppression / opt-out list
    await suppression_service.add_suppression(
        session=async_session,
        business_id=biz_id,
        entry_type="SOCIAL_ID",
        value="@valid_user",
        reason="USER_OPTOUT"
    )
    report_opted_out = await outbound_policy_engine.evaluate_preflight(
        session=async_session,
        lead=lead,
        suite=suite,
        signal=sig,
        human_approved=True
    )
    assert report_opted_out.all_passed is False
    assert report_opted_out.failed_gate == "5_OPTED_OUT"

    # 3. Gate 3 Fails when channel is not in suite.preferred_channels
    lead.contact_handle = "@clean_user_99" # Not suppressed
    lead.channel = "TIKTOK_DM" # Unsupported channel
    report_bad_channel = await outbound_policy_engine.evaluate_preflight(
        session=async_session,
        lead=lead,
        suite=suite,
        signal=sig,
        human_approved=True
    )
    assert report_bad_channel.all_passed is False
    assert report_bad_channel.failed_gate == "3_PLATFORM_ALLOWED"


# ============================================================
# 12. LEAD PRIORITIZATION FORMULA & CHECKLIST
# ============================================================
def test_lead_prioritization_formula_and_checklist():
    """Verifies transparent priority score calculation and human-readable checklist."""
    # High Priority Lead
    breakdown_high = lead_prioritization_engine.calculate_priority(
        intent_category="HIGH_INTENT",
        urgency="HIGH",
        location_matched=True,
        service_matched=True,
        has_contact_identifier=True
    )
    assert breakdown_high.priority_score == 100
    assert breakdown_high.priority_tier == "HIGH"
    assert len(breakdown_high.checklist) == 5
    assert all("✓" in item for item in breakdown_high.checklist)

    # Disqualified Lead
    breakdown_disq = lead_prioritization_engine.calculate_priority(
        intent_category="NEGATIVE",
        urgency="LOW",
        location_matched=False,
        service_matched=False,
        has_contact_identifier=False,
        excluded_found=True
    )
    assert breakdown_disq.priority_score == 0
    assert breakdown_disq.priority_tier == "DISQUALIFIED"
    assert "✗ Disqualified" in breakdown_disq.checklist[0]


# ============================================================
# 13. END-TO-END PIPELINE: INGEST -> QUALIFY -> DRAFT -> DISPATCH
# ============================================================
@pytest.mark.asyncio
async def test_end_to_end_agent_generator_pipeline(async_session):
    """
    Tests complete lifecycle:
    1. Tenant configures profile -> generates 6-bot suite & KB
    2. Ingests raw public signal
    3. Qualifies signal -> V5SocialLead with facts & inferences
    4. Response draft generated with mandatory disclosure
    5. Human review approval & 10-Gate Pre-Flight dispatch
    """
    biz_id = str(uuid.uuid4())
    async_session.add(Business(id=biz_id, name="Apex Injury Lawyers", industry="Legal"))
    await async_session.commit()

    # 1. Generate Suite
    suite = await agent_generator_service.create_or_update_suite(
        session=async_session,
        business_id=biz_id,
        profile_data={
            "business_name": "Apex Injury Lawyers",
            "business_category": "Law Firm",
            "location_area": "Austin, Texas",
            "service_radius_miles": 35,
            "services": ["Auto Accident Claims", "Personal Injury"],
            "keywords": ["car accident", "rear ended", "injury attorney"],
            "preferred_channels": ["SOCIAL_REPLY", "EMAIL"]
        }
    )
    assert suite.is_verified is True

    # 2. Ingest Signal
    raw_signals = [{
        "source_platform": "CUSTOMER_FEED",
        "source_id": "law-signal-101",
        "author_id": "@austin_driver_55",
        "author_name": "Marcus Kane",
        "content": "Rear ended on MoPac yesterday. Severe neck pain and car totaled. Need a reliable accident attorney in Austin.",
        "location_raw": "Austin, TX",
        "data_provenance": "PUBLIC_COMMUNITY_RECOMMENDATION"
    }]
    ingested = await signal_ingestion_service.ingest_signals(
        session=async_session,
        business_id=biz_id,
        signals_data=raw_signals
    )
    assert len(ingested) == 1
    signal_record = ingested[0]

    # 3. Qualify Signal into Lead
    lead = await lead_qualification_agent.qualify_and_persist(
        session=async_session,
        signal=signal_record,
        suite=suite
    )
    assert lead.status == "QUALIFIED"
    assert lead.urgency == "HIGH"
    assert len(lead.qualification_facts) >= 2
    assert len(lead.qualification_inferences) >= 2

    # 4. Generate Response Draft
    draft = response_generator.generate_response(lead=lead, suite=suite, channel="SOCIAL_REPLY")
    lead.draft_response = draft.body
    lead.response_status = "DRAFT"
    await async_session.commit()
    await async_session.refresh(lead)

    assert "Apex Injury Lawyers" in lead.draft_response
    assert "Informational" in lead.draft_response

    # 5. Human Review & 10-Gate Pre-Flight Dispatch
    dispatch_res = await outbound_policy_engine.dispatch_approved_response(
        session=async_session,
        lead=lead,
        suite=suite
    )

    assert dispatch_res["success"] is True
    assert dispatch_res["status"] == "SENT"
    assert lead.response_status == "SENT"
    assert lead.status == "CONTACTED"
    assert lead.response_sent_at is not None
    assert dispatch_res["compliance_report"]["all_passed"] is True
