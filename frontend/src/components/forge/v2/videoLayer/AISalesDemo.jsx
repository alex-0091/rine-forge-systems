import React, { useState, useEffect } from 'react';
import { Target, Users, TrendingUp, CheckCircle2, Building2, DollarSign, Database, ArrowRight, RotateCcw, Sparkles, BarChart3 } from 'lucide-react';
import { forgeAudioSynth } from '../../../../utils/forgeAudioSynth';

export function AISalesDemo({ onNextStep }) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [leadStep, setLeadStep] = useState(0);

  // Progressive lead qualification sequence
  useEffect(() => {
    const timer = setInterval(() => {
      setLeadStep(prev => {
        if (prev >= 4) return 0;
        return prev + 1;
      });
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const handleRestart = () => {
    forgeAudioSynth.playClick();
    setLeadStep(0);
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#10101e] via-[#090915] to-[#04040a] border-2 border-violet-500/40 p-6 sm:p-9 shadow-2xl space-y-6">
      
      {/* Optional MP4 Drop-in Layer */}
      {!videoError && (
        <video
          src="/videos/v05-ai-sales.mp4"
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
        <div className="flex items-center gap-2">
          <button
            onClick={handleRestart}
            className="px-2.5 py-1 rounded-full bg-slate-900 border border-violet-500/30 text-violet-300 text-[10px] font-bold flex items-center gap-1 hover:border-violet-400"
          >
            <RotateCcw className="w-3 h-3" /> Replay Flow
          </button>
          <span className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/30 text-[10px] font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-violet-400" /> INSTANT SCORING
          </span>
        </div>
      </div>

      {/* Main Interactive Lead Qualification Visual */}
      <div className="relative z-10 min-h-[400px] sm:min-h-[440px] rounded-2xl bg-[#070712]/95 border border-violet-900/40 p-5 sm:p-8 flex flex-col justify-between overflow-hidden">
        
        {/* Subtle Violet Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#8b5cf615_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto items-center">
          
          {/* Left Column: Lead Conversation Stream */}
          <div className="lg:col-span-7 space-y-3.5">
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-950/80 border border-violet-900/40 text-[11px] font-mono">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                <span>Source: Web Form → Live Voice / SMS Concierge</span>
              </div>
              <span className="text-violet-400 font-bold">Qualification: Active</span>
            </div>

            {/* Inbound Lead Notification */}
            <div className="p-3.5 rounded-2xl bg-[#0d0d22] border border-violet-800/40 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Dr. Sarah Jenkins</span>
                  <span className="text-[10px] font-mono text-emerald-400 font-semibold">New Inbound</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">Jenkins Dental Group · 3 Clinics</div>
              </div>
            </div>

            {/* AI Qualifying Prompt */}
            {leadStep >= 1 && (
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-700/60 text-xs text-slate-200">
                <div className="text-[10px] font-mono text-violet-400 mb-1 flex items-center gap-1.5 font-bold">
                  <Target className="w-3.5 h-3.5" /> FORGE Discovery Agent:
                </div>
                "Welcome Dr. Jenkins! To tailor your setup: How many patient treatment chairs do you operate, and how many calls go unanswered during peak hours?"
              </div>
            )}

            {/* Lead Response */}
            {leadStep >= 2 && (
              <div className="p-3.5 rounded-2xl bg-violet-950/70 border border-violet-500/40 text-xs text-violet-100">
                <div className="text-[10px] font-mono text-slate-400 mb-1 font-bold">
                  Dr. Jenkins:
                </div>
                "We operate 12 chairs across 3 locations. Our front desks miss roughly 30–45 patient calls every week, costing us tens of thousands in lost treatments."
              </div>
            )}

            {/* AI Confirmation */}
            {leadStep >= 3 && (
              <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-xs text-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Lead qualified as Tier-1 High Value. Strategy call auto-booked.</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400">CALENDAR LOCKED</span>
              </div>
            )}
          </div>

          {/* Right Column: AI Lead Intelligence & CRM Card */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className={`p-5 rounded-2xl border transition-all duration-500 ${
              leadStep >= 2 
                ? 'bg-gradient-to-b from-[#15122e] to-[#0a081c] border-violet-400 shadow-[0_0_30px_rgba(139,92,246,0.25)] scale-100' 
                : 'bg-slate-950/60 border-slate-800 opacity-60 scale-95'
            }`}>
              
              <div className="flex items-center justify-between border-b border-violet-900/60 pb-3 mb-4 font-mono text-xs">
                <span className="text-violet-400 font-bold uppercase flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-violet-400" />
                  AI SCORE & CRM SYNC
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                  98 / 100 SCORE
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
                  <div className="text-[10px] font-mono text-slate-400 uppercase">SUGGESTED SOLUTION</div>
                  <div className="font-bold text-white text-xs">
                    Multi-Clinic Forge Voice + WhatsApp Suite
                  </div>
                </div>

                <div className="pt-2 border-t border-violet-950/80 space-y-1.5 text-[10px] font-mono text-slate-400">
                  <div className="flex items-center justify-between text-violet-300">
                    <span>HubSpot CRM Pipeline:</span>
                    <span className="font-bold text-emerald-400">✓ In Deal Stage: Demo Scheduled</span>
                  </div>
                  <div className="flex items-center justify-between text-violet-300">
                    <span>Account Exec Alert:</span>
                    <span className="font-bold text-emerald-400">✓ Slack notification dispatched</span>
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
              <strong className="text-white">Zero Cold Leads:</strong> Leads are qualified, scored, and booked within 60 seconds before they look at your competitor.
            </p>
          </div>
          
          {onNextStep && (
            <button
              onClick={() => {
                forgeAudioSynth.playClick();
                onNextStep();
              }}
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-violet-500 hover:bg-violet-400 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-violet-500/20 hover:scale-105 flex items-center justify-center gap-2 shrink-0"
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
