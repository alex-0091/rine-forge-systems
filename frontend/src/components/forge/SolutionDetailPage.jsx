import React from 'react';
import { 
  ArrowLeft, ArrowRight, Sparkles, Layers, Cpu, ShieldCheck, 
  CheckCircle2, Terminal, Workflow, Server, Zap, Check 
} from 'lucide-react';
import { FORGE_SOLUTIONS } from '../../data/siteData';

export function SolutionDetailPage({ slug, onNavigate }) {
  const solution = FORGE_SOLUTIONS.find(s => s.slug === slug) || FORGE_SOLUTIONS[0];

  return (
    <div className="py-12 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Back navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate && onNavigate('solutions')}
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-teal-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Solutions
        </button>

        <span className="text-xs font-mono px-3 py-1 rounded-md bg-teal-500/10 border border-teal-500/20 text-teal-400 font-bold">
          PRODUCTION ARCHITECTURE
        </span>
      </div>

      {/* Hero Section */}
      <div className="space-y-6 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono font-bold">
          <Layers className="w-3.5 h-3.5" /> FORGE CAPABILITY SPEC
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          {solution.title}
        </h1>

        <p className="text-xl sm:text-2xl text-teal-300 font-semibold leading-relaxed">
          {solution.headline}
        </p>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          {solution.summary}
        </p>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <strong className="text-white">Ideal For:</strong> {solution.idealFor}
        </div>

        <div className="flex flex-wrap gap-4 pt-2">
          <button
            onClick={() => onNavigate && onNavigate('audit')}
            className="px-6 py-3.5 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl text-xs transition-all shadow-xl shadow-teal-500/20 flex items-center gap-2"
          >
            <span>GET FREE AUDIT FOR THIS WORKFLOW</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Technical Architecture Pipeline */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0a0f19] border border-slate-800 space-y-6">
        <div className="space-y-2">
          <div className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider flex items-center gap-2">
            <Workflow className="w-4 h-4" /> System Architecture Pipeline
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            How Data & Reasoning Flows Through This System
          </h2>
        </div>

        {/* Architecture Flow Box */}
        <div className="p-5 rounded-2xl bg-dark-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-[600px] text-teal-300 font-bold">
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-white shrink-0">
              1. Ingest Trigger
            </div>
            <ArrowRight className="w-4 h-4 text-teal-400 shrink-0" />
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-teal-300 shrink-0">
              2. Intent & RAG Reasoning
            </div>
            <ArrowRight className="w-4 h-4 text-teal-400 shrink-0" />
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-cyan-300 shrink-0">
              3. Guardrails & Oversight
            </div>
            <ArrowRight className="w-4 h-4 text-teal-400 shrink-0" />
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-emerald-300 shrink-0">
              4. API Action & Commit
            </div>
          </div>
          <div className="pt-4 text-slate-400 text-[11px] font-mono">
            <strong>Pipeline Spec:</strong> {solution.architecture}
          </div>
        </div>
      </div>

      {/* 6 Core Capabilities Grid */}
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider">
            Engineered Capabilities
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Included Sub-Systems & Automation Modules
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solution.capabilities.map((cap, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#0b0f19] border border-slate-800 hover:border-teal-500/40 transition-all space-y-3"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center font-mono font-bold text-xs">
                0{idx + 1}
              </div>
              <h3 className="text-base font-bold text-white">{cap.name}</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{cap.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Safety & Human Oversight Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0a0f19] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-teal-400 text-xs font-mono font-bold">
            <ShieldCheck className="w-4 h-4" /> Human-in-the-Loop Governance
          </div>
          <h3 className="text-xl font-bold text-white">Configured with Strict Policy Checkpoints</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Every implementation includes configurable approval thresholds. Low-risk operations execute autonomously, while critical or out-of-bounds actions require 1-click team authorization.
          </p>
        </div>
        <button
          onClick={() => onNavigate && onNavigate('audit')}
          className="w-full md:w-auto px-6 py-3 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl text-xs transition-all shadow-md shrink-0"
        >
          Scope Custom Pilot
        </button>
      </div>

    </div>
  );
}
