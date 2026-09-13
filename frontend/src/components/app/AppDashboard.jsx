import React, { useState } from 'react';
import { 
  LayoutDashboard, Zap, Activity, CheckCircle2, Clock, 
  ArrowRight, ShieldCheck, AlertCircle, Sparkles, Bot, 
  FileText, Database, Server, RefreshCw, BarChart3, Plus 
} from 'lucide-react';
import { SYSTEMS_CATALOG, LIVE_ACTIVITY_EVENTS, PRICING_CONFIG } from '../../data/forgePlatformConfig';

export function AppDashboard({ onNavigateApp, trialCreditsUsed = 32 }) {
  const [activeSystems, setActiveSystems] = useState([
    { ...SYSTEMS_CATALOG[0], isLive: true },
    { ...SYSTEMS_CATALOG[1], isLive: true }
  ]);

  const toggleSystemStatus = (id) => {
    setActiveSystems(prev => prev.map(s => s.id === id ? { ...s, isLive: !s.isLive } : s));
  };

  return (
    <div className="space-y-8">
      
      {/* Welcome & Trial Overview Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-950/30 via-slate-900 to-indigo-950/30 border border-teal-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 font-bold uppercase">
              14-DAY FREE TRIAL ACTIVE
            </span>
            <span className="text-xs font-mono text-slate-400">Sandbox Environment</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome to FORGE Operating System
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Your autonomous AI systems are active and monitoring configured webhooks. Test inputs in the sandbox, review pending human approvals, or connect additional CRM tools.
          </p>
        </div>

        {/* Usage Gauge Box */}
        <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2.5 font-mono text-xs shrink-0 min-w-[220px]">
          <div className="flex justify-between text-slate-400 text-[11px]">
            <span>Trial Action Pool</span>
            <span className="font-bold text-teal-400">{trialCreditsUsed} / {PRICING_CONFIG.trialCredits}</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full"
              style={{ width: `${(trialCreditsUsed / PRICING_CONFIG.trialCredits) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 pt-1">
            <span>Estimated Savings</span>
            <span className="text-emerald-400 font-bold">+$4,200</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-5 rounded-2xl bg-[#090e18] border border-slate-800 space-y-1">
          <div className="text-slate-400 text-[10px] uppercase">Active Production Systems</div>
          <div className="text-2xl font-black text-white">{activeSystems.filter(s => s.isLive).length} / 2</div>
          <div className="text-[10px] text-teal-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            <span>Lead Agent & Receptionist Live</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#090e18] border border-slate-800 space-y-1">
          <div className="text-slate-400 text-[10px] uppercase">Automated Executions</div>
          <div className="text-2xl font-black text-teal-400">{trialCreditsUsed}</div>
          <div className="text-[10px] text-emerald-400">100% Success Rate in Staging</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#090e18] border border-slate-800 space-y-1">
          <div className="text-slate-400 text-[10px] uppercase">Pending Human Approvals</div>
          <div className="text-2xl font-black text-amber-400">2</div>
          <button 
            onClick={() => onNavigateApp('approvals')}
            className="text-[10px] text-amber-300 hover:underline flex items-center gap-1"
          >
            Review Approval Queue →
          </button>
        </div>

        <div className="p-5 rounded-2xl bg-[#090e18] border border-slate-800 space-y-1">
          <div className="text-slate-400 text-[10px] uppercase">Average Model Latency</div>
          <div className="text-2xl font-black text-cyan-400">28 ms</div>
          <div className="text-[10px] text-slate-400">Gemini 1.5 Pro Flash RAG</div>
        </div>
      </div>

      {/* Main Grid: Active Systems (8 cols) & Live Feed (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Active Systems Column (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <Zap className="w-4 h-4 text-teal-400" /> Configured Autonomous Systems
            </h2>
            <button
              onClick={() => onNavigateApp('builder')}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 rounded-lg text-xs font-mono font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5 text-teal-400" />
              <span>New System</span>
            </button>
          </div>

          <div className="space-y-4">
            {activeSystems.map((sys) => (
              <div
                key={sys.id}
                className="p-6 rounded-2xl bg-[#090e18] border border-slate-800 hover:border-slate-700 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${sys.isLive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                    <div>
                      <div className="text-base font-bold text-white flex items-center gap-2">
                        <span>{sys.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-teal-500/10 text-teal-400 rounded border border-teal-500/20">
                          {sys.badge}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 font-sans">{sys.headline}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSystemStatus(sys.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                        sys.isLive
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {sys.isLive ? 'ACTIVE' : 'PAUSED'}
                    </button>
                    <button
                      onClick={() => onNavigateApp('systems')}
                      className="px-3 py-1 bg-slate-900 text-slate-300 hover:text-white border border-slate-800 rounded-lg text-xs font-mono"
                    >
                      Config
                    </button>
                  </div>
                </div>

                {/* Telemetry sub-bar */}
                <div className="grid grid-cols-3 gap-2 font-mono text-xs text-slate-400 pt-1">
                  <div>
                    <span className="text-[10px] block text-slate-500">Executions</span>
                    <strong className="text-slate-200">{sys.executionsTotal.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] block text-slate-500">Accuracy</span>
                    <strong className="text-emerald-400">{sys.successRate}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] block text-slate-500">Avg Latency</span>
                    <strong className="text-teal-300">{sys.avgLatency}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Activity Feed (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-400" /> Real-Time Activity Log
          </h2>

          <div className="p-4 rounded-2xl bg-[#090e18] border border-slate-800 font-mono text-xs space-y-3">
            {LIVE_ACTIVITY_EVENTS.slice(0, 5).map((evt) => (
              <div key={evt.id} className="pb-3 border-b border-slate-850 last:border-0 last:pb-0 space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-teal-400 font-bold">{evt.systemName}</span>
                  <span className="text-slate-500">{evt.time}</span>
                </div>
                <div className="text-slate-300 text-[11px] leading-tight font-sans font-medium">
                  {evt.action}
                </div>
                <div className="text-[10px] text-slate-400 font-sans">
                  ↳ {evt.details}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
