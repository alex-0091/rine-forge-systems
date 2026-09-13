import React, { useState } from 'react';
import { 
  Sparkles, Play, ArrowRight, CheckCircle2, 
  Bot, Zap, FileText, Mail, Calendar, MessageSquare, ShieldCheck,
  Video, Tv, Film, ExternalLink, Flame, Check, PlayCircle, HelpCircle,
  Clock, CheckCheck
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

const SYSTEM_TABS = [
  {
    id: 'receptionist',
    sysId: 'receptionist-agent',
    name: 'AI Receptionist',
    icon: Bot,
    tag: '5.5s Call Clip',
    Character: ReceptionistCharacter
  },
  {
    id: 'lead-engine',
    sysId: 'lead-agent',
    name: 'Speed-to-Lead',
    icon: Zap,
    tag: '5.5s SMS Clip',
    Character: LeadEngineCharacter
  },
  {
    id: 'document-engine',
    sysId: 'document-processor',
    name: 'Document OCR',
    icon: FileText,
    tag: '5.5s Laser Clip',
    Character: DocumentCharacter
  },
  {
    id: 'email-agent',
    sysId: 'email-agent',
    name: 'Email Triage',
    icon: Mail,
    tag: '5.5s Inbox Clip',
    Character: EmailCharacter
  },
  {
    id: 'support-agent',
    sysId: 'support-agent',
    name: 'Knowledge RAG',
    icon: HelpCircle,
    tag: '5.5s Vector Clip',
    Character: SupportCharacter
  },
  {
    id: 'appointment-agent',
    sysId: 'appointment-agent',
    name: 'Appointment Sync',
    icon: Calendar,
    tag: '5.5s Cal Clip',
    Character: AppointmentCharacter
  }
];

export function DontReadJustWatch({ onNavigate, onLaunchSandbox }) {
  const [selectedSystemId, setSelectedSystemId] = useState('receptionist');

  return (
    <section className="py-20 sm:py-28 border-b border-slate-800/80 bg-[#060a12] relative" id="watch-demos">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Playful Headline */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold tracking-wider uppercase shadow-md">
            <Film className="w-3.5 h-3.5 text-teal-400" /> 5.5-SECOND BESPOKE AI ANIMATED CLIPS • ZERO FLUFF
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            DON'T READ THIS. <br />
            <span className="text-teal-400">WATCH THE 5-SECOND CLIPS.</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Watch our animated AI characters show you exactly what each system accomplishes in under 6 seconds.
          </p>
        </div>

        {/* 6-System Animated Clip Switcher Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2.5">
          {SYSTEM_TABS.map((tab) => {
            const isSelected = selectedSystemId === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedSystemId(tab.id)}
                className={`px-4 py-3 rounded-2xl font-mono text-xs font-bold transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-400 text-dark-950 border-teal-300 shadow-xl shadow-teal-500/20 scale-105 font-black'
                    : 'bg-[#090e18] text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-slate-300 font-mono">
                  {tab.tag}
                </span>
              </button>
            );
          })}
        </div>

        {/* 🌟 Central 60FPS Animated Video Player */}
        <div className="max-w-4xl mx-auto">
          <ForgeDemoVideoPlayer
            skitId={selectedSystemId}
            onTryLive={() => onLaunchSandbox && onLaunchSandbox(SYSTEM_ANIMATED_CLIPS[selectedSystemId]?.sysId || 'receptionist-agent')}
            onSelectSystem={(sysId) => {
              const matchedKey = Object.keys(SYSTEM_ANIMATED_CLIPS).find(k => SYSTEM_ANIMATED_CLIPS[k].sysId === sysId);
              if (matchedKey) setSelectedSystemId(matchedKey);
            }}
          />
        </div>

        {/* 6-System Animated Video Grid Wall */}
        <div className="pt-8 border-t border-slate-800/80 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-400" />
                <span>All 6 Animated AI System Demonstrations</span>
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Click any system card below to immediately load and play its custom animated video clip.
              </p>
            </div>
            <span className="text-xs font-mono text-teal-400 font-bold bg-teal-500/10 px-3 py-1.5 rounded-xl border border-teal-500/20">
              ⚡ 6 Bespoke 60FPS Video Clips
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SYSTEM_TABS.map((item) => {
              const isSelected = selectedSystemId === item.id;
              const clipData = SYSTEM_ANIMATED_CLIPS[item.id];
              const Character = item.Character;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedSystemId(item.id);
                    const el = document.getElementById('watch-demos');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                  }}
                  className={`p-5 rounded-3xl border text-left transition-all group relative overflow-hidden flex flex-col justify-between min-h-[220px] ${
                    isSelected
                      ? 'bg-gradient-to-b from-teal-950/60 to-[#0c1424] border-teal-400 shadow-xl shadow-teal-500/20 scale-[1.02]'
                      : 'bg-[#090e18] border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-400 text-[10px] font-mono font-bold border border-teal-500/30">
                        {clipData.tag}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-400">
                        05.5s 60FPS
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Character size="sm" />
                      <div>
                        <h4 className="font-bold text-sm text-white group-hover:text-teal-300 transition-colors">
                          {clipData.productName}
                        </h4>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {clipData.characterName}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-sans">
                      {clipData.dialogue.action}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-teal-400 font-bold flex items-center gap-1 group-hover:underline">
                      <Play className="w-3.5 h-3.5 fill-current" /> Play Animated Clip
                    </span>
                    <span className="text-slate-300 text-[10px]">
                      100% Policy Bound
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
