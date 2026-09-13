import React, { useState, useEffect } from 'react';
import { Phone, MessageSquare, Mail, Globe, Cpu, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { forgeAudioSynth } from '../../../../utils/forgeAudioSynth';

export function ForgeTransition({ onNextStep }) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [streamProgress, setStreamProgress] = useState(0);

  // Progressive particle flow loop
  useEffect(() => {
    const interval = setInterval(() => {
      setStreamProgress(prev => (prev >= 100 ? 0 : prev + 2));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const channels = [
    {
      id: 'phone',
      title: 'Voice / Calls',
      desc: 'Incoming customer ring',
      icon: Phone,
      color: 'rose',
      border: 'border-rose-500/40',
      bg: 'bg-rose-500/10',
      text: 'text-rose-400',
      rate: '12 active'
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp Chat',
      desc: 'Scheduling questions',
      icon: MessageSquare,
      color: 'emerald',
      border: 'border-emerald-500/40',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      rate: '28 unread'
    },
    {
      id: 'email',
      title: 'Inbound Inquiries',
      desc: 'Quote & pricing requests',
      icon: Mail,
      color: 'amber',
      border: 'border-amber-500/40',
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      rate: '45 emails'
    },
    {
      id: 'web',
      title: 'Web Traffic',
      desc: 'High intent buyers',
      icon: Globe,
      color: 'blue',
      border: 'border-blue-500/40',
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      rate: '112 live'
    }
  ];

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#0a0d18] via-[#060810] to-[#030408] border-2 border-cyan-500/40 p-6 sm:p-9 shadow-2xl space-y-6">
      
      {/* Optional MP4 Drop-in Layer */}
      {!videoError && (
        <video
          src="/videos/v02-forge-transition.mp4"
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
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-cyan-950/60 pb-4 font-mono text-xs">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="uppercase tracking-wider">STAGE 2: CONVERGENCE & AUTOMATION</span>
        </div>
        <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold flex items-center gap-1.5">
          <Zap className="w-3 h-3 text-cyan-400" /> WHAT IF AI HANDLED IT?
        </span>
      </div>

      {/* Main Animated Visualization Canvas */}
      <div className="relative z-10 min-h-[380px] sm:min-h-[420px] rounded-2xl bg-[#04060d]/90 border border-cyan-900/40 p-5 sm:p-8 flex flex-col justify-between overflow-hidden">
        
        {/* Subtle Sci-Fi Grid Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#06b6d415_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        {/* Central Core & Surrounding Converging Nodes */}
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 my-auto">
          
          {/* Left / Input Streams (Chaos Sources) */}
          <div className="w-full lg:w-5/12 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {channels.map(ch => {
              const Icon = ch.icon;
              return (
                <div 
                  key={ch.id}
                  className={`p-3.5 rounded-2xl border ${ch.border} ${ch.bg} backdrop-blur-md transition-all duration-300 hover:scale-105 flex items-start gap-3`}
                >
                  <div className={`p-2 rounded-xl bg-slate-950/80 ${ch.text} shadow-inner`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white truncate">{ch.title}</h4>
                      <span className="text-[9px] font-mono font-semibold text-slate-400">{ch.rate}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{ch.desc}</p>
                    <div className="w-full bg-slate-950/80 h-1 rounded-full mt-2 overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r from-transparent to-cyan-400 transition-all duration-300`} 
                        style={{ width: `${(streamProgress + 25) % 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Center Connector SVG Animation */}
          <div className="hidden lg:flex flex-col items-center justify-center w-2/12 relative py-4">
            <svg className="w-full h-32 overflow-visible" viewBox="0 0 120 120">
              <defs>
                <linearGradient id="cyanLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#06b6d4" stopOpacity="1" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.9" />
                </linearGradient>
              </defs>
              
              {/* Converging Stream Lines */}
              <path d="M 0,20 C 60,20 60,60 120,60" fill="none" stroke="url(#cyanLineGrad)" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
              <path d="M 0,50 C 50,50 70,60 120,60" fill="none" stroke="#06b6d4" strokeWidth="2" opacity="0.6" />
              <path d="M 0,90 C 50,90 70,60 120,60" fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.6" />
              <path d="M 0,110 C 60,110 60,60 120,60" fill="none" stroke="url(#cyanLineGrad)" strokeWidth="2" strokeDasharray="4 4" />

              {/* Pulsing Particle along connector */}
              <circle cx={streamProgress * 1.2} cy="60" r="3.5" fill="#38bdf8" className="filter drop-shadow-[0_0_8px_#38bdf8]" />
            </svg>
            <span className="text-[10px] font-mono text-cyan-400/80 uppercase tracking-widest mt-1">Converging</span>
          </div>

          {/* Right: The FORGE AI Engine Core */}
          <div className="w-full lg:w-5/12 flex flex-col items-center justify-center">
            <div className="relative p-6 rounded-3xl bg-gradient-to-b from-[#0c192c] to-[#060e1d] border-2 border-cyan-400/50 shadow-[0_0_40px_rgba(6,182,212,0.25)] text-center w-full max-w-sm">
              
              {/* Spinning Pulse Halo */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-blue-500/30 to-indigo-500/20 blur-sm pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-500 p-0.5 shadow-lg shadow-cyan-500/30">
                  <div className="w-full h-full bg-[#050b14] rounded-2xl flex items-center justify-center text-cyan-400">
                    <Cpu className="w-8 h-8 animate-pulse" />
                  </div>
                </div>

                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    AUTONOMOUS CORE ACTIVE
                  </div>
                  <h3 className="text-xl font-black text-white tracking-tight mt-1">FORGE AI ENGINE</h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-[240px]">
                    All incoming communication ingested, classified, and resolved automatically in milliseconds.
                  </p>
                </div>

                <div className="w-full grid grid-cols-2 gap-2 pt-2 border-t border-cyan-950/80 text-[11px] font-mono">
                  <div className="bg-[#040813] p-2 rounded-xl border border-cyan-900/30 text-left">
                    <span className="text-slate-400 block text-[9px]">RESPONSE TIME</span>
                    <span className="text-cyan-300 font-bold">0.8 Seconds</span>
                  </div>
                  <div className="bg-[#040813] p-2 rounded-xl border border-cyan-900/30 text-left">
                    <span className="text-slate-400 block text-[9px]">HUMAN EFFORT</span>
                    <span className="text-emerald-400 font-bold">0% Required</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Banner with Explanation & Action Trigger */}
        <div className="relative z-10 pt-4 mt-4 border-t border-cyan-950/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              <strong className="text-white">The Breakthrough:</strong> Your team stops juggling 4 apps. FORGE unifies every channel into one autonomous brain.
            </p>
          </div>
          
          {onNextStep && (
            <button
              onClick={() => {
                forgeAudioSynth.playClick();
                onNextStep();
              }}
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-cyan-500/20 hover:scale-105 flex items-center justify-center gap-2 shrink-0"
            >
              <span>See Processing Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
