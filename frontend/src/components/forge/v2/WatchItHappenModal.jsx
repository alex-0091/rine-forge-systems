import React, { useState, useEffect, useRef } from 'react';
import { X, Play, RotateCcw, CheckCircle2, Bot, Sparkles, ArrowRight, ShieldCheck, Zap, MessageSquare, Calendar, Building2 } from 'lucide-react';
import { forgeAudioSynth } from '../../../utils/forgeAudioSynth';

export function WatchItHappenModal({ isOpen, onClose, demoData }) {
  if (!isOpen || !demoData) return null;

  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const timerRef = useRef(null);

  const steps = demoData.steps || [
    { title: 'Inbound Trigger', detail: 'Event detected from customer channel in 350ms.', badge: 'TRIGGERED' },
    { title: 'AI Extraction', detail: 'Intent classified with zero hallucinations.', badge: 'ANALYZED' },
    { title: 'Real-time Lookup', detail: 'Database and calendar synchronized.', badge: 'VERIFIED' },
    { title: 'Action Dispatched', detail: 'Instant confirmation sent & CRM logged.', badge: 'COMPLETED ✓' }
  ];

  const handleRestart = () => {
    forgeAudioSynth.playClick();
    setCurrentStep(0);
    setIsRunning(true);
  };

  useEffect(() => {
    if (!isRunning) return;

    timerRef.current = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        forgeAudioSynth.playClick();
        setCurrentStep(prev => prev + 1);
      } else {
        forgeAudioSynth.playSuccess();
        setIsRunning(false);
      }
    }, 1400);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentStep, isRunning, steps.length]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-xl rounded-3xl bg-[#060b16] border-2 border-teal-500/40 p-6 sm:p-8 shadow-2xl shadow-teal-500/10 space-y-6 overflow-hidden max-h-[90vh] flex flex-col justify-between">
        
        {/* Subtle Ambient Background Light */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  {demoData.title}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  AI ONLINE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                {demoData.subtitle || 'Real-time Autonomous Workflow Demonstration'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Step Progression Visual */}
        <div className="space-y-3 font-sans">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>LIVE EXECUTION PIPELINE</span>
            <span className="text-teal-400 font-bold">
              STEP 0{currentStep + 1} OF 0{steps.length}
            </span>
          </div>

          {/* Stepper Progress Bar */}
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          {/* Step Cards */}
          <div className="space-y-2.5 pt-2">
            {steps.map((st, idx) => {
              const isPassed = currentStep > idx;
              const isCurrent = currentStep === idx;
              return (
                <div 
                  key={idx}
                  className={`p-3.5 rounded-xl border transition-all duration-300 flex items-start justify-between gap-3 ${
                    isCurrent
                      ? 'bg-teal-950/40 border-teal-400 shadow-md shadow-teal-500/10 scale-[1.01]'
                      : isPassed
                        ? 'bg-slate-900/60 border-emerald-500/40 opacity-90'
                        : 'bg-slate-950/40 border-slate-900 opacity-40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-[10px] font-bold shrink-0 mt-0.5 ${
                      isPassed 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                        : isCurrent
                          ? 'bg-teal-500 text-slate-950 font-black'
                          : 'bg-slate-800 text-slate-500'
                    }`}>
                      {isPassed ? '✓' : `0${idx + 1}`}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{st.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                        {st.detail}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border shrink-0 ${
                    isPassed || (isCurrent && idx === steps.length - 1)
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                      : isCurrent
                        ? 'bg-teal-500/15 border-teal-500/40 text-teal-300 animate-pulse'
                        : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}>
                    {st.badge}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Outcome Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/40 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="text-white font-bold block">
                {currentStep === steps.length - 1 ? 'TASK COMPLETED ✓' : 'PROCESSING AUTOMATION...'}
              </span>
              <span className="text-[10px] text-slate-400">
                100% Deterministic • Zero Human Delay
              </span>
            </div>
          </div>

          <button
            onClick={handleRestart}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-bold flex items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3 h-3" /> Replay
          </button>
        </div>

        {/* Footer Close / Next */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-mono text-xs font-bold transition-all"
          >
            Close Demo
          </button>
        </div>

      </div>
    </div>
  );
}
