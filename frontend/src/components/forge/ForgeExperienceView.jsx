import React, { useState } from 'react';
import { 
  Sparkles, ArrowRight, Bot, Zap, Database, 
  CheckCircle2, RefreshCw, Layers, Calculator, 
  ShieldCheck, Terminal, Cpu, Building2 
} from 'lucide-react';

export function ForgeExperienceView({ onNavigate }) {
  const [businessInput, setBusinessInput] = useState('We run a 4-location luxury dental practice. Front desk staff spends 40% of their day on routine insurance questions, and we miss after-hours surgical bookings.');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [systemAssembled, setSystemAssembled] = useState(true);

  const sampleOS = {
    businessProfile: 'Multi-Location Healthcare & Dental Practice',
    detectedBottlenecks: [
      'After-hours inquiry abandonment (est. 18-24 missed bookings/mo)',
      'Front desk overwhelmed by repetitive PPO insurance FAQs (14 hrs/wk lost)',
      'Delayed patient intake registration causing waiting room congestion'
    ],
    recommendedNodes: [
      { name: '24/7 AI Receptionist', role: 'Voice & Web Triage', impact: '+28% after-hours conversions' },
      { name: 'Knowledge Base RAG', role: 'Insurance FAQ Resolver', impact: '14 hrs/wk recovered' },
      { name: 'Speed-to-Lead Agent', role: 'Sub-60s Intake SMS', impact: '3.2x faster patient lock' },
      { name: 'EHR / Calendar Sync', role: 'Direct Slot Booking', impact: 'Zero double-bookings' }
    ],
    projectedAnnualImpact: '$288,000 / year in recaptured surgical revenue & labor savings'
  };

  const handleSynthesize = (e) => {
    e.preventDefault();
    setIsSynthesizing(true);
    setTimeout(() => {
      setIsSynthesizing(false);
      setSystemAssembled(true);
    }, 1200);
  };

  return (
    <div className="py-12 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono font-bold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5" /> CINEMATIC OPERATING SYSTEM SIMULATOR
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
          This is what AI should <span className="text-teal-400">feel like.</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Describe your business in one sentence. Watch FORGE analyze your operational bottlenecks and assemble a custom multi-agent operating system live before your eyes.
        </p>
      </div>

      {/* Interactive Input Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0a0f1a] border border-slate-800 shadow-2xl space-y-4">
        <form onSubmit={handleSynthesize} className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-teal-400" /> What does your business do?
            </label>
            <span className="text-[10px] text-slate-500 font-mono">Real-time Architecture Engine</span>
          </div>
          <textarea
            rows={3}
            value={businessInput}
            onChange={(e) => setBusinessInput(e.target.value)}
            className="w-full bg-[#05080f] border border-slate-800 focus:border-teal-500 focus:outline-none rounded-2xl p-4 text-xs font-mono text-slate-200 placeholder-slate-600"
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
            <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
              <span className="text-slate-500 self-center">Try preset:</span>
              {[
                'Commercial Property Management',
                'HVAC Field Contractor',
                'B2B SaaS Sales Team',
                'Law Firm Personal Injury Intake'
              ].map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setBusinessInput(`We run a ${preset} firm and struggle with manual follow-ups, slow responses to leads, and paperwork bottlenecks.`);
                  }}
                  className="px-2 py-1 rounded bg-slate-900 hover:bg-teal-500/10 text-slate-400 hover:text-teal-300 border border-slate-800"
                >
                  {preset}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={isSynthesizing}
              className="w-full sm:w-auto px-6 py-3 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl text-xs font-mono transition-all shadow-md flex items-center justify-center gap-2 shrink-0"
            >
              {isSynthesizing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>ASSEMBLING OPERATING SYSTEM...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>CONSTRUCT MY AI OS</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Assembled Multi-Agent Architecture */}
      {systemAssembled && (
        <div className="p-8 sm:p-10 rounded-3xl bg-[#090e18] border border-teal-500/40 shadow-2xl space-y-10 relative overflow-hidden animate-fadeIn">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 blur-[130px] pointer-events-none rounded-full" />
          
          <div className="space-y-2 border-b border-slate-800 pb-6">
            <div className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider">
              Autonomous Operating System Blueprint
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Tailored System Architecture for Your Workflow
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              FORGE has structured 4 interconnected agents to execute your highest-cost operational bottlenecks.
            </p>
          </div>

          {/* 4 Connected Nodes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            {sampleOS.recommendedNodes.map((node, i) => (
              <div key={i} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-teal-400 font-bold text-[10px]">AGENT 0{i + 1}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-sm font-bold text-white">{node.name}</div>
                <div className="text-[11px] text-teal-300">{node.role}</div>
                <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                  Impact: <strong className="text-slate-200">{node.impact}</strong>
                </div>
              </div>
            ))}
          </div>

          {/* Projected Commercial ROI Bar */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-[#0c1626] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
            <div className="space-y-1">
              <div className="text-slate-400 uppercase text-[10px]">Estimated Quantified Impact</div>
              <div className="text-xl sm:text-2xl font-black text-teal-400">{sampleOS.projectedAnnualImpact}</div>
            </div>

            <button
              onClick={() => onNavigate && onNavigate('app-onboarding')}
              className="w-full md:w-auto px-8 py-4 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl text-xs transition-all shadow-xl shadow-teal-500/25 flex items-center justify-center gap-2 shrink-0"
            >
              <span>DEPLOY THIS SYSTEM IN FREE TRIAL</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
