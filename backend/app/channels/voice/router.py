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


# ============================================================
# 3. FREE NEURAL AI VOICE SYNTHESIS & CALL SIMULATION ENDPOINTS
# ============================================================
class SynthesizeSpeechRequest(BaseModel):
    text: str
    voice: Optional[str] = "elena"


class SimulateCallRequest(BaseModel):
    business_name: Optional[str] = "Apex Dental & Orthodontics"
    industry: Optional[str] = "Dental Practice"
    caller_query: str
    voice: Optional[str] = "elena"


@router.get("/voices")
async def get_available_voices():
    """Returns available high-fidelity free neural AI voices."""
    from backend.app.channels.voice.engine import free_neural_tts_provider
    return {
        "voices": [
            {"id": "elena", "name": "Elena", "role": "24/7 Front Desk & Clinical Triage", "tone": "Warm, reassuring, professional", "model": "en-US-AriaNeural"},
            {"id": "marcus", "name": "Marcus", "role": "Speed-to-Lead & Inbound Sales", "tone": "Authoritative, fast, proactive", "model": "en-US-GuyNeural"},
            {"id": "aria", "name": "Aria", "role": "Customer Care & Policy Resolution", "tone": "Helpful, friendly, empathetic", "model": "en-US-JennyNeural"},
            {"id": "kael", "name": "Kael", "role": "Operations & Dispatch Supervisor", "tone": "Calm, precise, technical", "model": "en-US-ChristopherNeural"},
            {"id": "sonia", "name": "Sonia", "role": "Boutique Executive Receptionist", "tone": "Prestigious, articulate British English", "model": "en-GB-SoniaNeural"}
        ],
        "is_free": True,
        "provider": "FREE_NEURAL_TTS"
    }


@router.post("/synthesize")
async def synthesize_voice_speech(payload: SynthesizeSpeechRequest):
    """Synthesizes text into high-fidelity neural MP3 audio base64."""
    from backend.app.channels.voice.engine import free_neural_tts_provider
    res = await free_neural_tts_provider.synthesize(payload.text, voice_id=payload.voice or "elena")
    return {
        "audio_base64": res.get("audio_base64", ""),
        "audio_format": res.get("audio_format", "mp3"),
        "voice": res.get("voice", "en-US-AriaNeural"),
        "text": payload.text,
        "is_free": True,
        "provider": "FREE_NEURAL_TTS"
    }


@router.get("/stream")
async def stream_voice_speech(text: str = Query(...), voice: Optional[str] = Query("elena")):
    """Streams live neural MP3 audio directly for browser <audio> playback."""
    from fastapi.responses import Response
    from backend.app.channels.voice.engine import free_neural_tts_provider
    audio_bytes = await free_neural_tts_provider.synthesize_audio_bytes(
        text=text,
        voice_name=free_neural_tts_provider.VOICE_MAP.get((voice or "elena").lower(), "en-US-AriaNeural")
    )
    if not audio_bytes:
        raise HTTPException(status_code=400, detail="Speech synthesis failed or empty text provided")
    return Response(content=audio_bytes, media_type="audio/mpeg")


@router.post("/simulate-call")
async def simulate_live_receptionist_call(payload: SimulateCallRequest):
    """Single-turn autonomous receptionist dialogue generation with neural audio."""
    from backend.app.channels.voice.engine import free_neural_tts_provider
    
    q_lower = payload.caller_query.lower()
    biz = payload.business_name or "our office"

    if any(k in q_lower for k in ["appointment", "opening", "today", "friday", "time", "slot", "book"]):
        reply = f"Thank you for calling {biz}! Yes, we have two slots open this afternoon at 2:30 PM and 4:15 PM with our lead specialist. Would you like me to reserve the 2:30 PM slot and text your instant booking confirmation?"
    elif any(k in q_lower for k in ["cost", "price", "charge", "fee", "insurance", "how much"]):
        reply = f"At {biz}, our comprehensive initial evaluation and diagnostics is $149 flat, and we accept all major insurance networks. For treatments, we provide an itemized quote with zero surprises. Shall I lock in a consultation time?"
    elif any(k in q_lower for k in ["where", "location", "address", "parking", "directions"]):
        reply = f"We are located at 410 West 6th Street in Downtown, with complimentary customer parking in our attached private garage. Shall I text you our direct Google Maps navigation link right now?"
    else:
        reply = f"Thank you for reaching out to {biz}! Our team can certainly assist with that today. I can either book an on-site consultation or have our team review your requirements. What is the best phone number to reach you?"

    # Synthesize neural voice
    res = await free_neural_tts_provider.synthesize(reply, voice_id=payload.voice or "elena")

    return {
        "reply_text": reply,
        "audio_base64": res.get("audio_base64", ""),
        "audio_format": "mp3",
        "voice": payload.voice or "elena",
        "business_name": biz,
        "is_free": True,
        "provider": "FREE_NEURAL_TTS"
    }


# ============================================================
# 4. DIRECT /api/voice ALIAS ROUTER
# ============================================================
voice_api_alias_router = APIRouter(prefix="/voice", tags=["Voice Direct API"])

@voice_api_alias_router.get("/voices")
async def direct_get_voices():
    return await get_available_voices()

@voice_api_alias_router.post("/synthesize")
async def direct_synthesize(payload: SynthesizeSpeechRequest):
    return await synthesize_voice_speech(payload)

@voice_api_alias_router.get("/stream")
async def direct_stream(text: str = Query(...), voice: Optional[str] = Query("elena")):
    return await stream_voice_speech(text=text, voice=voice)

@voice_api_alias_router.post("/simulate-call")
async def direct_simulate(payload: SimulateCallRequest):
    return await simulate_live_receptionist_call(payload)

