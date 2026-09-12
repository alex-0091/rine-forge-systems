import logging
from typing import Dict, Any, List, Optional
from backend.app.models.business import Business
from backend.app.models.intelligence import PainPoint, AIOpportunity

logger = logging.getLogger(__name__)

class OfferMatcher:
    """
    Intelligent Offer Matching Engine:
    Maps verified business observations and pain points to high-value solutions from the Owais AI Catalog.
    """

    OFFER_CATALOG = {
        "AI_RECEPTIONIST": {
            "name": "24/7 AI Business Receptionist & Booking Concierge",
            "category": "AI Receptionists",
            "base_value_prop": "Captures after-hours inquiries and routes qualified appointments directly into your calendar 24/7 without extra staff overhead."
        },
        "LEAD_QUALIFIER": {
            "name": "AI Lead Qualification & Intake Assistant",
            "category": "AI Lead Qualification",
            "base_value_prop": "Pre-screens prospective clients by budget, urgency, and project scope before booking consultations."
        },
        "WORKFLOW_AUTOMATION": {
            "name": "Business Workflow & Calendar Integration",
            "category": "Business Automation",
            "base_value_prop": "Automates the synchronization between web inquiry forms, CRM pipelines, and instant customer notifications."
        },
        "CUSTOM_AI_SYSTEM": {
            "name": "Custom Algorithmic Web System & Client Portal",
            "category": "Custom Digital Tools",
            "base_value_prop": "Bespoke high-performance web applications and internal tools designed for specialized business workflows."
        }
    }

    @classmethod
    def match_best_offer(
        cls,
        business: Business,
        evidence_list: Optional[List[Any]] = None
    ) -> Dict[str, Any]:
        ind_lower = (business.industry or "").lower()
        
        if any(t in ind_lower for t in ["dental", "healthcare", "medical", "clinic"]):
            primary = {
                "key": "AI_RECEPTIONIST_BOOKING",
                "name": "AI Receptionist & 24/7 Appointment Booking Voice/Web Agent",
                "proposed_angle": "Capture after-hours appointments and answer treatment FAQs 24/7",
                "match_confidence": 95
            }
            secondary = {
                "key": "PATIENT_REACTIVATION",
                "name": "Automated Patient Recall & Dormant Reactivation"
            }
        elif any(t in ind_lower for t in ["hotel", "hospitality", "resort"]):
            primary = {
                "key": "HOTEL_CONCIERGE_AI",
                "name": "24/7 Multilingual AI Hotel Concierge & Direct Booking Agent",
                "proposed_angle": "Answer guest inquiries across timezones and increase direct bookings",
                "match_confidence": 94
            }
            secondary = {
                "key": "WORKFLOW_AUTOMATION",
                "name": "Guest CRM & Automated Check-in Workflow"
            }
        elif any(t in ind_lower for t in ["real estate", "property", "realty"]):
            primary = {
                "key": "INSTANT_LEAD_RESPONDER",
                "name": "Instant Lead Responder & Speed-to-Lead Qualifier",
                "proposed_angle": "Qualify portal buyers within 60 seconds and schedule viewings automatically",
                "match_confidence": 93
            }
            secondary = {
                "key": "LISTING_AGENT_AI",
                "name": "Automated Listing FAQ & Video Walkthrough Assistant"
            }
        elif any(t in ind_lower for t in ["school", "academy", "education"]):
            primary = {
                "key": "ADMISSIONS_AI_ASSISTANT",
                "name": "24/7 Admissions & Campus Tour Booking Assistant",
                "proposed_angle": "Answer parent questions and schedule campus tours around the clock",
                "match_confidence": 91
            }
            secondary = {
                "key": "PARENT_FAQ_BOT",
                "name": "Parent Portal FAQ & Tuition Assistant"
            }
        else:
            primary = {
                "key": "AI_LEAD_QUALIFIER",
                "name": "AI Lead Intake & Instant Appointment Scheduler",
                "proposed_angle": "Pre-qualify inbound project requests and book consultations 24/7",
                "match_confidence": 88
            }
            secondary = {
                "key": "WORKFLOW_AUTOMATION",
                "name": "CRM & Calendar Sync Automation"
            }

        return {
            "primary_offer": primary,
            "secondary_offer": secondary,
            "confidence": primary["match_confidence"] / 100.0,
            "value_proposition": primary["proposed_angle"]
        }

    @classmethod
    def match_offer(
        cls,
        business: Business,
        pain_points: List[Any],
        opportunities: Optional[List[Any]] = None
    ) -> Dict[str, Any]:
        best = cls.match_best_offer(business)
        return {
            "primary_offer": best["primary_offer"]["name"],
            "primary_category": best["primary_offer"]["key"],
            "secondary_offer": best["secondary_offer"]["name"],
            "confidence": best["confidence"],
            "reason": best["primary_offer"]["proposed_angle"],
            "value_proposition": best["value_proposition"]
        }

offer_matcher = OfferMatcher()

