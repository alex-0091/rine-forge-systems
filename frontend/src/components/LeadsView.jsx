import React, { useState, useEffect } from 'react';
import { 
  Building2, Search, Filter, Sparkles, CheckCircle2, 
  ExternalLink, Mail, Phone, Globe, Shield, RefreshCw, 
  ChevronRight, ArrowRight, Activity, X
} from 'lucide-react';

export function LeadsView() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [leadDetail, setLeadDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  
  // Filters
  const [industryFilter, setIndustryFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [minScoreFilter, setMinScoreFilter] = useState(0);

  // Discovery Modal
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [discIndustry, setDiscIndustry] = useState('Dental');
  const [discCountry, setDiscCountry] = useState('USA');
  const [discLimit, setDiscLimit] = useState(10);
  const [processingPipelineId, setProcessingPipelineId] = useState(null);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      let url = `/api/leads?limit=50`;
      if (industryFilter) url += `&industry=${encodeURIComponent(industryFilter)}`;
      if (countryFilter) url += `&country=${encodeURIComponent(countryFilter)}`;
      if (minScoreFilter > 0) url += `&min_score=${minScoreFilter}`;

      const res = await fetch(url);
      const data = await res.json();
      setLeads(data.leads || []);
    } catch (e) {
      console.error("Failed to fetch leads:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [industryFilter, countryFilter, minScoreFilter]);

  const openLeadDetail = async (id) => {
    setSelectedLeadId(id);
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/leads/${id}`);
      const data = await res.json();
      setLeadDetail(data);
    } catch (e) {
      console.error("Failed to fetch lead detail:", e);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleRunDiscovery = async () => {
    try {
      setIsDiscovering(true);
      const res = await fetch('/api/leads/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industry: discIndustry,
          country: discCountry,
          limit: Number(discLimit)
        })
      });
      await res.json();
      await fetchLeads();
      setIsDiscovering(false);
    } catch (e) {
      console.error("Discovery error:", e);
      setIsDiscovering(false);
    }
  };

  const handleProcessLeadPipeline = async (businessId) => {
    try {
      setProcessingPipelineId(businessId);
      const res = await fetch(`/api/leads/pipeline-full-process/${businessId}`, { method: 'POST' });
      await res.json();
      await fetchLeads();
      if (selectedLeadId === businessId) {
        await openLeadDetail(businessId);
      }
    } catch (e) {
      console.error("Pipeline process error:", e);
    } finally {
      setProcessingPipelineId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-dark-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Business Intelligence & Leads Explorer</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Discover, research, analyze digital footprints, and score B2B prospects
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-dark-850 border border-slate-800 px-3 py-2 rounded-xl text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none"
            >
              <option value="" className="bg-dark-900">All Countries</option>
              <option value="USA" className="bg-dark-900">USA</option>
              <option value="UK" className="bg-dark-900">United Kingdom</option>
              <option value="Canada" className="bg-dark-900">Canada</option>
              <option value="Australia" className="bg-dark-900">Australia</option>
              <option value="Singapore" className="bg-dark-900">Singapore</option>
              <option value="UAE" className="bg-dark-900">UAE</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-dark-850 border border-slate-800 px-3 py-2 rounded-xl text-xs">
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none"
            >
              <option value="" className="bg-dark-900">All Niches</option>
              <option value="Dental" className="bg-dark-900">Dental</option>
              <option value="Real Estate" className="bg-dark-900">Real Estate</option>
              <option value="Hotel" className="bg-dark-900">Hotel</option>
              <option value="Private School" className="bg-dark-900">Private School</option>
              <option value="Law Firm" className="bg-dark-900">Law Firm</option>
              <option value="Accounting" className="bg-dark-900">Accounting</option>
              <option value="HVAC" className="bg-dark-900">HVAC</option>
            </select>
          </div>

          <button
            onClick={handleRunDiscovery}
            disabled={isDiscovering}
            className="px-4 py-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-dark-950 font-semibold rounded-xl text-xs transition-all flex items-center gap-1.5"
          >
            {isDiscovering ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            {isDiscovering ? 'Discovering...' : 'Discover Leads'}
          </button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-dark-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400 bg-dark-850/50">
                <th className="p-4 pl-6">Company & Niche</th>
                <th className="p-4">Location</th>
                <th className="p-4">Tech & Booking</th>
                <th className="p-4">Decision Maker</th>
                <th className="p-4">Lead Score</th>
                <th className="p-4">Top AI Opportunity</th>
                <th className="p-4 text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500">
                    No businesses found matching criteria. Click "Discover Leads" to ingest curated benchmark prospects.
                  </td>
                </tr>
              ) : (
                leads.map((b) => (
                  <tr key={b.id} className="hover:bg-dark-850/50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="font-semibold text-white">{b.name}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="text-teal-400">{b.industry}</span>
                        {b.website_url && (
                          <a href={b.website_url} target="_blank" rel="noreferrer" className="hover:text-slate-200 flex items-center gap-0.5">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-slate-300 text-xs">
                      {b.city ? `${b.city}, ` : ''}{b.country}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {b.detected_cms && (
                          <span className="px-2 py-0.5 text-[10px] font-medium bg-dark-800 text-slate-300 rounded-md border border-slate-700">
                            {b.detected_cms}
                          </span>
                        )}
                        {b.has_booking && (
                          <span className="px-2 py-0.5 text-[10px] font-medium bg-emerald-500/10 text-emerald-400 rounded-md border border-emerald-500/20">
                            Booking
                          </span>
                        )}
                        {!b.has_chat && (
                          <span className="px-2 py-0.5 text-[10px] font-medium bg-amber-500/10 text-amber-400 rounded-md border border-amber-500/20">
                            No Chat
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-xs text-slate-300">
                      {b.contact_name ? (
                        <div>
                          <div className="font-medium text-slate-200">{b.contact_name}</div>
                          <div className="text-slate-400 text-[11px]">{b.contact_role}</div>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="p-4">
                      {b.lead_score !== null ? (
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
                            b.lead_score >= 85 ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' :
                            b.lead_score >= 70 ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' :
                            'bg-slate-800 text-slate-400 border-slate-700'
                          }`}>
                            {b.lead_score}/100
                          </span>
                          <span className="text-[10px] text-slate-400 uppercase font-mono">{b.qualification_tier}</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleProcessLeadPipeline(b.id)}
                          disabled={processingPipelineId === b.id}
                          className="px-2.5 py-1 text-xs bg-dark-800 hover:bg-dark-700 text-teal-400 border border-teal-500/30 rounded-lg flex items-center gap-1 transition-all"
                        >
                          {processingPipelineId === b.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Activity className="w-3 h-3" />}
                          Score Lead
                        </button>
                      )}
                    </td>
                    <td className="p-4 text-xs text-slate-300 max-w-[200px] truncate">
                      {b.top_opportunity || <span className="text-slate-500">Run analysis</span>}
                    </td>
                    <td className="p-4 text-right pr-6">
                      <button
                        onClick={() => openLeadDetail(b.id)}
                        className="p-2 bg-dark-800 hover:bg-dark-700 text-slate-300 hover:text-white rounded-lg transition-all"
                        title="Inspect Deep Business Profile"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deep Business Inspector Drawer / Modal */}
      {selectedLeadId && (
        <div className="fixed inset-0 z-50 bg-dark-950/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-2xl bg-dark-900 border-l border-slate-800 h-full overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {leadDetail?.business?.name || 'Loading Business Profile...'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {leadDetail?.business?.industry} • {leadDetail?.business?.city}, {leadDetail?.business?.country}
                </p>
              </div>
              <button
                onClick={() => setSelectedLeadId(null)}
                className="p-2 bg-dark-800 hover:bg-dark-700 text-slate-400 hover:text-white rounded-lg transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {detailLoading ? (
              <div className="flex items-center justify-center py-20 text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin mr-2 text-teal-400" />
                Loading deep research profile...
              </div>
            ) : (
              leadDetail && (
                <div className="space-y-6 text-sm">
                  {/* Lead Score Card */}
                  {leadDetail.lead_score && (
                    <div className="bg-dark-850 border border-teal-500/20 p-5 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Composite Lead Score</span>
                          <div className="text-3xl font-extrabold text-teal-400 mt-1">
                            {leadDetail.lead_score.total_score} <span className="text-sm font-normal text-slate-400">/ 100</span>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-teal-500/10 text-teal-300 border border-teal-500/30 rounded-full text-xs font-semibold">
                          {leadDetail.lead_score.tier}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-3">{leadDetail.lead_score.rationale}</p>
                    </div>
                  )}

                  {/* Verified Facts & Digital Footprint */}
                  <div className="bg-dark-850 border border-slate-800 p-5 rounded-xl space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Verified Website & Tech Observations</h4>
                    <div className="space-y-2">
                      {(leadDetail.research?.verified_facts || []).map((fact, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 mt-0.5 shrink-0" />
                          <span>{fact}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Grounded Pain Points */}
                  <div className="bg-dark-850 border border-slate-800 p-5 rounded-xl space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Detected Operational Pain Points</h4>
                    <div className="space-y-3">
                      {(leadDetail.pain_points || []).map((p) => (
                        <div key={p.id} className="p-3 bg-dark-900 border border-slate-800 rounded-lg space-y-1 text-xs">
                          <div className="font-semibold text-slate-200">{p.observed_fact}</div>
                          <div className="text-slate-400">{p.business_problem}</div>
                          <div className="text-amber-400 font-mono text-[11px] pt-1">Severity: {p.severity_score}/100</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Opportunities & Pitch Angle */}
                  <div className="bg-dark-850 border border-slate-800 p-5 rounded-xl space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Tailored AI Automation Opportunities</h4>
                    <div className="space-y-3">
                      {(leadDetail.ai_opportunities || []).map((o) => (
                        <div key={o.id} className="p-3 bg-dark-900 border border-slate-800 rounded-lg space-y-1.5 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-teal-300">{o.solution_name}</span>
                            <span className="font-mono text-teal-400 font-bold">{o.overall_score}/100</span>
                          </div>
                          <p className="text-slate-300">{o.business_benefit}</p>
                          <div className="p-2 bg-dark-950 border border-slate-800/80 rounded text-slate-400 italic text-[11px]">
                            Pitch Angle: "{o.recommended_pitch}"
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Outreach History & Draft preview */}
                  {leadDetail.outreach_history && leadDetail.outreach_history.length > 0 && (
                    <div className="bg-dark-850 border border-slate-800 p-5 rounded-xl space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Personalized Outreach Draft</h4>
                      {leadDetail.outreach_history.map((m) => (
                        <div key={m.id} className="p-4 bg-dark-900 border border-slate-800 rounded-lg space-y-2 text-xs">
                          <div className="flex items-center justify-between text-slate-400">
                            <span className="font-medium text-slate-200">Subject: {m.subject}</span>
                            <span className="px-2 py-0.5 bg-dark-800 text-teal-400 rounded text-[10px] font-mono">Quality: {m.quality_score}/100</span>
                          </div>
                          <pre className="whitespace-pre-wrap font-sans text-slate-300 leading-relaxed text-xs bg-dark-950 p-3 rounded border border-slate-800/60">
                            {m.body}
                          </pre>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
