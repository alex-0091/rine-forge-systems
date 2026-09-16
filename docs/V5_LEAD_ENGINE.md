# RINE FORGE SYSTEMS — V5 LEAD GENERATION & DISCOVERY ENGINE ARCHITECTURE (MODULES 41-56)

This document specifies the architecture, compliance safeguards, data models, provider abstractions, and REST API contracts for the **Rine Forge Systems V5 AI Lead Generation & Discovery Engine**.

---

## 1. Executive Summary & Core Directives

The V5 Lead Generation Engine turns Rine Forge into an autonomous, multi-tenant B2B customer discovery platform. It identifies legitimate public buying signals, extracts verifiable digital footprints with zero hallucination, scores commercial opportunities, enforces review mode by default, and manages outbound sequencing and inbound intent classification with strict compliance guardrails.

### Non-Negotiable Compliance Guardrails:
1. **Zero Unauthorized Scraping**:
   - Private personal social accounts and personal feeds are never scraped.
   - Any social platform source without an official API is strictly marked: `NOT AVAILABLE THROUGH OFFICIAL API`.
2. **Anti-Health Inference Guard**:
   - The engine strictly rejects inferring health conditions or treating an individual as a lead if a post or mention only expresses personal pain, distress, or symptoms without an explicit commercial search for professional services.
3. **Review Mode by Default**:
   - All tenant client accounts default to `HUMAN_REVIEW` before outbound dispatch.
   - Automated mode requires an explicit transition condition: **>50 human-reviewed messages with >90% approval rate**.
4. **Suppression & Do-Not-Contact Enforcement**:
   - Checked dynamically before every outbound dispatch.
   - Any inbound signal containing `STOP`, `UNSUBSCRIBE`, `REMOVE`, or `DO NOT CONTACT` immediately halts sequences and registers the contact on the multi-tenant suppression blacklist.
5. **Deliverability Watchdog & Circuit Breakers**:
   - Automatically pauses outbound campaigns if the bounce rate exceeds 2% or spam/opt-out rate exceeds 1%.

---

## 2. The 13-Stage Discovery Pipeline

```text
[1. QUERY & SOURCE SELECTION]
       │
       ▼
[2. DATA EXTRACTION & CITATIONS] (10 Supported Provider Types)
       │
       ▼
[3. NORMALIZATION] (Standardized B2B prospect records)
       │
       ▼
[4. DEDUPLICATION & MERGE] (Domain, Email, Phone, Name+City hash)
       │
       ▼
[5. COMPLIANCE & SUPPRESSION GATES] (Anti-Health, Blacklists)
       │
       ▼
[6. GROUNDED WEBSITE INSPECTION] (Booking system, chat widget, CMS, speed)
       │
       ▼
[7. INTENT & FIT EVALUATION] (Commercial signal vs. personal distress)
       │
       ▼
[8. AUTOMATION OPPORTUNITY ANALYSIS] (AI Receptionist, Speed-to-Lead, etc.)
       │
       ▼
[9. MULTI-FACTOR SCORING] (Intent, Relevance, Recency, Geo, Engagement)
       │
       ▼
[10. TENANT CRM INGESTION] (Multi-tenant isolation)
       │
       ▼
[11. EVIDENCE-GROUNDED OUTREACH DRAFTING] (Step 0, 1, 2 personalized drafts)
       │
       ▼
[12. HUMAN REVIEW & APPROVAL GATEWAY] (Human-in-the-loop review bar)
       │
       ▼
[13. DISPATCH & CONVERSION TELEMETRY] (RFC 2822, Pixel, In-Reply-To sequence)
```

---

## 3. Supported Lead Source Providers (Module 42)

