import re
from urllib.parse import urlparse
from typing import Optional

class LeadNormalizer:
    """
    Normalizes company names, website domains, emails, and phone numbers for consistent deduplication.
    """

    @staticmethod
    def normalize_company_name(name: str) -> str:
        if not name:
            return ""
        # Lowercase, remove corporate suffixes like LLC, Inc, Ltd, Co, Group, Dental Clinic -> canonical
        clean = name.lower().strip()
        clean = re.sub(r'[^\w\s]', '', clean) # remove punctuation
        clean = re.sub(r'\b(llc|inc|incorporated|ltd|limited|co|corp|corporation|group|plc|pty)\b', '', clean)
        clean = re.sub(r'\s+', ' ', clean).strip()
        return clean

    @staticmethod
    def normalize_domain(url_or_domain: str) -> Optional[str]:
        if not url_or_domain:
            return None
        text = url_or_domain.strip().lower()
        if not text.startswith("http://") and not text.startswith("https://"):
            text = f"https://{text}"
        try:
            parsed = urlparse(text)
            domain = parsed.netloc or parsed.path
            domain = re.sub(r'^www\.', '', domain)
            domain = domain.split(':')[0] # strip port
            return domain.strip().lower() if domain else None
        except Exception:
            return None

    @staticmethod
    def normalize_email(email: str) -> Optional[str]:
        if not email or "@" not in email:
            return None
        return email.strip().lower()

    @staticmethod
    def normalize_phone(phone: str) -> Optional[str]:
        if not phone:
            return None
        # Extract digits
        digits = re.sub(r'\D', '', phone)
        return digits if len(digits) >= 7 else None

normalizer = LeadNormalizer()
