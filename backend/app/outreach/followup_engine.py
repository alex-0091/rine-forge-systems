"""
Rine Forge Systems V5 - Follow-Up Sequence Engine (Module 54)
Manages multi-touch sequence progression (Day 0, Day 3, Day 7, Day 14 archive),
thread preservation (In-Reply-To / References), and immediate sequence termination
upon reply, bounce, or opt-out.
"""
import logging
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any, Optional
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from backend.app.models.v5 import (
    V5Prospect,
    V5ProspectOutreach,
    V5OutreachEvent
)
from backend.app.outreach.rate_limiter_v5 import frequency_controller
from backend.app.outreach.outreach_generator import outreach_generator
from backend.app.outreach.email_provider_v5 import email_outreach_provider
from backend.app.compliance.suppression_service import suppression_service

logger = logging.getLogger(__name__)

class FollowUpEngine:
    """
    Evaluates enrolled prospects in sequence and generates or dispatches scheduled follow-ups.
    """

    async def check_due_followups(
        self,
        session: AsyncSession,
        business_id: str
    ) -> List[Dict[str, Any]]:
        """
        Finds prospects due for Step 1 (Day 3+) or Step 2 (Day 7+) or Step 3 archive (Day 14+).
        """
        now = datetime.now(timezone.utc)
        
        # Load prospects currently in outreach flow
        stmt = (
            select(V5Prospect)
            .where(
                V5Prospect.business_id == business_id,
                V5Prospect.outreach_status.in_(["SENT", "DELIVERED", "OPENED"]),
                V5Prospect.contact_status.in_(["IN_PROGRESS", "UNCONTACTED"]),
                V5Prospect.pipeline_stage.in_(["CONTACTED", "DISCOVERED"])
            )
            .options(
                selectinload(V5Prospect.outreach_messages),
                selectinload(V5Prospect.observations),
                selectinload(V5Prospect.opportunities)
            )
        )
        res = await session.execute(stmt)
        prospects = res.scalars().all()
        actions_taken = []

        for p in prospects:
            messages = sorted(p.outreach_messages, key=lambda m: m.created_at or datetime.min.replace(tzinfo=timezone.utc))
            if not messages:
                continue

            last_msg = messages[-1]
            last_sent_at = last_msg.sent_at or last_msg.created_at
            if last_sent_at.tzinfo is None:
                last_sent_at = last_sent_at.replace(tzinfo=timezone.utc)
            
            elapsed = now - last_sent_at
            msg_count = len([m for m in messages if m.status in ["SENT", "DELIVERED", "OPENED", "APPROVED"]])

            # Step 1 Check (72 hours / 3 days after step 0)
            if msg_count == 1 and elapsed >= timedelta(hours=72):
                action = await self._queue_or_send_step(
                    session=session,
                    business_id=business_id,
                    prospect=p,
                    step_number=1,
                    parent_message=last_msg
                )
                actions_taken.append(action)

            # Step 2 Check (96 hours / 4 days after step 1 -> Day 7 total)
            elif msg_count == 2 and elapsed >= timedelta(hours=96):
                action = await self._queue_or_send_step(
                    session=session,
                    business_id=business_id,
                    prospect=p,
                    step_number=2,
                    parent_message=last_msg
                )
                actions_taken.append(action)

            # Day 14+ Archive Check (No response after 3 messages)
            elif msg_count >= 3 and elapsed >= timedelta(days=7):
                p.pipeline_stage = "NO_RESPONSE"
                p.outreach_status = "STOPPED"
                p.next_action = "ARCHIVED_NO_RESPONSE"
                actions_taken.append({
                    "prospect_id": p.id,
                    "company_name": p.company_name,
                    "action": "ARCHIVED",
                    "reason": "Max sequence reached with no reply after 14 days"
                })

        await session.commit()
        return actions_taken

    async def _queue_or_send_step(
        self,
        session: AsyncSession,
        business_id: str,
        prospect: V5Prospect,
        step_number: int,
        parent_message: V5ProspectOutreach
    ) -> Dict[str, Any]:
        """
        Creates the follow-up record. In REVIEW mode, marks PENDING_REVIEW; in AUTO mode, dispatches.
        """
        # Frequency check
        allowed, reason = await frequency_controller.can_send_to_prospect(
            session=session,
            business_id=business_id,
            prospect=prospect,
            channel=parent_message.channel
        )
        if not allowed:
            return {"prospect_id": prospect.id, "action": "BLOCKED", "reason": reason}

        # Generate step content
        step_content = outreach_generator.generate_sequence_step(
            prospect=prospect,
            step_number=step_number,
            channel=parent_message.channel
        )

        headers = {}
        if parent_message.external_message_id:
            headers["In-Reply-To"] = parent_message.external_message_id
            headers["References"] = parent_message.external_message_id

        # Determine status based on prospect review mode
        status = "PENDING_REVIEW" if prospect.review_mode != "AUTO" else "APPROVED"

        new_msg = V5ProspectOutreach(
            business_id=business_id,
            prospect_id=prospect.id,
            channel=parent_message.channel,
            subject=step_content["subject"],
            message=step_content["body_text"],
            reason=f"Automated Sequence Step {step_number}",
            status=status,
            step_number=step_number,
            meta_json={"headers": headers, "body_html": step_content["body_html"]}
        )
        session.add(new_msg)
        await session.flush()

        session.add(V5OutreachEvent(
            outreach_id=new_msg.id,
            event_type="DRAFTED",
            payload={"step_number": step_number, "mode": prospect.review_mode}
        ))

        # If AUTO mode, dispatch immediately
        if prospect.review_mode == "AUTO" and prospect.email:
            send_res = await email_outreach_provider.send(
                to_email=prospect.email,
                subject=new_msg.subject or f"Update for {prospect.company_name}",
                body_html=step_content["body_html"],
                body_text=step_content["body_text"],
                business_id=business_id,
                custom_headers=headers,
                tracking_id=new_msg.id
            )
            new_msg.status = "SENT"
            new_msg.sent_at = datetime.now(timezone.utc)
            new_msg.external_message_id = send_res.get("message_id")
            prospect.last_contacted = datetime.now(timezone.utc)
            prospect.outreach_status = "SENT"

            session.add(V5OutreachEvent(
                outreach_id=new_msg.id,
                event_type="SENT",
                payload={"provider": "EmailOutreachProvider", "message_id": send_res.get("message_id")}
            ))

        return {
            "prospect_id": prospect.id,
            "company_name": prospect.company_name,
            "action": "FOLLOWUP_QUEUED" if status == "PENDING_REVIEW" else "FOLLOWUP_SENT",
            "step_number": step_number,
            "outreach_id": new_msg.id
        }

    async def cancel_sequence(
        self,
        session: AsyncSession,
        prospect_id: str,
        reason: str
    ) -> int:
        """
        Cancels all pending/drafted outreach records for a prospect upon reply, opt-out, or manual stop.
        """
        stmt = select(V5ProspectOutreach).where(
            V5ProspectOutreach.prospect_id == prospect_id,
            V5ProspectOutreach.status.in_(["PENDING_REVIEW", "DRAFT", "APPROVED"])
        )
        res = await session.execute(stmt)
        canceled_count = 0
        for msg in res.scalars().all():
            msg.status = "STOPPED"
            msg.reason = f"Canceled: {reason}"
            canceled_count += 1
            session.add(V5OutreachEvent(
                outreach_id=msg.id,
                event_type="CANCELED",
                payload={"reason": reason}
            ))
        return canceled_count

followup_engine = FollowUpEngine()
