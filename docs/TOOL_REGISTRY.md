# Rine Forge Systems V5 — Tool Registry & Permission Engine

## 1. Overview

The `ForgeToolRegistry` defines 18 authoritative tools. Every tool declares input/output schemas, permission keys, risk levels, workspace isolation rules, and audit logging requirements.

Tools with external side effects (e.g. sending outbound messages, modifying CRM records) are strictly isolated and monitored by the **Tool Permission Engine**.

---

## 2. Master 18 Tools Directory

| Tool Name | Permission Key | Risk Level | Side Effects | Description |
| :--- | :--- | :--- | :--- | :--- |
| `searchKnowledge` | `knowledge.read` | `LOW` | No | Semantic query against grounded business knowledge base. |
| `readDocument` | `documents.read` | `LOW` | No | Extracts text and structure from uploaded business PDFs. |
| `createArtifact` | `artifacts.create` | `MEDIUM` | Yes | Commits deliverable to multi-tenant artifact store. |
| `updateArtifact` | `artifacts.update` | `MEDIUM` | Yes | Increments artifact version with new deliverable data. |
| `sendEmail` | `communications.send_email` | `HIGH` | Yes | Dispatches outbound marketing or notification email. |
| `sendWhatsApp` | `communications.send_whatsapp` | `HIGH` | Yes | Dispatches customer outreach message via WhatsApp. |
| `sendSMS` | `communications.send_sms` | `HIGH` | Yes | Dispatches SMS alert to verified phone number. |
| `createLead` | `crm.create_lead` | `LOW` | Yes | Inserts prospect into workspace CRM pipeline. |
| `updateCRM` | `crm.update` | `HIGH` | Yes | Modifies contact stage, notes, or deal values. |
| `createAppointment`| `calendar.create_appointment` | `HIGH` | Yes | Reserves calendar slot for customer booking. |
| `searchWeb` | `web.search` | `LOW` | No | Queries search engine for competitor and market research. |
| `fetchWebsite` | `web.fetch` | `LOW` | No | Retrieves raw DOM of target URL for technical audit. |
| `analyzeImage` | `vision.analyze` | `LOW` | No | Evaluates layout and OCR elements in uploaded screenshots. |
| `generateImage` | `vision.generate` | `LOW` | No | Synthesizes branding imagery or vector graphics. |
| `runSandboxBuild` | `sandbox.build` | `LOW` | No | Validates HTML syntax and checks for injection vulnerabilities. |
| `runTests` | `sandbox.test` | `LOW` | No | Runs simulation scenarios or unit tests against artifacts. |
| `calculateFinance`| `finance.calculate` | `LOW` | No | Runs exact deterministic arithmetic formulas for projections. |
| `createVoiceSession`| `voice.session` | `LOW` | Yes | Allocates live audio streaming turn buffers for telephony. |

---

## 3. Tool Permission Engine

Before **EVERY** tool call:
1. **User Identity & Permissions:** Verifies caller has valid workspace access and declared capability keys.
2. **Agent Boundary:** Verifies the calling agent has the tool declared in `allowed_tools`.
3. **External Side Effects:** Intercepts consequential actions (`sendWhatsApp`, `sendEmail`, `sendSMS`, `updateCRM`) and stops at the **Human Approval Gate** unless the operator explicitly set `allow_external_side_effects=True`.
4. **Policy Enforcer:** In `LOCAL_ONLY` mode, external network calls (`searchWeb`, `fetchWebsite`) are strictly rejected.
5. **Decisions:** Returns `ALLOW`, `DENY`, or `REQUIRES_APPROVAL`.
