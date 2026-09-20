import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Layers, Cpu, Zap, Lock } from 'lucide-react';
import { PRICING_PACKAGES } from '../PaymentPortalModal';

export function PricingSection({ onNavigate, onOpenPaymentModal }) {
  return (
    <section id="pricing" className="py-16 sm:py-24 border-b border-white/[0.08] bg-[#080b11] relative">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-indigo-600/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-mono font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>TRANSPARENT STARTER PRICING</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Production AI Infrastructure. Scoped for Maximum ROI.
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Choose your deployment tier with guaranteed fixed milestones. Lock in staging with a 50% milestone deposit — remaining balance is only settled once your system is live and verified.
          </p>
        </div>

        {/* 4 Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRICING_PACKAGES.map((tier) => (
            <div
              key={tier.id}
              className={`bg-[#0d121f]/80 backdrop-blur-xl border rounded-3xl p-6 space-y-6 transition-all flex flex-col justify-between shadow-[0_16px_40px_rgba(0,0,0,0.4)] ${
                tier.popular 
                  ? 'border-indigo-500/80 shadow-[0_0_30px_rgba(99,102,241,0.2)] ring-1 ring-indigo-500/40' 
                  : 'border-white/[0.08] hover:border-white/[0.16]'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white tracking-wider">
                    {tier.name}
                  </span>
                  {tier.popular && (
                    <span className="text-[9px] font-mono px-2 py-0.5 bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded-md font-bold">
                      TOP VALUE
                    </span>
                  )}
                </div>

                {/* Price Display */}
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white font-mono">${tier.discountPrice}</span>
                    <span className="text-xs text-slate-500 line-through font-mono">${tier.regularPrice}</span>
                    <span className="text-[10px] text-slate-400 font-mono">one-time</span>
                  </div>
                  <div className="inline-block text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-md font-semibold">
                    50% Milestone Deposit: ${tier.depositRequired}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {tier.tagline}
                </p>

                {/* Features list */}
                <div className="space-y-2.5 pt-2 border-t border-white/[0.06]">
                  <div className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">Included Capabilities:</div>
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
                    if (onOpenPaymentModal) {
                      onOpenPaymentModal(tier.id);
                    } else if (onNavigate) {
                      onNavigate('payment');
                    }
                  }}
                  className={`w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    tier.popular 
                      ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]' 
                      : 'bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.1]'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Lock Staging (${tier.depositRequired}) →</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Commercial Escrow Guarantee */}
        <div className="max-w-3xl mx-auto p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-slate-300">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span><strong>Accepted Settlement Rails:</strong> Ziraat Bank Euro IBAN, Dollar IBAN, and USDT BNB Smart Chain (BEP20).</span>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('payment')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 shrink-0"
          >
            <span>Open Settlement Terminal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
}
