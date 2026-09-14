# FORGE AI CHARACTER DESIGN SYSTEM & OFFLINE VIDEO PIPELINE SPECIFICATION
**Rine Forge Systems — V4 Enterprise Specification**
**Document Version:** 1.0.0
**Target Hardware:** Consumer/Workstation GPUs (NVIDIA RTX 3090, 4090, A6000, or RunPod / Vast.ai instances)

---

## 1. Executive Overview

This specification establishes the end-to-end visual, acoustic, and kinetic standard for the four flagship **FORGE AI Digital Employees**:
1. **ELENA** — AI Receptionist & Triage Concierge (Teal / Cyan `#14b8a6`)
2. **MARCUS** — AI Sales Representative & Speed-to-Lead Specialist (Violet / Indigo `#8b5cf6`)
3. **ARIA** — AI Customer Support & Grounded Knowledge Care (Sky / Emerald `#0ea5e9`)
4. **KAEL** — AI Operations & Workflow Automation Engineer (Amber / Gold `#f59e0b`)

The entire rendering pipeline is designed to execute **offline using open-source generative models and reproducible node graphs (ComfyUI)**, eliminating proprietary cloud API costs (e.g. HeyGen, Runway, Kling cloud fees) while maintaining strict frame-to-frame and expression-to-expression facial geometry consistency.

---

## 2. Master Character Sheets

### 2.1 Elena — AI Receptionist
- **Demographics & Appearance:** Female, early 30s, warm Mediterranean/Southern European ancestry, sharp hazel eyes, neatly styled espresso brown hair tied in a professional low chignon.
- **Attire:** Tailored graphite blazer over a minimalist teal-lined silk inner collar. Subtle matte noise-cancelling ear-cuff communication unit on the left ear.
- **Vibe:** Approachable, composed, trustworthy, attentive.
- **Lighting:** Warm 4500K key light, subtle cyan edge rim lighting (`#14b8a6`), clean corporate background with soft bokeh depth of field.
- **Voice Profile:** Calm, clear, empathetic cadence (145 WPM), warm conversational tone, zero vocal fry.

### 2.2 Marcus — AI Sales Representative
- **Demographics & Appearance:** Male, mid 30s, distinguished sharp jawline, short trimmed charcoal hair, groomed stubble, intense and engaging amber-brown eyes.
- **Attire:** Modern slim-fit obsidian jacket, open-collar dark indigo linen shirt with discrete violet micro-lapel pin (`#8b5cf6`).
- **Vibe:** Dynamic, highly intelligent, consultative, energetic, charismatic.
- **Lighting:** Dramatic high-contrast 5200K neutral light with rich violet/magenta rim kicker (`#8b5cf6`), modern architectural glass background.
- **Voice Profile:** Confident, persuasive, active listener, rhythmic and decisive (160 WPM).

### 2.3 Aria — AI Customer Support
- **Demographics & Appearance:** Female, late 20s, soft oval facial structure, almond-shaped warm brown eyes, sleek shoulder-length obsidian hair parted neatly on the right.
- **Attire:** Structured dark slate mandarin-collar knitwear with subtle sky-blue seam piping (`#0ea5e9`).
- **Vibe:** Patient, hyper-competent, reassuring, analytical.
- **Lighting:** Soft diffuse 4000K softbox lighting, gentle sky-blue halo rim (`#0ea5e9`), minimalist Scandinavian acoustic wood panel background.
- **Voice Profile:** Patient, gentle, articulate, methodical, reassuringly calm (140 WPM).

### 2.4 Kael — AI Operations Specialist
- **Demographics & Appearance:** Male, early 30s, focused analytical gaze, architectural facial geometry, neatly cropped dark textured fade, slim wireframe matte-black titanium glasses.
- **Attire:** Tech-forward utilitarian charcoal modular vest over a black technical turtleneck with subtle amber stitching accents (`#f59e0b`).
- **Vibe:** Precise, infallible, laser-focused, systematic.
- **Lighting:** Clean 5600K balanced daylight with warm amber rim backlight (`#f59e0b`), server rack / high-tech telemetry screen glow in the background.
- **Voice Profile:** Precise, efficient, low-resonance, matter-of-fact, concise (150 WPM).

---

## 3. The 6 Key Character States & Prompt Templates

All prompts follow the strict Forge Prompt Syntax:
`[Quality Anchors], [Character Name & Demographics], [Attire], [Action / Expression / State], [Camera Angle], [Lighting & Color Palette], [Environment & Background]`

