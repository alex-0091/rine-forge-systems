"""
Rine Forge Systems V5 - Phase AO: Auto Lead -> Auto Bot Generator
Generates a coordinated 6-agent suite sharing a unified business knowledge base
from a client's business configuration profile.
"""
import uuid
import re
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.app.models.v5 import (
    Business,
    V5GeneratedAgentSuite,
    GeneratedAgentSuite
)


class BusinessProfileInput(BaseModel):
    """Client business configuration input schema."""
    business_name: str
    business_category: str # e.g. "Dental Clinic", "Restaurant", "Hotel", "Law Firm", "Cleaning Company", "Marketing Agency"
    website: Optional[str] = ""
    location_area: str # e.g. "Austin, Texas"
    service_radius_miles: int = 25
    services: List[str] = Field(default_factory=list)
    target_customer: str = "Local clients seeking verified services"
    keywords: List[str] = Field(default_factory=list)
    excluded_keywords: List[str] = Field(default_factory=list)
    preferred_channels: List[str] = Field(default_factory=lambda: ["SOCIAL_REPLY", "EMAIL"])
    business_hours: Dict[str, str] = Field(default_factory=lambda: {
        "monday_friday": "08:00 - 18:00",
        "saturday": "09:00 - 14:00",
        "sunday": "Closed"
    })
    ai_tone: str = "PROFESSIONAL_HELPFUL" # PROFESSIONAL_HELPFUL, WARM_EMPATHETIC, DIRECT_EFFICIENT, CASUAL_FRIENDLY
    qualification_rules: List[str] = Field(default_factory=list)


