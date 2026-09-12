import difflib
import logging
from typing import List, Optional, Dict, Any
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.models.inbox import HumanCorrection

logger = logging.getLogger(__name__)

class HumanCorrectionStore:
    """
    Continuous Learning Loop:
    Records when Owais edits AI-generated replies or outreach copy,
    tracks tone/style adjustments, and surfaces few-shot exemplars for prompt conditioning.
    """

    @classmethod
    async def record_human_correction(
        cls,
        session: AsyncSession,
        conversation_id: str,
        reply_id: Optional[str],
        ai_draft: str,
        owais_edit: str,
        reason: Optional[str] = None
    ) -> Optional[HumanCorrection]:
        if not ai_draft or not owais_edit or ai_draft.strip() == owais_edit.strip():
            return None

        # Compute diff summary
        diff = difflib.ndiff(ai_draft.splitlines(), owais_edit.splitlines())
        added = [line[2:] for line in diff if line.startswith('+ ')]
        removed = [line[2:] for line in diff if line.startswith('- ')]
        diff_summary = f"Removed {len(removed)} lines, Added {len(added)} lines."

        correction = HumanCorrection(
            conversation_id=conversation_id,
            reply_id=reply_id,
            ai_draft=ai_draft.strip(),
            owais_edit=owais_edit.strip(),
            diff_summary=diff_summary,
            reason=reason or "Manual refinement by Owais"
        )
        session.add(correction)
        await session.flush()
        logger.info(f"Learned from human edit on conversation {conversation_id}: {diff_summary}")
        return correction

    @classmethod
    async def get_recent_exemplars(cls, session: AsyncSession, limit: int = 3) -> List[Dict[str, str]]:
        stmt = select(HumanCorrection).order_by(HumanCorrection.created_at.desc()).limit(limit)
        res = await session.execute(stmt)
        corrections = res.scalars().all()
        
        exemplars = []
        for c in corrections:
            exemplars.append({
                "original_ai_draft": c.ai_draft,
                "owais_preferred_style": c.owais_edit,
                "notes": c.reason or "Shortened and personalized"
            })
        return exemplars

human_correction_store = HumanCorrectionStore()
