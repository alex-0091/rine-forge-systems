import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Play, Pause, Sparkles, Bot, Calendar, 
  CheckCircle2, MessageSquare, Database, Send, PhoneCall, 
  RefreshCw, ShieldCheck, Flame, Zap, ArrowUpRight
} from 'lucide-react';
import { 
  ReceptionistCharacter, 
  LeadEngineCharacter, 
  SupportCharacter, 
  DocumentCharacter, 
  EmailCharacter, 
  AppointmentCharacter,
  ForgeCoreMascot
} from './ForgeCharacterUniverse';

const HERO_STORY_STEPS = [
  {
    step: 1,
    time: '0s - 2s',
    title: 'Incoming Customer Inquiry',
    icon: MessageSquare,
    badge: 'CUSTOMER ASKS',
    color: 'border-cyan-400 text-cyan-300',
    bubble: '💬 "Hi! Can I book an emergency root canal consultation tomorrow at 3 PM?"',
    actor: 'Patient / Client',
    systemState: 'INBOUND_RECEIVED'
  },
  {
    step: 2,
    time: '2s - 4s',
    title: 'FORGE Autonomous Reasoning',
    icon: Zap,
    badge: 'AI UNDERSTANDING',
    color: 'border-violet-400 text-violet-300',
    bubble: '🧠 Intent: High-Urgency Clinical • Insurance PPO Delta Dental Check • Slot query: 3:00 PM',
    actor: 'FORGE Perception Core',
    systemState: 'REASONING_ACTIVE'
  },
  {
    step: 3,
    time: '4s - 6s',
    title: 'Deterministic Calendar Lock',
    icon: Calendar,
    badge: 'CALENDAR SYNC',
    color: 'border-pink-400 text-pink-300',
    bubble: '📅 Scanned 3 Doctor Schedules → Dr. Reynolds (Operatory 2) Available at 3:00 PM → Slot Locked.',
    actor: 'FORGE Appointment Agent',
    systemState: 'SLOT_RESERVED'
  },
  {
    step: 4,
    time: '6s - 8s',
    title: 'CRM Commit & Confirmation Sent',
    icon: CheckCircle2,
    badge: 'WORK COMPLETED',
    color: 'border-emerald-400 text-emerald-300',
    bubble: '✅ HubSpot record updated • SMS confirmation & intake forms dispatched in 18 seconds total.',
    actor: 'FORGE Receptionist',
    systemState: 'EXECUTION_SUCCESS'
  }
];

