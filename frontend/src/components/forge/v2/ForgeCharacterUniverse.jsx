import React from 'react';
import { 
  Bot, PhoneCall, Headphones, Zap, Search, MessageSquare, 
  FileText, Scan, Mail, Inbox, Calendar, Clock, CheckCircle2, 
  Sparkles, Check, Flame, ShieldCheck, ArrowRight, User
} from 'lucide-react';
import { forgeAudioSynth } from '../../../utils/forgeAudioSynth';

/**
 * FORGE V3 Animated Character System & Universe
 * Color Language:
 * 🔵 Receptionist -> Cyan (#06b6d4)
 * 🟣 Lead Engine -> Violet (#8b5cf6)
 * 🔷 Support -> Blue (#3b82f6)
 * 🟠 Document Engine -> Orange (#f97316)
 * 🩷 Email -> Magenta / Pink (#ec4899)
 * 🟢 Appointment -> Green (#10b981)
 */

export function BusinessOwnerAvatar({ size = 'md', className = '', mood = 'neutral' }) {
  const sizeMap = {
    sm: 'w-10 h-10 text-xl',
    md: 'w-16 h-16 text-3xl',
    lg: 'w-24 h-24 text-5xl',
    xl: 'w-32 h-32 text-6xl'
  };

  return (
    <div 
      className={`relative inline-flex items-center justify-center cursor-pointer transition-transform hover:scale-105 ${className}`}
      onClick={() => forgeAudioSynth.playClick()}
      title="Alex — Overwhelmed Business Owner (Before FORGE)"
    >
      <div className={`rounded-2xl bg-gradient-to-tr from-slate-800 via-slate-900 to-dark-950 border-2 ${
        mood === 'overwhelmed' ? 'border-rose-500 shadow-rose-500/30' : mood === 'relieved' ? 'border-emerald-500 shadow-emerald-500/30' : 'border-slate-700'
      } flex items-center justify-center shadow-lg relative overflow-hidden ${sizeMap[size]}`}>
        {mood === 'overwhelmed' && (
          <div className="absolute inset-0 bg-rose-500/10 animate-pulse pointer-events-none" />
        )}
        {mood === 'relieved' && (
          <div className="absolute inset-0 bg-emerald-500/10 animate-pulse pointer-events-none" />
        )}
        <span className="relative z-10 select-none transform transition-transform duration-300">
          {mood === 'overwhelmed' ? '😫' : mood === 'relieved' ? '😎' : '👨‍💼'}
        </span>
      </div>
    </div>
  );
}

// 🔵 1. RECEPTIONIST (CYAN)
export function ReceptionistCharacter({ state = 'active', size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
    xl: 'w-36 h-36'
  };

  return (
    <div 
      className={`relative inline-flex items-center justify-center cursor-pointer transition-transform hover:scale-105 group ${sizeMap[size]} ${className}`}
      onClick={() => {
        forgeAudioSynth.playPhoneRing();
      }}
      title="AI Receptionist: 24/7 Voice Telephony NLP"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-500/30 via-teal-500/40 to-blue-600/30 blur-xl animate-pulse pointer-events-none" />

      <div className="relative w-full h-full rounded-2xl bg-gradient-to-b from-[#081b2a] via-[#04111c] to-[#02090e] border-2 border-cyan-400 shadow-lg shadow-cyan-500/40 flex flex-col items-center justify-between p-2 overflow-hidden">
        {/* Headset Arc */}
        <div className="absolute -top-1 w-3/4 h-3.5 border-t-2 border-cyan-400 rounded-t-full shadow-sm" />
        <div className="absolute top-2 -left-1 w-2.5 h-4.5 rounded-l-md bg-cyan-400 shadow-md animate-pulse" />
        <div className="absolute top-2 -right-1 w-2.5 h-4.5 rounded-r-md bg-cyan-400 shadow-md animate-pulse" />

        {/* Dynamic Eye Visor */}
        <div className="w-4/5 h-2/5 rounded-lg bg-dark-950/90 border border-cyan-500/50 flex items-center justify-center gap-2 px-1.5 shadow-inner mt-1">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-bounce" />
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-bounce delay-100" />
        </div>

        {/* Real-time Voice Waveform */}
        <div className="flex items-center gap-0.5 h-4">
          <div className="w-1 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <div className="w-1 h-3.5 rounded-full bg-cyan-300 animate-pulse delay-100" />
          <div className="w-1 h-4.5 rounded-full bg-teal-300 animate-pulse delay-150" />
          <div className="w-1 h-3 rounded-full bg-cyan-400 animate-pulse delay-75" />
          <div className="w-1 h-1.5 rounded-full bg-cyan-400 animate-pulse delay-200" />
        </div>

        {/* Micro Tag */}
        <div className="absolute -bottom-0.5 right-1 px-1.5 py-0.5 bg-cyan-400 text-dark-950 font-mono text-[8px] font-black rounded-md shadow uppercase tracking-tighter">
          VOICE
        </div>
      </div>
    </div>
  );
}

