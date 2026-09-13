import React from 'react';
import { CheckCircle2, Terminal, Clock, Cpu, ArrowRight, ShieldCheck } from 'lucide-react';
import { FORGE_CASE_STUDIES } from '../../data/siteData';

export function CaseStudiesSection({ onNavigate }) {
  return (
    <section className="py-16 sm:py-24 border-b border-slate-800/80 bg-[#080c14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="text-xs font-mono font-bold text-teal-400 tracking-widest uppercase">
            TECHNICAL BREAKDOWNS
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            PROOF OVER PROMISES.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            We believe in complete transparency. Review the problems we engineered solutions for, the exact system architecture deployed, and the verified outcomes.
          </p>
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {FORGE_CASE_STUDIES.map((study) => (
            <div
              key={study.id}
              className="bg-dark-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 sm:p-8 space-y-6 transition-all shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-5">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
                  <span className="text-[10px] font-mono px-2.5 py-1 bg-dark-950 text-teal-400 border border-teal-500/20 rounded font-bold">
                    {study.statusBadge}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" /> {study.timeline}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white tracking-tight">
                  {study.title}
                </h3>

                {/* Structured Breakdown: Problem, System, Implementation, Result */}
                <div className="space-y-3 text-xs leading-relaxed">
                  <div className="p-3.5 bg-dark-950 rounded-xl border border-slate-850 space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-rose-400">THE PROBLEM:</span>
                    <p className="text-slate-300">{study.problem}</p>
                  </div>

                  <div className="p-3.5 bg-dark-950 rounded-xl border border-slate-850 space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-teal-400">THE SYSTEM:</span>
                    <p className="text-slate-300">{study.system}</p>
                  </div>

                  <div className="p-3.5 bg-dark-950 rounded-xl border border-slate-850 space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-indigo-400">THE IMPLEMENTATION:</span>
                    <p className="text-slate-300 font-mono text-[11px]">{study.implementation}</p>
                  </div>

                  <div className="p-3.5 bg-emerald-950/20 rounded-xl border border-emerald-500/30 space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-emerald-400">THE RESULT:</span>
                    <p className="text-slate-200 font-medium">{study.result}</p>
                  </div>
                </div>
              </div>

              {/* Tech Stack Pills */}
              <div className="pt-4 border-t border-slate-800/80 space-y-2">
                <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Technology Stack:</div>
                <div className="flex flex-wrap gap-1.5">
                  {study.tech.map((t, i) => (
                    <span key={i} className="px-2.5 py-1 bg-dark-950 border border-slate-800 text-[10px] font-mono text-slate-300 rounded-md">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="p-6 bg-dark-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-sm font-bold text-white">Have a similar workflow you need engineered?</div>
            <div className="text-xs text-slate-400">We map your process and deliver a full technical blueprint before any build begins.</div>
          </div>
          <button
            onClick={() => onNavigate('audit')}
            className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-teal-500/20 shrink-0"
          >
            <span>Request Workflow Architecture Audit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
}
