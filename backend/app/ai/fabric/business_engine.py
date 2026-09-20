"""
Rine Forge Systems V5 - Forge Intelligence Fabric: BusinessToAICompanyEngine
Transforms a brief natural language business description into a complete,
structured AI Company Profile with recommended AI employees, workflows, tools, and guardrails.
"""
from typing import Dict, Any, List
from datetime import datetime, timezone


class BusinessToAICompanyEngine:
    """Deconstructs high-level business descriptions into structured operational AI systems."""

    @classmethod
    def generate_company_profile(cls, business_description: str) -> Dict[str, Any]:
        text_lower = (business_description or "").lower()

        # 1. Identify Industry & Domain
        if "dental" in text_lower or "clinic" in text_lower or "teeth" in text_lower:
            industry = "Healthcare & Dental Aesthetics"
            default_services = ["Dental Implants", "Emergency Tooth Pain", "Cosmetic Dentistry", "Routine Hygiene"]
            audience = "Local residents seeking premium dental and implant care in Austin"
            brand = {"tone": "Warm, Reassuring & Clinically Authoritative", "primary_color": "#0284C7", "accent_color": "#F0F9FF"}
            faqs = [
                {"q": "Are dental implants painful?", "a": "Our advanced anesthesia and gentle technique ensure a virtually painless procedure."},
                {"q": "Do you accept PPO dental insurance?", "a": "Yes, we accept and file on behalf of all major PPO insurance providers."}
            ]
            recommended_employees = ["AI Receptionist", "AI Appointment Agent", "AI Voice Receptionist"]
        elif "law" in text_lower or "legal" in text_lower or "attorney" in text_lower:
            industry = "Legal Practice"
            default_services = ["Commercial Litigation", "Corporate Advisory", "Contract Review", "Regulatory Compliance"]
            audience = "Businesses, founders, and executives seeking expert counsel"
            brand = {"tone": "Formal, Strategic & Discrete", "primary_color": "#1E293B", "accent_color": "#F8FAFC"}
            faqs = [
                {"q": "How do you structure legal retainers?", "a": "We provide transparent, flat-fee assessment retainers tailored to project scope."}
            ]
            recommended_employees = ["AI Support Agent", "AI Operations Assistant"]
        elif "roofing" in text_lower or "contractor" in text_lower or "construction" in text_lower:
            industry = "Residential & Commercial Contracting"
            default_services = ["Roof Replacement", "Hail Damage Repair", "Drone Inspection", "Emergency Tarping"]
            audience = "Property owners needing rapid, high-integrity roofing repairs"
            brand = {"tone": "Reliable, Practical & Responsive", "primary_color": "#B45309", "accent_color": "#FFFBEB"}
            faqs = [
                {"q": "Do you assist with insurance claims?", "a": "Yes, our licensed adjusters help document storm damage directly for your insurer."}
            ]
            recommended_employees = ["AI Sales Agent", "AI Lead Qualifier", "AI Voice Receptionist"]
        else:
            industry = "Professional Services"
            default_services = ["Advisory Consultations", "Operational Support", "Digital Solutions"]
            audience = "Local and commercial clients seeking reliable business solutions"
            brand = {"tone": "Professional & Modern", "primary_color": "#2563EB", "accent_color": "#EFF6FF"}
            faqs = [{"q": "What are your standard business hours?", "a": "We are open Monday through Friday from 8:00 AM to 6:00 PM."}]
            recommended_employees = ["AI Receptionist", "AI Website Assistant"]

        return {
            "source_description": business_description,
            "industry": industry,
            "services": default_services,
            "target_audience": audience,
            "brand": brand,
            "faqs": faqs,
            "customer_intents": ["BOOKING_REQUEST", "HOURS_INQUIRY", "PRICING_INQUIRY", "EMERGENCY_TRIAGE", "HUMAN_HANDOFF"],
            "lead_signals": ["Immediate Need", "Local Search Intent", "Insurance Inquiry"],
            "knowledge_requirements": ["Service Price Range Disclosures", "Operating Hours", "Cancellation Policy"],
            "recommended_ai_employees": recommended_employees,
            "recommended_workflows": ["Missed Call -> SMS Auto-Reply", "New Lead -> Qualification Scoring", "Booking Request -> Availability Hold"],
            "recommended_tools": ["searchKnowledge", "createAppointment", "runSandboxBuild"],
            "recommended_automations": ["Instant SMS Booking Confirmation", "Staff Dispatch Escalation"],
            "deployment_status": "DRAFT_READY_FOR_APPROVAL",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
