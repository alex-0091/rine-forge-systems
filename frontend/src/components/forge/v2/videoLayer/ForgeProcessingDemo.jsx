import React, { useState, useEffect } from 'react';
import { Cpu, CheckCircle2, RefreshCw, ArrowRight, Database, BrainCircuit, Play, Sparkles, ShieldAlert, Zap } from 'lucide-react';
import { forgeAudioSynth } from '../../../../utils/forgeAudioSynth';

export function ForgeProcessingDemo({ onNextStep }) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const steps = [
    {
      id: 0,
      title: 'UNDERSTANDING REQUEST',
      badge: 'NLP & Intent Extraction',
      description: 'Customer voice/text parsed. Intent classified: "Emergency Dental Appointment Booking".',
      dataKey: 'Intent',
      dataValue: 'Booking_Appointment_Confirmed',
      confidence: '99.4% Confidence',
      status: 'COMPLETE ✓',
      color: 'cyan'
    },
    {
      id: 1,
      title: 'CHECKING INFORMATION',
      badge: 'Database & Real-time CRM',
      description: 'Querying live doctor schedule, chair availability, and patient insurance pre-verification.',
      dataKey: 'Slot Found',
      dataValue: 'Tuesday, 3:00 PM (Dr. Jenkins)',
      confidence: 'Live Sync Active',
      status: 'COMPLETE ✓',
      color: 'emerald'
    },
    {
      id: 2,
      title: 'CHOOSING ACTION',
      badge: 'Deterministic Decision Engine',
      description: 'AI selects optimal policy: Propose slot, reserve temporary lock, draft WhatsApp confirmation.',
      dataKey: 'Selected Policy',
      dataValue: 'RESERVE_AND_CONFIRM_V2',
      confidence: 'Zero Hallucination Guard',
      status: 'COMPLETE ✓',
      color: 'indigo'
    },
    {
      id: 3,
      title: 'EXECUTING ACTION',
      badge: 'Automated API Execution',
      description: 'Calendar invite locked, SMS + WhatsApp confirmation fired, CRM lead status moved to Qualified.',
      dataKey: 'Webhook Status',
      dataValue: '200 OK (Processed in 410ms)',
      confidence: 'Action Executed',
      status: 'ACTION COMPLETE ✓',
      color: 'amber'
    }
  ];

  // Cycling auto-play
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % 4);
    }, 2400);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const handleManualStep = (index) => {
    forgeAudioSynth.playClick();
    setCurrentStep(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#060e1d] via-[#040813] to-[#02040a] border-2 border-indigo-500/40 p-6 sm:p-9 shadow-2xl space-y-6">
      
      {/* Optional MP4 Drop-in Layer */}
      {!videoError && (
        <video
          src="/videos/v03-forge-processing.mp4"
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
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-indigo-950/60 pb-4 font-mono text-xs">
        <div className="flex items-center gap-2.5 text-indigo-400 font-bold">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-ping" />
          <span className="uppercase tracking-wider">STAGE 3: THE FORGE PROCESSING ENGINE</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              forgeAudioSynth.playClick();
              setIsAutoPlaying(!isAutoPlaying);
            }}
            className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-[10px] font-bold flex items-center gap-1 hover:border-slate-500"
          >
            {isAutoPlaying ? <span className="text-emerald-400">● Auto-Cycling</span> : <span>⏸ Paused</span>}
          </button>
          <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
            ⚡ 4-STEP PIPELINE
          </span>
        </div>
      </div>

      {/* Main Processing Visual Canvas */}
      <div className="relative z-10 min-h-[380px] sm:min-h-[420px] rounded-2xl bg-[#030610]/95 border border-indigo-900/40 p-5 sm:p-8 flex flex-col justify-between overflow-hidden">
        
        {/* Subtle Neon Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#6366f115_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        {/* Pipeline Navigation / Step Headers */}
        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 mb-6">
          {steps.map((step, idx) => {
            const isActive = currentStep === idx;
            const isPassed = currentStep > idx;
            return (
              <button
                key={step.id}
                onClick={() => handleManualStep(idx)}
                className={`p-3 rounded-xl border text-left transition-all duration-300 ${
                  isActive 
                    ? 'bg-indigo-950/80 border-indigo-400 shadow-lg shadow-indigo-500/20 scale-[1.02]' 
                    : isPassed
                      ? 'bg-slate-900/60 border-slate-700/60 opacity-90'
                      : 'bg-slate-950/40 border-slate-800/40 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[9px] mb-1">
                  <span className={`font-bold ${isActive ? 'text-indigo-400' : 'text-slate-400'}`}>
                    STEP 0{idx + 1}
                  </span>
                  {isPassed ? (
                    <span className="text-emerald-400 font-bold">DONE ✓</span>
                  ) : isActive ? (
                    <span className="text-indigo-300 animate-pulse font-bold">ACTIVE</span>
                  ) : (
                    <span className="text-slate-500">WAITING</span>
                  )}
                </div>
                <div className="text-xs font-bold text-white truncate">{step.title}</div>
              </button>
            );
          })}
        </div>

        {/* Active Step Deep-Dive Card */}
        <div className="relative z-10 my-auto bg-gradient-to-b from-[#070e20] to-[#040916] rounded-2xl border border-indigo-500/30 p-5 sm:p-7 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-indigo-950 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
                <BrainCircuit className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold uppercase">
                    {steps[currentStep].badge}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                    {steps[currentStep].confidence}
                  </span>
                </div>
                <h3 className="text-lg font-black text-white mt-1">{steps[currentStep].title}</h3>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-[#02050f] px-3.5 py-1.5 rounded-xl border border-indigo-900/60 font-mono text-xs text-indigo-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>STATUS: {steps[currentStep].status}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 text-xs font-mono">
            <div className="bg-[#02050d] p-3.5 rounded-xl border border-indigo-950">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">EXECUTION DETAILS</span>
              <p className="font-sans text-slate-200 leading-relaxed text-xs">
                {steps[currentStep].description}
              </p>
            </div>

            <div className="bg-[#02050d] p-3.5 rounded-xl border border-indigo-950 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">PARSED DATA PAYLOAD</span>
                <div className="text-indigo-300 font-bold text-xs truncate">
                  {steps[currentStep].dataKey}: <span className="text-emerald-400">{steps[currentStep].dataValue}</span>
                </div>
              </div>
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-3">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500" 
                  style={{ width: `${(currentStep + 1) * 25}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner with Action Trigger */}
        <div className="relative z-10 pt-4 mt-4 border-t border-indigo-950/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              <strong className="text-white">Deterministic & Safe:</strong> Every step runs against verified business rules with zero hallucination.
            </p>
          </div>
          
          {onNextStep && (
            <button
              onClick={() => {
                forgeAudioSynth.playClick();
                onNextStep();
              }}
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-indigo-500/20 hover:scale-105 flex items-center justify-center gap-2 shrink-0"
            >
              <span>Watch Live AI Receptionist</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
