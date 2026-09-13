import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Play, Pause, Sparkles, Bot, Calendar, 
  CheckCircle2, MessageSquare, Database, Send, PhoneCall, 
  RefreshCw, ShieldCheck, Flame, Zap, ArrowUpRight, Volume2, VolumeX,
  Clock, User, Smartphone, Building2
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
import { speechEngine } from '../../../utils/speechEngine';

const HERO_STORY_STEPS = [
  {
    step: 1,
    time: '0s - 2s',
    title: 'Incoming Customer Inquiry',
    icon: MessageSquare,
    badge: 'CUSTOMER ASKS',
    color: 'border-cyan-400/80 text-cyan-200 bg-gradient-to-br from-cyan-950/40 via-dark-950 to-[#0c1424]',
    bubble: '💬 "Hi! Can I book an emergency root canal consultation tomorrow at 3 PM?"',
    spokenText: 'Alex calls after hours: Hi, can I book an emergency root canal consultation tomorrow at 3 PM?',
    actor: 'Alex (Patient)',
    systemState: 'INBOUND_RECEIVED'
  },
  {
    step: 2,
    time: '2s - 4s',
    title: 'FORGE Autonomous Reasoning',
    icon: Zap,
    badge: 'AI UNDERSTANDING',
    color: 'border-violet-400/80 text-violet-200 bg-gradient-to-br from-violet-950/40 via-dark-950 to-[#120e24]',
    bubble: '🧠 Intent: High-Urgency Clinical • Insurance PPO Delta Dental Check • Slot query: 3:00 PM',
    spokenText: 'FORGE evaluates intent in real time, verifies Delta Dental PPO coverage, and initiates calendar query.',
    actor: 'FORGE Perception Core',
    systemState: 'REASONING_ACTIVE'
  },
  {
    step: 3,
    time: '4s - 6s',
    title: 'Deterministic Calendar Lock',
    icon: Calendar,
    badge: 'CALENDAR SYNC',
    color: 'border-pink-400/80 text-pink-200 bg-gradient-to-br from-pink-950/40 via-dark-950 to-[#220c1a]',
    bubble: '📅 Scanned 3 Doctor Schedules → Dr. Reynolds (Operatory 2) Available at 3:00 PM → Slot Locked.',
    spokenText: 'Appointment Agent scans three doctor schedules, reserves Dr. Reynolds at 3 PM, and locks the calendar slot.',
    actor: 'FORGE Appointment Agent',
    systemState: 'SLOT_RESERVED'
  },
  {
    step: 4,
    time: '6s - 8s',
    title: 'CRM Commit & Confirmation Sent',
    icon: CheckCircle2,
    badge: 'WORK COMPLETED',
    color: 'border-emerald-400/80 text-emerald-200 bg-gradient-to-br from-emerald-950/40 via-dark-950 to-[#0a1e16]',
    bubble: '✅ HubSpot record updated • SMS confirmation & intake forms dispatched in 18 seconds total.',
    spokenText: 'Receptionist updates Dentrix CRM, and dispatches SMS confirmation and intake forms in 18 seconds total.',
    actor: 'FORGE Receptionist',
    systemState: 'EXECUTION_SUCCESS'
  }
];

