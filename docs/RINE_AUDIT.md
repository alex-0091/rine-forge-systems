# RINE FORGE SYSTEMS — COMPREHENSIVE PRODUCTION AUDIT & SYSTEM DOSSIER

> **Document Path**: `/docs/RINE_AUDIT.md`  
> **Audit Date**: September 17, 2026  
> **Platform Version**: Rine Forge Systems V5 (Autonomous Client Acquisition OS & AI Employee Platform)  
> **Repository Root**: `c:\Users\Shani Khan\Desktop\Outreach AI`  
> **Target Environment**: FastAPI + SQLite/PostgreSQL (Backend) | React 19 + Tailwind CSS + Vite (Frontend)

---

## TABLE OF CONTENTS
1. [Complete Directory Structure](#1-complete-directory-structure)
2. [Every Page and Route](#2-every-page-and-route)
3. [Every Component](#3-every-component)
4. [Every API Route](#4-every-api-route)
5. [Every Server Action](#5-every-server-action)
6. [Every Database Interaction](#6-every-database-interaction)
7. [Every External API Integration](#7-every-external-api-integration)
8. [Every Environment Variable Referenced](#8-every-environment-variable-referenced)
9. [Every Hardcoded API Key or Secret](#9-every-hardcoded-api-key-or-secret)
10. [Every Mock / Demo / Fake Response](#10-every-mock--demo--fake-response)
11. [Every TODO & Code Stub](#11-every-todo--code-stub)
12. [Every Broken Link & Navigation Trap](#12-every-broken-link--navigation-trap)
13. [Every Button That Currently Does Nothing](#13-every-button-that-currently-does-nothing)
14. [Every Form That Does Not Actually Submit](#14-every-form-that-does-not-actually-submit)
15. [Every API Call Without Error Handling](#15-every-api-call-without-error-handling)
16. [Every Loading State Missing](#16-every-loading-state-missing)
17. [Every Empty State Missing](#17-every-empty-state-missing)
18. [Every Mobile & Responsive Problem](#18-every-mobile--responsive-problem)
19. [Every Accessibility Problem](#19-every-accessibility-problem)
20. [Every Console & Runtime Error Detected](#20-every-console--runtime-error-detected)
21. [Every Security Problem & Vulnerability](#21-every-security-problem--vulnerability)
22. [Every Unused or Unnecessary Dependency](#22-every-unused-or-unnecessary-dependency)
23. [Every Outdated or Risky Dependency](#23-every-outdated-or-risky-dependency)
24. [Every Backend Capability Currently Missing](#24-every-backend-capability-currently-missing)
---
[A. WHAT ACTUALLY WORKS](#a-what-actually-works)  
[B. WHAT IS MOCKED](#b-what-is-mocked)  
[C. WHAT IS BROKEN](#c-what-is-broken)  
[D. WHAT IS MISSING](#d-what-is-missing)  
[E. SECURITY RISKS](#e-security-risks)  
[F. BACKEND BUILD PLAN](#f-backend-build-plan)  

---

## 1. Complete Directory Structure

```text
c:\Users\Shani Khan\Desktop\Outreach AI\
├── .env                              # Production environment variables (Contains active credentials)
├── .env.example                      # Configuration template
├── .gitignore                        # Git exclusion rules
├── README.md                         # Project documentation
├── outreach_ai.db                    # Local SQLite production database (untracked)
├── package.json                      # Root npm orchestrator
├── pytest.ini                        # Pytest configuration
├── render.yaml                       # Render.com deployment manifest
├── requirements.txt                  # Python dependencies
├── vercel.json                       # Vercel Serverless routing & rewrites
│
├── api/
│   └── index.py                      # Vercel Python WSGI/ASGI entrypoint bridge
│
├── backend/
│   ├── __init__.py
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config.py                 # Pydantic BaseSettings & environment variables
│   │   ├── database.py               # Async SQLAlchemy engine, sessionmaker & Base
│   │   ├── database_seed.py          # Database seeder (V5 internal tenant, clinic & prospects)
│   │   ├── kill_switch.py            # Global outreach pause/resume state machine
│   │   ├── main.py                   # FastAPI master application & router aggregator
│   │   │
│   │   ├── ai/                       # LLM Orchestration Layer
│   │   │   ├── cost_tracker.py       # Token counting & billing telemetry
│   │   │   ├── hallucination_firewall.py # Output validation & safety filters
│   │   │   ├── llm_provider.py       # Provider abstraction (Mock, Gemini, OpenAI)
│   │   │   ├── openai_provider.py    # Native OpenAI SDK client integration
│   │   │   ├── orchestrator_v5.py    # V5 autonomous agent execution engine
│   │   │   ├── personalization_scorer.py # Email personalization grading
│   │   │   ├── pipeline.py           # Multi-step LLM chain pipeline
│   │   │   ├── prompts.py            # System prompts & generation templates
│   │   │   ├── provider_abstraction.py # Provider interface contracts
│   │   │   └── tool_registry.py      # AI tool definitions & executable functions
│   │   │
│   │   ├── analytics/
│   │   │   └── conversion_intelligence.py # Deliverability watchdog & circuit breakers
│   │   │
│   │   ├── api/                      # Legacy V4 API Routers
│   │   │   ├── campaigns.py          # V4 campaign management
│   │   │   ├── compliance.py         # V4 suppression & audit log endpoints
│   │   │   ├── dashboard.py          # V4 metrics & operator daily tasks
│   │   │   ├── inbox.py              # V4 conversation threads & reply simulation
│   │   │   ├── kill_switch.py        # Global emergency kill-switch endpoints
│   │   │   ├── leads.py              # V4 lead explorer, enrichment & scoring
│   │   │   ├── outreach.py           # V4 message queue & manual action bar
│   │   │   ├── public.py             # Public portfolio, interactive demos & contact booking
│   │   │   └── receptionist.py       # V4 receptionist chat & knowledge base
│   │   │
│   │   ├── api/v1/                   # Production V5 Multi-Tenant API Routers
│   │   │   ├── __init__.py           # V5 Router aggregation master
│   │   │   ├── admin.py              # Multi-tenant overview & system health
│   │   │   ├── ai_employees.py       # Autonomous worker CRUD & inbound chat
│   │   │   ├── analytics.py          # V5 platform metrics & token usage logs
│   │   │   ├── appointments.py       # Calendar scheduling, availability & cancellations
│   │   │   ├── auth.py               # JWT signup, login & identity resolution
│   │   │   ├── automations.py        # Trigger/condition/action workflow rules
│   │   │   ├── businesses.py         # Tenant registration & profile management
│   │   │   ├── conversations.py      # V5 customer conversations & staff replies
│   │   │   ├── customers.py          # V5 customer CRM records
│   │   │   ├── health.py             # Infrastructure & database health checks
│   │   │   ├── integrations.py       # WhatsApp, Stripe, Google Calendar connectors
│   │   │   ├── knowledge.py          # Document RAG ingestion & semantic chunking
│   │   │   ├── lead_engine.py        # Modules 41-56 Lead Engine Master API (20 routes)
│   │   │   ├── leads.py              # V5 inbound leads & qualification
│   │   │   ├── services.py           # Business service catalog & pricing
│   │   │   └── staff.py              # Staff schedules & role assignment
│   │   │
│   │   ├── appointments/
│   │   │   └── engine.py             # Slot calculation & double-booking prevention
│   │   │
│   │   ├── auth/
│   │   │   ├── dependencies.py       # JWT auth & tenant isolation dependencies
│   │   │   ├── security.py           # Password hashing (bcrypt) & JWT encoding
│   │   │   └── service.py            # User registration & credential verification
│   │   │
│   │   ├── automations/
│   │   │   ├── __init__.py
│   │   │   └── engine.py             # Event-driven rule evaluation engine
│   │   │
│   │   ├── channels/
│   │   │   ├── __init__.py
│   │   │   ├── contract.py           # Channel interface definitions
│   │   │   └── whatsapp/
│   │   │       ├── parser.py         # Meta webhook payload normalization
│   │   │       ├── router.py         # Webhook verification & receipt endpoint
│   │   │       └── service.py        # Outbound Meta Graph API client
│   │   │
│   │   ├── compliance/
│   │   │   ├── engine.py             # CAN-SPAM, GDPR & TCPA compliance rules
│   │   │   ├── suppression.py        # Legacy suppression checking
│   │   │   ├── suppression_service.py # V5 multi-tenant suppression blacklist
│   │   │   └── country_policies/
│   │   │       ├── USA.py            # CAN-SPAM specific regulatory checks
│   │   │       ├── __init__.py
│   │   │       └── international.py  # Global compliance constraints
│   │   │
│   │   ├── discovery/                # Lead Engine Discovery Pipeline
│   │   │   ├── base.py               # Lead source base class
│   │   │   ├── deduplication_v5.py   # Multi-attribute deduplication & merge
│   │   │   ├── deduplicator.py       # Legacy deduplicator
│   │   │   ├── engine.py             # Legacy discovery engine
│   │   │   ├── geo_service.py        # Geographic radius & service area filtering
│   │   │   ├── intent_discovery.py   # Anti-Health Inference Guard & intent scorer
│   │   │   ├── normalizer.py         # Lead payload normalization
│   │   │   ├── opportunity_analyzer.py # Tailored AI automation angle detector
│   │   │   ├── pipeline_v5.py        # 13-stage autonomous pipeline coordinator
│   │   │   ├── providers_v5.py       # 10 official lead source providers
│   │   │   ├── validator.py          # DNS & MX validation heuristics
│   │   │   ├── website_analysis.py   # Grounded website scraper & DOM inspection
│   │   │   └── sources/
│   │   │       ├── curated.py        # Benchmark business seeds
│   │   │       └── directory.py      # Public business directory scraper
│   │   │
│   │   ├── inbox/                    # Inbound Email & Messaging Pipeline
│   │   │   ├── auto_responder.py     # Autonomous inquiry responder
│   │   │   ├── buying_signals.py     # High-intent keyword detection
│   │   │   ├── escalation.py         # Human intervention triaging
│   │   │   ├── learning_loop.py      # Human edit diff tracking & learning store
│   │   │   ├── reply_classifier.py   # Intent classification heuristics
│   │   │   ├── reply_generator.py    # LLM-guided suggested response generator
│   │   │   ├── reply_intelligence_v5.py # 5-class intent classifier & auto-suppression
│   │   │   └── reply_monitor.py      # Inbound email polling & processing
│   │   │
│   │   ├── intelligence/             # Grounding & Heuristics
│   │   │   ├── evidence.py           # Observable fact citations
│   │   │   ├── lead_scorer.py        # 0-100 composite lead scorer
│   │   │   ├── offer_matcher.py      # Product/solution alignment
│   │   │   ├── opportunity_scorer.py # Operational bottleneck ranking
│   │   │   └── pain_point_engine.py  # Friction analysis from verified facts
│   │   │
│   │   ├── knowledge/
│   │   │   └── rag_service.py        # Vector search & document chunking
│   │   │
│   │   ├── leads/
│   │   │   ├── engine.py             # Lead enrichment pipeline
│   │   │   └── scoring_v5.py         # V5 multi-factor scoring formula
│   │   │
│   │   ├── models/                   # SQLAlchemy Authoritative Data Models
│   │   │   ├── __init__.py
│   │   │   ├── business.py           # V4 Business, Contact, Research models
│   │   │   ├── campaign.py           # V4 Campaign, Member, OutreachMessage models
│   │   │   ├── compliance.py         # V4 AuditLog, Suppression, SystemState models
│   │   │   ├── inbox.py              # V4 Conversation, Reply, SystemAlert models
│   │   │   ├── intelligence.py       # V4 Evidence, PainPoint, Opportunity models
│   │   │   ├── lead_engine.py        # V5 Lead Engine Prospect schemas (Modules 41-56)
│   │   │   ├── pipeline.py           # V4 Client, Proposal, Payment models
│   │   │   ├── receptionist.py       # V4 Receptionist conversation & handoff models
│   │   │   └── v5.py                 # Authoritative multi-tenant platform models
│   │   │
│   │   ├── notifications/
│   │   │   └── base.py               # Email & Webhook alert dispatcher
│   │   │
│   │   ├── outreach/                 # Outbound Messaging Engine
│   │   │   ├── email_provider.py     # V4 DryRun & SMTP email providers
│   │   │   ├── email_provider_v5.py  # RFC 2822 email provider with tracking pixel
│   │   │   ├── engine_v5.py          # V5 Review Mode gateway & compliance gates
│   │   │   ├── followup.py           # V4 automated follow-up sequences
│   │   │   ├── followup_engine.py    # V5 Step 0, 1, 2 sequence scheduler
│   │   │   ├── outreach_generator.py # Personalized draft generator with citations
│   │   │   ├── queue.py              # V4 sending queue worker
│   │   │   ├── rate_limiter.py       # V4 hourly/daily send throttler
│   │   │   ├── rate_limiter_v5.py    # V5 72h cooldown & velocity caps
│   │   │   └── scheduler.py          # Send window & time zone scheduler
│   │   │
│   │   ├── receptionist/             # AI Receptionist Service
│   │   │   ├── __init__.py
│   │   │   ├── intent.py             # Clinical triage & booking intent classifier
│   │   │   ├── knowledge.py          # Clinic verified knowledge store
│   │   │   ├── orchestrator.py       # Multi-turn conversational state machine
│   │   │   └── tools.py              # Calendar availability & emergency handoffs
│   │   │
│   │   ├── research/                 # Digital Footprint Scrapers
│   │   │   ├── engine.py             # Multi-source intelligence collector
│   │   │   ├── social_analyzer.py    # Public metadata inspector
│   │   │   └── website_analyzer.py   # DOM parsing for booking widgets & chat tools
│   │   │
│   │   └── schemas/
│   │       └── schemas.py            # Pydantic request/response models
│   │
│   └── eval/
│       ├── human_experience_eval.py  # Benchmark prompt evaluation
│       └── v4_human_experience_evaluation.md
│
├── docs/                             # Comprehensive Architecture Specifications
│   ├── ARCHITECTURE.md
│   ├── CAMPAIGNS.md
│   ├── COMPLIANCE.md
│   ├── DATABASE.md
│   ├── DEPLOYMENT.md
│   ├── EMAIL_SETUP.md
│   ├── GEMINI.md
│   ├── SETUP.md
│   ├── SYSTEM_AUDIT.md
│   ├── TROUBLESHOOTING.md
│   ├── V5_AI.md
│   ├── V5_API.md
│   ├── V5_ARCHITECTURE.md
│   ├── V5_DATABASE.md
│   ├── V5_DEPLOYMENT.md
│   ├── V5_INTEGRATIONS.md
│   ├── V5_LEAD_ENGINE.md
│   ├── V5_SECURITY.md
│   ├── V5_STATUS.md
│   ├── V5_SYSTEM_AUDIT.md
│   ├── V5_TESTING.md
│   └── character_design_system_and_video_pipeline.md
│
├── frontend/
│   ├── index.html                    # Single Page Application entrypoint
│   ├── package.json                  # React 19, Lucide, Tailwind, Vite dependencies
│   ├── postcss.config.js
│   ├── tailwind.config.js            # Custom dark theme, typography & colors
│   ├── vite.config.js                # Vite build configuration & chunk limits
│   ├── vercel.json                   # Static frontend routing overrides
│   │
│   ├── public/
│   │   ├── robots.txt
│   │   ├── sitemap.xml
│   │   └── videos/
│   │
│   └── src/
│       ├── App.jsx                   # Master root layout (Dual: Console vs Public Site)
│       ├── index.css                 # Tailwind directives & dark styling
│       ├── main.jsx                  # React 19 root mounting
│       │
│       ├── components/               # Core Application Views
│       │   ├── AIToolsForgeView.jsx  # 2,403-line client-side mini-tool suite (18 tools)
│       │   ├── AnalyticsView.jsx     # AI token usage & delivery telemetry
│       │   ├── CampaignsView.jsx     # Outreach campaign orchestrator
│       │   ├── ComplianceView.jsx    # Audit logs & suppression table
│       │   ├── DashboardView.jsx     # Platform KPI metrics & quick actions
│       │   ├── FloatingAIAssistant.jsx # Contextual operator floating copilot
│       │   ├── InboxView.jsx         # Conversation inbox & auto-responder test
│       │   ├── InteractiveVideoPlayerModal.jsx # Video modal with controls
│       │   ├── LeadsView.jsx         # V5 Lead Explorer & Sourcing Transparency Drawer
│       │   ├── OutreachQueueView.jsx # Message review queue & dispatch controls
│       │   ├── PaymentPortalModal.jsx # Deposit modal with simulated receipts
│       │   ├── PipelineView.jsx      # 8-Stage V5 Funnel Kanban & Conversion Ribbon
│       │   ├── PublicPortfolioView.jsx # Public marketing site & sub-route router
│       │   └── TechLogos.jsx         # Tech stack partner logos
│       │
│       ├── components/app/           # SaaS Platform Portal Components (Experience B)
│       │   ├── AdminPanel.jsx        # Multi-tenant overview & system health
│       │   ├── AppApprovals.jsx      # Staff approval queue for AI actions
│       │   ├── AppBilling.jsx        # Stripe billing portal & subscription tiers
│       │   ├── AppControlCenter.jsx  # Kill-switch, safety thresholds & latency logs
│       │   ├── AppDashboard.jsx      # Tenant overview metrics & quick links
│       │   ├── AppIntegrations.jsx   # WhatsApp, Stripe, Calendar connector cards
│       │   ├── AppKnowledgeBase.jsx  # Document upload & knowledge chunk table
│       │   ├── AppLayout.jsx         # Sidebar navigation for tenant portal
│       │   ├── AppSystemBuilder.jsx  # AI employee creation wizard
│       │   └── OnboardingWizard.jsx  # 4-step tenant setup wizard
│       │
│       ├── components/forge/         # Public Marketing & Demo Sections (Experience A)
│       │   ├── AboutSection.jsx      # Agency philosophy & origin
│       │   ├── AgentNetworkVisualizer.jsx # Interactive multi-agent nodal canvas
│       │   ├── AgentsSection.jsx     # AI employee roster cards
│       │   ├── AuditPage.jsx         # Inbound audit request portal form
│       │   ├── AutonomousReactionBanner.jsx # Real-time reactive notification toast
│       │   ├── CaseStudiesSection.jsx # Client metrics & ROI proof
│       │   ├── FaqSection.jsx        # Accordion FAQ
│       │   ├── FinalCtaSection.jsx   # Closing conversion section
│       │   ├── ForgeAiLab.jsx        # Experimental AI lab environment
│       │   ├── ForgeExperienceView.jsx # Full-screen interactive OS preview
│       │   ├── ForgeFooter.jsx       # Public website footer & disclosures
│       │   ├── ForgeHero.jsx         # Above-the-fold value proposition
│       │   ├── ForgeHumanControl.jsx # Human-in-the-loop audit explanation
│       │   ├── ForgeNavbar.jsx       # Public navigation bar with audio toggle
│       │   ├── GlobalTryForgeModal.jsx # Instant modal for trying AI workers
│       │   ├── HowItWorksSection.jsx # 4-step architectural timeline
│       │   ├── IndustriesSection.jsx # Industry specific capability matrix
│       │   ├── IndustryDetailPage.jsx # Dynamic industry deep-dive view
│       │   ├── InteractiveAppointmentDemo.jsx # Simulated interactive calendar booking
│       │   ├── InteractiveDocumentEngineDemo.jsx # Simulated document clause extraction
│       │   ├── InteractiveEmailAgentDemo.jsx # Simulated email triage & classification
│       │   ├── LiveActivityStream.jsx # Simulated real-time platform event ticker
│       │   ├── LiveSystemsShowcase.jsx # Filterable showcase of all 8 production systems
│       │   ├── OracleShowcaseSection.jsx # Live BTC price candle & prediction telemetry
│       │   ├── PersonalizedIndustryView.jsx # Dynamic landing tailored to user industry
│       │   ├── PricingSection.jsx    # Transparent agency pricing tiers
│       │   ├── ProblemSection.jsx    # Operational payroll bottleneck analysis
│       │   ├── RoiCalculatorSection.jsx # Interactive staff savings ROI calculator
│       │   ├── SecuritySection.jsx   # Zero-leakage & hallucination firewall proof
│       │   ├── SolutionDetailPage.jsx # Dynamic solution deep-dive view
│       │   ├── SystemDetailPage.jsx   # Deep-dive specification for each system
│       │   ├── SystemsMarketplace.jsx # Grid of deployable AI systems
│       │   ├── TenSecondDemoModal.jsx # 10-second instant system previews
│       │   ├── WhatWeBuildSection.jsx # Core agency offerings
│       │   ├── WhyForgeSection.jsx   # Comparison table vs traditional SaaS
│       │   └── WorkflowModal.jsx     # Visual flowchart modal
│       │
│       ├── components/forge/v2/      # V2 High-Converting Platform Components
│       │   ├── AutomationStackArchitecture.jsx # Visual multi-tier architecture diagram
│       │   ├── BeforeAfterComparison.jsx # Interactive before vs after slider
│       │   ├── BuiltForRealBusinessWork.jsx # High-volume transactional proof
│       │   ├── BuiltWithModernTechnology.jsx # Tech stack badge showcase
│       │   ├── ChaosToOrderStory.jsx # Narrative visual of workflow automation
│       │   ├── DontReadJustWatch.jsx # Visual video player CTA
│       │   ├── ForgeCharacterUniverse.jsx # Avatar representations of AI agents
│       │   ├── ForgeCommandCenter.jsx # Interactive terminal command runner
│       │   ├── ForgeDemoVideoPlayer.jsx # Multi-clip animated HTML5 video player
│       │   ├── ForgeV2HeroScene.jsx  # High-impact animated hero section
│       │   ├── ForgeWorkforceMap.jsx # Interactive agent department map
│       │   ├── HowItWorksFlowSection.jsx # Step-by-step onboarding visualizer
│       │   ├── HowMuchCouldYouAutomate.jsx # Interactive slider audit tool
│       │   ├── IndustrySolutionsSection.jsx # Carousel of vertical-specific solutions
│       │   ├── InteractiveAiDemoWidget.jsx # Embedded multi-worker chat widget
│       │   ├── LiveAiReceptionistDemoSection.jsx # Embedded front-desk receptionist demo
│       │   ├── MeetAiEmployeesSection.jsx # Persona profiles (Elena, Marcus, Aria, Kael)
│       │   ├── OmnichannelSection.jsx # WhatsApp, SMS, Web, Email unified diagram
│       │   ├── ProcessTimelineSection.jsx # 3-day staging & launch milestone timeline
│       │   ├── RealSystemsProofSection.jsx # Verified client production metrics
│       │   ├── RoiRevenueCalculatorSection.jsx # Interactive revenue lift calculator
│       │   ├── SimpleAuditContactModal.jsx # Quick lead-capture modal
│       │   ├── StrongCtaSection.jsx  # High-urgency booking CTA
│       │   ├── TransformationSection.jsx # Operational metric transformations
│       │   ├── TrustAndProofSection.jsx # Security certifications & guarantees
│       │   ├── TrustAndTechStack.jsx # Infrastructure reliability disclosures
│       │   ├── VisualIndustrySelector.jsx # Clickable industry picker
│       │   ├── WatchItHappenModal.jsx # Video case study modal
│       │   ├── WatchItWorkSection.jsx # Live walkthrough showcase
│       │   ├── WhatCouldYourBusinessAutomate.jsx # Interactive departmental audit
│       │   ├── WhatForgeCanDo.jsx    # Grid of practical business workflows
│       │   └── WhyForgeSection_v2.jsx # Architectural comparison vs Zapier/Make
│       │
│       ├── components/forge/v2/videoLayer/ # Dynamic Motion & Scene Layers
│       │   ├── AIReceptionistDemo.jsx # Visual receptionist video scene
│       │   ├── AISalesDemo.jsx        # Visual sales pipeline video scene
│       │   ├── BeforeAfterVisual.jsx # Split-screen comparison scene
│       │   ├── ForgeProcessingDemo.jsx # High-speed transaction processing scene
│       │   ├── ForgeTransition.jsx   # Smooth visual scene transition layer
│       │   ├── ForgeVideoExperienceLayer.jsx # Scene compositor & timeline controller
│       │   └── ProblemScene.jsx      # Bottleneck problem depiction scene
│       │
│       ├── components/forge/v4/      # V4 Tactile Design System & Chat Components
│       │   ├── ActionButton.jsx      # High-tactile button with audio feedback
│       │   ├── AiStatusBadge.jsx     # Live state pill (Thinking, Online, Error)
│       │   ├── DesignTokens.js       # Standardized color palette & typography tokens
│       │   ├── ForgeCharacterAvatar.jsx # SVG character avatar renderer
│       │   ├── HumanAiDemoChat.jsx   # Interactive comparison chat interface
│       │   ├── RealAiReceptionistChat.jsx # 573-line full-screen multi-worker chat modal
│       │   └── WorkflowPipelineVisual.jsx # Real-time SVG state machine visualizer
│       │
│       ├── data/
│       │   ├── forgePlatformConfig.js # Pricing plans, systems catalog, integration configs
│       │   └── siteData.js           # 8 core production system profiles & case studies
│       │
│       └── utils/
│           ├── forgeAudioSynth.js    # Web Audio API procedural synthesizer (zero external mp3s)
│           ├── receptionistClientFallback.js # 336-line client-side pattern matching fallback
│           └── speechEngine.js       # Web Speech API speech-to-text & TTS wrapper
│
├── prompts/                          # Canonical Agent Prompt Templates
│   ├── business_research.md
│   ├── compliance_check.md
│   ├── factuality_validation.md
│   ├── lead_scoring.md
│   ├── offer_matching.md
│   ├── opportunity_detection.md
│   ├── outreach_generation.md
│   ├── outreach_quality_check.md
│   ├── pain_point_analysis.md
│   ├── proposal_generation.md
│   ├── receptionist_demo.md
│   ├── reply_classification.md
│   └── reply_generation.md
│
├── scripts/
│   └── demo_pipeline.py              # Standalone demonstration CLI script
│
└── tests/                            # Automated Pytest Suite
    ├── conftest.py                   # Async SQLite database fixtures & client setup
    ├── test_ai_receptionist.py       # Receptionist intent & knowledge tests
    ├── test_anti_hallucination.py    # Grounding & firewall tests
    ├── test_bounce_handling.py       # Deliverability & bounce suppression tests
    ├── test_compliance_policies.py   # CAN-SPAM policy rule tests
    ├── test_deduplication.py         # Lead deduplication logic tests
    ├── test_end_to_end_dry_run.py    # Pipeline dry-run simulation
    ├── test_evidence_system.py       # Grounded observation tests
    ├── test_hallucination_firewall.py # Adversarial injection tests
    ├── test_human_learning_loop.py   # Human correction diff tests
    ├── test_idempotency.py           # Message dispatch deduplication tests
    ├── test_kill_switch.py           # Kill-switch pause/resume tests
    ├── test_lead_engine_e2e.py       # Modules 41-56 Lead Engine comprehensive E2E (11 tests)
    ├── test_offer_matcher.py         # Solution alignment tests
    ├── test_rate_limiter.py          # Velocity cap & cooldown tests
    ├── test_reply_pipeline.py        # Inbound classification tests
    ├── test_suppression.py           # Blacklist suppression tests
    ├── test_whatsapp_webhook.py      # Meta WhatsApp verification & parse tests
    ├── verify_api.py                 # Live endpoint verification script
    ├── ai/
    │   ├── test_adversarial_security.py
    │   ├── test_golden_dataset.py
    │   └── golden/
    │       └── dataset.json          # Curated benchmark eval dataset
    └── v5/
        ├── __init__.py
        └── test_v5_platform.py       # V5 tenant isolation, appointments, auth (7 tests)
```

---

## 2. Every Page and Route

### A. Frontend Routes & Views
The frontend operates as a hybrid application with two distinct runtime environments:

#### 1. Operator Console (Managed by `frontend/src/App.jsx`):
Toggled via the top navigation bar when viewing administrative views:
- **Dashboard** (`activeTab === 'dashboard'`): Renders `<DashboardView />` — Executive overview, metrics, pipeline summary.
- **Leads & Intel** (`activeTab === 'leads'`): Renders `<LeadsView />` — B2B lead discovery, grounded digital footprint inspections, scoring, review-mode approvals.
- **Campaigns** (`activeTab === 'campaigns'`): Renders `<CampaignsView />` — Campaign creation, sequence schedules, audience targeting.
- **Outreach Queue** (`activeTab === 'outreach'`): Renders `<OutreachQueueView />` — Outbound pending queue, message editor, batch approvals.
- **Inbox & Replies** (`activeTab === 'inbox'`): Renders `<InboxView />` — Inbound reply intelligence, intent classification, suggested replies.
- **Funnel Pipeline** (`activeTab === 'pipeline'`): Renders `<PipelineView />` — 8-stage Kanban board, conversion intelligence ribbon, deliverability status.
- **AI Analytics** (`activeTab === 'analytics'`): Renders `<AnalyticsView />` — AI token usage, LLM latency, cost tracking.
- **Compliance & Logs** (`activeTab === 'compliance'`): Renders `<ComplianceView />` — Suppression list blacklist management, immutable audit trail.
- **Public Website** (`activeTab === 'public_website'`): Renders `<PublicPortfolioView />` — Switches to the client-facing marketing portal.

#### 2. Public Marketing & Client Portal (Managed by `PublicPortfolioView.jsx`):
Uses window pathname and hash routing to switch internal views:
- `/` or `#home`: Hero, problem statement, interactive demos, systems showcase, ROI calculator, pricing.
- `/audit` or `?audit=true`: Renders `<AuditPage />` — Full-page interactive business audit questionnaire.
- `/receptionist` or `#receptionist`: Opens `<RealAiReceptionistChat />` full-screen modal.
- `/payment` or `?payment=true`: Opens `<PaymentPortalModal />` deposit modal.
- `/lab`: Renders `<ForgeAiLab />` — Interactive prompt engineering playground.
- `/tools` or `/toolkit`: Renders `<AIToolsForgeView />` — 18 interactive AI productivity tools.
- `/experience`: Renders `<ForgeExperienceView />` — Full-screen operating system showcase.
- `/systems/:slug`: Renders `<SystemDetailPage systemId={slug} />` — Detailed breakdown of specific systems.
- `/solutions/:slug`: Renders `<SolutionDetailPage solutionId={slug} />` — Solutions architecture page.
- `/industries/:slug`: Renders `<IndustryDetailPage industryId={slug} />` — Vertical-specific breakdown.
- `/for/:slug`: Renders `<PersonalizedIndustryView industryKey={slug} />` — Dynamic personalized landing page.
- `/app/dashboard`: Renders `<AppLayout><AppDashboard /></AppLayout>` — Tenant dashboard portal.
- `/app/builder`: Renders `<AppLayout><AppSystemBuilder /></AppLayout>` — AI Employee builder.
- `/app/knowledge`: Renders `<AppLayout><AppKnowledgeBase /></AppLayout>` — Document RAG knowledge base.
- `/app/approvals`: Renders `<AppLayout><AppApprovals /></AppLayout>` — Human-in-the-loop approval queue.
- `/app/integrations`: Renders `<AppLayout><AppIntegrations /></AppLayout>` — External app integration hub.
- `/app/control`: Renders `<AppLayout><AppControlCenter /></AppLayout>` — Safety thresholds & kill-switch console.
- `/app/billing`: Renders `<AppLayout><AppBilling /></AppLayout>` — Stripe billing & subscription management.
- `/app/admin`: Renders `<AppLayout><AdminPanel /></AppLayout>` — Super-admin multi-tenant management.
- `/app/onboarding`: Renders `<AppLayout><OnboardingWizard /></AppLayout>` — 4-step tenant onboarding flow.

---

## 3. Every Component

The frontend contains **113 source components and utilities**. Below is the exhaustive inventory categorized by domain:

### A. Root Application
| Component | File Path | Lines | Role |
| :--- | :--- | :--- | :--- |
| `App` | `frontend/src/App.jsx` | 191 | Master application root; toggles between Operator Console and Public Marketing Portal; holds global kill-switch state. |
| `main` | `frontend/src/main.jsx` | 111 | React 19 root bootstrap, error boundary, and global DOM mounting. |

### B. Operator Console Components (`frontend/src/components/`)
| Component | File Path | Lines | Primary Exports | Role |
| :--- | :--- | :--- | :--- | :--- |
| `AIToolsForgeView` | `AIToolsForgeView.jsx` | 2,403 | `AIToolsForgeView`, `ALL_FORGE_TOOLS` | Client-side 18-tool productivity suite (Video studio, Image generator, BG remover, Voice clone, Code gen). |
| `AnalyticsView` | `AnalyticsView.jsx` | 276 | `AnalyticsView` | Token consumption charts, model latency telemetry, cost tracking by operation. |
| `CampaignsView` | `CampaignsView.jsx` | 240 | `CampaignsView` | Outreach campaign management, targeting criteria, and sequence configuration. |
| `ComplianceView` | `ComplianceView.jsx` | 288 | `ComplianceView` | CAN-SPAM audit logs, suppression entry blacklist management (Email, Phone, Domain). |
| `DashboardView` | `DashboardView.jsx` | 235 | `DashboardView` | Executive KPI cards, funnel velocity, daily action item tracker. |
| `FloatingAIAssistant` | `FloatingAIAssistant.jsx` | 148 | `FloatingAIAssistant` | Context-aware floating copilot widget for operators. |
| `InboxView` | `InboxView.jsx` | 290 | `InboxView` | Multi-turn email conversation viewer, AI suggested replies, reply simulator. |
| `InteractiveVideoPlayerModal` | `InteractiveVideoPlayerModal.jsx` | 112 | `InteractiveVideoPlayerModal` | HTML5 video player modal with scrubbing and playback speed controls. |
| `LeadsView` | `LeadsView.jsx` | 1,048 | `LeadsView` | Production V5 Lead Engine explorer with Sourcing Transparency Drawer and Review Mode Action Bar. |
| `OutreachQueueView` | `OutreachQueueView.jsx` | 245 | `OutreachQueueView` | Pending outbound messages, subject/body editor, manual dispatch approval. |
| `PaymentPortalModal` | `PaymentPortalModal.jsx` | 469 | `PaymentPortalModal` | Client deposit submission modal supporting bank transfer & crypto settlement. |
| `PipelineView` | `PipelineView.jsx` | 362 | `PipelineView` | 8-Stage V5 Funnel Kanban board with Conversion Intelligence Metric Ribbon. |
| `PublicPortfolioView` | `PublicPortfolioView.jsx` | 549 | `PublicPortfolioView` | Master public website container and routing coordinator. |
| `TechLogos` | `TechLogos.jsx` | 48 | `TechLogos` | SVG logos for Python, FastAPI, React, PostgreSQL, PyTorch, OpenAI, Meta. |

### C. SaaS Platform Portal (`frontend/src/components/app/`)
| Component | File Path | Lines | Exports | Role |
| :--- | :--- | :--- | :--- | :--- |
| `AdminPanel` | `AdminPanel.jsx` | 89 | `AdminPanel` | Super-admin multi-tenant metrics and database health view. |
| `AppApprovals` | `AppApprovals.jsx` | 143 | `AppApprovals` | Human-in-the-loop review queue for autonomous AI employee actions. |
| `AppBilling` | `AppBilling.jsx` | 176 | `AppBilling` | Stripe subscription tier cards and simulated checkout modal. |
| `AppControlCenter` | `AppControlCenter.jsx` | 117 | `AppControlCenter` | Global platform circuit breakers, safety threshold configs, latency metrics. |
| `AppDashboard` | `AppDashboard.jsx` | 228 | `AppDashboard` | Tenant dashboard overview, recent appointments, task completion stats. |
| `AppIntegrations` | `AppIntegrations.jsx` | 144 | `AppIntegrations` | Third-party connector cards (WhatsApp, Stripe, Google Calendar, HubSpot). |
| `AppKnowledgeBase` | `AppKnowledgeBase.jsx` | 208 | `AppKnowledgeBase` | Document RAG ingestion portal with chunking preview. |
| `AppLayout` | `AppLayout.jsx` | 145 | `AppLayout` | SaaS portal layout wrapper with collapsible sidebar navigation. |
| `AppSystemBuilder` | `AppSystemBuilder.jsx` | 170 | `AppSystemBuilder` | Multi-step AI Employee personality and role configuration wizard. |
| `OnboardingWizard` | `OnboardingWizard.jsx` | 337 | `OnboardingWizard` | New tenant onboarding flow (Business Profile, AI Persona, Channels, Test). |

### D. Public Marketing & Showcase (`frontend/src/components/forge/`)
| Component | File Path | Lines | Role |
| :--- | :--- | :--- | :--- |
| `AboutSection` | `AboutSection.jsx` | 110 | Agency mission, team background, deterministic engineering standards. |
| `AgentNetworkVisualizer` | `AgentNetworkVisualizer.jsx` | 185 | Interactive canvas simulating multi-agent collaborative workflows. |
| `AgentsSection` | `AgentsSection.jsx` | 145 | Feature cards for Elena (Front Desk), Marcus (Sales), Aria (Care), Kael (Ops). |
| `AuditPage` | `AuditPage.jsx` | 466 | Dedicated full-page interactive business automation audit questionnaire. |
| `AutonomousReactionBanner`| `AutonomousReactionBanner.jsx` | 68 | Real-time sliding notification toast demonstrating autonomous background actions. |
| `CaseStudiesSection` | `CaseStudiesSection.jsx` | 140 | Detailed client case studies (Dental clinic, Real estate, Grammar school). |
| `FaqSection` | `FaqSection.jsx` | 115 | Accordion FAQ addressing hallucination prevention, security, and onboarding. |
| `FinalCtaSection` | `FinalCtaSection.jsx` | 85 | High-conversion closing CTA with consultation booking link. |
| `ForgeAiLab` | `ForgeAiLab.jsx` | 280 | Interactive prompt testing playground with token usage visualization. |
| `ForgeExperienceView` | `ForgeExperienceView.jsx` | 240 | Full-screen immersive simulation of the Rine Forge operating system. |
| `ForgeFooter` | `ForgeFooter.jsx` | 130 | Public footer with legal disclaimers, contact details, and sub-links. |
| `ForgeHero` | `ForgeHero.jsx` | 165 | Above-the-fold hero section with direct video and interactive demo CTAs. |
| `ForgeHumanControl` | `ForgeHumanControl.jsx` | 140 | Visual explanation of human review mode and safety guardrails. |
| `ForgeNavbar` | `ForgeNavbar.jsx` | 230 | Sticky desktop/mobile header navigation with sound effects toggle. |
| `GlobalTryForgeModal` | `GlobalTryForgeModal.jsx` | 195 | Quick modal for trying any of the 4 AI employees without signing up. |
| `HowItWorksSection` | `HowItWorksSection.jsx` | 110 | 4-step architectural breakdown: Discover, Ground, Review, Execute. |
| `IndustriesSection` | `IndustriesSection.jsx` | 135 | Industry grid covering Healthcare, Legal, Real Estate, Home Services. |
| `IndustryDetailPage` | `IndustryDetailPage.jsx` | 281 | Deep-dive page customized for specific vertical automation challenges. |
| `InteractiveAppointmentDemo`| `InteractiveAppointmentDemo.jsx` | 144 | Interactive calendar widget demonstrating double-booking prevention. |
| `InteractiveDocumentEngineDemo`| `InteractiveDocumentEngineDemo.jsx`| 188 | Interactive PDF/Contract clause extraction and classification tool. |
| `InteractiveEmailAgentDemo`| `InteractiveEmailAgentDemo.jsx` | 180 | Interactive inbox demo showing sub-30s triage and intent scoring. |
| `LiveActivityStream` | `LiveActivityStream.jsx` | 125 | Animated real-time telemetry stream showing background platform operations. |
| `LiveSystemsShowcase` | `LiveSystemsShowcase.jsx` | 381 | Filterable catalog of all 8 production client systems with live demos. |
| `OracleShowcaseSection` | `OracleShowcaseSection.jsx`| 337 | Quantitative finance showcase with live simulated BTC price candles. |
| `PersonalizedIndustryView`| `PersonalizedIndustryView.jsx` | 96 | Dynamically tailored landing page for visitors arriving from cold outreach. |
| `PricingSection` | `PricingSection.jsx` | 124 | Transparent pricing table for Starter, Growth, and Custom systems. |
| `ProblemSection` | `ProblemSection.jsx` | 100 | Visual breakdown of payroll leakage from manual front-desk coordination. |
| `RoiCalculatorSection` | `RoiCalculatorSection.jsx` | 198 | Interactive financial calculator estimating annual staff hours saved. |
| `SecuritySection` | `SecuritySection.jsx` | 89 | Visual security overview (SOC-2 compliance, zero data training, encryption). |
| `SolutionDetailPage` | `SolutionDetailPage.jsx` | 145 | Dedicated architectural page for individual automation solutions. |
| `SystemDetailPage` | `SystemDetailPage.jsx` | 260 | Comprehensive technical specification page for each production system. |
| `SystemsMarketplace` | `SystemsMarketplace.jsx` | 160 | Deployable system library with direct staging preview links. |
| `TenSecondDemoModal` | `TenSecondDemoModal.jsx` | 227 | 10-second rapid-fire video/interactive preview modal. |
| `WhatWeBuildSection` | `WhatWeBuildSection.jsx` | 105 | Feature highlights of conversational employees and workflow engines. |
| `WhyForgeSection` | `WhyForgeSection.jsx` | 94 | Comparison matrix: Rine Forge vs Fragile Zapier Chains vs Generic Chatbots. |
| `WorkflowModal` | `WorkflowModal.jsx` | 116 | High-resolution modal displaying system architecture flowcharts. |

### E. V2 High-Converting Platform Components (`frontend/src/components/forge/v2/`)
Contains 31 components engineered for high-conversion presentation:
- `ForgeV2HeroScene.jsx` (433 lines) — Animated multi-layer hero scene.
- `LiveAiReceptionistDemoSection.jsx` (569 lines) — Embedded interactive receptionist demo.
- `BeforeAfterComparison.jsx` (306 lines) — Interactive slider comparing manual vs automated workflows.
- `WhatCouldYourBusinessAutomate.jsx` (553 lines) — Comprehensive departmental opportunity calculator.
- `ForgeDemoVideoPlayer.jsx` (829 lines) — Custom video player with animated canvas clips.
- `MeetAiEmployeesSection.jsx` (304 lines) — Persona cards with starter prompt triggers.
- `VisualIndustrySelector.jsx` (327 lines) — Industry preset switcher.
- `ForgeCommandCenter.jsx` (594 lines) — Interactive simulated operator console.
- `ChaosToOrderStory.jsx` (225 lines), `OmnichannelSection.jsx` (245 lines), `HowMuchCouldYouAutomate.jsx` (307 lines), `RealSystemsProofSection.jsx` (246 lines), `SimpleAuditContactModal.jsx` (283 lines).

### F. Video Experience Layer (`frontend/src/components/forge/v2/videoLayer/`)
Contains 7 canvas and SVG animation scene components:
- `ForgeVideoExperienceLayer.jsx` (252 lines), `AIReceptionistDemo.jsx` (365 lines), `AISalesDemo.jsx` (364 lines), `BeforeAfterVisual.jsx` (198 lines), `ForgeProcessingDemo.jsx` (234 lines), `ForgeTransition.jsx` (226 lines), `ProblemScene.jsx` (195 lines).

### G. V4 Tactile Design System & Chat (`frontend/src/components/forge/v4/`)
- `RealAiReceptionistChat.jsx` (572 lines) — Authoritative full-screen multi-worker chat modal supporting Elena, Marcus, Aria, and Kael with sub-second failover.
- `ActionButton.jsx` (116 lines) — Tactile button with sound synthesis and micro-animations.
- `AiStatusBadge.jsx` (129 lines) — Reactive state indicator badge.
- `DesignTokens.js` (83 lines) — Authoritative design tokens (colors, typography, shadows).
- `ForgeCharacterAvatar.jsx` (219 lines) — Procedural SVG character illustrations.
- `HumanAiDemoChat.jsx` (187 lines) — Interactive side-by-side chat simulator.
- `WorkflowPipelineVisual.jsx` (197 lines) — State-machine visualization component.

---

## 4. Every API Route

The backend exposes **121 registered FastAPI endpoints**. Below is the complete catalog grouped by router:

### A. Root & Utility Endpoints (`backend/app/main.py`)
| Method | Path | Handler | Tags | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | `health_check` | Default | Lightweight uptime ping returning platform status and operating mode. |
| `GET` | `/{full_path:path}` | `serve_spa` | Default | Serves compiled React SPA (`index.html` or static assets) for all non-API paths. |

### B. Legacy V4 Routers
#### Dashboard Router (`backend/app/api/dashboard.py`):
| Method | Path | Handler | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard/metrics` | `get_dashboard_metrics` | Returns total leads, qualified leads, active campaigns, sent count, conversion rates. |
| `GET` | `/api/dashboard/charts` | `get_dashboard_charts` | Returns 14-day timeseries of messages sent, opened, and replied. |
| `GET` | `/api/dashboard/owais-today` | `get_operator_daily_view` | Returns action items requiring human operator attention. |
| `GET` | `/api/dashboard/operator-today` | `get_operator_daily_view` | Alias for operator daily view. |

#### Leads Router (`backend/app/api/leads.py`):
| Method | Path | Handler | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/leads` | `list_leads` | Lists V4 businesses with filters for industry, country, min_score, and status. |
| `POST` | `/api/leads/discover` | `discover_leads` | Ingests benchmark curated prospects into V4 business tables. |
| `GET` | `/api/leads/{business_id}` | `get_lead_detail` | Returns deep intelligence dossier (facts, pain points, opportunities, drafts). |
| `POST` | `/api/leads/pipeline-full-process/{business_id}` | `run_full_lead_pipeline` | Runs V4 research, scoring, offer matching, and draft generation on a lead. |

#### Campaigns Router (`backend/app/api/campaigns.py`):
| Method | Path | Handler | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/campaigns` | `list_campaigns` | Lists all email campaigns with member count and performance metrics. |
| `POST` | `/api/campaigns` | `create_campaign` | Creates new outreach campaign with targeting criteria. |
| `GET` | `/api/campaigns/{campaign_id}` | `get_campaign_detail` | Returns campaign members, status, and sequence schedule. |
| `POST` | `/api/campaigns/{campaign_id}/populate` | `populate_campaign_leads` | Populates campaign with qualified leads meeting criteria. |
| `POST` | `/api/campaigns/{campaign_id}/generate-outreach` | `generate_campaign_outreach` | Generates personalized Step 0 outreach drafts for all campaign members. |
| `POST` | `/api/campaigns/{campaign_id}/dispatch` | `dispatch_campaign_batch` | Dispatches approved pending messages up to daily rate limit. |

#### Outreach Router (`backend/app/api/outreach.py`):
| Method | Path | Handler | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/outreach/queue` | `list_outreach_queue` | Returns paginated list of drafted outreach messages awaiting review or dispatch. |
| `POST` | `/api/outreach/action` | `handle_message_action` | Handles human approval, rejection, or text edit for a queued message. |
| `POST` | `/api/outreach/dispatch-batch`| `dispatch_batch_messages`| Dispatches a selected array of message IDs. |

#### Inbox & Replies Router (`backend/app/api/inbox.py`):
| Method | Path | Handler | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/inbox/conversations` | `list_conversations` | Lists all conversation threads with intent classification and human alert flags. |
| `GET` | `/api/inbox/conversations/{id}` | `get_conversation_thread` | Full message thread history with sentiment and suggested responses. |
| `POST` | `/api/inbox/simulate-reply` | `simulate_incoming_reply`| Developer endpoint to inject test inbound replies and trigger classifier. |
| `POST` | `/api/inbox/send-reply` | `send_response_to_prospect`| Sends operator-approved outbound response and logs human correction diff. |
| `POST` | `/api/inbox/auto-respond` | `auto_respond_to_inquiry` | Autonomous responder delivering working prototype links and payment info. |

#### Compliance Router (`backend/app/api/compliance.py`):
| Method | Path | Handler | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/compliance/logs` | `list_audit_logs` | Paginated view of immutable audit logs. |
| `GET` | `/api/compliance/suppression` | `list_suppression_list` | Lists suppressed email addresses and domains. |
| `POST` | `/api/compliance/suppression` | `add_to_suppression` | Manually blacklists an email or domain. |
| `DELETE`| `/api/compliance/suppression/{id}`| `remove_from_suppression`| Removes an entry from the suppression list. |

#### Kill Switch Router (`backend/app/api/kill_switch.py`):
| Method | Path | Handler | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/kill-switch/status` | `get_kill_switch_status`| Returns boolean flag indicating if global emergency pause is active. |
| `POST` | `/api/kill-switch/toggle` | `toggle_kill_switch` | Immediately halts or resumes all background messaging and sequences. |

#### Public Showcases Router (`backend/app/api/public.py`):
| Method | Path | Handler | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/public/portfolio` | `get_public_portfolio` | Returns catalog of all 8 production client systems with metrics. |
| `GET` | `/api/public/interactive/oracle-ai/stream` | `oracle_ai_stream_sample` | Generates simulated 5-minute price candles and MACD telemetry. |
| `POST` | `/api/public/interactive/fact-fuel/generate` | `fact_fuel_generate` | Generates fact-verified 60s video scripts using LLM. |
| `POST` | `/api/public/interactive/trading-bot/backtest`| `trading_bot_simulate` | Simulates algorithmic grid trading executions. |
| `POST` | `/api/public/interactive/monopoly-pk/calculate`| `monopoly_pk_simulate` | Simulates real estate rental yield and 5-year capital appreciation. |
| `POST` | `/api/public/interactive/school-portal/inquiry`| `school_portal_inquiry`| Simulates instant tuition calculation and open-day reservation. |
| `POST` | `/api/public/receptionist-demo/chat` | `interactive_receptionist_chat`| Interactive chat with AI receptionist for any business/industry. |
| `POST` | `/api/public/contact-booking` | `submit_public_booking` | Ingests inbound consultation request into `businesses` and `contacts` table. |

#### Receptionist Router (`backend/app/api/receptionist.py`):
| Method | Path | Handler | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/receptionist/demo-business` | `get_demo_business_info`| Returns verified clinic profile (Rine Dental & Facial Aesthetics). |
| `POST` | `/api/receptionist/message` | `send_receptionist_message`| Multi-turn conversation engine with clinical triage and tool calling. |
| `GET` | `/api/receptionist/conversations/{id}` | `get_conversation` | Returns full receptionist conversation history. |
| `GET` | `/api/receptionist/handoffs` | `list_handoffs` | Lists conversations flagged for human staff handoff. |
| `POST` | `/api/receptionist/handoffs/{id}/resolve`| `resolve_handoff` | Marks a human handoff request as resolved. |
| `GET` | `/api/receptionist/businesses/{id}/knowledge`| `get_business_knowledge`| Returns verified clinic knowledge configuration. |
| `POST` | `/api/receptionist/businesses/{id}/knowledge`| `upsert_business_knowledge`| Updates verified services, hours, address, and insurance. |

#### WhatsApp Webhook Router (`backend/app/channels/whatsapp/router.py`):
| Method | Path | Handler | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/whatsapp/webhook` | `verify_webhook` | Meta Cloud API webhook verification challenge handshake. |
| `POST` | `/api/whatsapp/webhook` | `receive_webhook` | Receives inbound WhatsApp messages, routes to AI receptionist, dispatches reply. |

---

### C. Production V5 Multi-Tenant API Routers (`backend/app/api/v1/`)

#### 1. Authentication (`/api/v1/auth`):
- `POST /api/v1/auth/signup` — Registers new platform user with hashed password.
- `POST /api/v1/auth/login` — Verifies credentials, returns 24-hour signed JWT access token.
- `GET /api/v1/auth/me` — Returns current authenticated user profile and permissions.
- `POST /api/v1/auth/logout` — Revokes session (stateless client clearance).

#### 2. Businesses / Tenant Management (`/api/v1/businesses`):
- `GET /api/v1/businesses/current` — Returns current tenant profile, branding, and timezone.
- `PUT /api/v1/businesses/current` — Updates tenant profile, business hours, and operational policies.
- `GET /api/v1/businesses/{id}/public` — Public tenant configuration for external booking widgets.

#### 3. AI Employees (`/api/v1/ai-employees`):
- `GET /api/v1/ai-employees` — Lists all autonomous AI employees for tenant (Elena, Marcus, Aria, Kael).
- `POST /api/v1/ai-employees` — Provisions a new AI employee persona with custom instructions.
- `PUT /api/v1/ai-employees/{id}` — Modifies employee personality, system prompt, or status.
- `POST /api/v1/ai-employees/chat` — Inbound multi-turn chat endpoint for customer inquiries.

#### 4. Services Catalog (`/api/v1/services`):
- `GET /api/v1/services` — Lists billable services, prices, durations, and descriptions.
- `POST /api/v1/services` — Adds a new service offering to tenant catalog.
- `PUT /api/v1/services/{id}` — Updates price, duration, or active status.
- `DELETE /api/v1/services/{id}` — Archives a service offering.

#### 5. Staff Management (`/api/v1/staff`):
- `GET /api/v1/staff` — Lists human staff members, assigned roles, and calendar sync IDs.
- `POST /api/v1/staff` — Registers a staff member.
- `PUT /api/v1/staff/{id}` — Updates staff member details or schedules.
- `DELETE /api/v1/staff/{id}` — Deactivates staff member.

#### 6. Knowledge Base & RAG (`/api/v1/knowledge`):
- `GET /api/v1/knowledge/documents` — Lists ingested documents with chunk counts.
- `POST /api/v1/knowledge/documents` — Ingests raw text or document, performs chunking & stores in DB.
- `DELETE /api/v1/knowledge/documents/{id}` — Deletes document and cascaded chunks.
- `POST /api/v1/knowledge/search` — Semantic/keyword search across tenant knowledge chunks.

#### 7. Customer Management (`/api/v1/customers`):
- `GET /api/v1/customers` — Paginated list of customer records with contact info and lifetime value.
- `GET /api/v1/customers/{id}` — Full customer dossier including appointments and conversation history.
- `PUT /api/v1/customers/{id}` — Updates customer attributes or custom metadata.

#### 8. Conversations & Messages (`/api/v1/conversations`):
- `GET /api/v1/conversations` — Lists multi-channel conversations (Web, WhatsApp, Email).
- `GET /api/v1/conversations/{id}/messages` — Paginated transcript of messages in a thread.
- `POST /api/v1/conversations/{id}/reply` — Staff reply dispatch bypassing AI.
- `POST /api/v1/conversations/{id}/handoff` — Toggles human handoff lock.

#### 9. Appointments & Scheduling (`/api/v1/appointments`):
- `GET /api/v1/appointments` — Lists scheduled appointments with status filter.
- `POST /api/v1/appointments` — Books appointment with atomic slot verification (prevents double-booking).
- `GET /api/v1/appointments/availability` — Computes free appointment slots based on staff hours & existing bookings.
- `POST /api/v1/appointments/{id}/reschedule` — Atomic reschedule to new time slot.
- `POST /api/v1/appointments/{id}/cancel` — Cancels booking and notifies customer.

#### 10. Integrations (`/api/v1/integrations`):
- `GET /api/v1/integrations` — Lists connected external platforms (WhatsApp, Stripe, Google Calendar).
- `POST /api/v1/integrations` — Stores encrypted API credentials/tokens for a provider.

#### 11. Automations & Workflows (`/api/v1/automations`):
- `GET /api/v1/automations` — Lists event-driven automation rules.
- `POST /api/v1/automations` — Creates trigger-condition-action automation pipeline.
- `PUT /api/v1/automations/{id}` — Modifies workflow logic or active status.
- `DELETE /api/v1/automations/{id}` — Removes an automation workflow.

#### 12. Super-Admin & Platform Telemetry (`/api/v1/admin`):
- `GET /api/v1/admin/tenants` — Platform-wide tenant listing with active worker counts.
- `GET /api/v1/admin/system-health` — Real-time memory, database, and LLM latency metrics.
- `GET /api/v1/admin/audit-logs` — Cross-tenant immutable audit log search.

#### 13. System Health Checks (`/api/v1/health`):
- `GET /api/v1/health` — High-level platform health check.
- `GET /api/v1/health/database` — Direct database connection probe.
- `GET /api/v1/health/ai` — Live test ping to active AI provider (OpenAI / Gemini).

#### 14. Lead Engine Master Router (`backend/app/api/v1/lead_engine.py` - Modules 41–56):
- `GET /api/v1/prospects` — Lists discovered prospects with observations and review status.
- `GET /api/v1/prospects/{id}` — Full prospect intelligence dossier: facts, opportunities, drafts.
- `POST /api/v1/prospects` — Manually adds single B2B prospect with deduplication.
- `POST /api/v1/prospects/import` — Bulk imports prospects from JSON or CSV.
- `PATCH /api/v1/prospects/{id}` — Updates pipeline stage, score, or review mode.
- `DELETE /api/v1/prospects/{id}` — Archives prospect and marks DISQUALIFIED.
- `POST /api/v1/discovery/search` — Triggers 13-stage autonomous discovery pipeline.
- `GET /api/v1/discovery/searches` — Historical search run audit log.
- `POST /api/v1/discovery/analyze-url` — On-demand grounded website analysis.
- `GET /api/v1/discovery/sources` — Status matrix of all 10 official lead sources.
- `GET /api/v1/outreach/pending` — Messages awaiting human review.
- `POST /api/v1/outreach/{id}/approve` — Human approval and verified outbound dispatch.
- `POST /api/v1/outreach/{id}/reject` — Rejects drafted outreach.
- `POST /api/v1/outreach/{id}/edit` — Modifies subject or body of pending draft.
- `POST /api/v1/outreach/bulk-approve` — Bulk approves multiple pending messages.
- `GET /api/v1/outreach/history` — Log of dispatched outreach with delivery telemetry.
- `GET /api/v1/outreach/status` — Daily velocity caps, cooldown policy, auto-mode eligibility.
- `GET /api/v1/suppression` — Lists suppressed emails, phone numbers, and domains.
- `POST /api/v1/suppression` — Adds entry to suppression blacklist.
- `DELETE /api/v1/suppression/{id}` — Removes entry from suppression blacklist.
- `GET /api/v1/analytics/pipeline` — 8-stage conversion funnel breakdown.
- `GET /api/v1/analytics/deliverability` — Bounce rate, open rate, circuit breaker watchdog status.
- `GET /api/v1/analytics/roi` — Estimated pipeline value and closed client revenue.

---

## 5. Every Server Action

Server actions are backend state mutations, background tasks, webhooks, and asynchronous workflows:

1. **User Registration & Token Issuance**: `POST /api/v1/auth/signup`, `POST /api/v1/auth/login` (generates bcrypt hash and JWT).
2. **Tenant Creation & Onboarding**: `POST /api/v1/businesses` (creates `V5Business` and owner `V5BusinessUser` membership).
3. **AI Employee Provisioning**: `POST /api/v1/ai-employees` (creates persona record in `v5_ai_employees`).
4. **Appointment Slot Lock & Booking**: `POST /api/v1/appointments` (verifies slot availability, locks slot, inserts `V5Appointment`).
5. **Appointment Rescheduling**: `POST /api/v1/appointments/{id}/reschedule` (releases prior slot, checks new slot, commits change).
6. **Appointment Cancellation**: `POST /api/v1/appointments/{id}/cancel` (releases slot, updates status to `CANCELLED`).
7. **Document RAG Ingestion**: `POST /api/v1/knowledge/documents` (parses document, splits into 500-token chunks, stores in `v5_knowledge_chunks`).
8. **13-Stage Discovery Pipeline Run**: `POST /api/v1/discovery/search` (invokes `lead_discovery_pipeline.execute_discovery_run`, extracts directory records, deduplicates, runs Anti-Health Guard, ground website, scores leads, drafts Step 0 outreach).
9. **On-Demand Website DOM Inspection**: `POST /api/v1/discovery/analyze-url` (fetches target URL with `httpx`, parses DOM with BeautifulSoup, extracts booking/chat/CMS, runs opportunity analyzer).
10. **Human Outreach Approval**: `POST /api/v1/outreach/{id}/approve` (verifies 4 pre-flight compliance gates, dispatches message via provider, records delivery event, advances prospect stage).
11. **Draft Message Editing**: `POST /api/v1/outreach/{id}/edit` (mutates subject, body text, and HTML in `V5ProspectOutreach`).
12. **Prospect Disqualification**: `DELETE /api/v1/prospects/{id}` (marks prospect `DISQUALIFIED`, cancels pending outreach, logs audit entry).
13. **Blacklist Entry Creation**: `POST /api/v1/suppression` (inserts record into `V5SuppressionEntry`).
14. **Inbound WhatsApp Webhook Processing**: `POST /api/whatsapp/webhook` (parses Meta webhook JSON, identifies customer by phone, retrieves AI receptionist, generates response via LLM, dispatches outbound reply via Graph API).
15. **Inbound Reply Ingest & Auto-Suppression**: `POST /api/inbox/simulate-reply` and `backend/app/inbox/reply_monitor.py` (classifies incoming email, checks opt-out keywords; if opt-out: immediately halts sequences and suppresses contact).
16. **Emergency Kill-Switch Activation**: `POST /api/kill-switch/toggle` (mutates global in-memory and database boolean flag, pausing all sequence loops).

---

## 6. Every Database Interaction

### A. Database Engine & Connection Lifecycle
- **Configuration File**: `backend/app/database.py`
- **Driver**: SQLite via `sqlite+aiosqlite` (default) with configuration ready for PostgreSQL via `asyncpg`.
- **Database URL Logic**:
  ```python
  DATABASE_URL = (
      "sqlite+aiosqlite:////tmp/outreach_ai.db"
      if (os.environ.get("VERCEL") or os.environ.get("AWS_LAMBDA_FUNCTION_NAME"))
      else "sqlite+aiosqlite:///./outreach_ai.db"
  )
  ```
  > [!WARNING]
  > On Vercel Serverless and AWS Lambda, the database is stored in `/tmp/outreach_ai.db`. The `/tmp` directory is ephemeral and reset across cold starts, causing data loss between isolated serverless containers.

- **Session Factory**: `async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)`
- **Dependency**: `get_db()` yielding an async session wrapped in a context manager with automatic rollback on unhandled exceptions.

### B. Dual Database Schema Architecture
The database currently maintains **51 physical tables** spanning two architectural eras:
1. **Legacy V4 Single-Tenant Schema (21 tables)**
2. **Production V5 Multi-Tenant Schema (30 tables)**

Below is the complete inventory of all 51 physical database tables:

| Physical Table Name | SQLAlchemy Model Class | Module | Role |
| :--- | :--- | :--- | :--- |
| `businesses` | `Business` | `models.business` | Legacy single-tenant company records |
| `contacts` | `Contact` | `models.business` | Legacy company decision-maker contacts |
| `business_research` | `BusinessResearch` | `models.business` | Legacy website scraper observations |
| `campaigns` | `Campaign` | `models.campaign` | Legacy email campaigns |
| `campaign_members` | `CampaignMember` | `models.campaign` | Junction between campaigns and contacts |
| `outreach_messages` | `OutreachMessage` | `models.campaign` | Legacy drafted and sent email messages |
| `message_events` | `MessageEvent` | `models.campaign` | Legacy email delivery, open, click events |
| `conversations` | `Conversation` | `models.inbox` | Legacy two-way email thread headers |
| `replies` | `Reply` | `models.inbox` | Legacy individual message turns in thread |
| `system_alerts` | `SystemAlert` | `models.inbox` | Legacy high-intent and escalation alerts |
| `human_corrections` | `HumanCorrection` | `models.inbox` | Legacy diff store tracking operator edits |
| `suppression_list` | `SuppressionEntry` | `models.compliance` | Legacy do-not-contact blacklist |
| `audit_logs` | `AuditLog` | `models.compliance` | Legacy event audit trail |
| `system_states` | `SystemState` | `models.compliance` | Legacy key-value state store (kill-switch) |
| `mailbox_health` | `MailboxHealth` | `models.compliance` | Legacy daily mailbox sent/bounce counters |
| `proposals` | `Proposal` | `models.pipeline` | Legacy generated sales proposals |
| `clients` | `Client` | `models.pipeline` | Legacy closed customer records |
| `payments` | `Payment` | `models.pipeline` | Legacy recorded milestone payments |
| `business_knowledge` | `BusinessKnowledge` | `models.receptionist` | Legacy clinic verified knowledge config |
| `receptionist_conversations` | `ReceptionistConversation`| `models.receptionist`| Legacy front-desk chat conversations |
| `receptionist_messages` | `ReceptionistMessage` | `models.receptionist` | Legacy front-desk individual messages |
| `receptionist_actions` | `ReceptionistAction` | `models.receptionist` | Legacy tool invocations by receptionist |
| `receptionist_human_handoffs`| `HumanHandoff` | `models.receptionist` | Legacy escalated staff handoff records |
| `v5_users` | `V5User` | `models.v5` | Multi-tenant user accounts & password hashes |
| `v5_businesses` | `V5Business` | `models.v5` | Authoritative tenant profiles & configurations |
| `v5_business_users` | `V5BusinessUser` | `models.v5` | Tenant membership & RBAC role permissions |
| `v5_ai_employees` | `V5AIEmployee` | `models.v5` | Configured AI employees (Elena, Marcus, Aria, Kael) |
| `v5_services` | `V5Service` | `models.v5` | Billable tenant service catalog & prices |
| `v5_staff` | `V5Staff` | `models.v5` | Staff directory & working hour schedules |
| `v5_knowledge_documents` | `V5KnowledgeDocument` | `models.v5` | Uploaded knowledge base documents |
| `v5_knowledge_chunks` | `V5KnowledgeChunk` | `models.v5` | 500-token chunks with metadata for RAG |
| `v5_customers` | `V5Customer` | `models.v5` | Authoritative customer records with external IDs |
| `v5_conversations` | `V5Conversation` | `models.v5` | Omnichannel conversation threads |
| `v5_messages` | `V5Message` | `models.v5` | Individual message turns with token telemetry |
| `v5_leads` | `V5Lead` | `models.v5` | Inbound commercial leads with matching reasons |
| `v5_appointments` | `V5Appointment` | `models.v5` | Calendar bookings with start/end datetimes |
| `v5_integrations` | `V5Integration` | `models.v5` | External credentials (WhatsApp, Stripe, Google) |
| `v5_automations` | `V5Automation` | `models.v5` | Event-driven trigger/action rules |
| `v5_tasks` | `V5Task` | `models.v5` | Scheduled background follow-up tasks |
| `v5_notifications` | `V5Notification` | `models.v5` | In-app alerts & external notification queue |
| `v5_ai_events` | `V5AIEvent` | `models.v5` | LLM invocation telemetry (latency, tokens, cost) |
| `v5_audit_logs` | `V5AuditLog` | `models.v5` | Multi-tenant immutable security audit logs |
| `v5_usage` | `V5Usage` | `models.v5` | Monthly aggregated billing usage counters |
| `v5_geo_targeting_configs` | `V5GeoTargetingConfig` | `models.v5` | Geographic radius & service area bounds |
| `v5_outreach_messages` | `V5OutreachMessage` | `models.v5` | V5 omnichannel outreach communications |
| `v5_suppression_entries` | `V5SuppressionEntry` | `models.v5` | Multi-tenant do-not-contact blacklist |
| `v5_prospects` | `V5Prospect` | `models.lead_engine` | Authoritative B2B prospect intelligence records |
| `v5_prospect_observations` | `V5ProspectObservation` | `models.lead_engine` | Grounded facts extracted from verified websites |
| `v5_prospect_opportunities` | `V5ProspectOpportunity` | `models.lead_engine` | Automation angles with citations & fit scores |
| `v5_prospect_outreach` | `V5ProspectOutreach` | `models.lead_engine` | Sequence drafts (Step 0, 1, 2) & review states |
| `v5_outreach_events` | `V5OutreachEvent` | `models.lead_engine` | Delivery tracking events (Open, Click, Bounce) |
| `v5_lead_searches` | `V5LeadSearch` | `models.lead_engine` | Discovery run search history & configurations |
| `v5_lead_search_results` | `V5LeadSearchResult` | `models.lead_engine` | Junction between search runs and prospects |

---

## 7. Every External API Integration

| External Service | Implementation File | Status | Authentication Method | Live vs Simulated Behavior |
| :--- | :--- | :--- | :--- | :--- |
| **Meta WhatsApp Cloud API** | `backend/app/channels/whatsapp/service.py` | Partially Connected | Bearer Token (`META_ACCESS_TOKEN`) via Graph API v21.0 | Real HTTP calls when token is set; falls back to `mock_sent` payload when token is unset. |
| **Google Gemini API** | `backend/app/ai/llm_provider.py` | Partially Connected | API Key (`GEMINI_API_KEY`) via `google-genai` SDK | Real LLM calls to `gemini-1.5-flash` / `gemini-1.5-pro` when key is set; falls back to `MockLLMProvider` when unset. |
| **OpenAI API** | `backend/app/ai/openai_provider.py` | Partially Connected | API Key (`OPENAI_API_KEY`) via `openai` SDK | Real LLM calls to `gpt-4o-mini` / `gpt-4o` when key is set; falls back to Gemini or Mock when unset. |
| **SMTP (Gmail)** | `backend/app/outreach/email_provider.py` | Fully Implemented | App Password (`SMTP_PASSWORD`) via `smtplib.SMTP:587` | Real email dispatch when `DRY_RUN=False` and credentials exist. Runs synchronously inside async loop. |
| **Stripe Billing** | `backend/app/api/v1/integrations.py` & `frontend/src/components/app/AppBilling.jsx` | Stubbed / Simulated | None configured | Frontend uses `setTimeout(1200)` simulating checkout. Backend stores credentials metadata but does not create sessions. |
| **HubSpot / Salesforce** | `backend/app/api/v1/integrations.py` | Stubbed | None configured | Metadata rows stored in `v5_integrations` table; no active OAuth token exchange or bi-directional contact sync. |
| **Google Calendar** | `backend/app/api/v1/integrations.py` & `backend/app/appointments/engine.py` | Internal Logic Only | None configured | Slot availability and conflict detection calculated purely from local database (`V5Appointment`); no CalDAV/Google sync. |
| **Twilio SMS** | `backend/app/api/public.py` | Referenced in Showcase | None configured | Mentioned in showcase metadata for Bright Star Grammar School; no live Twilio client initialized in backend. |

---

## 8. Every Environment Variable Referenced

All platform environment variables are formally declared in `backend/app/config.py` using `pydantic-settings.BaseSettings`:

| Environment Variable | Default Value | Purpose |
| :--- | :--- | :--- |
| `ENVIRONMENT` | `"development"` | Application environment (`development`, `staging`, `production`) |
| `DEBUG` | `True` | Verbose error tracebacks |
| `PORT` | `8000` | HTTP server port |
| `HOST` | `"0.0.0.0"` | Network bind address |
| `SECRET_KEY` | `"rine_forge_jwt_secret_key_prod_2026_change_in_production"` | JWT cryptographic signature secret |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` (24 hours) | JWT token lifespan |
| `DATABASE_URL` | Auto-detect | Database connection string (aiosqlite or asyncpg) |
| `OPENAI_API_KEY` | `None` | OpenAI API Secret Key |
| `OPENAI_MODEL` | `"gpt-4o-mini"` | Default OpenAI conversational model |
| `OPENAI_REASONING_MODEL` | `"gpt-4o"` | OpenAI complex reasoning model |
| `GEMINI_API_KEY` | `None` | Google Gemini API Secret Key |
| `LLM_PROVIDER` | `"auto"` | Active AI provider (`auto`, `openai`, `gemini`, `mock`) |
| `DEFAULT_MODEL` | `"gpt-4o-mini"` | Default general LLM model identifier |
| `REASONING_MODEL` | `"gpt-4o"` | Complex task model identifier |
| `DRY_RUN` | `True` | Master safety flag (prevents real email dispatch when True) |
| `AUTO_REPLY_ENABLED` | `False` | Enables autonomous inbound email responses |
| `GLOBAL_KILL_SWITCH` | `False` | Master emergency kill-switch |
| `MAX_DAILY_EMAILS` | `50` | Tenant daily outbound email cap |
| `MAX_HOURLY_EMAILS` | `10` | Tenant hourly outbound email cap |
| `MIN_SEND_DELAY_SECONDS` | `180` (3 mins) | Minimum random delay between outbound emails |
| `MAX_SEND_DELAY_SECONDS` | `600` (10 mins) | Maximum random delay between outbound emails |
| `SENDING_HOURS_START` | `9` (9:00 AM) | Operating window start hour |
| `SENDING_HOURS_END` | `17` (5:00 PM) | Operating window end hour |
| `SENDING_TIMEZONE` | `"UTC"` | Timezone for dispatch scheduling |
| `DEFAULT_LEAD_THRESHOLD` | `75` | Minimum lead score required for automated outreach drafting |
| `DEFAULT_COUNTRY` | `"USA"` | Default geographic policy fallback |
| `EMAIL_PROVIDER` | `"dry_run"` | Active email dispatch adapter (`dry_run`, `smtp`, `resend`) |
| `SMTP_HOST` | `"smtp.gmail.com"` | Outbound SMTP relay server host |
| `SMTP_PORT` | `587` | SMTP port (STARTTLS) |
| `SMTP_USERNAME` | `"alexrine691@gmail.com"` | SMTP authentication username |
| `SMTP_PASSWORD` | `None` | SMTP authentication password (App Password) |
| `SMTP_USE_TLS` | `True` | Enforce TLS transport encryption |
| `SENDER_NAME` | `"Alex Rine"` | Outbound email sender display name |
| `SENDER_EMAIL` | `"alexrine691@gmail.com"` | Outbound RFC 2822 From address |
| `SENDER_COMPANY` | `"Rine Forge Systems"` | Sender corporate entity |
| `SENDER_PHYSICAL_ADDRESS` | Austin address | Physical postal address for CAN-SPAM compliance |
| `REPLY_TO_EMAIL` | `"alexrine691@gmail.com"` | Outbound Reply-To header |
| `ESCALATION_EMAIL_ALERT` | `True` | Send email alerts on high-intent lead detection |
| `ALERT_RECIPIENT_EMAIL` | `"alexrine691@gmail.com"` | Operator email recipient for urgent alerts |
| `META_VERIFY_TOKEN` | `"rine_forge_whatsapp_verify_token_2026"` | WhatsApp webhook challenge token |
| `META_ACCESS_TOKEN` | `None` | Meta Cloud API permanent system user token |
| `META_PHONE_NUMBER_ID` | `None` | Meta WhatsApp sender phone number ID |
| `META_WABA_ID` | `None` | Meta WhatsApp Business Account ID |
| `META_API_VERSION` | `"v21.0"` | Meta Graph API version |
| `VERCEL` | Auto-detect | Injected by Vercel serverless environment |
| `AWS_LAMBDA_FUNCTION_NAME` | Auto-detect | Injected by AWS Lambda runtime |

---

## 9. Every Hardcoded API Key or Secret

1. **Active Google App Password in Plaintext**:
   - File: `.env` line 22
   - Value: `SMTP_PASSWORD=kshf qwdq gaya ecnx`
   - *Risk*: This is an active 16-character Google App Password granting full SMTP email dispatch access to `alexrine691@gmail.com`.
2. **Default JWT Secret Key in Source Code**:
   - File: `backend/app/config.py` line 12
   - Value: `SECRET_KEY = "rine_forge_jwt_secret_key_prod_2026_change_in_production"`
   - *Risk*: Anyone with access to the source code can forge valid JWT tokens for any user or tenant.
3. **Hardcoded Meta Webhook Verification Token**:
   - File: `backend/app/config.py` line 74 & `.env.example` line 42
   - Value: `META_VERIFY_TOKEN = "rine_forge_whatsapp_verify_token_2026"`
4. **Hardcoded Demo Tenant UUIDs**:
   - Clinic Tenant: `00000000-0000-0000-0000-000000000001` (Rine Dental & Facial Aesthetics)
   - Sales Engine Tenant: `00000000-0000-0000-0000-000000000002` (Rine Forge Internal Sales)

---

## 10. Every Mock / Demo / Fake Response

1. **Client-Side Regex Receptionist Engine**:
   - File: `frontend/src/utils/receptionistClientFallback.js` (336 lines)
   - Implements hardcoded rule-based pattern matching returning pre-written responses for Elena, Marcus, and Aria whenever the backend API is unreachable.
2. **Backend Mock LLM Provider**:
   - File: `backend/app/ai/llm_provider.py` (`MockLLMProvider`, lines 22–288)
   - Returns deterministic canned JSON/text for outreach emails, quality scores, compliance checks, reply classifications, and receptionist inquiries.
3. **Stripe Subscription Checkout Simulation**:
   - File: `frontend/src/components/app/AppBilling.jsx` lines 13–21
   - Uses `setTimeout(..., 1200)` and sets a local boolean `upgradeSuccess = true` displaying "SUBSCRIPTION UPGRADE PROVISIONED VIA STRIPE BILLING" without contacting Stripe.
4. **Payment Deposit Receipt Generator**:
   - File: `frontend/src/components/PaymentPortalModal.jsx` lines 94–106
   - Uses `setTimeout(..., 1200)` and generates a client-side random receipt ID (`RFS-DEP-######`) without submitting to a backend payment gateway.
5. **Interactive Oracle AI Simulation**:
   - File: `backend/app/api/public.py` lines 151–184
   - Generates simulated BTC/USDT price candles and MACD indicators using `random.uniform` and `random.randint`.
6. **MEXC Trading Bot Backtest Simulation**:
   - File: `backend/app/api/public.py` lines 210–238
   - Generates simulated win rates, PnL percentages, and hardcoded orders (`ORD-981`, `ORD-982`) using `random.randint`.
7. **Monopoly PK Real Estate Calculator**:
   - File: `backend/app/api/public.py` lines 240–257
   - Calculates projected rental yields using randomized percentages (`random.uniform(6.5, 9.8)`).
8. **Bright Star School Portal Inquiry**:
   - File: `backend/app/api/public.py` lines 259–271
   - Returns static calculated tuition ($28,000 PKR / $18,000 PKR) based on a basic string comparison without database enrollment queries.
9. **Meta WhatsApp Dev/Mock Mode**:
   - File: `backend/app/channels/whatsapp/service.py` lines 45–55
   - Returns `{"status": "mock_sent", "messages": [{"id": "mock_wamid_..."}]}` if `META_ACCESS_TOKEN` is unset.
10. **AITools Mini-Tool Suite**:
    - File: `frontend/src/components/AIToolsForgeView.jsx` (2,403 lines)
    - 18 tools (AI Video Studio, Background Remover, Voice Clone, etc.) operate purely client-side via HTML5 canvas, CSS animations, and `window.speechSynthesis` without calling any backend AI generation APIs.

---

## 11. Every TODO & Code Stub

1. **Adversarial Test Stub**:
   - File: `tests/test_ai_receptionist.py` line 256
   - Code: `raw_args={"secret": "hack"}` (Test case testing tool call argument sanitization).
2. **Missing Integration OAuth Handshakes**:
   - File: `backend/app/api/v1/integrations.py` line 38
   - Code notes: `{"provider": "stripe", "status": "NOT_CONNECTED", "notes": "Payment Processing"}`. No Stripe OAuth endpoint exists.
3. **Empty RAG Vector Embeddings**:
   - File: `backend/app/models/v5.py` line 208 (`V5KnowledgeChunk.embedding`)
   - Column `embedding = Column(JSON, nullable=True)`. Embeddings are currently stored as `None` or JSON lists; no vector indexing (pgvector / HNSW) is implemented.
4. **Offline Fallback Suppressions in UI**:
   - File: `frontend/src/components/forge/AuditPage.jsx` line 80
   - Code: `console.warn('Fallback submission handled gracefully:', err);`

---

## 12. Every Broken Link & Navigation Trap

1. **Non-Semantic Button Navigation (Broken Web Linking)**:
   - File: `frontend/src/components/forge/ForgeNavbar.jsx` lines 44–105
   - Links in the header are implemented as `<button onClick={() => handleNav(...)}>` rather than `<a href="...">`. Users cannot middle-click or right-click to open pages in new browser tabs.
2. **Missing Browser History Synchronization**:
   - When navigating between pages via `handleNav` in `PublicPortfolioView.jsx`, `window.history.pushState` is not invoked. Clicking the browser's "Back" button exits the application rather than returning to the previous view.
3. **Dead `.demo.local` URLs**:
   - File: `backend/app/config.py` lines 69–71
   - `PORTFOLIO_ORACLE_AI_URL: str = "https://oracle-ai.demo.local"`
   - `PORTFOLIO_PLOT_TWIST_URL: str = "https://plot-twist.demo.local"`
   - `PORTFOLIO_BRIGHT_STAR_URL: str = "https://bs-grammar-school.demo.local"`
   - These URLs resolve to non-existent local domains.

---

## 13. Every Button That Currently Does Nothing

1. **SaaS Portal View Buttons**:
   - File: `frontend/src/components/app/AdminPanel.jsx` lines 50–70
   - "Refresh System Metrics", "Export System Audit", "Purge Stale Cache" buttons contain no `onClick` handlers or server mutations.
2. **AppControlCenter Buttons**:
   - File: `frontend/src/components/app/AppControlCenter.jsx` lines 75–95
   - "Download Telemetry Log" and "Reset Emergency Counters" render without click bindings.
3. **Demo Video Clip Selector Buttons**:
   - File: `frontend/src/components/forge/v2/ForgeDemoVideoPlayer.jsx` lines 120–145
   - Several secondary preset buttons update a local state string without re-rendering active canvas animations.

---

## 14. Every Form That Does Not Actually Submit

1. **SaaS Subscription Upgrade Form**:
   - File: `frontend/src/components/app/AppBilling.jsx` lines 13–21
   - Form submission intercepts `e.preventDefault()`, executes `setTimeout(1200)`, and displays a success alert without making any HTTP request.
2. **Client Deposit Form**:
   - File: `frontend/src/components/PaymentPortalModal.jsx` lines 94–106
   - Intercepts submission, creates a mock receipt object in local memory, and fails to persist the transaction to the database.
3. **AppIntegrations Key Submission Form**:
   - File: `frontend/src/components/app/AppIntegrations.jsx` lines 45–60
   - Updates local component state only; does not POST to `/api/v1/integrations`.
4. **AppKnowledgeBase Document Ingestion Form**:
   - File: `frontend/src/components/app/AppKnowledgeBase.jsx` lines 65–85
   - Appends mock items to a local React state array without calling `POST /api/v1/knowledge/documents`.
5. **Onboarding Wizard Step Completion**:
   - File: `frontend/src/components/app/OnboardingWizard.jsx` lines 90–120
   - Iterates through step 1 to 4 in local memory without posting tenant configuration to `/api/v1/businesses` or creating AI employee records.

---

## 15. Every API Call Without Error Handling

1. **Dashboard Metrics Fetch**:
   - File: `frontend/src/components/app/AppDashboard.jsx` lines 35–48
   - Calls `fetch('/api/dashboard/metrics')` without checking `if (!res.ok)`. When the endpoint returns HTTP 500, `res.json()` fails silently and metrics remain stuck on zero.
2. **Demo Business Info Fetch**:
   - File: `frontend/src/components/forge/v4/RealAiReceptionistChat.jsx` lines 160–170
   - Swallows fetch errors in `catch (err) { console.warn(...) }` without displaying any visual alert to the user.

---

## 16. Every Loading State Missing

1. **Public Booking Form Submission**:
   - File: `frontend/src/components/forge/AuditPage.jsx` lines 55–85
   - While `isSubmitting` disables the submit button, child radio inputs and text areas remain fully editable during the asynchronous network request.
2. **AppApprovals Action Buttons**:
   - File: `frontend/src/components/app/AppApprovals.jsx` lines 60–80
   - "Approve" and "Reject" buttons trigger immediate state deletion without showing an intermediate loading spinner.

---

## 17. Every Empty State Missing

1. **AppIntegrations Connected List**:
   - File: `frontend/src/components/app/AppIntegrations.jsx`
   - When the integrations array is empty, renders blank whitespace without an empty state illustration or "Add Integration" guidance card.
2. **AdminPanel Audit Logs**:
   - File: `frontend/src/components/app/AdminPanel.jsx`
   - Renders an empty table header with no fallback message when zero logs exist.

---

## 18. Every Mobile & Responsive Problem

1. **Kanban Horizontal Viewport Breakage**:
   - File: `frontend/src/components/PipelineView.jsx` line 185
   - The 8 Kanban columns define `min-w-[220px]`. On mobile devices (<640px wide), the parent container forces wide horizontal page scrolling, causing the top navigation bar and footer to stretch irregularly.
2. **AITools Forge Studio Layout**:
   - File: `frontend/src/components/AIToolsForgeView.jsx` lines 850–920
   - Multi-pane video director editor uses fixed 3-column layouts that clip preview canvases on screens under 768px.
3. **Full-Screen Modals on Mobile Viewports**:
   - File: `frontend/src/components/PaymentPortalModal.jsx` and `RealAiReceptionistChat.jsx`
   - Modals use fixed padding (`p-6`) and fixed heights that extend below mobile viewport browser address bars on iOS Safari.

---

## 19. Every Accessibility Problem

1. **Icon-Only Buttons Missing Accessible Labels**:
   - `frontend/src/components/LeadsView.jsx` line 919: `<button onClick={() => setShowDiscoveryModal(false)}>` (Modal close button has no `aria-label` or inner text).
   - `frontend/src/components/LeadsView.jsx` line 1026: `<button onClick={() => setShowAnalyzeModal(false)}>` (URL analyzer close button has no `aria-label`).
   - `frontend/src/components/PipelineView.jsx` line 339: `<button onClick={() => setSelectedProspect(null)}>` (Quick inspect modal close button has no `aria-label`).
2. **Form Controls Missing `<label>` Elements**:
   - In `AuditPage.jsx` and `PaymentPortalModal.jsx`, several inputs use placeholder attributes without corresponding `<label for="...">` tags, failing WCAG 2.1 screen reader compliance.
3. **Keyboard Focus Outlines Removed**:
   - Tailwind utility `focus:outline-none` is applied across all input fields and buttons without providing an alternative high-contrast focus ring (`focus:ring-2`).

---

## 20. Every Console & Runtime Error Detected

1. **Vite Production Chunk Size Warning**:
   - Build output produces a single JavaScript bundle of **825.14 kB** (`dist/assets/index-C2x4erL2.js`), triggering Rollup's warning threshold (>500 kB). Missing route-based dynamic `import()` code splitting.
2. **Web Audio API Context Autoplay Policy**:
   - In `frontend/src/utils/forgeAudioSynth.js`, calling `new AudioContext()` before a direct user gesture generates a browser warning in Chrome console: *"The AudioContext was not allowed to start. It must be resumed (or created) after a user gesture on the page."*
3. **Web Speech Recognition Unavailability**:
   - In `frontend/src/utils/speechEngine.js`, accessing `window.SpeechRecognition` in Firefox or mobile browsers triggers an uncaught rejection if microphone permissions are denied.

---

## 21. Every Security Problem & Vulnerability

1. **CRITICAL: Wildcard CORS with Credentials Enabled**:
   - File: `backend/app/main.py` lines 50–56
     ```python
     app.add_middleware(
         CORSMiddleware,
         allow_origins=["*"],
         allow_credentials=True,
         allow_methods=["*"],
         allow_headers=["*"],
     )
     ```
   - *Vulnerability*: Combining `allow_origins=["*"]` with `allow_credentials=True` violates CORS security specifications. In modern browsers, this allows malicious third-party origins to execute authenticated cross-origin requests.
2. **CRITICAL: Unauthenticated Legacy API Endpoints**:
   - Files: `backend/app/api/kill_switch.py`, `backend/app/api/compliance.py`, `backend/app/api/leads.py`, `backend/app/api/outreach.py`
   - *Vulnerability*: Legacy V4 routers do not require the `get_current_user` dependency. Anyone on the internet can hit `POST /api/kill-switch/toggle` to shut down platform sending, or access `GET /api/compliance/logs` to view confidential customer activity.
3. **HIGH: Plaintext Email Credentials Committed to Git**:
   - File: `.env` line 22
   - An active 16-character Google App Password (`SMTP_PASSWORD=kshf qwdq gaya ecnx`) is stored in plaintext on disk.
4. **HIGH: Default JWT Secret Key in Source Code**:
   - File: `backend/app/config.py` line 12
   - If `SECRET_KEY` is not overridden in production, attackers can forge admin JWT tokens.
5. **HIGH: Ephemeral Database Storage on Serverless**:
   - File: `backend/app/config.py` lines 16–20
   - Storing SQLite databases in `/tmp/outreach_ai.db` in serverless functions causes data wipes upon container termination.
6. **MEDIUM: Synchronous Blocking Calls in Async Loop**:
   - File: `backend/app/outreach/email_provider.py` line 92
   - Synchronous `smtplib.SMTP` connects over raw network sockets inside an `async def` function, freezing the FastAPI asyncio event loop during network latency spikes.

---

## 22. Every Unused or Unnecessary Dependency

### A. Frontend (`frontend/package.json`)
- The frontend dependency tree is exceptionally lean:
  - `react`: `^19.0.0` (Active)
  - `react-dom`: `^19.0.0` (Active)
  - `lucide-react`: `^1.16.0` (Active)
  - All 3 dependencies are actively used across components.

### B. Backend (`requirements.txt`)
- `asyncpg>=0.29.0`: Installed for PostgreSQL support, but the platform is currently executing exclusively on SQLite (`aiosqlite`).
- `jinja2>=3.1.4`: Installed for email template rendering; currently most templates use Python f-strings.

---

## 23. Every Outdated or Risky Dependency

1. **`google-genai>=0.2.0` (Experimental SDK)**:
   - Google recently transitioned from `google-generativeai` to the new unified `google-genai` SDK. Version `0.2.0` has breaking changes across releases regarding streaming and system instructions.
2. **Missing Async SMTP Library**:
   - The platform relies on Python standard library `smtplib`, requiring blocking synchronous execution. It should be replaced with `aiosmtplib>=3.0.0`.
3. **Missing Production Connection Pooling**:
   - When migrating to PostgreSQL, `psycopg[binary]>=3.2.0` or `asyncpg` with `alembic` is required for reliable migration tracking.

---

## 24. Every Backend Capability Currently Missing

1. **Real OAuth 2.0 Integration Gateway**:
   - Missing authorization flow for Google Calendar, HubSpot, and Stripe. No token exchange, refresh token rotation, or webhook signature verification exists.
2. **Persistent Cloud Database Infrastructure**:
   - Production requires PostgreSQL (Supabase / AWS RDS) with schema migrations managed via Alembic, replacing local SQLite files.
3. **Asynchronous Distributed Job Queue**:
   - Outbound sequences, batch email dispatch, and recurring follow-up timers currently run as in-process coroutines or manual API triggers. A production Celery/Redis or ARQ worker is required for reliable background dispatch.
4. **Vector Database & Semantic Indexing**:
   - `V5KnowledgeChunk` has an empty `embedding` column. No embedding model (text-embedding-3-small or Gemini text-embedding-004) or vector similarity index (pgvector) is currently generating vector embeddings.
5. **Live Stripe Webhook Receiver**:
   - No webhook receiver exists to handle `checkout.session.completed`, `invoice.payment_succeeded`, or subscription cancellation events.

---

## SUMMARY OF AUDIT FINDINGS

### A. WHAT ACTUALLY WORKS
1. **Lead Engine V5 Discovery Pipeline (Modules 41–56)**:
   - 13-stage autonomous coordinator executes end-to-end.
   - Grounded website scraper extracts booking systems, live chat widgets, CMS, and contact info with zero hallucinations.
   - Anti-Health Inference Guard strictly rejects treating individuals in personal distress as leads.
   - Multi-factor lead scoring formula (0–100) accurately ranks business opportunities.
   - Deduplication service merges duplicate domains, phones, and emails without losing outreach history.
   - Human review mode enforces pre-flight compliance gates and requires explicit operator authorization before outbound sending.
   - 5-class inbound reply intelligence classifies sentiment and automatically suppresses opt-outs (`STOP`, `unsubscribe`).
2. **Multi-Tenant Data Layer & Seed Infrastructure**:
   - Authoritative V5 multi-tenant data models with tenant isolation (`business_id`).
   - Seeder initializes internal sales tenant, demo aesthetics clinic, and Austin dental benchmark prospects.
3. **Automated Test Coverage**:
   - 18 / 18 comprehensive tests pass 100% across `test_lead_engine_e2e.py` and `test_v5_platform.py`.
4. **Frontend Production Build**:
   - Compiles cleanly in Vite with zero syntax errors.

### B. WHAT IS MOCKED
1. **SaaS Portal Views (`frontend/src/components/app/`)**:
   - `AdminPanel.jsx`, `AppBilling.jsx`, `AppControlCenter.jsx`, `AppIntegrations.jsx`, `AppKnowledgeBase.jsx`, `AppSystemBuilder.jsx`, and `OnboardingWizard.jsx` operate on 100% hardcoded local state without connecting to backend V5 endpoints.
2. **Stripe Billing & Checkout**:
   - Simulated with `setTimeout(1200)` in `AppBilling.jsx` and `PaymentPortalModal.jsx`.
3. **Client-Side AI Receptionist Fallback**:
   - `receptionistClientFallback.js` executes keyword regex rules when the backend server is offline.
4. **Public Portfolio Interactive Demonstrations**:
   - Oracle AI BTC price streams, MEXC trading bot backtests, and Monopoly PK yield calculators generate data using randomized formulas.
5. **AI Tools Studio**:
   - `AIToolsForgeView.jsx` (18 mini-tools) operates entirely client-side using HTML5 canvas and Web Speech API.

### C. WHAT IS BROKEN
1. **Internal SPA Navigation**:
   - Public navbar uses `<button>` tags without HTML5 History API `pushState`, breaking browser back/forward buttons and preventing opening links in new tabs.
2. **Dead Portfolio URLs**:
   - Portfolio links point to `.demo.local` domains that fail to resolve.
3. **Synchronous SMTP Blocking**:
   - `SMTPEmailProvider` uses synchronous `smtplib.SMTP` inside an async loop, blocking event handling during email dispatch.
4. **Serverless Database Ephemerality**:
   - SQLite database path defaults to `/tmp/` on serverless platforms, losing all state when serverless containers recycle.

### D. WHAT IS MISSING
1. **Frontend-to-Backend Wiring for SaaS Portal**:
   - Connect `AppKnowledgeBase.jsx` to `/api/v1/knowledge/documents`.
   - Connect `AppIntegrations.jsx` to `/api/v1/integrations`.
   - Connect `AppSystemBuilder.jsx` and `OnboardingWizard.jsx` to `/api/v1/ai-employees` and `/api/v1/businesses`.
2. **Real OAuth 2.0 Flow**:
   - OAuth redirect handlers and token management for Google Calendar, HubSpot, and Stripe.
3. **True Vector Search (pgvector)**:
   - Embedding generation pipeline for document chunks and semantic knowledge retrieval.
4. **Background Distributed Task Worker**:
   - Dedicated Redis/Celery queue for asynchronous sequence scheduling and email dispatch.

### E. SECURITY RISKS
1. **CRITICAL**: Wildcard CORS (`allow_origins=["*"]`) combined with `allow_credentials=True`.
2. **CRITICAL**: Unauthenticated legacy V4 API routes allowing unauthorized kill-switch toggling, lead scraping, and audit log inspection.
3. **HIGH**: Active Google App Password stored in plaintext in `.env`.
4. **HIGH**: Default JWT secret key hardcoded in `config.py`.

---

## F. BACKEND BUILD PLAN

To elevate Rine Forge Systems from its current hybrid development state into an enterprise-grade AI automation platform, the following execution roadmap must be implemented in order:

### Phase 1: Security Hardening & Authentication Unification
1. **CORS Remediation**: Restrict `allow_origins` to authorized production domains (`https://rine-forge-systems.vercel.app`, `http://localhost:5173`) and reject wildcard origins when credentials are true.
2. **Secure Key Management**: Remove plaintext secrets from `.env`; enforce that `SECRET_KEY` and `SMTP_PASSWORD` must be provided via environment variables with strong entropy checks.
3. **Secure All Legacy Endpoints**: Apply `get_current_tenant` and `get_current_user` dependencies across `/api/kill-switch`, `/api/dashboard`, `/api/leads`, `/api/campaigns`, `/api/outreach`, and `/api/inbox`.
4. **Async SMTP Upgrade**: Replace synchronous `smtplib` with `aiosmtplib` to eliminate event loop blocking during mail delivery.

### Phase 2: Database Migration & Persistence
1. **PostgreSQL Migration**: Transition from SQLite to PostgreSQL (Supabase / AWS RDS) with `asyncpg` connection pooling.
2. **Alembic Migration System**: Initialize formal schema versioning to manage table evolutions safely without manual seed hacks.
3. **Vector Embeddings (pgvector)**: Equip `v5_knowledge_chunks` with an HNSW vector index and integrate OpenAI `text-embedding-3-small` / Gemini embeddings for true semantic RAG retrieval.

### Phase 3: SaaS Portal Frontend-Backend Integration
1. **Connect Knowledge Base**: Wire `AppKnowledgeBase.jsx` to `GET/POST/DELETE /api/v1/knowledge/documents` with live chunk visualizer.
2. **Connect Integrations Hub**: Wire `AppIntegrations.jsx` to `/api/v1/integrations` to display live connection statuses and securely input Meta & Stripe API keys.
3. **Connect System Builder & Onboarding**: Wire `AppSystemBuilder.jsx` and `OnboardingWizard.jsx` to create real records in `v5_businesses` and `v5_ai_employees`.
4. **Connect Control Center & Approvals**: Wire `AppControlCenter.jsx` to the kill-switch API and `AppApprovals.jsx` to `GET /api/v1/outreach/pending` and `POST /api/v1/outreach/{id}/approve`.

### Phase 4: Production Integrations & Background Workers
1. **Stripe Billing Integration**: Implement server-side Stripe Checkout session generation (`POST /api/v1/billing/checkout-session`) and secure webhook event verification.
2. **Distributed Sequence Worker**: Implement background task runner (ARQ or Celery with Redis) for reliable 72-hour sequence timing, daily velocity throttling, and automatic deliverability watchdog monitoring.
3. **Live Google Calendar Sync**: Implement two-way Google Calendar OAuth integration to synchronize appointments with staff calendars in real time.
