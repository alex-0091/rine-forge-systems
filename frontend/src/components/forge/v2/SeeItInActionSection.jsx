import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, Users, Calendar, MessageSquare, 
  Workflow, Play, Pause, RotateCcw, CheckCircle2, 
  Bell, Check, Sparkles, ArrowRight, ShieldCheck, 
  Clock, AlertCircle, Wrench, Building2, Stethoscope, 
  Scissors, Hotel, Zap, Scale
} from 'lucide-react';
import { forgeAudioSynth } from '../../../utils/forgeAudioSynth';

// Industry variations for the live call simulation
const INDUSTRY_SIMULATIONS = {
  dental: {
    name: 'Dental Practice',
    icon: Stethoscope,
    callerNumber: '+1 (512) 555-0182',
    callerCity: 'Austin, TX',
    service: 'Emergency Examination & Crown Consultation',
    urgency: 'URGENT',
    conversation: [
      { speaker: 'customer', text: "Hi, I have severe tooth pain on my lower molar and need to see a dentist as soon as possible." },
      { speaker: 'ai', text: "I can help with that right away. I have Dr. Scott available tomorrow morning at 9:30 AM or Thursday at 2:00 PM. Which works best?" },
      { speaker: 'customer', text: "Tomorrow at 9:30 AM, please." },
      { speaker: 'ai', text: "You're all set for tomorrow at 9:30 AM. I've reserved the chair and sent your intake paperwork via SMS." }
    ],
    lead: {
      name: 'Sarah Johnson',
      phone: '+1 (512) 555-0182',
      service: 'Emergency Dental Exam',
      appointment: 'Tomorrow · 9:30 AM',
      doctor: 'Dr. Scott Miller, DDS'
    },
    alert: 'Dr. Scott & Office Manager alerted: Tooth pain emergency scheduled for 9:30 AM'
  },
  salon: {
    name: 'Salon & Med Spa',
    icon: Scissors,
    callerNumber: '+1 (415) 555-8941',
    callerCity: 'San Francisco, CA',
    service: 'Balayage & Styling Consultation',
    urgency: 'STANDARD',
    conversation: [
      { speaker: 'customer', text: "Hi! Do you have any openings for a full balayage and haircut this Friday afternoon?" },
      { speaker: 'ai', text: "Yes! Master Stylist Chloe has an opening at 2:30 PM this Friday. Would that time suit you?" },
      { speaker: 'customer', text: "2:30 PM on Friday is perfect." },
      { speaker: 'ai', text: "Wonderful. You are booked for Friday at 2:30 PM with Chloe. I've texted your deposit and appointment confirmation." }
    ],
    lead: {
      name: 'Emma Watson',
      phone: '+1 (415) 555-8941',
      service: 'Full Balayage & Cut',
      appointment: 'Friday · 2:30 PM',
      doctor: 'Stylist Chloe'
    },
    alert: 'Salon Chair Calendar Synced: Emma Watson confirmed with $50 holding deposit'
  },
  hotel: {
    name: 'Hotel & Hospitality',
    icon: Hotel,
    callerNumber: '+1 (305) 555-3210',
    callerCity: 'Miami Beach, FL',
    service: 'Direct Oceanview Suite Reservation',
    urgency: 'HIGH REVENUE',
    conversation: [
      { speaker: 'customer', text: "Hello, we are arriving late tonight around 11:30 PM. Can we still check in and is valet parking open?" },
      { speaker: 'ai', text: "Yes, our front desk and valet are staffed 24/7. Would you like me to flag late check-in on your reservation?" },
      { speaker: 'customer', text: "Yes please, under reservation name David Miller." },
      { speaker: 'ai', text: "Done! David Miller's reservation is marked for late arrival, and the night concierge has been notified." }
    ],
    lead: {
      name: 'David Miller',
      phone: '+1 (305) 555-3210',
      service: 'Late Check-in & Valet Request',
      appointment: 'Tonight · 11:30 PM Arrival',
      doctor: 'Room 408 • Front Desk Night Staff'
    },
    alert: 'Night Desk Concierge dispatched: David Miller marked for arrival with valet pre-staged'
  },
  plumber: {
    name: 'Plumbing Services',
    icon: Wrench,
    callerNumber: '+1 (512) 555-7740',
    callerCity: 'Austin, TX',
    service: 'Active Water Heater Leak',
    urgency: 'URGENT DISPATCH',
    conversation: [
      { speaker: 'customer', text: "Help! My water heater is leaking in the garage and water is spreading across the floor." },
      { speaker: 'ai', text: "I can help collect the details for the team. Is the leak currently active, and do you know where your main shut-off valve is?" },
      { speaker: 'customer', text: "Yes, it is actively leaking right now!" },
      { speaker: 'ai', text: "Please turn the cold valve on top of the heater off if safe. I have marked this as an emergency and dispatched on-call technician Mark to you." }
    ],
    lead: {
      name: 'Michael R.',
      phone: '+1 (512) 555-7740',
      service: 'Water Heater Replacement',
      appointment: 'Immediate Emergency Dispatch',
      doctor: 'On-Call Tech: Mark Davis'
    },
    alert: 'URGENT DISPATCH SENT: Michael R. (Austin, TX) water heater emergency sent to technician via SMS'
  },
  electrician: {
    name: 'Electrical Contractor',
    icon: Zap,
    callerNumber: '+1 (602) 555-9124',
    callerCity: 'Phoenix, AZ',
    service: 'Commercial Breaker Trip & Panel Triage',
    urgency: 'HIGH PRIORITY',
    conversation: [
      { speaker: 'customer', text: "Hi, our retail store lost power to the front displays after a breaker tripped and won't reset." },
      { speaker: 'ai', text: "Understood. That indicates a potential overload or short. We can have a commercial technician on site between 1 PM and 3 PM today." },
      { speaker: 'customer', text: "Between 1 and 3 PM works, we need this fixed before evening rush." },
      { speaker: 'ai', text: "You are slotted for today between 1:00 PM and 3:00 PM. Our technician will call 15 minutes prior to arrival." }
    ],
    lead: {
      name: 'Robert Hayes',
      phone: '+1 (602) 555-9124',
      service: 'Commercial Panel Diagnostic',
      appointment: 'Today · 1:00 PM – 3:00 PM Window',
      doctor: 'Field Tech: Alex Vance'
    },
    alert: 'Commercial Dispatch Alert: Retail store power outage scheduled with priority status'
  },
  realestate: {
    name: 'Real Estate Agency',
    icon: Building2,
    callerNumber: '+1 (720) 555-4491',
    callerCity: 'Denver, CO',
    service: 'Private Property Showing & Buyer Qualification',
    urgency: 'QUALIFIED BUYER',
    conversation: [
      { speaker: 'customer', text: "Hi, I'm calling about the 4-bedroom listing on Aspen Ridge Way. Can I view it this weekend?" },
      { speaker: 'ai', text: "It's a gorgeous property. We have private showings Saturday at 11:00 AM or Sunday at 1:30 PM. Which works best?" },
      { speaker: 'customer', text: "Saturday at 11:00 AM." },
      { speaker: 'ai', text: "Saturday at 11:00 AM is reserved for you. I've sent property specs and gate entry instructions to your phone." }
    ],
    lead: {
      name: 'Jennifer Cole',
      phone: '+1 (720) 555-4491',
      service: 'Private Home Showing',
      appointment: 'Saturday · 11:00 AM',
      doctor: 'Listing Agent: Marcus Vance'
    },
    alert: 'Buyer Showing Confirmed: Pre-approval verified, showing invite sent to buyer & listing agent'
  },
  law: {
    name: 'Law Firm',
    icon: Scale,
    callerNumber: '+1 (312) 555-6682',
    callerCity: 'Chicago, IL',
    service: 'New Client Intake & Estate Planning Consult',
    urgency: 'NEW MATTER',
    conversation: [
      { speaker: 'customer', text: "Hello, I need to discuss updating my family trust and business succession plan." },
      { speaker: 'ai', text: "We can certainly assist with estate planning. Attorney Elena has consultation times Thursday at 11:00 AM or Friday at 3:00 PM." },
      { speaker: 'customer', text: "Thursday at 11:00 AM works well." },
      { speaker: 'ai', text: "Confirmed for Thursday at 11:00 AM. I have sent our confidential intake questionnaire to your email." }
    ],
    lead: {
      name: 'Thomas Wright',
      phone: '+1 (312) 555-6682',
      service: 'Estate & Trust Consultation',
      appointment: 'Thursday · 11:00 AM',
      doctor: 'Attorney Elena Rostova'
    },
    alert: 'New Client Matter Opened: Confidential intake form sent, consultation placed on attorney docket'
  }
};

