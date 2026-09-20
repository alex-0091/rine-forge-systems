# Rine Forge Systems — Final Product Features

**Document Version:** 1.0.0  
**Date:** September 19, 2026  
**Status:** Authoritative Release Features Specification  
**Architecture:** Single Canonical Local-First Enterprise Backbone  

---

## 1. System Overview & Philosophy

Rine Forge Systems is an autonomous **AI Business Operating System** engineered specifically for small and medium businesses (SMBs). Rather than presenting operators with a bewildering array of chatbots and raw LLM parameters, Rine Forge provides a single unified natural-language interface ("Tell Forge what you need") that autonomously plans, selects specialized agents, accesses verified business knowledge, triggers controlled tools, verifies deliverables in sandboxes, and presents completed artifacts.

The entire platform operates on a **Free-First & Local-First Strategy**, executing on host hardware via **Ollama** and lightweight open models (e.g. LLaMA 3, Phi-3, Qwen 2.5), using cloud APIs only as optional external bridges when explicitly configured.

---

## 2. Comprehensive Feature Inventory by Subsystem

### 2.1 Forge Intelligence Fabric (`backend/app/ai/fabric/`)
- **Universal "Tell Forge" Interface:** Natural language command orchestration across all business domains.
- **13-Stage Cognitive Pipeline:**
  1. *Classification:* Maps requests into 25 canonical task categories (`WEBSITE_BUILD`, `FINANCIAL_ANALYSIS`, `CUSTOMER_RESPONSE`, `BRAND_DESIGN`, etc.).
  2. *Intent Determination:* Extracts structured goals, target businesses, output modalities, and side-effect profiles.
  3. *Complexity Grading:* Assigns `TRIVIAL`, `STANDARD`, `COMPLEX`, or `CRITICAL` execution levels.
  4. *Execution Planning:* Generates deterministic multi-step action plans with dependency sequencing.
  5. *Agent Resolution:* Matches tasks to one of 21 domain-specialized agents.
  6. *Model Routing:* Selects optimal parameter size (e.g. 3B fast, 8B standard, 14B deep) matching detected hardware tier.
  7. *Tool Permission Verification:* Checks each required tool against tenant access policies (`ALLOW`, `DENY`, `REQUIRES_APPROVAL`).
  8. *Knowledge Routing:* Queries tenant profile, uploaded RAG chunks, and CRM records.
  9. *Context Construction:* Assembles prompts with strict epistemic segregation (`AUTHORITATIVE_FACTS` vs `AI_INFERENCE_ALLOWANCE`).
  10. *Execution Loop:* Invokes specialized agents with error trapping.
  11. *Multi-Model Critic & Verification:* Inspects output against 9 strict validation rules (syntax, arithmetic, required tags).
  12. *Automated Self-Repair:* Captures validation failures and executes targeted repairs (up to 2 repair cycles).
  13. *Deliverable & Memory Persistence:* Creates versioned artifacts and persists epistemological facts.

### 2.2 Forge AI Gateway & Model Router (`backend/app/ai/gateway/` & `backend/app/workbench/model_hub.py`)
- **Single Canonical Gateway:** `rine_ai_gateway.run()` unified dispatching.
- **Dynamic Task Routing:** 19 task routes (`CHAT`, `EXTRACTION`, `VOICE`, `CODING`, `FINANCIAL`, `REASONING`, etc.).
- **Hardware-Aware Tier Routing:**
  - *Tier 1 (Low Resource <8GB RAM):* Routes to 1B–3B models (`phi3:mini`, `qwen2:1.5b`).
  - *Tier 2 (Consumer 8–16GB RAM):* Routes to 7B–8B models (`llama3:8b`, `mistral:7b`).
  - *Tier 3 (Workstation 16–32GB RAM):* Routes to 8B–14B models (`llama3.1:8b`, `qwen2.5:14b`).
  - *Tier 4 (Server-Class >32GB RAM):* Routes to 32B–70B models with extended context.
- **Local Ollama Native Client:** Direct async HTTP communication with Ollama daemon (`/api/chat`, `/api/tags`, `/api/pull`).
- **Graceful Cloud Fallback:** Transparent failover to configured cloud providers with explicit telemetry.

