import csv
import io
from typing import List
from backend.app.discovery.base import LeadSource, DiscoveredLead

class CsvImportSource(LeadSource):
    """
    Imports business leads from CSV uploads or text data.
    """
    def __init__(self, csv_content: str):
        self.csv_content = csv_content

    async def discover_leads(self, industry: str = "", country: str = "", limit: int = 100, **kwargs) -> List[DiscoveredLead]:
        leads = []
        reader = csv.DictReader(io.StringIO(self.csv_content))
        for row in reader:
            name = row.get("name") or row.get("company") or row.get("business_name", "")
            ind = row.get("industry") or industry or "General Business"
            cnt = row.get("country") or country or "USA"
            
            if not name:
                continue
                
            lead = DiscoveredLead(
                name=name.strip(),
                industry=ind.strip(),
                country=cnt.strip(),
                city=row.get("city", "").strip() or None,
                state_province=row.get("state", "").strip() or None,
                website_url=row.get("website", "").strip() or row.get("website_url", "").strip() or None,
                primary_email=row.get("email", "").strip() or row.get("primary_email", "").strip() or None,
                primary_phone=row.get("phone", "").strip() or None,
                contact_name=row.get("contact_name", "").strip() or row.get("owner", "").strip() or None,
                contact_role=row.get("role", "").strip() or row.get("contact_role", "").strip() or "Owner",
                source="csv_import"
            )
            leads.append(lead)
            if len(leads) >= limit:
                break
        return leads

class WebDirectorySource(LeadSource):
    """
    Pluggable web directory source interface.
    """
    async def discover_leads(self, industry: str, country: str, limit: int = 10, **kwargs) -> List[DiscoveredLead]:
        # Connects to legal external B2B APIs / directory search providers
        return []
