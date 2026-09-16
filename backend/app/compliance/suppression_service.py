"""
Rine Forge Systems V5 - Multi-Tenant Suppression & Do-Not-Contact Service (Module 50)
Guarantees absolute compliance by verifying every recipient against opt-outs,
platform blocks, domain blocks, and internal blacklists before any message is sent.
"""
import re
import logging
from typing import Optional, Dict, Any, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.models.v5 import SuppressionEntry

logger = logging.getLogger("rine_forge_systems.compliance.suppression")

class SuppressionService:
    """
    Multi-tenant suppression engine enforcing zero outbound delivery to opted-out entities.
    """

    OPTOUT_KEYWORDS = [
        r"\bstop\b", r"\bunsubscribe\b", r"\bcancel\b", r"\bend\b",
        r"\bquit\b", r"\bremove me\b", r"\bopt out\b", r"\bdo not contact\b",
        r"\bleave me alone\b", r"\bnot interested\b"
    ]

    def is_optout_message(self, message_text: str) -> bool:
        """Detects if an incoming message signals an opt-out intent."""
        text_lower = message_text.lower().strip()
        return any(re.search(pat, text_lower) for pat in self.OPTOUT_KEYWORDS)

    async def add_suppression(
        self,
        session: AsyncSession,
        business_id: str,
        entry_type: str, # EMAIL, PHONE, SOCIAL_ID, DOMAIN
        value: str,
        reason: str = "USER_OPTOUT"
    ) -> SuppressionEntry:
        """Adds a normalized entry to the tenant's suppression list."""
        norm_val = value.strip().lower()
        if entry_type == "EMAIL" and "@" in norm_val:
            domain = norm_val.split("@")[-1]
            norm_val = norm_val # Keep full email
        elif entry_type == "PHONE":
            norm_val = re.sub(r"[^\d+]", "", norm_val)

        # Check existing
        stmt = select(SuppressionEntry).where(
            SuppressionEntry.business_id == business_id,
            SuppressionEntry.entry_type == entry_type.upper(),
            SuppressionEntry.value == norm_val
        )
        res = await session.execute(stmt)
        existing = res.scalar_one_or_none()

        if existing:
            return existing

        entry = SuppressionEntry(
            business_id=business_id,
            entry_type=entry_type.upper(),
            value=norm_val,
            reason=reason
        )
        session.add(entry)
        await session.flush()
        logger.info(f"Tenant {business_id}: Suppressed {entry_type} '{norm_val}' (Reason: {reason})")
        return entry

    def contains_opt_out_keyword(self, message_text: str) -> bool:
        """Alias for is_optout_message."""
        return self.is_optout_message(message_text)

    async def add_to_suppression(
        self,
        session: AsyncSession,
        business_id: str,
        entry_type: str,
        value: str,
        reason: str = "USER_OPTOUT"
    ) -> SuppressionEntry:
        """Alias for add_suppression."""
        return await self.add_suppression(session, business_id, entry_type, value, reason)

    async def is_suppressed(
        self,
        session: AsyncSession,
        business_id: str,
        entry_type: Optional[str] = None,
        value: Optional[str] = None,
        email: Optional[str] = None,
        phone: Optional[str] = None,
        domain: Optional[str] = None,
        social_id: Optional[str] = None
    ) -> bool:
        """
        Returns True if the recipient/domain is suppressed, False otherwise.
        """
        report = await self.check_suppression(
            session=session,
            business_id=business_id,
            entry_type=entry_type,
            value=value,
            email=email,
            phone=phone,
            domain=domain,
            social_id=social_id
        )
        return bool(report.get("suppressed", False))

    async def check_suppression(
        self,
        session: AsyncSession,
        business_id: str,
        entry_type: Optional[str] = None,
        value: Optional[str] = None,
        email: Optional[str] = None,
        phone: Optional[str] = None,
        domain: Optional[str] = None,
        social_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Detailed pre-flight check returning metadata dict.
        """
        values_to_check = []

        if entry_type and value:
            norm_v = value.strip().lower()
            values_to_check.append((entry_type.upper(), norm_v))
            if entry_type.upper() == "EMAIL" and "@" in norm_v:
                values_to_check.append(("DOMAIN", norm_v.split("@")[-1]))
        elif entry_type and not value:
            val = entry_type.strip().lower()
            if "@" in val:
                values_to_check.append(("EMAIL", val))
                values_to_check.append(("DOMAIN", val.split("@")[-1]))
            else:
                values_to_check.append(("PHONE", re.sub(r"[^\d+]", "", val)))

        if email:
            norm_email = email.strip().lower()
            values_to_check.append(("EMAIL", norm_email))
            if "@" in norm_email:
                values_to_check.append(("DOMAIN", norm_email.split("@")[-1]))

        if phone:
            norm_phone = re.sub(r"[^\d+]", "", phone.strip())
            values_to_check.append(("PHONE", norm_phone))

        if social_id:
            values_to_check.append(("SOCIAL_ID", social_id.strip().lower()))

        if domain:
            values_to_check.append(("DOMAIN", domain.strip().lower()))


        if phone:
            norm_phone = re.sub(r"[^\d+]", "", phone.strip())
            values_to_check.append(("PHONE", norm_phone))

        if social_id:
            values_to_check.append(("SOCIAL_ID", social_id.strip().lower()))

        if domain:
            values_to_check.append(("DOMAIN", domain.strip().lower()))

        for e_type, val in values_to_check:
            stmt = select(SuppressionEntry).where(
                SuppressionEntry.business_id == business_id,
                SuppressionEntry.entry_type == e_type,
                SuppressionEntry.value == val
            )
            res = await session.execute(stmt)
            match = res.scalar_one_or_none()
            if match:
                logger.warning(f"Outbound blocked by suppression: {e_type}='{val}' reason={match.reason}")
                return {
                    "suppressed": True,
                    "reason": match.reason,
                    "matched_value": val,
                    "entry_type": e_type
                }

        return {"suppressed": False, "reason": None, "matched_value": None}

suppression_service = SuppressionService()

