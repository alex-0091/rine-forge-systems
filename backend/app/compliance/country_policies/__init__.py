from typing import Dict, Any, Type
from backend.app.compliance.country_policies.USA import USAPolicy
from backend.app.compliance.country_policies.international import (
    UKPolicy, CanadaPolicy, AustraliaPolicy, NewZealandPolicy, SingaporePolicy, UAEPolicy, EUPolicy
)

POLICY_REGISTRY: Dict[str, Any] = {
    "USA": USAPolicy,
    "United States": USAPolicy,
    "US": USAPolicy,
    "UK": UKPolicy,
    "United Kingdom": UKPolicy,
    "Canada": CanadaPolicy,
    "Australia": AustraliaPolicy,
    "New Zealand": NewZealandPolicy,
    "NZ": NewZealandPolicy,
    "Singapore": SingaporePolicy,
    "UAE": UAEPolicy,
    "United Arab Emirates": UAEPolicy,
    "EU": EUPolicy
}

def get_country_policy(country_name: str):
    return POLICY_REGISTRY.get(country_name.strip(), USAPolicy)
