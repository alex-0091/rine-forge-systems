import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, ArrowRight } from 'lucide-react';
import { FORGE_FAQS } from '../../data/siteData';
import { forgeAudioSynth } from '../../utils/forgeAudioSynth';

export function FaqSection({ onNavigate, onOpenAuditModal }) {
  const [openIdx, setOpenIdx] = useState(0);

  const toggle = (idx) => {
    forgeAudioSynth.playClick();
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 sm:py-28 border-b border-white/[0.08] bg-[#070b12] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-mono font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>Frequently Asked Questions</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Clear Answers for Business Owners
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about how Rine Forge systems integrate, operate, protect data, and scale in production.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {FORGE_FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-indigo-500/40 bg-[#0c101a] shadow-lg'
                    : 'border-white/[0.08] bg-[#090d16] hover:border-white/[0.16]'
                }`}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full text-left px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className={`text-sm sm:text-base font-bold transition-colors ${isOpen ? 'text-indigo-200' : 'text-slate-200'}`}>
                    {faq.q}
                  </span>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                    isOpen 
                      ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300' 
                      : 'bg-white/[0.04] border-white/[0.08] text-slate-400'
                  }`}>
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 border-t border-white/[0.06] text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3 font-normal">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom prompt */}
        <div className="text-center pt-4">
          <p className="text-xs text-slate-400">
            Have a question about your specific software stack or phone setup?
          </p>
          <button
            onClick={() => {
              forgeAudioSynth.playClick();
              if (onOpenAuditModal) onOpenAuditModal();
            }}
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <span>Ask us during your free opportunity audit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
}