// 🟣 2. LEAD ENGINE (VIOLET)
export function LeadEngineCharacter({ state = 'active', size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
    xl: 'w-36 h-36'
  };

  return (
    <div 
      className={`relative inline-flex items-center justify-center cursor-pointer transition-transform hover:scale-105 group ${sizeMap[size]} ${className}`}
      onClick={() => {
        forgeAudioSynth.playWarp();
      }}
      title="Lead Speed Engine: Sub-45s Webhook to 2-Way SMS"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-violet-500/30 via-purple-500/40 to-indigo-600/30 blur-xl animate-pulse pointer-events-none" />

      <div className="relative w-full h-full rounded-2xl bg-gradient-to-b from-[#1c0e30] via-[#10071c] to-[#08030e] border-2 border-violet-400 shadow-lg shadow-violet-500/40 flex flex-col items-center justify-between p-2 overflow-hidden">
        {/* Radar Scanner Ring */}
        <div className="absolute inset-1 rounded-xl border border-dashed border-violet-500/40 animate-spin" style={{ animationDuration: '6s' }} />

        {/* Lead Match Score */}
        <div className="w-4/5 h-2/5 rounded-lg bg-dark-950/90 border border-violet-500/50 flex items-center justify-center gap-1 shadow-inner relative mt-1">
          <Zap className="w-3.5 h-3.5 text-violet-400 animate-bounce" />
          <span className="text-[11px] font-mono font-black text-violet-300">98%</span>
        </div>

        {/* Sub-45s Speed Meter */}
        <div className="w-4/5 space-y-0.5">
          <div className="w-full h-1.5 bg-dark-950 rounded-full overflow-hidden border border-violet-500/30">
            <div className="h-full bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 rounded-full w-[98%] animate-pulse" />
          </div>
          <div className="text-[8px] font-mono font-bold text-violet-300 text-center uppercase tracking-wider">
            &lt; 45s SMS
          </div>
        </div>

        {/* Micro Tag */}
        <div className="absolute -bottom-0.5 right-1 px-1.5 py-0.5 bg-violet-400 text-dark-950 font-mono text-[8px] font-black rounded-md shadow uppercase tracking-tighter">
          LEAD
        </div>
      </div>
    </div>
  );
}

// 🔷 3. SUPPORT AGENT (BLUE)
export function SupportCharacter({ state = 'active', size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
    xl: 'w-36 h-36'
  };

  return (
    <div 
      className={`relative inline-flex items-center justify-center cursor-pointer transition-transform hover:scale-105 group ${sizeMap[size]} ${className}`}
      onClick={() => {
        forgeAudioSynth.playClick();
      }}
      title="Customer Support Agent: Verified Knowledge Grounding"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-500/30 via-sky-500/40 to-indigo-600/30 blur-xl animate-pulse pointer-events-none" />

      <div className="relative w-full h-full rounded-2xl bg-gradient-to-b from-[#0e1b32] via-[#08101e] to-[#04080f] border-2 border-blue-400 shadow-lg shadow-blue-500/40 flex flex-col items-center justify-between p-2 overflow-hidden">
        {/* RAG Status Bar */}
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
          <span className="text-[8px] font-mono text-blue-300 font-black">RAG VERIFIED</span>
        </div>

        {/* Omnichannel Shield */}
        <div className="w-4/5 h-2/5 rounded-lg bg-dark-950/90 border border-blue-500/50 flex items-center justify-center gap-1.5 shadow-inner">
          <MessageSquare className="w-4 h-4 text-blue-400" />
          <div className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8] animate-pulse" />
        </div>

        {/* Zero Hallucination Guarantee */}
        <div className="flex items-center gap-1 font-mono text-[8px] text-slate-300">
          <ShieldCheck className="w-3 h-3 text-blue-400" />
          <span>0% Hallucination</span>
        </div>

        {/* Micro Tag */}
        <div className="absolute -bottom-0.5 right-1 px-1.5 py-0.5 bg-blue-500 text-dark-950 font-mono text-[8px] font-black rounded-md shadow uppercase tracking-tighter">
          RAG
        </div>
      </div>
    </div>
  );
}

