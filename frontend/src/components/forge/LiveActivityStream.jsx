import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle2, Zap, ArrowRight, ShieldCheck, Clock, Server, ArrowUpRight } from 'lucide-react';
import { LIVE_ACTIVITY_EVENTS } from '../../data/forgePlatformConfig';

export function LiveActivityStream({ onNavigate }) {
  const [requestsToday, setRequestsToday] = useState(1284);
  const [automationsToday, setAutomationsToday] = useState(947);
  const [activePulse, setActivePulse] = useState(false);
  const [eventIndex, setEventIndex] = useState(0);

  // Periodic simulated live increment and pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePulse(true);
      setRequestsToday(prev => prev + Math.floor(Math.random() * 2) + 1);
      if (Math.random() > 0.3) {
        setAutomationsToday(prev => prev + 1);
      }
      setEventIndex(prev => (prev + 1) % LIVE_ACTIVITY_EVENTS.length);
      setTimeout(() => setActivePulse(false), 800);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  const currentEvent = LIVE_ACTIVITY_EVENTS[eventIndex] || LIVE_ACTIVITY_EVENTS[0];

  return (
    <section className="py-8 border-y border-slate-800/80 bg-[#070d18] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        
        {/* Top Status Strip: FORGE AI NETWORK */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4 font-mono text-xs">
          
          {/* Network Active Indicator */}
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <div className="flex items-center gap-2">
              <span className="text-white font-bold tracking-wider uppercase">FORGE AI NETWORK:</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                100% OPERATIONAL
              </span>
            </div>
          </div>

          {/* 4 Active Digital Worker Status Pills */}
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-cyan-500/30 text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>AI Receptionist:</span>
              <strong className="text-emerald-400">WORKING</strong>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-violet-500/30 text-violet-300">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              <span>Lead Agent:</span>
              <strong className="text-emerald-400">WORKING</strong>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-blue-500/30 text-blue-300">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span>Customer Support:</span>
              <strong className="text-emerald-400">WORKING</strong>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-emerald-500/30 text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>CRM Automation:</span>
              <strong className="text-emerald-400">WORKING</strong>
            </div>
          </div>

        </div>

        {/* Live Counters & Real-Time Event Banner */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center font-mono">
          
          {/* Animated Metrics: Requests Processed Today */}
          <div className="md:col-span-3 p-3.5 rounded-2xl bg-[#091120] border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Requests Processed Today</div>
              <div className="text-xl font-black text-white font-sans flex items-center gap-1">
                <span>{requestsToday.toLocaleString()}</span>
                {activePulse && <span className="text-xs text-emerald-400 animate-bounce">+1</span>}
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-xs">
              ⚡
            </div>
          </div>

          {/* Animated Metrics: Automations Completed */}
          <div className="md:col-span-3 p-3.5 rounded-2xl bg-[#091120] border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Automations Completed</div>
              <div className="text-xl font-black text-emerald-300 font-sans flex items-center gap-1">
                <span>{automationsToday.toLocaleString()}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs">
              ✓
            </div>
          </div>

          {/* Live Recent Event Ticker */}
          <div className="md:col-span-6 p-3.5 rounded-2xl bg-[#080e1a] border border-slate-800 flex items-center justify-between gap-3 text-xs overflow-hidden">
            <div className="flex items-center gap-2.5 truncate">
              <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 text-[10px] font-bold border border-teal-500/30 shrink-0">
                LATEST
              </span>
              <span className="text-slate-300 truncate font-sans">
                <strong className="text-white font-mono text-xs">{currentEvent.systemName}:</strong> {currentEvent.description || currentEvent.action}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 shrink-0 font-mono">
              &lt; 45ms
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
