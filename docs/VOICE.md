# Voice Telephony Integration Guide

> **Path**: `/docs/VOICE.md`  
> **Version**: Rine Forge Systems V5  
> **Component**: `backend/app/channels/voice/`

---

## 1. Architecture Overview

The voice pipeline delivers real-time conversational telephony:
```
Phone Call (PSTN / SIP)
  ↓
Twilio / LiveKit Gateway
  ↓ Audio Stream
Speech-To-Text (STT) (Deepgram / Whisper)
  ↓ Transcribed Text
Rine Forge Voice Pipeline (/api/v1/channels/voice/incoming)
  ↓ Fast Tier Prompt
AI Gateway (Elena AI Runtime)
  ↓ Tool Calling (Booking / Hours)
Text-To-Speech (TTS) (ElevenLabs / Polly)
  ↓ Outbound Audio / TwiML
Phone Call
```

---

## 2. Configuration & Secrets

In `backend/.env`:
```env
TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
TWILIO_AUTH_TOKEN="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
TWILIO_PHONE_NUMBER="+15125550100"
LIVEKIT_API_KEY=""
LIVEKIT_API_SECRET=""
```

When unconfigured, `/api/v1/channels/voice/status` truthfully returns:
```json
{
  "status": "NOT_CONFIGURED",
  "provider": null,
  "message": "Voice telephony requires TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.",
  "setup_docs": "/docs/VOICE.md"
}
```

---

## 3. Twilio Webhook Configuration

Set your Twilio Phone Number's Voice Webhook URL to:
```
https://api.yourdomain.com/api/v1/channels/voice/incoming (HTTP POST)
```
TwiML instructions handle automatic voice gathering and conversational turns.
