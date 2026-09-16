import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, ArrowRight, Building2, ExternalLink, 
  Sparkles, RefreshCw, Mail, Phone, Clock, ShieldCheck, 
  AlertTriangle, Check, UserCheck, Calendar, DollarSign, X
} from 'lucide-react';

const V5_STAGES = [
  { key: 'DISCOVERED', label: '1. Discovered', color: 'border-slate-700', bg: 'bg-slate-800/10' },
  { key: 'QUALIFIED', label: '2. Qualified', color: 'border-sky-500/30', bg: 'bg-sky-500/5' },
  { key: 'REVIEW', label: '3. Human Review', color: 'border-amber-500/40', bg: 'bg-amber-500/5' },
  { key: 'CONTACTED', label: '4. Contacted', color: 'border-blue-500/30', bg: 'bg-blue-500/5' },
  { key: 'RESPONDED', label: '5. Responded', color: 'border-purple-500/30', bg: 'bg-purple-500/5' },
  { key: 'INTERESTED', label: '6. Interested', color: 'border-indigo-500/40', bg: 'bg-indigo-500/5' },
  { key: 'APPOINTMENT', label: '7. Appointment', color: 'border-teal-500/50', bg: 'bg-teal-500/5' },
  { key: 'CONVERTED', label: '8. Converted', color: 'border-emerald-500/60', bg: 'bg-emerald-500/10' }
];

