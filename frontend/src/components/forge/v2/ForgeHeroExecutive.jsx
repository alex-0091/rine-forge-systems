import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, PhoneCall, CheckCircle2, Calendar, 
  MessageSquare, Clock, ShieldCheck, UserCheck, 
  Zap, ArrowUpRight, Play, Check, Sparkles, Bell
} from 'lucide-react';
import { forgeAudioSynth } from '../../../utils/forgeAudioSynth';

export function ForgeHeroExecutive({ onOpenAuditModal, onScrollToDemo }) {
  const [activeStep, setActiveStep] = useState(0);

  // Live progressive simulation of customer inquiry -> booking -> notification
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  const handleAuditClick = () => {
    forgeAudioSynth.playClick();
    if (onOpenAuditModal) onOpenAuditModal();
  };

  const handleDemoClick = () => {
    forgeAudioSynth.playClick();
    if (onScrollToDemo) {
      onScrollToDemo();
    } else {
      const el = document.getElementById('cinematic-workflow') || document.getElementById('live-receptionist');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 bg-[#070b12] border-b border-white/[0.08]">
      {/* Subtle ambient lighting - strictly controlled, no cheesy neon blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 left-1/3 w-[600px] h-[350px] bg-indigo-600/[0.08] blur-[140px] rounded-full" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[300px] bg-sky-500/[0.05] blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* Top Executive Headline & Business Positioning */}
        <div className="text-center space-y-5 max-w-4xl mx-auto">
          
          {/* Eyebrow Label */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] text-slate-300 text-xs font-medium tracking-wide shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">RINE FORGE SYSTEMS</span>
            <span className="text-slate-600">•</span>
            <span className="text-indigo-300 font-mono text-[11px] uppercase tracking-wider">AI Systems for Business</span>
          </div>

          {/* Core Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08]">
            AI Systems That Work <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white to-sky-300">
              While You Work.
            </span>
          </h1>

          {/* Clear, Jargon-Free Subtitle */}
          <p className="text-base sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            Rine Forge builds practical AI systems that answer customers, capture leads, automate follow-ups and remove repetitive work from growing businesses.
          </p>

          {/* High-Converting Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={handleAuditClick}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(99,102,241,0.35)] hover:shadow-[0_0_35px_rgba(99,102,241,0.5)] transition-all transform hover:-translate-y-0.5"
            >
              <span>GET YOUR FREE AI AUDIT</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleDemoClick}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] hover:border-white/[0.2] text-slate-200 hover:text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <span>SEE THE SYSTEM</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Trust Line Under CTAs */}
          <p className="text-xs sm:text-sm text-slate-400 pt-1 flex items-center justify-center gap-2 flex-wrap">
            <span>No technical knowledge required</span>
            <span className="text-slate-600">•</span>
            <span>Built around your business</span>
            <span className="text-slate-600">•</span>
            <span>Human-supported</span>
          </p>
        </div>

        {/* HERO PRODUCT VISUAL: Realistic Business Automation Dashboard */}
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl sm:rounded-3xl bg-[#0c101a] border border-white/[0.12] shadow-[0_25px_70px_rgba(0,0,0,0.6)] overflow-hidden">
            
            {/* Window Top Bar */}
            <div className="bg-[#090d15] px-4 py-3 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-3 text-[11px] font-mono text-slate-400 font-medium">
                  Rine Forge Operational Dispatch Engine • Active
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-semibold border border-emerald-500/25">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  SYSTEM ONLINE
                </span>
              </div>
            </div>

            {/* Dashboard Content Grid */}
            <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-gradient-to-b from-[#0c101a] to-[#080c14]">
              
              {/* Left Column: Live Call & Conversation Feed (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* Live Activity Header */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                      <PhoneCall className="w-4 h-4 animate-bounce" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>Incoming Customer Call</span>
                        <span className="text-[10px] font-mono text-slate-400">09:42:17</span>
                      </div>
                      <div className="text-[11px] text-slate-400">Caller: (415) 892-4410 • San Francisco, CA</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-indigo-500/15 text-indigo-300 text-[10px] font-mono font-bold">
                    AI RECEPTIONIST ACTIVE
                  </span>
                </div>

                {/* Dialog Stream */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-3 font-sans text-xs">
                  
                  {/* Message 1: Customer */}
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-bold shrink-0">
                      C
                    </div>
                    <div className="p-3 rounded-2xl rounded-tl-sm bg-white/[0.06] text-slate-200 leading-relaxed border border-white/[0.06] max-w-sm">
                      "Hi there, I saw your clinic online. I have severe tooth pain and want to book a consultation for next week."
                    </div>
                  </div>

                  {/* Message 2: AI Receptionist */}
                  <div className="flex items-start gap-2.5 justify-end">
                    <div className="p-3 rounded-2xl rounded-tr-sm bg-indigo-600/30 border border-indigo-500/40 text-slate-100 leading-relaxed max-w-sm text-right">
                      "I'm sorry to hear about the pain. We can certainly get you examined. I have Tuesday at 2:00 PM or Thursday at 11:00 AM open. Which works best?"
                    </div>
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      R
                    </div>
                  </div>

                  {/* Message 3: Customer */}
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-bold shrink-0">
                      C
                    </div>
                    <div className="p-3 rounded-2xl rounded-tl-sm bg-white/[0.06] text-slate-200 leading-relaxed border border-white/[0.06]">
                      "Thursday at 11:00 AM is perfect."
                    </div>
                  </div>

                  {/* Message 4: AI Confirmation */}
                  <div className="flex items-start gap-2.5 justify-end">
                    <div className="p-3 rounded-2xl rounded-tr-sm bg-indigo-600/30 border border-indigo-500/40 text-slate-100 leading-relaxed max-w-sm text-right">
                      "You're confirmed for Thursday at 11:00 AM with Dr. Scott. I've sent your appointment confirmation SMS and intake link."
                    </div>
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      R
                    </div>
                  </div>
                </div>

                {/* Subtext */}
                <div className="text-[11px] text-slate-400 flex items-center justify-between px-1">
                  <span>Call handled in 48 seconds with zero human delay.</span>
                  <span className="text-emerald-400 font-mono font-medium">100% Verified Accuracy</span>
                </div>
              </div>

              {/* Right Column: Automated Business Outcomes (5 cols) */}
              <div className="lg:col-span-5 space-y-3 flex flex-col justify-between">
                
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold px-1">
                  Live Action Pipeline
                </div>

                {/* Card 1: Lead Captured */}
                <div className={`p-3.5 rounded-xl border transition-all ${
                  activeStep >= 1 ? 'bg-indigo-500/10 border-indigo-500/40' : 'bg-white/[0.02] border-white/[0.06]'
                }`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5" /> 01 Lead Captured
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      Qualified
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white">Sarah Johnson</div>
                  <div className="text-xs text-slate-400 mt-0.5">Service: Dental Consultation • Severity: Urgent</div>
                </div>

                {/* Card 2: Appointment Request */}
                <div className={`p-3.5 rounded-xl border transition-all ${
                  activeStep >= 2 ? 'bg-indigo-500/10 border-indigo-500/40' : 'bg-white/[0.02] border-white/[0.06]'
                }`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-sky-400 uppercase flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> 02 Appointment Booked
                    </span>
                    <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded">
                      Calendar Synced
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white">Thursday, 11:00 AM</div>
                  <div className="text-xs text-slate-400 mt-0.5">Google Calendar slot reserved • Intake form dispatched</div>
                </div>

                {/* Card 3: Business Notified */}
                <div className={`p-3.5 rounded-xl border transition-all ${
                  activeStep >= 3 ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-white/[0.02] border-white/[0.06]'
                }`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                      <Bell className="w-3.5 h-3.5" /> 03 Business Notified
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Delivered
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white">Instant Team Alerts</div>
                  <div className="text-xs text-slate-400 mt-0.5">SMS & email recap sent to clinic manager with full transcript.</div>
                </div>

                {/* Summary Quote */}
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
                  <div className="text-xs font-bold text-white">
                    "That is what automation should look like."
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    No complicated software for you to learn. The system does the work.
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>

        {/* IMMEDIATE CREDIBILITY STRIP */}
        <div className="pt-4 border-t border-white/[0.08] max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="text-xs sm:text-sm font-bold text-white uppercase font-mono tracking-wider">
                AI Receptionists
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                24/7 call & appointment answering
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="text-xs sm:text-sm font-bold text-white uppercase font-mono tracking-wider">
                Lead Automation
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Instant SMS & email follow-up
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="text-xs sm:text-sm font-bold text-white uppercase font-mono tracking-wider">
                Custom Workflows
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Connected to your existing tools
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="text-xs sm:text-sm font-bold text-white uppercase font-mono tracking-wider">
                Human Oversight
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                You retain complete control
              </div>
            </div>

          </div>

          <div className="text-center pt-5">
            <span className="text-xs sm:text-sm text-slate-300 font-medium bg-white/[0.03] px-4 py-1.5 rounded-full border border-white/[0.08]">
              Built around your business. Not a one-size-fits-all bot.
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
