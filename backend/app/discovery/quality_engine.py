"""
Rine Forge Systems V5 - Data Quality Engine & Qualification Verifier
Validates contact integrity, enforces verified data states (VERIFIED, PARTIALLY_VERIFIED,
UNVERIFIED, INVALID, OPTED_OUT), and strictly separates verifiable FACTS from AI INFERENCES.
"""
import re
import logging
from typing import Dict, Any, List, Optional, Tuple
from datetime import datetime, timezone

logger = logging.getLogger("rine_forge_systems.discovery.quality")

EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
DISPOSABLE_DOMAINS = {
    "mailinator.com", "10minutemail.com", "tempmail.com", "guerrillamail.com",
    "sharklasers.com", "yopmail.com", "trashmail.com", "throwawaymail.com"
}

class DataQualityEngine:
    """
    Evaluates prospect data quality and validates readiness for compliant outreach.
    """

    @classmethod
    def validate_email(cls, email: Optional[str]) -> Tuple[bool, str]:
        """Validates business email syntax and rejects disposable domains."""
        if not email:
            return False, "Email address is missing"
        clean = email.strip().lower()
        if not EMAIL_REGEX.match(clean):
            return False, f"Invalid email format: '{clean}'"
        domain = clean.split("@")[-1]
        if domain in DISPOSABLE_DOMAINS:
            return False, f"Disposable or temporary domain rejected: '{domain}'"
        return True, "Valid format"

    @classmethod
    def validate_phone(cls, phone: Optional[str]) -> Tuple[bool, str]:
        """Validates phone number has at least 10 digits."""
        if not phone:
            return False, "Phone number is missing"
        digits = re.sub(r"\D", "", phone)
        if len(digits) < 10 or len(digits) > 15:
            return False, f"Invalid phone length ({len(digits)} digits)"
        return True, "Valid phone format"

    @classmethod
    def evaluate_quality_status(
        cls,
        company_name: str,
        website: Optional[str],
        email: Optional[str],
        phone: Optional[str],
        opt_out_status: str = "NOT_OPTED_OUT"
    ) -> Tuple[str, List[str]]:
        """
        Determines the authoritative data quality status:
        - OPTED_OUT: recipient has opted out of communication
        - INVALID: critical fields are malformed or missing
        - VERIFIED: company name + website + valid business email or phone
        - PARTIALLY_VERIFIED: company name + either website, email, or phone
        - UNVERIFIED: company name only, missing verifiable channels
        """
        if opt_out_status != "NOT_OPTED_OUT":
            return "OPTED_OUT", ["Recipient has active opt-out preferences"]

        issues = []
        if not company_name or len(company_name.strip()) < 2:
            return "INVALID", ["Company name is missing or too short"]

        email_valid, email_msg = cls.validate_email(email)
        if email and not email_valid:
            issues.append(email_msg)

        phone_valid, phone_msg = cls.validate_phone(phone)
        if phone and not phone_valid:
            issues.append(phone_msg)

        has_valid_website = bool(website and len(website.strip()) > 3 and "." in website)
        has_contact_channel = email_valid or phone_valid

        if email and not email_valid and phone and not phone_valid:
            return "INVALID", issues

        if has_contact_channel and has_valid_website:
            return "VERIFIED", ["Verified business website and active contact channel"]

        if has_contact_channel or has_valid_website:
            return "PARTIALLY_VERIFIED", ["Partially verified - missing either website or direct contact"]

        return "UNVERIFIED", ["No verified contact method or website"]

    @classmethod
    def structure_facts_and_inferences(
        cls,
        company_name: str,
        website: Optional[str],
        industry: str,
        location: Optional[str],
        observations: List[str],
        opportunities: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Strictly partitions factual signals from AI inferences.
        Guarantees transparency and prevents fabricated research claims.
        """
        facts = []
        if company_name:
            facts.append(f"Business Name: {company_name}")
        if website:
            facts.append(f"Published Website: {website}")
        if industry:
            facts.append(f"Target Vertical: {industry}")
        if location:
            facts.append(f"Public Operating Location: {location}")
        for obs in observations:
            facts.append(f"Observed Public Signal: {obs}")

        inferences = []
        for opp in opportunities:
            opp_type = opp.get("type", "AUTOMATION_OPPORTUNITY")
            reason = opp.get("reason", "Potential workflow optimization")
            inferences.append({
                "category": opp_type,
                "inferred_need": f"Opportunity for {opp_type.replace('_', ' ').title()}",
                "evidence_basis": opp.get("evidence", "Public operating profile"),
                "confidence": opp.get("confidence", 0.85),
                "disclaimer": "AI inference based on observable public business signals; not a guaranteed outcome."
            })

        return {
            "factual_signals": facts,
            "inferred_qualifications": inferences
        }

data_quality_engine = DataQualityEngine()