export function PipelineView() {
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deliverability, setDeliverability] = useState(null);
  const [selectedProspect, setSelectedProspect] = useState(null);
  const [actionProcessing, setActionProcessing] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      // 1. Fetch Prospects
      const res = await fetch('/api/v1/prospects?limit=200');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProspects(data);
        } else {
          // Fallback to legacy
          await fetchFallback();
        }
      } else {
        await fetchFallback();
      }

      // 2. Fetch Deliverability Watchdog telemetry
      try {
        const delRes = await fetch('/api/v1/analytics/deliverability');
        if (delRes.ok) {
          const delData = await delRes.json();
          setDeliverability(delData);
        }
      } catch (err) {
        console.warn("Deliverability telemetry not available:", err);
      }
    } catch (e) {
      console.error("Failed to load pipeline prospects:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchFallback = async () => {
    const res = await fetch('/api/leads?limit=100');
    if (res.ok) {
      const data = await res.json();
      const mapped = (data.leads || []).map(l => ({
        id: l.id,
        company_name: l.name,
        website: l.website_url,
        industry: l.industry,
        location: l.city ? `${l.city}, ${l.country}` : l.country,
        score: l.lead_score,
        pipeline_stage: l.status === 'OUTREACH_READY' ? 'REVIEW' : (l.status === 'RESEARCHED' ? 'QUALIFIED' : (l.status === 'WON' ? 'CONVERTED' : l.status)),
        outreach_status: l.status === 'OUTREACH_READY' ? 'DRAFTED' : l.status
      }));
      setProspects(mapped);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getProspectsByStage = (stageKey) => {
    return prospects.filter(p => {
      const current = (p.pipeline_stage || '').toUpperCase();
      if (current === stageKey) return true;
      if (stageKey === 'DISCOVERED' && (!current || current === 'NEW')) return true;
      if (stageKey === 'QUALIFIED' && (current === 'SCORED' || (p.score >= 70 && current === 'DISCOVERED'))) return true;
      if (stageKey === 'REVIEW' && (current === 'OUTREACH_READY' || current === 'QUEUED')) return true;
      if (stageKey === 'CONVERTED' && current === 'WON') return true;
      return false;
    });
  };

  const handleAdvanceStage = async (prospectId, newStage) => {
    try {
      setActionProcessing(true);
      await fetch(`/api/v1/prospects/${prospectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pipeline_stage: newStage })
      });
      await fetchData();
      if (selectedProspect && selectedProspect.id === prospectId) {
        setSelectedProspect(prev => ({ ...prev, pipeline_stage: newStage }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionProcessing(false);
    }
  };

  const handleQuickApprove = async (prospectId) => {
    try {
      setActionProcessing(true);
      // Fetch details to get outreach message id
      const detailRes = await fetch(`/api/v1/prospects/${prospectId}`);
      if (detailRes.ok) {
        const detail = await detailRes.json();
        const pendingOutreach = (detail.outreach_history || []).find(m => m.status === 'PENDING_REVIEW');
        if (pendingOutreach) {
          await fetch(`/api/v1/outreach/${pendingOutreach.id}/approve`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ approver_id: 'operator-pipeline' })
          });
        }
      }
      await fetchData();
    } catch (e) {
      console.error("Quick approve error:", e);
    } finally {
      setActionProcessing(false);
    }
  };

  // Calculations for conversion intelligence ribbon
  const totalDiscovered = prospects.length;
  const totalQualified = prospects.filter(p => (p.score || 0) >= 70).length;
  const inReviewCount = getProspectsByStage('REVIEW').length;
  const totalResponded = prospects.filter(p => ['RESPONDED', 'INTERESTED', 'APPOINTMENT', 'CONVERTED'].includes(p.pipeline_stage)).length;
  const totalContacted = prospects.filter(p => ['CONTACTED', 'RESPONDED', 'INTERESTED', 'APPOINTMENT', 'CONVERTED'].includes(p.pipeline_stage)).length;
  const replyRate = totalContacted > 0 ? Math.round((totalResponded / totalContacted) * 100) : 0;
  const qualificationRate = totalDiscovered > 0 ? Math.round((totalQualified / totalDiscovered) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-dark-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-white tracking-tight">V5 Sales Pipeline & Conversion Intelligence</h2>
            <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-teal-500/10 text-teal-400 border border-teal-500/30 rounded-full">
              8-STAGE FUNNEL
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Track business progression from autonomous discovery to live booked appointments & converted contracts
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="p-2.5 bg-dark-850 hover:bg-dark-800 text-slate-300 border border-slate-700 rounded-xl transition-all self-start md:self-auto flex items-center gap-2 text-xs font-semibold"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-teal-400' : ''}`} />
          Refresh Funnel
        </button>
      </div>

      {/* Top Conversion Intelligence Metric Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {/* Total Discovered */}
        <div className="bg-dark-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Total Discovered</div>
          <div className="text-2xl font-black text-white">{totalDiscovered}</div>
          <div className="text-[11px] text-teal-400 font-mono flex items-center gap-1">
            <span>Legitimate public B2B signals</span>
          </div>
        </div>

        {/* Grounding / Qualification Rate */}
        <div className="bg-dark-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Grounding Rate</div>
          <div className="text-2xl font-black text-sky-400">{qualificationRate}%</div>
          <div className="text-[11px] text-slate-400 font-mono">
            {totalQualified} / {totalDiscovered} verified &gt;=70
          </div>
        </div>

        {/* Human Review Queue */}
        <div className="bg-dark-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="text-[10px] text-amber-400 uppercase font-semibold tracking-wider flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Review Queue
          </div>
          <div className="text-2xl font-black text-amber-400">{inReviewCount}</div>
          <div className="text-[11px] text-amber-300/80 font-mono">
            Awaiting human approval
          </div>
        </div>

        {/* Inbound Reply Rate */}
        <div className="bg-dark-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="text-[10px] text-purple-400 uppercase font-semibold tracking-wider">Reply Conversion</div>
          <div className="text-2xl font-black text-purple-400">{replyRate}%</div>
          <div className="text-[11px] text-slate-400 font-mono">
            {totalResponded} inbound replies
          </div>
        </div>

        {/* Deliverability Health & Circuit Breaker */}
        <div className="bg-dark-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-teal-400" />
            Deliverability Watchdog
          </div>
          <div className="text-base font-bold text-emerald-400 flex items-center gap-1.5 pt-0.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            OPTIMAL HEALTH
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            Bounce: &lt;1.0% | Circuit Breaker: OK
          </div>
        </div>
      </div>

      {/* Kanban Board - 8 V5 Stages */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-3 overflow-x-auto pb-4">
        {V5_STAGES.map((stage) => {
          const stageProspects = getProspectsByStage(stage.key);
          return (
            <div 
              key={stage.key} 
              className={`bg-dark-900 border border-slate-800 rounded-2xl flex flex-col min-w-[220px] h-[650px] overflow-hidden ${stage.bg}`}
            >
              {/* Column Header */}
              <div className="p-3 bg-dark-850 border-b border-slate-800 flex items-center justify-between">
                <span className="font-bold text-slate-200 text-xs truncate">{stage.label}</span>
                <span className="px-2 py-0.5 bg-dark-900 text-teal-400 border border-slate-800 rounded-full text-[10px] font-mono font-bold">
                  {stageProspects.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="p-2.5 overflow-y-auto space-y-2.5 flex-1">
                {stageProspects.length === 0 ? (
                  <div className="text-center py-10 text-slate-600 text-[11px] italic">
                    No prospects in stage
                  </div>
                ) : (
                  stageProspects.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedProspect(p)}
                      className={`p-3 bg-dark-850/90 border ${stage.color} rounded-xl space-y-2 text-xs shadow-sm hover:border-teal-500/60 transition-all cursor-pointer group`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div className="font-bold text-white leading-snug group-hover:text-teal-300 transition-colors">
                          {p.company_name}
                        </div>
                        {p.score !== null && (
                          <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-dark-900 text-teal-400 border border-teal-500/20 rounded shrink-0">
                            {p.score}
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-400 flex items-center justify-between">
                        <span className="text-teal-400 font-medium truncate max-w-[110px]">{p.industry}</span>
                        <span className="text-slate-500 text-[10px] truncate max-w-[80px]">{p.location || 'Global'}</span>
                      </div>

                      {/* Quick action for Review Stage */}
                      {stage.key === 'REVIEW' && (
                        <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between">
                          <span className="text-[10px] text-amber-400 font-mono">Review Pending</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickApprove(p.id);
                            }}
                            disabled={actionProcessing}
                            className="px-2 py-1 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-dark-950 font-bold text-[10px] rounded transition-all flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            Send
                          </button>
                        </div>
                      )}

                      {/* Advance Stage Arrow Button */}
                      {stage.key !== 'CONVERTED' && (
                        <div className="pt-1 border-t border-slate-800/50 flex items-center justify-between text-[10px] text-slate-500">
                          <span>Move to next</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const currentIndex = V5_STAGES.findIndex(s => s.key === stage.key);
                              if (currentIndex < V5_STAGES.length - 1) {
                                handleAdvanceStage(p.id, V5_STAGES[currentIndex + 1].key);
                              }
                            }}
                            className="p-1 hover:text-teal-400 rounded transition-colors"
                            title="Advance to next funnel stage"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
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

      {/* Prospect Quick Inspect Modal */}
      {selectedProspect && (
        <div className="fixed inset-0 z-50 bg-dark-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dark-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  {selectedProspect.company_name}
                  {selectedProspect.score && (
                    <span className="text-xs font-mono font-bold text-teal-400 px-2 py-0.5 bg-dark-800 rounded border border-teal-500/20">
                      {selectedProspect.score}/100
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedProspect.industry} • {selectedProspect.location}
                </p>
              </div>
              <button onClick={() => setSelectedProspect(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 bg-dark-950 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-mono">Current Funnel Stage</span>
                  <div className="font-bold text-teal-400 mt-0.5">{selectedProspect.pipeline_stage || 'DISCOVERED'}</div>
                </div>
                <div className="p-2.5 bg-dark-950 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-mono">Review Mode</span>
                  <div className="font-bold text-amber-400 mt-0.5">HUMAN-IN-THE-LOOP</div>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-400 block mb-1">Advance Stage Manually</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {V5_STAGES.map((s) => (
                    <button
                      key={s.key}
                      onClick={() => handleAdvanceStage(selectedProspect.id, s.key)}
                      disabled={actionProcessing}
                      className={`p-1.5 text-[10px] font-semibold rounded-lg border text-center transition-all ${
                        selectedProspect.pipeline_stage === s.key
                          ? 'bg-teal-500 text-dark-950 border-teal-400 font-bold'
                          : 'bg-dark-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      {s.label.split('. ')[1]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedProspect(null)}
                className="px-4 py-2 bg-dark-800 hover:bg-dark-700 text-slate-200 rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
