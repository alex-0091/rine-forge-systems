import React, { useState, useEffect } from 'react';
import { Sparkles, Video, ArrowRight, X, Bot, Zap } from 'lucide-react';

export function AutonomousReactionBanner({ onWatchDemo, onOpenHumanControl }) {
  const [showInactivityPrompt, setShowInactivityPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    let inactivityTimer = setTimeout(() => {
      setShowInactivityPrompt(true);
    }, 7000);

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      if (!showInactivityPrompt) {
        inactivityTimer = setTimeout(() => {
          setShowInactivityPrompt(true);
        }, 8000);
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
    <div className="fixed bottom-20 left-4 sm:left-6 z-40 max-w-sm font-sans animate-fadeIn">
      <div className="p-4 rounded-2xl bg-[#090e18]/95 border border-teal-500/40 shadow-2xl backdrop-blur-md text-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-teal-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FORGE OBSERVED YOUR VISIT</span>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded-lg bg-dark-900 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-snug font-sans">
          You can interact with every system on this page. Want to see FORGE actually work on a live workflow?
        </p>

        <div className="flex items-center gap-2 pt-1 font-mono text-xs">
          <button
            onClick={() => {
              setDismissed(true);
              if (onWatchDemo) onWatchDemo('receptionist-agent');
            }}
            className="flex-1 py-2 bg-teal-500 hover:bg-teal-400 text-dark-950 font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Video className="w-3.5 h-3.5" />
            <span>RUN 10s DEMO</span>
          </button>
          <button
            onClick={() => {
              setDismissed(true);
              if (onOpenHumanControl) onOpenHumanControl();
            }}
            className="px-3 py-2 bg-dark-950 hover:bg-slate-800 text-teal-300 border border-slate-800 rounded-xl"
          >
            Tell FORGE
          </button>
        </div>
      </div>
    </div>
  );
}
