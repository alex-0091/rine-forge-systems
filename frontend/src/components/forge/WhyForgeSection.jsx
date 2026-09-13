import React from 'react';
import { Briefcase, Settings2, Unlink2, BarChart3, UserCheck, ShieldCheck } from 'lucide-react';

export function WhyForgeSection() {
  const reasons = [
    {
      title: 'BUSINESS-FIRST',
      subtitle: 'Workflow over hype',
      desc: 'We start by deeply understanding your operational friction, not by forcing a trendy model onto a problem that doesn’t need it.',
      icon: Briefcase
    },
    {
      title: '100% CUSTOM ARCHITECTURE',
      subtitle: 'Engineered for your rules',
      desc: 'Your systems are designed around your exact business logic, terminology, compliance requirements, and edge cases.',
      icon: Settings2
    },
    {
      title: 'SEAMLESSLY INTEGRATED',
      subtitle: 'Enhance your existing stack',
      desc: 'We connect directly to your CRM, ERP, email, database, and messaging tools without forcing team re-training.',
      icon: Unlink2
    },
    {
      title: 'MEASURABLE OUTCOMES',
      subtitle: 'Quantified impact',
      desc: 'We define success using concrete business metrics: hours recovered, leads qualified, response latency, and operational cost.',
      icon: BarChart3
    },
    {
      title: 'HUMAN-OVERSIGHT READY',
      subtitle: 'Safety & policy gates',
      desc: 'High-stakes decisions and financial actions can be routed to human team members for 1-click verification before dispatch.',
      icon: UserCheck
    },
    {
      title: 'BUILT FOR PRODUCTION',
      subtitle: 'Engineered beyond the demo',
      desc: 'We architect systems with async failovers, strict rate limits, and zero-data retention policies that withstand daily production loads.',
      icon: ShieldCheck
    }
  ];

  return (
    <section className="py-16 sm:py-24 border-b border-slate-800/80 bg-[#080c14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="text-xs font-mono font-bold text-teal-400 tracking-widest uppercase">
            ENGINEERING PHILOSOPHY
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            WHY BUSINESSES CHOOSE FORGE.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            We don't sell AI hype. We identify expensive repetitive work and build systems that actually do it.
          </p>
        </div>

        {/* 6 Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((r, idx) => {
            const Icon = r.icon;
            return (
              <div
                key={idx}
                className="bg-dark-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 sm:p-7 space-y-4 transition-all shadow-lg group"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/25 flex items-center justify-center text-teal-400">
                  <Icon className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-white tracking-wide font-mono">
                    {r.title}
                  </h3>
                  <div className="text-xs text-teal-400 font-mono font-medium">
                    {r.subtitle}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {r.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
