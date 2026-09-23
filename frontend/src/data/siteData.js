export const FORGE_PROBLEMS = [
  {
    id: 'missed-leads',
    title: 'MISSED LEADS',
    problem: 'Calls, forms and inquiries arrive after hours or while staff is busy, going cold before anyone responds.',
    forgeSolution: 'AI lead response + qualification + automated calendar routing in under 60 seconds.',
    outcome: 'Every inquiry is engaged instantly, qualified by budget/intent, and booked onto your calendar.'
  },
  {
    id: 'manual-follow-up',
    title: 'MANUAL FOLLOW-UP',
    problem: 'Potential customers get forgotten after the first interaction because reps are juggling too many tasks.',
    forgeSolution: 'Automated personalized multi-channel follow-up sequences synced directly to your CRM.',
    outcome: 'Consistent, context-aware touchpoints that nurture prospects until they are ready to buy.'
  },
  {
    id: 'repetitive-admin',
    title: 'REPETITIVE ADMIN',
    problem: 'Employees repeatedly copy, paste, enter and organize information between disparate tools and spreadsheets.',
    forgeSolution: 'AI document parsing, data extraction, validation, and bi-directional workflow synchronization.',
    outcome: 'Hours of manual data entry eliminated with automated validation and error logging.'
  },
  {
    id: 'customer-questions',
    title: 'CUSTOMER QUESTIONS',
    problem: 'Your team spends hours answering the exact same repetitive questions via email, phone, and website chat.',
    forgeSolution: 'AI support and knowledge agents trained on approved business documentation and FAQs.',
    outcome: 'Immediate, accurate 24/7 answers to routine questions with intelligent escalation for edge cases.'
  },
  {
    id: 'scheduling-friction',
    title: 'SCHEDULING FRICTION',
    problem: 'Appointments, client meetings, and site visits require 4–5 back-and-forth emails to coordinate.',
    forgeSolution: 'AI scheduling agents that verify attendee criteria, cross-check availability, and confirm bookings.',
    outcome: 'Zero friction booking with automatic calendar invites, reminders, and intake prep.'
  },
  {
    id: 'disconnected-systems',
    title: 'DISCONNECTED SYSTEMS',
    problem: 'Your CRM, email, spreadsheets, billing, and project management software do not communicate automatically.',
    forgeSolution: 'Event-driven integration pipelines that pass enriched data seamlessly across your operational stack.',
    outcome: 'Single source of truth across all tools with real-time updates and zero manual syncing.'
  }
];