// 🟠 4. DOCUMENT ENGINE (ORANGE)
export function DocumentCharacter({ state = 'active', size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
    xl: 'w-36 h-36'
  };

  return (
    <div 
      className={`relative inline-flex items-center justify-center cursor-pointer transition-transform hover:scale-105 group ${sizeMap[size]} ${className}`}
      onClick={() => {
        forgeAudioSynth.playScan();
      }}
      title="Document Engine: Laser Optical OCR & Schema Sync"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-orange-500/30 via-amber-500/40 to-red-600/30 blur-xl animate-pulse pointer-events-none" />

      <div className="relative w-full h-full rounded-2xl bg-gradient-to-b from-[#2d170a] via-[#1a0c05] to-[#0c0502] border-2 border-orange-400 shadow-lg shadow-orange-500/40 flex flex-col items-center justify-between p-2 overflow-hidden">
        {/* Laser Scanning Beam */}
        <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent shadow-[0_0_8px_#fb923c] animate-pulse" style={{ top: '48%' }} />

        {/* Document Parser Box */}
        <div className="w-4/5 h-3/5 rounded-lg bg-dark-950/90 border border-orange-500/50 flex flex-col justify-between p-1.5 shadow-inner mt-0.5">
          <div className="flex items-center justify-between">
            <FileText className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-[7px] font-mono text-orange-300 font-black">OCR 100%</span>
          </div>
          <div className="space-y-0.5">
            <div className="w-full h-1 bg-orange-500/40 rounded" />
            <div className="w-3/4 h-1 bg-orange-500/20 rounded" />
          </div>
          <div className="flex items-center justify-between text-[7px] font-mono text-emerald-400 font-bold">
            <span>EXTRACTED</span>
            <Check className="w-2.5 h-2.5" />
          </div>
        </div>

        {/* Micro Tag */}
        <div className="absolute -bottom-0.5 right-1 px-1.5 py-0.5 bg-orange-400 text-dark-950 font-mono text-[8px] font-black rounded-md shadow uppercase tracking-tighter">
          DOCS
        </div>
      </div>
    </div>
  );
}

// 🩷 5. EMAIL AGENT (MAGENTA / PINK)
export function EmailCharacter({ state = 'active', size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
    xl: 'w-36 h-36'
  };

  return (
    <div 
      className={`relative inline-flex items-center justify-center cursor-pointer transition-transform hover:scale-105 group ${sizeMap[size]} ${className}`}
      onClick={() => {
        forgeAudioSynth.playClick();
      }}
      title="Email Agent: Autonomous Inbox Triage & Draft Actions"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-pink-500/30 via-fuchsia-500/40 to-rose-600/30 blur-xl animate-pulse pointer-events-none" />

      <div className="relative w-full h-full rounded-2xl bg-gradient-to-b from-[#2e0a1f] via-[#190410] to-[#0d0208] border-2 border-pink-400 shadow-lg shadow-pink-500/40 flex flex-col items-center justify-between p-2 overflow-hidden">
        {/* Inbox Header */}
        <div className="w-4/5 h-3/5 rounded-lg bg-dark-950/90 border border-pink-500/50 flex flex-col justify-between p-1.5 shadow-inner mt-0.5">
          <div className="flex items-center justify-between">
            <Mail className="w-3.5 h-3.5 text-pink-400" />
            <span className="text-[7px] font-mono px-1 py-0.2 rounded bg-pink-500/20 text-pink-300 border border-pink-500/40 font-bold">HOT</span>
          </div>
          <div className="text-[7px] font-mono text-slate-300 leading-tight">
            Draft prepared
          </div>
          <div className="flex items-center gap-1 text-[7px] font-mono text-emerald-400 font-bold">
            <CheckCircle2 className="w-2.5 h-2.5" />
            <span>Ready to Send</span>
          </div>
        </div>

        {/* Micro Tag */}
        <div className="absolute -bottom-0.5 right-1 px-1.5 py-0.5 bg-pink-400 text-dark-950 font-mono text-[8px] font-black rounded-md shadow uppercase tracking-tighter">
          EMAIL
        </div>
      </div>
    </div>
  );
}

// 🟢 6. APPOINTMENT AGENT (GREEN / EMERALD)
export function AppointmentCharacter({ state = 'active', size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
    xl: 'w-36 h-36'
  };

  return (
    <div 
      className={`relative inline-flex items-center justify-center cursor-pointer transition-transform hover:scale-105 group ${sizeMap[size]} ${className}`}
      onClick={() => {
        forgeAudioSynth.playSuccess();
      }}
      title="Appointment Agent: Turn Conversations Into Booked Appointments"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-emerald-500/30 via-teal-500/40 to-green-600/30 blur-xl animate-pulse pointer-events-none" />

      <div className="relative w-full h-full rounded-2xl bg-gradient-to-b from-[#0a2e1a] via-[#051a0e] to-[#020d07] border-2 border-emerald-400 shadow-lg shadow-emerald-500/40 flex flex-col items-center justify-between p-2 overflow-hidden">
        {/* Mini Calendar Grid */}
        <div className="w-4/5 h-3/5 rounded-lg bg-dark-950/90 border border-emerald-500/50 flex flex-col justify-between p-1.5 shadow-inner mt-0.5">
          <div className="flex items-center justify-between">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[7px] font-mono text-emerald-300 font-bold">SAT 11 AM</span>
          </div>
          <div className="grid grid-cols-4 gap-0.5 my-0.5">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`h-1.5 rounded-sm ${i === 3 ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-slate-800'}`} />
            ))}
          </div>
          <div className="text-[7px] font-mono text-emerald-400 font-bold flex items-center gap-1">
            <Check className="w-2.5 h-2.5" />
            <span>CONFIRMED</span>
          </div>
        </div>

        {/* Micro Tag */}
        <div className="absolute -bottom-0.5 right-1 px-1.5 py-0.5 bg-emerald-400 text-dark-950 font-mono text-[8px] font-black rounded-md shadow uppercase tracking-tighter">
          BOOK
        </div>
      </div>
    </div>
  );
}

