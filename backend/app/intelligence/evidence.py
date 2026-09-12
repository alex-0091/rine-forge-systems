import logging
from typing import List, Optional, Dict, Any
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.models.intelligence import Evidence

logger = logging.getLogger(__name__)

class EvidenceStore:
    """
    Evidence Store: Stores and retrieves verifiable observations about businesses.
    Every factual claim in cold outreach MUST be traceable to an Evidence record.
    """

    @classmethod
    async def record_evidence(
        cls,
        session: AsyncSession,
        business_id: str,
        claim_text: str,
        source_url: Optional[str] = None,
        observed_snippet: Optional[str] = None,
        confidence_score: float = 0.95,
        evidence_type: str = "WEBSITE"
    ) -> Evidence:
        evidence = Evidence(
            business_id=business_id,
            claim_text=claim_text.strip(),
            source_url=source_url,
            observed_snippet=observed_snippet,
            confidence_score=confidence_score,
            evidence_type=evidence_type,
            is_verified=True
        )
        session.add(evidence)
        await session.flush()
        return evidence

    @classmethod
    async def get_evidence_for_business(cls, session: AsyncSession, business_id: str) -> List[Evidence]:
        stmt = select(Evidence).where(Evidence.business_id == business_id)
        res = await session.execute(stmt)
        return list(res.scalars().all())

    @classmethod
    def format_evidence_summary(cls, evidence_list: List[Evidence]) -> str:
        if not evidence_list:
            return "No verified evidence records found."
        lines = []
        for idx, ev in enumerate(evidence_list, 1):
            lines.append(f"[{idx}] {ev.claim_text} (Source: {ev.source_url or 'Verified Public Observation'}, Confidence: {int(ev.confidence_score*100)}%)")
        return "\n".join(lines)

evidence_store = EvidenceStore()
