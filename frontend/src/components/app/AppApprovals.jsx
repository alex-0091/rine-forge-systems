import React, { useState } from 'react';
import { 
  ShieldCheck, Check, X, AlertTriangle, Clock, 
  ArrowRight, UserCheck, Bot, FileText, CheckCircle2 
} from 'lucide-react';
import { INITIAL_APPROVALS } from '../../data/forgePlatformConfig';

export function AppApprovals() {
  const [approvals, setApprovals] = useState(INITIAL_APPROVALS);
  const [resolvedLog, setResolvedLog] = useState([]);

  const handleApprove = (id) => {
    const item = approvals.find(a => a.id === id);
    if (!item) return;
    setApprovals(prev => prev.filter(a => a.id !== id));
    setResolvedLog(prev => [
      {
        ...item,
        status: 'APPROVED & DISPATCHED',
        resolvedAt: new Date().toLocaleTimeString()
      },
      ...prev
    ]);
  };

  const handleReject = (id) => {
    const item = approvals.find(a => a.id === id);
    if (!item) return;
    setApprovals(prev => prev.filter(a => a.id !== id));
    setResolvedLog(prev => [
      {
        ...item,
        status: 'REJECTED BY OPERATOR',
        resolvedAt: new Date().toLocaleTimeString()
      },
      ...prev
    ]);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto font-sans">
      
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-mono font-bold uppercase">
          <ShieldCheck className="w-3.5 h-3.5" /> HUMAN-IN-THE-LOOP GOVERNANCE
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Pending Human Authorization Queue
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          FORGE AI prepares, verifies, and scores actions. Sensitive transactions require explicit 1-click team approval before external dispatch.
        </p>
      </div>

      {/* Pending Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400 font-bold uppercase">Pending Actions ({approvals.length})</span>
          <span className="text-amber-400">Requires Authorization</span>
        </div>

        {approvals.length === 0 ? (
          <div className="p-8 rounded-3xl bg-[#090e18] border border-slate-800 text-center space-y-2 font-mono text-xs text-slate-400">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <div className="text-white font-bold text-sm">All Action Queues Cleared</div>
            <p className="text-slate-500">No autonomous actions currently require manual human authorization.</p>
          </div>
        ) : (
          approvals.map((appr) => (
            <div
              key={appr.id}
              className="p-6 rounded-3xl bg-[#090e18] border border-amber-500/30 space-y-4 shadow-lg font-mono text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-teal-400 font-bold">{appr.system}</span>
                  <span className="text-slate-500">• {appr.timestamp}</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                  {appr.riskLevel} RISK POLICY GATE
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="text-sm font-bold text-white font-sans">{appr.actionType}</div>
                <div className="text-xs text-teal-300">Target Entity: {appr.target}</div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed pt-1">{appr.summary}</p>
              </div>

              {/* Explainability Box */}
              <div className="p-3.5 rounded-xl bg-dark-950 border border-slate-800 text-[11px] space-y-1">
                <div className="text-teal-400 font-bold">WHY THIS ACTION?</div>
                <div className="text-slate-300 font-sans">
                  ✓ Intent score &gt; 85% • ✓ ICP criteria matched • ✓ Verified against pricing documentation
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => handleReject(appr.id)}
                  className="px-4 py-2 bg-slate-900 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-slate-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reject Action</span>
                </button>
                <button
                  onClick={() => handleApprove(appr.id)}
                  className="px-5 py-2 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl text-xs transition-all shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Authorize & Commit</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Resolved History Log */}
      {resolvedLog.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <h2 className="text-sm font-bold text-slate-400 font-mono uppercase">
            Resolved Action Audit History
          </h2>
          <div className="space-y-2 font-mono text-xs">
            {resolvedLog.map((log, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-between">
                <div>
                  <span className="text-white font-bold">{log.actionType}</span>
                  <span className="text-slate-500 text-[10px] ml-2">↳ {log.target}</span>
                </div>
                <span className="text-emerald-400 font-bold text-[10px]">{log.status} ({log.resolvedAt})</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
