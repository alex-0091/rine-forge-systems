# Rine Forge Systems V5 — Verification Engine & Self-Repair Loop

## 1. Overview

The `ForgeVerifier` is the authoritative post-execution gatekeeper in the Forge Intelligence Fabric. No deliverable is committed to the workspace artifact store or returned to the customer without passing verification.

```text
              [ Agent Execution ]
                      │
                      ▼
             [ ForgeVerifier ]
            (9 Check Categories)
                      │
         ┌────────────┴────────────┐
         ▼                         ▼
      [ PASS ]                  [ FAIL ]
         │                         │
         ▼                         ▼
   Create Artifact        [ Self-Repair Loop ]
                            (Diagnose -> Fix)
                                   │
                                   ▼
                            [ Re-Verify ]
                         (Max 2 Repair Loops)
```

---

## 2. Nine Verification Categories

1. **`SCHEMA`**: Confirms payload is non-null, matches required JSON keys, and conforms to expected structure.
2. **`FACTUALITY`**: Ensures customer response agents do not invent prices, doctor schedules, or clinical guarantees without grounded source facts.
3. **`BUSINESS_RULES`**: Validates that business operating hours and verified services are strictly respected.
4. **`SECURITY`**: AST syntax inspection prohibiting code injections (`<script>eval()`), command execution (`os.system`), and path traversal (`../`).
5. **`BUILD`**: Confirms valid HTML5 structure (`<!DOCTYPE html>`, viewport meta tag, closing tags).
6. **`TEST`**: Verifies automated test suite passes on code or behavioral artifacts.
7. **`CALCULATION`**: Independent mathematical verification (Gross Profit must equal Revenue - COGS). Disallows arithmetic hallucination.
8. **`POLICY`**: Enforces local data retention and multi-tenant isolation boundaries.
9. **`QUALITY`**: Evaluates response length, tone, and absence of generic chatbot boilerplate.

---

## 3. Automated Self-Repair Loop

When verification fails:
1. `ForgeVerifier` outputs structured `errors` and a `diagnostics` dictionary identifying the exact failure reason.
2. The orchestrator triggers `_attempt_self_repair()`.
3. Targeted repairs are applied:
   - **Calculation Errors:** Recalculates gross profit and margins using exact formulas.
   - **Broken Markup:** Injects missing HTML5 doctype or viewport headers.
   - **Hallucinated Pricing:** Replaces invented dollar amounts with transparent quote disclosures.
4. Re-verification is attempted up to `MAX_REPAIR_ATTEMPTS = 2`.
5. If issues persist after 2 attempts, the system returns a truthful `FAILED` status with actionable error details rather than crashing or looping indefinitely.
