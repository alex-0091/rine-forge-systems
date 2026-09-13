import React from 'react';
import { 
  Bot, Zap, Cog, ArrowRight, CheckCircle2, 
  MessageSquare, Mail, Globe, PhoneCall, Search, 
  Calendar, Database, FileText, BarChart3, RefreshCw, Sparkles, Play
} from 'lucide-react';
import { forgeAudioSynth } from '../../../utils/forgeAudioSynth';

export function WhatForgeCanDo({ onNavigate, onWatchDemo }) {
  const handleWatch = (sysId) => {
    forgeAudioSynth.playClick();
    if (onWatchDemo) {
      onWatchDemo(sysId);
    } else {
      const el = document.getElementById('watch-demos');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 sm:py-28 border-b border-slate-800/80 bg-[#070c18] relative" id="what-we-do">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold tracking-wider uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>WHAT CAN FORGE DO?</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            THREE DIGITAL WORKERS. <br />
            <span className="text-cyan-400">ZERO REPETITIVE BUSYWORK.</span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Instead of building generic chatbots, we deploy specialized autonomous employees that plug into your existing software and perform actual operational work.
          </p>
        </div>

        {/* 3 Large Visual Digital Worker Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 1. 🤖 AI CUSTOMER SERVICE */}
          <div className="rounded-3xl bg-gradient-to-b from-[#0e172a] to-[#080d1a] border-2 border-cyan-500/40 p-7 sm:p-8 space-y-6 shadow-2xl flex flex-col justify-between relative overflow-hidden group hover:border-cyan-400 transition-all">
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center text-2xl shadow-lg shadow-cyan-500/20">
                  🤖
                </div>
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-[10px] font-mono font-bold border border-cyan-500/30">
                  24/7 AVAILABILITY
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white group-hover:text-cyan-300 transition-colors">
                  AI Customer Service
                </h3>
                <p className="text-xs text-cyan-400 font-mono font-bold pt-1">
                  Your AI receptionist works 24/7.
                </p>
                <p className="text-slate-300 text-xs sm:text-sm font-sans pt-2 leading-relaxed">
                  Answers customer questions, resolves inquiries with verified knowledge, and locks appointment bookings with zero hold times.
                </p>
              </div>

              {/* Supported Channels */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">
                  Works on all your channels:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-200">
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                    <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Phone Calls</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-pink-400" />
                    <span>Email Inbox</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Website Chat</span>
                  </div>
                </div>
              </div>

              {/* Key Capabilities */}
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Sub-second voice & text response</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>0% hallucination vector knowledge grounding</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Direct calendar booking & confirmation</span>
                </div>
              </div>

            </div>

            <button
              onClick={() => handleWatch('receptionist-agent')}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-dark-950 font-mono text-xs font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Watch Customer Service Demo →</span>
            </button>
          </div>

          {/* 2. 🎯 AI SALES AGENT */}
          <div className="rounded-3xl bg-gradient-to-b from-[#180e2a] to-[#0d081a] border-2 border-violet-500/40 p-7 sm:p-8 space-y-6 shadow-2xl flex flex-col justify-between relative overflow-hidden group hover:border-violet-400 transition-all">
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/20 border border-violet-500/40 text-violet-300 flex items-center justify-center text-2xl shadow-lg shadow-violet-500/20">
                  🎯
                </div>
                <span className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 text-[10px] font-mono font-bold border border-violet-500/30">
                  SUB-45s RESPONSE
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white group-hover:text-violet-300 transition-colors">
                  AI Sales Agent
                </h3>
                <p className="text-xs text-violet-400 font-mono font-bold pt-1">
                  Turn incoming leads into confirmed appointments.
                </p>
                <p className="text-slate-300 text-xs sm:text-sm font-sans pt-2 leading-relaxed">
                  Never lose a hot buyer because inquiry sat in an inbox for 24 hours. Engages web leads in under 45 seconds while they are still on your site.
                </p>
              </div>

              {/* 4 Steps */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">
                  The 4-Step Sales Sequence:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-200">
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-violet-400" />
                    <span>1. Qualify ICP</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                    <span>2. 2-Way SMS</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    <span>3. Schedule</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-amber-400" />
                    <span>4. Sync CRM</span>
                  </div>
                </div>
              </div>

              {/* Key Capabilities */}
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                  <span>Responds while customer intent is at peak</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                  <span>Filters budget, location & pre-approval</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                  <span>Syncs to HubSpot, Follow Up Boss, or Salesforce</span>
                </div>
              </div>

            </div>

            <button
              onClick={() => handleWatch('lead-agent')}
              className="w-full py-3 rounded-xl bg-violet-500 hover:bg-violet-400 text-white font-mono text-xs font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-500/20"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Watch Sales Agent Demo →</span>
            </button>
          </div>

          {/* 3. ⚙️ BUSINESS AUTOMATION */}
          <div className="rounded-3xl bg-gradient-to-b from-[#241508] to-[#120a04] border-2 border-orange-500/40 p-7 sm:p-8 space-y-6 shadow-2xl flex flex-col justify-between relative overflow-hidden group hover:border-orange-400 transition-all">
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/40 text-orange-300 flex items-center justify-center text-2xl shadow-lg shadow-orange-500/20">
                  ⚙️
                </div>
                <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-300 text-[10px] font-mono font-bold border border-orange-500/30">
                  SAVE 15+ HRS/WEEK
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white group-hover:text-orange-300 transition-colors">
                  Business Automation
                </h3>
                <p className="text-xs text-orange-400 font-mono font-bold pt-1">
                  Make repetitive work disappear forever.
                </p>
                <p className="text-slate-300 text-xs sm:text-sm font-sans pt-2 leading-relaxed">
                  Eliminates tedious manual typing, paperwork reconciliation, report generation, and status check-ins across your business tools.
                </p>
              </div>

              {/* Repetitive Tasks Handled */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">
                  Automates everyday tasks:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-200">
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-orange-400" />
                    <span>Invoices OCR</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                    <BarChart3 className="w-3.5 h-3.5 text-teal-400" />
                    <span>KPI Reports</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Data Entry</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 text-pink-400" />
                    <span>Follow-ups</span>
                  </div>
                </div>
              </div>

              {/* Key Capabilities */}
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>Optical PDF parsing & tax sum verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>Connects QuickBooks, Google Sheets & Slack</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>Automated 5-star review request sequences</span>
                </div>
              </div>

            </div>

            <button
              onClick={() => handleWatch('document-processor')}
              className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-dark-950 font-mono text-xs font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/20"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Watch Automation Demo →</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
