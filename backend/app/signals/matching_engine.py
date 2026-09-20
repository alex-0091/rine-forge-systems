"""
Rine Forge Systems V5 - Business & Location Matching Engine
Evaluates candidate signals against business configuration, geographic boundaries,
service catalogs, negative keywords, and classifies commercial intent.
"""
import re
from typing import Dict, Any, List, Optional, Tuple
from pydantic import BaseModel


class MatchEvaluation(BaseModel):
    """Detailed evaluation result from the matching engine."""
    is_match: bool
    intent_category: str # HIGH_INTENT, POSSIBLE_INTENT, INFORMATIONAL, IRRELEVANT, NEGATIVE
    category_matched: bool
    location_matched: bool
    matched_services: List[str]
    detected_keywords: List[str]
    excluded_keywords_found: List[str]
    relevance_score: float # 0.0 - 1.0
    reason: str


class SignalMatchingEngine:
    """
    Evaluates incoming signals against business target criteria.
    """

    # Common Texas metro clusters for radius heuristics
    METRO_CLUSTERS = {
        "austin": ["austin", "round rock", "cedar park", "pflugerville", "georgetown", "lakeway", "buda", "kyle", "westlake", "leander"],
        "dallas": ["dallas", "fort worth", "plano", "arlington", "frisco", "irving", "garland", "mckinney"],
        "houston": ["houston", "the woodlands", "sugar land", "katy", "pearland"],
        "san antonio": ["san antonio", "new braunfels", "schertz", "cibolo"]
    }

    def evaluate_signal(
        self,
        signal_content: str,
        signal_location: Optional[str],
        business_category: str,
        target_location: str,
        service_radius_miles: int,
        services: List[str],
        keywords: List[str],
        excluded_keywords: List[str]
    ) -> MatchEvaluation:
        """
        Executes comprehensive multi-factor matching.
        """
        content_lower = signal_content.lower()
        loc_lower = (signal_location or "").lower()
        target_loc_lower = target_location.lower()

        # 1. Negative Filter Check (Immediate Disqualification)
        excluded_found = []
        for ekw in excluded_keywords:
            if ekw.lower() in content_lower:
                excluded_found.append(ekw)

        if excluded_found:
            return MatchEvaluation(
                is_match=False,
                intent_category="NEGATIVE",
                category_matched=False,
                location_matched=False,
                matched_services=[],
                detected_keywords=[],
                excluded_keywords_found=excluded_found,
                relevance_score=0.0,
                reason=f"Excluded keyword(s) detected: {', '.join(excluded_found)}"
            )

        # 2. Location & Radius Evaluation
        location_matched = self._check_location_match(
            signal_location=loc_lower,
            signal_content=content_lower,
            target_location=target_loc_lower,
            radius_miles=service_radius_miles
        )

        # 3. Category & Service Matching
        matched_services = []
        for s in services:
            s_clean = s.lower().strip()
            # Split compound service phrases or check directly
            if s_clean in content_lower:
                matched_services.append(s)
            else:
                # Check significant terms within the service (e.g., "implants" in "Dental Implants")
                words = [w for w in re.findall(r"\w+", s_clean) if len(w) > 4 and w not in ["dental", "legal", "service", "general"]]
                if any(w in content_lower for w in words):
                    matched_services.append(s)

        # 4. Keyword Detection
        detected_keywords = []
        for kw in keywords:
            if kw.lower() in content_lower:
                detected_keywords.append(kw)

        # 5. Category Fit
        cat_lower = business_category.lower()
        category_matched = bool(matched_services or detected_keywords)
        if not category_matched:
            # Check general category keywords
            if "dent" in cat_lower and any(w in content_lower for w in ["tooth", "teeth", "dentist", "oral", "gum"]):
                category_matched = True
            elif "law" in cat_lower and any(w in content_lower for w in ["lawyer", "attorney", "accident", "injury", "claim", "sue"]):
                category_matched = True
            elif "rest" in cat_lower and any(w in content_lower for w in ["dinner", "restaurant", "eat", "dining", "table", "menu"]):
                category_matched = True
            elif "hotel" in cat_lower and any(w in content_lower for w in ["stay", "room", "hotel", "suite", "resort"]):
                category_matched = True
            elif "clean" in cat_lower and any(w in content_lower for w in ["cleaning", "maid", "cleaner", "deep clean"]):
                category_matched = True
            elif "market" in cat_lower and any(w in content_lower for w in ["marketing", "seo", "ads", "agency", "branding"]):
                category_matched = True

        # 6. Commercial Intent Classification
        high_intent_cues = [
            "recommend", "looking for", "need a", "need an", "who do you use",
            "anyone know a", "urgent", "today", "asap", "cost", "quote",
            "consultation", "booking", "hire", "best", "experience with"
        ]
        has_high_cue = any(cue in content_lower for cue in high_intent_cues)
        has_urgent_cue = any(cue in content_lower for cue in ["hurts", "pain", "broken", "emergency", "immediately", "accident", "totaled", "leak"])

        # Determine Intent Category
        if not category_matched:
            intent = "IRRELEVANT"
            relevance = 0.05
            reason = "Content does not match business category or services."
            is_match = False
        elif not location_matched:
            intent = "IRRELEVANT"
            relevance = 0.20
            reason = f"Signal location ({signal_location or 'Unknown'}) is outside the {service_radius_miles}-mile service radius."
            is_match = False
        elif has_urgent_cue or (has_high_cue and matched_services):
            intent = "HIGH_INTENT"
            relevance = 0.95
            reason = "Direct commercial inquiry with strong intent markers inside service area."
            is_match = True
        elif detected_keywords or matched_services:
            intent = "POSSIBLE_INTENT"
            relevance = 0.75
            reason = "Mentions relevant services and inside service area, exploratory intent."
            is_match = True
        else:
            intent = "INFORMATIONAL"
            relevance = 0.40
            reason = "General topical discussion without active purchasing request."
            is_match = False

        return MatchEvaluation(
            is_match=is_match,
            intent_category=intent,
            category_matched=category_matched,
            location_matched=location_matched,
            matched_services=matched_services,
            detected_keywords=detected_keywords,
            excluded_keywords_found=[],
            relevance_score=relevance,
            reason=reason
        )

    def _check_location_match(
        self,
        signal_location: str,
        signal_content: str,
        target_location: str,
        radius_miles: int
    ) -> bool:
        """
        Determines whether the signal is inside the service territory.
        Checks signal_location and mentions in content.
        """
        # If target location is broadly mentioned in signal location or content
        combined_text = f"{signal_location} {signal_content}"

        # Extract primary target city
        target_city = target_location.split(",")[0].strip().lower()

        # Check direct city match
        if target_city in combined_text:
            return True

        # Check regional cluster if city is recognized
        for cluster_name, suburbs in self.METRO_CLUSTERS.items():
            if cluster_name in target_city:
                # Suburbs in the same cluster are within typical ~25-35 mile radius
                if any(suburb in combined_text for suburb in suburbs):
                    return True
                # Conversely, if it explicitly mentions a different major metro in the same state (e.g., Dallas when targeting Austin)
                other_metros = [m for m in self.METRO_CLUSTERS.keys() if m != cluster_name]
                if any(om in signal_location for om in other_metros):
                    return False

        # If signal location is missing but content doesn't contradict, or state matches
        if not signal_location and not any(other in combined_text for other in ["new york", "chicago", "los angeles", "miami", "dallas"]):
            # Allow evaluation as possible match if local terms exist
            return True

        return False


signal_matching_engine = SignalMatchingEngine()
