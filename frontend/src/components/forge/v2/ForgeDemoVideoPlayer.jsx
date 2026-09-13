import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, RotateCcw, Sparkles, ArrowRight, 
  CheckCircle2, Volume2, VolumeX, ShieldCheck, Video, 
  Tv, Film, Sparkle, Zap, Bot, Mail, FileText, Calendar, 
  MessageSquare, Search, PhoneCall, Check, ExternalLink, Flame, Maximize2,
  Clock, Smartphone, Database, CheckCheck, RefreshCw, Layers, Terminal
} from 'lucide-react';
import { speechEngine } from '../../../utils/speechEngine';
import { forgeAudioSynth } from '../../../utils/forgeAudioSynth';
import { 
  ReceptionistCharacter, 
  LeadEngineCharacter, 
  SupportCharacter, 
  DocumentCharacter, 
  EmailCharacter, 
  AppointmentCharacter,
  ForgeCoreMascot
} from './ForgeCharacterUniverse';

export const SYSTEM_ANIMATED_CLIPS = {
  'receptionist': {
    id: 'receptionist',
    sysId: 'receptionist-agent',
    title: 'AI Voice Receptionist (5.5s Animated Clip)',
    productName: 'AI Voice Receptionist',
    duration: 5.5,
    tag: '24/7 Voice NLP',
    theme: 'cyan',
    colorBorder: 'border-cyan-400',
    colorGlow: 'shadow-cyan-500/30',
    colorBadge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    dialogue: {
      problem: 'Alex calls at 10:45 PM: "Emergency root canal tomorrow?"',
      action: 'FORGE answers in 2s, verifies Delta Dental PPO, checks Dr. Evans chair.',
      outcome: 'Saturday 11:00 AM locked. SMS sent & Dentrix updated in 18s.'
    },
    characterName: 'Dr. Evans Reception AI'
  },
  'lead-engine': {
    id: 'lead-engine',
    sysId: 'lead-agent',
    title: 'Speed-to-Lead Pipeline (5.5s Animated Clip)',
    productName: 'Speed-to-Lead Engine',
    duration: 5.5,
    tag: 'Sub-45s Ingest',
    theme: 'violet',
    colorBorder: 'border-violet-400',
    colorGlow: 'shadow-violet-500/30',
    colorBadge: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
    dialogue: {
      problem: 'Zillow $1.4M buyer lead arrives after hours.',
      action: 'FORGE evaluates 0-100 ICP (Score: 96) & triggers 2-way SMS questionnaire.',
      outcome: 'Buyer confirms on mobile. VIP Private Showing booked in 38s.'
    },
    characterName: 'Lead Velocity Bot'
  },
  'support-agent': {
    id: 'support-agent',
    sysId: 'support-agent',
    title: 'Zero-Hallucination Knowledge RAG (5.5s Animated Clip)',
    productName: 'Support & Knowledge Agent',
    duration: 5.5,
    tag: 'Vector RAG Search',
    theme: 'blue',
    colorBorder: 'border-blue-400',
    colorGlow: 'shadow-blue-500/30',
    colorBadge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    dialogue: {
      problem: 'Client asks complex early-termination SLA penalty query.',
      action: 'Vector engine scans 500-page Master Agreement with zero hallucination.',
      outcome: 'Delivered exact answer with page & paragraph citation in 12ms.'
    },
    characterName: 'Knowledge RAG Core'
  },
  'document-engine': {
    id: 'document-engine',
    sysId: 'document-processor',
    title: 'Vision OCR Document Parser (5.5s Animated Clip)',
    productName: 'Document & OCR Engine',
    duration: 5.5,
    tag: 'Laser Optical OCR',
    theme: 'orange',
    colorBorder: 'border-orange-400',
    colorGlow: 'shadow-orange-500/30',
    colorBadge: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    dialogue: {
      problem: '120 PDF vendor invoices arrive with manual typing backlog.',
      action: 'Laser OCR extracts 14 line items & validates mathematical tax checksum ($4,290.00).',
      outcome: 'Committed to QuickBooks AP with zero human data entry errors.'
    },
    characterName: 'Quantum OCR Parser'
  },
  'email-agent': {
    id: 'email-agent',
    sysId: 'email-agent',
    title: 'Autonomous Email Triage & Drafts (5.5s Animated Clip)',
    productName: 'Autonomous Email Agent',
    duration: 5.5,
    tag: 'Zero-Inbox AI',
    theme: 'pink',
    colorBorder: 'border-pink-400',
    colorGlow: 'shadow-pink-500/30',
    colorBadge: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
    dialogue: {
      problem: '300+ chaotic emails flooding executive inbox daily.',
      action: 'AI neural engine sorts into Hot Lead, Invoice, and VIP support buckets.',
      outcome: 'Contextual draft generated. 1-click human approved in 5 minutes.'
    },
    characterName: 'Inbox Intelligence AI'
  },
  'appointment-agent': {
    id: 'appointment-agent',
    sysId: 'appointment-agent',
    title: 'Autonomous Calendar Scheduling (5.5s Animated Clip)',
    productName: 'Appointment Booking Agent',
    duration: 5.5,
    tag: 'Multi-Cal Sync',
    theme: 'green',
    colorBorder: 'border-emerald-400',
    colorGlow: 'shadow-emerald-500/30',
    colorBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    dialogue: {
      problem: '5-email back-and-forth negotiation causing dropped meetings.',
      action: 'AI scans 3 doctor calendars and resolves timezone buffers in real-time.',
      outcome: 'Google Meet invite dispatched with prep notes & SMS reminder.'
    },
    characterName: 'Schedule Coordinator'
  }
};

