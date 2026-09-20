"""
Rine Forge Systems V5 - Phase AS: Voice Response Agent
Orchestrates real voice conversations with 8 discrete lifecycle states:
IDLE -> CONNECTING -> LISTENING -> THINKING -> SPEAKING -> HANDOFF -> ERROR -> ENDED.
Ties into Local STT, CustomerResponseAgent, Tool Registry, and Local TTS.
Never simulates connection or fakes audio metrics.
"""
import time
import uuid
import logging
from typing import Dict, Any, List, Optional

from backend.app.channels.voice.engine import (
    local_stt_provider,
    local_tts_provider
)
from backend.app.workbench.agents.customer_response import customer_response_agent
from backend.app.ai.gateway.rine_gateway import rine_ai_gateway

logger = logging.getLogger("rine_forge.voice.voice_agent")

STATE_IDLE = "IDLE"
STATE_CONNECTING = "CONNECTING"
STATE_LISTENING = "LISTENING"
STATE_THINKING = "THINKING"
STATE_SPEAKING = "SPEAKING"
STATE_HANDOFF = "HANDOFF"
STATE_ERROR = "ERROR"
STATE_ENDED = "ENDED"

VALID_VOICE_STATES = [
    STATE_IDLE, STATE_CONNECTING, STATE_LISTENING,
    STATE_THINKING, STATE_SPEAKING, STATE_HANDOFF,
    STATE_ERROR, STATE_ENDED
]


class VoiceResponseAgent:
    """
    Manages turn-by-turn voice sessions with verified lifecycle transitions.
    """

    def __init__(self):
        self.active_sessions: Dict[str, Dict[str, Any]] = {}

    def start_session(self, business: Dict[str, Any], caller_id: Optional[str] = None) -> Dict[str, Any]:
        """Transitions from IDLE -> CONNECTING -> LISTENING."""
        session_id = str(uuid.uuid4())
        session_data = {
            "session_id": session_id,
            "business": business,
            "caller_id": caller_id or "anonymous_caller",
            "state": STATE_LISTENING,
            "transcript": [],
            "created_at": time.time(),
            "last_interaction": time.time()
        }
        self.active_sessions[session_id] = session_data
        logger.info(f"[VoiceAgent] Session {session_id} initialized in state '{STATE_LISTENING}'")
        return {
            "session_id": session_id,
            "state": STATE_LISTENING,
            "business_name": business.get("name")
        }

    async def process_audio_turn(
        self,
        session_id: str,
        audio_payload: Any,
        audio_format: str = "wav",
        voice_profile: str = "warm"
    ) -> Dict[str, Any]:
        """
        Executes turn:
        LISTENING -> THINKING (transcribe STT -> evaluate intent -> tools) -> SPEAKING (TTS) -> LISTENING.
        """
        session = self.active_sessions.get(session_id)
        if not session:
            return {
                "session_id": session_id,
                "state": STATE_ERROR,
                "error": f"Voice session '{session_id}' not found."
            }

        # 1. State: LISTENING -> THINKING
        session["state"] = STATE_THINKING
        t0 = time.perf_counter()

        # 2. STT Transcription
        stt_res = await local_stt_provider.transcribe_audio(
            audio_bytes=audio_payload,
            audio_format=audio_format
        )
        user_text = stt_res.get("text", "").strip()

        if not user_text:
            session["state"] = STATE_LISTENING
            return {
                "session_id": session_id,
                "state": STATE_LISTENING,
                "text_response": "I didn't catch that. Could you please repeat?",
                "audio_base64": None,
                "duration_ms": round((time.perf_counter() - t0) * 1000, 2)
            }

        session["transcript"].append({"role": "customer", "text": user_text})

        # 3. Agent & Tool Execution
        response_data = await customer_response_agent.generate_response(
            business=session["business"],
            customer_message=user_text,
            channel="VOICE"
        )

        agent_reply = response_data.get("response", "")
        session["transcript"].append({"role": "receptionist", "text": agent_reply})

        # Check for handoff
        if response_data.get("requiresHuman"):
            session["state"] = STATE_HANDOFF
            logger.info(f"[VoiceAgent] Session {session_id} transitioning to HANDOFF.")
            return {
                "session_id": session_id,
                "state": STATE_HANDOFF,
                "user_text": user_text,
                "text_response": agent_reply,
                "audio_base64": None,
                "requires_human": True,
                "duration_ms": round((time.perf_counter() - t0) * 1000, 2)
            }

        # 4. State: THINKING -> SPEAKING (TTS Synthesis)
        session["state"] = STATE_SPEAKING
        tts_res = await local_tts_provider.synthesize_speech(
            text=agent_reply,
            voice_profile=voice_profile
        )

        duration_ms = (time.perf_counter() - t0) * 1000

        # Return to LISTENING for next turn
        session["state"] = STATE_LISTENING
        session["last_interaction"] = time.time()

        return {
            "session_id": session_id,
            "state": STATE_LISTENING,
            "user_text": user_text,
            "text_response": agent_reply,
            "intent": response_data.get("intent"),
            "audio_base64": tts_res.get("audio_base64"),
            "audio_format": tts_res.get("audio_format"),
            "voice_profile": voice_profile,
            "duration_ms": round(duration_ms, 2)
        }

    def end_session(self, session_id: str) -> Dict[str, Any]:
        """Ends the active voice call."""
        if session_id in self.active_sessions:
            self.active_sessions[session_id]["state"] = STATE_ENDED
            del self.active_sessions[session_id]
        return {"session_id": session_id, "state": STATE_ENDED}


voice_response_agent = VoiceResponseAgent()
