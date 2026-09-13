import React from 'react';
import { Cpu, Zap, Database, Globe, Network, ShieldCheck, CheckCircle2, Lock, ArrowUpRight } from 'lucide-react';

export function BuiltForRealBusinessWork() {
  const techPillars = [
    {
      title: 'AI & LLM Reasoning',
      badge: 'DETERMINISTIC GUARDRAILS',
      desc: 'Structured JSON validation, verified system prompts, and deterministic logic trees to prevent hallucinations.',
      icon: Cpu,
      color: 'cyan'
    },
    {
      title: 'Autonomous Workflows',
      badge: 'EVENT-DRIVEN',
      desc: 'High-throughput background queues, retry policies with backoff, and asynchronous execution across all channels.',
      icon: Zap,
      color: 'teal'
    },
    {
      title: 'CRM Synchronization',
      badge: '2-WAY DATA INTEGRITY',
      desc: 'Real-time synchronization with customer records, booking calendars, deal stages, and contact timelines.',
      icon: Database,
      color: 'indigo'
    },
    {
      title: 'REST APIs & Webhooks',
      badge: 'SUB-SECOND LATENCY',
      desc: 'Modern webhook listeners and authenticated REST API integrations connecting your existing business tools.',
      icon: Network,
      color: 'violet'
    },
    {
      title: 'Omnichannel Routing',
      badge: 'VOICE & TEXT',
      desc: 'Unified ingestion for WhatsApp Business, telephony VoIP streams, SMS gateways, and website live chat.',
      icon: Globe,
      color: 'emerald'
    }
  ];

  return (
    <section className="py-16 sm:py-24 border-b border-slate-800/80 bg-[#050913] relative overflow-hidden" id="trust-tech">
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-indigo-500/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono font-bold tracking-wider uppercase shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>TRANSPARENT SYSTEM ARCHITECTURE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            BUILT FOR REAL BUSINESS WORK
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            We don't sell AI hype or claim partnerships that don't exist. FORGE is engineered on proven, production-grade technologies designed for uptime, security, and measurable execution.
          </p>
        </div>

        {/* 5 Architecture Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {techPillars.map((tech, idx) => {
            const Icon = tech.icon;
            return (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-[#080e1c]/80 border border-slate-800/90 hover:border-teal-500/40 transition-all duration-300 flex flex-col justify-between space-y-4 shadow-lg group hover:scale-[1.02]"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-teal-400 group-hover:text-teal-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                      {tech.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white font-mono">
                    {tech.title}
                  </h3>

                  <p className="text-xs text-slate-300 mt-2 font-sans leading-relaxed">
                    {tech.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-900 font-mono text-[10px] text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Production Ready</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Honest Trust Standards Strip */}
        <div className="p-5 rounded-2xl bg-[#070d1a] border border-slate-800 flex flex-wrap items-center justify-around gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-200">Zero Training on Client Data</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-200">Human-in-the-Loop Safeguards</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-200">Encrypted Endpoints & Webhooks</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-200">Complete Execution Audit Logs</span>
          </div>
        </div>

      </div>
    </section>
  );
}
