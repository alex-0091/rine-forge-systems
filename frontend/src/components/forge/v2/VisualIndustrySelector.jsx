import React, { useState } from 'react';
import { 
  Building2, ArrowRight, CheckCircle2, Sparkles, 
  Play, PhoneCall, Calendar, Zap, FileText, ShieldCheck, HeartPulse, Home, Hotel, Scale, Car, UtensilsCrossed,
  Check, MessageSquare, ArrowDown, Rocket, Volume2
} from 'lucide-react';
import { speechEngine } from '../../../utils/speechEngine';
import { forgeAudioSynth } from '../../../utils/forgeAudioSynth';
import { ReceptionistCharacter, LeadEngineCharacter, DocumentCharacter, AppointmentCharacter, SupportCharacter } from './ForgeCharacterUniverse';

export const INDUSTRY_PRESETS = [
  {
    id: 'hotel',
    name: 'Hotels & Hospitality',
    icon: Hotel,
    emoji: '🏨',
    badge: 'CONCIERGE OS',
    headline: '24/7 Guest Front-Desk & Direct Booking Concierge',
    dialogue: {
      customer: 'Guest asks via WhatsApp: "Can I get early check-in and parking for Room 402 this Friday?"',
      aiAction: 'FORGE checks Opera PMS reservation status, confirms valet parking availability, and applies early check-in flag.',
      outcome: 'Guest receives instant confirmation and mobile key pass in under 5 seconds.'
    },
    opportunities: [
      '24/7 AI Receptionist & Front Desk',
      'Instant Booking Enquiries & Direct Reservation',
      'Guest Communication on WhatsApp & Web',
      'Automated 5-Star Review Requests',
      'VIP Lead Capture & Room Upgrades'
    ],
    sysId: 'receptionist-agent'
  },
  {
    id: 'dental',
    name: 'Dentists & Healthcare',
    icon: HeartPulse,
    emoji: '🦷',
    badge: 'CLINICAL OS',
    headline: 'Autonomous Patient Intake & Insurance Triage',
    dialogue: {
      customer: 'Patient calls after hours: "Emergency root canal tomorrow at 3 PM? Do you take Delta Dental?"',
      aiAction: 'FORGE verifies in-network PPO, checks Dr. Evans Operatory 2, and confirms calendar opening in 14ms.',
      outcome: 'Saturday 11:00 AM confirmed. Dentrix updated & SMS intake forms dispatched.'
    },
    opportunities: [
      '24/7 Automated Appointment Booking',
      'Automated SMS Reminders & Intake Forms',
      'No-Show & 6-Month Hygiene Follow-Up',
      'High-Intent Lead Qualification',
      'Instant In-Network Insurance Verification'
    ],
    sysId: 'receptionist-agent'
  },
  {
    id: 'real-estate',
    name: 'Real Estate & Brokerages',
    icon: Home,
    emoji: '🏠',
    badge: 'PROPERTY OS',
    headline: 'Sub-45s Buyer Qualification & Tour Booking',
    dialogue: {
      customer: 'Lead submits web inquiry: "Is the penthouse on 5th Ave still available for showing this weekend?"',
      aiAction: 'FORGE evaluates $1.4M pre-approval proof, scores 96 ICP, and triggers 2-way SMS questionnaire.',
      outcome: 'Private Broker Showing locked on calendar within 38 seconds total.'
    },
    opportunities: [
      'Sub-45s Lead Qualification & Scoring',
      '24/7 Property & HOA FAQ Answers',
      'Private Showing & Open House Scheduling',
      'Automated Follow-Up Sequences',
      'Follow Up Boss / HubSpot CRM Auto-Sync'
    ],
    sysId: 'lead-agent'
  },
  {
    id: 'law-firm',
    name: 'Law Firms & Attorneys',
    icon: Scale,
    emoji: '⚖️',
    badge: 'LEGAL INTAKE OS',
    headline: 'Confidential Client Intake & Retainer Gate',
    dialogue: {
      customer: 'Prospect inquires: "Need representation for commercial lease breach and non-compete dispute."',
      aiAction: 'FORGE screens practice area criteria, checks for opposing party conflict of interest, and verifies retainer budget.',
      outcome: 'Retained consultation locked with Managing Partner with NDA.'
    },
    opportunities: [
      '24/7 Confidential Case & Lead Intake',
      'Attorney Appointment Scheduling & Deposits',
      'Document & Police Report Collection',
      'Instant Case Status & FAQ Responses',
      'Conflict of Interest Automated Check'
    ],
    sysId: 'support-agent'
  },
  {
    id: 'auto-dealer',
    name: 'Auto Dealerships',
    icon: Car,
    emoji: '🚗',
    badge: 'DEALERSHIP OS',
    headline: 'Sub-Minute Inbound Lead Response & Test Drive Booking',
    dialogue: {
      customer: 'Buyer inquires on CarGurus: "Is the 2024 Black Yukon Denali on the lot? Can I test drive today at 4?"',
      aiAction: 'FORGE checks CDK / DealerSocket live inventory, confirms VIN status, and books test drive window with sales floor.',
      outcome: 'Test drive confirmed in 22 seconds; SMS calendar invite & vehicle window sticker dispatched.'
    },
    opportunities: [
      'Sub-45s Inbound Lead Response (CarGurus, Autotrader)',
      'Live Vehicle Inventory & Window Sticker Lookup',
      'Test Drive & Service Appointment Scheduling',
      'Trade-In Appraisal & Finance Pre-Screening',
      'Automated Quote Follow-Up Sequences'
    ],
    sysId: 'lead-agent'
  },
  {
    id: 'restaurant',
    name: 'Restaurants & Hospitality',
    icon: UtensilsCrossed,
    emoji: '🍽️',
    badge: 'DINING OS',
    headline: 'Voice & WhatsApp Reservations & Event Triage',
    dialogue: {
      customer: 'Guest calls during dinner rush: "Table for 8 this Friday at 7:30 PM for a birthday dinner?"',
      aiAction: 'FORGE checks OpenTable / Resy floor plan, locks the private booth, and notes dietary preferences in 12ms.',
      outcome: 'Friday 7:30 PM confirmed; SMS confirmation and deposit receipt sent.'
    },
    opportunities: [
      'Voice & WhatsApp Table Reservations',
      'Instant Menu & Dietary Allergy FAQ Answers',
      'Large Party & Private Event Inquiries',
      'Automated 5-Star Google Review Requests',
      'VIP Birthday & Anniversary Re-activation'
    ],
    sysId: 'receptionist-agent'
  }
];

