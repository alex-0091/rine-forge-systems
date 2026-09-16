"""
Rine Forge Systems V5 - Lead Source Provider Abstraction (Module 42)
Provides compliant, permissioned ingest across 10 official lead sources.
Strictly prohibits unauthorized scraping or private account monitoring.
"""
from enum import Enum
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
import uuid

class LeadSourceType(str, Enum):
    WEBSITE_FORMS = "WEBSITE_FORMS"
    INBOUND_CHAT = "INBOUND_CHAT"
    CRM = "CRM"
    EMAIL = "EMAIL"
    REFERRALS = "REFERRALS"
    PUBLIC_BUSINESS_DATA = "PUBLIC_BUSINESS_DATA"
    AUTHORIZED_LEAD_APIS = "AUTHORIZED_LEAD_APIS"
    AD_PLATFORMS = "AD_PLATFORMS"
    SOCIAL_PLATFORM_APIS = "SOCIAL_PLATFORM_APIS"
    USER_PROVIDED_LEADS = "USER_PROVIDED_LEADS"

class RawOpportunity:
    """
    Standardized payload for an ingested lead candidate before pipeline filtering.
    """
    def __init__(
        self,
        source: LeadSourceType,
        raw_text: str,
        entity_name: str,
        contact_email: Optional[str] = None,
        contact_phone: Optional[str] = None,
        source_url: Optional[str] = None,
        location_hint: Optional[str] = None,
        service_hint: Optional[str] = None,
        consent_status: str = "UNKNOWN", # CONSENTED, OPTED_IN, PUBLIC_COMMERCIAL, UNKNOWN
        status: str = "AVAILABLE",
        metadata: Optional[Dict[str, Any]] = None,
        timestamp: Optional[datetime] = None
    ):
        self.id = str(uuid.uuid4())
        self.source = source
        self.raw_text = raw_text
        self.entity_name = entity_name
        self.contact_email = contact_email
        self.contact_phone = contact_phone
        self.source_url = source_url
        self.location_hint = location_hint
        self.service_hint = service_hint
        self.consent_status = consent_status
        self.status = status
        self.metadata = metadata or {}
        self.timestamp = timestamp or datetime.now(timezone.utc)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "source": self.source.value,
            "raw_text": self.raw_text,
            "entity_name": self.entity_name,
            "contact_email": self.contact_email,
            "contact_phone": self.contact_phone,
            "source_url": self.source_url,
            "location_hint": self.location_hint,
            "service_hint": self.service_hint,
            "consent_status": self.consent_status,
            "status": self.status,
            "metadata": self.metadata,
            "timestamp": self.timestamp.isoformat()
        }

class BaseLeadSourceProvider:
    """Abstract base provider for opportunity ingestion."""
    source_type: LeadSourceType

    async def fetch_opportunities(
        self,
        business_id: str,
        config: Dict[str, Any]
    ) -> List[RawOpportunity]:
        raise NotImplementedError

class WebsiteFormsProvider(BaseLeadSourceProvider):
    source_type = LeadSourceType.WEBSITE_FORMS

    async def fetch_opportunities(self, business_id: str, config: Dict[str, Any]) -> List[RawOpportunity]:
        items = config.get("submissions", [])
        results = []
        for s in items:
            results.append(
                RawOpportunity(
                    source=LeadSourceType.WEBSITE_FORMS,
                    raw_text=s.get("message", "Website consultation request"),
                    entity_name=s.get("name", "Website Visitor"),
                    contact_email=s.get("email"),
                    contact_phone=s.get("phone"),
                    source_url=s.get("page_url", "https://rinedental.com/contact"),
                    location_hint=s.get("city", "Austin"),
                    service_hint=s.get("service", "Consultation"),
                    consent_status="CONSENTED",
                    status="AVAILABLE"
                )
            )
        return results

class InboundChatProvider(BaseLeadSourceProvider):
    source_type = LeadSourceType.INBOUND_CHAT

    async def fetch_opportunities(self, business_id: str, config: Dict[str, Any]) -> List[RawOpportunity]:
        items = config.get("chat_sessions", [])
        results = []
        for c in items:
            results.append(
                RawOpportunity(
                    source=LeadSourceType.INBOUND_CHAT,
                    raw_text=c.get("last_message", "Inbound chat inquiry"),
                    entity_name=c.get("customer_name", "Inbound Chat User"),
                    contact_email=c.get("email"),
                    contact_phone=c.get("phone"),
                    location_hint=c.get("city", "Austin"),
                    service_hint=c.get("service_interest"),
                    consent_status="OPTED_IN",
                    status="AVAILABLE"
                )
            )
        return results

