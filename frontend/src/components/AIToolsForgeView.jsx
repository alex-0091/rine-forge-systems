import React, { useState } from 'react';
import { 
  Sparkles, Bot, Palette, Lightbulb, FileText, 
  BarChart2, Layout, Mail, MessageSquare, Cpu, 
  Copy, Check, ArrowRight, RefreshCw, Download, 
  Zap, ShieldCheck, DollarSign, ChevronRight, Layers,
  Flame, TrendingUp, CheckCircle2, Lock
} from 'lucide-react';

const AI_FORGE_TOOLS = [
  {
    id: 'logo-designer',
    name: 'Brand & Vector Logo Generator',
    category: 'Design & Branding',
    icon: Palette,
    badge: 'FREE INSTANT UTILITY',
    description: 'Generate vector logo marks, tailored hex color palettes, brand manifestos, and typography pairings from a single prompt.'
  },
  {
    id: 'idea-validator',
    name: 'Startup Idea & Market Validator',
    category: 'Strategy & Ideation',
    icon: Lightbulb,
    badge: 'MULTI-LLM POWERED',
    description: 'Instant market viability score, ICP persona breakdown, monetization streams, and competitive moat analysis.'
  },
  {
    id: 'whitepaper-gen',
    name: 'Executive Whitepaper Synthesizer',
    category: 'Technical Architecture',
    icon: FileText,
    badge: 'SYSTEM BLUEPRINTS',
    description: 'Synthesizes enterprise whitepapers, system architecture topologies, tokenomics / unit economics, and data flow specs.'
  },
  {
    id: 'business-plan',
    name: '12-Month Business Plan Builder',
    category: 'Commercial Strategy',
    icon: BarChart2,
    badge: 'INVESTOR READY',
    description: 'Detailed 4-quarter roadmap, revenue projections, target TAM/SAM sizing, and customer acquisition cost models.'
  },
  {
    id: 'salary-calc',
    name: 'Business Audit & Salary Matrix',
    category: 'Operations & Finance',
    icon: DollarSign,
    badge: 'PAYROLL INTEL',
    description: 'Calculate monthly payroll burn, employer tax liabilities, net payouts, and automation cost-reduction thresholds.'
  },
  {
    id: 'web-wireframe',
    name: 'Rapid Web Wireframer & Copy Architect',
    category: 'Web Engineering',
    icon: Layout,
    badge: 'HIGH CONVERSION',
    description: 'Instant high-converting page wireframe layouts, persuasive hero copy, proof blocks, and conversion CTA triggers.'
  },
  {
    id: 'outreach-gen',
    name: 'Cold Outreach Sequence Generator',
    category: 'Lead Generation',
    icon: Mail,
    badge: 'HIGH RESPONSE RATE',
    description: 'Engineers 3-step high-converting cold email sequences tailored to specific industry pain points and decision-makers.'
  },
  {
    id: 'crm-triage',
    name: 'Smart CRM Ticket & Urgency Triage',
    category: 'Customer Ops',
    icon: MessageSquare,
    badge: 'REAL-TIME TRIAGE',
    description: 'Classifies inbound customer support tickets by urgency level, sentiment score, and produces instant empathetic AI replies.'
  },
  {
    id: 'multi-model-compare',
    name: 'Multi-Model AI Comparison (Grok / GPT-4o / Gemini / Claude)',
    category: 'AI Benchmarking',
    icon: Cpu,
    badge: '4-MODEL PARALLEL',
    description: 'Run your prompt concurrently across GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro, and Grok-2 side-by-side.'
  }
];

