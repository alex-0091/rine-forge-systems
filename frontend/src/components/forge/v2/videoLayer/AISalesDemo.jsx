import React, { useState, useEffect, useRef } from 'react';
import { Target, Users, TrendingUp, CheckCircle2, Building2, DollarSign, Database, ArrowRight, RotateCcw, Sparkles, BarChart3, Play, Check, ShieldCheck } from 'lucide-react';
import { forgeAudioSynth } from '../../../../utils/forgeAudioSynth';

export function AISalesDemo({ onNextStep }) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  
  // Interactive Step Sequence:
  // 0: Idle (Ready for user click)
  // 1: NEW LEAD arrives
  // 2: AI asks question
  // 3: Customer answers
  // 4: AI analyzes
  // 5: Lead qualified
  // 6: CRM updated (HIGH-QUALITY LEAD ✓)
  const [leadStep, setLeadStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const stepTimeoutRef = useRef(null);

  const startDemo = () => {
    forgeAudioSynth.playClick();
    if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
    setLeadStep(1);
    setIsRunning(true);
  };

  const resetDemo = () => {
    forgeAudioSynth.playClick();
    if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
    setLeadStep(0);
    setIsRunning(false);
  };

  useEffect(() => {
    if (!isRunning) return;

    if (leadStep === 1) {
      // 1 -> 2: AI asks question after 1.2s
      stepTimeoutRef.current = setTimeout(() => {
        forgeAudioSynth.playScan();
        setLeadStep(2);
      }, 1200);
    } else if (leadStep === 2) {
      // 2 -> 3: Customer answers after 1.8s
      stepTimeoutRef.current = setTimeout(() => {
        forgeAudioSynth.playClick();
        setLeadStep(3);
      }, 1800);
    } else if (leadStep === 3) {
      // 3 -> 4: AI analyzes after 1.6s
      stepTimeoutRef.current = setTimeout(() => {
        forgeAudioSynth.playScan();
        setLeadStep(4);
      }, 1600);
    } else if (leadStep === 4) {
      // 4 -> 5: Lead qualified after 1.6s
      stepTimeoutRef.current = setTimeout(() => {
        forgeAudioSynth.playClick();
        setLeadStep(5);
      }, 1600);
    } else if (leadStep === 5) {
      // 5 -> 6: CRM updated (HIGH-QUALITY LEAD ✓) after 1.4s
      stepTimeoutRef.current = setTimeout(() => {
        forgeAudioSynth.playSuccess();
        setLeadStep(6);
        setIsRunning(false);
      }, 1400);
    }

    return () => {
      if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
    };
  }, [leadStep, isRunning]);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#10101e] via-[#090915] to-[#04040a] border-2 border-violet-500/40 p-6 sm:p-9 shadow-2xl space-y-6">
      
      {/* Optional MP4 Drop-in Layer */}
      {!videoError && (
        <video
          src="/videos/v05-ai-sales.mp4"
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
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-violet-950/60 pb-4 font-mono text-xs">
        <div className="flex items-center gap-2.5 text-violet-400 font-bold">
          <span className="w-2.5 h-2.5 rounded-full bg-violet-400 animate-ping" />
          <span className="uppercase tracking-wider">STAGE 5: AUTONOMOUS LEAD QUALIFICATION</span>
        </div>
        
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/30 text-[10px] font-bold flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3 h-3 text-violet-400" /> SPEED-TO-LEAD &lt; 45S
          </span>

          {leadStep === 6 && (
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400 text-[10px] font-bold flex items-center gap-1 shadow-md shadow-emerald-500/10">
              <Check className="w-3 h-3 text-emerald-400" /> HIGH-QUALITY LEAD ✓
            </span>
          )}
        </div>
      </div>

      {/* Main Interactive Lead Qualification Visual */}
      <div className="relative z-10 min-h-[440px] sm:min-h-[480px] rounded-2xl bg-[#070712]/95 border border-violet-900/40 p-5 sm:p-8 flex flex-col justify-between overflow-hidden">
        
        {/* Subtle Violet Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#8b5cf615_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        {/* Primary Interactive Action Bar */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 pb-4 mb-3 border-b border-violet-950/60">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <Target className="w-4 h-4 text-violet-400" />
            <span>Multi-Channel Inbound: Web Form &rarr; Instant 2-Way Discovery</span>
          </div>

          {/* Interactive Trigger Button */}
          {leadStep === 0 ? (
            <button
              onClick={startDemo}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-400 hover:to-indigo-400 text-white font-black text-xs font-mono tracking-wider uppercase transition-all shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>▶ WATCH AI QUALIFY A LEAD</span>
            </button>
          ) : (
            <button
              onClick={leadStep === 6 ? startDemo : resetDemo}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-violet-500/40 text-violet-300 font-bold text-xs font-mono flex items-center justify-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{leadStep === 6 ? '▶ REPLAY: WATCH AI QUALIFY A LEAD' : 'Reset Flow'}</span>
            </button>
          )}
        </div>

        {/* Pipeline Step Sequence Visual Indicators */}
        <div className="relative z-10 grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4 font-mono text-[9px]">
          {[
            { id: 1, label: 'NEW LEAD' },
            { id: 2, label: 'AI ASKS QUESTION' },
            { id: 3, label: 'CUSTOMER ANSWERS' },
            { id: 4, label: 'AI ANALYZES' },
            { id: 5, label: 'LEAD QUALIFIED' },
            { id: 6, label: 'CRM UPDATED' },
          ].map(st => {
            const isCurrent = leadStep === st.id;
            const isDone = leadStep > st.id;
            return (
              <div 
                key={st.id}
                className={`p-1.5 rounded-lg border text-center transition-all ${
                  isCurrent 
                    ? 'bg-violet-950 border-violet-400 text-violet-200 font-bold shadow-sm' 
                    : isDone 
                      ? 'bg-slate-900/80 border-emerald-500/40 text-emerald-400' 
                      : 'bg-slate-950/40 border-slate-800 text-slate-500'
                }`}
              >
                {st.label}
              </div>
            );
          })}
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto items-center">
          
          {/* Left Column: Lead Conversation Stream */}
          <div className="lg:col-span-7 space-y-3">
            
            {/* Step 0: Idle Prompt */}
            {leadStep === 0 && (
              <div className="p-6 rounded-2xl bg-slate-950/80 border border-violet-900/30 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/30 mx-auto flex items-center justify-center text-violet-400">
                  <Target className="w-6 h-6 animate-pulse" />
                </div>
                <div className="text-sm font-bold text-white font-sans">
                  Watch autonomous speed-to-lead in under 45 seconds
                </div>
                <p className="text-xs text-slate-400 max-w-md mx-auto font-sans leading-relaxed">
                  When a prospective client contacts your business, FORGE engages immediately, qualifies their budget, size, and urgency, and locks the sales calendar.
                </p>
                <button
                  onClick={startDemo}
                  className="px-6 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-400 text-white font-black text-xs font-mono uppercase tracking-wider transition-all shadow-lg shadow-violet-500/20 hover:scale-105"
                >
                  ▶ WATCH AI QUALIFY A LEAD
                </button>
              </div>
            )}

            {/* Step 1+: NEW LEAD Banner */}
            {leadStep >= 1 && (
              <div className="p-3 rounded-2xl bg-[#0d0d22] border border-violet-800/50 flex items-center gap-3 transition-all duration-300">
                <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-400 shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Dr. Sarah Jenkins</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                      NEW LEAD
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">Jenkins Dental Group &bull; 3 Clinics</div>
                </div>
              </div>
            )}

            {/* Step 2+: AI asks question */}
            {leadStep >= 2 && (
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/60 text-xs text-slate-200 transition-all duration-300">
                <div className="text-[10px] font-mono text-violet-400 mb-1 flex items-center gap-1.5 font-bold">
                  <Target className="w-3.5 h-3.5" /> FORGE Discovery Agent:
                </div>
                "Welcome Dr. Jenkins! To calibrate your deployment: How many patient treatment chairs do you operate, and how many calls go unanswered during peak hours?"
              </div>
            )}

            {/* Step 3+: Customer answers */}
            {leadStep >= 3 && (
              <div className="p-3.5 rounded-2xl bg-violet-950/70 border border-violet-500/40 text-xs text-violet-100 transition-all duration-300">
                <div className="text-[10px] font-mono text-slate-400 mb-1 font-bold">
                  Dr. Jenkins (Customer Response):
                </div>
                "We operate 12 chairs across 3 locations. Our front desks miss roughly 30–45 patient calls every week, costing us tens of thousands in lost treatments."
              </div>
            )}

            {/* Step 4+: AI Analyzes */}
            {leadStep === 4 && (
              <div className="p-3 rounded-xl bg-violet-900/40 border border-violet-500/40 text-xs text-violet-300 flex items-center gap-2 animate-pulse">
                <BarChart3 className="w-4 h-4 text-violet-400 animate-spin" />
                <span className="font-mono text-[11px]">AI analyzing revenue impact and sizing recommended configuration...</span>
              </div>
            )}

            {/* Step 5+: Lead Qualified & CRM Updated */}
            {leadStep >= 5 && (
              <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-200 flex items-center justify-between transition-all duration-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Lead qualified as Tier-1 High Value. Strategy demo auto-scheduled.</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded">
                  CRM SYNCED ✓
                </span>
              </div>
            )}
          </div>

          {/* Right Column: AI Lead Intelligence & CRM Card */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className={`p-5 rounded-2xl border transition-all duration-500 ${
              leadStep >= 4 
                ? 'bg-gradient-to-b from-[#15122e] to-[#0a081c] border-violet-400 shadow-[0_0_30px_rgba(139,92,246,0.25)] scale-100' 
                : 'bg-slate-950/60 border-slate-800 opacity-60 scale-95'
            }`}>
              
              <div className="flex items-center justify-between border-b border-violet-900/60 pb-3 mb-4 font-mono text-xs">
                <span className="text-violet-400 font-bold uppercase flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-violet-400" />
                  AI SCORE & CRM SYNC
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                  {leadStep >= 5 ? '98 / 100 SCORE' : 'CALCULATING...'}
                </span>
              </div>

              <div className="space-y-3 font-sans text-xs">
                <div className="p-3 rounded-xl bg-[#060514] border border-violet-950 space-y-1">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">CALCULATED REVENUE LEAK</div>
                  <div className="font-bold text-rose-400 text-base flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span>$18,400 / Month</span>
                    <span className="text-[10px] text-slate-400 font-normal">(42 missed leads)</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#060514] border border-violet-950 space-y-1">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">RECOMMENDED SOLUTION</div>
                  <div className="font-bold text-white text-xs">
                    Multi-Clinic Forge Voice + WhatsApp Suite
                  </div>
                </div>

                <div className="pt-2 border-t border-violet-950/80 space-y-1.5 text-[10px] font-mono text-slate-400">
                  <div className="flex items-center justify-between text-violet-300">
                    <span>HubSpot CRM Status:</span>
                    <span className="font-bold text-emerald-400">
                      {leadStep >= 6 ? '✓ Deal Created: Demo Booked' : 'Pending Qualification'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-violet-300">
                    <span>Account Exec Notification:</span>
                    <span className="font-bold text-emerald-400">
                      {leadStep >= 6 ? '✓ Slack Alert Dispatched' : 'Queued'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-violet-300">
                    <span>Final Qualification:</span>
                    <span className="font-bold text-emerald-400">
                      {leadStep === 6 ? 'HIGH-QUALITY LEAD ✓' : 'PROCESSING'}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Banner with Explanation & Action Trigger */}
        <div className="relative z-10 pt-4 mt-4 border-t border-violet-950/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-violet-400" />
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              <strong className="text-white">Zero Cold Leads:</strong> Leads are qualified, scored, and booked within 45 seconds before they look at your competitor.
            </p>
          </div>
          
          {onNextStep && (
            <button
              onClick={() => {
                forgeAudioSynth.playClick();
                onNextStep();
              }}
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-violet-500 hover:bg-violet-400 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-violet-500/20 hover:scale-105 flex items-center justify-center gap-2 shrink-0 font-mono"
            >
              <span>See Before vs After Impact</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
