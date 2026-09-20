# Rine Forge Systems V5 — Agent Registry

## 1. Overview

The `AgentRegistry` maintains 21 specialized autonomous agent blueprints. Each agent operates under strict boundary conditions, declaring:
- **Capabilities:** Core competencies and skills.
- **Allowed Tools:** Sandboxed tools permitted for execution.
- **Allowed Models:** Certified local models suitable for the agent's reasoning demands.
- **Risk Level:** `LOW`, `MEDIUM`, `HIGH`, or `CRITICAL`.
- **Human Approval Requirement:** Whether actions require confirmation before execution.

---

## 2. Master 21 Agent Directory

| Agent Name | Primary Role | Allowed Tools | Models | Risk Level |
| :--- | :--- | :--- | :--- | :--- |
| **`ForgeGeneralAgent`** | General Q&A, business inquiries | `searchKnowledge`, `createArtifact` | `phi3:mini`, `llama3:8b` | `LOW` |
| **`CustomerResponseAgent`** | Reception, hours, triage | `searchKnowledge`, `createAppointment` | `phi3:mini`, `llama3:8b` | `LOW` |
| **`CustomerSupportAgent`** | Ticket resolution, helpdesk | `searchKnowledge`, `updateCRM` | `llama3:8b`, `mistral:7b` | `MEDIUM` |
| **`SalesAgent`** | Value proposals, pitches | `searchKnowledge`, `createArtifact` | `llama3:8b`, `command-r:35b` | `MEDIUM` |
| **`LeadQualificationAgent`** | Prospect research, scoring | `searchWeb`, `createLead` | `phi3:mini`, `llama3:8b` | `LOW` |
| **`WebsiteBuilderAgent`** | HTML5/Tailwind synthesis | `runSandboxBuild`, `runTests`, `createArtifact` | `qwen2.5-coder:7b`, `deepseek-coder:6.7b` | `MEDIUM` |
| **`WebsiteAuditAgent`** | Technical facts, conversion audit | `fetchWebsite`, `analyzeImage`, `createArtifact` | `llama3:8b`, `llava:7b` | `LOW` |
| **`CodingAgent`** | Backend scripts, schemas | `runTests`, `createArtifact` | `deepseek-coder:6.7b`, `qwen3-coder` | `MEDIUM` |
| **`ResearchAgent`** | Multi-source market analysis | `searchWeb`, `readDocument`, `createArtifact` | `llama3:8b`, `command-r:35b` | `LOW` |
| **`VisionAgent`** | Screenshot & layout analysis | `analyzeImage`, `createArtifact` | `llava:7b`, `llama3:8b` | `LOW` |
| **`VoiceAgent`** | Conversational telephony turns | `createVoiceSession`, `searchKnowledge` | `phi3:mini`, `llama3:8b` | `LOW` |
| **`BusinessPlanAgent`** | Multi-section business plans | `searchKnowledge`, `createArtifact` | `llama3:8b`, `command-r:35b` | `MEDIUM` |
| **`MarketingAgent`** | Ad campaigns, email funnels | `searchKnowledge`, `createArtifact` | `llama3:8b`, `mistral:7b` | `LOW` |
| **`FinancialAgent`** | Deterministic calculations | `calculateFinance`, `createArtifact` | `llama3:8b`, `phi3:mini` | `LOW` |
| **`SEOAgent`** | Meta tags, keywords, SERP | `fetchWebsite`, `createArtifact` | `llama3:8b` | `LOW` |
| **`CompetitorAnalysisAgent`**| Rival matrix, price benchmark | `searchWeb`, `createArtifact` | `llama3:8b`, `command-r:35b` | `LOW` |
| **`DocumentAgent`** | Formal contracts, policies | `readDocument`, `createArtifact` | `llama3:8b`, `command-r:35b` | `LOW` |
| **`AutomationAgent`** | Outbound messages, webhooks | `sendWhatsApp`, `sendEmail`, `sendSMS`, `updateCRM` | `llama3:8b`, `phi3:mini` | `HIGH` (Approval Req) |
| **`AIEmployeeGeneratorAgent`**| Turnkey employee blueprints | `createArtifact`, `runTests` | `llama3:8b`, `command-r:35b` | `MEDIUM` |
| **`VoiceEmployeeGeneratorAgent`**| Telephony agent configs | `createArtifact`, `createVoiceSession` | `llama3:8b` | `MEDIUM` |
| **`LeadEmployeeGeneratorAgent`** | Automated lead researcher bots | `createArtifact`, `createLead` | `llama3:8b` | `MEDIUM` |
