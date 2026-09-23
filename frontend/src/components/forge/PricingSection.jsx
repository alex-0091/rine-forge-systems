import React from 'react';
import { 
  ArrowRight, CheckCircle2, ShieldCheck, Sparkles, 
  Layers, Cpu, Zap, Lock, Clock, HelpCircle, FileCheck
} from 'lucide-react';
import { PRICING_PACKAGES } from '../PaymentPortalModal';
import { forgeAudioSynth } from '../../utils/forgeAudioSynth';

export function PricingSection({ onNavigate, onOpenPaymentModal }) {
  return (
    <section id="pricing" className="py-20 sm:py-28 border-b border-white/[0.08] bg-[#080c14] relative">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-indigo-600/[0.05] blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-mono font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Honest, Transparent Pricing</span>
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Clear Pricing. Milestone Delivery. <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-sky-200 to-white">
              Zero Guesswork.
            </span>
          </h2>
          
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            No endless hourly consulting. Every system is scoped as a fixed-price deployment. Lock your build slot with a 50% milestone deposit—the remaining balance is only settled after you test and approve your live system.
          </p>
        </div>

        {/* 4 Clarity Pillars: What You Get / What You Pay / What Setup Involves / What Happens Next */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          <div className="p-5 rounded-2xl bg-[#0c101a] border border-white/[0.08] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Layers className="w-4 h-4" />
            </div>
            <div className="text-xs font-mono uppercase tracking-wider text-indigo-300 font-bold">1. What You Get</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              A fully configured, dedicated AI system integrated with your existing phone line, calendar, and CRM.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0c101a] border border-white/[0.08] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Lock className="w-4 h-4" />
            </div>
            <div className="text-xs font-mono uppercase tracking-wider text-emerald-300 font-bold">2. What You Pay</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Flat setup fee ($199–$799). 50% deposit to begin engineering, 50% only when tested and operational.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0c101a] border border-white/[0.08] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-xs font-mono uppercase tracking-wider text-sky-300 font-bold">3. What Setup Involves</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              3 to 5 business days. We map your FAQs, configure call handling rules, connect your tools, and run end-to-end testing.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0c101a] border border-white/[0.08] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <FileCheck className="w-4 h-4" />
            </div>
            <div className="text-xs font-mono uppercase tracking-wider text-amber-300 font-bold">4. What Happens Next</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Reserve your slot, complete a 10-minute business intake form, test your interactive staging sandbox, and launch.
            </p>
          </div>
        </div>

        {/* 4 Deployment Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {PRICING_PACKAGES.map((tier) => (
            <div
              key={tier.id}
              className={`bg-[#0c101a] border rounded-3xl p-6 sm:p-7 space-y-6 transition-all flex flex-col justify-between shadow-xl ${
                tier.popular 
                  ? 'border-indigo-500/70 shadow-[0_0_35px_rgba(99,102,241,0.2)] ring-1 ring-indigo-500/40' 
                  : 'border-white/[0.08] hover:border-white/[0.16]'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white tracking-wider font-mono uppercase">
                    {tier.name}
                  </span>
                  {tier.popular && (
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 rounded-md font-bold">
                      MOST POPULAR
                    </span>
                  )}
                </div>

                {/* Honest Flat Price Display */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-white font-mono">${tier.discountPrice}</span>
                    <span className="text-xs text-slate-400 font-mono">flat setup fee</span>
                  </div>
                  <div className="inline-block text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-md font-semibold">
                    50% Milestone Deposit: ${tier.depositRequired}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {tier.tagline}
                </p>

                {/* Features list */}
                <div className="space-y-2.5 pt-3 border-t border-white/[0.06]">
                  <div className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">
                    Included Deliverables:
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {tier.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.06] space-y-2">
                <button
                  onClick={() => {
                    forgeAudioSynth.playClick();
                    if (onOpenPaymentModal) {
                      onOpenPaymentModal(tier.id);
                    } else if (onNavigate) {
                      onNavigate('payment');
                    }
                  }}
                  className={`w-full py-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] ${
                    tier.popular 
                      ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.35)]' 
                      : 'bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.1]'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Reserve Setup (${tier.depositRequired} Deposit) →</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Commercial Escrow Guarantee */}
        <div className="max-w-4xl mx-auto p-5 rounded-2xl bg-[#0c101a] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white">Accepted Verified Settlement Rails</div>
              <div className="text-slate-400 text-[11px] mt-0.5">
                Official Ziraat Bank (Euro IBAN, Dollar IBAN) & USDT BNB Smart Chain (BEP20).
              </div>
            </div>
          </div>
          
          <button
            onClick={() => {
              forgeAudioSynth.playClick();
              if (onNavigate) onNavigate('payment');
            }}
            className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-semibold text-white flex items-center gap-1.5 shrink-0 transition-colors"
          >
            <span>Open Settlement Terminal</span>
            <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
          </button>
        </div>

      </div>
    </section>
  );
}
