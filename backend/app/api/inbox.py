from datetime import datetime, timezone
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, desc
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.database import get_db
from backend.app.config import settings
from backend.app.models.inbox import Conversation, Reply, SystemAlert
from backend.app.models.business import Business
from backend.app.models.compliance import AuditLog
from backend.app.inbox.reply_monitor import reply_monitor
from backend.app.inbox.learning_loop import human_correction_store
from backend.app.outreach.email_provider import get_email_provider

router = APIRouter(prefix="/api/inbox", tags=["Inbox & Replies"])

@router.get("/conversations")
async def list_conversations(
    status: Optional[str] = None,
    human_action_only: bool = False,
    session: AsyncSession = Depends(get_db)
):
    query = select(Conversation).options(
        selectinload(Conversation.business),
        selectinload(Conversation.replies)
    ).order_by(desc(Conversation.updated_at))

    if status:
        query = query.where(Conversation.status == status)
    if human_action_only:
        query = query.where(Conversation.requires_human_action == True)

    res = await session.execute(query)
    conversations = res.scalars().all()

    results = []
    for c in conversations:
        biz = c.business
        last_reply = c.replies[-1] if c.replies else None

        results.append({
            "id": c.id,
            "business_id": c.business_id,
            "business_name": biz.name if biz else c.contact_email,
            "contact_email": c.contact_email,
            "subject": c.subject,
            "status": c.status,
            "latest_intent_classification": c.latest_intent_classification,
            "latest_intent_score": c.latest_intent_score,
            "requires_human_action": c.requires_human_action,
            "human_action_reason": c.human_action_reason,
            "reply_count": len(c.replies),
            "latest_message_snippet": last_reply.raw_body[:120] if last_reply else "",
            "latest_suggested_reply": last_reply.suggested_reply if last_reply else None,
            "updated_at": c.updated_at.isoformat()
        })
    return results

@router.get("/conversations/{conversation_id}")
async def get_conversation_thread(conversation_id: str, session: AsyncSession = Depends(get_db)):
    stmt = select(Conversation).options(
        selectinload(Conversation.business),
        selectinload(Conversation.replies)
    ).where(Conversation.id == conversation_id)
    res = await session.execute(stmt)
    conv = res.scalars().first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    return {
        "id": conv.id,
        "business_name": conv.business.name if conv.business else conv.contact_email,
        "contact_email": conv.contact_email,
        "subject": conv.subject,
        "status": conv.status,
        "requires_human_action": conv.requires_human_action,
        "human_action_reason": conv.human_action_reason,
        "replies": [{
            "id": r.id,
            "direction": r.direction,
            "sender_email": r.sender_email,
            "recipient_email": r.recipient_email,
            "raw_body": r.raw_body,
            "classification": r.classification,
            "intent_score": r.intent_score,
            "sentiment": r.sentiment,
            "suggested_reply": r.suggested_reply,
            "auto_responded": r.auto_responded,
            "human_approved": r.human_approved,
            "created_at": r.created_at.isoformat()
        } for r in conv.replies]
    }

@router.post("/simulate-reply")
async def simulate_incoming_reply(req: SimulateReplyRequest, session: AsyncSession = Depends(get_db)):
    """Simulates receipt of an inbound prospect email to test classification, intent scoring, and escalation."""
    result = await reply_monitor.process_inbound_reply(
        session=session,
        sender_email=req.sender_email,
        subject=req.subject,
        body_text=req.body_text
    )
    return result

@router.post("/send-reply")
async def send_response_to_prospect(req: SendReplyRequest, session: AsyncSession = Depends(get_db)):
    stmt = select(Conversation).options(selectinload(Conversation.replies)).where(Conversation.id == req.conversation_id)
    res = await session.execute(stmt)
    conv = res.scalars().first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Check for previous AI suggested reply to record HumanCorrection
    last_inbound = [r for r in conv.replies if r.direction == "INBOUND"]
    if last_inbound and last_inbound[-1].suggested_reply:
        await human_correction_store.record_human_correction(
            session=session,
            conversation_id=conv.id,
            reply_id=last_inbound[-1].id,
            ai_draft=last_inbound[-1].suggested_reply,
            owais_edit=req.reply_body,
            reason="Owais refined suggested response before sending"
        )

    # Send outbound email
    provider = get_email_provider()
    dispatch_res = await provider.send_email(
        to_email=conv.contact_email,
        to_name=conv.contact_email.split("@")[0],
        subject=f"re: {conv.subject}",
        body_text=req.reply_body
    )

    # Record outbound reply
    out_reply = Reply(
        conversation_id=conv.id,
        direction="OUTBOUND",
        sender_email=settings.SENDER_EMAIL,
        recipient_email=conv.contact_email,
        raw_body=req.reply_body,
        classification="OUTBOUND_MANUAL",
        human_approved=True
    )
    session.add(out_reply)

    # Resolve human escalation
    conv.requires_human_action = False
    conv.status = "OPEN"

    audit = AuditLog(
        event_type="EMAIL_SENT",
        actor="owais",
        entity_type="reply",
        entity_id=conv.id,
        description=f"Owais sent response to {conv.contact_email}"
    )
    session.add(audit)

    await session.commit()
    return {"success": True, "dispatch": dispatch_res}

@router.get("/alerts")
async def list_system_alerts(session: AsyncSession = Depends(get_db)):
    stmt = select(SystemAlert).order_by(desc(SystemAlert.created_at)).limit(30)
    res = await session.execute(stmt)
    alerts = res.scalars().all()
    return [{
        "id": a.id,
        "type": a.alert_type,
        "severity": a.severity,
        "title": a.title,
        "message": a.message,
        "is_resolved": a.is_resolved,
        "metadata": a.metadata_json,
        "created_at": a.created_at.isoformat()
    } for a in alerts]

@router.post("/alerts/{alert_id}/resolve")
async def resolve_alert(alert_id: str, session: AsyncSession = Depends(get_db)):
    stmt = select(SystemAlert).where(SystemAlert.id == alert_id)
    res = await session.execute(stmt)
    alert = res.scalars().first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.is_resolved = True
    await session.commit()
    return {"success": True, "alert_id": alert.id, "is_resolved": True}
