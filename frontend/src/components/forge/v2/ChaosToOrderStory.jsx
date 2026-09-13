import React, { useState } from 'react';
import { 
  AlertTriangle, CheckCircle2, Zap, ArrowRight, 
  Sparkles, RefreshCw, Flame, Clock, PhoneCall, Mail, FileText, Calendar 
} from 'lucide-react';
import { 
  ReceptionistCharacter, 
  LeadEngineCharacter, 
  DocumentCharacter, 
  EmailCharacter,
  AppointmentCharacter 
} from './ForgeCharacterUniverse';

export function ChaosToOrderStory({ onNavigate, onLaunchSandbox }) {
  const [isForgeActive, setIsForgeActive] = useState(true);

  return (
    <section className="py-20 sm:py-28 border-b border-slate-800/80 bg-[#060a12] relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold tracking-wider uppercase">
            <Flame className="w-3.5 h-3.5" /> THE BOTTLENECK TRANSFORMATION
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            YOUR BUSINESS GETS BUSY.
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            When volume spikes, manual operations break. Toggle FORGE to see how chaotic bottlenecks reorganize into streamlined autonomous pipelines.
          </p>
        </div>

        {/* Master Interactive Toggle */}
        <div className="flex items-center justify-center">
          <div className="p-1.5 bg-dark-950 border border-slate-800 rounded-2xl flex items-center gap-2 shadow-2xl font-mono text-xs">
            <button
              onClick={() => setIsForgeActive(false)}
              className={`px-5 py-2.5 rounded-xl font-bold transition-all ${
                !isForgeActive
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              WITHOUT FORGE (CHAOS)
            </button>

            <button
              onClick={() => setIsForgeActive(true)}
              className={`px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                isForgeActive
                  ? 'bg-teal-500 text-dark-950 font-black shadow-lg shadow-teal-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>WITH FORGE (ORGANIZED)</span>
            </button>
          </div>
        </div>

        {/* Visual Transformation Stage */}
        <div className="p-6 sm:p-10 rounded-3xl bg-[#090e18] border-2 transition-all duration-500 space-y-8 shadow-2xl"
          style={{ borderColor: isForgeActive ? '#14b8a6' : '#f43f5e' }}
        >
          {/* Status Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="flex items-center gap-3">
              <span className={`w-3.5 h-3.5 rounded-full animate-ping ${isForgeActive ? 'bg-teal-400' : 'bg-rose-500'}`} />
              <div>
                <div className="text-sm font-bold text-white font-sans">
                  {isForgeActive ? '⚡ FORGE AUTONOMOUS ORCHESTRATION ACTIVE' : '🚨 MANUAL OVERLOAD DETECTED'}
                </div>
                <div className="text-xs font-mono text-slate-400">
                  {isForgeActive ? '6 autonomous agents actively routing volume' : 'Human team overwhelmed by repetitive back-office tasks'}
                </div>
              </div>
            </div>

            <div className="text-xs font-mono px-3 py-1.5 rounded-xl bg-dark-950 border border-slate-800 text-slate-300">
              Operational Efficiency: <strong className={isForgeActive ? 'text-emerald-400' : 'text-rose-400'}>{isForgeActive ? '99.4%' : '34.2%'}</strong>
            </div>
          </div>

          {/* 4 Core Workflow Channels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            
            {/* Channel 1: Inbound Phone Calls */}
            <div className={`p-5 rounded-2xl border transition-all space-y-3 ${
              isForgeActive ? 'bg-cyan-950/20 border-cyan-500/40 text-cyan-300' : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-white font-sans">
                  <PhoneCall className="w-4 h-4 text-cyan-400" />
                  <span>Incoming Phone Calls</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                  isForgeActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {isForgeActive ? 'ANSWERED IN 2s' : 'MISSED / VOICEMAIL'}
                </span>
              </div>
              <p className="text-xs font-sans text-slate-300 leading-relaxed">
                {isForgeActive 
                  ? 'FORGE Receptionist triages caller, checks calendar, and locks consultation slot automatically.'
                  : 'Call rings after hours. Customer hangs up and calls a competitor.'}
              </p>
            </div>

            {/* Channel 2: Lead Inquiries */}
            <div className={`p-5 rounded-2xl border transition-all space-y-3 ${
              isForgeActive ? 'bg-amber-950/20 border-amber-500/40 text-amber-300' : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-white font-sans">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Website & Portal Leads</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                  isForgeActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {isForgeActive ? 'QUALIFIED IN 45s' : 'COLD (48H DELAY)'}
                </span>
              </div>
              <p className="text-xs font-sans text-slate-300 leading-relaxed">
                {isForgeActive 
                  ? 'FORGE Lead Engine scores 0-100 ICP fit and triggers 2-way SMS verification instantly.'
                  : 'Lead sits unread in CRM inbox until Monday morning.'}
              </p>
            </div>

            {/* Channel 3: Invoices & Documents */}
            <div className={`p-5 rounded-2xl border transition-all space-y-3 ${
              isForgeActive ? 'bg-purple-950/20 border-purple-500/40 text-purple-300' : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-white font-sans">
                  <FileText className="w-4 h-4 text-purple-400" />
                  <span>Vendor Invoices & Scans</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                  isForgeActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {isForgeActive ? 'AUTO OCR & VALIDATED' : 'MANUAL DATA ENTRY'}
                </span>
              </div>
              <p className="text-xs font-sans text-slate-300 leading-relaxed">
                {isForgeActive 
                  ? 'Document Engine parses line items, validates math checksum, and queues for 1-click ledger approval.'
                  : 'Staff spends 15 hours/week typing invoice totals into spreadsheets.'}
              </p>
            </div>

            {/* Channel 4: Support & Client Requests */}
            <div className={`p-5 rounded-2xl border transition-all space-y-3 ${
              isForgeActive ? 'bg-blue-950/20 border-blue-500/40 text-blue-300' : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-white font-sans">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span>Support Tickets & Emails</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                  isForgeActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {isForgeActive ? 'ZERO-HALLUCINATION RAG' : 'INBOX OVERLOAD'}
                </span>
              </div>
              <p className="text-xs font-sans text-slate-300 leading-relaxed">
                {isForgeActive 
                  ? 'FORGE Support answers FAQs with exact knowledge base citations and drafts personalized replies.'
                  : 'Customer waits 3 days for standard operating policy questions.'}
              </p>
            </div>

          </div>

          {/* Bottom CTA */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
            <span className="text-slate-400">
              Ready to eliminate operational friction in your company?
            </span>
            <button
              onClick={() => onNavigate && onNavigate('audit')}
              className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <span>GET FREE WORKFLOW AUDIT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
