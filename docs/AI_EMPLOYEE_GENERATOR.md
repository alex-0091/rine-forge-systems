# Rine Forge Systems V5 — AI Employee Generator Engine

## 1. Overview & Purpose

The **AI Employee Generator Engine** (`AIEmployeeGeneratorEngine`) enables business owners to instantly provision bounded, task-specialized AI employee blueprints. Rather than requiring users to manually craft system prompts, configure tools, and balance model routing, Forge generates complete operational blueprints conforming to strict enterprise guardrails.

All AI employees adhere to the mandatory governance lifecycle:

```text
┌─────────────┐       ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   PREVIEW   │ ───►  │    TEST     │ ───►  │   APPROVE   │ ───►  │   DEPLOY    │
│  Blueprint  │       │ 10-Scenario │       │   Operator  │       │  Production │
│  Generated  │       │ Simulation  │       │ Verification│       │   Runtime   │
└─────────────┘       └─────────────┘       └─────────────┘       └─────────────┘
```

No AI employee can be placed into active production without passing the synthetic test suite and receiving explicit operator approval.

---

## 2. The 10 Specialized AI Employee Blueprints

Each blueprint defines role boundaries, deployment channels, local model policies, authorized tools, permission scopes, system instructions, escalation criteria, and memory persistence rules.

### 1. AI Receptionist
- **Role:** Front Desk & Inquiry Receptionist
- **Channels:** Website Chat, SMS, Embedded Widget
- **Model Policy:** `LOCAL_FIRST (phi3:mini)`
- **Tools:** `searchKnowledge`, `createAppointment`
- **Permissions:** `knowledge.read`, `calendar.create_appointment`
- **Escalation Rules:** Patient mentions severe pain/bleeding, customer requests human supervisor, 3 repeated unhandled intents.
- **Memory Rules:** Persist customer name, preferred contact method, and requested appointment timeframe.

### 2. AI Sales Agent
- **Role:** Inbound & Outbound Sales Representative
- **Channels:** Email, LinkedIn, CRM
- **Model Policy:** `LOCAL_FIRST (llama3:8b)`
- **Tools:** `searchKnowledge`, `createLead`, `updateCRM`
- **Permissions:** `knowledge.read`, `crm.create_lead`, `crm.update`
- **Escalation Rules:** Contract value > $5,000, custom SLA negotiation, competitor displacement review.
- **Memory Rules:** Record deal stage, budget parameters, and decision timeline.

### 3. AI Support Agent
- **Role:** Customer Support & Issue Resolution Specialist
- **Channels:** Helpdesk, Email, In-App
- **Model Policy:** `LOCAL_FIRST (llama3:8b)`
- **Tools:** `searchKnowledge`, `updateCRM`
- **Permissions:** `knowledge.read`, `crm.update`
- **Escalation Rules:** Billing dispute > $100, acute customer frustration, confirmed software outage.
- **Memory Rules:** Record ticket history and diagnostic troubleshooting steps taken.

### 4. AI Lead Qualifier
- **Role:** Automated Lead Research & Scoring Agent
- **Channels:** Website Form, CSV Batch
- **Model Policy:** `LOCAL_FIRST (phi3:mini)`
- **Tools:** `searchWeb`, `createLead`
- **Permissions:** `web.search`, `crm.create_lead`
- **Escalation Rules:** High-priority ICP score > 85, enterprise account detected.
- **Memory Rules:** Store qualification score and verified lead tags.

### 5. AI Appointment Agent
- **Role:** Dedicated Booking & Calendar Coordinator
- **Channels:** SMS, Website Chat, Voice
- **Model Policy:** `LOCAL_FIRST (phi3:mini)`
- **Tools:** `createAppointment`, `searchKnowledge`
- **Permissions:** `calendar.create_appointment`, `knowledge.read`
- **Escalation Rules:** No slots available within requested timeframe, double-booking conflict.
- **Memory Rules:** Store confirmed slot timestamp and customer phone number.

### 6. AI Voice Receptionist
- **Role:** Telephony Voice Response Agent
- **Channels:** Twilio / SIP Phone Line
- **Model Policy:** `LOCAL_FIRST (phi3:mini + local Whisper + TTS)`
- **Tools:** `createVoiceSession`, `searchKnowledge`, `createAppointment`
- **Permissions:** `voice.session`, `knowledge.read`, `calendar.create_appointment`
- **Escalation Rules:** Caller requests human representative, audio quality unrecognizable.
- **Memory Rules:** Record voice session transcript and caller telephone number.

### 7. AI WhatsApp Employee
- **Role:** WhatsApp Business Conversational Agent
- **Channels:** WhatsApp Business API
- **Model Policy:** `LOCAL_FIRST (phi3:mini)`
- **Tools:** `sendWhatsApp`, `searchKnowledge`
- **Permissions:** `communications.send_whatsapp`, `knowledge.read`
- **Escalation Rules:** Customer requests human handoff, media upload review required.
- **Memory Rules:** Track WhatsApp conversation thread and customer state.

### 8. AI Website Assistant
- **Role:** Embedded On-Site Conversion Concierge
- **Channels:** Website Embedded Widget
- **Model Policy:** `LOCAL_FIRST (phi3:mini)`
- **Tools:** `searchKnowledge`, `createLead`
- **Permissions:** `knowledge.read`, `crm.create_lead`
- **Escalation Rules:** High-value visitor intent detected, technical bug report on website.
- **Memory Rules:** Track page URL visitor is currently viewing.

### 9. AI Marketing Assistant
- **Role:** Multi-Channel Copy & Campaign Designer
- **Channels:** Internal Workbench
- **Model Policy:** `LOCAL_FIRST (llama3:8b)`
- **Tools:** `createArtifact`, `searchKnowledge`
- **Permissions:** `artifacts.create`, `knowledge.read`
- **Escalation Rules:** PR-sensitive content, regulatory claim verification.
- **Memory Rules:** Store approved brand voice adjectives and campaign archives.

### 10. AI Operations Assistant
- **Role:** Workflow Automator & Internal Dispatcher
- **Channels:** Internal Workbench, Webhook
- **Model Policy:** `LOCAL_FIRST (llama3:8b)`
- **Tools:** `createArtifact`, `updateCRM`
- **Permissions:** `artifacts.create`, `crm.update`
- **Escalation Rules:** Deadline breach, task dependency blocker.
- **Memory Rules:** Track active operational work orders and assignee status.

---

## 3. Blueprint Lifecycle States

1. **`PREVIEW`**: The blueprint is generated with customized business name, role boundaries, and tool whitelist. It is inactive and cannot receive traffic.
2. **`TEST`**: The blueprint is subjected to the 10-scenario synthetic customer suite via `SimulationEngine.run_simulation()`.
3. **`APPROVE`**: If the test scorecard passes (10/10 or acceptable warnings), an operator inspects the scorecard and marks the blueprint approved.
4. **`DEPLOY`**: The blueprint is activated as an operational service on its assigned channels.

---

## 4. REST API Endpoints

- **Generate Blueprint**:
  `POST /api/v1/intelligence/employees/generate`
  ```json
  {
    "employee_type": "AI Receptionist",
    "business_name": "Apex Dental Clinic"
  }
  ```
- **Simulate Blueprint**:
  `POST /api/v1/intelligence/employees/simulate`
  ```json
  {
    "blueprint": { ... }
  }
  ```
