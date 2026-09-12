import pytest
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from backend.app.database import Base
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
async def test_suppression_enforcement(async_session: AsyncSession):
    # Add email suppression
    await suppression_manager.add_suppression(
        session=async_session,
        value="optout@example.com",
        entry_type="EMAIL",
        reason="USER_OPTOUT"
    )

    # Add domain suppression
    await suppression_manager.add_suppression(
        session=async_session,
        value="badcorp.com",
        entry_type="DOMAIN",
        reason="COMPLAINT"
    )

    # 1. Exact email check
    assert await suppression_manager.is_suppressed(async_session, email="optout@example.com") is True
    assert await suppression_manager.is_suppressed(async_session, email="OPTOUT@EXAMPLE.COM") is True

    # 2. Domain matching
    assert await suppression_manager.is_suppressed(async_session, email="ceo@badcorp.com") is True
    assert await suppression_manager.is_suppressed(async_session, email="sales@other.com", domain="badcorp.com") is True

    # 3. Clean recipient
    assert await suppression_manager.is_suppressed(async_session, email="clean@allowed.com") is False

@pytest.mark.asyncio
async def test_optout_keyword_detection():
    assert suppression_manager.is_optout_intent("Please unsubscribe me immediately.") is True
    assert suppression_manager.is_optout_intent("STOP sending emails to this address") is True
    assert suppression_manager.is_optout_intent("Remove me from your list") is True
    assert suppression_manager.is_optout_intent("Sounds interesting, how much does it cost?") is False
