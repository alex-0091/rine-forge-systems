// Centralized Platform Configuration for FORGE — The Ultimate AI Business Operating Platform

export const PRICING_CONFIG = {
  trialDays: 14,
  trialCredits: 100,
  plans: [
    {
      id: 'free-trial',
      name: 'Free 14-Day Trial',
      tagline: 'Experience FORGE systems on real business workflows.',
      priceMonthly: 0,
      priceAnnual: 0,
      creditsMonthly: 100,
      activeSystemsLimit: 2,
      features: [
        '100 automated workflow executions',
        '2 active AI systems in sandbox mode',
        'Standard integrations (Gmail, Sheets, Slack)',
        'Interactive AI Knowledge Base (10 docs)',
        'Standard email support',
        'No credit card required'
      ],
      ctaText: 'Start Free Trial',
      isPopular: false
    },
    {
      id: 'starter',
      name: 'Starter Operator',
      tagline: 'For boutique practices and high-ticket service teams.',
      priceMonthly: 249,
      priceAnnual: 199,
      creditsMonthly: 2500,
      activeSystemsLimit: 3,
      features: [
        '2,500 automated workflow executions / mo',
        '3 production AI systems active 24/7',
        'Full CRM sync (HubSpot, Salesforce, GHL)',
        'AI Knowledge Base with vector indexing',
        'Human approval checkpoints & audit logs',
        'Sub-60s webhook latency',
        'Priority email & Slack support'
      ],
      ctaText: 'Activate Starter Plan',
      isPopular: false
    },
    {
      id: 'growth',
      name: 'Growth Engine',
      tagline: 'For scaling companies automating sales, triage & back-office.',
      priceMonthly: 499,
      priceAnnual: 399,
      creditsMonthly: 10000,
      activeSystemsLimit: 8,
      features: [
        '10,000 automated workflow executions / mo',
        '8 production AI systems active 24/7',
        'Multi-agent workflow chaining',
        'Voice reception & audio transcription',
        'Full document OCR & ERP synchronization',
        'Custom human-in-the-loop governance rules',
        '99.9% uptime SLA & dedicated architect'
      ],
      ctaText: 'Activate Growth Plan',
      isPopular: true
    },
    {
      id: 'business',
      name: 'Business Infrastructure',
      tagline: 'High-throughput operational automation for established firms.',
      priceMonthly: 899,
      priceAnnual: 749,
      creditsMonthly: 35000,
      activeSystemsLimit: 20,
      features: [
        '35,000 automated workflow executions / mo',
        'Unlimited active AI systems',
        'Zero-data-retention enterprise API endpoints',
        'Custom webhooks, private database bridges & VPC',
        'SOC-2 / GDPR compliance logging & export',
        'Custom agent fine-tuning & prompt hardening',
        '1-hour SLA emergency engineering support'
      ],
      ctaText: 'Activate Business Plan',
      isPopular: false
    },
    {
      id: 'custom',
      name: 'Enterprise Bespoke',
      tagline: 'Custom agentic infrastructure engineered to your exact specifications.',
      priceMonthly: 'Custom',
      priceAnnual: 'Custom',
      creditsMonthly: 'Unlimited',
      activeSystemsLimit: 'Unlimited',
      features: [
        'Dedicated distributed container infrastructure',
        'Private cloud deployment (AWS, GCP, Azure, On-Prem)',
        'Custom quantitative alpha & predictive timeseries',
        'Full source code license & IP ownership transfer',
        'Dedicated AI engineering squad on retainer',
        'Custom enterprise security audit'
      ],
      ctaText: 'Design Custom Architecture',
      isPopular: false
    }
  ]
};

