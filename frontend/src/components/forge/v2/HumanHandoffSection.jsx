import React, { useState } from 'react';
import { 
  ShieldCheck, UserCheck, AlertTriangle, MessageSquare, 
  ArrowRight, CheckCircle2, Sparkles, Bell, Bot, User, Check
} from 'lucide-react';
import { forgeAudioSynth } from '../../../utils/forgeAudioSynth';

export function HumanHandoffSection({ onOpenAuditModal }) {
  const [testStage, setTestStage] = useState('dialog'); // 'dialog' or 'escalated'

  const handleTestEscalation = () => {
    forgeAudioSynth.playClick();
    setTestStage(testStage === 'dialog' ? 'escalated' : 'dialog');
  };

  return (
    <section id="human-handoff" className="py-20 sm:py-28 bg-[#080c14] border-b border-white/[0.08] relative">
      
      {/* Background subtle illumination */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/[0.05] blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-mono font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Deterministic Guardrails & Human Control</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            AI handles routine work. <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-sky-200 to-white">
              You stay in control.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Our systems never guess or hallucinate answers. When an inquiry falls outside approved documentation, the system safely records caller details, pauses autonomous actions, and immediately alerts your team with the full transcript.
          </p>
        </div>

        {/* 5-Step Escalation Protocol Flow */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
          
          <div className="p-4 rounded-2xl bg-[#0c101a] border border-white/[0.08] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto font-mono text-xs font-bold">
              01
            </div>
            <div className="text-xs font-bold text-white">Routine Requests</div>
            <div className="text-[11px] text-slate-400 leading-tight">
              AI answers hours, pricing, and bookings automatically.
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0c101a] border border-white/[0.08] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto font-mono text-xs font-bold">
              02
            </div>
            <div className="text-xs font-bold text-white">Complex Question</div>
            <div className="text-[11px] text-slate-400 leading-tight">
              Customer asks custom or unlisted procedure details.
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0c101a] border border-white/[0.08] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto font-mono text-xs font-bold">
              03
            </div>
            <div className="text-xs font-bold text-white">Safe Guardrail</div>
            <div className="text-[11px] text-slate-400 leading-tight">
              AI refuses to hallucinate and pauses autonomous action.
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0c101a] border border-white/[0.08] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto font-mono text-xs font-bold">
              04
            </div>
            <div className="text-xs font-bold text-white">Instant Escalation</div>
            <div className="text-[11px] text-slate-400 leading-tight">
              Staff receives text & email with full caller transcript.
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0c101a] border border-white/[0.08] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mx-auto font-mono text-xs font-bold">
              05
            </div>
            <div className="text-xs font-bold text-white">Customer Served</div>
            <div className="text-[11px] text-slate-400 leading-tight">
              Staff steps in with complete context to close the client.
            </div>
          </div>

        </div>

        {/* INTERACTIVE DEMO: WHEN AI DOESN'T KNOW */}
        <div className="max-w-4xl mx-auto bg-[#0c101a] border border-white/[0.1] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
            <div>
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> CONTROLLED UNCERTAINTY SIMULATION
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                See What Happens When the AI Doesn't Know
              </h3>
            </div>

            <button
              onClick={handleTestEscalation}
              className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-mono text-indigo-300 font-bold self-start sm:self-auto transition-colors"
            >
              {testStage === 'dialog' ? 'Trigger Human Escalation →' : 'Reset Simulation'}
            </button>
          </div>

          {/* Interactive Dialog Box */}
          <div className="p-5 rounded-2xl bg-black/40 border border-white/[0.08] space-y-4 font-sans text-xs">
            
            {/* Customer asks unlisted question */}
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-bold shrink-0">
                C
              </div>
              <div className="p-3 rounded-2xl rounded-tl-sm bg-white/[0.06] text-slate-200 border border-white/[0.06] max-w-md leading-relaxed">
                "Do you offer laser gum contouring with Dr. Scott, and what would that cost?"
              </div>
            </div>

            {/* AI graceful refusal */}
            <div className="flex items-start gap-2.5 justify-end">
              <div className="p-3 rounded-2xl rounded-tr-sm bg-indigo-600/30 border border-indigo-500/40 text-slate-100 max-w-md leading-relaxed text-right">
                "I don't want to give you incorrect clinical or pricing information, as laser contouring requires specific doctor evaluation. I can take your name and preferred callback time so Dr. Scott's surgical coordinator can review your case."
              </div>
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                R
              </div>
            </div>

            {/* Customer responds */}
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-bold shrink-0">
                C
              </div>
              <div className="p-3 rounded-2xl rounded-tl-sm bg-white/[0.06] text-slate-200 border border-white/[0.06]">
                "Yes please, my name is Alex Vance, phone is 512-555-0199."
              </div>
            </div>

            {/* Escalated Notification Card */}
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-1.5 animate-fadeIn">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-400">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> ESCALATED TO TEAM ✓
                </span>
                <span className="text-[10px] text-slate-400">DISPATCHED IN 0.6s</span>
              </div>
              <div className="text-xs text-white">
                SMS alert sent to Clinic Coordinator: "Specialized clinical question from Alex Vance (512-555-0199) regarding laser gum contouring. Transcript attached."
              </div>
            </div>

          </div>

          <div className="text-xs text-slate-400 flex items-center justify-between pt-2">
            <span>Zero hallucinated prices. Zero fabricated medical/legal claims.</span>
            <button
              onClick={() => {
                forgeAudioSynth.playClick();
                if (onOpenAuditModal) onOpenAuditModal();
              }}
              className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
            >
              <span>Discuss safety guardrails with us</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
