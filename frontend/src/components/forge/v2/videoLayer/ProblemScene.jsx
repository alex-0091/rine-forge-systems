import React, { useState, useEffect } from 'react';
import { PhoneCall, Mail, MessageSquare, Calendar, AlertTriangle, Clock, User, Bell, Laptop } from 'lucide-react';
import { forgeAudioSynth } from '../../../../utils/forgeAudioSynth';

export function ProblemScene({ onNextStep }) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [activeNotification, setActiveNotification] = useState(0);

  // Cycle through incoming chaotic alerts: Phone -> WhatsApp -> Email -> Calendar
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveNotification(prev => (prev + 1) % 4);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#12080d] via-[#0d0609] to-[#070305] border-2 border-rose-500/40 p-6 sm:p-9 shadow-2xl space-y-6">
      
      {/* MP4 Video Player Layer (If user places /videos/v01-busy-receptionist.mp4) */}
      {!videoError && (
        <video
          src="/videos/v01-busy-receptionist.mp4"
          className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700 ${
            videoLoaded ? 'opacity-40' : 'opacity-0'
          }`}
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          onError={() => setVideoError(true)}
        />
      )}

      {/* Top Header & Alert Banner */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-rose-950/60 pb-4 font-mono text-xs">
        <div className="flex items-center gap-2.5 text-rose-400 font-bold">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          <span className="uppercase tracking-wider">STAGE 1: THE MANUAL BOTTLENECK</span>
        </div>
        <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
          😩 4 CHANNELS UNANSWERED
        </span>
      </div>

      {/* 🌟 Polished SaaS Illustrated Workspace (SVG + CSS Animation) */}
      <div className="relative z-10 min-h-[340px] sm:min-h-[380px] rounded-2xl bg-[#090406]/90 border border-rose-900/40 p-5 sm:p-8 flex flex-col justify-between overflow-hidden">
        
        {/* Subtle Background Desk & Screen Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#f43f5e10_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        {/* Floating Notification Stream */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto w-full">
          
          {/* Notification 1: Ringing Phone */}
          <div className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-center gap-3 ${
            activeNotification === 0 
              ? 'bg-rose-950/80 border-rose-500 shadow-lg shadow-rose-500/20 scale-[1.03]' 
              : 'bg-slate-900/40 border-slate-800/60 opacity-60'
          }`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-rose-400 ${
              activeNotification === 0 ? 'bg-rose-500/20 animate-bounce' : 'bg-slate-800'
            }`}>
              <PhoneCall className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <div className="text-[10px] font-mono text-rose-400 font-bold uppercase flex items-center gap-1.5">
                <span>Incoming Phone Call</span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
              </div>
              <div className="text-xs font-sans font-bold text-white">Line 1: Urgent Consultation</div>
              <div className="text-[10px] text-slate-400 font-mono">On hold 02:45...</div>
            </div>
          </div>

          {/* Notification 2: Customer WhatsApp Message */}
          <div className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-center gap-3 ${
            activeNotification === 1 
              ? 'bg-emerald-950/80 border-emerald-500 shadow-lg shadow-emerald-500/20 scale-[1.03]' 
              : 'bg-slate-900/40 border-slate-800/60 opacity-60'
          }`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-emerald-400 ${
              activeNotification === 1 ? 'bg-emerald-500/20 animate-pulse' : 'bg-slate-800'
            }`}>
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase">Customer Message</div>
              <div className="text-xs font-sans font-bold text-white">"Can I book for tomorrow 3 PM?"</div>
              <div className="text-[10px] text-slate-400 font-mono">Unread • 14 min ago</div>
            </div>
          </div>

          {/* Notification 3: Incoming Email Lead */}
          <div className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-center gap-3 ${
            activeNotification === 2 
              ? 'bg-indigo-950/80 border-indigo-500 shadow-lg shadow-indigo-500/20 scale-[1.03]' 
              : 'bg-slate-900/40 border-slate-800/60 opacity-60'
          }`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-indigo-400 ${
              activeNotification === 2 ? 'bg-indigo-500/20 animate-pulse' : 'bg-slate-800'
            }`}>
              <Mail className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <div className="text-[10px] font-mono text-indigo-400 font-bold uppercase">New Inbound Inquiry</div>
              <div className="text-xs font-sans font-bold text-white">Commercial Quote Request #849</div>
              <div className="text-[10px] text-slate-400 font-mono">Needs manual pricing check</div>
            </div>
          </div>

          {/* Notification 4: Calendar Conflict */}
          <div className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-center gap-3 ${
            activeNotification === 3 
              ? 'bg-amber-950/80 border-amber-500 shadow-lg shadow-amber-500/20 scale-[1.03]' 
              : 'bg-slate-900/40 border-slate-800/60 opacity-60'
          }`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-amber-400 ${
              activeNotification === 3 ? 'bg-amber-500/20 animate-bounce' : 'bg-slate-800'
            }`}>
              <Calendar className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <div className="text-[10px] font-mono text-amber-400 font-bold uppercase">Scheduling Conflict</div>
              <div className="text-xs font-sans font-bold text-white">Dr. Evans Chair Double-Booked</div>
              <div className="text-[10px] text-slate-400 font-mono">Requires 3 rescheduling calls</div>
            </div>
          </div>

        </div>

        {/* Illustrated Office Desk & Overwhelmed Silhouette */}
        <div className="relative z-10 pt-6 flex flex-col items-center justify-center">
          
          {/* Illustrated Workspace SVG */}
          <svg className="w-64 h-32 text-slate-700 overflow-visible" viewBox="0 0 260 130" fill="none">
            {/* Desk Surface */}
            <rect x="20" y="95" width="220" height="8" rx="4" fill="#1e293b" />
            <rect x="35" y="103" width="8" height="25" rx="2" fill="#0f172a" />
            <rect x="217" y="103" width="8" height="25" rx="2" fill="#0f172a" />

            {/* Laptop */}
            <rect x="95" y="60" width="70" height="42" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="2" />
            <rect x="100" y="65" width="60" height="32" rx="2" fill="#020617" />
            {/* Glowing screen lines */}
            <line x1="104" y1="72" x2="140" y2="72" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
            <line x1="104" y1="78" x2="152" y2="78" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
            <line x1="104" y1="84" x2="130" y2="84" stroke="#e2e8f0" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M90 102 L170 102 L165 98 L95 98 Z" fill="#334155" />

            {/* Desk Phone with Ringing Waves */}
            <rect x="45" y="76" width="30" height="22" rx="4" fill="#0f172a" stroke="#f43f5e" strokeWidth="1.5" />
            <rect x="49" y="80" width="10" height="14" rx="2" fill="#f43f5e" fillOpacity="0.2" />
            <circle cx="68" cy="85" r="2" fill="#f43f5e" className="animate-ping" />
            {/* Ringing Soundwaves */}
            <path d="M40 78 C36 82 36 88 40 92" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" className="animate-pulse" />
            <path d="M35 74 C29 80 29 94 35 100" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

            {/* Coffee Mug */}
            <rect x="185" y="80" width="14" height="18" rx="2" fill="#334155" />
            <path d="M199 84 Q204 88 199 92" stroke="#334155" strokeWidth="2" fill="none" />

            {/* Overwhelmed Receptionist Silhouette */}
            <circle cx="130" cy="30" r="14" fill="#f43f5e" fillOpacity="0.2" stroke="#f43f5e" strokeWidth="1.5" />
            {/* Stress sweat drop */}
            <path d="M148 24 Q151 28 148 31 Q145 28 148 24" fill="#38bdf8" className="animate-bounce" />
            {/* Headset wire */}
            <path d="M122 28 Q118 36 126 38" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            {/* Torso */}
            <path d="M106 58 C106 48 116 44 130 44 C144 44 154 48 154 58 Z" fill="#1e293b" />
          </svg>

          {/* Overlaid Prominent Text */}
          <div className="text-center space-y-1.5 pt-2">
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
              YOUR TEAM IS BUSY.
            </h3>
            <p className="text-xs sm:text-sm text-rose-300 font-mono font-bold">
              Calls. Messages. Leads. Appointments.
            </p>
            <p className="text-[11px] text-slate-400 font-sans max-w-md mx-auto">
              Humans shouldn't spend 4 hours a day manually copying data, answering basic FAQs, and typing back-and-forth emails.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
