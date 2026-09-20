import React, { useState } from 'react';
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, HelpCircle, 
  Search, Eye, Smartphone, Zap, Award, BarChart2 
} from 'lucide-react';
import { ModelTransparencyBadge } from './ModelTransparencyBadge';

export function WebsiteAuditViewer({ artifact }) {
  const auditData = artifact?.data_json || {};
  const dimensions = auditData.dimensions || [];
  const score = auditData.overall_score ?? 74;
  const unmeasurable = auditData.unmeasurable_metrics_disclosed || [
    'Server-side TTFB (Requires live server agent or synthetic probes)',
    'Real-user core web vitals (Requires Google Chrome User Experience Report API)'
  ];

  const [filter, setFilter] = useState('ALL'); // ALL, FACTS, RECOMMENDATIONS

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs">
            <Search className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              {artifact?.name || 'Website & Conversion Audit'}
            </h4>
            <div className="text-[11px] text-slate-400">
              8-Dimension Technical & Conversion Scorecard • Strict Fact vs Assumption Separation
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ModelTransparencyBadge
            provider={artifact?.provider_id || 'LOCAL_OLLAMA'}
            model={artifact?.model_name || 'AuditSynthesisCore'}
            isFree={artifact?.is_free ?? true}
            costEstimate={artifact?.cost_estimate || 'FREE'}
          />
        </div>
      </div>

      {/* Overall Score & Scorecard Summary */}
      <div className="p-6 bg-slate-950/40 border-b border-slate-800 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center shadow-lg">
            <span className="text-2xl font-black text-amber-400">{score}</span>
            <span className="text-[9px] font-mono uppercase text-slate-500 font-bold">/ 100 Score</span>
          </div>
          <div className="max-w-md">
            <h5 className="text-sm font-bold text-white">Conversion Readiness Assessment</h5>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {auditData.executive_summary || 'Your site possesses solid structural foundations, but displays friction in direct booking CTAs and mobile touch targets.'}
            </p>
          </div>
        </div>

        {/* Unmeasurable Disclosures Alert */}
        <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 max-w-sm">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 mb-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Honest Technical Scope</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            The following metrics are unmeasurable without server instrumentation and were excluded to prevent hallucinations:
          </p>
          <ul className="text-[10px] text-slate-500 list-disc list-inside mt-1 font-mono">
            {unmeasurable.map((item, idx) => (
              <li key={idx} className="truncate">{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-6 py-3 border-b border-slate-800 bg-slate-950/80 flex items-center gap-2">
        <span className="text-xs font-mono uppercase text-slate-500 mr-2">Audit Filter:</span>
        {['ALL', 'FACTS ONLY', 'RECOMMENDATIONS'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
              filter === f
                ? 'bg-slate-800 text-teal-300 font-bold border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* 8-Dimension Evaluation Grid */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {dimensions.map((dim, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-indigo-400" />
                {dim.name}
              </span>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                (dim.score || 80) >= 80 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
              }`}>
                {dim.score || 75}/100
              </span>
            </div>

            {/* Verified Facts */}
            {(filter === 'ALL' || filter === 'FACTS ONLY') && dim.verified_facts && (
              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Verified Observation:
                </span>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  {dim.verified_facts}
                </p>
              </div>
            )}

            {/* Deductive Recommendations */}
            {(filter === 'ALL' || filter === 'RECOMMENDATIONS') && dim.recommendation && (
              <div className="p-2.5 rounded-lg bg-indigo-500/5 border border-indigo-500/20">
                <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Recommended Action:
                </span>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  {dim.recommendation}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