### 2.3 Specialized Agent Ecosystem (`backend/app/workbench/agents/` & `agent_registry.py`)
- **21 Registered Agents:**
  1. `GeneralIntelligenceAgent`: Broad business inquiries and synthesis.
  2. `CustomerResponseAgent`: Omnichannel inquiry handling with business knowledge grounding.
  3. `CustomerSupportAgent`: Technical triage and customer dispute resolution.
  4. `SalesAgent`: Value proposition presentation and commercial outreach.
  5. `LeadQualificationAgent`: B2B ICP scoring and lead factor evaluation.
  6. `WebsiteBuilderAgent`: Responsive multi-section HTML/CSS/JS site generation.
  7. `WebsiteAuditAgent`: Factual conversion, SEO, mobile, and accessibility auditing.
  8. `CodingAgent`: Python and JavaScript automation script generation.
  9. `ResearchAgent`: Market, sector, and industry intelligence synthesis.
  10. `VisionAgent`: Image and document screenshot interpretation.
  11. `VoiceResponseAgent`: Conversational voice turn processing.
  12. `BusinessPlanAgent`: 8-section structured business plan generation.
  13. `MarketingAgent`: Multichannel acquisition campaign strategies.
  14. `FinancialModelAgent`: 100% deterministic cash flow and break-even calculations.
  15. `SeoAgent`: Metadata, schema markup, and keyword strategy synthesis.
  16. `CompetitorAnalysisAgent`: Comparative business positioning and differentiation matrices.
  17. `DocumentAgent`: Executive summaries and business reports.
  18. `AutomationAgent`: Multi-step event-driven workflow synthesis.
  19. `AiEmployeeGeneratorAgent`: Autonomous creation of specialized digital staff.
  20. `VoiceEmployeeGeneratorAgent`: Voice agent personality, speech, and tool definition.
  21. `BrandGeneratorAgent`: Parametric SVG vector logos and accessible color palettes.

### 2.4 Authoritative Tool System (`backend/app/ai/fabric/tool_registry.py`)
- **18 Governed Tools:**
  - `searchKnowledge`: Read-only hybrid search over tenant documents.
  - `queryCRM`: Read-only CRM contact and opportunity retrieval.
  - `lookupPricing`: Deterministic service menu and fee schedule check.
  - `checkAvailability`: Calendar slot lookup.
  - `calculateFinance`: Pure Python math calculation (zero LLM arithmetic).
  - `validateHTML`: AST parsing and viewport verification.
  - `runSandboxBuild`: Cleanroom website preview generation.
  - `fetchWebsite`: Network request for public site analysis.
  - `createArtifact`: Deliverable registration in project repository.
  - `createVoiceSession`: Live audio turn state initialization.
  - `createAppointment`: Calendar reservation (gated by confirmation).
  - `updateCRM`: Customer record update (gated by confirmation).
  - `sendEmail`: Outbound email transmission (gated by approval).
  - `sendWhatsApp`: Outbound WhatsApp messaging (gated by approval).
  - `publishWebsite`: Production site deployment (gated by approval).
  - `executeScript`: Code sandbox run (restricted to non-destructive tasks).
  - `triggerWebhook`: External automation hook call.
  - `requestHumanHandoff`: Escalates active conversation to human staff.

### 2.5 Verification & Self-Repair Engine (`backend/app/ai/fabric/verifier.py`)
- **9 Automated Quality & Fact Checks:**
  1. *Code Syntax / AST Check:* Validates HTML tags, doctype, and balanced elements.
  2. *Mobile Viewport Enforcement:* Guarantees `<meta name="viewport" ...>` presence.
  3. *SVG Vector Validation:* Ensures valid `<svg>` tag closure and XML namespaces.
  4. *Deterministic Math Check:* Confirms Revenue − COGS == Gross Profit; Net Margin == Net Profit / Revenue.
  5. *Negative Metric Guard:* Rejects impossible metrics (e.g. negative churn rates or >100% margin).
  6. *Fact-Checking Guardrail:* Flags unverified claims lacking source citations.
  7. *Sensitive Information Redaction:* Masks credit card numbers, passwords, and private tokens.
  8. *Consequential Policy Check:* Ensures outbound mutations cannot execute without confirmation.
  9. *Truthful Disclosure Check:* Explicitly confirms that unmeasured metrics are labeled "UNMEASURED".
