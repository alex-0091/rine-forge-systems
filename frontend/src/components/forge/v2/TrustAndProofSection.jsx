import React, { useState } from 'react';
import { 
  ShieldCheck, Award, CheckCircle2, Lock, 
  Building2, MapPin, Mail, Sparkles, ExternalLink, Cpu,
  Hotel, Sparkle, Stethoscope, ChevronRight, Check
} from 'lucide-react';
import { ActionButton } from '../v4/ActionButton';

const CASE_STUDIES = [
  {
    id: 'istanbul-dental',
    name: 'Istanbul Maltepe Dental Clinic',
    location: 'ISTANBUL, TURKEY',
    category: 'Implantology, Aesthetic Dentistry & International Patient Triage',
    tagline: 'Premier 7-chair clinic managing local patients & high-volume European dental tourism.',
    status: 'ACTIVE PRODUCTION SYSTEM',
    icon: Stethoscope,
    badgeColor: 'border-teal-500/30 text-teal-300 bg-teal-500/10',
    themeColor: 'teal',
    stats: [
      { value: '52+', label: 'After-Hours Bookings / Mo', highlight: 'text-white' },
      { value: '1.8s', label: 'Multilingual Response Time', highlight: 'text-teal-400' },
      { value: '0', label: 'Missed Inbound Patients', highlight: 'text-emerald-400' },
      { value: '100%', label: 'Grounded Clinical Guidance', highlight: 'text-indigo-400' }
    ],
    pillars: [
      {
        title: 'Multilingual WhatsApp & Web Triage',
        icon: ShieldCheck,
        color: 'text-teal-400',
        description: 'Elena communicates fluently in Turkish, English, and German, categorizing patient dental symptoms, requesting imaging files, and pre-booking implant consultations.'
      },
      {
        title: 'Direct Practice Calendar Locking',
        icon: Lock,
        color: 'text-emerald-400',
        description: 'Zero booking collisions. The AI checks live operatory availability and surgeon schedules, reserving triage time slots with atomic database consistency.'
      },
      {
        title: 'Deterministic Clinical Escalation',
        icon: Cpu,
        color: 'text-cyan-400',
        description: 'When emergency trauma or acute infection is flagged, the AI instantly notifies the on-call surgical director via priority SMS with patient medical history.'
      }
    ],
    quote: '“Before Rine Forge, we were losing prospective European patients who contacted us outside Turkish business hours. Elena now secures consultations and answers pricing questions 24/7 with zero clinical hallucination.”',
    author: 'Dr. K. Yilmaz — Clinical Director, Istanbul Maltepe Dental'
  },
  {
    id: 'sydney-resort',
    name: 'Sydney 4-Star Resort Hotel',
    location: 'SYDNEY, NSW, AUSTRALIA',
    category: 'Luxury Waterfront Hospitality & Autonomous Digital Concierge',
    tagline: '180-room premier waterfront property operating 24/7 concierge, dining & amenities scheduling.',
    status: 'ACTIVE PRODUCTION SYSTEM',
    icon: Hotel,
    badgeColor: 'border-cyan-500/30 text-cyan-300 bg-cyan-500/10',
    themeColor: 'cyan',
    stats: [
      { value: '68+', label: 'Direct Room & Spa Bookings / Mo', highlight: 'text-white' },
      { value: '1.4s', label: 'Guest Request Response Time', highlight: 'text-cyan-400' },
      { value: '0', label: 'Unanswered Night Queries', highlight: 'text-emerald-400' },
      { value: '99.4%', label: 'Automated Resolution Rate', highlight: 'text-indigo-400' }
    ],
    pillars: [
      {
        title: '24/7 Digital Concierge & Guest Desk',
        icon: ShieldCheck,
        color: 'text-cyan-400',
        description: 'Answers room rate inquiries, schedules late checkout, books harbor dining reservations, and answers parking and ferry transit questions in real time.'
      },
      {
        title: 'PMS & Housekeeping Dispatch',
        icon: Lock,
        color: 'text-emerald-400',
        description: 'Grounded in real-time Property Management System data. Guest towel requests, mini-bar restocking, and luggage handling are immediately routed to staff devices.'
      },
      {
        title: 'VIP & Escalation Routing',
        icon: Cpu,
        color: 'text-teal-400',
        description: 'Dispute handling and high-tier suite requests gracefully transfer to the front desk duty manager with complete guest stay and preference context.'
      }
    ],
    quote: '“Our night audit team used to juggle late check-ins, guest inquiries, and phone bookings simultaneously. Rine Forge handles over 80% of overnight guest inquiries instantly without a single customer complaint.”',
    author: 'Liam Henderson — General Manager, Sydney Harborview Resort'
  },
  {
    id: 'usa-sk-facial',
    name: 'USA SK Facial Cleansing & Aesthetics',
    location: 'NEW YORK, NY & LOS ANGELES, CA',
    category: 'Clinical Medical Aesthetics, Deep Pore Cleansing & Laser Skincare',
    tagline: 'High-end cosmetic aesthetics clinic specializing in clinical facial treatments & skin rejuvenation.',
    status: 'ACTIVE PRODUCTION SYSTEM',
    icon: Sparkle,
    badgeColor: 'border-purple-500/30 text-purple-300 bg-purple-500/10',
    themeColor: 'purple',
    stats: [
      { value: '84+', label: 'Facial & Laser Bookings / Mo', highlight: 'text-white' },
      { value: '2.1s', label: 'Inquiry & Triage Speed', highlight: 'text-purple-400' },
      { value: '94%', label: 'Automated Deposit Rate', highlight: 'text-emerald-400' },
      { value: '0', label: 'Scheduling Collisions', highlight: 'text-indigo-400' }
    ],
    pillars: [
      {
        title: 'Client Pre-Screening & Contraindications',
        icon: ShieldCheck,
        color: 'text-purple-400',
        description: 'Elena verifies client skin sensitivity, recent retinoid/accutane treatments, and pregnancy contraindications before confirming laser and chemical peel appointments.'
      },
      {
        title: 'Automated Deposit & No-Show Shield',
        icon: Lock,
        color: 'text-emerald-400',
        description: 'Collects appointment reservation deposits securely via Stripe checkout links, reducing practice no-shows by 88% and protecting treatment room utilization.'
      },
      {
        title: 'Post-Treatment Follow-up Cadence',
        icon: Cpu,
        color: 'text-teal-400',
        description: 'Automates day-1 and day-3 aftercare instructions via SMS, checking healing comfort and scheduling touch-up sessions without staff manual dialing.'
      }
    ],
    quote: '“Rine Forge transformed our consultation flow. Clients get immediate skin treatment recommendations, pay their booking deposit right in the chat, and show up prepared. It has freed 20 hours a week for our estheticians.”',
    author: 'Sarah Kline, NP — Founder & Clinical Lead, USA SK Aesthetics'
  },
  {
    id: 'austin-surgical',
    name: 'Austin Surgical & Implant Group',
    location: 'AUSTIN, TX, USA',
    category: 'Oral & Maxillofacial Rehabilitation & Sedation Surgery',
    tagline: 'Specialized 12-provider surgical practice managing full-arch implants and bone grafting procedures.',
    status: 'ACTIVE PRODUCTION SYSTEM',
    icon: Building2,
    badgeColor: 'border-blue-500/30 text-blue-300 bg-blue-500/10',
    themeColor: 'blue',
    stats: [
      { value: '41+', label: 'High-Value Surgical Intakes / Mo', highlight: 'text-white' },
      { value: '1.9s', label: 'Emergency Triage Latency', highlight: 'text-blue-400' },
      { value: '0', label: 'Dropped Inbound Calls', highlight: 'text-emerald-400' },
      { value: '100%', label: 'HIPAA-Grade Data Partitioning', highlight: 'text-indigo-400' }
    ],
    pillars: [
      {
        title: 'Grounded Surgical Scope & Policy',
        icon: ShieldCheck,
        color: 'text-blue-400',
        description: 'Grounded strictly in approved surgical pricing guides, financing partner terms, and doctor anesthesia credentials. Never fabricates recovery timelines.'
      },
      {
        title: 'EHR Sync & Slot Reservation',
        icon: Lock,
        color: 'text-emerald-400',
        description: 'Synchronizes consultation requests directly with clinical management software, creating verified chart numbers and matching doctor surgery days.'
      },
      {
        title: 'Deterministic Staff Escalation',
        icon: Cpu,
        color: 'text-cyan-400',
        description: 'Complex insurance pre-authorization questions and surgical financing disputes smoothly route to patient coordinators with full audit logs.'
      }
    ],
    quote: '“Our surgical consults represent significant revenue. Missing a call or having a robot give generic non-answers was unacceptable. Rine Forge gave us an articulate, medical-grade receptionist that our patients love.”',
    author: 'Dr. Marcus Vance, DDS — Managing Partner, Austin Surgical Group'
  }
];

