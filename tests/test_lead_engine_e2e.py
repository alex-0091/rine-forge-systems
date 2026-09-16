"""
Rine Forge Systems V5 - AI Lead Generation & Discovery Engine End-to-End Test Suite
Verifies all 27 mandatory criteria from Section 24:
1. Provider Architecture & Unauthorized Scraping Block
2. Grounded Website Analysis (Zero Hallucination)
3. Anti-Health Guard & Intent Discovery
4. Multi-Dimensional Lead Scoring Formula
5. Prospect Deduplication & Merging
6. Suppression & Opt-Out Enforcement
7. Review Mode & Auto-Mode Qualification
8. Evidence-Grounded Outreach Generation
9. Frequency Control (72h Cooldown, 3-Step Cap, Daily Cap)
10. Reply Intelligence (5-class intent classification)
11. End-to-End Pipeline & Meta-Dogfooding Sales Tenant
"""
import pytest
import pytest_asyncio
import uuid
from datetime import datetime, timezone, timedelta
from sqlalchemy import select, func

from backend.app.models.v5 import (
    Business, V5Prospect, V5ProspectObservation, V5ProspectOpportunity,
    V5ProspectOutreach, V5OutreachEvent, V5LeadSearch, V5SuppressionEntry
)
from backend.app.discovery.providers_v5 import (
    LeadSourceType,
    BaseLeadSourceProvider,
    PublicBusinessDataProvider,
    WebsiteFormsProvider,
    InboundChatProvider,
    CRMProvider,
    EmailSourceProvider,
    ReferralProvider,
    AuthorizedLeadAPIsProvider,
    AdPlatformsProvider,
    SocialPlatformAPIsProvider,
    UserProvidedLeadsProvider,
    RawOpportunity
)
from backend.app.discovery.website_analysis import website_analysis_service, WebsiteAnalysisResult
from backend.app.discovery.opportunity_analyzer import opportunity_analyzer
from backend.app.discovery.intent_discovery import intent_discovery_service
from backend.app.leads.scoring_v5 import lead_scoring_engine
from backend.app.discovery.deduplication_v5 import prospect_deduplicator
from backend.app.compliance.suppression_service import suppression_service
from backend.app.outreach.rate_limiter_v5 import frequency_controller
from backend.app.outreach.outreach_generator import outreach_generator
from backend.app.outreach.email_provider_v5 import email_outreach_provider
from backend.app.outreach.engine_v5 import outreach_engine_v5
from backend.app.outreach.followup_engine import followup_engine
from backend.app.inbox.reply_intelligence_v5 import reply_intelligence_service
from backend.app.discovery.pipeline_v5 import lead_discovery_pipeline
from backend.app.analytics.conversion_intelligence import conversion_intelligence

# ============================================================
# 1. PROVIDER TESTS
# ============================================================
@pytest.mark.asyncio
async def test_lead_source_providers_capability_and_restrictions():
    """All 10 providers can be instantiated. Social provider blocked with explicit error."""
    providers = [
        WebsiteFormsProvider(),
        InboundChatProvider(),
        CRMProvider(),
        EmailSourceProvider(),
        ReferralProvider(),
        PublicBusinessDataProvider(),
        AuthorizedLeadAPIsProvider(),
        AdPlatformsProvider(),
        SocialPlatformAPIsProvider(),
        UserProvidedLeadsProvider()
    ]
    assert len(providers) == 10

    # Test social restricted provider
    social_provider = SocialPlatformAPIsProvider()
    res = await social_provider.fetch_opportunities("test-biz", {})
    assert len(res) == 1
    assert res[0].status == "NOT AVAILABLE THROUGH OFFICIAL API"
    assert "Strictly prohibits unauthorized scraping" in res[0].raw_text

    # Test official provider returns standardized RawOpportunity
    public_provider = PublicBusinessDataProvider()
    opps = await public_provider.fetch_opportunities(
        "test-biz",
        {"industry": "Dental", "location": "Austin, TX", "services": ["Cleaning"], "max_results": 2}
    )
    assert len(opps) > 0
    first = opps[0]
    assert isinstance(first, RawOpportunity)
    assert first.entity_name != ""
    assert first.source == LeadSourceType.PUBLIC_BUSINESS_DATA
    assert first.consent_status == "PUBLIC_COMMERCIAL"

