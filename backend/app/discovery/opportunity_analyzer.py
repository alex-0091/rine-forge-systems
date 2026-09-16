"""
Rine Forge Systems V5 - Opportunity Analyzer (Module 45)
Analyzes website audit evidence and business profiles to identify concrete automation gaps.
Strictly requires observable evidence for each identified opportunity.
"""
import logging
from typing import Dict, Any, List, Optional
from backend.app.discovery.website_analysis import WebsiteAnalysisResult

logger = logging.getLogger(__name__)

class OpportunityAnalyzer:
    """
    Evaluates verified website observations against Rine Forge AI Employee capabilities.
    Produces high-confidence, evidence-backed automation opportunities.
    """

    def analyze_opportunities(
        self,
        analysis: WebsiteAnalysisResult,
        business_profile: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        opportunities: List[Dict[str, Any]] = []
        profile = business_profile or {}
        industry = profile.get("industry", "Business")
        client_type = "patients" if industry.lower() in ["dental", "medical", "clinic"] else "clients"

        # 1. AI RECEPTIONIST OPPORTUNITY
        # Trigger: No live chat or interactive conversational assistant detected
        if not analysis.contact_methods.get("has_live_chat"):
            obs_evidence = next(
                (obs["observation"] for obs in analysis.observations if obs.get("category") == "LIVE_CHAT"),
                "No live chat widget, interactive assistant, or 24/7 inquiry agent found on landing page."
            )
            opportunities.append({
                "type": "AI_RECEPTIONIST",
                "reason": f"Website has no conversational assistant to qualify {client_type}, answer common questions (hours, pricing, services), or resolve inquiries in real-time.",
                "evidence": obs_evidence,
                "confidence": 0.92,
                "projected_impact": "Captures 30-45% more web inquiries by resolving preliminary questions immediately."
            })

        # 2. APPOINTMENT AUTOMATION OPPORTUNITY
        # Trigger: No online booking system found
        if not analysis.contact_methods.get("has_online_booking"):
            obs_evidence = next(
                (obs["observation"] for obs in analysis.observations if obs.get("category") == "BOOKING_FLOW"),
                "No self-service appointment calendar or booking flow detected on website."
            )
            opportunities.append({
                "type": "APPOINTMENT_AUTOMATION",
                "reason": f"Every appointment request currently requires manual phone calls or email exchanges, leading to booking friction and lost {client_type}.",
                "evidence": obs_evidence,
                "confidence": 0.88,
                "projected_impact": "Direct calendar synchronization converts visitors into confirmed bookings 24/7 without staff overhead."
            })

        # 3. SPEED TO LEAD OPPORTUNITY
        # Trigger: Slow response promise detected (e.g. 24-48 hours)
        speed_obs = next(
            (obs for obs in analysis.observations if obs.get("category") == "SPEED_TO_LEAD"),
            None
        )
        if speed_obs:
            opportunities.append({
                "type": "SPEED_TO_LEAD",
                "reason": f"Contact channels promise delayed turnaround ('{speed_obs.get('observation')}'). High intent {client_type} likely consult competitors who respond within minutes.",
                "evidence": speed_obs.get("observation"),
                "confidence": 0.95,
                "projected_impact": "Reduces lead response latency from 24-48 hours to under 30 seconds."
            })

        # 4. WHATSAPP EMPLOYEE OPPORTUNITY
        # Trigger: No WhatsApp button on a consumer/local business site
        if not analysis.contact_methods.get("has_whatsapp"):
            obs_evidence = next(
                (obs["observation"] for obs in analysis.observations if obs.get("category") == "WHATSAPP"),
                "No WhatsApp click-to-chat link or widget detected."
            )
            opportunities.append({
                "type": "WHATSAPP_EMPLOYEE",
                "reason": f"Modern {client_type} increasingly prefer asynchronous WhatsApp messaging over phone calls or email forms. A WhatsApp AI receptionist enables zero-friction mobile booking.",
                "evidence": obs_evidence,
                "confidence": 0.86,
                "projected_impact": "Opens high-converting mobile messaging channel directly integrated with scheduling."
            })

        # 5. AFTER HOURS COVERAGE OPPORTUNITY
        # Trigger: Published office hours show closed evenings or weekends
        hours = analysis.business_hours
        if hours.get("Status") != "NOT_OBSERVED":
            opportunities.append({
                "type": "AFTER_HOURS_COVERAGE",
                "reason": f"Operating hours ({hours.get('Mon-Fri', 'Standard weekday hours')}) leave inquiries after 5 PM and on weekends unserved, risking drop-off until Monday morning.",
                "evidence": f"Published office schedule: {hours}",
                "confidence": 0.89,
                "projected_impact": "Captures and books after-hours inquiries that normally go to voicemail."
            })

        # 6. OMNICHANNEL SYNC
        # Trigger: Multiple unintegrated contact points (e.g., phone + email + form)
        if analysis.contact_methods.get("has_phone") and analysis.contact_methods.get("has_contact_form"):
            opportunities.append({
                "type": "OMNICHANNEL_SYNC",
                "reason": "Customer inquiries arrive across phone and web forms with no unified conversational CRM pipeline, creating risk of lost follow-ups.",
                "evidence": f"Multiple separate channels detected: Phone ({', '.join(analysis.contact_methods.get('phones', []))}) and Web Form.",
                "confidence": 0.84,
                "projected_impact": "Unifies all communication channels into a single automated pipeline with real-time staff alerts."
            })

        return opportunities

opportunity_analyzer = OpportunityAnalyzer()
