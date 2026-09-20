import React from 'react';
import { 
  ArrowRight, Sparkles, Bot, PhoneCall, CheckCircle2, 
  MessageSquare, ShieldCheck, Play, ArrowUpRight, Zap, Calculator
} from 'lucide-react';
import { AIEmployeePreview } from './AIEmployeePreview';

export function ForgeV2HeroScene({ onNavigate, onLaunchSystemDemo, onWatchTenSecDemo }) {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 bg-[#080b11] border-b border-white/[0.08]">
      {/* Ambient Radial Mesh Auroras */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] rounded-full bg-violet-600/10 blur-[130px]" />
        <div className="absolute bottom-10 left-1/3 w-[300px] h-[300px] rounded-full bg-sky-500/10 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Executive Headline & Pitch */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          {/* Factual Subtitle Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] shadow-[0_0_20px_rgba(99,102,241,0.15)] text-slate-200 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold tracking-wide">RINE FORGE SYSTEMS</span>
            <span className="text-slate-500">•</span>
            <span className="text-indigo-300 font-mono text-[11px]">PRODUCTION AUTONOMOUS AGENTS</span>
          </div>

          {/* Captivating, Human-Centric Enterprise Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08]">
            Autonomous Intelligence for{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-300 to-sky-300">
              High-Stakes Operations.
            </span>
          </h1>

          {/* Concrete Executive Subheadline */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            We build and deploy bespoke AI receptionists, autonomous customer pipelines, and operations engines that eliminate manual bottlenecks — answering calls, locking appointments, and updating your CRM 24/7 without error.
          </p>

          {/* Primary High-Conversion Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => onNavigate('receptionist')}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_25px_rgba(99,102,241,0.4)] hover:shadow-[0_0_35px_rgba(99,102,241,0.6)] transition-all transform hover:-translate-y-0.5"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Experience Live AI Concierge</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('roi-calculator');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else onNavigate('roi-calculator');
              }}
              className="px-6 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] hover:border-indigo-500/40 text-slate-200 hover:text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm"
            >
              <Calculator className="w-4 h-4 text-indigo-400" />
              <span>Calculate Lost Revenue ROI</span>
            </button>
          </div>

          {/* Social Proof & Guarantees */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Zero Hallucinations Guarantee
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Grounded in Verified Hours & Catalog
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              1-Click Human Escalation
            </span>
          </div>

          {/* Verified Deployments Proof Bar */}
          <div className="pt-3 border-t border-white/[0.06] max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-[11px] text-slate-400">
            <span className="text-slate-500 uppercase font-mono tracking-wider text-[10px]">Verified Live In:</span>
            <span className="text-slate-300 font-medium">Istanbul Maltepe Dental</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300 font-medium">Sydney 4-Star Resort</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300 font-medium">USA SK Facial Cleansing</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300 font-medium">Austin Surgical Group</span>
          </div>
        </div>

        {/* Living AI Employee Interactive Preview */}
        <div className="relative pt-2">
          <AIEmployeePreview />
        </div>
      </div>
    </section>
  );
}
