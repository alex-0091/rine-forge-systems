import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, ShieldAlert, Trash2, Plus, RefreshCw, 
  History, Globe, Lock, AlertOctagon
} from 'lucide-react';

export function ComplianceView() {
  const [policies, setPolicies] = useState([]);
  const [suppressionList, setSuppressionList] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Suppression Form
  const [newValue, setNewValue] = useState('');
  const [newType, setNewType] = useState('EMAIL');
  const [newReason, setNewReason] = useState('MANUAL');
  const [adding, setAdding] = useState(false);

  const fetchComplianceData = async () => {
    try {
      setLoading(true);
      const [pRes, sRes, aRes] = await Promise.all([
        fetch('/api/compliance/policies'),
        fetch('/api/compliance/suppression'),
        fetch('/api/compliance/audit-logs?limit=40')
      ]);
      setPolicies(await pRes.json());
      setSuppressionList(await sRes.json());
      setAuditLogs(await aRes.json());
    } catch (e) {
      console.error("Compliance fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplianceData();
  }, []);

  const handleAddSuppression = async (e) => {
    e.preventDefault();
    if (!newValue.trim()) return;
    try {
      setAdding(true);
      const res = await fetch('/api/compliance/suppression', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          value: newValue.trim(),
          entry_type: newType,
          reason: newReason
        })
      });
      await res.json();
      setNewValue('');
      await fetchComplianceData();
    } catch (e) {
      console.error("Add suppression error:", e);
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveSuppression = async (id) => {
    try {
      await fetch(`/api/compliance/suppression/${id}`, { method: 'DELETE' });
      await fetchComplianceData();
    } catch (e) {
      console.error("Remove suppression error:", e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-dark-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Compliance Matrix & Suppression Controls</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Jurisdictional commercial email policies, permanent suppression enforcement, and audit logs
          </p>
        </div>

        <button
          onClick={fetchComplianceData}
          className="p-2.5 bg-dark-850 hover:bg-dark-800 text-slate-300 border border-slate-700 rounded-xl transition-all self-start md:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Country Policy Table */}
      <div className="bg-dark-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <Globe className="w-4 h-4 text-teal-400" /> Active Jurisdictional Policy Engine
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold bg-dark-850/50">
                <th className="p-3 pl-4">Jurisdiction</th>
                <th className="p-3">Cold B2B Permitted</th>
                <th className="p-3">Physical Postal Address</th>
                <th className="p-3">Opt-Out Link</th>
                <th className="p-3 pr-4">Prior Consent Mode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {policies.map((p, i) => (
                <tr key={i} className="hover:bg-dark-850/40">
                  <td className="p-3 pl-4 font-semibold text-white">{p.country}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.cold_b2b_allowed ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {p.cold_b2b_allowed ? 'ALLOWED' : 'RESTRICTED / PAUSED'}
                    </span>
                  </td>
                  <td className="p-3 text-slate-300">{p.requires_physical_address ? 'Enforced' : 'Optional'}</td>
                  <td className="p-3 text-slate-300">{p.requires_optout_link ? 'Mandatory' : 'Optional'}</td>
                  <td className="p-3 pr-4 text-slate-400 font-mono">{p.requires_prior_consent ? 'Express / Strict' : 'Opt-Out Regime'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Suppression System */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Add Suppression */}
        <div className="lg:col-span-4 bg-dark-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Lock className="w-4 h-4 text-rose-400" /> Add to Suppression List
          </h3>
          <p className="text-xs text-slate-400">
            Suppressed addresses, domains, or companies are permanently blocked from receiving outreach.
          </p>

          <form onSubmit={handleAddSuppression} className="space-y-3 text-xs">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Entry Type</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="w-full p-2.5 bg-dark-850 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-teal-500"
              >
                <option value="EMAIL">Email Address</option>
                <option value="DOMAIN">Entire Domain (e.g. badcompany.com)</option>
                <option value="COMPANY">Company Name</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Target Value</label>
              <input
                type="text"
                placeholder="e.g. user@domain.com or spamcorp.com"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="w-full p-2.5 bg-dark-850 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-teal-500"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Suppression Reason</label>
              <select
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                className="w-full p-2.5 bg-dark-850 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-teal-500"
              >
                <option value="USER_OPTOUT">User Requested Opt-Out / Unsubscribe</option>
                <option value="HARD_BOUNCE">Hard Bounce / Invalid Mailbox</option>
                <option value="COMPLAINT">Spam Complaint</option>
                <option value="MANUAL">Manual Administrative Decision</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={adding}
              className="w-full py-2.5 bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Block & Suppress Permanently
            </button>
          </form>
        </div>

        {/* Right: Suppression Table */}
        <div className="lg:col-span-8 bg-dark-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Active Suppressed Entries ({suppressionList.length})</h3>
          </div>

          <div className="overflow-x-auto max-h-[300px]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold bg-dark-850/50">
                  <th className="p-3 pl-4">Type</th>
                  <th className="p-3">Value</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Source</th>
                  <th className="p-3 text-right pr-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {suppressionList.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-6 text-center text-slate-500">
                      Suppression list is currently empty.
                    </td>
                  </tr>
                ) : (
                  suppressionList.map((entry) => (
                    <tr key={entry.id} className="hover:bg-dark-850/40">
                      <td className="p-3 pl-4 font-mono text-[10px] text-teal-400">{entry.entry_type}</td>
                      <td className="p-3 font-medium text-slate-200">{entry.value}</td>
                      <td className="p-3 text-slate-400">{entry.reason}</td>
                      <td className="p-3 text-slate-500 text-[10px]">{entry.source}</td>
                      <td className="p-3 text-right pr-4">
                        <button
                          onClick={() => handleRemoveSuppression(entry.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                          title="Remove Suppression"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* System Audit Logs */}
      <div className="bg-dark-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <History className="w-4 h-4 text-purple-400" /> Real-time System Audit & Execution Logs
        </h3>
        <div className="overflow-y-auto max-h-[300px] divide-y divide-slate-800/60 text-xs font-mono">
          {auditLogs.map((log) => (
            <div key={log.id} className="py-2.5 flex items-center justify-between text-slate-400">
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-slate-500">{new Date(log.created_at).toLocaleTimeString()}</span>
                <span className="text-teal-400 font-semibold text-[11px]">{log.event_type}</span>
                <span className="text-slate-300 text-xs font-sans">{log.description}</span>
              </div>
              {log.cost_usd !== null && (
                <span className="text-emerald-400 text-[11px] font-bold">${log.cost_usd.toFixed(5)}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
