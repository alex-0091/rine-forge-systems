import pytest
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from backend.app.database import Base
from backend.app.models.business import Business
from backend.app.models.campaign import Campaign, CampaignMember, OutreachMessage
from backend.app.inbox.reply_monitor import reply_monitor
from backend.app.compliance.suppression import suppression_manager

@pytest.fixture
async def async_session():
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    session_factory = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)
    async with session_factory() as session:
        yield session

@pytest.mark.asyncio
async def test_reply_stops_followups_and_triggers_escalation(async_session: AsyncSession):
    # Setup business, campaign, member, and queued follow-up
    biz = Business(
        name="Sunny Dental Clinic",
        normalized_name="sunny dental clinic",
        industry="Dental",
        country="USA",
        primary_email="contact@sunnydental.com"
    )
    async_session.add(biz)
    await async_session.flush()

    camp = Campaign(name="USA Dental Campaign", target_country="USA", target_industry="Dental")
    async_session.add(camp)
    await async_session.flush()

    member = CampaignMember(campaign_id=camp.id, business_id=biz.id, status="IN_SEQUENCE")
    async_session.add(member)
    await async_session.flush()

    msg_followup = OutreachMessage(
        campaign_member_id=member.id,
        step_number=2,
        recipient_email=biz.primary_email,
        recipient_name="Dr. Smith",
        subject="re: quick idea for Sunny Dental",
        body_text="Following up...",
        status="QUEUED"
    )
    async_session.add(msg_followup)
    await async_session.commit()

    # Process high-intent reply: pricing request
    result = await reply_monitor.process_inbound_reply(
        session=async_session,
        sender_email="contact@sunnydental.com",
        subject="re: quick idea for Sunny Dental",
        body_text="Sounds very interesting. How much does the AI receptionist cost per month?"
    )

    # 1. Classification & Escalation
    assert result["classification"] == "PRICE_REQUEST"
    assert result["human_action_required"] is True
    assert result["intent_score"] >= 80

    # 2. Check that pending follow-up was cancelled
    await async_session.refresh(msg_followup)
    assert msg_followup.status == "CANCELLED"

    # 3. Check member status updated
    await async_session.refresh(member)
    assert member.status == "REPLIED"

@pytest.mark.asyncio
async def test_reply_with_optout_triggers_suppression(async_session: AsyncSession):
    # Process unsubscribe reply
    result = await reply_monitor.process_inbound_reply(
        session=async_session,
        sender_email="optmeout@domain.com",
        subject="unsubscribe",
        body_text="Please stop emailing me. Remove me from your mailing list."
    )

    assert result["classification"] == "STOP"
    assert result["suppressed"] is True

    # Check suppression list
    is_supp = await suppression_manager.is_suppressed(async_session, email="optmeout@domain.com")
    assert is_supp is True
