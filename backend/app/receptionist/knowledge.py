import logging
import time
from typing import Dict, Any, Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.models.business import Business
from backend.app.models.receptionist import BusinessKnowledge

logger = logging.getLogger(__name__)

class BusinessKnowledgeService:
    """
    Multi-tenant business knowledge repository service.
    Enforces cache efficiency and anti-hallucination grounding boundaries.
    """

    def __init__(self, cache_ttl_seconds: int = 300):
        self._cache: Dict[str, Dict[str, Any]] = {}
        self.cache_ttl = cache_ttl_seconds

    def invalidate_cache(self, business_id: str):
        if business_id in self._cache:
            del self._cache[business_id]

    async def get_knowledge(self, session: AsyncSession, business_id: str) -> Optional[BusinessKnowledge]:
        """
        Retrieves business knowledge record by business_id with TTL caching.
        """
        now = time.time()
        cached = self._cache.get(business_id)
        if cached and (now - cached["timestamp"] < self.cache_ttl):
            return cached["data"]

        stmt = select(BusinessKnowledge).where(BusinessKnowledge.business_id == business_id)
        res = await session.execute(stmt)
        record = res.scalar_one_or_none()

        if record:
            self._cache[business_id] = {
                "data": record,
                "timestamp": now
            }
        return record

    async def upsert_knowledge(
        self,
        session: AsyncSession,
        business_id: str,
        data: Dict[str, Any]
    ) -> BusinessKnowledge:
        """
        Creates or updates business knowledge record.
        """
        stmt = select(BusinessKnowledge).where(BusinessKnowledge.business_id == business_id)
        res = await session.execute(stmt)
        record = res.scalar_one_or_none()

        if not record:
            record = BusinessKnowledge(
                business_id=business_id,
                business_name=data.get("business_name", "Business"),
                industry=data.get("industry", "General"),
                description=data.get("description"),
                services=data.get("services", []),
                opening_hours=data.get("opening_hours", {}),
                timezone=data.get("timezone", "UTC"),
                location_address=data.get("location_address"),
                contact_email=data.get("contact_email"),
                contact_phone=data.get("contact_phone"),
                policies=data.get("policies", {}),
                faqs=data.get("faqs", []),
                custom_instructions=data.get("custom_instructions")
            )
            session.add(record)
        else:
            for field in [
                "business_name", "industry", "description", "services",
                "opening_hours", "timezone", "location_address", "contact_email",
                "contact_phone", "policies", "faqs", "custom_instructions"
            ]:
                if field in data:
                    setattr(record, field, data[field])

        await session.flush()
        self.invalidate_cache(business_id)
        return record

    def format_grounded_context(self, knowledge: Optional[BusinessKnowledge], business: Optional[Business] = None) -> str:
        """
        Generates strict anti-hallucination context prompt with verified business facts.
        """
        if not knowledge and not business:
            return "No verified business knowledge registered. Offer to connect with a team member."

        name = (knowledge.business_name if knowledge else business.name) or "Our Business"
        industry = (knowledge.industry if knowledge else business.industry) or "Services"
        desc = (knowledge.description if knowledge else "") or "Professional services provider."
        address = (knowledge.location_address if knowledge else business.address) or "Contact for location"
        email = (knowledge.contact_email if knowledge else business.primary_email) or "contact@business.com"
        phone = (knowledge.contact_phone if knowledge else business.primary_phone) or "Contact via chat"

        lines = [
            f"=== VERIFIED BUSINESS KNOWLEDGE (STRICT BOUNDARY) ===",
            f"Business Name: {name}",
            f"Industry: {industry}",
            f"Overview: {desc}",
            f"Address / Location: {address}",
            f"Contact Email: {email}",
            f"Contact Phone: {phone}",
        ]

        if knowledge:
            lines.append(f"Timezone: {knowledge.timezone}")
            
            if knowledge.opening_hours:
                lines.append("\nVerified Operating Hours:")
                for day, hours in knowledge.opening_hours.items():
                    lines.append(f"  - {day.capitalize()}: {hours}")
            else:
                lines.append("\nOperating Hours: Standard business hours (specific schedule not yet in records).")

            if knowledge.services:
                lines.append("\nVerified Services & Pricing:")
                for s in knowledge.services:
                    s_name = s.get("name", "Service")
                    s_desc = s.get("description", "")
                    s_dur = s.get("duration_minutes", "")
                    s_dur_str = f" ({s_dur} mins)" if s_dur else ""
                    s_price = s.get("price_estimate", "")
                    s_price_str = f" - Price: {s_price}" if s_price else " - Price: Inquire for custom quote"
                    lines.append(f"  * {s_name}{s_dur_str}{s_price_str}. {s_desc}")
            else:
                lines.append("\nVerified Services: General inquiries accepted. Consult staff for full menu.")

            if knowledge.policies:
                lines.append("\nVerified Business Policies:")
                for pol_name, pol_val in knowledge.policies.items():
                    lines.append(f"  - {pol_name.capitalize()}: {pol_val}")

            if knowledge.faqs:
                lines.append("\nVerified Frequently Asked Questions:")
                for faq in knowledge.faqs:
                    q = faq.get("question", "")
                    a = faq.get("answer", "")
                    lines.append(f"  Q: {q}\n  A: {a}")

            if knowledge.custom_instructions:
                lines.append(f"\nSpecial Business Instructions:\n{knowledge.custom_instructions}")

        lines.append("\n=== CRITICAL ANTI-HALLUCINATION INSTRUCTION ===")
        lines.append(
            "You must answer questions STRICTLY using the verified facts above.\n"
            "DO NOT INVENT prices, opening hours, services, discounts, doctor/staff names, or availability not listed.\n"
            "If a customer asks about a price or service not listed in the verified facts, say:\n"
            "\"I don't have that specific information in my verified records yet. I can connect you with a member of our team to assist you.\""
        )

        return "\n".join(lines)

business_knowledge_service = BusinessKnowledgeService()
