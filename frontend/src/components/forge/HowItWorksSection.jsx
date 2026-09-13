import React from 'react';
import { Search, Compass, Hammer, Rocket, LineChart, ArrowRight } from 'lucide-react';

export function HowItWorksSection({ onNavigate }) {
  const stages = [
    {
      num: '01',
      title: 'AUDIT',
      subtitle: 'Identify Bottlenecks',
      desc: 'We analyze your current operations to identify repetitive, expensive, and high-friction workflows where automation delivers maximum ROI.',
      icon: Search,
      deliverable: 'Workflow Bottleneck Matrix'
    },
    {
      num: '02',
      title: 'DESIGN',
      subtitle: 'Architecture & Governance',
      desc: 'We map the end-to-end process, specifying where AI reasoning, deterministic automation, and human-in-the-loop approval checkpoints belong.',
      icon: Compass,
      deliverable: 'Technical System Blueprint'
    },
    {
      num: '03',
      title: 'BUILD',
      subtitle: 'Engineering & Testing',
      desc: 'We develop the custom agents, integration pipelines, API connectors, and testing frameworks with strict zero-hallucination guardrails.',
      icon: Hammer,
      deliverable: 'Staging Environment Prototype'
    },
    {
      num: '04',
      title: 'DEPLOY',
      subtitle: 'Production Launch',
      desc: 'We connect the system directly to the tools your business already uses (CRM, email, database, Slack) with zero disruption to daily ops.',
      icon: Rocket,
      deliverable: 'Live Production Integration'
    },
    {
      num: '05',
      title: 'OPTIMIZE',
      subtitle: 'Monitoring & Tuning',
      desc: 'We monitor execution telemetry, track latency and resolution rates, and continuously refine prompts and logic as your business scales.',
      icon: LineChart,
      deliverable: 'Performance SLA & Monitoring'
    }
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 border-b border-slate-800/80 bg-[#080c14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="text-xs font-mono font-bold text-teal-400 tracking-widest uppercase">
            STRUCTURED IMPLEMENTATION PROCESS
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            FROM IDEA TO PRODUCTION.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Our disciplined five-stage methodology ensures every system is thoroughly mapped, strictly validated, and reliably integrated before handling production traffic.
          </p>
        </div>

        {/* 5 Stages Flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            return (
              <div
                key={idx}
                className="bg-dark-900 border border-slate-800 hover:border-teal-500/40 rounded-2xl p-5 sm:p-6 space-y-4 transition-all flex flex-col justify-between shadow-lg relative group"
              >
                <div className="space-y-3">
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black font-mono text-teal-400">
                      {stage.num}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-dark-950 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-teal-400 group-hover:border-teal-500/30 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white tracking-wide">
                      {stage.title}
                    </h3>
                    <div className="text-[11px] font-mono text-teal-400 font-medium">
                      {stage.subtitle}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {stage.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80">
                  <div className="text-[9px] font-mono text-slate-400 uppercase">Deliverable:</div>
                  <div className="text-[11px] font-mono font-bold text-slate-200 truncate">
                    {stage.deliverable}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Trigger */}
        <div className="pt-4 text-center">
          <button
            onClick={() => onNavigate('audit')}
            className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl text-xs sm:text-sm transition-all shadow-xl shadow-teal-500/20 inline-flex items-center gap-2"
          >
            <span>START STAGE 01 — REQUEST YOUR FREE WORKFLOW AUDIT</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
