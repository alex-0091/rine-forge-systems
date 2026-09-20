import React from 'react';
import { Bot, Sparkles, CheckCircle2, AlertCircle, Headphones, TrendingUp, ShieldCheck, Cpu } from 'lucide-react';

/**
 * FORGE AI CHARACTER UNIVERSE — UNIFIED VISUAL IDENTITY
 * 
 * Standardized 4 Core AI Employees with identical art direction, proportions,
 * corporate uniform styling, and dynamic emotional states:
 * 1. Elena (Receptionist) — Teal/Cyan
 * 2. Marcus (Sales) — Violet/Indigo
 * 3. Aria (Support) — Sky/Emerald
 * 4. Kael (Operations) — Amber/Emerald
 */

export const FORGE_CHARACTERS = {
  receptionist: {
    id: 'elena',
    name: 'Elena',
    role: 'Forge Receptionist',
    title: '24/7 Front-Desk & Triage Concierge',
    accentColor: '#14b8a6',
    badgeClass: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    ringColor: 'ring-teal-500/40',
    icon: Headphones,
    bio: 'Welcomes visitors, answers verified FAQs, and books confirmed calendar slots.',
    initials: 'EL'
  },
  sales: {
    id: 'marcus',
    name: 'Marcus',
    role: 'Forge Sales Specialist',
    title: 'Inbound Qualification & Speed-to-Lead',
    accentColor: '#8b5cf6',
    badgeClass: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    ringColor: 'ring-violet-500/40',
    icon: TrendingUp,
    bio: 'Researches prospects, qualifies purchase intent in under 60 seconds, and alerts account executives.',
    initials: 'MA'
  },
  support: {
    id: 'aria',
    name: 'Aria',
    role: 'Forge Support Specialist',
    title: 'Grounded Customer Care & Knowledge Resolver',
    accentColor: '#0ea5e9',
    badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    ringColor: 'ring-sky-500/40',
    icon: ShieldCheck,
    bio: 'Answers customer questions strictly using approved company docs with strict context grounding.',
    initials: 'AR'
  },
  operations: {
    id: 'kael',
    name: 'Kael',
    role: 'Forge Operations Specialist',
    title: 'Workflow Orchestration & Document Dispatch',
    accentColor: '#f59e0b',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    ringColor: 'ring-amber-500/40',
    icon: Cpu,
    bio: 'Extracts invoices, routes documents, and executes multi-platform webhooks automatically.',
    initials: 'KA'
  }
};

