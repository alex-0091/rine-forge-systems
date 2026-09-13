import React, { useState } from 'react';
import { 
  ArrowLeft, ArrowRight, Star, Zap, CheckCircle2, 
  ShieldCheck, Calculator, Play, Terminal, Database, 
  Layers, Lock, Sparkles, RefreshCw, Server, Workflow 
} from 'lucide-react';
import { SYSTEMS_CATALOG, PRICING_CONFIG } from '../../data/forgePlatformConfig';

export function SystemDetailPage({ slug, onNavigate }) {
  const system = SYSTEMS_CATALOG.find(s => s.slug === slug) || SYSTEMS_CATALOG[0];

  const [inputVal, setInputVal] = useState(system.demoConfig.defaultInput);
  const [isRunning, setIsRunning] = useState(false);
  const [outputVal, setOutputVal] = useState(system.demoConfig.sampleOutput);

  // ROI Calculator State
  const [monthlyVolume, setMonthlyVolume] = useState(150);
  const [dealValue, setDealValue] = useState(2500);
  const [missedRate, setMissedRate] = useState(25);

  const missedCount = Math.round(monthlyVolume * (missedRate / 100));
  const recoveredDeals = Math.round(missedCount * 0.35);
  const annualRecovered = recoveredDeals * dealValue * 12;

  const handleRunDemo = (e) => {
    e.preventDefault();
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
    }, 1200);
  };

  return (
    <div className="py-12 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Back navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate && onNavigate('systems')}
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-teal-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Systems
        </button>

        <span className="text-xs font-mono px-3 py-1 rounded-md bg-teal-500/10 border border-teal-500/20 text-teal-400 font-bold">
          PRODUCT SYSTEM SPEC • {system.version}
        </span>
      </div>

      {/* Hero Section */}
      <div className="space-y-6 max-w-4xl">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 font-bold">
            {system.badge}
          </span>
          <div className="flex items-center gap-1 text-amber-400 text-xs font-bold font-mono">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{system.rating} / 5.0 Rating</span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            • {system.executionsTotal.toLocaleString()} Production Executions
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          {system.name}
        </h1>

        <p className="text-xl sm:text-2xl text-teal-300 font-semibold leading-relaxed">
          {system.headline}
        </p>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
          {system.description}
        </p>

        <div className="flex flex-wrap gap-4 pt-2">
          <button
            onClick={() => onNavigate && onNavigate('app-onboarding')}
            className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl text-xs font-mono transition-all shadow-xl shadow-teal-500/20 flex items-center gap-2"
          >
            <span>START 14-DAY FREE TRIAL</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('interactive-tester');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-6 py-4 bg-dark-900 hover:bg-slate-850 text-slate-200 border border-slate-700 font-bold rounded-xl text-xs transition-all"
          >
            Test in Live Sandbox ↓
          </button>
        </div>
      </div>

      {/* 4-Step Visual Workflow */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#090e18] border border-slate-800 space-y-6">
        <div className="space-y-2">
          <div className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider flex items-center gap-2">
            <Workflow className="w-4 h-4" /> How This System Executes
          </div>
          <h2 className="text-2xl font-bold text-white">4-Stage Autonomous Pipeline</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
          {system.workflowSteps.map((step, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="text-teal-400 font-bold text-xs">STAGE {step.step}</div>
              <div className="font-bold text-white text-sm">{step.title}</div>
              <p className="text-slate-400 text-xs leading-relaxed font-sans">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Live Interactive Sandbox Tester */}
      <div id="interactive-tester" className="p-8 sm:p-10 rounded-3xl bg-[#080d16] border border-teal-500/30 space-y-8">
        <div className="space-y-2">
          <div className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider flex items-center gap-2">
            <Terminal className="w-4 h-4" /> Sandbox Testbench
          </div>
          <h2 className="text-2xl font-bold text-white">Experience {system.name} Right Now</h2>
          <p className="text-xs text-slate-400">
            Submit sample parameters to trigger real-time AI reasoning and structured action extraction.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <label className="text-xs font-mono text-slate-300 block font-bold">Editable Sandbox Input</label>
            <textarea
              rows={6}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-full bg-dark-950 border border-slate-800 focus:border-teal-500 focus:outline-none rounded-xl p-4 text-xs font-mono text-slate-200"
            />
            <button
              onClick={handleRunDemo}
              disabled={isRunning}
              className="w-full py-3.5 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl text-xs font-mono transition-all shadow-md flex items-center justify-center gap-2"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>EXECUTING REASONING...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>RUN TEST EXECUTION</span>
                </>
              )}
            </button>
          </div>

          <div className="lg:col-span-7 space-y-2">
            <label className="text-xs font-mono text-slate-300 block font-bold">Extracted Execution Action</label>
            <div className="p-5 rounded-xl bg-dark-950 border border-slate-800 font-mono text-xs text-slate-200 min-h-[220px] space-y-3">
              {Object.entries(outputVal).map(([k, v], i) => (
                <div key={i} className="space-y-1">
                  <div className="text-[10px] text-teal-400 font-bold uppercase">{k.replace(/([A-Z])/g, ' $1')}</div>
                  <div className="p-2 bg-slate-900/90 rounded border border-slate-850 text-xs">
                    {typeof v === 'object' ? JSON.stringify(v) : v.toString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Business Impact Calculator */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#090e18] border border-slate-800 space-y-8">
        <div className="space-y-2">
          <div className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider flex items-center gap-2">
            <Calculator className="w-4 h-4" /> Quantified Business Impact
          </div>
          <h2 className="text-2xl font-bold text-white">Projected ROI for Your Business</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6 font-mono text-xs">
            <div className="space-y-2">
              <div className="flex justify-between text-slate-300">
                <span>Monthly Inquiries / Leads</span>
                <span className="font-bold text-teal-400">{monthlyVolume}</span>
              </div>
              <input
                type="range"
                min="20"
                max="1000"
                step="20"
                value={monthlyVolume}
                onChange={(e) => setMonthlyVolume(Number(e.target.value))}
                className="w-full accent-teal-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-slate-300">
                <span>Average Client / Deal Value</span>
                <span className="font-bold text-teal-400">${dealValue.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="500"
                max="25000"
                step="500"
                value={dealValue}
                onChange={(e) => setDealValue(Number(e.target.value))}
                className="w-full accent-teal-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-teal-500/30 text-center space-y-3 font-mono">
            <div className="text-xs text-slate-400 uppercase">Estimated Annual Revenue Recaptured</div>
            <div className="text-3xl sm:text-4xl font-black text-teal-400">
              ${annualRecovered.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              * Based on recovering 35% of otherwise delayed or lost opportunities with 24/7 sub-60s autonomous engagement.
            </p>
          </div>
        </div>
      </div>

      {/* Supported Integrations Grid */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white">Supported Integrations & APIs</h3>
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          {system.supportedIntegrations.map((tool, idx) => (
            <div key={idx} className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
              <span>{tool}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Free Trial CTA */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-teal-950/40 via-dark-900 to-indigo-950/40 border border-teal-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-white">Ready to put {system.name} to work?</h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Start your 14-day free trial with 100 automated workflow credits. No credit card required.
          </p>
        </div>
        <button
          onClick={() => onNavigate && onNavigate('app-onboarding')}
          className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl text-xs font-mono transition-all shadow-xl shadow-teal-500/20 shrink-0"
        >
          LAUNCH FREE TRIAL →
        </button>
      </div>

    </div>
  );
}
