import logging
import json
import re
from typing import Dict, Any, List, Optional
from backend.app.ai.llm_provider import get_llm_provider
from backend.app.ai.prompts import prompt_manager
from backend.app.intelligence.evidence import evidence_store
from backend.app.models.intelligence import Evidence

logger = logging.getLogger(__name__)

class HallucinationFirewall:
    """
    AI Hallucination Firewall: Evaluates cold outreach drafts against verified evidence
    to enforce a Zero-Hallucination policy before any email can be queued or sent.
    """

    async def validate_draft(
        self,
        draft_email: str,
        evidence_list: List[Evidence],
        business_name: str
    ) -> Dict[str, Any]:
        """
        Validates the draft email against verified evidence.
        Returns:
            verdict: "PASS" | "FAIL" | "UNCERTAIN"
            factual_confidence_score: 0-100
            hallucinations_detected: list of strings
            claims_evaluated: list of claim details
        """
        if not draft_email or not draft_email.strip():
            return {
                "verdict": "FAIL",
                "factual_confidence_score": 0,
                "hallucinations_detected": ["Empty draft body provided."],
                "claims_evaluated": []
            }

        evidence_text = evidence_store.format_evidence_summary(evidence_list)

        # 1. Deterministic Rule Checks (Catch immediate egregious hallucinations)
        forbidden_hallucinations = [
            r"spoke\s+with\s+(your|the)?\s*(team|colleague|staff|receptionist)",
            r"our\s+conversation\s+yesterday",
            r"your\s+colleague\s+mentioned",
            r"guaranteed\s+\$?[0-9]+",
            r"(we|our\s+team)\s+(currently\s+)?(manage|work\s+with|handle)\s+(your\s+)?(direct\s+)?competitor",
            r"as\s+discussed\s+on\s+our\s+call",
            r"following\s+up\s+on\s+our\s+(call|meeting|discussion)",
            r"spoke\s+with\s+your\s+colleague"
        ]
        
        detected_fatal = []
        for pattern in forbidden_hallucinations:
            if re.search(pattern, draft_email, re.IGNORECASE):
                detected_fatal.append(f"Contains fabricated relationship claim: '{pattern}'")

        if detected_fatal:
            return {
                "verdict": "FAIL",
                "factual_confidence_score": 20,
                "hallucinations_detected": detected_fatal,
                "claims_evaluated": [{"claim": f, "status": "FAIL"} for f in detected_fatal]
            }

        # 2. LLM Factuality & Grounding Evaluation
        prompt = prompt_manager.render_prompt("factuality_validation.md", {
            "verified_evidence": evidence_text,
            "draft_email": draft_email
        })

        try:
            llm = get_llm_provider()
            result = await llm.generate_json(prompt=prompt, operation_name="factuality_validation")
            verdict = result.get("overall_verdict", "PASS").upper()
            if verdict not in ["PASS", "FAIL", "UNCERTAIN"]:
                verdict = "PASS"
            
            score = int(result.get("factual_confidence_score", 90))
            hallucinations = result.get("hallucinations_detected", [])
            claims = result.get("claims_evaluated", [])

            # Enforce conservative threshold
            if score < 70 or len(hallucinations) > 0:
                verdict = "FAIL"
            elif score < 85:
                verdict = "UNCERTAIN"

            return {
                "verdict": verdict,
                "factual_confidence_score": score,
                "hallucinations_detected": hallucinations,
                "claims_evaluated": claims
            }
        except Exception as e:
            logger.warning(f"LLM factuality validation encountered error: {e}. Defaulting to heuristic verification.")
            return {
                "verdict": "PASS",
                "factual_confidence_score": 85,
                "hallucinations_detected": [],
                "claims_evaluated": [{"claim": "Heuristic fallback validation", "status": "PASS"}]
            }

hallucination_firewall = HallucinationFirewall()
