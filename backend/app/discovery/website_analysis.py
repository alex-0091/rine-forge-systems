"""
Rine Forge Systems V5 - Website Analysis Service (Module 44)
Factual, evidence-grounded inspection of business websites.
Extracts contact channels, tech stack, booking mechanisms, speed indicators,
and specific customer journey gaps with source URL citations.
Strictly prohibits inventing observations (Zero Hallucination Guard).
"""
import re
import time
import logging
from typing import Dict, Any, List, Optional
import httpx
from bs4 import BeautifulSoup
from urllib.parse import urlparse, urljoin

logger = logging.getLogger(__name__)

BOOKING_SYSTEMS = {
    "calendly.com": "Calendly",
    "acuityscheduling.com": "Acuity Scheduling",
    "setmore.com": "Setmore",
    "mindbodyonline.com": "Mindbody",
    "nexhealth.com": "NexHealth",
    "jane.app": "Jane App",
    "zocdoc.com": "Zocdoc",
    "simplepractice.com": "SimplePractice",
    "appointlet.com": "Appointlet",
    "squareup.com/appointments": "Square Appointments",
    "opentable.com": "OpenTable",
    "resy.com": "Resy",
    "book-now": "Direct Booking Flow",
    "schedule-appointment": "Direct Booking Flow",
    "patient-portal": "Patient Portal Booking",
}

LIVE_CHAT_TOOLS = {
    "intercom.io": "Intercom",
    "drift.com": "Drift",
    "crisp.chat": "Crisp",
    "tawk.to": "Tawk.to",
    "tidio.co": "Tidio",
    "zendesk.com": "Zendesk Chat",
    "livechatinc.com": "LiveChat",
    "hubspot.com": "HubSpot Conversations",
    "podium.com": "Podium WebChat",
    "birdeye.com": "Birdeye Chat",
}

CMS_DETECTORS = {
    "wp-content": "WordPress",
    "wp-includes": "WordPress",
    "webflow": "Webflow",
    "squarespace": "Squarespace",
    "shopify": "Shopify",
    "wix.com": "Wix",
    "_next/static": "Next.js",
    "__nuxt": "Nuxt.js",
    "hubspot": "HubSpot CMS",
    "drupal": "Drupal",
    "joomla": "Joomla",
}

class WebsiteAnalysisResult:
    def __init__(
        self,
        url: str,
        business_name: str,
        services: List[str],
        contact_methods: Dict[str, Any],
        business_hours: Dict[str, str],
        location_area: Optional[str],
        tech_stack: Dict[str, Any],
        speed_responsiveness: Dict[str, Any],
        journey_gaps: List[str],
        observations: List[Dict[str, Any]],
        raw_text_sample: str = "",
        is_reachable: bool = True
    ):
        self.url = url
        self.business_name = business_name
        self.services = services
        self.contact_methods = contact_methods
        self.business_hours = business_hours
        self.location_area = location_area
        self.tech_stack = tech_stack
        self.speed_responsiveness = speed_responsiveness
        self.journey_gaps = journey_gaps
        self.observations = observations
        self.raw_text_sample = raw_text_sample
        self.is_reachable = is_reachable

    def to_dict(self) -> Dict[str, Any]:
        return {
            "url": self.url,
            "business_name": self.business_name,
            "services": self.services,
            "contact_methods": self.contact_methods,
            "business_hours": self.business_hours,
            "location_area": self.location_area,
            "tech_stack": self.tech_stack,
            "speed_responsiveness": self.speed_responsiveness,
            "journey_gaps": self.journey_gaps,
            "observations": self.observations,
            "raw_text_sample": self.raw_text_sample,
            "is_reachable": self.is_reachable
        }

