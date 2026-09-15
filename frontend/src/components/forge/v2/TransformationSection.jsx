import React from 'react';
import { 
  XCircle, CheckCircle2, ArrowRight, Clock, 
  MessageSquare, UserX, UserCheck, Calendar, 
  Sparkles, Zap, PhoneOff, PhoneCall, TrendingDown, TrendingUp
} from 'lucide-react';
import { ActionButton } from '../v4/ActionButton';

export function TransformationSection({ onOpenAuditModal }) {
  return (
    <section className="py-20 sm:py-28 border-b border-slate-800/80 bg-[#060a14] relative overflow-hidden" id="transformation">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-bold tracking-wider uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>THE OPERATIONAL TRANSFORMATION</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Stop Losing High-Value Leads <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-amber-300 to-emerald-400">
              to Human Delay.
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Every minute an inquiry sits unanswered is a customer booking with your competitor. Here is what happens when Rine Forge replaces manual friction with autonomous execution.
          </p>
        </div>

        {/* Side-by-Side Comparison Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch max-w-6xl mx-auto">
          
          {/* ❌ BEFORE: The Pain of Traditional Ops */}
          <div className="rounded-3xl bg-gradient-to-b from-[#180e14] via-[#12080d] to-[#090407] border-2 border-rose-500/40 p-6 sm:p-9 space-y-6 shadow-2xl relative flex flex-col justify-between">
            <div className="space-y-6">
              
              <div className="flex items-center justify-between border-b border-rose-900/40 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.8)]" />
                  <h3 className="text-lg sm:text-xl font-black text-white uppercase font-mono tracking-wider">
                    BEFORE RINE FORGE
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 text-xs font-mono font-bold border border-rose-500/30">
                  LOST REVENUE & BURNOUT
                </span>
              </div>

              <div className="space-y-4">
                
                <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20 flex items-start gap-3.5">
                  <PhoneOff className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Missed Calls During Rush Hours</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Staff are busy checking in patients or answering customers in front of them. Inbound callers hang up and call the next business on Google.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20 flex items-start gap-3.5">
                  <Clock className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Slow 4–24 Hour Replies</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Website forms, emails, and WhatsApp messages sit in inboxes until someone has a free minute or until the next business morning.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20 flex items-start gap-3.5">
                  <UserX className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Repetitive Question Fatigue</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Staff waste 3+ hours daily answering the exact same questions: "How much is X?", "What time do you close?", "Do you take insurance?".
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20 flex items-start gap-3.5">
                  <TrendingDown className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">After-Hours Inquiries Ignored</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Over 40% of high-intent inquiries occur between 6 PM and 9 AM. With the front desk closed, these potential customers disappear.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            <div className="pt-6 border-t border-rose-900/30 text-xs font-mono text-rose-300/80 flex items-center justify-between">
              <span>Average Response Lag:</span>
              <span className="font-bold text-rose-300">4 hours – Next Day</span>
            </div>
          </div>

          {/* ✅ AFTER: Autonomous Execution with Rine Forge */}
          <div className="rounded-3xl bg-gradient-to-b from-[#091b1a] via-[#061413] to-[#040b0b] border-2 border-emerald-500/50 p-6 sm:p-9 space-y-6 shadow-2xl relative flex flex-col justify-between">
            <div className="space-y-6">
              
              <div className="flex items-center justify-between border-b border-emerald-900/40 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                  <h3 className="text-lg sm:text-xl font-black text-white uppercase font-mono tracking-wider">
                    AFTER RINE FORGE
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30">
                  24/7 REVENUE ACCELERATION
                </span>
              </div>

              <div className="space-y-4">
                
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 flex items-start gap-3.5">
                  <Zap className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">&lt; 5-Second 24/7 Response Time</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Every customer receives an instant, intelligent, grounded answer day or night, weekdays or weekends, on WhatsApp and Web.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 flex items-start gap-3.5">
                  <Calendar className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Instant Calendar & Appointment Booking</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      The AI checks live chair or schedule availability, presents matching slots, collects intake info, and secures the booking directly into your calendar.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 flex items-start gap-3.5">
                  <UserCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Automated Lead Qualification</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      The AI pre-screens inquiries, verifies insurance/budget requirements, and gathers contact info before sending to your team.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 flex items-start gap-3.5">
                  <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Automated Follow-ups & CRM Sync</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Instant appointment confirmation and reminder SMS/WhatsApp dispatched automatically. Zero manual data entry for staff.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            <div className="pt-6 border-t border-emerald-900/30 text-xs font-mono text-emerald-300 flex items-center justify-between">
              <span>Average Response Lag:</span>
              <span className="font-bold text-emerald-300">&lt; 3.5 Seconds (Always Online)</span>
            </div>
          </div>

        </div>

        {/* Central Bottom Action */}
        <div className="text-center pt-4">
          <ActionButton
            variant="primary"
            size="lg"
            onClick={() => {
              if (onOpenAuditModal) {
                onOpenAuditModal({
                  whatToAutomate: 'Eliminate missed after-hours leads and automate appointment booking'
                });
              }
            }}
          >
            TRANSFORM YOUR CUSTOMER EXPERIENCE
          </ActionButton>
        </div>

      </div>
    </section>
  );
}
