import re
from typing import Tuple, Optional
from backend.app.discovery.base import DiscoveredLead

class LeadValidator:
    """
    Validates discovered lead data before ingestion into research queue.
    """

    @staticmethod
    def validate_lead(lead: DiscoveredLead) -> Tuple[bool, Optional[str]]:
        if not lead.name or len(lead.name.strip()) < 2:
            return False, "Business name is missing or too short."

        if not lead.industry or len(lead.industry.strip()) < 2:
            return False, "Industry is missing."

        if not lead.country or len(lead.country.strip()) < 2:
            return False, "Target country is missing."

        # Email format check if provided
        if lead.primary_email:
            email_pattern = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
            if not re.match(email_pattern, lead.primary_email.strip()):
                return False, f"Invalid email format: {lead.primary_email}"

        # Must have at least a website or contact email to qualify for B2B research
        if not lead.website_url and not lead.primary_email:
            return False, "Lead has neither website URL nor primary email for research."

        return True, None

validator = LeadValidator()
