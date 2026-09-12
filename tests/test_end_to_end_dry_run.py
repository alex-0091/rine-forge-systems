import pytest
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from backend.app.database import Base
from backend.app.models.business import Business
from backend.app.models.campaign import Campaign, CampaignMember, OutreachMessage
from backend.app.models.inbox import Conversation, SystemAlert
from backend.app.discovery.engine import discovery_engine
from backend.app.research.engine import research_engine
from backend.app.intelligence.pain_point_engine import pain_point_engine
from backend.app.intelligence.opportunity_scorer import opportunity_scorer
from backend.app.intelligence.lead_scorer import lead_scorer
from backend.app.ai.pipeline import outreach_pipeline
from backend.app.outreach.queue import queue_worker
from backend.app.inbox.reply_monitor import reply_monitor

@pytest.fixture
async def async_session():
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    session_factory = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)
    async with session_factory() as session:
        yield session

@pytest.mark.asyncio
async def test_full_end_to_end_dry_run_pipeline(async_session: AsyncSession):
    # Step 1: Discover Businesses
    discovery_res = await discovery_engine.run_discovery(
        session=async_session,
        industry="Dental",
        country="USA",
        limit=2
    )
    assert discovery_res["ingested_count"] >= 1
    biz_id = discovery_res["ingested_ids"][0]

    # Fetch business
    stmt = select(Business).options(selectinload(Business.contacts)).where(Business.id == biz_id)
    biz = (await async_session.execute(stmt)).scalars().first()
    assert biz is not None

    # Step 2: Website Research
    research = await research_engine.conduct_research(session=async_session, business=biz)
    assert research is not None
    assert len(research.verified_facts) > 0

    # Step 3: Pain Point Detection
    pain_points = await pain_point_engine.analyze_pain_points(session=async_session, business=biz, research=research)
    assert len(pain_points) > 0

    # Step 4: AI Opportunity Scoring
    opportunities = await opportunity_scorer.detect_opportunities(session=async_session, business=biz, pain_points=pain_points)
    assert len(opportunities) > 0
    assert opportunities[0].overall_score >= 80

    # Step 5: 0-100 Lead Score
    score = await lead_scorer.score_lead(session=async_session, business=biz, pain_points=pain_points, opportunities=opportunities)
    assert score.total_score >= 75
    assert score.is_qualified_for_outreach is True

    # Step 6: Create Campaign & Enroll Member
    camp = Campaign(
        name="USA Dental Q3 Campaign",
        target_country="USA",
        target_industry="Dental",
        min_lead_score=75,
        primary_offer="AI Receptionist",
        is_dry_run=True,
        status="ACTIVE"
    )
    async_session.add(camp)
    await async_session.flush()

    member = CampaignMember(
        campaign_id=camp.id,
        business_id=biz.id,
        contact_id=biz.contacts[0].id if biz.contacts else None,
        status="QUEUED"
    )
    async_session.add(member)
    await async_session.commit()

    # Step 7: Anti-Hallucinatory Outreach Generation
    msg, gen_meta = await outreach_pipeline.generate_message_for_lead(
        session=async_session,
        campaign_member=member,
        business=biz,
        contact=biz.contacts[0] if biz.contacts else None,
        pain_point=pain_points[0],
        opportunity=opportunities[0],
        is_dry_run=True
    )
    assert msg is not None
    assert msg.quality_score >= 85
    assert msg.compliance_passed is True

    # Step 8: Controlled Dispatch in Dry Run Mode
    dispatch_res = await queue_worker.dispatch_message(session=async_session, message_id=msg.id)
    assert dispatch_res["success"] is True
    assert dispatch_res["status"] == "SENT"
    assert dispatch_res["dispatch"]["dry_run"] is True

    # Step 9: Inbound Reply Receipt & Intent Classification
    reply_res = await reply_monitor.process_inbound_reply(
        session=async_session,
        sender_email=biz.primary_email,
        subject="re: " + msg.subject,
        body_text="Hi Owais, this looks interesting for our clinic. How much does the AI receptionist cost to set up?"
    )

    assert reply_res["classification"] == "PRICE_REQUEST"
    assert reply_res["intent_score"] >= 80
    assert reply_res["human_action_required"] is True

    # Step 10: Verify Escalation Alert
    alert_stmt = select(SystemAlert).where(SystemAlert.alert_type == "HIGH_INTENT_LEAD")
    alert = (await async_session.execute(alert_stmt)).scalars().first()
    assert alert is not None
    assert "OWAIS: HUMAN ACTION REQUIRED" in alert.title
