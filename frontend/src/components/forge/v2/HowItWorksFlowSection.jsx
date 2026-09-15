import React from 'react';
import { 
  Building2, Database, Share2, Bot, 
  CalendarCheck, ArrowRight, Sparkles, CheckCircle2 
} from 'lucide-react';
import { ActionButton } from '../v4/ActionButton';

const STEPS = [
  {
    step: '01',
    title: 'Connect Your Business',
    subtitle: 'Share your existing info',
    desc: 'Provide your website, service catalog, pricing list, and operating hours. No complex onboarding forms required.',
    icon: Building2,
    badge: 'Day 1'
  },
  {
    step: '02',
    title: 'We Train the AI',
    subtitle: 'Zero-hallucination grounding',
    desc: 'We encode your business rules, FAQs, cancellation policies, and guardrails so Elena never guesses or invents facts.',
    icon: Database,
    badge: 'Days 2–3'
  },
  {
    step: '03',
    title: 'Connect Your Channels',
    subtitle: 'WhatsApp & Website sync',
    desc: 'We link your official WhatsApp Business number, embed the website chat, and integrate your Google Calendar or CRM.',
    icon: Share2,
    badge: 'Days 4–5'
  },
  {
    step: '04',
    title: 'AI Starts Handling Customers',
    subtitle: 'Autonomous 24/7 execution',
    desc: 'Elena answers customer inquiries in under 5 seconds, answers pricing questions, and qualifies client needs day and night.',
    icon: Bot,
    badge: 'Day 6'
  },
  {
    step: '05',
    title: 'You Receive Bookings & Leads',
    subtitle: 'Revenue on autopilot',
    desc: 'Your appointment calendar fills up, staff receive instant notifications, and customer data is logged into your CRM.',
    icon: CalendarCheck,
    badge: 'Day 7 & Beyond'
  }
];

export function HowItWorksFlowSection({ onOpenAuditModal }) {
  return (
    <section className="py-20 sm:py-28 border-b border-slate-800/80 bg-[#060a14] relative" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold tracking-wider uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>SIMPLE 5-STEP IMPLEMENTATION</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            How It Works. <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-cyan-300 to-indigo-400">
              Live in Under 7 Days.
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Zero technical headache for your team. We handle the training, integration, and testing from start to finish.
          </p>
        </div>

        {/* 5-Step Process Timeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-6 relative">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div 
                key={s.step} 
                className="rounded-3xl bg-[#0b1220] border-2 border-slate-800 hover:border-teal-500/50 p-6 flex flex-col justify-between space-y-5 transition-all group shadow-xl relative"
              >
                <div className="space-y-4">
                  {/* Top Step Number & Badge */}
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-2xl font-black text-teal-400/80 group-hover:text-teal-300 transition-colors">
                      {s.step}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      {s.badge}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-teal-950/40 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:bg-teal-900/40 transition-all">
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Title & Desc */}
                  <div>
                    <h3 className="text-base font-bold text-white font-sans">{s.title}</h3>
                    <p className="text-xs text-teal-400 font-mono mt-0.5">{s.subtitle}</p>
                    <p className="text-xs text-slate-300 leading-relaxed mt-2.5 font-sans">
                      {s.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Handled by Rine Forge</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reassurance Banner */}
        <div className="max-w-4xl mx-auto rounded-2xl bg-slate-900/80 border border-slate-800 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">No changes to your existing software stack</h4>
            <p className="text-xs text-slate-400">
              We connect directly into your current Google Calendar, HubSpot, Dentrix, or custom CRM. Zero workflow friction.
            </p>
          </div>
          <ActionButton
            variant="primary"
            size="md"
            onClick={() => {
              if (onOpenAuditModal) {
                onOpenAuditModal({
                  whatToAutomate: 'Start 7-day AI employee implementation'
                });
              }
            }}
          >
            START YOUR 7-DAY SETUP
          </ActionButton>
        </div>

      </div>
    </section>
  );
}
