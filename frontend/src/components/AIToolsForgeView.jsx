import React, { useState } from 'react';
import { 
  Sparkles, Bot, Palette, Lightbulb, FileText, 
  BarChart2, Layout, Mail, MessageSquare, Cpu, 
  Copy, Check, ArrowRight, RefreshCw, Download, 
  Zap, ShieldCheck, DollarSign, ChevronRight, Layers,
  Flame, TrendingUp, CheckCircle2, Lock, Search,
  Mic, Code2, ScanText, Users, Globe2, QrCode,
  Terminal, Play, Sliders
} from 'lucide-react';

const ALL_FORGE_TOOLS = [
  {
    id: 'logo-designer',
    name: 'Brand & Vector Logo Generator',
    category: 'Brand & Creative',
    icon: Palette,
    badge: 'SVG VECTOR ENGINE',
    description: 'Generates vector logo emblems, tailored hex color palettes, brand manifestos, and typography pairings.'
  },
  {
    id: 'idea-validator',
    name: 'Startup Idea & Market Validator',
    category: 'Startup & Strategy',
    icon: Lightbulb,
    badge: 'MARKET VIABILITY',
    description: 'Instant market viability score, ICP persona breakdown, monetization streams, and competitive moat analysis.'
  },
  {
    id: 'whitepaper-gen',
    name: 'Executive Whitepaper Synthesizer',
    category: 'Architecture & Tech',
    icon: FileText,
    badge: 'SYSTEM BLUEPRINTS',
    description: 'Synthesizes enterprise whitepapers, system architecture topologies, tokenomics / unit economics, and data flow specs.'
  },
  {
    id: 'business-plan',
    name: '12-Month Business Plan Builder',
    category: 'Startup & Strategy',
    icon: BarChart2,
    badge: 'INVESTOR GRADE',
    description: 'Detailed 4-quarter roadmap, revenue projections, target TAM/SAM sizing, and customer acquisition cost models.'
  },
  {
    id: 'salary-calc',
    name: 'Business Audit & Salary Matrix',
    category: 'Finance & Operations',
    icon: DollarSign,
    badge: 'PAYROLL INTEL',
    description: 'Calculate monthly payroll burn, employer tax liabilities, net payouts, and automation cost-reduction thresholds.'
  },
  {
    id: 'web-wireframe',
    name: 'Rapid Web Wireframer & Copy Architect',
    category: 'Web & Development',
    icon: Layout,
    badge: 'HIGH CONVERSION',
    description: 'Instant high-converting page wireframe layouts, persuasive hero copy, proof blocks, and conversion CTA triggers.'
  },
  {
    id: 'outreach-gen',
    name: 'Cold Outreach Sequence Generator',
    category: 'Lead Gen & Sales',
    icon: Mail,
    badge: 'HIGH RESPONSE RATE',
    description: 'Engineers 3-step high-converting cold email sequences tailored to specific industry pain points and decision-makers.'
  },
  {
    id: 'crm-triage',
    name: 'Smart CRM Ticket & Urgency Triage',
    category: 'Customer Support',
    icon: MessageSquare,
    badge: 'REAL-TIME TRIAGE',
    description: 'Classifies inbound customer support tickets by urgency level, sentiment score, and produces instant empathetic AI replies.'
  },
  {
    id: 'voice-clone',
    name: 'VoiceClone AI Speech Synthesizer',
    category: 'AI Voice & Speech',
    icon: Mic,
    badge: 'NEURAL WAVEFORM',
    description: 'Simulates neural voice synthesis with adjustable tone inflection, background noise cancellation, and waveform playback.'
  },
  {
    id: 'code-audit',
    name: 'DeepAudit Security & Code Reviewer',
    category: 'Web & Development',
    icon: Code2,
    badge: 'VULNERABILITY SCAN',
    description: 'Scans source code snippets for SQL injection vulnerabilities, leaked secrets, re-entrancy bugs, and latency bottlenecks.'
  },
  {
    id: 'vision-ocr',
    name: 'VisionOCR Invoice & Receipt Parser',
    category: 'Finance & Operations',
    icon: ScanText,
    badge: 'JSON EXTRACTION',
    description: 'Extracts line items, vendor tax IDs, subtotal figures, and payment terms from invoice text into structured JSON.'
  },
  {
    id: 'saas-churn',
    name: 'SaaS Churn & LTV Risk Predictor',
    category: 'Startup & Strategy',
    icon: Users,
    badge: 'PREDICTIVE ML',
    description: 'Computes account churn probability based on active user engagement scores, NPS indicators, and MRR thresholds.'
  },
  {
    id: 'seo-meta',
    name: 'SEO Meta Tag & OpenGraph Studio',
    category: 'Web & Development',
    icon: Globe2,
    badge: 'SERP & SOCIAL',
    description: 'Generates SEO titles, meta descriptions, OpenGraph social cards, and JSON-LD structured schema markup.'
  },
  {
    id: 'qr-gen',
    name: 'QR Code & Dynamic Brand Architect',
    category: 'Brand & Creative',
    icon: QrCode,
    badge: 'VECTOR QR CODE',
    description: 'Generates high-resolution branded QR codes with embedded vector styling for product packaging and marketing.'
  },
  {
    id: 'multi-model-compare',
    name: 'Multi-Model Benchmark (Grok / GPT-4o / Gemini / Claude)',
    category: 'AI Models',
    icon: Cpu,
    badge: '4x LLM INGEST',
    description: 'Run your prompt concurrently across GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro, and Grok-2 side-by-side.'
  }
];

const CATEGORIES = [
  'All Utilities',
  'Brand & Creative',
  'Startup & Strategy',
  'Finance & Operations',
  'Web & Development',
  'Lead Gen & Sales',
  'Customer Support',
  'AI Voice & Speech',
  'AI Models'
];

