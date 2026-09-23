import React from 'react';
import { Search, Compass, Cpu, Activity, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { forgeAudioSynth } from '../../../utils/forgeAudioSynth';

export function HowItWorksTimeline({ onOpenAuditModal }) {
  const steps = [
    {
      num: '01',
      title: 'DISCOVER',
      subtitle: 'We understand your workflow & bottlenecks',
      description: 'You tell us what your business does and where you are losing time, leads, or repeating manual work. We review your current tools, hours, services, and call volume.',
      deliverable: 'Free AI Opportunity Audit + Workflow Map'
    },
    {
      num: '02',
      title: 'DESIGN',
      subtitle: 'We map the exact automation architecture',
      description: 'We craft the conversational guidelines, approved service knowledge, booking rules, and integration paths between your phone lines, CRM, and calendar.',
      deliverable: 'Deterministic System Blueprint & Edge-Case Plan'
    },
    {
      num: '03',
      title: 'BUILD & TEST',
      subtitle: 'We connect the AI, tools, and guardrails',
      description: 'We configure and stress-test the system with real-world scenarios. We simulate difficult caller queries and verify every calendar booking and notification.',
      deliverable: 'Private Staging Sandbox for Your Review'
    },
    {
      num: '04',
      title: 'OPERATE',
      subtitle: 'Your system goes live with human support',
      description: 'Your system launches. It answers calls, captures leads, and synchronizes bookings in the background. We monitor performance and refine responses continuously.',
      deliverable: 'Ongoing Monitoring, Model Updates & Warranty'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-[#070b12] border-b border-white/[0.08] relative">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-mono font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            <span>Clear & Predictable Deployment</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            How It Works
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            We handle the heavy lifting from end to end. You don't need technical knowledge, prompt engineering skills, or software configurations.
          </p>
        </div>

        {/* 4 Steps Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {steps.map((st, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-7 rounded-3xl bg-[#0c101a] border border-white/[0.08] hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-6 shadow-xl relative group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <span className="text-2xl font-black font-mono text-indigo-400">
                    {st.num}
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400 bg-white/[0.04] px-2.5 py-1 rounded-md border border-white/[0.08]">
                    {st.title}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-indigo-200 transition-colors">
                  {st.subtitle}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {st.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.06] space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">Outcome</span>
                <div className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{st.deliverable}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Easy Process Reassurance Box */}
        <div className="max-w-3xl mx-auto p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] text-center space-y-3">
          <div className="text-xs sm:text-sm font-bold text-white">
            Most single-system implementations launch within 7 to 10 days.
          </div>
          <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
            You keep your existing phone numbers, calendar, and software. We build the automation around how you already run your business.
          </p>
          <div className="pt-1">
            <button
              onClick={() => {
                forgeAudioSynth.playClick();
                if (onOpenAuditModal) onOpenAuditModal();
              }}
              className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <span>Get started with a free opportunity audit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
