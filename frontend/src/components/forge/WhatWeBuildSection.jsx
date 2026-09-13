import React from 'react';
import { 
  TrendingUp, MessageSquare, Cpu, Layers, 
  Sparkles, ArrowRight, CheckCircle2, ShieldCheck 
} from 'lucide-react';
import { FORGE_SOLUTIONS } from '../../data/siteData';

const SOLUTION_ICONS = {
  'ai-sales-systems': TrendingUp,
  'ai-customer-service': MessageSquare,
  'ai-operations': Cpu,
  'ai-marketing': Layers,
  'custom-ai-agents': Sparkles
};

export function WhatWeBuildSection({ onNavigate }) {
  return (
    <section id="solutions" className="py-16 sm:py-24 border-b border-slate-800/80 bg-[#080c14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="text-xs font-mono font-bold text-teal-400 tracking-widest uppercase">
            SYSTEM CAPABILITIES
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            FROM REPETITIVE PROCESS TO AUTONOMOUS SYSTEM.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            We engineer end-to-end intelligent architectures that integrate with your existing tech stack and execute business workflows with precision.
          </p>
        </div>

        {/* 5 Core Solutions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {FORGE_SOLUTIONS.map((sol, idx) => {
            const Icon = SOLUTION_ICONS[sol.id] || Sparkles;
            const isWide = idx === 3 || idx === 4;
            return (
              <div
                key={sol.id}
                className={`bg-dark-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 sm:p-8 space-y-6 transition-all flex flex-col justify-between shadow-xl group ${
                  isWide ? 'lg:col-span-1.5' : ''
                }`}
              >
                <div className="space-y-4">
                  {/* Category Badge & Icon */}
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-1 bg-dark-950 text-teal-400 border border-slate-800 rounded font-bold">
                      PRODUCTION SYSTEM
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white tracking-wide">
                      {sol.title}
                    </h3>
                    <p className="text-xs text-teal-400 font-mono mt-1 font-semibold">
                      {sol.headline}
                    </p>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {sol.summary}
                  </p>

                  {/* Capabilities List */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <div className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">Core Capabilities:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {sol.capabilities.slice(0, 4).map((cap, cIdx) => (
                        <div key={cIdx} className="p-2 bg-dark-950 rounded-lg border border-slate-850">
                          <div className="font-bold text-slate-200">{cap.name}</div>
                          <div className="text-[10px] text-slate-400 truncate">{cap.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="text-[10px] font-mono text-slate-400">
                    <strong className="text-slate-300">Stack:</strong> Python • FastAPI • Redis • PostgreSQL
                  </div>
                  <button
                    onClick={() => onNavigate(`solution-${sol.slug}`)}
                    className="text-xs font-mono font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-all"
                  >
                    <span>View Architecture</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
