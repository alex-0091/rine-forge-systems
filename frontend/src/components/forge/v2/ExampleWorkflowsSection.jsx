import React from 'react';
import { Stethoscope, Wrench, Scale, ArrowRight, CheckCircle2, Sparkles, Building2 } from 'lucide-react';
import { forgeAudioSynth } from '../../../utils/forgeAudioSynth';

export function ExampleWorkflowsSection({ onOpenAuditModal }) {
  const workflows = [
    {
      sector: 'A DENTAL PRACTICE',
      icon: Stethoscope,
      problem: 'Inbound calls arrive constantly while front-desk staff are greeting arriving patients, processing insurance cards, and taking copays. Callers encounter busy signals or voicemail and hang up.',
      system: '24/7 AI Receptionist + Calendar Booking Engine',
      flow: ['Inbound Phone Call', 'Grounded FAQ Resolution', 'Calendar Slot Reservation', 'Instant SMS Confirmation', 'Two-Way CRM Synchronization'],
      result: 'Zero missed phone calls during morning patient rushes; 100% of after-hours appointment inquiries captured without front-desk overtime.'
    },
    {
      sector: 'PLUMBING & TRADES COMPANY',
      icon: Wrench,
      problem: 'Field technicians are in crawlspaces, under sinks, or driving between appointments. When emergency calls ring, technicians cannot answer, and homeowners immediately call the next plumber on Google.',
      system: 'Emergency Call Triage + On-Call Dispatcher',
      flow: ['Missed Inbound Call', 'Immediate Conversational SMS in 30s', 'Emergency Severity Triage', 'Service Address Verification', 'Technician Dispatch Alert via SMS'],
      result: 'Recovers 12–25 emergency weekend service calls per month that previously went to voicemail, without employing a full-time overnight dispatcher.'
    },
    {
      sector: 'A BOUTIQUE LAW PRACTICE',
      icon: Scale,
      problem: 'Prospective clients in high-stakes situations reach out to multiple attorneys. The firm that responds first and conducts an immediate intake consultation almost always secures the retainer.',
      system: 'Speed-to-Lead Qualifier + Conflict Intake Flow',
      flow: ['Web Form or Missed Call', 'Automated 45-Second Response', 'Confidential Practice Area Triage', 'Conflict Intake Questionnaire', 'Consultation Placed on Attorney Docket'],
      result: 'Speed-to-lead reduced from 4.5 hours down to 45 seconds; prospective clients receive immediate confirmation rather than continuing to search for other firms.'
    }
  ];

  return (
    <section id="example-workflows" className="py-20 sm:py-28 bg-[#070b12] border-b border-white/[0.08] relative">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-mono font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Honest Systems Architecture</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Example Production Workflows
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            We don't invent fake client testimonials or exaggerated revenue figures. Here is exactly how Rine Forge systems are structured to solve real operational bottlenecks.
          </p>
        </div>

        {/* 3 Example Workflow Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {workflows.map((wf, idx) => {
            const Icon = wf.icon;
            return (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-3xl bg-[#0c101a] border border-white/[0.08] hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-6 shadow-xl"
              >
                <div className="space-y-5">
                  
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-mono text-xs font-bold text-white tracking-wider">
                        {wf.sector}
                      </span>
                    </div>
                  </div>

                  {/* Problem */}
                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] font-mono uppercase font-bold text-rose-400">The Problem:</span>
                    <p className="text-slate-300 leading-relaxed">{wf.problem}</p>
                  </div>

                  {/* System Built */}
                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] font-mono uppercase font-bold text-indigo-400">System Deployed:</span>
                    <div className="text-white font-bold">{wf.system}</div>
                  </div>

                  {/* Flow Steps */}
                  <div className="space-y-2 pt-1 border-t border-white/[0.06]">
                    <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">Pipeline Architecture:</span>
                    <div className="space-y-1.5 font-mono text-[11px] text-slate-300">
                      {wf.flow.map((step, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-2">
                          <span className="text-indigo-400">→</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Concrete Result */}
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1 text-xs">
                    <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Concrete Outcome:
                    </span>
                    <p className="text-slate-200 leading-relaxed font-sans">{wf.result}</p>
                  </div>

                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      forgeAudioSynth.playClick();
                      if (onOpenAuditModal) onOpenAuditModal({ whatToAutomate: `Workflow for ${wf.sector}` });
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-indigo-600 hover:text-white border border-white/[0.08] text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Configure this workflow</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
