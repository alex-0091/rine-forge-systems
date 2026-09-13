import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, ArrowRight, MessageSquare } from 'lucide-react';
import { FORGE_FAQS } from '../../data/siteData';

export function FaqSection({ onNavigate }) {
  const [openIdx, setOpenIdx] = useState(0);

  const toggle = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 border-t border-slate-850 bg-[#080c14] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-mono font-bold tracking-wider uppercase">
            <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Clear Answers to Technical & Commercial Questions
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about how FORGE systems integrate, operate, protect data, and scale in production.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {FORGE_FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`border rounded-xl transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-teal-500/40 bg-[#0c121e]'
                    : 'border-slate-800/80 bg-[#0b0f19]/60 hover:border-slate-700'
                }`}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full text-left px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className={`text-sm sm:text-base font-bold transition-colors ${isOpen ? 'text-teal-300' : 'text-slate-200'}`}>
                    {faq.q}
                  </span>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                    isOpen 
                      ? 'bg-teal-500/20 border-teal-500/40 text-teal-300' 
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}>
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 border-t border-slate-800/60 text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3 font-normal">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Helper Box */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-[#0c1524] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Have a question specific to your software stack?</div>
              <div className="text-xs text-slate-400">We analyze technical feasibility in our free 48-hour architecture audit.</div>
            </div>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('audit')}
            className="w-full sm:w-auto px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-dark-950 font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 shrink-0"
          >
            <span>Ask in Your Audit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
