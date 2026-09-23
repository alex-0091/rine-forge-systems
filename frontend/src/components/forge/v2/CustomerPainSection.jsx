import React from 'react';
import { 
  PhoneOff, Clock, MessageSquare, Repeat, 
  ArrowRight, AlertCircle, ShieldAlert, Sparkles, CheckCircle2 
} from 'lucide-react';
import { forgeAudioSynth } from '../../../utils/forgeAudioSynth';

export function CustomerPainSection({ onOpenAuditModal }) {
  const painPoints = [
    {
      id: 'missed-calls',
      icon: PhoneOff,
      badge: 'MISSED CALLS',
      title: 'Customer calls. Nobody answers. They call the next business.',
      description: 'During peak hours or after 5 PM, inbound callers encounter a busy signal or voicemail. 80% of callers do not leave a voicemail — they tap the next search result on Google.',
      cost: 'Cost: 3 to 10 lost high-value clients every week.'
    },
    {
      id: 'lead-goes-cold',
      icon: Clock,
      badge: 'SLOW FOLLOW-UP',
      title: 'Someone fills out an inquiry form. Nobody responds quickly.',
      description: 'Leads respond best within 5 minutes. When inquiries sit in an inbox for hours while your team is busy with customers, the lead gets cold or books elsewhere.',
      cost: 'Cost: Up to 50% drop in lead-to-booking conversion.'
    },
    {
      id: 'repetitive-questions',
      icon: MessageSquare,
      badge: 'REPETITIVE INQUIRIES',
      title: 'Your staff answers the same 5 questions all day long.',
      description: '"How much does X cost?", "Where are you located?", "Do you have Friday open?" Answering routine FAQs drains dozens of staff hours that should go toward serving paying clients.',
      cost: 'Cost: 15+ wasted staff hours per week in routine triage.'
    },
    {
      id: 'owner-does-everything',
      icon: Repeat,
      badge: 'THE OWNER DOES EVERYTHING',
      title: 'Calls. Messages. Appointments. Follow-ups. Admin. Repeat.',
      description: 'You started your business to deliver great work, not to spend your evenings copying data into spreadsheets, sending manual appointment reminders, and returning voicemails.',
      cost: 'Cost: Owner burnout, lost time, and capped revenue growth.'
    }
  ];

  return (
    <section id="problem" className="py-16 sm:py-24 bg-[#080c14] border-b border-white/[0.08] relative overflow-hidden">
      
      {/* Background glow accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-rose-500/[0.03] blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs font-mono font-bold uppercase tracking-wider">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>The Silent Revenue Leak</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Your customers don't wait. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-300 via-amber-200 to-slate-200">
              Your business is losing time in places you can't see.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Small businesses don't lose customers because of poor service. They lose them during the friction moments—when nobody answers the phone, when a lead waits for a callback, or when admin piles up.
          </p>
        </div>

        {/* 4 Concrete Problem Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {painPoints.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.id}
                className="p-6 sm:p-7 rounded-2xl bg-[#0c101a] border border-white/[0.08] hover:border-white/[0.16] transition-all space-y-4 shadow-lg group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-rose-300 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full font-bold">
                    {item.badge}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-rose-100 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/[0.06] text-xs font-mono text-amber-300/90 font-medium">
                  {item.cost}
                </div>
              </div>
            );
          })}
        </div>

        {/* The Solution Transition Banner */}
        <div className="max-w-4xl mx-auto rounded-2xl sm:rounded-3xl bg-gradient-to-r from-indigo-950/40 via-[#0d1424] to-indigo-950/40 border border-indigo-500/30 p-6 sm:p-8 text-center space-y-4 shadow-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-bold uppercase">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> The Rine Forge Difference
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Rine Forge builds the systems that handle these moments automatically.
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Your callers get an instant, polite, knowledgeable voice. Leads get immediate SMS replies. Appointments sync to your calendar. And you stay in control without spending your evenings on admin.
          </p>

          <div className="pt-2">
            <button
              onClick={() => {
                forgeAudioSynth.playClick();
                if (onOpenAuditModal) onOpenAuditModal();
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm transition-all shadow-[0_0_20px_rgba(99,102,241,0.35)]"
            >
              <span>Audit Your Business for Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
