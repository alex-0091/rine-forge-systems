# Rine Forge Systems V5 — Project Memory & Epistemological State

## 1. Overview

`ForgeProjectMemory` preserves business continuity across conversation turns, workbench sessions, and autonomous agent tasks within a workspace.

Crucially, the memory store enforces **epistemological boundaries**: it strictly distinguishes between hard facts provided by the client and tentative suggestions produced by an AI model.

---

## 2. Epistemological Fact Classification

Every piece of remembered data is tagged with a `FactProvenance` level:

1. **`USER_PROVIDED`**: Explicitly provided by the business owner (e.g. "We only use blue and ivory for our brand"). Authoritative.
2. **`VERIFIED`**: Confirmed by an automated test, build check, or runtime execution (e.g. valid HTML5 doctype or verified phone number).
3. **`APPROVED`**: Explicitly confirmed or approved by an operator in the Workbench UI.
4. **`AI_GENERATED`**: Synthesized by an AI model during execution (e.g. drafted headline or suggested marketing copy).
5. **`AI_INFERRED`**: Inferred by an AI model (e.g. "Customer may prefer afternoon appointments"). Tentative.

---

## 3. Strict Boundary Guarantee

When `ContextBuilder` prepares prompt context:
- `USER_PROVIDED`, `VERIFIED`, and `APPROVED` items are placed in `[SECTION: BUSINESS]` under `AUTHORITATIVE BUSINESS FACT`.
- `AI_INFERRED` and unapproved `AI_GENERATED` items are placed in `[SECTION: KNOWLEDGE]` under `MODEL INFERENCE (Subject to verification)`.

**Under no circumstances is an AI inference allowed to silently become an authoritative business fact.**