class WebsiteAnalysisService:
    """
    Analyzes public websites for operational intelligence and automation opportunities.
    Every observation includes source URL and confidence score.
    """

    async def analyze(
        self,
        url: str,
        fallback_name: str = "",
        target_industry: str = "General"
    ) -> WebsiteAnalysisResult:
        if not url:
            return self._build_unreachable_result(url, fallback_name, "No website URL provided.")

        normalized_url = url.strip()
        if not normalized_url.startswith(("http://", "https://")):
            normalized_url = "https://" + normalized_url

        has_ssl = normalized_url.startswith("https://")
        start_time = time.time()
        
        try:
            async with httpx.AsyncClient(
                timeout=10.0,
                follow_redirects=True,
                headers={
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
                }
            ) as client:
                resp = await client.get(normalized_url)
                load_time_ms = int((time.time() - start_time) * 1000)
                final_url = str(resp.url)
                
                if resp.status_code >= 400:
                    return self._build_unreachable_result(
                        final_url, fallback_name, f"HTTP Error {resp.status_code}"
                    )
                
                return self._parse_html(
                    html=resp.text,
                    url=final_url,
                    load_time_ms=load_time_ms,
                    has_ssl=final_url.startswith("https://"),
                    fallback_name=fallback_name,
                    industry=target_industry
                )

        except Exception as exc:
            logger.warning(f"Could not reach {normalized_url}: {exc}")
            return self._build_unreachable_result(
                normalized_url, fallback_name, f"Connection failed: {str(exc)[:100]}"
            )

    def _parse_html(
        self,
        html: str,
        url: str,
        load_time_ms: int,
        has_ssl: bool,
        fallback_name: str,
        industry: str
    ) -> WebsiteAnalysisResult:
        soup = BeautifulSoup(html, "html.parser")
        html_lower = html.lower()
        observations: List[Dict[str, Any]] = []
        journey_gaps: List[str] = []

        # 1. Business Name
        title_el = soup.title.string.strip() if soup.title and soup.title.string else ""
        og_name = soup.find("meta", property="og:site_name")
        business_name = ""
        if og_name and og_name.get("content"):
            business_name = og_name["content"].strip()
        elif title_el:
            business_name = re.split(r"[-|•–—]", title_el)[0].strip()
        if not business_name:
            business_name = fallback_name or urlparse(url).netloc

        if title_el:
            observations.append({
                "observation": f"Website title tag: '{title_el}'",
                "source": url,
                "confidence": 0.98,
                "category": "TITLE"
            })

        # 2. Contact Methods
        emails = list(set(re.findall(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', html)))
        clean_emails = [e for e in emails if not e.endswith(('.png', '.jpg', '.svg', '.webp')) and "wixpress" not in e][:3]
        
        phone_matches = [m.group(0).strip() for m in re.finditer(r'(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', html)]
        clean_phones = list(dict.fromkeys([p for p in phone_matches if len(re.sub(r'\D', '', p)) >= 10]))[:3]


        forms = soup.find_all("form")
        has_form = len(forms) > 0

        # Booking Detection
        has_booking = False
        booking_system = None
        for sig, name in BOOKING_SYSTEMS.items():
            if sig in html_lower or soup.find("a", href=re.compile(re.escape(sig), re.I)):
                has_booking = True
                booking_system = name
                observations.append({
                    "observation": f"Direct booking flow identified: {name}",
                    "source": url,
                    "confidence": 0.94,
                    "category": "BOOKING_FLOW"
                })
                break

        # WhatsApp Button Detection
        whatsapp_links = soup.find_all("a", href=re.compile(r'(wa\.me|api\.whatsapp\.com|whatsapp:)', re.I))
        has_whatsapp = len(whatsapp_links) > 0
        if has_whatsapp:
            observations.append({
                "observation": f"WhatsApp direct contact button present ({whatsapp_links[0].get('href')})",
                "source": url,
                "confidence": 0.99,
                "category": "WHATSAPP"
            })
        else:
            journey_gaps.append("No WhatsApp direct communication channel for instant customer messaging.")
            observations.append({
                "observation": "No WhatsApp contact button or wa.me link found on website",
                "source": url,
                "confidence": 0.90,
                "category": "WHATSAPP"
            })

        # Live Chat Detection
        has_live_chat = False
        detected_chat = None
        for sig, name in LIVE_CHAT_TOOLS.items():
            if sig in html_lower or soup.find("script", src=re.compile(re.escape(sig), re.I)):
                has_live_chat = True
                detected_chat = name
                observations.append({
                    "observation": f"Live chat widget detected: {name}",
                    "source": url,
                    "confidence": 0.92,
                    "category": "LIVE_CHAT"
                })
                break

        if not has_live_chat:
            journey_gaps.append("No 24/7 interactive conversational assistant or live chat for immediate inquiry resolution.")
            observations.append({
                "observation": "No live chat widget or AI assistant script detected on homepage or contact links",
                "source": url,
                "confidence": 0.92,
                "category": "LIVE_CHAT"
            })

        # After hours / Delayed Response Promise Detection
        slow_response_matches = re.findall(
            r'(24[-–\s]?48\s*(?:hours|hrs|business hours)|1[-–\s]?2\s*(?:business days|days)|get back to you shortly|within 24 hours)',
            html,
            re.I
        )
        if slow_response_matches:
            promise_text = slow_response_matches[0]
            journey_gaps.append(f"Inquiry turnaround promises delayed response ({promise_text}). High risk of lead drop-off.")
            observations.append({
                "observation": f"Contact form/footer states delayed turnaround: '{promise_text}'",
                "source": url,
                "confidence": 0.95,
                "category": "SPEED_TO_LEAD"
            })

        if not has_booking:
            journey_gaps.append("No self-service online appointment scheduling. Requires manual callback or email exchange.")
            observations.append({
                "observation": "No automated calendar booking widget (Calendly, Acuity, NexHealth) detected",
                "source": url,
                "confidence": 0.91,
                "category": "BOOKING_FLOW"
            })

        # 3. CMS / Tech Stack
        detected_cms = "Custom / HTML"
        for sig, name in CMS_DETECTORS.items():
            if sig in html_lower:
                detected_cms = name
                break

        tech_stack = {
            "cms": detected_cms,
            "has_ssl": has_ssl,
            "booking_tool": booking_system,
            "chat_tool": detected_chat,
            "has_gtm": "googletagmanager.com" in html_lower or "google-analytics.com" in html_lower
        }

        # 4. Speed & Mobile Responsiveness
        viewport_tag = soup.find("meta", attrs={"name": "viewport"})
        is_mobile_friendly = viewport_tag is not None
        is_slow = load_time_ms > 2500

        speed_responsiveness = {
            "load_time_ms": load_time_ms,
            "is_slow": is_slow,
            "is_mobile_friendly": is_mobile_friendly,
            "has_ssl": has_ssl
        }

        if is_slow:
            journey_gaps.append(f"Slow landing page response ({load_time_ms}ms), potentially causing visitor abandonment.")

        if not is_mobile_friendly:
            journey_gaps.append("Viewport meta tag missing; website may render poorly on mobile devices.")

        # 5. Services Extraction
        services = self._extract_services(soup, html_lower, industry)

        # 6. Business Hours
        business_hours = self._extract_hours(html)

        # 7. Location Area
        location_area = self._extract_location(soup, html)

        contact_methods = {
            "has_phone": len(clean_phones) > 0,
            "phones": clean_phones,
            "has_email": len(clean_emails) > 0,
            "emails": clean_emails,
            "has_contact_form": has_form,
            "has_online_booking": has_booking,
            "booking_system": booking_system,
            "has_live_chat": has_live_chat,
            "chat_tool": detected_chat,
            "has_whatsapp": has_whatsapp,
            "has_after_hours_contact": False
        }

        return WebsiteAnalysisResult(
            url=url,
            business_name=business_name,
            services=services,
            contact_methods=contact_methods,
            business_hours=business_hours,
            location_area=location_area,
            tech_stack=tech_stack,
            speed_responsiveness=speed_responsiveness,
            journey_gaps=journey_gaps,
            observations=observations,
            raw_text_sample=soup.get_text(separator=' ', strip=True)[:1000],
            is_reachable=True
        )

    def _extract_services(self, soup: BeautifulSoup, html_lower: str, industry: str) -> List[str]:
        """Extracts bulleted or linked services mentioned in navigation or headings."""
        services = set()
        
        nav = soup.find(["nav", "header", "ul"])
        if nav:
            for a in nav.find_all("a"):
                text = a.get_text().strip()
                if 3 <= len(text) <= 40 and not any(k in text.lower() for k in ["home", "about", "contact", "blog", "privacy", "terms", "login", "sign in"]):
                    services.add(text)

        industry_terms = {
            "Dental": ["Cleaning", "Teeth Whitening", "Invisalign", "Veneers", "Dental Implants", "Root Canal", "Cosmetic Dentistry", "Crowns", "Emergency Dentistry"],
            "Legal": ["Personal Injury", "Family Law", "Corporate", "Litigation", "Estate Planning", "Criminal Defense"],
            "Medical": ["Consultation", "Physical Therapy", "Pediatrics", "Dermatology", "Aesthetics"],
            "Home Services": ["HVAC Repair", "Plumbing", "Roofing", "Electrical", "Emergency Callout", "Installation"]
        }

        checklist = industry_terms.get(industry, industry_terms["Dental"])
        for term in checklist:
            if term.lower() in html_lower:
                services.add(term)

        return sorted(list(services))[:8]

    def _extract_hours(self, html: str) -> Dict[str, str]:
        """Looks for days and hours patterns."""
        hours: Dict[str, str] = {}
        patterns = [
            (r'Monday\s*[-–]\s*Friday\s*[:]\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm)\s*[-–]\s*\d{1,2}(?::\d{2})?\s*(?:am|pm))', "Mon-Fri"),
            (r'Mon\s*[-–]\s*Fri\s*[:]\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm)\s*[-–]\s*\d{1,2}(?::\d{2})?\s*(?:am|pm))', "Mon-Fri"),
            (r'Saturday\s*[:]\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm)\s*[-–]\s*\d{1,2}(?::\d{2})?\s*(?:am|pm)|Closed)', "Sat"),
            (r'Sunday\s*[:]\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm)\s*[-–]\s*\d{1,2}(?::\d{2})?\s*(?:am|pm)|Closed)', "Sun"),
        ]
        for pat, key in patterns:
            match = re.search(pat, html, re.I)
            if match:
                hours[key] = match.group(1).strip()

        if not hours:
            hours = {"Status": "NOT_OBSERVED"}
        return hours

    def _extract_location(self, soup: BeautifulSoup, html: str) -> Optional[str]:
        """Identifies city, state, or address string if published."""
        address_tag = soup.find("address")
        if address_tag:
            return address_tag.get_text().strip()
        
        match = re.search(r'([A-Z][a-zA-Z\s]+,\s*[A-Z]{2}\s+\d{5})', html)
        if match:
            return match.group(1).strip()
        return None

    def _build_unreachable_result(self, url: str, fallback_name: str, error_reason: str) -> WebsiteAnalysisResult:
        """Non-hallucinated fallback when a website cannot be reached."""
        return WebsiteAnalysisResult(
            url=url,
            business_name=fallback_name or "Unknown Business",
            services=[],
            contact_methods={
                "has_phone": False,
                "phones": [],
                "has_email": False,
                "emails": [],
                "has_contact_form": False,
                "has_online_booking": False,
                "booking_system": None,
                "has_live_chat": False,
                "chat_tool": None,
                "has_whatsapp": False,
                "has_after_hours_contact": False
            },
            business_hours={"Status": "NOT_OBSERVED"},
            location_area=None,
            tech_stack={"cms": "NOT_OBSERVED", "has_ssl": False, "booking_tool": None, "chat_tool": None, "has_gtm": False},
            speed_responsiveness={"load_time_ms": 0, "is_slow": False, "is_mobile_friendly": False, "has_ssl": False},
            journey_gaps=[f"Website inspection incomplete: {error_reason}"],
            observations=[{
                "observation": f"Website analysis could not reach host ({error_reason})",
                "source": url or "N/A",
                "confidence": 1.0,
                "category": "SYSTEM_STATUS"
            }],
            raw_text_sample="",
            is_reachable=False
        )

website_analysis_service = WebsiteAnalysisService()
