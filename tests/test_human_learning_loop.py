import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.database import engine, Base, AsyncSessionLocal
from backend.app.models.inbox import Conversation, Reply
from backend.app.inbox.learning_loop import human_correction_store
from backend.app.inbox.buying_signals import buying_signal_extractor

@pytest.mark.asyncio
async def test_human_correction_recording():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        conv = Conversation(contact_email="client@practice.com", subject="Question about AI")
        session.add(conv)
        await session.commit()
        await session.refresh(conv)

        ai_draft = "Dear Sir/Madam,\nI hope this email finds you well. We are a premier provider of automated solutions."
        owais_edit = "Hi Sarah,\nSaw your note about weekend coverage. We set up 24/7 AI booking that syncs with Calendly. Free Thursday at 2pm?"

        correction = await human_correction_store.record_human_correction(
            session=session,
            conversation_id=conv.id,
            reply_id=None,
            ai_draft=ai_draft,
            owais_edit=owais_edit,
            reason="Removed boilerplate corporate tone, added direct call question"
        )
        await session.commit()

        assert correction is not None
        assert "Removed" in correction.diff_summary
        assert correction.owais_edit == owais_edit

        # Test exemplar retrieval
        exemplars = await human_correction_store.get_recent_exemplars(session, limit=5)
        assert len(exemplars) >= 1
        assert exemplars[0]["owais_preferred_style"] == owais_edit

def test_buying_signals_extraction():
    # 1. Call request
    res1 = buying_signal_extractor.analyze_signals("Let's hop on a quick call this Thursday. Send over your calendar link.")
    assert res1["has_buying_signal"] is True
    assert "DEMO_OR_CALL_REQUEST" in res1["signals"]
    assert res1["urgency"] == "HIGH"

    # 2. Pricing request
    res2 = buying_signal_extractor.analyze_signals("How much does this cost for a 3-location clinic? Send a quote.")
    assert res2["has_buying_signal"] is True
    assert "PRICING_INQUIRY" in res2["signals"]

    # 3. Non-buying signal
    res3 = buying_signal_extractor.analyze_signals("Thanks, we will keep you in mind for next quarter.")
    assert res3["has_buying_signal"] is False
    assert res3["urgency"] == "NORMAL"
