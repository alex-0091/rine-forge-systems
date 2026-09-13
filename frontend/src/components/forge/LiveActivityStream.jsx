import React, { useState, useEffect } from 'react';
import { Terminal, Activity, CheckCircle2, RefreshCw, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { LIVE_ACTIVITY_EVENTS } from '../../data/forgePlatformConfig';

export function LiveActivityStream({ onNavigate }) {
  const [events, setEvents] = useState(LIVE_ACTIVITY_EVENTS);
  const [activePulse, setActivePulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePulse(true);
      setTimeout(() => setActivePulse(false), 800);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 border-y border-slate-800/80 bg-[#060a12] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <div className="text-xs font-mono font-bold text-white tracking-wider flex items-center gap-2">
              <span>LIVE FORGE ACTIVITY STREAM</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
                SANDBOX TELEMETRY
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> 99.8% Execution Accuracy
            </span>
            <span className="hidden md:inline text-slate-500">Avg Latency: &lt; 45ms</span>
            <button
              onClick={() => onNavigate && onNavigate('systems')}
              className="text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1 transition-colors"
            >
              <span>Explore All Systems</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Real-time Ticker Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
          {events.slice(0, 6).map((evt, idx) => (
            <div
              key={evt.id}
              className={`p-4 rounded-xl bg-[#090e18] border transition-all duration-300 ${
                idx === 0 && activePulse
                  ? 'border-teal-400/80 bg-[#0d1624] shadow-lg shadow-teal-500/10 scale-[1.01]'
                  : 'border-slate-800/90 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1.5 border-b border-slate-800/60">
                <span className="text-teal-400 font-bold">{evt.systemName}</span>
                <span>{evt.time}</span>
              </div>

              <div className="pt-2 space-y-1.5">
                <div className="text-slate-200 font-medium text-[11px] leading-tight">
                  {evt.action}
                </div>
                <div className="text-[10px] text-slate-400 leading-normal">
                  ↳ {evt.details}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[10px]">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {evt.status}
                </span>
                <span className="text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {evt.score}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
