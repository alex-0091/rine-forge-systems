import React, { useState, useEffect } from 'react';
import { 
  User, Bot, Calendar, Clock, CheckCircle2, RotateCcw, 
  Sparkles, Send, ShieldCheck, PhoneCall, MessageSquare 
} from 'lucide-react';
import { AiStatusBadge } from './AiStatusBadge';
import { forgeAudioSynth } from '../../../utils/forgeAudioSynth';

/**
 * RINE FORGE SYSTEMS — V4 HUMAN-FRIENDLY AI CHAT EXPERIENCE
 * Realistic conversational customer service demonstration with:
 * - Natural typing indicators
 * - Sequential realistic message bubbles
 * - Calendar availability verification animation
 * - Action confirmation receipt
 */
export function HumanAiDemoChat({
  scenarioTitle = "AI Receptionist Demonstration",
  industryName = "Dental Clinic",
  onReplay = null,
  className = ""
}) {
  const [step, setStep] = useState(0); // 0: Customer, 1: AI Typing, 2: AI Reply, 3: Checking Cal, 4: Confirmed
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // 5-step human conversational sequence
  useEffect(() => {
    if (!isAutoPlaying) return;

    let timer = null;
    if (step === 0) {
      timer = setTimeout(() => {
        forgeAudioSynth.playScan();
        setStep(1); // AI starts typing
      }, 1600);
    } else if (step === 1) {
      timer = setTimeout(() => {
        forgeAudioSynth.playClick();
        setStep(2); // AI message arrives
      }, 1400);
    } else if (step === 2) {
      timer = setTimeout(() => {
        forgeAudioSynth.playScan();
        setStep(3); // Checking calendar
      }, 1800);
    } else if (step === 3) {
      timer = setTimeout(() => {
        forgeAudioSynth.playSuccess();
        setStep(4); // Confirmed
      }, 1600);
    }

    return () => clearTimeout(timer);
  }, [step, isAutoPlaying]);

  const handleRestart = () => {
    forgeAudioSynth.playClick();
    setStep(0);
    setIsAutoPlaying(true);
    if (onReplay) onReplay();
  };

  return (
    <div className={`rounded-3xl bg-[#090e1c] border-2 border-slate-800/80 p-5 sm:p-7 shadow-2xl space-y-5 relative overflow-hidden ${className}`}>
      
      {/* Top Header: Industry, Live Status, Replay */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-300 font-bold">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-black font-mono text-white uppercase tracking-wider">
                {scenarioTitle}
              </h4>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                {industryName}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">
              Live conversation preview • No human staff required
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <AiStatusBadge 
            status={
              step === 1 ? 'thinking' :
              step === 3 ? 'checking' :
              step === 4 ? 'completed' : 'online'
            }
            size="sm"
          />

          <button
            type="button"
            onClick={handleRestart}
            aria-label="Replay conversation"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/80 transition-all active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div className="space-y-3.5 min-h-[220px] font-sans text-xs flex flex-col justify-end">
        
        {/* Customer Message (Right) */}
        <div className="flex items-end justify-end gap-2.5">
          <div className="max-w-sm p-3.5 rounded-2xl rounded-br-none bg-slate-800/90 border border-slate-700/70 text-slate-100 shadow-md">
            <p className="leading-relaxed">
              "Hi! Can I book an urgent exam for tomorrow at 3:00 PM? Do you accept Delta Dental?"
            </p>
            <span className="text-[9px] font-mono text-slate-400 block text-right mt-1">
              Just now • Customer (WhatsApp)
            </span>
          </div>
          <div className="w-7 h-7 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mb-1">
            <User className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* AI Typing Indicator */}
        {step === 1 && (
          <div className="flex items-center gap-2.5 animate-fadeIn">
            <div className="w-7 h-7 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="px-4 py-2.5 rounded-2xl rounded-bl-none bg-[#0f172a] border border-teal-500/30 flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce [animation-delay:0.4s]" />
              <span className="text-[10px] font-mono text-teal-300 ml-1">AI replying in 0.3s...</span>
            </div>
          </div>
        )}

        {/* AI Response Message (Left) */}
        {step >= 2 && (
          <div className="flex items-end gap-2.5 animate-fadeIn">
            <div className="w-7 h-7 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 shrink-0 mb-1">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="max-w-sm p-3.5 rounded-2xl rounded-bl-none bg-gradient-to-br from-[#0f172a] to-[#0d1c2b] border border-teal-500/40 text-slate-100 shadow-lg space-y-2">
              <p className="leading-relaxed">
                "Hello Alex! Absolutely. I have Dr. Evans available tomorrow at 3:00 PM. We do accept Delta Dental PPO."
              </p>
              
              {/* Calendar Verification Step */}
              {step >= 3 && (
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-teal-500/30 font-mono text-[10px] space-y-1 animate-fadeIn">
                  <div className="flex items-center justify-between text-teal-300">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-teal-400" />
                      Checking Dr. Evans Calendar (Operatory 2)
                    </span>
                    <span className="text-emerald-400 font-bold">✓ AVAILABLE</span>
                  </div>
                </div>
              )}

              {/* Final Confirmation */}
              {step >= 4 && (
                <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] flex items-center justify-between animate-fadeIn">
                  <span className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Appointment Booked & Intake SMS Dispatched!
                  </span>
                  <span className="text-[9px] text-slate-400">Dentrix Sync ✓</span>
                </div>
              )}

              <span className="text-[9px] font-mono text-slate-400 block mt-1">
                0.4s response • Verified against Practice Database
              </span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
