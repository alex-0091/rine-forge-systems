import pytest
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from backend.app.database import Base
from backend.app.compliance.engine import compliance_engine
from backend.app.compliance.country_policies import get_country_policy

@pytest.fixture
async def async_session():
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    session_factory = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)
    async with session_factory() as session:
        yield session

@pytest.mark.asyncio
async def test_country_compliance_policies(async_session: AsyncSession):
    # USA: Should pass standard compliant message
    passed_us, details_us = await compliance_engine.evaluate_lead_and_message(
        session=async_session,
        recipient_email="dr.smith@usadental.com",
        country="USA",
        subject="quick idea for USA Dental",
        body_text="Hi Dr. Smith,\n\nWe build AI receptionists for dental practices.\n\nBest,\nOwais\nOwais AI"
    )
    assert passed_us is True

    # Australia: Must be blocked / restricted pending compliance
    passed_au, details_au = await compliance_engine.evaluate_lead_and_message(
        session=async_session,
        recipient_email="contact@sydneydentist.com.au",
        country="Australia",
        subject="quick inquiry for Sydney Practice",
        body_text="Hi there,\n\nWe build AI receptionists.\n\nBest,\nOwais"
    )
    assert passed_au is False
    assert "Australia" in details_au["reason"]

    # Spam phrases: Must be blocked
    passed_spam, details_spam = await compliance_engine.evaluate_lead_and_message(
        session=async_session,
        recipient_email="dr.smith@usadental.com",
        country="USA",
        subject="GUARANTEED 10X REVENUE",
        body_text="ACT NOW OR LOSE OUT! 100% FREE $$$"
    )
    assert passed_spam is False
