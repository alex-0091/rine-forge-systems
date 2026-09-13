import React from 'react';
import { 
  Bot, PhoneCall, Headphones, Zap, Search, MessageSquare, 
  FileText, Scan, Mail, Inbox, Calendar, Clock, CheckCircle2, 
  Sparkles, Check, Flame, ShieldCheck, ArrowRight
} from 'lucide-react';

/**
 * FORGE V2 Animated Character System
 * High-craft, friendly, sophisticated illustrated visual avatars.
 * Pixar-inspired visual clarity with crisp SaaS modernism.
 */

export function ReceptionistCharacter({ state = 'active', size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
    xl: 'w-36 h-36'
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${sizeMap[size]} ${className}`}>
      {/* Ambient Pulsing Aura */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-teal-500/30 to-blue-600/20 blur-xl animate-pulse pointer-events-none" />

      {/* Main Character Body Pod */}
      <div className="relative w-full h-full rounded-2xl bg-gradient-to-b from-[#0e1726] to-[#070c16] border-2 border-cyan-400/60 shadow-lg shadow-cyan-500/20 flex flex-col items-center justify-center p-2 overflow-hidden group">
        
        {/* Headset Ring */}
        <div className="absolute -top-1 w-3/4 h-4 border-t-2 border-cyan-400 rounded-t-full" />
        <div className="absolute top-2 -left-1 w-3 h-5 rounded-l-md bg-cyan-400/80 shadow-sm" />
        <div className="absolute top-2 -right-1 w-3 h-5 rounded-r-md bg-cyan-400/80 shadow-sm" />

        {/* Character Face / Visor */}
        <div className="w-4/5 h-2/5 rounded-lg bg-dark-950 border border-cyan-500/40 flex items-center justify-center gap-1 px-1.5 shadow-inner">
          {/* Expressive Eyes */}
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-300 animate-bounce" />
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-300 animate-bounce delay-75" />
        </div>

        {/* Audio Wave / Microphone Stalk */}
        <div className="flex items-center gap-0.5 mt-1.5">
          <div className="w-1 h-2 rounded-full bg-teal-400 animate-pulse" />
          <div className="w-1 h-3.5 rounded-full bg-cyan-300 animate-pulse delay-100" />
          <div className="w-1 h-5 rounded-full bg-teal-300 animate-pulse delay-150" />
          <div className="w-1 h-3 rounded-full bg-cyan-400 animate-pulse delay-75" />
          <div className="w-1 h-1.5 rounded-full bg-teal-400 animate-pulse delay-200" />
        </div>

        {/* Mini Speech Floating Chip */}
        <div className="absolute -bottom-1 right-1 px-1.5 py-0.2 bg-cyan-500 text-dark-950 font-mono text-[8px] font-black rounded-md shadow">
          CALL
        </div>
      </div>
    </div>
  );
}

export function LeadEngineCharacter({ state = 'active', size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
    xl: 'w-36 h-36'
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${sizeMap[size]} ${className}`}>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-orange-500/30 to-rose-600/20 blur-xl animate-pulse pointer-events-none" />

      <div className="relative w-full h-full rounded-2xl bg-gradient-to-b from-[#18110b] to-[#0c0805] border-2 border-amber-400/60 shadow-lg shadow-amber-500/20 flex flex-col items-center justify-center p-2 overflow-hidden">
        
        {/* Radar Scanner Arc */}
        <div className="absolute inset-1 rounded-xl border border-dashed border-amber-500/30 animate-spin" style={{ animationDuration: '8s' }} />

        {/* Scanner Lens Face */}
        <div className="w-4/5 h-2/5 rounded-lg bg-dark-950 border border-amber-500/50 flex items-center justify-center gap-1 shadow-inner relative">
          <Search className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="text-[10px] font-mono font-black text-amber-300">98%</span>
        </div>

        {/* ICP Score Bar */}
        <div className="w-4/5 mt-1.5 space-y-0.5">
          <div className="w-full h-1.5 bg-dark-950 rounded-full overflow-hidden border border-amber-500/30">
            <div className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full w-[94%]" />
          </div>
          <div className="text-[8px] font-mono font-bold text-amber-400 text-center uppercase tracking-wider">
            ICP FIT
          </div>
        </div>

        <div className="absolute -bottom-1 right-1 px-1.5 py-0.2 bg-amber-400 text-dark-950 font-mono text-[8px] font-black rounded-md shadow">
          LEAD
        </div>
      </div>
    </div>
  );
}

