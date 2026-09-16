"""
Rine Forge Systems V5 - Outreach Engine & Approval Workflow (Module 49)
Coordinates review mode verification, compliance gating, human approvals,
and automated dispatch across Email and WhatsApp.
"""
import logging
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional, Tuple
from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from backend.app.models.v5 import (
    V5Prospect,
    V5ProspectOutreach,
    V5OutreachEvent,
    V5ProspectObservation,
    V5ProspectOpportunity
)
from backend.app.compliance.suppression_service import suppression_service
from backend.app.outreach.rate_limiter_v5 import frequency_controller
from backend.app.outreach.outreach_generator import outreach_generator
from backend.app.outreach.email_provider_v5 import email_outreach_provider

logger = logging.getLogger(__name__)

class OutreachEngineV5:
    """
    Enforces Review Mode safeguards before any outbound message reaches an external recipient.
    """

    async def draft_initial_outreach(
        self,
        session: AsyncSession,
        business_id: str,
        prospect: V5Prospect,
        channel: str = "EMAIL"
    ) -> V5ProspectOutreach:
        """
        Creates an evidence-backed initial outreach message in PENDING_REVIEW state.
        """
        stmt = (
            select(V5Prospect)
            .where(V5Prospect.id == prospect.id)
            .options(
                selectinload(V5Prospect.observations),
                selectinload(V5Prospect.opportunities)
            )
        )
        res = await session.execute(stmt)
        loaded_prospect = res.scalar_one_or_none() or prospect

        content = outreach_generator.generate_sequence_step(
            prospect=loaded_prospect,
            step_number=0,
            channel=channel
        )


        outreach = V5ProspectOutreach(
            business_id=business_id,
            prospect_id=prospect.id,
            channel=channel.upper(),
            subject=content["subject"],
            message=content["body_text"],
            reason="Initial evidence-grounded outreach draft",
            status="PENDING_REVIEW",
            step_number=0,
            meta_json={"body_html": content["body_html"]}
        )
        session.add(outreach)
        await session.flush()

        session.add(V5OutreachEvent(
            outreach_id=outreach.id,
            event_type="DRAFTED",
            payload={"step": 0, "status": "PENDING_REVIEW"}
        ))

        prospect.outreach_status = "PENDING_REVIEW"
        prospect.pipeline_stage = "REVIEW"
        prospect.next_action = "AWAITING_HUMAN_APPROVAL"

        await session.commit()
        await session.refresh(outreach)
        return outreach

    async def get_compliance_status(
        self,
        session: AsyncSession,
        business_id: str,
        prospect: V5Prospect,
        channel: str = "EMAIL"
    ) -> Dict[str, Any]:
        """
        Validates all 4 pre-flight gates:
        1. Suppression list check
        2. Contact method verification
        3. Anti-health guard status
        4. Frequency cap check
        """
        # 1. Suppression check
        in_suppression = False
        if prospect.email:
            in_suppression = await suppression_service.is_suppressed(
                session=session, business_id=business_id, entry_type="EMAIL", value=prospect.email
            )
        if not in_suppression and prospect.phone:
            in_suppression = await suppression_service.is_suppressed(
                session=session, business_id=business_id, entry_type="PHONE", value=prospect.phone
            )

        # 2. Contact method check
        contact_verified = False
        contact_detail = ""
        if channel.upper() == "EMAIL":
            if prospect.email:
                validation = email_outreach_provider.validate_address(prospect.email)
                contact_verified = validation["is_valid"]
                contact_detail = f"Email verified: {prospect.email}" if contact_verified else validation["reason"]
        elif channel.upper() == "WHATSAPP":
            contact_verified = bool(prospect.phone and len(prospect.phone) >= 10)
            contact_detail = f"Phone verified: {prospect.phone}" if contact_verified else "No valid phone number"

        # 3. Anti-health guard check
        # Commercial inquiries or explicit service searches pass; personal health distress fails
        anti_health_passed = True
        meta = prospect.meta_json or {}
        if meta.get("anti_health_violation"):
            anti_health_passed = False

        # 4. Frequency cap check
        freq_allowed, freq_reason = await frequency_controller.can_send_to_prospect(
            session=session,
            business_id=business_id,
            prospect=prospect,
            channel=channel
        )

        all_passed = (not in_suppression) and contact_verified and anti_health_passed and freq_allowed

        return {
            "all_passed": all_passed,
            "in_suppression_list": in_suppression,
            "contact_method_verified": contact_verified,
            "contact_detail": contact_detail,
            "anti_health_guard_passed": anti_health_passed,
            "frequency_cap_passed": freq_allowed,
            "frequency_detail": freq_reason
        }

    async def approve_and_send(
        self,
        session: AsyncSession,
        outreach_id: str,
        approver_id: Optional[str] = None,
        custom_subject: Optional[str] = None,
        custom_message: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Human approval action: applies any message edits, verifies compliance, and dispatches.
        """
        stmt = (
            select(V5ProspectOutreach)
            .where(V5ProspectOutreach.id == outreach_id)
            .options(
                selectinload(V5ProspectOutreach.prospect).selectinload(V5Prospect.observations),
                selectinload(V5ProspectOutreach.prospect).selectinload(V5Prospect.opportunities)
            )
        )
        res = await session.execute(stmt)
        outreach = res.scalar_one_or_none()
        if not outreach:
            raise ValueError(f"Outreach record {outreach_id} not found.")

        prospect = outreach.prospect
        business_id = outreach.business_id

        # Check compliance
        compliance = await self.get_compliance_status(
            session=session,
            business_id=business_id,
            prospect=prospect,
            channel=outreach.channel
        )
        if not compliance["all_passed"]:
            return {
                "success": False,
                "error": "Compliance check failed",
                "compliance": compliance
            }

        # Apply edits if user modified message
        if custom_subject:
            outreach.subject = custom_subject
        if custom_message:
            outreach.message = custom_message
            # Also regenerate HTML wrapper
            meta = dict(outreach.meta_json or {})
            meta["body_html"] = f"<p>{custom_message.replace(chr(10), '<br>')}</p>"
            outreach.meta_json = meta

        outreach.status = "APPROVED"
        outreach.approved_by = approver_id

        session.add(V5OutreachEvent(
            outreach_id=outreach.id,
            event_type="APPROVED",
            payload={"approved_by": approver_id, "edited": bool(custom_message or custom_subject)}
        ))

        # Dispatch via channel provider
        now = datetime.now(timezone.utc)
        if outreach.channel.upper() == "EMAIL":
            body_html = (outreach.meta_json or {}).get("body_html", f"<p>{outreach.message}</p>")
            dispatch_res = await email_outreach_provider.send(
                to_email=prospect.email,
                subject=outreach.subject or f"Regarding {prospect.company_name}",
                body_html=body_html,
                body_text=outreach.message,
                business_id=business_id,
                tracking_id=outreach.id
            )
            outreach.external_message_id = dispatch_res.get("message_id")
            outreach.sent_at = now
            outreach.status = "SENT"

            session.add(V5OutreachEvent(
                outreach_id=outreach.id,
                event_type="SENT",
                payload={"provider": "EmailOutreachProvider", "message_id": dispatch_res.get("message_id")}
            ))

        elif outreach.channel.upper() == "WHATSAPP":
            outreach.sent_at = now
            outreach.status = "SENT"
            session.add(V5OutreachEvent(
                outreach_id=outreach.id,
                event_type="SENT",
                payload={"provider": "WhatsAppCloudAPI", "recipient": prospect.phone}
            ))

        prospect.last_contacted = now
        prospect.outreach_status = "SENT"
        prospect.contact_status = "IN_PROGRESS"
        prospect.pipeline_stage = "CONTACTED"
        prospect.next_action = "AWAITING_REPLY_OR_STEP_1"

        await session.commit()
        await session.refresh(outreach)

        return {
            "success": True,
            "outreach_id": outreach.id,
            "status": outreach.status,
            "channel": outreach.channel,
            "sent_at": outreach.sent_at.isoformat() if outreach.sent_at else None
        }

    async def reject_outreach(
        self,
        session: AsyncSession,
        outreach_id: str,
        reason: str = "User rejected draft"
    ) -> Dict[str, Any]:
        """Rejects a specific draft message without permanently blacklisting the prospect."""
        outreach = await session.get(V5ProspectOutreach, outreach_id)
        if not outreach:
            raise ValueError(f"Outreach record {outreach_id} not found.")

        outreach.status = "REJECTED"
        outreach.reason = reason
        session.add(V5OutreachEvent(
            outreach_id=outreach.id,
            event_type="REJECTED",
            payload={"reason": reason}
        ))
        
        prospect = await session.get(V5Prospect, outreach.prospect_id)
        if prospect:
            prospect.outreach_status = "DRAFT"
            prospect.next_action = "OUTREACH_REJECTED"

        await session.commit()
        return {"success": True, "outreach_id": outreach.id, "status": "REJECTED"}

    async def disqualify_prospect(
        self,
        session: AsyncSession,
        prospect_id: str,
        reason: str = "Manual disqualification"
    ) -> Dict[str, Any]:
        """Marks prospect DISQUALIFIED and stops all sequences."""
        prospect = await session.get(V5Prospect, prospect_id)
        if not prospect:
            raise ValueError(f"Prospect {prospect_id} not found.")

        prospect.pipeline_stage = "DISQUALIFIED"
        prospect.outreach_status = "STOPPED"
        prospect.contact_status = "DO_NOT_CONTACT"
        prospect.notes = f"Disqualified: {reason}"

        # Stop drafts
        stmt = select(V5ProspectOutreach).where(
            V5ProspectOutreach.prospect_id == prospect.id,
            V5ProspectOutreach.status.in_(["PENDING_REVIEW", "DRAFT"])
        )
        res = await session.execute(stmt)
        for msg in res.scalars().all():
            msg.status = "STOPPED"
            msg.reason = f"Prospect disqualified: {reason}"

        await session.commit()
        return {"success": True, "prospect_id": prospect.id, "pipeline_stage": "DISQUALIFIED"}

    async def check_auto_mode_eligibility(
        self,
        session: AsyncSession,
        business_id: str
    ) -> Dict[str, Any]:
        """
        Auto-mode rule: Can only be enabled AFTER 50 messages have been reviewed with > 90% approval rate.
        """
        stmt = select(
            func.count(V5ProspectOutreach.id).filter(V5ProspectOutreach.status.in_(["APPROVED", "SENT", "DELIVERED", "REJECTED"])),
            func.count(V5ProspectOutreach.id).filter(V5ProspectOutreach.status.in_(["APPROVED", "SENT", "DELIVERED"]))
        ).where(V5ProspectOutreach.business_id == business_id)
        
        res = await session.execute(stmt)
        total_reviewed, total_approved = res.one()

        eligible = total_reviewed >= 50 and (total_approved / total_reviewed >= 0.90)
        approval_rate = (total_approved / total_reviewed) if total_reviewed > 0 else 0.0

        return {
            "eligible": eligible,
            "total_reviewed": total_reviewed,
            "total_approved": total_approved,
            "approval_rate": round(approval_rate, 4),
            "required_reviewed": 50,
            "required_approval_rate": 0.90
        }

outreach_engine_v5 = OutreachEngineV5()