- **Automated Self-Repair:** Autonomously recalculates hallucinated math or inserts missing viewport meta tags without user intervention.

### 2.6 Usable Artifact Engine (`backend/app/ai/fabric/artifact_engine.py`)
- **16 Supported Deliverable Types:**
  - `CODE`, `DOCUMENT`, `SPREADSHEET`, `IMAGE`, `REPORT`, `PRESENTATION`, `WEBSITE`, `LOGO`, `BRAND_IDENTITY`, `BUSINESS_PLAN`, `FINANCIAL_MODEL`, `MARKETING_CAMPAIGN`, `VOICE_AGENT`, `AI_AGENT`, `AUTOMATION_WORKFLOW`, `DATASET`.
- **Tenant Isolation:** Multi-tenant workspace storage partitioned by `workspace_id`.
- **Dual-Key Normalization:** Supports both `art["type"]` and `art["artifact_type"]` across all APIs.
- **Export & Versioning:** Tracks generation metadata, model used, and timestamps.

### 2.7 Epistemological Memory Management (`backend/app/ai/fabric/project_memory.py`)
- **Strict Epistemological Provenance:**
  - `USER_PROVIDED`: Explicit facts entered by the business owner.
  - `VERIFIED`: Confirmed by authoritative database or document lookup.
  - `AI_GENERATED`: Synthesized by agent workflows.
  - `AI_INFERRED`: Surmised context requiring human confirmation.
  - `APPROVED`: Explicitly accepted by the operator.
- **Operator Privacy Controls:** Ability for business owners to inspect all stored keys, edit incorrect values, or delete sensitive facts.

### 2.8 Omnichannel Customer Response Engine (`backend/app/channels/`)
- **Supported Channels:**
  - *Web Chat:* Real-time browser messaging with appointment booking and pricing lookup.
  - *Voice:* Browser Web Speech API, local Whisper STT, local Piper TTS, and Twilio PSTN.
  - *WhatsApp:* Official Meta Cloud API webhook listener with signature verification and auto-reply.
  - *Email:* Inbound email parsing, customer association, and draft response generation.
- **Strict Hallucination Prevention:** The response agent refuses to invent pricing, opening hours, or appointment availability if not present in verified business knowledge.
- **Graceful Human Handoff:** Automatically transfers conversations to human staff upon customer request or when confidence thresholds drop.

### 2.9 Compliant Lead Engine (`backend/app/lead_engine/`)
- **B2B ICP Matching:** Strict qualification against business categories and geographic regions.
- **Compliant Sourcing:** Authorized directories, customer-uploaded lists, and inbound inquiries. Zero private data scraping or CAPTCHA evasion.
- **Multi-Factor Lead Scoring:** Evaluates digital presence, business responsiveness, and fit.
- **Automated Outreach Drafts:** Generates tailored, non-spam outreach templates held in the Human Approval Center.

### 2.10 Central Human Approval Center (`backend/app/ai/fabric/approval_gate.py`)
- **Consequential Action Interception:** Any external side effect (sending an email, dispatching WhatsApp, booking a slot, publishing a site) is paused in `APPROVAL_PENDING` status.
- **Action Transparency:** Displays target recipient, exact payload, reason, and impact.
- **Operator Control:** One-click Approve, Reject, or Edit actions.

### 2.11 Resource & Cost Governor (`backend/app/ai/fabric/resource_governor.py`)
- **Host Concurrency Caps:** Prevents server freezing by limiting concurrent model inference jobs.
- **Host RAM Monitoring:** Probes physical system memory via native Windows/Linux kernel calls (`GlobalMemoryStatusEx` / `/proc/meminfo`); throttles generation if available RAM drops below 1.5GB.
- **Token & Timeout Budgets:** Enforces 30s timeout per agent step and strict context limits.
