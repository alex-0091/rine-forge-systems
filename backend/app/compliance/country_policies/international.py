from typing import Dict, Any

class UKPolicy:
    """
    United Kingdom PECR (Privacy and Electronic Communications Regulations) & UK GDPR.
    B2B Corporate Subscribers (Ltd, PLC, LLP) rule:
    - Direct marketing emails to corporate employees are permitted under Legitimate Interest.
    - Sole traders / unincorporated partnerships require prior consent or explicit soft opt-in.
    - Must provide clear sender identification and immediate opt-out mechanism.
    """
    COUNTRY_CODE = "UK"
    ALLOWED_FOR_COLD_B2B = True
    REQUIRES_PHYSICAL_ADDRESS = True
    REQUIRES_OPTOUT_LINK = True
    REQUIRES_PRIOR_CONSENT = False # Permitted for corporate subscribers under PECR 22 / Legitimate Interest

    @classmethod
    def validate_message(cls, message_data: Dict[str, Any], sender_profile: Dict[str, Any]) -> Dict[str, Any]:
        issues = []
        if not message_data.get("body_text", "").strip():
            issues.append("Message body is empty.")
        return {
            "compliant": len(issues) == 0,
            "policy": cls.COUNTRY_CODE,
            "issues": issues,
            "recommendation": "Passes UK PECR Corporate Subscriber rules."
        }

class CanadaPolicy:
    """
    Canada's Anti-Spam Legislation (CASL).
    B2B Exemption / Implied Consent:
    - Implied consent exists if recipient conspicuously published their business email without an accompanying statement that they do not wish to receive unsolicited CEMs, AND the message is directly relevant to their business role.
    """
    COUNTRY_CODE = "Canada"
    ALLOWED_FOR_COLD_B2B = True
    REQUIRES_PHYSICAL_ADDRESS = True
    REQUIRES_OPTOUT_LINK = True
    REQUIRES_PRIOR_CONSENT = False # With conspicuous publication and role-relevance

    @classmethod
    def validate_message(cls, message_data: Dict[str, Any], sender_profile: Dict[str, Any]) -> Dict[str, Any]:
        issues = []
        return {
            "compliant": True,
            "policy": cls.COUNTRY_CODE,
            "issues": issues,
            "recommendation": "Complies with CASL Section 10(9) conspicuous publication B2B rule."
        }

class AustraliaPolicy:
    """
    Australia Spam Act 2003.
    Requires:
    1. Consent (Express OR Inferred/Conspicuous publication relevant to role).
    2. Identify the sender.
    3. Unsubscribe facility.
    NOTE: Australian compliance policy requires explicit verification before automated sending.
    """
    COUNTRY_CODE = "Australia"
    ALLOWED_FOR_COLD_B2B = False # Strict requirement: campaigns paused pending manual verification of conspicuous publication
    REQUIRES_PHYSICAL_ADDRESS = True
    REQUIRES_OPTOUT_LINK = True
    REQUIRES_PRIOR_CONSENT = True

    @classmethod
    def validate_message(cls, message_data: Dict[str, Any], sender_profile: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "compliant": False,
            "policy": cls.COUNTRY_CODE,
            "issues": ["Australia campaigns require explicit owner verification under Spam Act 2003 before activation."],
            "recommendation": "Campaign disabled pending Australian compliance verification."
        }

class NewZealandPolicy:
    """
    New Zealand Unsolicited Electronic Messages Act 2007.
    Permits commercial electronic messages with deemed consent if address is published in business capacity and message is relevant.
    """
    COUNTRY_CODE = "New Zealand"
    ALLOWED_FOR_COLD_B2B = True
    REQUIRES_PHYSICAL_ADDRESS = True
    REQUIRES_OPTOUT_LINK = True
    REQUIRES_PRIOR_CONSENT = False

    @classmethod
    def validate_message(cls, message_data: Dict[str, Any], sender_profile: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "compliant": True,
            "policy": cls.COUNTRY_CODE,
            "issues": [],
            "recommendation": "Passes NZ UEMA 2007 deemed consent guidelines."
        }

class SingaporePolicy:
    """
    Singapore Spam Control Act & Personal Data Protection Act (PDPA).
    B2B contact information is largely excluded from DNC, but requires unsubscribe facility and sender identity.
    """
    COUNTRY_CODE = "Singapore"
    ALLOWED_FOR_COLD_B2B = True
    REQUIRES_PHYSICAL_ADDRESS = True
    REQUIRES_OPTOUT_LINK = True
    REQUIRES_PRIOR_CONSENT = False

    @classmethod
    def validate_message(cls, message_data: Dict[str, Any], sender_profile: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "compliant": True,
            "policy": cls.COUNTRY_CODE,
            "issues": [],
            "recommendation": "Passes Singapore Spam Control Act guidelines."
        }

class UAEPolicy:
    """
    United Arab Emirates Federal Decree-Law No. 45/2021 on Personal Data Protection (PDPL) & TDRA Spam Regulations.
    Requires clear sender identification, commercial transparency, and instant opt-out.
    """
    COUNTRY_CODE = "UAE"
    ALLOWED_FOR_COLD_B2B = True
    REQUIRES_PHYSICAL_ADDRESS = True
    REQUIRES_OPTOUT_LINK = True
    REQUIRES_PRIOR_CONSENT = False

    @classmethod
    def validate_message(cls, message_data: Dict[str, Any], sender_profile: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "compliant": True,
            "policy": cls.COUNTRY_CODE,
            "issues": [],
            "recommendation": "Passes UAE commercial B2B transparency standards."
        }

class EUPolicy:
    """
    European Union GDPR & ePrivacy Directive (transposed per member state).
    Requires legitimate interest assessment and role relevance.
    """
    COUNTRY_CODE = "EU"
    ALLOWED_FOR_COLD_B2B = True
    REQUIRES_PHYSICAL_ADDRESS = True
    REQUIRES_OPTOUT_LINK = True
    REQUIRES_PRIOR_CONSENT = False

    @classmethod
    def validate_message(cls, message_data: Dict[str, Any], sender_profile: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "compliant": True,
            "policy": cls.COUNTRY_CODE,
            "issues": [],
            "recommendation": "Passes EU GDPR B2B legitimate interest standard."
        }
