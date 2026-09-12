from typing import List, Dict, Any
from backend.app.discovery.base import LeadSource, DiscoveredLead

class CuratedDirectorySource(LeadSource):
    """
    Curated high-value B2B benchmark directory for realistic discovery and testing across Tier 1/2 niches.
    """
    CURATED_DATA: List[Dict[str, Any]] = [
        # USA Dental
        {
            "name": "Biscayne Bay Dental Clinic",
            "industry": "Dental",
            "country": "USA",
            "city": "Miami",
            "state_province": "FL",
            "website_url": "https://biscayne-dental-demo.com",
            "primary_email": "dr.sarah@biscayne-dental-demo.com",
            "primary_phone": "+1 305-555-0192",
            "contact_name": "Dr. Sarah Jenkins",
            "contact_role": "Owner & Lead Dentist",
            "source": "curated_directory",
            "raw_metadata": {
                "cms": "WordPress",
                "has_booking": True,
                "booking_provider": "Local Schedule Widget",
                "has_live_chat": False,
                "faq_count": 8,
                "after_hours_support": "Phone voicemail"
            }
        },
        # USA Real Estate
        {
            "name": "Horizon Luxury Realty Group",
            "industry": "Real Estate",
            "country": "USA",
            "city": "Austin",
            "state_province": "TX",
            "website_url": "https://horizon-realty-austin-demo.com",
            "primary_email": "marcus.vance@horizon-realty-austin-demo.com",
            "primary_phone": "+1 512-555-0144",
            "contact_name": "Marcus Vance",
            "contact_role": "Managing Broker",
            "source": "curated_directory",
            "raw_metadata": {
                "cms": "Webflow",
                "has_booking": False,
                "has_live_chat": False,
                "property_listings_count": 42,
                "inquiry_method": "Contact Form"
            }
        },
        # UK Hotel / Hospitality
        {
            "name": "The Kensington Grand Boutique Hotel",
            "industry": "Hotel",
            "country": "UK",
            "city": "London",
            "state_province": "Greater London",
            "website_url": "https://kensington-grand-hotel-demo.co.uk",
            "primary_email": "gm@kensington-grand-hotel-demo.co.uk",
            "primary_phone": "+44 20 7946 0912",
            "contact_name": "Oliver Sterling",
            "contact_role": "General Manager",
            "source": "curated_directory",
            "raw_metadata": {
                "cms": "Custom React",
                "has_booking": True,
                "booking_provider": "SynXis",
                "has_live_chat": False,
                "international_visitors": True,
                "multilingual": False
            }
        },
        # Canada Private School / Academy
        {
            "name": "Maple Ridge Academy",
            "industry": "Private School",
            "country": "Canada",
            "city": "Toronto",
            "state_province": "ON",
            "website_url": "https://mapleridge-academy-demo.ca",
            "primary_email": "admissions@mapleridge-academy-demo.ca",
            "primary_phone": "+1 416-555-0188",
            "contact_name": "Eleanor Brooks",
            "contact_role": "Director of Admissions",
            "source": "curated_directory",
            "raw_metadata": {
                "cms": "Squarespace",
                "has_booking": False,
                "has_live_chat": False,
                "inquiry_method": "PDF Form Download",
                "programs_offered": ["Elementary", "Middle", "IB Diploma"]
            }
        },
        # UAE Law Firm
        {
            "name": "Al-Maktoum & Partners Legal Consultants",
            "industry": "Law Firm",
            "country": "UAE",
            "city": "Dubai",
            "state_province": "Dubai",
            "website_url": "https://almaktoum-partners-law-demo.ae",
            "primary_email": "tariq.almaktoum@almaktoum-partners-law-demo.ae",
            "primary_phone": "+971 4 555 0177",
            "contact_name": "Tariq Al-Maktoum",
            "contact_role": "Senior Partner",
            "source": "curated_directory",
            "raw_metadata": {
                "cms": "WordPress",
                "has_booking": False,
                "has_live_chat": False,
                "corporate_clients": True,
                "bilingual": True
            }
        },
        # Singapore Accounting & Tax Advisory
        {
            "name": "Apex Corporate Advisory & Tax",
            "industry": "Accounting",
            "country": "Singapore",
            "city": "Singapore",
            "state_province": "Central",
            "website_url": "https://apex-advisory-sg-demo.com",
            "primary_email": "chen.wei@apex-advisory-sg-demo.com",
            "primary_phone": "+65 6555 0123",
            "contact_name": "Chen Wei",
            "contact_role": "Managing Director",
            "source": "curated_directory",
            "raw_metadata": {
                "cms": "Wix",
                "has_booking": False,
                "has_live_chat": False,
                "inquiry_method": "Email / Web Form"
            }
        },
        # USA HVAC & Home Services
        {
            "name": "Summit Climate & HVAC Services",
            "industry": "HVAC",
            "country": "USA",
            "city": "Denver",
            "state_province": "CO",
            "website_url": "https://summit-climate-hvac-demo.com",
            "primary_email": "dispatch@summit-climate-hvac-demo.com",
            "primary_phone": "+1 303-555-0155",
            "contact_name": "Dave Miller",
            "contact_role": "Operations Manager",
            "source": "curated_directory",
            "raw_metadata": {
                "cms": "WordPress",
                "has_booking": False,
                "has_live_chat": False,
                "emergency_service_advertised": True
            }
        },
        # Australia Commercial Plumbing (Disabled for cold sending per policy, useful for testing compliance blocks)
        {
            "name": "Sydney Premier Plumbing & Drainage",
            "industry": "Plumbing",
            "country": "Australia",
            "city": "Sydney",
            "state_province": "NSW",
            "website_url": "https://sydney-premier-plumbing-demo.com.au",
            "primary_email": "info@sydney-premier-plumbing-demo.com.au",
            "primary_phone": "+61 2 9555 0133",
            "contact_name": "Jack Thompson",
            "contact_role": "Principal Contractor",
            "source": "curated_directory",
            "raw_metadata": {
                "cms": "WordPress",
                "has_booking": False,
                "has_live_chat": False
            }
        }
    ]

    async def discover_leads(self, industry: str, country: str, limit: int = 10, **kwargs) -> List[DiscoveredLead]:
        results = []
        ind_lower = industry.lower() if industry else ""
        cnt_lower = country.lower() if country else ""

        for item in self.CURATED_DATA:
            matches_ind = not ind_lower or (ind_lower in item["industry"].lower() or item["industry"].lower() in ind_lower)
            matches_cnt = not cnt_lower or (cnt_lower in item["country"].lower() or item["country"].lower() in cnt_lower)
            
            if matches_ind and matches_cnt:
                results.append(DiscoveredLead(**item))
                if len(results) >= limit:
                    break

        # If strict filter yielded empty, return relevant industry matches
        if not results and ind_lower:
            for item in self.CURATED_DATA:
                if ind_lower in item["industry"].lower() or item["industry"].lower() in ind_lower:
                    results.append(DiscoveredLead(**item))
                    if len(results) >= limit:
                        break

        return results
