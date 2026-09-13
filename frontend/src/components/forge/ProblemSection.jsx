import React from 'react';
import { 
  PhoneOff, RefreshCw, Copy, MessageSquare, 
  Calendar, Unlink, ArrowRight, CheckCircle2, AlertCircle
} from 'lucide-react';
import { FORGE_PROBLEMS } from '../../data/siteData';

const PROBLEM_ICONS = {
  'missed-leads': PhoneOff,
  'manual-follow-up': RefreshCw,
  'repetitive-admin': Copy,
  'customer-questions': MessageSquare,
  'scheduling-friction': Calendar,
  'disconnected-systems': Unlink
};

export function ProblemSection({ onNavigate }) {
  return (
    <section className="py-16 sm:py-24 border-b border-slate-800/80 bg-[#080c14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="text-xs font-mono font-bold text-teal-400 tracking-widest uppercase">
            OPERATIONAL BOTTLENECK AUDIT
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            YOUR TEAM SHOULDN'T SPEND ITS BEST HOURS DOING THIS.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            High-value talent shouldn't be trapped doing low-leverage mechanical tasks. Here is where businesses lose time and revenue every single week.
          </p>
        </div>

        {/* 6 Problem Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FORGE_PROBLEMS.map((item) => {
            const Icon = PROBLEM_ICONS[item.id] || AlertCircle;
            return (
              <div
                key={item.id}
                className="bg-dark-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 sm:p-7 space-y-5 transition-all flex flex-col justify-between shadow-lg group"
              >
                <div className="space-y-4">
                  {/* Header & Icon */}
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-teal-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded font-bold">
                      EXPENSIVE BOTTLENECK
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white tracking-wide font-mono">
                    {item.title}
                  </h3>

                  {/* The Problem */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">The Problem:</div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.problem}
                    </p>
                  </div>

                  {/* What FORGE Builds */}
                  <div className="space-y-1.5 p-3.5 bg-dark-950 rounded-xl border border-slate-850">
                    <div className="text-[10px] font-mono text-teal-400 uppercase font-bold tracking-wider">What FORGE Builds:</div>
                    <p className="text-xs text-slate-200 font-medium leading-relaxed">
                      {item.forgeSolution}
                    </p>
                  </div>
                </div>

                {/* Outcome */}
                <div className="pt-3 border-t border-slate-800/80 flex items-start gap-2 text-xs text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                  <span className="text-slate-300"><strong className="text-emerald-400">Outcome:</strong> {item.outcome}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section Bottom CTA */}
        <div className="pt-4 text-center">
          <button
            onClick={() => onNavigate('audit')}
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-teal-400 hover:text-teal-300 bg-dark-900 border border-slate-800 hover:border-teal-500/40 px-5 py-3 rounded-xl transition-all"
          >
            <span>Have another bottleneck in your business? Get a free workflow audit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
}
