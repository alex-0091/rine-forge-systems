import logging
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.models.business import Business, Contact
from backend.app.models.compliance import AuditLog
from backend.app.discovery.base import LeadSource, DiscoveredLead
from backend.app.discovery.normalizer import normalizer
from backend.app.discovery.deduplicator import deduplicator
from backend.app.discovery.validator import validator
from backend.app.discovery.sources.curated import CuratedDirectorySource

logger = logging.getLogger(__name__)

class LeadDiscoveryEngine:
    """
    Modular discovery pipeline:
    LeadSource -> LeadValidator -> LeadNormalizer -> LeadDeduplicator -> Database Ingestion
    """

    def __init__(self, default_source: Optional[LeadSource] = None):
        self.default_source = default_source or CuratedDirectorySource()

    async def run_discovery(
        self,
        session: AsyncSession,
        industry: str,
        country: str,
        limit: int = 10,
        source: Optional[LeadSource] = None
    ) -> Dict[str, Any]:
        active_source = source or self.default_source
        raw_leads: List[DiscoveredLead] = await active_source.discover_leads(industry=industry, country=country, limit=limit)
        
        discovered_count = len(raw_leads)
        valid_count = 0
        deduped_count = 0
        ingested_businesses: List[Business] = []

        for lead in raw_leads:
            # 1. Validation
            is_valid, error_msg = validator.validate_lead(lead)
            if not is_valid:
                logger.warning(f"Discarding invalid lead '{lead.name}': {error_msg}")
                continue
            valid_count += 1

            # 2. Normalization
            norm_name = normalizer.normalize_company_name(lead.name)
            norm_domain = normalizer.normalize_domain(lead.website_url)
            norm_email = normalizer.normalize_email(lead.primary_email)

            # 3. Deduplication Check
            existing = await deduplicator.find_existing_business(
                session=session,
                name=lead.name,
                website_url=lead.website_url,
                email=lead.primary_email
            )
            if existing:
                logger.info(f"Skipping duplicate business '{lead.name}' (already exists with ID: {existing.id})")
                deduped_count += 1
                continue

            # 4. Ingest Business & Primary Contact
            biz = Business(
                name=lead.name,
                normalized_name=norm_name,
                industry=lead.industry,
                country=lead.country,
                city=lead.city,
                state_province=lead.state_province,
                website_url=lead.website_url,
                normalized_domain=norm_domain,
                primary_email=norm_email,
                primary_phone=lead.primary_phone,
                source=lead.source,
                status="DISCOVERED"
            )

            # Apply metadata flags if present
            raw_meta = lead.raw_metadata or {}
            biz.has_online_booking = raw_meta.get("has_booking", False)
            biz.has_live_chat = raw_meta.get("has_live_chat", False)
            biz.detected_cms = raw_meta.get("cms")
            biz.detected_booking_system = raw_meta.get("booking_provider")

            session.add(biz)
            await session.flush() # generate biz.id

            if lead.contact_name:
                contact = Contact(
                    business_id=biz.id,
                    full_name=lead.contact_name,
                    first_name=lead.contact_name.split()[0] if lead.contact_name else None,
                    last_name=" ".join(lead.contact_name.split()[1:]) if len(lead.contact_name.split()) > 1 else None,
                    role_title=lead.contact_role or "Owner",
                    email=norm_email,
                    phone=lead.primary_phone,
                    is_decision_maker=True,
                    source=lead.source
                )
                session.add(contact)

            # Audit log entry
            audit = AuditLog(
                event_type="LEAD_DISCOVERED",
                actor="discovery_engine",
                entity_type="business",
                entity_id=biz.id,
                description=f"Discovered {biz.name} ({biz.industry}, {biz.country})"
            )
            session.add(audit)
            ingested_businesses.append(biz)

        await session.commit()

        return {
            "discovered_total": discovered_count,
            "valid_total": valid_count,
            "duplicates_filtered": deduped_count,
            "ingested_count": len(ingested_businesses),
            "ingested_ids": [b.id for b in ingested_businesses]
        }

discovery_engine = LeadDiscoveryEngine()
