import React, { useState, useEffect } from 'react';
import { 
  Search, Compass, Hammer, Rocket, LineChart, ArrowRight, 
  Play, Pause, RotateCcw, Sparkles, CheckCircle2, ShieldCheck, 
  Clock, Terminal, Check, Volume2, Video, Film
} from 'lucide-react';
import { forgeAudioSynth } from '../../utils/forgeAudioSynth';
import { speechEngine } from '../../utils/speechEngine';

export const PROCESS_STAGES = [
  {
    num: '01',
    title: 'AUDIT',
    subtitle: 'Identify Bottlenecks',
    theme: 'violet',
    colorBorder: 'border-violet-500/50 hover:border-violet-400',
    colorGlow: 'shadow-violet-500/20',
    colorBadge: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
    colorButton: 'bg-violet-500 text-white hover:bg-violet-400',
    desc: 'We analyze your current operations to identify repetitive, expensive, and high-friction workflows where automation delivers maximum ROI.',
    icon: Search,
    deliverable: 'Workflow Bottleneck Matrix',
    videoClip: {
      duration: '5.5s',
      aiTool: 'Kling AI & Hailuo Video-01',
      action: 'Automated 24/7 audit crawler detects 18 missed night calls and 312 unprocessed emails in under 12 seconds.',
      prompt: '3D stylized tech audit scanner in cyber holographic office, violet neon lasers scanning floating chaotic paperwork and converting into structured green data pills, 4k 60fps cinematic.'
    }
  },
  {
    num: '02',
    title: 'DESIGN',
    subtitle: 'Architecture & Governance',
    theme: 'cyan',
    colorBorder: 'border-cyan-500/50 hover:border-cyan-400',
    colorGlow: 'shadow-cyan-500/20',
    colorBadge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    colorButton: 'bg-cyan-500 text-dark-950 hover:bg-cyan-400',
    desc: 'We map the end-to-end process, specifying where AI reasoning, deterministic automation, and human-in-the-loop approval checkpoints belong.',
    icon: Compass,
    deliverable: 'Technical System Blueprint',
    videoClip: {
      duration: '5.5s',
      aiTool: 'Luma Dream Machine Ray 2',
      action: 'Architectural blueprint connects telephony webhook, private Vector RAG, and QuickBooks AP with policy-bound checkpoints.',
      prompt: 'Futuristic glowing cyan architectural flowchart assembling in mid-air, interconnected glowing nodes, clean glass aesthetic, smooth camera dolly shot, 60fps.'
    }
  },
  {
    num: '03',
    title: 'BUILD',
    subtitle: 'Engineering & Testing',
    theme: 'orange',
    colorBorder: 'border-orange-500/50 hover:border-orange-400',
    colorGlow: 'shadow-orange-500/20',
    colorBadge: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    colorButton: 'bg-orange-500 text-dark-950 hover:bg-orange-400',
    desc: 'We develop the custom agents, integration pipelines, API connectors, and testing frameworks with strict zero-hallucination guardrails.',
    icon: Hammer,
    deliverable: 'Staging Environment Prototype',
    videoClip: {
      duration: '5.5s',
      aiTool: 'Runway Gen-3 Alpha & Hailuo',
      action: 'Zero-hallucination test suite simulates 500 edge cases, verifying 100% policy bounds and sub-45ms execution speeds.',
      prompt: 'Animated robotic engineer robot with glowing orange welding visor crafting high-velocity AI circuits, zero error checkmarks appearing, volumetric lighting.'
    }
  },
  {
    num: '04',
    title: 'DEPLOY',
    subtitle: 'Production Launch',
    theme: 'green',
    colorBorder: 'border-emerald-500/50 hover:border-emerald-400',
    colorGlow: 'shadow-emerald-500/20',
    colorBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    colorButton: 'bg-emerald-500 text-dark-950 hover:bg-emerald-400',
    desc: 'We connect the system directly to the tools your business already uses (CRM, email, database, Slack) with zero disruption to daily ops.',
    icon: Rocket,
    deliverable: 'Live Production Integration',
    videoClip: {
      duration: '5.5s',
      aiTool: 'Kling AI 1.5 Pro',
      action: 'One-click live deployment binds to live Twilio phone trunks, Dentrix PMS, and Google Workspace without downtime.',
      prompt: 'Emerald green holographic launch rocket activating inside high-tech control center, instant online status indicators glowing green, 60fps.'
    }
  },
  {
    num: '05',
    title: 'OPTIMIZE',
    subtitle: 'Monitoring & Tuning',
    theme: 'blue',
    colorBorder: 'border-blue-500/50 hover:border-blue-400',
    colorGlow: 'shadow-blue-500/20',
    colorBadge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    colorButton: 'bg-blue-500 text-white hover:bg-blue-400',
    desc: 'We monitor execution telemetry, track latency and resolution rates, and continuously refine prompts and logic as your business scales.',
    icon: LineChart,
    deliverable: 'Performance SLA & Monitoring',
    videoClip: {
      duration: '5.5s',
      aiTool: 'Luma Ray 2 & Pika 2.0',
      action: 'Continuous telemetry observer optimizes prompt caching, maintaining grounded vector RAG and audited hallucination prevention.',
      prompt: 'Sapphire blue animated radar HUD tracking live business metrics climbing up smoothly, 100% uptime ring spinning, crisp digital rendering.'
    }
  }
];

