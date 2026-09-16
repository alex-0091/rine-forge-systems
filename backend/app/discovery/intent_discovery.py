"""
Rine Forge Systems V5 - Public Intent Engine (Module 43)
Classifies commercial buying intent from legitimate public & consented signals.
Enforces strict Anti-Health Inference Guard: NEVER infers diseases or medical conditions.
"""
import re
import logging
from typing import Dict, Any, Tuple

logger = logging.getLogger("rine_forge_systems.discovery.intent")

class IntentDiscoveryService:
    """
    Analyzes commercial intent without sensitive medical profiling.
    """

    # Regex patterns for legitimate commercial intent signals
    SERVICE_SEARCH_PATTERNS = [
        r"looking for (a|an|the) (\w+\s*){1,3}",
        r"anyone know (a|an) (good|reputable|recommended)?\s*(\w+)",
        r"need (a|an) (\w+\s*){1,3} in \w+",
        r"recommend (a|an|me)?\s*(\w+)",
        r"search(ing)? for (a|an) (\w+)"
    ]

    APPOINTMENT_PATTERNS = [
        r"need an appointment",
        r"book (an|a) appointment",
        r"schedule (a|an) consultation",
        r"opening(s)? this (week|friday|month)",
        r"how do i book"
    ]

    RECOMMENDATION_PATTERNS = [
        r"who do you recommend for",
        r"best (\w+) in \w+",
        r"any recommendations for",
        r"referral for"
    ]

    # Prohibited sensitive medical/health keywords that must NEVER be used to infer medical conditions
    SENSITIVE_MEDICAL_KEYWORDS = [
        "pain", "toothache", "bleeding", "abscess", "cavity", "infection",
        "swollen", "broken tooth", "emergency surgery", "root canal pain",
        "hurt", "hurting", "ache", "sore", "gum disease", "cancer"
    ]

    def evaluate_privacy_and_intent(self, raw_text: str) -> Tuple[str, float, str]:
        """
        Classifies intent and enforces strict non-medical inference guard.
        Returns (intent, confidence, matched_reason).
        """
        text_lower = raw_text.lower().strip()

        # 1. Anti-Health Inference Check
        # If personal post describes distress/pain, strictly refuse to infer medical intent
        has_health_complaint = any(kw in text_lower for kw in self.SENSITIVE_MEDICAL_KEYWORDS)
        
        # Check explicit commercial service search
        is_service_search = any(re.search(pat, text_lower) for pat in self.SERVICE_SEARCH_PATTERNS)
        is_appointment = any(re.search(pat, text_lower) for pat in self.APPOINTMENT_PATTERNS)
        is_recommendation = any(re.search(pat, text_lower) for pat in self.RECOMMENDATION_PATTERNS)

        if has_health_complaint and not (is_service_search or is_appointment or is_recommendation):
            # Guardrail triggered: Personal expression of pain/health distress without explicit commercial request
            logger.info("Anti-Health Privacy Guard triggered: rejecting medical inference from personal text.")
            return (
                "DISQUALIFIED_SENSITIVE_CONTENT",
                0.0,
                "Rejected by Anti-Health Inference Guard: Personal health distress must never be mined for commercial leads."
            )

        # 2. Legitimate Commercial Intent Classification
        if is_appointment:
            return (
                "APPOINTMENT_INTENT",
                0.95,
                "Explicit statement expressing intent to schedule an appointment or consultation."
            )

        if is_service_search:
            return (
                "SERVICE_SEARCH",
                0.90,
                "Explicit public inquiry seeking a business provider or local professional service."
            )

        if is_recommendation:
            return (
                "RECOMMENDATION_REQUEST",
                0.88,
                "Public peer inquiry requesting trusted business or provider recommendations."
            )

        if "cost" in text_lower or "price" in text_lower or "rate" in text_lower:
            return (
                "PRICE_RESEARCH",
                0.80,
                "Inquiry evaluating commercial pricing or service rates."
            )

        return (
            "GENERAL_INQUIRY",
            0.50,
            "General inquiry without distinct high-intent commercial signal."
        )

    def analyze_intent(
        self,
        raw_text: str,
        source_type: Optional[str] = None,
        industry: Optional[str] = None,
        target_services: Optional[list] = None,
        source_url: Optional[str] = None
    ) -> "IntentEvaluationResult":
        text_lower = raw_text.lower().strip()

        # 1. Anti-Health Guard
        has_health_distress = any(kw in text_lower for kw in self.SENSITIVE_MEDICAL_KEYWORDS)
        is_service_search = any(re.search(pat, text_lower) for pat in self.SERVICE_SEARCH_PATTERNS)
        is_appointment = any(re.search(pat, text_lower) for pat in self.APPOINTMENT_PATTERNS)

        if has_health_distress and not (is_service_search or is_appointment):
            return IntentEvaluationResult(
                is_legitimate=False,
                intent_class="PERSONAL_HEALTH_DISTRESS",
                confidence=0.0,
                why_it_matched="",
                rejection_reason="Rejected by Anti-Health Inference Guard: Personal health distress must never be mined for commercial leads."
            )

        # 2. Industry Relevance & Irrelevant Topic Check
        if industry and industry.lower() in ("dental", "dentistry"):
            irrelevant_words = ["pizza", "plumbing", "roofing", "auto", "car", "mechanic", "restaurant", "burger", "hvac", "tacos"]
            if any(w in text_lower for w in irrelevant_words) and not any(d in text_lower for d in ["dent", "teeth", "tooth", "smile", "clinic", "clean"]):
                return IntentEvaluationResult(
                    is_legitimate=False,
                    intent_class="IRRELEVANT_TOPIC",
                    confidence=0.0,
                    why_it_matched="",
                    rejection_reason=f"Topic does not match target industry '{industry}'"
                )

        # 3. Legitimate intent match
        if is_service_search or is_appointment or any(k in text_lower for k in ["dentist", "dental", "whitening", "clinic", "doctor", "consultation", "service"]):
            return IntentEvaluationResult(
                is_legitimate=True,
                intent_class="COMMERCIAL_SERVICE_SEARCH",
                confidence=0.92,
                why_it_matched=f"Commercial intent matching {industry or 'service'}: '{raw_text[:60]}...'"
            )

        intent_type, conf, reason = self.evaluate_privacy_and_intent(raw_text)
        if intent_type == "DISQUALIFIED_SENSITIVE_CONTENT":
            return IntentEvaluationResult(
                is_legitimate=False,
                intent_class="PERSONAL_HEALTH_DISTRESS",
                confidence=0.0,
                why_it_matched="",
                rejection_reason=reason
            )

        return IntentEvaluationResult(
            is_legitimate=True,
            intent_class=intent_type,
            confidence=conf,
            why_it_matched=reason
        )

class IntentEvaluationResult:
    def __init__(
        self,
        is_legitimate: bool,
        intent_class: str,
        confidence: float,
        why_it_matched: str,
        rejection_reason: Optional[str] = None
    ):
        self.is_legitimate = is_legitimate
        self.intent_class = intent_class
        self.confidence = confidence
        self.why_it_matched = why_it_matched
        self.rejection_reason = rejection_reason

intent_discovery_service = IntentDiscoveryService()

