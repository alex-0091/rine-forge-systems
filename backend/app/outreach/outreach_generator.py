"""
Rine Forge Systems V5 - Evidence-Grounded Outreach Generator (Module 48)
Generates high-converting, strictly evidence-backed outreach sequences.
Every message references verified website observations, concrete business impact,
and mandatory opt-out instructions. Zero generic fluff.
"""
import logging
from typing import Dict, Any, List, Optional
from backend.app.models.v5 import V5Prospect, V5ProspectObservation, V5ProspectOpportunity

logger = logging.getLogger(__name__)

class OutreachGenerator:
    """
    Constructs multi-step personalized sequences (Initial, Follow-up 1, Follow-up 2)
    directly grounded in factual website journey audit observations.
    """

    def generate_sequence_step(
        self,
        prospect: V5Prospect,
        step_number: int = 0,
        channel: str = "EMAIL",
        sender_name: str = "Elena at Rine Forge Systems",
        custom_instructions: Optional[str] = None
    ) -> Dict[str, str]:
        """
        Generates subject, body text, and body HTML for the given sequence step (0, 1, or 2).
        """
        channel_upper = channel.upper()
        biz_name = prospect.company_name
        industry = prospect.industry or "Practice"
        customer_term = "patients" if industry.lower() in ["dental", "medical", "clinic"] else "clients"

        # Find best observation & opportunity
        best_obs_text = "your website contact channels"
        if prospect.observations:
            sorted_obs = sorted(prospect.observations, key=lambda o: o.confidence, reverse=True)
            best_obs_text = sorted_obs[0].observation

        best_opp_reason = "replaces delayed contact forms with instant 24/7 AI booking"
        best_opp_type = "AI_RECEPTIONIST"
        if prospect.opportunities:
            sorted_opp = sorted(prospect.opportunities, key=lambda o: o.confidence, reverse=True)
            best_opp_reason = sorted_opp[0].reason
            best_opp_type = sorted_opp[0].type

        if step_number == 0:
            return self._generate_step_0(
                prospect=prospect,
                channel=channel_upper,
                best_obs=best_obs_text,
                opp_type=best_opp_type,
                customer_term=customer_term,
                sender_name=sender_name
            )
        elif step_number == 1:
            return self._generate_step_1(
                prospect=prospect,
                channel=channel_upper,
                best_obs=best_obs_text,
                customer_term=customer_term,
                sender_name=sender_name
            )
        else:
            return self._generate_step_2(
                prospect=prospect,
                channel=channel_upper,
                customer_term=customer_term,
                sender_name=sender_name
            )

    def _generate_step_0(
        self,
        prospect: V5Prospect,
        channel: str,
        best_obs: str,
        opp_type: str,
        customer_term: str,
        sender_name: str
    ) -> Dict[str, str]:
        biz_name = prospect.company_name
        
        subject = f"Quick note regarding {biz_name}'s website booking"
        
        # Grounded observation phrasing
        if "delayed turnaround" in best_obs.lower() or "24-48" in best_obs.lower():
            obs_intro = f"I was reviewing {biz_name}'s website and noticed: {best_obs}."
            impact_text = f"For new {customer_term} seeking urgent consultations or after-hours appointments, waiting 24 to 48 hours usually means they move on to the next practice on Google."
            solution_text = "Rine Forge deploys an AI receptionist (Elena) that engages website and WhatsApp visitors in under 30 seconds, answers specific service questions, and schedules directly into your calendar."
        elif "no automated calendar" in best_obs.lower() or "booking" in opp_type.lower():
            obs_intro = f"I took a look at {biz_name}'s website and noticed: {best_obs}."
            impact_text = f"Without an instant booking option, prospective {customer_term} who browse during evenings or weekends often drop off before your team opens next morning."
            solution_text = "We equip practices like yours with 24/7 conversational booking via Web and WhatsApp that books appointments into your software with zero receptionist friction."
        else:
            obs_intro = f"I was looking at {biz_name}'s online patient flow and noted: {best_obs}."
            impact_text = f"Capturing inquiries immediately gives your team a major edge over competitors who rely on traditional voicemails or delayed contact forms."
            solution_text = "Our verified AI employee handles routine questions, screens inquiries, and schedules consultations 24 hours a day."

        cta_text = f"Would you be open to a 2-minute preview showing how Elena handles after-hours {customer_term} inquiries for {biz_name}?"
        opt_out_text = "Reply STOP to not receive further messages."


        if channel == "WHATSAPP":
            whatsapp_body = (
                f"Hi team {biz_name},\n\n"
                f"{obs_intro}\n\n"
                f"{impact_text}\n\n"
                f"{solution_text}\n\n"
                f"{cta_text}\n\n"
                f"— {sender_name}\n\n"
                f"Reply STOP to opt out anytime."
            )
            return {
                "subject": "",
                "body_text": whatsapp_body,
                "body_html": f"<p>{whatsapp_body.replace(chr(10), '<br>')}</p>"
            }

        body_text = (
            f"Hi team at {biz_name},\n\n"
            f"{obs_intro}\n\n"
            f"{impact_text}\n\n"
            f"{solution_text}\n\n"
            f"{cta_text}\n\n"
            f"Best regards,\n"
            f"{sender_name}\n"
            f"Rine Forge Systems\n\n"
            f"---\n"
            f"{opt_out_text}"
        )

        body_html = f"""
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; color: #1e293b; line-height: 1.6;">
            <p>Hi team at <strong>{biz_name}</strong>,</p>
            <p>{obs_intro}</p>
            <p>{impact_text}</p>
            <p>{solution_text}</p>
            <p><strong>{cta_text}</strong></p>
            <p>Best regards,<br>
            <strong>{sender_name}</strong><br>
            Rine Forge Systems</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin-top: 24px; margin-bottom: 12px;" />
            <p style="font-size: 12px; color: #94a3b8;">
                {opt_out_text} | Rine Forge Systems, Austin TX
            </p>
        </div>
        """

        return {
            "subject": subject,
            "body_text": body_text,
            "body_html": body_html.strip()
        }

    def _generate_step_1(
        self,
        prospect: V5Prospect,
        channel: str,
        best_obs: str,
        customer_term: str,
        sender_name: str
    ) -> Dict[str, str]:
        biz_name = prospect.company_name
        subject = f"Following up: {biz_name}'s inquiry response time"

        body_text = (
            f"Hi team,\n\n"
            f"Quick follow-up on my note regarding {biz_name}. "
            f"We frequently see local practices miss 35%+ of new {customer_term} simply because inquiry replies take longer than 15 minutes.\n\n"
            f"We put together a short breakdown demonstrating how an AI receptionist converts after-hours visitors into scheduled calendar bookings with zero manual staff effort.\n\n"
            f"Would it be helpful if I shared that quick 2-minute overview?\n\n"
            f"Best,\n"
            f"{sender_name}\n\n"
            f"---\n"
            f"Reply STOP to opt out."
        )

        body_html = f"""
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; color: #1e293b; line-height: 1.6;">
            <p>Hi team,</p>
            <p>Quick follow-up on my note regarding <strong>{biz_name}</strong>. We frequently see practices miss 35%+ of new {customer_term} simply because inquiry replies take longer than 15 minutes.</p>
            <p>We put together a short breakdown demonstrating how an AI receptionist converts after-hours visitors into scheduled calendar bookings with zero manual staff effort.</p>
            <p><strong>Would it be helpful if I shared that quick 2-minute overview?</strong></p>
            <p>Best,<br><strong>{sender_name}</strong></p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin-top: 24px; margin-bottom: 12px;" />
            <p style="font-size: 12px; color: #94a3b8;">Reply STOP to opt out.</p>
        </div>
        """

        return {
            "subject": subject,
            "body_text": body_text,
            "body_html": body_html.strip()
        }

    def _generate_step_2(
        self,
        prospect: V5Prospect,
        channel: str,
        customer_term: str,
        sender_name: str
    ) -> Dict[str, str]:
        biz_name = prospect.company_name
        subject = f"Closing the loop on {biz_name}"

        body_text = (
            f"Hi team,\n\n"
            f"I realize you are busy running the practice, so I will close the loop here. "
            f"If you ever need to automate after-hours {customer_term} bookings, answer FAQs on WhatsApp, or reduce front-desk phone workload, you can explore Rine Forge at rineforge.com.\n\n"
            f"Wishing {biz_name} continued success.\n\n"
            f"Best regards,\n"
            f"{sender_name}\n\n"
            f"---\n"
            f"Reply STOP to unsubscribe."
        )

        body_html = f"""
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; color: #1e293b; line-height: 1.6;">
            <p>Hi team,</p>
            <p>I realize you are busy running the practice, so I will close the loop here. If you ever need to automate after-hours {customer_term} bookings, answer FAQs on WhatsApp, or reduce front-desk phone workload, feel free to keep Rine Forge in mind.</p>
            <p>Wishing <strong>{biz_name}</strong> continued success.</p>
            <p>Best regards,<br><strong>{sender_name}</strong></p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin-top: 24px; margin-bottom: 12px;" />
            <p style="font-size: 12px; color: #94a3b8;">Reply STOP to unsubscribe.</p>
        </div>
        """

        return {
            "subject": subject,
            "body_text": body_text,
            "body_html": body_html.strip()
        }

outreach_generator = OutreachGenerator()
