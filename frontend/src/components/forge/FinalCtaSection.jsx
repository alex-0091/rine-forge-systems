import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Play, ArrowUpRight } from 'lucide-react';
import { forgeAudioSynth } from '../../utils/forgeAudioSynth';

export function FinalCtaSection({ onOpenAuditModal, onScrollToDemo }) {
  const handleAudit = () => {
    forgeAudioSynth.playSuccess();
    if (onOpenAuditModal) onOpenAuditModal();
  };

  const handleDemo = () => {
    forgeAudioSynth.playClick();
    if (onScrollToDemo) {
      onScrollToDemo();
    } else {
      const el = document.getElementById('cinematic-workflow') || document.getElementById('live-receptionist');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="final-cta" className="py-24 sm:py-32 bg-[#060a12] border-b border-white/[0.08] relative overflow-hidden">
      
      {/* Subtle controlled ambient backlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-indigo-600/[0.08] blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-10 z-10">
        
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-mono font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Zero-Risk Opportunity Review</span>
        </div>

        {/* Main Headline */}
        <div className="space-y-5 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Let's build the system your business <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white to-sky-300">
              has been missing.
            </span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
            Tell us where your team is spending time, losing leads, or repeating the same work. We'll show you what can realistically be automated.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={handleAudit}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm rounded-xl transition-all shadow-[0_0_25px_rgba(99,102,241,0.35)] hover:shadow-[0_0_35px_rgba(99,102,241,0.5)] flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
          >
            <span>GET YOUR FREE AI AUDIT</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleDemo}
            className="w-full sm:w-auto px-8 py-4 bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 hover:text-white border border-white/[0.12] hover:border-white/[0.2] font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <span>SEE A DEMO</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Reassurances */}
        <div className="pt-6 border-t border-white/[0.08] grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-xs text-slate-400">
          <div className="flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>100% Free Assessment</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>No Obligation or Pressure</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Works With Your Current Tools</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Human-Supported</span>
          </div>
        </div>

      </div>
    </section>
  );
}