export function ForgeV2HeroScene({ onNavigate, onLaunchSystemDemo, onWatchTenSecDemo }) {
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVoiceNarratorActive, setIsVoiceNarratorActive] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStepIdx(prev => {
        const next = (prev + 1) % HERO_STORY_STEPS.length;
        if (isVoiceNarratorActive) {
          speechEngine.speak(HERO_STORY_STEPS[next].spokenText, { accent: 'en-US' });
        }
        return next;
      });
    }, 2800);
    return () => clearInterval(interval);
  }, [isPlaying, isVoiceNarratorActive]);

  const handleToggleVoiceNarrator = () => {
    if (isVoiceNarratorActive) {
      speechEngine.stopSpeaking();
      setIsVoiceNarratorActive(false);
    } else {
      setIsVoiceNarratorActive(true);
      speechEngine.speak(`Live workflow simulation: ${HERO_STORY_STEPS[activeStepIdx].spokenText}`, { accent: 'en-US' });
    }
  };

  const handleSelectStep = (idx) => {
    setActiveStepIdx(idx);
    setIsPlaying(false);
    if (isVoiceNarratorActive) {
      speechEngine.speak(HERO_STORY_STEPS[idx].spokenText, { accent: 'en-US' });
    }
  };

  const currentStep = HERO_STORY_STEPS[activeStepIdx];

  return (
    <section className="relative pt-8 sm:pt-14 pb-20 sm:pb-28 border-b border-slate-800/80 bg-[#060a12] overflow-hidden">
      
      {/* Dynamic Ambient Background Aura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-r from-teal-500/20 via-cyan-500/15 to-indigo-500/20 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0a_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Top Header & Core Value Prop */}
        <div className="text-center space-y-5 max-w-4xl mx-auto">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/15 border border-teal-500/40 text-teal-300 text-xs font-mono font-bold tracking-wider uppercase shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" /> THE VISUAL AI SYSTEMS EXPERIENCE
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.06] font-sans">
            AI SYSTEMS <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-cyan-300 to-indigo-400">
              THAT DO THE WORK.
            </span>
          </h1>

          <p className="text-lg sm:text-2xl text-slate-200 font-bold max-w-2xl mx-auto leading-relaxed">
            Watch them work. Touch them. Try them.
          </p>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-normal">
            No robotic walls of text. Explore real visual systems that capture leads, answer calls, extract documents, and run operations 24/7.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => {
                const el = document.getElementById('systems');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else if (onNavigate) onNavigate('systems');
              }}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-dark-950 font-black rounded-2xl text-xs font-mono transition-all shadow-xl shadow-teal-500/30 flex items-center justify-center gap-2 group hover:scale-105"
            >
              <span>EXPLORE THE 6 SYSTEMS</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                if (onWatchTenSecDemo) onWatchTenSecDemo('receptionist');
              }}
              className="w-full sm:w-auto px-7 py-4 bg-slate-900/90 hover:bg-slate-850 text-cyan-300 border-2 border-cyan-500/50 font-bold rounded-2xl text-xs font-mono transition-all shadow-lg flex items-center justify-center gap-2 hover:scale-105"
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
              className="w-full sm:w-auto px-7 py-4 bg-[#090e18] hover:bg-dark-850 text-slate-200 border border-slate-700 font-bold rounded-2xl text-xs font-mono transition-all flex items-center justify-center gap-2 hover:scale-105"
            >
              <span>TEST IN LIVE SANDBOX</span>
            </button>
          </div>
        </div>

        {/* 🎬 THE LIVING BUSINESS ENVIRONMENT SIMULATION */}
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-[#0b1324]/95 via-[#080e1a]/95 to-[#060a12]/95 border-2 border-teal-500/40 shadow-2xl space-y-8 relative overflow-hidden backdrop-blur-md">
          
          {/* Top Bar: Scene Indicator & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <div>
                <div className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="text-teal-400">● LIVE AUTONOMOUS WORKFLOW SCENE</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[10px] font-black">
                    {currentStep.systemState}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300">Step 0{activeStepIdx + 1} of 04 • Real-time AI Execution Simulation</div>
              </div>
            </div>

            {/* Play/Pause & Step Buttons & Voice Narrator */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <button
                onClick={handleToggleVoiceNarrator}
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all ${
                  isVoiceNarratorActive
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse font-bold'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                }`}
                title="Spoken audio narration for the scene"
              >
                {isVoiceNarratorActive ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{isVoiceNarratorActive ? 'Voice ON' : 'Spoken Voice'}</span>
              </button>

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
                    onClick={() => handleSelectStep(idx)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                      activeStepIdx === idx
                        ? 'bg-gradient-to-tr from-teal-500 to-cyan-400 text-dark-950 font-black shadow-lg shadow-teal-500/30 scale-110'
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
            
            {/* Left: Animated Character Cast Pod */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-[#080d1a] border-2 border-slate-800 space-y-4 text-center shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#14b8a610_1px,transparent_1px)] [background-size:12px_12px]" />
              
              {activeStepIdx === 0 && (
                <div className="relative z-10 space-y-3">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-cyan-500/20 via-blue-500/20 to-indigo-500/20 border-2 border-cyan-400 flex items-center justify-center text-4xl shadow-xl shadow-cyan-500/20 animate-bounce">
                      👨‍💼
                    </div>
                    <span className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-cyan-500 text-dark-950 flex items-center justify-center font-bold text-sm shadow">
                      📞
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-base font-black text-white">Alex (Patient)</div>
                    <div className="text-xs text-cyan-300 font-mono font-bold">After-Hours Emergency Inquiry</div>
                  </div>
                </div>
              )}

              {activeStepIdx === 1 && (
                <div className="relative z-10 space-y-3">
                  <ForgeCoreMascot state="reasoning" size="lg" />
                  <div className="space-y-0.5">
                    <div className="text-base font-black text-white">FORGE Perception Core</div>
                    <div className="text-xs text-violet-300 font-mono font-bold">PPO Insurance & Clinical Intent</div>
                  </div>
                </div>
              )}

              {activeStepIdx === 2 && (
                <div className="relative z-10 space-y-3">
                  <AppointmentCharacter size="lg" />
                  <div className="space-y-0.5">
                    <div className="text-base font-black text-white">Appointment Agent</div>
                    <div className="text-xs text-pink-300 font-mono font-bold">Multi-Doctor Schedule Lock</div>
                  </div>
                </div>
              )}

              {activeStepIdx === 3 && (
                <div className="relative z-10 space-y-3">
                  <ReceptionistCharacter size="lg" />
                  <div className="space-y-0.5">
                    <div className="text-base font-black text-white">Autonomous Receptionist</div>
                    <div className="text-xs text-emerald-300 font-mono font-bold">HubSpot CRM & SMS Dispatched</div>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Live Dialogue & Telemetry Feed */}
            <div className="lg:col-span-8 space-y-4">
              <div className={`p-6 sm:p-8 rounded-3xl border-2 transition-all duration-300 ${currentStep.color} space-y-5 shadow-2xl`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-slate-900/90 font-black border border-slate-700 shadow">
                    {currentStep.badge} • {currentStep.time}
                  </span>
                  <span className="text-xs font-mono text-slate-300 font-bold">
                    Active System: <strong className="text-white">{currentStep.actor}</strong>
                  </span>
                </div>

                <div className="text-lg sm:text-2xl font-black text-white leading-relaxed font-sans">
                  {currentStep.bubble}
                </div>

                {/* Animated Mini Status Widget */}
                {activeStepIdx === 0 && (
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-cyan-500/30 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2 text-cyan-300">
                      <Smartphone className="w-4 h-4 text-cyan-400" />
                      <span>Inbound Call Duration: <strong>00:08s</strong></span>
                    </div>
                    <span className="text-[10px] text-cyan-400 font-bold">● AUDIO STREAMING</span>
                  </div>
                )}

                {activeStepIdx === 1 && (
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-violet-500/30 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2 text-violet-300">
                      <Zap className="w-4 h-4 text-violet-400" />
                      <span>Confidence Score: <strong>99.8%</strong> (Zero Hallucination)</span>
                    </div>
                    <span className="text-[10px] text-violet-400 font-bold">● REASONING PASS</span>
                  </div>
                )}

                {activeStepIdx === 2 && (
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-pink-500/30 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2 text-pink-300">
                      <Calendar className="w-4 h-4 text-pink-400" />
                      <span>Slot: <strong>Dr. Reynolds • Fri 3:00 PM</strong></span>
                    </div>
                    <span className="text-[10px] text-pink-400 font-bold">● CALENDAR COMMITTED</span>
                  </div>
                )}

                {activeStepIdx === 3 && (
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-emerald-500/30 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2 text-emerald-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>CRM: <strong>HubSpot Synced</strong> • SMS Sent</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold">● 18s TOTAL LATENCY</span>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex items-center gap-2 text-slate-300 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Deterministic Policy Bound • $0 Extra Cost</span>
                  </div>

                  <button
                    onClick={() => {
                      if (onLaunchSystemDemo) onLaunchSystemDemo('receptionist-agent');
                    }}
                    className="px-4 py-2 rounded-xl bg-teal-500/25 hover:bg-teal-500/40 text-teal-200 border border-teal-400/60 font-black flex items-center gap-1.5 transition-all shadow-md hover:scale-105"
                  >
                    <span>Test In Live Sandbox</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Step Progress Tracker */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[10px]">
                {HERO_STORY_STEPS.map((s, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectStep(idx)}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                      activeStepIdx === idx
                        ? 'bg-slate-900/90 border-teal-400 text-teal-200 shadow-lg shadow-teal-500/20 scale-[1.03]'
                        : 'bg-dark-950/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-black text-xs text-white">0{idx + 1}. {s.badge}</div>
                    <div className="truncate text-[10px] text-slate-300 pt-0.5">{s.title}</div>
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
