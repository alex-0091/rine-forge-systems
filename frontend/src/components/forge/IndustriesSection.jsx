import React, { useState } from 'react';
import { 
  Building2, Stethoscope, Sparkles, Scale, UtensilsCrossed, 
  Briefcase, Wrench, Home, ArrowRight, CheckCircle2 
} from 'lucide-react';
import { forgeAudioSynth } from '../../utils/forgeAudioSynth';

export function IndustriesSection({ onOpenAuditModal, onNavigate }) {
  const [selectedIndustry, setSelectedIndustry] = useState('dental');

  const industries = [
    {
      id: 'dental',
      name: 'Dental & Medical Practices',
      icon: Stethoscope,
      problem: 'Front desks get flooded during morning check-ins; after-hours patient calls go to voicemail.',
      solution: 'AI receptionist captures emergency calls after hours, answers insurance/procedure questions, and schedules examination slots.',
      concreteBenefit: 'Captures 15–30 emergency appointments per month that otherwise go to competing clinics.'
    },
    {
      id: 'salons',
      name: 'Salons & Med Spas',
      icon: Sparkles,
      problem: 'Stylists and estheticians cannot pick up the phone while working on a client.',
      solution: 'Instant missed-call text back and automated DM triage that sends direct booking links and answers pricing questions.',
      concreteBenefit: 'Zero missed bookings during busy weekend appointment blocks.'
    },
    {
      id: 'hospitality',
      name: 'Hotels & Hospitality',
      icon: UtensilsCrossed,
      problem: 'Guests call late at night asking for check-in policies, parking, dining recommendations, and amenities.',
      solution: '24/7 multilingual conversational voice agent answers guest FAQs and assists with room reservations.',
      concreteBenefit: 'Front desk freed from answering the same 5 questions 40 times a day.'
    },
    {
      id: 'trades',
      name: 'Home Services & Trades',
      icon: Wrench,
      problem: 'HVAC technicians, plumbers, and electricians are on job sites and cannot answer calls while working.',
      solution: 'Voice receptionist answers emergency calls, collects service address and issue details, and alerts on-call dispatch.',
      concreteBenefit: 'Wins high-ticket emergency repair jobs while the technician is driving or on a roof.'
    },
    {
      id: 'real-estate',
      name: 'Real Estate Agencies',
      icon: Home,
      problem: 'Buyers inquire about listings at all hours; agents are busy showing properties or in closing meetings.',
      solution: 'Speed-to-lead system texts back within 60 seconds, qualifies pre-approval status, and books property showings.',
      concreteBenefit: 'Immediate engagement before buyer scrolls to the next listing on Zillow.'
    },
    {
      id: 'legal',
      name: 'Law Firms',
      icon: Scale,
      problem: 'Potential clients in distress call multiple firms; whoever answers and intakes first gets the retainer.',
      solution: 'Polite, structured intake receptionist collects initial case details and schedules attorney consultations.',
      concreteBenefit: 'No high-value case opportunities lost to voicemail during court proceedings.'
    },
    {
      id: 'professional-services',
      name: 'Professional Services',
      icon: Briefcase,
      problem: 'Consultants and accountants waste hours on email tag trying to schedule initial client discovery calls.',
      solution: 'Automates discovery call booking, pre-meeting questionnaire delivery, and reminder sequences.',
      concreteBenefit: 'Eliminates 5+ hours of back-and-forth scheduling admin per consultant each week.'
    },
    {
      id: 'local-services',
      name: 'Local Service Businesses',
      icon: Building2,
      problem: 'Solo owners and small teams juggle operations, client work, quotes, and phone calls simultaneously.',
      solution: 'A unified front that answers calls, texts missed callers, and collects job quote requests 24/7.',
      concreteBenefit: 'The business looks like an established, responsive enterprise without hiring extra staff.'
    }
  ];

  const current = industries.find((i) => i.id === selectedIndustry) || industries[0];

  return (
    <section id="industries" className="py-20 sm:py-28 bg-[#080c14] border-b border-white/[0.08] relative">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-mono font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Targeted Business Environments</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Built for Businesses Where Missed Opportunities Matter
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            We don't build generic chatbots. We configure systems around the exact operational realities, hours, services, and friction points of your industry.
          </p>
        </div>

        {/* 8 Industry Selector Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
          {industries.map((ind) => {
            const Icon = ind.icon;
            const isSelected = ind.id === selectedIndustry;
            return (
              <button
                key={ind.id}
                onClick={() => {
                  forgeAudioSynth.playClick();
                  setSelectedIndustry(ind.id);
                }}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.25)]'
                    : 'bg-[#0c101a] border-white/[0.08] hover:border-white/[0.16] text-slate-400 hover:text-white'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  isSelected ? 'bg-indigo-500 text-white' : 'bg-white/[0.04] text-slate-400'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-xs sm:text-sm font-bold leading-snug">
                  {ind.name}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Industry Spotlight Card */}
        <div className="max-w-4xl mx-auto bg-[#0c101a] border border-white/[0.1] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <current.icon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">INDUSTRY AUTOMATION SPOTLIGHT</span>
                <h3 className="text-xl sm:text-2xl font-bold text-white">{current.name}</h3>
              </div>
            </div>
            <button
              onClick={() => {
                forgeAudioSynth.playClick();
                if (onOpenAuditModal) onOpenAuditModal({ businessType: current.name });
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] self-start sm:self-auto flex items-center gap-1.5"
            >
              <span>Get Free Audit for {current.name.split(' ')[0]}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20 space-y-2">
              <span className="text-[10px] font-mono uppercase font-bold text-rose-300">The Core Friction</span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {current.problem}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 space-y-2">
              <span className="text-[10px] font-mono uppercase font-bold text-indigo-300">The Rine Forge System</span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {current.solution}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-xs sm:text-sm text-slate-300">
              <strong className="text-white">Business Outcome: </strong> {current.concreteBenefit}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
