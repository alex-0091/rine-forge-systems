import React, { useState } from 'react';
import { Search, Compass, Cpu, Network, Rocket, TrendingUp, ArrowDown, CheckCircle2, Sparkles } from 'lucide-react';
import { forgeAudioSynth } from '../../../utils/forgeAudioSynth';

export function ProcessTimelineSection() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '01',
      title: 'DISCOVER',
      tag: 'Audit & Analysis',
      desc: 'We identify repetitive work.',
      detail: 'We analyze your communication volume, missed calls, and manual administrative bottlenecks.',
      icon: Search,
      color: 'teal'
    },
    {
      num: '02',
      title: 'DESIGN',
      tag: 'Workflow Mapping',
      desc: 'We map the workflow.',
      detail: 'We document exact business policies, edge cases, routing rules, and escalation paths.',
      icon: Compass,
      color: 'cyan'
    },
    {
      num: '03',
      title: 'BUILD',
      tag: 'Custom Agent Creation',
      desc: 'We create the AI agent and automation.',
      detail: 'We train conversational personas, structured JSON extractors, and deterministic decision trees.',
      icon: Cpu,
      color: 'indigo'
    },
    {
      num: '04',
      title: 'CONNECT',
      tag: 'API Integration',
      desc: 'We integrate your existing tools.',
      detail: 'Direct two-way connectors to your WhatsApp Business, phone system, calendar, and CRM.',
      icon: Network,
      color: 'violet'
    },
    {
      num: '05',
      title: 'LAUNCH',
      tag: 'Go Live In Days',
      desc: 'Your system starts working.',
      detail: 'Deployment into production with zero disruption to existing day-to-day operations.',
      icon: Rocket,
      color: 'emerald'
    },
    {
      num: '06',
      title: 'OPTIMIZE',
      tag: 'Continuous Tuning',
      desc: 'We improve it based on real usage.',
      detail: 'Review transcript logs, tighten edge cases, and scale throughput as volume expands.',
      icon: TrendingUp,
      color: 'amber'
    }
  ];

  return (
    <section className="py-16 sm:py-24 border-b border-slate-800/80 bg-[#060914] relative overflow-hidden" id="process-timeline">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold tracking-wider uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>DEPLOYMENT METHODOLOGY</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight font-sans">
            FROM IDEA → AI SYSTEM
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            A clear, transparent engineering roadmap to take your operations from manual chaos to automated performance in under two weeks.
          </p>
        </div>

        {/* 6-Stage Process Grid / Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 relative">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            const isSelected = activeStep === idx;
            return (
              <div
                key={st.num}
                onClick={() => {
                  forgeAudioSynth.playClick();
                  setActiveStep(idx);
                }}
                className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-4 cursor-pointer hover:scale-[1.02] ${
                  isSelected
                    ? 'bg-gradient-to-b from-teal-950/80 to-[#07111e] border-teal-400 shadow-xl shadow-teal-500/20'
                    : 'bg-[#080e1c]/90 border-slate-800/90 hover:border-slate-700'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black font-mono text-teal-400">
                      {st.num}
                    </span>
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-white font-mono tracking-wider">
                      {st.title}
                    </h3>
                    <p className="text-xs font-bold text-teal-300 mt-1 font-sans">
                      {st.desc}
                    </p>
                  </div>

                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                    {st.detail}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-900 font-mono text-[9px] text-slate-500 uppercase">
                  Stage {st.num} Complete ✓
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