| Provider | Type | Status | Safeguard / Mode |
| :--- | :--- | :--- | :--- |
| `WebsiteFormsProvider` | Inbound | `ACTIVE` | Official tenant website form webhook |
| `InboundChatProvider` | Inbound | `ACTIVE` | Rine Forge live widget conversations |
| `CRMProvider` | Integration | `AVAILABLE` | HubSpot, Salesforce, GoHighLevel API |
| `EmailSourceProvider` | Inbound | `ACTIVE` | Official inbound email inbox parsing |
| `ReferralProvider` | User | `AVAILABLE` | Customer referral & partner networks |
| `PublicBusinessDataProvider` | Discovery | `ACTIVE` | Public directories (Google Places, Chamber of Commerce, YellowPages) |
| `AuthorizedLeadAPIsProvider` | API | `CONFIGURED` | Licensed commercial B2B data providers (ZoomInfo, Apollo API) |
| `AdPlatformsProvider` | Paid | `WEBHOOK_READY` | Facebook & Google Lead Ads webhooks |
| `SocialPlatformAPIsProvider` | Restricted | `RESTRICTED` | Strictly marked `NOT AVAILABLE THROUGH OFFICIAL API` (No unauthorized scraping) |
| `UserProvidedLeadsProvider` | Import | `ACTIVE` | CSV / JSON manual business uploads |

---

## 4. Grounded Website Analysis & Zero Hallucination (Module 44)

The `WebsiteAnalysisService` inspects target domains and extracts verifiable facts with explicit citations:
- **Booking Infrastructure**: Detects online scheduling widgets (`Calendly`, `Acuity`, `OpenTable`, `Zocdoc`, etc.). If missing, flags manual contact form friction.
- **Live Communication**: Detects real-time chat widgets (`Intercom`, `Drift`, `Tidio`, `Zendesk`, `LiveChat`). If absent, records absence factually.
- **Technology Stack & CMS**: Detects WordPress, Shopify, Webflow, Squarespace, Wix, Next.js.
- **Verified Direct Contacts**: Discovers official public business email and telephone numbers.
- **Site Quality**: Confirms SSL certificate validity and response latency.

---

## 5. Tailored AI Automation Opportunities (Module 45)

Based strictly on extracted facts, the `OpportunityAnalyzer` derives high-impact automation angles:
1. `AI_RECEPTIONIST`: Identified when a business lacks instant live chat and relies on static contact forms or manual phone lines.
2. `APPOINTMENT_AUTOMATION`: Identified when a clinic or service firm has no online booking calendar, requiring staff phone coordination.
3. `SPEED_TO_LEAD`: Identified when inquiry response times are estimated at 24-48 hours.
4. `WHATSAPP_EMPLOYEE`: Identified for international or local service businesses that receive WhatsApp inquiries after standard office hours.
5. `AFTER_HOURS_COVERAGE`: Identified when business operating hours leave evenings and weekends unassisted.
6. `OMNICHANNEL_SYNC`: Identified when inquiries across web, email, and phone are disconnected from CRM records.

---

## 6. Multi-Factor Lead Scoring Formula (Module 47)

Every prospect is evaluated using a composite weighted formula:

$$\text{Total Score} = \text{Intent}(35\%) + \text{Relevance}(20\%) + \text{Recency}(15\%) + \text{GeoFit}(15\%) + \text{Engagement}(10\%) + \text{Consent}(5\%)$$

- **Tier 1 (Priority Outreach)**: Score $\ge 85$
- **Tier 2 (Qualified)**: Score $70 - 84$
- **Tier 3 (Standard / Nurture)**: Score $< 70$

---

## 7. Compliance & Review Mode Engine (Modules 49, 50, 52)

### Pre-Flight Compliance Gates:
Before any outreach is dispatched, the `OutreachEngineV5` validates 4 critical rules:
1. **Suppression Blacklist Gate**: Returns `Blocked` if email or domain exists in `V5SuppressionEntry`.
2. **Verified Contact Gate**: Rejects outreach if no valid email or phone number is available.
3. **Anti-Health Guard**: Verifies no medical inferences or sensitive personal attributes are targeted.
4. **Frequency & Rate Limits**:
   - Enforces a minimum **72-hour cooldown** between sequence steps.
   - Enforces maximum **3 sequence steps** (Initial, Follow-Up, Breakup/Archive).
   - Enforces daily throughput ceilings: **50 emails/day**, **30 WhatsApp messages/day** per tenant.

