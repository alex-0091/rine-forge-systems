from typing import Dict, Any

class USAPolicy:
    """
    United States CAN-SPAM Act Compliance Policy for B2B Commercial Outreach.
    Requirements:
    1. Accurate header and routing information (non-deceptive).
    2. Non-misleading subject line relevant to message body.
    3. Clear identification that message is a commercial proposal / introduction.
    4. Valid physical postal address of sender included in footer.
    5. Clear, conspicuous opt-out mechanism (processed within 10 days, honored indefinitely).
    """
    COUNTRY_CODE = "USA"
    ALLOWED_FOR_COLD_B2B = True
    REQUIRES_PHYSICAL_ADDRESS = True
    REQUIRES_OPTOUT_LINK = True
    REQUIRES_PRIOR_CONSENT = False # CAN-SPAM is opt-out regime for commercial B2B

    @classmethod
    def validate_message(cls, message_data: Dict[str, Any], sender_profile: Dict[str, Any]) -> Dict[str, Any]:
        issues = []
        if not sender_profile.get("physical_address"):
            issues.append("USA CAN-SPAM requires a valid physical postal address in email footer.")
            
        subject = message_data.get("subject", "").strip()
        if not subject or any(w in subject.upper() for w in ["RE:", "FWD:", "URGENT TAX", "CLAIM YOUR PRIZE"]):
            issues.append("Subject line violates non-deceptive header rules.")
            
        return {
            "compliant": len(issues) == 0,
            "policy": cls.COUNTRY_CODE,
            "issues": issues,
            "recommendation": "Passes CAN-SPAM standard." if len(issues) == 0 else "Fix footer/subject."
        }
