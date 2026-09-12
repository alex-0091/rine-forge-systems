import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, DollarSign, ArrowRight, Building2, 
  ExternalLink, Sparkles, RefreshCw
} from 'lucide-react';

const STAGES = [
  { key: 'DISCOVERED', label: 'Discovered', color: 'border-slate-700' },
  { key: 'QUALIFIED', label: 'Qualified (75+)', color: 'border-teal-500/30' },
  { key: 'OUTREACH_READY', label: 'Outreach Ready', color: 'border-sky-500/30' },
  { key: 'CONTACTED', label: 'Contacted', color: 'border-blue-500/30' },
  { key: 'REPLIED', label: 'Replied', color: 'border-purple-500/30' },
  { key: 'INTERESTED', label: 'Interested', color: 'border-amber-500/30' },
  { key: 'WON', label: 'Clients Won', color: 'border-emerald-500/50' }
];

export function PipelineView() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/leads?limit=100');
      const data = await res.json();
      setLeads(data.leads || []);
    } catch (e) {
      console.error("Failed to load pipeline leads:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const getLeadsByStage = (stageKey) => {
    return leads.filter(l => {
      if (stageKey === 'QUALIFIED') return l.status === 'QUALIFIED' || (l.lead_score >= 75 && l.status === 'RESEARCHED');
      if (stageKey === 'OUTREACH_READY') return l.status === 'OUTREACH_READY' || l.status === 'QUEUED';
      return l.status === stageKey;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-dark-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Sales Pipeline & Conversion Funnel</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Track business progression from autonomous discovery to paying client contracts
          </p>
        </div>

        <button
          onClick={fetchLeads}
          className="p-2.5 bg-dark-850 hover:bg-dark-800 text-slate-300 border border-slate-700 rounded-xl transition-all self-start md:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Kanban Board Horizontal Scroll */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageLeads = getLeadsByStage(stage.key);
          return (
            <div key={stage.key} className="bg-dark-900 border border-slate-800 rounded-2xl flex flex-col min-w-[200px] h-[600px] overflow-hidden">
              <div className="p-3.5 bg-dark-850 border-b border-slate-800 flex items-center justify-between">
                <span className="font-bold text-slate-200 text-xs truncate">{stage.label}</span>
                <span className="px-2 py-0.5 bg-dark-900 text-teal-400 rounded-full text-[10px] font-mono font-bold">
                  {stageLeads.length}
                </span>
              </div>

              <div className="p-3 overflow-y-auto space-y-3 flex-1">
                {stageLeads.length === 0 ? (
                  <div className="text-center py-8 text-slate-600 text-[11px] italic">
                    Empty
                  </div>
                ) : (
                  stageLeads.map((l) => (
                    <div
                      key={l.id}
                      className={`p-3 bg-dark-850 border ${stage.color} rounded-xl space-y-2 text-xs shadow-sm hover:border-teal-500/50 transition-all`}
                    >
                      <div className="font-bold text-white leading-tight">{l.name}</div>
                      <div className="text-[11px] text-slate-400 flex items-center justify-between">
                        <span className="text-teal-400">{l.industry}</span>
                        <span>{l.country}</span>
                      </div>
                      {l.lead_score !== null && (
                        <div className="pt-1 flex items-center justify-between border-t border-slate-800/60 text-[10px]">
                          <span className="text-slate-400 font-mono">Score: {l.lead_score}/100</span>
                          <span className="text-teal-300 font-semibold">{l.qualification_tier}</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
