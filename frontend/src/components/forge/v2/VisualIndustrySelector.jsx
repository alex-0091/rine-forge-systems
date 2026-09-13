import React, { useState } from 'react';
import { 
  Building2, ArrowRight, CheckCircle2, Sparkles, 
  Play, PhoneCall, Calendar, Zap, FileText, ShieldCheck, HeartPulse, Home, Hotel, Wrench, Scale, ShoppingBag, Briefcase 
} from 'lucide-react';
import { ReceptionistCharacter, LeadEngineCharacter, DocumentCharacter, AppointmentCharacter } from './ForgeCharacterUniverse';

const INDUSTRY_PRESETS = [
  {
    id: 'dental',
    name: 'Dental & Healthcare',
    icon: HeartPulse,
    emoji: '🏥',
    badge: 'CLINICAL OS',
    headline: 'Autonomous Patient Intake & Insurance Triage',
    problem: 'Missed calls after 6 PM lose $2,500+ in retained cosmetic & emergency cases each month.',
    solution: 'FORGE Receptionist answers immediately, checks Delta Dental/MetLife PPO in-network status, and books the chair slot directly in Dentrix/Google Calendar.',
    metrics: { recovery: '+6-12 patients/mo', speed: '24/7 Sub-15s', accuracy: '100% PPO Match' },
    sysId: 'receptionist-agent'
  },
  {
    id: 'real-estate',
    name: 'Real Estate & Property',
    icon: Home,
    emoji: '🏠',
    badge: 'PROPERTY OS',
    headline: 'Sub-60s Buyer Qualification & Tour Booking',
    problem: 'Buyers inquire on Zillow/Realtor and move on if they do not hear back within 3 minutes.',
    solution: 'FORGE Lead Engine ingests portal webhooks, scores pre-approval budget and timeline, and locks private tour slots with the listing agent.',
    metrics: { recovery: '85% Tour Lock Rate', speed: '42s Response', accuracy: '0-100 ICP Filter' },
    sysId: 'lead-agent'
  },
  {
    id: 'home-services',
    name: 'HVAC & Home Services',
    icon: Wrench,
    emoji: '🔧',
    badge: 'DISPATCH OS',
    headline: 'Emergency Dispatch & Technician Scheduling',
    problem: 'Homeowners with broken AC or burst pipes call 3 contractors and hire whoever answers first.',
    solution: 'FORGE Voice Concierge triages emergency status, collects zip code/equipment model, and schedules technician arrival windows automatically.',
    metrics: { recovery: '+18 jobs/mo', speed: 'Instant Pickup', accuracy: 'Zero Double Booking' },
    sysId: 'receptionist-agent'
  },
  {
    id: 'law-firm',
    name: 'Legal & Law Firms',
    icon: Scale,
    emoji: '⚖️',
    badge: 'LEGAL INTAKE OS',
    headline: 'Confidential Client Intake & Consultation Gate',
    problem: 'Attorneys spend 10+ hours/week screening unqualified leads and chasing consultation payments.',
    solution: 'FORGE Legal Intake gathers incident details, checks practice area criteria, and reserves paid partner consultations with NDA compliance.',
    metrics: { recovery: '+8 Retained Cases', speed: '100% Confidential', accuracy: 'Zero-Hallucination' },
    sysId: 'support-agent'
  },
  {
    id: 'hospitality',
    name: 'Hotels & Hospitality',
    icon: Hotel,
    emoji: '🏨',
    badge: 'CONCIERGE OS',
    headline: '24/7 Guest Front-Desk & Booking Concierge',
    problem: 'Front desk phones ring non-stop during peak check-in with simple FAQ questions.',
    solution: 'FORGE Front Desk handles room availability, amenities, parking, and late check-out requests instantly in 20+ languages.',
    metrics: { recovery: '65% Staff Load Cut', speed: 'Multi-lingual', accuracy: 'Direct PMS Sync' },
    sysId: 'receptionist-agent'
  },
  {
    id: 'ecommerce',
    name: 'Ecommerce & Retail',
    icon: ShoppingBag,
    emoji: '🛒',
    badge: 'COMMERCE OS',
    headline: 'Automated Order Support & Return Verification',
    problem: 'Support tickets for tracking updates and return authorizations slow down revenue operations.',
    solution: 'FORGE Support Agent connects to Shopify/Klaviyo, verifies tracking numbers, and issues return labels automatically.',
    metrics: { recovery: '80% 1st-Touch Solved', speed: 'Sub-5s Lookup', accuracy: 'Direct Shopify Sync' },
    sysId: 'support-agent'
  }
];

