import React, { useState } from 'react';
import { 
  Activity, CheckCircle2, AlertTriangle, RefreshCw, 
  Server, ShieldCheck, Zap, Lock, Terminal 
} from 'lucide-react';

export function AppControlCenter() {
  const [errorLogs, setErrorLogs] = useState([
    {
      id: 'err-1',
      timestamp: '14 minutes ago',
      system: 'FORGE Lead Agent',
      error: 'HubSpot Webhook TLS handshake timeout (retried 2/3)',
      status: 'RESOLVED_AUTOMATICALLY',
      action: 'RECONNECTED'
    },
    {
      id: 'err-2',
      timestamp: '2 hours ago',
      system: 'FORGE Document Engine',
      error: 'PDF OCR Scan Resolution under 150 DPI threshold',
      status: 'FLAGGED_FOR_CLARIFICATION',
      action: 'RE-REQUESTED_PDF'
    }
  ]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto font-sans">
      
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-mono font-bold uppercase">
          <Activity className="w-3.5 h-3.5" /> FORGE CONTROL & TELEMETRY
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          System Health & Error Monitoring
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Real-time uptime, model latency metrics, rate-limit thresholds, and automated error recovery pipelines.
        </p>
      </div>

      {/* Global Health Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-6 rounded-3xl bg-[#090e18] border border-slate-800 space-y-2">
          <div className="text-slate-400 text-[10px] uppercase">Operational Uptime (SLA)</div>
          <div className="text-3xl font-black text-emerald-400">99.94%</div>
          <div className="text-[10px] text-slate-400">Past 30 days continuous telemetry</div>
        </div>

        <div className="p-6 rounded-3xl bg-[#090e18] border border-slate-800 space-y-2">
          <div className="text-slate-400 text-[10px] uppercase">Execution Success Ratio</div>
          <div className="text-3xl font-black text-teal-400">98.7%</div>
          <div className="text-[10px] text-emerald-400">1.3% Handled by Fallback Gate</div>
        </div>

        <div className="p-6 rounded-3xl bg-[#090e18] border border-slate-800 space-y-2">
          <div className="text-slate-400 text-[10px] uppercase">Mean Inference Latency</div>
          <div className="text-3xl font-black text-cyan-400">34 ms</div>
          <div className="text-[10px] text-slate-400">Global Edge Ring Buffers</div>
        </div>
      </div>

      {/* Active Systems Heartbeat */}
      <div className="p-6 rounded-3xl bg-[#090e18] border border-slate-800 space-y-4 font-mono text-xs">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          Subsystem Heartbeat Telemetry
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'Lead Agent Engine', status: 'HEALTHY', latency: '18ms' },
            { name: 'Receptionist Audio', status: 'HEALTHY', latency: '24ms' },
            { name: 'Document OCR Core', status: 'HEALTHY', latency: '820ms' },
            { name: 'Vector RAG Store', status: 'HEALTHY', latency: '12ms' }
          ].map((sub, i) => (
            <div key={i} className="p-3 bg-dark-950 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-white font-bold">{sub.name}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div className="text-emerald-400 text-[10px] font-bold">{sub.status}</div>
              <div className="text-slate-500 text-[9px]">Latency: {sub.latency}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Error Recovery Logs */}
      <div className="p-6 rounded-3xl bg-[#090e18] border border-slate-800 space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Automated Error Recovery Log
          </h2>
          <span className="text-slate-400 text-[10px]">0 Unresolved Critical Alerts</span>
        </div>

        <div className="space-y-3">
          {errorLogs.map((log) => (
            <div key={log.id} className="p-4 rounded-2xl bg-dark-950 border border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">{log.system}</span>
                  <span className="text-slate-500 text-[10px]">({log.timestamp})</span>
                </div>
                <div className="text-slate-300 font-sans text-xs">{log.error}</div>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold shrink-0">
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