export const FORGE_SOLUTIONS = [
  {
    id: 'ai-sales-systems',
    slug: 'ai-sales-systems',
    title: 'AI Sales Systems',
    headline: 'Automatically capture, qualify, follow up, and route leads 24/7.',
    summary: 'Turn high-intent inbound inquiries into qualified sales meetings before your competitors even open their email.',
    capabilities: [
      { name: 'Lead Qualification', desc: 'Evaluates budget, decision authority, timeline, and need in real time.' },
      { name: 'Lead Scoring', desc: 'Ranks incoming inquiries dynamically so high-value opportunities get immediate priority.' },
      { name: 'Personalized Outreach', desc: 'Crafts tailored follow-up messages referencing specific customer pain points.' },
      { name: 'CRM Automation', desc: 'Creates contacts, updates pipeline stages, and logs conversation transcripts automatically.' },
      { name: 'Appointment Booking', desc: 'Locks in qualified calendar slots directly on your sales team’s schedule.' },
      { name: 'Lead Reactivation', desc: 'Re-engages dormant opportunities in your database with contextual updates.' }
    ],
    idealFor: 'B2B companies, high-ticket services, agencies, and sales teams losing leads to slow response times.',
    architecture: 'Inbound Webhook → AI Intent Classifier → CRM Enrichment → Multi-Touch Sequence → Calendar Sync'
  },
  {
    id: 'ai-customer-service',
    slug: 'ai-customer-support',
    title: 'AI Customer Service',
    headline: 'Give customers immediate answers without adding headcount.',
    summary: 'Deliver instant, accurate, 24/7 assistance across web, email, and messaging using strictly approved business knowledge.',
    capabilities: [
      { name: '24/7 AI Chat & Web Support', desc: 'Handles routine inquiries with zero wait time and human-level nuance.' },
      { name: 'AI Email Triage & Drafts', desc: 'Categorizes incoming support emails, drafts verified responses, and routes complex cases.' },
      { name: 'AI Voice Reception', desc: 'Transcribes voice calls, answers standard FAQs, and routes callers accurately.' },
      { name: 'Knowledge Base Synchronization', desc: 'Answers questions strictly from your verified documentation with zero hallucinations.' },
      { name: 'Intelligent Ticket Escalation', desc: 'Identifies urgent or frustrated customers and alerts human team members instantly.' },
      { name: 'Satisfaction Logging', desc: 'Monitors sentiment and provides automated resolution summaries for leadership.' }
    ],
    idealFor: 'E-commerce, SaaS, clinics, field service operators, and hospitality businesses with high ticket volume.',
    architecture: 'Inbound Message → Knowledge Retrieval (RAG) → Safety & Policy Guardrails → Response Dispatch → Escalation Alert'
  },
  {
    id: 'ai-operations',
    slug: 'business-process-automation',
    title: 'AI Operations & Internal Workflows',
    headline: 'Automate repetitive back-office and operational processes.',
    summary: 'Connect your internal systems to eliminate manual data entry, automate document processing, and streamline cross-department handoffs.',
    capabilities: [
      { name: 'Document Processing & OCR', desc: 'Extracts line items, totals, and metadata from PDFs, invoices, and contracts into JSON.' },
      { name: 'Data Extraction & Normalization', desc: 'Standardizes messy customer inputs into clean, queryable database records.' },
      { name: 'Automated Reporting', desc: 'Compiles cross-platform metrics into concise weekly executive summaries.' },
      { name: 'Internal Approvals Routing', desc: 'Routes expense and contract approvals via Slack/email with audit logging.' },
      { name: 'Inventory & Resource Alerts', desc: 'Monitors stock thresholds and service capacity to trigger proactive alerts.' },
      { name: 'Cross-Tool Data Sync', desc: 'Bridges legacy databases with modern cloud CRMs and ERP systems.' }
    ],
    idealFor: 'Logistics, construction, professional services, finance, and operations teams managing heavy paperwork.',
    architecture: 'Document/Event Ingest → OCR & Data Structuring → Validation Rules → ERP/DB Commit → Audit Log'
  },
  {
    id: 'ai-marketing',
    slug: 'document-automation',
    title: 'AI Marketing & Content Operations',
    headline: 'Turn repetitive marketing tasks into reliable automated workflows.',
    summary: 'Systematize case study creation, social distribution, client review requests, and competitive research.',
    capabilities: [
      { name: 'Content Repurposing Pipelines', desc: 'Converts podcast/video transcripts into structured articles, social posts, and summaries.' },
      { name: 'Automated Review Requests', desc: 'Triggers personalized Google/Trustpilot review requests after successful client milestones.' },
      { name: 'Campaign Personalization', desc: 'Generates customized landing page copy and cold email variants tailored by industry.' },
      { name: 'Market & Competitor Monitoring', desc: 'Tracks industry shifts, pricing changes, and public signals into weekly briefing digests.' },
      { name: 'SEO Metadata & Schema Synthesis', desc: 'Generates structured JSON-LD and optimized OpenGraph tags at scale.' }
    ],
    idealFor: 'Marketing directors, content teams, local service businesses, and agencies looking to scale output without burnout.',
    architecture: 'Raw Input Ingest → Prompt Engineering Engine → Content Quality Filter → Scheduled Distribution'
  },
  {
    id: 'custom-ai-agents',
    slug: 'custom-ai-agents',
    title: 'Custom AI Agents',
    headline: 'Purpose-built intelligent agents for specialized enterprise workflows.',
    summary: 'When off-the-shelf software falls short, we engineer custom multi-step autonomous agents designed around your exact operational rules.',
    capabilities: [
      { name: 'Deep Research Agents', desc: 'Searches multiple public and private registries to compile comprehensive dossier reports.' },
      { name: 'Decision-Support Agents', desc: 'Analyzes complex datasets to provide probability scores and recommended next steps.' },
      { name: 'Internal Knowledge Agents', desc: 'Indexes private codebases, policies, and SOPs for natural-language team queries.' },
      { name: 'Multi-Step Autonomous Workflows', desc: 'Executes chains of actions across multiple APIs with strict human-in-the-loop checkpoints.' },
      { name: 'Microstructure & Predictive Engines', desc: 'High-frequency timeseries and real-time event processing architectures.' }
    ],
    idealFor: 'Fintech, healthtech, high-volume brokerages, legal firms, and enterprises with non-standard processes.',
    architecture: 'Event Trigger → Agent Goal Decomposition → Tool Execution Loop → Human Approval Gate → Result Dispatch'
  }
];

