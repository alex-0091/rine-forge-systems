import React from 'react';
import { 
  Bot, Sparkles, CheckCircle2, ArrowRight, 
  Calendar, ShieldCheck, Clock, Zap 
} from 'lucide-react';
import { ActionButton } from '../v4/ActionButton';

export function StrongCtaSection({ onOpenAuditModal }) {
  return (
    <section className="py-24 sm:py-32 bg-gradient-to-b from-[#070c18] via-[#091224] to-[#050912] border-b border-slate-800/80 relative overflow-hidden" id="get-ai-employee">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-gradient-to-r from-teal-500/15 via-cyan-500/10 to-indigo-500/15 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-10">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold tracking-wider uppercase shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          <span>START THIS WEEK</span>
        </div>

        {/* Heading */}
        <div className="space-y-4">
          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.08] font-sans">
            Get Your AI Employee. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-cyan-300 to-indigo-400">
              Never Miss Another Customer.
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-slate-200 font-medium max-w-2xl mx-auto leading-relaxed">
            Turn after-hours website traffic and WhatsApp messages into confirmed appointments and revenue on autopilot.
          </p>
        </div>

        {/* CTA Block */}
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <ActionButton
              variant="primary"
              size="lg"
              onClick={() => {
                if (onOpenAuditModal) {
                  onOpenAuditModal({
                    whatToAutomate: 'Build 24/7 AI Receptionist for my business'
                  });
                }
              }}
            >
              BUILD MY AI RECEPTIONIST
            </ActionButton>

            <ActionButton
              variant="secondary"
              size="lg"
              showIcon={false}
              onClick={() => {
                const el = document.getElementById('live-receptionist-demo');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              TEST LIVE DEMO AGAIN
            </ActionButton>
          </div>

          <div className="text-xs font-mono text-teal-300/90 font-medium flex items-center justify-center gap-2">
            <span>Free 15-Minute Automation Audit</span>
            <span>•</span>
            <span>No obligation</span>
            <span>•</span>
            <span>Live in under 7 days</span>
          </div>
        </div>

        {/* 3 Audit Deliverables */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-6 max-w-4xl mx-auto">
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-teal-400 font-mono text-xs font-bold uppercase">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>1. Bottleneck Audit</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              We pinpoint where your business is currently leaking leads, unanswered calls, and slow WhatsApp replies.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>2. Interactive Preview</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              We demo a custom AI receptionist answering questions using your real services, operating hours, and prices.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>3. Exact ROI Blueprint</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              We present a clear financial ROI projection and a transparent 7-day implementation roadmap with zero lock-in.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
