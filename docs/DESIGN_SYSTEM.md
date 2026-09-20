# RINE FORGE SYSTEMS — DESIGN SYSTEM SPECIFICATION (Phase AP)
**Version**: 2.0 (Light-First Evolution)  
**Philosophy**: Apple-level restraint + ChatGPT-level simplicity + Gemini-level AI polish + modern SaaS elegance + human warmth.

---

## 1. Design Token Architecture

The design system eliminates ad-hoc hardcoded colors. All components consume semantic tokens designed for visual clarity, emotional resonance, and high readability.

### 1.1 Canvas & Surfaces (Light-First Primary)

| Token | Hex Value | Usage |
| :--- | :--- | :--- |
| `canvas.light` | `#f8fafc` | Primary background across public marketing views and product overviews |
| `canvas.warm` | `#fafaf9` | Subtle warm tint for editorial and testimonial sections |
| `canvas.subtle` | `#f1f5f9` | Secondary background for alternating bands and nested containers |
| `canvas.dark` | `#0a0f1d` | Dedicated high-contrast surface for technical architecture & code previews |
| `surface.card` | `#ffffff` | Pure white crisp cards, floating modals, and interactive dialogs |
| `surface.border` | `#e2e8f0` | Soft 1px dividers and borders preventing visual clutter |

### 1.2 Ink Typography Hierarchy

| Token | Hex Value | Weight / Scale | Usage |
| :--- | :--- | :--- | :--- |
| `ink.primary` | `#0f172a` | Bold (700) to Black (900) | Hero headlines, section titles, high-emphasis text |
| `ink.secondary`| `#334155` | Medium (500) | Body copy, explainer paragraphs, conversational dialogues |
| `ink.muted` | `#64748b` | Normal (400) | Supporting annotations, timestamps, metadata |
| `ink.subtle` | `#94a3b8` | Normal (400) | Placeholders, inactive tab labels, background lines |
| `ink.inverted`| `#f8fafc` | Semibold (600) | Text on dark surfaces or colored CTA buttons |

### 1.3 Purposeful Accent Palette (Non-Monochrome)

Color communicates hierarchy and status rather than decorative noise:

```text
PRIMARY ACCENT      → Electric / Deep Blue (#2563eb)  — Trust, intelligence, primary actions
SECONDARY ACCENT    → Electric Violet (#7c3aed)       — Specialized AI employees, cognitive processing
INTERACTION ACCENT  → Pure Cyan (#06b6d4)             — Real-time voice signals, live indicators
HUMAN WARMTH ACCENT → Warm Coral / Orange (#ea580c)   — Human handoff, urgency, patient/guest care
SUCCESS ACCENT      → Emerald Green (#10b981)         — Verified facts, booked appointments, CRM sync
WARNING ACCENT      → Amber (#f59e0b)                 — Needs operator review, missing configuration
DANGER ACCENT       → Rose Red (#ef4444)              — Opt-out trigger, blocked call, emergency halt
```

---

## 2. Typography Scale & Editorial Rhythm

1. **HERO**: `text-4xl` to `text-6xl`, tracking tight (`-0.025em`), bold/black. Communicates business value in concrete, human language: *"Give your business an AI employee."*
2. **SECTION TITLE**: `text-2xl` to `text-3xl`, bold, crisp ink. Immediately states what the section proves.
3. **BODY**: `text-sm` to `text-base`, line height relaxed (`leading-relaxed`), medium contrast ink (`#334155`).
4. **MICRO-LABELS**: `text-xs`, font mono or clean sans, sentence case or subtle uppercase. Replaced robotic badges (`TIER_1_DISPATCH`) with clear factual labels (`Receptionist`, `Emergency Dental Intake`).

---

## 3. Visual Rhythm & Composition

The website does NOT use a single relentless dark or light background. It employs visual rhythm:
* **Header / Navbar**: Light glassmorphism with subtle borders and clear navigation.
* **Hero**: Crisp light background with the living `AIEmployeePreview` interface.
* **Interactive Voice Studio**: Soft gradient backdrop focusing attention on the dynamic organic voice orb.
* **Industry Solutions & Cards**: Varied visual geometry (timeline cards, floating chats, interactive phones, real-world metrics).
* **Technical Stack Architecture**: Optional dark accent band emphasizing infrastructure security.
* **Final CTA**: High-energy gradient band.
* **Footer**: Refined dark slate grounded footer.

---

## 4. Physicality & Tactile Micro-Interactions

* **Tactile Cards (`.card-tactile`)**: Smooth GPU-accelerated lift on hover (`translateY(-2px)`) with subtle diffused elevation shadow.
* **Voice Waveform Dynamics**: Multi-bar animated organic waveforms with sinusoidal height interpolation reacting to speech events.
* **Reduced Motion Guarantee**: Complete CSS `@media (prefers-reduced-motion: reduce)` bypass ensuring accessibility for motion-sensitive users.