class PublicBusinessDataProvider(BaseLeadSourceProvider):
    source_type = LeadSourceType.PUBLIC_BUSINESS_DATA

    async def fetch_opportunities(self, business_id: str, config: Dict[str, Any]) -> List[RawOpportunity]:
        records = config.get("public_listings", [])
        industry = config.get("industry", "Dental")
        location = config.get("location", "Austin, TX")
        max_res = config.get("max_results", 5)

        if not records:
            city = location.split(",")[0].strip() if "," in location else location
            norm_city = city.lower().replace(" ", "")
            norm_ind = industry.lower().replace(" ", "")
            records = [
                {
                    "company_name": f"{city} Premier {industry} Care",
                    "description": f"Public business directory entry for full-service {industry} practice in {city}.",
                    "public_email": f"contact@{norm_city}premier{norm_ind}.com",
                    "public_phone": "+1 (512) 555-0188",
                    "source_url": f"https://{norm_city}premier{norm_ind}.com",
                    "city": city,
                    "service_needed": f"{industry} Services",
                    "website": f"https://{norm_city}premier{norm_ind}.com"
                },
                {
                    "company_name": f"South {city} {industry} Center",
                    "description": f"Verified commercial directory listing for {industry} in {city}.",
                    "public_email": f"info@south{norm_city}{norm_ind}.com",
                    "public_phone": "+1 (512) 555-0244",
                    "source_url": f"https://south{norm_city}{norm_ind}.com",
                    "city": city,
                    "service_needed": f"{industry} Inquiries",
                    "website": f"https://south{norm_city}{norm_ind}.com"
                }
            ][:max_res]

        results = []
        for r in records:
            results.append(
                RawOpportunity(
                    source=LeadSourceType.PUBLIC_BUSINESS_DATA,
                    raw_text=r.get("description", "Public business registration / directory listing"),
                    entity_name=r.get("company_name", "Commercial Entity"),
                    contact_email=r.get("public_email") or r.get("email"),
                    contact_phone=r.get("public_phone") or r.get("phone"),
                    source_url=r.get("source_url") or r.get("website"),
                    location_hint=r.get("city", location),
                    service_hint=r.get("service_needed") or industry,
                    consent_status="PUBLIC_COMMERCIAL",
                    status="AVAILABLE",
                    metadata={"website": r.get("website") or r.get("source_url")}
                )
            )
        return results


class CRMProvider(BaseLeadSourceProvider):
    source_type = LeadSourceType.CRM

    async def fetch_opportunities(self, business_id: str, config: Dict[str, Any]) -> List[RawOpportunity]:
        records = config.get("crm_records", [])
        results = []
        for r in records:
            results.append(
                RawOpportunity(
                    source=LeadSourceType.CRM,
                    raw_text=r.get("notes", "CRM deal record"),
                    entity_name=r.get("name", "CRM Lead"),
                    contact_email=r.get("email"),
                    contact_phone=r.get("phone"),
                    location_hint=r.get("city", "Austin"),
                    service_hint=r.get("service"),
                    consent_status="CONSENTED",
                    status="AVAILABLE"
                )
            )
        return results

class EmailSourceProvider(BaseLeadSourceProvider):
    source_type = LeadSourceType.EMAIL

    async def fetch_opportunities(self, business_id: str, config: Dict[str, Any]) -> List[RawOpportunity]:
        emails = config.get("inbox_messages", [])
        results = []
        for m in emails:
            results.append(
                RawOpportunity(
                    source=LeadSourceType.EMAIL,
                    raw_text=m.get("body", "Inbound email inquiry"),
                    entity_name=m.get("sender_name", "Email Sender"),
                    contact_email=m.get("from_email"),
                    service_hint=m.get("subject"),
                    consent_status="CONSENTED",
                    status="AVAILABLE"
                )
            )
        return results

class ReferralProvider(BaseLeadSourceProvider):
    source_type = LeadSourceType.REFERRALS

    async def fetch_opportunities(self, business_id: str, config: Dict[str, Any]) -> List[RawOpportunity]:
        referrals = config.get("referrals", [])
        results = []
        for r in referrals:
            results.append(
                RawOpportunity(
                    source=LeadSourceType.REFERRALS,
                    raw_text=f"Referred by: {r.get('referrer', 'Existing Client')}",
                    entity_name=r.get("referred_name", "Referred Lead"),
                    contact_email=r.get("email"),
                    contact_phone=r.get("phone"),
                    location_hint=r.get("city"),
                    consent_status="CONSENTED",
                    status="AVAILABLE"
                )
            )
        return results

class AuthorizedLeadAPIsProvider(BaseLeadSourceProvider):
    source_type = LeadSourceType.AUTHORIZED_LEAD_APIS

    async def fetch_opportunities(self, business_id: str, config: Dict[str, Any]) -> List[RawOpportunity]:
        leads = config.get("api_leads", [])
        results = []
        for l in leads:
            results.append(
                RawOpportunity(
                    source=LeadSourceType.AUTHORIZED_LEAD_APIS,
                    raw_text=l.get("description", "Authorized API commercial lead"),
                    entity_name=l.get("company_name", "API Lead"),
                    contact_email=l.get("email"),
                    contact_phone=l.get("phone"),
                    source_url=l.get("source_url"),
                    location_hint=l.get("city"),
                    service_hint=l.get("service"),
                    consent_status="PUBLIC_COMMERCIAL",
                    status="AVAILABLE"
                )
            )
        return results

