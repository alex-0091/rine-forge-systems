"""
Rine Forge Systems V5 - Kill Switch Router
Emergency platform controls with authenticated authorization.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.database import get_db
from backend.app.kill_switch import kill_switch
from backend.app.models.compliance import AuditLog
from backend.app.models.v5 import User
from backend.app.schemas.schemas import KillSwitchRequest
from backend.app.auth.dependencies import get_current_user

router = APIRouter(prefix="/api/kill-switch", tags=["Emergency Controls"])

@router.get("/status")
async def get_kill_switch_status():
    """Returns the current pause/operational status of the platform."""
    return kill_switch.get_status()

@router.post("/toggle")
async def toggle_kill_switch(
    req: KillSwitchRequest,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """
    Authenticated emergency control to pause or resume outbound messaging.
    Restricted to authenticated platform operators.
    """
    actor_name = current_user.email or current_user.name
    if req.activate:
        kill_switch.activate(reason=req.reason or "Emergency Pause by Operator", actor=actor_name)
        event_name = "KILL_SWITCH_ACTIVATED"
    else:
        kill_switch.deactivate(actor=actor_name)
        event_name = "KILL_SWITCH_DEACTIVATED"

    audit = AuditLog(
        event_type=event_name,
        actor=actor_name,
        entity_type="system",
        description=f"Kill Switch status changed to {req.activate}. Reason: {req.reason}"
    )
    session.add(audit)
    await session.commit()

    return kill_switch.get_status()
