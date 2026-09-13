import React, { useState, useEffect } from 'react';
import { 
  X, Play, Pause, RefreshCw, CheckCircle2, 
  ArrowRight, ShieldCheck, Sparkles, Terminal, Volume2, VolumeX 
} from 'lucide-react';

export const TEN_SECOND_DEMOS = {
  'receptionist-agent': {
    title: 'FORGE 24/7 AI Receptionist Demo',
    systemName: 'AI Voice & Web Receptionist',
    stages: [
      { time: '0.0s - 2.0s', phase: 'THE PROBLEM', label: 'MISSED AFTER-HOURS CALL', desc: 'Emergency dental inquiry at 10:14 PM with front desk closed.', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
      { time: '2.0s - 6.0s', phase: 'SYSTEM WORKING', label: 'VOICE NLP & INSURANCE VERIFICATION', desc: 'Agent verifies Delta Dental PPO coverage & checks Dr. Reynolds availability in 14ms.', color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
      { time: '6.0s - 9.0s', phase: 'THE OUTCOME', label: 'APPOINTMENT BOOKED & CALENDAR LOCKED', desc: 'Saturday 11:30 AM slot confirmed. SMS confirmation & intake forms sent to patient.', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
      { time: '9.0s - 10.0s', phase: 'DEPLOYMENT', label: 'FORGE PRODUCTION SYSTEM READY', desc: 'Zero missed after-hours surgical revenue.', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' }
    ]
  },
  'lead-agent': {
    title: 'FORGE Lead Engine Demo',
    systemName: 'Sub-60s Inbound Lead Qualifier',
    stages: [
      { time: '0.0s - 2.0s', phase: 'THE PROBLEM', label: 'PORTAL INQUIRY SITTING UNREAD', desc: 'High-value $1.4M buyer inquiry submitted on Zillow at 8:40 PM.', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
      { time: '2.0s - 6.0s', phase: 'SYSTEM WORKING', label: 'INTENT CLASSIFICATION & ICP SCORING', desc: 'Parses budget, JPMorgan pre-approval, and assigns 94/100 buyer score.', color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
      { time: '6.0s - 9.0s', phase: 'THE OUTCOME', label: 'VIP PRIVATE TOUR BOOKED IN 38s', desc: 'Automated 2-way SMS locks Saturday showing on Broker Google Calendar.', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
      { time: '9.0s - 10.0s', phase: 'DEPLOYMENT', label: 'FORGE PRODUCTION SYSTEM READY', desc: '3.4x higher tour conversion velocity.', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' }
    ]
  },
  'document-processor': {
    title: 'FORGE Document Engine Demo',
    systemName: 'Unstructured PDF & Invoice Parser',
    stages: [
      { time: '0.0s - 2.0s', phase: 'THE PROBLEM', label: 'MANUAL INVOICE DATA ENTRY', desc: 'Stack of 40 subcontractor PDF invoices awaiting manual re-typing into QuickBooks.', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
      { time: '2.0s - 6.0s', phase: 'SYSTEM WORKING', label: 'VISION OCR & MATHEMATICAL SUM CHECK', desc: 'Extracts 8 line items, checks PO #8831 math, and maps tax ID in 850ms.', color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
      { time: '6.0s - 9.0s', phase: 'THE OUTCOME', label: 'ACCOUNTING ERP SYNCED & VALIDATED', desc: 'Committed to QuickBooks AP with zero human manual data entry.', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
      { time: '9.0s - 10.0s', phase: 'DEPLOYMENT', label: 'FORGE PRODUCTION SYSTEM READY', desc: '85% reduction in back-office paperwork time.', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' }
    ]
  },
  'support-agent': {
    title: 'FORGE Support Agent Demo',
    systemName: 'Zero-Hallucination Knowledge RAG',
    stages: [
      { time: '0.0s - 2.0s', phase: 'THE PROBLEM', label: 'REPETITIVE CUSTOMER QUESTIONS', desc: 'Support desk answering the same pricing and warranty questions 50 times/day.', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
      { time: '2.0s - 6.0s', phase: 'SYSTEM WORKING', label: 'VECTOR RETRIEVAL (ZERO HALLUCINATION)', desc: 'Extracts exact paragraph citation from verified Master Agreement.', color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
      { time: '6.0s - 9.0s', phase: 'THE OUTCOME', label: 'INSTANT ACCURATE ANSWER DELIVERED', desc: 'Replies in 12ms with source citations and updates Zendesk ticket.', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
      { time: '9.0s - 10.0s', phase: 'DEPLOYMENT', label: 'FORGE PRODUCTION SYSTEM READY', desc: '24/7 customer satisfaction with zero added payroll.', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' }
    ]
  },
  'email-agent': {
    title: 'FORGE Email Agent Demo',
    systemName: 'Autonomous Inbox Classification & Drafts',
    stages: [
      { time: '0.0s - 2.0s', phase: 'THE PROBLEM', label: 'CHAOTIC INBOX OVERFLOW', desc: 'Hundreds of unread emails mixing leads, invoices, spam, and urgent tickets.', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
      { time: '2.0s - 6.0s', phase: 'SYSTEM WORKING', label: 'INTENT CLASSIFICATION & DRAFT SYNTHESIS', desc: 'Tags HOT LEAD, categorizes invoice, and synthesizes tailored reply.', color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
      { time: '6.0s - 9.0s', phase: 'THE OUTCOME', label: '1-CLICK HUMAN APPROVE & DISPATCH', desc: 'Operator reviews draft, clicks approve, and updates CRM deal stage.', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
      { time: '9.0s - 10.0s', phase: 'DEPLOYMENT', label: 'FORGE PRODUCTION SYSTEM READY', desc: 'Zero lost opportunities in overflowing inboxes.', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' }
    ]
  },
  'appointment-agent': {
    title: 'FORGE Appointment Agent Demo',
    systemName: 'Autonomous Calendar Scheduling',
    stages: [
      { time: '0.0s - 2.0s', phase: 'THE PROBLEM', label: '5-EMAIL SCHEDULING FRICTION', desc: 'Back-and-forth email tag coordinating prospective meeting dates.', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
      { time: '2.0s - 6.0s', phase: 'SYSTEM WORKING', label: 'REAL-TIME CALENDAR LOOKUP & CRITERIA', desc: 'Checks Google Calendar slots, validates timezones, and verifies attendee criteria.', color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
      { time: '6.0s - 9.0s', phase: 'THE OUTCOME', label: 'MEETING LOCKED & INVITE DISPATCHED', desc: 'Direct calendar invite dispatched with prep questions and automated reminder.', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
      { time: '9.0s - 10.0s', phase: 'DEPLOYMENT', label: 'FORGE PRODUCTION SYSTEM READY', desc: 'Zero booking drop-off.', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' }
    ]
  }
};

export function TenSecondDemoModal({ systemId, onClose, onTryLive }) {
  const demo = TEN_SECOND_DEMOS[systemId] || TEN_SECOND_DEMOS['receptionist-agent'];
  
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progressSec, setProgressSec] = useState(0);

  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgressSec(prev => {
          if (prev >= 10) {
            return 0; // loop
          }
          const next = prev + 0.5;
          if (next < 2.0) setCurrentStageIdx(0);
          else if (next < 6.0) setCurrentStageIdx(1);
          else if (next < 9.0) setCurrentStageIdx(2);
          else setCurrentStageIdx(3);
          return next;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const activeStage = demo.stages[currentStageIdx];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-sans animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#090e18] border border-teal-500/40 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-[#060a12] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 font-bold uppercase">
              10-SECOND SYSTEM DEMO
            </span>
            <div className="text-sm font-bold text-white">{demo.title}</div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-dark-900 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 10s Timeline Progress Bar */}
        <div className="w-full bg-dark-950 h-1.5 relative overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-teal-400 via-cyan-400 to-indigo-400 transition-all duration-300"
            style={{ width: `${(progressSec / 10) * 100}%` }}
          />
        </div>

        {/* Visual Skit Container */}
        <div className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col justify-between min-h-[300px] bg-[#070c14]">
          
          {/* Phase Badge & Timer */}
          <div className="flex items-center justify-between font-mono text-xs">
            <span className={`px-3 py-1 rounded-lg border font-bold text-xs ${activeStage.color}`}>
              {activeStage.phase} ({activeStage.time})
            </span>
            <span className="text-slate-400 font-mono text-xs font-bold">
              00:{Math.floor(progressSec).toString().padStart(2, '0')} / 00:10
            </span>
          </div>

          {/* Big Visual Simulation Card */}
          <div className="p-6 rounded-2xl bg-dark-950 border border-slate-800 space-y-3 font-mono text-center relative overflow-hidden">
            <div className="text-xs text-teal-400 font-bold uppercase tracking-wider">
              {demo.systemName}
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-sans">
              {activeStage.label}
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-lg mx-auto leading-relaxed">
              {activeStage.desc}
            </p>
          </div>

          {/* 4-Stage Markers Strip */}
          <div className="grid grid-cols-4 gap-2 font-mono text-[10px] text-center">
            {demo.stages.map((st, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg border transition-all ${
                  currentStageIdx === idx
                    ? 'border-teal-400 bg-teal-500/20 text-white font-bold'
                    : 'border-slate-850 bg-slate-900/60 text-slate-500'
                }`}
              >
                <div>0{idx + 1}</div>
                <div className="truncate">{st.phase}</div>
              </div>
            ))}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-[#060a12] border-t border-slate-800 flex items-center justify-between gap-4 font-mono text-xs">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1.5 bg-dark-900 text-slate-300 hover:text-white rounded-lg border border-slate-800 flex items-center gap-1.5"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            onClick={() => {
              onClose();
              if (onTryLive) onTryLive(systemId);
            }}
            className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl text-xs transition-all shadow-md flex items-center gap-1.5"
          >
            <span>TRY THIS SYSTEM LIVE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