export const FORGE_AGENTS = [
  {
    id: 'lead-agent',
    name: 'Lead Agent',
    badge: 'INBOUND QUALIFICATION',
    role: 'Captures, evaluates, and routes incoming opportunities in under 60 seconds.',
    input: 'Inbound web form, portal inquiry, email, or chat message.',
    aiDecision: 'Extracts buyer budget, timeline, service requirement, and ICP match score.',
    action: 'Routes high-value leads to senior reps; triggers personalized nurture sequence for others.',
    oversight: 'Flagged for human review if intent score is ambiguous or budget exceeds threshold.'
  },
  {
    id: 'sales-agent',
    name: 'Sales Agent',
    badge: 'RESEARCH & OUTREACH',
    role: 'Researches prospects and prepares tailored outreach briefs.',
    input: 'Prospect company name, URL, or LinkedIn profile from target list.',
    aiDecision: 'Identifies tech stack, recent hiring, operational bottlenecks, and relevant case study match.',
    action: 'Drafts bespoke 3-touch outreach sequence and populates CRM deal records.',
    oversight: 'Reps review and approve generated outreach before dispatch.'
  },
  {
    id: 'support-agent',
    name: 'Support Agent',
    badge: '24/7 KNOWLEDGE BASE',
    role: 'Answers customer questions accurately using approved business documentation.',
    input: 'Inbound customer inquiry via web chat, support email, or WhatsApp.',
    aiDecision: 'Cross-references company knowledge base; evaluates confidence and policy compliance.',
    action: 'Delivers instant answer with documentation citations; logs resolution in helpdesk.',
    oversight: 'Escalates immediately to human support tier if query involves billing disputes or sensitive account changes.'
  },
  {
    id: 'receptionist-agent',
    name: 'Receptionist Agent',
    badge: 'VOICE & SCHEDULING',
    role: 'Handles voice calls, patient/client intake, and direct appointment booking.',
    input: 'Inbound phone call or after-hours voice message.',
    aiDecision: 'Transcribes speech in real time, determines urgency level, and checks calendar slot availability.',
    action: 'Locks appointment in calendar, texts patient confirmation, and dispatches intake forms.',
    oversight: 'Urgent medical or facility emergencies trigger instant SMS notification to on-call staff.'
  },
  {
    id: 'research-agent',
    name: 'Research Agent',
    badge: 'DATA SYNTHESIS',
    role: 'Collects, analyzes, and summarizes complex public and private information.',
    input: 'Topic, target market, legal docket, or competitor domain.',
    aiDecision: 'Filters noise, verifies primary source facts, and structures findings into standardized matrix.',
    action: 'Generates executive 1-page briefing with verified citations and actionable takeaways.',
    oversight: 'Human analysts review briefing before final client submission.'
  },
  {
    id: 'operations-agent',
    name: 'Operations Agent',
    badge: 'INTERNAL WORKFLOWS',
    role: 'Executes repetitive internal workflows across disparate software tools.',
    input: 'Completed service order, signed PDF contract, or incoming vendor invoice.',
    aiDecision: 'Extracts line items, validates tax IDs and pricing against master agreement.',
    action: 'Updates accounting software, creates project folder, and notifies fulfillment team in Slack.',
    oversight: 'Invoices over $5,000 require 1-click human manager authorization.'
  }
];

