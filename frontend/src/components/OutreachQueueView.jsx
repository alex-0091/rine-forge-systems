import React, { useState, useEffect } from 'react';
import { 
  Send, CheckCircle, XCircle, Edit3, Eye, 
  RefreshCw, ShieldCheck, Sparkles, Filter, Check
} from 'lucide-react';

export function OutreachQueueView() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [editSubject, setEditSubject] = useState('');
  const [editBody, setEditBody] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      let url = '/api/outreach/queue?limit=50';
      if (statusFilter) url += `&status=${statusFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (e) {
      console.error("Failed to fetch outreach queue:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, [statusFilter]);

  const openEditModal = (msg) => {
    setSelectedMessage(msg);
    setEditSubject(msg.subject);
    setEditBody(msg.body_full);
  };

  const handleMessageAction = async (messageId, action, overrideSubject = null, overrideBody = null) => {
    try {
      setActionLoadingId(messageId);
      const res = await fetch('/api/outreach/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message_id: messageId,
          action: action,
          edited_subject: overrideSubject,
          edited_body: overrideBody
        })
      });
      await res.json();
      await fetchQueue();
      setSelectedMessage(null);
    } catch (e) {
      console.error("Action error:", e);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleBatchSend = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/outreach/batch-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: 10 })
      });
      const data = await res.json();
      alert(`Batch completed: ${data.dispatched_count} messages sent successfully in Dry-Run mode.`);
      await fetchQueue();
    } catch (e) {
      console.error("Batch send error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-dark-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Outreach Dispatch Queue & Manual Gate</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Inspect AI-generated personalized hooks, edit wording, approve drafts, and trigger controlled dispatch
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2.5 bg-dark-850 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="QUEUED">Queued / Ready</option>
            <option value="APPROVED">Approved</option>
            <option value="SENT">Sent</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <button
            onClick={handleBatchSend}
            className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-dark-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2"
          >
            <Send className="w-3.5 h-3.5" /> Dispatch Batch (Dry Run)
          </button>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-dark-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400 bg-dark-850/50">
                <th className="p-4 pl-6">Recipient & Business</th>
                <th className="p-4">Subject Line</th>
                <th className="p-4">Personalized Hook</th>
                <th className="p-4">Quality & Policy</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-6">Review & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {messages.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">
                    No messages in outreach queue. Enroll qualified leads in a campaign to generate personalized outreach.
                  </td>
                </tr>
              ) : (
                messages.map((m) => (
                  <tr key={m.id} className="hover:bg-dark-850/50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="font-semibold text-white">{m.recipient_name}</div>
                      <div className="text-xs text-slate-400">{m.recipient_email}</div>
                      <div className="text-[11px] text-teal-400 mt-0.5">{m.business_name} ({m.business_country})</div>
                    </td>
                    <td className="p-4 max-w-[220px]">
                      <div className="font-medium text-slate-200 text-xs truncate">{m.subject}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">Touchpoint Step {m.step_number}</div>
                    </td>
                    <td className="p-4 text-xs text-slate-300 max-w-[260px]">
                      <p className="line-clamp-2 italic text-slate-400">"{m.personalized_hook}"</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 bg-dark-800 text-teal-400 border border-teal-500/20 rounded text-xs font-mono font-semibold">
                          {m.quality_score}/100
                        </span>
                        {m.compliance_passed && (
                          <span className="p-1 text-emerald-400" title="CAN-SPAM & Compliance Passed">
                            <ShieldCheck className="w-4 h-4" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        m.status === 'SENT' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        m.status === 'QUEUED' ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' :
                        m.status === 'APPROVED' ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' :
                        'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="p-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(m)}
                          className="p-1.5 bg-dark-800 hover:bg-dark-700 text-slate-300 rounded-lg text-xs transition-all"
                          title="Inspect & Edit Draft"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {m.status !== 'SENT' && (
                          <>
                            <button
                              onClick={() => handleMessageAction(m.id, 'APPROVE')}
                              className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs transition-all"
                              title="Approve Message"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleMessageAction(m.id, 'SEND_NOW')}
                              disabled={actionLoadingId === m.id}
                              className="px-2.5 py-1.5 bg-teal-500 hover:bg-teal-400 text-dark-950 font-semibold rounded-lg text-xs transition-all flex items-center gap-1"
                              title="Dispatch Now (Dry-Run)"
                            >
                              {actionLoadingId === m.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                              Send
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Review & Edit Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 bg-dark-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-dark-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Review & Edit Personalized Outreach</h3>
                <p className="text-xs text-slate-400 mt-0.5">To: {selectedMessage.recipient_name} &lt;{selectedMessage.recipient_email}&gt;</p>
              </div>
              <button onClick={() => setSelectedMessage(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Subject Line</label>
                <input
                  type="text"
                  value={editSubject}
                  onChange={(e) => setEditSubject(e.target.value)}
                  className="w-full p-2.5 bg-dark-850 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-teal-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Email Body</label>
                <textarea
                  rows={9}
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  className="w-full p-3 bg-dark-850 border border-slate-800 rounded-xl text-slate-200 leading-relaxed focus:outline-none focus:border-teal-500 font-sans"
                />
              </div>

              <div className="p-3 bg-dark-850 border border-slate-800 rounded-xl text-slate-400 text-[11px] space-y-1">
                <div><strong className="text-slate-300">Grounded Hook:</strong> {selectedMessage.personalized_hook}</div>
                <div><strong className="text-slate-300">Compliance Standard:</strong> CAN-SPAM Footer & Unsubscribe Link Included</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => handleMessageAction(selectedMessage.id, 'REJECT')}
                className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-semibold"
              >
                Reject & Cancel
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMessage(null)}
                  className="px-4 py-2 bg-dark-800 hover:bg-dark-700 text-slate-300 rounded-xl text-xs font-medium"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => handleMessageAction(selectedMessage.id, 'APPROVE', editSubject, editBody)}
                  className="px-5 py-2 bg-teal-500 hover:bg-teal-400 text-dark-950 font-bold rounded-xl text-xs flex items-center gap-1.5"
                >
                  Save & Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
