import React, { useState } from 'react';
import { 
  Building2, CheckCircle2, ArrowRight, Bot, 
  Sparkles, MessageSquare, Calendar, DollarSign, 
  TrendingUp, Clock, ShieldCheck, UserCheck 
} from 'lucide-react';
import { forgeAudioSynth } from '../../../utils/forgeAudioSynth';
import { ActionButton } from '../v4/ActionButton';

const INDUSTRIES = [
  {
    id: 'dental',
    name: 'Dental Clinics',
    emoji: '🦷',
    tagline: 'Never lose another patient to a busy front desk.',
    problem: '40% of emergency calls and cleaning inquiries happen after 5 PM or during lunchtime when front-desk staff are checking in patients.',
    chat: [
      { sender: 'customer', text: 'Hi! Do you have any emergency appointments open for tomorrow? Also do you accept Delta Dental?' },
      { sender: 'ai', text: 'Hello! Yes, Dr. Evans has an urgent exam slot open tomorrow at 10:30 AM (Operatory 2). We are in-network with Delta Dental PPO. Would you like me to reserve this for you?' },
      { sender: 'customer', text: 'Yes please, 10:30 AM works!' },
      { sender: 'ai', text: 'You are booked! A confirmation and digital medical intake form has just been sent to your phone. See you tomorrow at 10:30 AM! ✓' }
    ],
    metric: '+38 Confirmed Bookings / month',
    benefit: 'Recovers $13,300+ in hygiene & treatment revenue every month.'
  },
  {
    id: 'hotels',
    name: 'Hotels & Hospitality',
    emoji: '🏨',
    tagline: 'Instant booking & guest concierge 24 hours a day.',
    problem: 'Guests asking about weekend room rates, valet parking, and late check-outs abandon reservations when phone lines are busy.',
    chat: [
      { sender: 'customer', text: 'Hello, looking for a King Suite for this Friday to Sunday with valet parking. What is the rate?' },
      { sender: 'ai', text: 'Hello! We have King Suite 402 available for Friday–Sunday at $289/night with valet parking included. Would you like me to lock this in with a mobile check-in link?' },
      { sender: 'customer', text: 'Yes, please send the link.' },
      { sender: 'ai', text: 'Done! Your reservation token #9042 is saved and your secure check-in link has been sent to your WhatsApp. Enjoy your stay! ✓' }
    ],
    metric: '92% Direct Booking Retention',
    benefit: 'Saves 15% OTA commission fees by converting guests directly on WhatsApp.'
  },
  {
    id: 'real-estate',
    name: 'Real Estate Brokerages',
    emoji: '🏠',
    tagline: 'Qualify high-intent buyers in under 45 seconds.',
    problem: 'Zillow and Facebook ad leads go cold within 5 minutes if not contacted immediately. Senior brokers waste hours chasing unqualified leads.',
    chat: [
      { sender: 'customer', text: 'Hi, is the 4-bedroom home on Oak Ridge available for a private viewing this Saturday?' },
      { sender: 'ai', text: 'Hi Jordan! Yes, Oak Ridge has viewing slots at 11:00 AM or 2:30 PM. Before booking, are you pre-approved for financing or purchasing with cash?' },
      { sender: 'customer', text: 'Pre-approved for up to $1.2M with Chase.' },
      { sender: 'ai', text: 'Excellent! Your private walkthrough is scheduled for Saturday at 11:00 AM with Senior Broker Marcus. Calendar invite and property disclosure packet sent! ✓' }
    ],
    metric: 'Sub-45s Lead Contact SLA',
    benefit: 'Eliminates lost commissions and pre-screens buyer purchasing capacity.'
  },
  {
    id: 'law-firms',
    name: 'Law Firms',
    emoji: '⚖️',
    tagline: 'Confidential client intake & consultation scheduling.',
    problem: 'Potential legal clients calling multiple law firms hire the first attorney who answers and screens their case.',
    chat: [
      { sender: 'customer', text: 'I was in a car accident last night and need advice on dealing with the other driver’s insurer.' },
      { sender: 'ai', text: 'I am so sorry to hear that. Our personal injury team can help. Were there any injuries requiring medical treatment, and in which county did this happen?' },
      { sender: 'customer', text: 'Yes, treated at Travis County ER this morning.' },
      { sender: 'ai', text: 'Understood. I have flagged your matter as priority and booked a confidential 20-minute case evaluation with Attorney Sarah for today at 3:00 PM. Consultation details sent! ✓' }
    ],
    metric: 'Zero Lost Inbound Cases',
    benefit: 'Instantly routes high-value retained matters while screening conflict of interest.'
  },
  {
    id: 'beauty',
    name: 'Beauty & MedSpas',
    emoji: '💇',
    tagline: 'Book treatments & collect deposits on autopilot.',
    problem: 'Clients messaging on Instagram and WhatsApp during evening hours want immediate treatment pricing and aesthetician availability.',
    chat: [
      { sender: 'customer', text: 'Hi! How much is HydraFacial + dermaplaning and do you have slots this Thursday afternoon?' },
      { sender: 'ai', text: 'Hello beautiful! Our signature HydraFacial with dermaplaning is $245. We have 2:00 PM or 4:30 PM open with Master Aesthetician Chloe this Thursday. Which time suits you?' },
      { sender: 'customer', text: '4:30 PM please!' },
      { sender: 'ai', text: 'Booked! A $50 deposit link has been sent to confirm your slot. See you Thursday at 4:30 PM! ✓' }
    ],
    metric: '+46 Monthly Treatments',
    benefit: 'Reduces no-shows by 78% with automated WhatsApp deposit collection.'
  },
  {
    id: 'auto',
    name: 'Auto Dealerships',
    emoji: '🚗',
    tagline: 'Test-drive bookings & instant trade-in appraisals.',
    problem: 'Shoppers looking at vehicle inventory at night want to know availability, trim specs, and trade-in value before visiting the showroom.',
    chat: [
      { sender: 'customer', text: 'Is the 2024 Audi Q5 Premium Plus in Glacier White still on the lot? Can I test drive tomorrow?' },
      { sender: 'ai', text: 'Hi Dan! Yes, the Glacier White Q5 is in stock (VIN #4819). We have test-drive slots at 11:30 AM or 3:00 PM tomorrow. Do you have a trade-in vehicle?' },
      { sender: 'customer', text: 'Yes, a 2021 BMW X3.' },
      { sender: 'ai', text: 'Great! You are confirmed for 11:30 AM. Sales specialist Mike will have the Q5 keys ready and our appraiser will evaluate your X3 while you drive. See you then! ✓' }
    ],
    metric: '+28 Showroom Visits / month',
    benefit: 'Pre-qualifies trade-in details and locks in showroom test drives.'
  },
  {
    id: 'restaurants',
    name: 'Restaurants & Dining',
    emoji: '🍽️',
    tagline: 'Large party reservations & private dining inquiries.',
    problem: 'Hosts cannot answer phones during dinner rush. Large group and catering inquiries get lost in unread voicemails.',
    chat: [
      { sender: 'customer', text: 'Looking to book a table for 10 people for a birthday dinner next Friday at 7:30 PM. Do you have a set menu?' },
      { sender: 'ai', text: 'Hello! For groups of 8 or more, we offer our family-style Chef’s Tasting Menu ($65/person). We have our private mezzanine table available at 7:30 PM next Friday. Would you like me to hold it?' },
      { sender: 'customer', text: 'Yes please hold the mezzanine table!' },
      { sender: 'ai', text: 'Reserved! Your reservation for 10 guests next Friday at 7:30 PM is confirmed. Dietary preference form sent to your mobile. Cheers! ✓' }
    ],
    metric: 'Zero Lost Large Group Bookings',
    benefit: 'Fills high-margin private dining rooms without burdening floor hosts.'
  }
];