export function ForgeDemoVideoPlayer({
  skitId = 'receptionist',
  title,
  productName,
  onTryLive,
  onSelectSystem
}) {
  const [activeClipId, setActiveClipId] = useState(skitId);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [isVoiceNarratorActive, setIsVoiceNarratorActive] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [laserY, setLaserY] = useState(25);
  const [activeTab, setActiveTab] = useState('canvas');

  const clip = SYSTEM_ANIMATED_CLIPS[activeClipId] || SYSTEM_ANIMATED_CLIPS['receptionist'];
  const duration = clip.duration;

  useEffect(() => {
    if (skitId && SYSTEM_ANIMATED_CLIPS[skitId]) {
      setActiveClipId(skitId);
      setCurrentTime(0);
      setIsPlaying(true);
    }
  }, [skitId]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setLaserY(prev => (prev > 80 ? 15 : prev + 6));
    }, 120);
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = +(prev + 0.1 * playbackSpeed).toFixed(2);
          if (next >= duration) {
            return 0;
          }
          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration, playbackSpeed]);

  useEffect(() => {
    if (!isPlaying) return;

    if (currentTime >= 0.1 && currentTime <= 0.2) {
      if (activeClipId === 'receptionist') forgeAudioSynth.playPhoneRing();
      else if (activeClipId === 'lead-engine') forgeAudioSynth.playWarp();
      else forgeAudioSynth.playClick();

      if (isVoiceNarratorActive) speechEngine.speak(clip.dialogue.problem, { accent: 'en-US' });
    } else if (currentTime >= 1.8 && currentTime <= 1.9) {
      if (activeClipId === 'document-engine') forgeAudioSynth.playScan();
      else forgeAudioSynth.playClick();

      if (isVoiceNarratorActive) speechEngine.speak(clip.dialogue.action, { accent: 'en-US' });
    } else if (currentTime >= 3.8 && currentTime <= 3.9) {
      forgeAudioSynth.playSuccess();
      if (isVoiceNarratorActive) speechEngine.speak(clip.dialogue.outcome, { accent: 'en-US' });
    }
  }, [Math.floor(currentTime * 10), isVoiceNarratorActive, isPlaying, clip, activeClipId]);

  const handleTogglePlay = () => {
    forgeAudioSynth.playClick();
    if (isPlaying) {
      setIsPlaying(false);
      speechEngine.stopSpeaking();
    } else {
      setIsPlaying(true);
      if (isVoiceNarratorActive) {
        speechEngine.speak(clip.dialogue.action, { accent: 'en-US' });
      }
    }
  };

  const handleToggleVoice = () => {
    forgeAudioSynth.playClick();
    if (isVoiceNarratorActive) {
      speechEngine.stopSpeaking();
      setIsVoiceNarratorActive(false);
    } else {
      setIsVoiceNarratorActive(true);
      speechEngine.speak('Voiceover activated. ' + clip.dialogue.problem, { accent: 'en-US' });
    }
  };

  let stageKey = 'problem';
  let stageLabel = '0.0s - 1.8s: THE INBOUND BOTTLENECK';
  let stageBadgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
  let stageText = clip.dialogue.problem;

  if (currentTime >= 1.8 && currentTime < 3.8) {
    stageKey = 'action';
    stageLabel = '1.8s - 3.8s: FORGE AI AUTONOMOUS REASONING';
    stageBadgeColor = clip.colorBadge;
    stageText = clip.dialogue.action;
  } else if (currentTime >= 3.8) {
    stageKey = 'outcome';
    stageLabel = '3.8s - 5.5s: 100% DETERMINISTIC OUTCOME';
    stageBadgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    stageText = clip.dialogue.outcome;
  }

  const progressPercent = Math.min((currentTime / duration) * 100, 100);

  return (
    <div className={`w-full rounded-3xl bg-gradient-to-b from-[#0c1424] via-[#090e1a] to-[#060a12] border-2 ${clip.colorBorder} transition-all overflow-hidden shadow-2xl font-mono text-xs`}>
      
      {/* 🎬 TOP VIDEO PLAYER CHROME HEADER */}
      <div className="px-6 py-4 bg-[#080d18] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50 animate-pulse" />
            <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
          </div>
          <span className="text-sm font-black text-white font-sans ml-2 tracking-wide flex items-center gap-2">
            <Film className="w-4 h-4 text-teal-400" />
            <span>{clip.title}</span>
          </span>
          <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold text-[10px] border border-teal-500/40 hidden sm:inline-block">
            60 FPS BESPOKE CLIP
          </span>
        </div>

        {/* View Mode & Video Controls */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg bg-dark-950 p-0.5 border border-slate-800">
            <button
              onClick={() => {
                forgeAudioSynth.playClick();
                setActiveTab('canvas');
              }}
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                activeTab === 'canvas' ? 'bg-slate-800 text-teal-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              Motion Canvas
            </button>
            <button
              onClick={() => {
                forgeAudioSynth.playClick();
                setActiveTab('telemetry');
              }}
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 ${
                activeTab === 'telemetry' ? 'bg-slate-800 text-teal-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3 h-3" />
              <span>Logs</span>
            </button>
          </div>

          <button
            onClick={handleToggleVoice}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all border ${
              isVoiceNarratorActive
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse'
                : 'bg-dark-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Spoken AI Audio Narration"
          >
            {isVoiceNarratorActive ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{isVoiceNarratorActive ? 'Voice ON' : 'Voice'}</span>
          </button>

          <button
            onClick={() => {
              forgeAudioSynth.playClick();
              setPlaybackSpeed(s => (s === 1 ? 1.5 : s === 1.5 ? 2 : 1));
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-mono text-[10px] font-bold"
            title="Playback Speed"
          >
            {playbackSpeed}x
          </button>
        </div>
      </div>

      {/* 🌟 60FPS BESPOKE ANIMATED VIDEO CANVAS */}
      <div className="p-6 sm:p-8 space-y-6 relative bg-gradient-to-b from-[#090e1a]/90 via-[#070b14] to-[#05080f]">
        
        {/* Stage Notification Banner */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] px-3 py-1 rounded-full border font-black uppercase tracking-wider ${stageBadgeColor}`}>
              {stageLabel}
            </span>
          </div>
          <span className="text-teal-300 text-xs font-bold font-mono px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-teal-400" />
            <span>0{currentTime.toFixed(1)}s / 05.5s</span>
          </span>
        </div>

        {/* 🎨 THE ANIMATED VIDEO STAGE */}
        {activeTab === 'canvas' ? (
          <div className="relative rounded-3xl bg-gradient-to-tr from-[#080e1c] via-[#0c162a] to-[#060a14] border-2 border-slate-800 p-6 sm:p-8 min-h-[360px] sm:min-h-[300px] flex items-center justify-center overflow-hidden shadow-inner">
            
            <div className="absolute inset-0 bg-[radial-gradient(#06b6d415_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none opacity-80" />
            
            <div 
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-lg shadow-teal-400 transition-all duration-100 pointer-events-none"
              style={{ top: `${(currentTime / duration) * 100}%` }}
            />

            {/* 1. 📞 RECEPTIONIST ANIMATED CLIP (CYAN) */}
            {activeClipId === 'receptionist' && (
              <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative z-10">
                <div className={`md:col-span-4 p-4 rounded-2xl border transition-all duration-300 text-center space-y-2 ${
                  stageKey === 'problem'
                    ? 'bg-rose-950/70 border-rose-400 shadow-xl shadow-rose-500/20 scale-105'
                    : 'bg-slate-950/60 border-slate-800 opacity-70'
                }`}>
                  <div className="relative inline-block">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500/20 to-orange-500/20 border-2 border-rose-400 flex items-center justify-center text-3xl shadow-lg">
                      👨‍💼
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center text-white text-[10px] animate-bounce">
                      📞
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white">Alex (Caller)</div>
                  <div className="text-[10px] font-mono text-rose-300 font-bold">10:45 PM Emergency</div>
                </div>

                <div className="md:col-span-4 flex flex-col items-center justify-center space-y-2 py-2">
                  <div className="flex items-center gap-1">
                    {[14, 30, 48, 22, 40, 18, 34, 12].map((h, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-gradient-to-t from-cyan-400 via-teal-300 to-indigo-400 rounded-full transition-all duration-150 shadow-md shadow-cyan-500/50"
                        style={{
                          height: isPlaying 
                            ? `${Math.floor(10 + Math.sin(currentTime * 6 + i) * 20 + h * 0.4)}px`
                            : '10px'
                        }}
                      />
                    ))}
                  </div>
                  <div className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[10px] font-bold">
                    {stageKey === 'action' ? '⚡ DELTA DENTAL PPO VERIFIED' : 'SUB-2s NLP MATRIX'}
                  </div>
                </div>

                <div className={`md:col-span-4 p-4 rounded-2xl border transition-all duration-300 text-center space-y-2 ${
                  stageKey === 'outcome'
                    ? 'bg-emerald-950/70 border-emerald-400 shadow-xl shadow-emerald-500/20 scale-105'
                    : 'bg-slate-950/60 border-slate-800 opacity-70'
                }`}>
                  <ReceptionistCharacter size="md" />
                  <div className="text-xs font-bold text-white">FORGE Receptionist</div>
                  <div className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                    {stageKey === 'outcome' ? '✅ SAT 11:00 AM LOCKED' : 'DENTRIX SYNC ARMED'}
                  </div>
                </div>
              </div>
            )}

            {/* 2. 🎯 SPEED-TO-LEAD ANIMATED CLIP (VIOLET) */}
            {activeClipId === 'lead-engine' && (
              <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative z-10">
                <div className={`md:col-span-4 p-4 rounded-2xl border text-center space-y-2 transition-all ${
                  stageKey === 'problem' ? 'bg-rose-950/70 border-rose-400 scale-105 shadow-xl' : 'bg-slate-950/60 border-slate-800 opacity-70'
                }`}>
                  <div className="text-4xl">📝</div>
                  <div className="text-xs font-bold text-white">$1.4M Commercial Lead</div>
                  <div className="text-[10px] text-rose-300 font-mono font-bold">Web Form Arrived</div>
                </div>

                <div className="md:col-span-4 flex flex-col items-center justify-center space-y-2">
                  <div className="w-20 h-20 rounded-full border-4 border-dashed border-violet-400 flex flex-col items-center justify-center bg-dark-950 animate-spin" style={{ animationDuration: '4s' }}>
                    <span className="text-xl font-black text-violet-300">96</span>
                    <span className="text-[8px] font-bold text-slate-300">ICP FIT</span>
                  </div>
                  <span className="text-[10px] text-violet-400 font-bold font-mono">RADAR EVALUATED</span>
                </div>

                <div className={`md:col-span-4 p-4 rounded-2xl border text-center space-y-2 transition-all ${
                  stageKey === 'outcome' ? 'bg-emerald-950/70 border-emerald-400 scale-105 shadow-xl' : 'bg-slate-950/60 border-slate-800 opacity-70'
                }`}>
                  <LeadEngineCharacter size="md" />
                  <div className="text-xs font-bold text-white">2-Way SMS Fired</div>
                  <div className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-500/20 py-1 rounded border border-emerald-500/40">
                    ⚡ 38s VIP TOUR BOOKED
                  </div>
                </div>
              </div>
            )}

            {/* 3. 🔷 SUPPORT RAG ANIMATED CLIP (BLUE) */}
            {activeClipId === 'support-agent' && (
              <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative z-10">
                <div className={`md:col-span-4 p-4 rounded-2xl border text-center space-y-2 transition-all ${
                  stageKey === 'problem' ? 'bg-rose-950/70 border-rose-400 scale-105 shadow-xl' : 'bg-slate-950/60 border-slate-800'
                }`}>
                  <div className="text-3xl">❓</div>
                  <div className="text-xs font-bold text-white">Complex SLA Query</div>
                  <div className="text-[10px] text-rose-300 font-mono font-bold">Clause Section 14</div>
                </div>

                <div className="md:col-span-4 flex flex-col items-center justify-center space-y-2">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border-2 border-blue-400 flex items-center justify-center text-2xl animate-pulse">
                    🧠
                  </div>
                  <span className="text-[10px] text-blue-300 font-bold font-mono">VECTOR RAG SEARCH</span>
                </div>

                <div className={`md:col-span-4 p-4 rounded-2xl border text-center space-y-2 transition-all ${
                  stageKey === 'outcome' ? 'bg-emerald-950/70 border-emerald-400 scale-105 shadow-xl' : 'bg-slate-950/60 border-slate-800'
                }`}>
                  <SupportCharacter size="md" />
                  <div className="text-xs font-bold text-white">Zero-Hallucination</div>
                  <div className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-500/20 py-1.5 rounded-lg border border-emerald-500/40">
                    ✅ CITATION VERIFIED
                  </div>
                </div>
              </div>
            )}

            {/* 4. 📄 DOCUMENT OCR ANIMATED CLIP (ORANGE) */}
            {activeClipId === 'document-engine' && (
              <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative z-10">
                <div className={`md:col-span-5 relative p-4 rounded-2xl border-2 space-y-2 overflow-hidden transition-all ${
                  stageKey === 'problem' ? 'bg-rose-950/50 border-rose-400' : 'bg-slate-950/90 border-orange-500/40'
                }`}>
                  <div 
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent shadow-lg shadow-orange-400 transition-all duration-150"
                    style={{ top: `${laserY}%` }}
                  />
                  <div className="text-[11px] font-mono text-slate-300 font-bold">📄 VENDOR INVOICE #88491</div>
                  <div className="text-[10px] text-slate-300 space-y-1">
                    <div>• H100 Cloud GPU Units: $3,840.00</div>
                    <div>• Dedicated Bandwidth: $450.00</div>
                    <div className="text-orange-300 font-bold pt-1 border-t border-slate-800">TOTAL: $4,290.00</div>
                  </div>
                </div>

                <div className="md:col-span-2 flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-orange-500/20 border-2 border-orange-400 flex items-center justify-center text-orange-300 animate-pulse text-lg">
                    ⚡
                  </div>
                </div>

                <div className={`md:col-span-5 p-4 rounded-2xl border-2 text-center space-y-2 transition-all ${
                  stageKey === 'outcome' ? 'bg-emerald-950/70 border-emerald-400 scale-105 shadow-xl' : 'bg-slate-950/80 border-slate-800'
                }`}>
                  <DocumentCharacter size="md" />
                  <div className="text-xs font-bold text-white">QuickBooks AP Ledger</div>
                  <div className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-500/20 py-1.5 rounded-lg border border-emerald-500/40">
                    ✅ 100% BALANCED ($0 ERRORS)
                  </div>
                </div>
              </div>
            )}

            {/* 5. 📥 EMAIL AGENT ANIMATED CLIP (PINK) */}
            {activeClipId === 'email-agent' && (
              <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative z-10">
                <div className={`md:col-span-4 p-4 rounded-2xl border text-center space-y-2 transition-all ${
                  stageKey === 'problem' ? 'bg-rose-950/70 border-rose-400 scale-105 shadow-xl' : 'bg-slate-950/60 border-slate-800'
                }`}>
                  <div className="text-3xl">📥</div>
                  <div className="text-xs font-bold text-white">300+ Inbox Overflow</div>
                  <div className="text-[10px] text-rose-400 font-mono font-bold">Unread Chaos</div>
                </div>

                <div className="md:col-span-4 flex flex-col gap-2">
                  <div className="px-3 py-1.5 rounded-xl bg-pink-500/20 text-pink-300 border border-pink-500/40 text-[10px] font-bold flex items-center justify-between">
                    <span>🔥 HOT PARTNERSHIP</span>
                    <span>1-Click Draft</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold flex items-center justify-between">
                    <span>💳 PENDING INVOICE</span>
                    <span>Verified</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[10px] font-bold flex items-center justify-between">
                    <span>💬 VIP TICKET</span>
                    <span>Triaged</span>
                  </div>
                </div>

                <div className={`md:col-span-4 p-4 rounded-2xl border text-center space-y-2 transition-all ${
                  stageKey === 'outcome' ? 'bg-emerald-950/70 border-emerald-400 scale-105 shadow-xl' : 'bg-slate-950/60 border-slate-800'
                }`}>
                  <EmailCharacter size="md" />
                  <div className="text-xs font-bold text-white">Zero Inbox Cleaned</div>
                  <div className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-500/20 py-1.5 rounded-lg border border-emerald-500/40">
                    ⚡ 5 MIN TRIAGE
                  </div>
                </div>
              </div>
            )}

            {/* 6. 📅 APPOINTMENT AGENT ANIMATED CLIP (GREEN) */}
            {activeClipId === 'appointment-agent' && (
              <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative z-10">
                <div className={`md:col-span-4 p-4 rounded-2xl border text-center space-y-2 transition-all ${
                  stageKey === 'problem' ? 'bg-rose-950/70 border-rose-400 scale-105 shadow-xl' : 'bg-slate-950/60 border-slate-800'
                }`}>
                  <div className="text-3xl">⏳</div>
                  <div className="text-xs font-bold text-white">5-Email Friction</div>
                  <div className="text-[10px] text-rose-300 font-mono font-bold">Scheduling Friction</div>
                </div>

                <div className="md:col-span-4 flex flex-col items-center justify-center space-y-2">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border-2 border-emerald-400 flex items-center justify-center text-2xl animate-pulse">
                    📅
                  </div>
                  <span className="text-[10px] text-emerald-300 font-bold font-mono">3 DOCTOR CALENDARS</span>
                </div>

                <div className={`md:col-span-4 p-4 rounded-2xl border text-center space-y-2 transition-all ${
                  stageKey === 'outcome' ? 'bg-emerald-950/70 border-emerald-400 scale-105 shadow-xl' : 'bg-slate-950/60 border-slate-800'
                }`}>
                  <AppointmentCharacter size="md" />
                  <div className="text-xs font-bold text-white">Slot Confirmed</div>
                  <div className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-500/20 py-1.5 rounded-lg border border-emerald-500/40">
                    ✅ CALENDAR LOCKED
                  </div>
                </div>
              </div>
            )}

          </div>
        ) : (
          <div className="rounded-3xl bg-[#030712] border-2 border-slate-800 p-6 min-h-[300px] font-mono text-xs text-slate-300 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-teal-400">
              <span className="flex items-center gap-2">
                <Terminal className="w-4 h-4" /> FORGE LIVE EXECUTION STREAM [{clip.sysId}]
              </span>
              <span className="text-[10px] text-slate-400">LATENCY: 14ms</span>
            </div>
            <div className="text-slate-400">[0.0s] Inbound trigger detected from external client...</div>
            <div className="text-rose-400">[0.8s] Event: {clip.dialogue.problem}</div>
            <div className="text-cyan-400">[2.1s] Policy check passed. AI Agent activated: {clip.productName}</div>
            <div className="text-amber-400">[3.2s] Action payload dispatched: {clip.dialogue.action}</div>
            <div className="text-emerald-400 font-bold">[4.9s] Success 200 OK: {clip.dialogue.outcome}</div>
            <div className="text-slate-400">[5.5s] System state persisted to persistent database ledger.</div>
          </div>
        )}

        {/* 📜 DYNAMIC SCENE SCRIPT & STORYBOARD BOX */}
        <div className={`p-6 rounded-2xl border-2 transition-all duration-300 ${stageBadgeColor}`}>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1.5">
            {stageKey === 'problem' && <span className="text-rose-400 font-mono">🚨 Stage 1: Bottleneck Occurs</span>}
            {stageKey === 'action' && <span className="font-mono">⚡ Stage 2: FORGE AI Autonomous Processing</span>}
            {stageKey === 'outcome' && <span className="text-emerald-400 font-mono">✅ Stage 3: Deterministic Business Outcome</span>}
          </div>
          <div className="text-sm sm:text-base font-bold text-white font-sans leading-relaxed">
            {stageText}
          </div>
        </div>

        {/* 🎛️ SCRUBBABLE TIMELINE PROGRESS BAR */}
        <div className="space-y-2">
          <div 
            onClick={(e) => {
              forgeAudioSynth.playClick();
              const rect = e.currentTarget.getBoundingClientRect();
              const clickPos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
              setCurrentTime(+(clickPos * duration).toFixed(2));
            }}
            className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800 cursor-pointer relative"
          >
            <div 
              className="h-full bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 transition-all duration-100 rounded-full shadow-lg shadow-teal-500/50"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-400 font-bold">
            <span 
              onClick={() => {
                forgeAudioSynth.playClick();
                setCurrentTime(0);
              }} 
              className={`cursor-pointer hover:text-white ${currentTime < 1.8 ? 'text-rose-400 font-black' : ''}`}
            >
              0.0s Problem
            </span>
            <span 
              onClick={() => {
                forgeAudioSynth.playClick();
                setCurrentTime(1.8);
              }} 
              className={`cursor-pointer hover:text-white ${currentTime >= 1.8 && currentTime < 3.8 ? 'text-cyan-400 font-black' : ''}`}
            >
              1.8s AI Works
            </span>
            <span 
              onClick={() => {
                forgeAudioSynth.playSuccess();
                setCurrentTime(3.8);
              }} 
              className={`cursor-pointer hover:text-white ${currentTime >= 3.8 ? 'text-emerald-400 font-black' : ''}`}
            >
              3.8s Outcome
            </span>
            <span>05.5s Complete</span>
          </div>
        </div>

        {/* ⏯️ CONTROLS & SANDBOX CTA */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePlay}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-dark-950 font-black flex items-center gap-2 transition-all shadow-lg shadow-teal-500/20 hover:scale-105"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'Pause Clip' : 'Play 5.5s Clip'}</span>
            </button>

            <button
              onClick={() => {
                forgeAudioSynth.playClick();
                setCurrentTime(0);
                setIsPlaying(true);
              }}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 transition-colors"
              title="Restart Clip"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onTryLive && (
              <button
                onClick={() => {
                  forgeAudioSynth.playSuccess();
                  onTryLive();
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-teal-300 border border-teal-500/50 font-bold flex items-center gap-2 transition-all hover:scale-105 shadow-md"
              >
                <span>Test Live in Sandbox</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 🚀 QUICK-SWITCH CLIP CAROUSEL BAR */}
        <div className="pt-3 border-t border-slate-800 space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Switch 5.5s Animated Clip:</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {Object.values(SYSTEM_ANIMATED_CLIPS).map((item) => {
              const isCur = item.id === activeClipId;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    forgeAudioSynth.playClick();
                    setActiveClipId(item.id);
                    setCurrentTime(0);
                    setIsPlaying(true);
                    if (onSelectSystem) onSelectSystem(item.sysId);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isCur
                      ? 'bg-teal-950/70 border-teal-400 text-white shadow-md shadow-teal-500/20 scale-[1.02] font-black'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <div className="text-[9px] font-bold text-teal-400 truncate">{item.tag}</div>
                  <div className="text-xs font-bold truncate text-white">{item.productName}</div>
                </button>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
