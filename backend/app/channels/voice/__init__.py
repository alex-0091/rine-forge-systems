"""
Rine Forge Systems - Voice Telephony & Speech Processing Pipeline
Architecture: Phone (Twilio/LiveKit/SIP) -> STT -> AgentRuntime -> Tools -> TTS -> Phone.
"""
from backend.app.channels.voice.pipeline import VoicePipeline, voice_pipeline
from backend.app.channels.voice.service import VoiceService, voice_service

__all__ = ["VoicePipeline", "voice_pipeline", "VoiceService", "voice_service"]
