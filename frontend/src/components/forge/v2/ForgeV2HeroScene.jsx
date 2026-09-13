import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Play, Pause, Sparkles, Bot, Calendar, 
  CheckCircle2, MessageSquare, Database, Send, PhoneCall, 
  RefreshCw, ShieldCheck, Flame, Zap, ArrowUpRight, Volume2, VolumeX,
  Clock, User, Smartphone, Building2, FileText, Mail, HelpCircle, CheckCheck,
  Eye, HandMetal, Rocket, Check, ExternalLink
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

// Live Demonstration Scenarios for the Hero Visual Workflow
const HERO_SCENARIOS = [
  {
    id: 'dental',
    title: '🦷 Dental Clinic',
    subtitle: 'After-Hours Patient Booking',
    customerMessage: 'Hi! Can I book an urgent exam for tomorrow at 3 PM? Do you take Delta Dental?',
    intentLabel: 'EMERGENCY_DENTAL_INTAKE',
    systemAction: 'Checks Dr. Evans chair availability in Dentrix PMS & confirms Delta Dental PPO in-network.',
    replyMessage: 'Hi Alex! You are confirmed with Dr. Evans tomorrow at 3:00 PM (Operatory 2). We accept Delta Dental PPO. Confirmation & intake form sent to your mobile! ✓',
    crmSync: 'Dentrix PMS & HubSpot CRM updated • Patient #4912 • Slot locked'
  },
  {
    id: 'hotel',
    title: '🏨 Boutique Hotel',
    subtitle: 'Guest Room Reservation',
    customerMessage: 'Hello, looking for a King Suite for this Friday to Sunday with valet parking.',
    intentLabel: 'RESERVATION_REQUEST',
    systemAction: 'Queries Opera PMS inventory, verifies room 402 availability, and applies weekend package rate.',
    replyMessage: 'Hello! King Suite 402 is reserved for Friday–Sunday at $289/night with valet parking included. Mobile check-in link dispatched! ✓',
    crmSync: 'Opera PMS updated • Folio #9042 • Payment tokenized'
  },
  {
    id: 'real-estate',
    title: '🏠 Real Estate Brokerage',
    subtitle: 'Sub-45s Buyer Qualification',
    customerMessage: 'Hi, is the 5th Ave penthouse available for a private walkthrough this Saturday at 11 AM?',
    intentLabel: 'BUYER_LEAD_QUALIFICATION',
    systemAction: 'Scans $1.4M pre-approval document, scores 96 ICP, and checks senior broker calendar.',
    replyMessage: 'Hi Jordan! The 5th Ave penthouse private walkthrough is booked for Saturday at 11:00 AM with Senior Broker Marcus. Calendar invite sent! ✓',
    crmSync: 'Follow Up Boss CRM updated • Score: 96/100 (Tier 1 Buyer)'
  },
  {
    id: 'hvac',
    title: '🔧 HVAC & Home Services',
    subtitle: 'Emergency Night Dispatch',
    customerMessage: 'Emergency: AC unit stopped blowing cold air and is making a loud buzzing noise.',
    intentLabel: 'TIER_1_DISPATCH_ALERT',
    systemAction: 'Identifies compressor fault severity, collects address, and pings on-call technician.',
    replyMessage: 'We received your urgent call! On-call technician Dave is assigned for tomorrow morning 8:00 AM–9:00 AM. Emergency dispatch confirmed! ✓',
    crmSync: 'ServiceTitan updated • Job #8412 • GPS dispatch queued'
  }
];