export function SupportCharacter({ state = 'active', size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
    xl: 'w-36 h-36'
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${sizeMap[size]} ${className}`}>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-500/20 via-indigo-500/30 to-violet-600/20 blur-xl animate-pulse pointer-events-none" />

      <div className="relative w-full h-full rounded-2xl bg-gradient-to-b from-[#0c1024] to-[#060814] border-2 border-blue-400/60 shadow-lg shadow-blue-500/20 flex flex-col items-center justify-center p-2 overflow-hidden">
        
        {/* Knowledge Halo */}
        <div className="absolute top-1 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
          <span className="text-[8px] font-mono text-blue-300 font-bold">RAG VERIFIED</span>
        </div>

        {/* Character Visor */}
        <div className="w-4/5 h-2/5 mt-2 rounded-lg bg-dark-950 border border-blue-500/40 flex items-center justify-center gap-1 shadow-inner">
          <MessageSquare className="w-4 h-4 text-blue-400" />
          <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-300" />
        </div>

        <div className="mt-1 flex items-center gap-1 font-mono text-[8px] text-slate-300">
          <ShieldCheck className="w-3 h-3 text-blue-400" />
          <span>0% Hallucination</span>
        </div>

        <div className="absolute -bottom-1 right-1 px-1.5 py-0.2 bg-blue-500 text-dark-950 font-mono text-[8px] font-black rounded-md shadow">
          RAG
        </div>
      </div>
    </div>
  );
}

export function DocumentCharacter({ state = 'active', size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
    xl: 'w-36 h-36'
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${sizeMap[size]} ${className}`}>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-purple-500/20 via-fuchsia-500/30 to-violet-600/20 blur-xl animate-pulse pointer-events-none" />

      <div className="relative w-full h-full rounded-2xl bg-gradient-to-b from-[#140b20] to-[#090510] border-2 border-purple-400/60 shadow-lg shadow-purple-500/20 flex flex-col items-center justify-center p-2 overflow-hidden">
        
        {/* Optical Scanning Laser Line */}
        <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse" style={{ top: '45%' }} />

        {/* Paper Sheet Representation */}
        <div className="w-4/5 h-3/5 rounded-lg bg-dark-950 border border-purple-500/40 flex flex-col justify-between p-1.5 shadow-inner">
          <div className="flex items-center justify-between">
            <FileText className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[7px] font-mono text-purple-300">OCR</span>
          </div>
          <div className="space-y-0.5">
            <div className="w-full h-1 bg-purple-500/30 rounded" />
            <div className="w-3/4 h-1 bg-purple-500/20 rounded" />
          </div>
          <div className="flex items-center justify-between text-[7px] font-mono text-emerald-400 font-bold">
            <span>SUM: $4.2K</span>
            <Check className="w-2.5 h-2.5" />
          </div>
        </div>

        <div className="absolute -bottom-1 right-1 px-1.5 py-0.2 bg-purple-500 text-dark-950 font-mono text-[8px] font-black rounded-md shadow">
          DOC
        </div>
      </div>
    </div>
  );
}

export function EmailCharacter({ state = 'active', size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
    xl: 'w-36 h-36'
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${sizeMap[size]} ${className}`}>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-emerald-500/20 via-teal-500/30 to-green-600/20 blur-xl animate-pulse pointer-events-none" />

      <div className="relative w-full h-full rounded-2xl bg-gradient-to-b from-[#091811] to-[#040c08] border-2 border-emerald-400/60 shadow-lg shadow-emerald-500/20 flex flex-col items-center justify-center p-2 overflow-hidden">
        
        {/* Envelope Pod */}
        <div className="w-4/5 h-3/5 rounded-lg bg-dark-950 border border-emerald-500/40 flex flex-col justify-between p-1.5 shadow-inner">
          <div className="flex items-center justify-between">
            <Mail className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[7px] font-mono px-1 py-0.2 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold">HOT</span>
          </div>
          <div className="text-[7px] font-mono text-slate-300 leading-tight">
            Draft prepared & ready
          </div>
          <div className="flex items-center gap-1 text-[7px] font-mono text-emerald-400 font-bold">
            <CheckCircle2 className="w-2.5 h-2.5" />
            <span>1-Click Send</span>
          </div>
        </div>

        <div className="absolute -bottom-1 right-1 px-1.5 py-0.2 bg-emerald-500 text-dark-950 font-mono text-[8px] font-black rounded-md shadow">
          EMAIL
        </div>
      </div>
    </div>
  );
}

export function AppointmentCharacter({ state = 'active', size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
    xl: 'w-36 h-36'
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${sizeMap[size]} ${className}`}>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-pink-500/20 via-rose-500/30 to-orange-600/20 blur-xl animate-pulse pointer-events-none" />

      <div className="relative w-full h-full rounded-2xl bg-gradient-to-b from-[#1a0c14] to-[#0d050a] border-2 border-pink-400/60 shadow-lg shadow-pink-500/20 flex flex-col items-center justify-center p-2 overflow-hidden">
        
        {/* Calendar Pod */}
        <div className="w-4/5 h-3/5 rounded-lg bg-dark-950 border border-pink-500/40 flex flex-col justify-between p-1.5 shadow-inner">
          <div className="flex items-center justify-between">
            <Calendar className="w-3.5 h-3.5 text-pink-400" />
            <span className="text-[7px] font-mono text-pink-300">FRI 3 PM</span>
          </div>
          <div className="grid grid-cols-4 gap-0.5 my-0.5">
            {[1,2,3,4].map(i => (
              <div key={i} className={`h-1.5 rounded-sm ${i === 3 ? 'bg-pink-400' : 'bg-slate-800'}`} />
            ))}
          </div>
          <div className="text-[7px] font-mono text-emerald-400 font-bold flex items-center gap-1">
            <Check className="w-2.5 h-2.5" />
            <span>CONFIRMED</span>
          </div>
        </div>

        <div className="absolute -bottom-1 right-1 px-1.5 py-0.2 bg-pink-500 text-dark-950 font-mono text-[8px] font-black rounded-md shadow">
          BOOK
        </div>
      </div>
    </div>
  );
}

/**
 * The Central FORGE Mascot Companion
 * Glowing geometric AI companion with dynamic state reactions.
 */
export function ForgeCoreMascot({ state = 'idle', size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${sizeMap[size]} ${className}`}>
      {/* Outer Pulse Glow */}
      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-tr from-teal-400 via-cyan-500 to-indigo-600 blur-xl opacity-60 pointer-events-none ${
        state === 'reasoning' ? 'animate-spin' : 'animate-pulse'
      }`} />

      {/* Crystalline Core Body */}
      <div className="relative w-full h-full rounded-2xl bg-gradient-to-tr from-[#091522] via-[#0b1d30] to-[#120f28] border-2 border-teal-400/80 shadow-2xl flex items-center justify-center overflow-hidden">
        
        {/* Animated Inner Core */}
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
