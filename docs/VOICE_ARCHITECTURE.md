# VOICE ENGINE ARCHITECTURE SPECIFICATION (Phase AP)
**Platform Version**: Rine Forge Systems V5  
**Subsystem**: Real Voice Engine & Telephony Coordinator  

---

## 1. Architectural Overview

The **Rine Forge Voice Engine** establishes a provider-independent conversational pipeline that connects live audio streams (browser Web Speech, WebRTC, or PSTN telephony) to the central multi-tenant AI Gateway, knowledge base, and business tools:

```
Browser Microphone / Caller Phone
                ↓
    Voice Session Coordinator
                ↓
   Speech-To-Text (STT) Adapter
  [Browser Web Speech / Whisper]
                ↓
           AI Agent
      [Elena Receptionist]
                ↓
   Knowledge Base & Safe Tools
  [Hours / Services / Slots / Lead]
                ↓
     Grounded Agent Response
                ↓
   Text-To-Speech (TTS) Adapter
 [Browser Neural / ElevenLabs]
                ↓
    Caller Speaker / Earpiece
```

---

## 2. Real-Time Session Lifecycle

Voice interactions are managed through the `V5VoiceSession` relational model across 7 distinct states:

| State | Definition | Visual / UI Telemetry |
| :--- | :--- | :--- |
| `CONNECTING` | Session handshake and audio stream initialization | Soft pulsing orb |
| `LISTENING` | Actively recording and transcribing user speech | Expanding waveform / audio reactive |
| `THINKING` | Querying AI Gateway, checking knowledge base, executing tools | Intelligent orbiting motion |
| `SPEAKING` | Synthesizing and streaming response audio | Dynamic multi-bar audio wave synced to speech |
| `TRANSFER_REQUIRED` | Caller requested human or expressed critical emergency | Amber alert / handoff card |
| `ENDED` | Call concluded; duration and transcript committed to CRM | Summary card with lead status |
| `ERROR` | Audio device or network error | Human-friendly recovery prompt |

---

## 3. Provider Abstraction Layer

The engine avoids hardcoded vendor dependencies through clean abstract interfaces:
* **`SpeechToTextProvider`**: `transcribe(audio_payload)`
* **`TextToSpeechProvider`**: `synthesize(text, voice_id)`
* **`VoiceTransportProvider`**: `get_status()`

### Built-in Provider Adapters:
1. **`BrowserWebSpeechProvider`**: Zero-cost, zero-latency native browser speech recognition and synthesis. Always available.
2. **`WhisperSTTProvider`**: Cloud/OpenAI-compatible Whisper neural transcription. Truthfully reports `NOT CONFIGURED` unless `OPENAI_API_KEY` is present.
3. **`ElevenLabsTTSProvider`**: Studio-quality voice cloning. Truthfully reports `NOT CONFIGURED` unless `ELEVENLABS_API_KEY` is set.
4. **`TwilioVoiceTransport`**: PSTN telephony gateway. Truthfully reports `NOT CONFIGURED` unless `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN` exist.

---

## 4. Grounded Tool Execution Through Voice

During conversational turns, the AI agent triggers real business tools:
* **`get_business_hours`**: Verifies exact operating schedule from the business profile or suite knowledge base.
* **`get_services`**: Checks approved service catalog and pricing boundaries (never invents procedures).
* **`check_and_reserve_slot`**: Queries appointment availability and locks a tentative consultation slot.
* **`capture_lead`**: Automatically creates or links a `V5SocialLead` or `V5Prospect` with priority scoring.

---

## 5. Truthful Human Handoff Guarantee

When a caller requests a human or expresses emergency intent:
* The system checks whether live PSTN call transfer is configured.
* If configured: triggers real TwiML `<Dial>` transfer to the operator.
* If unconfigured: truthfully informs the caller:
  *"Our direct phone transfer line is currently in offline queue mode, so I have notified our on-call staff immediately to reach out to you directly."*
* Creates an urgent `V5SalesTask` in the CRM for staff follow-up. Zero fake transfer simulations.

---

## 6. Factual Voice Analytics (`/dashboard/voice`)

The `/api/v1/channels/voice/analytics` endpoint returns pure facts:
* Total call volume
* Completed vs. failed calls
* Average duration in seconds
* Successful human handoffs
* Leads and appointments generated
* Recent session transcripts and latencies
