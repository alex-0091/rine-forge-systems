import React, { useState } from 'react';
import { 
  CheckCircle2, XCircle, Sparkles, ArrowRight, 
  Sliders, ShieldCheck, Flame, Zap, Clock 
} from 'lucide-react';

const COMPARISON_ITEMS = [
  {
    category: 'Customer Phone Calls',
    before: 'Calls ring to voicemail after hours. Prospects hang up and call a competitor.',
    after: 'FORGE Receptionist answers in under 2s, checks provider availability, and books the chair/consultation slot directly in your calendar.'
  },
  {
    category: 'Inbound Webhook Leads',
    before: 'Inquiries sit unread in inbox for 24-48 hours. Lead conversion rate drops by 80%.',
    after: 'FORGE Lead Engine scores 0-100 ICP fit in 45s and triggers 2-way SMS verification to lock high-intent buyers.'
  },
  {
    category: 'Invoices & Paperwork',
    before: 'Staff spends 15+ hours/week manually re-typing PDF invoice line-items into accounting software.',
    after: 'FORGE Document Engine runs OCR, performs mathematical sum checksum verification, and queues clean entries for 1-click approval.'
  },
  {
    category: 'Support & FAQs',
    before: 'Repetitive standard questions clog customer support queues with multi-day turnaround.',
    after: 'FORGE Support Agent resolves 80%+ of inquiries instantly using your private vector knowledge base with verifiable source citations.'
  },
  {
    category: 'Appointment Scheduling',
    before: 'Endless back-and-forth emails negotiating time slots, leading to dropped appointments.',
    after: 'Direct real-time calendar synchronization with automated SMS reminders and zero double-booking.'
  }
];

export function BeforeAfterComparison({ onNavigate }) {
  const [sliderPos, setSliderPos] = useState(50);

  return (
    <section className="py-20 sm:py-28 border-b border-slate-800/80 bg-[#060a12] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold tracking-wider uppercase">
            <Sliders className="w-3.5 h-3.5" /> THE OPERATIONAL DELTA
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            BEFORE FORGE vs. WITH FORGE
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Drag the comparison slider or inspect the workflow breakdown to see the measurable transformation across every business channel.
          </p>
        </div>

        {/* Interactive Comparison Cards Grid */}
        <div className="space-y-4">
          {COMPARISON_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-3xl bg-[#090e18] border border-slate-800 hover:border-slate-700 transition-all grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
            >
              {/* Channel Label (3 cols) */}
              <div className="lg:col-span-3 space-y-1">
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 font-bold uppercase">
                  CHANNEL 0{idx + 1}
                </span>
                <h3 className="text-lg font-bold text-white font-sans">{item.category}</h3>
              </div>

              {/* WITHOUT FORGE (4 cols) */}
              <div className="lg:col-span-4 p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2 text-xs font-sans">
                <div className="flex items-center gap-1.5 text-rose-400 font-mono font-bold text-[11px] uppercase">
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>Without FORGE</span>
                </div>
                <p className="text-slate-300 leading-relaxed">{item.before}</p>
              </div>

              {/* WITH FORGE (5 cols) */}
              <div className="lg:col-span-5 p-4 rounded-2xl bg-teal-950/20 border border-teal-500/30 space-y-2 text-xs font-sans">
                <div className="flex items-center gap-1.5 text-teal-400 font-mono font-bold text-[11px] uppercase">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>With FORGE Autonomous OS</span>
                </div>
                <p className="text-slate-200 leading-relaxed font-medium">{item.after}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Callout */}
        <div className="p-8 rounded-3xl bg-[#090e18] border border-teal-500/40 text-center space-y-6 max-w-3xl mx-auto shadow-2xl">
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white">Stop Losing Revenue to Slow Manual Work</h3>
            <p className="text-slate-300 text-xs sm:text-sm">
              Launch a 100% sandboxed pilot for one process in 48 hours. Prove value before full deployment.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 font-mono text-xs">
            <button
              onClick={() => onNavigate && onNavigate('audit')}
              className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2"
            >
              <span>REQUEST 48-HOUR AI AUDIT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