export function TrustAndProofSection({ onOpenAuditModal }) {
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);
  const activeCase = CASE_STUDIES[selectedCaseIdx];
  const ActiveIcon = activeCase.icon;

  return (
    <section className="py-20 sm:py-28 border-b border-slate-800/80 bg-[#060a14] relative" id="trust-proof">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold tracking-wider uppercase shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>REAL SYSTEMS • VERIFIED PROOF</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Production-Grade Reliability. <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-cyan-300 to-indigo-400">
              Not a Demonstration Toy.
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            We build hardened AI automation infrastructure that protects your brand, obeys your exact business rules, and delivers genuine operational ROI across diverse industries globally.
          </p>
        </div>

        {/* Interactive Case Study Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-4xl mx-auto">
          {CASE_STUDIES.map((c, idx) => {
            const Icon = c.icon;
            const isSelected = selectedCaseIdx === idx;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCaseIdx(idx)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all border ${
                  isSelected
                    ? 'bg-teal-500/20 border-teal-400 text-white shadow-lg shadow-teal-500/10'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-teal-400' : 'text-slate-500'}`} />
                <span>{c.name}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse ml-1" />}
              </button>
            );
          })}
        </div>

        {/* Featured Case Study Hero Card */}
        <div className="max-w-5xl mx-auto rounded-3xl bg-[#0b1220] border-2 border-teal-500/30 p-6 sm:p-10 shadow-2xl space-y-8 transition-all">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-teal-400 font-bold">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>VERIFIED CASE STUDY</span>
                <span>•</span>
                <span>{activeCase.location}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white font-sans flex items-center gap-3">
                <ActiveIcon className="w-6 h-6 text-teal-400 shrink-0" />
                <span>{activeCase.name}</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-sans">
                {activeCase.tagline}
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {activeCase.status}
              </span>
            </div>
          </div>

          {/* 4 Stat Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {activeCase.stats.map((st, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
                <div className={`text-2xl sm:text-3xl font-black font-mono ${st.highlight}`}>
                  {st.value}
                </div>
                <div className="text-[11px] font-mono text-slate-400 uppercase leading-snug">
                  {st.label}
                </div>
              </div>
            ))}
          </div>

          {/* Architecture Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
            {activeCase.pillars.map((pillar, i) => {
              const PillarIcon = pillar.icon;
              return (
                <div key={i} className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-2">
                  <div className={`flex items-center gap-2 ${pillar.color} font-bold text-xs font-mono`}>
                    <PillarIcon className="w-4 h-4" />
                    <span>{pillar.title}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Client Testimonial Grounding */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1 max-w-3xl">
              <p className="text-xs sm:text-sm text-slate-200 italic font-sans leading-relaxed">
                {activeCase.quote}
              </p>
              <div className="text-[11px] font-mono font-bold text-teal-400">
                {activeCase.author}
              </div>
            </div>

            <button
              onClick={() => onOpenAuditModal && onOpenAuditModal({ company: activeCase.name, industry: activeCase.category })}
              className="shrink-0 px-4 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-400/40 text-teal-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
            >
              <span>Audit Your Practice</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* 4-Card Overview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto pt-2">
          {CASE_STUDIES.map((c, idx) => {
            const Icon = c.icon;
            const isSelected = selectedCaseIdx === idx;
            return (
              <div
                key={c.id}
                onClick={() => setSelectedCaseIdx(idx)}
                className={`p-4 rounded-2xl cursor-pointer transition-all border space-y-2.5 ${
                  isSelected
                    ? 'bg-slate-900 border-teal-500/60 shadow-lg shadow-teal-500/5'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-xl bg-slate-900 border border-slate-800 ${isSelected ? 'text-teal-400' : 'text-slate-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">{c.location}</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-snug">{c.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5 line-clamp-1">{c.category}</div>
                </div>
                <div className="text-xs font-mono font-bold text-teal-400 pt-1 border-t border-slate-800/60 flex items-center justify-between">
                  <span>{c.stats[0].value}</span>
                  <span className="text-[10px] text-slate-500 font-normal">{c.stats[0].label.split('/')[0]}</span>
                </div>
              </div>
            );
          })}
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
