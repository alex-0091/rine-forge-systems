"""
Rine Forge Systems V5 - Lead Discovery Pipeline Coordinator (Module 43 & 56)
Executes the authoritative 13-stage discovery pipeline:
Source -> Collect -> Normalize -> Deduplicate -> Relevance -> Intent Analysis ->
Website Audit -> Opportunity Analysis -> Score -> Compliance -> CRM -> Review Drafting.
"""
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.models.v5 import (
    V5Prospect,
    V5LeadSearch,
    V5LeadSearchResult,
    V5Business
)
from backend.app.discovery.providers_v5 import (
    LeadSourceType,
    BaseLeadSourceProvider,
    PublicBusinessDataProvider,
    WebsiteFormsProvider,
    InboundChatProvider,
    UserProvidedLeadsProvider
)
from backend.app.discovery.intent_discovery import intent_discovery_service
from backend.app.discovery.geo_service import geo_service
from backend.app.discovery.website_analysis import website_analysis_service
from backend.app.discovery.opportunity_analyzer import opportunity_analyzer
from backend.app.leads.scoring_v5 import lead_scoring_engine
from backend.app.discovery.deduplication_v5 import prospect_deduplicator
from backend.app.compliance.suppression_service import suppression_service
from backend.app.outreach.engine_v5 import outreach_engine_v5

logger = logging.getLogger(__name__)

class LeadDiscoveryPipeline:
    """
    End-to-end pipeline coordinator for prospect discovery and enrollment.
    """

    def __init__(self):
        self.default_provider = PublicBusinessDataProvider()
        self.forms_provider = WebsiteFormsProvider()
        self.chat_provider = InboundChatProvider()
        self.csv_provider = UserProvidedLeadsProvider()

    async def execute_discovery_run(
        self,
        session: AsyncSession,
        business_id: str,
        industry: str,
        location: str,
        services: Optional[List[str]] = None,
        source_type: str = "PUBLIC_BUSINESS_DATA",
        max_results: int = 10,
        auto_draft_outreach: bool = True
    ) -> Dict[str, Any]:
        """
        Runs the full 13-stage pipeline for a tenant.
        """
        services_list = services or ["General Services"]
        
        # 1. Audit Search Entry
        search_record = V5LeadSearch(
            business_id=business_id,
            query=f"{industry} in {location}",
            industry=industry,
            location=location,
            services=services_list,
            results_count=0,
            status="RUNNING"
        )
        session.add(search_record)
        await session.flush()

        # 2. Select Provider
        provider: BaseLeadSourceProvider = self.default_provider
        if source_type == "WEBSITE_FORMS":
            provider = self.forms_provider
        elif source_type == "INBOUND_CHAT":
            provider = self.chat_provider
        elif source_type == "USER_PROVIDED_LEADS":
            provider = self.csv_provider

        # 3. Source & Collect
        config = {
            "industry": industry,
            "location": location,
            "services": services_list,
            "max_results": max_results
        }
        raw_opps = await provider.fetch_opportunities(business_id=business_id, config=config)
        logger.info(f"Collected {len(raw_opps)} raw opportunities from {source_type}")

        enrolled_prospects = []
        skipped_count = 0

        for opp in raw_opps:
            # 4. Relevance & Intent Analysis (Anti-Health Inference Guard)
            intent_eval = intent_discovery_service.analyze_intent(
                raw_text=opp.raw_text,
                source_type=opp.source.value,
                industry=industry,
                target_services=services_list,
                source_url=opp.source_url
            )
            if not intent_eval.is_legitimate:
                logger.info(f"Skipping opportunity '{opp.entity_name}': {intent_eval.rejection_reason}")
                skipped_count += 1
                continue

            # 5. Geo-Targeting Validation
            if opp.location_hint:
                geo_match, dist_km = geo_service.match_location_to_metro(
                    candidate_location=opp.location_hint,
                    target_metro=location,
                    max_radius_miles=50
                )
                if not geo_match:
                    logger.info(f"Skipping '{opp.entity_name}': outside target radius ({dist_km} km)")
                    skipped_count += 1
                    continue

            # 6. Website Inspection & Fact Extraction (Zero-Hallucination)
            site_url = opp.metadata.get("website") or opp.source_url or ""
            web_analysis = await website_analysis_service.analyze(
                url=site_url,
                fallback_name=opp.entity_name,
                target_industry=industry
            )

            # 7. AI Opportunity Analyzer
            identified_opps = opportunity_analyzer.analyze_opportunities(
                analysis=web_analysis,
                business_profile={"industry": industry, "services": services_list}
            )

            # 8. Multi-Dimensional Scoring
            score_data = lead_scoring_engine.calculate_score(
                intent_strength=intent_eval.confidence,
                relevance_confidence=0.90 if industry.lower() in (opp.service_hint or "").lower() else 0.80,
                recency_hours=0.5,
                geo_fit=1.0,
                engagement_depth=len(web_analysis.observations),
                consent_factor=1.0 if opp.consent_status in ["CONSENTED", "PUBLIC_COMMERCIAL"] else 0.7
            )

            # 9. Deduplication & Merge (Scoped by business_id)
            prospect_payload = {
                "company_name": opp.entity_name,
                "website": site_url,
                "industry": industry,
                "location": opp.location_hint or location,
                "city": location.split(",")[0].strip() if "," in location else location,
                "email": opp.contact_email,
                "phone": opp.contact_phone,
                "source": opp.source.value,
                "source_url": opp.source_url,
                "score": score_data["score"],
                "score_breakdown": score_data["breakdown"],
                "consent_status": opp.consent_status,
                "review_mode": "REVIEW",
                "meta_json": {
                    "why_it_matched": intent_eval.why_it_matched,
                    "target_services": services_list
                }
            }

            prospect, is_new = await prospect_deduplicator.merge_or_create_prospect(
                session=session,
                business_id=business_id,
                prospect_data=prospect_payload,
                observations=web_analysis.observations,
                opportunities=identified_opps
            )

            # Map result to search record
            session.add(V5LeadSearchResult(
                search_id=search_record.id,
                prospect_id=prospect.id
            ))

            # 10. Compliance Check & Initial Outreach Draft
            is_suppressed = False
            if prospect.email:
                is_suppressed = await suppression_service.is_suppressed(
                    session=session, business_id=business_id, entry_type="EMAIL", value=prospect.email
                )
            if not is_suppressed and prospect.phone:
                is_suppressed = await suppression_service.is_suppressed(
                    session=session, business_id=business_id, entry_type="PHONE", value=prospect.phone
                )

            if not is_suppressed and auto_draft_outreach:
                # Draft initial message in PENDING_REVIEW
                channel = "EMAIL" if prospect.email else ("WHATSAPP" if prospect.phone else "EMAIL")
                await outreach_engine_v5.draft_initial_outreach(
                    session=session,
                    business_id=business_id,
                    prospect=prospect,
                    channel=channel
                )

            enrolled_prospects.append({
                "prospect_id": prospect.id,
                "company_name": prospect.company_name,
                "score": prospect.score,
                "pipeline_stage": prospect.pipeline_stage,
                "is_new": is_new,
                "is_suppressed": is_suppressed
            })

        search_record.results_count = len(enrolled_prospects)
        search_record.status = "COMPLETED"
        await session.commit()

        return {
            "search_id": search_record.id,
            "status": "COMPLETED",
            "total_collected": len(raw_opps),
            "total_enrolled": len(enrolled_prospects),
            "total_skipped": skipped_count,
            "prospects": enrolled_prospects
        }

lead_discovery_pipeline = LeadDiscoveryPipeline()
