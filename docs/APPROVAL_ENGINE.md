# Rine Forge Systems V5 — Human Approval Gate & Risk Engine

## 1. Overview

The `HumanApprovalGate` prevents autonomous AI agents from executing consequential, irreversible, or externally visible actions without human oversight.

Actions are classified across **4 Risk Tiers**:

| Tier | Classification | Permitted Actions | Approval Requirement |
| :--- | :--- | :--- | :--- |
| **`LOW`** | Read-only & Drafts | Search knowledge, read files, draft copy, calculate finance | Auto-Executed |
| **`MEDIUM`** | Internal Artifacts | Create website preview, generate business plan, save lead | Auto-Executed with Audit |
| **`HIGH`** | External Outreach | Send WhatsApp message, send marketing email, update CRM, book calendar | **Human Approval Required** |
| **`CRITICAL`**| Irreversible / Sensitive | Financial transactions, record purging, security setting changes | **Human Approval Required** |

---

## 2. Queue Lifecycle & Architecture

1. When a task requests a consequential tool (e.g. `sendWhatsApp`):
   - The `ToolPermissionEngine` marks the action as `REQUIRES_APPROVAL`.
   - `HumanApprovalGate.create_request()` stores an `ApprovalRequest` record with `PENDING` status.
   - The orchestrator responds with status `APPROVAL_PENDING`.
2. The operator reviews the pending request in the **Workbench Approval Queue UI** or via API (`GET /api/v1/intelligence/approvals`).
3. The operator can:
   - **Approve:** Resolves the request with `status: "APPROVED"`. The action is executed.
   - **Reject:** Resolves the request with `status: "REJECTED"`. The action is aborted safely.
