import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Sparkles, MessageSquare, Calendar, UserCheck, 
  ArrowRight, Bot, ShieldCheck, Clock, User, PhoneCall, Check
} from 'lucide-react';

const PREVIEW_STEPS = [
  {
    step: 1,
    title: 'Customer Inquires',
    customerMsg: 'Hi, are you open this Saturday? I have severe tooth pain and need an emergency exam.',
    badge: 'INCOMING INQUIRY'
  },
  {
    step: 2,
    title: 'Intent & Urgent Triage',
    systemAction: 'Classified: Emergency Dental Intake + Saturday Practitioner Availability Check.',
    badge: 'INTENT CLASSIFIED'
  },
  {
    step: 3,
    title: 'Instant Grounded Response',
    aiReply: "Hello! Yes, Istanbul Maltepe Dental is open Saturday 09:00 - 15:00. We have an emergency slot available at 11:15 AM with Dr. Aris. May I reserve this slot under your name?",
    badge: 'GROUNDED RESPONSE'
  },
  {
    step: 4,
    title: 'Appointment & Slot Locked',
    crmUpdate: 'Confirmed: Patient #4892 • Reserved Saturday 11:15 AM • Calendar Synchronized.',
    badge: 'SLOT LOCKED & CRM SYNCED'
  },
  {
    step: 5,
    title: 'Staff & Patient Notified',
    humanNotice: 'SMS & WhatsApp confirmation dispatched. Clinic Reception Dashboard updated.',
    badge: 'TEAM NOTIFIED'
  }
];

export function AIEmployeePreview() {
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveStepIdx(prev => (prev + 1) % PREVIEW_STEPS.length);
    }, 3400);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const current = PREVIEW_STEPS[activeStepIdx];

  return (
    <div className="bg-[#0f1422]/90 backdrop-blur-2xl rounded-3xl border border-white/[0.09] shadow-[0_16px_48px_rgba(0,0,0,0.5),0_0_30px_rgba(99,102,241,0.08)] p-6 sm:p-7 max-w-xl mx-auto space-y-5 transition-all">
      {/* Top Header Card */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold shadow-[0_0_12px_rgba(99,102,241,0.2)]">
            <Bot className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Elena</span>
              <span className="text-[10px] text-indigo-300 font-normal px-1.5 py-0.2 rounded bg-indigo-500/10 border border-indigo-500/20">AI Concierge</span>
            </div>
            <div className="text-[11px] text-slate-400">Istanbul Maltepe Dental Clinic • Live Intake</div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">Live System</span>
        </div>
      </div>

      {/* Progress Step Indicator */}
      <div className="grid grid-cols-5 gap-1.5">
        {PREVIEW_STEPS.map((s, idx) => (
          <button
            key={idx}
            onClick={() => { setActiveStepIdx(idx); setIsAutoPlaying(false); }}
            className={`h-1.5 rounded-full transition-all ${
              idx <= activeStepIdx ? 'bg-gradient-to-r from-indigo-500 to-violet-500' : 'bg-white/[0.07]'
            }`}
            title={s.title}
          />
        ))}
      </div>

      {/* Step Dialogue Area */}
      <div className="space-y-3 min-h-[170px] flex flex-col justify-center">
        {/* Customer Question */}
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-full bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-slate-300 text-xs shrink-0 mt-0.5">
            <User className="w-3.5 h-3.5" />
          </div>
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl rounded-tl-sm px-4 py-2.5 text-xs text-slate-200 leading-relaxed max-w-[90%] shadow-sm">
            {PREVIEW_STEPS[0].customerMsg}
          </div>
        </div>

        {/* AI Reply (Step >= 2) */}
        {activeStepIdx >= 2 && (
          <div className="flex items-start gap-2.5 justify-end">
            <div className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-xs leading-relaxed max-w-[90%] shadow-[0_4px_20px_rgba(99,102,241,0.25)] animate-in fade-in slide-in-from-bottom-2 duration-300">
              {PREVIEW_STEPS[2].aiReply}
            </div>
            <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 flex items-center justify-center text-xs shrink-0 mt-0.5">
              <Bot className="w-3.5 h-3.5" />
            </div>
          </div>
        )}

        {/* System Action Callouts (Step 1, 3, 4) */}
        {activeStepIdx === 1 && (
          <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-[11px] text-violet-300 flex items-center gap-2 animate-in fade-in duration-300">
            <Sparkles className="w-4 h-4 text-violet-400 shrink-0" />
            <span>{PREVIEW_STEPS[1].systemAction}</span>
          </div>
        )}

        {activeStepIdx === 3 && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-[11px] text-emerald-300 flex items-center gap-2 animate-in fade-in duration-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{PREVIEW_STEPS[3].crmUpdate}</span>
          </div>
        )}

        {activeStepIdx === 4 && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-[11px] text-amber-300 flex items-center gap-2 animate-in fade-in duration-300">
            <UserCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{PREVIEW_STEPS[4].humanNotice}</span>
          </div>
        )}
      </div>

      {/* Footer Step Metadata */}
      <div className="flex items-center justify-between pt-3 border-t border-white/[0.08] text-xs">
        <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
          <span>Step {activeStepIdx + 1} of 5:</span>
          <strong className="text-white font-medium">{current.title}</strong>
        </div>

        <button
          onClick={() => {
            setActiveStepIdx(prev => (prev + 1) % PREVIEW_STEPS.length);
            setIsAutoPlaying(false);
          }}
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
        >
          <span>Next Turn</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