class AgentGeneratorService:
    """
    Builds and manages the coordinated 6-bot Lead Intelligence Agent Suite
    grounded in a single authoritative business knowledge base.
    """

    def generate_suite_config(self, profile: BusinessProfileInput) -> Dict[str, Any]:
        """
        Pure generation logic: transforms profile into:
        1. Unified Business Knowledge Base (verified facts, FAQs, boundaries)
        2. 6 Coordinated Agent configurations and prompts
        """
        kb = self._build_knowledge_base(profile)
        agents = self._build_agents_config(profile, kb)

        return {
            "business_name": profile.business_name,
            "business_category": profile.business_category,
            "website": profile.website,
            "location_area": profile.location_area,
            "service_radius_miles": profile.service_radius_miles,
            "services": profile.services,
            "target_customer": profile.target_customer,
            "keywords": profile.keywords,
            "excluded_keywords": profile.excluded_keywords,
            "preferred_channels": profile.preferred_channels,
            "business_hours": profile.business_hours,
            "ai_tone": profile.ai_tone,
            "qualification_rules": profile.qualification_rules or self._default_qualification_rules(profile),
            "knowledge_base": kb,
            "agents_config": agents,
        }

    def _default_qualification_rules(self, profile: BusinessProfileInput) -> List[str]:
        return [
            f"Must be located within {profile.service_radius_miles} miles of {profile.location_area}",
            f"Must demonstrate active need or inquiry matching offered services: {', '.join(profile.services[:4])}",
            "Must be a public request or authorized opt-in (no private DM harvesting)",
            "Must not contain negative/disqualifying keywords",
            "Must express commercial intent or seeking recommendation"
        ]

    def _build_knowledge_base(self, profile: BusinessProfileInput) -> Dict[str, Any]:
        """Constructs an authoritative, unalterable business factual base."""
        # Industry-specific disclaimers & constraints
        category_lower = profile.business_category.lower()
        if "dental" in category_lower or "medical" in category_lower or "clinic" in category_lower:
            disclaimer = "Informational only. This is not medical/dental advice or formal diagnosis. Clinical examination required."
            specific_boundaries = [
                "Never diagnose symptoms or offer medical/dental prescriptions.",
                "Never promise exact treatment results or quote fixed surgical prices without clinical examination.",
                "In case of severe bleeding, airway obstruction, or emergency, advise immediately calling 911 or visiting the ER."
            ]
        elif "law" in category_lower or "legal" in category_lower or "attorney" in category_lower:
            disclaimer = "Informational only. Does not constitute legal advice or establish an attorney-client relationship."
            specific_boundaries = [
                "Never guarantee lawsuit settlement outcomes or court verdict percentages.",
                "Never provide binding legal counsel without formal retainer agreement."
            ]
        elif "restaurant" in category_lower or "hotel" in category_lower:
            disclaimer = "Official guest communication from hospitality management."
            specific_boundaries = [
                "Confirm table or room availability only against live booking calendar.",
                "Explicitly disclose known allergen policies when answering menu questions."
            ]
        elif "clean" in category_lower or "contractor" in category_lower:
            disclaimer = "Official service estimate & scheduling coordinator."
            specific_boundaries = [
                "Provide accurate hourly or base pricing parameters, but state on-site walkthrough may be required for exact quote."
            ]
        else:
            disclaimer = "Official business representative for verified customer inquiries."
            specific_boundaries = [
                "Never fabricate pricing, discounts, or credentials not present in the verified record.",
                "Never claim personal acquaintance with the prospect."
            ]

        # Verified facts list
        verified_facts = {
            "company_name": profile.business_name,
            "category": profile.business_category,
            "official_website": profile.website or "Available upon request",
            "service_area": profile.location_area,
            "coverage_radius_miles": profile.service_radius_miles,
            "verified_services": profile.services,
            "operating_hours": profile.business_hours,
            "preferred_channels": profile.preferred_channels,
            "ai_tone": profile.ai_tone,
            "public_disclaimer": disclaimer,
            "generated_at": datetime.now(timezone.utc).isoformat()
        }

        # Dynamic FAQ catalog based on services
        faq_catalog = [
            {
                "question": f"Where is {profile.business_name} located?",
                "answer": f"{profile.business_name} is based in {profile.location_area}, serving clients within a {profile.service_radius_miles}-mile radius."
            },
            {
                "question": "What services do you offer?",
                "answer": f"Our primary offerings include: {', '.join(profile.services)}."
            },
            {
                "question": "What are your hours of operation?",
                "answer": " | ".join([f"{k.replace('_', ' ').title()}: {v}" for k, v in profile.business_hours.items()])
            }
        ]

        boundaries = [
            "Always disclose you are assisting on behalf of the business.",
            "Never scrape or DM private profiles without authorization.",
            "Always honor opt-out and suppression requests immediately.",
            "Separate verifiable facts (e.g., location, symptoms stated) from inferences.",
        ] + specific_boundaries

        return {
            "verified_facts": verified_facts,
            "faq_catalog": faq_catalog,
            "boundaries": boundaries,
            "disclaimer": disclaimer
        }

    def _build_agents_config(self, profile: BusinessProfileInput, kb: Dict[str, Any]) -> Dict[str, Any]:
        """Generates configurations and prompts for the 6 coordinated agents."""
        b_name = profile.business_name
        cat = profile.business_category
        loc = profile.location_area
        rad = profile.service_radius_miles
        services_str = ", ".join(profile.services)
        tone = profile.ai_tone.replace("_", " ").lower()

        # 1. LeadAgent
        lead_agent = {
            "agent_id": "lead_agent",
            "name": f"{b_name} Lead Discovery Agent",
            "role": "Signal Detection & Normalization",
            "persona": f"Vigilant monitoring coordinator for {b_name} focusing exclusively on compliant public intent signals.",
            "system_prompt": (
                f"You are the Lead Discovery Agent for {b_name} ({cat} in {loc}).\n"
                f"Mission: Identify high-intent public requests, inquiries, and recommendations for {services_str}.\n"
                f"Keywords to monitor: {', '.join(profile.keywords)}.\n"
                f"Strict Exclusions: {', '.join(profile.excluded_keywords or ['jobs', 'hiring', 'pet', 'diy'])}.\n"
                f"Compliance Rules:\n"
                f"- Ingest ONLY from authorized API streams, customer feeds, or public forums with permissible terms.\n"
                f"- NEVER bypass CAPTCHAs, scrape private accounts, or store unauthorized PII.\n"
                f"- Normalize every signal with location, author identifier, content, and provenance."
            ),
            "allowed_tools": ["scan_signals", "filter_negative_keywords", "geo_filter", "normalize_provenance"],
            "status": "READY"
        }

        # 2. QualificationAgent
        qualification_agent = {
            "agent_id": "qualification_agent",
            "name": f"{b_name} Lead Qualification Agent",
            "role": "Intent & Fit Qualification (Facts vs Inferences)",
            "persona": f"Rigorous, zero-hallucination evaluator assessing signal relevance for {b_name}.",
            "system_prompt": (
                f"You are the Lead Qualification Agent for {b_name} ({cat}, {loc}).\n"
                f"Mission: Evaluate candidate signals against business criteria and classify intent.\n"
                f"Criteria:\n"
                f"1. Location match: Within {rad} miles of {loc}.\n"
                f"2. Service match: Needs one of {services_str}.\n"
                f"3. Intent level: HIGH_INTENT, POSSIBLE_INTENT, INFORMATIONAL, IRRELEVANT, NEGATIVE.\n"
                f"CRITICAL REQUIREMENT:\n"
                f"You must strictly segregate verifiable FACTS (explicitly stated in user text) from INFERENCES (AI deductions).\n"
                f"Never present an assumption as an established fact."
            ),
            "allowed_tools": ["classify_intent", "check_service_fit", "evaluate_facts_inferences", "calculate_urgency"],
            "status": "READY"
        }

        # 3. ResponseAgent
        response_agent = {
            "agent_id": "response_agent",
            "name": f"{b_name} Contextual Response Agent",
            "role": "Response Draft Generation & Safety Grounding",
            "persona": f"Helpful, authentic communication specialist writing in a {tone} tone.",
            "system_prompt": (
                f"You are the Response Agent for {b_name} ({cat}).\n"
                f"Mission: Draft helpful, personalized, non-pushy replies to qualified leads.\n"
                f"Tone: {tone}.\n"
                f"Strict Guardrails:\n"
                f"1. Clearly disclose your association with {b_name}.\n"
                f"2. Never claim personal familiarity or fake anecdotal stories (e.g. 'I had that same issue!').\n"
                f"3. Never make ungrounded diagnoses, promises, or pricing guarantees.\n"
                f"4. Include official disclaimer: '{kb.get('disclaimer')}'.\n"
                f"5. Require human review before dispatch unless explicit autonomous mode is authorized."
            ),
            "allowed_tools": ["draft_response", "check_disclosure", "verify_grounding", "check_policy_gates"],
            "status": "READY"
        }

        # 4. ConversationAgent
        conversation_agent = {
            "agent_id": "conversation_agent",
            "name": f"{b_name} Multiturn Conversation Agent",
            "role": "Inquiry Handling & Consultation Scheduling",
            "persona": f"Professional conversational assistant managing follow-up inquiries for {b_name}.",
            "system_prompt": (
                f"You are the Conversation Agent for {b_name}.\n"
                f"Mission: Handle prospect replies, clarify service questions using the verified knowledge base, "
                f"and facilitate booking a consultation or speaking with the office staff.\n"
                f"Operating Hours: {profile.business_hours}.\n"
                f"Available Services: {services_str}.\n"
                f"If the prospect asks an unanswerable or high-risk question, immediately route to HumanHandoffAgent."
            ),
            "allowed_tools": ["query_knowledge_base", "check_availability", "propose_consultation", "record_reply"],
            "status": "READY"
        }

        # 5. SalesAgent
        sales_agent = {
            "agent_id": "sales_agent",
            "name": f"{b_name} Sales CRM Agent",
            "role": "Pipeline Progression & Priority Scoring",
            "persona": f"Organized CRM coordinator advancing leads through Rine Forge lifecycle stages.",
            "system_prompt": (
                f"You are the Sales CRM Agent for {b_name}.\n"
                f"Mission: Manage the 9 lifecycle states: NEW, QUALIFIED, NEEDS_REVIEW, CONTACTED, REPLIED, "
                f"MEETING_REQUESTED, CUSTOMER, DISQUALIFIED, OPTED_OUT.\n"
                f"Calculate priority scores (0-100) using transparent, documented factors.\n"
                f"Ensure no lead remains stalled without a clear next action or assigned task."
            ),
            "allowed_tools": ["update_lead_status", "assign_sales_task", "calculate_priority", "log_crm_event"],
            "status": "READY"
        }

        # 6. HumanHandoffAgent
        handoff_agent = {
            "agent_id": "handoff_agent",
            "name": f"{b_name} Human Escalation Agent",
            "role": "Safety Escalation & Operator Routing",
            "persona": f"Safety officer intercepting edge cases, emergencies, disputes, and opt-outs.",
            "system_prompt": (
                f"You are the Human Escalation Agent for {b_name}.\n"
                f"Mission: Protect customer safety, brand integrity, and compliance.\n"
                f"Trigger human handoff immediately when:\n"
                f"1. Customer explicitly requests a human / representative.\n"
                f"2. Customer states a medical/legal/safety emergency.\n"
                f"3. Customer requests opt-out or expresses frustration.\n"
                f"4. AI confidence on qualification or response is below threshold.\n"
                f"Action: Pause automated messaging and assign an urgent SalesTask for staff review."
            ),
            "allowed_tools": ["create_escalation_task", "notify_operator", "pause_lead_automations", "trigger_opt_out"],
            "status": "READY"
        }

        return {
            "lead_agent": lead_agent,
            "qualification_agent": qualification_agent,
            "response_agent": response_agent,
            "conversation_agent": conversation_agent,
            "sales_agent": sales_agent,
            "handoff_agent": handoff_agent
        }

    async def create_or_update_suite(
        self,
        session: AsyncSession,
        business_id: str,
        profile_data: Dict[str, Any]
    ) -> V5GeneratedAgentSuite:
        """Saves or updates a generated agent suite in the database."""
        profile = BusinessProfileInput(**profile_data)
        config = self.generate_suite_config(profile)

        # Check existing active suite
        stmt = select(V5GeneratedAgentSuite).where(
            V5GeneratedAgentSuite.business_id == business_id,
            V5GeneratedAgentSuite.status == "ACTIVE"
        )
        res = await session.execute(stmt)
        existing = res.scalars().first()

        if existing:
            existing.suite_name = f"{profile.business_name} Intelligence Suite"
            existing.business_name = profile.business_name
            existing.business_category = profile.business_category
            existing.website = profile.website
            existing.location_area = profile.location_area
            existing.service_radius_miles = profile.service_radius_miles
            existing.services = profile.services
            existing.target_customer = profile.target_customer
            existing.keywords = profile.keywords
            existing.excluded_keywords = profile.excluded_keywords
            existing.preferred_channels = profile.preferred_channels
            existing.business_hours = profile.business_hours
            existing.ai_tone = profile.ai_tone
            existing.qualification_rules = config["qualification_rules"]
            existing.knowledge_base = config["knowledge_base"]
            existing.agents_config = config["agents_config"]
            existing.is_verified = True
            await session.commit()
            await session.refresh(existing)
            return existing

        suite = V5GeneratedAgentSuite(
            id=str(uuid.uuid4()),
            business_id=business_id,
            suite_name=f"{profile.business_name} Intelligence Suite",
            business_name=profile.business_name,
            business_category=profile.business_category,
            website=profile.website,
            location_area=profile.location_area,
            service_radius_miles=profile.service_radius_miles,
            services=profile.services,
            target_customer=profile.target_customer,
            keywords=profile.keywords,
            excluded_keywords=profile.excluded_keywords,
            preferred_channels=profile.preferred_channels,
            business_hours=profile.business_hours,
            ai_tone=profile.ai_tone,
            qualification_rules=config["qualification_rules"],
            knowledge_base=config["knowledge_base"],
            agents_config=config["agents_config"],
            status="ACTIVE",
            is_verified=True
        )
        session.add(suite)
        await session.commit()
        await session.refresh(suite)
        return suite

    async def get_suite(self, session: AsyncSession, suite_id: str, business_id: str) -> Optional[V5GeneratedAgentSuite]:
        stmt = select(V5GeneratedAgentSuite).where(
            V5GeneratedAgentSuite.id == suite_id,
            V5GeneratedAgentSuite.business_id == business_id
        )
        res = await session.execute(stmt)
        return res.scalars().first()

    async def list_suites(self, session: AsyncSession, business_id: str) -> List[V5GeneratedAgentSuite]:
        stmt = select(V5GeneratedAgentSuite).where(
            V5GeneratedAgentSuite.business_id == business_id
        ).order_by(V5GeneratedAgentSuite.created_at.desc())
        res = await session.execute(stmt)
        return list(res.scalars().all())

    def verify_suite_readiness(self, suite: V5GeneratedAgentSuite) -> Dict[str, Any]:
        """
        Verifies operational readiness of all 6 agents.
        Returns live readiness status (READY vs NOT CONFIGURED).
        """
        agents = suite.agents_config or {}
        readiness = {}
        all_ready = True

        for agent_key in ["lead_agent", "qualification_agent", "response_agent", "conversation_agent", "sales_agent", "handoff_agent"]:
            conf = agents.get(agent_key)
            if not conf:
                readiness[agent_key] = {"status": "NOT CONFIGURED", "reason": "Agent configuration missing"}
                all_ready = False
                continue

            has_prompt = bool(conf.get("system_prompt"))
            has_tools = bool(conf.get("allowed_tools"))
            has_kb = bool(suite.knowledge_base and suite.knowledge_base.get("verified_facts"))

            if has_prompt and has_tools and has_kb:
                readiness[agent_key] = {
                    "status": "READY",
                    "name": conf.get("name"),
                    "role": conf.get("role"),
                    "tools_count": len(conf.get("allowed_tools", []))
                }
            else:
                readiness[agent_key] = {
                    "status": "NOT CONFIGURED",
                    "reason": "Missing system prompt or knowledge base grounding"
                }
                all_ready = False

        return {
            "suite_id": suite.id,
            "business_name": suite.business_name,
            "overall_status": "READY" if all_ready else "PARTIALLY_CONFIGURED",
            "agents": readiness
        }


agent_generator_service = AgentGeneratorService()
