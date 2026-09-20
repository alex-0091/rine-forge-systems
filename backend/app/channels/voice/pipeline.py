"""
Rine Forge Systems - Voice Pipeline Architecture
Real-time conversational voice pipeline:
Incoming Audio Stream -> Speech-To-Text (STT) -> AgentRuntime (Elena) -> Safe Tools -> Text-To-Speech (TTS) -> Outbound Audio Stream.
Tracks end-to-end latency and turn durations.
"""
import time
import logging
from typing import Dict, Any, Optional, List
from datetime import datetime, timezone

from backend.app.ai.gateway.core import ai_gateway
from backend.app.ai.gateway.interface import ChatMessage, AIOptions
from backend.app.ai.agents.config import get_agent_config

logger = logging.getLogger("rine_forge_systems.voice.pipeline")

class VoicePipeline:
    """
    Manages conversational voice turns with latency tracking and tool execution.
    """

    def __init__(self):
        self.stt_provider = "Deepgram / Whisper"
        self.tts_provider = "ElevenLabs / Cartesia"

    async def process_voice_turn(
        self,
        audio_transcript: str,
        conversation_history: List[Dict[str, str]],
        agent_name: str = "Elena",
        business_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Processes a single conversational voice turn:
        1. Ingests STT transcription.
        2. Queries AgentRuntime via AI Gateway.
        3. Returns generated response and synthesis directives with latency metadata.
        """
        start_time = time.perf_counter()
        agent_cfg = get_agent_config(agent_name)
        
        system_prompt = agent_cfg.system_prompt if agent_cfg else (
            "You are Elena, a professional AI voice receptionist. "
            "Keep responses concise, natural, warm, and suitable for phone conversations."
        )

        messages = [ChatMessage(role="system", content=system_prompt)]
        for turn in conversation_history[-6:]:
            messages.append(ChatMessage(role=turn.get("role", "user"), content=turn.get("content", "")))
        messages.append(ChatMessage(role="user", content=audio_transcript))

        ai_start = time.perf_counter()
        ai_resp = await ai_gateway.generate(messages=messages, options=AIOptions(tier="FAST_MODEL"))
        ai_duration_ms = (time.perf_counter() - ai_start) * 1000

        total_duration_ms = (time.perf_counter() - start_time) * 1000

        logger.info(
            f"[Voice Turn] Agent={agent_name} | AI={ai_duration_ms:.1f}ms | Total={total_duration_ms:.1f}ms"
        )

        return {
            "transcript_in": audio_transcript,
            "response_text": ai_resp.text,
            "agent": agent_name,
            "metrics": {
                "ai_latency_ms": round(ai_duration_ms, 2),
                "total_latency_ms": round(total_duration_ms, 2),
                "provider": ai_resp.provider,
                "model": ai_resp.model,
                "tokens": ai_resp.usage.total_tokens
            },
            "timestamp": datetime.now(timezone.utc).isoformat()
        }


voice_pipeline = VoicePipeline()
