# Database Schema & Data Models

OWAIS OUTREACH AI uses an asynchronous SQLAlchemy relational schema compatible with SQLite and PostgreSQL.

---

## Core Tables & Entity Relationships

```
 businesses (1) ────┬───< contacts (N)
                    ├───< business_research (N)
                    ├───< pain_points (N)
                    ├───< ai_opportunities (N)
                    ├───< lead_scores (1:1)
                    ├───< campaign_members (N) ───< outreach_messages (N) ───< message_events (N)
                    └───< conversations (N) ───< replies (N)
```

---

## Table Definitions

### 1. `businesses`
- `id`: UUID (Primary Key)
- `name`, `normalized_name`: String
- `industry`, `country`, `city`, `state_province`, `address`: String/Text
- `website_url`, `normalized_domain`, `primary_email`, `primary_phone`: String
- `has_online_booking`, `has_contact_form`, `has_live_chat`, `has_ai_assistant`: Boolean
- `detected_cms`, `detected_booking_system`, `detected_chat_tool`: String
- `technology_stack`: JSON List
- `source`: String (`curated_directory`, `web_crawl`, `csv_import`)
- `status`: String (`DISCOVERED`, `RESEARCHED`, `QUALIFIED`, `OUTREACH_READY`, `CONTACTED`, `REPLIED`, `INTERESTED`, `WON`, `LOST`, `SUPPRESSED`)
- `created_at`, `updated_at`: DateTime (UTC)

### 2. `contacts`
- `id`: UUID
- `business_id`: ForeignKey (`businesses.id`)
- `full_name`, `first_name`, `last_name`: String
- `role_title`: String (e.g. Owner, Managing Broker, Admissions Director)
- `email`, `phone`, `linkedin_url`: String
- `is_decision_maker`: Boolean

### 3. `pain_points` & `ai_opportunities`
- `pain_points`: `observed_fact`, `business_problem`, `severity_score` (0-100), `evidence_source`
- `ai_opportunities`: `solution_name`, `service_category`, `pain_point_addressed`, `business_benefit`, `business_value`, `implementation_feasibility`, `purchase_likelihood`, `confidence`, `overall_score`, `recommended_pitch_angle`

### 4. `lead_scores`
- `business_id`: ForeignKey
- `total_score`: Integer (0-100)
- `qualification_tier`: `DO_NOT_CONTACT`, `LOW_PRIORITY`, `NORMAL`, `HIGH_PRIORITY`, `VERY_HIGH_PRIORITY`
- `score_breakdown`: JSON (Fit 20%, Pain 20%, Opportunity 20%, Ability to Pay 15%, DM 10%, Presence 10%, Confidence 5%)
- `is_qualified_for_outreach`: Boolean

### 5. `campaigns`, `campaign_members`, `outreach_messages`
- `campaigns`: Name, country, industry, min lead score, offer type, daily limit, follow-up cadence days, `is_dry_run`, `status`.
- `outreach_messages`: `step_number`, `recipient_email`, `subject`, `body_text`, `personalized_hook`, `quality_score`, `compliance_passed`, `status` (`DRAFT`, `QUEUED`, `SCHEDULED`, `SENT`, `FAILED`, `CANCELLED`).

### 6. `conversations`, `replies`, `system_alerts`
- `conversations`: `contact_email`, `subject`, `status`, `latest_intent_classification`, `latest_intent_score`, `requires_human_action`, `human_action_reason`.
- `replies`: `direction` (`INBOUND`/`OUTBOUND`), `raw_body`, `classification`, `intent_score`, `suggested_reply`.
- `system_alerts`: `alert_type`, `severity`, `title`, `message`, `is_resolved`.

### 7. `suppression_list` & `audit_logs`
- `suppression_list`: `entry_type` (`EMAIL`, `DOMAIN`, `COMPANY`), `value`, `reason`, `source`, `timestamp`.
- `audit_logs`: `event_type`, `actor`, `entity_type`, `entity_id`, `tokens`, `estimated_cost_usd`, `timestamp`.
