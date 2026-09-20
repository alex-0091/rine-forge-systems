import React from 'react';

/**
 * VoiceOrb: Organic visual voice indicator.
 * States: IDLE, LISTENING, THINKING, SPEAKING, TRANSFER_REQUIRED, ERROR
 */
export function VoiceOrb({ state = 'IDLE', audioLevel = 0 }) {
  return (
    <div className="relative flex items-center justify-center w-48 h-48 sm:w-56 sm:h-56 select-none">
      {/* Outer Ambient Glow Ring */}
      <div 
        className={`absolute inset-0 rounded-full blur-2xl transition-all duration-700 pointer-events-none opacity-60 ${
          state === 'LISTENING' ? 'bg-cyan-400 scale-110' :
          state === 'THINKING' ? 'bg-violet-500 scale-105 animate-pulse' :
          state === 'SPEAKING' ? 'bg-blue-500 scale-115' :
          state === 'TRANSFER_REQUIRED' ? 'bg-amber-400 scale-105' :
          state === 'ERROR' ? 'bg-rose-500 scale-100' :
          'bg-slate-300 scale-95'
        }`} 
      />

      {/* Secondary Pulse Waveform Rings (When Listening or Speaking) */}
      {(state === 'LISTENING' || state === 'SPEAKING') && (
        <>
          <div className="absolute inset-2 rounded-full border border-cyan-400/40 animate-ping pointer-events-none" />
          <div className="absolute inset-6 rounded-full border border-blue-400/30 animate-pulse pointer-events-none" />
        </>
      )}

      {/* Orbiting Particle for Thinking State */}
      {state === 'THINKING' && (
        <div className="absolute inset-0 rounded-full animate-spin pointer-events-none">
          <div className="w-3.5 h-3.5 rounded-full bg-violet-400 shadow-glow-violet ml-auto" />
        </div>
      )}

      {/* Core Organic Sphere */}
      <div 
        className={`relative z-10 w-32 h-32 sm:w-36 sm:h-36 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 ${
          state === 'LISTENING' ? 'bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 scale-105 shadow-glow-blue' :
          state === 'THINKING' ? 'bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-500 animate-orb-breathe shadow-glow-violet' :
          state === 'SPEAKING' ? 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 scale-110 shadow-glow-blue' :
          state === 'TRANSFER_REQUIRED' ? 'bg-gradient-to-tr from-amber-500 via-orange-500 to-coral-600 shadow-glow-coral' :
          state === 'ERROR' ? 'bg-gradient-to-tr from-rose-500 to-red-600' :
          'bg-gradient-to-tr from-slate-200 via-slate-100 to-white border border-slate-200 shadow-soft-md'
        }`}
      >
        {/* State Visual Representation */}
        {state === 'IDLE' && (
          <div className="flex items-center gap-1.5 opacity-60">
            <div className="w-1.5 h-4 rounded-full bg-slate-400 animate-pulse" />
            <div className="w-1.5 h-6 rounded-full bg-slate-500 animate-pulse" />
            <div className="w-1.5 h-4 rounded-full bg-slate-400 animate-pulse" />
          </div>
        )}

        {state === 'LISTENING' && (
          <div className="flex items-center gap-1">
            <div className="w-1.5 bg-white rounded-full animate-wave-1" />
            <div className="w-1.5 bg-white rounded-full animate-wave-2" />
            <div className="w-1.5 bg-white rounded-full animate-wave-3" />
            <div className="w-1.5 bg-white rounded-full animate-wave-4" />
            <div className="w-1.5 bg-white rounded-full animate-wave-5" />
          </div>
        )}

        {state === 'THINKING' && (
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-white animate-bounce" />
            <div className="w-2.5 h-2.5 rounded-full bg-white animate-bounce [animation-delay:0.15s]" />
            <div className="w-2.5 h-2.5 rounded-full bg-white animate-bounce [animation-delay:0.3s]" />
          </div>
        )}

        {state === 'SPEAKING' && (
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 bg-white rounded-full animate-wave-1" />
            <div className="w-1.5 bg-white rounded-full animate-wave-3" />
            <div className="w-1.5 bg-white rounded-full animate-wave-5" />
            <div className="w-1.5 bg-white rounded-full animate-wave-2" />
            <div className="w-1.5 bg-white rounded-full animate-wave-4" />
            <div className="w-1.5 bg-white rounded-full animate-wave-6" />
          </div>
        )}

        {state === 'TRANSFER_REQUIRED' && (
          <div className="text-white text-xs font-bold font-mono tracking-wider uppercase">
            Transfer
          </div>
        )}

        {state === 'ERROR' && (
          <div className="text-white text-xs font-bold font-mono">
            Error
          </div>
        )}
      </div>
    </div>
  );
}