export function ForgeV2HeroScene({ onNavigate, onLaunchSystemDemo, onWatchTenSecDemo }) {
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStepIdx(prev => (prev + 1) % HERO_STORY_STEPS.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentStep = HERO_STORY_STEPS[activeStepIdx];

  return (
    <section className="relative pt-8 sm:pt-14 pb-20 sm:pb-28 border-b border-slate-800/80 bg-[#060a12] overflow-hidden">
      
      {/* Dynamic Ambient Background Aura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-teal-500/15 via-cyan-500/10 to-indigo-500/15 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0a_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Top Header & Core Value Prop */}
        <div className="text-center space-y-5 max-w-4xl mx-auto">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono font-bold tracking-wider uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> THE VISUAL AI SYSTEMS EXPERIENCE
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.06] font-sans">
            AI SYSTEMS <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-cyan-400 to-indigo-400">
              THAT DO THE WORK.
            </span>
          </h1>

          <p className="text-lg sm:text-2xl text-slate-300 font-semibold max-w-2xl mx-auto leading-relaxed">
            Watch them work. Touch them. Try them.
          </p>

          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto font-normal">
            No long sales pitches or static cards. Explore real autonomous systems that capture leads, answer calls, extract documents, and run operations 24/7.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => {
                const el = document.getElementById('systems');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else if (onNavigate) onNavigate('systems');
              }}
              className="w-full sm:w-auto px-8 py-4 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-2xl text-xs font-mono transition-all shadow-xl shadow-teal-500/25 flex items-center justify-center gap-2 group hover:scale-[1.02]"
            >
              <span>EXPLORE THE 6 SYSTEMS</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                if (onWatchTenSecDemo) onWatchTenSecDemo('receptionist-agent');
              }}
              className="w-full sm:w-auto px-7 py-4 bg-slate-900/90 hover:bg-slate-850 text-cyan-300 border border-cyan-500/40 font-bold rounded-2xl text-xs font-mono transition-all shadow-md flex items-center justify-center gap-2 hover:scale-[1.02]"
            >
              <Play className="w-4 h-4 fill-current text-cyan-400" />
              <span>WATCH 10-SEC DEMO</span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('try-ai');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else if (onNavigate) onNavigate('try-ai');
              }}
              className="w-full sm:w-auto px-7 py-4 bg-[#090e18] hover:bg-dark-850 text-slate-200 border border-slate-700 font-bold rounded-2xl text-xs font-mono transition-all flex items-center justify-center gap-2"
            >
              <span>TEST IN LIVE SANDBOX</span>
            </button>
          </div>
        </div>

        {/* 🎬 THE LIVING BUSINESS ENVIRONMENT SIMULATION */}
        <div className="p-6 sm:p-10 rounded-3xl bg-[#090e18]/95 border-2 border-teal-500/30 shadow-2xl space-y-8 relative overflow-hidden backdrop-blur-md">
          
          {/* Top Bar: Scene Indicator & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <div>
                <div className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span>LIVE AUTONOMOUS WORKFLOW SCENE</span>
                  <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 text-[10px]">
                    {currentStep.systemState}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">Step 0{activeStepIdx + 1} of 04 • Real-time AI Execution Simulation</div>
              </div>
            </div>

            {/* Play/Pause & Step Buttons */}
            <div className="flex items-center gap-2 font-mono text-xs">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-teal-400 text-slate-200 flex items-center gap-1.5 transition-colors"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{isPlaying ? 'Pause' : 'Play Story'}</span>
              </button>
              
              <div className="flex items-center gap-1">
                {HERO_STORY_STEPS.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveStepIdx(idx);
                      setIsPlaying(false);
                    }}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                      activeStepIdx === idx
                        ? 'bg-teal-500 text-dark-950 font-black shadow'
                        : 'bg-dark-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Visual Stage: Characters & Live Flow */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Animated Character Cast */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-dark-950 border border-slate-800 space-y-4 text-center">
              {activeStepIdx === 0 && (
                <>
                  <div className="w-20 h-20 rounded-2xl bg-cyan-500/10 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 text-3xl shadow-lg shadow-cyan-500/20 animate-bounce">
                    👤
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-sm font-bold text-white">Client Inquiry Arrives</div>
                    <div className="text-[11px] text-cyan-400 font-mono">After-Hours Mobile Channel</div>
                  </div>
                </>
              )}

              {activeStepIdx === 1 && (
                <>
                  <ForgeCoreMascot state="reasoning" size="lg" />
                  <div className="space-y-0.5">
                    <div className="text-sm font-bold text-white">FORGE Reasoning Core</div>
                    <div className="text-[11px] text-violet-400 font-mono">Zero-Hallucination Guardrails</div>
                  </div>
                </>
              )}

              {activeStepIdx === 2 && (
                <>
                  <AppointmentCharacter size="lg" />
                  <div className="space-y-0.5">
                    <div className="text-sm font-bold text-white">Appointment Agent</div>
                    <div className="text-[11px] text-pink-400 font-mono">Google Calendar Engine</div>
                  </div>
                </>
              )}

              {activeStepIdx === 3 && (
                <>
                  <ReceptionistCharacter size="lg" />
                  <div className="space-y-0.5">
                    <div className="text-sm font-bold text-white">Autonomous Receptionist</div>
                    <div className="text-[11px] text-emerald-400 font-mono">HubSpot CRM Synchronized</div>
                  </div>
                </>
              )}
            </div>

            {/* Right: Live Dialogue & Telemetry Feed */}
            <div className="lg:col-span-8 space-y-4">
              <div className={`p-6 rounded-2xl bg-dark-950 border-2 transition-all ${currentStep.color} space-y-4 shadow-xl`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-slate-900 font-bold border border-slate-700">
                    {currentStep.badge} • {currentStep.time}
                  </span>
                  <span className="text-xs font-mono text-slate-400">Actor: <strong className="text-white">{currentStep.actor}</strong></span>
                </div>

                <div className="text-base sm:text-lg font-bold text-white leading-relaxed font-sans">
                  {currentStep.bubble}
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2 text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Deterministic Execution • 100% Policy Bound</span>
                  </div>

                  <button
                    onClick={() => {
                      if (onLaunchSystemDemo) onLaunchSystemDemo('receptionist-agent');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 font-bold flex items-center gap-1.5 transition-all"
                  >
                    <span>Test This In Live Sandbox</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Step Progress Tracker */}
              <div className="grid grid-cols-4 gap-2 font-mono text-[10px]">
                {HERO_STORY_STEPS.map((s, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setActiveStepIdx(idx);
                      setIsPlaying(false);
                    }}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                      activeStepIdx === idx
                        ? 'bg-slate-900 border-teal-400 text-teal-300 shadow'
                        : 'bg-dark-950 border-slate-800 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <div className="font-bold">0{idx + 1}. {s.badge}</div>
                    <div className="truncate text-[9px] text-slate-400">{s.title}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
