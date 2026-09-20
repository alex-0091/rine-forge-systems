# Rine Forge Systems — Unified AI Tool Registry

## 1. Overview

The Rine Forge AI Tool Registry (`backend/app/ai/tool_registry.py`) provides a strictly typed, permission-guarded, and audited interface between AI models and underlying business logic. 

Every tool execution requires an active database session, business tenant isolation, explicit permission scopes, and automatically commits an entry to the system `AuditLog`.

---

## 2. Complete 17-Tool Directory

### 1. `search_knowledge`
- **Purpose**: Semantic and keyword search across business documentation, FAQ lists, and uploaded collateral.
- **Required Permission**: `READ`
- **Parameters**: `query: str`, `top_k: int = 5`
- **Returns**: Array of matched chunks with similarity scores and source citations.

### 2. `create_lead`
- **Purpose**: Captures new prospective customer details from chat, voice, or web forms.
- **Required Permission**: `MANAGE_LEADS`
- **Parameters**: `name: str`, `email: Optional[str]`, `phone: Optional[str]`, `message: Optional[str]`
- **Returns**: Created lead object with status `NEW`.

### 3. `update_lead`
- **Purpose**: Updates qualification status, intent tags, or assigned notes for an existing lead.
- **Required Permission**: `MANAGE_LEADS`
- **Parameters**: `lead_id: str`, `status: Optional[str]`, `notes: Optional[str]`
- **Returns**: Updated lead record.

### 4. `check_business_hours`
- **Purpose**: Retrieves verified opening hours, holiday closures, and operating schedule.
- **Required Permission**: `READ`
- **Parameters**: None
- **Returns**: Structured dictionary of weekday and weekend operating intervals.

### 5. `check_appointments`
- **Purpose**: Checks calendar availability for a given target date.
- **Required Permission**: `READ_BOOKINGS`
- **Parameters**: `date: str (YYYY-MM-DD)`
- **Returns**: Array of available booking slots and active conflicting appointments.

### 6. `create_appointment`
- **Purpose**: Atomically locks and books an appointment slot for a verified customer.
- **Required Permission**: `MANAGE_BOOKINGS`
- **Parameters**: `customer_id: str`, `start_time: str (ISO 8601)`, `end_time: str (ISO 8601)`, `service_name: str`
- **Returns**: Confirmed booking record with unique booking ID.

### 7. `cancel_appointment`
- **Purpose**: Cancels a previously booked appointment and releases the slot.
- **Required Permission**: `MANAGE_BOOKINGS`
- **Parameters**: `appointment_id: str`, `reason: Optional[str]`
- **Returns**: Cancellation confirmation and updated status.

### 8. `send_approved_message`
- **Purpose**: Dispatches outbound communication (SMS, WhatsApp, Email) that has passed safety and rate limits.
- **Required Permission**: `OUTBOUND_MESSAGING`
- **Parameters**: `recipient: str`, `channel: str`, `template_id: str`, `variables: dict`
- **Returns**: Dispatch receipt ID and timestamp.

### 9. `create_project`
- **Purpose**: Initializes a new multi-stage business generation project.
- **Required Permission**: `MANAGE_PROJECTS`
- **Parameters**: `name: str`, `description: Optional[str]`, `input_request: str`
- **Returns**: Initialized `V5Project` entity in `PLANNING` state.

### 10. `create_artifact`
- **Purpose**: Persists generated deliverables (code, SVG, reports, spreadsheets) to the workbench.
- **Required Permission**: `WRITE_ARTIFACTS`
- **Parameters**: `project_id: str`, `artifact_type: str`, `name: str`, `content_text: str`
- **Returns**: Created `V5WorkbenchArtifact` record.

### 11. `analyze_website`
- **Purpose**: Audits existing URL or business profile across SEO, accessibility, mobile responsiveness, and speed.
- **Required Permission**: `READ`
- **Parameters**: `business_context: dict`
- **Returns**: 8-dimension scorecard with verified facts and explicit unmeasurable disclosures.

### 12. `generate_website`
- **Purpose**: Synthesizes a multi-page, responsive, accessible website in clean Tailwind CSS and HTML.
- **Required Permission**: `MANAGE_PROJECTS`
- **Parameters**: `business_name: str`, `business_category: str`, `location: str`
- **Returns**: Multi-page HTML code package with navigation, hero, services, pricing, and contact sections.

### 13. `generate_logo`
- **Purpose**: Produces 4 parametric SVG brand identity concepts with accessible color palettes and typography.
- **Required Permission**: `MANAGE_PROJECTS`
- **Parameters**: `business_name: str`, `industry: str`, `style: Optional[str]`
- **Returns**: Brand package with 4 vector SVG marks, color specifications, and favicon.

### 14. `generate_business_plan`
- **Purpose**: Creates an operational and strategic business plan with clearly isolated assumption boundaries.
- **Required Permission**: `MANAGE_PROJECTS`
- **Parameters**: `business_name: str`, `business_category: str`, `location: str`
- **Returns**: Complete 8-section strategic plan with labeled forward-looking assumptions.

### 15. `generate_financial_model`
- **Purpose**: Computes 12-month deterministic cash flow, unit economics, and break-even revenue models.
- **Required Permission**: `MANAGE_PROJECTS`
- **Parameters**: `monthly_revenue: float`, `cogs_rate: float`, `monthly_opex: Optional[float]`
- **Returns**: Deterministic financial model and downloadable 12-month CSV projection.

### 16. `create_report`
- **Purpose**: Formats business metrics, agent activities, and conversion statistics into structured markdown or PDF.
- **Required Permission**: `READ`
- **Parameters**: `report_type: str`, `date_range: str`
- **Returns**: Structured analytical report deliverable.

### 17. `handoff_to_human`
- **Purpose**: Gracefully transfers active chat or voice session to a human team member when thresholds are met.
- **Required Permission**: `CHAT_OPERATOR`
- **Parameters**: `conversation_id: str`, `reason: str`, `customer_sentiment: str`
- **Returns**: Handoff state `TRANSFERRED` with operator notification payload.

---

## 3. Security & Transaction Integrity

Every tool call undergoes strict pre-execution validation:
```python
# 1. Permission Check
if not user_has_permission(user_id, tool.required_permission):
    raise PermissionDeniedError(f"User lacks {tool.required_permission}")

# 2. Argument Validation
tool.validate_arguments(arguments)

# 3. Transactional Execution & Audit Logging
try:
    result = await tool.execute(session, business_id, arguments)
    log_audit_event(session, business_id, tool_name, "SUCCESS", arguments)
    await session.commit()
    return result
except Exception as exc:
    await session.rollback()
    log_audit_event(session, business_id, tool_name, "ERROR", {"error": str(exc)})
    raise
```
