"""
Rine Forge Systems V5 - Forge Intelligence Fabric: Human Approval Gate
Intercepts and queues consequential or external side-effect actions.
Categorizes by 4 risk levels: LOW, MEDIUM, HIGH, CRITICAL.
Enforces that external communications and state mutations stop for operator review.
"""
import uuid
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from pydantic import BaseModel, Field

from backend.app.ai.fabric.constants import RiskLevel


class ApprovalRequest(BaseModel):
    id: str
    workspace_id: str
    action_type: str
    description: str
    risk_level: str
    payload: Dict[str, Any]
    status: str = "PENDING"  # PENDING, APPROVED, REJECTED
    operator_id: Optional[str] = None
    decision_reason: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    resolved_at: Optional[str] = None


class HumanApprovalGate:
    """Approval queue and authorization validator for consequential operations."""

    _queue: Dict[str, ApprovalRequest] = {}  # approval_id -> ApprovalRequest

    @classmethod
    def create_request(
        cls,
        workspace_id: str,
        action_type: str,
        description: str,
        payload: Dict[str, Any],
        risk_level: str = RiskLevel.HIGH.value
    ) -> ApprovalRequest:
        req_id = f"appr-{uuid.uuid4().hex[:8]}"
        req = ApprovalRequest(
            id=req_id,
            workspace_id=workspace_id,
            action_type=action_type,
            description=description,
            risk_level=risk_level,
            payload=payload,
            status="PENDING"
        )
        cls._queue[req_id] = req
        return req

    @classmethod
    def resolve_request(
        cls,
        approval_id: str,
        approved: bool,
        operator_id: str = "operator",
        reason: Optional[str] = None
    ) -> Optional[ApprovalRequest]:
        req = cls._queue.get(approval_id)
        if not req:
            return None

        req.status = "APPROVED" if approved else "REJECTED"
        req.operator_id = operator_id
        req.decision_reason = reason or ("Approved by operator" if approved else "Rejected by operator")
        req.resolved_at = datetime.now(timezone.utc).isoformat()
        return req

    @classmethod
    def list_pending(cls, workspace_id: Optional[str] = None) -> List[ApprovalRequest]:
        reqs = list(cls._queue.values())
        if workspace_id:
            reqs = [r for r in reqs if r.workspace_id == workspace_id]
        return [r for r in reqs if r.status == "PENDING"]

    @classmethod
    def get_request(cls, approval_id: str) -> Optional[ApprovalRequest]:
        return cls._queue.get(approval_id)