export const SYSTEMS_CATALOG = [
  {
    id: 'lead-agent',
    slug: 'lead-agent',
    name: 'FORGE Lead Agent',
    badge: 'REAL • PRODUCTION READY',
    category: 'Sales & Growth',
    serviceClass: 'REAL',
    headline: 'Automatically capture, qualify, score, and route inbound leads before they go cold.',
    description: 'Engages inbound website visitors, portal leads, and webhooks in real time. Evaluates budget, urgency, and purchase criteria before routing qualified leads to your team.',
    iconName: 'Zap',
    version: 'v4.0.0',
    status: 'REAL',
    rating: 4.9,
    slaTarget: 'Target SLA: 99.5%',
    avgLatency: 'Bench: Sub-60s Routing',
    workflowSteps: [
      { step: '01', title: 'Webhook Ingestion', desc: 'Captures inquiry from website form, portal, or ad landing page.' },
      { step: '02', title: 'Intent & Budget Extraction', desc: 'Parses buyer purchasing capacity, timeline, and exact service need.' },
      { step: '03', title: 'Scoring & Qualification', desc: 'Assigns 0-100 ICP score based on your custom qualification criteria.' },
      { step: '04', title: 'CRM Commit & Routing', desc: 'Creates contact in your CRM, alerts rep, and provides booking options.' }
    ],
    demoConfig: {
      defaultInput: 'Hi, we are looking to automate our patient intake process for 3 medical clinics. We currently handle ~400 inquiries a month.',
      sampleOutput: {
        intent: 'Enterprise B2B Automation Inquiry',
        leadScore: 92,
        priority: 'HIGH_VALUE_PROSPECT',
        extractedBudget: '$5,000 - $15,000 / mo',
        recommendedAction: 'Instantly lock 30-minute Architecture Consultation on Partner Calendar',
        crmStatus: 'LEAD_COMMITTED_HUBSPOT',
        draftedFollowUp: 'Thank you for reaching out! Given your 3 clinic locations and 400 monthly inquiries, our Healthcare Intake Agent typically recovers 18 hours/week. Here is a direct link to lock in an architecture review: https://cal.com/forge/arch-review'
      }
    },
    supportedIntegrations: ['HubSpot', 'Salesforce', 'GoHighLevel', 'Slack', 'Gmail', 'Google Calendar']
  },
  {
    id: 'receptionist-agent',
    slug: 'ai-receptionist',
    name: 'FORGE 24/7 AI Receptionist',
    badge: 'REAL • PRODUCTION READY',
    category: 'Operations & Triage',
    serviceClass: 'REAL',
    headline: 'Answers customers 24/7 and handles routine enquiries.',
    description: 'Handles incoming phone calls and live website chat with human nuance. Answers routine service and insurance FAQs, evaluates emergency urgency, and confirms schedule slots directly into your booking system.',
    iconName: 'Bot',
    version: 'v4.1.0',
    status: 'REAL',
    rating: 4.95,
    slaTarget: 'Target SLA: 99.8%',
    avgLatency: 'Bench: Live Streaming',
    workflowSteps: [
      { step: '01', title: 'Audio / Text Ingest', desc: 'Real-time multi-turn conversation streaming with zero latency.' },
      { step: '02', title: 'Knowledge Verification', desc: 'Cross-checks approved company documentation with zero hallucinations.' },
      { step: '03', title: 'Urgency Classification', desc: 'Categorizes non-emergency vs. high-priority urgent cases.' },
      { step: '04', title: 'Calendar Lock & SMS', desc: 'Locks slot in calendar and dispatches confirmation SMS with intake prep.' }
    ],
    demoConfig: {
      defaultInput: 'Do you accept Delta Dental PPO, and do you have an opening for an emergency root canal consultation this Saturday?',
      sampleOutput: {
        intent: 'Emergency Dental Consultation & Insurance Inquiry',
        insuranceVerified: 'Delta Dental PPO — ACCEPTED (In-Network)',
        urgency: 'HIGH_PRIORITY_CLINICAL',
        slotAvailable: 'Saturday, 11:30 AM (Dr. Reynolds)',
        agentResponse: 'Yes, we accept Delta Dental PPO! Dr. Reynolds has an emergency consultation opening this Saturday at 11:30 AM. Shall I lock this appointment in for you right now?',
        bookingAction: 'PENDING_USER_CONFIRMATION'
      }
    },
    supportedIntegrations: ['Google Calendar', 'Twilio Voice', 'WhatsApp', 'Calendly', 'Jobber', 'Zendesk']
  },
  {
    id: 'outreach-engine',
    slug: 'outreach-engine',
    name: 'FORGE Outreach Engine',
    badge: 'REAL • PRODUCTION READY',
    category: 'Sales & Growth',
    serviceClass: 'REAL',
    headline: 'Research target accounts, identify business friction, and generate tailored outreach.',
    description: 'Analyzes target company websites, tech stacks, and job postings to detect high-value operational bottlenecks. Crafts hyper-relevant 3-touch outreach sequences that resonate with decision makers.',
    iconName: 'Send',
    version: 'v4.0.0',
    status: 'REAL',
    rating: 4.88,
    slaTarget: 'Target SLA: 99.0%',
    avgLatency: 'Bench: Automated Batch',
    workflowSteps: [
      { step: '01', title: 'Domain Ingest', desc: 'Scans target company website, services, and team structure.' },
      { step: '02', title: 'Friction Analysis', desc: 'Identifies manual bottlenecks (e.g. slow response, paper forms).' },
      { step: '03', title: 'Case Study Matching', desc: 'Finds corresponding benchmark architectures and measurable proof.' },
      { step: '04', title: 'Sequence Synthesis', desc: 'Produces bespoke 3-touch email & LinkedIn outreach sequence.' }
    ],
    demoConfig: {
      defaultInput: 'https://vance-dental.example.com — A 4-location cosmetic and family dental group.',
      sampleOutput: {
        targetCompany: 'Vance Dental Group (4 Locations)',
        detectedBottlenecks: [
          'No after-hours online booking on mobile site',
          'Manual PDF download required for patient registration',
          'Estimated 35+ weekly hours lost to routine insurance phone calls'
        ],
        matchedProof: 'Vance Dental Pilot (+28% after-hours bookings, $24k recovered in month 1)',
        subjectLine: 'After-hours booking friction across Vance Dental locations',
        emailBody: 'Hi Dr. Vance, noticed your 4 locations have high after-hours search traffic but require manual phone calls to book cosmetic exams. We built an autonomous receptionist for dental groups that recovers ~28% in after-hours surgical appointments. Would you be open to a 2-minute interactive demo?'
      }
    },
    supportedIntegrations: ['HubSpot', 'Salesforce', 'Gmail', 'Microsoft Outlook', 'Apollo', 'Instantly']
  },
  {
    id: 'document-processor',
    slug: 'document-processor',
    name: 'FORGE Document Engine',
    badge: 'REAL • PRODUCTION READY',
    category: 'Operations & Triage',
    serviceClass: 'REAL',
    headline: 'Automates document processing: extracts invoices, claims, and PDFs into your database.',
    description: 'Transforms unstructured PDFs, vendor invoices, bills of lading, and signed contracts into validated JSON records. Automatically cross-references purchase orders and updates your accounting or ERP database.',
    iconName: 'FileText',
    version: 'v4.0.0',
    status: 'REAL',
    rating: 4.92,
    slaTarget: 'Target SLA: 99.5%',
    avgLatency: 'Bench: Structured Extraction',
    workflowSteps: [
      { step: '01', title: 'Multi-Format Ingest', desc: 'Accepts PDF, scanned PNG/JPG, TIFF, or DOCX documents.' },
      { step: '02', title: 'Vision OCR & Extraction', desc: 'Identifies vendor, tax ID, line items, unit rates, and totals.' },
      { step: '03', title: 'Mathematical Validation', desc: 'Verifies sum calculations against line items and PO records.' },
      { step: '04', title: 'ERP/Accounting Commit', desc: 'Pushes clean records directly to QuickBooks, Xero, or PostgreSQL.' }
    ],
    demoConfig: {
      defaultInput: 'Sample Commercial HVAC Subcontractor Invoice #INV-8841 ($4,850.00 for Rooftop Chiller Maintenance).',
      sampleOutput: {
        documentType: 'Commercial Subcontractor Invoice',
        vendorName: 'Apex Thermal Solutions LLC',
        invoiceNumber: 'INV-8841',
        totalAmount: '$4,850.00',
        lineItems: [
          { item: 'Compressor Core Rebuild (Labor)', qty: 14, rate: '$175.00', subtotal: '$2,450.00' },
          { item: 'OEM Refrigerant Charge R-410A (50 lbs)', qty: 1, rate: '$1,800.00', subtotal: '$1,800.00' },
          { item: 'Environmental Recovery Fee', qty: 1, rate: '$600.00', subtotal: '$600.00' }
        ],
        validationStatus: 'PASSED (Line items sum exactly to $4,850.00)',
        accountingDestination: 'QuickBooks Online / Accounts Payable'
      }
    },
    supportedIntegrations: ['QuickBooks', 'Xero', 'Google Drive', 'PostgreSQL', 'Slack', 'Zapier']
  },
  {
    id: 'support-agent',
    slug: 'support-agent',
    name: 'FORGE Support Agent',
    badge: 'REAL • PRODUCTION READY',
    category: 'Customer Support',
    serviceClass: 'REAL',
    headline: 'Answers customers using your verified business knowledge.',
    description: 'Resolves routine questions with human-level clarity across web chat, email, and messaging. Operates within deterministic guardrails to prevent hallucinations, with automatic escalation for sensitive inquiries.',
    iconName: 'MessageSquare',
    version: 'v4.0.2',
    status: 'REAL',
    rating: 4.96,
    slaTarget: 'Target SLA: 99.9%',
    avgLatency: 'Bench: Direct Vector Lookup',
    workflowSteps: [
      { step: '01', title: 'Inbound Ticket Ingest', desc: 'Listens across email, webchat, WhatsApp, and Slack.' },
      { step: '02', title: 'Vector RAG Retrieval', desc: 'Extracts relevant paragraphs from verified company knowledge base.' },
      { step: '03', title: 'Safety & Policy Gating', desc: 'Ensures response complies with business rules and terms.' },
      { step: '04', title: 'Dispatch & Resolution Log', desc: 'Replies instantly and closes ticket with full summary.' }
    ],
    demoConfig: {
      defaultInput: 'What is your refund policy if a project pilot does not meet our agreed technical benchmarks?',
      sampleOutput: {
        intent: 'Refund & Technical Milestone Policy Inquiry',
        retrievedDoc: 'Master Service Agreement Section 4.2 (Technical Warranty)',
        groundedAnswer: 'Under Section 4.2 of our Master Service Agreement, all pilot deployments operate on 50% milestone-based billing. If a deliverable fails to satisfy agreed technical acceptance benchmarks during the 14-day warranty period, the milestone deposit is fully refundable.',
        confidenceScore: 99.4,
        escalationRequired: false
      }
    },
    supportedIntegrations: ['Zendesk', 'Intercom', 'Slack', 'Email', 'Shopify', 'Freshdesk']
  },
  {
    id: 'research-agent',
    slug: 'research-agent',
    name: 'FORGE Research Agent',
    badge: 'PRODUCTION AGENT',
    category: 'Research & Intelligence',
    serviceClass: 'RESEARCH AGENT',
    headline: 'Synthesize market data, competitor intel, and public records into executive briefs.',
    description: 'Autonomous research pipeline that searches multiple primary feeds, cross-verifies facts, filters noise, and compiles structured 1-page intelligence dossiers with verifiable citations.',
    iconName: 'Search',
    version: 'v4.2.0-stable',
    status: 'ACTIVE',
    rating: 4.95,
    slaTarget: 'Target SLA: 99.8%',
    avgLatency: '1.4s / citation',
    workflowSteps: [
      { step: '01', title: 'Query Decomposition', desc: 'Breaks complex research objective into 4 primary search vectors.' },
      { step: '02', title: 'Multi-Source Retrieval', desc: 'Aggregates news wires, filings, databases, and registries.' },
      { step: '03', title: 'Cross-Verification', desc: 'Scores claim credibility and flags conflicting sources.' },
      { step: '04', title: 'Executive Synthesis', desc: 'Outputs formatted brief with executive summary and source citations.' }
    ],
    demoConfig: {
      defaultInput: 'Synthesize commercial real estate capitalization rate trends in Texas metropolitan areas for Q3 2026.',
      sampleOutput: {
        researchTopic: 'Texas Metro Commercial CRE Cap Rates (Q3 2026)',
        sourcesAnalyzed: 14,
        credibilityRating: 'VERIFIED_MULTI_SOURCE',
        executiveSummary: 'Austin and Dallas-Fort Worth multifamily cap rates have stabilized between 5.4% and 5.8%, driven by sustained corporate relocations and cooling construction starts. Industrial logistics assets maintain premium valuations at 4.9% average yield.',
        keyTakeaways: [
          'Austin Multifamily: 5.45% avg cap rate (+15 bps YoY)',
          'DFW Industrial: 4.90% avg cap rate (Sub-4% vacancy in core logistics submarkets)',
          'Houston Commercial Office: Bifurcated market with Class A commanding 6.8% vs. Class B at 8.9%'
        ]
      }
    },
    supportedIntegrations: ['Notion', 'Google Docs', 'Slack', 'Email', 'PostgreSQL']
  },
  {
    id: 'oracle-ai',
    slug: 'oracle-ai',
    name: 'ORACLE AI Engine (Technical Demo)',
    badge: 'DEMO • INTERNAL BENCHMARK',
    category: 'FinTech & Intelligence',
    serviceClass: 'DEMO',
    headline: 'High-frequency streaming demonstration: orderbook depth and microstructure analysis.',
    description: 'Internal technology demonstration showcasing non-blocking asynchronous event processing, orderbook liquidity depth calculation, and low-latency timeseries pipelining.',
    iconName: 'Activity',
    version: 'v5.0.0-demo',
    status: 'DEMO',
    rating: 4.98,
    slaTarget: 'Demonstration Benchmark Only',
    avgLatency: 'Bench: Sub-20ms Engine',
    workflowSteps: [
      { step: '01', title: 'WebSocket Ingest', desc: 'Non-blocking async ring buffers streaming live orderbook telemetry.' },
      { step: '02', title: 'Microstructure Analytics', desc: 'NumPy/Pandas timeseries calculating RSI and orderbook depth imbalance.' },
      { step: '03', title: 'Vector Confidence Score', desc: 'Evaluates liquidity skew to output probabilistic directional score.' },
      { step: '04', title: 'Telemetry Output', desc: 'Streams live calculations to browser for architecture inspection.' }
    ],
    demoConfig: {
      defaultInput: 'BTC/USDT 5-Minute Candle Live Orderbook Stream',
      sampleOutput: {
        pair: 'BTC/USDT',
        timeframe: '5m',
        currentPrice: '$91,420.50',
        orderbookImbalance: '+0.28 (Strong Bid Liquidity Depth)',
        predictedDirection: 'LONG',
        confidenceScore: 78.6,
        takeProfit: '$92,800.00',
        stopLoss: '$90,650.00',
        bidDepth: '$14.2M (Dense support at 91,200)',
        askDepth: '$8.6M (Thin resistance to 92,500)'
      }
    },
    supportedIntegrations: ['Binance WebSocket', 'MEXC API', 'Python AsyncIO', 'PostgreSQL', 'Redis']
  }
];

