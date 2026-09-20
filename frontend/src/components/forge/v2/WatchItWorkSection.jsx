import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, RotateCcw, CheckCircle2, Bot, 
  Smartphone, Database, Calendar, Bell, ArrowRight, 
  Sparkles, Check, Clock, User, ShieldCheck 
} from 'lucide-react';
import { forgeAudioSynth } from '../../../utils/forgeAudioSynth';
import { ActionButton } from '../v4/ActionButton';

const WORKFLOW_STEPS = [
  {
    stepNumber: 1,
    title: 'Customer Inquires via WhatsApp',
    time: '10:42 PM (After Hours)',
    badge: 'Inbound Message',
    description: 'A new patient messages your official WhatsApp Business number asking about Friday availability and teeth whitening pricing while your clinic is closed.',
    uiPreview: {
      type: 'whatsapp_inbound',
      sender: 'Sarah Jenkins (+1 512-555-8891)',
      bubble: 'Hi! Do you have any appointments open this Friday afternoon? Also how much is laser teeth whitening?',
      timestamp: '10:42 PM'
    }
  },
  {
    stepNumber: 2,
    title: 'Elena AI Evaluates & Grounds Facts',
    time: '10:42:01 PM (< 1.2s)',
    badge: 'Zero-Hallucination Grounding',
    description: 'Elena verifies your clinic database. She retrieves exact in-office laser whitening pricing ($350, 60 mins) and queries your booking calendar without human intervention.',
    uiPreview: {
      type: 'grounding_check',
      retrieval: 'Verified Service: Laser Teeth Whitening ($350, 60m)',
      guardrail: 'Grounding Status: 100% Deterministic (Zero Hallucination)',
      intent: 'APPOINTMENT_AVAILABILITY + PRICE_INQUIRY'
    }
  },
  {
    stepNumber: 3,
    title: 'Elena Answers & Proposes Live Slots',
    time: '10:42:03 PM (< 2.8s)',
    badge: 'Intelligent Response',
    description: 'Elena instantly responds with exact pricing and presents 3 verified open appointment slots for Friday.',
    uiPreview: {
      type: 'whatsapp_reply',
      sender: 'Elena (AI Receptionist)',
      bubble: 'Hi Sarah! In-office laser teeth whitening is $350. We have 3 open slots this Friday with Dr. Evans: 10:30 AM, 1:00 PM, and 3:30 PM. Which time works best for you?',
      timestamp: '10:42 PM'
    }
  },
  {
    stepNumber: 4,
    title: 'Patient Picks Time & Slot is Locked',
    time: '10:43:10 PM',
    badge: 'Calendar Booking',
    description: 'Sarah responds "1:00 PM works great!". Elena locks Operatory 2 in Google Calendar, collects intake info, and issues an instant confirmation ticket.',
    uiPreview: {
      type: 'booking_confirmed',
      slot: 'Friday • 1:00 PM – 2:00 PM (Operatory 2)',
      service: 'Laser Teeth Whitening ($350)',
      status: 'CONFIRMED & LOCKED',
      patient: 'Sarah Jenkins • Confirmed via SMS/WhatsApp'
    }
  },
  {
    stepNumber: 5,
    title: 'Owner & Staff Receive Notification',
    time: '10:43:12 PM',
    badge: 'Team Notification',
    description: 'Your clinic manager receives a push alert and email summary. When staff arrive on Friday morning, the chair is booked and customer data is in your CRM.',
    uiPreview: {
      type: 'crm_notification',
      alert: '🎉 New Confirmed Appointment',
      summary: 'Patient Sarah Jenkins booked for Friday 1:00 PM. Revenue potential: $350. Handled 100% autonomously after hours.',
      crm: 'Sync: Google Calendar & HubSpot CRM • Zero Staff Time'
    }
  }
];

