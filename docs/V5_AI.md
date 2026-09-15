# RINE FORGE SYSTEMS — V5 AI EMPLOYEE & REASONING SPECIFICATION

## 1. Zero-Hallucination Architectural Principles
The central governing mandate of Rine Forge Systems V5 is:
> **AI is the reasoning brain, NOT the database.**
> An AI Employee MUST NEVER invent prices, discounts, available times, staff names, or clinic policies.

### Enforcement Mechanism:
1. **The AI Never Directly Accesses the Database**:
   - The AI interacts exclusively via the `ToolRegistry`.
   - Tool arguments are validated by FastAPI and Python models.
   - Operations execute against relational database state.
   - Verified results are passed back to the AI as factual grounding context.
2. **Strict Grounding Prompting**:
   - System prompts explicitly state: *"You MUST ONLY state facts, prices, hours, doctor names, and appointment slots that appear in the FACTUAL CONTEXT below. If a time or service is not listed, say so politely."*
3. **Fallbacks**:
   - If third-party AI APIs are unreachable, the provider abstraction executes a deterministic grounded template, ensuring 100% uptime.

---

## 2. Supported AI Providers
The platform supports multi-provider failover configured via `settings.LLM_PROVIDER`:
1. **OpenAI (`gpt-4o-mini`, `gpt-4o`)**:
   - Primary high-reasoning provider for conversational orchestration, intent extraction, and `text-embedding-3-small` vector generation.
2. **Google Gemini (`gemini-1.5-flash`, `gemini-1.5-pro`)**:
   - High-speed multimodal provider.
3. **Deterministic Local Fallback**:
   - 256-dimensional L2-normalized vector hashing and grounded response synthesis for offline local execution and test environments.

---

## 3. The 16 Authorized Backend Tools
The `ToolRegistry` (`backend/app/ai/tool_registry.py`) provides 16 backend actions:

1. `searchKnowledge`: Queries tenant vector store for clinic manuals, policies, and FAQs.
2. `getBusinessInformation`: Returns address, phone, email, and timezone.
3. `getBusinessHours`: Returns weekly operating schedule.
4. `getServices`: Returns authoritative active catalog with exact pricing and durations.
5. `getStaff`: Returns verified practitioners and roles.
6. `getAvailableAppointments`: Calculates conflict-free open slots for a target date.
7. `createAppointment`: Books an appointment slot atomically, guarding against conflicts.
8. `cancelAppointment`: Cancels an existing appointment.
9. `rescheduleAppointment`: Cancels old slot and books a new slot atomically.
10. `createLead`: Generates a qualified lead with automatic intent scoring.
11. `updateLead`: Modifies lead qualification status or CRM notes.
12. `getCustomer`: Retrieves customer contact information and past history.
13. `updateCustomer`: Updates customer profile details.
14. `sendNotification`: Dispatches staff alert (Email/SMS).
15. `createTask`: Schedules human follow-up task.
16. `handoffToHuman`: Triggers immediate human escalation and pauses AI responses.

---

## 4. Intent Classification Taxonomy
Incoming user utterances are classified into standardized domain intents:
- `BOOK_APPOINTMENT`
- `CHECK_AVAILABILITY`
- `CANCEL_APPOINTMENT`
- `RESCHEDULE_APPOINTMENT`
- `SERVICE_INQUIRY`
- `PRICE_INQUIRY`
- `BUSINESS_HOURS`
- `LOCATION_INQUIRY`
- `STAFF_INQUIRY`
- `HUMAN_ESCALATION`
- `GENERAL_INQUIRY`
