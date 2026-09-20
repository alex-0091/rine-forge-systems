# Rine Forge Systems — Lead Data Quality & Provenance (`LEAD_DATA.md`)

## Executive Summary
Data integrity and verifiable facts are the core foundation of Rine Forge Systems. The platform enforces strict data quality evaluations, rejects throwaway/disposable contacts, tracks full data provenance, transparently partitions factual business signals from AI inferences, and provides safe, tenant-isolated CSV imports and exports.

---

## 1. Authoritative Data Quality Statuses

Every prospect record (`V5Prospect`) is assigned a deterministic `data_quality_status`:

| Status | Definition | Sending Permitted? |
| :--- | :--- | :--- |
| `VERIFIED` | Company name + verified domain/website + valid email or phone number. | Yes (Pending Operator Approval) |
| `PARTIALLY_VERIFIED` | Company name + either website OR contact channel, with some missing fields. | Requires enrichment before dispatch |
| `UNVERIFIED` | Company name only without confirmed channels. | No (Sending Blocked) |
| `INVALID` | Missing company name, syntax failure, or disposable email domain. | No (Sending Blocked) |
| `OPTED_OUT` | Prospect has indicated an opt-out preference or is in the suppression list. | Strictly & Irreversibly Blocked |

---

## 2. Contact Channel Validation Rules

The `DataQualityEngine` (`backend/app/discovery/quality_engine.py`) enforces rigorous validation checks:

### Email Address Validation
1. **RFC-Compliant Syntax**: Checked against strict regex patterns matching username and domain components.
2. **Disposable Domain Blacklist**: Addresses from temporary/throwaway email providers are strictly rejected:
   - `mailinator.com`, `10minutemail.com`, `tempmail.com`, `guerrillamail.com`
   - `sharklasers.com`, `yopmail.com`, `trashmail.com`, `throwawaymail.com`
3. **Domain Availability**: Verifies presence of a valid domain component with a period delimiter.

### Phone Number Validation
1. **Standardized Digits**: Strips non-digit formatting characters.
2. **Length Constraints**: Requires 10 to 15 digits to accommodate standard North American and international E.164 formats. Numbers shorter than 10 digits are marked invalid.

---

## 3. Strict Separation of Facts vs. AI Inferences

To guarantee transparency and eliminate hallucinations, Rine Forge strictly separates verifiable facts from AI-generated qualifications in the database:

### Factual Signals (`factual_signals: List[str]`)
These are unembellished, observable public data points extracted directly from official web presences or permitted directories:
- `Business Name: Capital Dental Care`
- `Published Website: https://capitaldental.com`
- `Target Vertical: Dental Clinics`
- `Public Operating Location: Austin, TX`
- `Observed Public Signal: Online contact form quotes 24-48 hour response turnaround`

### Inferred Qualifications (`inferred_qualifications: List[Dict[str, Any]]`)
These represent operational conclusions drawn by AI models, explicitly labeled as inferences with confidence scores and disclaimers:
```json
{
  "category": "SPEED_TO_LEAD",
  "inferred_need": "Opportunity for Speed To Lead Automation",
  "evidence_basis": "Observed on contact page (24-48h form turnaround)",
  "confidence": 0.92,
  "disclaimer": "AI inference based on observable public business signals; not a guaranteed outcome."
}
```

---

## 4. Provenance Tracking

Every prospect tracks its origin and audit lifecycle:
- `source`: Type of lead source (e.g., `PUBLIC_BUSINESS_DATA`, `WEBSITE_FORMS`, `USER_PROVIDED_LEADS`).
- `source_record_id`: External or provider-specific identifier.
- `source_url`: URL where the business information was observed.
- `data_provenance`: High-level category (e.g. `PUBLIC_VERIFIED_DIRECTORY`, `USER_PROVIDED_LIST`).
- `last_verified_at`: UTC timestamp of the most recent verification run.

---

## 5. Safe CSV Import & Export Pipeline

The `CSVImportExportService` (`backend/app/discovery/csv_import_export.py`) ensures safe data onboarding and offboarding:

### Import Preview (`POST /api/v1/lead-engine/prospects/import-preview`)
- Non-destructive parsing of uploaded CSV text.
- Normalizes column headers (`company_name`, `email`, `phone`, `website`, `industry`, `location`, `contact_name`).
- Validates syntax and filters out disposable emails.
- Identifies within-file duplicate rows.
- Returns breakdown of valid vs. invalid rows with row numbers and specific rejection reasons.

### Import Commit (`POST /api/v1/lead-engine/prospects/import-commit`)
- Commits valid rows to the authenticated tenant (`business_id`).
- Automatically deduplicates against existing tenant records by company name and email.
- Assigns initial data quality status and sets provenance to `USER_PROVIDED_LIST`.

### Tenant-Isolated Export (`GET /api/v1/lead-engine/prospects/export`)
- Streams a clean CSV export containing all prospect details and scoring data.
- **Strict Multi-Tenant Isolation**: Queries filter exclusively by authenticated `business_id`. Cross-tenant data leakage is architecturally impossible.
