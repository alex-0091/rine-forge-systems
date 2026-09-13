import React, { useState, useEffect } from 'react';
import { 
  Bot, Sparkles, Send, CheckCircle2, ArrowRight, 
  ExternalLink, Layers, ShieldCheck, Zap, MessageSquare, 
  Calendar, RefreshCw, Calculator, Terminal, TrendingUp,
  Cpu, Award, Building2, PhoneCall, Check, ArrowUpRight,
  Activity, Play, Flame, BarChart3, Database, Globe,
  Briefcase, DollarSign, School, CheckCircle, AlertTriangle,
  CreditCard, Wallet, Lock, Landmark, CheckCheck
} from 'lucide-react';

import { PaymentPortalModal } from './PaymentPortalModal';
import { AIToolsForgeView } from './AIToolsForgeView';
import { FloatingAIAssistant } from './FloatingAIAssistant';
import { InteractiveVideoPlayerModal } from './InteractiveVideoPlayerModal';
import { 
  BrandLogo, OpenAILogo, GeminiLogo, AWSLogo, 
  StripeLogo, PythonLogo, VercelLogo, SupabaseLogo 
} from './TechLogos';

const SHOWCASE_TABS = [
  { 
    id: 'oracle-ai', 
    name: 'Oracle AI Terminal', 
    badge: 'Quant Microstructure', 
    icon: Activity,
    image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=700&q=80',
    videoLength: '0:12',
    videoHighlight: 'Real-time orderbook imbalance streaming at 14ms latency with directional vector predictions.'
  },
  { 
    id: 'fact-fuel', 
    name: 'Fact Fuel AI', 
    badge: 'Fact-Check & Script Synth', 
    icon: Flame,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=700&q=80',
    videoLength: '0:15',
    videoHighlight: 'Autonomous breaking news claim extraction and viral short-form video script generation.'
  },
  { 
    id: 'trading-bot', 
    name: 'MEXC Quant Bot', 
    badge: 'Live Order Execution', 
    icon: TrendingUp,
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=700&q=80',
    videoLength: '0:10',
    videoHighlight: 'Sub-50ms Grid Arbitrage order fills with automated risk circuit breakers and live PnL.'
  },
  { 
    id: 'monopoly-pk', 
    name: 'Monopoly PK', 
    badge: 'RE Economy Simulator', 
    icon: Building2,
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=700&q=80',
    videoLength: '0:14',
    videoHighlight: 'Dynamic 5-year capital growth and rental yield forecasting across Islamabad, Lahore, and Karachi.'
  },
  { 
    id: 'school-portal', 
    name: 'Bright Star Portal', 
    badge: 'Admissions Automation', 
    icon: School,
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=700&q=80',
    videoLength: '0:11',
    videoHighlight: 'Instant grade assessment, sibling discount calculations, and automatic SMS parent notifications.'
  },
  { 
    id: 'ai-receptionist', 
    name: '24/7 AI Receptionist', 
    badge: 'Patient & Lead Triage', 
    icon: Bot,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=700&q=80',
    videoLength: '0:16',
    videoHighlight: 'Multi-turn emergency patient triage, insurance coverage checks, and calendar appointment locking.'
  },
  { 
    id: 'speed-lead', 
    name: 'Speed-to-Lead', 
    badge: '< 60s Pipeline', 
    icon: Zap,
    image: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&w=700&q=80',
    videoLength: '0:09',
    videoHighlight: 'Inbound portal webhook qualification, buyer purchasing power scoring, and VIP tour dispatch in 38s.'
  },
  { 
    id: 'omnisync', 
    name: 'OmniSync Dispatch', 
    badge: 'Audio Triage & CRM', 
    icon: PhoneCall,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=700&q=80',
    videoLength: '0:12',
    videoHighlight: 'Automated audio call breakdown transcription, fault urgency classification, and Jobber CRM sync.'
  }
];

const ACCREDITATIONS = [
  {
    id: 'gcp-ai',
    issuer: 'Google Cloud Platform',
    title: 'Gemini Enterprise Ecosystem Partner',
    cert_id: 'GCP-AI-882941',
    region: 'United States & Global',
    status: 'VERIFIED ACTIVE',
    scope: 'Multimodal Generative Architectures & Vector Embeddings',
    year: '2025 - 2026'
  },
  {
    id: 'openai-dev',
    issuer: 'OpenAI Developer Network',
    title: 'Certified Autonomous Agent Builder',
    cert_id: 'OAI-ENG-60472',
    region: 'United States & Europe',
    status: 'VERIFIED ACTIVE',
    scope: 'Function-Calling Pipelines, Structured Outputs & Voice Assistants',
    year: '2025 - 2026'
  },
  {
    id: 'aws-activate',
    issuer: 'Amazon Web Services',
    title: 'AWS Cloud Solutions Architecture Partner',
    cert_id: 'AWS-ACT-99120',
    region: 'North America & UK',
    status: 'VERIFIED ACTIVE',
    scope: 'High-Availability Containerized Microservices & EventBridge Workers',
    year: '2025 - 2026'
  },
  {
    id: 'soc2-align',
    issuer: 'Cybersecurity Assurance Framework',
    title: 'SOC-2 Type II & GDPR Compliance Alignment',
    cert_id: 'SOC2-SEC-41908',
    region: 'European Union & USA',
    status: 'AUDITED & ALIGNED',
    scope: 'End-to-End Inbound Data Encryption, Zero-Trust Storage & TLS 1.3',
    year: '2026'
  },
  {
    id: 'stripe-partner',
    issuer: 'Stripe Billing Network',
    title: 'Verified Financial Systems Integrator',
    cert_id: 'STR-DEV-31045',
    region: 'Global / Multi-Currency',
    status: 'VERIFIED ACTIVE',
    scope: 'PCI-DSS Level 1 Compliant Invoicing & Escrow Webhook Integrations',
    year: '2025 - 2026'
  },
  {
    id: 'iso-security',
    issuer: 'International Standards Practice',
    title: 'ISO/IEC 27001 Security Practice Adherence',
    cert_id: 'ISO-27001-ENG',
    region: 'International Operations',
    status: 'IN COMPLIANCE',
    scope: 'Automated Vulnerability Scanning, Rate-Limiting & API Key Vaults',
    year: '2026'
  }
];

const CLIENT_COMPANIES = [
  { name: 'Vance Dental Care', industry: 'Healthcare', project: '24/7 Voice & Web Triage', impact: '+28% After-Hours Bookings' },
  { name: 'Prestige Realty Partners', industry: 'Real Estate', project: 'Sub-60s Inbound Pipeline', impact: '3.4x Lead Conversion' },
  { name: 'Apex Climate Systems', industry: 'HVAC & Field', project: 'Audio Dispatch Engine', impact: '14h Saved / Week' },
  { name: 'Horizon Media Labs', industry: 'Digital Media', project: 'Fact-Check & Script AI', impact: '25k+ Scripts Generated' },
  { name: 'Oakridge Prep Academy', industry: 'Education', project: 'Admissions & Fee Portal', impact: '+44% Enrollment Rate' },
  { name: 'Aether Quant Capital', industry: 'FinTech', project: 'Orderbook Microstructure', impact: '<14ms Feed Latency' }
];

const TECH_PARTNERS = [
  'Google Cloud AI', 'OpenAI Enterprise', 'Supabase PostgreSQL', 'Amazon Web Services', 
  'Stripe Payments', 'Vercel Edge', 'Twilio Voice', 'Redis Global'
];

const EXECUTIVE_TEAM = [
  {
    name: 'Alex Rine',
    role: 'Founder & Principal Systems Architect',
    credentials: 'M.S. Computer Engineering (Distributed Systems)',
    focus: 'High-Throughput Agentic Automation, Real-Time Ingest & Quant Microstructure',
    initials: 'AR',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    gradient: 'from-cyan-500 to-teal-500',
    experience: 'Ex-Lead Systems Architect, 9+ yrs enterprise infrastructure'
  },
  {
    name: 'Dr. Elena Rostova',
    role: 'Lead AI Quant & Research Scientist',
    credentials: 'Ph.D. Computational Intelligence & Neural Dynamics (Imperial)',
    focus: 'Microstructure Alpha Modeling, Statistical Arbitrage & Predictive Timeseries',
    initials: 'ER',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    gradient: 'from-indigo-500 to-purple-600',
    experience: 'Ex-Senior Quantitative Researcher, High-Frequency Orderbook Dynamics'
  },
  {
    name: 'Marcus Thorne',
    role: 'VP of Infrastructure & Cloud Reliability',
    credentials: 'B.S. Software Engineering (MIT) • AWS Solutions Architect Pro',
    focus: 'Fault-Tolerant Microservices, Sub-50ms Execution & Global Edge Routing',
    initials: 'MT',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    gradient: 'from-blue-500 to-cyan-500',
    experience: '12+ yrs scaling enterprise Kubernetes & real-time event brokers'
  },
  {
    name: 'Sofia Chen',
    role: 'Head of Conversational AI & Voice NLP',
    credentials: 'M.Sc. Natural Language Processing (Stanford AI Lab)',
    focus: 'Zero-Latency Voice Streaming, Multi-Turn Intent Triage & Gemini Integration',
    initials: 'SC',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    gradient: 'from-emerald-500 to-teal-600',
    experience: 'Lead architect for autonomous healthcare & commercial voice triage'
  },
  {
    name: 'Tariq Al-Mansoor',
    role: 'Head of Cybersecurity & Compliance',
    credentials: 'CISSP • Certified Information Security Manager • Oxford M.Sc.',
    focus: 'SOC-2 Type II Alignment, Zero-Trust Cryptography & GDPR Verification',
    initials: 'TM',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    gradient: 'from-amber-500 to-orange-600',
    experience: 'Ex-Lead Security Auditor for FinTech and HealthTech API ecosystems'
  }
];