export function SeeItInActionSection({ onOpenAuditModal }) {
  const [activeTab, setActiveTab] = useState('receptionist');
  const [activeIndustry, setActiveIndustry] = useState('dental');
  const [simStep, setSimStep] = useState(0);
  const [callDuration, setCallDuration] = useState(38);
  const [isPlaying, setIsPlaying] = useState(true);

  const currentSim = INDUSTRY_SIMULATIONS[activeIndustry] || INDUSTRY_SIMULATIONS.dental;

  // Auto-progress simulated dialog and outcomes
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setSimStep((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Call duration counter simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => (prev < 120 ? prev + 1 : 12));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleTabClick = (tabId) => {
    forgeAudioSynth.playClick();
    setActiveTab(tabId);
  };

  const handleIndustrySwitch = (indKey) => {
    forgeAudioSynth.playClick();
    setActiveIndustry(indKey);
    setSimStep(0);
  };

  return (
    <section id="see-it-in-action" className="py-20 sm:py-28 bg-[#070b12] border-b border-white/[0.08] relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-600/[0.06] blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Interactive Product Simulation</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Don't take our word for it. <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-sky-200 to-white">
              Experience the system operating live.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Switch between modules and industries below to see how Rine Forge captures calls, qualifies inquiries, locks calendar slots, and alerts your team in real time.
          </p>
        </div>

        {/* 5 Product Feature Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none max-w-4xl mx-auto">
          {[
            { id: 'receptionist', label: 'AI RECEPTIONIST', icon: PhoneCall },
            { id: 'lead_capture', label: 'LEAD CAPTURE', icon: Users },
            { id: 'appointments', label: 'APPOINTMENTS', icon: Calendar },
            { id: 'follow_up', label: 'FOLLOW-UP', icon: MessageSquare },
            { id: 'custom_automation', label: 'CUSTOM AUTOMATION', icon: Workflow },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold flex items-center gap-2 shrink-0 transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]'
                    : 'bg-[#0c101a] text-slate-400 hover:text-white border border-white/[0.08] hover:border-white/[0.16]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Industry Switcher Strip */}
        <div className="space-y-3 max-w-5xl mx-auto">
          <div className="text-center">
            <span className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">
              See how this changes for your business:
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 flex-wrap">
            {Object.entries(INDUSTRY_SIMULATIONS).map(([key, data]) => {
              const Icon = data.icon;
              const isSelected = activeIndustry === key;
              return (
                <button
                  key={key}
                  onClick={() => handleIndustrySwitch(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-400 shadow-sm'
                      : 'bg-white/[0.03] text-slate-400 hover:text-slate-200 border border-white/[0.06]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{data.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN INTERACTIVE SIMULATION CONTAINER */}
        <div className="max-w-5xl mx-auto bg-[#0c101a] border border-white/[0.12] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl space-y-8">
          
          {/* Top Call Interface Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
            
            {/* Caller Info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <PhoneCall className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                    LIVE CUSTOMER CALL
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs font-mono text-slate-400">
                    DURATION: {formatTimer(callDuration)}
                  </span>
                </div>
                <div className="text-sm font-bold text-white font-mono mt-0.5">
                  CALLER: {currentSim.callerNumber} ({currentSim.callerCity})
                </div>
              </div>
            </div>

            {/* Audio Waveform & Status */}
            <div className="flex items-center gap-4">
              {/* Waveform graphic */}
              <div className="flex items-center gap-1 h-6">
                {[40, 70, 30, 90, 60, 40, 80, 50, 30, 60].map((h, i) => (
                  <span
                    key={i}
                    className="w-1 bg-indigo-400 rounded-full animate-pulse"
                    style={{
                      height: `${h}%`,
                      animationDelay: `${i * 120}ms`,
                      animationDuration: '900ms'
                    }}
                  />
                ))}
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-xs font-mono font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                STATUS: CONNECTED
              </span>
            </div>

          </div>

          {/* Dual Column: Live Conversation vs. Automated Output Tickets */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Live Audio Dialog Stream (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>CONVERSATION STREAM (NEURAL SPEECH ENGINE)</span>
                <span>LATENCY: 280ms</span>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.08] space-y-3 font-sans text-xs min-h-[260px] flex flex-col justify-center">
                {currentSim.conversation.map((msg, idx) => {
                  const isAI = msg.speaker === 'ai';
                  const isVisible = idx <= simStep + 1;
                  if (!isVisible) return null;

                  return (
                    <div
                      key={idx}
                      className={`flex items-start gap-2.5 transition-all animate-fadeIn ${
                        isAI ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {!isAI && (
                        <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-bold shrink-0">
                          C
                        </div>
                      )}

                      <div
                        className={`p-3 rounded-2xl max-w-sm leading-relaxed ${
                          isAI
                            ? 'bg-indigo-600/30 border border-indigo-500/40 text-slate-100 rounded-tr-sm text-right'
                            : 'bg-white/[0.06] border border-white/[0.06] text-slate-200 rounded-tl-sm'
                        }`}
                      >
                        {isAI ? msg.text : `"${msg.text}"`}
                      </div>

                      {isAI && (
                        <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                          R
                        </div>
                      )}
                    </div>
                  );
                })}

                {simStep < 3 && (
                  <div className="flex items-center gap-1.5 text-indigo-400 font-mono text-[11px] pt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="ml-1 text-slate-400">Listening to caller...</span>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <button
                  onClick={() => {
                    forgeAudioSynth.playClick();
                    setIsPlaying(!isPlaying);
                  }}
                  className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5 text-indigo-400" /> : <Play className="w-3.5 h-3.5 text-indigo-400" />}
                  <span>{isPlaying ? 'Pause Simulation' : 'Resume Simulation'}</span>
                </button>

                <button
                  onClick={() => {
                    forgeAudioSynth.playClick();
                    setSimStep(0);
                  }}
                  className="inline-flex items-center gap-1 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Replay Call</span>
                </button>
              </div>
            </div>

            {/* Right Column: Live Outcome Tickets (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                Downstream Business Actions
              </div>

              {/* 1. LEAD CREATED TICKET */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> LEAD CREATED ✓
                  </span>
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">
                    {currentSim.urgency}
                  </span>
                </div>
                <div className="text-sm font-bold text-white font-sans">
                  {currentSim.lead.name}
                </div>
                <div className="text-xs text-slate-300">
                  Service: <strong className="text-white">{currentSim.lead.service}</strong>
                </div>
                <div className="text-xs text-slate-400">
                  Phone: {currentSim.lead.phone}
                </div>
              </div>

              {/* 2. APPOINTMENT BOOKED TICKET */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-sky-400 uppercase font-bold flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> APPOINTMENT BOOKED ✓
                  </span>
                  <span className="text-[9px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded">
                    CALENDAR SYNCED
                  </span>
                </div>
                <div className="text-sm font-bold text-white font-mono">
                  {currentSim.lead.appointment}
                </div>
                <div className="text-xs text-slate-400">
                  Assigned: {currentSim.lead.doctor}
                </div>
              </div>

              {/* 3. BUSINESS NOTIFICATION SENT */}
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-400 uppercase">
                  <Bell className="w-3.5 h-3.5" /> BUSINESS NOTIFICATION SENT ✓
                </div>
                <div className="text-xs text-slate-200 leading-snug">
                  {currentSim.alert}
                </div>
                <div className="text-[10px] text-slate-400 font-mono pt-1">
                  Dispatched in 0.8s via SMS & Email.
                </div>
              </div>

            </div>

          </div>

          {/* Bottom Conversion Prompt */}
          <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div>
              <span>Want this exact workflow configured for your {currentSim.name}?</span>
            </div>
            <button
              onClick={() => {
                forgeAudioSynth.playSuccess();
                if (onOpenAuditModal) onOpenAuditModal({ businessType: currentSim.name });
              }}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] flex items-center gap-2 shrink-0"
            >
              <span>Get Free Opportunity Audit for {currentSim.name.split(' ')[0]}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