export function ForgeCharacterAvatar({
  characterKey = 'receptionist',
  state = 'idle', // 'idle' | 'listening' | 'thinking' | 'speaking' | 'success' | 'needs_human'
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  showStatusDot = true,
  className = ''
}) {
  const character = FORGE_CHARACTERS[characterKey] || FORGE_CHARACTERS.receptionist;
  const RoleIcon = character.icon;

  const sizeMap = {
    sm: { box: 'w-8 h-8', iconSize: 'w-4 h-4', badge: 'w-3 h-3', text: 'text-xs' },
    md: { box: 'w-12 h-12', iconSize: 'w-6 h-6', badge: 'w-4 h-4', text: 'text-sm' },
    lg: { box: 'w-16 h-16', iconSize: 'w-8 h-8', badge: 'w-5 h-5', text: 'text-base' },
    xl: { box: 'w-24 h-24', iconSize: 'w-12 h-12', badge: 'w-6 h-6', text: 'text-xl' }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  // Animation & Visual State Classes
  let stateBorder = 'border-slate-700';
  let stateGlow = '';
  let dotColor = 'bg-emerald-400';

  if (state === 'thinking') {
    stateBorder = 'border-teal-400 animate-pulse';
    stateGlow = 'shadow-[0_0_15px_rgba(20,184,166,0.35)]';
    dotColor = 'bg-cyan-400 animate-ping';
  } else if (state === 'listening' || state === 'speaking') {
    stateBorder = 'border-teal-400';
    stateGlow = 'shadow-[0_0_18px_rgba(20,184,166,0.45)]';
    dotColor = 'bg-teal-400';
  } else if (state === 'success') {
    stateBorder = 'border-emerald-400';
    stateGlow = 'shadow-[0_0_20px_rgba(16,185,129,0.4)]';
    dotColor = 'bg-emerald-400';
  } else if (state === 'needs_human') {
    stateBorder = 'border-amber-400 animate-pulse';
    stateGlow = 'shadow-[0_0_20px_rgba(245,158,11,0.4)]';
    dotColor = 'bg-amber-400';
  }

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      {/* Outer Glow & Background */}
      <div 
        className={`rounded-2xl flex items-center justify-center transition-all duration-300 relative overflow-hidden ${currentSize.box} ${stateBorder} ${stateGlow}`}
        style={{
          background: `linear-gradient(135deg, #090e1a 0%, #0f172a 100%)`,
          borderWidth: '2px'
        }}
      >
        {/* Subtle Brand Ambient Backlight */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{ backgroundColor: character.accentColor }}
        />

        {/* Character Portrait Vector SVG with Standard Face & Uniform */}
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full p-1 transition-transform duration-300 group-hover:scale-105"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Ambient Studio Spotlight */}
          <circle cx="50" cy="50" r="45" fill={character.accentColor} fillOpacity="0.12" />
          
          {/* Torso / Corporate Uniform with Lapel Accent */}
          <path 
            d="M20 95 C20 74 35 68 50 68 C65 68 80 74 80 95 Z" 
            fill="#1e293b" 
            stroke="#334155" 
            strokeWidth="2" 
          />
          {/* Uniform Lapel Notch & Collar Line */}
          <path d="M42 68 L50 82 L58 68" stroke={character.accentColor} strokeWidth="2.5" strokeLinecap="round" />
          
          {/* Head & Facial Structure (Consistent Across Character Universe) */}
          <rect x="34" y="26" width="32" height="38" rx="16" fill="#0b1120" stroke="#475569" strokeWidth="2" />
          
          {/* Stylized Hair Accent */}
          {characterKey === 'receptionist' && (
            <path d="M32 32 C34 18 66 18 68 32 C68 38 66 42 66 42 C62 30 38 30 34 42 Z" fill={character.accentColor} fillOpacity="0.85" />
          )}
          {characterKey === 'sales' && (
            <path d="M34 28 C36 20 64 20 66 28 C64 24 36 24 34 28 Z" fill={character.accentColor} fillOpacity="0.85" />
          )}
          {characterKey === 'support' && (
            <path d="M32 30 C36 19 64 19 68 30 C60 25 40 25 32 30 Z" fill={character.accentColor} fillOpacity="0.85" />
          )}
          {characterKey === 'operations' && (
            <path d="M33 26 C37 18 63 18 67 26 C64 22 36 22 33 26 Z" fill={character.accentColor} fillOpacity="0.85" />
          )}

          {/* Ocular Visor / Eyes with Adaptive Emotional States */}
          {state === 'thinking' ? (
            <g>
              <circle cx="43" cy="44" r="3.5" fill={character.accentColor} className="animate-pulse" />
              <circle cx="57" cy="44" r="3.5" fill={character.accentColor} className="animate-pulse" />
              <path d="M44 54 Q50 50 56 54" stroke={character.accentColor} strokeWidth="2" strokeLinecap="round" />
            </g>
          ) : state === 'success' ? (
            <g>
              <path d="M40 44 Q44 40 48 44" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M52 44 Q56 40 60 44" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M42 53 Q50 60 58 53" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          ) : state === 'needs_human' ? (
            <g>
              <circle cx="43" cy="44" r="3.5" fill="#f59e0b" />
              <circle cx="57" cy="44" r="3.5" fill="#f59e0b" />
              <line x1="44" y1="55" x2="56" y2="55" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
            </g>
          ) : (
            <g>
              {/* Calm, Welcoming Expression */}
              <circle cx="43" cy="44" r="3" fill="#f8fafc" />
              <circle cx="57" cy="44" r="3" fill="#f8fafc" />
              <circle cx="44" cy="43.5" r="1" fill={character.accentColor} />
              <circle cx="58" cy="43.5" r="1" fill={character.accentColor} />
              <path d="M44 54 Q50 58 56 54" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
            </g>
          )}

          {/* Headset / Comm Gear */}
          {characterKey === 'receptionist' && (
            <g>
              <path d="M33 42 C30 42 30 48 33 48 L35 48" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M33 48 C33 54 40 58 45 58" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="46" cy="58" r="2" fill="#38bdf8" />
            </g>
          )}
        </svg>

        {/* Small Bottom Role Icon Badge */}
        <div 
          className={`absolute bottom-0 right-0 p-0.5 rounded-full border border-slate-700 bg-slate-900 ${currentSize.badge} flex items-center justify-center shadow-md`}
          style={{ color: character.accentColor }}
        >
          <RoleIcon className="w-full h-full p-0.5" />
        </div>
      </div>

      {/* Live Operational Status Dot */}
      {showStatusDot && (
        <span 
          className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-[#090e1a] ${dotColor}`}
          title={`Status: ${state.toUpperCase()}`}
        />
      )}
    </div>
  );
}
