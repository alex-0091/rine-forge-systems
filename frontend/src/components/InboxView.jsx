import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, AlertTriangle, CheckCircle, Send, 
  Sparkles, RefreshCw, UserCheck, ShieldAlert, CornerDownLeft, Play
} from 'lucide-react';

export function InboxView() {
  const [conversations, setConversations] = useState([]);
  const [selectedConvId, setSelectedConvId] = useState(null);
  const [threadData, setThreadData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  // Simulation Tool State
  const [simEmail, setSimEmail] = useState('dr.sarah@biscayne-dental-demo.com');
  const [simBody, setSimBody] = useState('Sounds very interesting. How much does the AI receptionist cost per month to install for our clinic?');
  const [simulating, setSimulating] = useState(false);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/inbox/conversations');
      const data = await res.json();
      setConversations(data);
      if (data.length > 0 && !selectedConvId) {
        setSelectedConvId(data[0].id);
      }
    } catch (e) {
      console.error("Failed to load conversations:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchThread = async (id) => {
    try {
      const res = await fetch(`/api/inbox/conversations/${id}`);
      const data = await res.json();
      setThreadData(data);
      
      // Auto-populate latest suggested response if available
      const lastInbound = data.replies?.filter(r => r.direction === 'INBOUND').pop();
      if (lastInbound && lastInbound.suggested_reply) {
        setReplyText(lastInbound.suggested_reply);
      }
    } catch (e) {
      console.error("Failed to load thread:", e);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConvId) {
      fetchThread(selectedConvId);
    }
  }, [selectedConvId]);

  const handleSimulateReply = async (presetText = null) => {
    const textToSend = presetText || simBody;
    try {
      setSimulating(true);
      const res = await fetch('/api/inbox/simulate-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_email: simEmail,
          subject: "re: quick question regarding inquiries",
          body_text: textToSend
        })
      });
      const data = await res.json();
      await fetchConversations();
      if (data.conversation_id) {
        setSelectedConvId(data.conversation_id);
      }
    } catch (e) {
      console.error("Simulation error:", e);
    } finally {
      setSimulating(false);
    }
  };

  const handleSendResponse = async () => {
    if (!replyText.trim() || !selectedConvId) return;
    try {
      setSendingReply(true);
      const res = await fetch('/api/inbox/send-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: selectedConvId,
          reply_body: replyText
        })
      });
      await res.json();
      setReplyText('');
      await fetchThread(selectedConvId);
      await fetchConversations();
    } catch (e) {
      console.error("Send response error:", e);
    } finally {
      setSendingReply(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Simulator Bar */}
      <div className="bg-dark-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Unified Reply Monitor & Escalation Center</h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Gemini classifies inbound sentiment & intent, drafts suggested replies, and alerts Owais for high-intent deals
            </p>
          </div>

          <button
            onClick={fetchConversations}
            className="p-2.5 bg-dark-850 hover:bg-dark-800 text-slate-300 border border-slate-700 rounded-xl transition-all self-start md:self-auto"
            title="Refresh Inbound Messages"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Reply Simulation Presets Box */}
        <div className="p-4 bg-dark-850 border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5" /> Inbound Simulation Lab (Test Gemini Intent Engine)
            </span>
            <span className="text-[11px] text-slate-400">Simulate incoming prospect email</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={() => handleSimulateReply("We're interested in the AI receptionist. How much does something like this cost?")}
              disabled={simulating}
              className="px-3 py-1.5 bg-dark-800 hover:bg-dark-700 border border-slate-700 rounded-lg text-xs text-slate-200 transition-all"
            >
              "How much does it cost?" (Price Request)
            </button>
            <button
              onClick={() => handleSimulateReply("We love this! We want to hire you for a $10,000 enterprise custom automation.")}
              disabled={simulating}
              className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-semibold transition-all"
            >
              "$10k Enterprise Deal" (High Value)
            </button>
            <button
              onClick={() => handleSimulateReply("Can we schedule a 15-minute call this Thursday to see a live demo?")}
              disabled={simulating}
              className="px-3 py-1.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-lg text-xs font-semibold transition-all"
            >
              "Schedule Call" (Meeting Request)
            </button>
            <button
              onClick={() => handleSimulateReply("Please stop emailing me. Remove me from your mailing list immediately.")}
              disabled={simulating}
              className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg text-xs transition-all"
            >
              "Unsubscribe / Stop" (Opt-out)
            </button>
          </div>
        </div>
      </div>

      {/* Main Inbox 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[550px]">
        {/* Left Column: Conversations List */}
        <div className="lg:col-span-5 bg-dark-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-800 bg-dark-850/50 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span>Conversations ({conversations.length})</span>
          </div>

          <div className="divide-y divide-slate-800/60 overflow-y-auto flex-1">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No active conversations yet. Use the simulation lab above to test an inbound reply.
              </div>
            ) : (
              conversations.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedConvId(c.id)}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedConvId === c.id ? 'bg-dark-850 border-l-4 border-teal-500' : 'hover:bg-dark-850/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="font-semibold text-white text-xs">{c.business_name}</div>
                    {c.requires_human_action && (
                      <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded text-[10px] font-bold animate-pulse">
                        ACTION REQUIRED
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">{c.contact_email}</div>
                  
                  <div className="mt-2 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-dark-800 text-teal-400 border border-teal-500/20 rounded text-[10px] font-mono">
                      {c.latest_intent_classification || 'QUESTION'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Score: {c.latest_intent_score || 50}/100</span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 mt-2 italic">
                    "{c.latest_message_snippet}"
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Thread & Reply Assistant */}
        <div className="lg:col-span-7 bg-dark-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
          {threadData ? (
            <div className="flex flex-col h-full">
              {/* Thread Header */}
              <div className="p-4 border-b border-slate-800 bg-dark-850 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm">{threadData.business_name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{threadData.contact_email}</p>
                </div>
                {threadData.requires_human_action && (
                  <span className="px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> OWAIS: HUMAN ACTION REQUIRED
                  </span>
                )}
              </div>

              {/* Messages Flow */}
              <div className="p-6 overflow-y-auto space-y-4 flex-1">
                {threadData.replies?.map((r) => (
                  <div
                    key={r.id}
                    className={`p-4 rounded-2xl text-xs leading-relaxed max-w-[85%] ${
                      r.direction === 'INBOUND'
                        ? 'bg-dark-850 border border-slate-800 text-slate-200 mr-auto'
                        : 'bg-teal-500/10 border border-teal-500/30 text-teal-100 ml-auto'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2">
                      <span className="font-semibold text-slate-300">
                        {r.direction === 'INBOUND' ? r.sender_email : 'Owais (Owais AI)'}
                      </span>
                      {r.classification && (
                        <span className="px-2 py-0.5 bg-dark-900 rounded text-teal-400 font-mono">
                          {r.classification}
                        </span>
                      )}
                    </div>
                    <p className="whitespace-pre-wrap font-sans">{r.raw_body}</p>
                  </div>
                ))}
              </div>

              {/* Suggested Reply & Composer */}
              <div className="p-4 border-t border-slate-800 bg-dark-850/60 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-teal-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Gemini Suggested Response (Editable)
                  </span>
                  <span className="text-[11px] text-slate-400">Strictly adheres to no unauthorized pricing policy</span>
                </div>

                <textarea
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your response to prospect..."
                  className="w-full p-3 bg-dark-900 border border-slate-800 rounded-xl text-slate-200 text-xs leading-relaxed focus:outline-none focus:border-teal-500 font-sans"
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500">
                    Signing off as: <strong className="text-slate-400">Owais, Founder (owais-ai.com)</strong>
                  </span>
                  <button
                    onClick={handleSendResponse}
                    disabled={sendingReply || !replyText.trim()}
                    className="px-5 py-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-dark-950 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-teal-500/20"
                  >
                    {sendingReply ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    {sendingReply ? 'Sending...' : 'Send Response'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500 text-xs p-8">
              Select a conversation thread on the left to review messages and suggested responses.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
