"""
Rine Forge Systems V5 - Transparent Lead Prioritization Engine
Calculates an objective priority score (0-100) and produces a human-readable verification checklist.
"""
from typing import Dict, Any, List, Optional
from pydantic import BaseModel


class PriorityBreakdown(BaseModel):
    priority_score: int # 0-100
    priority_tier: str # HIGH, MEDIUM, LOW, DISQUALIFIED
    checklist: List[str]
    factor_scores: Dict[str, int]
    explanation: str


class LeadPrioritizationEngine:
    """
    Computes grounded, explainable priority scores for qualified leads.
    """

    def calculate_priority(
        self,
        intent_category: str,
        urgency: str,
        location_matched: bool,
        service_matched: bool,
        has_contact_identifier: bool,
        excluded_found: bool = False
    ) -> PriorityBreakdown:
        """
        Pure prioritization calculation.
        """
        if excluded_found or intent_category in ["NEGATIVE", "IRRELEVANT"]:
            return PriorityBreakdown(
                priority_score=0,
                priority_tier="DISQUALIFIED",
                checklist=["✗ Disqualified due to negative keywords or irrelevance (+0)"],
                factor_scores={"intent": 0, "location": 0, "urgency": 0, "service": 0, "contact": 0},
                explanation="Lead fails core suitability criteria."
            )

        factor_scores = {}
        checklist = []

        # 1. Commercial Intent (Max 30)
        if intent_category == "HIGH_INTENT":
            intent_pts = 30
            checklist.append("✓ Commercial Intent: Explicit service request or direct recommendation inquiry (+30)")
        elif intent_category == "POSSIBLE_INTENT":
            intent_pts = 20
            checklist.append("✓ Commercial Intent: Relevant category interest / exploratory (+20)")
        else:
            intent_pts = 10
            checklist.append("~ Commercial Intent: Informational / low-intent discussion (+10)")
        factor_scores["intent"] = intent_pts

        # 2. Geographic Fit (Max 25)
        if location_matched:
            loc_pts = 25
            checklist.append("✓ Location Fit: Directly verified inside target service radius (+25)")
        else:
            loc_pts = 5
            checklist.append("✗ Location Fit: Outside primary service territory or unverified (+5)")
        factor_scores["location"] = loc_pts

        # 3. Urgency & Timeliness (Max 20)
        u_upper = (urgency or "MEDIUM").upper()
        if u_upper == "HIGH":
            urg_pts = 20
            checklist.append("✓ Urgency: Immediate / same-day emergency need (+20)")
        elif u_upper == "MEDIUM":
            urg_pts = 15
            checklist.append("✓ Urgency: Active near-term booking timeframe (+15)")
        else:
            urg_pts = 5
            checklist.append("~ Urgency: Flexible or unstated timeframe (+5)")
        factor_scores["urgency"] = urg_pts

        # 4. Service Specificity (Max 15)
        if service_matched:
            srv_pts = 15
            checklist.append("✓ Service Fit: Explicit match to core catalog service (+15)")
        else:
            srv_pts = 5
            checklist.append("~ Service Fit: General category fit (+5)")
        factor_scores["service"] = srv_pts

        # 5. Contact Identifier Completeness (Max 10)
        if has_contact_identifier:
            cnt_pts = 10
            checklist.append("✓ Reachability: Valid public handle or contact identifier present (+10)")
        else:
            cnt_pts = 0
            checklist.append("✗ Reachability: Missing direct recipient handle (+0)")
        factor_scores["contact"] = cnt_pts

        # Calculate Total
        total = sum(factor_scores.values())
        total = min(100, max(0, total))

        if total >= 75:
            tier = "HIGH"
        elif total >= 50:
            tier = "MEDIUM"
        else:
            tier = "LOW"

        explanation = f"Calculated priority {total}/100 ({tier}) based on {len(checklist)} verified criteria."

        return PriorityBreakdown(
            priority_score=total,
            priority_tier=tier,
            checklist=checklist,
            factor_scores=factor_scores,
            explanation=explanation
        )


lead_prioritization_engine = LeadPrioritizationEngine()
