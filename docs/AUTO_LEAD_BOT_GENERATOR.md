# AUTO LEAD → AUTO BOT GENERATOR (Phase AO Documentation)
**Rine Forge Systems V5 — Autonomous Client Acquisition OS**

---

## 1. Overview & Core Concept

The **Auto Lead → Auto Bot Generator** is a production-grade module within Rine Forge Systems that transforms any client business configuration into an automated, compliant lead-detection and coordinated 6-bot AI response workflow.

A business owner or agency operator inputs:
* **Business Name**: e.g., *SmileCraft Dental*
* **Business Category**: e.g., *Dental Clinic*, *Restaurant*, *Law Firm*, *Hotel*, *Cleaning Company*, *Marketing Agency*
* **Official Website**: e.g., *https://smilecraft.example.com*
* **Service Area & Radius**: e.g., *Austin, Texas (+25 miles)*
* **Services Offered**: e.g., *Emergency Dental, Dental Implants, Porcelain Veneers, Teeth Whitening*
* **Target Customer Profile**: e.g., *Adults and families in Austin needing same-day emergency relief or cosmetic enhancements*
* **Signal Keywords**: e.g., *"tooth hurts", "need dentist", "broken tooth", "looking for dentist", "emergency dentist"*
* **Excluded Keywords**: e.g., *"dog teeth", "pet dentist", "job", "hiring", "assistant vacancy"*
* **Preferred Communication Channels**: *SOCIAL_REPLY, EMAIL, WHATSAPP, SMS, WEB_CHAT*
* **Business Hours**: e.g., *Mon-Fri 08:00-18:00, Sat 09:00-14:00, Sun Emergency On-Call*
* **AI Tone**: *PROFESSIONAL_HELPFUL, WARM_EMPATHETIC, DIRECT_EFFICIENT, CASUAL_FRIENDLY*
* **Lead Qualification Rules**: Custom criteria specifying geographic boundaries and service fit

The system automatically generates a **Coordinated 6-Bot Suite** grounded in a single, authoritative **Unified Business Knowledge Base**.

---

## 2. The Coordinated 6-Bot Suite Architecture

All 6 bots share the same business knowledge base, preventing contradictory answers or hallucinated claims.

| Agent Name | Primary Role | Allowed Capabilities / Tools |
| :--- | :--- | :--- |
| **`LeadAgent`** | Intent Signal Discovery & Feed Ingestion | `scan_signals`, `filter_negative_keywords`, `geo_filter`, `normalize_provenance` |
| **`QualificationAgent`** | Fact vs. Inference Qualification | `classify_intent`, `check_service_fit`, `evaluate_facts_inferences`, `calculate_urgency` |
| **`ResponseAgent`** | Grounded Contextual Draft Generation | `draft_response`, `check_disclosure`, `verify_grounding`, `check_policy_gates` |
| **`ConversationAgent`** | Multiturn Engagement & Inquiry Handling | `query_knowledge_base`, `check_availability`, `propose_consultation`, `record_reply` |
| **`SalesAgent`** | 9-Stage CRM Progression & Prioritization | `update_lead_status`, `assign_sales_task`, `calculate_priority`, `log_crm_event` |
| **`HumanHandoffAgent`** | Safety Escalation & Exception Routing | `create_escalation_task`, `notify_operator`, `pause_lead_automations`, `trigger_opt_out` |

---

## 3. Strict Data Provenance & Compliance Invariants

### 3.1 Authorized Data Ingestion Only
The system monitors **ONLY** data available through:
1. Authorized platform APIs (official X API, Reddit OAuth, Nextdoor Partner API)
2. Licensed commercial data providers
3. Customer-provided feeds / CSV uploads / direct CRM sync
4. Permitted public commercial directories and open local community boards

### 3.2 Anti-Scraping Guarantee
Rine Forge strictly forbids:
* Bypassing CAPTCHAs
* Scraping private accounts or private DMs
* Anti-bot circumvention
* Bulk spamming or deceptive sender identities
* Unauthenticated web scraping

When an official platform integration is not configured, the system explicitly reports `NOT CONFIGURED` alongside official setup documentation.

---

## 4. Business & Location Matching Engine

