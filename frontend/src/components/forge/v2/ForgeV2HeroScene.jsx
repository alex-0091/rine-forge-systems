import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Play, Pause, Sparkles, Bot, Calendar, 
  CheckCircle2, MessageSquare, Database, Send, PhoneCall, 
  RefreshCw, ShieldCheck, Flame, Zap, ArrowUpRight, Volume2, VolumeX,
  Clock, User, Smartphone, Building2, FileText, Mail, HelpCircle, CheckCheck,
  Eye, HandMetal, Rocket
} from 'lucide-react';
import { 
  ReceptionistCharacter, 
  LeadEngineCharacter, 
  SupportCharacter, 
  DocumentCharacter, 
  EmailCharacter, 
  AppointmentCharacter,
  ForgeCoreMascot,
  BusinessOwnerAvatar
} from './ForgeCharacterUniverse';
import { speechEngine } from '../../../utils/speechEngine';
import { forgeAudioSynth } from '../../../utils/forgeAudioSynth';

const FORGE_HERO_SCENES = [
  {
    step: 1,
    time: '0s - 2.5s',
    title: 'Scene 1: The Business Gets Overwhelmed (Chaos)',
    badge: 'STAGE 1: CHAOS ARRIVES',
    color: 'border-rose-500/80 text-rose-300 bg-rose-950/40 shadow-rose-500/20',
    ownerMood: 'overwhelmed',
    spokenText: 'Scene one: A business owner is swamped. Phone ringing after hours, website leads waiting, 120 invoices piled up, 300 unread emails, and double-booked calendar slots.',
    subtitles: 'Calls ring to voicemail, unread web leads wait 48 hours, stacks of subcontractor invoices pile up, and inboxes overflow.'
  },
  {
    step: 2,
    time: '2.5s - 5.0s',
    title: 'Scene 2: FORGE Autonomous Operating System Enters',
    badge: 'STAGE 2: FORGE ENTERS',
    color: 'border-cyan-400 text-cyan-300 bg-cyan-950/40 shadow-cyan-500/20',
    ownerMood: 'neutral',
    spokenText: 'Scene two: FORGE autonomous AI operators appear. Not a chatbot, but six specialized autonomous agents ready to route every business event.',
    subtitles: 'Friendly, policy-bound AI operators connect directly to your phone lines, CRM, QuickBooks, and email inboxes.'
  },
  {
    step: 3,
    time: '5.0s - 7.5s',
    title: 'Scene 3: Real-Time Work Routing Across 6 Systems',
    badge: 'STAGE 3: INSTANT WORK ROUTING',
    color: 'border-violet-400 text-violet-300 bg-violet-950/40 shadow-violet-500/20',
    ownerMood: 'neutral',
    spokenText: 'Scene three: Work is routed instantly. Phone goes to Cyan Receptionist. Web leads to Violet Lead Engine. Invoices to Orange Document Engine. Emails to Magenta Agent. Bookings to Green Calendar.',
    subtitles: '📞 Call → 🔵 Receptionist | 🎯 Lead → 🟣 Lead Engine | 📄 Invoice → 🟠 Document Engine | 📩 Email → 🩷 Email Agent | 📅 Calendar → 🟢 Appointment'
  },
  {
    step: 4,
    time: '7.5s - 10.0s',
    title: 'Scene 4: Deterministic Order & Work Handled',
    badge: 'STAGE 4: WORK COMPLETED',
    color: 'border-emerald-400 text-emerald-300 bg-emerald-950/40 shadow-emerald-500/20',
    ownerMood: 'relieved',
    spokenText: 'Scene four: Zero dropped calls. 38 second lead response. Invoices validated in QuickBooks. Inbox triaged. The owner receives one notification: Work Handled.',
    subtitles: 'All customer calls answered. Every lead qualified. Invoices synced to QuickBooks. The owner is notified: WORK HANDLED.'
  }
];

