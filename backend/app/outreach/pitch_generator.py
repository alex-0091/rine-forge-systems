"""
Rine Forge Systems V5 - Multi-Channel Personalized Pitch Generator
Generates channel-adapted, evidence-grounded outreach drafts (Email, WhatsApp, SMS).
Strictly adheres to compliant B2B principles:
- Zero fabricated facts or simulated research
- Zero deceptive urgency or false scarcity
- Zero guaranteed ROI or false performance claims
- Explicit opt-out footers and channel-specific formatting
"""
import logging
from typing import Dict, Any, Optional, List

logger = logging.getLogger("rine_forge_systems.outreach.pitch_generator")

class PitchGenerator:
    """
    Channel-aware personalized pitch generation engine.
    Adapts tone, structure, and length to the communication channel.
    """

    @classmethod
    def _extract_primary_evidence(cls, prospect_data: Dict[str, Any]) -> str:
        """Extracts the strongest observable fact or opportunity from the prospect data."""
        opportunities = prospect_data.get("opportunities") or []
        observations = prospect_data.get("observations") or []
        
        if opportunities:
            opp = opportunities[0]
            if isinstance(opp, dict):
                return opp.get("reason") or opp.get("evidence") or ""
            elif hasattr(opp, "reason"):
                return opp.reason
        
        if observations:
            obs = observations[0]
            if isinstance(obs, dict):
                return obs.get("observation") or ""
            elif hasattr(obs, "observation"):
                return obs.observation

        return "your published business operations"

    @classmethod
    def generate_email_pitch(
        cls,
        prospect: Dict[str, Any],
        service_name: str = "Elena AI Receptionist",
        sender_name: str = "Rine Forge Systems Team",
        opt_out_email: str = "optout@rineforge.com"
    ) -> Dict[str, str]:
        """
        Generates a concise, evidence-grounded B2B email draft.
        Includes subject, body, clear call-to-action, and mandatory opt-out instructions.
        """
        company = prospect.get("company_name", "your team")
        contact = prospect.get("contact_name") or "Practice Manager / Operations Team"
        evidence = cls._extract_primary_evidence(prospect)
        
        # Build subject line
        subject = f"Question regarding after-hours patient inquiries at {company}"

        # Build body with transparent evidence citation
        body_lines = [
            f"Hi {contact},",
            "",
            f"I was reviewing {company}'s public scheduling channels and noticed {evidence}.",
            "",
            f"We built {service_name} specifically to help practices capture after-hours booking inquiries, answer common patient questions 24/7, and route urgent escalations to your team without adding front-desk overhead.",
            "",
            "Would you be open to a brief 10-minute walkthrough later this week to see if this fits your current workflow?",
            "",
            "Best regards,",
            sender_name,
            "Rine Forge Systems",
            "",
            "---",
            f"Note: This inquiry was sent to {company}'s published contact channel. If you do not wish to receive further communications, please reply 'STOP' or email {opt_out_email} to be permanently removed."
        ]
        body_text = "\n".join(body_lines)
        body_html = f"<p>{body_text.replace(chr(10), '<br>')}</p>"

        return {
            "channel": "EMAIL",
            "subject": subject,
            "body_text": body_text,
            "body_html": body_html,
            "cta": "10-minute walkthrough inquiry",
            "evidence_used": evidence
        }

    @classmethod
    def generate_whatsapp_pitch(
        cls,
        prospect: Dict[str, Any],
        service_name: str = "Elena AI Front Desk"
    ) -> Dict[str, str]:
        """
        Generates a short, conversational WhatsApp message suitable for B2B mobile communication.
        """
        company = prospect.get("company_name", "your clinic")
        contact = prospect.get("contact_name") or "there"
        evidence = cls._extract_primary_evidence(prospect)

        message = (
            f"Hi {contact}, this is Rine Forge Systems. We noticed {evidence} at {company}. "
            f"We provide {service_name} to handle after-hours patient questions and booking triage on WhatsApp. "
            "Would you like to see a 2-minute live demo of how it works for your practice? (Reply STOP to opt out)"
        )

        return {
            "channel": "WHATSAPP",
            "subject": None,
            "body_text": message,
            "body_html": f"<p>{message}</p>",
            "cta": "2-minute live demo",
            "evidence_used": evidence
        }

    @classmethod
    def generate_sms_pitch(
        cls,
        prospect: Dict[str, Any],
        service_name: str = "Rine Forge AI"
    ) -> Dict[str, str]:
        """
        Generates an ultra-short SMS message under 160 characters with clear opt-out.
        """
        company = prospect.get("company_name", "your business")
        msg = f"Hi from {service_name}. Can {company} handle after-hours patient booking? We automate 24/7 triage. Reply YES for info or STOP to opt out."
        # Ensure under 160 chars
        if len(msg) > 160:
            msg = f"Hi from {service_name}. Automate after-hours patient booking for {company[:20]}. Reply YES for a quick demo or STOP to opt out."

        return {
            "channel": "SMS",
            "subject": None,
            "body_text": msg,
            "body_html": f"<p>{msg}</p>",
            "cta": "Reply YES for info",
            "evidence_used": "After-hours booking automation"
        }

    @classmethod
    def generate_pitch(
        cls,
        prospect_data: Dict[str, Any],
        channel: str = "EMAIL",
        service_name: str = "Elena AI Receptionist"
    ) -> Dict[str, Any]:
        """Master dispatch returning channel-specific structured draft."""
        ch = channel.upper()
        if ch == "EMAIL":
            return cls.generate_email_pitch(prospect_data, service_name=service_name)
        elif ch == "WHATSAPP":
            return cls.generate_whatsapp_pitch(prospect_data, service_name=service_name)
        elif ch == "SMS":
            return cls.generate_sms_pitch(prospect_data, service_name=service_name)
        else:
            return cls.generate_email_pitch(prospect_data, service_name=service_name)

pitch_generator = PitchGenerator()
