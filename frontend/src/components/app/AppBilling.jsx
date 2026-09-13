import React, { useState } from 'react';
import { 
  CreditCard, Check, ArrowRight, ShieldCheck, 
  Lock, Sparkles, RefreshCw, X, FileText, CheckCircle2 
} from 'lucide-react';
import { PRICING_CONFIG } from '../../data/forgePlatformConfig';

export function AppBilling() {
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] = useState(null);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);

  const handleCheckout = (e) => {
    e.preventDefault();
    setIsProcessingCheckout(true);
    setTimeout(() => {
      setIsProcessingCheckout(false);
      setUpgradeSuccess(true);
      setSelectedPlanForUpgrade(null);
    }, 1200);
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto font-sans">
      
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-mono font-bold uppercase">
          <CreditCard className="w-3.5 h-3.5" /> SUBSCRIPTIONS & STRIPE BILLING
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Manage Plans & Billing Portal
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Transparent, usage-bounded subscription tiers. All upgrades include seamless credit pooling and SLA guarantees.
        </p>
      </div>

      {upgradeSuccess && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/40 text-xs font-mono text-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>SUBSCRIPTION UPGRADE PROVISIONED VIA STRIPE BILLING</span>
          </div>
          <span className="text-slate-400">Next Billing: Oct 13, 2026</span>
        </div>
      )}

      {/* Current Plan Overview Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#090e18] border border-teal-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6 font-mono text-xs">
        <div className="space-y-1">
          <div className="text-teal-400 uppercase text-[10px] font-bold">Current Subscription Tier</div>
          <div className="text-2xl font-black text-white font-sans">Free 14-Day Trial</div>
          <div className="text-slate-400 font-sans text-xs">Active sandbox environment with 100 action credits.</div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedPlanForUpgrade(PRICING_CONFIG.plans[2])}
            className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl text-xs transition-all shadow-md"
          >
            Upgrade to Growth Plan →
          </button>
        </div>
      </div>

      {/* Plans Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PRICING_CONFIG.plans.map((plan) => {
          const isPopular = plan.isPopular;
          return (
            <div
              key={plan.id}
              className={`p-6 rounded-3xl border flex flex-col justify-between space-y-6 font-mono text-xs transition-all relative ${
                isPopular
                  ? 'border-teal-400/80 bg-[#0d1624] shadow-xl shadow-teal-500/15 scale-[1.02]'
                  : 'border-slate-800 bg-[#090e18]'
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-teal-500 text-dark-950 font-black text-[9px] uppercase tracking-wider">
                  MOST POPULAR
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <div className="text-base font-bold text-white font-sans">{plan.name}</div>
                  <div className="text-[11px] text-slate-400 font-sans pt-1 leading-snug">{plan.tagline}</div>
                </div>

                <div className="py-2 border-y border-slate-800/80">
                  <div className="text-2xl font-black text-white">
                    {typeof plan.priceMonthly === 'number' ? `$${plan.priceMonthly}` : plan.priceMonthly}
                    {typeof plan.priceMonthly === 'number' && <span className="text-xs text-slate-500 font-normal"> / mo</span>}
                  </div>
                  <div className="text-[10px] text-teal-400 pt-0.5 font-bold">
                    {typeof plan.creditsMonthly === 'number' ? `${plan.creditsMonthly.toLocaleString()} actions/mo` : plan.creditsMonthly}
                  </div>
                </div>

                <ul className="space-y-2 text-[11px] text-slate-300 font-sans">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setSelectedPlanForUpgrade(plan)}
                className={`w-full py-2.5 rounded-xl font-bold transition-all text-center ${
                  isPopular
                    ? 'bg-teal-500 hover:bg-teal-400 text-dark-950 shadow-md'
                    : 'bg-dark-950 hover:bg-slate-850 text-slate-200 border border-slate-800'
                }`}
              >
                {plan.ctaText}
              </button>
            </div>
          );
        })}
      </div>

      {/* Stripe Checkout Modal */}
      {selectedPlanForUpgrade && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#090e18] border border-teal-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl font-mono text-xs text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="space-y-0.5">
                <h3 className="text-lg font-bold text-white font-sans">Upgrade to {selectedPlanForUpgrade.name}</h3>
                <div className="text-[10px] text-teal-400">
                  {typeof selectedPlanForUpgrade.priceMonthly === 'number' ? `$${selectedPlanForUpgrade.priceMonthly}/mo` : 'Custom Scope'}
                </div>
              </div>
              <button
                onClick={() => setSelectedPlanForUpgrade(null)}
                className="p-1 rounded-lg bg-dark-900 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCheckout} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-dark-950 border border-slate-800 space-y-2">
                <div className="text-slate-400 text-[10px]">PAYMENT METHOD (STRIPE TEST CHECKOUT)</div>
                <div className="flex items-center gap-3 text-white font-mono text-xs">
                  <CreditCard className="w-4 h-4 text-teal-400" />
                  <span>•••• •••• •••• 4242 (Visa)</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 flex items-center gap-1.5 font-sans">
                <Lock className="w-3 h-3 text-teal-400" />
                <span>PCI-DSS Level 1 Encrypted Stripe Settlement Portal</span>
              </div>

              <button
                type="submit"
                disabled={isProcessingCheckout}
                className="w-full py-3.5 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
              >
                {isProcessingCheckout ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                <span>AUTHORIZE SUBSCRIPTION VIA STRIPE</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
