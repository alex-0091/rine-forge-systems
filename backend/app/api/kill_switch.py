from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.database import get_db
from backend.app.kill_switch import kill_switch
from backend.app.models.compliance import AuditLog
from backend.app.schemas.schemas import KillSwitchRequest

router = APIRouter(prefix="/api/kill-switch", tags=["Emergency Controls"])

@router.get("/status")
async def get_kill_switch_status():
    return kill_switch.get_status()

@router.post("/toggle")
async def toggle_kill_switch(req: KillSwitchRequest, session: AsyncSession = Depends(get_db)):
    if req.activate:
        kill_switch.activate(reason=req.reason or "Emergency Pause by Owner", actor="owais")
        event_name = "KILL_SWITCH_ACTIVATED"
    else:
        kill_switch.deactivate(actor="owais")
        event_name = "KILL_SWITCH_DEACTIVATED"

    audit = AuditLog(
        event_type=event_name,
        actor="owais",
        entity_type="system",
        description=f"Kill Switch status changed to {req.activate}. Reason: {req.reason}"
    )
    session.add(audit)
    await session.commit()

    return kill_switch.get_status()
