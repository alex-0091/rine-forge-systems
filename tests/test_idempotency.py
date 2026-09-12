import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.database import engine, Base, AsyncSessionLocal
from backend.app.models.business import Business
from backend.app.models.campaign import Campaign, CampaignMember, OutreachMessage
from backend.app.outreach.queue import queue_worker

@pytest.mark.asyncio
async def test_idempotency_prevents_duplicate_sends():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        biz = Business(name="Idempotency Corp", primary_email="test@idempotency.com")
        session.add(biz)
        await session.commit()
        await session.refresh(biz)

        camp = Campaign(name="Idempotency Test Campaign", target_country="USA", target_industry="General")
        session.add(camp)
        await session.commit()
        await session.refresh(camp)

        member = CampaignMember(campaign_id=camp.id, business_id=biz.id)
        session.add(member)
        await session.commit()
        await session.refresh(member)

        # Create first message with unique idempotency_key
        key = f"{member.id}_step_1"
        msg1 = OutreachMessage(
            campaign_member_id=member.id,
            step_number=1,
            recipient_email="test@idempotency.com",
            recipient_name="Alex Owner",
            subject="First Step",
            body_text="Hello!",
            idempotency_key=key,
            status="QUEUED",
            is_dry_run=True
        )
        session.add(msg1)
        await session.commit()
        await session.refresh(msg1)

        # Dispatch first message
        res1 = await queue_worker.dispatch_message(session, msg1.id, manual_override=True)
        assert res1["success"] is True
        assert res1["status"] == "SENT"

        # Attempting to insert a duplicate message with the exact same idempotency_key triggers IntegrityError at DB level
        msg2 = OutreachMessage(
            campaign_member_id=member.id,
            step_number=1,
            recipient_email="test@idempotency.com",
            recipient_name="Alex Owner",
            subject="Duplicate Step",
            body_text="Hello again!",
            idempotency_key=key,
            status="QUEUED",
            is_dry_run=True
        )
        session.add(msg2)
        with pytest.raises(Exception):
            await session.commit()
