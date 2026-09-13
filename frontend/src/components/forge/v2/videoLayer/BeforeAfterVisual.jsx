import React, { useState } from 'react';
import { AlertOctagon, CheckCircle2, Clock, DollarSign, XCircle, Zap, ArrowRight, ShieldCheck, RefreshCw, Layers } from 'lucide-react';
import { forgeAudioSynth } from '../../../../utils/forgeAudioSynth';

export function BeforeAfterVisual({ onCtaClick }) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [activeTab, setActiveTab] = useState('both'); // 'both' | 'before' | 'after'

  const beforePoints = [
    { label: 'Response Time', val: '15 to 45 Minutes', bad: true, desc: '60% of buyers have moved on to competitors' },
    { label: 'Tool Fragmentation', val: '6 Disconnected Apps', bad: true, desc: 'Tabs across WhatsApp, Gmail, Excel, Phone, CRM' },
    { label: 'After-Hours Coverage', val: '0% (Voicemail Black Hole)', bad: true, desc: 'Evenings and weekends go completely unanswered' },
    { label: 'Operating Cost', val: '$4,500+ / mo per desk', bad: true, desc: 'High turnover, training overhead, sick days' }
  ];

  const afterPoints = [
    { label: 'Response Time', val: '0.8 to 30 Seconds', good: true, desc: 'Instant engagement while buyer intent is at peak' },
    { label: 'Tool Fragmentation', val: '1 Unified AI Pipeline', good: true, desc: 'Automated CRM sync, calendar locks, and confirmations' },
    { label: 'After-Hours Coverage', val: '100% 24/7/365 Non-Stop', good: true, desc: 'Zero dropped leads, instant qualification on holidays' },
    { label: 'Operating Cost', val: '80% Lower Overhead', good: true, desc: 'Predictable software scale with zero fatigue' }
  ];

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#0e0712] via-[#07040a] to-[#030205] border-2 border-fuchsia-500/40 p-6 sm:p-9 shadow-2xl space-y-6">
      
      {/* Optional MP4 Drop-in Layer */}
      {!videoError && (
        <video
          src="/videos/v06-before-after.mp4"
          preload="none"
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

      {/* Header Banner */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-fuchsia-950/60 pb-4 font-mono text-xs">
        <div className="flex items-center gap-2.5 text-fuchsia-400 font-bold">
          <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-400 animate-ping" />
          <span className="uppercase tracking-wider">STAGE 6: THE FORGE ADVANTAGE</span>
        </div>

        {/* View Toggle on Mobile */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              forgeAudioSynth.playClick();
              setActiveTab('both');
            }}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
              activeTab === 'both' ? 'bg-fuchsia-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Split View
          </button>
          <button
            onClick={() => {
              forgeAudioSynth.playClick();
              setActiveTab('before');
            }}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
              activeTab === 'before' ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Before
          </button>
          <button
            onClick={() => {
              forgeAudioSynth.playClick();
              setActiveTab('after');
            }}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
              activeTab === 'after' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            After
          </button>
        </div>
      </div>

      {/* Main Split-Screen Canvas */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        
        {/* Left Side: BEFORE FORGE (The Manual Chaos) */}
        {(activeTab === 'both' || activeTab === 'before') && (
          <div className="rounded-2xl bg-[#120509]/90 border-2 border-rose-900/50 p-5 sm:p-7 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between border-b border-rose-950 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                    <XCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">MANUAL RUNTIME</h3>
                    <p className="text-[10px] font-mono text-rose-400">Without FORGE AI</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 text-[10px] font-mono font-bold border border-rose-500/30">
                  42% LEADS LOST
                </span>
              </div>

              <div className="space-y-3 font-sans text-xs">
                {beforePoints.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#090305] border border-rose-950/80">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono uppercase text-slate-400">{item.label}</span>
                      <span className="text-xs font-bold text-rose-400">{item.val}</span>
                    </div>
                    <p className="text-[11px] text-slate-300">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-900/60 text-center font-mono text-xs text-rose-300">
              ⚠️ Result: Missed bookings, exhausted staff, capped growth.
            </div>
          </div>
        )}

        {/* Right Side: AFTER FORGE (Autonomous High-Performance) */}
        {(activeTab === 'both' || activeTab === 'after') && (
          <div className="rounded-2xl bg-[#03150d]/90 border-2 border-emerald-500/50 p-5 sm:p-7 flex flex-col justify-between space-y-5 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <div>
              <div className="flex items-center justify-between border-b border-emerald-950 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">FORGE AUTONOMOUS</h3>
                    <p className="text-[10px] font-mono text-emerald-400">With FORGE Systems V3</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                  100% RESOLVED
                </span>
              </div>

              <div className="space-y-3 font-sans text-xs">
                {afterPoints.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#020b06] border border-emerald-950/80">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono uppercase text-slate-400">{item.label}</span>
                      <span className="text-xs font-bold text-emerald-400">{item.val}</span>
                    </div>
                    <p className="text-[11px] text-slate-300">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center font-mono text-xs text-emerald-300">
              🚀 Result: Instant calendar bookings, 24/7 revenue, zero manual effort.
            </div>
          </div>
        )}

      </div>

      {/* Bottom Conversion Action Strip */}
      <div className="relative z-10 pt-4 border-t border-fuchsia-950/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
          <p className="text-xs sm:text-sm text-slate-200">
            <strong className="text-white">Ready to automate your operations?</strong> Install FORGE in your business in days, not months.
          </p>
        </div>

        <button
          onClick={() => {
            forgeAudioSynth.playSuccess();
            if (onCtaClick) {
              onCtaClick();
            } else {
              const el = document.getElementById('automation-calculator') || document.getElementById('consultation');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-black text-xs font-mono tracking-wider uppercase transition-all shadow-xl shadow-emerald-500/20 hover:scale-105 flex items-center justify-center gap-2 shrink-0"
        >
          <span>AUTOMATE THIS FOR MY BUSINESS</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
