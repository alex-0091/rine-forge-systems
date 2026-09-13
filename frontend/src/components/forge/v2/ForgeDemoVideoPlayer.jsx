import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, RotateCcw, Sparkles, ArrowRight, 
  CheckCircle2, Volume2, VolumeX, ShieldCheck, Video, ExternalLink 
} from 'lucide-react';

/**
 * Reusable Native FORGE 8-12s Video Demonstration Component
 * Strictly bounded between 8-12s following:
 * 0-2s: The Problem
 * 2-6s: AI Working / Telemetry
 * 6-9s: Verified Outcome
 * 9-12s: FORGE Done + [Try Live] CTA
 */

export function ForgeDemoVideoPlayer({
  title,
  productName,
  duration = 10,
  problemText,
  aiWorkingText,
  outcomeText,
  youtubeId = null,
  onTryLive,
  accentColor = 'teal'
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return +(prev + 0.1).toFixed(1);
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const handleRestart = () => {
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const progressPercent = Math.min((currentTime / duration) * 100, 100);

  // Stage determination
  let currentStage = 'PROBLEM';
  let stageText = problemText;
  let stageBadge = '0-2s: THE PROBLEM';
  let stageColor = 'border-rose-500/50 text-rose-300 bg-rose-950/20';

  if (currentTime > 2 && currentTime <= 6) {
    currentStage = 'WORKING';
    stageText = aiWorkingText;
    stageBadge = '2-6s: AI AUTONOMOUS EXECUTION';
    stageColor = 'border-cyan-500/50 text-cyan-300 bg-cyan-950/20';
  } else if (currentTime > 6 && currentTime <= 9) {
    currentStage = 'OUTCOME';
    stageText = outcomeText;
    stageBadge = '6-9s: VERIFIED RESULT';
    stageColor = 'border-emerald-500/50 text-emerald-300 bg-emerald-950/20';
  } else if (currentTime > 9) {
    currentStage = 'DONE';
    stageText = 'FORGE System Execution Complete. Deploy to production or test in live sandbox.';
    stageBadge = '9-12s: FORGE DONE';
    stageColor = 'border-teal-400 text-teal-300 bg-teal-950/40';
  }

  return (
    <div className="w-full rounded-3xl bg-[#060a12] border-2 border-slate-800 hover:border-slate-700 transition-all overflow-hidden shadow-2xl font-mono text-xs">
      
      {/* Top Video Header Bar */}
      <div className="px-5 py-3.5 bg-dark-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-[11px] font-bold text-slate-300 ml-2 font-sans">{title}</span>
        </div>

        <span className="text-[9px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-teal-400 font-bold">
          8–10s SYSTEM SKIT
        </span>
      </div>

      {/* Main Video Viewport / Stage */}
      <div className="p-6 sm:p-8 space-y-6 relative bg-gradient-to-b from-dark-950/80 to-[#080d16]">
        
        {/* Stage Notification Banner */}
        <div className="flex items-center justify-between">
          <span className={`text-[10px] px-2.5 py-1 rounded-md border font-bold ${stageColor}`}>
            {stageBadge}
          </span>
          <span className="text-slate-400 text-[11px]">
            00:{currentTime < 10 ? `0${Math.floor(currentTime)}` : Math.floor(currentTime)} / 00:{duration}
          </span>
        </div>

        {/* Dynamic Visual Stage Content */}
        <div className={`p-6 rounded-2xl border-2 transition-all duration-300 min-h-[140px] flex flex-col justify-center space-y-2 ${stageColor}`}>
          <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">
            {currentStage === 'PROBLEM' && '🚨 Bottleneck Occurs:'}
            {currentStage === 'WORKING' && '⚡ FORGE System Processing:'}
            {currentStage === 'OUTCOME' && '✅ Operational Outcome:'}
            {currentStage === 'DONE' && '🟢 Ready For Deployment:'}
          </div>
          <div className="text-sm sm:text-base font-bold text-white font-sans leading-relaxed">
            {stageText}
          </div>
        </div>

        {/* Scrubbable Progress Bar */}
        <div className="space-y-1">
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800 cursor-pointer">
            <div 
              className="h-full bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 transition-all duration-100 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-slate-500">
            <span>0s Problem</span>
            <span>4s AI Works</span>
            <span>8s Outcome</span>
            <span>10s Complete</span>
          </div>
        </div>

        {/* Video Control Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-dark-950 font-black flex items-center gap-1.5 transition-all shadow-md"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'Pause' : currentTime >= duration ? 'Replay' : 'Play Skit'}</span>
            </button>

            <button
              onClick={handleRestart}
              className="p-2 rounded-xl bg-dark-950 hover:bg-slate-800 text-slate-300 border border-slate-800"
              title="Restart Demo"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {onTryLive && (
            <button
              onClick={onTryLive}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-teal-300 border border-teal-500/40 font-bold flex items-center gap-1.5 transition-all"
            >
              <span>Try Sandbox</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