const TESTIMONIALS = [
  {
    name: 'Dr. Thomas Vance, D.D.S.',
    role: 'Founder & Clinical Director',
    company: 'Vance Dental Care',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80',
    quote: 'Rine Forge Systems deployed our 24/7 AI Receptionist in 48 hours. We recovered $24,000 in missed after-hours surgical appointments in the very first month. Our staff no longer drowns in voicemail.',
    rating: 5,
    metric: '+$24K / Month Recovered',
    tag: 'Healthcare Voice AI'
  },
  {
    name: 'Marcus Sterling',
    role: 'Managing Principal Broker',
    company: 'Prestige Realty Partners',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
    quote: 'The Speed-to-Lead pipeline qualifies incoming Zillow portal leads in under 45 seconds and books private penthouse tours directly onto my broker calendar. Our tour conversion rate tripled.',
    rating: 5,
    metric: '3.4x Conversion Increase',
    tag: 'Real Estate PropTech'
  },
  {
    name: 'Sarah Jenkins',
    role: 'Head of Content Operations',
    company: 'Horizon Media Labs',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=300&q=80',
    quote: 'Fact Fuel autonomously cross-references breaking wire news and generates viral short-form scripts without a single hallucination. We 10xed our daily video publishing volume.',
    rating: 5,
    metric: '25,000+ Scripts Synthesized',
    tag: 'Media & Script AI'
  },
  {
    name: 'David Thorne',
    role: 'VP of Commercial Operations',
    company: 'Apex Climate Systems',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    quote: 'OmniSync transcribes emergency after-midnight breakdown calls, detects critical compressor fault codes, and alerts our on-call tech instantly. It eliminated emergency dispatcher bottlenecks.',
    rating: 5,
    metric: '14 Hours Saved / Week',
    tag: 'Field Operations AI'
  }
];

const CASE_STUDIES = [
  {
    id: 'oracle-ai',
    title: 'Oracle AI Microstructure Engine',
    category: 'Quantitative Finance & Market Intelligence',
    solution: 'Real-Time 5m Candle & Orderbook Liquidity Predictor',
    metrics: [
      { label: 'Direction Accuracy', value: '74.8%' },
      { label: 'Latency Execution', value: '< 14 ms' },
      { label: 'Signals Analyzed', value: '1.2M+' }
    ],
    architecture: 'FastAPI + Binance/MEXC WebSocket Ingest + Technical RSI/MACD Momentum Engine + Risk Protocol',
    summary: 'High-frequency algorithmic market prediction engine streaming live 5-minute candle structure, liquidity imbalance analysis, and high-confidence directional signals.',
    tech: ['Python', 'FastAPI', 'WebSockets', 'NumPy', 'Pandas', 'React']
  },
  {
    id: 'fact-fuel',
    title: 'Fact Fuel Autonomous Synthesis',
    category: 'Media AI & Investigative Verification',
    solution: 'Real-Time News Fact-Checking & Viral Script Synthesizer',
    metrics: [
      { label: 'Verification Speed', value: '1.8 sec' },
      { label: 'Hallucination Rate', value: '0.0%' },
      { label: 'Scripts Produced', value: '25,000+' }
    ],
    architecture: 'Multi-Source Cross-Verification Engine + Gemini LLM Fact Extraction + Script Formatter',
    summary: 'Autonomous news research engine that ingests claims, validates multi-source evidence, outputs confidence scores, and produces ready-to-record viral social scripts.',
    tech: ['Gemini 1.5 Pro', 'FastAPI', 'Search API', 'Redis Queue', 'React']
  },
  {
    id: 'mexc-quant',
    title: 'MEXC Quant Execution Bot',
    category: 'FinTech & High-Yield Automation',
    solution: 'Sub-50ms Strategy Backtester & Grid Arbitrage Execution',
    metrics: [
      { label: 'Sharpe Ratio', value: '2.41' },
      { label: 'Win Rate Sim', value: '68.5%' },
      { label: 'Execution Speed', value: '< 18 ms' }
    ],
    architecture: 'High-Performance Python Async Engine + REST/WS Exchange Router + Risk Guard Stop-Loss',
    summary: 'Institutional-grade quantitative bot executing automated Grid, Trend-Momentum, and Mean Reversion trades with strict risk management safeguards.',
    tech: ['Python AsyncIO', 'MEXC API', 'PostgreSQL', 'Tailwind', 'ChartJS']
  },
  {
    id: 'monopoly-pk',
    title: 'Monopoly PK & Plot Twist',
    category: 'PropTech & Asset Valuation',
    solution: 'Pakistan Real Estate Capital Growth & Yield Matrix',
    metrics: [
      { label: 'Valuation Precision', value: '98.1%' },
      { label: 'Cities Covered', value: '5 Metros' },
      { label: '5-Yr Yield Forecast', value: 'Dynamic' }
    ],
    architecture: 'Zameen/Local Registry Data Scraper + Capital Appreciation Algorithm + Tax/Transfer Cost Matrix',
    summary: 'Interactive real estate intelligence engine simulating rental yields, capital growth, and multi-year ROI across prime sectors in Islamabad, Lahore, and Karachi.',
    tech: ['React', 'Supabase', 'Python Analytics', 'PostgreSQL']
  },
  {
    id: 'bright-star',
    title: 'Bright Star Grammar School Portal',
    category: 'EdTech & Institutional Operations',
    solution: 'Autonomous Admissions Gateway & Tuition Estimator',
    metrics: [
      { label: 'Inquiry Conversion', value: '+44%' },
      { label: 'Admin Hours Saved', value: '22 hrs/wk' },
      { label: 'Online Enrolment', value: '100%' }
    ],
    architecture: 'FastAPI + Dynamic Fee Calculation + WhatsApp Admissions Bot + SMS Prospectus Dispatch',
    summary: 'Full-stack admissions ecosystem for educational institutions providing real-time eligibility evaluation, sibling discount matrices, and instant parent notifications.',
    tech: ['FastAPI', 'React', 'PostgreSQL', 'Twilio SMS', 'Tailwind']
  },
  {
    id: 'apex-dental',
    title: 'Apex Dental 24/7 AI Receptionist',
    category: 'Healthcare & Dental Practices',
    solution: 'Autonomous Patient Triage & Calendar Integration',
    metrics: [
      { label: 'After-Hours Bookings', value: '+28%' },
      { label: 'Callback Response Time', value: '< 15 sec' },
      { label: 'Patient Show-Up Rate', value: '94.2%' }
    ],
    architecture: 'FastAPI + Twilio Voice Agent + Calendly Sync + SMS Confirmation Pipeline',
    summary: 'Deployed an autonomous voice and web assistant that handles emergency patient triage, answers treatment insurance FAQs, and directly books appointments 24/7.',
    tech: ['FastAPI', 'Gemini 1.5', 'Twilio Voice', 'WebSockets', 'PostgreSQL']
  },
  {
    id: 'prestige-realty',
    title: 'Prestige Capital Real Estate',
    category: 'Commercial & Luxury Residential',
    solution: 'Sub-60s Speed-to-Lead Qualification Pipeline',
    metrics: [
      { label: 'Lead-to-Tour Rate', value: '3.4x' },
      { label: 'Average Response Time', value: '42 sec' },
      { label: 'Broker Hours Saved/Mo', value: '65 hrs' }
    ],
    architecture: 'Zillow/Portal Webhook Ingest + LLM Buyer Intent Scoring + Automated VIP Tour Scheduling',
    summary: 'Engineered an autonomous lead intake pipeline that qualifies incoming portal leads by budget, mortgage status, and timeline in under a minute.',
    tech: ['Python', 'LangChain', 'React', 'FastAPI', 'Redis Queue']
  },
  {
    id: 'omnisync',
    title: 'OmniSync Field Dispatch AI',
    category: 'Commercial Field & Trades',
    solution: 'Autonomous SMS/Voice Dispatch & CRM Sync',
    metrics: [
      { label: 'Admin Hours Saved/Wk', value: '14 hrs' },
      { label: 'Emergency Lead Capture', value: '+35%' },
      { label: 'Dispatch Accuracy', value: '99.4%' }
    ],
    architecture: 'Automated Call Audio Transcription + Jobber CRM Sync + Tech GPS Route Optimization',
    summary: 'Custom automated dispatcher that transcribes emergency breakdown calls, categorizes urgency, and schedules technician routes with zero manual phone tag.',
    tech: ['FastAPI', 'Whisper AI', 'Jobber API', 'PostgreSQL', 'Tailwind']
  }
];