export function VisualIndustrySelector({ onNavigate, onLaunchSandbox, onWatchDemo }) {
  const [selectedIndustry, setSelectedIndustry] = useState(INDUSTRY_PRESETS[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const Icon = selectedIndustry.icon;

  const handlePlayDialogue = () => {
    forgeAudioSynth.playClick();
    setIsPlayingAudio(true);
    speechEngine.speak(selectedIndustry.dialogue.customer + ' ... ' + selectedIndustry.dialogue.aiAction + ' ... ' + selectedIndustry.dialogue.outcome, { accent: 'en-US' });
    setTimeout(() => setIsPlayingAudio(false), 8000);
  };

  return (
    <section id="industries-selector" className="py-20 sm:py-28 border-b border-slate-800/80 bg-[#070c14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold tracking-wider uppercase shadow-md">
            <Building2 className="w-3.5 h-3.5 text-teal-400" />
            <span>BUILT FOR SMALL BUSINESSES</span>
          </div>
          
          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            WHAT DO YOU RUN? <br />
            <span className="text-teal-400">SEE YOUR AI WORKERS.</span>
          </h2>
          
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Select your industry to see the exact automated workflows, live customer dialogues, and repetitive tasks our AI employees eliminate.
          </p>
        </div>

        {/* 6 Industry Tabs */}
        <div className="flex items-center justify-center flex-wrap gap-2.5">
          {INDUSTRY_PRESETS.map((ind) => {
            const isSelected = selectedIndustry.id === ind.id;
            const TabIcon = ind.icon;
            return (
              <button
                key={ind.id}
                onClick={() => {
                  forgeAudioSynth.playClick();
                  setSelectedIndustry(ind);
                }}
                className={`px-4 py-3 rounded-2xl font-mono text-xs font-bold transition-all flex items-center gap-2.5 border ${
                  isSelected
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-400 text-dark-950 border-teal-300 shadow-xl shadow-teal-500/20 scale-105 font-black'
                    : 'bg-[#090e18] text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                <span>{ind.emoji}</span>
                <span>{ind.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Industry Interactive Blueprint */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Live Customer Dialogue Simulation (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#090e18] border-2 border-teal-500/40 shadow-2xl flex flex-col justify-between space-y-6">
            
            <div className="space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-300 flex items-center justify-center text-xl">
                    {selectedIndustry.emoji}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">{selectedIndustry.name}</h3>
                    <div className="text-[11px] text-teal-400 font-mono">{selectedIndustry.headline}</div>
                  </div>
                </div>

                <button
                  onClick={handlePlayDialogue}
                  className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-mono font-bold transition-all ${
                    isPlayingAudio
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
                  }`}
                  title="Spoken audio dialogue"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isPlayingAudio ? 'Speaking...' : 'Listen Audio'}</span>
                </button>
              </div>

              {/* 3-Step Live Scenario Conversation Flow */}
              <div className="space-y-3 font-mono text-xs">
                
                {/* 1. Customer Message */}
                <div className="p-4 rounded-2xl bg-[#0c1424] border border-slate-800 space-y-1.5">
                  <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span>Inbound Customer Message / Call:</span>
                  </div>
                  <p className="text-slate-100 font-sans text-xs sm:text-sm font-medium leading-relaxed">
                    "{selectedIndustry.dialogue.customer}"
                  </p>
                </div>

                {/* 2. FORGE AI Action */}
                <div className="p-4 rounded-2xl bg-teal-950/20 border border-teal-500/40 space-y-1.5">
                  <div className="text-[10px] font-bold text-teal-400 uppercase flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>FORGE Autonomous Execution (400ms):</span>
                  </div>
                  <p className="text-slate-200 font-sans text-xs leading-relaxed">
                    {selectedIndustry.dialogue.aiAction}
                  </p>
                </div>

                {/* 3. Confirmed Business Outcome */}
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 space-y-1.5">
                  <div className="text-[10px] font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Confirmed Business Result:</span>
                  </div>
                  <p className="text-emerald-100 font-sans text-xs sm:text-sm font-bold leading-relaxed">
                    {selectedIndustry.dialogue.outcome}
                  </p>
                </div>

              </div>

            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between font-mono text-xs">
              <span className="text-slate-400">Zero Human Hold Times</span>
              <span className="text-emerald-400 font-bold">100% Policy Bound</span>
            </div>

          </div>

          {/* Right Column: 5 Opportunities Unlocked (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-[#090e18] border border-slate-800 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 font-bold uppercase">
                  UNLOCKED CAPABILITIES
                </span>
                <h4 className="text-lg font-bold text-white font-sans">
                  What FORGE Automates For Your Business:
                </h4>
              </div>

              <div className="space-y-2.5">
                {selectedIndustry.opportunities.map((opp, idx) => (
                  <div 
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3 text-xs text-slate-200 font-sans group hover:border-teal-500/50 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">{opp}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  forgeAudioSynth.playSuccess();
                  if (onNavigate) onNavigate('audit');
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-dark-950 font-mono text-xs font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-500/20"
              >
                <span>Automate My {selectedIndustry.name} →</span>
              </button>

              <div className="text-[11px] text-slate-400 text-center font-mono">
                Launch a 100% free pilot for 1 workflow in 48 hours
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
