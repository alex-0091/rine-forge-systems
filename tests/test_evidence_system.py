import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.database import engine, Base, AsyncSessionLocal
from backend.app.models.business import Business
from backend.app.intelligence.evidence import evidence_store

@pytest.mark.asyncio
async def test_evidence_recording_and_retrieval():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        biz = Business(
            name="Harborview Dental",
            normalized_domain="harborviewdental.com",
            industry="Dental",
            country="USA"
        )
        session.add(biz)
        await session.commit()
        await session.refresh(biz)

        # Record multiple verified facts
        ev1 = await evidence_store.record_evidence(
            session=session,
            business_id=biz.id,
            claim_text="Website lacks 24/7 automated booking assistant",
            source_url="https://harborviewdental.com",
            confidence_score=0.95,
            evidence_type="WEBSITE"
        )

        ev2 = await evidence_store.record_evidence(
            session=session,
            business_id=biz.id,
            claim_text="Built on WordPress 6.2 with contact form",
            source_url="https://harborviewdental.com",
            confidence_score=0.98,
            evidence_type="TECH_STACK"
        )
        await session.commit()

        # Retrieve and verify
        evidences = await evidence_store.get_evidence_for_business(session, biz.id)
        assert len(evidences) == 2
        assert any("24/7 automated booking" in e.claim_text for e in evidences)
        assert any("WordPress" in e.claim_text for e in evidences)

        # Summary formatting
        summary = evidence_store.format_evidence_summary(evidences)
        assert "Harborview" not in summary or "24/7" in summary
        assert "[1]" in summary and "[2]" in summary
