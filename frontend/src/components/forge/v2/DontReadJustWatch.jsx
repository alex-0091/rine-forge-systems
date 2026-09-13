import React, { useState } from 'react';
import { 
  Sparkles, Play, ArrowRight, CheckCircle2, 
  Bot, Zap, FileText, Mail, Calendar, MessageSquare, ShieldCheck,
  Video, Tv, Film, ExternalLink, Flame, Check, PlayCircle
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
    title: 'AI Voice Receptionist Live Phone Call',
    productName: 'AI Voice Receptionist',
    icon: Bot,
    youtubeVideoId: 'bBC-nXj3Ng4',
    Character: ReceptionistCharacter,
    problemText: 'Customer calls at 9:30 PM: "Do you have an opening for tooth extraction tomorrow?" Phone rings to voicemail.',
    aiWorkingText: 'FORGE answers in 2s with natural voice NLP, checks Dr. Evans schedule, confirms Delta Dental PPO coverage.',
    outcomeText: 'Appointment locked for Saturday 11:00 AM. Patient record updated in Dentrix CRM. SMS confirmation dispatched.'
  },
  {
    id: 'lead-engine',
    sysId: 'lead-agent',
    title: 'Speed-to-Lead & Instant 2-Way SMS Dispatch',
    productName: 'Speed-to-Lead Engine',
    icon: Zap,
    youtubeVideoId: 'aircAruvnKk',
    Character: LeadEngineCharacter,
    problemText: 'High-intent commercial real estate lead submits web inquiry. 48-hour delay causes buyer to choose competitor.',
    aiWorkingText: 'FORGE ingests webhook in 800ms, evaluates 0-100 ICP fit (Score: 96), triggers 2-way SMS questionnaire.',
    outcomeText: 'Buyer replies via SMS. Priority consultation reserved with listing director within 42 seconds total.'
  },
  {
    id: 'document-engine',
    sysId: 'document-processor',
    title: 'Vision AI Document & Invoice Auto-Ledger',
    productName: 'Document OCR Engine',
    icon: FileText,
    youtubeVideoId: 'fJ9rUzIMcZQ',
    Character: DocumentCharacter,
    problemText: '120 PDF vendor invoices arrive weekly. Accounting team spends 20 hours manual re-typing and error checking.',
    aiWorkingText: 'Optical OCR extracts 14 line items, calculates tax checksum ($4,250.00), cross-references PO ledger.',
    outcomeText: 'Zero calculation errors. Invoice queued for 1-click human manager approval and synced to QuickBooks.'
  },
  {
    id: 'email-agent',
    sysId: 'email-agent',
    title: 'Autonomous Email Inbox Triage & Drafts',
    productName: 'Email AI Agent',
    icon: Mail,
    youtubeVideoId: 'k2P_amTZb2A',
    Character: EmailCharacter,
    problemText: 'Executive inbox flooded with 300+ mixed emails daily. High-value partnership inquiries get lost.',
    aiWorkingText: 'AI classifies messages into HOT LEAD, INVOICE, and SUPPORT tags, synthesizes contextual draft replies.',
    outcomeText: 'All emails triaged. Operator reviews drafts and approves with 1 click in under 5 minutes.'
  }
];

const VIDEO_GALLERY_CLIPS = [
  {
    id: 'clip-1',
    title: 'AI Voice Receptionist Booking Call',
    category: 'Conversational Telephony',
    youtubeId: 'bBC-nXj3Ng4',
    runtime: '0:35',
    tag: 'Live Call Audio',
    desc: 'Real AI phone agent scheduling appointment with natural speech cadence and zero lag.'
  },
  {
    id: 'clip-2',
    title: 'Autonomous Multi-Agent Automation',
    category: 'Neural Agent Pipelines',
    youtubeId: 'aircAruvnKk',
    runtime: '0:48',
    tag: 'Pipeline Execution',
    desc: 'Deep learning agents routing tasks, analyzing webhooks, and executing backend actions.'
  },
  {
    id: 'clip-3',
    title: 'Computer Vision & OCR Data Extraction',
    category: 'Vision & Document OCR',
    youtubeId: 'fJ9rUzIMcZQ',
    runtime: '0:30',
    tag: 'Document AI',
    desc: 'Neural OCR extracts tabular data and fields from PDF invoices directly into QuickBooks.'
  },
  {
    id: 'clip-4',
    title: 'Zero-Inbox AI Email Agent Triage',
    category: 'Inbox Intelligence',
    youtubeId: 'k2P_amTZb2A',
    runtime: '0:42',
    tag: 'Autonomous Email',
    desc: 'Classifies high-priority executive mail, flags urgent tickets, and drafts accurate responses.'
  },
  {
    id: 'clip-5',
    title: 'Real-Time Voice Cloning & TTS Speech',
    category: 'Speech Synthesis',
    youtubeId: '40dJS_NF0ok',
    runtime: '0:38',
    tag: 'Voice AI Studio',
    desc: 'Sub-second neural voice synthesis with authentic cadence, inflection, and tone control.'
  },
  {
    id: 'clip-6',
    title: 'Enterprise CRM Lead Routing & SMS Dispatch',
    category: 'Lead Velocity',
    youtubeId: '5qap5aO4i9A',
    runtime: '0:40',
    tag: 'Lead Speed',
    desc: 'Web lead captured, scored 0-100 ICP fit, and booked via SMS dispatch in under 60 seconds.'
  }
];

