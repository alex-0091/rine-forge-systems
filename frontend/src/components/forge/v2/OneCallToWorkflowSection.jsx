import React, { useState } from 'react';
import { 
  PhoneCall, BrainCircuit, UserCheck, Calendar, 
  Bell, MessageSquare, HeartHandshake, ArrowRight, 
  CheckCircle2, Sparkles, Check, ChevronDown
} from 'lucide-react';
import { forgeAudioSynth } from '../../../utils/forgeAudioSynth';

export function OneCallToWorkflowSection({ onOpenAuditModal }) {
  const [expandedIndex, setExpandedIndex] = useState(0);

  const workflowStages = [
    {
      num: '01',
      title: 'ONE CUSTOMER ACTION',
      action: 'Caller dials your business number after hours',
      machineState: 'SIP Trunk Trigger Received',
      detail: 'A homeowner with an active plumbing leak or patient with tooth pain dials your number at 7:45 PM on a Saturday. No voicemail, no busy tone.',
      latency: '0.0s',
      icon: PhoneCall
    },
    {
      num: '02',
      title: 'AI UNDERSTANDS',
      action: 'Conversational voice model detects urgency & service required',
      machineState: 'Whisper Large V3 Speech-to-Intent',
      detail: 'The AI listens, acknowledges the emergency with empathy, and verifies the caller needs an urgent diagnostic examination.',
      latency: '+0.3s',
      icon: BrainCircuit
    },
    {
      num: '03',
      title: 'INFORMATION EXTRACTED',
      action: 'Entity parser extracts caller name, phone, address, and notes',
      machineState: 'Structured JSON Schema Extraction',
      detail: 'Collects the customer address, verifies spelling of the contact name, and validates service feasibility from the approved clinic/firm database.',
      latency: '+0.5s',
      icon: UserCheck
    },
    {
      num: '04',
      title: 'LEAD CREATED',
      action: 'Full contact record pushed to CRM with transcript',
      machineState: 'Webhook Dispatch to CRM Pipeline',
      detail: 'A qualified lead record is instantly generated in GoHighLevel / HubSpot with high-priority tags, eliminating manual data entry.',
      latency: '+0.8s',
      icon: CheckCircle2
    },
    {
      num: '05',
      title: 'APPOINTMENT BOOKED',
      action: 'Live calendar slot reserved and confirmed',
      machineState: 'Two-Way OAuth2 Calendar Sync',
      detail: 'The AI checks actual doctor or technician availability, locks in the exact time slot, and sends calendar invites to all parties.',
      latency: '+1.1s',
      icon: Calendar
    },
    {
      num: '06',
      title: 'TEAM NOTIFIED',
      action: 'Emergency text & email sent to on-call manager',
      machineState: 'Twilio SMS & SendGrid Alert',
      detail: 'The office manager or technician receives an SMS: "Emergency job booked: Michael R., 742 Evergreen Way, Austin TX, water heater replacement."',
      latency: '+1.4s',
      icon: Bell
    },
    {
      num: '07',
      title: 'FOLLOW-UP STARTED',
      action: 'Customer receives intake paperwork & confirmation SMS',
      machineState: 'Automated Lifecycle Sequence Queued',
      detail: 'The customer receives a reassuring text message with appointment time, practitioner name, and a one-click digital intake link.',
      latency: '+1.8s',
      icon: MessageSquare
    },
    {
      num: '08',
      title: 'CUSTOMER SERVED',
      action: 'Client arrives, job is completed, 5-star review collected',
      machineState: 'Revenue Secured & Reputation Amplified',
      detail: 'The client arrives informed and prepared. Post-service automation sends a satisfaction check-in and collects a verified Google review.',
      latency: '+24h',
      icon: HeartHandshake
    }
  ];

  return (
    <section id="workflow-machine" className="py-20 sm:py-28 bg-[#070b12] border-b border-white/[0.08] relative">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>The Automated Lifecycle</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            From One Call to a Complete Workflow
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            See how a single phone call or website inquiry automatically triggers the entire downstream business machine without human delay.
          </p>
        </div>

        {/* 8-Stage Machine Sequence */}
        <div className="max-w-4xl mx-auto space-y-3">
          {workflowStages.map((stage, idx) => {
            const Icon = stage.icon;
            const isExpanded = expandedIndex === idx;

            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isExpanded 
                    ? 'bg-[#0c101a] border-indigo-500/50 shadow-xl shadow-indigo-500/10' 
                    : 'bg-[#090d16] border-white/[0.06] hover:border-white/[0.12]'
                }`}
              >
                <button
                  onClick={() => {
                    forgeAudioSynth.playClick();
                    setExpandedIndex(isExpanded ? null : idx);
                  }}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 focus:outline-none"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="font-mono text-xs sm:text-sm font-black text-indigo-400 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                      {stage.num}
                    </span>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-white tracking-wide">
                        {stage.title}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {stage.action}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="hidden sm:inline text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                      {stage.latency}
                    </span>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-transform ${
                      isExpanded ? 'rotate-180 bg-indigo-500/20 text-indigo-300' : 'bg-white/[0.04] text-slate-400'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-white/[0.06] space-y-3 animate-fadeIn text-xs">
                    <div className="flex items-center gap-2 text-[11px] font-mono text-indigo-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      <span>MACHINE STATE: {stage.machineState}</span>
                    </div>

                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                      {stage.detail}
                    </p>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between text-[11px] text-slate-400">
                      <span>Human Intervention Required: <strong className="text-emerald-400">None (Automated)</strong></span>
                      <span className="text-slate-500 font-mono">100% Deterministic</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-2">
          <button
            onClick={() => {
              forgeAudioSynth.playClick();
              if (onOpenAuditModal) onOpenAuditModal();
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm transition-all shadow-[0_0_20px_rgba(99,102,241,0.35)]"
          >
            <span>Have Rine Forge Build This Machine for Your Business</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