export function AIToolsForgeView({ onOpenPaymentModal }) {
  const [selectedCategory, setSelectedCategory] = useState('All Utilities');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeToolId, setActiveToolId] = useState('logo-designer');
  const [copiedKey, setCopiedKey] = useState('');

  // 1. Logo Designer State
  const [logoName, setLogoName] = useState('Vanguard Logic');
  const [logoVibe, setLogoVibe] = useState('Modern Fintech & High-Tech AI');
  const [logoResult, setLogoResult] = useState(null);
  const [logoLoading, setLogoLoading] = useState(false);

  // 2. Idea Validator State
  const [ideaInput, setIdeaInput] = useState('Autonomous AI receptionist booking after-hours commercial HVAC service appointments into FieldEdge');
  const [ideaResult, setIdeaResult] = useState(null);
  const [ideaLoading, setIdeaLoading] = useState(false);

  // 3. Whitepaper State
  const [wpTopic, setWpTopic] = useState('Decentralized High-Frequency Liquidity Ingest Engine & Microstructure Arbitrage');
  const [wpResult, setWpResult] = useState(null);
  const [wpLoading, setWpLoading] = useState(false);

  // 4. Business Plan State
  const [bpCompany, setBpCompany] = useState('Nexus AI Logistics');
  const [bpOffering, setBpOffering] = useState('Autonomous dispatch and driver route optimization for freight fleets');
  const [bpResult, setBpResult] = useState(null);
  const [bpLoading, setBpLoading] = useState(false);

  // 5. Salary & Audit State
  const [salaryHeadcount, setSalaryHeadcount] = useState(8);
  const [salaryAvgMonthly, setSalaryAvgMonthly] = useState(4200);
  const [salaryTaxPct, setSalaryTaxPct] = useState(18);
  const [salaryOpex, setSalaryOpex] = useState(7500);

  // 6. Web Wireframe State
  const [webIndustry, setWebIndustry] = useState('Bespoke Dental Practice & Cosmetic Orthodontics');
  const [webResult, setWebResult] = useState(null);
  const [webLoading, setWebLoading] = useState(false);

  // 7. Outreach Sequence State
  const [outreachTarget, setOutreachTarget] = useState('Managing Partner at Mid-Sized Law Firm');
  const [outreachPain, setOutreachPain] = useState('Losing client intake leads over the weekend due to delayed callback times');
  const [outreachResult, setOutreachResult] = useState(null);
  const [outreachLoading, setOutreachLoading] = useState(false);

  // 8. CRM Triage State
  const [crmMessage, setCrmMessage] = useState('Our database sync stopped at 2 AM and our morning dispatchers cannot see active driver locations. Need urgent fix!');
  const [crmResult, setCrmResult] = useState(null);
  const [crmLoading, setCrmLoading] = useState(false);

  // 9. VoiceClone State
  const [voiceText, setVoiceText] = useState('Welcome to Vance Dental Care. Dr. Rivera is available this Saturday at 2 PM. Would you like me to reserve this appointment?');
  const [voiceAccent, setVoiceAccent] = useState('Executive American (Neutral-Calm)');
  const [voicePlaying, setVoicePlaying] = useState(false);
  const [voiceResult, setVoiceResult] = useState(null);

  // 10. Code Audit State
  const [codeSnippet, setCodeSnippet] = useState(`@app.get("/api/user")\ndef get_user(user_id: str):\n    # Direct SQL query string concat\n    query = f"SELECT * FROM users WHERE id = '{user_id}'"\n    return db.execute(query).fetchall()`);
  const [codeResult, setCodeResult] = useState(null);
  const [codeLoading, setCodeLoading] = useState(false);

  // 11. VisionOCR State
  const [ocrText, setOcrText] = useState(`INVOICE #INV-88491\nVendor: Apex Cloud Infrastructure LLC\nTax ID: US-9948102\nDate: 2026-09-12\n\nItems:\n- 4x Dedicated GPU H100 Instances (Hourly): $3,840.00\n- Global Edge Bandwidth (10TB): $450.00\n- Enterprise SLA Tier: $500.00\n\nSubtotal: $4,790.00\nTax (8.25%): $395.17\nTOTAL DUE: $5,185.17`);
  const [ocrResult, setOcrResult] = useState(null);
  const [ocrLoading, setOcrLoading] = useState(false);

  // 12. SaaS Churn State
  const [churnNps, setChurnNps] = useState(6);
  const [churnLogins, setChurnLogins] = useState(3);
  const [churnMrr, setChurnMrr] = useState(850);
  const [churnResult, setChurnResult] = useState(null);

  // 13. SEO Meta State
  const [seoTitle, setSeoTitle] = useState('Rine Forge Systems • Autonomous AI Infrastructure & Lead Engineering');
  const [seoResult, setSeoResult] = useState(null);
  const [seoLoading, setSeoLoading] = useState(false);

  // 14. QR Code State
  const [qrUrl, setQrUrl] = useState('https://rine-forge-systems-19pm-eight.vercel.app/');
  const [qrColor, setQrColor] = useState('#14B8A6');

  // 15. Multi-Model State
  const [multiPrompt, setMultiPrompt] = useState('Explain how high-frequency trading arbitrage differs from statistical mean-reversion in under 60 words.');
  const [multiResult, setMultiResult] = useState(null);
  const [multiLoading, setMultiLoading] = useState(false);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  // --- FILTERED TOOLS ---
  const filteredTools = ALL_FORGE_TOOLS.filter(t => {
    const matchesCat = selectedCategory === 'All Utilities' || t.category === selectedCategory;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // --- GENERATION HANDLERS ---
  const handleGenerateLogo = (e) => {
    e.preventDefault();
    setLogoLoading(true);
    setTimeout(() => {
      setLogoResult({
        brandName: logoName,
        tagline: 'Autonomous Precision Engineered for the Intelligent Future',
        palette: [
          { name: 'Cyber Teal', hex: '#14B8A6' },
          { name: 'Quantum Slate', hex: '#0F172A' },
          { name: 'Deep Cyan', hex: '#06B6D4' },
          { name: 'Neural White', hex: '#F8FAFC' }
        ],
        manifesto: `${logoName} stands at the frontier of autonomous intelligence. By bridging raw computation with seamless human-centric workflows, we empower enterprises to operate at warp velocity.`,
        fontPairing: 'Primary: Syne Heavy (Geometric Display) | Secondary: Inter / JetBrains Mono (Technical Precision)',
        iconType: 'Isometric Neural Prism with Interlocking Vector Geometry'
      });
      setLogoLoading(false);
    }, 700);
  };

  const handleGenerateIdea = (e) => {
    e.preventDefault();
    setIdeaLoading(true);
    setTimeout(() => {
      setIdeaResult({
        concept: ideaInput,
        viabilityScore: 94,
        marketDemand: 'VERY HIGH (Strong pain point with immediate ROI for business owners)',
        targetPersona: 'Owners and Operations Directors of Mid-Market Field & Service Businesses ($1M-$10M ARR)',
        revenueModel: 'SaaS Subscription ($299-$799/mo) + Usage Fee ($0.25/voice minute)',
        moat: 'Proprietary domain-specific emergency audio triage models + pre-built CRM sync connectors',
        gotomarket: 'Cold automated email outreach to local service companies with a free 48-hour prototype demo link'
      });
      setIdeaLoading(false);
    }, 750);
  };

  const handleGenerateWhitepaper = (e) => {
    e.preventDefault();
    setWpLoading(true);
    setTimeout(() => {
      setWpResult({
        title: wpTopic,
        abstract: 'This whitepaper presents a high-throughput, low-latency computational framework engineered to execute deterministic data pipelines and real-time state synchronization with zero single points of failure.',
        architecture: [
          'Ingestion Tier: WebSocket async stream workers with 10Gbps non-blocking I/O ring buffers.',
          'Consensus & Validation: Multi-model probabilistic verification with sub-15ms heuristic gating.',
          'Execution Engine: Containerized microservices deployed on edge nodes with automatic failover.',
          'Security & Audit: Continuous zero-trust cryptographic hashing and SOC-2 compliant immutable event logging.'
        ],
        unitEconomics: 'Operational cost amortized to $0.00042 per transaction with 99.999% SLA availability.',
        readinessStatus: 'ENTERPRISE PRODUCTION READY'
      });
      setWpLoading(false);
    }, 800);
  };

  const handleGenerateBusinessPlan = (e) => {
    e.preventDefault();
    setBpLoading(true);
    setTimeout(() => {
      setBpResult({
        company: bpCompany,
        tam: '$18.4 Billion Global Addressable Market',
        executiveSummary: `${bpCompany} delivers an autonomous operations engine specifically architected to solve ${bpOffering}.`,
        milestones: [
          { quarter: 'Q1 (Alpha & Foundation)', goal: 'Deploy core MVP, onboard 10 beta pilot clients with free 48h working prototypes.' },
          { quarter: 'Q2 (Commercial Acceleration)', goal: 'Reach $25,000 MRR, implement 50% milestone billing funnel, launch multi-channel cold outreach.' },
          { quarter: 'Q3 (Scale & Integration)', goal: 'Expand API connectors for Zapier, Jobber, FieldEdge, reach $80,000 MRR.' },
          { quarter: 'Q4 (Institutional Expansion)', goal: 'Achieve $150,000+ MRR, complete SOC-2 Type II audit, expand into international markets.' }
        ],
        cacLtv: 'Target CAC: $450 | Projected LTV: $7,200 (16x LTV:CAC Ratio)'
      });
      setBpLoading(false);
    }, 800);
  };

  const handleGenerateWebWireframe = (e) => {
    e.preventDefault();
    setWebLoading(true);
    setTimeout(() => {
      setWebResult({
        industry: webIndustry,
        sections: [
          {
            section: '1. Hero Section (Above the Fold)',
            headline: 'World-Class Cosmetic Care Meets 24/7 Autonomous Booking',
            subheadline: 'Never lose a patient to after-hours voicemail. Our AI concierge answers questions, checks insurance, and locks appointments 24/7.',
            cta: 'Schedule Your Complimentary Consultation →'
          },
          {
            section: '2. Social Proof & Trust Ticker',
            headline: 'Over 2,500+ Happy Smiles Transformed',
            subheadline: '5.0-Star Google Rating • Board-Certified Specialists • Flexible Financing'
          },
          {
            section: '3. Interactive Procedure Selector & FAQ',
            headline: 'Clear, Transparent Pricing with Zero Surprises',
            subheadline: 'Explore Invisalign, Veneers, and Emergency Care with instant financing breakdowns.'
          },
          {
            section: '4. Conversion Anchor CTA',
            headline: 'Ready for the Smile You Deserve?',
            subheadline: 'Lock in your priority slot in under 60 seconds with our instant digital assistant.',
            cta: 'Book My Appointment Now'
          }
        ]
      });
      setWebLoading(false);
    }, 700);
  };

  const handleGenerateOutreach = (e) => {
    e.preventDefault();
    setOutreachLoading(true);
    setTimeout(() => {
      setOutreachResult({
        target: outreachTarget,
        step1: {
          subject: 'Quick question regarding after-hours client intake at {{Company}}',
          body: 'Hi {{First_Name}},\n\nI noticed that prospective clients reaching out to {{Company}} after 6 PM or over the weekend typically hit a general voicemail box.\n\nWe built a lightweight 24/7 AI intake concierge specifically for law firms that qualifies incoming inquiries and books priority consultations in under 60 seconds.\n\nI actually put together a free 48-hour working prototype for {{Company}} here: [https://rine-forge-systems-19pm-eight.vercel.app/#showcase]\n\nWorth a 3-minute look?\n\nBest,\nAlex Rine\nPrincipal Systems Architect, Rine Forge Systems'
        },
        step2: {
          subject: 're: after-hours intake prototype for {{Company}}',
          body: 'Hi {{First_Name}},\n\nFollowing up on my previous note. Most firms we partner with recover 4 to 9 additional retained clients per month simply by eliminating delayed callbacks.\n\nWould you be open to test-driving the working demo this week at zero financial commitment?\n\nBest,\nAlex'
        },
        step3: {
          subject: 'Closing file on {{Company}} intake automation',
          body: 'Hi {{First_Name}},\n\nAssuming this is not a priority right now, which is completely fine. I will archive the custom prototype I prepared for {{Company}}.\n\nIf you ever decide to capture missed weekend leads automatically, feel free to reach out anytime at alexrine691@gmail.com.\n\nBest regards,\nAlex Rine'
        }
      });
      setOutreachLoading(false);
    }, 750);
  };

  const handleGenerateCrm = (e) => {
    e.preventDefault();
    setCrmLoading(true);
    setTimeout(() => {
      setCrmResult({
        urgency: 'CRITICAL (Priority 1)',
        sentiment: 'Frustrated / Urgent (Confidence: 98%)',
        detectedIssue: 'Database synchronization failure affecting real-time driver dispatch telemetry.',
        recommendedAction: 'Immediate Escalation to Tier-3 Infrastructure Engineering + Send Automated Empathy Acknowledgement',
        aiDraftReply: 'Hello. We have received your high-priority ticket and our on-call infrastructure engineers are currently investigating the 2 AM database sync interruption. We will provide an updated status within 15 minutes. Thank you for your patience.'
      });
      setCrmLoading(false);
    }, 650);
  };

  const handleSynthesizeVoice = (e) => {
    e.preventDefault();
    setVoicePlaying(true);
    setVoiceResult({
      audioDuration: '4.8s',
      modelUsed: 'Neural-Voice-v4-HighFidelity',
      sampleRate: '48,000 Hz / 24-bit Lossless',
      latency: '38ms'
    });
    setTimeout(() => setVoicePlaying(false), 3000);
  };

  const handleAuditCode = (e) => {
    e.preventDefault();
    setCodeLoading(true);
    setTimeout(() => {
      setCodeResult({
        severity: 'CRITICAL SECURITY VULNERABILITY',
        cwe: 'CWE-89: Direct SQL Injection (Unsanitized User Input)',
        lineMatch: "query = f\"SELECT * FROM users WHERE id = '{user_id}'\"",
        remediation: 'Use parameterized queries with SQLAlchemy or asyncpg: `db.execute(select(User).where(User.id == user_id))`',
        fixedCode: `@app.get("/api/user")\nasync def get_user(user_id: str, session: AsyncSession = Depends(get_db)):\n    stmt = select(User).where(User.id == user_id)\n    res = await session.execute(stmt)\n    return res.scalars().first()`
      });
      setCodeLoading(false);
    }, 700);
  };

  const handleParseOcr = (e) => {
    e.preventDefault();
    setOcrLoading(true);
    setTimeout(() => {
      setOcrResult({
        invoice_number: 'INV-88491',
        vendor: 'Apex Cloud Infrastructure LLC',
        tax_id: 'US-9948102',
        date: '2026-09-12',
        currency: 'USD',
        line_items: [
          { item: 'Dedicated GPU H100 Instances (Hourly)', quantity: 4, amount: 3840.00 },
          { item: 'Global Edge Bandwidth (10TB)', quantity: 1, amount: 450.00 },
          { item: 'Enterprise SLA Tier', quantity: 1, amount: 500.00 }
        ],
        subtotal: 4790.00,
        tax_amount: 395.17,
        total_due: 5185.17,
        verification_hash: '0x948fa3910cbe4491'
      });
      setOcrLoading(false);
    }, 700);
  };

  const handlePredictChurn = (e) => {
    e.preventDefault();
    const riskScore = Math.max(10, Math.min(95, Math.round((10 - churnNps) * 8 + (5 - churnLogins) * 6)));
    setChurnResult({
      churnProbabilityPct: riskScore,
      riskLevel: riskScore > 65 ? 'HIGH CHURN RISK' : (riskScore > 40 ? 'MODERATE RISK' : 'HEALTHY ACCOUNT'),
      atRiskMrr: `$${churnMrr}/mo ($${churnMrr * 12}/yr)`,
      recommendedRetentionPlay: riskScore > 65 
        ? 'Trigger automated concierge check-in from founder + offer complimentary API rate boost'
        : 'Deliver weekly milestone usage summary report to demonstrate active ROI'
    });
  };

  const handleGenerateSeo = (e) => {
    e.preventDefault();
    setSeoLoading(true);
    setTimeout(() => {
      setSeoResult({
        title: seoTitle,
        metaDescription: 'Rine Forge Systems engineers production-grade autonomous AI receptionists, quantitative prediction engines, bespoke web platforms, and automated speed-to-lead pipelines.',
        keywords: 'autonomous AI, speed to lead, quant trading bot, AI receptionist, bespoke web development, algorithmic automation',
        ogTitle: 'Rine Forge Systems | High-Performance Autonomous AI Engines',
        ogImage: 'https://rine-forge-systems-19pm-eight.vercel.app/og-banner.png',
        schemaJsonLd: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "Rine Forge Systems",\n  "founder": "Alex Rine",\n  "email": "alexrine691@gmail.com"\n}\n</script>`
      });
      setSeoLoading(false);
    }, 600);
  };

  const handleGenerateMultiModel = (e) => {
    e.preventDefault();
    setMultiLoading(true);
    setTimeout(() => {
      setMultiResult({
        prompt: multiPrompt,
        models: [
          {
            name: 'Grok-2 (xAI)',
            badge: 'Real-Time Edge',
            latency: '180ms',
            text: 'Arbitrage exploits instantaneous spatial price discrepancies across distinct venues with zero market directional risk. Mean reversion, by contrast, bets on a temporal statistical anomaly reverting to its historical average over a given lookback window, requiring open directional exposure.'
          },
          {
            name: 'Gemini 1.5 Pro (Google)',
            badge: 'Deep Multimodal',
            latency: '210ms',
            text: 'Arbitrage is risk-neutral: capturing microsecond price differences for the same asset across exchanges simultaneously. Mean reversion is statistical and directional: assuming extended price extremes will revert to their historical moving averages.'
          },
          {
            name: 'GPT-4o (OpenAI)',
            badge: 'Structured Logic',
            latency: '240ms',
            text: 'High-frequency arbitrage is purely deterministic and market-neutral, profiting from spatial execution speed advantages. Mean reversion is a probabilistic, risk-bearing directional strategy betting that asset prices will oscillate back to their equilibrium.'
          },
          {
            name: 'Claude 3.5 Sonnet (Anthropic)',
            badge: 'Nuanced Reasoning',
            latency: '230ms',
            text: 'Arbitrage locks in immediate risk-free profits by simultaneously buying low and selling high on mismatched orderbooks. Mean reversion assumes prices deviate temporarily from a mean value and will return, which inherently carries market risk.'
          }
        ]
      });
      setMultiLoading(false);
    }, 900);
  };

  // Compute Salary Audit Breakdown
  const totalBasePayroll = salaryHeadcount * salaryAvgMonthly;
  const totalTaxContribution = totalBasePayroll * (salaryTaxPct / 100);
  const totalMonthlyBurn = totalBasePayroll + totalTaxContribution + salaryOpex;
  const annualBurn = totalMonthlyBurn * 12;
  const potentialSavings = Math.round(totalMonthlyBurn * 0.28);

  return (
    <div className="space-y-10 py-6 max-w-6xl mx-auto font-sans text-slate-100">
      
      {/* Top Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5" /> 15+ ALL-IN-ONE OPERATIONAL AI POWER TOOLS
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Bespoke <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-300 to-indigo-400">AI Utility & Engineering Forge</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
          Explore our full suite of free operational AI utilities. From brand identity synthesis and security code auditing to neural speech cloning and multi-LLM benchmarking.
        </p>
      </div>

      {/* Category Pills & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {CATEGORIES.map((cat, i) => (
              <button
                key={i}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-teal-500 text-dark-950 font-bold shadow-sm'
                    : 'bg-dark-900 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search 15+ AI tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-dark-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        {/* Tool Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeToolId === tool.id;
            return (
              <div
                key={tool.id}
                onClick={() => setActiveToolId(tool.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between group ${
                  isActive
                    ? 'bg-gradient-to-br from-teal-500/20 via-dark-900 to-indigo-500/10 border-teal-500 shadow-lg shadow-teal-500/15'
                    : 'bg-dark-900/80 border-slate-800 hover:border-slate-700 hover:bg-dark-850'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                      isActive ? 'bg-teal-500 text-dark-950 font-bold' : 'bg-dark-950 text-slate-400 group-hover:text-teal-400'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[8px] font-mono px-1.5 py-0.5 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded font-bold truncate max-w-[80px]">
                      {tool.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-xs text-white group-hover:text-teal-300 transition-colors line-clamp-1">
                    {tool.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[9px] font-mono">
                  <span className="text-slate-500 truncate max-w-[70px]">{tool.category}</span>
                  <span className={`font-bold flex items-center gap-0.5 ${isActive ? 'text-teal-400' : 'text-slate-400'}`}>
                    {isActive ? 'Active' : 'Open'} <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ACTIVE PLAYGROUND CANVAS */}
      <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        
        {/* 1. LOGO & BRAND DESIGNER */}
        {activeToolId === 'logo-designer' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">Brand Identity & Vector Logo Designer</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-md">SVG & COLOR ENGINE</span>
              </div>
              <p className="text-xs text-slate-400">Generates vector logo emblems, hex color palettes, brand manifestos, and font pairings.</p>
            </div>

            <form onSubmit={handleGenerateLogo} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-5">
                <label className="block text-xs text-slate-300 font-medium mb-1">Company / Business Name</label>
                <input
                  type="text"
                  value={logoName}
                  onChange={(e) => setLogoName(e.target.value)}
                  className="w-full p-3 bg-dark-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div className="sm:col-span-5">
                <label className="block text-xs text-slate-300 font-medium mb-1">Brand Aesthetic / Industry Vibe</label>
                <input
                  type="text"
                  value={logoVibe}
                  onChange={(e) => setLogoVibe(e.target.value)}
                  className="w-full p-3 bg-dark-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div className="sm:col-span-2 flex items-end">
                <button
                  type="submit"
                  disabled={logoLoading}
                  className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-dark-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md"
                >
                  {logoLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Palette className="w-4 h-4" />}
                  {logoLoading ? 'Forging...' : 'Generate Brand'}
                </button>
              </div>
            </form>

            {logoResult && (
              <div className="space-y-6 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-dark-950 border border-slate-800 rounded-2xl flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-teal-500/25 relative group">
                      <span className="text-3xl font-black text-dark-950 font-mono">
                        {logoResult.brandName.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-base font-black text-white">{logoResult.brandName}</div>
                      <div className="text-[10px] text-teal-400 font-mono">{logoResult.tagline}</div>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">Emblem: {logoResult.iconType}</div>
                  </div>

                  <div className="p-6 bg-dark-950 border border-slate-800 rounded-2xl space-y-3">
                    <div className="text-xs font-mono uppercase text-slate-400 font-bold">Curated Hex Palette</div>
                    <div className="space-y-2">
                      {logoResult.palette.map((c, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-dark-900 border border-slate-800">
                          <div className="flex items-center gap-2.5">
                            <div className="w-5 h-5 rounded-md border border-slate-700" style={{ backgroundColor: c.hex }} />
                            <span className="text-xs font-medium text-slate-200">{c.name}</span>
                          </div>
                          <button
                            onClick={() => handleCopy(c.hex, `color-${i}`)}
                            className="text-[10px] font-mono text-teal-400 hover:text-teal-300 flex items-center gap-1"
                          >
                            {copiedKey === `color-${i}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            {c.hex}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 bg-dark-950 border border-slate-800 rounded-2xl space-y-3">
                    <div className="text-xs font-mono uppercase text-slate-400 font-bold">Brand Manifesto & Typography</div>
                    <p className="text-xs text-slate-300 leading-relaxed italic">
                      "{logoResult.manifesto}"
                    </p>
                    <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono">
                      {logoResult.fontPairing}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-teal-500/10 via-dark-950 to-indigo-500/10 border border-teal-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-xs text-white">Need a full custom website, branding kit & animated vector library?</div>
                    <div className="text-[11px] text-slate-400">Deploy a production platform with 100% code ownership on a 50% milestone deposit.</div>
                  </div>
                  <button
                    onClick={() => onOpenPaymentModal && onOpenPaymentModal('full-web-ai-suite')}
                    className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl text-xs shrink-0 flex items-center gap-1.5 transition-all shadow-md"
                  >
                    Deploy Custom Suite ($399 Deposit) →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. STARTUP IDEA & MARKET VALIDATOR */}
        {activeToolId === 'idea-validator' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">Startup Idea & Market Viability Validator</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md">MARKET INTEL</span>
              </div>
              <p className="text-xs text-slate-400">Evaluates business ideas against market demand, ICP personas, monetization models, and defensible moats.</p>
            </div>

            <form onSubmit={handleGenerateIdea} className="space-y-3">
              <label className="block text-xs text-slate-300 font-medium">Describe the Business Idea or System</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={ideaInput}
                  onChange={(e) => setIdeaInput(e.target.value)}
                  className="flex-1 p-3 bg-dark-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500"
                  required
                />
                <button
                  type="submit"
                  disabled={ideaLoading}
                  className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-dark-950 font-bold rounded-xl text-xs flex items-center gap-2 shrink-0 shadow-md"
                >
                  {ideaLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lightbulb className="w-4 h-4" />}
                  {ideaLoading ? 'Validating...' : 'Validate Idea'}
                </button>
              </div>
            </form>

            {ideaResult && (
              <div className="space-y-5 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-dark-950 border border-slate-800 rounded-2xl space-y-1 text-center">
                    <div className="text-[10px] uppercase font-mono text-slate-400">Viability Score</div>
                    <div className="text-3xl font-black text-emerald-400 font-mono">{ideaResult.viabilityScore}/100</div>
                    <div className="text-[10px] text-emerald-300 font-mono font-bold">HIGH POTENTIAL</div>
                  </div>

                  <div className="p-4 bg-dark-950 border border-slate-800 rounded-2xl space-y-1">
                    <div className="text-[10px] uppercase font-mono text-slate-400">Market Demand</div>
                    <div className="text-xs text-slate-200 font-bold">{ideaResult.marketDemand}</div>
                  </div>

                  <div className="p-4 bg-dark-950 border border-slate-800 rounded-2xl space-y-1">
                    <div className="text-[10px] uppercase font-mono text-slate-400">Monetization Engine</div>
                    <div className="text-xs text-teal-400 font-bold">{ideaResult.revenueModel}</div>
                  </div>

                  <div className="p-4 bg-dark-950 border border-slate-800 rounded-2xl space-y-1">
                    <div className="text-[10px] uppercase font-mono text-slate-400">Defensible Moat</div>
                    <div className="text-[11px] text-slate-300">{ideaResult.moat}</div>
                  </div>
                </div>

                <div className="p-5 bg-dark-950 border border-slate-800 rounded-2xl space-y-2">
                  <div className="text-xs font-mono uppercase text-slate-400 font-bold">Ideal Customer Profile (ICP) & Go-To-Market</div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    <strong>Target Buyer:</strong> {ideaResult.targetPersona}
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong>Execution Playbook:</strong> {ideaResult.gotomarket}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 9. VOICECLONE AI SPEECH SYNTHESIZER */}
        {activeToolId === 'voice-clone' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">VoiceClone AI • Neural Speech Synthesizer & Waveform Studio</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-md">ZERO LATENCY</span>
              </div>
              <p className="text-xs text-slate-400">Simulates sub-40ms neural conversational speech generation for autonomous receptionists & voice agents.</p>
            </div>

            <form onSubmit={handleSynthesizeVoice} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-8">
                  <label className="block text-xs text-slate-300 font-medium mb-1">Text Script to Synthesize</label>
                  <input
                    type="text"
                    value={voiceText}
                    onChange={(e) => setVoiceText(e.target.value)}
                    className="w-full p-3 bg-dark-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-xs text-slate-300 font-medium mb-1">Voice Accent & Tone</label>
                  <select
                    value={voiceAccent}
                    onChange={(e) => setVoiceAccent(e.target.value)}
                    className="w-full p-3 bg-dark-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500"
                  >
                    <option value="Executive American (Neutral-Calm)">Executive American (Neutral-Calm)</option>
                    <option value="British Clinical (Polite & Reassuring)">British Clinical (Polite & Reassuring)</option>
                    <option value="Australian Commercial (Upbeat)">Australian Commercial (Upbeat)</option>
                    <option value="Direct Quant Dispatch (Fast-Paced)">Direct Quant Dispatch (Fast-Paced)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={voicePlaying}
                className="w-full py-3.5 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-dark-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-teal-500/20"
              >
                {voicePlaying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                {voicePlaying ? 'Streaming Neural Audio Waveform...' : 'Synthesize Neural Voice Stream →'}
              </button>
            </form>

            {voiceResult && (
              <div className="p-6 bg-dark-950 border border-slate-800 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="text-xs font-mono text-teal-400 font-bold">LIVE AUDIO WAVEFORM TELEMETRY</div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">LATENCY: {voiceResult.latency}</span>
                </div>

                {/* Animated Waveform Visualizer */}
                <div className="h-16 flex items-center justify-between gap-1 px-4 bg-dark-900 rounded-xl border border-slate-800 overflow-hidden">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all duration-300 ${
                        voicePlaying ? 'bg-gradient-to-t from-teal-500 to-cyan-300 animate-pulse' : 'bg-slate-700'
                      }`}
                      style={{
                        height: voicePlaying ? `${Math.floor(20 + Math.sin(i * 0.4) * 35 + Math.random() * 25)}%` : '15%'
                      }}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-slate-400 pt-1">
                  <div>Model: <strong className="text-slate-200">{voiceResult.modelUsed}</strong></div>
                  <div>Sample Rate: <strong className="text-slate-200">{voiceResult.sampleRate}</strong></div>
                  <div>Duration: <strong className="text-teal-400">{voiceResult.audioDuration}</strong></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 10. DEEPAUDIT CODE REVIEWER */}
        {activeToolId === 'code-audit' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">DeepAudit • Static Code Security & Vulnerability Analyzer</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-md">ZERO-TRUST AUDIT</span>
              </div>
              <p className="text-xs text-slate-400">Scans Python, JavaScript, and Solidity code for SQL injection, leaked credentials, and concurrency deadlocks.</p>
            </div>

            <form onSubmit={handleAuditCode} className="space-y-3">
              <label className="block text-xs text-slate-300 font-medium">Input Code Snippet</label>
              <textarea
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                rows={4}
                className="w-full p-3 bg-dark-950 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-teal-500"
                required
              />
              <button
                type="submit"
                disabled={codeLoading}
                className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-dark-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md"
              >
                {codeLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Code2 className="w-4 h-4" />}
                {codeLoading ? 'Auditing Abstract Syntax Tree...' : 'Run Security Vulnerability Audit'}
              </button>
            </form>

            {codeResult && (
              <div className="p-6 bg-dark-950 border border-slate-800 rounded-2xl space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-rose-400 font-bold flex items-center gap-1.5">
                    <Lock className="w-4 h-4" /> {codeResult.severity}
                  </span>
                  <span className="text-slate-400">{codeResult.cwe}</span>
                </div>

                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-1">
                  <div className="text-[10px] text-rose-300 uppercase font-bold">Vulnerable Line Detected:</div>
                  <code className="text-rose-200">{codeResult.lineMatch}</code>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] text-teal-400 uppercase font-bold">Recommended Secure Refactoring:</div>
                  <pre className="p-3 bg-dark-900 border border-slate-800 rounded-xl text-emerald-300 overflow-x-auto leading-relaxed">
                    {codeResult.fixedCode}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 11. VISIONOCR INVOICE EXTRACTOR */}
        {activeToolId === 'vision-ocr' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">VisionOCR • Document & Invoice JSON Extractor</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-md">STRUCTURED OCR</span>
              </div>
              <p className="text-xs text-slate-400">Extracts line items, vendor tax IDs, subtotal figures, and payment terms from invoice text into structured JSON.</p>
            </div>

            <form onSubmit={handleParseOcr} className="space-y-3">
              <label className="block text-xs text-slate-300 font-medium">Raw Invoice Text / Receipt Data</label>
              <textarea
                value={ocrText}
                onChange={(e) => setOcrText(e.target.value)}
                rows={5}
                className="w-full p-3 bg-dark-950 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-teal-500"
                required
              />
              <button
                type="submit"
                disabled={ocrLoading}
                className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-dark-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md"
              >
                {ocrLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ScanText className="w-4 h-4" />}
                {ocrLoading ? 'Parsing Visual Tokens...' : 'Extract Structured JSON Schema'}
              </button>
            </form>

            {ocrResult && (
              <div className="p-6 bg-dark-950 border border-slate-800 rounded-2xl space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-teal-400 font-bold">EXTRACTED SCHEMA: {ocrResult.invoice_number}</span>
                  <button
                    onClick={() => handleCopy(JSON.stringify(ocrResult, null, 2), 'ocr-copy')}
                    className="text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    {copiedKey === 'ocr-copy' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy JSON
                  </button>
                </div>
                <pre className="p-3 bg-dark-900 border border-slate-800 rounded-xl text-slate-200 overflow-x-auto leading-relaxed">
                  {JSON.stringify(ocrResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* 12. SAAS CHURN PREDICTOR */}
        {activeToolId === 'saas-churn' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">SaaS Churn & LTV Risk Predictor</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md">ML RETENTION</span>
              </div>
              <p className="text-xs text-slate-400">Predicts customer cancellation probability based on NPS, weekly active logins, and subscription tier.</p>
            </div>

            <form onSubmit={handlePredictChurn} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Customer NPS Score (0 - 10)</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={churnNps}
                  onChange={(e) => setChurnNps(Number(e.target.value))}
                  className="w-full p-2.5 bg-dark-950 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Logins in Last 14 Days</label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={churnLogins}
                  onChange={(e) => setChurnLogins(Number(e.target.value))}
                  className="w-full p-2.5 bg-dark-950 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Account MRR ($ / Month)</label>
                <input
                  type="number"
                  min="50"
                  max="10000"
                  step="50"
                  value={churnMrr}
                  onChange={(e) => setChurnMrr(Number(e.target.value))}
                  className="w-full p-2.5 bg-dark-950 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="sm:col-span-3">
                <button
                  type="submit"
                  className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-dark-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md"
                >
                  <Users className="w-4 h-4" /> Calculate Churn Risk Vector
                </button>
              </div>
            </form>

            {churnResult && (
              <div className="p-6 bg-dark-950 border border-slate-800 rounded-2xl space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center border-b border-slate-800 pb-4">
                  <div>
                    <div className="text-[10px] text-slate-400 font-mono">CHURN PROBABILITY</div>
                    <div className="text-3xl font-black text-rose-400 font-mono">{churnResult.churnProbabilityPct}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-mono">RISK STATUS</div>
                    <div className="text-base font-bold text-amber-400">{churnResult.riskLevel}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-mono">AT-RISK REVENUE</div>
                    <div className="text-base font-bold text-slate-200">{churnResult.atRiskMrr}</div>
                  </div>
                </div>

                <div className="p-3 bg-dark-900 border border-slate-800 rounded-xl space-y-1 text-xs">
                  <div className="text-teal-400 font-bold font-mono text-[10px]">RECOMMENDED RETENTION ACTION:</div>
                  <p className="text-slate-200">{churnResult.recommendedRetentionPlay}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 13. SEO META TAG STUDIO */}
        {activeToolId === 'seo-meta' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">SEO Meta Tag & OpenGraph Schema Studio</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md">SERP OPTIMIZATION</span>
              </div>
              <p className="text-xs text-slate-400">Generates Google SERP titles, meta descriptions, OpenGraph social cards, and JSON-LD structured schema.</p>
            </div>

            <form onSubmit={handleGenerateSeo} className="space-y-3">
              <label className="block text-xs text-slate-300 font-medium">Page Focus / Brand Title</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="flex-1 p-3 bg-dark-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500"
                  required
                />
                <button
                  type="submit"
                  disabled={seoLoading}
                  className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-dark-950 font-bold rounded-xl text-xs flex items-center gap-2 shrink-0 shadow-md"
                >
                  {seoLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Globe2 className="w-4 h-4" />}
                  {seoLoading ? 'Indexing...' : 'Generate SEO Tags'}
                </button>
              </div>
            </form>

            {seoResult && (
              <div className="p-6 bg-dark-950 border border-slate-800 rounded-2xl space-y-4 font-mono text-xs">
                <div className="space-y-2">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Google SERP Snippet Preview:</div>
                  <div className="p-3 bg-dark-900 border border-slate-800 rounded-xl space-y-1">
                    <div className="text-cyan-400 text-sm font-sans font-bold hover:underline cursor-pointer">{seoResult.title}</div>
                    <div className="text-emerald-400 text-[10px]">https://rine-forge-systems-19pm-eight.vercel.app/</div>
                    <div className="text-slate-300 font-sans text-xs">{seoResult.metaDescription}</div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Structured JSON-LD Schema:</div>
                  <pre className="p-3 bg-dark-900 border border-slate-800 rounded-xl text-teal-300 overflow-x-auto text-[11px]">
                    {seoResult.schemaJsonLd}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 14. QR CODE ARCHITECT */}
        {activeToolId === 'qr-gen' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">QR Code & Branded Link Architect</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-md">HIGH RES VECTOR</span>
              </div>
              <p className="text-xs text-slate-400">Creates styled high-resolution QR codes for marketing campaigns, physical collateral, and contactless payments.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              <div className="sm:col-span-8 space-y-3">
                <div>
                  <label className="block text-xs text-slate-300 font-medium mb-1">Target Web URL / Content</label>
                  <input
                    type="text"
                    value={qrUrl}
                    onChange={(e) => setQrUrl(e.target.value)}
                    className="w-full p-3 bg-dark-950 border border-slate-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-xs text-slate-300 font-medium mb-1">Accent Theme</label>
                    <input
                      type="color"
                      value={qrColor}
                      onChange={(e) => setQrColor(e.target.value)}
                      className="w-full h-10 p-1 bg-dark-950 border border-slate-800 rounded-xl cursor-pointer"
                    />
                  </div>
                  <div className="flex-1 flex items-end">
                    <button
                      onClick={() => handleCopy(qrUrl, 'qr-url')}
                      className="w-full py-2.5 bg-dark-850 hover:bg-dark-800 border border-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
                    >
                      {copiedKey === 'qr-url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      Copy Link
                    </button>
                  </div>
                </div>
              </div>

              {/* Vector QR Visual Simulator */}
              <div className="sm:col-span-4 p-5 bg-dark-950 border border-slate-800 rounded-2xl flex flex-col items-center justify-center space-y-3 text-center">
                <div className="w-32 h-32 bg-white rounded-xl p-2.5 flex items-center justify-center shadow-lg relative">
                  {/* Stylized QR Matrix Pattern */}
                  <div className="w-full h-full border-4 border-dark-950 grid grid-cols-6 grid-rows-6 gap-0.5 p-1 bg-white">
                    <div className="col-span-2 row-span-2 bg-dark-950 p-0.5"><div className="w-full h-full bg-white p-0.5"><div className="w-full h-full bg-dark-950" /></div></div>
                    <div className="col-span-2 bg-dark-950" />
                    <div className="col-span-2 row-span-2 bg-dark-950 p-0.5"><div className="w-full h-full bg-white p-0.5"><div className="w-full h-full bg-dark-950" /></div></div>
                    <div className="col-span-2 bg-dark-950" />
                    <div className="bg-dark-950" />
                    <div className="bg-dark-950" />
                    <div className="bg-dark-950" />
                    <div className="col-span-2 row-span-2 bg-dark-950 p-0.5"><div className="w-full h-full bg-white p-0.5"><div className="w-full h-full bg-dark-950" /></div></div>
                    <div className="col-span-4 row-span-2 bg-dark-950 p-1 flex items-center justify-center"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: qrColor }} /></div>
                  </div>
                </div>
                <div className="text-[10px] font-mono text-slate-400">High-Fidelity Dynamic Vector Matrix</div>
              </div>
            </div>
          </div>
        )}

        {/* 15. MULTI-MODEL BENCHMARK */}
        {activeToolId === 'multi-model-compare' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">Multi-Model AI Comparison Engine</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-md">4x CONCURRENT INGEST</span>
              </div>
              <p className="text-xs text-slate-400">Run any query simultaneously across Grok-2, Gemini 1.5 Pro, GPT-4o, and Claude 3.5 Sonnet.</p>
            </div>

            <form onSubmit={handleGenerateMultiModel} className="space-y-3">
              <label className="block text-xs text-slate-300 font-medium">Prompt to Benchmark Across All 4 Models</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={multiPrompt}
                  onChange={(e) => setMultiPrompt(e.target.value)}
                  className="flex-1 p-3 bg-dark-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500"
                  required
                />
                <button
                  type="submit"
                  disabled={multiLoading}
                  className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-dark-950 font-bold rounded-xl text-xs flex items-center gap-2 shrink-0 shadow-md"
                >
                  {multiLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Cpu className="w-4 h-4" />}
                  {multiLoading ? 'Querying 4 LLMs...' : 'Compare 4 Models'}
                </button>
              </div>
            </form>

            {multiResult && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {multiResult.models.map((m, i) => (
                  <div key={i} className="p-5 bg-dark-950 border border-slate-800 rounded-2xl space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white">{m.name}</span>
                        <span className="text-[9px] font-mono px-2 py-0.5 bg-dark-900 text-teal-400 border border-slate-800 rounded">
                          {m.badge} • {m.latency}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-sans leading-relaxed">{m.text}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/60 flex justify-end">
                      <button
                        onClick={() => handleCopy(m.text, `model-${i}`)}
                        className="text-[10px] font-mono text-slate-400 hover:text-white flex items-center gap-1"
                      >
                        {copiedKey === `model-${i}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        Copy Output
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
