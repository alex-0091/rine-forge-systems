import React from 'react';
import { ShieldCheck, UserCheck, Wrench, Sparkles, Check, X, ArrowRight } from 'lucide-react';
import { forgeAudioSynth } from '../../../utils/forgeAudioSynth';

export function WhyRineSection({ onOpenAuditModal }) {
  const pillars = [
    {
      title: 'Built Around Your Business',
      description: 'We do not give every company the same chatbot. We configure your system around your specific services, hours, pricing, booking rules, and communication style.',
      icon: Wrench
    },
    {
      title: 'Human Oversight & Control',
      description: 'AI handles the routine, repetitive work that burns out your staff. You set the rules, view full call transcripts, and remain in complete control at all times.',
      icon: UserCheck
    },
    {
      title: 'Practical, Measurable Automation',
      description: 'We focus on systems that solve actual business problems—recovering missed calls, capturing leads, and booking appointments—not adding another unused dashboard.',
      icon: Sparkles
    },
    {
      title: 'No Technical Knowledge Required',
      description: 'You do not have to write prompts, manage APIs, or configure integrations. We build, test, deploy, and maintain the system for you.',
      icon: ShieldCheck
    }
  ];

  const comparisons = [
    {
      factor: 'How it fits your workflow',
      offTheShelf: 'You must adapt your operations to match their rigid software structure.',
      rineForge: 'We engineer the system around how your business already operates.'
    },
    {
      factor: 'Setup & Configuration',
      offTheShelf: 'You spend hours watching tutorials and configuring complex settings yourself.',
      rineForge: 'We build, configure, test, and connect everything for you from end to end.'
    },
    {
      factor: 'Daily Management',
      offTheShelf: 'Yet another software subscription and dashboard nobody on your team logs into.',
      rineForge: 'Quiet background automation that delivers appointments and alerts to your phone.'
    },
    {
      factor: 'Integrations',
      offTheShelf: 'Limited to basic plugins or requires expensive third-party Zapier plans.',
      rineForge: 'Native integration with your existing phone lines, Google Calendar, CRM, and SMS.'
    }
  ];

  return (
    <section id="why-rine" className="py-20 sm:py-28 bg-[#080c14] border-b border-white/[0.08] relative">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-mono font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Why Rine Forge</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Not another tool. <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-sky-200 to-white">
              A system built around your business.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Your business doesn't need another complicated SaaS app to learn. It needs systems that actually do the work.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {pillars.map((pil, idx) => {
            const Icon = pil.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#0c101a] border border-white/[0.08] hover:border-white/[0.16] transition-all space-y-3 shadow-lg"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">
                  {pil.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {pil.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Head-to-Head Comparison Table */}
        <div className="max-w-4xl mx-auto bg-[#0c101a] border border-white/[0.1] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl space-y-6">
          <div className="text-center space-y-2 border-b border-white/[0.08] pb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Off-The-Shelf Software vs. Rine Forge Systems
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Why business owners prefer engineered automation over self-serve software subscriptions.
            </p>
          </div>

          <div className="space-y-4">
            {comparisons.map((cmp, idx) => (
              <div 
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
              >
                <div className="md:col-span-4 font-bold text-xs sm:text-sm text-white">
                  {cmp.factor}
                </div>

                <div className="md:col-span-4 text-xs text-slate-400 flex items-start gap-2 bg-rose-950/20 border border-rose-500/20 p-3 rounded-xl">
                  <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono text-[10px] text-rose-300 uppercase block font-bold">Typical Software</span>
                    <span className="text-slate-300">{cmp.offTheShelf}</span>
                  </div>
                </div>

                <div className="md:col-span-4 text-xs text-slate-200 flex items-start gap-2 bg-indigo-950/20 border border-indigo-500/30 p-3 rounded-xl">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono text-[10px] text-indigo-300 uppercase block font-bold">Rine Forge</span>
                    <span className="text-white font-medium">{cmp.rineForge}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Institutional Guarantee Banner */}
          <div className="pt-6 max-w-4xl mx-auto">
            <div className="rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl">
              <img 
                src="/images/enterprise-security-shield.svg" 
                alt="Institutional privacy and escrow guarantee seal" 
                className="w-full h-auto" 
                loading="lazy"
              />
            </div>
          </div>

          <div className="pt-4 text-center">
            <button
              onClick={() => {
                forgeAudioSynth.playClick();
                if (onOpenAuditModal) onOpenAuditModal();
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm transition-all shadow-[0_0_20px_rgba(99,102,241,0.35)]"
            >
              <span>Get Your Free Opportunity Audit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