export function ForgeV2HeroScene({ onNavigate, onLaunchSystemDemo, onWatchTenSecDemo }) {
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVoiceNarratorActive, setIsVoiceNarratorActive] = useState(false);
  const [sceneSpeed, setSceneSpeed] = useState(1);

  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveStepIdx(prev => {
          const next = (prev + 1) % FORGE_HERO_SCENES.length;
          if (next === 0) forgeAudioSynth.playPhoneRing();
          else if (next === 1) forgeAudioSynth.playWarp();
          else if (next === 2) forgeAudioSynth.playScan();
          else if (next === 3) forgeAudioSynth.playSuccess();

          if (isVoiceNarratorActive) {
            speechEngine.speak(FORGE_HERO_SCENES[next].spokenText, { accent: 'en-US' });
          }
          return next;
        });
      }, Math.floor(3200 / sceneSpeed));
    }
    return () => clearInterval(interval);
  }, [isPlaying, isVoiceNarratorActive, sceneSpeed]);

  const handleToggleVoice = () => {
    forgeAudioSynth.playClick();
    if (isVoiceNarratorActive) {
      speechEngine.stopSpeaking();
      setIsVoiceNarratorActive(false);
    } else {
      setIsVoiceNarratorActive(true);
      speechEngine.speak('Live FORGE World voice narration enabled. ' + FORGE_HERO_SCENES[activeStepIdx].spokenText, { accent: 'en-US' });
    }
  };

  const currentScene = FORGE_HERO_SCENES[activeStepIdx];

  return (
    <section className="relative pt-8 sm:pt-14 pb-20 sm:pb-28 border-b border-slate-800/80 bg-[#060a12] overflow-hidden" id="forge-hero">
      
      {/* Ambient Lighting Aura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-r from-teal-500/15 via-cyan-500/10 to-indigo-500/15 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b08_1px,transparent_1px),linear-gradient(to_bottom,#1e293b08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Top Header Statement */}
        <div className="text-center space-y-5 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold tracking-wider uppercase shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" /> THE VISUAL AI SYSTEMS SHOWROOM
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.06] font-sans">
            AI SYSTEMS THAT <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-cyan-300 to-indigo-400">
              DO THE ACTUAL WORK.
            </span>
          </h1>

          <p className="text-lg sm:text-2xl text-slate-200 font-bold max-w-2xl mx-auto leading-relaxed">
            See them work. Touch them. Experience them.
          </p>

          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto font-normal">
            No robotic walls of text. Watch our 6 autonomous AI systems answer calls, capture leads, parse invoices, and triage emails in real time.
          </p>

          {/* 🌟 THE CORE COMMERCIAL FUNNEL: 👁 WATCH • 🖐 TRY • 🚀 DEPLOY */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3 font-mono text-xs">
            
            {/* 1. 👁 WATCH */}
            <button
              onClick={() => {
                forgeAudioSynth.playClick();
                const el = document.getElementById('watch-demos');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else if (onWatchTenSecDemo) onWatchTenSecDemo('receptionist-agent');
              }}
              className="w-full sm:w-auto px-6 py-4 bg-slate-900 hover:bg-slate-850 text-cyan-300 border-2 border-cyan-500/60 font-bold rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 hover:scale-105"
            >
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>👁 WATCH 10-SEC DEMOS</span>
            </button>

            {/* 2. 🖐 TRY */}
            <button
              onClick={() => {
                forgeAudioSynth.playSuccess();
                const el = document.getElementById('command-center');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else if (onNavigate) onNavigate('command-center');
              }}
              className="w-full sm:w-auto px-7 py-4 bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-dark-950 font-black rounded-2xl transition-all shadow-xl shadow-teal-500/25 flex items-center justify-center gap-2 hover:scale-105"
            >
              <HandMetal className="w-4 h-4" />
              <span>🖐 TOUCH & TRY LIVE</span>
            </button>

            {/* 3. 🚀 DEPLOY */}
            <button
              onClick={() => {
                forgeAudioSynth.playClick();
                const el = document.getElementById('build-business');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else if (onNavigate) onNavigate('build-business');
              }}
              className="w-full sm:w-auto px-6 py-4 bg-[#090e18] hover:bg-dark-850 text-slate-200 border border-slate-700 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 hover:scale-105"
            >
              <Rocket className="w-4 h-4 text-amber-400" />
              <span>🚀 BUILD MY BUSINESS AI</span>
            </button>
          </div>
        </div>

        {/* 🎬 CENTERPIECE: THE ANIMATED "FORGE WORLD" ENVIRONMENT */}
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-[#0b1324]/95 via-[#080e1a]/95 to-[#060a12]/95 border-2 border-teal-500/40 shadow-2xl space-y-8 relative overflow-hidden backdrop-blur-md">
          
          {/* Top Scene Timeline Indicator */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <div>
                <div className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="text-teal-400">● THE LIVING FORGE BUSINESS WORLD</span>
                  <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-black ${currentScene.color}`}>
                    {currentScene.badge}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">Scene 0{activeStepIdx + 1} of 04 • Continuous Business Animation</div>
              </div>
            </div>

            {/* Step Selector & Voiceover Narration */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <button
                onClick={() => {
                  forgeAudioSynth.playClick();
                  setSceneSpeed(s => (s === 1 ? 1.5 : s === 1.5 ? 2 : 1));
                }}
                className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-mono text-[10px] font-bold"
                title="Scene Playback Speed"
              >
                {sceneSpeed}x Speed
              </button>

              <button
                onClick={handleToggleVoice}
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all ${
                  isVoiceNarratorActive
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse'
                    : 'bg-dark-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
                title="Spoken Voiceover Narration"
              >
                {isVoiceNarratorActive ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{isVoiceNarratorActive ? 'Voice ON' : 'Voiceover'}</span>
              </button>

              <button
                onClick={() => {
                  forgeAudioSynth.playClick();
                  setIsPlaying(!isPlaying);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center gap-1.5"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400 fill-current" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
            </div>
          </div>

          {/* 🌟 THE ANIMATED STAGE */}
          <div className="relative rounded-3xl bg-gradient-to-tr from-[#070d18] via-[#0b1426] to-[#050912] border-2 border-slate-800 p-6 sm:p-10 min-h-[360px] flex flex-col justify-between overflow-hidden shadow-inner">
            
            {/* 3D Background Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#06b6d415_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-80" />
            
            {/* Top Scene Subtitle */}
            <div className="relative z-10 text-center max-w-2xl mx-auto space-y-1">
              <div className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider">
                {currentScene.title}
              </div>
              <p className="text-sm sm:text-base text-white font-sans font-bold leading-relaxed">
                {currentScene.subtitles}
              </p>
            </div>

            {/* Central Animated Scene Arena */}
            <div className="relative z-10 py-6">
              
              {/* SCENE 1: OVERWHELMED CHAOS */}
              {activeStepIdx === 0 && (
                <div className="flex flex-col items-center justify-center space-y-6 animate-fadeIn">
                  <div className="relative">
                    <BusinessOwnerAvatar size="lg" mood="overwhelmed" />
                    
                    {/* Floating incoming chaos notifications around the owner */}
                    <div className="absolute -top-4 -left-20 px-3 py-1.5 rounded-xl bg-rose-500/20 border-2 border-rose-400 text-rose-300 text-xs font-mono font-bold animate-bounce flex items-center gap-1.5 shadow-lg">
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>📞 MISSED CALL (10:45 PM)</span>
                    </div>

                    <div className="absolute -top-4 -right-20 px-3 py-1.5 rounded-xl bg-amber-500/20 border-2 border-amber-400 text-amber-300 text-xs font-mono font-bold animate-bounce delay-100 flex items-center gap-1.5 shadow-lg">
                      <Zap className="w-3.5 h-3.5" />
                      <span>🎯 $1.4M UNREAD LEAD</span>
                    </div>

                    <div className="absolute -bottom-4 -left-24 px-3 py-1.5 rounded-xl bg-orange-500/20 border-2 border-orange-400 text-orange-300 text-xs font-mono font-bold animate-pulse flex items-center gap-1.5 shadow-lg">
                      <FileText className="w-3.5 h-3.5" />
                      <span>📄 120 PDF INVOICES</span>
                    </div>

                    <div className="absolute -bottom-4 -right-24 px-3 py-1.5 rounded-xl bg-pink-500/20 border-2 border-pink-400 text-pink-300 text-xs font-mono font-bold animate-pulse delay-75 flex items-center gap-1.5 shadow-lg">
                      <Mail className="w-3.5 h-3.5" />
                      <span>📩 300+ CHAOTIC EMAILS</span>
                    </div>
                  </div>
                  <div className="text-xs font-mono text-rose-400 font-bold bg-rose-950/60 px-4 py-1.5 rounded-full border border-rose-500/40">
                    🚨 RESULT: $45,000/YR LOST IN MISSED APPOINTMENTS & DELAYED REPLIES
                  </div>
                </div>
              )}

              {/* SCENE 2: FORGE ENTERS */}
              {activeStepIdx === 1 && (
                <div className="flex flex-col items-center justify-center space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-center gap-4 flex-wrap">
                    <ForgeCoreMascot size="lg" state="reasoning" />
                    <div className="text-center sm:text-left space-y-1 max-w-sm">
                      <div className="text-lg font-black text-white font-sans">
                        "Give the repetitive work to FORGE."
                      </div>
                      <p className="text-xs text-slate-300 font-sans">
                        Six specialized autonomous AI operators ready to ingest, evaluate, and execute 24/7 without human fatigue.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    <div className="px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400 text-[10px] font-mono font-bold">🔵 RECEPTIONIST</div>
                    <div className="px-3 py-1 rounded-xl bg-violet-500/20 text-violet-300 border border-violet-400 text-[10px] font-mono font-bold">🟣 LEAD ENGINE</div>
                    <div className="px-3 py-1 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400 text-[10px] font-mono font-bold">🔷 SUPPORT RAG</div>
                    <div className="px-3 py-1 rounded-xl bg-orange-500/20 text-orange-300 border border-orange-400 text-[10px] font-mono font-bold">🟠 DOCUMENT OCR</div>
                    <div className="px-3 py-1 rounded-xl bg-pink-500/20 text-pink-300 border border-pink-400 text-[10px] font-mono font-bold">🩷 EMAIL AGENT</div>
                    <div className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400 text-[10px] font-mono font-bold">🟢 APPOINTMENTS</div>
                  </div>
                </div>
              )}

              {/* SCENE 3: WORK ROUTING BY COLOR */}
              {activeStepIdx === 2 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 w-full max-w-4xl mx-auto animate-fadeIn">
                  {/* 🔵 Receptionist */}
                  <div className="p-3.5 rounded-2xl bg-[#081824] border-2 border-cyan-400 text-center space-y-2 shadow-lg shadow-cyan-500/20">
                    <ReceptionistCharacter size="sm" />
                    <div className="text-[10px] font-mono font-black text-cyan-300">🔵 RECEPTIONIST</div>
                    <div className="text-[9px] text-slate-300 font-sans">📞 Answers in 2s</div>
                  </div>

                  {/* 🟣 Lead Engine */}
                  <div className="p-3.5 rounded-2xl bg-[#180d28] border-2 border-violet-400 text-center space-y-2 shadow-lg shadow-violet-500/20">
                    <LeadEngineCharacter size="sm" />
                    <div className="text-[10px] font-mono font-black text-violet-300">🟣 LEAD ENGINE</div>
                    <div className="text-[9px] text-slate-300 font-sans">🎯 38s SMS VIP Tour</div>
                  </div>

                  {/* 🔷 Support Agent */}
                  <div className="p-3.5 rounded-2xl bg-[#0c1628] border-2 border-blue-400 text-center space-y-2 shadow-lg shadow-blue-500/20">
                    <SupportCharacter size="sm" />
                    <div className="text-[10px] font-mono font-black text-blue-300">🔷 SUPPORT RAG</div>
                    <div className="text-[9px] text-slate-300 font-sans">💬 0% Hallucination</div>
                  </div>

                  {/* 🟠 Document Engine */}
                  <div className="p-3.5 rounded-2xl bg-[#241208] border-2 border-orange-400 text-center space-y-2 shadow-lg shadow-orange-500/20">
                    <DocumentCharacter size="sm" />
                    <div className="text-[10px] font-mono font-black text-orange-300">🟠 DOCUMENT OCR</div>
                    <div className="text-[9px] text-slate-300 font-sans">📄 $0 Typing Errors</div>
                  </div>

                  {/* 🩷 Email Agent */}
                  <div className="p-3.5 rounded-2xl bg-[#240818] border-2 border-pink-400 text-center space-y-2 shadow-lg shadow-pink-500/20">
                    <EmailCharacter size="sm" />
                    <div className="text-[10px] font-mono font-black text-pink-300">🩷 EMAIL AGENT</div>
                    <div className="text-[9px] text-slate-300 font-sans">📩 5 Min Triage</div>
                  </div>

                  {/* 🟢 Appointment Agent */}
                  <div className="p-3.5 rounded-2xl bg-[#082414] border-2 border-emerald-400 text-center space-y-2 shadow-lg shadow-emerald-500/20">
                    <AppointmentCharacter size="sm" />
                    <div className="text-[10px] font-mono font-black text-emerald-300">🟢 APPOINTMENT</div>
                    <div className="text-[9px] text-slate-300 font-sans">📅 Calendar Locked</div>
                  </div>
                </div>
              )}

              {/* SCENE 4: WORK HANDLED (ORDER & RELIEF) */}
              {activeStepIdx === 3 && (
                <div className="flex flex-col items-center justify-center space-y-5 animate-fadeIn text-center">
                  <BusinessOwnerAvatar size="lg" mood="relieved" />
                  
                  <div className="p-4 rounded-2xl bg-emerald-950/80 border-2 border-emerald-400 text-emerald-200 space-y-1 shadow-2xl shadow-emerald-500/20 max-w-md">
                    <div className="text-xs font-mono font-black uppercase tracking-wider flex items-center justify-center gap-1.5 text-emerald-300">
                      <CheckCheck className="w-4 h-4" />
                      <span>FORGE NOTIFICATION: WORK HANDLED.</span>
                    </div>
                    <p className="text-xs font-sans text-slate-200">
                      Dentrix booked • $1.4M lead qualified • 120 invoices synced to QuickBooks AP with zero errors.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-xs">
                    <button
                      onClick={() => {
                        forgeAudioSynth.playClick();
                        const el = document.getElementById('watch-demos');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-5 py-2.5 bg-teal-500 text-dark-950 font-black rounded-xl hover:bg-teal-400 transition-all shadow-md"
                    >
                      WATCH 10-SEC DEMOS →
                    </button>
                    <button
                      onClick={() => {
                        forgeAudioSynth.playSuccess();
                        const el = document.getElementById('command-center');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-5 py-2.5 bg-slate-900 text-cyan-300 border border-cyan-500/40 font-bold rounded-xl hover:bg-slate-800 transition-all"
                    >
                      TOUCH COMMAND CENTER
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom 4-Scene Selector Strip */}
            <div className="grid grid-cols-4 gap-2 font-mono text-[10px] text-center pt-4 border-t border-slate-800/80">
              {FORGE_HERO_SCENES.map((sc, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    forgeAudioSynth.playClick();
                    setActiveStepIdx(idx);
                    setIsPlaying(false);
                    if (isVoiceNarratorActive) {
                      speechEngine.speak(sc.spokenText, { accent: 'en-US' });
                    }
                  }}
                  className={`p-2.5 rounded-xl border transition-all text-left ${
                    activeStepIdx === idx
                      ? 'border-teal-400 bg-teal-500/20 text-white font-bold shadow-md'
                      : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold text-[9px] text-teal-400">0{idx + 1}. {sc.time}</div>
                  <div className="truncate font-sans font-bold">{sc.badge}</div>
                </button>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
