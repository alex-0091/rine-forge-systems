import React, { useState } from 'react';
import { 
  Sparkles, Layers, ArrowRight, Play, CheckCircle2, 
  Bot, PhoneCall, Zap, Search, MessageSquare, FileText, 
  Mail, Calendar, RefreshCw, Activity, ArrowUpRight, Check 
} from 'lucide-react';
import { 
  ReceptionistCharacter, 
  LeadEngineCharacter, 
  SupportCharacter, 
  DocumentCharacter, 
  EmailCharacter, 
  AppointmentCharacter,
  ForgeCoreMascot
} from './ForgeCharacterUniverse';

const WORKFORCE_AGENTS = [
  {
    id: 'receptionist',
    sysId: 'receptionist-agent',
    name: 'FORGE RECEPTIONIST',
    role: 'Voice & Call Concierge',
    Component: ReceptionistCharacter,
    tagline: 'Never miss a high-value customer call.',
    action: 'Inbound Call → Voice NLP → Availability Scan → Booking Confirmed',
    accent: 'border-cyan-500/50 text-cyan-400 bg-cyan-950/20 shadow-cyan-500/10'
  },
  {
    id: 'lead-engine',
    sysId: 'lead-agent',
    name: 'FORGE LEAD ENGINE',
    role: 'Speed-to-Lead Qualifier',
    Component: LeadEngineCharacter,
    tagline: 'Sub-60 second lead qualification & scoring.',
    action: 'Web Inquiry → Intent Analysis → 0-100 ICP Fit → 2-Way SMS Engage',
    accent: 'border-amber-500/50 text-amber-400 bg-amber-950/20 shadow-amber-500/10'
  },
  {
    id: 'support-agent',
    sysId: 'support-agent',
    name: 'FORGE SUPPORT AGENT',
    role: 'Zero-Hallucination RAG',
    Component: SupportCharacter,
    tagline: 'Instant customer resolution with source citations.',
    action: 'Customer FAQ → Private Vector Search → Verified Citation → Instant Answer',
    accent: 'border-blue-500/50 text-blue-400 bg-blue-950/20 shadow-blue-500/10'
  },
  {
    id: 'document-engine',
    sysId: 'document-processor',
    name: 'FORGE DOCUMENT ENGINE',
    role: 'Invoice & PO OCR Parser',
    Component: DocumentCharacter,
    tagline: 'Turn unstructured paperwork into verified ledger entries.',
    action: 'PDF / Scan → Line-Item OCR → Math Sum Verify → Accounting Export',
    accent: 'border-purple-500/50 text-purple-400 bg-purple-950/20 shadow-purple-500/10'
  },
  {
    id: 'email-agent',
    sysId: 'email-agent',
    name: 'FORGE EMAIL AGENT',
    role: 'Inbox Triage & Draft Assistant',
    Component: EmailCharacter,
    tagline: 'Triage email overload with 1-click human approval.',
    action: 'Inbox Stream → Category Triage → Contextual Draft → 1-Click Send',
    accent: 'border-emerald-500/50 text-emerald-400 bg-emerald-950/20 shadow-emerald-500/10'
  },
  {
    id: 'appointment-agent',
    sysId: 'appointment-agent',
    name: 'FORGE APPOINTMENT AGENT',
    role: 'Calendar Slot Scheduler',
    Component: AppointmentCharacter,
    tagline: 'Eliminate back-and-forth appointment scheduling.',
    action: 'Booking Intent → Provider Conflict Resolution → Calendar Lock → Reminder',
    accent: 'border-pink-500/50 text-pink-400 bg-pink-950/20 shadow-pink-500/10'
  }
];

export function ForgeWorkforceMap({ onNavigate, onLaunchSystemDemo, onWatchTenSecDemo }) {
  const [selectedAgent, setSelectedAgent] = useState(WORKFORCE_AGENTS[0]);
  const [activePacketFlow, setActivePacketFlow] = useState(true);

  return (
    <section className="py-20 sm:py-28 border-b border-slate-800/80 bg-[#070c14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-mono font-bold tracking-wider uppercase">
            <Layers className="w-3.5 h-3.5" /> MULTI-AGENT ORCHESTRATION
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            THE FORGE WORKFORCE
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Six specialized autonomous systems operating around the central FORGE intelligence core. Data flows seamlessly between them to eliminate business bottlenecks.
          </p>
        </div>

        {/* Central Workforce Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WORKFORCE_AGENTS.map((agent) => {
            const isSelected = selectedAgent.id === agent.id;
            const CharacterComp = agent.Component;

            return (
              <div
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`p-6 sm:p-7 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-6 ${
                  isSelected
                    ? `${agent.accent} scale-[1.02] shadow-2xl`
                    : 'bg-[#090e18] border-slate-800 hover:border-slate-700 hover:bg-[#0c1322]'
                }`}
              >
                {/* Character & Top Badge */}
                <div className="flex items-start justify-between">
                  <CharacterComp size="md" />
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-dark-950 border border-slate-700 font-bold text-slate-300">
                    {agent.role}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white tracking-tight font-sans">
                    {agent.name}
                  </h3>
                  <p className="text-xs text-slate-300 font-normal leading-relaxed">
                    {agent.tagline}
                  </p>
                  
                  {/* Step Action Chain */}
                  <div className="p-3 bg-dark-950/80 rounded-xl border border-slate-800/80 font-mono text-[11px] text-teal-300">
                    {agent.action}
                  </div>
                </div>

                {/* Action CTA Bar */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 font-mono text-xs">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onWatchTenSecDemo) onWatchTenSecDemo(agent.sysId);
                    }}
                    className="py-2.5 bg-dark-950 hover:bg-slate-850 text-slate-200 border border-slate-700 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Watch 10s</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onLaunchSystemDemo) onLaunchSystemDemo(agent.sysId);
                    }}
                    className="py-2.5 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl flex items-center justify-center gap-1 transition-all shadow-md"
                  >
                    <span>Try Live</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Central Core Connection Bar */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-950/40 via-dark-950 to-indigo-950/40 border border-teal-500/30 flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-xs">
          <div className="flex items-center gap-4">
            <ForgeCoreMascot state="idle" size="sm" />
            <div>
              <div className="text-sm font-bold text-white font-sans">FORGE Universal Bus Engine</div>
              <div className="text-[11px] text-teal-300">Unified Webhooks • Bi-directional CRM Sync • Zero Data Leakage</div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate && onNavigate('app-builder')}
              className="px-5 py-3 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl text-xs transition-all shadow-md flex items-center gap-1.5"
            >
              <span>BUILD CONNECTED PIPELINE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