export function DontReadJustWatch({ onNavigate, onLaunchSandbox }) {
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const activeSkit = DEMO_SKITS[activeTabIdx];

  return (
    <section className="py-20 sm:py-28 border-b border-slate-800/80 bg-[#060a12] relative" id="watch-demos">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Playful Headline */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold tracking-wider uppercase">
            <Video className="w-3.5 h-3.5 text-teal-400" /> REAL VIDEO DEMONSTRATIONS • NO FLUFF
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            DON'T READ THIS. <br />
            <span className="text-teal-400">WATCH THE REAL VIDEO.</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Select any enterprise AI system below to watch authentic video walkthroughs, live voice calls, and real-time screen demonstrations.
          </p>
        </div>

        {/* Tab Selector for Systems */}
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
                    ? 'bg-teal-500 text-dark-950 border-teal-400 shadow-xl shadow-teal-500/20 scale-105 font-black'
                    : 'bg-[#090e18] text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{skit.productName}</span>
                <span className="text-[10px] opacity-75 font-normal">HD Video</span>
              </button>
            );
          })}
        </div>

        {/* Main 4K Video Player */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 gap-8">
          <ForgeDemoVideoPlayer
            skitId={activeSkit.id}
            title={activeSkit.title}
            productName={activeSkit.productName}
            problemText={activeSkit.problemText}
            aiWorkingText={activeSkit.aiWorkingText}
            outcomeText={activeSkit.outcomeText}
            youtubeVideoId={activeSkit.youtubeVideoId}
            onTryLive={() => onLaunchSandbox && onLaunchSandbox(activeSkit.sysId)}
          />
        </div>

        {/* Extended Real Video Showcase Grid */}
        <div className="pt-8 border-t border-slate-800/80 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <Film className="w-5 h-5 text-teal-400" />
                <span>Real AI System Video Case Studies</span>
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Explore authentic recordings of our neural telephony, OCR pipelines, and autonomous triage agents in action.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-teal-400 font-bold bg-teal-500/10 px-3 py-1.5 rounded-xl border border-teal-500/20">
              <Sparkles className="w-4 h-4" />
              <span>6 High-Res Video Clips Available</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {VIDEO_GALLERY_CLIPS.map((clip, idx) => (
              <div 
                key={clip.id}
                className="rounded-2xl bg-gradient-to-b from-[#0e1628] to-[#080d1a] border border-slate-800 hover:border-teal-500/50 transition-all p-5 space-y-4 group hover:shadow-xl hover:shadow-teal-500/10"
              >
                {/* Video thumbnail / player preview */}
                <div className="rounded-xl overflow-hidden aspect-video bg-black relative border border-slate-800">
                  <iframe
                    className="w-full h-full pointer-events-auto"
                    src={`https://www.youtube-nocookie.com/embed/${clip.youtubeId}?controls=1&modestbranding=1&rel=0`}
                    title={clip.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[10px] font-mono text-teal-300 font-bold border border-teal-500/30">
                    {clip.tag}
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[10px] font-mono text-slate-300 font-bold">
                    {clip.runtime}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono text-teal-400 font-bold uppercase tracking-wider">
                    {clip.category}
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
                    {clip.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {clip.desc}
                  </p>
                </div>

                {/* Footer action */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-300 flex items-center gap-1 font-mono">
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> 100% Policy Bound
                  </span>
                  <a
                    href={`https://www.youtube.com/watch?v=${clip.youtubeId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1 transition-colors"
                  >
                    <span>Full HD Clip</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
