import re
import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

GENERIC_CLICHES = [
    "i hope this email finds you well",
    "allow me to introduce myself",
    "dear business owner",
    "dear sir/madam",
    "to whom it may concern",
    "synergy",
    "game-changer",
    "revolutionize your business",
    "guaranteed 10x ROI",
    "act now before it is too late"
]

SPAM_TRIGGERS = [
    "100% free",
    "risk-free",
    "no obligation",
    "click here",
    "buy now",
    "winner",
    "urgent response needed",
    "$$$",
    "unlimited leads",
    "earn millions"
]

class PersonalizationScorer:
    """
    Evaluates cold email copy against strict B2B outreach quality standards.
    Assigns a multi-factor Personalization Quality Score (0-100).
    """

    def score_email(
        self,
        subject: str,
        body: str,
        business_name: str,
        industry: str,
        verified_facts: List[str] = None
    ) -> Dict[str, Any]:
        score = 100
        penalties = []
        strengths = []
        verified_facts = verified_facts or []

        combined_text = f"{subject} {body}".lower()
        words = body.split()
        word_count = len(words)

        # 1. Word Count Penalty
        if word_count < 25:
            score -= 15
            penalties.append(f"Too short ({word_count} words). May lack substantive context.")
        elif word_count > 180:
            score -= 15
            penalties.append(f"Too long ({word_count} words). High friction for busy business owners.")
        else:
            strengths.append(f"Optimal length ({word_count} words).")

        # 2. Generic Clichés Detection
        for cliche in GENERIC_CLICHES:
            if cliche in combined_text:
                score -= 15
                penalties.append(f"Contains generic cliché: '{cliche}'")

        # 3. Spam Triggers Detection
        spam_hits = []
        for trigger in SPAM_TRIGGERS:
            if trigger in combined_text:
                score -= 20
                spam_hits.append(trigger)
                penalties.append(f"Contains high-risk spam keyword: '{trigger}'")

        # 4. Specific Business Grounding Check
        name_in_text = business_name.lower() in combined_text
        if not name_in_text:
            score -= 10
            penalties.append("Does not mention the prospect business name explicitly.")
        else:
            strengths.append("Directly references target business name.")

        # Check evidence/fact inclusion
        if verified_facts:
            facts_referenced = 0
            for fact in verified_facts:
                fact_keywords = [w for w in re.sub(r'[^a-zA-Z0-9\s]', '', fact.lower()).split() if len(w) > 4]
                if any(kw in combined_text for kw in fact_keywords):
                    facts_referenced += 1

            if facts_referenced > 0:
                strengths.append(f"References {facts_referenced} verified business fact(s).")
            else:
                score -= 5
                penalties.append("Lacks explicit reference to verified technical or operational facts.")

        # 5. Call-To-Action (CTA) Friction Evaluation
        has_question = "?" in body
        if not has_question:
            score -= 10
            penalties.append("Lacks a clear, low-friction conversational closing question.")
        else:
            strengths.append("Ends with a low-friction conversational question.")

        # Cap score between 0 and 100
        final_score = max(0, min(100, score))
        
        return {
            "personalization_score": final_score,
            "word_count": word_count,
            "spam_risk": "HIGH" if len(spam_hits) > 0 or final_score < 60 else ("MEDIUM" if final_score < 75 else "LOW"),
            "penalties": penalties,
            "strengths": strengths,
            "passes_quality_gate": final_score >= 70
        }

personalization_scorer = PersonalizationScorer()