export function WatchItWorkSection({ onOpenAuditModal }) {
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const currentStep = WORKFLOW_STEPS[activeStepIdx];

  useEffect(() => {
    let timer = null;
    if (isAutoPlaying) {
      timer = setInterval(() => {
        setActiveStepIdx(prev => {
          const next = (prev + 1) % WORKFLOW_STEPS.length;
          if (next === 0) forgeAudioSynth.playPhoneRing();
          else if (next === 3) forgeAudioSynth.playSuccess();
          else forgeAudioSynth.playClick();
          return next;
        });
      }, 3600);
    }
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const handleStepClick = (idx) => {
    forgeAudioSynth.playClick();
    setIsAutoPlaying(false);
    setActiveStepIdx(idx);
  };

  return (
    <section className="py-20 sm:py-28 border-b border-slate-800/80 bg-[#060a14] relative" id="watch-it-work">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold tracking-wider uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>SEE IT IN ACTION</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            How an Inbound Lead Becomes a Booked Appointment.
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Watch the complete autonomous execution chain unfold from initial customer WhatsApp message to confirmed calendar booking and owner notification.
          </p>
        </div>

        {/* Step Scrubber Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 max-w-5xl mx-auto">
          {WORKFLOW_STEPS.map((s, idx) => {
            const isActive = idx === activeStepIdx;
            return (
              <button
                key={s.stepNumber}
                onClick={() => handleStepClick(idx)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isActive
                    ? 'bg-cyan-950/50 border-cyan-500 text-white shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/50'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[10px] mb-1">
                  <span className={`font-bold ${isActive ? 'text-cyan-300' : 'text-slate-500'}`}>
                    STEP {s.stepNumber}
                  </span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />}
                </div>
                <div className="text-xs font-bold truncate">{s.title}</div>
              </button>
            );
          })}
        </div>

        {/* The Live Interactive Workflow Screen */}
        <div className="max-w-5xl mx-auto rounded-3xl bg-[#0b1220] border-2 border-cyan-500/30 p-6 sm:p-10 shadow-2xl space-y-8">
          
          {/* Top Control Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {currentStep.badge}
                </span>
                <span className="text-xs font-mono text-slate-400">{currentStep.time}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                {currentStep.stepNumber}. {currentStep.title}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  forgeAudioSynth.playClick();
                  setIsAutoPlaying(!isAutoPlaying);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white"
              >
                {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isAutoPlaying ? 'Pause' : 'Auto Play'}</span>
              </button>
              <button
                onClick={() => {
                  forgeAudioSynth.playClick();
                  setActiveStepIdx(0);
                  setIsAutoPlaying(true);
                }}
                className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white"
                title="Restart simulation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-3xl">
            {currentStep.description}
          </p>

          {/* Simulated Interface Display Based on Step */}
          <div className="rounded-2xl bg-[#060c16] border border-slate-800 p-6 sm:p-8">
            
            {currentStep.uiPreview.type === 'whatsapp_inbound' && (
              <div className="max-w-lg mx-auto space-y-4 font-sans">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold text-xs">
                    SJ
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{currentStep.uiPreview.sender}</div>
                    <div className="text-[10px] text-slate-400 font-mono">Inbound via WhatsApp</div>
                  </div>
                </div>
                <div className="bg-[#005c4b] text-white p-4 rounded-2xl rounded-tl-none text-sm shadow-md">
                  {currentStep.uiPreview.bubble}
                  <div className="text-[10px] text-emerald-200 text-right mt-1 font-mono">
                    {currentStep.uiPreview.timestamp} ✓✓
                  </div>
                </div>
              </div>
            )}

            {currentStep.uiPreview.type === 'grounding_check' && (
              <div className="max-w-xl mx-auto space-y-4 font-mono text-xs">
                <div className="p-4 rounded-xl bg-slate-900/90 border border-teal-500/40 space-y-2">
                  <div className="text-teal-400 font-bold uppercase text-[11px] flex items-center gap-2">
                    <Database className="w-4 h-4" /> KNOWLEDGE GROUNDING PASS
                  </div>
                  <div className="text-white font-sans text-sm">{currentStep.uiPreview.retrieval}</div>
                  <div className="text-emerald-400 text-xs">{currentStep.uiPreview.guardrail}</div>
                  <div className="text-slate-400 text-[10px]">Identified Intent: {currentStep.uiPreview.intent}</div>
                </div>
              </div>
            )}

            {currentStep.uiPreview.type === 'whatsapp_reply' && (
              <div className="max-w-lg mx-auto space-y-4 font-sans">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                  <div className="w-9 h-9 rounded-full bg-teal-800 flex items-center justify-center text-teal-200 font-bold text-xs">
                    E
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{currentStep.uiPreview.sender}</div>
                    <div className="text-[10px] text-teal-400 font-mono">Istanbul Maltepe Dental Clinic</div>
                  </div>
                </div>
                <div className="bg-[#14233a] border border-teal-500/40 text-slate-100 p-4 rounded-2xl rounded-tr-none text-sm shadow-md">
                  {currentStep.uiPreview.bubble}
                  <div className="text-[10px] text-teal-300 text-right mt-1 font-mono">
                    {currentStep.uiPreview.timestamp} ✓✓
                  </div>
                </div>
              </div>
            )}

            {currentStep.uiPreview.type === 'booking_confirmed' && (
              <div className="max-w-xl mx-auto rounded-2xl bg-gradient-to-b from-emerald-950/40 to-slate-900 border-2 border-emerald-500/50 p-6 space-y-3 font-mono text-xs text-slate-200">
                <div className="flex items-center justify-between border-b border-emerald-900/50 pb-2">
                  <span className="text-emerald-400 font-bold uppercase flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" /> {currentStep.uiPreview.status}
                  </span>
                  <span className="text-white font-bold">{currentStep.uiPreview.slot}</span>
                </div>
                <div className="text-white text-sm font-sans font-bold">{currentStep.uiPreview.service}</div>
                <div className="text-slate-300">{currentStep.uiPreview.patient}</div>
              </div>
            )}

            {currentStep.uiPreview.type === 'crm_notification' && (
              <div className="max-w-xl mx-auto rounded-2xl bg-gradient-to-b from-indigo-950/40 to-slate-900 border-2 border-indigo-500/50 p-6 space-y-3 font-mono text-xs text-slate-200">
                <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase border-b border-indigo-900/50 pb-2">
                  <Bell className="w-4 h-4 text-indigo-400 animate-bounce" />
                  <span>{currentStep.uiPreview.alert}</span>
                </div>
                <div className="text-white font-sans text-sm">{currentStep.uiPreview.summary}</div>
                <div className="text-emerald-400 text-[11px]">{currentStep.uiPreview.crm}</div>
              </div>
            )}

          </div>

          {/* Bottom Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <div className="text-xs text-slate-400 font-mono">
              Ready to automate your patient or client intake workflow?
            </div>
            <ActionButton
              variant="primary"
              size="md"
              onClick={() => {
                if (onOpenAuditModal) {
                  onOpenAuditModal({
                    whatToAutomate: 'Automated appointment booking and after-hours customer inquiry pipeline'
                  });
                }
              }}
            >
              AUTOMATE THIS FOR MY BUSINESS
            </ActionButton>
          </div>

        </div>

      </div>
    </section>
  );
}
