# Architecture & System Design: OWAIS OUTREACH AI

OWAIS OUTREACH AI is a high-precision, production-oriented client acquisition platform engineered for **Owais AI**. It integrates autonomous lead discovery, deep website & digital presence research, pain point detection, AI opportunity scoring, anti-hallucinatory personalized cold outreach generation, rate-controlled email queueing, inbound reply classification, and human escalation alerts.

---

## 1. High-Level System Architecture

```
[ Lead Sources ] ──► [ Validator & Normalizer ] ──► [ Deduplicator ] ──► [ Relational DB ]
                                                                                │
                                                                                ▼
[ Public Website / Showcase ] ◄── [ Opportunity Scorer ] ◄── [ Website / Social Analyzer ]
        │                                                                       │
        ▼                                                                       ▼
[ Live AI Demos ]                                                 [ Weighted Lead Scorer (0-100) ]
                                                                                │
                                                                                ▼
[ Global Kill Switch ] ──► [ Compliance Engine ] ◄── [ Gemini Personalization Engine ]
        │                           │
        ▼                           ▼
[ Rate Controller ] ──► [ Outreach Queue Worker ] ──► [ Email Provider (Dry-Run / SMTP) ]
                                                                │
                                                                ▼
[ Escalation Alert ] ◄── [ Gemini Reply Classifier ] ◄── [ Inbound Reply Monitor ]
```

---

## 2. Core Subsystems

### A. Discovery & Research Subsystem (`backend/app/discovery/`, `backend/app/research/`)
- **`LeadSource`**: Pluggable source interface (Curated Benchmarks, Directory Crawlers, CSV/Manual).
- **`LeadValidator`**: Validates business presence, email regex, and required attributes.
- **`LeadNormalizer` & `LeadDeduplicator`**: Normalized domain matching, company name cleaning, and email deduplication.
- **`WebsiteAnalyzer` & `SocialAnalyzer`**: Ethical crawling extracting tech stack, booking tools, live chat widgets, contact forms, FAQs, and verified facts.

### B. Intelligence & Scoring Subsystem (`backend/app/intelligence/`)
- **`PainPointEngine`**: Evidence-grounded rule engine linking observed facts directly to business friction.
- **`OpportunityScorer`**: Evaluates problem severity, business value, feasibility, purchase likelihood, and confidence for tailored offers.
- **`LeadScorer`**: 0–100 composite scoring (Business Fit 20%, Pain Point 20%, AI Opportunity 20%, Ability to Pay 15%, Decision Maker 10%, Online Presence 10%, Confidence 5%).

### C. Personalization & Prompt Engine (`backend/app/ai/`, `prompts/`)
- **`LLMProvider`**: Abstraction supporting Google Gemini with automatic fallback to deterministic Mock provider.
- **`Prompts`**: Modular, versioned Markdown prompts enforcing strict anti-hallucination policies and single CTA rules.
- **`QualityAssessor`**: Pre-queue inspection evaluating word count (60–150 words), spam triggers, and fact grounding.

### D. Outreach Queue & Safety Subsystem (`backend/app/outreach/`, `backend/app/compliance/`)
- **`Global Kill Switch`**: Instant emergency pause halting all sending and automated actions across the platform.
- **`RateController`**: Enforces daily/hourly throughput limits and random jitter delays.
- **`SuppressionManager`**: Triple-check suppression (email, domain, company) preventing unwanted contact.
- **`CountryPolicySystem`**: Jurisdiction-specific compliance for USA, UK, Canada, Australia, NZ, Singapore, UAE, EU.

### E. Inbound Reply & Escalation Subsystem (`backend/app/inbox/`)
- **`ReplyClassifier`**: Intent tagging (`HIGH_VALUE_OPPORTUNITY`, `POSITIVE_INTEREST`, `PRICE_REQUEST`, `STOP`, etc.) and intent scoring (0–100).
- **`ReplyGenerator`**: Drafts consultative responses grounded in business profile and portfolio proof (Oracle AI, Plot Twist, Bright Star).
- **`EscalationManager`**: Triggers immediate alerts (`🚨 OWAIS: HUMAN ACTION REQUIRED`).
