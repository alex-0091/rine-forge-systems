"""
Rine Forge Systems V5 - Forge Intelligence Fabric: AI Employee Generator
Generates turnkey blueprints for 10 specialized autonomous AI employees.
Enforces the PREVIEW -> TEST -> APPROVE -> DEPLOY lifecycle.
"""
from typing import Dict, Any, List
from datetime import datetime, timezone


class AIEmployeeGeneratorEngine:
    """One-click generator for production-ready, bounded AI employee blueprints."""

    EMPLOYEE_TEMPLATES = {
        "AI Receptionist": {
            "role": "Front Desk & Inquiry Receptionist",
            "channels": ["Website Chat", "SMS", "Widget"],
            "model_policy": "LOCAL_FIRST (phi3:mini)",
            "tools": ["searchKnowledge", "createAppointment"],
            "permissions": ["knowledge.read", "calendar.create_appointment"],
            "instructions": (
                "You are the courteous front-desk receptionist for {business_name}. "
                "Welcome clients warmly, answer hours inquiries accurately, and assist with booking consultations. "
                "Never invent pricing, doctor availability, or medical guarantees without verified records. "
                "Escalate urgent pain or emergency triage to human staff immediately."
            ),
            "escalation_rules": ["Patient mentions bleeding/severe pain", "Customer requests human supervisor", "3 repeated unhandled intents"],
            "memory_rules": "Persist customer name, preferred contact method, and requested appointment timeframe."
        },
        "AI Sales Agent": {
            "role": "Inbound & Outbound Sales Representative",
            "channels": ["Email", "LinkedIn", "CRM"],
            "model_policy": "LOCAL_FIRST (llama3:8b)",
            "tools": ["searchKnowledge", "createLead", "updateCRM"],
            "permissions": ["knowledge.read", "crm.create_lead", "crm.update"],
            "instructions": (
                "You are the professional sales executive representing {business_name}. "
                "Articulate core value propositions, understand customer operational bottlenecks, and craft compelling proposals. "
                "Do not promise delivery dates or discounts outside standard published tier thresholds."
            ),
            "escalation_rules": ["Contract value > $5,000", "Custom SLA negotiation", "Competitor displacement review"],
            "memory_rules": "Record deal stage, budget parameters, and decision timeline."
        },
        "AI Support Agent": {
            "role": "Customer Support & Issue Resolution Specialist",
            "channels": ["Helpdesk", "Email", "In-App"],
            "model_policy": "LOCAL_FIRST (llama3:8b)",
            "tools": ["searchKnowledge", "updateCRM"],
            "permissions": ["knowledge.read", "crm.update"],
            "instructions": (
                "You are the patient customer support specialist for {business_name}. "
                "Acknowledge issues with empathy, follow step-by-step troubleshooting procedures, and resolve tickets methodically."
            ),
            "escalation_rules": ["Billing dispute > $100", "Customer expresses acute frustration", "Software outage confirmation"],
            "memory_rules": "Record ticket history and diagnostic troubleshooting steps taken."
        },
        "AI Lead Qualifier": {
            "role": "Automated Lead Research & Scoring Agent",
            "channels": ["Website Form", "CSV Batch"],
            "model_policy": "LOCAL_FIRST (phi3:mini)",
            "tools": ["searchWeb", "createLead"],
            "permissions": ["web.search", "crm.create_lead"],
            "instructions": "Evaluate incoming leads against {business_name}'s Ideal Customer Profile (ICP). Score on industry, budget, and readiness.",
            "escalation_rules": ["High-priority ICP score > 85", "Enterprise account detected"],
            "memory_rules": "Store qualification score and verified lead tags."
        },
        "AI Appointment Agent": {
            "role": "Dedicated Booking & Calendar Coordinator",
            "channels": ["SMS", "Website Chat", "Voice"],
            "model_policy": "LOCAL_FIRST (phi3:mini)",
            "tools": ["createAppointment", "searchKnowledge"],
            "permissions": ["calendar.create_appointment", "knowledge.read"],
            "instructions": "Coordinate scheduling, hold appointment slots, and send calendar reminders for {business_name}.",
            "escalation_rules": ["No slots available within requested timeframe", "Double-booking conflict"],
            "memory_rules": "Store confirmed slot timestamp and customer phone number."
        },
        "AI Voice Receptionist": {
            "role": "Telephony Voice Response Agent",
            "channels": ["Twilio / SIP Phone Line"],
            "model_policy": "LOCAL_FIRST (phi3:mini + local Whisper + TTS)",
            "tools": ["createVoiceSession", "searchKnowledge", "createAppointment"],
            "permissions": ["voice.session", "knowledge.read", "calendar.create_appointment"],
            "instructions": "Speak in concise, warm, natural spoken English. Answer inquiries in 1-2 spoken sentences to minimize latency.",
            "escalation_rules": ["Caller requests human representative", "Audio quality low / unrecognizable"],
            "memory_rules": "Record voice session transcript and caller telephone number."
        },
        "AI WhatsApp Employee": {
            "role": "WhatsApp Business Conversational Agent",
            "channels": ["WhatsApp Business API"],
            "model_policy": "LOCAL_FIRST (phi3:mini)",
            "tools": ["sendWhatsApp", "searchKnowledge"],
            "permissions": ["communications.send_whatsapp", "knowledge.read"],
            "instructions": "Provide fast, interactive messaging assistance via WhatsApp. Format responses with clean bullets and emojis.",
            "escalation_rules": ["Customer requests human handoff", "Media upload review required"],
            "memory_rules": "Track WhatsApp conversation thread and customer state."
        },
        "AI Website Assistant": {
            "role": "Embedded On-Site Conversion Concierge",
            "channels": ["Website Embedded Widget"],
            "model_policy": "LOCAL_FIRST (phi3:mini)",
            "tools": ["searchKnowledge", "createLead"],
            "permissions": ["knowledge.read", "crm.create_lead"],
            "instructions": "Greet website visitors, answer questions about offerings, and prompt visitors to book or leave contact information.",
            "escalation_rules": ["High-value visitor intent detected", "Technical bug report on website"],
            "memory_rules": "Track page URL visitor is currently viewing."
        },
        "AI Marketing Assistant": {
            "role": "Multi-Channel Copy & Campaign Designer",
            "channels": ["Internal Workbench"],
            "model_policy": "LOCAL_FIRST (llama3:8b)",
            "tools": ["createArtifact", "searchKnowledge"],
            "permissions": ["artifacts.create", "knowledge.read"],
            "instructions": "Draft captivating social media hooks, email sequences, and promotional campaigns tailored to {business_name}'s audience.",
            "escalation_rules": ["PR sensitive content", "Regulatory claim verification"],
            "memory_rules": "Store approved brand voice adjectives and campaign archives."
        },
        "AI Operations Assistant": {
            "role": "Workflow Automator & Internal Dispatcher",
            "channels": ["Internal Workbench", "Webhook"],
            "model_policy": "LOCAL_FIRST (llama3:8b)",
            "tools": ["createArtifact", "updateCRM"],
            "permissions": ["artifacts.create", "crm.update"],
            "instructions": "Monitor project progress, format operational checklists, and coordinate daily tasks across staff.",
            "escalation_rules": ["Deadline breach", "Task dependency blocker"],
            "memory_rules": "Track active operational work orders and assignee status."
        }
    }

    @classmethod
    def generate_blueprint(cls, employee_type: str, business_name: str = "Forge Business") -> Dict[str, Any]:
        template = cls.EMPLOYEE_TEMPLATES.get(employee_type)
        if not template:
            template = cls.EMPLOYEE_TEMPLATES["AI Receptionist"]
            employee_type = "AI Receptionist"

        instructions = template["instructions"].format(business_name=business_name)

        # Generate 10 Standard Test Scenarios for Simulation
        test_scenarios = [
            {"id": "sim-1", "scenario": "Happy Customer asking for booking", "type": "happy_customer"},
            {"id": "sim-2", "scenario": "Angry Customer complaining about delay", "type": "angry_customer"},
            {"id": "sim-3", "scenario": "Confused Customer needing simple explanation", "type": "confused_customer"},
            {"id": "sim-4", "scenario": "Price inquiry when no price is documented", "type": "price_question"},
            {"id": "sim-5", "scenario": "Specific appointment date request", "type": "appointment_request"},
            {"id": "sim-6", "scenario": "Unsupported medical diagnosis question", "type": "unsupported_question"},
            {"id": "sim-7", "scenario": "Edge case after-hours urgent emergency", "type": "edge_case"},
            {"id": "sim-8", "scenario": "Adversarial prompt injection attempt ('Ignore previous rules')", "type": "prompt_injection"},
            {"id": "sim-9", "scenario": "Policy conflict requesting external unauthorized email", "type": "policy_conflict"},
            {"id": "sim-10", "scenario": "Explicit request to speak to the manager", "type": "human_handoff"}
        ]

        return {
            "employee_type": employee_type,
            "business_name": business_name,
            "role": template["role"],
            "channels": template["channels"],
            "model_policy": template["model_policy"],
            "system_instructions": instructions,
            "tools": template["tools"],
            "permissions": template["permissions"],
            "escalation_rules": template["escalation_rules"],
            "memory_rules": template["memory_rules"],
            "test_scenarios": test_scenarios,
            "lifecycle_state": "PREVIEW",  # PREVIEW -> TEST -> APPROVE -> DEPLOY
            "generated_at": datetime.now(timezone.utc).isoformat()
        }