export function HowItWorksSection({ onNavigate, onWatchDemo }) {
  const [activeProcessClipIdx, setActiveProcessClipIdx] = useState(0);
  const [isProcessPlaying, setIsProcessPlaying] = useState(false);
  const [copiedPromptIdx, setCopiedPromptIdx] = useState(null);

  const activeStage = PROCESS_STAGES[activeProcessClipIdx];

  const handleSelectStage = (idx) => {
    forgeAudioSynth.playClick();
    setActiveProcessClipIdx(idx);
    setIsProcessPlaying(true);
  };

  const handleCopyPrompt = (prompt, idx) => {
    forgeAudioSynth.playSuccess();
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(prompt);
      setCopiedPromptIdx(idx);
      setTimeout(() => setCopiedPromptIdx(null), 2500);
    }
  };

  return (
    <section id="how-it-works" className="py-20 sm:py-28 border-b border-slate-800/80 bg-[#060a12] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold tracking-wider uppercase shadow-md">
            <Film className="w-3.5 h-3.5 text-teal-400" /> ATTACHED 5.5s ANIMATED PROCESS DEMOS
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            FROM IDEA TO PRODUCTION. <br />
            <span className="text-teal-400">WATCH EVERY STEP IN 5 SECONDS.</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Our disciplined five-stage methodology with attached animated video micro-demos, prompt blueprints, and verified deliverables.
          </p>
        </div>

        {/* 5 Stages Grid with Attached Video Triggers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {PROCESS_STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isSelected = activeProcessClipIdx === idx;
            return (
              <div
                key={idx}
                onClick={() => handleSelectStage(idx)}
                className={`border-2 rounded-3xl p-5 sm:p-6 space-y-4 transition-all flex flex-col justify-between shadow-xl cursor-pointer relative group ${
                  isSelected 
                    ? `bg-dark-900 ${stage.colorBorder} ${stage.colorGlow} scale-[1.02]` 
                    : 'bg-[#090e18] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-3">
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black font-mono text-white">
                      {stage.num}
                    </span>
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-colors ${
                      isSelected ? stage.colorBadge : 'bg-dark-950 border-slate-800 text-slate-400'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-white tracking-wide">
                      {stage.title}
                    </h3>
                    <div className="text-[11px] font-mono text-teal-300 font-bold">
                      {stage.subtitle}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-3">
                    {stage.desc}
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-800/80">
                  <div className="text-[9px] font-mono text-slate-400 uppercase">Deliverable:</div>
                  <div className="text-xs font-mono font-bold text-white truncate">
                    {stage.deliverable}
                  </div>

                  {/* Attached Video Badge */}
                  <div className={`text-[10px] font-mono font-bold px-2 py-1 rounded-lg border flex items-center justify-between ${stage.colorBadge}`}>
                    <span className="flex items-center gap-1">
                      <Play className="w-3 h-3 fill-current" /> {stage.videoClip.duration} Clip
                    </span>
                    <span className="text-[8px] opacity-80 uppercase">Watch Demo</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 🌟 EXPANDED ATTACHED 5.5s ANIMATED PROCESS STAGE VIEWER */}
        <div className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#091122] to-[#050810] border-2 ${activeStage.colorBorder} shadow-2xl space-y-6 font-mono text-xs relative overflow-hidden`}>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <div>
                <span className="text-sm font-black text-white font-sans flex items-center gap-2">
                  <span>STAGE {activeStage.num}: {activeStage.title} — 5.5s ANIMATED PROCESS SIMULATION</span>
                </span>
                <span className="text-[11px] text-teal-300 font-mono">Powered by {activeStage.videoClip.aiTool}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  forgeAudioSynth.playClick();
                  speechEngine.speak(activeStage.videoClip.action, { accent: 'en-US' });
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-teal-300 hover:text-white font-bold flex items-center gap-1.5 text-[11px]"
              >
                <Volume2 className="w-3.5 h-3.5 text-teal-400" />
                <span>Hear Voiceover</span>
              </button>

              <button
                onClick={() => handleCopyPrompt(activeStage.videoClip.prompt, activeProcessClipIdx)}
                className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                  copiedPromptIdx === activeProcessClipIdx 
                    ? 'bg-emerald-500 text-dark-950 border-emerald-400' 
                    : 'bg-dark-950 text-slate-300 border-slate-800 hover:text-white'
                }`}
              >
                {copiedPromptIdx === activeProcessClipIdx ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                <span>{copiedPromptIdx === activeProcessClipIdx ? 'Copied Prompt!' : 'Copy Free AI Video Prompt'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left: What Happens in this 5.5s Process Clip */}
            <div className="lg:col-span-7 space-y-3 font-sans">
              <div className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider">
                🎬 What Happens in this 5.5-Second Clip:
              </div>
              <p className="text-sm text-white font-medium leading-relaxed bg-dark-950/80 p-4 rounded-2xl border border-slate-800">
                "{activeStage.videoClip.action}"
              </p>
              <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-teal-400" /> Duration: {activeStage.videoClip.duration}
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Policy Bound
                </span>
              </div>
            </div>

            {/* Right: AI Video Generation Prompt Box */}
            <div className="lg:col-span-5 p-4 rounded-2xl bg-[#040810] border border-slate-800 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1 border-b border-slate-800">
                <span className="text-amber-400 font-bold">✨ READY FOR KLING / LUMA / HAILUO:</span>
                <span>4K 60FPS</span>
              </div>
              <p className="text-[11px] text-slate-300 italic leading-relaxed line-clamp-3">
                "{activeStage.videoClip.prompt}"
              </p>
              <button
                onClick={() => handleCopyPrompt(activeStage.videoClip.prompt, activeProcessClipIdx)}
                className="w-full py-2 bg-slate-900 hover:bg-slate-850 text-teal-300 border border-teal-500/30 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Copy Video Prompt for Free AI</span>
              </button>
            </div>
          </div>

        </div>

        {/* Action Trigger */}
        <div className="pt-2 text-center">
          <button
            onClick={() => onNavigate && onNavigate('audit')}
            className="px-8 py-4 bg-gradient-to-r from-teal-500 via-cyan-400 to-indigo-500 hover:opacity-95 text-dark-950 font-black rounded-2xl text-xs sm:text-sm transition-all shadow-xl shadow-teal-500/25 inline-flex items-center gap-2 hover:scale-105"
          >
            <span>START STAGE 01 — REQUEST YOUR FREE WORKFLOW AUDIT</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
