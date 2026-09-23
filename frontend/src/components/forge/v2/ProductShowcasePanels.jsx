import React, { useState } from 'react';
import { 
  PhoneCall, Users, Calendar, Workflow, 
  BarChart3, CheckCircle2, Clock, ShieldCheck, 
  Sparkles, ArrowRight, Play, Check, Send, AlertCircle
} from 'lucide-react';
import { forgeAudioSynth } from '../../../utils/forgeAudioSynth';

export function ProductShowcasePanels({ onOpenAuditModal }) {
  const [activePanel, setActivePanel] = useState('call');

  const panels = [
    { id: 'call', label: '01 AI Call', icon: PhoneCall },
    { id: 'lead', label: '02 Lead Profile', icon: Users },
    { id: 'appointment', label: '03 Appointment', icon: Calendar },
    { id: 'automation', label: '04 Automation Pipeline', icon: Workflow },
    { id: 'analytics', label: '05 Operational Analytics', icon: BarChart3 },
  ];

  return (
    <section id="product-showcase" className="py-20 sm:py-28 bg-[#070b12] border-b border-white/[0.08] relative">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Tangible Production Architecture</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            See the Systems Inside
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            We don't give you a generic chat bubble. We build synchronized operating layers that capture callers, qualify leads, reserve calendar slots, and track efficiency.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none max-w-4xl mx-auto">
          {panels.map((p) => {
            const Icon = p.icon;
            const isActive = activePanel === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  forgeAudioSynth.playClick();
                  setActivePanel(p.id);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shrink-0 transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.35)]'
                    : 'bg-[#0c101a] text-slate-400 hover:text-white border border-white/[0.08] hover:border-white/[0.16]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* Panel Display Container */}
        <div className="max-w-5xl mx-auto bg-[#0c101a] border border-white/[0.1] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl">
          
          {/* PANEL 1: AI CALL INTERFACE */}
          {activePanel === 'call' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
                <div>
                  <div className="text-xs font-mono text-indigo-400 font-bold uppercase">LIVE SESSION DISPATCH</div>
                  <h3 className="text-xl font-bold text-white mt-1">Inbound Voice Call Session #8941</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/25">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE AUDIO STREAM (180ms)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Caller ID</span>
                  <div className="text-sm font-bold text-white">+1 (415) 892-4410</div>
                  <div className="text-xs text-slate-400">San Francisco, CA • Mobile</div>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Active AI Voice Agent</span>
                  <div className="text-sm font-bold text-white">Elena (Clinical Front Desk)</div>
                  <div className="text-xs text-indigo-400">Grounded Clinic Knowledge Base</div>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Call Sentiment & Intent</span>
                  <div className="text-sm font-bold text-emerald-400">High Urgency • Tooth Pain</div>
                  <div className="text-xs text-slate-400">99.8% Speech Confidence</div>
                </div>
              </div>

              {/* Simulated Real-Time Audio Transcript */}
              <div className="p-5 rounded-2xl bg-black/40 border border-white/[0.06] space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-500 text-[11px] pb-2 border-b border-white/[0.04]">
                  <span>TRANSCRIBED STREAM (WHISPER LARGE V3)</span>
                  <span>RECORDING ENCRYPTED TLS 1.3</span>
                </div>
                <div className="space-y-2 font-sans text-xs">
                  <p><strong className="text-indigo-400 font-mono">[00:04] Elena (AI):</strong> "Good evening, Maltepe Dental Care! How can I assist you with your appointment?"</p>
                  <p><strong className="text-slate-300 font-mono">[00:09] Caller:</strong> "Yes, hi. I have a broken molar and need to see a dentist as soon as possible."</p>
                  <p><strong className="text-indigo-400 font-mono">[00:15] Elena (AI):</strong> "I can help you reserve our next emergency slot with Dr. Scott. We have an opening tomorrow morning at 9:30 AM or Thursday at 2:00 PM. Would 9:30 AM work?"</p>
                  <p><strong className="text-slate-300 font-mono">[00:22] Caller:</strong> "Tomorrow morning at 9:30 is great."</p>
                  <p><strong className="text-indigo-400 font-mono">[00:26] Elena (AI):</strong> "Perfect. I have reserved 9:30 AM for you. I'm texting your confirmation link right now to this phone number."</p>
                </div>
              </div>
            </div>
          )}

          {/* PANEL 2: LEAD PROFILE */}
          {activePanel === 'lead' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
                <div>
                  <div className="text-xs font-mono text-indigo-400 font-bold uppercase">QUALIFIED CONTACT RECORD</div>
                  <h3 className="text-xl font-bold text-white mt-1">Lead ID #LD-90214 • Sarah Johnson</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/25 self-start sm:self-auto">
                  INTENT SCORE: 96 / 100
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                    <div className="text-xs font-mono text-slate-400 uppercase font-bold">Client Overview</div>
                    <div className="text-sm font-bold text-white">Sarah Johnson</div>
                    <div className="text-xs text-slate-300">Email: sarah.j@outlook.com</div>
                    <div className="text-xs text-slate-300">Phone: +1 (650) 441-2099</div>
                    <div className="text-xs text-slate-300">Location: Palo Alto, CA</div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                    <div className="text-xs font-mono text-slate-400 uppercase font-bold">Qualification Insights</div>
                    <div className="text-xs text-slate-300 leading-relaxed">
                      Lead inquired through website contact form at 11:14 PM. AI initiated SMS follow-up at 11:14:48 PM. Lead confirmed budget over $2,500 and requested Thursday consultation.
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3 font-mono text-xs">
                  <div className="text-slate-400 font-bold uppercase text-[11px]">Synced Ecosystem Tools</div>
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-lg bg-black/30 border border-white/[0.04] flex items-center justify-between">
                      <span className="text-white">HubSpot / GoHighLevel CRM</span>
                      <span className="text-emerald-400 font-bold">SYNCED ✓</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-black/30 border border-white/[0.04] flex items-center justify-between">
                      <span className="text-white">Google Calendar</span>
                      <span className="text-emerald-400 font-bold">RESERVED ✓</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-black/30 border border-white/[0.04] flex items-center justify-between">
                      <span className="text-white">Twilio SMS Gateway</span>
                      <span className="text-emerald-400 font-bold">DELIVERED ✓</span>
                    </div>
                  </div>
                  <div className="pt-2 text-[11px] text-slate-500 font-sans">
                    Zero manual data entry performed by business staff.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PANEL 3: APPOINTMENT */}
          {activePanel === 'appointment' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
                <div>
                  <div className="text-xs font-mono text-indigo-400 font-bold uppercase">CALENDAR RESERVATION ENGINE</div>
                  <h3 className="text-xl font-bold text-white mt-1">Confirmed Calendar Booking #APT-4482</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-mono font-bold border border-sky-500/25 self-start sm:self-auto">
                  TWO-WAY CALENDAR SYNC
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Reserved Date & Time</span>
                  <div className="text-base font-bold text-white">Thursday, Oct 30</div>
                  <div className="text-xs text-indigo-300 font-mono">11:00 AM – 11:45 AM EDT</div>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Service Booked</span>
                  <div className="text-base font-bold text-white">Full Cosmetic Consultation</div>
                  <div className="text-xs text-slate-400">Dr. Miller • Exam Room 2</div>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Reminder Status</span>
                  <div className="text-base font-bold text-emerald-400">Sequence Queued</div>
                  <div className="text-xs text-slate-400">SMS -24h and -2h reminders active</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                <div className="text-xs font-mono text-slate-400 uppercase font-bold">Automated Pre-Visit Intake</div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Upon booking, customer receives an automated intake link. Medical history and insurance cards are submitted before the patient steps foot into the clinic, reducing front-desk waiting room congestion to zero.
                </p>
              </div>
            </div>
          )}

          {/* PANEL 4: AUTOMATION PIPELINE */}
          {activePanel === 'automation' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
                <div>
                  <div className="text-xs font-mono text-indigo-400 font-bold uppercase">WORKFLOW ORCHESTRATION</div>
                  <h3 className="text-xl font-bold text-white mt-1">Multi-Channel Customer Pipeline</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/25 self-start sm:self-auto">
                  AUTONOMOUS STATE: RUNNING
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-[10px]">01</span>
                    <span className="text-white">TRIGGER: Inbound missed phone call or website contact form</span>
                  </div>
                  <span className="text-slate-400 text-[11px]">Instantaneous</span>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-[10px]">02</span>
                    <span className="text-white">ACTION: Immediate conversational SMS dispatched to caller's mobile</span>
                  </div>
                  <span className="text-emerald-400 text-[11px]">Delivered in 42s</span>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-[10px]">03</span>
                    <span className="text-white">ACTION: Conversational AI answers questions and presents open calendar times</span>
                  </div>
                  <span className="text-emerald-400 text-[11px]">Verified Schedule</span>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-[10px]">04</span>
                    <span className="text-white">ACTION: Booking confirmed, CRM updated, SMS notification sent to business owner</span>
                  </div>
                  <span className="text-emerald-400 text-[11px]">Completed ✓</span>
                </div>
              </div>
            </div>
          )}

          {/* PANEL 5: ANALYTICS */}
          {activePanel === 'analytics' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
                <div>
                  <div className="text-xs font-mono text-indigo-400 font-bold uppercase">BUSINESS METRICS & ROI</div>
                  <h3 className="text-xl font-bold text-white mt-1">30-Day Operational Efficiency Summary</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-mono font-bold border border-indigo-500/25 self-start sm:self-auto">
                  LIVE CLIENT TELEMETRY
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Avg Response Time</span>
                  <div className="text-2xl font-black text-emerald-400 font-mono">1.2 sec</div>
                  <div className="text-[11px] text-slate-400">Down from 4.2 hours</div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Call Answer Rate</span>
                  <div className="text-2xl font-black text-white font-mono">100%</div>
                  <div className="text-[11px] text-emerald-400">Zero missed calls</div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Appointments Booked</span>
                  <div className="text-2xl font-black text-indigo-300 font-mono">148</div>
                  <div className="text-[11px] text-slate-400">Directly into calendar</div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Admin Hours Saved</span>
                  <div className="text-2xl font-black text-sky-400 font-mono">68 hrs</div>
                  <div className="text-[11px] text-slate-400">Per month on routine tasks</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center space-y-1">
                <div className="text-xs font-bold text-white">Concrete business ROI, measured in hours saved and revenue protected.</div>
                <div className="text-[11px] text-slate-400">No theoretical vanity metrics. Only appointments, recovered calls, and verified time savings.</div>
              </div>
            </div>
          )}

        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-2">
          <button
            onClick={() => {
              forgeAudioSynth.playClick();
              if (onOpenAuditModal) onOpenAuditModal();
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm transition-all shadow-[0_0_20px_rgba(99,102,241,0.35)]"
          >
            <span>See How This Fits Your Business</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
