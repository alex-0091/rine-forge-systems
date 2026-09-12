import re
import logging
from typing import Optional, Set
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.models.compliance import SuppressionEntry, AuditLog

logger = logging.getLogger(__name__)

OPTOUT_KEYWORDS = [
    "stop", "unsubscribe", "remove me", "don't email", "do not email", 
    "leave me alone", "take me off", "cease", "no more emails", "opt out", "opt-out"
]

class SuppressionManager:
    """
    Guarantees that suppressed emails, domains, or companies are never contacted under any circumstance.
    """
    
    @staticmethod
    def is_optout_intent(text: str) -> bool:
        lower = text.lower()
        return any(kw in lower for kw in OPTOUT_KEYWORDS)

    @classmethod
    async def is_suppressed(cls, session: AsyncSession, email: str, domain: Optional[str] = None, company: Optional[str] = None) -> bool:
        email_clean = email.strip().lower() if email else ""
        
        # Check email
        res = await session.execute(
            select(SuppressionEntry).where(SuppressionEntry.value == email_clean)
        )
        if res.scalar_one_or_none():
            return True
            
        # Check domain
        if domain:
            dom_clean = domain.strip().lower()
            res = await session.execute(
                select(SuppressionEntry).where(SuppressionEntry.value == dom_clean)
            )
            if res.scalar_one_or_none():
                return True
        elif "@" in email_clean:
            dom_clean = email_clean.split("@")[-1]
            res = await session.execute(
                select(SuppressionEntry).where(SuppressionEntry.value == dom_clean)
            )
            if res.scalar_one_or_none():
                return True
                
        # Check company
        if company:
            comp_clean = company.strip().lower()
            res = await session.execute(
                select(SuppressionEntry).where(SuppressionEntry.value == comp_clean)
            )
            if res.scalar_one_or_none():
                return True

        return False

    @classmethod
    async def add_suppression(
        cls, 
        session: AsyncSession, 
        value: str, 
        entry_type: str = "EMAIL", 
        reason: str = "USER_OPTOUT", 
        source: str = "inbound_reply",
        notes: Optional[str] = None
    ) -> SuppressionEntry:
        clean_val = value.strip().lower()
        
        # Check if already exists
        existing = await session.execute(
            select(SuppressionEntry).where(SuppressionEntry.value == clean_val)
        )
        entry = existing.scalar_one_or_none()
        if entry:
            return entry
            
        new_entry = SuppressionEntry(
            entry_type=entry_type.upper(),
            value=clean_val,
            reason=reason,
            source=source,
            notes=notes
        )
        session.add(new_entry)
        
        # Add Audit Log
        audit = AuditLog(
            event_type="SUPPRESSION_TRIGGERED",
            actor="suppression_manager",
            entity_type="suppression",
            description=f"Suppressed {entry_type} '{clean_val}' for reason: {reason}"
        )
        session.add(audit)
        
        await session.commit()
        await session.refresh(new_entry)
        logger.info(f"🚫 Added suppression entry: {clean_val} ({reason})")
        return new_entry

suppression_manager = SuppressionManager()
