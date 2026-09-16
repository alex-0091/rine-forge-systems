"""
Rine Forge Systems V5 - Multi-Factor Lead Scoring Engine (Module 44)
Computes a transparent, multi-dimensional lead score (0–100)
strictly using legitimate commercial and non-sensitive signals.
"""
from typing import Dict, Any, Optional
from datetime import datetime, timezone

class LeadScoringEngineV5:
    """
    Evaluates intent, service relevance, recency, geographic fit,
    engagement, and consent status to produce a deterministic overall score.
    """

    def compute_score(
        self,
        intent: str,
        service_match: bool,
        location_fit_pct: int,
        timestamp: Optional[datetime] = None,
        previous_interactions: int = 0,
        consent_status: str = "UNKNOWN", # CONSENTED, OPTED_IN, PUBLIC_COMMERCIAL, UNKNOWN
        source_quality_tier: str = "STANDARD" # HIGH, STANDARD, LOW
    ) -> Dict[str, Any]:
        # 1. Intent Score (0–100)
        intent_scores = {
            "APPOINTMENT_INTENT": 95,
            "SERVICE_SEARCH": 90,
            "RECOMMENDATION_REQUEST": 85,
            "PRICE_RESEARCH": 75,
            "GENERAL_INQUIRY": 50,
            "DISQUALIFIED_SENSITIVE_CONTENT": 0
        }
        intent_val = intent_scores.get(intent, 50)

        # 2. Service Relevance (0–100)
        relevance_val = 90 if service_match else 50
        if source_quality_tier == "HIGH":
            relevance_val = min(100, relevance_val + 10)

        # 3. Recency Score (0–100)
        recency_val = 95
        if timestamp:
            now = datetime.now(timezone.utc)
            delta_hours = (now - timestamp).total_seconds() / 3600.0
            if delta_hours <= 2:
                recency_val = 98
            elif delta_hours <= 24:
                recency_val = 90
            elif delta_hours <= 72:
                recency_val = 75
            else:
                recency_val = max(30, int(75 - (delta_hours / 24) * 5))

        # 4. Geographic Fit (0–100)
        geo_val = max(0, min(100, location_fit_pct))

        # 5. Engagement & History (0–100)
        engagement_val = 60
        if previous_interactions > 0:
            engagement_val += min(30, previous_interactions * 15)
        if consent_status in ("CONSENTED", "OPTED_IN"):
            engagement_val += 10
        engagement_val = min(100, engagement_val)

        # 6. Weighted Overall Score
        # Formula: 30% Intent + 25% Relevance + 15% Recency + 15% GeoFit + 15% Engagement
        if intent == "DISQUALIFIED_SENSITIVE_CONTENT":
            overall_score = 0
        else:
            raw_weighted = (
                (0.30 * intent_val) +
                (0.25 * relevance_val) +
                (0.15 * recency_val) +
                (0.15 * geo_val) +
                (0.15 * engagement_val)
            )
            # Bonus/penalty based on consent
            if consent_status == "CONSENTED":
                raw_weighted += 5
            elif consent_status == "UNKNOWN":
                raw_weighted -= 3

            overall_score = max(5, min(99, int(round(raw_weighted))))

        return {
            "intent": intent,
            "relevance": int(relevance_val),
            "recency": int(recency_val),
            "geographicFit": int(geo_val),
            "engagement": int(engagement_val),
            "consentStatus": consent_status,
            "overallScore": overall_score
        }

    def calculate_score(
        self,
        intent_strength: float = 0.9,
        relevance_confidence: float = 0.85,
        recency_hours: float = 1.0,
        geo_fit: float = 1.0,
        engagement_depth: int = 1,
        consent_factor: float = 1.0
    ) -> Dict[str, Any]:
        """
        Normalized 0.0-1.0 scoring interface for Lead Engine pipeline.
        Returns overall score (0-100) and breakdown dict.
        """
        intent_comp = max(0, min(100, int(intent_strength * 100)))
        relevance_comp = max(0, min(100, int(relevance_confidence * 100)))
        
        # Recency decay
        if recency_hours <= 2:
            recency_comp = 95
        elif recency_hours <= 24:
            recency_comp = 85
        elif recency_hours <= 72:
            recency_comp = 70
        else:
            recency_comp = 50

        geo_comp = max(0, min(100, int(geo_fit * 100)))
        eng_comp = min(100, 50 + (engagement_depth * 10))

        raw = (
            (0.30 * intent_comp) +
            (0.25 * relevance_comp) +
            (0.15 * recency_comp) +
            (0.15 * geo_comp) +
            (0.15 * eng_comp)
        )
        # Apply consent modifier
        consent_penalty = (1.0 - consent_factor) * 20.0
        final_score = max(5, min(99, int(round(raw - consent_penalty))))


        breakdown = {
            "intent": intent_comp,
            "relevance": relevance_comp,
            "recency": recency_comp,
            "geo_fit": geo_comp,
            "engagement": eng_comp,
            "consent_factor": consent_factor
        }

        return {
            "score": final_score,
            "breakdown": breakdown
        }

lead_scoring_engine_v5 = LeadScoringEngineV5()
lead_scoring_engine = lead_scoring_engine_v5