The matching engine verifies incoming candidate signals across five dimensions:
1. **Category Match**: Correlates user inquiry to the business domain.
2. **Location & Radius Matching**: Evaluates geographic proximity. For example, Austin, Round Rock, and Cedar Park match an Austin 25-mile radius, whereas Dallas (~195 miles away) is automatically rejected.
3. **Problem & Service Matching**: Maps acute pain points or stated needs directly to catalog offerings (e.g., "broken tooth" → "Emergency Dental").
4. **Negative Signal Filtering**: Instantly disqualifies any signal matching excluded terms (e.g., "dog teeth", "pet dentist", "job vacancy").
5. **Intent Classification**: Assigns one of five intent categories:
   * `HIGH_INTENT`: Urgent or direct commercial inquiry.
   * `POSSIBLE_INTENT`: Exploratory interest or price query.
   * `INFORMATIONAL`: General topical question.
   * `IRRELEVANT`: Out of service area or unrelated topic.
   * `NEGATIVE`: Contains excluded keywords or complaint.

---

## 5. Strict Fact vs. Inference Segregation

To guarantee zero hallucination, every lead qualification segregates verifiable facts from AI conclusions:

```json
{
  "facts": [
    "Author stated name / handle: 'David Reynolds'",
    "Signal location metadata: 'Austin, TX'",
    "Explicitly mentioned service/need terms: Emergency Dental",
    "Explicit timeframe stated: 'today'",
    "Explicit condition stated: 'hurts, cracked'"
  ],
  "inferences": [
    {
      "deduction": "Prospect has acute urgency requiring same-day or priority scheduling",
      "confidence": 0.90,
      "basis": "Immediate temporal or symptom cues in text"
    },
    {
      "deduction": "Best matching core service is 'Emergency Dental'",
      "confidence": 0.88,
      "basis": "Keyword correlation with Dental Clinic service catalog"
    }
  ]
}
```

---

## 6. The 9 Lead Lifecycle States

Leads progress through a defined 9-state pipeline:
1. `NEW`: Ingested signal awaiting evaluation.
2. `QUALIFIED`: Passed matching engine with high confidence.
3. `NEEDS_REVIEW`: Ambiguous or moderate confidence requiring operator inspection.
4. `CONTACTED`: Grounded response draft approved and dispatched.
5. `REPLIED`: Prospect sent a follow-up inquiry.
6. `MEETING_REQUESTED`: Consultation or appointment booking initiated.
7. `CUSTOMER`: Service agreement or scheduled appointment confirmed.
8. `DISQUALIFIED`: Negative keywords, out-of-territory, or spam detected.
9. `OPTED_OUT`: Recipient requested no further contact (added to suppression list).

---

## 7. 10-Gate Pre-Flight Compliance Verification

Before any message can be dispatched across any channel, it must pass all 10 gates:
1. `1_SOURCE_ALLOWED`: Ingested from authorized/licensed source; not scraped.
2. `2_PERMISSION_VALID`: Source permission is verified and active.
3. `3_PLATFORM_ALLOWED`: Target channel is approved in tenant profile.
4. `4_RECIPIENT_CONTACTABLE`: Valid recipient identifier exists.
5. `5_OPTED_OUT`: Recipient not present in tenant or global suppression list.
6. `6_COOLDOWN_ACTIVE`: Cooldown period (168 hours / 7 days) respected.
7. `7_RATE_LIMIT`: Daily channel limit not exceeded.
8. `8_BUSINESS_POLICY`: Lead lifecycle status eligible for outreach.
9. `9_CONTENT_POLICY`: Contains transparent disclosure and disclaimer; zero prohibited claims.
10. `10_APPROVAL_REQUIRED`: Explicit human approval recorded.

---

## 8. Transparent Lead Prioritization

Priority scores (0-100) are derived with full transparency:
* **Commercial Intent** (up to 30 pts)
* **Geographic Fit** (up to 25 pts)
* **Urgency & Timeliness** (up to 20 pts)
* **Service Specificity** (up to 15 pts)
* **Reachability / Identifier Completeness** (up to 10 pts)

A human-readable checklist (`✓ Commercial Intent: Explicit service request (+30)`, `✓ Location Fit: Inside Austin (+25)`, etc.) accompanies every lead.
