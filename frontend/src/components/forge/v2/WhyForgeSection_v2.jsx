import React from 'react';
import { Target, Zap, Clock, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { forgeAudioSynth } from '../../../utils/forgeAudioSynth';

export function WhyForgeSection_v2({ onOpenAuditModal }) {
  const points = [
    {
      title: 'BUILT AROUND YOUR BUSINESS',
      subtitle: 'Not generic chatbot templates.',
      icon: Target,
      color: 'teal',
      border: 'border-teal-500/30 hover:border-teal-400',
      bg: 'bg-[#061219]/80',
      visual: (
        <div className="p-3 rounded-xl bg-slate-950 border border-teal-950 font-mono text-[10px] space-y-1.5">
          <div className="flex items-center justify-between text-slate-500">
            <span>Generic AI:</span>
            <span className="text-rose-400">Fixed Templates ✕</span>
          </div>
          <div className="flex items-center justify-between text-teal-300 font-bold">
            <span>FORGE System:</span>
            <span className="text-emerald-400">Custom Architecture ✓</span>
          </div>
        </div>
      )
    },
    {
      title: 'AI + AUTOMATION',
      subtitle: 'AI understands the request and automation takes the action.',
      icon: Zap,
      color: 'cyan',
      border: 'border-cyan-500/30 hover:border-cyan-400',
      bg: 'bg-[#06101c]/80',
      visual: (
        <div className="p-3 rounded-xl bg-slate-950 border border-cyan-950 font-mono text-[10px] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-cyan-400">Brain (LLM):</span>
            <span className="text-slate-300">Extracts Intent</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-teal-400">Engine (API):</span>
            <span className="text-emerald-400 font-bold">Dispatches Webhook</span>
          </div>
        </div>
      )
    },
    {
      title: 'WORKS 24/7',
      subtitle: 'Systems continue operating outside business hours.',
      icon: Clock,
      color: 'indigo',
      border: 'border-indigo-500/30 hover:border-indigo-400',
      bg: 'bg-[#0c0e22]/80',
      visual: (
        <div className="p-3 rounded-xl bg-slate-950 border border-indigo-950 font-mono text-[10px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white font-bold">02:45 AM Active</span>
          </div>
          <span className="text-emerald-400 font-bold">100% Response Rate</span>
        </div>
      )
    },
    {
      title: 'HUMAN CONTROL',
      subtitle: 'Businesses can monitor, review and intervene when needed.',
      icon: ShieldCheck,
      color: 'emerald',
      border: 'border-emerald-500/30 hover:border-emerald-400',
      bg: 'bg-[#061410]/80',
      visual: (
        <div className="p-3 rounded-xl bg-slate-950 border border-emerald-950 font-mono text-[10px] space-y-1.5">
          <div className="flex items-center justify-between text-slate-400">
            <span>Intervention Mode:</span>
            <span className="text-emerald-300 font-bold">One-Click Override</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Audit Trail:</span>
            <span className="text-white">Full Event Logs ✓</span>
          </div>
        </div>
      )
    }
  ];

  return (
    <section className="py-16 sm:py-24 border-b border-slate-800/80 bg-[#050813] relative overflow-hidden" id="why-forge">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold tracking-wider uppercase shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>CORE PHILOSOPHY</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            WHY FORGE?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            Built for operators who want reliable autonomous execution without breaking their existing workflows.
          </p>
        </div>

        {/* 4 Concise Visual Points */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {points.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <div
                key={idx}
                className={`p-6 rounded-2xl border ${pt.border} ${pt.bg} flex flex-col justify-between space-y-5 transition-all duration-300 hover:scale-[1.02] shadow-xl`}
              >
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-teal-400">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-sm font-black text-white font-mono uppercase tracking-wider">
                    {pt.title}
                  </h3>

                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {pt.subtitle}
                  </p>
                </div>

                <div>
                  {pt.visual}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
