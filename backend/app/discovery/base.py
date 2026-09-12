from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class DiscoveredLead(BaseModel):
    name: str
    industry: str
    country: str
    city: Optional[str] = None
    state_province: Optional[str] = None
    website_url: Optional[str] = None
    primary_email: Optional[str] = None
    primary_phone: Optional[str] = None
    contact_name: Optional[str] = None
    contact_role: Optional[str] = None
    source: str = "discovery_source"
    raw_metadata: Dict[str, Any] = Field(default_factory=dict)

class LeadSource(ABC):
    @abstractmethod
    async def discover_leads(self, industry: str, country: str, limit: int = 10, **kwargs) -> List[DiscoveredLead]:
        """Fetch potential business leads matching the criteria."""
        pass
