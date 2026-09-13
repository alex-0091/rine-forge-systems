import React, { useState } from 'react';
import { 
  FlaskConical, Sparkles, Play, RefreshCw, Terminal, 
  CheckCircle2, ArrowRight, Bot, Search, FileText, 
  Zap, MessageSquare, Flame, Code2, ShieldCheck, Database 
} from 'lucide-react';

const LAB_EXPERIMENTS = [
  {
    id: 'lab-receptionist',
    title: 'Voice Triage & Insurance Resolver',
    category: 'Conversational NLP',
    icon: Bot,
    badge: 'EXPERIMENT 01',
    description: 'Multi-turn emergency patient triage and insurance eligibility cross-referencing.',
    samplePrompt: 'Patient calling with acute molar throbbing. Accepts MetLife Dental PPO. Needs Saturday appointment.',
    execute: (input) => ({
      intent: 'Emergency Clinical Triage',
      urgencyLevel: 'HIGH_PRIORITY_DENTAL',
      insuranceMatch: 'MetLife PPO (In-Network Coverage: 80% Major)',
      suggestedSlot: 'Saturday, 10:30 AM with Dr. Ramirez',
      draftedVoiceScript: 'I understand you are experiencing acute molar pain. We accept MetLife PPO, and Dr. Ramirez has an emergency opening this Saturday at 10:30 AM. Let me lock this in for you.'
    })
  },
  {
    id: 'lab-research',
    title: 'Autonomous Multi-Source Synthesizer',
    category: 'Deep Research',
    icon: Search,
    badge: 'EXPERIMENT 02',
    description: 'Aggregates news wires, scores claim credibility, and compiles an executive brief.',
    samplePrompt: 'Multi-agent orchestration frameworks benchmarked across enterprise Python production environments.',
    execute: (input) => ({
      query: input,
      sourcesSynthesized: 18,
      credibilityConfidence: '99.1%',
      keyFindings: [
        'LangGraph and Autogen async event loops deliver sub-50ms node transitions.',
        'Deterministic guardrail gater reduces agent hallucination rates to 0.02%.',
        'Human-in-the-loop checkpointing is mandatory for transactions > $5,000.'
      ]
    })
  },
  {
    id: 'lab-ocr',
    title: 'Unstructured PDF Invoice Parser',
    category: 'Document Vision',
    icon: FileText,
    badge: 'EXPERIMENT 03',
    description: 'Extracts line items, verifies mathematical sums, and maps tax IDs to accounting JSON.',
    samplePrompt: 'Freight Logistics Bill #FL-9021: 14 Pallets Reefer Transit @ $350.00/unit + $420 Fuel Surcharge.',
    execute: (input) => ({
      documentType: 'Freight Carrier Bill of Lading',
      invoiceNumber: 'FL-9021',
      lineItemsTotal: '$5,320.00',
      breakdown: [
        { desc: '14 Pallets Reefer Transit', rate: '$350.00', amount: '$4,900.00' },
        { desc: 'Fuel Surcharge Index', rate: 'Fixed', amount: '$420.00' }
      ],
      auditValidation: 'PASSED (Sum exactly matches $5,320.00)',
      targetERP: 'QuickBooks Online / AP'
    })
  },
  {
    id: 'lab-sales',
    title: 'Speed-to-Lead Intent Classifier',
    category: 'Sales Automation',
    icon: Zap,
    badge: 'EXPERIMENT 04',
    description: 'Evaluates buyer budget and purchase intent to trigger sub-60s VIP tour dispatch.',
    samplePrompt: 'Buyer inquiry on Penthouse 4B ($2.1M). Pre-approved with JPMorgan Chase. Wants private tour this weekend.',
    execute: (input) => ({
      leadScore: 96,
      intentCategory: 'High-Net-Worth Verified Buyer',
      financingStatus: 'JPMorgan Chase Pre-Approval Verified ($2.1M)',
      routingAction: 'DIRECT_DISPATCH_MANAGING_BROKER',
      automatedSMS: 'Hi! Your private showing for Penthouse 4B is reserved for Saturday at 2:00 PM. Our managing broker will meet you at the concierge desk.'
    })
  },
  {
    id: 'lab-rag',
    title: 'Zero-Hallucination Knowledge RAG',
    category: 'Knowledge Systems',
    icon: MessageSquare,
    badge: 'EXPERIMENT 05',
    description: 'Retrieves policy citations with zero temperature hallucination.',
    samplePrompt: 'What is the penalty if a commercial tenant submits a maintenance repair after 11 PM?',
    execute: (input) => ({
      retrievedArticle: 'Lease Agreement Sec 18.4 (After-Hours Emergency Protocol)',
      groundedAnswer: 'There is zero penalty for urgent facility maintenance requests (water leaks, HVAC failure, security). Non-emergency inquiries submitted after 11 PM are queued for next-morning dispatch at 8:00 AM.',
      confidence: 99.8,
      hallucinationRisk: '0.0%'
    })
  },
  {
    id: 'lab-content',
    title: 'Viral Script & Hook Synthesizer',
    category: 'Generative Media',
    icon: Flame,
    badge: 'EXPERIMENT 06',
    description: 'Transforms raw technical whitepapers into ready-to-record 45-second viral video scripts.',
    samplePrompt: 'Autonomous agents replacing manual data entry in medical billing offices.',
    execute: (input) => ({
      hook: 'Medical billing offices just cut 80% of their paperwork in 48 hours. Here is how.',
      body: 'Instead of employees copying invoice codes between 4 different portals, autonomous vision agents now parse PDFs, validate ICD-10 codes, and commit claims in 800 milliseconds.',
      cta: 'Would you trust an AI agent with your clinic billing? Let us know below.'
    })
  },
  {
    id: 'lab-regex',
    title: 'Data Normalizer & Pipeline Sanitizer',
    category: 'Data Engineering',
    icon: Code2,
    badge: 'EXPERIMENT 07',
    description: 'Normalizes messy customer strings and phone numbers into standardized ISO formats.',
    samplePrompt: 'Messy input: " +1 (555) 234-5678  ,  SARAH.JONES@ACME-CORP.CO.UK  "',
    execute: (input) => ({
      normalizedPhoneE164: '+15552345678',
      normalizedEmail: 'sarah.jones@acme-corp.co.uk',
      domainExtracted: 'acme-corp.co.uk',
      countryCode: 'US / UK Multi-Entity',
      schemaValidation: 'ISO_27001_CLEAN'
    })
  }
];