export function IndustrySolutionsSection({ onOpenAuditModal }) {
  const [selectedIndId, setSelectedIndId] = useState('dental');
  const activeIndustry = INDUSTRIES.find(i => i.id === selectedIndId) || INDUSTRIES[0];

  const handleSelectIndustry = (id) => {
    forgeAudioSynth.playClick();
    setSelectedIndId(id);
  };

  return (
    <section className="py-20 sm:py-28 border-b border-slate-800/80 bg-[#070c18] relative" id="industries">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold tracking-wider uppercase shadow-sm">
            <Building2 className="w-3.5 h-3.5 text-teal-400" />
            <span>INDUSTRY SPECIALIZATIONS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Built for Your Industry. <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-cyan-300 to-indigo-400">
              Trained on Your Real Workflows.
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Click your industry to see the exact customer inquiries Elena handles, how she answers with grounded facts, and the revenue your business recovers.
          </p>
        </div>

        {/* Industry Pill Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-5xl mx-auto">
          {INDUSTRIES.map((ind) => {
            const isSelected = ind.id === selectedIndId;
            return (
              <button
                key={ind.id}
                onClick={() => handleSelectIndustry(ind.id)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl font-mono text-xs sm:text-sm font-bold transition-all border ${
                  isSelected
                    ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border-teal-500 text-white shadow-lg shadow-teal-500/15 ring-1 ring-teal-500/40'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <span className="text-base">{ind.emoji}</span>
                <span>{ind.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Industry Deep-Dive Card */}
        <div className="max-w-5xl mx-auto rounded-3xl bg-[#0c1322] border-2 border-teal-500/30 p-6 sm:p-10 shadow-2xl space-y-8">
          
          {/* Card Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <div className="flex items-center gap-2 text-2xl sm:text-3xl font-black text-white font-sans">
                <span>{activeIndustry.emoji}</span>
                <span>{activeIndustry.name}</span>
              </div>
              <p className="text-sm font-mono text-teal-400 font-semibold mt-1">
                {activeIndustry.tagline}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-right">
              <div className="text-[10px] uppercase font-mono text-slate-400 font-bold">Documented Impact</div>
              <div className="text-emerald-400 font-black font-mono text-sm sm:text-base">{activeIndustry.metric}</div>
            </div>
          </div>

          {/* The Pain Point Callout */}
          <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-xs sm:text-sm text-slate-200 flex items-start gap-3">
            <span className="text-rose-400 font-bold shrink-0 font-mono text-xs mt-0.5">THE PROBLEM:</span>
            <span className="leading-relaxed text-slate-300">{activeIndustry.problem}</span>
          </div>

          {/* Realistic Conversation Transcript */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase">
              <span>REAL-WORLD CONVERSATION FLOW</span>
              <span className="text-teal-400">Autonomous WhatsApp / Web Chat</span>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl bg-[#070d17] border border-slate-800 space-y-3.5 text-xs sm:text-sm font-sans">
              {activeIndustry.chat.map((turn, idx) => {
                const isCustomer = turn.sender === 'customer';
                return (
                  <div
                    key={idx}
                    className={`flex ${isCustomer ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl p-3 sm:p-3.5 ${
                      isCustomer
                        ? 'bg-slate-800/90 text-slate-100 rounded-bl-none border border-slate-700/60'
                        : 'bg-teal-950/70 text-slate-100 rounded-br-none border border-teal-500/40'
                    }`}>
                      <div className={`text-[10px] font-mono uppercase mb-1 font-bold ${
                        isCustomer ? 'text-slate-400' : 'text-teal-300 flex items-center gap-1'
                      }`}>
                        {!isCustomer && <Bot className="w-3 h-3" />}
                        <span>{isCustomer ? 'Customer' : 'Elena AI'}</span>
                      </div>
                      <div className="leading-relaxed">{turn.text}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Summary & CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <div className="text-xs sm:text-sm text-slate-300 font-sans">
              <strong className="text-white">Bottom Line:</strong> {activeIndustry.benefit}
            </div>

            <ActionButton
              variant="primary"
              size="md"
              onClick={() => {
                if (onOpenAuditModal) {
                  onOpenAuditModal({
                    businessType: activeIndustry.name,
                    whatToAutomate: `24/7 AI Receptionist & Appointment Booking for ${activeIndustry.name}`
                  });
                }
              }}
            >
              BUILD FOR {activeIndustry.name.toUpperCase()}
            </ActionButton>
          </div>

        </div>

      </div>
    </section>
  );
}
