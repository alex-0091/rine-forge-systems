import React, { useState } from 'react';
import { 
  MessageSquare, Smartphone, Globe, PhoneCall, 
  Sparkles, CheckCircle2, ArrowRight, 
  ShieldCheck, Layers, Bot, Zap, Clock 
} from 'lucide-react';
import { forgeAudioSynth } from '../../../utils/forgeAudioSynth';
import { ActionButton } from '../v4/ActionButton';
import { ForgeCharacterAvatar } from '../v4/ForgeCharacterAvatar';

function InstagramIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const CHANNELS = [
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    icon: Smartphone,
    color: 'emerald',
    badge: 'Official Meta Cloud API',
    highlight: '98% Open Rate • Voice Notes Supported',
    customerSnippet: '“Hi, do you have any emergency dental slots open tomorrow morning?”',
    aiSnippet: '“Hello! Yes, Dr. Evans has Operatory 2 available at 9:30 AM or 11:00 AM. Which time works best for you?”',
    features: [
      'Official Meta WhatsApp Cloud API verified integration',
      'Text messages & audio voice notes processed automatically',
      'Instant calendar booking link & intake confirmation',
      'Sends automated 24-hour appointment reminders'
    ]
  },
  {
    id: 'website',
    name: 'Website Live Chat',
    icon: Globe,
    color: 'teal',
    badge: 'Sub-second Interactive Widget',
    highlight: 'Zero Lead Leakage from Web Traffic',
    customerSnippet: '“How much does laser teeth whitening cost and how long does it take?”',
    aiSnippet: '“Our in-office laser teeth whitening is $350. The session takes approximately 60 minutes and brightens teeth up to 8 shades.”',
    features: [
      'Lightweight, responsive widget loading in < 120ms',
      'Converts passive site visitors into booked calendar slots',
      'Grounds replies strictly in verified business services & FAQ',
      'Captures patient name and phone number before booking'
    ]
  },
  {
    id: 'instagram',
    name: 'Instagram & Social DMs',
    icon: InstagramIcon,
    color: 'purple',
    badge: 'Direct Message Automation',
    highlight: 'Instant Story & Post Lead Conversion',
    customerSnippet: '“Loved your latest case result! How do I get started with cosmetic consultation?”',
    aiSnippet: '“Thank you! Our initial consultation is 30 minutes. Would you prefer a virtual call or visiting our Austin clinic?”',
    features: [
      'Responds to Instagram DMs and Story mentions instantly',
      'Pre-qualifies interest before routing to staff',
      'Sends appointment booking links directly inside the chat',
      'Eliminates social media inbox backlogs'
    ]
  },
  {
    id: 'phone',
    name: 'Phone & Voice Reception',
    icon: PhoneCall,
    color: 'cyan',
    badge: 'AI Telephony & Call Screening',
    highlight: 'Zero Busy Signals • 24/7 Voice Intake',
    customerSnippet: '[Caller dials clinic number at 8:15 PM]',
    aiSnippet: '“Thank you for calling Rine Dental. I can help you schedule an appointment or answer questions about our treatments.”',
    features: [
      'Answers calls when all front-desk lines are engaged',
      'Transcribes caller inquiries and updates calendar',
      'Screens urgent emergencies from routine questions',
      'Sends follow-up SMS with booking confirmation'
    ]
  }
];

export function OmnichannelSection({ onOpenAuditModal }) {
  const [selectedChannelId, setSelectedChannelId] = useState('whatsapp');
  const activeChannel = CHANNELS.find(c => c.id === selectedChannelId) || CHANNELS[0];

  const handleSelectChannel = (id) => {
    forgeAudioSynth.playClick();
    setSelectedChannelId(id);
  };

  return (
    <section className="py-20 sm:py-28 border-b border-slate-800/80 bg-[#070c18] relative" id="omnichannel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold tracking-wider uppercase shadow-sm">
            <Layers className="w-3.5 h-3.5 text-teal-400" />
            <span>UNIFIED INTELLIGENCE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            One AI Employee. <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-cyan-300 to-indigo-400">
              Every Channel Your Customers Use.
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Your customers don't just visit your website. They message on WhatsApp, DM on Instagram, and call after hours. Elena unifies all channels with a single, grounded brain.
          </p>
        </div>

        {/* Interactive Channel Selector Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-4xl mx-auto">
          {CHANNELS.map((ch) => {
            const Icon = ch.icon;
            const isSelected = ch.id === selectedChannelId;
            return (
              <button
                key={ch.id}
                onClick={() => handleSelectChannel(ch.id)}
                className={`flex items-center gap-2.5 px-4 sm:px-6 py-3 rounded-2xl font-mono text-xs sm:text-sm font-bold transition-all border ${
                  isSelected
                    ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border-teal-500/60 text-white shadow-lg shadow-teal-500/10'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-teal-400' : 'text-slate-400'}`} />
                <span>{ch.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Channel Interactive Preview Card */}
        <div className="max-w-5xl mx-auto rounded-3xl bg-[#0b1220] border-2 border-teal-500/30 p-6 sm:p-10 shadow-2xl space-y-8">
          
          {/* Header of Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-950/60 border border-teal-500/40 flex items-center justify-center text-teal-400 shrink-0">
                <activeChannel.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white font-sans">{activeChannel.name}</h3>
                <span className="text-xs font-mono text-teal-400 font-semibold">{activeChannel.badge}</span>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-mono text-xs">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>{activeChannel.highlight}</span>
            </div>
          </div>

          {/* Dual Panel: Conversation Simulation (Left) + Feature Points (Right) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Conversation Simulation (7 Cols) */}
            <div className="md:col-span-7 rounded-2xl bg-[#070d17] border border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800/60 pb-2">
                <span>SIMULATED {activeChannel.name.toUpperCase()} FLOW</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE
                </span>
              </div>

              {/* Inbound Customer Bubble */}
              <div className="flex justify-start">
                <div className="max-w-[90%] rounded-2xl rounded-bl-none p-3.5 bg-slate-800/90 border border-slate-700/60 text-slate-100 text-sm leading-relaxed">
                  <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Customer</div>
                  {activeChannel.customerSnippet}
                </div>
              </div>

              {/* Elena AI Outbound Bubble */}
              <div className="flex justify-end">
                <div className="max-w-[90%] rounded-2xl rounded-br-none p-3.5 bg-teal-950/70 border border-teal-500/40 text-slate-100 text-sm leading-relaxed">
                  <div className="flex items-center justify-between gap-2 text-[10px] font-mono text-teal-300 uppercase mb-1">
                    <span className="font-bold flex items-center gap-1">
                      <Bot className="w-3 h-3" /> Elena AI
                    </span>
                    <span>1.8s response</span>
                  </div>
                  {activeChannel.aiSnippet}
                </div>
              </div>

              {/* Action Receipt */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Calendar slot locked & CRM updated</span>
                </span>
                <span className="text-slate-500">24/7 Grounded</span>
              </div>
            </div>

            {/* Feature Points & Value (5 Cols) */}
            <div className="md:col-span-5 space-y-4">
              <h4 className="text-sm font-mono font-bold uppercase text-slate-300 tracking-wider">
                Key Channel Capabilities:
              </h4>
              <ul className="space-y-3">
                {activeChannel.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 font-sans leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-3">
                <ActionButton
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    if (onOpenAuditModal) {
                      onOpenAuditModal({
                        whatToAutomate: `Connect AI Employee to ${activeChannel.name}`
                      });
                    }
                  }}
                >
                  CONNECT {activeChannel.name.toUpperCase()}
                </ActionButton>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
