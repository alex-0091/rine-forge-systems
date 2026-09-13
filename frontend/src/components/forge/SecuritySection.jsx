import React from 'react';
import { ShieldCheck, Key, Lock, Eye, AlertTriangle, Activity, Database, CheckSquare, Info } from 'lucide-react';

export function SecuritySection() {
  const securityTenets = [
    {
      title: 'Controlled Access & Vaults',
      desc: 'All API keys and database credentials are encrypted at rest using isolated environment vaults with rotated tokens.',
      icon: Key
    },
    {
      title: 'Least-Privilege Architecture',
      desc: 'AI agents only receive read/write permissions for specific tables and tools strictly required for their operational role.',
      icon: Lock
    },
    {
      title: 'Human-in-the-Loop Approvals',
      desc: 'Sensitive financial, contractual, or irreversible actions trigger mandatory human review checkpoints before API execution.',
      icon: CheckSquare
    },
    {
      title: 'Immutable Audit Logging',
      desc: 'Every inbound payload, decision reason, agent prompt, and outbound action is recorded in timestamped operational logs.',
      icon: Eye
    },
    {
      title: 'Deterministic Fallback Logic',
      desc: 'If an API fails or confidence thresholds drop, the system automatically routes to secondary endpoints or human reps.',
      icon: AlertTriangle
    },
    {
      title: 'Zero-Data-Retention Pipelines',
      desc: 'We utilize enterprise model endpoints with strict policies ensuring your proprietary business data is never used for training.',
      icon: Database
    }
  ];

  return (
    <section className="py-16 sm:py-24 border-b border-slate-800/80 bg-[#080c14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="text-xs font-mono font-bold text-teal-400 tracking-widest uppercase">
            ENTERPRISE GOVERNANCE & SECURITY
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            AI THAT YOUR BUSINESS CAN TRUST.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            We engineer autonomous systems with rigorous defensive security, least-privilege API scopes, and complete governance.
          </p>
        </div>

        {/* Security Tenets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securityTenets.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-dark-900 border border-slate-800 rounded-2xl p-6 space-y-3 shadow-lg"
              >
                <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white tracking-wide">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Honest Security Disclaimer */}
        <div className="p-4 bg-dark-950 rounded-2xl border border-slate-800 flex items-start gap-3 max-w-3xl mx-auto text-xs font-mono text-slate-400 leading-relaxed">
          <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-slate-200">Security Architecture Policy:</strong> Security requirements are evaluated according to the specific systems, data classification, and API integrations involved in each client engagement.
          </span>
        </div>

      </div>
    </section>
  );
}
