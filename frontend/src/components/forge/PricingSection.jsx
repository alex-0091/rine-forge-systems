import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Layers, Cpu } from 'lucide-react';

export function PricingSection({ onNavigate }) {
  const tiers = [
    {
      name: 'PILOT WORKFLOW',
      badge: 'PROVE VALUE FIRST',
      tagline: 'Ideal for isolating and automating one high-friction, high-value process.',
      features: [
        'Single end-to-end workflow automation',
        'Direct connection to 1–2 existing software tools (CRM, Email)',
        'Zero-hallucination policy guardrails & human approval gate',
        '7–14 day deployment timeline',
        '14-day post-launch optimization & warranty'
      ],
      scope: 'Single Agent / Process'
    },
    {
      name: 'CONNECTED SYSTEM',
      badge: 'POPULAR ENGAGEMENT',
      tagline: 'For connecting multiple departments and eliminating cross-tool manual data entry.',
      features: [
        '2–4 multi-step connected AI agents',
        'Bi-directional sync across CRM, ERP, messaging, and database',
        'Custom webhooks, data normalization, and PDF OCR parsing',
        'Role-based human-in-the-loop approval routing (Slack/Email)',
        '30-day monitoring, performance SLA, and prompt refinement'
      ],
      scope: 'Multi-Workflow Architecture'
    },
    {
      name: 'CUSTOM INFRASTRUCTURE',
      badge: 'ENTERPRISE',
      tagline: 'For complex, proprietary operations requiring specialized multi-agent architectures.',
      features: [
        'Fully bespoke agent network and decision-support engines',
        'High-frequency timeseries, custom microservices, or private RAG vaults',
        'Dedicated edge deployment with auto-failovers',
        'Comprehensive security review, role-based access, and immutable logging',
        'Ongoing quarterly optimization & technical partnership'
      ],
      scope: 'Bespoke Enterprise Systems'
    }
  ];

  return (
    <section id="pricing" className="py-16 sm:py-24 border-b border-slate-800/80 bg-[#080c14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="text-xs font-mono font-bold text-teal-400 tracking-widest uppercase">
            COMMERCIAL TRANSPARENCY
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            WHAT DOES AI AUTOMATION COST?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Every business starts from a different workflow. Projects are scoped around the complexity, integrations, and level of automation required — with fixed milestones and zero unexpected charges.
          </p>
        </div>

        {/* 3 Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`bg-dark-900 border rounded-3xl p-6 sm:p-8 space-y-6 transition-all flex flex-col justify-between shadow-xl ${
                idx === 1 ? 'border-teal-500/50 shadow-teal-500/10' : 'border-slate-800'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-black text-white tracking-wider">
                    {tier.name}
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 bg-dark-950 text-teal-400 border border-slate-800 rounded font-bold">
                    {tier.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {tier.tagline}
                </p>

                <div className="p-3 bg-dark-950 rounded-xl border border-slate-850 text-[11px] font-mono text-slate-400">
                  <span>Scope: <strong className="text-teal-400">{tier.scope}</strong></span>
                </div>

                {/* Features list */}
                <div className="space-y-2.5 pt-2">
                  <div className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">What’s Included:</div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {tier.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80">
                <button
                  onClick={() => onNavigate('audit')}
                  className={`w-full py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                    idx === 1 
                      ? 'bg-teal-500 hover:bg-teal-400 text-dark-950 shadow-md shadow-teal-500/20' 
                      : 'bg-dark-950 hover:bg-dark-850 text-slate-200 border border-slate-700'
                  }`}
                >
                  <span>DISCUSS YOUR WORKFLOW →</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