export const FORGE_INDUSTRIES = [
  {
    id: 'real-estate',
    slug: 'real-estate',
    name: 'Real Estate & Property Management',
    tagline: 'Never lose a qualified buyer or tenant to a delayed response.',
    heroProblem: 'Inbound portal inquiries from Zillow, Realtor.com, and website forms go cold when agents are in showings or off-hours.',
    problems: [
      'Inquiries sitting unread for hours while buyers contact competing brokers.',
      'Manual scheduling of private property tours requiring 5+ text messages.',
      'Tenant maintenance requests arriving at midnight with zero triage.',
      'Dormant buyer databases that never get systematically re-engaged.'
    ],
    solutions: [
      'Sub-60s automated lead qualification parsing buyer budget, pre-approval status, and timeline.',
      'Direct calendar tour scheduling synced to broker Google/Outlook calendars.',
      '24/7 tenant emergency maintenance triage with automated vendor dispatch.',
      'Automated new-listing broadcast matching buyer criteria in your CRM.'
    ],
    agents: ['Lead Agent', 'Receptionist Agent', 'Sales Agent'],
    avgDealValueDefault: 12000,
    monthlyLeadsDefault: 150
  },
  {
    id: 'dental',
    slug: 'dental',
    name: 'Dental Practices & Clinics',
    tagline: 'Fill your chairs with high-value treatments around the clock.',
    heroProblem: 'Front-desk staff is overwhelmed during business hours and completely unavailable after 5 PM when patients look to book.',
    problems: [
      'High-value implant, cosmetic, and emergency inquiries lost to voicemail after hours.',
      'Front desk spending 40% of their day answering routine insurance and pricing FAQs.',
      'Last-minute cancellations leaving costly unfilled hygiene and surgical slots.',
      'Manual pre-appointment patient intake paperwork slowing down check-ins.'
    ],
    solutions: [
      '24/7 AI Receptionist answering treatment, pricing, and insurance questions accurately.',
      'Instant calendar booking for new-patient consultations and emergency exams.',
      'Automated cancellation fill-in pipeline that texts waitlisted patients instantly.',
      'Digital intake and insurance policy verification delivered via SMS before arrival.'
    ],
    agents: ['Receptionist Agent', 'Support Agent', 'Lead Agent'],
    avgDealValueDefault: 1800,
    monthlyLeadsDefault: 90
  },
  {
    id: 'healthcare',
    slug: 'healthcare',
    name: 'Healthcare & Specialized Medical',
    tagline: 'Streamline patient intake, triage inquiries, and reduce administrative overhead.',
    heroProblem: 'Clinical staff spends critical hours managing appointment intake and repetitive triage rather than patient care.',
    problems: [
      'Phone queues causing patient frustration and high call abandonment rates.',
      'Repetitive insurance pre-authorization and intake data entry.',
      'Follow-up care instructions and appointment confirmations requiring manual phone calls.',
      'No structured after-hours triage for non-emergency inquiries.'
    ],
    solutions: [
      'Intelligent intake workflows extracting referral data and insurance cards into EHR.',
      'HIPAA-compliant conversational agents handling routine patient scheduling.',
      'Automated care plan reminders and post-procedure check-in surveys.',
      'Structured triage logic directing emergency calls to on-call physicians.'
    ],
    agents: ['Receptionist Agent', 'Operations Agent', 'Support Agent'],
    avgDealValueDefault: 2500,
    monthlyLeadsDefault: 120
  },
  {
    id: 'legal',
    slug: 'legal',
    name: 'Law Firms & Legal Practices',
    tagline: 'Qualify high-value client intake immediately before they call another firm.',
    heroProblem: 'Prospective clients in urgent legal situations call 3–4 firms; whoever qualifies and answers first wins the retainer.',
    problems: [
      'Attorneys wasting billable hours answering unqualified consultation calls.',
      'Slow intake response causing prospective clients to retain competing firms.',
      'Repetitive conflict checks and case detail collection done manually.',
      'Document summarization and docket tracking eating associate hours.'
    ],
    solutions: [
      '24/7 intake agent evaluating jurisdiction, case type, statute of limitations, and conflict parameters.',
      'Automated retainer scheduling directly into partner calendars.',
      'Structured intake dossier prepared for the attorney prior to the initial consultation.',
      'Automated document extraction from court dockets and discovery files.'
    ],
    agents: ['Lead Agent', 'Research Agent', 'Operations Agent'],
    avgDealValueDefault: 6500,
    monthlyLeadsDefault: 75
  },
  {
    id: 'hospitality',
    slug: 'hospitality',
    name: 'Hospitality & Luxury Venues',
    tagline: 'Deliver concierge-level responsiveness to every guest and event planner.',
    heroProblem: 'Event planners and VIP guests expect instantaneous responses for wedding/corporate bookings, but sales teams are slow to quote.',
    problems: [
      'High-value private event and wedding inquiries taking 48+ hours to receive a preliminary proposal.',
      'Guest requests for amenities, check-in, and dining cluttering the front desk.',
      'Manual banquet event order (BEO) data entry across multiple disconnected platforms.',
      'Lost repeat bookings due to lack of post-stay engagement.'
    ],
    solutions: [
      'Automated event intake quoting preliminary floor plans, guest counts, and catering estimates.',
      '24/7 guest concierge answering property FAQs and booking amenities via SMS/WhatsApp.',
      'Automated BEO generation from signed contracts directly into catering software.',
      'Intelligent post-event review generation and annual re-booking reminders.'
    ],
    agents: ['Lead Agent', 'Support Agent', 'Operations Agent'],
    avgDealValueDefault: 8500,
    monthlyLeadsDefault: 60
  },
  {
    id: 'ecommerce',
    slug: 'ecommerce',
    name: 'E-commerce & Direct-to-Consumer',
    tagline: 'Scale customer support and convert abandoned shoppers without bloating your payroll.',
    heroProblem: 'Customer support costs surge with order volume while abandoned carts and checkout questions go unanswered.',
    problems: [
      '70%+ of customer support tickets asking the exact same "Where is my order?" (WISMO) question.',
      'Pre-purchase product fit questions causing immediate cart abandonment.',
      'Manual return authorization and exchange processing taking days.',
      'Dull broadcast marketing emails resulting in declining engagement.'
    ],
    solutions: [
      'Real-time order status and shipping tracking agent integrated directly with Shopify/Klaviyo.',
      'Pre-purchase product recommendation agent resolving sizing and compatibility questions.',
      'Self-service automated return and refund portal with policy validation.',
      'Segmented AI re-engagement based on exact browsing behavior.'
    ],
    agents: ['Support Agent', 'Sales Agent', 'Operations Agent'],
    avgDealValueDefault: 120,
    monthlyLeadsDefault: 1200
  },
  {
    id: 'construction',
    slug: 'construction',
    name: 'Construction & Commercial Trades',
    tagline: 'Capture project bids, dispatch field techs, and automate subcontractor paperwork.',
    heroProblem: 'Contractors and project managers are on job sites all day, leaving lucrative project quote requests unanswered in their inboxes.',
    problems: [
      'Commercial estimate requests languishing for days while estimators are in the field.',
      'Subcontractor compliance, COIs, and invoice approvals buried in chaotic email threads.',
      'Emergency repair calls coming in after hours without systematic technician dispatch.',
      'Change order approvals causing costly project delays due to manual sign-offs.'
    ],
    solutions: [
      'Automated bid qualification collecting square footage, blueprints, and timeline specs.',
      '24/7 emergency dispatch agent transcribing audio, assessing urgency, and routing on-call techs.',
      'Subcontractor invoice and lien waiver OCR processing with automated accounting sync.',
      'Automated change order notification and digital sign-off pipeline.'
    ],
    agents: ['Lead Agent', 'Receptionist Agent', 'Operations Agent'],
    avgDealValueDefault: 18000,
    monthlyLeadsDefault: 40
  },
  {
    id: 'logistics',
    slug: 'logistics',
    name: 'Logistics, Freight & Supply Chain',
    tagline: 'Automate load tracking, rate inquiries, and bill-of-lading processing.',
    heroProblem: 'Brokers and dispatchers spend their day answering "Where is the load?" emails and manually re-typing paper Bills of Lading (BOLs).',
    problems: [
      'Shippers waiting hours for spot freight quotes and driver status updates.',
      'Manual data entry of paper BOLs, PODs, and customs paperwork into the TMS.',
      'Carrier vetting and insurance validation requiring tedious manual checks.',
      'Detention fee claims delayed due to unstructured timestamp records.'
    ],
    solutions: [
      'Automated email agent parsing spot quote requests and returning rate estimates in 90 seconds.',
      'Vision OCR agent extracting line items and signatures from BOLs/PODs into your TMS.',
      'Real-time automated milestone updates dispatched to shippers via email/SMS.',
      'Automated carrier safety score and insurance expiration monitoring.'
    ],
    agents: ['Operations Agent', 'Support Agent', 'Research Agent'],
    avgDealValueDefault: 4500,
    monthlyLeadsDefault: 200
  },
  {
    id: 'professional-services',
    slug: 'professional-services',
    name: 'Professional Services & Consulting',
    tagline: 'Systematize client discovery, proposal drafting, and ongoing deliverables.',
    heroProblem: 'Consultants and agency owners get pulled into administrative drudgery instead of delivering high-margin client strategy.',
    problems: [
      'Spending 8–10 hours per prospect drafting custom proposals from scratch.',
      'Manual client onboarding requiring endless email back-and-forth for assets and logins.',
      'Monthly client reporting eating the first week of every month for account managers.',
      'Scope creep caused by unlogged client requests across Slack and email.'
    ],
    solutions: [
      'Automated proposal synthesizer generating preliminary scopes from discovery call notes.',
      'Self-service client onboarding portal collecting credentials and assets with automated follow-up.',
      'Automated monthly executive reporting pulling data from all analytics tools into clean PDF briefs.',
      'Scope tracking agent flagging out-of-contract requests for manager review.'
    ],
    agents: ['Sales Agent', 'Operations Agent', 'Research Agent'],
    avgDealValueDefault: 7500,
    monthlyLeadsDefault: 50
  },
  {
    id: 'finance',
    slug: 'finance',
    name: 'Finance, Accounting & Wealth Management',
    tagline: 'Automate document collection, tax data extraction, and advisory scheduling.',
    heroProblem: 'CPAs and financial advisors spend 60% of their day chasing client tax documents and re-entering bank data into accounting software.',
    problems: [
      'Chasing clients for W-2s, 1099s, and bank statements across months of email threads.',
      'Manual receipt and expense reconciliation consuming costly bookkeeper hours.',
      'High-net-worth consultation requests waiting days for calendar coordination.',
      'Compliance audit trails scattered across disparate communication channels.'
    ],
    solutions: [
      'Automated document collection portal with instant OCR validation for missing pages.',
      'Receipt and statement parsing pipeline committing clean records directly to QuickBooks/Xero.',
      'Automated lead qualification matching investor AUM criteria to senior wealth advisors.',
      'Immutable audit logging for all automated financial communications.'
    ],
    agents: ['Operations Agent', 'Lead Agent', 'Support Agent'],
    avgDealValueDefault: 5000,
    monthlyLeadsDefault: 60
  }
];

