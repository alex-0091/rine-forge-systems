import React, { useState, useEffect } from 'react';
import { Bot, User, CheckCircle2, Calendar, Clock, Sparkles, Send, ShieldCheck, ArrowRight, RotateCcw } from 'lucide-react';
import { forgeAudioSynth } from '../../../../utils/forgeAudioSynth';

export function AIReceptionistDemo({ onNextStep }) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [chatStep, setChatStep] = useState(0);

  // Progressive conversation replay
  useEffect(() => {
    const timer = setInterval(() => {
      setChatStep(prev => {
        if (prev >= 4) return 0;
        return prev + 1;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleRestart = () => {
    forgeAudioSynth.playClick();
    setChatStep(0);
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#081512] via-[#040c0b] to-[#020605] border-2 border-emerald-500/40 p-6 sm:p-9 shadow-2xl space-y-6">
      
      {/* Optional MP4 Drop-in Layer */}
      {!videoError && (
        <video
          src="/videos/v04-ai-receptionist.mp4"
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
        <div className="flex items-center gap-2">
          <button
            onClick={handleRestart}
            className="px-2.5 py-1 rounded-full bg-slate-900 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold flex items-center gap-1 hover:border-emerald-400"
          >
            <RotateCcw className="w-3 h-3" /> Replay Flow
          </button>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
            ⚡ 100% UNMANNED
          </span>
        </div>
      </div>

      {/* Main Interactive Chat + Booking Visual */}
      <div className="relative z-10 min-h-[400px] sm:min-h-[440px] rounded-2xl bg-[#030a08]/95 border border-emerald-900/40 p-5 sm:p-8 flex flex-col justify-between overflow-hidden">
        
        {/* Subtle Green Matrix/Dot Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#10b98115_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto items-center">
          
          {/* Left Column: WhatsApp / Web Chat Dialog */}
          <div className="lg:col-span-7 space-y-3.5">
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-950/80 border border-emerald-900/40 text-[11px] font-mono">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Channel: WhatsApp Business API</span>
              </div>
              <span className="text-emerald-400 font-bold">Latency: 420ms</span>
            </div>

            {/* Bubble 1: Customer */}
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="max-w-[85%] rounded-2xl rounded-tl-none bg-slate-900/90 border border-slate-700/60 p-3.5 text-xs text-white shadow-md">
                <div className="text-[10px] font-mono text-slate-400 mb-1">Customer • 14:02</div>
                "Hi! I need to book a dental checkup and clean as soon as possible. Do you have anything open this week?"
              </div>
            </div>

            {/* Bubble 2: FORGE AI */}
            {chatStep >= 1 && (
              <div className="flex items-start gap-2.5 flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="max-w-[85%] rounded-2xl rounded-tr-none bg-emerald-950/70 border border-emerald-500/40 p-3.5 text-xs text-emerald-100 shadow-md">
                  <div className="text-[10px] font-mono text-emerald-400 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>FORGE AI Receptionist • Instant</span>
                  </div>
                  "Hello! We would love to help you. I have an opening with Dr. Sarah Jenkins on **Tuesday at 3:00 PM**, or **Thursday at 11:00 AM**. Would either of those fit your schedule?"
                </div>
              </div>
            )}

            {/* Bubble 3: Customer Confirms */}
            {chatStep >= 2 && (
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="max-w-[85%] rounded-2xl rounded-tl-none bg-slate-900/90 border border-slate-700/60 p-3 text-xs text-white shadow-md">
                  <div className="text-[10px] font-mono text-slate-400 mb-1">Customer • 14:03</div>
                  "Tuesday at 3:00 PM is perfect! Please book that for me."
                </div>
              </div>
            )}

            {/* Bubble 4: AI Final Confirmation & Action */}
            {chatStep >= 3 && (
              <div className="flex items-start gap-2.5 flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="max-w-[85%] rounded-2xl rounded-tr-none bg-emerald-950/70 border border-emerald-500/40 p-3 text-xs text-emerald-100 shadow-md">
                  <div className="text-[10px] font-mono text-emerald-400 mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Locked & Synced</span>
                  </div>
                  "You're all set! I've reserved Tuesday at 3:00 PM for you. A calendar invite and SMS reminder have been sent."
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Appointment Confirmed Dynamic Card */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className={`p-5 rounded-2xl border transition-all duration-500 ${
              chatStep >= 3 
                ? 'bg-gradient-to-b from-[#092219] to-[#04120d] border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.25)] scale-100' 
                : 'bg-slate-950/60 border-slate-800 opacity-60 scale-95'
            }`}>
              
              <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3 mb-4 font-mono text-xs">
                <span className="text-emerald-400 font-bold uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {chatStep >= 3 ? 'APPOINTMENT CONFIRMED' : 'RESERVING SLOT...'}
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
            <button
              onClick={() => {
                forgeAudioSynth.playSuccess();
                onNextStep();
              }}
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-emerald-500/20 hover:scale-105 flex items-center justify-center gap-2 shrink-0"
            >
              <span>See AI Sales Qualifier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
