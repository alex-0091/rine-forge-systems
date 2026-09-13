import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Clock, CheckCircle2, Lock, Flame } from 'lucide-react';
import { forgeAudioSynth } from '../../utils/forgeAudioSynth';

export function FinalCtaSection({ onNavigate }) {
  return (
    <section className="py-24 sm:py-32 border-t border-slate-800/80 bg-gradient-to-b from-[#080d1a] to-[#04060a] relative overflow-hidden" id="final-cta">
      {/* Background glow accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-teal-500/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-10">
        
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold tracking-wider uppercase shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          <span>ZERO-RISK OPERATIONAL REVIEW</span>
        </div>

        {/* Main Headline */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            READY TO DELETE <br />
            <span className="text-teal-400">REPETITIVE WORK?</span>
          </h2>
          <div className="text-lg sm:text-xl font-bold text-slate-100 font-sans">
            GET YOUR FREE AI AUTOMATION AUDIT
          </div>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
            We'll analyze your current operations, identify 3–5 high-friction tasks your business could automate, and show you exactly how our AI employees would execute them.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 font-mono text-xs">
          <button
            onClick={() => {
              forgeAudioSynth.playSuccess();
              if (onNavigate) onNavigate('audit');
            }}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-dark-950 font-black rounded-2xl transition-all shadow-xl shadow-teal-500/25 flex items-center justify-center gap-2 group hover:scale-105"
          >
            <span>SEE WHAT YOUR BUSINESS COULD AUTOMATE</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => {
              forgeAudioSynth.playClick();
              const el = document.getElementById('watch-demos');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              else if (onNavigate) onNavigate('watch-demos');
            }}
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-700 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 hover:scale-105"
          >
            <span>WATCH HOW IT WORKS →</span>
          </button>
        </div>

        {/* Trust Markers */}
        <div className="pt-6 border-t border-slate-800/60 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-xs font-mono text-slate-400">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>100% Free Blueprint</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 text-teal-400 shrink-0" />
            <span>20-Minute Walkthrough</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Strict NDA & Privacy</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Zero Sales Pressure</span>
          </div>
        </div>

      </div>
    </section>
  );
}
