# OWAIS OUTREACH AI

**Autonomous B2B Lead Discovery, Business Intelligence, Personalized Outreach & Reply Assistant**

Production-grade AI client acquisition platform built for **Owais AI**. Helping acquire real paying clients by discovering high-value small businesses, conducting deep digital research, identifying concrete operational bottlenecks, scoring leads (0–100), generating anti-hallucinatory personalized outreach, enforcing controlled sending limits with an emergency Kill Switch, classifying inbound replies with Google Gemini, and escalating high-intent conversations directly to Owais.

---

## Key Features

1. **Modular Lead Discovery**: Multi-source ingestion (Curated Directories, Web Directories, CSV Import) with deduplication, domain normalization, and format validation.
2. **Deep Website & Tech Analyzer**: Inspects CMS, booking systems (Calendly, Acuity, SynXis), live chat widgets, contact forms, FAQs, and verified facts.
3. **Pain-Point & AI Opportunity Scorer**: Connects observed friction to tailored AI solutions (AI Receptionists, Lead Qualification Engines, Workflow Automation).
4. **0–100 Weighted Lead Scoring**: Comprehensive scoring based on Business Fit, Pain Point Severity, AI Opportunity, Ability to Pay, Decision Maker, and Presence.
5. **Anti-Hallucinatory Outreach Generator**: Cold emails (60–150 words) strictly grounded in verified facts, with automated quality assessment and jurisdictional compliance checks.
6. **Rate Control & Global Kill Switch**: Per-day, per-hour, and domain-level rate throttling with randomized jitter and an emergency 1-click Stop All Outreach switch.
7. **Compliance & Suppression Engine**: Automatic opt-out detection, hard-bounce suppression, and country policy compliance for USA, UK, Canada, Australia, NZ, Singapore, UAE, and EU.
8. **Inbound Reply Classifier & Escalation Center**: Gemini-powered intent classification (`HIGH_VALUE_OPPORTUNITY`, `POSITIVE_INTEREST`, `PRICE_REQUEST`, etc.) with instant `🚨 OWAIS: HUMAN ACTION REQUIRED` alerts.
9. **Public Portfolio Website & Interactive AI Demo**: Public showcase featuring **Oracle AI**, **Plot Twist**, and **Bright Star Grammar School**, plus an interactive 24/7 AI Receptionist demo across multiple industries.

---

## Quickstart

### 1. Install & Configure
```bash
# Clone repository and enter directory
python -m venv venv
.\venv\Scripts\activate      # Windows (or source venv/bin/activate on Linux/Mac)
pip install -r requirements.txt
copy .env.example .env
```

### 2. Run Automated Test Suite
```bash
pytest
```

### 3. Start Backend Server
```bash
uvicorn backend.app.main:app --reload --port 8000
```
Interactive Swagger API documentation: `http://localhost:8000/docs`

### 4. Start Frontend Dashboard & Public Website
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` to access the Dashboard, Lead Explorer, Campaign Wizard, Conversation Inbox, and Public Portfolio Showcase.

---

## Documentation Index
- [Architecture & System Design](docs/ARCHITECTURE.md)
- [Setup & Installation](docs/SETUP.md)
- [Database Schema](docs/DATABASE.md)
- [Email Deliverability & DNS](docs/EMAIL_SETUP.md)
- [Gemini AI & Cost Governance](docs/GEMINI.md)
- [Campaign Management](docs/CAMPAIGNS.md)
- [Compliance Policies](docs/COMPLIANCE.md)
- [Production Deployment](docs/DEPLOYMENT.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md)
