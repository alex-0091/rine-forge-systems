import React from 'react';
import { 
  Bot, PhoneCall, Zap, MessageSquare, Calendar, 
  ArrowRight, CheckCircle2, ShieldCheck, FileText, 
  Workflow, Sparkles, UserCheck, Bell 
} from 'lucide-react';
import { forgeAudioSynth } from '../../../utils/forgeAudioSynth';

export function CoreServicesSection({ onOpenAuditModal, onSelectService }) {
  const services = [
    {
      num: '01',
      id: 'ai-receptionist',
      title: 'AI Receptionist',
      tagline: '24/7 Phone & Call Answering That Books Appointments',
      problem: 'Front desks get overwhelmed during rush hours, and after 5 PM calls go straight to voicemail. Callers hang up and hire someone else.',
      solution: 'An intelligent AI voice receptionist that picks up on the 1st ring, answers questions about your services, qualifies callers, checks your calendar, and books appointments.',
      concreteExample: 'Istanbul Dental Clinic answers 140+ calls after 6 PM every week, automatically triaging tooth pain emergencies and scheduling cleanings into Google Calendar.',
      features: [
        'Answers 24/7 on the first ring',
        'Accurate answers from your verified catalog & policies',
        'Direct calendar booking (Google, Outlook, Cal.com)',
        'Immediate SMS/email recap with full transcript',
        'Zero-delay call routing or human escalation'
      ],
      ctaText: 'See AI Receptionist Demo',
      badge: 'MOST POPULAR'
    },
    {
      num: '02',
      id: 'speed-to-lead',
      title: 'AI Lead Follow-Up',
      tagline: 'Turn Missed Calls and Inquiries into Conversations in Seconds',
      problem: 'Leads buy from whoever responds first. If a contact form sits unread for 2 hours while you are in a meeting, that customer is gone.',
      solution: 'Automated 60-second follow-up sequences across SMS and email that engage inbound inquiries, answer their questions, and drive them to book an appointment.',
      concreteExample: 'A home services company automatically texts missed callers: "Hi, sorry we missed your call! What service do you need help with?" and secures the job before competitors reply.',
      features: [
        'Instant 60-second response via SMS & email',
        'Missed-call recovery text sequences',
        'Automatic lead qualification & budget filtering',
        'Intelligent appointment booking links',
        'Automated re-engagement for quiet leads'
      ],
      ctaText: 'Explore Lead Follow-Up',
      badge: 'HIGH CONVERSION'
    },
    {
      num: '03',
      id: 'customer-automation',
      title: 'AI Customer Automation',
      tagline: 'Automate Routine Communication Without Sounding Robotic',
      problem: 'Your team spends hours sending manual appointment reminders, answering directions/hours questions, and chasing past clients for Google reviews.',
      solution: 'Thoughtful automated workflows that manage pre-appointment reminders, intake paperwork, post-service check-ins, and 5-star review requests in your brand voice.',
      concreteExample: 'A medical spa automatically delivers pre-treatment instructions 24h prior, texts a satisfaction check-in 2 hours post-visit, and captures 35+ verified Google reviews monthly.',
      features: [
        'Automated appointment confirmations & reminders',
        'Pre-appointment intake questionnaire delivery',
        'Post-service satisfaction checks & review prompts',
        'Cancellation filling and schedule re-booking',
        'Custom alerts to your staff when human attention is needed'
      ],
      ctaText: 'Explore Customer Automation',
      badge: 'TIME SAVER'
    },
    {
      num: '04',
      id: 'custom-systems',
      title: 'Custom AI Systems',
      tagline: 'Systems Built Exactly Around Your Unique Business Process',
      problem: 'Off-the-shelf SaaS apps force you to change how your business operates. You end up with 6 disconnected tools and manual copy-pasting.',
      solution: 'If your business has a repetitive workflow, we engineer a custom system around it—connecting your CRM, invoices, documents, scheduling, and internal team chat.',
      concreteExample: 'A boutique law practice automatically ingests client PDF intakes, extracts key case facts into their CRM, drafts an initial engagement brief, and alerts the lead attorney.',
      features: [
        'Custom CRM & spreadsheet synchronization',
        'Document & invoice data extraction (OCR)',
        'Internal multi-department notification routing',
        'Custom reporting & weekly performance summaries',
        'Engineered to match your existing business tools'
      ],
      ctaText: 'Discuss Custom Automation',
      badge: 'BESPOKE'
    }
  ];

  const handleCta = (serviceId) => {
    forgeAudioSynth.playClick();
    if (onSelectService) {
      onSelectService(serviceId);
    } else if (onOpenAuditModal) {
      onOpenAuditModal({ whatToAutomate: serviceId });
    }
  };

  return (
    <section id="services" className="py-16 sm:py-24 bg-[#070b12] border-b border-white/[0.08] relative">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Practical Systems. Proven Outcomes.</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Four Core Systems Built for Real Businesses
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            We don't sell bloated software subscriptions or theoretical AI experiments. We design, deploy, and operate 4 focused systems that directly generate and protect revenue.
          </p>
        </div>

        {/* 4 Primary Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="p-6 sm:p-8 rounded-3xl bg-[#0c101a] border border-white/[0.08] hover:border-indigo-500/40 transition-all flex flex-col justify-between shadow-xl relative group"
            >
              <div className="space-y-6">
                
                {/* Header Row */}
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-indigo-400 px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/25">
                      {svc.num}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {svc.title}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 bg-white/[0.04] px-2.5 py-0.5 rounded-full border border-white/[0.08]">
                    {svc.badge}
                  </span>
                </div>

                {/* Tagline */}
                <div className="text-xs sm:text-sm font-semibold text-indigo-300">
                  {svc.tagline}
                </div>

                {/* Problem vs Solution */}
                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-1">
                    <span className="text-[10px] font-mono uppercase font-bold text-rose-300">The Problem</span>
                    <p className="text-slate-300 leading-relaxed">{svc.problem}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/20 space-y-1">
                    <span className="text-[10px] font-mono uppercase font-bold text-indigo-300">The Solution</span>
                    <p className="text-slate-200 leading-relaxed">{svc.solution}</p>
                  </div>
                </div>

                {/* Real-World Concrete Example */}
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Concrete Example
                  </span>
                  <p className="text-xs text-slate-300 italic leading-relaxed">
                    "{svc.concreteExample}"
                  </p>
                </div>

                {/* Feature Checklist */}
                <div className="space-y-2 pt-1">
                  <div className="text-[11px] font-mono uppercase text-slate-400 font-bold">Key Capabilities:</div>
                  {svc.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

              </div>

              {/* Action CTA */}
              <div className="pt-6 mt-6 border-t border-white/[0.06]">
                <button
                  onClick={() => handleCta(svc.id)}
                  className="w-full py-3 px-4 rounded-xl bg-white/[0.04] hover:bg-indigo-600 hover:text-white border border-white/[0.1] hover:border-indigo-500 text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all group-hover:shadow-[0_0_20px_rgba(99,102,241,0.25)]"
                >
                  <span>{svc.ctaText}</span>
                  <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:text-white transition-colors" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
