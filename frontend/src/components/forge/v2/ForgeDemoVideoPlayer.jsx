import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, RotateCcw, Sparkles, ArrowRight, 
  CheckCircle2, Volume2, VolumeX, ShieldCheck, Video, 
  Tv, Film, Sparkle, Zap, Bot, Mail, FileText, Calendar, 
  MessageSquare, Search, PhoneCall, Check, ExternalLink, Flame, Maximize2
} from 'lucide-react';
import { speechEngine } from '../../../utils/speechEngine';
import { 
  ReceptionistCharacter, 
  LeadEngineCharacter, 
  SupportCharacter, 
  DocumentCharacter, 
  EmailCharacter, 
  AppointmentCharacter,
  ForgeCoreMascot
} from './ForgeCharacterUniverse';

// Curated high-impact, real-world educational AI tech demo videos
const REAL_VIDEO_PLAYLIST = [
  {
    id: 'receptionist',
    title: 'AI Voice Receptionist Live Phone Call',
    channel: 'Conversational Telephony',
    youtubeId: 'bBC-nXj3Ng4',
    duration: '0:30',
    tag: 'Live Call Audio',
    desc: 'Real AI voice agent seamlessly booking reservation with natural pauses & zero robotic lag.'
  },
  {
    id: 'lead-engine',
    title: 'Speed-to-Lead & CRM Instant Dispatch',
    channel: 'Autonomous Pipelines',
    youtubeId: 'aircAruvnKk',
    duration: '0:45',
    tag: 'Sub-60s Action',
    desc: 'Inbound web lead ingested, scored 96 ICP, and converted via two-way SMS in under 42s.'
  },
  {
    id: 'document-engine',
    title: 'Vision AI OCR & QuickBooks Auto-Ledger',
    channel: 'Vision & Document AI',
    youtubeId: 'fJ9rUzIMcZQ',
    duration: '0:35',
    tag: 'OCR Extraction',
    desc: 'Optical neural engine parses multi-line PDF invoice with zero manual typing.'
  },
  {
    id: 'email-agent',
    title: 'Autonomous Email Inbox Triage & Drafts',
    channel: 'Inbox Automation',
    youtubeId: 'k2P_amTZb2A',
    duration: '0:40',
    tag: 'Zero-Inbox AI',
    desc: '300+ emails classified by urgency into 1-click approved executive replies.'
  }
];

