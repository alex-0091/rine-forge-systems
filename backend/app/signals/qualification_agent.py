"""
Rine Forge Systems V5 - AI Lead Qualification Agent
Strictly isolates verifiable FACTS from AI INFERENCES.
Manages transition across the 9 lead lifecycle states.
"""
import uuid
import re
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.app.models.v5 import (
    V5SocialSignal,
    V5SocialLead,
    V5GeneratedAgentSuite
)
from backend.app.signals.matching_engine import signal_matching_engine, MatchEvaluation


class QualificationResult(BaseModel):
    """Structured qualification assessment with segregated facts and inferences."""
    is_qualified: bool
    status: str # NEW, QUALIFIED, NEEDS_REVIEW, DISQUALIFIED
    intent_category: str # HIGH_INTENT, POSSIBLE_INTENT, INFORMATIONAL, IRRELEVANT, NEGATIVE
    service_needed: Optional[str]
    location: Optional[str]
    urgency: str # HIGH, MEDIUM, LOW
    priority_score: int # 0-100
    priority_factors: List[str]
    facts: List[str]
    inferences: List[Dict[str, Any]]
    recommended_action: str


class LeadQualificationAgent:
    """
    Evaluates intent signals, enforces zero-hallucination fact/inference separation,
    and creates or updates V5SocialLead lifecycle states.
    """

    def qualify_signal(
        self,
        signal_content: str,
        signal_location: Optional[str],
        author_name: Optional[str],
        suite: Optional[V5GeneratedAgentSuite] = None,
        config: Optional[Dict[str, Any]] = None
    ) -> QualificationResult:
        """
        Pure qualification evaluation logic.
        """
        # Load business parameters
        if suite:
            cat = suite.business_category
            target_loc = suite.location_area
            radius = suite.service_radius_miles
            services = suite.services or []
            keywords = suite.keywords or []
            excluded = suite.excluded_keywords or []
            b_name = suite.business_name
        elif config:
            cat = config.get("business_category", "Dental Clinic")
            target_loc = config.get("location_area", "Austin, Texas")
            radius = int(config.get("service_radius_miles", 25))
            services = config.get("services", [])
            keywords = config.get("keywords", [])
            excluded = config.get("excluded_keywords", [])
            b_name = config.get("business_name", "Business")
        else:
            cat = "General"
            target_loc = "Austin, TX"
            radius = 25
            services = []
            keywords = []
            excluded = []
            b_name = "Business"

        # 1. Matching Engine Evaluation
        match: MatchEvaluation = signal_matching_engine.evaluate_signal(
            signal_content=signal_content,
            signal_location=signal_location,
            business_category=cat,
            target_location=target_loc,
            service_radius_miles=radius,
            services=services,
            keywords=keywords,
            excluded_keywords=excluded
        )

        content_lower = signal_content.lower()

        # 2. Extract Verifiable Facts
        facts = []
        if author_name:
            facts.append(f"Author stated name / handle: '{author_name}'")
        if signal_location:
            facts.append(f"Signal location metadata: '{signal_location}'")
        if match.matched_services:
            facts.append(f"Explicitly mentioned service/need terms: {', '.join(match.matched_services)}")
        if match.detected_keywords:
            facts.append(f"Explicit keyword matches: {', '.join(match.detected_keywords)}")

        # Extract specific temporal or pain facts
        if any(w in content_lower for w in ["today", "asap", "now", "yesterday", "this weekend"]):
            temporal_words = [w for w in ["today", "asap", "now", "yesterday", "this weekend"] if w in content_lower]
            facts.append(f"Explicit timeframe stated: '{', '.join(temporal_words)}'")

        if any(w in content_lower for w in ["hurts", "broken", "accident", "totaled", "leak", "severe"]):
            symptom_words = [w for w in ["hurts", "broken", "accident", "totaled", "leak", "severe"] if w in content_lower]
            facts.append(f"Explicit condition stated: '{', '.join(symptom_words)}'")

        if not facts:
            facts.append(f"Raw post text observed: '{signal_content[:100]}...'")

        # 3. Formulate Deductive Inferences with Confidence Scores
        inferences = []
        is_urgent = any(w in content_lower for w in ["emergency", "urgent", "today", "now", "hurts", "severe", "accident"])
        if is_urgent:
            urgency = "HIGH"
            inferences.append({
                "deduction": "Prospect has acute urgency requiring same-day or priority scheduling",
                "confidence": 0.90,
                "basis": "Immediate temporal or symptom cues in text"
            })
        elif any(w in content_lower for w in ["planning", "next month", "looking for", "consultation", "quote"]):
            urgency = "MEDIUM"
            inferences.append({
                "deduction": "Prospect is actively evaluating options for near-term booking",
                "confidence": 0.85,
                "basis": "Planning or quote inquiry language"
            })
        else:
            urgency = "LOW"
            inferences.append({
                "deduction": "General or low-urgency commercial exploration",
                "confidence": 0.65,
                "basis": "Absence of explicit timing constraints"
            })

        service_needed = match.matched_services[0] if match.matched_services else (services[0] if services else cat)
        inferences.append({
            "deduction": f"Best matching core service is '{service_needed}'",
            "confidence": 0.88 if match.matched_services else 0.60,
            "basis": f"Keyword correlation with {cat} service catalog"
        })

        # 4. Priority Factors & Transparent Score
        priority_factors = []
        score = 0

        if match.intent_category == "HIGH_INTENT":
            score += 40
            priority_factors.append("✓ Explicit commercial service request (+40)")
        elif match.intent_category == "POSSIBLE_INTENT":
            score += 25
            priority_factors.append("✓ Relevant category interest (+25)")

        if match.location_matched:
            score += 25
            priority_factors.append(f"✓ Located inside {target_loc} service area (+25)")
        else:
            priority_factors.append("✗ Outside primary service territory (+0)")

        if urgency == "HIGH":
            score += 25
            priority_factors.append("✓ Urgent / immediate need (+25)")
        elif urgency == "MEDIUM":
            score += 15
            priority_factors.append("✓ Near-term booking intent (+15)")

        if match.matched_services:
            score += 10
            priority_factors.append(f"✓ Direct match to core service '{service_needed}' (+10)")

        priority_score = min(100, max(0, score))

        # 5. Lifecycle Status Determination
        if match.intent_category == "NEGATIVE" or not match.is_match:
            lead_status = "DISQUALIFIED"
            recommended_action = "Do not engage; signal fails qualification rules."
            is_qualified = False
        elif priority_score >= 70:
            lead_status = "QUALIFIED"
            recommended_action = f"Draft verified {urgency.lower()}-priority outreach response for {b_name} operator review."
            is_qualified = True
        elif priority_score >= 40:
            lead_status = "NEEDS_REVIEW"
            recommended_action = "Operator review recommended before initiating contact."
            is_qualified = True
        else:
            lead_status = "DISQUALIFIED"
            recommended_action = "Disqualified due to insufficient relevance or location mismatch."
            is_qualified = False

        return QualificationResult(
            is_qualified=is_qualified,
            status=lead_status,
            intent_category=match.intent_category,
            service_needed=service_needed if is_qualified else None,
            location=signal_location or target_loc,
            urgency=urgency,
            priority_score=priority_score,
            priority_factors=priority_factors,
            facts=facts,
            inferences=inferences,
            recommended_action=recommended_action
        )

    async def qualify_and_persist(
        self,
        session: AsyncSession,
        signal: V5SocialSignal,
        suite: Optional[V5GeneratedAgentSuite] = None
    ) -> V5SocialLead:
        """
        Executes qualification and persists the resulting V5SocialLead into the CRM.
        """
        qual_res = self.qualify_signal(
            signal_content=signal.content,
            signal_location=signal.location_raw,
            author_name=signal.author_name,
            suite=suite
        )

        # Update signal
        signal.processed = True
        signal.processed_at = datetime.now(timezone.utc)
        signal.intent_category = qual_res.intent_category
        signal.relevance_score = qual_res.priority_score / 100.0

        # Create or update V5SocialLead
        stmt = select(V5SocialLead).where(
            V5SocialLead.business_id == signal.business_id,
            V5SocialLead.signal_id == signal.id
        )
        res = await session.execute(stmt)
        lead = res.scalars().first()

        if not lead:
            lead = V5SocialLead(
                id=str(uuid.uuid4()),
                business_id=signal.business_id,
                signal_id=signal.id,
                suite_id=suite.id if suite else None,
                contact_name=signal.author_name,
                contact_handle=signal.author_id,
                channel="SOCIAL_REPLY",
                status=qual_res.status,
                qualification_facts=qual_res.facts,
                qualification_inferences=qual_res.inferences,
                service_needed=qual_res.service_needed,
                location=qual_res.location,
                urgency=qual_res.urgency,
                priority_score=qual_res.priority_score,
                priority_factors=qual_res.priority_factors,
                recommended_action=qual_res.recommended_action,
                response_status="NONE",
                opt_out_status="NOT_OPTED_OUT",
                meta_json={"intent_category": qual_res.intent_category}
            )
            session.add(lead)
        else:
            lead.status = qual_res.status
            lead.qualification_facts = qual_res.facts
            lead.qualification_inferences = qual_res.inferences
            lead.service_needed = qual_res.service_needed
            lead.location = qual_res.location
            lead.urgency = qual_res.urgency
            lead.priority_score = qual_res.priority_score
            lead.priority_factors = qual_res.priority_factors
            lead.recommended_action = qual_res.recommended_action

        await session.commit()
        await session.refresh(lead)
        return lead


lead_qualification_agent = LeadQualificationAgent()