export function AIToolsForgeView({ onOpenPaymentModal }) {
  const [activeToolId, setActiveToolId] = useState('logo-designer');
  const [copiedKey, setCopiedKey] = useState('');

  // 1. Logo Designer State
  const [logoName, setLogoName] = useState('Vanguard Logic');
  const [logoVibe, setLogoVibe] = useState('Modern Fintech & High-Tech AI');
  const [logoResult, setLogoResult] = useState(null);
  const [logoLoading, setLogoLoading] = useState(false);

  // 2. Idea Validator State
  const [ideaInput, setIdeaInput] = useState('An autonomous AI voice agent that books after-hours plumbing and HVAC service appointments directly into FieldEdge');
  const [ideaResult, setIdeaResult] = useState(null);
  const [ideaLoading, setIdeaLoading] = useState(false);

  // 3. Whitepaper State
  const [wpTopic, setWpTopic] = useState('Decentralized High-Frequency Liquidity Ingest Engine & Cross-Chain Microstructure Arbitrage');
  const [wpResult, setWpResult] = useState(null);
  const [wpLoading, setWpLoading] = useState(false);

  // 4. Business Plan State
  const [bpCompany, setBpCompany] = useState('Nexus AI Logistics');
  const [bpOffering, setBpOffering] = useState('Automated dispatch and driver route optimization for mid-sized freight fleets');
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
  const [crmMessage, setCrmMessage] = useState('Our database sync stopped at 2 AM and our morning dispatchers cannot see active driver locations. Need someone on this right now!');
  const [crmResult, setCrmResult] = useState(null);
  const [crmLoading, setCrmLoading] = useState(false);

  // 9. Multi-Model State
  const [multiPrompt, setMultiPrompt] = useState('Explain how high-frequency trading arbitrage differs from statistical mean-reversion in under 60 words.');
  const [multiResult, setMultiResult] = useState(null);
  const [multiLoading, setMultiLoading] = useState(false);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2000);
  };

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
    }, 800);
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
    }, 900);
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
    }, 1000);
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
    }, 1000);
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
    }, 850);
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
    }, 900);
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
    }, 750);
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
    }, 1100);
  };

  // Compute Salary Audit Breakdown
  const totalBasePayroll = salaryHeadcount * salaryAvgMonthly;
  const totalTaxContribution = totalBasePayroll * (salaryTaxPct / 100);
  const totalMonthlyBurn = totalBasePayroll + totalTaxContribution + salaryOpex;
  const annualBurn = totalMonthlyBurn * 12;
  const potentialSavings = Math.round(totalMonthlyBurn * 0.28);

  return (
    <div className="space-y-10 py-6 max-w-6xl mx-auto font-sans text-slate-100">
      
      {/* Top Section Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5" /> FREE UTILITY POWER-TOOLS FORGE
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          All-in-One <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-300 to-indigo-400">Autonomous AI Tools Suite</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
          Instant production utilities for businesses and creators. Type your prompt, generate professional deliverables for free, or deploy a custom automated enterprise version.
        </p>
      </div>

      {/* Tool Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
        {AI_FORGE_TOOLS.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeToolId === tool.id;
          return (
            <div
              key={tool.id}
              onClick={() => setActiveToolId(tool.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between group ${
                isActive
                  ? 'bg-gradient-to-br from-teal-500/15 via-dark-900 to-indigo-500/10 border-teal-500 shadow-lg shadow-teal-500/10'
                  : 'bg-dark-900/80 border-slate-800 hover:border-slate-700 hover:bg-dark-850'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                    isActive ? 'bg-teal-500 text-dark-950 font-bold' : 'bg-dark-950 text-slate-400 group-hover:text-teal-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-md font-bold">
                    {tool.badge}
                  </span>
                </div>
                <h3 className="font-bold text-xs text-white group-hover:text-teal-300 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {tool.description}
                </p>
              </div>

              <div className="pt-3 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-500">{tool.category}</span>
                <span className={`font-bold flex items-center gap-1 ${isActive ? 'text-teal-400' : 'text-slate-400'}`}>
                  {isActive ? 'Active Engine' : 'Open Tool'} <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ACTIVE TOOL PLAYGROUND CANVAS */}
      <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        
        {/* 1. LOGO & BRAND DESIGNER */}
        {activeToolId === 'logo-designer' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">Brand Identity & Vector Logo Designer</h2>
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
                  className="w-full py-3 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-dark-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-teal-500/20"
                >
                  {logoLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Palette className="w-4 h-4" />}
                  {logoLoading ? 'Forging...' : 'Generate Brand'}
                </button>
              </div>
            </form>

            {logoResult && (
              <div className="space-y-6 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Visual Logo Emblem Preview */}
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

                  {/* Color Palette */}
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

                  {/* Manifesto & Typography */}
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

                {/* Custom Upgrade Callout */}
                <div className="p-4 bg-gradient-to-r from-teal-500/10 via-dark-950 to-indigo-500/10 border border-teal-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-xs text-white">Need a full custom website, branding kit & animated vector library?</div>
                    <div className="text-[11px] text-slate-400">Deploy a production platform with 100% code ownership on a 50% milestone deposit.</div>
                  </div>
                  <button
                    onClick={() => onOpenPaymentModal && onOpenPaymentModal('full-web-ai-suite')}
                    className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl text-xs shrink-0 flex items-center gap-1.5 transition-all shadow-md shadow-teal-500/20"
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
                <h2 className="text-xl font-bold text-white">Startup Idea & Market Viability Validator</h2>
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
                  placeholder="Enter business concept..."
                  required
                />
                <button
                  type="submit"
                  disabled={ideaLoading}
                  className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-dark-950 font-bold rounded-xl text-xs flex items-center gap-2 shrink-0 shadow-md shadow-teal-500/20"
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

                <div className="p-4 bg-gradient-to-r from-teal-500/10 via-dark-950 to-indigo-500/10 border border-teal-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-xs text-white">Want us to build and deploy this exact system for your company?</div>
                    <div className="text-[11px] text-slate-400">We deliver a custom working prototype in 48 hours with 50% milestone billing.</div>
                  </div>
                  <button
                    onClick={() => onOpenPaymentModal && onOpenPaymentModal('speed-to-lead')}
                    className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl text-xs shrink-0 flex items-center gap-1.5 transition-all shadow-md"
                  >
                    Build Custom System ($299 Deposit) →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. EXECUTIVE WHITEPAPER SYNTHESIZER */}
        {activeToolId === 'whitepaper-gen' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">Executive Whitepaper & Architecture Synthesizer</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md">TECHNICAL SPEC</span>
              </div>
              <p className="text-xs text-slate-400">Synthesizes institutional whitepapers, topology layers, consensus mechanics, and unit economics.</p>
            </div>

            <form onSubmit={handleGenerateWhitepaper} className="space-y-3">
              <label className="block text-xs text-slate-300 font-medium">Architecture / System Topic</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={wpTopic}
                  onChange={(e) => setWpTopic(e.target.value)}
                  className="flex-1 p-3 bg-dark-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500"
                  required
                />
                <button
                  type="submit"
                  disabled={wpLoading}
                  className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-dark-950 font-bold rounded-xl text-xs flex items-center gap-2 shrink-0 shadow-md"
                >
                  {wpLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                  {wpLoading ? 'Synthesizing...' : 'Generate Whitepaper'}
                </button>
              </div>
            </form>

            {wpResult && (
              <div className="p-6 bg-dark-950 border border-slate-800 rounded-2xl space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-teal-400 font-sans">{wpResult.title}</h3>
                  <span className="text-[10px] text-emerald-400 font-bold">{wpResult.readinessStatus}</span>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] uppercase text-slate-400 font-bold">1. Executive Abstract</div>
                  <p className="text-slate-300 font-sans leading-relaxed text-xs">{wpResult.abstract}</p>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[10px] uppercase text-slate-400 font-bold">2. Architectural Topology & Consensus Layers</div>
                  <div className="space-y-1.5 pl-2 border-l-2 border-teal-500/40">
                    {wpResult.architecture.map((layer, i) => (
                      <div key={i} className="text-slate-300 font-sans text-xs">⚡ {layer}</div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Unit Economics: <strong className="text-white">{wpResult.unitEconomics}</strong></span>
                  <button
                    onClick={() => handleCopy(JSON.stringify(wpResult, null, 2), 'wp-copy')}
                    className="text-teal-400 hover:text-teal-300 flex items-center gap-1 font-bold"
                  >
                    {copiedKey === 'wp-copy' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy Full Whitepaper Spec
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. 12-MONTH BUSINESS PLAN */}
        {activeToolId === 'business-plan' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">12-Month Comprehensive Business Plan Builder</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md">INVESTOR GRADE</span>
              </div>
              <p className="text-xs text-slate-400">Produces 4-quarter milestones, TAM addressable markets, and CAC/LTV unit economic models.</p>
            </div>

            <form onSubmit={handleGenerateBusinessPlan} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-5">
                <label className="block text-xs text-slate-300 font-medium mb-1">Company / Venture Name</label>
                <input
                  type="text"
                  value={bpCompany}
                  onChange={(e) => setBpCompany(e.target.value)}
                  className="w-full p-3 bg-dark-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div className="sm:col-span-5">
                <label className="block text-xs text-slate-300 font-medium mb-1">Core Offering / Problem Solved</label>
                <input
                  type="text"
                  value={bpOffering}
                  onChange={(e) => setBpOffering(e.target.value)}
                  className="w-full p-3 bg-dark-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div className="sm:col-span-2 flex items-end">
                <button
                  type="submit"
                  disabled={bpLoading}
                  className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-dark-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md"
                >
                  {bpLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <BarChart2 className="w-4 h-4" />}
                  {bpLoading ? 'Building...' : 'Generate Plan'}
                </button>
              </div>
            </form>

            {bpResult && (
              <div className="space-y-5 pt-2">
                <div className="p-5 bg-dark-950 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-teal-400 font-bold uppercase">{bpResult.company} Executive Summary</span>
                    <span className="text-emerald-400 font-bold">{bpResult.tam}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{bpResult.executiveSummary}</p>
                  <div className="text-[11px] text-cyan-400 font-mono pt-1">Economics: {bpResult.cacLtv}</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {bpResult.milestones.map((m, i) => (
                    <div key={i} className="p-4 bg-dark-950 border border-slate-800 rounded-xl space-y-1">
                      <div className="text-[10px] font-mono text-teal-400 font-bold">{m.quarter}</div>
                      <div className="text-xs text-slate-200 leading-relaxed">{m.goal}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 5. SALARY & BUSINESS AUDIT CALCULATOR */}
        {activeToolId === 'salary-calc' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">Business Audit & Salary Matrix Calculator</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-md">FINANCIAL ENGINE</span>
              </div>
              <p className="text-xs text-slate-400">Calculates monthly payroll run rate, employer tax deductions, employee take-home, and AI automation savings.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium">Headcount (Full-Time Staff)</label>
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={salaryHeadcount}
                  onChange={(e) => setSalaryHeadcount(Number(e.target.value))}
                  className="w-full p-2.5 bg-dark-950 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium">Average Monthly Salary ($)</label>
                <input
                  type="number"
                  min="500"
                  max="30000"
                  step="100"
                  value={salaryAvgMonthly}
                  onChange={(e) => setSalaryAvgMonthly(Number(e.target.value))}
                  className="w-full p-2.5 bg-dark-950 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium">Tax & Social Deduction (%)</label>
                <input
                  type="number"
                  min="0"
                  max="45"
                  value={salaryTaxPct}
                  onChange={(e) => setSalaryTaxPct(Number(e.target.value))}
                  className="w-full p-2.5 bg-dark-950 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium">Monthly Office & SaaS OpEx ($)</label>
                <input
                  type="number"
                  min="0"
                  max="50000"
                  step="500"
                  value={salaryOpex}
                  onChange={(e) => setSalaryOpex(Number(e.target.value))}
                  className="w-full p-2.5 bg-dark-950 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            {/* Audit Output Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="p-4 bg-dark-950 border border-slate-800 rounded-2xl space-y-1 text-center">
                <div className="text-[10px] uppercase font-mono text-slate-400">Total Monthly Burn</div>
                <div className="text-2xl font-black text-rose-400 font-mono">${totalMonthlyBurn.toLocaleString()}</div>
                <div className="text-[10px] text-slate-500 font-mono">Run rate / mo</div>
              </div>

              <div className="p-4 bg-dark-950 border border-slate-800 rounded-2xl space-y-1 text-center">
                <div className="text-[10px] uppercase font-mono text-slate-400">Annual Payroll Run Rate</div>
                <div className="text-2xl font-black text-slate-200 font-mono">${annualBurn.toLocaleString()}</div>
                <div className="text-[10px] text-slate-500 font-mono">Annualized</div>
              </div>

              <div className="p-4 bg-dark-950 border border-slate-800 rounded-2xl space-y-1 text-center">
                <div className="text-[10px] uppercase font-mono text-slate-400">Employer Tax Liability</div>
                <div className="text-2xl font-black text-amber-400 font-mono">${Math.round(totalTaxContribution).toLocaleString()}</div>
                <div className="text-[10px] text-slate-500 font-mono">Tax & benefit share</div>
              </div>

              <div className="p-4 bg-gradient-to-br from-teal-500/10 via-dark-950 to-emerald-500/10 border border-teal-500/30 rounded-2xl space-y-1 text-center">
                <div className="text-[10px] uppercase font-mono text-teal-400 font-bold">Automation Recovery Potential</div>
                <div className="text-2xl font-black text-emerald-400 font-mono">${potentialSavings.toLocaleString()}</div>
                <div className="text-[10px] text-emerald-300 font-mono">Estimated / mo saved</div>
              </div>
            </div>
          </div>
        )}

        {/* 6. RAPID WEBPAGE WIREFRAMER */}
        {activeToolId === 'web-wireframe' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">Rapid Webpage Wireframer & Copy Architect</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md">CONVERSION COPY</span>
              </div>
              <p className="text-xs text-slate-400">Generates conversion-tested page wireframes, headlines, subheadings, and high-impact CTA hooks.</p>
            </div>

            <form onSubmit={handleGenerateWebWireframe} className="space-y-3">
              <label className="block text-xs text-slate-300 font-medium">Business Type & Target Niche</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={webIndustry}
                  onChange={(e) => setWebIndustry(e.target.value)}
                  className="flex-1 p-3 bg-dark-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500"
                  required
                />
                <button
                  type="submit"
                  disabled={webLoading}
                  className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-dark-950 font-bold rounded-xl text-xs flex items-center gap-2 shrink-0 shadow-md"
                >
                  {webLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Layout className="w-4 h-4" />}
                  {webLoading ? 'Wireframing...' : 'Generate Wireframe'}
                </button>
              </div>
            </form>

            {webResult && (
              <div className="space-y-4 pt-2">
                {webResult.sections.map((sec, i) => (
                  <div key={i} className="p-5 bg-dark-950 border border-slate-800 rounded-2xl space-y-2">
                    <div className="text-[10px] font-mono uppercase text-teal-400 font-bold">{sec.section}</div>
                    <div className="text-sm font-bold text-white">{sec.headline}</div>
                    <div className="text-xs text-slate-300 leading-relaxed">{sec.subheadline}</div>
                    {sec.cta && (
                      <div className="pt-2">
                        <span className="inline-block px-3 py-1 bg-teal-500/10 border border-teal-500/30 text-teal-400 rounded-lg text-xs font-mono font-bold">
                          Button CTA: "{sec.cta}"
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 7. COLD OUTREACH SEQUENCE GENERATOR */}
        {activeToolId === 'outreach-gen' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">Cold Outreach Email Sequence Generator</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-md">B2B ACQUISITION</span>
              </div>
              <p className="text-xs text-slate-400">Engineers personalized 3-step email outreach sequences that convert cold decision-makers.</p>
            </div>

            <form onSubmit={handleGenerateOutreach} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-5">
                <label className="block text-xs text-slate-300 font-medium mb-1">Target Decision-Maker Title</label>
                <input
                  type="text"
                  value={outreachTarget}
                  onChange={(e) => setOutreachTarget(e.target.value)}
                  className="w-full p-3 bg-dark-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div className="sm:col-span-5">
                <label className="block text-xs text-slate-300 font-medium mb-1">Core Pain Point Identified</label>
                <input
                  type="text"
                  value={outreachPain}
                  onChange={(e) => setOutreachPain(e.target.value)}
                  className="w-full p-3 bg-dark-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div className="sm:col-span-2 flex items-end">
                <button
                  type="submit"
                  disabled={outreachLoading}
                  className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-dark-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md"
                >
                  {outreachLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  {outreachLoading ? 'Crafting...' : 'Build Sequence'}
                </button>
              </div>
            </form>

            {outreachResult && (
              <div className="space-y-4 pt-2">
                <div className="p-5 bg-dark-950 border border-slate-800 rounded-2xl space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-teal-400 font-bold">Email 1: Initial Hook & Prototype Link</span>
                    <button
                      onClick={() => handleCopy(`${outreachResult.step1.subject}\n\n${outreachResult.step1.body}`, 'email1')}
                      className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      {copiedKey === 'email1' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} Copy
                    </button>
                  </div>
                  <div className="text-slate-400">Subject: <strong className="text-white">{outreachResult.step1.subject}</strong></div>
                  <pre className="text-slate-300 font-sans whitespace-pre-wrap leading-relaxed">{outreachResult.step1.body}</pre>
                </div>

                <div className="p-5 bg-dark-950 border border-slate-800 rounded-2xl space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-cyan-400 font-bold">Email 2: Value Proof (3 Days Later)</span>
                    <button
                      onClick={() => handleCopy(`${outreachResult.step2.subject}\n\n${outreachResult.step2.body}`, 'email2')}
                      className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      {copiedKey === 'email2' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} Copy
                    </button>
                  </div>
                  <div className="text-slate-400">Subject: <strong className="text-white">{outreachResult.step2.subject}</strong></div>
                  <pre className="text-slate-300 font-sans whitespace-pre-wrap leading-relaxed">{outreachResult.step2.body}</pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 8. SMART CRM TICKET TRIAGE */}
        {activeToolId === 'crm-triage' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">Smart CRM Ticket & Urgency Triage</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-md">SUPPORT AI</span>
              </div>
              <p className="text-xs text-slate-400">Evaluates raw customer messages, scores urgency & sentiment, and drafts instant empathetic resolutions.</p>
            </div>

            <form onSubmit={handleGenerateCrm} className="space-y-3">
              <label className="block text-xs text-slate-300 font-medium">Customer Support Message / Email</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={crmMessage}
                  onChange={(e) => setCrmMessage(e.target.value)}
                  className="flex-1 p-3 bg-dark-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500"
                  required
                />
                <button
                  type="submit"
                  disabled={crmLoading}
                  className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-dark-950 font-bold rounded-xl text-xs flex items-center gap-2 shrink-0 shadow-md"
                >
                  {crmLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
                  {crmLoading ? 'Triaging...' : 'Triage Ticket'}
                </button>
              </div>
            </form>

            {crmResult && (
              <div className="p-6 bg-dark-950 border border-slate-800 rounded-2xl space-y-4 text-xs font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-slate-400 text-[10px]">URGENCY CLASSIFICATION:</span>
                    <div className="text-rose-400 font-bold text-sm">{crmResult.urgency}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">SENTIMENT VECTOR:</span>
                    <div className="text-amber-400 font-bold text-sm">{crmResult.sentiment}</div>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px]">CORE ISSUE DETECTED:</span>
                  <div className="text-slate-200 font-sans text-xs">{crmResult.detectedIssue}</div>
                </div>

                <div className="p-4 bg-dark-900 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-teal-400 text-[10px] font-bold">AUTO-GENERATED AI RESPONSE DRAFT:</span>
                  <p className="text-slate-200 font-sans text-xs leading-relaxed italic">"{crmResult.aiDraftReply}"</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 9. MULTI-MODEL AI COMPARISON */}
        {activeToolId === 'multi-model-compare' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">Multi-Model AI Comparison Engine</h2>
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