export const FORGE_CASE_STUDIES = [
  {
    id: 'oracle-ai',
    title: 'Oracle AI — High-Frequency Market Microstructure & Signal Engine',
    category: 'Internal FORGE System / Demonstration',
    statusBadge: 'INTERNAL BUILD / LIVE ARCHITECTURE',
    problem: 'Traditional timeseries systems suffer from high latency and disconnected signal verification when processing multi-exchange orderbook depth.',
    system: 'Engineered an event-driven async Python architecture with non-blocking WebSocket ring buffers ingesting 5-minute candle structure and orderbook depth imbalances.',
    implementation: 'WebSocket Ingestion (Binance/MEXC) → NumPy/Pandas Microstructure Engine → Probabilistic Confidence Scorer → Signal Broadcast Pipeline.',
    result: 'Sub-14ms stream latency, real-time directional imbalance classification, and automated take-profit / stop-loss risk bounding. (Demonstration architecture showing engineering capability; not a public trading advisory service).',
    tech: ['Python 3.12 AsyncIO', 'FastAPI', 'WebSockets', 'NumPy', 'Tailwind', 'React'],
    timeline: '3 Weeks (Internal Prototype to Production Benchmark)'
  },
  {
    id: 'fact-fuel',
    title: 'Fact Fuel — Multi-Source News Verification & Script Engine',
    category: 'Internal FORGE System / Demonstration',
    statusBadge: 'INTERNAL BUILD / DEMO PIPELINE',
    problem: 'Media workflows require rapid verification of breaking wire claims without the risk of generative hallucinations or unverified sources.',
    system: 'Architected a multi-source cross-referencing pipeline utilizing Google Gemini 1.5 Pro structured outputs to query primary feeds, score credibility, and generate short-form scripts.',
    implementation: 'Claim Ingest → Multi-Source Search Aggregator → Zero-Shot Verification Gating → Structured Hook/Body/CTA Script Synthesis.',
    result: 'Zero hallucinations on verified multi-source tests with sub-2s synthesis time. (Demonstrates structured generative NLP pipelines for editorial workflows).',
    tech: ['Google Gemini 1.5 Pro', 'FastAPI', 'Redis Queue', 'React'],
    timeline: '2 Weeks'
  },
  {
    id: 'speed-to-lead',
    title: 'Speed-to-Lead — Sub-60s Inbound Qualification & Tour Router',
    category: 'Internal FORGE System / Demonstration',
    statusBadge: 'INTERNAL BUILD / BENCHMARK WORKFLOW',
    problem: 'Real estate and luxury brokers lose over 50% of portal leads because average response times exceed 4 hours.',
    system: 'Engineered an automated webhook intake pipeline that enriches buyer budget and financing criteria, initiates 2-way SMS dialogue, and books private tours.',
    implementation: 'Portal Webhook → LLM Intent Extraction → SMS/Email Dispatcher → Google Calendar Sync → CRM Stage Update.',
    result: 'Simulated inquiry-to-booking pipeline completes in 38 seconds average with zero human delay during after-hours testing.',
    tech: ['Python FastAPI', 'Twilio API', 'Google Calendar API', 'PostgreSQL'],
    timeline: '10 Days'
  },
  {
    id: 'omnisync',
    title: 'OmniSync — Emergency Voice Call Triage & CRM Dispatcher',
    category: 'Internal FORGE System / Demonstration',
    statusBadge: 'INTERNAL BUILD / FIELD DISPATCH PROTOTYPE',
    problem: 'Commercial HVAC and facilities contractors lose thousands in after-hours breakdown revenue when emergency calls go to voicemail.',
    system: 'Built an audio transcription and urgency triage engine that extracts compressor/unit fault codes from caller speech and alerts on-call technicians.',
    implementation: 'Voice Audio Ingest → Whisper AI Transcription → Priority Urgency Classifier → Jobber/FieldEdge Ticket Commit → Technician GPS Routing Alert.',
    result: 'Full triage and emergency work order creation executed in under 15 seconds from call completion in controlled staging benchmarks.',
    tech: ['Whisper AI', 'FastAPI', 'Jobber API', 'PostgreSQL', 'Tailwind'],
    timeline: '2 Weeks'
  }
];

