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
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-teal-500/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-mono font-black tracking-wider uppercase shadow-md">
            <Flame className="w-4 h-4 text-rose-400" /> THE BOTTLENECK TRANSFORMATION
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            YOUR BUSINESS GETS BUSY.
          </h2>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-medium">
            When volume spikes, manual operations break. Toggle FORGE to see how chaotic bottlenecks reorganize into streamlined autonomous pipelines.
          </p>
        </div>

        {/* Master Interactive Toggle */}
        <div className="flex items-center justify-center">
          <div className="p-2 bg-[#090e1a] border-2 border-slate-800 rounded-2xl flex items-center gap-2 shadow-2xl font-mono text-xs">
            <button
              onClick={() => setIsForgeActive(false)}
              className={`px-6 py-3 rounded-xl font-black transition-all ${
                !isForgeActive
                  ? 'bg-rose-500 text-white shadow-xl shadow-rose-500/40 scale-105'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🚨 WITHOUT FORGE (MANUAL CHAOS)
            </button>

            <button
              onClick={() => setIsForgeActive(true)}
              className={`px-6 py-3 rounded-xl font-black transition-all flex items-center gap-2 ${
                isForgeActive
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-400 text-dark-950 shadow-xl shadow-teal-500/40 scale-105'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>⚡ WITH FORGE (AUTONOMOUS ORDER)</span>
            </button>
          </div>
        </div>

        {/* Visual Transformation Stage */}
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-[#0a101f] to-[#060a12] border-2 transition-all duration-500 space-y-8 shadow-2xl"
          style={{ borderColor: isForgeActive ? '#14b8a6' : '#f43f5e' }}
        >
          {/* Status Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="flex items-center gap-3">
              <span className={`w-3.5 h-3.5 rounded-full animate-ping ${isForgeActive ? 'bg-teal-400' : 'bg-rose-500'}`} />
              <div>
                <div className="text-base font-black text-white font-sans">
                  {isForgeActive ? '⚡ FORGE AUTONOMOUS ORCHESTRATION ACTIVE' : '🚨 MANUAL OVERLOAD & REVENUE LEAKAGE'}
                </div>
                <div className="text-xs font-mono text-slate-300">
                  {isForgeActive ? '6 autonomous agents actively executing work 24/7' : 'Human team overwhelmed by repetitive back-office tasks'}
                </div>
              </div>
            </div>

            <div className="text-xs font-mono px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-bold shadow">
              Operational Efficiency: <strong className={isForgeActive ? 'text-emerald-400 text-sm' : 'text-rose-400 text-sm'}>{isForgeActive ? '99.4%' : '34.2%'}</strong>
            </div>
          </div>

          {/* 4 Core Workflow Channels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            
            {/* Channel 1: Inbound Phone Calls */}
            <div className={`p-6 rounded-3xl border-2 transition-all duration-300 space-y-4 ${
              isForgeActive ? 'bg-gradient-to-br from-cyan-950/40 via-dark-950 to-[#0c1626] border-cyan-400/60 shadow-lg shadow-cyan-500/10' : 'bg-gradient-to-br from-rose-950/40 via-dark-950 to-[#1f0a12] border-rose-500/60'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 font-black text-base text-white font-sans">
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <span>Inbound Phone Calls</span>
                </div>
                <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider ${
                  isForgeActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}>
                  {isForgeActive ? 'ANSWERED IN 2s' : 'MISSED / VOICEMAIL'}
                </span>
              </div>
              
              <div className="flex items-center gap-4 pt-1">
                {isForgeActive && <ReceptionistCharacter size="sm" />}
                <p className="text-xs font-sans text-slate-200 leading-relaxed font-medium">
                  {isForgeActive 
                    ? 'FORGE Receptionist triages caller intent with sub-voice NLP, verifies insurance schedules, and locks consultation slots instantly.'
                    : 'Phone rings after hours or while staff is busy. Customer hangs up and calls your direct local competitor.'}
                </p>
              </div>
            </div>

            {/* Channel 2: Lead Inquiries */}
            <div className={`p-6 rounded-3xl border-2 transition-all duration-300 space-y-4 ${
              isForgeActive ? 'bg-gradient-to-br from-amber-950/40 via-dark-950 to-[#1f160a] border-amber-400/60 shadow-lg shadow-amber-500/10' : 'bg-gradient-to-br from-rose-950/40 via-dark-950 to-[#1f0a12] border-rose-500/60'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 font-black text-base text-white font-sans">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/40">
                    <Zap className="w-5 h-5" />
                  </div>
                  <span>Website & Portal Leads</span>
                </div>
                <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider ${
                  isForgeActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}>
                  {isForgeActive ? 'QUALIFIED IN 45s' : 'COLD (48H DELAY)'}
                </span>
              </div>
              
              <div className="flex items-center gap-4 pt-1">
                {isForgeActive && <LeadEngineCharacter size="sm" />}
                <p className="text-xs font-sans text-slate-200 leading-relaxed font-medium">
                  {isForgeActive 
                    ? 'FORGE Lead Engine scores 0-100 ICP fit in 800ms and fires automated 2-way SMS questionnaires to close appointments fast.'
                    : 'High-intent buyer submits website form. Inquiry sits unread in email inbox until the next business day.'}
                </p>
              </div>
            </div>

            {/* Channel 3: Invoices & Documents */}
            <div className={`p-6 rounded-3xl border-2 transition-all duration-300 space-y-4 ${
              isForgeActive ? 'bg-gradient-to-br from-purple-950/40 via-dark-950 to-[#1b0a24] border-purple-400/60 shadow-lg shadow-purple-500/10' : 'bg-gradient-to-br from-rose-950/40 via-dark-950 to-[#1f0a12] border-rose-500/60'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 font-black text-base text-white font-sans">
                  <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/40">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span>Vendor Invoices & Scans</span>
                </div>
                <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider ${
                  isForgeActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}>
                  {isForgeActive ? 'AUTO OCR & BALANCED' : 'MANUAL DATA ENTRY'}
                </span>
              </div>
              
              <div className="flex items-center gap-4 pt-1">
                {isForgeActive && <DocumentCharacter size="sm" />}
                <p className="text-xs font-sans text-slate-200 leading-relaxed font-medium">
                  {isForgeActive 
                    ? 'Document Engine optical OCR extracts line items, validates tax checksums, and syncs directly to QuickBooks in seconds.'
                    : 'Office staff spends 15+ hours per week manually re-typing invoice figures into spreadsheets with frequent human math errors.'}
                </p>
              </div>
            </div>

            {/* Channel 4: Support & Client Requests */}
            <div className={`p-6 rounded-3xl border-2 transition-all duration-300 space-y-4 ${
              isForgeActive ? 'bg-gradient-to-br from-blue-950/40 via-dark-950 to-[#0a1224] border-blue-400/60 shadow-lg shadow-blue-500/10' : 'bg-gradient-to-br from-rose-950/40 via-dark-950 to-[#1f0a12] border-rose-500/60'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 font-black text-base text-white font-sans">
                  <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/40">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span>Support Tickets & Emails</span>
                </div>
                <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider ${
                  isForgeActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}>
                  {isForgeActive ? 'ZERO-HALLUCINATION RAG' : 'INBOX OVERLOAD'}
                </span>
              </div>
              
              <div className="flex items-center gap-4 pt-1">
                {isForgeActive && <EmailCharacter size="sm" />}
                <p className="text-xs font-sans text-slate-200 leading-relaxed font-medium">
                  {isForgeActive 
                    ? 'FORGE Support answers FAQs with exact policy citations, and Email Agent drafts 1-click approvals for high-priority tickets.'
                    : 'Clients wait 3–4 days for basic status checks while tickets pile up in unorganized customer service queues.'}
                </p>
              </div>
            </div>

          </div>

          {/* Bottom CTA */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
            <span className="text-slate-300 font-bold">
              Ready to eliminate back-office friction and deploy autonomous order?
            </span>
            <button
              onClick={() => onNavigate && onNavigate('audit')}
              className="px-6 py-3.5 bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-dark-950 font-black rounded-xl transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2 hover:scale-105"
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
