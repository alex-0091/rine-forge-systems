import React, { useState } from 'react';
import { 
  Building2, ArrowRight, CheckCircle2, Sparkles, 
  Play, PhoneCall, Calendar, Zap, FileText, ShieldCheck, HeartPulse, Home, Hotel, Wrench, Scale, ShoppingBag, Briefcase,
  Check, MessageSquare, ArrowDown, Rocket, Volume2
} from 'lucide-react';
import { speechEngine } from '../../../utils/speechEngine';
import { forgeAudioSynth } from '../../../utils/forgeAudioSynth';
import { ReceptionistCharacter, LeadEngineCharacter, DocumentCharacter, AppointmentCharacter, SupportCharacter } from './ForgeCharacterUniverse';

export const INDUSTRY_PRESETS = [
  {
    id: 'dental',
    name: 'Dental & Healthcare',
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
      '24/7 Patient Voice Concierge',
      'Instant PPO Insurance Verification',
      'Dentrix / Curve Dental Auto-Sync',
      'Automated Intake Form Dispatch',
      'Post-Op Follow-Up Sequences'
    ],
    sysId: 'receptionist-agent'
  },
  {
    id: 'hotel',
    name: 'Hotels & Hospitality',
    icon: Hotel,
    emoji: '🏨',
    badge: 'CONCIERGE OS',
    headline: '24/7 Guest Front-Desk & Booking Concierge',
    dialogue: {
      customer: 'Guest asks via WhatsApp: "Can I get early check-in and parking for Room 402?"',
      aiAction: 'FORGE checks Opera PMS reservation status, confirms valet parking availability, and applies early check-in flag.',
      outcome: 'Guest receives instant confirmation and mobile key pass in under 5 seconds.'
    },
    opportunities: [
      '24/7 Multi-Lingual Front Desk',
      'PMS & Room Key Integration',
      'Valet & Amenity Reservations',
      'VIP Guest Profile Sync',
      'Automated Checkout & Invoice Delivery'
    ],
    sysId: 'receptionist-agent'
  },
  {
    id: 'real-estate',
    name: 'Real Estate & Property',
    icon: Home,
    emoji: '🏠',
    badge: 'PROPERTY OS',
    headline: 'Sub-60s Buyer Qualification & Tour Booking',
    dialogue: {
      customer: 'Lead submits web inquiry: "Is the penthouse on 5th Ave still available for showing this weekend?"',
      aiAction: 'FORGE evaluates $1.4M pre-approval proof, scores 96 ICP, and triggers 2-way SMS questionnaire.',
      outcome: 'Private Broker Showing locked on calendar within 38 seconds total.'
    },
    opportunities: [
      'Sub-45s Webhook Ingestion',
      '0-100 ICP Pre-Approval Filter',
      'Automated 2-Way SMS Booking',
      'Follow Up Boss / HubSpot CRM Sync',
      'Property Fact Sheet Instant Delivery'
    ],
    sysId: 'lead-agent'
  },
  {
    id: 'home-services',
    name: 'HVAC & Home Services',
    icon: Wrench,
    emoji: '🔧',
    badge: 'DISPATCH OS',
    headline: 'Emergency Dispatch & Technician Scheduling',
    dialogue: {
      customer: 'Homeowner calls at 11 PM: "AC compressor is blowing warm air and smoking."',
      aiAction: 'FORGE triages urgency as Tier-1 Emergency, collects unit model & address, and assigns on-call tech.',
      outcome: 'Technician morning window locked in ServiceTitan with GPS dispatch.'
    },
    opportunities: [
      'After-Hours Emergency Dispatch',
      'ServiceTitan / Housecall Pro Sync',
      'Zip Code Territory Routing',
      'Equipment Model OCR Lookup',
      'Automated Job Confirmation SMS'
    ],
    sysId: 'receptionist-agent'
  },
  {
    id: 'law-firm',
    name: 'Legal & Law Firms',
    icon: Scale,
    emoji: '⚖️',
    badge: 'LEGAL INTAKE OS',
    headline: 'Confidential Client Intake & Consultation Gate',
    dialogue: {
      customer: 'Prospect inquires: "Need representation for commercial lease breach and non-compete dispute."',
      aiAction: 'FORGE screens practice area criteria, checks for opposing party conflict of interest, and verifies retainer budget.',
      outcome: 'Retained consultation locked with Managing Partner with NDA.'
    },
    opportunities: [
      'Confidential Client Intake Screening',
      'Conflict of Interest Automated Check',
      'Clio / PracticePanther CRM Sync',
      'Retainer Deposit Link Delivery',
      'Zero-Hallucination Policy Bound'
    ],
    sysId: 'support-agent'
  },
  {
    id: 'ecommerce',
    name: 'Ecommerce & Retail',
    icon: ShoppingBag,
    emoji: '🛒',
    badge: 'COMMERCE OS',
    headline: 'Automated Order Support & Return Verification',
    dialogue: {
      customer: 'Shopper asks: "Where is order #88491 and how do I exchange for size Large?"',
      aiAction: 'FORGE queries Shopify API, verifies courier tracking status in transit, and synthesizes return label.',
      outcome: 'Prepaid return label generated and tracking updates sent in 3 seconds.'
    },
    opportunities: [
      'Shopify / Klaviyo API Auto-Lookup',
      'Instant Return & Refund Processing',
      'VIP Cart Recovery Campaigns',
      'Inventory Stock Alerts',
      'Omnichannel WhatsApp & SMS Support'
    ],
    sysId: 'support-agent'
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
    <section id="build-business" className="py-20 sm:py-28 border-b border-slate-800/80 bg-[#070c14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold tracking-wider uppercase shadow-md">
            <Building2 className="w-3.5 h-3.5 text-teal-400" /> PERSONALIZED BUSINESS ARCHITECTURE
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            WHAT DO YOU RUN? <br />
            <span className="text-teal-400">SEE YOUR AUTOMATED BUSINESS.</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Select your industry to see the exact customer conversations, automated routing diagrams, and unlocked revenue opportunities.
          </p>
        </div>

        {/* 6 Industry Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {INDUSTRY_PRESETS.map((ind) => {
            const isSelected = selectedIndustry.id === ind.id;
            const IndIcon = ind.icon;
            return (
              <button
                key={ind.id}
                onClick={() => {
                  forgeAudioSynth.playClick();
                  setSelectedIndustry(ind);
                }}
                className={`p-3.5 rounded-2xl font-mono text-xs font-bold transition-all flex flex-col items-center justify-center gap-2 border text-center ${
                  isSelected
                    ? 'bg-gradient-to-b from-teal-500/20 to-[#0c1828] text-white border-teal-400 shadow-xl shadow-teal-500/20 scale-105 font-black'
                    : 'bg-[#090e1a] text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <span className="text-2xl">{ind.emoji}</span>
                <span className="truncate w-full">{ind.name}</span>
              </button>
            );
          })}
        </div>

        {/* 🌟 THE PERSONALIZED AUTOMATION SHOWCASE */}
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-[#0b1424] to-[#070c16] border-2 border-teal-500/40 shadow-2xl space-y-8 relative overflow-hidden">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedIndustry.emoji}</span>
              <div>
                <span className="text-[10px] font-mono font-bold text-teal-400 uppercase tracking-wider">{selectedIndustry.badge}</span>
                <h3 className="text-xl sm:text-2xl font-black text-white">{selectedIndustry.headline}</h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePlayDialogue}
                className="px-3.5 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-teal-300 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
                title="Listen to Live Audio Scenario"
              >
                <Volume2 className="w-4 h-4 text-teal-400" />
                <span>{isPlayingAudio ? 'Playing...' : 'Audio Preview'}</span>
              </button>

              <button
                onClick={() => {
                  forgeAudioSynth.playSuccess();
                  if (onLaunchSandbox) onLaunchSandbox(selectedIndustry.sysId);
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-dark-950 font-black rounded-xl text-xs font-mono transition-all shadow-md flex items-center gap-2 shrink-0"
              >
                <span>TEST IN {selectedIndustry.name.toUpperCase()} SANDBOX</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Animated Real-World Conversation Flow */}
            <div className="lg:col-span-7 space-y-4">
              <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-400" />
                <span>Live Customer-to-AI Interaction Flow:</span>
              </div>

              {/* Customer Request */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-rose-500/40 space-y-1">
                <div className="text-[10px] font-mono font-bold text-rose-400 uppercase">1. Customer Inbound</div>
                <div className="text-xs sm:text-sm text-slate-200 font-medium font-sans leading-relaxed">
                  "{selectedIndustry.dialogue.customer}"
                </div>
              </div>

              {/* FORGE Autonomous Evaluation */}
              <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 space-y-1">
                <div className="text-[10px] font-mono font-bold text-cyan-300 uppercase">2. FORGE Autonomous Action (Sub-2s)</div>
                <div className="text-xs sm:text-sm text-slate-200 font-medium font-sans leading-relaxed">
                  {selectedIndustry.dialogue.aiAction}
                </div>
              </div>

              {/* Verified Result */}
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-1">
                <div className="text-[10px] font-mono font-bold text-emerald-300 uppercase">3. Result Locked & Synced</div>
                <div className="text-xs sm:text-sm text-slate-200 font-medium font-sans leading-relaxed">
                  {selectedIndustry.dialogue.outcome}
                </div>
              </div>
            </div>

            {/* Right: Architecture Diagram & Opportunities Found */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-dark-950 border border-slate-800 space-y-5 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-bold text-teal-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  <span>FORGE DISCOVERED 5 OPPORTUNITIES</span>
                </span>
                <span className="text-[10px] text-slate-500">100% Automated</span>
              </div>

              {/* Visual Workflow Map */}
              <div className="p-3.5 rounded-xl bg-[#070c16] border border-slate-800/90 text-center space-y-2 text-[11px]">
                <div className="text-white font-bold">{selectedIndustry.name.toUpperCase()}</div>
                <div className="text-slate-500 text-xs">↓</div>
                <div className="text-teal-400 font-black px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/30 inline-block">
                  FORGE AUTONOMOUS OS
                </div>
                <div className="text-slate-500 text-xs">↙ ↓ ↘</div>
                <div className="grid grid-cols-3 gap-1 text-[9px] font-bold text-slate-300">
                  <div className="p-1 rounded bg-slate-900 border border-slate-800">LEADS</div>
                  <div className="p-1 rounded bg-slate-900 border border-slate-800">CALLS</div>
                  <div className="p-1 rounded bg-slate-900 border border-slate-800">SUPPORT</div>
                </div>
                <div className="text-slate-500 text-xs">↓ ↓ ↓</div>
                <div className="text-emerald-400 font-bold text-[10px]">
                  CRM SYNC • CHAIR BOOKED • DISPATCHED
                </div>
              </div>

              {/* Opportunities List */}
              <div className="space-y-1.5">
                {selectedIndustry.opportunities.map((op, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-300 text-xs">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{op}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  forgeAudioSynth.playSuccess();
                  if (onLaunchSandbox) onLaunchSandbox(selectedIndustry.sysId);
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-dark-950 font-black text-xs font-mono transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <Rocket className="w-3.5 h-3.5" />
                <span>BUILD THIS {selectedIndustry.name.toUpperCase()} SYSTEM</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
