import React, { useState, useEffect } from 'react';
import { 
  X, Play, Pause, RotateCcw, CheckCircle2, 
  ArrowRight, ShieldCheck, Sparkles, Terminal, Volume2, VolumeX,
  Film, Check, Clock
} from 'lucide-react';
import { speechEngine } from '../../utils/speechEngine';
import { 
  ReceptionistCharacter, 
  LeadEngineCharacter, 
  SupportCharacter, 
  DocumentCharacter, 
  EmailCharacter, 
  AppointmentCharacter 
} from './v2/ForgeCharacterUniverse';

const MODAL_CLIPS = {
  'receptionist-agent': {
    title: 'AI Voice Receptionist (5.5s Animated Clip)',
    systemName: 'AI Voice Receptionist',
    Character: ReceptionistCharacter,
    problem: 'Alex calls after-hours at 10:45 PM: "Emergency root canal tomorrow?"',
    action: 'FORGE answers in 2s with voice NLP, confirms Delta Dental PPO, checks Dr. Evans operatory.',
    outcome: 'Saturday 11:00 AM locked. SMS sent & Dentrix updated in 18 seconds.'
  },
  'lead-agent': {
    title: 'Speed-to-Lead Engine (5.5s Animated Clip)',
    systemName: 'Speed-to-Lead Qualifier',
    Character: LeadEngineCharacter,
    problem: 'High-intent $1.4M commercial lead web form sits unread in inbox.',
    action: 'FORGE evaluates 0-100 ICP (Score: 96) and triggers 2-way SMS questionnaire.',
    outcome: 'Buyer confirms on mobile. Priority Broker tour locked in 38s.'
  },
  'document-processor': {
    title: 'Document & OCR Engine (5.5s Animated Clip)',
    systemName: 'Document & OCR Parser',
    Character: DocumentCharacter,
    problem: '120 PDF subcontractor invoices arrive with manual typing backlog.',
    action: 'Laser OCR extracts 14 line items & verifies mathematical tax sum ($4,290.00).',
    outcome: 'Synced to QuickBooks AP ledger with zero human calculation errors.'
  },
  'email-agent': {
    title: 'Autonomous Email Agent (5.5s Animated Clip)',
    systemName: 'Autonomous Email Agent',
    Character: EmailCharacter,
    problem: '300+ mixed emails flooding executive inbox causing delayed responses.',
    action: 'AI neural engine sorts into Hot Lead, Invoice, and VIP support buckets.',
    outcome: 'Contextual draft generated. 1-click human approved in 5 minutes.'
  },
  'support-agent': {
    title: 'Knowledge RAG Support Agent (5.5s Animated Clip)',
    systemName: 'Support & Knowledge Agent',
    Character: SupportCharacter,
    problem: 'Client asks complex early-termination SLA penalty query.',
    action: 'Vector engine scans 500-page Master Agreement with zero hallucination.',
    outcome: 'Delivered exact answer with page & paragraph citation in 12ms.'
  },
  'appointment-agent': {
    title: 'Appointment Booking Agent (5.5s Animated Clip)',
    systemName: 'Appointment Booking Agent',
    Character: AppointmentCharacter,
    problem: '5-email back-and-forth negotiation causing dropped bookings.',
    action: 'AI scans 3 doctor calendars and resolves timezone buffers in real-time.',
    outcome: 'Google Meet invite dispatched with prep notes & SMS reminder.'
  }
};

