from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, desc
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.database import get_db
from backend.app.models.campaign import OutreachMessage, CampaignMember, Campaign
from backend.app.models.business import Business
from backend.app.schemas.schemas import MessageActionRequest, BatchDispatchRequest
from backend.app.outreach.queue import queue_worker

router = APIRouter(prefix="/api/outreach", tags=["Outreach Queue"])

@router.get("/queue")
async def list_outreach_queue(
    status: Optional[str] = None,
    campaign_id: Optional[str] = None,
    limit: int = 50,
    session: AsyncSession = Depends(get_db)
):
    query = select(OutreachMessage).options(
        selectinload(OutreachMessage.campaign_member).selectinload(CampaignMember.business),
        selectinload(OutreachMessage.campaign_member).selectinload(CampaignMember.campaign)
    ).order_by(desc(OutreachMessage.created_at))

    if status:
        query = query.where(OutreachMessage.status == status)

    res = await session.execute(query.limit(limit))
    messages = res.scalars().all()

    results = []
    for m in messages:
        biz = m.campaign_member.business if m.campaign_member else None
        camp = m.campaign_member.campaign if m.campaign_member else None

        results.append({
            "id": m.id,
            "business_name": biz.name if biz else "Unknown",
            "business_country": biz.country if biz else "",
            "campaign_name": camp.name if camp else "",
            "recipient_email": m.recipient_email,
            "recipient_name": m.recipient_name,
            "step_number": m.step_number,
            "subject": m.subject,
            "body_preview": m.body_text[:150] + "...",
            "body_full": m.body_text,
            "personalized_hook": m.personalized_hook,
            "quality_score": m.quality_score,
            "compliance_passed": m.compliance_passed,
            "is_dry_run": m.is_dry_run,
            "status": m.status,
            "sent_at": m.sent_at.isoformat() if m.sent_at else None,
            "created_at": m.created_at.isoformat()
        })
    return {"count": len(results), "messages": results}

@router.post("/action")
async def handle_message_action(req: MessageActionRequest, session: AsyncSession = Depends(get_db)):
    stmt = select(OutreachMessage).where(OutreachMessage.id == req.message_id)
    res = await session.execute(stmt)
    msg = res.scalars().first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")

    if req.edited_subject:
        msg.subject = req.edited_subject
    if req.edited_body:
        msg.body_text = req.edited_body

    if req.action == "APPROVE":
        msg.status = "APPROVED"
        await session.commit()
        return {"success": True, "message_id": msg.id, "status": msg.status}

    elif req.action == "REJECT":
        msg.status = "CANCELLED"
        await session.commit()
        return {"success": True, "message_id": msg.id, "status": msg.status}

    elif req.action == "SEND_NOW":
        dispatch_res = await queue_worker.dispatch_message(
            session=session,
            message_id=msg.id,
            manual_override=True
        )
        return dispatch_res

    raise HTTPException(status_code=400, detail=f"Invalid action: {req.action}")

@router.post("/batch-send")
async def dispatch_batch(req: BatchDispatchRequest, session: AsyncSession = Depends(get_db)):
    query = select(OutreachMessage).where(OutreachMessage.status.in_(["QUEUED", "APPROVED"])).limit(req.limit)
    res = await session.execute(query)
    messages = res.scalars().all()

    dispatched = []
    failed = []

    for msg in messages:
        result = await queue_worker.dispatch_message(session=session, message_id=msg.id)
        if result.get("success"):
            dispatched.append(msg.id)
        else:
            failed.append({"id": msg.id, "reason": result.get("reason")})

    return {
        "attempted": len(messages),
        "dispatched_count": len(dispatched),
        "dispatched_ids": dispatched,
        "failed_count": len(failed),
        "failures": failed
    }