// Central FORGE Mascot Companion
export function ForgeCoreMascot({ state = 'idle', size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  return (
    <div 
      className={`relative inline-flex items-center justify-center cursor-pointer transition-transform hover:scale-110 ${sizeMap[size]} ${className}`}
      onClick={() => forgeAudioSynth.playSuccess()}
      title="FORGE Neural Hub"
    >
      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-tr from-teal-400 via-cyan-500 to-indigo-600 blur-xl opacity-70 pointer-events-none ${
        state === 'reasoning' ? 'animate-spin' : 'animate-pulse'
      }`} />

      <div className="relative w-full h-full rounded-2xl bg-gradient-to-tr from-[#091522] via-[#0b1d30] to-[#120f28] border-2 border-teal-400 shadow-2xl flex items-center justify-center overflow-hidden">
        {state === 'idle' && (
          <div className="w-3/5 h-3/5 rounded-xl bg-gradient-to-tr from-teal-400 to-cyan-300 flex items-center justify-center text-dark-950 font-black text-xs font-mono shadow-md animate-bounce">
            F
          </div>
        )}

        {state === 'reasoning' && (
          <div className="w-3/5 h-3/5 rounded-xl border-2 border-dashed border-cyan-400 animate-spin flex items-center justify-center text-cyan-300 font-black text-[10px] font-mono">
            🧠
          </div>
        )}

        {state === 'success' && (
          <div className="w-3/5 h-3/5 rounded-xl bg-emerald-400 text-dark-950 flex items-center justify-center font-black shadow-lg">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
        )}
      </div>
    </div>
  );
}
