"""
Rine Forge Systems V5 - Phase AQ: Business Request Planner
Decomposes natural-language business requests into structured, executable plans.
Strictly separates VERIFIED FACTS from DEDUCTIVE ASSUMPTIONS.
If critical information is missing, records it explicitly rather than hallucinating.
"""
import re
import uuid
import logging
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

logger = logging.getLogger("rine_forge.workbench.planner")


class PlannedTask(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    type: str
    priority: int
    title: str
    description: str
    rationale: str
    depends_on: List[str] = Field(default_factory=list)
    requires_confirmation: bool = False


class PlannedProject(BaseModel):
    project_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    project_name: str
    request_type: str = "MULTI_PROJECT" # SINGLE_PROJECT, MULTI_PROJECT, STRATEGIC_INITIATIVE
    business: Dict[str, Any] = Field(default_factory=dict)
    tasks: List[PlannedTask] = Field(default_factory=list)
    facts_identified: List[str] = Field(default_factory=list)
    assumptions_made: List[str] = Field(default_factory=list)
    missing_information: List[str] = Field(default_factory=list)
    requires_confirmation: bool = False


class BusinessRequestPlanner:
    """
    Intelligently analyzes business owners' natural-language requests
    and constructs a dependency-ordered, capability-aligned project plan.
    """

    CATEGORIES = {
        "dental": "Dental & Facial Aesthetics",
        "dentist": "Dental & Facial Aesthetics",
        "clinic": "Medical / Health Clinic",
        "doctor": "Medical / Health Clinic",
        "law": "Legal Practice & Advisory",
        "attorney": "Legal Practice & Advisory",
        "lawyer": "Legal Practice & Advisory",
        "plumbing": "Home & Commercial Services",
        "electric": "Home & Commercial Services",
        "roofing": "Construction & Contracting",
        "restaurant": "Hospitality & Dining",
        "cafe": "Hospitality & Dining",
        "hotel": "Hospitality & Lodging",
        "agency": "B2B Professional Services",
        "consult": "B2B Professional Services",
        "real estate": "Real Estate & Brokerage",
        "fitness": "Health & Fitness Center",
        "accounting": "Financial & Accounting Advisory"
    }

    CITIES = ["Austin", "Dallas", "Houston", "San Antonio", "Chicago", "New York", "Denver", "Miami", "Seattle", "Atlanta"]

    def plan_request(
        self,
        natural_language_request: str,
        workspace_context: Optional[Dict[str, Any]] = None,
        business_profile: Optional[Dict[str, Any]] = None,
        existing_assets: Optional[List[Dict[str, Any]]] = None,
        existing_agents: Optional[List[Dict[str, Any]]] = None
    ) -> PlannedProject:
        """
        Parses text, isolates facts vs. assumptions, and builds ordered task graph.
        """
        text = natural_language_request.strip()
        text_lower = text.lower()

        facts: List[str] = []
        assumptions: List[str] = []
        missing: List[str] = []
        tasks: List[PlannedTask] = []

        # 1. Identify Category
        category = "General Business"
        for key, val in self.CATEGORIES.items():
            if key in text_lower:
                category = val
                facts.append(f"Business Category specified as: {val}")
                break
        if category == "General Business":
            assumptions.append("Category not specified explicitly; assuming professional service provider")

        # 2. Identify Location
        location = "Local Market"
        for city in self.CITIES:
            if city.lower() in text_lower:
                location = city
                facts.append(f"Primary Operating Location identified as: {city}")
                break
        if location == "Local Market":
            assumptions.append("Operating location not specified; assuming local service area")

        # 3. Identify Business Name or synthesize working title
        name_match = re.search(r"(?:name is|called|business is|clinic is|firm is)\s+([A-Za-z0-9\s&]+?)(?:\.|\,|and|\n|$)", text, re.IGNORECASE)
        if name_match:
            business_name = name_match.group(1).strip()
            facts.append(f"Business Name specified as: {business_name}")
        elif business_profile and business_profile.get("name"):
            business_name = business_profile["name"]
            facts.append(f"Business Name referenced from profile: {business_name}")
        else:
            business_name = f"{location} {category.split('/')[0].split('&')[0].strip()}"
            assumptions.append(f"Business name not explicitly stated; using working title '{business_name}'")

        # 4. Decompose Tasks by Intent
        priority_counter = 1

        # A. Website Generation
        if any(w in text_lower for w in ["website", "site", "landing page", "webpage", "web page"]):
            tasks.append(PlannedTask(
                type="WEBSITE_BUILD",
                priority=priority_counter,
                title="Build Responsive Business Website",
                description=f"Synthesize modern, responsive multi-page web presence for {business_name} in {location}.",
                rationale="Provides foundational digital footprint for prospective customers."
            ))
            priority_counter += 1

        # B. Brand & Logo Generation
        if any(w in text_lower for w in ["logo", "brand", "branding", "visual identity", "colors"]):
            tasks.append(PlannedTask(
                type="LOGO_GENERATION",
                priority=priority_counter,
                title="Generate Multi-Concept Brand Package",
                description=f"Create SVG vector logos, color palette, typography guidelines, and social avatar for {business_name}.",
                rationale="Establishes credible visual authority across digital and physical touchpoints."
            ))
            priority_counter += 1

        # C. Website Audit
        if any(w in text_lower for w in ["audit", "review my site", "analyze website", "seo audit", "why my website isn't converting"]):
            url_match = re.search(r"https?://[^\s]+|[a-zA-Z0-9-]+\.(?:com|org|io|net|co)", text)
            if url_match:
                facts.append(f"Audit target URL provided: {url_match.group(0)}")
            else:
                missing.append("Target website URL was not provided in request. Auditor will evaluate generated structure or await domain URL.")

            tasks.append(PlannedTask(
                type="WEBSITE_AUDIT",
                priority=priority_counter,
                title="Comprehensive Website & Conversion Audit",
                description="Evaluate technical performance, UX layout, mobile readiness, SEO, and conversion friction.",
                rationale="Identifies immediate opportunities to improve lead capture and search visibility."
            ))
            priority_counter += 1

        # D. Business Plan
        if any(w in text_lower for w in ["business plan", "plan my business", "executive summary", "business model"]):
            tasks.append(PlannedTask(
                type="BUSINESS_PLAN",
                priority=priority_counter,
                title="Formulate Strategic Business Plan",
                description=f"Draft comprehensive operational plan, target customer profile, risk analysis, and milestones for {business_name}.",
                rationale="Aligns business structure, market opportunity, and operational trajectory."
            ))
            priority_counter += 1

        # E. Financial Model
        if any(w in text_lower for w in ["financial", "finance", "revenue projection", "cash flow", "break-even", "costs"]):
            tasks.append(PlannedTask(
                type="FINANCIAL_MODEL",
                priority=priority_counter,
                title="Deterministic Financial Model & Cash-Flow Projection",
                description="Compute mathematical revenue, COGS, operating margins, breakeven customer count, and 12-month projections.",
                rationale="Ensures financial viability with verified mathematical equations."
            ))
            priority_counter += 1

        # F. Marketing Plan
        if any(w in text_lower for w in ["marketing", "marketing plan", "acquisition", "ads", "social media", "campaign"]):
            tasks.append(PlannedTask(
                type="MARKETING_PLAN",
                priority=priority_counter,
                title="Construct Targeted Customer Acquisition Plan",
                description=f"Define positioning, content pillars, promotional angles, and campaign copy for {business_name}.",
                rationale="Drives inbound patient and client inquiries through targeted channels."
            ))
            priority_counter += 1

        # G. Competitor Analysis
        if any(w in text_lower for w in ["competitor", "market analysis", "compete", "benchmarking", "market research"]):
            tasks.append(PlannedTask(
                type="COMPETITOR_ANALYSIS",
                priority=priority_counter,
                title="Conduct Local Market & Competitor Research",
                description=f"Map competitor positioning, pricing boundaries, and common customer objections in {location}.",
                rationale="Identifies market gaps to position {business_name} as the preferred choice."
            ))
            priority_counter += 1

        # H. AI Employee / Receptionist Generation
        if any(w in text_lower for w in ["receptionist", "ai employee", "voice agent", "phone assistant", "lead bot", "bot", "assistant"]):
            tasks.append(PlannedTask(
                type="AI_AGENT_GENERATION",
                priority=priority_counter,
                title="Deploy 24/7 AI Receptionist & Triage Agent",
                description=f"Configure verified knowledge-bound AI employee for {business_name} with voice, WhatsApp, and CRM lead capture.",
                rationale="Eliminates missed calls and provides instant speed-to-lead response."
            ))
            priority_counter += 1

        # Fallback if request is brief or broad
        if not tasks:
            tasks = [
                PlannedTask(
                    type="WEBSITE_BUILD",
                    priority=1,
                    title="Build Modern Business Website",
                    description=f"Create responsive web presence for {business_name}.",
                    rationale="Core digital asset for customer discovery."
                ),
                PlannedTask(
                    type="LOGO_GENERATION",
                    priority=2,
                    title="Create Brand Identity & Logo",
                    description=f"Generate SVG brand logo and visual guidelines for {business_name}.",
                    rationale="Visual identification for marketing."
                ),
                PlannedTask(
                    type="AI_AGENT_GENERATION",
                    priority=3,
                    title="Setup 24/7 AI Receptionist",
                    description=f"Configure automated phone and web reception for {business_name}.",
                    rationale="Direct appointment scheduling and inquiry resolution."
                )
            ]

        # Determine if multi-project or single project
        req_type = "MULTI_PROJECT" if len(tasks) > 1 else "SINGLE_PROJECT"

        return PlannedProject(
            project_name=f"{business_name} Growth Launch",
            request_type=req_type,
            business={
                "name": business_name,
                "category": category,
                "location": location
            },
            tasks=tasks,
            facts_identified=facts,
            assumptions_made=assumptions,
            missing_information=missing,
            requires_confirmation=False
        )


business_request_planner = BusinessRequestPlanner()
