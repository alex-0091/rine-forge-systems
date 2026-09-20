# Rine Forge Systems V5 — Forge Intelligence Fabric

## 1. Overview & Vision

The **Forge Intelligence Fabric** is the cognitive orchestration layer above the AI Gateway and local model ecosystem. It turns individual open-source AI models into **ONE unified, coherent intelligence operating system**.

Business owners interact with Forge naturally without needing to know which underlying model or agent executes the task:

> **"Tell Forge what your business needs."**

```text
               ┌─────────────────────────────────────┐
               │                USER                 │
               │    ("Tell Forge what you need")     │
               └──────────────────┬──────────────────┘
                                  │
                                  ▼
               ┌─────────────────────────────────────┐
               │     FORGE INTELLIGENCE FABRIC       │
               │   (ForgeIntelligenceOrchestrator)   │
               └──────────────────┬──────────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        ▼                         ▼                         ▼
 1. Classify Task          2. Intent Engine         3. Execution Plan
 (25 Categories, 4 Tiers)  (Outputs, Side Effects)  (Steps & Safety Validation)
        │                         │                         │
        └─────────────────────────┼─────────────────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        ▼                         ▼                         ▼
 4. Select Agent           5. Model Router          6. Select Tools
 (AgentRegistry: 21)       (Local / Quality / Fast) (ForgeToolRegistry: 18)
        │                         │                         │
        └─────────────────────────┼─────────────────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        ▼                         ▼                         ▼
 7. Knowledge Router       8. Context Builder       9. Tool Permission
 (Profile, RAG, CRM)       (AUTHORITATIVE vs INFER) (ALLOW/DENY/APPROVAL)
        │                         │                         │
        └─────────────────────────┼─────────────────────────┘
                                  │
                                  ▼
                 10. Multi-Model Execution Loop
                 (Planner → Coder → Tester → Synthesizer)
                                  │
                                  ▼
                 11. Verification Engine (9 Checks)
                                  │
                     ┌────────────┴────────────┐
                     ▼                         ▼
                   PASS                       FAIL
                     │                         │
                     │                 12. Self-Repair Loop
                     │                 (Diagnose → Fix → Re-verify)
                     │                         │
                     └────────────┬────────────┘
                                  │
                                  ▼
                 13. Artifact Creation & Project Memory
                 (16 Types, Epistemological Fact Tagging)
```

---

## 2. The 13-Stage Orchestration Pipeline

1. **Classify Request:** Analyzes prompt across 25 task categories (`WEBSITE_BUILD`, `FINANCIAL_ANALYSIS`, `CUSTOMER_RESPONSE`, etc.) and determines complexity (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
2. **Determine Intent:** Identifies expected deliverable format, missing context, required tools, and external side effects.
3. **Build Execution Plan:** Compiles a step-by-step internal plan with required tool permissions.
4. **Select Agent:** Maps the request to one of 21 specialized agents from `AgentRegistry`.
5. **Select Model:** Directs request through `ModelRouter` and `ResourceGovernor` to choose the optimal local Ollama model.
6. **Select Tools:** Scopes allowed tools from the 18 registered functions in `ForgeToolRegistry`.
7. **Retrieve Knowledge:** Dynamically pulls only necessary data domains (business profile, RAG knowledge, CRM) via `KnowledgeRouter`.
8. **Build Structured Context:** Formats an explicitly labeled 8-section context (`SYSTEM`, `BUSINESS`, `USER`, `CONVERSATION`, `KNOWLEDGE`, `TOOLS`, `TASK`, `POLICY`), enforcing clear separation between `AUTHORITATIVE BUSINESS FACT` and `MODEL INFERENCE`.
9. **Enforce Tool Permissions & Approval Gates:** Evaluates permissions; halts consequential actions (e.g. WhatsApp messaging, external emails) at `HumanApprovalGate`.
10. **Execute Agent:** Runs execution loop with support for multi-model chaining.
11. **Verify Deliverable:** Runs 9 validation checks (syntax, security, arithmetic, factuality, policy) via `ForgeVerifier`.
12. **Self-Repair Loop:** Automatically diagnoses verification errors, applies fixes, and re-evaluates up to 2 times without infinite loops.
13. **Commit Artifact & Learn:** Saves deliverable to `ArtifactEngine` and records epistemologically tagged facts in `ForgeProjectMemory`.

---

## 3. Fast Paths

- **Customer Inquiries & Hours:** Immediate low-latency lookup from business knowledge without heavy multi-agent planning.
- **Voice Response Turns:** Ultra-low latency spoken turn state machine with streaming STT and TTS.
