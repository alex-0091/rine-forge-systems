# Rine Forge Systems — Final Configuration Guide

**Document Version:** 1.0.0  
**Release Target:** Rine Forge V5 Enterprise Production  
**Date:** September 19, 2026  
**Auditor:** Operations & Deployment Engineering Team  

---

## 1. Quick Start: Zero-Cost Local-First Setup

Rine Forge Systems requires **zero paid subscriptions or cloud API keys** to run all core capabilities (intelligence fabric, website builder, website auditor, financial modeling, CRM, lead engine, brand generator, in-browser voice, and local simulation lab).

### Step 1: Install & Launch Ollama
1. Download Ollama from [https://ollama.com/download](https://ollama.com/download) for your operating system (Windows, macOS, or Linux).
2. Start the Ollama background daemon:
   ```bash
   ollama serve
   ```
3. Pull the recommended local models:
   ```bash
   # Tier 1 (Lightweight / fast path)
   ollama pull phi3:mini

   # Tier 2 (Standard business intelligence)
   ollama pull llama3:8b
   ```

### Step 2: Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure the default Ollama base URL is configured:
```env
OLLAMA_BASE_URL=http://localhost:11434
ENVIRONMENT=production
DATABASE_URL=sqlite+aiosqlite:///./data/rine_forge_v5.db
SECRET_KEY=your_secure_random_jwt_secret_key_here
```

### Step 3: Run Database Migrations & Start Backend
```bash
# Activate Python Virtual Environment
.\venv\Scripts\activate  # Windows
source ./venv/bin/activate  # Linux/macOS

# Start FastAPI Uvicorn Server
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Step 4: Launch Frontend Interface
```bash
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:5173` to access the Rine Forge Console.

---

## 2. Optional External Integration Configuration

For businesses requiring external PSTN telephony, WhatsApp customer replies, or cloud voice synthesis, configure the following environment variables:

### 2.1 Twilio Telephony (Live PSTN Calling)
To enable real telephone calls through the Voice Engine:
```env
TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=+15125550199
```
*Status without keys:* Voice engine gracefully defaults to **Browser Web Speech** and **Local Whisper/Piper** with full conversational turn support.

### 2.2 Meta WhatsApp Cloud API (Omnichannel Messaging)
To enable live customer messaging via official WhatsApp Business API:
```env
META_APP_SECRET=your_meta_app_secret_here
META_PHONE_NUMBER_ID=your_meta_phone_number_id_here
META_ACCESS_TOKEN=your_meta_system_user_permanent_token_here
META_VERIFY_TOKEN=your_custom_webhook_verify_token
```
*Webhook URL to register in Meta Developer Portal:*  
`https://yourdomain.com/api/v1/channels/whatsapp/webhook`

### 2.3 ElevenLabs (High-Fidelity Cloud Voice Synthesis)
To activate ultra-realistic neural TTS voices:
```env
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
ELEVENLABS_DEFAULT_VOICE_ID=21m00Tcm4TlvDq8ikWAM  # Rachel (default)
```
*Status without keys:* Voice engine uses client-side native voices or local Piper speech synthesis.

### 2.4 SendGrid / SMTP (Outbound Email Transmission)
To enable live email dispatch for approved outreach drafts:
```env
SENDGRID_API_KEY=SG.your_sendgrid_api_key_here
OUTREACH_FROM_EMAIL=team@yourbusiness.com
```

### 2.5 Optional Cloud AI Adapters (OpenAI / Claude / Gemini)
If your organization prefers cloud fallback models for Tier 4 reasoning:
```env
OPENAI_API_KEY=sk-proj-your_openai_key_here
ANTHROPIC_API_KEY=sk-ant-your_anthropic_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 3. Operational Verification Checklist

Before opening Rine Forge to live operators, verify the following:
- [x] Backend responds to `GET /health` with HTTP 200.
- [x] Hardware profiler reports host RAM and CPU at `GET /api/v1/workbench/hardware`.
- [x] Local Ollama status is reported as `AVAILABLE`.
- [x] At least one local model (`phi3:mini` or `llama3:8b`) is pulled and detected.
- [x] Frontend builds cleanly with zero errors (`npm run build`).
- [x] Consequential actions are confirmed to hold in the Human Approval Center.
