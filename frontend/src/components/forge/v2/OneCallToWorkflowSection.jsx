import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, Bot, BrainCircuit, UserCheck, Calendar, 
  Database, MessageSquare, Bell, Clock, Play, Pause, 
  RotateCcw, Sparkles, ArrowRight, ShieldCheck, Check, 
  ChevronRight, Smartphone, Send, Zap, Activity
} from 'lucide-react';
import { forgeAudioSynth } from '../../../utils/forgeAudioSynth';

export function OneCallToWorkflowSection({ onOpenAuditModal }) {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  // The 9 canonical stages specified by the Rine executive design system
  const stages = [
    {
      id: 'customer_calls',
      stepNum: '01',
      label: 'Customer calls',
      timing: '0.0s',
      summary: 'Inbound call received',
      system: 'Telephony Gateway',
      detail: 'A customer dials your business number after hours with an urgent need. No voicemail, no busy signal.',
      icon: PhoneCall,
      color: 'indigo'
    },
    {
      id: 'ai_answers',
      stepNum: '02',
      label: 'AI answers',
      timing: '+0.2s',
      summary: 'Natural voice connects',
      system: 'Neural Voice Engine',
      detail: 'The AI answers in under 1 second with a warm, natural greeting tailored to your exact business protocols.',
      icon: Bot,
      color: 'indigo'
    },
    {
      id: 'ai_understands',
      stepNum: '03',
      label: 'AI understands',
      timing: '+0.6s',
      summary: 'Intent & entity extraction',
      system: 'Deterministic Intent Layer',
      detail: 'The system recognizes caller urgency, extracts name, phone, address, and pinpoints the exact service needed.',
      icon: BrainCircuit,
      color: 'sky'
    },
    {
      id: 'lead_created',
      stepNum: '04',
      label: 'Lead created',
      timing: '+0.9s',
      summary: 'CRM record created',
      system: 'CRM Sync Layer',
      detail: 'A complete contact record is generated in your CRM with full audio transcript and priority tagging.',
      icon: UserCheck,
      color: 'emerald'
    },
    {
      id: 'appointment_booked',
      stepNum: '05',
      label: 'Appointment booked',
      timing: '+1.3s',
      summary: 'Calendar slot locked',
      system: 'Calendar Automation',
      detail: 'The AI checks live practitioner or technician availability and reserves the exact slot in real time.',
      icon: Calendar,
      color: 'emerald'
    },
    {
      id: 'crm_updated',
      stepNum: '06',
      label: 'CRM updated',
      timing: '+1.5s',
      summary: 'Pipeline stage moved',
      system: 'Deal Pipeline Engine',
      detail: 'Lead status advances to "Booked Appointment" with consultation value and intake requirements attached.',
      icon: Database,
      color: 'sky'
    },
    {
      id: 'confirmation_sent',
      stepNum: '07',
      label: 'Confirmation sent',
      timing: '+1.8s',
      summary: 'Customer SMS confirmation',
      system: 'SMS Dispatch Service',
      detail: 'Customer instantly receives a clean SMS confirmation with appointment time, address, and intake link.',
      icon: Send,
      color: 'indigo'
    },
    {
      id: 'business_notified',
      stepNum: '08',
      label: 'Business notified',
      timing: '+2.1s',
      summary: 'Instant team dispatch alert',
      system: 'Internal Alert Router',
      detail: 'Your on-call staff receives an immediate notification with complete caller details and scheduled time.',
      icon: Bell,
      color: 'amber'
    },
    {
      id: 'followup_scheduled',
      stepNum: '09',
      label: 'Follow-up scheduled',
      timing: '+24h',
      summary: 'Automated post-care sequence',
      system: 'Lifecycle Orchestrator',
      detail: 'Pre-visit reminder and post-appointment satisfaction review requests are pre-programmed automatically.',
      icon: Clock,
      color: 'indigo'
    }
  ];

  // Automated cinematic timer with progress bar
  useEffect(() => {
    if (!isPlaying) return;

    const tickRateMs = 50;
    const stepDurationMs = 3400;
    const increment = (tickRateMs / stepDurationMs) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveStep((s) => (s + 1) % stages.length);
          return 0;
        }
        return prev + increment;
      });
    }, tickRateMs);

    return () => clearInterval(timer);
  }, [isPlaying, stages.length]);

  const handleStepSelect = (index) => {
    forgeAudioSynth.playClick();
    setActiveStep(index);
    setProgress(0);
  };

  const currentStage = stages[activeStep];

  return (
    <section id="workflow-machine" className="py-20 sm:py-28 bg-[#070b12] border-b border-white/[0.08] relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-indigo-600/[0.05] blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>The Rine Forge Signature Architecture</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            One Customer Action. <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-sky-200 to-white">
              Complete Autonomous Execution.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            Watch what happens behind the scenes from the second a customer dials your number to the moment their booking is locked and follow-up scheduled.
          </p>
        </div>

        {/* Global Cinematic Controller & Scrubber */}
        <div className="max-w-5xl mx-auto bg-[#0c101a] border border-white/[0.1] rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
          
          {/* Top Bar: Live Stage Name + Play/Pause & Reset */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-mono font-bold">
                {currentStage.stepNum}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-bold text-white tracking-wide">
                    {currentStage.label}
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    {currentStage.timing}
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  Module: <span className="text-slate-200">{currentStage.system}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  forgeAudioSynth.playClick();
                  setIsPlaying(!isPlaying);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-mono text-slate-200 flex items-center gap-1.5 transition-colors"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{isPlaying ? 'Pause Simulation' : 'Resume'}</span>
              </button>

              <button
                onClick={() => {
                  forgeAudioSynth.playClick();
                  setActiveStep(0);
                  setProgress(0);
                }}
                className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-slate-400 hover:text-white transition-colors"
                title="Restart from Step 1"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 9-Step Horizontal Progress Track */}
          <div className="space-y-2">
            <div className="grid grid-cols-9 gap-1 sm:gap-2">
              {stages.map((st, i) => {
                const isActive = activeStep === i;
                const isPassed = activeStep > i;
                return (
                  <button
                    key={st.id}
                    onClick={() => handleStepSelect(i)}
                    className="group relative focus:outline-none py-1 text-left"
                    title={`Step ${st.stepNum}: ${st.label}`}
                  >
                    {/* Bar Line */}
                    <div className="h-1.5 sm:h-2 rounded-full overflow-hidden bg-white/[0.08] relative">
                      {isPassed && (
                        <div className="h-full bg-emerald-500 rounded-full w-full" />
                      )}
                      {isActive && (
                        <div 
                          className="h-full bg-indigo-500 rounded-full transition-all duration-75"
                          style={{ width: `${progress}%` }}
                        />
                      )}
                    </div>
                    {/* Step Number */}
                    <div className={`mt-1.5 text-[10px] font-mono text-center transition-colors truncate hidden md:block ${
                      isActive ? 'text-indigo-400 font-bold' : isPassed ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {st.stepNum}
                    </div>
                  </button>
                );
              })}
            </div>
            
            {/* Small step titles under bars on desktop */}
            <div className="hidden lg:grid grid-cols-9 gap-2 text-[10px] text-center text-slate-400">
              {stages.map((st, i) => (
                <div 
                  key={st.id}
                  onClick={() => handleStepSelect(i)}
                  className={`cursor-pointer transition-colors leading-tight ${
                    activeStep === i ? 'text-white font-bold' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {st.label}
                </div>
              ))}
            </div>
          </div>

          {/* MAIN CINEMATIC WORKSPACE (2-Column Architecture) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
            
            {/* Left Column: Step Blueprint & Concrete Business Explanation (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase text-indigo-400 font-bold tracking-wider">
                    Operational Stage
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Step {currentStage.stepNum} of 09
                  </span>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white">
                    {currentStage.label}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed font-normal">
                    {currentStage.detail}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/[0.06] text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Execution Speed:</span>
                    <span className="font-mono text-emerald-400 font-bold">{currentStage.timing}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Human Work Required:</span>
                    <span className="font-mono text-slate-200">Zero (Autonomous)</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Reliability Standard:</span>
                    <span className="font-mono text-slate-200">Deterministic Guardrails</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      forgeAudioSynth.playClick();
                      if (onOpenAuditModal) onOpenAuditModal();
                    }}
                    className="w-full py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>Deploy this workflow for your business</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Live System Visual Screen (7 cols) */}
            <div className="lg:col-span-7">
              <div className="h-full min-h-[340px] rounded-2xl bg-[#080c14] border border-white/[0.1] p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden shadow-inner">
                
                {/* Visual Header */}
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 text-xs font-mono">
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>LIVE SYSTEM TELEMETRY</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    TIMESTAMP: +{currentStage.timing}
                  </span>
                </div>

                {/* DYNAMIC SCREEN CONTENT BASED ON ACTIVE STEP */}
                <div className="py-4">
                  {/* Step 1: Customer Calls */}
                  {activeStep === 0 && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                            <PhoneCall className="w-5 h-5 animate-bounce" />
                          </div>
                          <div>
                            <div className="text-xs font-mono uppercase text-indigo-300 font-bold">Inbound Telephony Event</div>
                            <div className="text-base font-bold text-white">+1 (512) 555-0182</div>
                            <div className="text-xs text-slate-400">Austin, Texas • Saturday 7:42 PM</div>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded bg-amber-500/15 text-amber-400 text-xs font-mono font-bold">
                          Ringing...
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Signal routed through direct SIP trunk. Voicemail bypassed. Zero queue delay.
                      </p>
                    </div>
                  )}

                  {/* Step 2: AI Answers */}
                  {activeStep === 1 && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="p-4 rounded-xl bg-[#0c101a] border border-white/[0.1] space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-xs font-mono text-emerald-400 font-bold">CONNECTED IN 220MS</span>
                          </div>
                          <span className="text-[11px] font-mono text-slate-400">Agent: Elena (Front Desk)</span>
                        </div>
                        <div className="flex items-center gap-1.5 h-6">
                          {[40, 70, 30, 90, 60, 100, 45, 80, 55, 95, 30, 65, 85, 40].map((h, idx) => (
                            <div
                              key={idx}
                              className="w-1.5 bg-indigo-500 rounded-full animate-pulse"
                              style={{ height: `${h}%`, animationDelay: `${idx * 80}ms` }}
                            />
                          ))}
                        </div>
                        <div className="text-xs text-slate-200 bg-white/[0.03] p-3 rounded-lg border border-white/[0.06] italic">
                          "Thank you for calling Austin Premier Dental. This is Elena. How can I help you this evening?"
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: AI Understands */}
                  {activeStep === 2 && (
                    <div className="space-y-3 animate-fadeIn">
                      <div className="text-xs font-mono text-indigo-300 font-bold uppercase">
                        Real-Time Semantic Entity Extraction:
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                          <div className="text-[10px] text-slate-400 uppercase font-mono">Intent</div>
                          <div className="font-bold text-white mt-0.5">Emergency Tooth Pain Exam</div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                          <div className="text-[10px] text-slate-400 uppercase font-mono">Urgency Level</div>
                          <div className="font-bold text-rose-400 mt-0.5">High Priority (Molar Pain)</div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                          <div className="text-[10px] text-slate-400 uppercase font-mono">Caller Name</div>
                          <div className="font-bold text-white mt-0.5">Sarah Johnson</div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                          <div className="text-[10px] text-slate-400 uppercase font-mono">Time Request</div>
                          <div className="font-bold text-emerald-400 mt-0.5">Tomorrow Morning (First Slot)</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Lead Created */}
                  {activeStep === 3 && (
                    <div className="space-y-3 animate-fadeIn">
                      <div className="p-4 rounded-xl bg-[#0c101a] border border-emerald-500/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5" /> LEAD CREATED IN CRM
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">ID: #LD-89412</span>
                        </div>
                        <div className="text-sm font-bold text-white">Sarah Johnson</div>
                        <div className="text-xs text-slate-400">+1 (512) 555-0182 • sarah.j@example.com</div>
                        <div className="flex items-center gap-1.5 pt-1">
                          <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-mono">Inbound Call</span>
                          <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono">Emergency</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">Qualified</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 5: Appointment Booked */}
                  {activeStep === 4 && (
                    <div className="space-y-3 animate-fadeIn">
                      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" /> CALENDAR SLOT LOCKED
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">Google / Outlook Sync</span>
                        </div>
                        <div className="text-base font-extrabold text-white">Tomorrow · 9:30 AM – 10:15 AM</div>
                        <div className="text-xs text-slate-300">Service: Emergency Examination & Diagnostic X-Ray</div>
                        <div className="text-xs text-emerald-300 font-mono">Provider: Dr. Scott Miller, DDS (Operatory 2)</div>
                      </div>
                    </div>
                  )}

                  {/* Step 6: CRM Updated */}
                  {activeStep === 5 && (
                    <div className="space-y-3 animate-fadeIn">
                      <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-2.5">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-slate-400">PIPELINE TRANSITION:</span>
                          <span className="text-indigo-400 font-bold">New Lead → Booked Consultation</span>
                        </div>
                        <div className="w-full bg-white/[0.08] h-2 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full w-3/4 rounded-full" />
                        </div>
                        <div className="text-[11px] text-slate-400 pt-1">
                          Pipeline deal value tagged: <strong className="text-white">$450.00 Est. Value</strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 7: Confirmation Sent */}
                  {activeStep === 6 && (
                    <div className="space-y-3 animate-fadeIn">
                      <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] space-y-2 max-w-sm">
                        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                          <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                          <span>SMS DELIVERED TO SARAH (+1 512-555-0182)</span>
                        </div>
                        <div className="p-3 rounded-lg bg-indigo-600 text-white text-xs leading-relaxed">
                          "Hi Sarah, your emergency dental visit with Dr. Miller is confirmed for tomorrow at 9:30 AM at 1400 Congress Ave. Please complete your intake here: rine.link/d92"
                        </div>
                        <div className="text-[10px] text-right font-mono text-emerald-400">Delivered • 0s latency</div>
                      </div>
                    </div>
                  )}

                  {/* Step 8: Business Notified */}
                  {activeStep === 7 && (
                    <div className="space-y-3 animate-fadeIn">
                      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold">
                          <Bell className="w-4 h-4 animate-bounce" />
                          <span>TEAM DISPATCH NOTIFICATION</span>
                        </div>
                        <div className="text-xs text-white leading-relaxed">
                          <strong>Slack & SMS sent to Office Manager & Dr. Miller:</strong> "Urgent appointment booked: Sarah Johnson (Tooth pain) tomorrow at 9:30 AM. Paperwork dispatched."
                        </div>
                        <span className="inline-block text-[10px] font-mono text-slate-400">Notification ACK: 2 Staff Phones Ringing</span>
                      </div>
                    </div>
                  )}

                  {/* Step 9: Follow-up Scheduled */}
                  {activeStep === 8 && (
                    <div className="space-y-3 animate-fadeIn">
                      <div className="p-4 rounded-xl bg-[#0c101a] border border-white/[0.1] space-y-2">
                        <div className="text-xs font-mono text-indigo-300 font-bold uppercase">
                          Automated Lifecycle Sequences Active:
                        </div>
                        <div className="space-y-1.5 text-xs text-slate-300">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span>T-2 Hours: SMS reminder with GPS parking directions</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span>T+4 Hours: Post-care satisfaction check-in</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span>T+24 Hours: Google Review request sent if satisfied</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Status Ticker */}
                <div className="border-t border-white/[0.06] pt-3 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Audit trail logged to secure database</span>
                  </div>
                  <span className="text-emerald-400 font-bold">ALL SYSTEMS SYNCED</span>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
