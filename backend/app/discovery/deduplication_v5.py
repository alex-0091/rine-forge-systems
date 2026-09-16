"""
Rine Forge Systems V5 - Prospect Deduplication & Merging Service (Module 46)
Ensures zero duplicate prospects per tenant while preserving outreach history,
accumulating observations, and merging multi-source discovery signals.
"""
import re
import logging
from typing import Optional, Dict, Any, Tuple, List
from urllib.parse import urlparse
from sqlalchemy import select, or_
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession


from backend.app.models.v5 import (
    V5Prospect,
    V5ProspectObservation,
    V5ProspectOpportunity
)

logger = logging.getLogger(__name__)

class ProspectDeduplicationService:
    """
    Handles cross-source matching, deduplication, and non-destructive merging
    for V5 prospects strictly scoped to tenant business_id.
    """

    @staticmethod
    def normalize_domain(url: Optional[str]) -> Optional[str]:
        if not url:
            return None
        clean = url.strip().lower()
        if not clean.startswith(("http://", "https://")):
            clean = "http://" + clean
        parsed = urlparse(clean)
        netloc = parsed.netloc or parsed.path
        netloc = re.sub(r'^www\.', '', netloc)
        netloc = netloc.split(':')[0].strip().rstrip('/')
        return netloc if netloc else None

    @staticmethod
    def normalize_phone(phone: Optional[str]) -> Optional[str]:
        if not phone:
            return None
        digits = re.sub(r'\D', '', phone)
        # Keep last 10 digits for US matching
        if len(digits) >= 10:
            return digits[-10:]
        return digits if digits else None

    @staticmethod
    def normalize_name(name: str) -> str:
        clean = re.sub(r'[^\w\s]', '', name.lower())
        clean = re.sub(r'\b(llc|inc|corp|corporation|ltd|co|group|pc|dds|dmd|dr|pllc)\b', '', clean)
        return ' '.join(clean.split())

    async def find_existing_prospect(
        self,
        session: AsyncSession,
        business_id: str,
        company_name: str,
        website: Optional[str] = None,
        email: Optional[str] = None,
        phone: Optional[str] = None,
        city: Optional[str] = None
    ) -> Optional[V5Prospect]:
        """
        Searches for an existing prospect within the tenant using domain, phone, email, or name+city.
        """
        norm_domain = self.normalize_domain(website)
        norm_phone = self.normalize_phone(phone)
        norm_email = email.strip().lower() if email else None
        norm_name = self.normalize_name(company_name)

        # 1. Match by domain if available
        base_query = (
            select(V5Prospect)
            .where(V5Prospect.business_id == business_id)
            .options(
                selectinload(V5Prospect.observations),
                selectinload(V5Prospect.opportunities)
            )
        )

        if norm_domain:
            res = await session.execute(base_query)
            prospects = res.scalars().all()
            for p in prospects:
                if p.website and self.normalize_domain(p.website) == norm_domain:
                    return p

        # 2. Match by email if available
        if norm_email:
            stmt = base_query.where(V5Prospect.email == norm_email)
            res = await session.execute(stmt)
            match = res.scalars().first()
            if match:
                return match

        # 3. Match by phone if available
        if norm_phone:
            res = await session.execute(base_query)
            for p in res.scalars().all():
                if p.phone and self.normalize_phone(p.phone) == norm_phone:
                    return p

        # 4. Match by normalized name + city
        if norm_name and len(norm_name) >= 3:
            res = await session.execute(base_query)
            for p in res.scalars().all():
                existing_norm = self.normalize_name(p.company_name)
                if existing_norm == norm_name:
                    if not city or not p.city or (city.strip().lower() == p.city.strip().lower()):
                        return p

        return None

    async def merge_or_create_prospect(
        self,
        session: AsyncSession,
        business_id: str,
        prospect_data: Dict[str, Any],
        observations: Optional[List[Dict[str, Any]]] = None,
        opportunities: Optional[List[Dict[str, Any]]] = None
    ) -> Tuple[V5Prospect, bool]:
        """
        Atomically merges into existing prospect or creates a new one.
        Returns: (prospect, is_new: bool)
        """
        existing = await self.find_existing_prospect(
            session=session,
            business_id=business_id,
            company_name=prospect_data.get("company_name", ""),
            website=prospect_data.get("website"),
            email=prospect_data.get("email"),
            phone=prospect_data.get("phone"),
            city=prospect_data.get("city")
        )

        obs_list = observations or []
        opp_list = opportunities or []

        if existing:
            # Non-destructive MERGE
            # 1. Update contact fields if existing lacks them
            if not existing.website and prospect_data.get("website"):
                existing.website = prospect_data["website"]
            if not existing.email and prospect_data.get("email"):
                existing.email = prospect_data["email"]
            if not existing.phone and prospect_data.get("phone"):
                existing.phone = prospect_data["phone"]
            if not existing.city and prospect_data.get("city"):
                existing.city = prospect_data["city"]
            if not existing.location and prospect_data.get("location"):
                existing.location = prospect_data["location"]

            # 2. Update score if new score is higher
            new_score = prospect_data.get("score", 0)
            if new_score > existing.score:
                existing.score = new_score
                if prospect_data.get("score_breakdown"):
                    existing.score_breakdown = prospect_data["score_breakdown"]

            # 3. Track multi-source discovery history
            meta = dict(existing.meta_json or {})
            sources = list(meta.get("sources", []))
            new_source = prospect_data.get("source", "UNKNOWN")
            if new_source not in sources:
                sources.append(new_source)
            meta["sources"] = sources
            existing.meta_json = meta
            from sqlalchemy.orm.attributes import flag_modified
            flag_modified(existing, "meta_json")


            # 4. Attach new observations without duplicating
            existing_obs_texts = {obs.observation for obs in existing.observations}
            for o in obs_list:
                if o.get("observation") not in existing_obs_texts:
                    new_obs = V5ProspectObservation(
                        prospect_id=existing.id,
                        observation=o["observation"],
                        source=o.get("source", existing.website or "N/A"),
                        confidence=o.get("confidence", 0.90),
                        category=o.get("category", "WEBSITE_JOURNEY")
                    )
                    existing.observations.append(new_obs)
                    session.add(new_obs)

            # 5. Attach new opportunities
            existing_opp_types = {opp.type for opp in existing.opportunities}
            for op in opp_list:
                if op.get("type") not in existing_opp_types:
                    new_opp = V5ProspectOpportunity(
                        prospect_id=existing.id,
                        type=op["type"],
                        reason=op["reason"],
                        evidence=op.get("evidence", "Observable website audit"),
                        confidence=op.get("confidence", 0.85)
                    )
                    existing.opportunities.append(new_opp)
                    session.add(new_opp)


            await session.commit()
            stmt_reload = select(V5Prospect).where(V5Prospect.id == existing.id).options(
                selectinload(V5Prospect.observations),
                selectinload(V5Prospect.opportunities)
            )
            res_reload = await session.execute(stmt_reload)
            reloaded_existing = res_reload.scalar_one()
            logger.info(f"Merged discovery data into existing prospect {reloaded_existing.id} ({reloaded_existing.company_name})")
            return reloaded_existing, False

        else:
            # Create NEW Prospect
            meta = prospect_data.get("meta_json", {})
            meta["sources"] = [prospect_data.get("source", "UNKNOWN")]

            new_prospect = V5Prospect(
                business_id=business_id,
                prospect_type=prospect_data.get("prospect_type", "B2B_BUSINESS"),
                company_name=prospect_data["company_name"],
                website=prospect_data.get("website"),
                industry=prospect_data.get("industry", "General"),
                location=prospect_data.get("location"),
                city=prospect_data.get("city"),
                state=prospect_data.get("state"),
                country=prospect_data.get("country", "USA"),
                email=prospect_data.get("email"),
                phone=prospect_data.get("phone"),
                social_links=prospect_data.get("social_links", {}),
                source=prospect_data.get("source", "PUBLIC_BUSINESS_DATA"),
                source_url=prospect_data.get("source_url"),
                score=prospect_data.get("score", 50),
                score_breakdown=prospect_data.get("score_breakdown", {}),
                outreach_status="DRAFT",
                contact_status="UNCONTACTED",
                consent_status=prospect_data.get("consent_status", "PUBLIC_COMMERCIAL"),
                pipeline_stage="DISCOVERED",
                review_mode=prospect_data.get("review_mode", "REVIEW"),
                next_action="WEBSITE_AUDIT_COMPLETE",
                meta_json=meta
            )
            session.add(new_prospect)
            await session.flush() # Populate new_prospect.id

            # Add observations
            for o in obs_list:
                session.add(V5ProspectObservation(
                    prospect_id=new_prospect.id,
                    observation=o["observation"],
                    source=o.get("source", new_prospect.website or "N/A"),
                    confidence=o.get("confidence", 0.90),
                    category=o.get("category", "WEBSITE_JOURNEY")
                ))

            # Add opportunities
            for op in opp_list:
                session.add(V5ProspectOpportunity(
                    prospect_id=new_prospect.id,
                    type=op["type"],
                    reason=op["reason"],
                    evidence=op.get("evidence", "Observable website audit"),
                    confidence=op.get("confidence", 0.85)
                ))

            await session.commit()
            stmt_new = select(V5Prospect).where(V5Prospect.id == new_prospect.id).options(
                selectinload(V5Prospect.observations),
                selectinload(V5Prospect.opportunities)
            )
            res_new = await session.execute(stmt_new)
            reloaded_new = res_new.scalar_one()
            logger.info(f"Created new prospect {reloaded_new.id} ({reloaded_new.company_name})")
            return reloaded_new, True


prospect_deduplicator = ProspectDeduplicationService()