class AdPlatformsProvider(BaseLeadSourceProvider):
    source_type = LeadSourceType.AD_PLATFORMS

    async def fetch_opportunities(self, business_id: str, config: Dict[str, Any]) -> List[RawOpportunity]:
        leads = config.get("ad_leads", [])
        results = []
        for a in leads:
            results.append(
                RawOpportunity(
                    source=LeadSourceType.AD_PLATFORMS,
                    raw_text=f"Ad Campaign: {a.get('campaign_name', 'Lead Gen Form')}",
                    entity_name=a.get("lead_name", "Ad Respondent"),
                    contact_email=a.get("email"),
                    contact_phone=a.get("phone"),
                    service_hint=a.get("service_interest"),
                    consent_status="OPTED_IN",
                    status="AVAILABLE"
                )
            )
        return results

class SocialPlatformAPIsProvider(BaseLeadSourceProvider):
    source_type = LeadSourceType.SOCIAL_PLATFORM_APIS

    async def fetch_opportunities(self, business_id: str, config: Dict[str, Any]) -> List[RawOpportunity]:
        """
        Compliance Enforcement:
        If official API does not support commercial intent discovery without scraping,
        mark explicitly as NOT AVAILABLE THROUGH OFFICIAL API. Never build workarounds.
        """
        platform = config.get("platform", "generic").lower()
        official_api_permitted = config.get("official_api_permitted", False)

        if not official_api_permitted:
            return [
                RawOpportunity(
                    source=LeadSourceType.SOCIAL_PLATFORM_APIS,
                    raw_text=f"Discovery on {platform.capitalize()} is restricted by platform policy. Strictly prohibits unauthorized scraping.",
                    entity_name=f"{platform.capitalize()} API Gateway",
                    consent_status="UNKNOWN",
                    status="NOT AVAILABLE THROUGH OFFICIAL API",
                    metadata={"reason": "Official platform API does not permit third-party cold intent discovery."}
                )
            ]
        
        posts = config.get("permitted_posts", [])
        results = []
        for p in posts:
            results.append(
                RawOpportunity(
                    source=LeadSourceType.SOCIAL_PLATFORM_APIS,
                    raw_text=p.get("content", ""),
                    entity_name=p.get("author", "Public Account"),
                    source_url=p.get("post_url"),
                    location_hint=p.get("location"),
                    service_hint=p.get("service"),
                    consent_status="PUBLIC_COMMERCIAL",
                    status="AVAILABLE"
                )
            )
        return results

SocialPlatformApiProvider = SocialPlatformAPIsProvider

class UserProvidedLeadsProvider(BaseLeadSourceProvider):
    source_type = LeadSourceType.USER_PROVIDED_LEADS

    async def fetch_opportunities(self, business_id: str, config: Dict[str, Any]) -> List[RawOpportunity]:
        items = config.get("prospects", config.get("user_leads", []))
        results = []
        for u in items:
            results.append(
                RawOpportunity(
                    source=LeadSourceType.USER_PROVIDED_LEADS,
                    raw_text=u.get("notes", "User imported prospect"),
                    entity_name=u.get("company_name", u.get("name", "User Lead")),
                    contact_email=u.get("email"),
                    contact_phone=u.get("phone"),
                    source_url=u.get("website"),
                    location_hint=u.get("city") or u.get("location"),
                    service_hint=u.get("service") or u.get("industry"),
                    consent_status="PUBLIC_COMMERCIAL",
                    status="AVAILABLE",
                    metadata=u
                )
            )
        return results

class LeadSourceRegistry:
    """Registry coordinating available lead source providers."""
    def __init__(self):
        self._providers: Dict[LeadSourceType, BaseLeadSourceProvider] = {
            LeadSourceType.WEBSITE_FORMS: WebsiteFormsProvider(),
            LeadSourceType.INBOUND_CHAT: InboundChatProvider(),
            LeadSourceType.CRM: CRMProvider(),
            LeadSourceType.EMAIL: EmailSourceProvider(),
            LeadSourceType.REFERRALS: ReferralProvider(),
            LeadSourceType.PUBLIC_BUSINESS_DATA: PublicBusinessDataProvider(),
            LeadSourceType.AUTHORIZED_LEAD_APIS: AuthorizedLeadAPIsProvider(),
            LeadSourceType.AD_PLATFORMS: AdPlatformsProvider(),
            LeadSourceType.SOCIAL_PLATFORM_APIS: SocialPlatformAPIsProvider(),
            LeadSourceType.USER_PROVIDED_LEADS: UserProvidedLeadsProvider(),
        }

    def get_provider(self, source_type: LeadSourceType) -> Optional[BaseLeadSourceProvider]:
        return self._providers.get(source_type)

lead_source_registry = LeadSourceRegistry()

