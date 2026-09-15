import React from 'react';
import { 
  ShieldCheck, Award, CheckCircle2, Lock, 
  Building2, MapPin, Mail, Sparkles, ExternalLink, Cpu 
} from 'lucide-react';
import { ActionButton } from '../v4/ActionButton';

export function TrustAndProofSection({ onOpenAuditModal }) {
  return (
    <section className="py-20 sm:py-28 border-b border-slate-800/80 bg-[#060a14] relative" id="trust-proof">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold tracking-wider uppercase shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>REAL SYSTEMS • REAL PROOF</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Production-Grade Reliability. <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-cyan-300 to-indigo-400">
              Not a Demonstration Toy.
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            We build hardened AI automation infrastructure that protects your brand, obeys your exact business rules, and delivers genuine operational ROI.
          </p>
        </div>

        {/* Featured Case Study: Rine Dental & Facial Aesthetics */}
        <div className="max-w-5xl mx-auto rounded-3xl bg-[#0b1220] border-2 border-teal-500/30 p-6 sm:p-10 shadow-2xl space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-teal-400 font-bold">
                <span>VERIFIED CASE STUDY</span>
                <span>•</span>
                <span>AUSTIN, TX</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white font-sans mt-1">
                Rine Dental & Facial Aesthetics
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Premier restorative dentistry, cosmetic whitening, and aesthetics practice.
              </p>
            </div>

            <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold">
              ACTIVE PRODUCTION SYSTEM
            </span>
          </div>

          {/* 4 Stat Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
              <div className="text-2xl sm:text-3xl font-black font-mono text-white">38+</div>
              <div className="text-[11px] font-mono text-slate-400 uppercase">After-Hours Bookings / Mo</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
              <div className="text-2xl sm:text-3xl font-black font-mono text-teal-400">2.4s</div>
              <div className="text-[11px] font-mono text-slate-400 uppercase">Avg Response Time</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
              <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">0</div>
              <div className="text-[11px] font-mono text-slate-400 uppercase">Missed Patient Calls</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
              <div className="text-2xl sm:text-3xl font-black font-mono text-indigo-400">100%</div>
              <div className="text-[11px] font-mono text-slate-400 uppercase">Factually Grounded</div>
            </div>
          </div>

          {/* Architecture Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-teal-400 font-bold text-xs font-mono">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero-Hallucination Grounding</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                The AI is strictly bounded by verified service menus, prices, and clinic hours. It never guesses or offers unverified medical advice.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs font-mono">
                <Lock className="w-4 h-4" />
                <span>Multi-Tenant Data Privacy</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Complete database partition between tenants. Patient contacts and conversation history are strictly isolated and encrypted.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs font-mono">
                <Cpu className="w-4 h-4" />
                <span>Deterministic Human Handoff</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                When a customer requests a person or a complex situation arises, Elena gracefully escalates to human staff with full conversation context.
              </p>
            </div>
          </div>

        </div>

        {/* Company Identity & Physical Trust */}
        <div className="max-w-4xl mx-auto rounded-2xl bg-slate-900/60 border border-slate-800 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left text-xs font-mono text-slate-400">
          <div className="space-y-1">
            <div className="text-white font-bold text-sm font-sans flex items-center justify-center sm:justify-start gap-2">
              <Building2 className="w-4 h-4 text-teal-400" />
              <span>Built & Maintained by Rine Forge Systems</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>100 Innovation Way, Suite 400, Austin, TX & Global Delivery</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Mail className="w-3.5 h-3.5 text-teal-400" />
              <span>alexrine691@gmail.com</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
