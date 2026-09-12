import pytest
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from backend.app.database import Base
from backend.app.models.business import Business, Contact
from backend.app.models.intelligence import PainPoint, AIOpportunity
from backend.app.models.campaign import Campaign, CampaignMember
from backend.app.ai.pipeline import outreach_pipeline

@pytest.fixture
async def async_session():
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    session_factory = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)
    async with session_factory() as session:
        yield session

@pytest.mark.asyncio
async def test_outreach_generation_anti_hallucination(async_session: AsyncSession):
    biz = Business(
        name="Apex Dental Care",
        normalized_name="apex dental care",
        industry="Dental",
        country="USA",
        city="Chicago",
        primary_email="info@apexdentalcare.com"
    )
    async_session.add(biz)
    await async_session.flush()

    contact = Contact(
        business_id=biz.id,
        full_name="Dr. Alex Rivera",
        first_name="Alex",
        role_title="Lead Dentist",
        email="info@apexdentalcare.com"
    )
    async_session.add(contact)

    pain = PainPoint(
        business_id=biz.id,
        observed_fact="Online appointment booking exists, but after-hours inquiries require manual voicemail callback",
        business_problem="Lost patient bookings during evenings and weekends",
        severity_score=85
    )
    async_session.add(pain)

    opp = AIOpportunity(
        business_id=biz.id,
        solution_name="AI Patient Receptionist",
        service_category="AI Receptionists",
        pain_point_addressed=pain.observed_fact,
        business_benefit="Captures after-hours patient inquiries 24/7",
        overall_score=90.0
    )
    async_session.add(opp)

    camp = Campaign(name="USA Dental Test", target_country="USA", target_industry="Dental")
    async_session.add(camp)
    await async_session.flush()

    member = CampaignMember(campaign_id=camp.id, business_id=biz.id)
    async_session.add(member)
    await async_session.commit()

    # Generate message
    msg, meta = await outreach_pipeline.generate_message_for_lead(
        session=async_session,
        campaign_member=member,
        business=biz,
        contact=contact,
        pain_point=pain,
        opportunity=opp,
        is_dry_run=True
    )

    assert msg is not None
    assert meta["success"] is True
    assert "Apex Dental Care" in msg.body_text or "after-hours" in msg.body_text.lower()
    assert msg.quality_score >= 80
    assert msg.compliance_passed is True
    assert msg.is_dry_run is True
