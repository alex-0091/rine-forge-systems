import React from 'react';
import { 
  ShieldCheck, CheckCircle2, Lock, Cpu, Database, 
  Sparkles, ExternalLink, ArrowRight, Zap, Play, Terminal, Eye
} from 'lucide-react';
import { forgeAudioSynth } from '../../../utils/forgeAudioSynth';

export function TrustAndTechStack({ onNavigate, onWatchDemo }) {
  const TECH_STACK = [
    { name: 'OpenAI', role: 'GPT-4o Reasoning', logo: '🤖', color: 'border-emerald-500/30' },
    { name: 'Google Gemini', role: 'Multimodal Vector RAG', logo: '✨', color: 'border-cyan-500/30' },
    { name: 'n8n & Make', role: 'Deterministic Logic Workflows', logo: '🔄', color: 'border-violet-500/30' },
    { name: 'WhatsApp Business', role: 'Official Meta Telephony', logo: '💬', color: 'border-emerald-500/30' },
    { name: 'Twilio Cloud', role: 'Carrier-Grade Voice Trunks', logo: '📞', color: 'border-rose-500/30' },
    { name: 'Zapier', role: '5,000+ App Connectors', logo: '⚡', color: 'border-amber-500/30' },
    { name: 'Google Workspace', role: 'Calendar & Gmail Sync', logo: '📁', color: 'border-blue-500/30' },
    { name: 'QuickBooks & HubSpot', role: 'AP Ledger & CRM Sync', logo: '📊', color: 'border-teal-500/30' }
  ];

  const REAL_SYSTEMS = [
    {
      title: '📈 Oracle AI Trading Intelligence',
      badge: 'PRODUCTION QUANT SYSTEM',
      desc: 'Real-time quantitative order-flow microstructure analysis, tick-level volatility filtering, and deterministic multi-timeframe regime detection.',
      metric: 'Real-time WebSocket Feed',
      status: 'Live Production',
      sysId: 'oracle-ai'
    },
    {
      title: '🚀 AI Cold Outreach & Prospecting System',
      badge: 'B2B REVENUE ENGINE',
      desc: 'Autonomous multi-channel prospect discovery, contextual personalized copy generation, and human-supervised dispatch for B2B pipeline growth.',
      metric: 'Rate-Controlled Delivery',
      status: 'Live Production',
      sysId: 'outreach-ai'
    },
    {
      title: '📞 AI Voice Telephony Concierge',
      badge: '24/7 PATIENT INTAKE',
      desc: 'Sub-2s inbound telephony answering, patient dental insurance verification, and calendar booking integrated with Dentrix and Twilio SIP trunks.',
      metric: 'Direct Telephony Triage',
      status: 'Live Production',
      sysId: 'receptionist-agent'
    },
    {
      title: '📄 Optical OCR Document Parser',
      badge: 'AUTOMATED AP ACCOUNTING',
      desc: 'High-speed laser line-item extraction from PDF subcontractor invoices, validating mathematical sums and syncing clean ledgers to QuickBooks.',
      metric: 'Automated Line-Item Verification',
      status: 'Live Production',
      sysId: 'document-processor'
    }
  ];

  return (
    <section className="py-20 sm:py-28 border-b border-slate-800/80 bg-[#060a12] relative" id="trust-stack">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Top Header: Trust & Tech Stack */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold tracking-wider uppercase shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>ENTERPRISE-GRADE INFRASTRUCTURE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            BUILT WITH TOOLS <br />
            <span className="text-teal-400">YOU ALREADY TRUST.</span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            We don't invent unproven proprietary black boxes. We engineer reliable autonomous employees using the world's most battle-tested enterprise platforms.
          </p>
        </div>

        {/* Tech Stack Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {TECH_STACK.map((tech, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl bg-[#090e18] border ${tech.color} space-y-2 hover:bg-slate-900/80 transition-all`}
            >
              <div className="text-2xl">{tech.logo}</div>
              <div className="font-bold text-sm text-white font-sans">{tech.name}</div>
              <div className="text-[11px] text-slate-400 font-mono leading-tight">{tech.role}</div>
            </div>
          ))}
        </div>

        {/* 🌟 Section 2: REAL SYSTEMS. NOT AI THEATER. */}
        <div className="pt-8 border-t border-slate-800/80 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>PROVEN PRODUCTION SYSTEMS</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                REAL SYSTEMS. NOT AI THEATER.
              </h3>
            </div>
            
            <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-800 shrink-0">
              Live Client & Sandbox Deployments
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {REAL_SYSTEMS.map((sys, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-3xl bg-[#080e1a] border border-slate-800 hover:border-teal-500/50 transition-all space-y-5 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-400 text-[10px] font-mono font-bold border border-teal-500/30">
                      {sys.badge}
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      {sys.status}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors font-sans">
                    {sys.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                    {sys.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 font-bold">
                    Key SLA: <strong className="text-white">{sys.metric}</strong>
                  </span>
                  
                  <button
                    onClick={() => {
                      forgeAudioSynth.playClick();
                      const el = document.getElementById('watch-demos');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1 group-hover:underline"
                  >
                    <span>Watch Demo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* 🔒 Enterprise Governance Guarantees */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          
          <div className="p-5 rounded-2xl bg-[#080d18] border border-slate-800 space-y-2">
            <div className="text-emerald-400 font-bold font-mono text-xs flex items-center gap-1.5">
              <Lock className="w-4 h-4" />
              <span>ZERO TRAINING ON YOUR DATA</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Your patient, guest, and financial data is strictly private. It is never used to train public models.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#080d18] border border-slate-800 space-y-2">
            <div className="text-teal-400 font-bold font-mono text-xs flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>HUMAN-IN-THE-LOOP CONTROL</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Every high-risk action (payments, contract dispatch) requires 1-click human verification from your team.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#080d18] border border-slate-800 space-y-2">
            <div className="text-cyan-400 font-bold font-mono text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>DETERMINISTIC FALLBACK RULES</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              If an inquiry falls outside verified policy bounds, it automatically transfers to your human staff without hallucination.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