export const INTEGRATIONS_CATALOG = [
  {
    id: 'hubspot',
    name: 'HubSpot CRM',
    category: 'CRM & Pipeline',
    status: 'AVAILABLE',
    description: 'Bi-directional contact syncing, deal stage updates, and conversation transcript logging.',
    authType: 'OAuth2 / API Key',
    iconUrl: 'https://cdn.worldvectorlogo.com/logos/hubspot.svg'
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    category: 'CRM & Pipeline',
    status: 'AVAILABLE',
    description: 'Enterprise lead routing, opportunity creation, and custom object synchronization.',
    authType: 'OAuth2 / Enterprise Connected App',
    iconUrl: 'https://cdn.worldvectorlogo.com/logos/salesforce-2.svg'
  },
  {
    id: 'slack',
    name: 'Slack',
    category: 'Team Messaging',
    status: 'CONNECTED',
    description: 'Real-time notifications for qualified leads, emergency approvals, and daily digests.',
    authType: 'Bot Token / Webhook',
    iconUrl: 'https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg'
  },
  {
    id: 'gmail',
    name: 'Google Workspace / Gmail',
    category: 'Email & Calendar',
    status: 'CONNECTED',
    description: 'Automated email triage, draft replies, and calendar availability lookup.',
    authType: 'OAuth2 Google Cloud',
    iconUrl: 'https://cdn.worldvectorlogo.com/logos/gmail-icon.svg'
  },
  {
    id: 'google-sheets',
    name: 'Google Sheets',
    category: 'Data & Reporting',
    status: 'AVAILABLE',
    description: 'Append qualified leads, survey responses, and operational metrics into live sheets.',
    authType: 'Google Service Account',
    iconUrl: 'https://cdn.worldvectorlogo.com/logos/google-sheets-2020-2.svg'
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business API',
    category: 'Messaging & Voice',
    status: 'AVAILABLE',
    description: '2-way automated conversational outreach and appointment confirmations.',
    authType: 'Meta Cloud API / Twilio',
    iconUrl: 'https://cdn.worldvectorlogo.com/logos/whatsapp-symbol.svg'
  },
  {
    id: 'stripe',
    name: 'Stripe Billing & Invoicing',
    category: 'Finance & Payments',
    status: 'AVAILABLE',
    description: 'Automated invoice generation, payment confirmation webhooks, and subscription sync.',
    authType: 'Stripe API Key / Webhook Secret',
    iconUrl: 'https://cdn.worldvectorlogo.com/logos/stripe-4.svg'
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks Online',
    category: 'Finance & Payments',
    status: 'AVAILABLE',
    description: 'Automated vendor invoice entry, expense category matching, and receipt archiving.',
    authType: 'Intuit OAuth2',
    iconUrl: 'https://cdn.worldvectorlogo.com/logos/quickbooks.svg'
  },
  {
    id: 'jobber',
    name: 'Jobber Field Service',
    category: 'Field & Operations',
    status: 'AVAILABLE',
    description: 'Autonomous work order creation from voice emergency calls and technician routing.',
    authType: 'Jobber API Key',
    iconUrl: 'https://cdn.worldvectorlogo.com/logos/jobber.svg'
  },
  {
    id: 'zapier',
    name: 'Zapier Webhooks',
    category: 'Universal Pipelines',
    status: 'AVAILABLE',
    description: 'Connect FORGE agent events to 5,000+ cloud applications.',
    authType: 'Inbound / Outbound Webhooks',
    iconUrl: 'https://cdn.worldvectorlogo.com/logos/zapier.svg'
  },
  {
    id: 'n8n',
    name: 'n8n Workflow Nodes',
    category: 'Universal Pipelines',
    status: 'AVAILABLE',
    description: 'Self-hosted and cloud workflow orchestration nodes for complex multi-system pipelines.',
    authType: 'Webhook / REST API',
    iconUrl: 'https://cdn.worldvectorlogo.com/logos/n8n.svg'
  }
];

