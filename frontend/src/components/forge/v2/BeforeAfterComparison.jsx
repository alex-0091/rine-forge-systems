import React, { useState } from 'react';
import { 
  CheckCircle2, XCircle, Sparkles, ArrowRight, 
  Clock, Zap, DollarSign, TrendingUp, Check, ArrowDown, User, Bot
} from 'lucide-react';
import { forgeAudioSynth } from '../../../utils/forgeAudioSynth';

export function BeforeAfterComparison({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('lead'); // 'lead' | 'reception' | 'invoice'

  return (
    <section className="py-20 sm:py-28 border-b border-slate-800/80 bg-[#060a12] relative" id="before-after">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold tracking-wider uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>THE OPERATIONAL DELTA</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            BEFORE FORGE <span className="text-slate-500">vs.</span> <span className="text-emerald-400">AFTER FORGE</span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Stop losing customers to slow human lag. Watch how the exact same customer interaction transforms from 15 minutes of manual effort into 30 seconds of automated execution.
          </p>
        </div>

        {/* 🌟 THE STEP-BY-STEP VISUAL WORKFLOW COMPARISON */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* ❌ BEFORE: MANUAL WORKFLOW */}
          <div className="p-6 sm:p-9 rounded-3xl bg-gradient-to-b from-[#180d12] to-[#0d070a] border-2 border-rose-500/40 space-y-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-rose-950/60 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <h3 className="text-xl font-black text-white uppercase tracking-wider font-mono">
                    BEFORE (MANUAL)
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 text-xs font-mono font-bold border border-rose-500/30">
                  😩 15+ MINUTES PER CUSTOMER
                </span>
              </div>

              {/* Vertical Step Nodes */}
              <div className="space-y-3 font-mono text-xs">
                
                <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/20 flex items-center gap-3">
                  <span className="text-xl">📱</span>
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Step 1</div>
                    <div className="text-white font-sans font-bold">Customer sends message or web inquiry</div>
                  </div>
                </div>

                <div className="flex justify-center text-rose-500 -my-1 text-xs">↓</div>

                <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/20 flex items-center gap-3">
                  <span className="text-xl">👨‍💼</span>
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Step 2</div>
                    <div className="text-rose-200 font-sans">Employee notices notification after 2–4 hours</div>
                  </div>
                </div>

                <div className="flex justify-center text-rose-500 -my-1 text-xs">↓</div>

                <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/20 flex items-center gap-3">
                  <span className="text-xl">📋</span>
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Step 3</div>
                    <div className="text-rose-200 font-sans">Manually copies & pastes contact info into CRM</div>
                  </div>
                </div>

                <div className="flex justify-center text-rose-500 -my-1 text-xs">↓</div>

                <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/20 flex items-center gap-3">
                  <span className="text-xl">📞</span>
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Step 4</div>
                    <div className="text-rose-200 font-sans">Calls customer back — goes to voicemail</div>
                  </div>
                </div>

                <div className="flex justify-center text-rose-500 -my-1 text-xs">↓</div>

                <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/20 flex items-center gap-3">
                  <span className="text-xl">📅</span>
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Step 5</div>
                    <div className="text-rose-200 font-sans">Endless back-and-forth email tagging to book time</div>
                  </div>
                </div>

              </div>

            </div>

            {/* Total Impact */}
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs font-mono space-y-1">
              <div className="font-bold uppercase tracking-wider text-rose-300">
                RESULT: EXPENSIVE DELAY & DROPPED LEADS
              </div>
              <p className="text-slate-300 font-sans text-xs">
                78% of customers buy from the company that responds first. Taking 15–60 minutes means losing to faster competitors.
              </p>
            </div>
          </div>

          {/* ⚡ AFTER: WITH FORGE AI EMPLOYEE */}
          <div className="p-6 sm:p-9 rounded-3xl bg-gradient-to-b from-[#081813] to-[#050f0c] border-2 border-emerald-500/60 space-y-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-emerald-950/60 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                  <h3 className="text-xl font-black text-white uppercase tracking-wider font-mono">
                    AFTER FORGE
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/40">
                  ⚡ 30 SECONDS TOTAL
                </span>
              </div>

              {/* Vertical Step Nodes */}
              <div className="space-y-3 font-mono text-xs">
                
                <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-3">
                  <span className="text-xl">📱</span>
                  <div>
                    <div className="text-emerald-400 text-[10px] uppercase font-bold">Step 1</div>
                    <div className="text-white font-sans font-bold">Customer sends message or web inquiry</div>
                  </div>
                </div>

                <div className="flex justify-center text-emerald-400 -my-1 text-xs">↓</div>

                <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-3">
                  <span className="text-xl">🤖</span>
                  <div>
                    <div className="text-emerald-400 text-[10px] uppercase font-bold">Step 2</div>
                    <div className="text-emerald-200 font-sans">AI reads, understands intent & qualifies in 400ms</div>
                  </div>
                </div>

                <div className="flex justify-center text-emerald-400 -my-1 text-xs">↓</div>

                <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-3">
                  <span className="text-xl">🧠</span>
                  <div>
                    <div className="text-emerald-400 text-[10px] uppercase font-bold">Step 3</div>
                    <div className="text-emerald-200 font-sans">AI checks real-time database & calendar availability</div>
                  </div>
                </div>

                <div className="flex justify-center text-emerald-400 -my-1 text-xs">↓</div>

                <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-3">
                  <span className="text-xl">💬</span>
                  <div>
                    <div className="text-emerald-400 text-[10px] uppercase font-bold">Step 4</div>
                    <div className="text-emerald-200 font-sans">Replies automatically with exact answer & booked time</div>
                  </div>
                </div>

                <div className="flex justify-center text-emerald-400 -my-1 text-xs">↓</div>

                <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-3">
                  <span className="text-xl">📊</span>
                  <div>
                    <div className="text-emerald-400 text-[10px] uppercase font-bold">Step 5</div>
                    <div className="text-emerald-200 font-sans">Updates CRM & calendar with zero human intervention</div>
                  </div>
                </div>

              </div>

            </div>

            {/* Total Impact */}
            <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-xs font-mono space-y-1">
              <div className="font-bold uppercase tracking-wider text-emerald-300">
                RESULT: 30 SECONDS • ZERO TIRED EMPLOYEES
              </div>
              <p className="text-slate-200 font-sans text-xs">
                Inquiries are booked and closed while customer interest is highest. 24/7/365 reliability with zero payroll burden.
              </p>
            </div>
          </div>

        </div>

        {/* 📊 CONCRETE ROI NUMBERS GRID (#10) */}
        <div className="space-y-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h3 className="text-2xl font-black text-white">
              The Measurable Numbers
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm font-mono">
              Typical operational metrics before and after deploying a FORGE AI Employee:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Metric 1 */}
            <div className="p-6 rounded-3xl bg-[#091120] border border-slate-800 space-y-4">
              <div className="text-slate-400 font-mono text-xs uppercase font-bold flex items-center justify-between">
                <span>Customer Follow-Up</span>
                <Clock className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="space-y-3 pt-1">
                <div className="p-3 rounded-2xl bg-rose-950/20 border border-rose-500/20">
                  <div className="text-[10px] font-mono text-rose-400 font-bold uppercase">Before FORGE</div>
                  <div className="text-xl font-bold text-white font-sans">8 hrs / week</div>
                  <div className="text-slate-400 text-xs">Lost in manual triage</div>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
                  <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase">After FORGE</div>
                  <div className="text-xl font-black text-emerald-300 font-sans">24/7 Availability</div>
                  <div className="text-slate-300 text-xs">Zero dropped off-hour leads</div>
                </div>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="p-6 rounded-3xl bg-[#091120] border border-slate-800 space-y-4">
              <div className="text-slate-400 font-mono text-xs uppercase font-bold flex items-center justify-between">
                <span>Potential Labor Cost</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="space-y-3 pt-1">
                <div className="p-3 rounded-2xl bg-rose-950/20 border border-rose-500/20">
                  <div className="text-[10px] font-mono text-rose-400 font-bold uppercase">Before FORGE</div>
                  <div className="text-xl font-bold text-white font-sans">$1,200 / month</div>
                  <div className="text-slate-400 text-xs">Spent on repetitive admin tasks</div>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
                  <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase">After FORGE</div>
                  <div className="text-xl font-black text-emerald-300 font-sans">90%+ Automated</div>
                  <div className="text-slate-300 text-xs">Routine busywork handled for cents</div>
                </div>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="p-6 rounded-3xl bg-[#091120] border border-slate-800 space-y-4">
              <div className="text-slate-400 font-mono text-xs uppercase font-bold flex items-center justify-between">
                <span>Average Response Speed</span>
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <div className="space-y-3 pt-1">
                <div className="p-3 rounded-2xl bg-rose-950/20 border border-rose-500/20">
                  <div className="text-[10px] font-mono text-rose-400 font-bold uppercase">Before FORGE</div>
                  <div className="text-xl font-bold text-white font-sans">23% Contacted</div>
                  <div className="text-slate-400 text-xs">Hours of delayed response</div>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
                  <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase">After FORGE</div>
                  <div className="text-xl font-black text-emerald-300 font-sans">&lt; 1 Minute</div>
                  <div className="text-slate-300 text-xs">Instant sub-minute engagement</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Callout */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0c1824] to-[#08111a] border border-emerald-500/40 text-center space-y-5 max-w-3xl mx-auto shadow-2xl">
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white">
              Ready to Delete Repetitive Busywork?
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto">
              We'll audit your business operations for free and pinpoint 3–5 exact tasks you can automate this week.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 font-mono text-xs">
            <button
              onClick={() => {
                forgeAudioSynth.playSuccess();
                if (onNavigate) onNavigate('audit');
              }}
              className="px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-dark-950 font-black flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/25"
            >
              <span>GET YOUR FREE AI AUDIT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