export function VisualIndustrySelector({ onNavigate, onLaunchSandbox, onWatchDemo }) {
  const [selectedIndustry, setSelectedIndustry] = useState(INDUSTRY_PRESETS[0]);
  const Icon = selectedIndustry.icon;

  return (
    <section id="industries" className="py-20 sm:py-28 border-b border-slate-800/80 bg-[#070c14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono font-bold tracking-wider uppercase">
            <Building2 className="w-3.5 h-3.5" /> PERSONALIZED INDUSTRY ARCHITECTURE
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            WHAT DO YOU RUN?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Select your industry to see how FORGE is pre-calibrated to automate your specific customer acquisition and back-office workflows.
          </p>
        </div>

        {/* Industry Pill Selector */}
        <div className="flex items-center justify-center flex-wrap gap-2.5">
          {INDUSTRY_PRESETS.map((ind) => {
            const isSelected = selectedIndustry.id === ind.id;
            return (
              <button
                key={ind.id}
                onClick={() => setSelectedIndustry(ind)}
                className={`px-4 py-3 rounded-2xl font-mono text-xs font-bold transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-teal-500 text-dark-950 border-teal-400 shadow-lg shadow-teal-500/20 scale-105'
                    : 'bg-[#090e18] text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                <span>{ind.emoji}</span>
                <span>{ind.name}</span>
              </button>
            );
          })}
        </div>

        {/* Visual Industry Workbench */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#090e18] border-2 border-teal-500/40 shadow-2xl space-y-8">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800 pb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-teal-400 font-bold">
                <Icon className="w-4 h-4" />
                <span>{selectedIndustry.badge}</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-sans">
                {selectedIndustry.headline}
              </h3>
            </div>

            {/* Metrics Chips */}
            <div className="flex flex-wrap gap-2 font-mono text-xs">
              <div className="px-3.5 py-2 bg-dark-950 rounded-xl border border-slate-800 text-slate-300">
                Recovery: <strong className="text-emerald-400">{selectedIndustry.metrics.recovery}</strong>
              </div>
              <div className="px-3.5 py-2 bg-dark-950 rounded-xl border border-slate-800 text-slate-300">
                Speed: <strong className="text-cyan-400">{selectedIndustry.metrics.speed}</strong>
              </div>
              <div className="px-3.5 py-2 bg-dark-950 rounded-xl border border-slate-800 text-slate-300">
                Accuracy: <strong className="text-teal-400">{selectedIndustry.metrics.accuracy}</strong>
              </div>
            </div>
          </div>

          {/* 2-Column Split: Problem vs. FORGE Solution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans text-xs sm:text-sm">
            
            <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-3">
              <div className="text-rose-400 font-mono font-bold uppercase text-xs flex items-center gap-2">
                <span>🔴 The Manual Problem</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {selectedIndustry.problem}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-teal-950/20 border border-teal-500/30 space-y-3">
              <div className="text-teal-400 font-mono font-bold uppercase text-xs flex items-center gap-2">
                <span>🟢 The FORGE System Solution</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {selectedIndustry.solution}
              </p>
            </div>

          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
            <button
              onClick={() => {
                if (onWatchDemo) onWatchDemo(selectedIndustry.sysId);
              }}
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-850 text-cyan-300 border border-slate-700 flex items-center gap-2 font-bold transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current text-cyan-400" />
              <span>Watch 10-Sec Demo for {selectedIndustry.name.split('&')[0]}</span>
            </button>

            <button
              onClick={() => onNavigate && onNavigate('app-onboarding')}
              className="px-7 py-3 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <span>START 14-DAY {selectedIndustry.name.split(' ')[0].toUpperCase()} TRIAL</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
