"""
Rine Forge Systems V5 - Voice Telephony & Real-Time Voice Engine Router
Endpoints for stateful voice sessions, speech-to-text turns, tool execution,
truthful human handoff, and voice telemetry analytics.
"""
import logging
from typing import Optional, Dict, Any, List
from fastapi import APIRouter, Request, Response, Depends, HTTPException, Header, Query
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.database import get_db
from backend.app.models.v5 import Business, V5VoiceSession
from backend.app.channels.voice.service import voice_service
from backend.app.channels.voice.pipeline import voice_pipeline
from backend.app.channels.voice.session_manager import voice_session_manager
from backend.app.channels.voice.engine import voice_engine

logger = logging.getLogger("rine_forge_systems.voice.router")

router = APIRouter(prefix="/channels/voice", tags=["Voice Telephony & Voice Engine"])


async def resolve_voice_tenant(
    x_business_id: Optional[str] = Header(None, alias="X-Business-ID"),
    query_biz_id: Optional[str] = Query(None, alias="business_id"),
    session: AsyncSession = Depends(get_db)
) -> str:
    target_id = x_business_id or query_biz_id
    if target_id:
        stmt = select(Business).where(Business.id == target_id)
        res = await session.execute(stmt)
        biz = res.scalar_one_or_none()
        if biz:
            return biz.id

    stmt = select(Business).order_by(Business.created_at.asc()).limit(1)
    res = await session.execute(stmt)
    biz = res.scalar_one_or_none()
    if biz:
        return biz.id

    raise HTTPException(status_code=400, detail="Tenant context required")


# ============================================================
# SCHEMAS
# ============================================================
class StartVoiceSessionRequest(BaseModel):
    agent_id: Optional[str] = "receptionist"
    channel: Optional[str] = "BROWSER"
    caller_identifier: Optional[str] = None
    caller_name: Optional[str] = None


class ProcessVoiceTurnRequest(BaseModel):
    customer_transcript: str


class HandoffVoiceRequest(BaseModel):
    reason: Optional[str] = "CUSTOMER_REQUESTED"


# ============================================================
# 1. REAL-TIME VOICE SESSION ENDPOINTS
# ============================================================
@router.post("/session/start")
async def start_voice_session(
    payload: StartVoiceSessionRequest,
    business_id: str = Depends(resolve_voice_tenant),
    session: AsyncSession = Depends(get_db)
):
    """Initializes a real-time voice session and returns opening greeting & session state."""
    voice_session = await voice_session_manager.start_session(
        session=session,
        business_id=business_id,
        agent_id=payload.agent_id or "receptionist",
        channel=payload.channel or "BROWSER",
        caller_identifier=payload.caller_identifier,
        caller_name=payload.caller_name
    )
    initial_greeting = voice_session.transcript[0]["text"] if voice_session.transcript else "Hello, how can I assist you today?"
    return {
        "session_id": voice_session.id,
        "status": voice_session.status,
        "agent_id": voice_session.agent_id,
        "greeting": initial_greeting,
        "channel": voice_session.channel,
        "started_at": voice_session.started_at.isoformat()
    }


@router.post("/session/{session_id}/turn")
async def process_voice_turn(
    session_id: str,
    payload: ProcessVoiceTurnRequest,
    business_id: str = Depends(resolve_voice_tenant),
    session: AsyncSession = Depends(get_db)
):
    """Processes spoken customer transcript, queries knowledge base & tools, and returns response text."""
    result = await voice_session_manager.process_turn(
        session=session,
        session_id=session_id,
        business_id=business_id,
        customer_transcript=payload.customer_transcript
    )
    if "error" in result and result.get("status") == "ERROR":
        raise HTTPException(status_code=404, detail=result["error"])
    return result


@router.post("/session/{session_id}/handoff")
async def trigger_voice_handoff(
    session_id: str,
    payload: HandoffVoiceRequest,
    business_id: str = Depends(resolve_voice_tenant),
    session: AsyncSession = Depends(get_db)
):
    """Requests human operator handoff. Truthfully informs caller if carrier transfer is unconfigured."""
    result = await voice_session_manager.request_handoff(
        session=session,
        session_id=session_id,
        business_id=business_id,
        reason=payload.reason or "CUSTOMER_REQUESTED"
    )
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result


@router.post("/session/{session_id}/end")
async def end_voice_session(
    session_id: str,
    business_id: str = Depends(resolve_voice_tenant),
    session: AsyncSession = Depends(get_db)
):
    """Concludes voice session, records duration, and persists final state."""
    voice_session = await voice_session_manager.end_session(
        session=session,
        session_id=session_id,
        business_id=business_id
    )
    if not voice_session:
        raise HTTPException(status_code=404, detail="Session not found")
    return {
        "session_id": voice_session.id,
        "status": voice_session.status,
        "duration_seconds": voice_session.duration_seconds,
        "turns_count": len(voice_session.transcript or []),
        "lead_id": voice_session.lead_id,
        "handoff_status": voice_session.handoff_status
    }


@router.get("/analytics")
async def get_voice_analytics(
    business_id: str = Depends(resolve_voice_tenant),
    session: AsyncSession = Depends(get_db)
):
    """Returns factual telemetry and metrics without arbitrary AI scoring."""
    return await voice_session_manager.get_voice_analytics(session=session, business_id=business_id)


@router.get("/providers")
async def get_voice_providers():
    """Lists registered voice engine providers and live connection statuses."""
    return voice_engine.get_providers_telemetry()


# ============================================================
# 2. LEGACY PSTN / TWILIO WEBHOOKS
# ============================================================
@router.get("/status")
async def get_voice_status():
    """Returns truthful diagnostic status for the voice subsystem."""
    return voice_service.get_status()


@router.post("/incoming")
async def handle_incoming_call(request: Request):
    """Twilio voice webhook endpoint."""
    import urllib.parse
    body_bytes = await request.body()
    parsed_form = urllib.parse.parse_qs(body_bytes.decode("utf-8", errors="replace"))

    SpeechResult = parsed_form.get("SpeechResult", [None])[0]
    From = parsed_form.get("From", [None])[0]
    CallSid = parsed_form.get("CallSid", [None])[0]

    logger.info(f"[Voice Call] From={From} | CallSid={CallSid} | SpeechResult='{SpeechResult}'")

    if not voice_service.is_configured:
        twiml = voice_service.generate_twiml_response("Voice integration is not configured.")
        return Response(content=twiml, media_type="application/xml")

    if not SpeechResult:
        twiml = voice_service.generate_twiml_response(
            "Hello! Thank you for calling Rine Dental & Facial Aesthetics. My name is Elena. How may I assist you today?"
        )
        return Response(content=twiml, media_type="application/xml")

    result = await voice_pipeline.process_voice_turn(
        audio_transcript=SpeechResult,
        conversation_history=[]
    )
    reply_text = result.get("response_text", "Thank you. Let me check on that for you.")
    twiml = voice_service.generate_twiml_response(reply_text)
    return Response(content=twiml, media_type="application/xml")


@router.post("/outbound")
async def dispatch_outbound_call(to_phone: str, greeting: Optional[str] = None):
    """Dispatches an outbound phone call if configured."""
    return await voice_service.initiate_outbound_call(to_phone, greeting or "Hello from Rine Dental.")
