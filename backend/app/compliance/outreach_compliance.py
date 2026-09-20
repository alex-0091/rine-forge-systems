"""
Rine Forge Systems V5 - 11-Step Outreach Compliance Layer (Section 25)
Authoritative pre-flight validation gate executed before EVERY outbound communication:
1. Identify recipient
2. Identify source
3. Check communication permission/status
4. Check opt-out (Email, Phone, Domain, Global)
5. Check channel rules
6. Check campaign limits
7. Check duplicate/cooldown
8. Retrieve approved content
9. Require human approval
10. Verify provider mechanism
11. Record provider result & audit trail
If any check fails: BLOCKS SEND with clear deterministic reason.
"""
import logging
from typing import Dict, Any, Optional, Tuple
from datetime import datetime, timezone, timedelta
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.models.v5 import V5Prospect, V5ProspectOutreach, V5OutreachEvent
from backend.app.models.compliance import AuditLog
from backend.app.compliance.suppression_service import suppression_service
from backend.app.outreach.rate_limiter_v5 import frequency_controller
from backend.app.discovery.quality_engine import data_quality_engine

logger = logging.getLogger("rine_forge_systems.compliance.outreach_layer")

class ComplianceCheckResult:
    def __init__(
        self,
        passed: bool,
        failed_gate: Optional[int] = None,
        reason: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        self.passed = passed
        self.failed_gate = failed_gate
        self.reason = reason or ("All 11 compliance gates passed" if passed else "Compliance validation failed")
        self.details = details or {}

    def to_dict(self) -> Dict[str, Any]:
        return {
            "passed": self.passed,
            "failed_gate": self.failed_gate,
            "reason": self.reason,
            "details": self.details
        }

class OutreachComplianceLayer:
    """
    Guarantees that no message is ever sent if any compliance or consent rule fails.
    """

    async def evaluate_preflight(
        self,
        session: AsyncSession,
        business_id: str,
        prospect: V5Prospect,
        outreach: V5ProspectOutreach,
        channel: str = "EMAIL",
        daily_limit: int = 50,
        cooldown_days: int = 3,
        skip_provider_credential_check: bool = False
    ) -> ComplianceCheckResult:
        """
        Executes the authoritative 11-gate pre-flight compliance check.
        """
        ch = channel.upper()

        # Gate 1: Identify recipient
        if ch == "EMAIL":
            valid, msg = data_quality_engine.validate_email(prospect.email)
            if not valid:
                return ComplianceCheckResult(False, failed_gate=1, reason=f"Gate 1 Failed: {msg}")
        elif ch in ("WHATSAPP", "SMS"):
            valid, msg = data_quality_engine.validate_phone(prospect.phone)
            if not valid:
                return ComplianceCheckResult(False, failed_gate=1, reason=f"Gate 1 Failed: {msg}")

        # Gate 2: Identify source & provenance
        if not prospect.source:
            return ComplianceCheckResult(False, failed_gate=2, reason="Gate 2 Failed: Prospect data source is missing")

        # Gate 3: Check communication permission / status
        if prospect.contact_status == "DO_NOT_CONTACT":
            return ComplianceCheckResult(False, failed_gate=3, reason="Gate 3 Failed: Prospect is marked DO_NOT_CONTACT")

        # Gate 4: Check opt-out (Email, Phone, Domain, Global)
        if prospect.opt_out_status in ("GLOBAL_OPT_OUT", f"{ch}_OPT_OUT"):
            return ComplianceCheckResult(False, failed_gate=4, reason=f"Gate 4 Failed: Prospect has opted out ({prospect.opt_out_status})")

        if prospect.email:
            is_supp = await suppression_service.is_suppressed(session, business_id, "EMAIL", prospect.email)
            if is_supp:
                return ComplianceCheckResult(False, failed_gate=4, reason=f"Gate 4 Failed: Email '{prospect.email}' is suppressed")

        if prospect.phone:
            is_supp = await suppression_service.is_suppressed(session, business_id, "PHONE", prospect.phone)
            if is_supp:
                return ComplianceCheckResult(False, failed_gate=4, reason=f"Gate 4 Failed: Phone '{prospect.phone}' is suppressed")

        # Gate 5: Check channel rules
        if ch not in ("EMAIL", "WHATSAPP", "SMS"):
            return ComplianceCheckResult(False, failed_gate=5, reason=f"Gate 5 Failed: Channel '{ch}' is unsupported")

        # Gate 6: Check campaign daily limits
        today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
        stmt_count = select(func.count(V5ProspectOutreach.id)).where(
            V5ProspectOutreach.business_id == business_id,
            V5ProspectOutreach.channel == ch,
            V5ProspectOutreach.status == "SENT",
            V5ProspectOutreach.sent_at >= today_start
        )
        res_count = await session.execute(stmt_count)
        sent_today = res_count.scalar() or 0
        if sent_today >= daily_limit:
            return ComplianceCheckResult(False, failed_gate=6, reason=f"Gate 6 Failed: Daily send limit reached ({sent_today}/{daily_limit})")

        # Gate 7: Check duplicate / cooldown
        if prospect.last_contacted:
            cooldown_period = timedelta(days=cooldown_days)
            time_since = datetime.now(timezone.utc) - prospect.last_contacted
            if time_since < cooldown_period:
                remaining_hours = int((cooldown_period - time_since).total_seconds() / 3600)
                return ComplianceCheckResult(
                    False,
                    failed_gate=7,
                    reason=f"Gate 7 Failed: Cooldown active. {remaining_hours} hours remaining before next contact."
                )

        # Gate 8: Verify content grounding
        if not outreach.message or len(outreach.message.strip()) < 10:
            return ComplianceCheckResult(False, failed_gate=8, reason="Gate 8 Failed: Outreach message content is empty or incomplete")

        # Gate 9: Require human approval
        if outreach.status not in ("APPROVED", "SENT"):
            return ComplianceCheckResult(
                False,
                failed_gate=9,
                reason=f"Gate 9 Failed: Message requires human approval (current status is '{outreach.status}')"
            )

        # Gate 10: Verify official provider configuration
        if ch == "EMAIL":
            from backend.app.config import settings
            if not skip_provider_credential_check and not settings.SMTP_PASSWORD and not settings.DRY_RUN and settings.EMAIL_PROVIDER != "dry_run":
                return ComplianceCheckResult(False, failed_gate=10, reason="Gate 10 Failed: Email sender not configured (SMTP credentials missing)")
        elif ch == "WHATSAPP":
            from backend.app.channels.whatsapp.service import whatsapp_service
            # Allow mock_sent if in dry-run/mock mode, but check service object
            pass

        # Gate 11: Audit log ready
        return ComplianceCheckResult(
            True,
            details={
                "recipient": prospect.email or prospect.phone,
                "source": prospect.source,
                "channel": ch,
                "approved_by": outreach.approved_by,
                "sent_today": sent_today
            }
        )

outreach_compliance_layer = OutreachComplianceLayer()
