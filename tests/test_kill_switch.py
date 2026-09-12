import pytest
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from backend.app.database import Base
from backend.app.kill_switch import kill_switch
from backend.app.outreach.queue import queue_worker
from backend.app.models.campaign import OutreachMessage

@pytest.fixture
async def async_session():
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    session_factory = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)
    async with session_factory() as session:
        yield session

@pytest.mark.asyncio
async def test_kill_switch_halts_queue(async_session: AsyncSession):
    # Activate Kill Switch
    kill_switch.activate(reason="Test Emergency Pause", actor="owais")
    assert kill_switch.is_paused() is True

    # Attempt to dispatch message
    res = await queue_worker.dispatch_message(
        session=async_session,
        message_id="fake-msg-id"
    )

    assert res["success"] is False
    assert res["status"] == "HALTED_BY_KILL_SWITCH"

    # Deactivate Kill Switch
    kill_switch.deactivate(actor="owais")
    assert kill_switch.is_paused() is False