export const LIVE_ACTIVITY_EVENTS = [
  {
    id: 'act-1',
    time: 'Just now',
    systemName: 'FORGE Lead Agent',
    action: 'Qualified inbound buyer lead ($1.4M pre-approved)',
    status: 'COMPLETED',
    score: '94 / 100',
    details: 'Locked Saturday 11:30 AM private tour on broker calendar.'
  },
  {
    id: 'act-2',
    time: '2m ago',
    systemName: 'FORGE Receptionist',
    action: 'Triage patient emergency toothache inquiry',
    status: 'COMPLETED',
    score: 'Insurance Verified',
    details: 'Delta Dental PPO confirmed; booked Saturday 10:00 AM slot.'
  },
  {
    id: 'act-3',
    time: '5m ago',
    systemName: 'FORGE Document Engine',
    action: 'Extracted line items from Subcontractor Invoice #INV-8841',
    status: 'COMPLETED',
    score: '100% Math Match',
    details: 'Validated $4,850.00 total; pushed draft bill to QuickBooks AP.'
  },
  {
    id: 'act-4',
    time: '8m ago',
    systemName: 'FORGE Support Agent',
    action: 'Answered refund warranty SLA query',
    status: 'COMPLETED',
    score: 'RAG Verified (99.4%)',
    details: 'Cited Master Service Agreement Sec 4.2 with zero human escalation.'
  },
  {
    id: 'act-5',
    time: '12m ago',
    systemName: 'FORGE Research Agent',
    action: 'Generated Q3 Texas Commercial CRE Cap Rate Brief',
    status: 'COMPLETED',
    score: '14 Sources Indexed',
    details: 'Compiled 1-page PDF dossier with verifiable citations.'
  },
  {
    id: 'act-6',
    time: '15m ago',
    systemName: 'FORGE Outreach Engine',
    action: 'Synthesized 3-touch personalized sequence for Vance Dental',
    status: 'COMPLETED',
    score: '88 ICP Fit',
    details: 'Referenced after-hours intake bottleneck and mobile friction.'
  }
];

