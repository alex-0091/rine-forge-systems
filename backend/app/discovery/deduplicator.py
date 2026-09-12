import logging
from typing import Optional
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.models.business import Business, Contact
from backend.app.discovery.normalizer import normalizer

logger = logging.getLogger(__name__)

class LeadDeduplicator:
    """
    Checks if a lead already exists in the database by normalized domain, normalized name, or email.
    """

    @classmethod
    async def find_existing_business(
        cls, 
        session: AsyncSession, 
        name: str, 
        website_url: Optional[str] = None, 
        email: Optional[str] = None
    ) -> Optional[Business]:
        norm_name = normalizer.normalize_company_name(name)
        norm_domain = normalizer.normalize_domain(website_url) if website_url else None
        norm_email = normalizer.normalize_email(email) if email else None

        # 1. Match by domain if available
        if norm_domain:
            stmt = select(Business).where(Business.normalized_domain == norm_domain)
            res = await session.execute(stmt)
            biz = res.scalars().first()
            if biz:
                logger.debug(f"Lead deduplication match on domain: {norm_domain}")
                return biz

        # 2. Match by email if available
        if norm_email:
            stmt = select(Business).where(Business.primary_email == norm_email)
            res = await session.execute(stmt)
            biz = res.scalars().first()
            if biz:
                logger.debug(f"Lead deduplication match on primary email: {norm_email}")
                return biz

        # 3. Match by normalized name and country
        if norm_name and len(norm_name) >= 3:
            stmt = select(Business).where(Business.normalized_name == norm_name)
            res = await session.execute(stmt)
            biz = res.scalars().first()
            if biz:
                logger.debug(f"Lead deduplication match on normalized name: {norm_name}")
                return biz

        return None

deduplicator = LeadDeduplicator()
