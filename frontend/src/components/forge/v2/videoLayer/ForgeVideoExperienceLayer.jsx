import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, ChevronRight, ChevronLeft, Sparkles, Film, 
  Layers, Volume2, VolumeX, ArrowRight, ShieldCheck, CheckCircle2 
} from 'lucide-react';
import { ProblemScene } from './ProblemScene';
import { ForgeTransition } from './ForgeTransition';
import { ForgeProcessingDemo } from './ForgeProcessingDemo';
import { AIReceptionistDemo } from './AIReceptionistDemo';
import { AISalesDemo } from './AISalesDemo';
import { BeforeAfterVisual } from './BeforeAfterVisual';
import { forgeAudioSynth } from '../../../../utils/forgeAudioSynth';

const STAGES = [
  {
    id: 0,
    shortTitle: '01. The Problem',
    title: 'Your Team Is Overwhelmed',
    subtitle: 'Human team juggling phones, messages, emails, and calendar tabs simultaneously.',
    component: ProblemScene,
    badge: 'HUMAN OVERLOAD',
    color: 'rose'
  },
  {
    id: 1,
    shortTitle: '02. Convergence',
    title: 'Incoming Chaos Converted',
    subtitle: 'What if AI handled it? Calls, texts, and leads converging into the FORGE neural engine.',
    component: ForgeTransition,
    badge: 'TRANSFORMATION',
    color: 'cyan'
  },
  {
    id: 2,
    shortTitle: '03. The Engine',
    title: 'Deterministic Software Execution',
    subtitle: 'Understanding intent, querying live availability, choosing policy, and executing webhooks.',
    component: ForgeProcessingDemo,
    badge: 'ZERO HALLUCINATION',
    color: 'indigo'
  },
  {
    id: 3,
    shortTitle: '04. AI Receptionist',
    title: 'Autonomous Receptionist in Action',
    subtitle: 'Instant natural conversation, live calendar slot verification, and booking confirmation.',
    component: AIReceptionistDemo,
    badge: '100% UNMANNED',
    color: 'emerald'
  },
  {
    id: 4,
    shortTitle: '05. AI Sales',
    title: 'Instant Inbound Lead Qualification',
    subtitle: 'Autonomous discovery, revenue leak calculation, and CRM deal pipeline synchronization.',
    component: AISalesDemo,
    badge: 'INSTANT SCORING',
    color: 'violet'
  },
  {
    id: 5,
    shortTitle: '06. The Advantage',
    title: 'Before vs. After FORGE',
    subtitle: 'High-contrast split: 15–45 min manual chaos vs. 30 sec automated resolution.',
    component: BeforeAfterVisual,
    badge: 'VERIFIED ROI',
    color: 'fuchsia'
  }
];

export function ForgeVideoExperienceLayer({ onNavigate }) {
  const [activeStageIdx, setActiveStageIdx] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  // Auto-progress stages if user toggles autoplay
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setActiveStageIdx(prev => (prev + 1) % STAGES.length);
    }, 9000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const handleSelectStage = (idx) => {
    forgeAudioSynth.playClick();
    setActiveStageIdx(idx);
    setIsAutoPlaying(false);
  };

  const handleNext = () => {
    forgeAudioSynth.playClick();
    setActiveStageIdx(prev => (prev + 1) % STAGES.length);
  };

  const handlePrev = () => {
    forgeAudioSynth.playClick();
    setActiveStageIdx(prev => (prev - 1 + STAGES.length) % STAGES.length);
  };

  const handleToggleMute = () => {
    const nextMute = !isAudioMuted;
    setIsAudioMuted(nextMute);
    forgeAudioSynth.setMuted(nextMute);
    if (!nextMute) {
      forgeAudioSynth.playClick();
    }
  };

  const CurrentComponent = STAGES[activeStageIdx].component;
  const currentStage = STAGES[activeStageIdx];

  return (
    <section 
      id="v3-video-experience" 
      className="relative py-16 sm:py-24 border-b border-slate-800/80 bg-[#040711] overflow-hidden"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-gradient-to-r from-cyan-500/10 via-teal-500/10 to-indigo-500/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b12_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold tracking-wider uppercase shadow-sm">
            <Film className="w-3.5 h-3.5 text-cyan-400" />
            <span>V3 VISUAL THEATER • WATCH AI WORK</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Stop Reading About AI. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-teal-300 to-indigo-400">
              Watch It Run A Business.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            Experience the complete 6-stage transformation: from an overwhelmed front desk to 100% autonomous customer resolution and booked revenue.
          </p>
        </div>

        {/* 6-Stage Interactive Navigator Bar */}
        <div className="bg-[#070b18]/90 border border-slate-800/80 rounded-2xl p-2 sm:p-3 shadow-xl backdrop-blur-md">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {STAGES.map((stg, idx) => {
              const isActive = activeStageIdx === idx;
              return (
                <button
                  key={stg.id}
                  onClick={() => handleSelectStage(idx)}
                  className={`px-3 py-2.5 rounded-xl text-left transition-all duration-300 flex flex-col justify-between border ${
                    isActive
                      ? 'bg-gradient-to-b from-cyan-950/80 to-slate-900 border-cyan-400 text-white shadow-lg shadow-cyan-500/20 scale-[1.02]'
                      : 'bg-slate-950/40 border-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span className={isActive ? 'text-cyan-400 font-bold' : 'text-slate-500'}>
                      STAGE 0{idx + 1}
                    </span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    )}
                  </div>
                  <div className="text-xs font-bold truncate">
                    {stg.shortTitle.split('. ')[1]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scene Meta Bar & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2 font-mono text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
              {currentStage.badge}
            </span>
            <span className="text-white font-bold">{currentStage.title}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Prev / Next Buttons */}
            <button
              onClick={handlePrev}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all"
              title="Previous Stage"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                forgeAudioSynth.playClick();
                setIsAutoPlaying(!isAutoPlaying);
              }}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-[11px] font-bold transition-all ${
                isAutoPlaying
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {isAutoPlaying ? <Pause className="w-3.5 h-3.5 text-emerald-400" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isAutoPlaying ? 'Auto-Playing (9s)' : 'Auto-Play Story'}</span>
            </button>

            <button
              onClick={handleNext}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all"
              title="Next Stage"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Audio Toggle */}
            <button
              onClick={handleToggleMute}
              className={`p-2 rounded-xl border transition-all ${
                isAudioMuted
                  ? 'bg-slate-900 text-slate-500 border-slate-800'
                  : 'bg-slate-900 text-cyan-400 border-slate-800 hover:text-cyan-300'
              }`}
              title={isAudioMuted ? 'Unmute Sound Synthesizer' : 'Mute Sound Synthesizer'}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 🎬 DYNAMIC STAGE CONTAINER */}
        <div className="relative transition-all duration-500 ease-in-out">
          <CurrentComponent 
            onNextStep={handleNext} 
            onCtaClick={() => {
              if (onNavigate) onNavigate('audit');
            }}
          />
        </div>

        {/* Drop-in Architecture Notice */}
        <div className="text-center font-mono text-[11px] text-slate-500 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>MP4 Auto-Detection Active: Drop custom MP4 video renders into <code className="text-slate-400">frontend/public/videos/</code> anytime.</span>
        </div>

      </div>
    </section>
  );
}
