import React from 'react';
import { Bot, Target, MessageSquare, Settings2, ArrowRight, Sparkles, CheckCircle2, Zap } from 'lucide-react';
import { forgeAudioSynth } from '../../../utils/forgeAudioSynth';
import { AiStatusBadge } from '../v4/AiStatusBadge';
import { ActionButton } from '../v4/ActionButton';

export function MeetAiEmployeesSection({ onWatchEmployeeDemo, onBuildAiEmployee, onTalkToReceptionist }) {
  const employees = [
    {
      id: 'receptionist',
      emoji: '🤖',
      role: 'AI RECEPTIONIST',
      status: 'ONLINE',
      summary: 'Answers customers, handles enquiries and books appointments.',
      icon: Bot,
      color: 'cyan',
      border: 'border-cyan-500/30 hover:border-cyan-400',
      bg: 'bg-[#06111a]/80',
      glow: 'shadow-cyan-500/10',
      textColor: 'text-cyan-400',
      demoData: {
        title: 'AI Receptionist In Action',
        subtitle: 'Inbound Patient Consultation Booking',
        steps: [
          { title: 'Inbound Ring / WhatsApp', detail: 'Customer reaches out: "Do you have any openings this Tuesday?"', badge: '0.4s LATENCY' },
          { title: 'Calendar Real-Time Scan', detail: 'Queries practitioner calendar across all treatment operatories.', badge: 'VERIFIED' },
          { title: 'Autonomous Booking', detail: 'Locks slot, dispatches SMS confirmation, updates schedule.', badge: 'COMPLETED ✓' }
        ]
      },
      visualSvg: (
        <div className="relative w-full h-24 rounded-xl bg-[#030910] border border-cyan-950 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#06b6d410_1px,transparent_1px)] [background-size:12px_12px]" />
          {/* Animated soundwaves & phone badge */}
          <div className="flex items-center gap-1.5 relative z-10">
            <span className="w-1.5 h-6 bg-cyan-400 rounded-full animate-pulse" />
            <span className="w-1.5 h-10 bg-cyan-300 rounded-full animate-pulse [animation-delay:-0.2s]" />
            <span className="w-1.5 h-4 bg-cyan-500 rounded-full animate-pulse [animation-delay:-0.4s]" />
            <div className="mx-2 px-2 py-1 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-[10px] font-mono text-cyan-300 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>BOOKED 3:00 PM</span>
            </div>
            <span className="w-1.5 h-8 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.1s]" />
            <span className="w-1.5 h-5 bg-cyan-300 rounded-full animate-pulse [animation-delay:-0.3s]" />
          </div>
        </div>
      )
    },
    {
      id: 'sales',
      emoji: '🎯',
      role: 'AI SALES AGENT',
      status: 'ONLINE',
      summary: 'Responds to leads, qualifies prospects and schedules meetings.',
      icon: Target,
      color: 'violet',
      border: 'border-violet-500/30 hover:border-violet-400',
      bg: 'bg-[#0d0a1c]/80',
      glow: 'shadow-violet-500/10',
      textColor: 'text-violet-400',
      demoData: {
        title: 'AI Sales Agent In Action',
        subtitle: 'Sub-45s Inbound Lead Qualification',
        steps: [
          { title: 'Inbound Web Lead Form', detail: 'Lead submitted: "Jenkins Dental - 3 Clinic Locations"', badge: '< 30s SPEED' },
          { title: 'Conversational Discovery', detail: 'AI asks volume & pain points; lead answers 12 chairs / 40 lost calls.', badge: 'QUALIFIED' },
          { title: 'CRM Deal Pipeline Synced', detail: 'Scores 98/100, schedules executive strategy call in calendar.', badge: 'HIGH-QUALITY ✓' }
        ]
      },
      visualSvg: (
        <div className="relative w-full h-24 rounded-xl bg-[#080512] border border-violet-950 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#8b5cf610_1px,transparent_1px)] [background-size:12px_12px]" />
          {/* Animated Qualification Pipeline */}
          <div className="flex items-center gap-2 relative z-10 font-mono text-[10px]">
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">NEW LEAD</span>
            <span className="text-violet-400">&rarr;</span>
            <div className="px-2.5 py-1 rounded-lg bg-violet-500/20 border border-violet-400/40 text-violet-300 font-bold animate-pulse flex items-center gap-1">
              <Zap className="w-3 h-3 text-violet-400" />
              <span>SCORE 98%</span>
            </div>
            <span className="text-violet-400">&rarr;</span>
            <span className="px-2 py-1 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-bold">CRM ✓</span>
          </div>
        </div>
      )
    },
    {
      id: 'support',
      emoji: '💬',
      role: 'AI SUPPORT AGENT',
      status: 'ONLINE',
      summary: 'Answers common questions and handles customer support.',
      icon: MessageSquare,
      color: 'emerald',
      border: 'border-emerald-500/30 hover:border-emerald-400',
      bg: 'bg-[#07130e]/80',
      glow: 'shadow-emerald-500/10',
      textColor: 'text-emerald-400',
      demoData: {
        title: 'AI Support Agent In Action',
        subtitle: 'Instant Resolution via Verified Knowledge Base',
        steps: [
          { title: 'Customer Question Received', detail: '"What is your cancellation policy and do you accept insurance?"', badge: 'INSTANT' },
          { title: 'Vector Knowledge Query', detail: 'Matches policy documents with zero hallucination guarantee.', badge: 'VERIFIED' },
          { title: 'Accurate Direct Answer', detail: 'Answers clearly and offers automated reschedule option.', badge: 'RESOLVED ✓' }
        ]
      },
      visualSvg: (
        <div className="relative w-full h-24 rounded-xl bg-[#030c08] border border-emerald-950 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#10b98110_1px,transparent_1px)] [background-size:12px_12px]" />
          {/* Animated chat dialogue bubbles */}
          <div className="w-full px-4 space-y-1.5 relative z-10 font-mono text-[9px]">
            <div className="bg-slate-900/90 border border-slate-700/80 p-1.5 rounded-lg text-slate-300 max-w-[80%] truncate">
              "How does your warranty work?"
            </div>
            <div className="bg-emerald-950/80 border border-emerald-500/40 p-1.5 rounded-lg text-emerald-300 max-w-[85%] ml-auto truncate flex items-center gap-1">
              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
              <span>Full 2-year guarantee covered ✓</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'operations',
      emoji: '⚙️',
      role: 'AI OPERATIONS AGENT',
      status: 'ONLINE',
      summary: 'Moves information between systems and automates repetitive work.',
      icon: Settings2,
      color: 'amber',
      border: 'border-amber-500/30 hover:border-amber-400',
      bg: 'bg-[#150f06]/80',
      glow: 'shadow-amber-500/10',
      textColor: 'text-amber-400',
      demoData: {
        title: 'AI Operations Agent In Action',
        subtitle: 'Cross-Software Webhook & Data Synchronization',
        steps: [
          { title: 'New Customer Intake / Order', detail: 'Received via front desk or payment terminal.', badge: 'INGESTED' },
          { title: 'Multi-App Sync', detail: 'Updates QuickBooks invoice, Google Drive record, and Slack team channel.', badge: 'SYNCHRONIZED' },
          { title: 'Task Closed', detail: 'Zero manual data entry required; logs archived with audit trail.', badge: 'SYNCED ✓' }
        ]
      },
      visualSvg: (
        <div className="relative w-full h-24 rounded-xl bg-[#0d0903] border border-amber-950 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#f59e0b10_1px,transparent_1px)] [background-size:12px_12px]" />
          {/* Animated Synchronized Nodes */}
          <div className="flex items-center justify-between w-full px-6 relative z-10 font-mono text-[9px]">
            <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300">
              ERP / Invoice
            </div>
            <div className="flex-1 mx-2 h-0.5 bg-gradient-to-r from-amber-500/40 via-amber-400 to-amber-500/40 relative">
              <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-1/2 -translate-y-1/2 animate-ping" style={{ left: '50%' }} />
            </div>
            <div className="p-1.5 rounded-lg bg-amber-950 border border-amber-500/40 text-amber-300 font-bold">
              CRM Sync ✓
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleCardClick = (emp) => {
    forgeAudioSynth.playClick();
    if (onWatchEmployeeDemo) {
      onWatchEmployeeDemo(emp.demoData);
    } else {
      const el = document.getElementById('v3-video-experience');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 sm:py-24 border-b border-slate-800/80 bg-[#050813] relative overflow-hidden" id="ai-employees">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-indigo-500/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold tracking-wider uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>AUTONOMOUS DIGITAL WORKFORCE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            MEET YOUR NEW AI EMPLOYEES
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            Pre-trained digital workers built for your business. They work 24/7, never call in sick, and execute routine operations in seconds.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {employees.map((emp) => {
            const Icon = emp.icon;
            return (
              <div
                key={emp.id}
                className={`rounded-2xl border ${emp.border} ${emp.bg} p-5 sm:p-6 flex flex-col justify-between space-y-4 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${emp.glow} group`}
              >
                <div>
                  {/* Top Bar: Emoji, Role & Online Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-2xl">{emp.emoji}</span>
                    <AiStatusBadge status="online" size="sm" />
                  </div>

                  <h3 className="text-sm font-black text-white font-mono tracking-wide uppercase">
                    {emp.role}
                  </h3>

                  {/* Short 1-2 sentence description - NOT long text cards */}
                  <p className="text-xs text-slate-300 mt-2 font-sans leading-relaxed">
                    {emp.summary}
                  </p>
                </div>

                {/* Animated Small Visual */}
                <div className="my-1">
                  {emp.visualSvg}
                </div>

                {/* Action Triggers */}
                {emp.id === 'receptionist' && onTalkToReceptionist ? (
                  <div className="space-y-2">
                    <ActionButton
                      variant="primary"
                      size="md"
                      onClick={() => onTalkToReceptionist()}
                      icon={MessageSquare}
                      iconPosition="left"
                      className="w-full text-xs font-mono bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 font-black shadow-md shadow-teal-500/20"
                    >
                      TALK TO RECEPTIONIST
                    </ActionButton>
                    <button
                      onClick={() => handleCardClick(emp)}
                      className="w-full py-1 text-[11px] font-mono text-slate-400 hover:text-cyan-300 transition-colors flex items-center justify-center gap-1"
                    >
                      <span>Watch Simulation</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <ActionButton
                    variant="secondary"
                    size="md"
                    onClick={() => handleCardClick(emp)}
                    icon={ArrowRight}
                    iconPosition="right"
                    className="w-full text-xs font-mono"
                  >
                    WATCH DEMO
                  </ActionButton>
                )}
              </div>
            );
          })}
        </div>

        {/* Subtle CTA: BUILD YOUR AI EMPLOYEE → */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-slate-300 font-sans">
            Ready to integrate custom AI agents into your business operations?
          </p>
          <ActionButton
            variant="primary"
            size="md"
            onClick={() => {
              if (onBuildAiEmployee) onBuildAiEmployee();
            }}
            icon={ArrowRight}
            iconPosition="right"
            className="w-full sm:w-auto text-xs font-mono"
          >
            BUILD YOUR AI EMPLOYEE
          </ActionButton>
        </div>

      </div>
    </section>
  );
}