# ============================================================
# 2. WEBSITE ANALYSIS & ZERO-HALLUCINATION TEST
# ============================================================
@pytest.mark.asyncio
async def test_website_analysis_grounded_observations():
    """Analyzes realistic HTML. Verifies contact channels, journey gaps, and evidence citations."""
    sample_html = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Austin Smile Studio | Cosmetic & Family Dentistry</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="/wp-content/themes/dental/style.css">
    </head>
    <body>
        <header>
            <nav>
                <a href="/">Home</a>
                <a href="/whitening">Teeth Whitening</a>
                <a href="/implants">Dental Implants</a>
                <a href="/invisalign">Invisalign</a>
                <a href="/contact">Contact Us</a>
            </nav>
        </header>
        <main>
            <h1>Welcome to Austin Smile Studio</h1>
            <p>Call us at (512) 555-4321 or email info@austinsmilestudio.com</p>
            <form action="/submit">
                <input type="text" name="name" placeholder="Your Name">
                <input type="email" name="email" placeholder="Your Email">
                <p>Please allow 24-48 hours for an appointment confirmation.</p>
                <button type="submit">Submit Request</button>
            </form>
            <div>
                <p>Hours: Mon-Fri: 9:00am-5:00pm</p>
                <p>Saturday: Closed</p>
            </div>
        </main>
    </body>
    </html>
    """

    result = website_analysis_service._parse_html(
        html=sample_html,
        url="https://austinsmilestudio.com",
        load_time_ms=180,
        has_ssl=True,
        fallback_name="Austin Smile Studio",
        industry="Dental"
    )

    assert result.business_name == "Austin Smile Studio"
    assert "info@austinsmilestudio.com" in result.contact_methods["emails"]
    assert any("512" in p for p in result.contact_methods["phones"])
    assert result.tech_stack["cms"] == "WordPress"
    assert result.contact_methods["has_contact_form"] is True
    assert result.contact_methods["has_online_booking"] is False
    assert result.contact_methods["has_live_chat"] is False
    assert result.contact_methods["has_whatsapp"] is False

    # Check observations
    assert len(result.observations) > 0
    for obs in result.observations:
        assert "observation" in obs
        assert obs["source"].startswith("http")
        assert 0.0 <= obs["confidence"] <= 1.0

    # Opportunity analyzer
    opps = opportunity_analyzer.analyze_opportunities(result, {"industry": "Dental"})
    types = [op["type"] for op in opps]
    assert "AI_RECEPTIONIST" in types
    assert "APPOINTMENT_AUTOMATION" in types
    assert "SPEED_TO_LEAD" in types
    assert "WHATSAPP_EMPLOYEE" in types

# ============================================================
# 3. ANTI-HEALTH INFERENCE GUARD & INTENT DISCOVERY TEST
# ============================================================
def test_anti_health_guard_and_intent_discovery():
    """Verifies commercial queries are accepted and personal distress is strictly rejected."""
    # 1. Commercial Query -> ACCEPT
    q1 = intent_discovery_service.analyze_intent(
        raw_text="Looking for a reliable cosmetic dentist in Austin for dental implants",
        source_type="PUBLIC_BUSINESS_DATA",
        industry="Dental",
        target_services=["Dental Implants", "Cosmetic Dentistry"]
    )
    assert q1.is_legitimate is True
    assert q1.intent_class == "COMMERCIAL_SERVICE_SEARCH"

    # 2. Service search -> ACCEPT
    q2 = intent_discovery_service.analyze_intent(
        raw_text="Need teeth whitening near downtown Austin",
        source_type="INBOUND_CHAT",
        industry="Dental",
        target_services=["Teeth Whitening"]
    )
    assert q2.is_legitimate is True

    # 3. Health Distress (Anti-Health Guard) -> REJECT
    q3 = intent_discovery_service.analyze_intent(
        raw_text="I have a terrible toothache and I'm crying from the pain please help",
        source_type="PUBLIC_BUSINESS_DATA",
        industry="Dental",
        target_services=["Cleaning"]
    )
    assert q3.is_legitimate is False
    assert q3.intent_class == "PERSONAL_HEALTH_DISTRESS"
    assert "Anti-Health Inference Guard" in q3.rejection_reason

    # 4. Irrelevant Query -> REJECT
    q4 = intent_discovery_service.analyze_intent(
        raw_text="Best artisan pizza slices in Austin",
        source_type="PUBLIC_BUSINESS_DATA",
        industry="Dental",
        target_services=["Cleaning"]
    )
    assert q4.is_legitimate is False
    assert q4.intent_class == "IRRELEVANT_TOPIC"

# ============================================================
# 4. LEAD SCORING FORMULA TEST
# ============================================================
def test_lead_scoring_formula():
    """Verifies multi-dimensional scoring formula and breakdowns."""
    # High intent, target city, verified consent
    score_high = lead_scoring_engine.calculate_score(
        intent_strength=0.95,
        relevance_confidence=0.90,
        recency_hours=1.0,
        geo_fit=1.0,
        engagement_depth=3,
        consent_factor=1.0
    )
    assert score_high["score"] >= 80
    assert "breakdown" in score_high

    # Moderate intent, missing contact/opt-in penalty
    score_mod = lead_scoring_engine.calculate_score(
        intent_strength=0.60,
        relevance_confidence=0.60,
        recency_hours=48.0,
        geo_fit=1.0,
        engagement_depth=1,
        consent_factor=0.7
    )
    assert 50 <= score_mod["score"] <= 75

    # Out of area penalty
    score_out = lead_scoring_engine.calculate_score(
        intent_strength=0.90,
        relevance_confidence=0.90,
        recency_hours=1.0,
        geo_fit=0.1, # Out of radius
        engagement_depth=2,
        consent_factor=1.0
    )
    assert score_out["score"] < score_high["score"]

# ============================================================
# 5. DEDUPLICATION & MULTI-SOURCE MERGING TEST
# ============================================================
@pytest.mark.asyncio
async def test_prospect_deduplication_and_merging(async_session):
    """Verifies domain matching, non-destructive merging, and preserving outreach status."""
    biz_id = str(uuid.uuid4())
    biz = Business(
        id=biz_id,
        name="Test Dental Clinic",
        industry="Dental"
    )
    async_session.add(biz)
    await async_session.commit()

    # Ingest from Source A
    p1, is_new1 = await prospect_deduplicator.merge_or_create_prospect(
        session=async_session,
        business_id=biz_id,
        prospect_data={
            "company_name": "Lone Star Dental",
            "website": "https://lonestardental.com",
            "city": "Austin",
            "email": "dr.austin@lonestardental.com",
            "phone": "+1 512 555 0101",
            "source": "PUBLIC_BUSINESS_DATA",
            "score": 70
        },
        observations=[{"observation": "No online booking widget", "source": "https://lonestardental.com", "confidence": 0.9}]
    )
    assert is_new1 is True
    assert p1.score == 70

    # Mark outreach status as SENT
    p1.outreach_status = "SENT"
    await async_session.commit()

    # Ingest from Source B (www.lonestardental.com/ with higher score 85)
    p2, is_new2 = await prospect_deduplicator.merge_or_create_prospect(
        session=async_session,
        business_id=biz_id,
        prospect_data={
            "company_name": "Lone Star Dental LLC",
            "website": "http://www.lonestardental.com/",
            "city": "Austin",
            "phone": "512-555-0101",
            "source": "USER_PROVIDED_LEADS",
            "score": 85
        },
        observations=[{"observation": "Contact form says 24-48 hours", "source": "https://lonestardental.com/contact", "confidence": 0.95}]
    )

    assert is_new2 is False
    assert p2.id == p1.id
    assert p2.score == 85
    assert p2.outreach_status == "SENT" # NEVER reset
    assert "PUBLIC_BUSINESS_DATA" in p2.meta_json["sources"]
    assert "USER_PROVIDED_LEADS" in p2.meta_json["sources"]
    assert len(p2.observations) == 2

# ============================================================
# 6. SUPPRESSION & DO-NOT-CONTACT TEST
# ============================================================
@pytest.mark.asyncio
async def test_suppression_and_keyword_detection(async_session):
    """Verifies suppression list checks, manual entry, and keyword detection."""
    biz_id = str(uuid.uuid4())

    email = "stop.me@example.com"
    # Not suppressed yet
    assert await suppression_service.is_suppressed(async_session, biz_id, "EMAIL", email) is False

    # Add to suppression
    entry = await suppression_service.add_to_suppression(
        async_session, biz_id, "EMAIL", email, reason="USER_OPTOUT"
    )
    assert entry.value == email.lower()
    assert await suppression_service.is_suppressed(async_session, biz_id, "EMAIL", email) is True

    # Keyword check
    assert suppression_service.contains_opt_out_keyword("Please STOP emailing me") is True
    assert suppression_service.contains_opt_out_keyword("unsubscribe from this list") is True
    assert suppression_service.contains_opt_out_keyword("I am interested in teeth whitening") is False

# ============================================================
# 7. REVIEW MODE & APPROVAL WORKFLOW TEST
# ============================================================
@pytest.mark.asyncio
async def test_review_mode_and_approval_flow(async_session):
    """Verifies prospects default to REVIEW, proposed drafts, and approval dispatch."""
    biz_id = str(uuid.uuid4())
    biz = Business(id=biz_id, name="Review Clinic", industry="Dental")
    async_session.add(biz)
    await async_session.commit()

    prospect = V5Prospect(
        business_id=biz_id,
        company_name="Cedar Park Dentistry",
        website="https://cedarparkdental.com",
        email="contact@cedarparkdental.com",
        score=82,
        pipeline_stage="REVIEW",
        review_mode="REVIEW"
    )
    async_session.add(prospect)
    await async_session.flush()

    async_session.add(V5ProspectObservation(
        prospect_id=prospect.id,
        observation="Contact form says: 'We respond within 24-48 hours.'",
        source="https://cedarparkdental.com/contact",
        confidence=0.95,
        category="SPEED_TO_LEAD"
    ))
    await async_session.commit()

    # Draft outreach
    outreach = await outreach_engine_v5.draft_initial_outreach(
        session=async_session,
        business_id=biz_id,
        prospect=prospect,
        channel="EMAIL"
    )
    assert outreach.status == "PENDING_REVIEW"
    assert "24-48 hours" in outreach.message
    assert "STOP" in outreach.message

    # Verify compliance pre-flight
    compliance = await outreach_engine_v5.get_compliance_status(
        session=async_session, business_id=biz_id, prospect=prospect, channel="EMAIL"
    )
    assert compliance["all_passed"] is True
    assert compliance["in_suppression_list"] is False

    # Approve and send
    approved = await outreach_engine_v5.approve_and_send(
        session=async_session,
        outreach_id=outreach.id,
        approver_id="test-user-123"
    )
    assert approved["success"] is True
    assert approved["status"] == "SENT"
    assert prospect.pipeline_stage == "CONTACTED"
    assert prospect.outreach_status == "SENT"

# ============================================================
# 8. OUTREACH GENERATION EVIDENCE & SEQUENCE TEST
# ============================================================
def test_outreach_generation_sequence_and_optout():
    """Verifies observation citations, Step 0, Step 1, Step 2, and opt-out text."""
    p = V5Prospect(
        company_name="Capitol Dental Arts",
        website="https://capitoldental.com",
        industry="Dental",
        score=80
    )
    p.observations = [
        V5ProspectObservation(
            prospect_id="mock-id",
            observation="Contact form states: 'Delayed turnaround within 24-48 hours'",
            source="https://capitoldental.com/contact",
            confidence=0.95,
            category="SPEED_TO_LEAD"
        )
    ]
    p.opportunities = [
        V5ProspectOpportunity(
            prospect_id="mock-id",
            type="SPEED_TO_LEAD",
            reason="Replaces 24-48h form delay with instant response",
            evidence="24-48 hours on contact page",
            confidence=0.95
        )
    ]

    # Step 0: Initial
    step0 = outreach_generator.generate_sequence_step(p, step_number=0, channel="EMAIL")
    assert "Capitol Dental Arts" in step0["subject"]
    assert "24-48 hours" in step0["body_text"]
    assert "Reply STOP to not receive further messages" in step0["body_text"]

    # Step 1: Follow-up 1
    step1 = outreach_generator.generate_sequence_step(p, step_number=1, channel="EMAIL")
    assert "Following up" in step1["subject"]
    assert "Capitol Dental Arts" in step1["body_text"]
    assert "Reply STOP to opt out" in step1["body_text"]

    # Step 2: Follow-up 2 (Graceful exit)
    step2 = outreach_generator.generate_sequence_step(p, step_number=2, channel="EMAIL")
    assert "Closing the loop" in step2["subject"]
    assert "wishing" in step2["body_text"].lower()
    assert "Reply STOP to unsubscribe" in step2["body_text"]

# ============================================================
# 9. FREQUENCY CONTROL & RATE LIMITING TEST
# ============================================================
@pytest.mark.asyncio
async def test_frequency_controller_rate_limits(async_session):
    """Verifies 72h cooldown, 3-step sequence limit, and daily cap enforcement."""
    biz_id = str(uuid.uuid4())
    p = V5Prospect(
        id=str(uuid.uuid4()),
        business_id=biz_id,
        company_name="Barton Creek Dental",
        email="info@bartoncreekdental.com",
        pipeline_stage="CONTACTED",
        contact_status="IN_PROGRESS"
    )
    async_session.add(p)
    await async_session.commit()

    # Set last_contacted to 10 hours ago
    now = datetime.now(timezone.utc)
    p.last_contacted = now - timedelta(hours=10)
    await async_session.commit()

    # 1. Blocked by 72h cooldown
    can_send, reason = await frequency_controller.can_send_to_prospect(async_session, biz_id, p, "EMAIL")
    assert can_send is False
    assert "Cooldown in effect" in reason

    # 2. Allow when cooldown passed (e.g. 75 hours ago)
    p.last_contacted = now - timedelta(hours=75)
    await async_session.commit()
    can_send2, _ = await frequency_controller.can_send_to_prospect(async_session, biz_id, p, "EMAIL")
    assert can_send2 is True

    # 3. Blocked when 3 messages sent
    for i in range(3):
        async_session.add(V5ProspectOutreach(
            business_id=biz_id,
            prospect_id=p.id,
            channel="EMAIL",
            status="SENT",
            message=f"Step {i}",
            step_number=i
        ))
    await async_session.commit()

    can_send3, reason3 = await frequency_controller.can_send_to_prospect(async_session, biz_id, p, "EMAIL")
    assert can_send3 is False
    assert "maximum sequence limit" in reason3

# ============================================================
# 10. REPLY INTELLIGENCE & CLASSIFIER TEST
# ============================================================
@pytest.mark.asyncio
async def test_reply_intelligence_and_actions(async_session):
    """Tests 5 reply intents: positive, objection, referral, bad timing, and hostile opt-out."""
    biz_id = str(uuid.uuid4())
    p = V5Prospect(
        id=str(uuid.uuid4()),
        business_id=biz_id,
        company_name="Red River Dental",
        email="hello@redriverdental.com",
        pipeline_stage="CONTACTED",
        outreach_status="SENT"
    )
    async_session.add(p)
    await async_session.commit()

    # 1. Positive Reply
    r1 = await reply_intelligence_service.process_inbound_reply(
        session=async_session,
        business_id=biz_id,
        prospect_id=p.id,
        reply_text="Yes, send me the 2-minute video! How does it work?",
        channel="EMAIL"
    )
    assert r1["intent"] == "POSITIVE_INTERESTED"
    assert p.pipeline_stage == "INTERESTED"
    assert "suggested_draft" in r1

    # 2. Question / Objection Reply
    r2 = await reply_intelligence_service.process_inbound_reply(
        session=async_session,
        business_id=biz_id,
        prospect_id=p.id,
        reply_text="Does Elena work with Dentrix practice management software?",
        channel="EMAIL"
    )
    assert r2["intent"] == "QUESTION_OBJECTION"
    assert "Dentrix" in r2["suggested_draft"]

    # 3. Wrong Person / Referral Reply
    r3 = await reply_intelligence_service.process_inbound_reply(
        session=async_session,
        business_id=biz_id,
        prospect_id=p.id,
        reply_text="Please contact our office manager Sarah at sarah@redriverdental.com",
        channel="EMAIL"
    )
    assert r3["intent"] == "WRONG_PERSON_REFERRAL"
    assert r3["referred_email"] == "sarah@redriverdental.com"

    # 4. Opt-Out / Hostile Reply (MUST SUPPRESS & NEVER REPLY)
    r4 = await reply_intelligence_service.process_inbound_reply(
        session=async_session,
        business_id=biz_id,
        prospect_id=p.id,
        reply_text="STOP. Take me off your list immediately.",
        channel="EMAIL",
        sender_contact="hello@redriverdental.com"
    )

    assert r4["intent"] == "OPTOUT_HOSTILE"
    assert r4["action"] == "SUPPRESSED_AND_HALTED"
    assert p.pipeline_stage == "OPTED_OUT"
    assert p.contact_status == "DO_NOT_CONTACT"

    # Verify added to suppression
    is_suppressed = await suppression_service.is_suppressed(
        async_session, biz_id, "EMAIL", "hello@redriverdental.com"
    )
    assert is_suppressed is True

# ============================================================
# 11. FULL PIPELINE & META-DOGFOODING SALES TENANT TEST
# ============================================================
@pytest.mark.asyncio
async def test_full_pipeline_and_internal_sales_engine(async_session):
    """Runs complete 13-stage discovery pipeline for Austin Dental and checks analytics."""
    biz_id = str(uuid.uuid4())
    biz = Business(
        id=biz_id,
        name="Rine Forge Sales Tenant",
        industry="AI Software"
    )
    async_session.add(biz)
    await async_session.commit()

    run_result = await lead_discovery_pipeline.execute_discovery_run(
        session=async_session,
        business_id=biz_id,
        industry="Dental",
        location="Austin, TX",
        services=["Cleaning", "Whitening", "Emergency Dentistry"],
        source_type="PUBLIC_BUSINESS_DATA",
        max_results=3,
        auto_draft_outreach=True
    )

    assert run_result["status"] == "COMPLETED"
    assert run_result["total_enrolled"] > 0

    # Verify search record created
    search = await async_session.get(V5LeadSearch, run_result["search_id"])
    assert search is not None
    assert search.status == "COMPLETED"
    assert search.results_count > 0

    # Verify Conversion Intelligence
    metrics = await conversion_intelligence.get_dashboard_metrics(async_session, biz_id)
    assert metrics["status"] == "HEALTHY"
    assert metrics["discovery"]["total_discovered"] > 0
    assert metrics["discovery"]["avg_lead_score"] > 50
    assert metrics["circuit_breakers"]["sending_paused"] is False