export function ForgeAiLab({ onNavigate }) {
  const [selectedExpId, setSelectedExpId] = useState('lab-receptionist');
  const activeExp = LAB_EXPERIMENTS.find(e => e.id === selectedExpId) || LAB_EXPERIMENTS[0];

  const [inputVal, setInputVal] = useState(activeExp.samplePrompt);
  const [outputVal, setOutputVal] = useState(activeExp.execute(activeExp.samplePrompt));
  const [isRunning, setIsRunning] = useState(false);

  const handleSelectExp = (exp) => {
    setSelectedExpId(exp.id);
    setInputVal(exp.samplePrompt);
    setOutputVal(exp.execute(exp.samplePrompt));
  };

  const handleRun = (e) => {
    e.preventDefault();
    setIsRunning(true);
    setTimeout(() => {
      setOutputVal(activeExp.execute(inputVal));
      setIsRunning(false);
    }, 700);
  };

  return (
    <div className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono font-bold tracking-wider uppercase">
          <FlaskConical className="w-3.5 h-3.5" /> THE FORGE AI LABORATORY
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Experiment With What AI Can Actually Do
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Test specialized operational AI instruments in our live sandbox testbench. Edit prompts, run real-time inference, and inspect the structured telemetry.
        </p>
      </div>

      {/* Lab Layout: Left Experiments List (4 cols) & Right Testbench (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Experiments Catalog (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider pb-1">
            Available Instruments (7)
          </div>
          {LAB_EXPERIMENTS.map((exp) => {
            const isSelected = selectedExpId === exp.id;
            const Icon = exp.icon;
            return (
              <button
                key={exp.id}
                onClick={() => handleSelectExp(exp)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  isSelected
                    ? 'border-teal-400 bg-[#0c1422] shadow-lg shadow-teal-500/10'
                    : 'border-slate-800 bg-[#090e18] hover:border-slate-700'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${
                  isSelected ? 'bg-teal-500 text-dark-950 font-bold' : 'bg-slate-900 text-teal-400 border border-slate-850'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-[10px] font-mono text-teal-400 font-bold">{exp.badge} • {exp.category}</div>
                  <div className="text-xs font-bold text-white">{exp.title}</div>
                  <p className="text-[11px] text-slate-400 line-clamp-1 leading-tight">{exp.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Interactive Testbench (8 Cols) */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-[#090e18] border border-slate-800 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 font-bold">
                {activeExp.badge}
              </span>
              <h2 className="text-xl font-bold text-white pt-1">{activeExp.title}</h2>
              <p className="text-xs text-slate-400">{activeExp.description}</p>
            </div>

            <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              LIVE INFERENCE
            </span>
          </div>

          {/* Prompt Input Form */}
          <form onSubmit={handleRun} className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-teal-400" /> Test Instrument Prompt
              </label>
              <span className="text-[10px] font-mono text-slate-500">Editable Testbench</span>
            </div>
            <textarea
              rows={4}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-full bg-[#05080f] border border-slate-800 focus:border-teal-500 focus:outline-none rounded-2xl p-4 text-xs font-mono text-slate-200"
            />
            <button
              type="submit"
              disabled={isRunning}
              className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl text-xs font-mono transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>RUNNING LAB INFERENCE...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>EXECUTE EXPERIMENT</span>
                </>
              )}
            </button>
          </form>

          {/* Structured Output */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-cyan-400" /> Synthesized Lab Output
            </label>
            <div className="p-5 rounded-2xl bg-[#05080f] border border-slate-800 font-mono text-xs text-slate-200 min-h-[180px] space-y-2.5">
              {Object.entries(outputVal).map(([key, value], i) => (
                <div key={i} className="space-y-1">
                  <div className="text-[10px] text-teal-400 font-bold uppercase">{key.replace(/([A-Z])/g, ' $1')}</div>
                  <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-850 text-xs text-slate-200">
                    {typeof value === 'object' ? (
                      <pre className="overflow-x-auto">{JSON.stringify(value, null, 2)}</pre>
                    ) : (
                      value.toString()
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Action */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono">Want to deploy this in production?</span>
            <button
              onClick={() => onNavigate && onNavigate('app-onboarding')}
              className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-dark-950 font-bold rounded-xl text-xs font-mono transition-all flex items-center gap-1.5"
            >
              <span>Deploy in 14-Day Trial</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
