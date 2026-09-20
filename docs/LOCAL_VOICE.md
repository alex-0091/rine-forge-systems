# Rine Forge Systems — Local Voice Engine

## 1. Overview

The Rine Forge Local Voice Engine (`backend/app/channels/voice/engine.py`) provides completely local, offline-capable Speech-to-Text (STT) and Text-to-Speech (TTS) capabilities. Businesses can deploy full voice receptionists, automated call screeners, and interactive voice response (IVR) flows without incurring recurring audio API costs from third-party vendors.

---

## 2. Speech-to-Text (STT) Architecture

The `LocalSpeechToTextProvider` handles local audio transcription:
- **Audio Ingestion**: Accepts raw audio bytes, 16-bit PCM, WAV payloads, or base64-encoded audio frames.
- **Preprocessing**: Automatic normalisation, silence detection, and noise-floor calibration.
- **Language Detection**: Defaults to English (`en`) with multi-language tagging.
- **Offline Reliability**: Operates entirely on-host using local acoustic models with sub-second turnaround on standard workstation hardware.

### Sample API Invocation
```python
from app.channels.voice.engine import local_stt_provider

result = await local_stt_provider.transcribe_audio(
    audio_bytes=raw_audio_buffer,
    audio_format="wav",
    language="en"
)
# Returns: {"text": "I'd like to schedule a dental cleaning for next Tuesday.", "confidence": 0.96, "language": "en"}
```

---

## 3. Text-to-Speech (TTS) Architecture & Business Profiles

The `LocalTextToSpeechProvider` generates clean natural speech synthesized according to the business domain and customer interaction tier:

### The 5 Business Voice Profiles

| Profile Name | Tone & Cadence | Pitch & Pacing | Recommended Industry / Usage |
| :--- | :--- | :--- | :--- |
| **`professional`** | Clear, measured, authoritative | Neutral pitch (1.0x), standard pace (1.0x) | Corporate, accounting, legal consultations, B2B reception |
| **`friendly`** | Upbeat, warm, engaging | Slightly elevated pitch (1.05x), brisk pace (1.05x) | Retail, dining, hospitality, general customer support |
| **`warm`** | Empathetic, gentle, reassuring | Soft timbre (0.95x pitch), calm pace (0.95x) | Dental, medical, veterinary, family services |
| **`energetic`** | High-energy, motivating | Elevated pitch (1.10x), dynamic pace (1.15x) | Fitness studios, personal training, sports clubs |
| **`calm`** | Soothing, steady, tranquil | Relaxed pitch (0.90x), deliberate pace (0.90x) | Spas, wellness clinics, meditation centers, grief care |

### Sample API Invocation
```python
from app.channels.voice.engine import local_tts_provider

speech = await local_tts_provider.synthesize_speech(
    text="Thank you for calling Austin Family Smiles. We look forward to seeing you tomorrow at 2 PM.",
    voice_profile="warm"
)
# Returns: {"audio_format": "wav", "audio_base64": "...", "duration_seconds": 3.8, "profile": "warm"}
```

---

## 4. Integration with AI Receptionist & Telephony

The local voice engine is wired directly into the Rine Forge Receptionist agent:
1. **Inbound Call Received**: Incoming telephony packet (e.g. SIP / WebRTC / Twilio webhook) delivers audio streams to `LocalSpeechToTextProvider`.
2. **Intent Analysis & Tool Execution**: AI Gateway extracts caller requirements (e.g. checking appointment availability via `check_appointments`).
3. **Synthesis & Response Delivery**: Response is rendered via `LocalTextToSpeechProvider` using the business's selected voice profile and streamed back with low latency.
