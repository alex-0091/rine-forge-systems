import logging
from typing import Dict, Any, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.config import settings
from backend.app.compliance.country_policies import get_country_policy
from backend.app.compliance.suppression import suppression_manager

logger = logging.getLogger(__name__)

class ComplianceEngine:
    """
    Validates outbound messages against country legal standards, suppression rules,
    and anti-spam policies prior to queueing and sending.
    """

    @classmethod
    async def evaluate_lead_and_message(
        cls,
        session: AsyncSession,
        recipient_email: str,
        country: str,
        subject: str,
        body_text: str,
        business_domain: str = None,
        company_name: str = None
    ) -> Tuple[bool, Dict[str, Any]]:
        # 1. Suppression Check
        is_supp = await suppression_manager.is_suppressed(
            session=session,
            email=recipient_email,
            domain=business_domain,
            company=company_name
        )
        if is_supp:
            return False, {
                "passed": False,
                "reason": "Recipient, domain, or company is present on the SUPPRESSION list.",
                "policy_code": "SUPPRESSED"
            }

        # 2. Country Policy Check
        policy_class = get_country_policy(country)
        if not policy_class.ALLOWED_FOR_COLD_B2B:
            return False, {
                "passed": False,
                "reason": f"Outreach is currently disabled for {country} under strict compliance rules.",
                "policy_code": f"{country.upper()}_RESTRICTED"
            }

        sender_profile = {
            "name": settings.SENDER_NAME,
            "company": settings.SENDER_COMPANY,
            "email": settings.SENDER_EMAIL,
            "physical_address": settings.SENDER_PHYSICAL_ADDRESS
        }

        policy_result = policy_class.validate_message(
            message_data={"subject": subject, "body_text": body_text},
            sender_profile=sender_profile
        )

        if not policy_result.get("compliant", False):
            return False, {
                "passed": False,
                "reason": "; ".join(policy_result.get("issues", ["Country policy violation"])),
                "policy_code": f"{country.upper()}_POLICY_FAIL"
            }

        # 3. Text Spam & Deception Check
        forbidden_spam_phrases = [
            "100% FREE", "ACT NOW OR LOSE OUT", "GUARANTEED 10X", "$$$", 
            "NOT SPAM", "YOU HAVE BEEN SELECTED", "URGENT ACTION REQUIRED"
        ]
        upper_body = body_text.upper()
        found_spam_triggers = [p for p in forbidden_spam_phrases if p in upper_body]
        if found_spam_triggers:
            return False, {
                "passed": False,
                "reason": f"Spam trigger phrases detected: {', '.join(found_spam_triggers)}",
                "policy_code": "SPAM_TRIGGER_DETECTED"
            }

        return True, {
            "passed": True,
            "reason": "All compliance, suppression, and quality checks passed.",
            "policy_code": "PASSED"
        }

compliance_engine = ComplianceEngine()
