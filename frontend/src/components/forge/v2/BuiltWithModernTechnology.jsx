import React from 'react';
import { Terminal, Cpu, Zap, Code2, Globe, Database } from 'lucide-react';

export function BuiltWithModernTechnology() {
  const actualTech = [
    {
      name: 'React 19 & Vite',
      category: 'Client Architecture',
      description: 'Zero-latency interactive browser state, instant bundling, and high-performance client rendering.',
      icon: Code2
    },
    {
      name: 'Python 3.12 & FastAPI',
      category: 'Backend Microservices',
      description: 'Asynchronous event loops, non-blocking WebSocket streams, and high-throughput REST APIs.',
      icon: Terminal
    },
    {
      name: 'TailwindCSS',
      category: 'Design System',
      description: 'Zero runtime overhead utility design delivering responsive 60FPS fluid styling.',
      icon: Zap
    },
    {
      name: 'Gemini & OpenAI Models',
      category: 'Generative Reasoning',
      description: 'Structured JSON schema outputs, deterministic task gating, and zero-hallucination policies.',
      icon: Cpu
    },
    {
      name: 'Whisper AI',
      category: 'Acoustic Speech Engine',
      description: 'Sub-second speech-to-text transcription for incoming voice phone triage and call analysis.',
      icon: Database
    },
    {
      name: 'WhatsApp & Twilio APIs',
      category: 'Carrier Routing',
      description: 'Two-way SMS, WhatsApp Cloud messaging, and authenticated telephony webhook callbacks.',
      icon: Globe
    }
  ];

  return (
    <section className="py-14 sm:py-20 border-b border-slate-800/80 bg-[#050711] relative overflow-hidden" id="modern-tech">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-sans">
            BUILT WITH MODERN TECHNOLOGY
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
            No bloated enterprise shelfware. We engineer systems using fast, modern, production-grade tools actually deployed in our codebase.
          </p>
        </div>

        {/* 6 Understated Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {actualTech.map((t, idx) => {
            const Icon = t.icon;
            return (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-[#080d1a]/80 border border-slate-800/80 hover:border-slate-700 transition-colors flex items-start gap-4"
              >
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-teal-400 shrink-0 mt-0.5">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white font-mono">{t.name}</h3>
                  </div>
                  <div className="text-[10px] font-mono text-teal-400/90 font-semibold">{t.category}</div>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">{t.description}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
