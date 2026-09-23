import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, Bot, BrainCircuit, UserCheck, 
  CalendarCheck, Bell, MessageSquare, Play, 
  Pause, ArrowRight, CheckCircle2, ChevronRight, Zap
} from 'lucide-react';
import { forgeAudioSynth } from '../../../utils/forgeAudioSynth';

export function CinematicWorkflowSection({ onOpenAuditModal }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const steps = [
    {
      id: 0,
      badge: 'STEP 01',
      title: 'Customer Calls / Inquires',
      icon: PhoneCall,
      time: '18:42:05',
      summary: 'Inbound customer call received after normal operating hours.',
      visualData: {
        caller: 'David Miller • (617) 555-0192',
        channel: 'Voice Inbound (Twilio SIP)',
        status: 'Connected on 1st ring',
        snippet: 'Incoming phone call routed instantly to Rine Forge Voice Gateway.'
      }
    },
    {
      id: 1,
      badge: 'STEP 02',
      title: 'AI Answers with Zero Delay',
      icon: Bot,
      time: '18:42:06',
      summary: 'Voice AI answers politely using your clinic/company brand greeting.',
      visualData: {
        voiceLatency: '320ms neural speech latency',
        greeting: '"Good evening! Thank you for calling Maltepe Dental Care. I\'m Elena, your 24/7 receptionist. How can I help you today?"',
        status: 'Caller actively speaking'
      }
    },
    {
      id: 2,
      badge: 'STEP 03',
      title: 'Understands Intent & Service',
      icon: BrainCircuit,
      time: '18:42:18',
      summary: 'Caller asks about crown replacement and pricing. AI retrieves approved knowledge.',
      visualData: {
        detectedIntent: 'Dental Crown Inquiry + Exam Booking',
        knowledgeLookup: 'Verified Clinic Fee Schedule: Exam ($75), Crown Consultation (Included)',
        confidence: '99.4% intent match',
        policyCheck: 'Insurance Accepted: Delta Dental, Cigna, MetLife'
      }
    },
    {
      id: 3,
      badge: 'STEP 04',
      title: 'Customer Information Captured',
      icon: UserCheck,
      time: '18:42:32',
      summary: 'Accurately collects caller name, preferred time window, and contact details.',
      visualData: {
        name: 'David Miller',
        phone: '(617) 555-0192',
        email: 'david.miller@gmail.com',
        preferredDays: 'Next Tuesday or Wednesday morning'
      }
    },
    {
      id: 4,
      badge: 'STEP 05',
      title: 'Appointment Booked & Synced',
      icon: CalendarCheck,
      time: '18:42:45',
      summary: 'Checks live dentist schedule, reserves the slot, and generates calendar invite.',
      visualData: {
        bookedSlot: 'Tuesday, Oct 28 • 10:30 AM',
        practitioner: 'Dr. Scott Miller, DDS',
        calendarSync: 'Google Calendar / GHL / Dentrix Synced ✓',
        appointmentId: 'APT-88219-CONFIRMED'
      }
    },
    {
      id: 5,
      badge: 'STEP 06',
      title: 'Business Notified Instantly',
      icon: Bell,
      time: '18:42:47',
      summary: 'Clinic manager and front desk receive SMS + email recap with call audio.',
      visualData: {
        smsDispatched: 'To Office Manager (415-xxx-xxxx): "New appointment booked for David Miller on Tue 10:30 AM"',
        emailRecap: 'Full transcript, caller summary, and insurance notes archived to CRM',
        status: 'Delivered in 1.4 seconds'
      }
    },
    {
      id: 6,
      badge: 'STEP 07',
      title: 'Automated Follow-Up Triggered',
      icon: MessageSquare,
      time: '18:42:49',
      summary: 'Customer receives SMS confirmation link with pre-visit intake forms.',
      visualData: {
        customerSms: '"Hi David, you are booked for Tuesday 10:30 AM at Maltepe Dental. Tap here to complete your intake form in advance."',
        calendarInvite: 'Sent to david.miller@gmail.com',
        reminderScheduled: 'Automatic reminder queued for Monday 10:00 AM'
      }
    }
  ];

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 4200);
    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  const activeData = steps[currentStep];

  return (
    <section id="cinematic-workflow" className="py-20 sm:py-28 bg-[#060a12] border-b border-white/[0.08] relative overflow-hidden">
      
      {/* Subtle radial depth */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/[0.05] blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-mono font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span>The End-to-End Workflow</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Watch a customer interaction <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-sky-200 to-white">
              become a business action.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            From the moment a phone rings to the moment money and appointments enter your business—here is how Rine Forge automates the entire lifecycle without human delay.
          </p>
        </div>

        {/* Step-by-Step Interactive Workflow Container */}
        <div className="max-w-5xl mx-auto bg-[#0c101a] border border-white/[0.1] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl space-y-8">
          
          {/* Top Controls: Scrubber Buttons & Play/Pause */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.08] pb-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
              {steps.map((st) => {
                const isCurrent = st.id === currentStep;
                const Icon = st.icon;
                return (
                  <button
                    key={st.id}
                    onClick={() => {
                      forgeAudioSynth.playClick();
                      setCurrentStep(st.id);
                      setIsPlaying(false);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 shrink-0 transition-all ${
                      isCurrent
                        ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                        : 'bg-white/[0.03] text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] border border-white/[0.06]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>0{st.id + 1}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                forgeAudioSynth.playClick();
                setIsPlaying(!isPlaying);
              }}
              className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] self-start sm:self-auto"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-indigo-400" /> : <Play className="w-3.5 h-3.5 text-indigo-400" />}
              <span>{isPlaying ? 'Pause Autoplay' : 'Play Live'}</span>
            </button>
          </div>

          {/* Active Step Showcase: Dual Column Display */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Step Description (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 font-bold border border-indigo-500/30">
                  {activeData.badge}
                </span>
                <span className="text-xs font-mono text-slate-500">•</span>
                <span className="text-xs font-mono text-slate-400">Timestamp: {activeData.time}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {activeData.title}
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                {activeData.summary}
              </p>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => {
                    forgeAudioSynth.playClick();
                    setCurrentStep((prev) => (prev + 1) % steps.length);
                  }}
                  className="inline-flex items-center gap-2 text-xs font-bold text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 px-4 py-2 rounded-xl transition-all"
                >
                  <span>Next Sequence Step</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Column: Live Simulated Data Terminal (7 cols) */}
            <div className="lg:col-span-7 bg-[#080b11] border border-white/[0.08] rounded-2xl p-5 sm:p-6 space-y-4 font-mono text-xs shadow-inner">
              
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-slate-200">RUNTIME WORKFLOW DISPATCH</span>
                </div>
                <span>EXECUTION LATENCY: 0.04s</span>
              </div>

              {/* Data Rows */}
              <div className="space-y-3">
                {Object.entries(activeData.visualData).map(([key, value], idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
                    <span className="text-[10px] text-indigo-400 uppercase font-bold tracking-wider">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <div className="text-slate-200 text-xs sm:text-sm font-sans leading-relaxed">
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span>Rine Forge Autonomous State Engine</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED OUTCOME
                </span>
              </div>

            </div>

          </div>

          {/* Workflow Bottom Footnote */}
          <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div>
              <span>Average total turnaround from incoming call to confirmed calendar booking: </span>
              <strong className="text-white font-mono">44 seconds.</strong>
            </div>
            <button
              onClick={() => {
                forgeAudioSynth.playClick();
                if (onOpenAuditModal) onOpenAuditModal();
              }}
              className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1.5 transition-colors"
            >
              <span>Map your business workflow with us</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