export const INITIAL_KNOWLEDGE_DOCUMENTS = [
  {
    id: 'doc-1',
    title: 'Standard Operating Procedures & Service Pricing.pdf',
    size: '1.4 MB',
    pages: 18,
    chunksIndexed: 142,
    lastUpdated: '2026-09-12',
    status: 'INDEXED',
    category: 'Commercial Policies'
  },
  {
    id: 'doc-2',
    title: 'Healthcare Insurance & Billing FAQ.docx',
    size: '840 KB',
    pages: 12,
    chunksIndexed: 94,
    lastUpdated: '2026-09-10',
    status: 'INDEXED',
    category: 'Clinical FAQs'
  },
  {
    id: 'doc-3',
    title: 'Emergency Breakdown & Technician Dispatch Rules.txt',
    size: '220 KB',
    pages: 4,
    chunksIndexed: 38,
    lastUpdated: '2026-09-08',
    status: 'INDEXED',
    category: 'Field Operations'
  }
];

export const INITIAL_APPROVALS = [
  {
    id: 'appr-101',
    system: 'FORGE Lead Agent',
    actionType: 'Send Custom $8,500 Pilot Scope Proposal',
    target: 'David Miller (Managing Director, Miller Logistics)',
    timestamp: '10 minutes ago',
    riskLevel: 'MEDIUM',
    summary: 'Lead Agent has qualified inquiry and drafted preliminary 14-day pilot proposal. Awaiting 1-click human authorization before dispatch.',
    status: 'PENDING'
  },
  {
    id: 'appr-102',
    system: 'FORGE Document Engine',
    actionType: 'Commit $14,200 Vendor Invoice to QuickBooks',
    target: 'Carrier Freight Solutions LLC',
    timestamp: '28 minutes ago',
    riskLevel: 'HIGH',
    summary: 'Line items match BOL #9914, but invoice exceeds $10,000 threshold. Requires manager authorization.',
    status: 'PENDING'
  }
];
