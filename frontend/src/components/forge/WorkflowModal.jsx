import React from 'react';
import { X, ArrowRight, CheckCircle2, ShieldAlert, Cpu, Terminal, Zap, ShieldCheck } from 'lucide-react';

export function WorkflowModal({ agent, onClose, onNavigateAudit }) {
  if (!agent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/85 backdrop-blur-md">
      <div className="bg-dark-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-slate-100">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-mono font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{agent.name}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded font-bold">
                  {agent.badge}
                </span>
              </div>
              <div className="text-xs text-slate-400">{agent.role}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-dark-850 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Visual Architecture Chain */}
        <div className="space-y-4">
          <div className="text-xs font-mono text-slate-400 uppercase font-bold tracking-wider">
            Deterministic Workflow Execution Sequence:
          </div>

          <div className="space-y-3">
            {/* Step 1: Input */}
            <div className="p-3.5 bg-dark-950 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 font-bold">
                <span>01. INCOMING DATA INGEST</span>
                <span>EVENT TRIGGER</span>
              </div>
              <p className="text-xs text-slate-200">{agent.input}</p>
            </div>

            <div className="flex justify-center text-teal-400">
              ↓
            </div>

            {/* Step 2: AI Decision */}
            <div className="p-3.5 bg-dark-950 rounded-xl border border-teal-500/30 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-teal-400 font-bold">
                <span>02. AI DECISION & VERIFICATION</span>
                <span>SUB-50MS ENGINE</span>
              </div>
              <p className="text-xs text-slate-200">{agent.aiDecision}</p>
            </div>

            <div className="flex justify-center text-teal-400">
              ↓
            </div>

            {/* Step 3: Action */}
            <div className="p-3.5 bg-dark-950 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400 font-bold">
                <span>03. AUTOMATED ACTION DISPATCH</span>
                <span>API COMMIT</span>
              </div>
              <p className="text-xs text-slate-200">{agent.action}</p>
            </div>

            <div className="flex justify-center text-indigo-400">
              ↓
            </div>

            {/* Step 4: Human Oversight */}
            <div className="p-3.5 bg-indigo-950/30 rounded-xl border border-indigo-500/30 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-indigo-400 font-bold">
                <span>04. HUMAN OVERSIGHT & POLICY GATE</span>
                <span>GOVERNANCE</span>
              </div>
              <p className="text-xs text-slate-300">{agent.oversight}</p>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-dark-850 hover:bg-dark-800 text-slate-300 rounded-xl text-xs font-bold"
          >
            Close Diagram
          </button>

          <button
            onClick={() => {
              onClose();
              onNavigateAudit();
            }}
            className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-teal-500/20"
          >
            <span>Deploy This Agent in Your Business</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
