import React, { useState, useEffect } from 'react';
import { 
  User, Bot, GitBranch, Wrench, Database, CheckCircle2, 
  ArrowRight, ArrowDown, Sparkles, Layers, ShieldCheck, Zap 
} from 'lucide-react';
import { forgeAudioSynth } from '../../../utils/forgeAudioSynth';
import { WorkflowPipelineVisual } from '../v4/WorkflowPipelineVisual';

export function AutomationStackArchitecture() {
  const [activeStep, setActiveStep] = useState(0);

  // Progressive pulse along the 6-node stack
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep(prev => (prev + 1) % 6);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  const stackNodes = [
    {
      id: 0,
      label: 'CUSTOMER',
      role: 'Inbound Trigger',
      desc: 'Customer reaches out via WhatsApp, phone, web lead, or email.',
      icon: User,
      tech: 'WhatsApp / VoIP / Web Form',
      color: 'rose'
    },
    {
      id: 1,
      label: 'AI AGENT',
      role: 'Natural Language Processing',
      desc: 'Understands intent, extracts entities, and verifies urgency in 350ms.',
      icon: Bot,
      tech: 'LLM Schema / Whisper Speech',
      color: 'cyan'
    },
    {
      id: 2,
      label: 'BUSINESS LOGIC',
      role: 'Deterministic Guardrails',
      desc: 'Enforces clinic/hotel rules, availability thresholds, and zero-hallucination limits.',
      icon: GitBranch,
      tech: 'Custom Decision Trees',
      color: 'indigo'
    },
    {
      id: 3,
      label: 'TOOLS / APIS',
      role: 'Action Dispatch',
      desc: 'Executes verified API calls: SMS confirmations, webhooks, and calendar locks.',
      icon: Wrench,
      tech: 'Twilio / Google API / Webhooks',
      color: 'amber'
    },
    {
      id: 4,
      label: 'CRM / DATABASE',
      role: 'State Synchronization',
      desc: 'Records patient/guest files, updates deal stages, and archives execution logs.',
      icon: Database,
      tech: 'HubSpot / Opera / PostgreSQL',
      color: 'violet'
    },
    {
      id: 5,
      label: 'RESULT',
      role: 'Autonomous Completion',
      desc: '100% resolved: Appointment confirmed, lead qualified, staff spared manual work.',
      icon: CheckCircle2,
      tech: 'TASK COMPLETED ✓',
      color: 'emerald'
    }
  ];

  return (
    <section className="py-16 sm:py-24 border-b border-slate-800/80 bg-[#060a14] relative overflow-hidden" id="automation-stack">
      {/* Background Lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-r from-cyan-500/10 via-teal-500/10 to-indigo-500/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold tracking-wider uppercase shadow-sm">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>END-TO-END WORKFLOW TOPOLOGY</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            THE FORGE AUTOMATION STACK
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            How data flows securely from the customer's initial inquiry all the way through your internal systems in sub-second time.
          </p>

          {/* Prominent Required Label */}
          <div className="pt-2">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 font-mono text-xs sm:text-sm font-bold shadow-md">
              <Zap className="w-4 h-4 text-teal-400" />
              <span>We connect AI to the systems your business already uses.</span>
            </span>
          </div>
        </div>

        {/* Real-time Interactive Workflow Pipeline */}
        <WorkflowPipelineVisual />

        {/* Visual Architecture Pipeline: 6 Interconnected Nodes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 relative">
          {stackNodes.map((node, idx) => {
            const Icon = node.icon;
            const isActive = activeStep === idx;
            const isPassed = activeStep > idx;

            return (
              <div
                key={node.id}
                onClick={() => {
                  forgeAudioSynth.playClick();
                  setActiveStep(idx);
                }}
                className={`rounded-2xl border p-4 sm:p-5 flex flex-col justify-between space-y-4 cursor-pointer transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-b from-teal-950/80 to-slate-900 border-teal-400 shadow-xl shadow-teal-500/20 scale-[1.03]'
                    : isPassed
                      ? 'bg-slate-900/80 border-slate-700/80 opacity-90'
                      : 'bg-slate-950/50 border-slate-800/60 opacity-60 hover:opacity-100 hover:border-slate-700'
                }`}
              >
                <div className="space-y-3">
                  
                  {/* Step Index & Pulse */}
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className={`font-bold ${isActive ? 'text-teal-400' : 'text-slate-500'}`}>
                      0{idx + 1}
                    </span>
                    {isActive ? (
                      <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                    ) : isPassed ? (
                      <span className="text-emerald-400 font-bold">✓</span>
                    ) : null}
                  </div>

                  {/* Icon & Label */}
                  <div>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 ${
                      isActive 
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-400/40' 
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-black text-white font-mono tracking-wide">
                      {node.label}
                    </h3>
                    <div className="text-[10px] font-mono text-teal-400 font-bold mt-0.5">
                      {node.role}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                    {node.desc}
                  </p>
                </div>

                {/* Tech Badge */}
                <div className="pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
                  <span className="text-slate-500 block text-[9px] uppercase">INTEGRATION:</span>
                  <span className="text-white font-semibold truncate block">{node.tech}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Architecture Supported Systems Strip */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#080e1c] border border-slate-800/90 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-slate-300 font-bold">Verified Native Connectors:</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[11px]">
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-200">WhatsApp Business</span>
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-200">Twilio Telephony</span>
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-200">Google Calendar</span>
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-200">HubSpot CRM</span>
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-200">PostgreSQL</span>
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-200">Custom Webhooks</span>
          </div>
        </div>

      </div>
    </section>
  );
}
