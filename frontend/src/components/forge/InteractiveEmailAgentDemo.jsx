import React, { useState } from 'react';
import { 
  Mail, Send, CheckCircle2, ShieldCheck, 
  ArrowRight, RefreshCw, X, AlertTriangle, User, Clock 
} from 'lucide-react';

const SAMPLE_EMAILS = [
  {
    id: 'msg-1',
    sender: 'David Miller <david.miller@apexcapital.co>',
    subject: 'Request for preliminary enterprise pilot quote',
    timestamp: '09:42 AM',
    tag: 'HOT LEAD',
    tagColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    body: 'Hi Alex, we run a commercial logistics fleet across Texas and are losing too much time on paper bills of lading. Looking to scope a 14-day pilot for our 8 dispatchers.',
    analysis: {
      intent: 'Commercial Pilot & Pricing Inquiry',
      urgency: 'HIGH_PRIORITY (Decision Maker)',
      suggestedAction: 'Dispatch 14-day logistics pilot overview & calendar link',
      draftReply: 'Hi David,\n\nThanks for reaching out. We recently engineered a similar Bill of Lading OCR dispatch pipeline that cut manual paperwork by 85% for Texas regional logistics.\n\nHere is our direct calendar to lock in a 20-minute architecture review: https://cal.com/forge/arch-review\n\nBest regards,\nFORGE Systems Team'
    }
  },
  {
    id: 'msg-2',
    sender: 'Accounting Team <ap@quicksupply.com>',
    subject: 'Vendor Invoice #INV-9902 Attached',
    timestamp: '09:15 AM',
    tag: 'INVOICE',
    tagColor: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    body: 'Please find attached invoice #INV-9902 for $3,200.00 for server rack equipment delivered on Friday.',
    analysis: {
      intent: 'Vendor Invoice Commit',
      urgency: 'STANDARD_ACCOUNTS_PAYABLE',
      suggestedAction: 'Route to FORGE Document Engine for OCR verification & QuickBooks sync',
      draftReply: 'Hi QuickSupply AP,\n\nInvoice #INV-9902 ($3,200.00) has been extracted and matched against PO #4091. Scheduled for net-30 disbursement.\n\nThank you,\nFORGE Finance'
    }
  },
  {
    id: 'msg-3',
    sender: 'Elena Rostova <elena@bioclinic.org>',
    subject: 'Need to reschedule consultation to Friday 2 PM',
    timestamp: '08:50 AM',
    tag: 'APPOINTMENT',
    tagColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    body: 'Hi! Could we move our healthcare intake system demo from Thursday morning to Friday at 2:00 PM?',
    analysis: {
      intent: 'Calendar Reschedule Request',
      urgency: 'CONFIRMED_SLOT_AVAILABLE',
      suggestedAction: 'Check Google Calendar & update slot invitation',
      draftReply: 'Hi Elena,\n\nFriday at 2:00 PM is open on our senior architect schedule. Updated calendar invite dispatched to your inbox.\n\nBest,\nFORGE Scheduling'
    }
  }
];

export function InteractiveEmailAgentDemo({ onNavigate }) {
  const [selectedMsgId, setSelectedMsgId] = useState('msg-1');
  const [emails, setEmails] = useState(SAMPLE_EMAILS);
  const [approvedList, setApprovedList] = useState([]);
  const [isSending, setIsSending] = useState(false);

  const activeEmail = emails.find(m => m.id === selectedMsgId) || emails[0];
  const isApproved = approvedList.includes(activeEmail.id);

  const handleApprove = (id) => {
    setIsSending(true);
    setTimeout(() => {
      setApprovedList(prev => [...prev, id]);
      setIsSending(false);
    }, 600);
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#080d16] border border-teal-500/30 shadow-2xl space-y-6 font-mono text-xs text-slate-100">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 font-bold uppercase">
            FORGE EMAIL AGENT • LIVE INBOX SIMULATOR
          </span>
          <h3 className="text-lg font-bold text-white pt-1">Automated Inbox Triage & 1-Click Approval</h3>
        </div>
        <span className="text-emerald-400 text-[10px] font-bold">● SIMULATED INBOX (SANDBOX)</span>
      </div>

      {/* Inbox Layout: Messages List (4 cols) & Message Detail / Draft (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Inbox List (5 cols) */}
        <div className="lg:col-span-5 space-y-2">
          <div className="text-[10px] text-slate-500 uppercase font-bold pb-1">Incoming Inbox Messages</div>
          {emails.map((msg) => {
            const isSelected = selectedMsgId === msg.id;
            const isSent = approvedList.includes(msg.id);
            return (
              <div
                key={msg.id}
                onClick={() => setSelectedMsgId(msg.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-1.5 ${
                  isSelected
                    ? 'border-teal-400 bg-[#0d1626] shadow-md'
                    : 'border-slate-800 bg-[#090e18] hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-white font-bold truncate max-w-[140px]">{msg.sender.split('<')[0]}</span>
                  <span className="text-slate-500">{msg.timestamp}</span>
                </div>
                <div className="text-slate-300 font-bold text-[11px] truncate font-sans">{msg.subject}</div>
                <div className="flex items-center justify-between pt-1">
                  <span className={`text-[9px] px-2 py-0.5 rounded border font-bold ${msg.tagColor}`}>
                    {msg.tag}
                  </span>
                  {isSent && (
                    <span className="text-emerald-400 font-bold text-[9px] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> DISPATCHED
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Message Analysis & Draft Action Pane (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-dark-950 border border-slate-800 space-y-4">
          
          {/* Email Body Snippet */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-850 space-y-1">
            <div className="text-[10px] text-slate-400 font-bold">FROM: {activeEmail.sender}</div>
            <div className="text-white font-bold text-xs font-sans">{activeEmail.subject}</div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed pt-1">{activeEmail.body}</p>
          </div>

          {/* AI Intent & Analysis */}
          <div className="p-3.5 rounded-xl bg-[#090f1c] border border-teal-500/20 space-y-1.5 text-[11px]">
            <div className="text-teal-400 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> FORGE AI REASONING
            </div>
            <div><strong className="text-slate-300">Intent:</strong> {activeEmail.analysis.intent}</div>
            <div><strong className="text-slate-300">Recommended Action:</strong> {activeEmail.analysis.suggestedAction}</div>
          </div>

          {/* Synthesized Response Draft */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400">SYNTHESIZED DRAFT REPLY (HUMAN OVERSIGHT)</label>
            <textarea
              rows={4}
              readOnly
              value={activeEmail.analysis.draftReply}
              className="w-full bg-[#060a12] border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono leading-relaxed"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-1">
            {isApproved ? (
              <div className="text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>APPROVED & DISPATCHED TO RECIPIENT</span>
              </div>
            ) : (
              <button
                onClick={() => handleApprove(activeEmail.id)}
                disabled={isSending}
                className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl text-xs font-mono transition-all shadow-md flex items-center gap-2"
              >
                {isSending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>APPROVE & SEND (1-CLICK)</span>
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
