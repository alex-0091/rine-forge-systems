# Rine Forge AI Business Workbench (Phase AQ & AR)

## 1. Overview & Objective
The **Rine Forge AI Business Workbench** (`/workbench`) transforms Rine Forge Systems from an automated communication tool into an end-to-end autonomous business initiative execution platform. 

Instead of an endless conversational chatbot, the Workbench operates as a goal-oriented engineering console:
1. **Intakes Natural-Language Objectives**: Business owners describe their needs in plain English (e.g. *"I own a dental clinic. Build me an AI receptionist, responsive website, logo, and marketing plan"*).
2. **Decomposes & Plans Work**: Formulates structured, dependency-ordered task pipelines while strictly distinguishing **Verified Facts** from **Deductive Assumptions**.
3. **Local AI Model Routing**: Dispatches tasks through the **Rine AI Gateway** to locally installed open models (Ollama: Llama 3, Phi-3, Qwen 2.5, DeepSeek-Coder, LLaVA) with zero cloud token costs.
4. **Executes Capability Pipelines**: Generates concrete deliverables across standardized business task types.
5. **Produces Concrete Deliverables**: Websites with live responsive sandboxed previews, multi-concept parametric SVG logos, deterministic 12-month financial models, factual conversion audits, strategic marketing blueprints, and 24/7 AI employee specifications.
6. **Enforces Human-in-the-Loop Confirmation**: Consequential actions (publishing websites live, modifying CRM routes, dispatching outreach) require operator confirmation gates (`requires_confirmation=True`).

---

## 2. Dependency-Ordered Execution Stages

The `ProjectManagerAgent` decomposes complex business requests into 8 dependency-ordered stages:

1. **`BUSINESS_ANALYSIS`**: Extracts core value proposition, target customer personas, and verified services.
2. **`BRAND_DIRECTION`**: Establishes typography pairings, color palette rules, and tone guidelines.
3. **`LOGO_GENERATION`**: Synthesizes 4 distinct parametric SVG vector identity concepts.
4. **`WEBSITE_SYNTHESIS`**: Generates multi-page responsive Tailwind CSS website with live sandboxed preview.
5. **`FINANCIAL_MODEL`**: Calculates deterministic 12-month cash flow and break-even projections with zero AI arithmetic.
6. **`SEO_AND_AUDIT`**: Performs an 8-dimension UX, conversion, and performance audit.
7. **`MARKETING_PLAN`**: Builds strategic inbound acquisition and referral blueprints.
8. **`AI_RECEPTIONIST`**: Deploys voice and chat autonomous agents configured with local voice profiles and business hours.

---

## 3. Data Model & Artifact Architecture

### Relational Entities
- **`V5Project`** (`v5_projects`): Multi-tenant business initiative entity tracking overall progress and metadata.
- **`V5WorkbenchTask`** (`v5_workbench_tasks`): Discrete capability unit assigned to specific agents and local models.
- **`V5WorkbenchArtifact`** (`v5_workbench_artifacts`): Concrete deliverable persisted with code, SVG, or document content and instant download links.
- **`V5RegisteredModel`** (`v5_registered_models`): Catalog of local open models registered in Ollama.

---

## 4. Core Operational Principles

### A. Fact vs. Assumption Segregation
The Workbench never hallucinates business parameters:
- **Verified Facts**: Facts explicitly stated by the business owner (e.g., location, industry, services, hours).
- **Deductive Assumptions**: Inferences made by the planner to construct complete deliverables (e.g., target customer profiles, average ticket price ranges, standard conversion benchmarks).
- **Missing Information**: Critical details that cannot be inferred are highlighted as open items rather than fabricated.

### B. Deterministic Math for Financial Projections
AI language models are never used to do arithmetic. All formulas are executed in Python:
$$\text{Gross Profit} = \text{Revenue} - \text{COGS}$$
$$\text{Gross Margin \%} = \left(\frac{\text{Gross Profit}}{\text{Revenue}}\right) \times 100$$
$$\text{Break-Even Revenue} = \frac{\text{Fixed OPEX}}{\text{Gross Margin Ratio}}$$

### C. Sandboxed Code Generation & Live Previews
Untrusted and generated HTML/Tailwind code is isolated in sandboxed iframes (`sandbox="allow-scripts allow-same-origin"`). Direct in-browser code editing allows operators to adjust styling and markup with instant live updates.

### D. Universal Command Box ("Ask Rine Forge")
Operators can issue rapid directives at any point:
- *"Make the logo more playful"* $\to$ Invokes `BrandGeneratorAgent` with `PLAYFUL` style vectors.
- *"Audit my conversion friction"* $\to$ Triggers `WebsiteAuditAgent` 8-dimension scorecard.
- *"Recalculate cash flow with 15% COGS"* $\to$ Reruns `FinancialModelAgent` with new parameters.