export function ForgeV2HeroScene({ onNavigate, onLaunchSystemDemo, onWatchTenSecDemo }) {
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(0);
  const [scenarioStep, setScenarioStep] = useState(0); // 0: Msg, 1: AI Reads, 2: Checks DB, 3: Replies, 4: CRM Saved
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const scenario = HERO_SCENARIOS[selectedScenarioIdx];

  // Auto-progress the 5 steps of the animated scenario
  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setScenarioStep(prev => {
          const next = (prev + 1) % 5;
          if (next === 0) {
            forgeAudioSynth.playPhoneRing();
          } else if (next === 1) {
            forgeAudioSynth.playScan();
          } else if (next === 3) {
            forgeAudioSynth.playClick();
          } else if (next === 4) {
            forgeAudioSynth.playSuccess();
          }
          return next;
        });
      }, 2200);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleSelectScenario = (idx) => {
    forgeAudioSynth.playClick();
    setSelectedScenarioIdx(idx);
    setScenarioStep(0);
    if (isVoiceActive) {
      speechEngine.speak(HERO_SCENARIOS[idx].customerMessage, { accent: 'en-US' });
    }
  };

  const handleToggleVoice = () => {
    forgeAudioSynth.playClick();
    if (isVoiceActive) {
      speechEngine.stopSpeaking();
      setIsVoiceActive(false);
    } else {
      setIsVoiceActive(true);
      speechEngine.speak('AI Employee Demonstration: ' + scenario.customerMessage, { accent: 'en-US' });
    }
  };

  return (
    <section className="relative pt-10 sm:pt-16 pb-20 sm:pb-28 border-b border-slate-800/80 bg-[#060a12] overflow-hidden" id="forge-hero">
      
      {/* Subtle Ambient Lighting Aura */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-indigo-500/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b08_1px,transparent_1px),linear-gradient(to_bottom,#1e293b08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Top Header: Immediate Clarity in 5–10 Seconds */}
        <div className="text-center space-y-5 max-w-4xl mx-auto">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold tracking-wider uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>RINE FORGE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.06] font-sans">
            AI EMPLOYEES FOR <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-cyan-300 to-indigo-400">
              YOUR BUSINESS.
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-slate-100 font-bold max-w-2xl mx-auto leading-relaxed">
            Your repetitive work. Automated by AI.
          </p>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans">
            We build digital workers that answer customers, qualify leads, schedule appointments, update your CRM, and handle repetitive tasks — <strong className="text-white">automatically, 24/7.</strong>
          </p>

          {/* Primary High-Converting CTAs */}
          <div className="flex flex-col items-center justify-center gap-3 pt-3">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto font-mono text-xs">
              {/* Primary CTA: Visually Dominant */}
              <button
                onClick={() => {
                  forgeAudioSynth.playSuccess();
                  if (onNavigate) onNavigate('audit');
                  else {
                    const el = document.getElementById('automation-calculator');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-full sm:w-auto min-h-[48px] px-9 py-4 bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-300 hover:from-teal-300 hover:to-cyan-200 text-slate-950 font-black rounded-2xl transition-all shadow-2xl shadow-teal-500/30 flex items-center justify-center gap-2.5 hover:scale-105 active:scale-95 ring-2 ring-teal-300/60"
              >
                <span className="text-sm font-black tracking-wide">GET YOUR FREE AI AUDIT</span>
                <ArrowRight className="w-4 h-4 text-slate-950 stroke-[3]" />
              </button>

              {/* Secondary CTA */}
              <button
                onClick={() => {
                  forgeAudioSynth.playClick();
                  const el = document.getElementById('v3-video-experience') || document.getElementById('watch-demos');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else if (onNavigate) onNavigate('watch-demos');
                }}
                className="w-full sm:w-auto min-h-[48px] px-7 py-4 bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border-2 border-slate-700/80 hover:border-slate-500 font-bold rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
              >
                <span>WATCH HOW IT WORKS</span>
              </button>
            </div>

            {/* Small text underneath primary CTA */}
            <p className="text-xs font-mono text-teal-300/90 font-medium">
              We'll find repetitive tasks your business could automate.
            </p>
          </div>

          <div className="text-[11px] text-slate-400 flex flex-wrap items-center justify-center gap-4 pt-1 font-mono">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Zero disruption to daily ops
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Live in 48 hours
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> No long-term lock-in
            </span>
          </div>

        </div>

        {/* 🎬 CENTERPIECE: THE ANIMATED "AI EMPLOYEE IN ACTION" SCENARIO */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-b from-[#0e1628] via-[#090f1d] to-[#060a12] border-2 border-teal-500/40 p-6 sm:p-9 shadow-2xl space-y-7 relative overflow-hidden backdrop-blur-md">
          
          {/* Top Bar: Live Status & Industry Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <div>
                <div className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="text-teal-400">● LIVE AI EMPLOYEE SIMULATION</span>
                  <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 text-[10px] font-bold border border-teal-500/30">
                    REAL-TIME AUTOMATION
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Watch what happens when a customer contacts your business:
                </div>
              </div>
            </div>

            {/* Audio Voiceover & Pause Controls */}
            <div className="flex items-center gap-2 font-mono text-xs">
              <button
                onClick={handleToggleVoice}
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all text-[11px] font-bold ${
                  isVoiceActive 
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
                title="Narrate live scenario"
              >
                {isVoiceActive ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{isVoiceActive ? 'Voice ON' : 'Voiceover'}</span>
              </button>

              <button
                onClick={() => {
                  forgeAudioSynth.playClick();
                  setIsPlaying(!isPlaying);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center gap-1.5 text-[11px] font-bold"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400 fill-current" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400 font-bold uppercase mr-1">Select Industry:</span>
            {HERO_SCENARIOS.map((sc, idx) => (
              <button
                key={sc.id}
                onClick={() => handleSelectScenario(idx)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                  selectedScenarioIdx === idx
                    ? 'bg-teal-500/20 text-teal-300 border-teal-400 shadow-md shadow-teal-500/10'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {sc.title}
              </button>
            ))}
          </div>

          {/* 📱 Interactive Workflow Box (WhatsApp -> AI -> DB -> Reply -> CRM) */}
          <div className="p-5 sm:p-7 rounded-2xl bg-[#070c18] border border-slate-800 space-y-6">
            
            {/* Step 1: Inbound WhatsApp / Phone Message */}
            <div className={`p-4 rounded-2xl transition-all duration-300 border ${
              scenarioStep >= 0 
                ? 'bg-slate-900/90 border-teal-500/50 shadow-lg' 
                : 'bg-slate-950/40 border-slate-800/40 opacity-40'
            }`}>
              <div className="flex items-center justify-between text-[11px] font-mono pb-2 mb-2 border-b border-slate-800">
                <div className="flex items-center gap-2 text-teal-400 font-bold">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>STEP 1: CUSTOMER CONTACTS YOU (WHATSAPP / WEB)</span>
                </div>
                <span className="text-slate-500 text-[10px]">10:42 PM (After Hours)</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-xs">
                  👤
                </div>
                <div className="p-3 rounded-2xl rounded-tl-none bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs sm:text-sm font-sans font-medium leading-relaxed">
                  "{scenario.customerMessage}"
                </div>
              </div>
            </div>

            {/* Animated Connector Arrow 1 */}
            <div className="flex justify-center -my-3">
              <div className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 transition-all ${
                scenarioStep >= 1 ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'bg-slate-900 text-slate-600 border border-slate-800'
              }`}>
                <span>↓ 🤖 AI Reads & Understands in 400ms</span>
              </div>
            </div>

            {/* Step 2 & 3: AI Reads Intent & Checks Availability in Database */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 transition-all duration-300 ${
              scenarioStep >= 1 ? 'opacity-100' : 'opacity-40'
            }`}>
              
              <div className={`p-3.5 rounded-xl border transition-all ${
                scenarioStep >= 1 ? 'bg-cyan-950/25 border-cyan-500/40 text-cyan-200' : 'bg-slate-900/40 border-slate-800 text-slate-500'
              }`}>
                <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase flex items-center gap-1.5 mb-1.5">
                  <Bot className="w-3.5 h-3.5" />
                  <span>STEP 2: INTENT EXTRACTION</span>
                </div>
                <div className="text-xs font-mono font-bold text-white">
                  {scenario.intentLabel}
                </div>
                <div className="text-[11px] text-slate-400 pt-1">
                  Zero hallucinations • 100% policy-bound NLP
                </div>
              </div>

              <div className={`p-3.5 rounded-xl border transition-all ${
                scenarioStep >= 2 ? 'bg-indigo-950/25 border-indigo-500/40 text-indigo-200' : 'bg-slate-900/40 border-slate-800 text-slate-500'
              }`}>
                <div className="text-[10px] font-mono font-bold text-indigo-400 uppercase flex items-center gap-1.5 mb-1.5">
                  <Database className="w-3.5 h-3.5" />
                  <span>STEP 3: REAL-TIME CALENDAR & DB CHECK</span>
                </div>
                <div className="text-xs font-sans text-slate-200">
                  {scenario.systemAction}
                </div>
              </div>

            </div>

            {/* Animated Connector Arrow 2 */}
            <div className="flex justify-center -my-3">
              <div className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 transition-all ${
                scenarioStep >= 3 ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'bg-slate-900 text-slate-600 border border-slate-800'
              }`}>
                <span>↓ 💬 AI Replies & Confirms Booking Automatically</span>
              </div>
            </div>

            {/* Step 4: AI Replies Instantly */}
            <div className={`p-4 rounded-2xl transition-all duration-300 border ${
              scenarioStep >= 3 
                ? 'bg-slate-900/90 border-cyan-500/50 shadow-lg' 
                : 'bg-slate-950/40 border-slate-800/40 opacity-40'
            }`}>
              <div className="flex items-center justify-between text-[11px] font-mono pb-2 mb-2 border-b border-slate-800">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>STEP 4: INSTANT AUTOMATED REPLY (18 SECONDS)</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                  SENT INSTANTLY
                </span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center shrink-0 text-xs">
                  🤖
                </div>
                <div className="p-3 rounded-2xl rounded-tl-none bg-cyan-950/40 border border-cyan-500/30 text-cyan-100 text-xs sm:text-sm font-sans font-medium leading-relaxed">
                  {scenario.replyMessage}
                </div>
              </div>
            </div>

            {/* Step 5: CRM & Calendar Updated */}
            <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all duration-300 ${
              scenarioStep >= 4 
                ? 'bg-emerald-950/30 border-emerald-500/50 shadow-md' 
                : 'bg-slate-950/30 border-slate-800/40 opacity-40'
            }`}>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-[11px] font-mono font-bold text-emerald-300 uppercase">
                    STEP 5: SAVED TO CRM & CALENDAR AUTOMATICALLY
                  </div>
                  <div className="text-xs font-sans text-slate-300">
                    {scenario.crmSync}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                ZERO HUMAN WORK
              </span>
            </div>

          </div>

          {/* Bottom High-Impact Punchline */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-sm font-black text-white font-sans">
                This happens automatically. 24 hours a day, 7 days a week.
              </span>
            </div>
            <button
              onClick={() => {
                forgeAudioSynth.playSuccess();
                if (onNavigate) onNavigate('audit');
              }}
              className="text-xs font-mono font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1.5 transition-colors"
            >
              <span>Build this for your business</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