export function TenSecondDemoModal({ systemId, onClose, onTryLive }) {
  const clip = MODAL_CLIPS[systemId] || MODAL_CLIPS['receptionist-agent'];
  const Character = clip.Character;

  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const next = +(prev + 0.1).toFixed(2);
          if (next >= 5.5) return 0;
          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Voiceover narration
  useEffect(() => {
    if (!isVoiceActive || !isPlaying) return;
    if (currentTime >= 0.1 && currentTime <= 0.3) {
      speechEngine.speak(clip.problem, { accent: 'en-US' });
    } else if (currentTime >= 1.8 && currentTime <= 2.0) {
      speechEngine.speak(clip.action, { accent: 'en-US' });
    } else if (currentTime >= 3.8 && currentTime <= 4.0) {
      speechEngine.speak(clip.outcome, { accent: 'en-US' });
    }
  }, [Math.floor(currentTime * 10), isVoiceActive, isPlaying, clip]);

  let stageBadge = '0.0s - 1.8s: PROBLEM';
  let stageText = clip.problem;
  let stageColor = 'border-rose-500/50 bg-rose-950/40 text-rose-300';

  if (currentTime >= 1.8 && currentTime < 3.8) {
    stageBadge = '1.8s - 3.8s: AI REASONING';
    stageText = clip.action;
    stageColor = 'border-cyan-500/50 bg-cyan-950/40 text-cyan-300';
  } else if (currentTime >= 3.8) {
    stageBadge = '3.8s - 5.5s: RESULT LOCKED';
    stageText = clip.outcome;
    stageColor = 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300';
  }

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const progressPercent = Math.min((currentTime / 5.5) * 100, 100);

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-sans animate-fadeIn"
    >
      <div className="w-full max-w-2xl bg-[#090e18] border-2 border-teal-500/40 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col font-mono text-xs">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-[#060a12] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-teal-500/10 text-teal-400 border border-teal-500/30 font-bold uppercase flex items-center gap-1.5">
              <Film className="w-3 h-3 text-teal-400" /> 5.5s ANIMATED CLIP
            </span>
            <div className="text-sm font-bold text-white truncate max-w-[280px] sm:max-w-none">{clip.title}</div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-dark-900 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 5.5s Timeline Progress Bar */}
        <div className="w-full bg-dark-950 h-1.5 relative overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-teal-400 via-cyan-400 to-indigo-400 transition-all duration-100"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Visual Animated Stage */}
        <div className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col justify-between min-h-[320px] bg-[#070c14]">
          <div className="flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full border font-bold text-xs uppercase ${stageColor}`}>
              {stageBadge}
            </span>
            <span className="text-slate-400 font-mono text-xs font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              0{currentTime.toFixed(1)}s / 05.5s
            </span>
          </div>

          {/* Animated Center Character */}
          <div className="p-6 rounded-2xl bg-dark-950 border border-slate-800 flex flex-col items-center justify-center space-y-3 text-center">
            <Character size="lg" />
            <div className="text-xs font-bold text-teal-400 uppercase tracking-wider">
              {clip.systemName}
            </div>
            <p className="text-xs sm:text-sm text-slate-200 font-sans font-medium max-w-lg mx-auto leading-relaxed">
              {stageText}
            </p>
          </div>

          {/* 3-Stage Progress Indicators */}
          <div className="grid grid-cols-3 gap-2 font-mono text-[10px] text-center">
            <div className={`p-2 rounded-lg border transition-all ${currentTime < 1.8 ? 'border-rose-400 bg-rose-500/20 text-white font-bold' : 'border-slate-800 bg-slate-900/60 text-slate-400'}`}>
              01. Bottleneck Occurs
            </div>
            <div className={`p-2 rounded-lg border transition-all ${currentTime >= 1.8 && currentTime < 3.8 ? 'border-cyan-400 bg-cyan-500/20 text-white font-bold' : 'border-slate-800 bg-slate-900/60 text-slate-400'}`}>
              02. FORGE AI Reassembles
            </div>
            <div className={`p-2 rounded-lg border transition-all ${currentTime >= 3.8 ? 'border-emerald-400 bg-emerald-500/20 text-white font-bold' : 'border-slate-800 bg-slate-900/60 text-slate-400'}`}>
              03. Outcome Locked
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-[#060a12] border-t border-slate-800 flex items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3 py-1.5 bg-dark-900 text-slate-300 hover:text-white rounded-lg border border-slate-800 flex items-center gap-1.5"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            <button
              onClick={() => {
                if (isVoiceActive) {
                  speechEngine.stopSpeaking();
                  setIsVoiceActive(false);
                } else {
                  setIsVoiceActive(true);
                  speechEngine.speak(clip.problem, { accent: 'en-US' });
                }
              }}
              className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 ${isVoiceActive ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-dark-900 text-slate-400 border-slate-800'}`}
            >
              {isVoiceActive ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{isVoiceActive ? 'Voice ON' : 'Voice'}</span>
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              if (onTryLive) onTryLive(systemId);
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-dark-950 font-black rounded-xl text-xs transition-all shadow-md flex items-center gap-1.5"
          >
            <span>TEST IN LIVE SANDBOX</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
