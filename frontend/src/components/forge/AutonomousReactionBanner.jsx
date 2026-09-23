import React, { useState, useEffect } from 'react';
import { Sparkles, Video, ArrowRight, X, Bot, Zap } from 'lucide-react';
import { forgeAudioSynth } from '../../utils/forgeAudioSynth';

export function AutonomousReactionBanner({ onWatchDemo, onOpenHumanControl }) {
  const [showInactivityPrompt, setShowInactivityPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    let inactivityTimer = setTimeout(() => {
      setShowInactivityPrompt(true);
    }, 25000);

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      if (!showInactivityPrompt) {
        inactivityTimer = setTimeout(() => {
          setShowInactivityPrompt(true);
        }, 30000);
      }
    };

    window.addEventListener('mousemove', resetTimer, { passive: true });
    window.addEventListener('scroll', resetTimer, { passive: true });

    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('scroll', resetTimer);
    };
  }, [dismissed, showInactivityPrompt]);

  if (!showInactivityPrompt || dismissed) return null;

  return (
    <div className="fixed bottom-20 left-4 sm:left-6 z-40 max-w-sm font-sans">
      <div className="p-4 rounded-2xl bg-[#0c101a]/95 border border-white/[0.12] shadow-2xl backdrop-blur-md text-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INTERACTIVE DEMO READY</span>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded-lg bg-white/[0.04] text-slate-400 hover:text-white"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-snug font-sans">
          Curious how our AI receptionist answers calls, checks availability, and books appointments?
        </p>

        <div className="flex items-center gap-2 pt-1 font-mono text-xs">
          <button
            onClick={() => {
              forgeAudioSynth.playClick();
              setDismissed(true);
              if (onWatchDemo) onWatchDemo('receptionist-agent');
            }}
            className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Video className="w-3.5 h-3.5" />
            <span>WATCH 10s CLIP</span>
          </button>
          <button
            onClick={() => {
              forgeAudioSynth.playClick();
              setDismissed(true);
              if (onOpenHumanControl) onOpenHumanControl();
            }}
            className="px-3 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08] rounded-xl"
          >
            Ask Questions
          </button>
        </div>
      </div>
    </div>
  );
}
