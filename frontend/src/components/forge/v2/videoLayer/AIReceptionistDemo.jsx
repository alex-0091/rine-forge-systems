import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, CheckCircle2, Calendar, Clock, Sparkles, Send, ShieldCheck, ArrowRight, RotateCcw, Play, Check } from 'lucide-react';
import { forgeAudioSynth } from '../../../../utils/forgeAudioSynth';
import { AiStatusBadge } from '../../v4/AiStatusBadge';
import { ActionButton } from '../../v4/ActionButton';

export function AIReceptionistDemo({ onNextStep, onOpenLiveChat }) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  
  // Interactive Step State
  // 0: Idle (Prompted to click)
  // 1: Customer message appears
  // 2: Typing indicator & parsing schedule
  // 3: AI response offering slot
  // 4: Customer confirms & Availability verified
  // 5: Appointment confirmed (TASK COMPLETED ✓)
  const [chatStep, setChatStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const stepTimeoutRef = useRef(null);

  const startDemo = () => {
    forgeAudioSynth.playClick();
    if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
    setChatStep(1);
    setIsRunning(true);
  };

  const resetDemo = () => {
    forgeAudioSynth.playClick();
    if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
    setChatStep(0);
    setIsRunning(false);
  };

  // Progression sequence when demo is triggered
  useEffect(() => {
    if (!isRunning) return;

    if (chatStep === 1) {
      // Step 1 -> 2: Typing indicator after 1.2s
      stepTimeoutRef.current = setTimeout(() => {
        forgeAudioSynth.playScan();
        setChatStep(2);
      }, 1200);
    } else if (chatStep === 2) {
      // Step 2 -> 3: AI response after 1.8s
      stepTimeoutRef.current = setTimeout(() => {
        forgeAudioSynth.playClick();
        setChatStep(3);
      }, 1800);
    } else if (chatStep === 3) {
      // Step 3 -> 4: Customer confirmation & availability check after 2.0s
      stepTimeoutRef.current = setTimeout(() => {
        forgeAudioSynth.playClick();
        setChatStep(4);
      }, 2000);
    } else if (chatStep === 4) {
      // Step 4 -> 5: Appointment locked (TASK COMPLETED) after 1.6s
      stepTimeoutRef.current = setTimeout(() => {
        forgeAudioSynth.playSuccess();
        setChatStep(5);
        setIsRunning(false);
      }, 1600);
    }

    return () => {
      if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
    };
  }, [chatStep, isRunning]);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#081512] via-[#040c0b] to-[#020605] border-2 border-emerald-500/40 p-6 sm:p-9 shadow-2xl space-y-6">
      
      {/* Optional MP4 Drop-in Layer */}
      {!videoError && (
        <video
          src="/videos/v04-ai-receptionist.mp4"
          preload="none"
          className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700 ${
            videoLoaded ? 'opacity-40' : 'opacity-0'
          }`}
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          onError={() => setVideoError(true)}
        />
      )}

      {/* Header Banner */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-emerald-950/60 pb-4 font-mono text-xs">
        <div className="flex items-center gap-2.5 text-emerald-400 font-bold">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="uppercase tracking-wider">STAGE 4: AUTONOMOUS AI RECEPTIONIST</span>
        </div>
        
        <div className="flex items-center gap-2.5">
          <AiStatusBadge 
            status={
              chatStep === 5 ? 'completed' :
              chatStep >= 3 ? 'checking' :
              chatStep >= 1 ? 'analyzing' : 'online'
            }
            size="md"
          />
        </div>
      </div>

      {/* Main Interactive Demo Card */}
      <div className="relative z-10 min-h-[420px] sm:min-h-[460px] rounded-2xl bg-[#030a08]/95 border border-emerald-900/40 p-5 sm:p-8 flex flex-col justify-between overflow-hidden">
        
        {/* Subtle Matrix / Dot Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#10b98115_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        {/* Primary Interactive Action Bar */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 pb-4 mb-3 border-b border-emerald-950/60">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <Bot className="w-4 h-4 text-emerald-400" />
            <span>Live Interactive Channel: WhatsApp & Web Telephony</span>
          </div>

          {/* Interactive Trigger Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onOpenLiveChat && (
              <ActionButton
                variant="primary"
                size="sm"
                onClick={onOpenLiveChat}
                icon={Sparkles}
                iconPosition="left"
                className="w-full sm:w-auto text-xs font-mono bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 font-black shadow-lg shadow-teal-500/20"
              >
                TALK TO LIVE AI
              </ActionButton>
            )}

            {chatStep === 0 ? (
              <ActionButton
                variant="secondary"
                size="sm"
                onClick={startDemo}
                icon={Play}
                iconPosition="left"
                className="w-full sm:w-auto text-xs font-mono uppercase"
              >
                WATCH SIMULATION
              </ActionButton>
            ) : (
              <ActionButton
                variant="secondary"
                size="sm"
                onClick={chatStep === 5 ? startDemo : resetDemo}
                icon={RotateCcw}
                iconPosition="left"
                className="w-full sm:w-auto text-xs font-mono"
              >
                {chatStep === 5 ? 'REPLAY SIM' : 'Reset Simulation'}
              </ActionButton>
            )}
          </div>
        </div>

        {/* Dynamic Chat & Booking Visual Canvas */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto items-center">
          
          {/* Left Column: Live Chat Dialog */}
          <div className="lg:col-span-7 space-y-3.5">
            
            {/* Step 0: Initial Prompt when idle */}
            {chatStep === 0 && (
              <div className="p-6 rounded-2xl bg-slate-950/80 border border-emerald-900/30 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 mx-auto flex items-center justify-center text-emerald-400">
                  <Bot className="w-6 h-6 animate-pulse" />
                </div>
                <div className="text-sm font-bold text-white font-sans">
                  Ready to test our autonomous receptionist?
                </div>
                <p className="text-xs text-slate-400 max-w-md mx-auto font-sans leading-relaxed">
                  Chat directly with our live production AI Receptionist or watch the automated simulation handle inquiries in seconds.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
                  {onOpenLiveChat && (
                    <button
                      onClick={onOpenLiveChat}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 text-slate-950 font-black text-xs font-mono uppercase tracking-wider transition-all shadow-lg shadow-teal-500/25 hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                      <span>💬 CHAT WITH REAL AI</span>
                    </button>
                  )}
                  <button
                    onClick={startDemo}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs font-mono uppercase tracking-wider transition-all hover:scale-105"
                  >
                    ▶ SEE SIMULATION
                  </button>
                </div>
              </div>
            )}

            {/* Step 1+: Customer Message */}
            {chatStep >= 1 && (
              <div className="flex items-start gap-2.5 transition-all duration-300 animate-fadeIn">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="max-w-[85%] rounded-2xl rounded-tl-none bg-slate-900/90 border border-slate-700/60 p-3.5 text-xs text-white shadow-md">
                  <div className="text-[10px] font-mono text-slate-400 mb-1 flex items-center justify-between">
                    <span>Customer • 14:02</span>
                    <span className="text-emerald-400 text-[9px] font-mono">Inbound Request</span>
                  </div>
                  "Hi! I need to book a dental checkup and clean as soon as possible. Do you have anything open this week?"
                </div>
              </div>
            )}

            {/* Step 2: Realistic Typing Indicator */}
            {chatStep === 2 && (
              <div className="flex items-start gap-2.5 flex-row-reverse transition-all duration-300">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="rounded-2xl rounded-tr-none bg-emerald-950/70 border border-emerald-500/40 px-4 py-3 text-xs text-emerald-300 shadow-md flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
                  </div>
                  <span className="text-[10px] font-mono">AI is reading request & checking schedule...</span>
                </div>
              </div>
            )}

            {/* Step 3+: AI Response */}
            {chatStep >= 3 && (
              <div className="flex items-start gap-2.5 flex-row-reverse transition-all duration-300">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="max-w-[85%] rounded-2xl rounded-tr-none bg-emerald-950/70 border border-emerald-500/40 p-3.5 text-xs text-emerald-100 shadow-md">
                  <div className="text-[10px] font-mono text-emerald-400 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>FORGE AI Receptionist • Instant (380ms)</span>
                  </div>
                  "Hello! We would love to help you. I have an opening with Dr. Sarah Jenkins on **Tuesday at 3:00 PM**, or **Thursday at 11:00 AM**. Would either of those fit your schedule?"
                </div>
              </div>
            )}

            {/* Step 4+: Customer Confirms & Availability Checked */}
            {chatStep >= 4 && (
              <div className="flex items-start gap-2.5 transition-all duration-300">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="max-w-[85%] rounded-2xl rounded-tl-none bg-slate-900/90 border border-slate-700/60 p-3 text-xs text-white shadow-md">
                  <div className="text-[10px] font-mono text-slate-400 mb-1">Customer • 14:03</div>
                  "Tuesday at 3:00 PM is perfect! Please book that for me."
                </div>
              </div>
            )}

            {/* Step 5: Final Confirmation & Lock */}
            {chatStep >= 5 && (
              <div className="flex items-start gap-2.5 flex-row-reverse transition-all duration-300">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="max-w-[85%] rounded-2xl rounded-tr-none bg-emerald-950/70 border border-emerald-500/40 p-3 text-xs text-emerald-100 shadow-md">
                  <div className="text-[10px] font-mono text-emerald-400 mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Locked & Synced</span>
                  </div>
                  "You're all set! I've reserved Tuesday at 3:00 PM for you. A calendar invite and SMS reminder have been dispatched."
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Appointment Confirmed Dynamic Card */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className={`p-5 rounded-2xl border transition-all duration-500 ${
              chatStep >= 4 
                ? 'bg-gradient-to-b from-[#092219] to-[#04120d] border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.25)] scale-100' 
                : 'bg-slate-950/60 border-slate-800 opacity-60 scale-95'
            }`}>
              
              <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3 mb-4 font-mono text-xs">
                <span className="text-emerald-400 font-bold uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {chatStep >= 4 ? 'APPOINTMENT CONFIRMED' : 'RESERVING SLOT...'}
                </span>
                <span className="text-[10px] text-slate-400">ID: #FRG-8821</span>
              </div>

              <div className="space-y-3 font-sans text-xs">
                <div className="p-3 rounded-xl bg-[#030d09] border border-emerald-950 flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase">DATE & TIME</div>
                    <div className="font-bold text-white text-sm">Tuesday · 3:00 PM EST</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#030d09] border border-emerald-950 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-cyan-400 shrink-0" />
                  <div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase">PRACTITIONER</div>
                    <div className="font-bold text-white text-sm">Dr. Sarah Jenkins (Room 4)</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-emerald-950/80 space-y-1.5 text-[10px] font-mono text-slate-400">
                  <div className="flex items-center justify-between text-emerald-300">
                    <span>Google Calendar Sync:</span>
                    <span className="font-bold">✓ Synced</span>
                  </div>
                  <div className="flex items-center justify-between text-emerald-300">
                    <span>Automated SMS Reminder:</span>
                    <span className="font-bold">✓ Scheduled</span>
                  </div>
                  <div className="flex items-center justify-between text-emerald-300">
                    <span>Status:</span>
                    <span className="font-bold text-emerald-400">
                      {chatStep === 5 ? 'TASK COMPLETED ✓' : 'PROCESSING'}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Banner with Explanation & Action Trigger */}
        <div className="relative z-10 pt-4 mt-4 border-t border-emerald-950/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              <strong className="text-white">Zero Receptionist Fatigue:</strong> Answers in 3 seconds, day or night, converting after-hours inquiries into booked revenue.
            </p>
          </div>
          
          {onNextStep && (
            <ActionButton
              variant="primary"
              size="md"
              onClick={onNextStep}
              icon={ArrowRight}
              iconPosition="right"
              className="w-full sm:w-auto text-xs font-mono uppercase shrink-0"
            >
              See AI Sales Qualifier
            </ActionButton>
          )}
        </div>

      </div>

    </div>
  );
}
