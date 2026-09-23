import React, { useState } from 'react';
import { 
  PhoneCall, Calendar, Users, MessageSquare, 
  Database, BarChart3, Mail, MessageCircle, Star, 
  Clock, FileText, Sparkles, ArrowRight, CheckCircle2, ChevronRight
} from 'lucide-react';
import { forgeAudioSynth } from '../../../utils/forgeAudioSynth';

export function WhatCanWeAutomateConfigurator({ onOpenAuditModal }) {
  const [selectedCard, setSelectedCard] = useState('calls');

  const cards = [
    {
      id: 'calls',
      label: 'Answering calls',
      icon: PhoneCall,
      headline: '24/7 Phone Reception & Triage Pipeline',
      timeSaved: '15+ hrs/week',
      steps: [
        'Inbound customer call rings',
        'AI answers on 1st ring with your brand greeting',
        'Retrieves verified pricing, hours, & policies',
        'Checks live calendar & books appointment',
        'Sends SMS confirmation to caller & email alert to staff'
      ]
    },
    {
      id: 'appointments',
      label: 'Booking appointments',
      icon: Calendar,
      headline: 'Automated Real-Time Calendar Booking',
      timeSaved: '10+ hrs/week',
      steps: [
        'Customer requests time slot on phone or website',
        'Two-way sync checks Google/Outlook real-time openings',
        'Validates appointment duration & doctor/chair rules',
        'Secures booking with automated intake paperwork',
        'Queues -24h and -2h SMS reminders'
      ]
    },
    {
      id: 'leads',
      label: 'Lead follow-up',
      icon: Users,
      headline: 'Sub-60s Speed-to-Lead Follow-Up',
      timeSaved: '12+ hrs/week',
      steps: [
        'New website form or missed call received',
        'Instant conversational SMS text dispatched in 42s',
        'Qualifies client intent, budget, and location',
        'Delivers personalized scheduling booking link',
        'Updates CRM pipeline status with complete transcript'
      ]
    },
    {
      id: 'questions',
      label: 'Customer questions',
      icon: MessageSquare,
      headline: 'Grounded Customer FAQ & Policy Resolution',
      timeSaved: '8+ hrs/week',
      steps: [
        'Customer asks about directions, preparation, or pricing',
        'AI queries your verified documentation & catalog',
        'Delivers precise, polite answer with zero hallucinations',
        'Offers relevant next step (booking or specialist callback)',
        'Logs resolution in central support history'
      ]
    },
    {
      id: 'data_entry',
      label: 'Data entry',
      icon: Database,
      headline: 'Zero-Touch CRM & System Synchronization',
      timeSaved: '14+ hrs/week',
      steps: [
        'New customer details submitted via call or form',
        'Entity parser validates phone, email, and postal code',
        'Automatically creates/updates contact in CRM (HubSpot/GHL)',
        'Applies custom tags, deal value, and source attribution',
        'Syncs data across billing and dispatch spreadsheets'
      ]
    },
    {
      id: 'reporting',
      label: 'Reporting',
      icon: BarChart3,
      headline: 'Automated Weekly Performance Digests',
      timeSaved: '6+ hrs/week',
      steps: [
        'Gathers metrics from phone logs, calendar, and CRM',
        'Calculates answer rate, booked appointments, and revenue pipeline',
        'Generates executive digest with key operational bottlenecks',
        'Delivers PDF/email report to business owners every Monday 8 AM',
        'Highlights high-intent leads requiring immediate closing'
      ]
    },
    {
      id: 'emails',
      label: 'Emails',
      icon: Mail,
      headline: 'Smart Inbox Triage & Draft Proposals',
      timeSaved: '12+ hrs/week',
      steps: [
        'Inbound email parsed for intent and sender urgency',
        'Junk filtered; high-value inquiries flagged',
        'Retrieves relevant client history from CRM',
        'Drafts contextual reply or quote for 1-click human review',
        'Sends auto-acknowledgment so client knows they are heard'
      ]
    },
    {
      id: 'sms',
      label: 'SMS',
      icon: MessageCircle,
      headline: 'Two-Way Conversational SMS Dispatch',
      timeSaved: '10+ hrs/week',
      steps: [
        'Triggered by missed calls or website chat inquiries',
        'Maintains natural back-and-forth SMS conversation',
        'Answers routine questions without delays',
        'Provides calendar booking link or accepts appointment confirmation',
        'Alerts staff when customer requests human contact'
      ]
    },
    {
      id: 'reviews',
      label: 'Reviews',
      icon: Star,
      headline: 'Automated 5-Star Google Review Engine',
      timeSaved: '5+ hrs/week',
      steps: [
        'Triggered 2 hours after service or appointment completes',
        'Sends polite satisfaction check-in: "How was your visit?"',
        'If positive: direct link to leave 5-star Google review',
        'If feedback: private escalation to manager before public post',
        'Drives 25–40+ verified 5-star reviews every month'
      ]
    },
    {
      id: 'scheduling',
      label: 'Scheduling',
      icon: Clock,
      headline: 'Multi-Staff Schedule Optimization',
      timeSaved: '10+ hrs/week',
      steps: [
        'Handles rescheduling, cancellations, and standby lists',
        'Automatically contacts waitlisted clients when a slot opens',
        'Fills last-minute chair or van cancellations in minutes',
        'Eliminates dead calendar gaps during operating hours',
        'Notifies assigned technician or doctor of schedule changes'
      ]
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: FileText,
      headline: 'Intake & Invoice Data Extraction (OCR)',
      timeSaved: '15+ hrs/week',
      steps: [
        'PDF or image intake form / invoice uploaded',
        'OCR engine extracts patient history or vendor line items',
        'Validates insurance IDs, tax numbers, and totals',
        'Archives document to secure client folder',
        'Populates operational database without manual re-typing'
      ]
    },
    {
      id: 'other',
      label: 'Other',
      icon: Sparkles,
      headline: 'Custom Operational Pipeline Engineering',
      timeSaved: 'Custom ROI',
      steps: [
        'We map your proprietary business workflow',
        'Connect your unique software tools via REST API / webhooks',
        'Configure conditional routing and human approval gates',
        'Deploy deterministic autonomous execution',
        'Provide proactive maintenance and SLA monitoring'
      ]
    }
  ];

  const current = cards.find((c) => c.id === selectedCard) || cards[0];

  const handleCardClick = (cardId) => {
    forgeAudioSynth.playClick();
    setSelectedCard(cardId);
  };

  return (
    <section id="what-we-automate" className="py-20 sm:py-28 bg-[#070b12] border-b border-white/[0.08] relative">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Interactive Workflow Configurator</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            What is eating your team's time?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Click on any task below to see the exact automated system Rine Forge builds to take it completely off your plate.
          </p>
        </div>

        {/* 12 Selectable Task Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-6xl mx-auto">
          {cards.map((c) => {
            const Icon = c.icon;
            const isSelected = c.id === selectedCard;

            return (
              <button
                key={c.id}
                onClick={() => handleCardClick(c.id)}
                className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-between space-y-2 ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] scale-[1.03]'
                    : 'bg-[#0c101a] border-white/[0.08] hover:border-white/[0.16] text-slate-400 hover:text-white'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  isSelected ? 'bg-indigo-500 text-white' : 'bg-white/[0.04]'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold leading-tight">{c.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Workflow Viewer Panel */}
        <div className="max-w-4xl mx-auto bg-[#0c101a] border border-white/[0.12] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <current.icon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">AUTOMATION BLUEPRINT</span>
                <h3 className="text-xl sm:text-2xl font-bold text-white">{current.headline}</h3>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/25 self-start sm:self-auto">
              Est. Saved: {current.timeSaved}
            </span>
          </div>

          {/* Sequential Step List */}
          <div className="space-y-3 font-sans">
            <div className="text-xs font-mono uppercase text-slate-400 font-bold">
              Execution Sequence:
            </div>

            {current.steps.map((st, sIdx) => (
              <div 
                key={sIdx} 
                className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-3 text-xs sm:text-sm text-slate-200"
              >
                <span className="w-6 h-6 rounded-md bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-mono font-bold text-[10px] shrink-0">
                  0{sIdx + 1}
                </span>
                <span>{st}</span>
              </div>
            ))}
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              Stop doing this manually. Let our system handle it automatically.
            </div>
            <button
              onClick={() => {
                forgeAudioSynth.playSuccess();
                if (onOpenAuditModal) onOpenAuditModal({ whatToAutomate: current.headline });
              }}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] flex items-center gap-2 shrink-0"
            >
              <span>Automate {current.label}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