### Positive Quality Anchor (Master Prefix)
`masterpiece, best quality, ultra-detailed 8k resolution, cinematic 35mm photograph, shot on ARRI Alexa Mini, Zeiss Supreme Prime 50mm lens, natural subsurface scattering, realistic skin texture with fine pores, photorealistic, no distortion`

### Negative Prompt (Master Suffix)
`blurry, distorted eyes, extra fingers, deformed hands, cartoon, 3d render, anime, plastic skin, doll, mutated anatomy, unnatural smile, oversaturated, watermark, signature, text, jpeg artifacts`

| State | Elena Template (Teal) | Marcus Template (Violet) | Aria Template (Sky) | Kael Template (Amber) |
|---|---|---|---|---|
| **1. Idle / Neutral** | `Elena, 32yo woman, low chignon, graphite blazer with teal lining, tranquil welcoming neutral expression, direct eye contact with camera, gentle closed-mouth smile, studio key light, cyan rim, soft corporate lobby bokeh` | `Marcus, 35yo man, charcoal hair, trimmed beard, obsidian jacket, calm confident posture, attentive gaze toward viewer, balanced 5200K key light, subtle violet rim, architectural glass blur` | `Aria, 28yo woman, sleek obsidian bob, dark slate knitwear with sky-blue piping, calm empathetic neutral gaze, head slightly tilted in attentiveness, diffuse softbox, sky-blue rim` | `Kael, 32yo man, matte titanium glasses, black technical turtleneck, neutral focused expression, calculating gaze, 5600K daylight key light, warm amber rim, clean server glow` |
| **2. Listening** | `Elena, head tilted 3 degrees to right, eyes slightly widened with focused attention, lips relaxed, listening posture, subtle nod gesture, shallow DOF` | `Marcus, leaning forward slightly toward camera, chin rested slightly on hand or upright, intense focused listening gaze, one eyebrow slightly raised` | `Aria, warm understanding nod, soft empathetic eyes, head tilted forward, open and receptive posture, reassuring attentiveness` | `Kael, eyes focused on digital floating telemetry off-screen then returning to viewer, slight analytical nod, attentive posture` |
| **3. Thinking** | `Elena, gaze drifting slightly upward-left in cognitive retrieval, lips slightly parted in consideration, processing data, soft ambient teal pulse reflection` | `Marcus, contemplative look, hand touching chin, analytical expression evaluating numbers, eyes darting subtly across mental pipeline` | `Aria, brow furrowing softly with care, cross-referencing knowledge, deep empathetic focus, soft blue telemetry reflections in iris` | `Kael, eyes tracking system flowcharts, analytical micro-movements of eyes, slight squint of engineering precision, amber screen reflections` |
| **4. Speaking** | `Elena, speaking naturally, mouth open in mid-syllable, friendly hand open-palm gesture at chest level, warm engaging smile, articulate delivery` | `Marcus, speaking with passion and clarity, dynamic subtle hand gesture explaining value, assertive confident mouth articulation` | `Aria, speaking with soothing reassurance, warm gentle mouth movements, hands resting calmly together, clear articulate enunciations` | `Kael, concise rhythmic speech delivery, precise mouth articulation, crisp decisive head orientation, explaining architectural diagram` |
| **5. Success / Confirm** | `Elena, radiant confident smile, graceful affirmative head nod, thumbs up or ok gesture, sparkling eyes, teal particle confirmation glow` | `Marcus, victorious confident smile, firm handshake gesture toward camera or celebratory affirmative nod, closing the deal aura` | `Aria, wide reassuring smile of relief and satisfaction, warm eye crinkle, thumbs up or hands clasped in accomplished resolution` | `Kael, satisfied subtle smirk, decisive crisp head nod, fingers tapping complete on virtual terminal, green/amber sync verification wave` |
| **6. Escalation / Alert** | `Elena, concerned empathetic expression, head tilted, hand gesturing towards direct phone transfer, reassuring user that human team is notified` | `Marcus, urgent attentive stance, picking up smartphone or dispatching VIP alert to executive calendar, focused problem-solving mode` | `Aria, deeply empathetic furrowed brow, hands held open in sincere care, calming presence while summoning senior supervisor` | `Kael, vigilant diagnostic posture, examining error alert log with urgency, initiating automated failover protocol, alert amber pulse` |

---

## 4. ComfyUI Video Generation Workflow Architecture

