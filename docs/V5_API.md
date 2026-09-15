# RINE FORGE SYSTEMS — V5 REST API SPECIFICATION

All endpoints are mounted under the base path `/api/v1`.
Protected endpoints require a standard Bearer JWT token in the `Authorization: Bearer <token>` header.
Tenant context is automatically resolved from the token or can be explicitly passed via the `X-Business-ID` header.

---

## 1. Authentication (`/api/v1/auth`)

### `POST /api/v1/auth/signup`
Registers a new user and automatically provisions their primary business tenant.
- **Request Body**:
```json
{
  "email": "dr.evans@rinedental.com",
  "password": "SecurePassword123!",
  "name": "Dr. Sarah Evans",
  "business_name": "Rine Dental & Facial Aesthetics",
  "role": "BUSINESS_OWNER"
}
```
- **Response (201 Created)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "token_type": "bearer",
  "user": {
    "id": "c1f7a4e2-...",
    "email": "dr.evans@rinedental.com",
    "name": "Dr. Sarah Evans",
    "role": "BUSINESS_OWNER"
  },
  "business_id": "00000000-0000-0000-0000-000000000001"
}
```

### `POST /api/v1/auth/login`
Authenticates credentials and returns a signed JWT token.
- **Request Body**:
```json
{
  "email": "dr.evans@rinedental.com",
  "password": "SecurePassword123!"
}
```
- **Response (200 OK)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "token_type": "bearer",
  "user": { "id": "...", "email": "...", "name": "...", "role": "..." },
  "business_id": "..."
}
```

### `GET /api/v1/auth/me`
Returns profile information for the authenticated user.

---

## 2. Business Tenant Management (`/api/v1/businesses`)

### `GET /api/v1/businesses/current`
Returns profile, operating hours, and configuration of current authenticated tenant.

### `PUT /api/v1/businesses/current`
Updates profile, operating hours, timezone, or business contact information.

### `GET /api/v1/businesses/{business_id}/public`
Public storefront data for customer booking widgets and web chat (no auth required).
- Returns business profile, active services list, active staff list, and operating hours.

---

## 3. AI Employee Configuration & Chat (`/api/v1/ai-employees`)

### `GET /api/v1/ai-employees`
Lists AI employees configured for the tenant.

### `POST /api/v1/ai-employees`
Creates a new AI employee persona.

### `POST /api/v1/ai-employees/chat`
Inbound chat interface executing the 20-step conversational pipeline.
- **Request Body**:
```json
{
  "business_id": "00000000-0000-0000-0000-000000000001",
  "channel": "website",
  "customer_identifier": "web-session-abc",
  "message": "Do you have any appointments available this Friday?",
  "customer_name": "James Miller",
  "customer_phone": "+1 (555) 892-1234"
}
```
- **Response (200 OK)**:
```json
{
  "conversation_id": "conv-9912",
  "role": "assistant",
  "content": "Yes, on Friday we have openings at 08:30 AM, 11:00 AM, and 02:30 PM for Dr. Evans. Which time works best for you?",
  "intent": "CHECK_AVAILABILITY",
  "confidence": 0.95,
  "human_handoff": false,
  "tools_executed": ["getAvailableAppointments"],
  "lead_score": 75,
  "lead_status": "QUALIFIED"
}
```

---

## 4. Service Catalog (`/api/v1/services`)

### `GET /api/v1/services`
Lists active service catalog items.

### `POST /api/v1/services`
Creates a new service entry.
```json
{
  "name": "Laser Teeth Whitening",
  "description": "Medical-grade LED laser whitening.",
  "price": 350.0,
  "duration": 60,
  "currency": "USD"
}
```

---

## 5. Staff Practitioners (`/api/v1/staff`)

### `GET /api/v1/staff`
Lists active staff members and their working hours.

### `POST /api/v1/staff`
Adds a staff practitioner.

---

## 6. Knowledge & RAG Vector Engine (`/api/v1/knowledge`)

### `POST /api/v1/knowledge/documents`
Ingests a document, generates overlapping text chunks and vector embeddings, and indexes them into the tenant vector store.

### `POST /api/v1/knowledge/search`
Executes dense cosine similarity search scoped strictly to the tenant.
```json
{
  "query": "What is the cancellation policy?",
  "top_k": 3
}
```

---

## 7. Appointments & Scheduling (`/api/v1/appointments`)

### `GET /api/v1/appointments/availability`
Calculates factual open slots based on business hours, staff schedules, and existing bookings.
- Parameters: `target_date`, `service_id`, `staff_id`.

### `POST /api/v1/appointments`
Atomically books an appointment.
- **Double Booking Guard**: If the slot overlaps with an existing confirmed booking, returns **HTTP 409 Conflict**.
```json
{
  "customer_id": "cust-123",
  "service_id": "svc-456",
  "start_time": "2026-09-20T10:00:00Z",
  "end_time": "2026-09-20T10:45:00Z",
  "notes": "First cleaning visit"
}
```

### `POST /api/v1/appointments/{appointment_id}/cancel`
Cancels an appointment.

### `POST /api/v1/appointments/{appointment_id}/reschedule`
Atomically cancels old slot and creates new confirmed booking.

---

## 8. Leads Pipeline (`/api/v1/leads`)

### `GET /api/v1/leads`
Lists leads ordered by highest intent score.

### `PUT /api/v1/leads/{lead_id}`
Updates lead qualification status (`NEW`, `QUALIFIED`, `CONTACTED`, `BOOKED`, `LOST`) and CRM notes.

---

## 9. Automations Engine (`/api/v1/automations`)

### `GET /api/v1/automations`
Lists configured rules for tenant.

### `POST /api/v1/automations`
Configures a trigger-condition-action rule.
```json
{
  "name": "High-Intent Lead Staff Notification",
  "trigger": "NEW_LEAD",
  "conditions": [{"field": "score", "operator": ">=", "value": 70}],
  "actions": [{"type": "NOTIFY_STAFF", "recipient": "reception@clinic.com", "channel": "EMAIL"}]
}
```

---

## 10. Analytics & Telemetry (`/api/v1/analytics`)

### `GET /api/v1/analytics/overview`
Returns total appointments, confirmed bookings, active leads, average lead score, and hours saved.

### `GET /api/v1/analytics/usage`
Returns token volume, message count, tool calls, and billing estimates by month.

---

## 11. Health Checks (`/api/v1/health`)
- `GET /api/v1/health`: Overall platform health.
- `GET /api/v1/health/database`: Relational database connectivity and latency.
- `GET /api/v1/health/ai`: AI provider availability (OpenAI, Gemini, Local Fallback).