### Review Mode Workflow:
- New prospects with generated outreach enter the `REVIEW` stage with status `PENDING_REVIEW`.
- Operators can:
  - **Approve & Send**: Dispatches immediately through the production provider.
  - **Edit Message**: Allows custom modifications to subject and body text with instant saving.
  - **Disqualify**: Removes prospect from active pipeline.
  - **Suppress**: Immediately blacklists email and domain across the tenant.

---

## 8. Inbound Reply Classification & Follow-Up Sequences (Modules 54, 55)

When a prospect replies to outreach, the `ReplyIntelligenceService` classifies the message into 5 distinct intents:

1. `OPTOUT_HOSTILE` (e.g. *"Unsubscribe", "Stop emailing me", "Remove"*)
   - Action: **Zero automated reply**. Immediately adds to suppression blacklist and halts all sequences.
2. `POSITIVE_INTERESTED` (e.g. *"Yes, send me the details", "Can we see a demo Friday?"*)
   - Action: Advances stage to `INTERESTED` / `APPOINTMENT`. Notifies operator and schedules calendar link.
3. `QUESTION_OBJECTION` (e.g. *"How much does this cost?", "Does this integrate with Dentrix?"*)
   - Action: Generates grounded objection response addressing specific question for human review.
4. `WRONG_PERSON_REFERRAL` (e.g. *"You should speak with our Practice Manager Sarah"*)
   - Action: Extracts referral name and contact info; queues new prospect record.
5. `NOT_INTERESTED_BAD_TIMING` (e.g. *"Not interested right now, check back in Q4"*)
   - Action: Sets follow-up snooze date or archives gracefully.

---

## 9. REST API Specification

### Prospects & Import
- `GET /api/v1/prospects` — List prospects with stage, score, and contact filters.
- `GET /api/v1/prospects/{id}` — Full dossier including observations, opportunities, and outreach history.
- `POST /api/v1/prospects` — Manually create single B2B prospect.
- `POST /api/v1/prospects/import` — Bulk import prospects from CSV or JSON.
- `PATCH /api/v1/prospects/{id}` — Update stage, notes, or review status.
- `DELETE /api/v1/prospects/{id}` — Disqualify and archive prospect.

### Discovery Pipeline & Inspection
- `POST /api/v1/discovery/search` — Trigger 13-stage autonomous discovery pipeline.
- `GET /api/v1/discovery/searches` — List past discovery run history.
- `POST /api/v1/discovery/analyze-url` — Real-time website footprint extraction and opportunity analyzer.
- `GET /api/v1/discovery/sources` — List 10 lead sources and their API compliance status.

### Outreach & Review Gateway
- `GET /api/v1/outreach/pending` — List all drafted messages awaiting human review.
- `POST /api/v1/outreach/{id}/approve` — Approve and dispatch pending outreach.
- `POST /api/v1/outreach/{id}/reject` — Reject drafted outreach.
- `POST /api/v1/outreach/{id}/edit` — Edit subject line or body text of pending draft.
- `POST /api/v1/outreach/bulk-approve` — Bulk approve multiple pending drafts.
- `GET /api/v1/outreach/history` — Log of dispatched messages and delivery events.
- `GET /api/v1/outreach/status` — Daily velocity caps, cooldown policy, and auto-mode qualification.

### Suppression Management
- `GET /api/v1/suppression` — List suppressed emails, phone numbers, and domains.
- `POST /api/v1/suppression` — Add entry to suppression blacklist.
- `DELETE /api/v1/suppression/{id}` — Remove entry from suppression list (requires reason).

### Conversion Intelligence & Telemetry
- `GET /api/v1/analytics/pipeline` — 8-stage conversion funnel and velocity breakdown.
- `GET /api/v1/analytics/deliverability` — Deliverability metrics, bounce rates, and circuit breaker status.
- `GET /api/v1/analytics/roi` — Estimated pipeline value and closed client contracts.