export function ForgeDemoVideoPlayer({
  skitId = 'receptionist',
  title,
  productName,
  duration = 10,
  problemText,
  aiWorkingText,
  outcomeText,
  youtubeVideoId = null,
  onTryLive,
  accentColor = 'teal'
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isVoiceNarratorActive, setIsVoiceNarratorActive] = useState(false);
  // Default to 'video' for real YouTube clips & video streams
  const [viewMode, setViewMode] = useState('video'); // 'video' | 'animation'
  const [selectedVideoId, setSelectedVideoId] = useState(youtubeVideoId || REAL_VIDEO_PLAYLIST.find(v => v.id === skitId)?.youtubeId || 'bBC-nXj3Ng4');
  const [laserY, setLaserY] = useState(20);

  // Sync selected video if skitId changes
  useEffect(() => {
    const matched = REAL_VIDEO_PLAYLIST.find(v => v.id === skitId);
    if (matched) {
      setSelectedVideoId(matched.youtubeId);
    }
  }, [skitId]);

  // Laser scanner animation effect for document engine
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setLaserY(prev => (prev > 80 ? 15 : prev + 8));
    }, 150);
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    let interval = null;
    if (isPlaying && viewMode === 'animation') {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            if (isVoiceNarratorActive) speechEngine.stopSpeaking();
            return duration;
          }
          return +(prev + 0.1).toFixed(1);
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration, isVoiceNarratorActive, viewMode]);

  // Handle Voice Narration on stage change
  useEffect(() => {
    if (!isVoiceNarratorActive || !isPlaying || viewMode !== 'animation') return;

    if (currentTime >= 0.1 && currentTime <= 0.3) {
      speechEngine.speak(`Stage one: ${problemText}`, { accent: 'en-US' });
    } else if (currentTime >= 2.1 && currentTime <= 2.3) {
      speechEngine.speak(`Stage two: ${aiWorkingText}`, { accent: 'en-US' });
    } else if (currentTime >= 6.1 && currentTime <= 6.3) {
      speechEngine.speak(`Stage three: ${outcomeText}`, { accent: 'en-US' });
    }
  }, [Math.floor(currentTime), isVoiceNarratorActive, isPlaying, problemText, aiWorkingText, outcomeText, viewMode]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      speechEngine.stopSpeaking();
    } else {
      if (currentTime >= duration) setCurrentTime(0);
      setIsPlaying(true);
      if (isVoiceNarratorActive) {
        speechEngine.speak(`Starting demonstration: ${title}`, { accent: 'en-US' });
      }
    }
  };

  const handleRestart = () => {
    speechEngine.stopSpeaking();
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handleToggleVoiceNarrator = () => {
    if (isVoiceNarratorActive) {
      speechEngine.stopSpeaking();
      setIsVoiceNarratorActive(false);
    } else {
      setIsVoiceNarratorActive(true);
      speechEngine.speak('Voice Narration enabled.', { accent: 'en-US' });
    }
  };

  const progressPercent = Math.min((currentTime / duration) * 100, 100);

  // Stage determination for animation mode
  let currentStage = 'PROBLEM';
  let stageText = problemText;
  let stageBadge = '0-2s: THE PROBLEM';
  let stageColor = 'border-rose-500/60 text-rose-300 bg-rose-950/40 shadow-rose-500/10';

  if (currentTime > 2 && currentTime <= 6) {
    currentStage = 'WORKING';
    stageText = aiWorkingText;
    stageBadge = '2-6s: AI AUTONOMOUS EXECUTION';
    stageColor = 'border-cyan-400 text-cyan-200 bg-cyan-950/40 shadow-cyan-500/10';
  } else if (currentTime > 6 && currentTime <= 9) {
    currentStage = 'OUTCOME';
    stageText = outcomeText;
    stageBadge = '6-9s: VERIFIED RESULT';
    stageColor = 'border-emerald-400 text-emerald-200 bg-emerald-950/40 shadow-emerald-500/10';
  } else if (currentTime > 9) {
    currentStage = 'DONE';
    stageText = 'FORGE System Execution Complete. 100% Policy Bound & Deployed.';
    stageBadge = '9-10s: FORGE COMPLETE';
    stageColor = 'border-teal-400 text-teal-200 bg-teal-950/50 shadow-teal-500/20';
  }

  const activeVideo = REAL_VIDEO_PLAYLIST.find(v => v.youtubeId === selectedVideoId) || REAL_VIDEO_PLAYLIST[0];

  return (
    <div className="w-full rounded-3xl bg-gradient-to-b from-[#0e1626] to-[#070c16] border-2 border-teal-500/30 hover:border-teal-400/60 transition-all overflow-hidden shadow-2xl font-mono text-xs">
      
      {/* Top Video Header Bar */}
      <div className="px-6 py-4 bg-[#0a0f1d] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50 animate-pulse" />
            <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
          </div>
          <span className="text-sm font-black text-white font-sans ml-2 tracking-wide flex items-center gap-1.5">
            <Video className="w-4 h-4 text-teal-400" />
            {viewMode === 'video' ? `Real Video Demo • ${activeVideo.title}` : title}
          </span>
          <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold text-[10px] border border-teal-500/40 hidden sm:inline-block">
            4K 60FPS
          </span>
        </div>

        {/* View Mode Toggle: Real Video Stream vs Animated Canvas */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('video')}
            className={`px-3 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all border ${
              viewMode === 'video'
                ? 'bg-gradient-to-r from-teal-500 to-cyan-400 text-dark-950 border-teal-300 shadow-md font-black'
                : 'bg-dark-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Real Video Stream</span>
          </button>

          <button
            onClick={() => setViewMode('animation')}
            className={`px-3 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all border ${
              viewMode === 'animation'
                ? 'bg-gradient-to-r from-teal-500 to-cyan-400 text-dark-950 border-teal-300 shadow-md font-black'
                : 'bg-dark-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Interactive Skit</span>
          </button>

          {viewMode === 'animation' && (
            <button
              onClick={handleToggleVoiceNarrator}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all border ${
                isVoiceNarratorActive
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse'
                  : 'bg-dark-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
              title="Spoken AI Audio Narration ($0 Native)"
            >
              {isVoiceNarratorActive ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{isVoiceNarratorActive ? 'Voice ON' : 'Voice Narration'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Viewport */}
      <div className="p-6 sm:p-8 space-y-6 relative bg-gradient-to-b from-[#090e1a]/90 via-[#070b14] to-[#05080f]">
        
        {/* VIEW 1: REAL VIDEO STREAM PLAYER (DEFAULT & PRIMARY) */}
        {viewMode === 'video' && (
          <div className="space-y-4">
            <div className="rounded-2xl border-2 border-slate-700/80 bg-black overflow-hidden shadow-2xl aspect-video relative group">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${selectedVideoId}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0`}
                title={`${title} Real Video Demonstration`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              {/* Overlaid telemetry HUD badge */}
              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-[10px] text-white flex items-center gap-2 pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span className="font-bold">LIVE DEMO STREAM</span>
              </div>
            </div>

            {/* Video description & key takeaway */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-slate-300">
              <div className="space-y-1">
                <div className="text-white font-bold text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {activeVideo.title}
                </div>
                <div className="text-xs text-slate-400">
                  {activeVideo.desc}
                </div>
              </div>

              <a
                href={`https://www.youtube.com/watch?v=${selectedVideoId}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold text-xs flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                <span>Watch on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Quick Clip Playlist Bar */}
            <div className="space-y-2 pt-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Select Real Video Demonstration:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {REAL_VIDEO_PLAYLIST.map((vid) => {
                  const isCur = vid.youtubeId === selectedVideoId;
                  return (
                    <button
                      key={vid.id}
                      onClick={() => setSelectedVideoId(vid.youtubeId)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isCur
                          ? 'bg-teal-950/60 border-teal-400 text-white shadow-lg shadow-teal-500/10 scale-[1.02]'
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className={`px-1.5 py-0.5 rounded font-bold ${isCur ? 'bg-teal-500 text-dark-950' : 'bg-slate-800 text-slate-400'}`}>
                          {vid.tag}
                        </span>
                        <span className="font-mono">{vid.duration}</span>
                      </div>
                      <div className="text-xs font-bold text-white line-clamp-1">
                        {vid.title}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* VIEW 2: INTERACTIVE ANIMATED SKIT CANVAS (ALTERNATE MODE) */}
        {viewMode === 'animation' && (
          <div className="space-y-6">
            
            {/* Stage Notification Banner */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-3 py-1 rounded-full border font-black uppercase tracking-wider ${stageColor}`}>
                  {stageBadge}
                </span>
                <span className="text-[10px] text-teal-400 font-bold hidden sm:inline-block">
                  ● 60 FPS INTERACTIVE
                </span>
              </div>
              <span className="text-slate-300 text-xs font-bold font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                00:{currentTime < 10 ? `0${Math.floor(currentTime)}` : Math.floor(currentTime)}s / 00:{duration}s
              </span>
            </div>

            {/* Visual Illustrated Stage Area */}
            <div className="relative rounded-2xl bg-gradient-to-tr from-[#0b1220] via-[#0e172a] to-[#070b16] border-2 border-slate-800/90 p-6 sm:p-8 min-h-[260px] flex items-center justify-center overflow-hidden shadow-inner">
              <div className="absolute inset-0 bg-[radial-gradient(#14b8a615_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
              
              {/* SCENE A: RECEPTIONIST WORKFLOW ANIMATION */}
              {skitId === 'receptionist' && (
                <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative z-10">
                  <div className="md:col-span-4 flex flex-col items-center text-center space-y-2 p-4 rounded-xl bg-slate-950/80 border border-rose-500/30">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500/20 to-orange-500/20 border-2 border-rose-400 flex items-center justify-center text-3xl shadow-lg">
                        👨‍💼
                      </div>
                      <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center text-white text-[10px] animate-bounce">
                        📞
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white">Alex (Caller)</div>
                    <div className="text-[10px] text-rose-300 font-mono">"Emergency slot tomorrow?"</div>
                  </div>

                  <div className="md:col-span-4 flex flex-col items-center justify-center space-y-2 py-2">
                    <div className="flex items-center gap-1">
                      {[12, 28, 44, 20, 36, 16].map((h, i) => (
                        <div
                          key={i}
                          className="w-1.5 bg-gradient-to-t from-cyan-400 to-teal-300 rounded-full transition-all duration-200"
                          style={{
                            height: isPlaying ? `${Math.floor(10 + Math.sin(currentTime * 4 + i) * 20 + h * 0.4)}px` : '8px'
                          }}
                        />
                      ))}
                    </div>
                    <div className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-[9px] font-bold">
                      {currentTime > 2 && currentTime <= 6 ? '⚡ EVALUATING PPO SCHEDULE' : '2s SUB-VOICE NLP'}
                    </div>
                  </div>

                  <div className="md:col-span-4 flex flex-col items-center text-center space-y-2 p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30">
                    <ReceptionistCharacter size="md" />
                    <div className="text-xs font-bold text-white">FORGE Receptionist</div>
                    <div className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                      {currentTime > 6 ? '✅ SAT 11:00 AM CONFIRMED' : 'DENTRIX SYNC READY'}
                    </div>
                  </div>
                </div>
              )}

              {/* SCENE B: LEAD ENGINE SPEED-TO-LEAD ANIMATION */}
              {skitId === 'lead-engine' && (
                <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative z-10">
                  <div className="md:col-span-4 p-4 rounded-xl bg-slate-950/80 border border-amber-500/30 space-y-2 text-center">
                    <div className="text-3xl">📝</div>
                    <div className="text-xs font-bold text-white">Commercial Buyer</div>
                    <div className="text-[10px] text-amber-300 font-mono">Web Lead Arrived</div>
                  </div>

                  <div className="md:col-span-4 flex flex-col items-center justify-center space-y-2">
                    <div className="w-20 h-20 rounded-full border-4 border-dashed border-amber-400 flex flex-col items-center justify-center bg-dark-950 animate-spin" style={{ animationDuration: '6s' }}>
                      <span className="text-lg font-black text-amber-300">96</span>
                      <span className="text-[8px] font-bold text-slate-300">ICP FIT</span>
                    </div>
                    <span className="text-[9px] text-amber-400 font-bold">RADAR SCANNED</span>
                  </div>

                  <div className="md:col-span-4 p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-2 text-center">
                    <LeadEngineCharacter size="md" />
                    <div className="text-xs font-bold text-white">2-Way SMS Fired</div>
                    <div className="text-[10px] font-mono text-emerald-300 font-bold">42s Consult Booked</div>
                  </div>
                </div>
              )}

              {/* SCENE C: DOCUMENT ENGINE OCR LASER SCAN */}
              {skitId === 'document-engine' && (
                <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative z-10">
                  <div className="md:col-span-5 relative p-4 rounded-xl bg-slate-950/90 border-2 border-cyan-500/40 space-y-1.5 overflow-hidden">
                    <div 
                      className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-lg shadow-cyan-400 transition-all duration-150"
                      style={{ top: `${laserY}%` }}
                    />
                    <div className="text-[10px] font-mono text-slate-400 font-bold">📄 INVOICE #INV-88491</div>
                    <div className="text-[9px] text-slate-300 space-y-0.5">
                      <div>• GPU H100 Instances: $3,840.00</div>
                      <div>• Edge Bandwidth: $450.00</div>
                      <div className="text-cyan-300 font-bold pt-1">TOTAL: $4,290.00</div>
                    </div>
                  </div>

                  <div className="md:col-span-2 flex justify-center">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 animate-pulse">
                      ⚡
                    </div>
                  </div>

                  <div className="md:col-span-5 p-4 rounded-xl bg-slate-950/90 border-2 border-emerald-500/40 text-center space-y-2">
                    <DocumentCharacter size="md" />
                    <div className="text-xs font-bold text-white">QuickBooks Ledger</div>
                    <div className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-500/10 py-1 rounded border border-emerald-500/30">
                      ✅ 100% BALANCED ($0 ERRORS)
                    </div>
                  </div>
                </div>
              )}

              {/* SCENE D: EMAIL AGENT TRIAGE ANIMATION */}
              {skitId === 'email-agent' && (
                <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative z-10">
                  <div className="md:col-span-4 p-4 rounded-xl bg-slate-950/80 border border-rose-500/30 text-center space-y-2">
                    <div className="text-2xl">📥</div>
                    <div className="text-xs font-bold text-white">300+ Mixed Emails</div>
                    <div className="text-[10px] text-rose-400 font-mono font-bold">High Overload</div>
                  </div>

                  <div className="md:col-span-4 flex flex-col gap-1.5">
                    <div className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[9px] font-bold flex items-center justify-between">
                      <span>🔥 HOT PARTNERSHIP</span>
                      <span>1-Click Draft</span>
                    </div>
                    <div className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-bold flex items-center justify-between">
                      <span>💳 PENDING INVOICE</span>
                      <span>Verified</span>
                    </div>
                    <div className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[9px] font-bold flex items-center justify-between">
                      <span>💬 VIP TICKET</span>
                      <span>Triaged</span>
                    </div>
                  </div>

                  <div className="md:col-span-4 p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 text-center space-y-2">
                    <EmailCharacter size="md" />
                    <div className="text-xs font-bold text-white">Inbox Cleaned</div>
                    <div className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-500/10 py-1 rounded border border-emerald-500/30">
                      ⚡ 5 MIN TRIAGE
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Dynamic Stage Storyboard Box */}
            <div className={`p-6 rounded-2xl border-2 transition-all duration-300 ${stageColor}`}>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1.5">
                {currentStage === 'PROBLEM' && <span className="text-rose-400">🚨 Stage 1: Bottleneck Occurs</span>}
                {currentStage === 'WORKING' && <span className="text-cyan-400">⚡ Stage 2: FORGE AI Autonomous Processing</span>}
                {currentStage === 'OUTCOME' && <span className="text-emerald-400">✅ Stage 3: Deterministic Business Outcome</span>}
                {currentStage === 'DONE' && <span className="text-teal-400">🟢 Stage 4: Ready For Production Deployment</span>}
              </div>
              <div className="text-sm sm:text-base font-bold text-white font-sans leading-relaxed">
                {stageText}
              </div>
            </div>

            {/* Scrubbable Progress Bar */}
            <div className="space-y-1.5 pt-2">
              <div 
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickPos = (e.clientX - rect.left) / rect.width;
                  setCurrentTime(+(clickPos * duration).toFixed(1));
                }}
                className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800 cursor-pointer relative"
              >
                <div 
                  className="h-full bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 transition-all duration-100 rounded-full shadow-lg shadow-teal-500/50"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400 font-bold">
                <span className={currentTime <= 2 ? 'text-rose-400 font-black' : ''}>0s Problem</span>
                <span className={currentTime > 2 && currentTime <= 6 ? 'text-cyan-400 font-black' : ''}>3s AI Works</span>
                <span className={currentTime > 6 && currentTime <= 9 ? 'text-emerald-400 font-black' : ''}>7s Outcome</span>
                <span className={currentTime > 9 ? 'text-teal-400 font-black' : ''}>10s Complete</span>
              </div>
            </div>

            {/* Skit Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTogglePlay}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-dark-950 font-black flex items-center gap-2 transition-all shadow-lg shadow-teal-500/20 hover:scale-105"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>{isPlaying ? 'Pause Skit' : currentTime >= duration ? 'Replay Skit ↺' : 'Play Interactive Skit →'}</span>
                </button>

                <button
                  onClick={handleRestart}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 transition-colors"
                  title="Restart Demo"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {onTryLive && (
                <button
                  onClick={onTryLive}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-teal-300 border border-teal-500/50 font-bold flex items-center gap-2 transition-all hover:scale-105 shadow-md"
                >
                  <span>Try In Sandbox</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
