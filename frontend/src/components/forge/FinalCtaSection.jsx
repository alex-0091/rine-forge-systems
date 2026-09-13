import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Clock, CheckCircle2, Lock } from 'lucide-react';

export function FinalCtaSection({ onNavigate }) {
  return (
    <section className="py-24 border-t border-slate-800/80 bg-gradient-to-b from-[#080c14] to-[#04060a] relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-teal-500/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-0 right-1/4 w-[300px] h-[200px] bg-indigo-500/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-10">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono font-bold tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> 48-HOUR ARCHITECTURE BLUEPRINT
        </div>

        {/* Main Headline */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            What could your business <span className="text-teal-400">stop doing manually</span> this month?
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
            Submit your primary operational bottleneck. We’ll analyze your workflow and return a complete technical implementation plan — with zero commitment and zero fluff.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => onNavigate && onNavigate('audit')}
            className="w-full sm:w-auto px-8 py-4 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl text-sm transition-all shadow-xl shadow-teal-500/25 flex items-center justify-center gap-2 group"
          >
            <span>GET YOUR FREE AI AUTOMATION AUDIT</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('solutions');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              else if (onNavigate) onNavigate('solutions');
            }}
            className="w-full sm:w-auto px-8 py-4 bg-dark-900 hover:bg-dark-850 text-slate-200 border border-slate-700 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
          >
            <span>SEE WHAT WE BUILD</span>
          </button>
        </div>

        {/* Trust & Guarantee Markers */}
        <div className="pt-6 border-t border-slate-800/60 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-xs font-mono text-slate-400">
          <div className="flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 text-teal-400 shrink-0" />
            <span>48-Hour Turnaround</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>100% Free Blueprint</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Strict NDA & Data Privacy</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>No Long-Term Lock-In</span>
          </div>
        </div>

      </div>
    </section>
  );
}