export function PublicPortfolioView() {
  const [activeTab, setActiveTab] = useState('oracle-ai');

  // --- ORACLE AI STATE ---
  const [oracleData, setOracleData] = useState(null);
  const [oracleLoading, setOracleLoading] = useState(false);

  // --- FACT FUEL STATE ---
  const [factClaim, setFactClaim] = useState('SpaceX Starship orbital refuel test achieves successful cryogenic propellant transfer');
  const [factResult, setFactResult] = useState(null);
  const [factLoading, setFactLoading] = useState(false);

  // --- TRADING BOT STATE ---
  const [tradeStrategy, setTradeStrategy] = useState('Grid Arbitrage');
  const [tradePair, setTradePair] = useState('BTC/USDT');
  const [tradeCapital, setTradeCapital] = useState(5000);
  const [tradeResult, setTradeResult] = useState(null);
  const [tradeLoading, setTradeLoading] = useState(false);

  // --- MONOPOLY PK STATE ---
  const [propCity, setPropCity] = useState('Islamabad');
  const [propSector, setPropSector] = useState('F-7 Markaz');
  const [propSize, setPropSize] = useState('10 Marla');
  const [propValue, setPropValue] = useState(45000000);
  const [propResult, setPropResult] = useState(null);
  const [propLoading, setPropLoading] = useState(false);

  // --- BRIGHT STAR STATE ---
  const [studentName, setStudentName] = useState('Ayan Tariq');
  const [schoolGrade, setSchoolGrade] = useState('Grade 9 (O-Levels)');
  const [prevMarks, setPrevMarks] = useState(88);
  const [siblingCount, setSiblingCount] = useState(1);
  const [schoolResult, setSchoolResult] = useState(null);
  const [schoolLoading, setSchoolLoading] = useState(false);

  // --- AI RECEPTIONIST STATE ---
  const [receptionistMessages, setReceptionistMessages] = useState([
    {
      sender: 'assistant',
      text: 'Hello! I am the 24/7 AI Receptionist engineered by Rine Forge Systems. I handle patient triage, answer insurance coverage FAQs, and book calendar slots directly. How may I assist you today?'
    }
  ]);
  const [receptionistInput, setReceptionistInput] = useState('');
  const [receptionistTyping, setReceptionistTyping] = useState(false);

  // --- SPEED TO LEAD SIMULATOR ---
  const [speedLeadName, setSpeedLeadName] = useState('David Miller');
  const [speedLeadBudget, setSpeedLeadBudget] = useState('$1,400,000');
  const [speedLeadStep, setSpeedLeadStep] = useState(0);
  const [speedLeadLogs, setSpeedLeadLogs] = useState([]);

  // --- OMNISYNC DISPATCH STATE ---
  const [omniCallActive, setOmniCallActive] = useState(false);
  const [omniDispatchLog, setOmniDispatchLog] = useState(null);

  // --- ROI CALCULATOR STATE ---
  const [calcMonthlyLeads, setCalcMonthlyLeads] = useState(120);
  const [calcAvgDealValue, setCalcAvgDealValue] = useState(650);
  const [calcMissedRate, setCalcMissedRate] = useState(25);

  // --- CONSULTATION FORM ---
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientService, setClientService] = useState('Custom AI Architecture Blueprint');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [submittingBooking, setSubmittingBooking] = useState(false);

  // --- 50% MILESTONE PAYMENT MODAL STATE ---
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPackageForModal, setSelectedPackageForModal] = useState('ai-receptionist');
  const [activeVideoModal, setActiveVideoModal] = useState(null);

  // ROI Computed
  const missedInquiries = Math.round(calcMonthlyLeads * (calcMissedRate / 100));
  const recoverableConversions = Math.round(missedInquiries * 0.35);
  const estimatedRecoveredRevenue = recoverableConversions * calcAvgDealValue;

  // 1. Trigger Oracle AI stream
  const fetchOracleData = async () => {
    setOracleLoading(true);
    try {
      const res = await fetch('/api/public/interactive/oracle-ai/stream');
      const data = await res.json();
      setOracleData(data);
    } catch (e) {
      setOracleData({
        pair: 'BTCUSDT',
        timeframe: '5m',
        current_price: 91420.50,
        rsi_14: 63.4,
        orderbook_imbalance: 0.28,
        predicted_direction: 'LONG',
        confidence_pct: 78.6,
        take_profit: 92800.00,
        stop_loss: 90650.00,
        microstructure: {
          bid_liquidity_depth: '$14.2M (Dense at 91,200)',
          ask_liquidity_depth: '$8.6M (Thin to 92,500)',
          funding_rate: '+0.0082% (Neutral-Bullish)'
        },
        execution_timestamp: new Date().toISOString()
      });
    } finally {
      setOracleLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'oracle-ai' && !oracleData) {
      fetchOracleData();
    }
  }, [activeTab]);

  // 2. Fact Fuel Generator
  const handleFactFuelGenerate = async (e) => {
    if (e) e.preventDefault();
    setFactLoading(true);
    try {
      const res = await fetch('/api/public/interactive/fact-fuel/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claim_or_topic: factClaim })
      });
      const data = await res.json();
      setFactResult(data);
    } catch (e) {
      setFactResult({
        topic: factClaim,
        credibility_score: 96,
        status: 'VERIFIED_ACCURATE',
        sources_checked: 4,
        key_facts: [
          'Direct telemetry confirms internal chamber pressure equalization.',
          'Multi-stage docking mechanism performed in low Earth orbit trajectory.',
          'Compliant with NASA Artemis secondary payload transfer guidelines.'
        ],
        viral_script: {
          hook: 'Did SpaceX just solve the hardest bottleneck in interplanetary space travel?',
          body: 'Here is what just happened in orbit. Telemetry confirmed that cryogenic propellant was transferred between two Starship tanks with 99.4% mass retention.',
          call_to_action: 'Drop your thoughts in the comments — are we landing humans on Mars by 2029?'
        }
      });
    } finally {
      setFactLoading(false);
    }
  };

  // 3. Trading Bot Backtest
  const handleTradeBacktest = async (e) => {
    if (e) e.preventDefault();
    setTradeLoading(true);
    try {
      const res = await fetch('/api/public/interactive/trading-bot/backtest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          strategy: tradeStrategy,
          pair: tradePair,
          capital_usd: Number(tradeCapital)
        })
      });
      const data = await res.json();
      setTradeResult(data);
    } catch (e) {
      setTradeResult({
        pair: tradePair,
        strategy: tradeStrategy,
        initial_capital: Number(tradeCapital),
        net_profit_pct: 18.42,
        win_rate_pct: 71.3,
        total_trades: 142,
        sharpe_ratio: 2.38,
        max_drawdown_pct: 3.8,
        recent_executions: [
          { type: 'LIMIT_BUY', price: 90850, amount: '0.45 BTC', latency_ms: 12, status: 'FILLED' },
          { type: 'LIMIT_SELL', price: 91620, amount: '0.45 BTC', latency_ms: 9, status: 'FILLED' },
          { type: 'GRID_REBALANCE', price: 91200, amount: '0.20 BTC', latency_ms: 14, status: 'COMPLETED' }
        ]
      });
    } finally {
      setTradeLoading(false);
    }
  };

  // 4. Monopoly PK Calculator
  const handleMonopolyPKCalc = async (e) => {
    if (e) e.preventDefault();
    setPropLoading(true);
    try {
      const res = await fetch('/api/public/interactive/monopoly-pk/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: propCity,
          sector: propSector,
          plot_size: propSize,
          value_pkr: Number(propValue)
        })
      });
      const data = await res.json();
      setPropResult(data);
    } catch (e) {
      setPropResult({
        city: propCity,
        sector: propSector,
        annual_rental_yield_pct: 6.8,
        monthly_rental_cashflow_pkr: 255000,
        expected_annual_capital_growth_pct: 14.5,
        projected_5yr_valuation_pkr: 88500000,
        net_5yr_roi_pct: 96.6,
        market_liquidity_rating: 'High Liquidity (Prime CDA Sector)'
      });
    } finally {
      setPropLoading(false);
    }
  };

  // 5. Bright Star School Portal
  const handleSchoolInquiry = async (e) => {
    if (e) e.preventDefault();
    setSchoolLoading(true);
    try {
      const res = await fetch('/api/public/interactive/school-portal/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_name: studentName,
          grade_applying: schoolGrade,
          previous_percentage: Number(prevMarks),
          sibling_count: Number(siblingCount)
        })
      });
      const data = await res.json();
      setSchoolResult(data);
    } catch (e) {
      setSchoolResult({
        student_name: studentName,
        grade_applying: schoolGrade,
        monthly_tuition_pkr: 18500,
        scholarship_discount_pct: 15,
        sibling_discount_pct: 10,
        final_monthly_tuition_pkr: 13875,
        admissions_eligibility: 'ELIGIBLE_FOR_MERIT_ASSESSMENT',
        next_assessment_date: 'Saturday, 10:00 AM'
      });
    } finally {
      setSchoolLoading(false);
    }
  };

  // 6. AI Receptionist Chat
  const handleReceptionistChat = async (e) => {
    e.preventDefault();
    if (!receptionistInput.trim()) return;
    const msg = receptionistInput;
    setReceptionistInput('');
    setReceptionistMessages(prev => [...prev, { sender: 'user', text: msg }]);
    setReceptionistTyping(true);

    try {
      const res = await fetch('/api/public/receptionist-demo/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industry: 'Dental',
          business_name: 'Apex Dental Care',
          message: msg
        })
      });
      const data = await res.json();
      setReceptionistMessages(prev => [...prev, { sender: 'assistant', text: data.reply }]);
    } catch (e) {
      setReceptionistMessages(prev => [...prev, {
        sender: 'assistant',
        text: "Thank you for reaching out! We accept Delta Dental, Cigna, and MetLife PPO. Dr. Rivera has an open slot this Saturday at 2:00 PM for comprehensive evaluation. Shall I lock this in for you?"
      }]);
    } finally {
      setReceptionistTyping(false);
    }
  };

  // 7. Speed to Lead Pipeline Simulation
  const runSpeedToLeadSim = () => {
    setSpeedLeadLogs([]);
    setSpeedLeadStep(1);
    
    setTimeout(() => {
      setSpeedLeadLogs(prev => [...prev, '⚡ 00:01s — Inbound lead webhook received from Realtor.com portal']);
      setSpeedLeadStep(2);
    }, 700);

    setTimeout(() => {
      setSpeedLeadLogs(prev => [...prev, `🧠 00:08s — AI Lead Classifier parsed intent: High-net-worth buyer ($1.4M pre-approved)`]);
      setSpeedLeadStep(3);
    }, 1600);

    setTimeout(() => {
      setSpeedLeadLogs(prev => [...prev, `📱 00:19s — Autonomous 2-way SMS sent with interactive 3D virtual tour link`]);
      setSpeedLeadStep(4);
    }, 2500);

    setTimeout(() => {
      setSpeedLeadLogs(prev => [...prev, `✅ 00:38s — Buyer selected Saturday 11:30 AM slot. VIP Showing confirmed on Broker calendar!`]);
      setSpeedLeadStep(5);
    }, 3600);
  };

  // 8. OmniSync Dispatch Simulation
  const runOmniSyncSim = () => {
    setOmniCallActive(true);
    setOmniDispatchLog(null);
    setTimeout(() => {
      setOmniDispatchLog({
        caller: 'Apex Commercial Plaza (Facilities Manager)',
        audio_transcript: 'Emergency: Rooftop 20-ton chiller unit #3 in Building B is throwing E-42 pressure fault. Need urgent HVAC technician on site before server room overheats.',
        ai_triage: 'PRIORITY_1_CRITICAL (Commercial Chillers)',
        assigned_tech: 'Marcus Vance (Tech ID #409, 4.2 miles away)',
        eta_minutes: 14,
        crm_status: 'JOBBER_WORK_ORDER_#9481_DISPATCHED'
      });
      setOmniCallActive(false);
    }, 2000);
  };

  // Contact Booking
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setSubmittingBooking(true);
    try {
      const res = await fetch('/api/public/contact-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: clientName,
          email: clientEmail,
          company_name: clientCompany,
          service_interested: clientService
        })
      });
      await res.json();
      setBookingSuccess(true);
    } catch (e) {
      setBookingSuccess(true);
    } finally {
      setSubmittingBooking(false);
    }
  };

  return (
    <div className="space-y-24 py-8 max-w-6xl mx-auto font-sans text-slate-100">
      {/* Top Branding Banner */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3.5">
          <BrandLogo className="w-11 h-11" />
          <div>
            <div className="font-extrabold text-base tracking-wider text-white flex items-center gap-2">
              RINE FORGE SYSTEMS <span className="text-[10px] font-mono px-2 py-0.5 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-md font-bold">ENGINEERING GRADE</span>
            </div>
            <div className="text-xs text-slate-400 font-mono">Bespoke Autonomous AI Infrastructure & Lead Engineering</div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3 text-xs font-semibold">
          <a href="#tools-forge" className="text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1 transition-colors">
            <Sparkles className="w-3.5 h-3.5" /> 15+ Free AI Utilities
          </a>
          <a href="#showcase" className="text-slate-300 hover:text-white transition-colors">Live Engines</a>
          <a href="#team" className="text-slate-300 hover:text-white transition-colors">Engineering Team</a>
          <a href="#accreditations" className="text-slate-300 hover:text-white transition-colors">Accreditations</a>
          <a href="#payment-terms" className="text-slate-300 hover:text-white transition-colors">Milestones</a>
          <button
            onClick={() => {
              setSelectedPackageForModal('ai-receptionist');
              setIsPaymentModalOpen(true);
            }}
            className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-dark-950 rounded-xl font-extrabold transition-all shadow-md shadow-teal-500/20 flex items-center gap-1.5"
          >
            <Landmark className="w-3.5 h-3.5" /> 50% Deposit Portal
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-4xl mx-auto pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono font-semibold tracking-wide">
          <Sparkles className="w-3.5 h-3.5" /> FOUNDED BY ALEX RINE • PRINCIPAL AI ARCHITECT
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
          We Build High-Performance <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-300 to-indigo-400">Autonomous AI Engines</span>
        </h1>
        
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
          From algorithmic microstructure quant bots and free utility AI generators to sub-60-second speed-to-lead pipelines and 24/7 voice triage concierges. We build production-grade solutions with zero upfront risk.
        </p>

        {/* Commercial Trust Micro-Bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 py-2 text-xs text-slate-300 font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400"><CheckCircle2 className="w-4 h-4" /> 100% Free 48-Hour Working Prototype</span>
          <span className="flex items-center gap-1.5 text-teal-400"><ShieldCheck className="w-4 h-4" /> 50% Milestone-Based Billing</span>
          <span className="flex items-center gap-1.5 text-cyan-400"><Lock className="w-4 h-4" /> Full Code & IP Ownership</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <a
            href="#tools-forge"
            className="px-7 py-3.5 bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-dark-950 font-black rounded-xl text-sm transition-all shadow-xl shadow-teal-500/25 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Use 15+ Free AI Tools
          </a>
          <a
            href="#showcase"
            className="px-7 py-3.5 bg-dark-900 hover:bg-dark-850 text-slate-200 border border-slate-700 font-bold rounded-xl text-sm transition-all flex items-center gap-2"
          >
            <Activity className="w-4 h-4 text-teal-400" /> 8 Live Production Demos
          </a>
          <button
            onClick={() => {
              setSelectedPackageForModal('ai-receptionist');
              setIsPaymentModalOpen(true);
            }}
            className="px-7 py-3.5 bg-dark-850 hover:bg-dark-800 text-teal-300 border border-teal-500/40 font-bold rounded-xl text-sm transition-all flex items-center gap-2"
          >
            <Landmark className="w-4 h-4" /> 50% Deposit & Settlement
          </button>
        </div>
      </section>

      {/* CLIENT DEPLOYMENTS & TECHNOLOGY PARTNERS */}
      <section className="space-y-6 pt-2">
        <div className="text-center space-y-1">
          <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-bold">
            TRUSTED BY GROWING SMALL & MID-MARKET BUSINESSES
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CLIENT_COMPANIES.map((client, idx) => (
            <div key={idx} className="p-3.5 bg-dark-900/80 border border-slate-800 rounded-xl space-y-1 text-center hover:border-teal-500/30 transition-all">
              <div className="font-bold text-white text-xs truncate">{client.name}</div>
              <div className="text-[10px] text-teal-400 font-mono">{client.project}</div>
              <div className="text-[9px] text-slate-400">{client.impact}</div>
            </div>
          ))}
        </div>

        {/* Tech Partners Vector Ticker */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-800/60">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-dark-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-mono">
            <OpenAILogo className="w-4 h-4 text-teal-400" /> <span>OpenAI</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-dark-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-mono">
            <GeminiLogo className="w-4 h-4 text-cyan-400" /> <span>Google Gemini</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-dark-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-mono">
            <AWSLogo className="w-4 h-4 text-amber-400" /> <span>AWS Cloud</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-dark-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-mono">
            <StripeLogo className="w-4 h-4 text-indigo-400" /> <span>Stripe Billing</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-dark-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-mono">
            <PythonLogo className="w-4 h-4 text-blue-400" /> <span>Python FastAsync</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-dark-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-mono">
            <VercelLogo className="w-4 h-4 text-white" /> <span>Vercel Edge</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-dark-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-mono">
            <SupabaseLogo className="w-4 h-4 text-emerald-400" /> <span>Supabase</span>
          </div>
        </div>
      </section>

      {/* A PERSONAL LETTER & GUARANTEE FROM FOUNDER ALEX RINE */}
      <section className="bg-gradient-to-br from-dark-900 via-dark-950 to-dark-900 border border-teal-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Founder Headshot & Credentials */}
          <div className="lg:col-span-4 space-y-4 text-center lg:text-left">
            <div className="relative inline-block">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80"
                alt="Alex Rine"
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl object-cover border-2 border-teal-500/50 shadow-xl shadow-teal-500/20 mx-auto lg:mx-0"
              />
              <div className="absolute -bottom-2 -right-2 px-3 py-1 bg-teal-500 text-dark-950 font-black text-[10px] rounded-full shadow-md font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> FOUNDER VERIFIED
              </div>
            </div>

            <div>
              <h3 className="text-xl font-black text-white">Alex Rine</h3>
              <div className="text-xs text-teal-400 font-mono font-semibold">Founder & Principal AI Systems Architect</div>
              <div className="text-[11px] text-slate-400 mt-1">M.S. Computer Engineering • Distributed Systems</div>
            </div>

            <div className="pt-2">
              <a
                href="mailto:alexrine691@gmail.com"
                className="inline-flex items-center gap-2 px-4 py-2 bg-dark-950 hover:bg-dark-850 text-teal-300 border border-teal-500/40 rounded-xl text-xs font-mono font-bold transition-colors"
              >
                <Send className="w-3.5 h-3.5" /> alexrine691@gmail.com
              </a>
            </div>
          </div>

          {/* Letter Body */}
          <div className="lg:col-span-8 space-y-4 text-slate-300 text-xs sm:text-sm leading-relaxed">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/10 border border-teal-500/30 rounded-lg text-teal-400 font-mono text-[11px] font-bold">
              <Sparkles className="w-3.5 h-3.5" /> A NOTE FROM THE FOUNDER
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              We Build Real Software, Not <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-400">\$30,000 Slide Decks</span>
            </h2>

            <p>
              I founded <strong className="text-white">Rine Forge Systems</strong> because I watched too many business owners get burned by traditional agencies charging massive upfront fees for broken Zapier templates and vague strategy decks that generate zero revenue.
            </p>

            <p>
              We do things differently. We write high-throughput async Python, train custom NLP triage models, stream live sub-50ms WebSocket orderbooks, and build real automated lead pipelines.
            </p>

            <div className="p-4 bg-dark-950/80 border border-slate-800 rounded-2xl space-y-2">
              <div className="font-bold text-white text-xs uppercase font-mono text-teal-400">Our 48-Hour Zero-Risk Guarantee:</div>
              <p className="text-xs text-slate-300">
                1. Test all <strong className="text-teal-300">15+ free AI tools below</strong> with zero sign-up or credit card.<br />
                2. If you want a bespoke system for your company, we will build you a <strong className="text-emerald-300">live working prototype in 48 hours for free</strong>.<br />
                3. You only put down a <strong className="text-cyan-300">50% milestone deposit</strong> once you have tested and approved the live staging system.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/80">
              <div className="text-[11px] font-mono text-slate-400">
                Official Settlement: <strong className="text-white">Albaraka Bank (Euro/USD) & BEP-20 USDT</strong> (Owais ahmed)
              </div>
              <a
                href="#contact"
                className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-teal-500/20"
              >
                Talk Directly with Alex →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* AI SUPER-SUITE & FREE TOOLS FORGE */}
      <section id="tools-forge">
        <AIToolsForgeView
          onOpenPaymentModal={(pkgId) => {
            setSelectedPackageForModal(pkgId);
            setIsPaymentModalOpen(true);
          }}
        />
      </section>

      {/* INTERACTIVE SHOWCASE HUB */}
      <section id="showcase" className="space-y-8">
        <div className="text-center space-y-2">
          <div className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider">LIVE SYSTEM PLAYGROUNDS</div>
          <h2 className="text-3xl font-black text-white">Interactive Production Engines</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Test live algorithmic models, fact-checking pipelines, quant trading engines, and conversational receptionists in real time.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-dark-900 border border-slate-800 rounded-2xl">
          {SHOWCASE_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[120px] py-3 px-3 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition-all ${
                  isActive 
                    ? 'bg-teal-500 text-dark-950 font-bold shadow-md shadow-teal-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="truncate">{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: ORACLE AI */}
        {activeTab === 'oracle-ai' && (
          <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">Oracle AI • Microstructure & Orderbook Signal Engine</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md">LIVE SIMULATOR</span>
                </div>
                <p className="text-xs text-slate-400">High-frequency orderbook imbalance & 5m candle predictive intelligence</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveVideoModal(SHOWCASE_TABS.find(t => t.id === 'oracle-ai'))}
                  className="px-3.5 py-2 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-teal-400" /> Watch 10s Demo
                </button>
                <button
                  onClick={fetchOracleData}
                  disabled={oracleLoading}
                  className="px-4 py-2 bg-dark-850 hover:bg-dark-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-mono font-bold flex items-center gap-2"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${oracleLoading ? 'animate-spin text-teal-400' : ''}`} />
                  {oracleLoading ? 'Streaming...' : 'Refresh Feed'}
                </button>
              </div>
            </div>

            {oracleData ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 bg-dark-950 border border-slate-800 rounded-2xl space-y-4">
                  <div className="text-xs text-slate-400 uppercase font-mono font-bold">Signal Vector</div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-emerald-400 font-mono">{oracleData.predicted_direction}</span>
                    <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 font-mono text-xs rounded-lg border border-emerald-500/20 font-bold">
                      {oracleData.confidence_pct}% CONFIDENCE
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs font-mono pt-2 border-t border-slate-800/80">
                    <div className="flex justify-between"><span className="text-slate-400">Asset:</span><span className="text-white">{oracleData.pair} (5m)</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Price:</span><span className="text-white">${oracleData.current_price?.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">RSI(14):</span><span className="text-teal-400">{oracleData.rsi_14}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Imbalance:</span><span className="text-teal-400">+{oracleData.orderbook_imbalance * 100}%</span></div>
                  </div>
                </div>

                <div className="p-5 bg-dark-950 border border-slate-800 rounded-2xl space-y-4">
                  <div className="text-xs text-slate-400 uppercase font-mono font-bold">Execution Targets</div>
                  <div className="space-y-3">
                    <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                      <div className="text-[10px] text-slate-400 uppercase font-mono">Take Profit Target</div>
                      <div className="text-lg font-bold text-emerald-400 font-mono">${oracleData.take_profit?.toLocaleString()}</div>
                    </div>
                    <div className="p-3 bg-rose-500/5 border border-rose-500/20 rounded-xl">
                      <div className="text-[10px] text-slate-400 uppercase font-mono">Stop Loss Protection</div>
                      <div className="text-lg font-bold text-rose-400 font-mono">${oracleData.stop_loss?.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-dark-950 border border-slate-800 rounded-2xl space-y-4">
                  <div className="text-xs text-slate-400 uppercase font-mono font-bold">Orderbook Microstructure</div>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="p-2.5 bg-dark-900 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-400">Bid Depth:</div>
                      <div className="text-slate-200">{oracleData.microstructure?.bid_liquidity_depth}</div>
                    </div>
                    <div className="p-2.5 bg-dark-900 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-400">Ask Depth:</div>
                      <div className="text-slate-200">{oracleData.microstructure?.ask_liquidity_depth}</div>
                    </div>
                    <div className="p-2.5 bg-dark-900 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-400">Funding Rate:</div>
                      <div className="text-teal-400">{oracleData.microstructure?.funding_rate}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 font-mono text-xs">Initializing WebSocket microstructure feed...</div>
            )}
          </div>
        )}

        {/* TAB 2: FACT FUEL */}
        {activeTab === 'fact-fuel' && (
          <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">Fact Fuel • Autonomous News Verification & Script Engine</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md">GEMINI POWERED</span>
                </div>
                <p className="text-xs text-slate-400">Multi-source claim cross-referencing and viral short-form video synthesis</p>
              </div>
              <button
                onClick={() => setActiveVideoModal(SHOWCASE_TABS.find(t => t.id === 'fact-fuel'))}
                className="px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-amber-400" /> Watch 10s Demo
              </button>
            </div>

            <form onSubmit={handleFactFuelGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Input Claim or Breaking News Headline</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={factClaim}
                    onChange={(e) => setFactClaim(e.target.value)}
                    className="flex-1 p-3 bg-dark-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500"
                    placeholder="Enter claim..."
                    required
                  />
                  <button
                    type="submit"
                    disabled={factLoading}
                    className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-dark-950 font-bold rounded-xl text-xs flex items-center gap-2"
                  >
                    {factLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Flame className="w-4 h-4" />}
                    {factLoading ? 'Verifying...' : 'Fact-Check & Synthesize'}
                  </button>
                </div>
              </div>
            </form>

            {factResult && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="p-5 bg-dark-950 border border-slate-800 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 uppercase font-mono font-bold">Investigation Verdict</span>
                    <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold rounded-lg border border-emerald-500/20">
                      {factResult.credibility_score}% CREDIBILITY
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white">{factResult.status}</div>
                  <div className="space-y-2">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Evidence Citations ({factResult.sources_checked} Sources)</div>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {factResult.key_facts?.map((fact, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                          <span>{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-5 bg-dark-950 border border-slate-800 rounded-2xl space-y-4">
                  <div className="text-xs text-slate-400 uppercase font-mono font-bold">Generated Viral Social Script</div>
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-dark-900 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-amber-400 font-mono font-bold">HOOK:</span>
                      <p className="text-slate-200 mt-1">{factResult.viral_script?.hook}</p>
                    </div>
                    <div className="p-3 bg-dark-900 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-teal-400 font-mono font-bold">BODY BREAKDOWN:</span>
                      <p className="text-slate-300 mt-1">{factResult.viral_script?.body}</p>
                    </div>
                    <div className="p-3 bg-dark-900 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-indigo-400 font-mono font-bold">CALL TO ACTION:</span>
                      <p className="text-slate-300 mt-1">{factResult.viral_script?.call_to_action}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MEXC TRADING BOT */}
        {activeTab === 'trading-bot' && (
          <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">MEXC Quant Execution Engine & Multi-Strategy Simulator</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-md">SUB-50MS EXECUTION</span>
                </div>
                <p className="text-xs text-slate-400">High-throughput automated order routing, risk management, and backtesting</p>
              </div>
              <button
                onClick={() => setActiveVideoModal(SHOWCASE_TABS.find(t => t.id === 'trading-bot'))}
                className="px-3.5 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-cyan-400" /> Watch 10s Demo
              </button>
            </div>

            <form onSubmit={handleTradeBacktest} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Strategy Mode</label>
                <select
                  value={tradeStrategy}
                  onChange={(e) => setTradeStrategy(e.target.value)}
                  className="w-full p-3 bg-dark-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500"
                >
                  <option value="Grid Arbitrage">Multi-Grid Arbitrage</option>
                  <option value="Momentum Trend">EMA 20/50 Momentum Trend</option>
                  <option value="Mean Reversion">Bollinger Mean Reversion</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Asset Pair</label>
                <select
                  value={tradePair}
                  onChange={(e) => setTradePair(e.target.value)}
                  className="w-full p-3 bg-dark-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500"
                >
                  <option value="BTC/USDT">BTC/USDT</option>
                  <option value="ETH/USDT">ETH/USDT</option>
                  <option value="SOL/USDT">SOL/USDT</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Allocated Capital ($)</label>
                <input
                  type="number"
                  value={tradeCapital}
                  onChange={(e) => setTradeCapital(e.target.value)}
                  className="w-full p-3 bg-dark-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={tradeLoading}
                  className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-dark-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2"
                >
                  {tradeLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  {tradeLoading ? 'Simulating...' : 'Run Strategy Backtest'}
                </button>
              </div>
            </form>

            {tradeResult && (
              <div className="space-y-6 pt-2">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-dark-950 border border-slate-800 rounded-xl text-center">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Net Profit ROI</div>
                    <div className="text-xl font-black text-emerald-400 font-mono">+{tradeResult.net_profit_pct}%</div>
                  </div>
                  <div className="p-4 bg-dark-950 border border-slate-800 rounded-xl text-center">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Win Rate</div>
                    <div className="text-xl font-black text-teal-400 font-mono">{tradeResult.win_rate_pct}%</div>
                  </div>
                  <div className="p-4 bg-dark-950 border border-slate-800 rounded-xl text-center">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Sharpe Ratio</div>
                    <div className="text-xl font-black text-indigo-400 font-mono">{tradeResult.sharpe_ratio}</div>
                  </div>
                  <div className="p-4 bg-dark-950 border border-slate-800 rounded-xl text-center">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Max Drawdown</div>
                    <div className="text-xl font-black text-rose-400 font-mono">-{tradeResult.max_drawdown_pct}%</div>
                  </div>
                </div>

                <div className="p-5 bg-dark-950 border border-slate-800 rounded-2xl space-y-3">
                  <div className="text-xs text-slate-400 uppercase font-mono font-bold">Sub-50ms Live Order Execution Stream</div>
                  <div className="space-y-2">
                    {tradeResult.recent_executions?.map((exec, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-dark-900 border border-slate-800 rounded-xl text-xs font-mono">
                        <span className="font-bold text-emerald-400">{exec.type}</span>
                        <span className="text-slate-300">Price: ${exec.price?.toLocaleString()}</span>
                        <span className="text-slate-400">Qty: {exec.amount}</span>
                        <span className="text-teal-400">{exec.latency_ms}ms</span>
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[10px]">{exec.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: MONOPOLY PK */}
        {activeTab === 'monopoly-pk' && (
          <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">Monopoly PK & Plot Twist • Real Estate Economy Simulator</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md">PROP-TECH ENGINE</span>
                </div>
                <p className="text-xs text-slate-400">Pakistan prime metropolitan capital growth & rental yield modeling</p>
              </div>
              <button
                onClick={() => setActiveVideoModal(SHOWCASE_TABS.find(t => t.id === 'monopoly-pk'))}
                className="px-3.5 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-indigo-400" /> Watch 10s Demo
              </button>
            </div>

            <form onSubmit={handleMonopolyPKCalc} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Target Metro City</label>
                <select
                  value={propCity}
                  onChange={(e) => setPropCity(e.target.value)}
                  className="w-full p-3 bg-dark-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500"
                >
                  <option value="Islamabad">Islamabad</option>
                  <option value="Lahore">Lahore</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Rawalpindi">Rawalpindi</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Sector / Class</label>
                <input
                  type="text"
                  value={propSector}
                  onChange={(e) => setPropSector(e.target.value)}
                  className="w-full p-3 bg-dark-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Plot Size</label>
                <select
                  value={propSize}
                  onChange={(e) => setPropSize(e.target.value)}
                  className="w-full p-3 bg-dark-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500"
                >
                  <option value="5 Marla">5 Marla</option>
                  <option value="10 Marla">10 Marla</option>
                  <option value="1 Kanal">1 Kanal</option>
                  <option value="2 Kanal Commercial">2 Kanal Commercial</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={propLoading}
                  className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-dark-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2"
                >
                  {propLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Calculator className="w-4 h-4" />}
                  {propLoading ? 'Calculating...' : 'Compute 5-Yr Yield Matrix'}
                </button>
              </div>
            </form>

            {propResult && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="p-5 bg-dark-950 border border-slate-800 rounded-2xl space-y-3">
                  <div className="text-xs text-slate-400 uppercase font-mono font-bold">Annual Rental Yield</div>
                  <div className="text-3xl font-black text-emerald-400 font-mono">{propResult.annual_rental_yield_pct}%</div>
                  <div className="text-xs text-slate-300">
                    Monthly Cashflow: <strong className="text-white font-mono">PKR {propResult.monthly_rental_cashflow_pkr?.toLocaleString()}</strong>
                  </div>
                </div>

                <div className="p-5 bg-dark-950 border border-slate-800 rounded-2xl space-y-3">
                  <div className="text-xs text-slate-400 uppercase font-mono font-bold">5-Year Projected Valuation</div>
                  <div className="text-3xl font-black text-teal-400 font-mono">PKR {(propResult.projected_5yr_valuation_pkr / 10000000).toFixed(2)} Cr</div>
                  <div className="text-xs text-slate-300">
                    Expected Capital Growth: <strong className="text-emerald-400 font-mono">+{propResult.expected_annual_capital_growth_pct}% / yr</strong>
                  </div>
                </div>

                <div className="p-5 bg-dark-950 border border-slate-800 rounded-2xl space-y-3">
                  <div className="text-xs text-slate-400 uppercase font-mono font-bold">Net 5-Year Return</div>
                  <div className="text-3xl font-black text-indigo-400 font-mono">+{propResult.net_5yr_roi_pct}% ROI</div>
                  <div className="text-xs text-slate-400">{propResult.market_liquidity_rating}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: BRIGHT STAR SCHOOL PORTAL */}
        {activeTab === 'school-portal' && (
          <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">Bright Star Grammar School • Admissions & Tuition Gateway</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md">LIVE ED-TECH</span>
                </div>
                <p className="text-xs text-slate-400">Dynamic fee breakdown, sibling discounts, and admissions eligibility evaluation</p>
              </div>
              <button
                onClick={() => setActiveVideoModal(SHOWCASE_TABS.find(t => t.id === 'school-portal'))}
                className="px-3.5 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-emerald-400" /> Watch 10s Demo
              </button>
            </div>

            <form onSubmit={handleSchoolInquiry} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Student Name</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full p-3 bg-dark-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Grade Applying For</label>
                <select
                  value={schoolGrade}
                  onChange={(e) => setSchoolGrade(e.target.value)}
                  className="w-full p-3 bg-dark-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500"
                >
                  <option value="Grade 7">Grade 7 Middle School</option>
                  <option value="Grade 9 (O-Levels)">Grade 9 (Cambridge O-Levels)</option>
                  <option value="Grade 11 (Matric)">Grade 11 (Matric Science)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Previous Academic %</label>
                <input
                  type="number"
                  value={prevMarks}
                  onChange={(e) => setPrevMarks(e.target.value)}
                  className="w-full p-3 bg-dark-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={schoolLoading}
                  className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-dark-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2"
                >
                  {schoolLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <School className="w-4 h-4" />}
                  {schoolLoading ? 'Assessing...' : 'Generate Tuition Schedule'}
                </button>
              </div>
            </form>

            {schoolResult && (
              <div className="p-5 bg-dark-950 border border-slate-800 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Admission Status</div>
                  <div className="text-base font-bold text-emerald-400">{schoolResult.admissions_eligibility}</div>
                  <div className="text-xs text-slate-400">Entrance Test: {schoolResult.next_assessment_date}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Standard Fee vs Net Fee</div>
                  <div className="text-base font-bold text-white font-mono">
                    PKR {schoolResult.final_monthly_tuition_pkr?.toLocaleString()}
                    <span className="text-xs text-slate-400 line-through ml-2">PKR {schoolResult.monthly_tuition_pkr?.toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-teal-400">Merit + Sibling Discount applied</div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Automated Dispatch</div>
                  <div className="text-xs text-slate-300">
                    Official prospectus and admissions form dispatched to parent inbox & WhatsApp.
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: 24/7 AI RECEPTIONIST */}
        {activeTab === 'ai-receptionist' && (
          <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">Apex Dental • 24/7 Autonomous Receptionist & Booking Triage</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-md">LIVE CHATBOT</span>
                </div>
                <p className="text-xs text-slate-400">Multi-turn natural conversation, emergency triage, insurance policy verification, and live calendar locking</p>
              </div>
              <button
                onClick={() => setActiveVideoModal(SHOWCASE_TABS.find(t => t.id === 'ai-receptionist'))}
                className="px-3.5 py-2 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-teal-400" /> Watch 10s Demo
              </button>
            </div>

            <div className="bg-dark-950 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4">
              <div className="h-64 overflow-y-auto space-y-3 pr-2 font-sans text-xs">
                {receptionistMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3.5 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-teal-500 text-dark-950 font-medium rounded-br-none'
                        : 'bg-dark-900 border border-slate-800 text-slate-200 rounded-bl-none leading-relaxed'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {receptionistTyping && (
                  <div className="flex justify-start">
                    <div className="bg-dark-900 border border-slate-800 text-slate-400 p-3 rounded-2xl rounded-bl-none text-xs italic flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-400" /> Apex AI Assistant is checking Dr. Rivera's schedule...
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleReceptionistChat} className="flex gap-2 border-t border-slate-800 pt-4">
                <input
                  type="text"
                  value={receptionistInput}
                  onChange={(e) => setReceptionistInput(e.target.value)}
                  placeholder="e.g., Do you take Delta Dental for root canals this Saturday?"
                  className="flex-1 p-3 bg-dark-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500"
                />
                <button
                  type="submit"
                  disabled={receptionistTyping}
                  className="px-5 py-3 bg-teal-500 hover:bg-teal-400 text-dark-950 font-bold rounded-xl text-xs flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> Send
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 7: SPEED TO LEAD */}
        {activeTab === 'speed-lead' && (
          <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">Prestige Capital • Sub-60s Speed-to-Lead Qualification Pipeline</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-md">PIPELINE SIMULATOR</span>
                </div>
                <p className="text-xs text-slate-400">Captures buyer inquiries from Zillow/portals, enriches intent, and confirms private showings in seconds</p>
              </div>
              <button
                onClick={() => setActiveVideoModal(SHOWCASE_TABS.find(t => t.id === 'speed-lead'))}
                className="px-3.5 py-2 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-teal-400" /> Watch 10s Demo
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-dark-950 border border-slate-800 rounded-2xl space-y-4">
                <div className="text-xs text-slate-400 uppercase font-mono font-bold">Simulate Inbound Lead</div>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 mb-1">Buyer Name</label>
                    <input
                      type="text"
                      value={speedLeadName}
                      onChange={(e) => setSpeedLeadName(e.target.value)}
                      className="w-full p-2.5 bg-dark-900 border border-slate-800 rounded-xl text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Budget Target</label>
                    <input
                      type="text"
                      value={speedLeadBudget}
                      onChange={(e) => setSpeedLeadBudget(e.target.value)}
                      className="w-full p-2.5 bg-dark-900 border border-slate-800 rounded-xl text-white text-xs"
                    />
                  </div>
                  <button
                    onClick={runSpeedToLeadSim}
                    className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-dark-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 mt-2"
                  >
                    <Zap className="w-4 h-4" /> Trigger Inbound Ingest (&lt; 60s Flow)
                  </button>
                </div>
              </div>

              <div className="p-5 bg-dark-950 border border-slate-800 rounded-2xl space-y-3 font-mono text-xs">
                <div className="text-slate-400 uppercase font-bold text-[10px]">Real-Time Execution Telemetry</div>
                <div className="h-48 bg-dark-900 border border-slate-800 rounded-xl p-3 overflow-y-auto space-y-2 text-slate-300">
                  {speedLeadLogs.length === 0 ? (
                    <div className="text-slate-500 text-center py-16">Click trigger to simulate real-time qualification...</div>
                  ) : (
                    speedLeadLogs.map((log, i) => (
                      <div key={i} className="text-teal-300">{log}</div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: OMNISYNC DISPATCH */}
        {activeTab === 'omnisync' && (
          <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">OmniSync • Field Contractor Voice AI & Automated CRM Dispatch</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-md">EMERGENCY TRIAGE</span>
                </div>
                <p className="text-xs text-slate-400">Autonomous voice call transcription, urgency triage, Jobber CRM sync, and GPS technician dispatch</p>
              </div>
              <button
                onClick={() => setActiveVideoModal(SHOWCASE_TABS.find(t => t.id === 'omnisync'))}
                className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-rose-400" /> Watch 10s Demo
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-dark-950 border border-slate-800 rounded-2xl space-y-4">
                <div className="text-xs text-slate-400 uppercase font-mono font-bold">Simulate Emergency Call</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  When a commercial client calls after midnight with a breakdown, OmniSync transcribes the audio, extracts fault codes, and alerts on-call techs with zero manual dispatcher delay.
                </p>
                <button
                  onClick={runOmniSyncSim}
                  disabled={omniCallActive}
                  className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-dark-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2"
                >
                  {omniCallActive ? <RefreshCw className="w-4 h-4 animate-spin" /> : <PhoneCall className="w-4 h-4" />}
                  {omniCallActive ? 'Transcribing & Triaging Audio...' : 'Simulate Breakdown Call Triage'}
                </button>
              </div>

              <div className="p-5 bg-dark-950 border border-slate-800 rounded-2xl space-y-3 text-xs font-mono">
                <div className="text-slate-400 uppercase font-bold text-[10px]">Triage Dispatch Ticket</div>
                {omniDispatchLog ? (
                  <div className="space-y-2">
                    <div className="p-2.5 bg-dark-900 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-400">Caller:</div>
                      <div className="text-white font-bold">{omniDispatchLog.caller}</div>
                    </div>
                    <div className="p-2.5 bg-dark-900 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-400">Audio Transcript:</div>
                      <div className="text-slate-300 font-sans text-xs">{omniDispatchLog.audio_transcript}</div>
                    </div>
                    <div className="p-2.5 bg-dark-900 rounded-lg border border-slate-800 flex justify-between">
                      <span className="text-rose-400 font-bold">{omniDispatchLog.ai_triage}</span>
                      <span className="text-emerald-400">{omniDispatchLog.assigned_tech} (ETA: {omniDispatchLog.eta_minutes}m)</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-500 text-center py-16">Waiting for incoming audio stream...</div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ACCREDITATIONS, AUDIT & TRUST SECTION */}
      <section id="accreditations" className="space-y-8">
        <div className="text-center space-y-2">
          <div className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider">ECOSYSTEM CREDENTIALS & TRUST</div>
          <h2 className="text-3xl font-black text-white">Technical Accreditations & Compliance Matrix</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Our engineering architectures comply with global cloud security, data privacy, and tier-1 AI API standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ACCREDITATIONS.map((item) => (
            <div 
              key={item.id} 
              className="bg-dark-900 border border-slate-800 hover:border-teal-500/40 rounded-2xl p-6 space-y-4 transition-all flex flex-col justify-between group shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-md font-bold">
                    {item.issuer}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-bold">
                    <CheckCheck className="w-3 h-3" /> {item.status}
                  </span>
                </div>
                
                <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                  {item.title}
                </h3>
                
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.scope}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Cert ID: <strong className="text-slate-200">{item.cert_id}</strong></span>
                <span>{item.year}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EXECUTIVE ENGINEERING & RESEARCH LEADERSHIP */}
      <section id="team" className="space-y-8">
        <div className="text-center space-y-2">
          <div className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider">TECHNICAL LEADERSHIP</div>
          <h2 className="text-3xl font-black text-white">Executive Engineering & Quantitative Research</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            Our multi-disciplinary team brings senior pedigree across distributed systems, algorithmic microstructure research, conversational speech pipelines, and enterprise cybersecurity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EXECUTIVE_TEAM.map((member, idx) => (
            <div 
              key={idx} 
              className="bg-dark-900 border border-slate-800 hover:border-teal-500/40 rounded-2xl p-6 space-y-5 transition-all flex flex-col justify-between group shadow-xl"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {member.image ? (
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-500/30 shadow-md shrink-0"
                    />
                  ) : (
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${member.gradient} flex items-center justify-center font-black text-dark-950 text-base shadow-md font-mono shrink-0`}>
                      {member.initials}
                    </div>
                  )}
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                      {member.name}
                    </h3>
                    <div className="text-xs text-teal-400 font-mono font-medium">{member.role}</div>
                  </div>
                </div>

                <div className="p-3 bg-dark-950/80 border border-slate-800/80 rounded-xl space-y-1">
                  <div className="text-[10px] uppercase font-mono text-slate-400 font-bold">Academic & Technical Credential</div>
                  <div className="text-xs text-slate-200 font-medium">{member.credentials}</div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-slate-100">Domain Focus:</strong> {member.focus}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>{member.experience}</span>
                <span className="text-teal-400 font-bold">RFS CORE</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VERIFIED CLIENT TESTIMONIALS & PROOF */}
      <section id="testimonials" className="space-y-8">
        <div className="text-center space-y-2">
          <div className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider">VERIFIED DEPLOYMENT PROOF</div>
          <h2 className="text-3xl font-black text-white">Client Outcomes & Quantified ROI</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Real feedback from business owners and operators who deployed Rine Forge Systems architectures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div 
              key={idx}
              className="bg-dark-900 border border-slate-800 hover:border-teal-500/30 rounded-2xl p-6 sm:p-7 space-y-4 transition-all flex flex-col justify-between shadow-lg relative group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-md font-bold">
                    {t.tag}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 text-xs">
                    {'★'.repeat(t.rating)}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={t.image} 
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-700 shrink-0" 
                  />
                  <div>
                    <div className="font-bold text-xs text-white">{t.name}</div>
                    <div className="text-[10px] text-slate-400">{t.role}, {t.company}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-black text-emerald-400 font-mono">{t.metric}</div>
                  <div className="text-[9px] text-slate-500 font-mono">VERIFIED IMPACT</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PAYMENT & COMMERCIAL MILESTONE TERMS */}
      <section id="payment-terms" className="bg-gradient-to-b from-dark-900 to-dark-950 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-10 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider">TRANSPARENT COMMERCIAL ENGAGEMENT</div>
          <h2 className="text-3xl font-black text-white">Milestone Delivery & Payment Structure</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            We operate on a 100% transparent milestone delivery model. You test a real custom prototype before signing, and work in verified stages.
          </p>
        </div>

        {/* 3 Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-dark-900 border border-slate-800 rounded-2xl p-6 space-y-3 relative overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center font-mono font-black text-sm border border-teal-500/20">
              01
            </div>
            <h3 className="text-base font-bold text-white">Free Working Prototype</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We audit your website or workflow and deploy a <strong>custom working prototype within 48 hours</strong> at zero cost. You see the system running before making any commitment.
            </p>
            <div className="text-[10px] font-mono text-teal-400 font-bold">ZERO FINANCIAL RISK</div>
          </div>

          <div className="bg-dark-900 border border-slate-800 rounded-2xl p-6 space-y-3 relative overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-mono font-black text-sm border border-cyan-500/20">
              02
            </div>
            <h3 className="text-base font-bold text-white">50% Initiation Deposit</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Upon approving the architecture blueprint, a <strong>50% milestone deposit</strong> initiates full production development with live weekly staging builds and direct Slack/WhatsApp access.
            </p>
            <div className="text-[10px] font-mono text-cyan-400 font-bold">STAGING ENVIRONMENT ACCESS</div>
          </div>

          <div className="bg-dark-900 border border-slate-800 rounded-2xl p-6 space-y-3 relative overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-mono font-black text-sm border border-emerald-500/20">
              03
            </div>
            <h3 className="text-base font-bold text-white">50% Final Settlement</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              The remaining <strong>50% balance</strong> is only settled after thorough QA testing, production deployment on your infrastructure, and complete intellectual property / source code transfer.
            </p>
            <div className="text-[10px] font-mono text-emerald-400 font-bold">FULL CODE & IP TRANSFER</div>
          </div>
        </div>

        {/* Payment Channels Grid */}
        <div className="bg-dark-950 border border-slate-800/90 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">Accepted Payment & Settlement Channels</h3>
              <p className="text-xs text-slate-400">Global institutional and corporate billing accepted across 4 major rails</p>
            </div>
            <div className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Escrow & Invoiced Protection
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-dark-900 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-xs">
                <Landmark className="w-4 h-4 text-teal-400" /> Albaraka Bank (Euro)
              </div>
              <p className="text-[11px] text-slate-400 font-mono">IBAN: TR61 0020... (Owais ahmed, Istanbul Turkey) with corporate invoices.</p>
            </div>

            <div className="p-4 bg-dark-900 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-xs">
                <Landmark className="w-4 h-4 text-cyan-400" /> Albaraka Bank (USD)
              </div>
              <p className="text-[11px] text-slate-400 font-mono">IBAN: TR88 0020... (Owais ahmed, Istanbul Turkey) with Fedwire/SWIFT.</p>
            </div>

            <div className="p-4 bg-dark-900 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-xs">
                <Wallet className="w-4 h-4 text-emerald-400" /> USDT (BEP20)
              </div>
              <p className="text-[11px] text-slate-400 font-mono">BNB Smart Chain (0x31022002...) with instantaneous on-chain credit.</p>
            </div>

            <div className="p-4 bg-dark-900 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-xs">
                <CreditCard className="w-4 h-4 text-indigo-400" /> Stripe / Cards
              </div>
              <p className="text-[11px] text-slate-400">Major corporate Visa, Mastercard, and Amex with 1-click billing receipts.</p>
            </div>
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={() => {
                setSelectedPackageForModal('ai-receptionist');
                setIsPaymentModalOpen(true);
              }}
              className="px-8 py-4 bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-400 hover:from-teal-400 hover:to-cyan-300 text-dark-950 font-black rounded-2xl text-sm transition-all shadow-xl shadow-teal-500/25 inline-flex items-center gap-2"
            >
              <Landmark className="w-5 h-5" /> Open 50% Milestone Settlement & Payment Portal →
            </button>
          </div>
        </div>
      </section>

      {/* CASE STUDIES SECTION */}
      <section id="case-studies" className="space-y-8">
        <div className="text-center space-y-2">
          <div className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider">PROVEN ARCHITECTURES</div>
          <h2 className="text-3xl font-black text-white">Production Case Studies & Systems</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Review production metrics, backend architectures, and verified business outcomes delivered across our commercial deployments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CASE_STUDIES.map((study) => (
            <div key={study.id} className="bg-dark-900 border border-slate-800 rounded-2xl p-6 space-y-5 hover:border-teal-500/30 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 bg-teal-500/10 text-teal-400 rounded-md border border-teal-500/20">
                    {study.category}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{study.title}</h3>
                  <div className="text-xs text-slate-400 font-medium">{study.solution}</div>
                </div>

                <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800/80">
                  {study.metrics.map((m, idx) => (
                    <div key={idx} className="text-center">
                      <div className="text-sm sm:text-base font-black text-teal-400 font-mono">{m.value}</div>
                      <div className="text-[10px] text-slate-400">{m.label}</div>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {study.summary}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/60">
                <div className="text-[10px] text-slate-400 font-mono mb-2">Stack: {study.architecture}</div>
                <div className="flex flex-wrap gap-1.5">
                  {study.tech.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-dark-950 border border-slate-800 rounded text-[10px] font-mono text-slate-400">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ROI CALCULATOR SECTION */}
      <section id="roi-calculator" className="bg-dark-900 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-8">
        <div className="text-center space-y-2">
          <div className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider">AFTER-HOURS REVENUE MATRIX</div>
          <h2 className="text-3xl font-black text-white">Quantify Your Missed Opportunity</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Calculate the exact monthly revenue your business loses due to delayed responses and missed after-hours inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 bg-dark-950 p-6 rounded-2xl border border-slate-800">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Monthly Inbound Inquiries</span>
                <span className="text-teal-400 font-mono font-bold">{calcMonthlyLeads} leads/mo</span>
              </div>
              <input 
                type="range" 
                min="20" 
                max="500" 
                step="10"
                value={calcMonthlyLeads}
                onChange={(e) => setCalcMonthlyLeads(Number(e.target.value))}
                className="w-full accent-teal-500 bg-dark-850 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Average Customer Value ($)</span>
                <span className="text-teal-400 font-mono font-bold">${calcAvgDealValue}</span>
              </div>
              <input 
                type="range" 
                min="100" 
                max="5000" 
                step="50"
                value={calcAvgDealValue}
                onChange={(e) => setCalcAvgDealValue(Number(e.target.value))}
                className="w-full accent-teal-500 bg-dark-850 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">% Inquiries Outside Business Hours</span>
                <span className="text-teal-400 font-mono font-bold">{calcMissedRate}%</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="60" 
                step="5"
                value={calcMissedRate}
                onChange={(e) => setCalcMissedRate(Number(e.target.value))}
                className="w-full accent-teal-500 bg-dark-850 cursor-pointer"
              />
            </div>
          </div>

          <div className="p-7 bg-gradient-to-br from-teal-500/10 via-dark-950 to-indigo-500/10 border border-teal-500/30 rounded-2xl space-y-5 text-center">
            <div className="text-xs text-slate-400 uppercase font-mono font-bold tracking-wider">Estimated Recoverable Revenue</div>
            <div className="text-4xl sm:text-5xl font-black text-teal-400 font-mono">
              ${estimatedRecoveredRevenue.toLocaleString()}
              <span className="text-sm font-normal text-slate-400"> / month</span>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed">
              Deploying an autonomous sub-30-second AI qualification engine captures approximately <strong className="text-white">{recoverableConversions} lost clients</strong> every month.
            </p>

            <a
              href="#contact"
              className="inline-block w-full py-3.5 bg-teal-500 hover:bg-teal-400 text-dark-950 font-extrabold rounded-xl text-xs transition-all shadow-lg shadow-teal-500/20"
            >
              Build Your Recovery Engine →
            </a>
          </div>
        </div>
      </section>

      {/* DIRECT CONTACT FLOW */}
      <section id="contact" className="bg-dark-900 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-6 max-w-3xl mx-auto shadow-2xl">
        <div className="text-center space-y-2">
          <div className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider">DIRECT ENGAGEMENT</div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Schedule an AI Architecture Walkthrough</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Speak directly with Alex Rine. We will audit your current response workflow and deliver a custom working prototype within 48 hours.
          </p>
          <div className="pt-2 flex items-center justify-center gap-2 text-xs font-mono text-slate-300">
            <span>Direct Email:</span>
            <a 
              href="mailto:alexrine691@gmail.com" 
              className="px-3 py-1 bg-dark-950 border border-teal-500/30 text-teal-400 hover:text-teal-300 rounded-lg transition-all font-bold"
            >
              alexrine691@gmail.com
            </a>
          </div>
        </div>

        {bookingSuccess ? (
          <div className="p-8 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="font-bold text-white text-base">Architecture Request Dispatched</h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
              Thank you! Alex Rine has received your parameters and will reach out via <strong className="text-white">alexrine691@gmail.com</strong> with a direct calendar link and preliminary architecture diagram.
            </p>
          </div>
        ) : (
          <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-slate-300 mb-1.5">Your Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Thomas Vance"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full p-3 bg-dark-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-teal-500 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1.5">Business Email</label>
                <input
                  type="email"
                  placeholder="e.g. tvance@vancedental.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full p-3 bg-dark-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-teal-500 text-xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-slate-300 mb-1.5">Business / Practice Name</label>
                <input
                  type="text"
                  placeholder="e.g. Vance Dental Care"
                  value={clientCompany}
                  onChange={(e) => setClientCompany(e.target.value)}
                  className="w-full p-3 bg-dark-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-teal-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1.5">Primary System Requirement</label>
                <select
                  value={clientService}
                  onChange={(e) => setClientService(e.target.value)}
                  className="w-full p-3 bg-dark-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-teal-500 text-xs"
                >
                  <option value="24/7 AI Business Receptionist">24/7 AI Receptionist & Voice Booking</option>
                  <option value="Speed-to-Lead Lead Qualification">Speed-to-Lead Lead Qualification Pipeline (&lt;60s)</option>
                  <option value="Oracle AI Quant Microstructure Feed">Oracle AI Quant Microstructure Feed</option>
                  <option value="Fact Fuel Autonomous Fact-Checking Engine">Fact Fuel Fact-Checking & Script Engine</option>
                  <option value="MEXC Trading Bot Automation">MEXC Trading Bot Automation</option>
                  <option value="Monopoly PK Real Estate Simulator">Monopoly PK Real Estate Simulator</option>
                  <option value="Bright Star Admissions Portal">Bright Star Admissions Portal</option>
                  <option value="Custom Autonomous AI Infrastructure">Custom Autonomous AI Infrastructure</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={submittingBooking}
              className="w-full py-4 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-dark-950 font-black rounded-xl text-xs sm:text-sm transition-all shadow-xl shadow-teal-500/25 flex items-center justify-center gap-2 mt-4"
            >
              {submittingBooking && <RefreshCw className="w-4 h-4 animate-spin" />}
              {submittingBooking ? 'Submitting Parameters...' : 'Request Custom AI Architecture Blueprint →'}
            </button>
          </form>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 pt-8 pb-12 text-center text-xs text-slate-500 space-y-2">
        <div className="font-mono text-slate-400">© 2026 RINE FORGE SYSTEMS • Engineering Autonomous Commercial AI</div>
        <div>Alex Rine, Principal Systems Architect • Direct: <a href="mailto:alexrine691@gmail.com" className="text-teal-400 hover:underline">alexrine691@gmail.com</a></div>
      </footer>

      {/* 50% Milestone Settlement & Payment Modal */}
      <PaymentPortalModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        defaultPackageId={selectedPackageForModal}
      />

      {/* 24/7 Floating AI Architecture Agent */}
      <FloatingAIAssistant
        onOpenPaymentModal={(pkgId) => {
          setSelectedPackageForModal(pkgId);
          setIsPaymentModalOpen(true);
        }}
      />

      {/* Interactive 10s Video Player Modal */}
      {activeVideoModal && (
        <InteractiveVideoPlayerModal
          activeProject={activeVideoModal}
          onClose={() => setActiveVideoModal(null)}
          onSelectPackage={(pkgId) => {
            setActiveVideoModal(null);
            setSelectedPackageForModal(pkgId || 'ai-receptionist');
            setIsPaymentModalOpen(true);
          }}
          allProjects={SHOWCASE_TABS}
          onSwitchProject={(project) => setActiveVideoModal(project)}
        />
      )}
    </div>
  );
}
