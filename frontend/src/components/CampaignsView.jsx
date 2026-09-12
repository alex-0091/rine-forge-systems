import React, { useState, useEffect } from 'react';
import { 
  Plus, Play, Pause, AlertTriangle, ShieldCheck, 
  Send, Users, CheckCircle, RefreshCw, Sparkles, Filter
} from 'lucide-react';

export function CampaignsView({ onNavigate }) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
  const [name, setName] = useState('USA Dental AI Receptionist Q3');
  const [targetCountry, setTargetCountry] = useState('USA');
  const [targetIndustry, setTargetIndustry] = useState('Dental');
  const [minLeadScore, setMinLeadScore] = useState(75);
  const [primaryOffer, setPrimaryOffer] = useState('AI Receptionist & 24/7 Booking');
  const [dailySendLimit, setDailySendLimit] = useState(25);
  const [isDryRun, setIsDryRun] = useState(true);
  const [creating, setCreating] = useState(false);
  const [policyWarning, setPolicyWarning] = useState(null);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/campaigns');
      const data = await res.json();
      setCampaigns(data);
    } catch (e) {
      console.error("Failed to fetch campaigns:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
    if (targetCountry === 'Australia') {
      setPolicyWarning("⚠️ Australia Spam Act 2003 Policy: Cold outbound campaigns targeting Australia require manual compliance verification before sending.");
    } else {
      setPolicyWarning(null);
    }
  }, [targetCountry]);

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          target_country: targetCountry,
          target_industry: targetIndustry,
          min_lead_score: Number(minLeadScore),
          primary_offer: primaryOffer,
          daily_send_limit: Number(dailySendLimit),
          is_dry_run: isDryRun
        })
      });
      const data = await res.json();
      await fetchCampaigns();
      setCreating(false);
      setShowCreateModal(false);
    } catch (e) {
      console.error("Failed to create campaign:", e);
      setCreating(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await fetch(`/api/campaigns/${id}/toggle-status`, { method: 'POST' });
      if (!res.ok) {
        const err = await res.json();
        alert(err.detail || "Could not toggle status.");
      } else {
        await fetchCampaigns();
      }
    } catch (e) {
      console.error("Status toggle error:", e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-dark-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Campaign Orchestrator</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Configure country-compliant outreach workflows, score thresholds, and multi-touch sequences
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-dark-950 font-semibold rounded-xl text-sm transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create New Campaign
        </button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.length === 0 ? (
          <div className="col-span-2 p-12 bg-dark-900 border border-slate-800 rounded-2xl text-center text-slate-400">
            No campaigns configured. Click "Create New Campaign" to launch a targeted Dry-Run sequence.
          </div>
        ) : (
          campaigns.map((c) => (
            <div key={c.id} className="bg-dark-900 border border-slate-800 p-6 rounded-2xl space-y-4 hover:border-slate-700 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">{c.name}</h3>
                  <div className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                    <span className="text-teal-400 font-medium">{c.target_industry}</span>
                    <span>•</span>
                    <span>{c.target_country}</span>
                    <span>•</span>
                    <span className="font-mono text-slate-300">Min Score: {c.min_lead_score}+</span>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                  c.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  c.status === 'PAUSED' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                  'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {c.status}
                </span>
              </div>

              <div className="p-3 bg-dark-850 border border-slate-800 rounded-xl space-y-1 text-xs">
                <div className="text-slate-400">Primary Offer: <span className="text-slate-200 font-medium">{c.primary_offer}</span></div>
                <div className="text-slate-400">Mode: <span className="text-teal-400 font-medium">{c.is_dry_run ? 'DRY RUN (Safe Simulated Sending)' : 'LIVE DISPATCH'}</span></div>
                <div className="text-slate-400">Follow-up Sequence: <span className="text-slate-300 font-mono">Day 0 → Day 4 → Day 9 → Day 16</span></div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center">
                <div className="p-2 bg-dark-850 rounded-lg">
                  <div className="text-base font-bold text-white">{c.members_count}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-medium">Enrolled Leads</div>
                </div>
                <div className="p-2 bg-dark-850 rounded-lg">
                  <div className="text-base font-bold text-sky-400">{c.messages_sent}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-medium">Messages Sent</div>
                </div>
                <div className="p-2 bg-dark-850 rounded-lg">
                  <div className="text-base font-bold text-amber-400">{c.replied_count}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-medium">Replies</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => onNavigate('outreach')}
                  className="text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors"
                >
                  View Outreach Queue →
                </button>

                <button
                  onClick={() => handleToggleStatus(c.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                    c.status === 'ACTIVE' 
                      ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/30' 
                      : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  }`}
                >
                  {c.status === 'ACTIVE' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {c.status === 'ACTIVE' ? 'Pause Campaign' : 'Activate Campaign'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-dark-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-dark-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Create Targeted Outreach Campaign</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1.5">Campaign Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-dark-850 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-300 mb-1.5">Target Country</label>
                  <select
                    value={targetCountry}
                    onChange={(e) => setTargetCountry(e.target.value)}
                    className="w-full p-2.5 bg-dark-850 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="USA">USA (CAN-SPAM)</option>
                    <option value="UK">UK (PECR / GDPR)</option>
                    <option value="Canada">Canada (CASL)</option>
                    <option value="Australia">Australia (Spam Act 2003)</option>
                    <option value="Singapore">Singapore (PDPA)</option>
                    <option value="UAE">UAE (PDPL)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1.5">Target Industry</label>
                  <select
                    value={targetIndustry}
                    onChange={(e) => setTargetIndustry(e.target.value)}
                    className="w-full p-2.5 bg-dark-850 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Dental">Dental Clinics</option>
                    <option value="Real Estate">Real Estate Agencies</option>
                    <option value="Hotel">Hotels & Resorts</option>
                    <option value="Private School">Private Schools</option>
                    <option value="Law Firm">Law Firms</option>
                    <option value="Accounting">Accounting & Tax</option>
                    <option value="HVAC">HVAC & Services</option>
                  </select>
                </div>
              </div>

              {policyWarning && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-[11px] leading-relaxed">
                  {policyWarning}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-300 mb-1.5">Minimum Lead Score (0-100)</label>
                  <input
                    type="number"
                    min="40"
                    max="100"
                    value={minLeadScore}
                    onChange={(e) => setMinLeadScore(e.target.value)}
                    className="w-full p-2.5 bg-dark-850 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-teal-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1.5">Daily Send Limit</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={dailySendLimit}
                    onChange={(e) => setDailySendLimit(e.target.value)}
                    className="w-full p-2.5 bg-dark-850 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-teal-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1.5">Primary Tailored Offer</label>
                <select
                  value={primaryOffer}
                  onChange={(e) => setPrimaryOffer(e.target.value)}
                  className="w-full p-2.5 bg-dark-850 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="AI Receptionist & 24/7 Booking">AI Receptionist & 24/7 Booking Assistant</option>
                  <option value="AI Lead Qualification Engine">AI Lead Qualification Engine</option>
                  <option value="Multilingual Guest Concierge">Multilingual Guest Concierge</option>
                  <option value="Admissions & Tour Scheduler">Admissions & Campus Tour Scheduler</option>
                  <option value="Business Workflow Automation">Business Workflow Automation</option>
                </select>
              </div>

              <div className="p-3.5 bg-dark-850 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-200">Safe Dry Run Mode</div>
                  <div className="text-[11px] text-slate-400">Simulates message generation and queues without contacting live mailboxes</div>
                </div>
                <input
                  type="checkbox"
                  checked={isDryRun}
                  onChange={(e) => setIsDryRun(e.target.checked)}
                  className="w-4 h-4 accent-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-dark-800 hover:bg-dark-700 text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-dark-950 font-bold rounded-xl flex items-center gap-1.5"
                >
                  {creating && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  {creating ? 'Creating & Enrolling...' : 'Launch Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