The offline rendering pipeline uses a multi-stage node graph in ComfyUI:

```
[Character Reference Sheet (3-View High Res)]
            │
            ▼
    [IP-Adapter Plus Face] ───┐
            │                 │ (Maintains exact facial ID)
            ▼                 ▼
[Prompt + Latent] ───► [Wan 2.1 / HunyuanVideo Base Model]
                             │
                             ▼
                    [ControlNet OpenPose] (Rigged gesture & head motion)
                             │
                             ▼
                    [AnimateDiff / Wan Motion Latent]
                             │
                             ▼
                    [LivePortrait Lip-Sync & Audio Alignment] ◄── [TTS Audio (Edge-TTS / XTTS-v2)]
                             │
                             ▼
                    [Face Detailer / CodeFormer / GFPGAN]
                             │
                             ▼
                    [Compact / RealESRGAN 4x Upscaler]
                             │
                             ▼
                    [H.264 Web-Optimized MP4 Export (CRF 22, 24fps)]
```

### Node Configuration Details
1. **Model Backbone:**
   - **Primary Recommendation:** `Wan2.1-T2V-14B` (Alibaba Wan 2.1) or `HunyuanVideo-720p`.
   - **Lightweight Alternative (VRAM < 16GB):** `Wan2.1-I2V-14B` (FP8 quantized) or `CogVideoX-5B-I2V`.
2. **Facial ID Lock:**
   - **IP-Adapter-FaceID-PlusV2** with SDXL checkpoint or Wan2.1 LoRA adapter.
   - Weight: `0.85`, End Step: `0.90` (preserves 100% facial similarity across generations).
3. **Motion Guidance:**
   - Pre-recorded pose skeleton MP4s fed through `DWPose / OpenPose` preprocessor.
   - Smooth gesture interpolation without limb flickering.
4. **Lip Sync & Expressions:**
   - **LivePortrait (Kuaishou)** ComfyUI extension.
   - Takes base video clip + reference audio track (WAV 48kHz).
   - Generates photorealistic lip movement, eye blinks, and micro-expressions synchronized to phonemes.
5. **Post-Processing & Super-Resolution:**
   - `ComfyUI-Impact-Pack` Face Detailer with `face_yolov8n.pt`.
   - Upscale with `4x_NMKD-Superscale-SP_178000_G.pth` or `4x-UltraSharp`.

---

## 5. Hardware Specifications & Performance Benchmarks

| Hardware Setup | Model Selected | Resolution & FPS | Clip Length | Generation Time |
|---|---|---|---|---|
| **NVIDIA RTX 4090 (24GB VRAM)** | Wan2.1 14B FP8 + LivePortrait | 1080p @ 24fps | 5 seconds (120 frames) | ~2.5 minutes |
| **NVIDIA RTX 3090 (24GB VRAM)** | HunyuanVideo FP8 + LivePortrait | 720p @ 24fps | 5 seconds (120 frames) | ~3.8 minutes |
| **NVIDIA RTX 4080 (16GB VRAM)** | CogVideoX-5B + LivePortrait | 720p @ 24fps | 4 seconds (96 frames) | ~2.0 minutes |
| **RunPod Cloud (1x A100 80GB)** | Wan2.1 14B BF16 + UltraSharp | 1080p @ 30fps | 10 seconds (300 frames) | ~1.8 minutes |

---

## 6. Audio Design & Voice Synthesis Standards

To accompany video clips and live interactions, all character speech must adhere to the audio profile:

1. **TTS Engine:**
   - `Edge-TTS` (Zero-cost, multi-language, high naturalness)
   - `XTTS-v2` (Local voice cloning using master WAV samples)
2. **Character Voice Mappings:**
   - **Elena:** `en-US-JennyMultilingualNeural` or `en-US-AriaNeural` (Pitch: +0Hz, Rate: +2%)
   - **Marcus:** `en-US-ChristopherNeural` or `en-US-GuyNeural` (Pitch: -2Hz, Rate: +4%)
   - **Aria:** `en-US-AvaNeural` or `en-US-SaraNeural` (Pitch: +0Hz, Rate: -2%)
   - **Kael:** `en-US-BrianNeural` or `en-GB-RyanNeural` (Pitch: -3Hz, Rate: +0%)
3. **Web Playback Guidelines:**
   - Default state: **Muted**.
   - User gesture required to unmute.
   - Codec: AAC / Opus @ 128kbps, normalized to -16 LUFS integrated loudness.
