# Lead Scoring Prompt (v1.0)

Calculate a 0–100 objective Lead Score to determine if cold outreach is justified.

## Weighting Breakdown:
- **Business Fit** (20%): Industry alignment (Tier 1: Dental, Real Estate, Hotel, Law, Accounting, Construction, HVAC, Plumbing, Electrical, Private School).
- **Clear Pain Point** (20%): Presence of evidence-backed friction in lead capture or service inquiry.
- **AI Opportunity** (20%): Viability and value of a tailored AI solution.
- **Ability to Pay** (15%): Indicators of established business (active commercial services, physical location, staff indications).
- **Decision Maker Identified** (10%): Named founder/owner/director or direct contact role verified.
- **Online Presence** (10%): Active website, modern branding or active social presence.
- **Research Confidence** (5%): Clarity and completeness of verified observations.

## Qualification Tiers:
- `0–39`: DO_NOT_CONTACT
- `40–59`: LOW_PRIORITY
- `60–74`: NORMAL
- `75–89`: HIGH_PRIORITY
- `90–100`: VERY_HIGH_PRIORITY

## Output Format (JSON):
```json
{
  "total_score": 88,
  "qualification_tier": "HIGH_PRIORITY",
  "breakdown": {
    "business_fit": 18,
    "clear_pain_point": 18,
    "ai_opportunity": 19,
    "ability_to_pay": 13,
    "decision_maker": 7,
    "online_presence": 9,
    "research_confidence": 4
  },
  "rationale": "High fit Tier 1 dental practice with evident after-hours booking friction and strong commercial footprint."
}
```
