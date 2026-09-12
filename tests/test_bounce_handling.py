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
async def test_hard_bounce_suppression(async_session: AsyncSession):
    bounced_email = "invalid-mailbox-550@domain.com"
    
    # Process hard bounce
    await suppression_manager.add_suppression(
        session=async_session,
        value=bounced_email,
        entry_type="EMAIL",
        reason="HARD_BOUNCE",
        notes="550 5.1.1 User unknown"
    )

    # Verify recipient is permanently blocked
    is_blocked = await suppression_manager.is_suppressed(async_session, email=bounced_email)
    assert is_blocked is True
