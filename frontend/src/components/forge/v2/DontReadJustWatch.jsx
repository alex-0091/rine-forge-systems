import React, { useState } from 'react';
import { 
  Sparkles, Play, ArrowRight, CheckCircle2, 
  Bot, Zap, FileText, Mail, Calendar, MessageSquare, ShieldCheck 
} from 'lucide-react';
import { ForgeDemoVideoPlayer } from './ForgeDemoVideoPlayer';
import { 
  ReceptionistCharacter, 
  LeadEngineCharacter, 
  SupportCharacter, 
  DocumentCharacter, 
  EmailCharacter, 
  AppointmentCharacter 
} from './ForgeCharacterUniverse';

const DEMO_SKITS = [
  {
    id: 'receptionist',
    sysId: 'receptionist-agent',
    title: 'FORGE Receptionist in Action',
    productName: 'FORGE Receptionist',
    icon: Bot,
    Character: ReceptionistCharacter,
    problemText: 'Customer calls at 9:30 PM: "Do you have an opening for tooth extraction tomorrow?" Phone rings to voicemail.',
    aiWorkingText: 'FORGE answers in 2s with natural voice NLP, checks Dr. Evans schedule, confirms Delta Dental PPO coverage.',
    outcomeText: 'Appointment locked for Saturday 11:00 AM. Patient record updated in Dentrix CRM. SMS confirmation dispatched.'
  },
  {
    id: 'lead-engine',
    sysId: 'lead-agent',
    title: 'Speed-to-Lead Pipeline',
    productName: 'FORGE Lead Engine',
    icon: Zap,
    Character: LeadEngineCharacter,
    problemText: 'High-intent commercial real estate lead submits web inquiry. 48-hour delay causes buyer to choose competitor.',
    aiWorkingText: 'FORGE ingests webhook in 800ms, evaluates 0-100 ICP fit (Score: 96), triggers 2-way SMS questionnaire.',
    outcomeText: 'Buyer replies via SMS. Priority consultation reserved with listing director within 42 seconds total.'
  },
  {
    id: 'document-engine',
    sysId: 'document-processor',
    title: 'Document & Invoice OCR',
    productName: 'FORGE Document Engine',
    icon: FileText,
    Character: DocumentCharacter,
    problemText: '120 PDF vendor invoices arrive weekly. Accounting team spends 20 hours manual re-typing and error checking.',
    aiWorkingText: 'Optical OCR extracts 14 line items, calculates tax checksum ($4,250.00), cross-references PO ledger.',
    outcomeText: 'Zero calculation errors. Invoice queued for 1-click human manager approval and synced to QuickBooks.'
  },
  {
    id: 'email-agent',
    sysId: 'email-agent',
    title: 'Inbox Triage & Draft Assistant',
    productName: 'FORGE Email Agent',
    icon: Mail,
    Character: EmailCharacter,
    problemText: 'Executive inbox flooded with 300+ mixed emails daily. High-value partnership inquiries get lost.',
    aiWorkingText: 'AI classifies messages into HOT LEAD, INVOICE, and SUPPORT tags, synthesizes contextual draft replies.',
    outcomeText: 'All emails triaged. Operator reviews drafts and approves with 1 click in under 5 minutes.'
  }
];

export function DontReadJustWatch({ onNavigate, onLaunchSandbox }) {
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const activeSkit = DEMO_SKITS[activeTabIdx];
  const CharacterComp = activeSkit.Character;

  return (
    <section className="py-20 sm:py-28 border-b border-slate-800/80 bg-[#060a12] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Playful Headline */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" /> ZERO FLUFF • PURE EXECUTION
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            DON'T READ THIS. <br />
            <span className="text-teal-400">JUST WATCH.</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Pick any autonomous workflow below and watch the 10-second visual demonstration.
          </p>
        </div>

        {/* Tab Selector with Characters */}
        <div className="flex items-center justify-center flex-wrap gap-3">
          {DEMO_SKITS.map((skit, idx) => {
            const isSelected = activeTabIdx === idx;
            const Icon = skit.icon;
            return (
              <button
                key={skit.id}
                onClick={() => setActiveTabIdx(idx)}
                className={`px-5 py-3 rounded-2xl font-mono text-xs font-bold transition-all flex items-center gap-2.5 border ${
                  isSelected
                    ? 'bg-teal-500 text-dark-950 border-teal-400 shadow-xl shadow-teal-500/20 scale-105'
                    : 'bg-[#090e18] text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{skit.productName}</span>
              </button>
            );
          })}
        </div>

        {/* Video Player & Character Stage */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 gap-8">
          <ForgeDemoVideoPlayer
            skitId={activeSkit.id}
            title={activeSkit.title}
            productName={activeSkit.productName}
            problemText={activeSkit.problemText}
            aiWorkingText={activeSkit.aiWorkingText}
            outcomeText={activeSkit.outcomeText}
            onTryLive={() => onLaunchSandbox && onLaunchSandbox(activeSkit.sysId)}
          />
        </div>

      </div>
    </section>
  );
}
