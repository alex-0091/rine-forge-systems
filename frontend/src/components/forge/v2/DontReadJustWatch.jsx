import React, { useState } from 'react';
import { 
  Sparkles, Play, ArrowRight, CheckCircle2, 
  Bot, Zap, FileText, Mail, Calendar, MessageSquare, ShieldCheck,
  Video, Tv, Film, ExternalLink, Flame, Check, PlayCircle, HelpCircle,
  Clock, CheckCheck, TrendingUp, Send
} from 'lucide-react';
import { ForgeDemoVideoPlayer, SYSTEM_ANIMATED_CLIPS } from './ForgeDemoVideoPlayer';
import { 
  ReceptionistCharacter, 
  LeadEngineCharacter, 
  SupportCharacter, 
  DocumentCharacter, 
  EmailCharacter, 
  AppointmentCharacter 
} from './ForgeCharacterUniverse';
import { forgeAudioSynth } from '../../../utils/forgeAudioSynth';

const SYSTEM_TABS = [
  {
    id: 'support-agent',
    sysId: 'support-agent',
    name: 'AI Customer Support',
    icon: HelpCircle,
    demoTime: 'Watch 30 sec demo',
    tag: '30s Demo',
    color: 'border-blue-500/40 text-blue-300',
    Character: SupportCharacter,
    description: 'Resolves customer queries instantly using verified vector knowledge base with 0% hallucinations.'
  },
  {
    id: 'lead-engine',
    sysId: 'lead-agent',
    name: 'AI Lead Generation',
    icon: Zap,
    demoTime: 'Watch 40 sec demo',
    tag: '40s Demo',
    color: 'border-violet-500/40 text-violet-300',
    Character: LeadEngineCharacter,
    description: 'Sub-45s webhook ingestion, 0-100 ICP qualification, and automated 2-way SMS booking.'
  },
  {
    id: 'receptionist',
    sysId: 'receptionist-agent',
    name: 'AI Voice Receptionist',
    icon: Bot,
    demoTime: 'Watch 35 sec demo',
    tag: '35s Demo',
    color: 'border-cyan-500/40 text-cyan-300',
    Character: ReceptionistCharacter,
    description: '24/7 telephony answering in 2 seconds, calendar availability verification, and patient intake.'
  },
  {
    id: 'document-engine',
    sysId: 'document-processor',
    name: 'Document & Invoice OCR',
    icon: FileText,
    demoTime: 'Watch 45 sec demo',
    tag: '45s Demo',
    color: 'border-orange-500/40 text-orange-300',
    Character: DocumentCharacter,
    description: 'Extracts 14+ line items from PDF invoices and syncs to QuickBooks AP with zero typing errors.'
  },
  {
    id: 'email-agent',
    sysId: 'email-agent',
    name: 'AI Outreach Agent',
    icon: Send,
    demoTime: 'Watch 60 sec demo',
    tag: '60s Demo',
    color: 'border-pink-500/40 text-pink-300',
    Character: EmailCharacter,
    description: 'Autonomous lead scraping, contextual multi-channel email drafts, and 1-click human approvals.'
  },
  {
    id: 'appointment-agent',
    sysId: 'appointment-agent',
    name: 'AI Trading Intelligence (Oracle AI)',
    icon: TrendingUp,
    demoTime: 'Watch 45 sec demo',
    tag: '45s Demo',
    color: 'border-emerald-500/40 text-emerald-300',
    Character: AppointmentCharacter,
    description: 'Real-time quantitative market microstructure analysis and deterministic regime execution.'
  }
];

export function DontReadJustWatch({ onNavigate, onLaunchSandbox, onWatchDemo }) {
  const [selectedSystemId, setSelectedSystemId] = useState('support-agent');

  const handleSelectTab = (id) => {
    forgeAudioSynth.playClick();
    setSelectedSystemId(id);
    const el = document.getElementById('player-canvas');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  return (
    <section className="py-20 sm:py-28 border-b border-slate-800/80 bg-[#060a12] relative" id="watch-demos">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Playful & Demonstrative Headline */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold tracking-wider uppercase shadow-md">
            <Film className="w-3.5 h-3.5 text-teal-400" />
            <span>REAL DIGITAL WORKERS IN ACTION</span>
          </div>
          
          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            WATCH OUR <span className="text-teal-400">AI WORK.</span>
          </h2>
          
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Don't read paragraphs about AI. Watch our digital workers answer customers, qualify leads, and complete work in real time.
          </p>
        </div>

        {/* 6 Quick Watch Cards (Direct Click to Play Demo) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SYSTEM_TABS.map((tab) => {
            const isSelected = selectedSystemId === tab.id;
            const Icon = tab.icon;
            const Character = tab.Character;
            return (
              <div
                key={tab.id}
                onClick={() => handleSelectTab(tab.id)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer group flex flex-col justify-between space-y-4 relative overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#0c1628] to-[#070c18] border-teal-400 shadow-xl shadow-teal-500/20 scale-[1.02]'
                    : 'bg-[#080d18] border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono font-bold text-slate-400">
                      {tab.tag}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 100% Policy Bound
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Character size="sm" />
                    <div>
                      <h4 className="font-bold text-sm text-white group-hover:text-teal-300 transition-colors">
                        {tab.name}
                      </h4>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {tab.demoTime}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 font-sans leading-relaxed line-clamp-2">
                    {tab.description}
                  </p>
                </div>

                {/* Big Action Button */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-teal-400 flex items-center gap-1.5 group-hover:underline">
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{tab.demoTime}</span>
                  </span>
                  <span className="text-slate-500 text-[11px] font-mono group-hover:text-white transition-colors">
                    ▶ Play Clip
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 🌟 Master In-Page 60FPS Video Stage */}
        <div className="max-w-4xl mx-auto pt-4" id="player-canvas">
          <ForgeDemoVideoPlayer
            skitId={selectedSystemId}
            onTryLive={() => onLaunchSandbox && onLaunchSandbox(SYSTEM_ANIMATED_CLIPS[selectedSystemId]?.sysId || 'support-agent')}
            onSelectSystem={(sysId) => {
              const matchedKey = Object.keys(SYSTEM_ANIMATED_CLIPS).find(k => SYSTEM_ANIMATED_CLIPS[k].sysId === sysId);
              if (matchedKey) setSelectedSystemId(matchedKey);
            }}
          />
        </div>

      </div>
    </section>
  );
}