export const FORGE_FAQS = [
  {
    q: 'How does the AI learn our business?',
    a: 'You provide your existing service list, pricing guidelines, hours, and common customer questions through a simple 10-minute questionnaire or document upload. We convert this into a verified, bounded knowledge base that the system adheres to strictly.'
  },
  {
    q: 'Can it answer our FAQs?',
    a: 'Yes. It accurately answers common questions about services, pricing ranges, operating hours, directions, parking, accepted insurance/payment, and preparation instructions. It is instructed never to guess beyond approved documentation.'
  },
  {
    q: 'Can it book appointments directly?',
    a: 'Yes. It checks your live availability in Google Calendar, Outlook, Calendly, or your industry CRM (such as GoHighLevel, Jobber, or Dentrix) and books directly into your schedule with double-booking prevention.'
  },
  {
    q: 'Can it transfer calls to humans?',
    a: 'Yes. If a caller requests a team member or has an urgent inquiry requiring human judgement, the system can instantly forward the live call to your office desk, mobile number, or on-call staff.'
  },
  {
    q: 'What happens if it doesn’t know something?',
    a: 'It never guesses or makes things up. If a question falls outside its approved knowledge, it politely informs the caller, records their details and question, and sends an urgent notification to your team with the full transcript.'
  },
  {
    q: 'Can it work after hours and on weekends?',
    a: 'Yes. It operates 24/7/365. When your team is off the clock on evenings, weekends, or holidays, the AI answers immediately, captures customer details, and books appointments so you never lose callers to competitors.'
  },
  {
    q: 'Can it work with our existing tools?',
    a: 'Yes. You do not need to replace your software. We connect directly with your existing phone number, CRM (HubSpot, GoHighLevel, Salesforce), Google/Outlook calendar, email, and messaging platforms.'
  },
  {
    q: 'How long does setup take?',
    a: 'A standard AI Receptionist or Speed-to-Lead deployment takes 3 to 5 business days from intake to live staging. You test the system thoroughly in a private staging sandbox before anything goes live.'
  },
  {
    q: 'What does ongoing support look like?',
    a: 'Every deployment includes 30 days of active post-launch monitoring and adjustment to tune responses to real caller interactions. Ongoing support is available to maintain prompts as your services evolve.'
  },
  {
    q: 'What does it cost?',
    a: 'Our deployments are flat-rate packages starting at $199 with a 50% milestone deposit ($99) to begin engineering. The remaining 50% is settled only after you test and approve your live system. Zero hidden hourly consulting fees.'
  }
];
