import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Sparkles, ShieldCheck, Terminal, 
  Cpu, Database, Zap, Activity, Layers, Play, X, Bot, FileText, Mail, Calendar, MessageSquare 
} from 'lucide-react';

const INBOUND_NODES = [
  { id: 'calls', name: 'CALLS', system: 'AI RECEPTIONIST', icon: Bot, desc: 'Incoming phone call → Voice NLP → Urgency check → Calendar lookup → Slot lock → CRM update.', sysId: 'receptionist-agent' },
  { id: 'leads', name: 'LEADS', system: 'LEAD ENGINE', icon: Zap, desc: 'Website/portal inquiry → Intent extraction → 0-100 ICP scoring → 2-way SMS follow-up.', sysId: 'lead-agent' },
  { id: 'email', name: 'EMAIL', system: 'EMAIL AGENT', icon: Mail, desc: 'Inbox stream → Classification tag → Draft reply synthesis → 1-click human approve.', sysId: 'email-agent' },
  { id: 'documents', name: 'DOCUMENTS', system: 'DOCUMENT ENGINE', icon: FileText, desc: 'PDF vendor invoice → Line item OCR → Mathematical sum check → QuickBooks AP commit.', sysId: 'document-processor' },
  { id: 'website', name: 'WEBSITE', system: 'SUPPORT AGENT', icon: MessageSquare, desc: 'Live visitor question → Vector RAG search → Citation verified → Zero-hallucination reply.', sysId: 'support-agent' },
  { id: 'calendar', name: 'CALENDAR', system: 'APPOINTMENT AGENT', icon: Calendar, desc: 'Consultation request → Availability check → Booking confirmed → Automated reminder.', sysId: 'appointment-agent' }
];

const ENGINE_CORES = [
  'PERCEPTION', 'REASONING', 'DECISION', 'ACTION', 'MEMORY', 'MONITORING'
];

const OUTBOUND_ACTIONS = [
  { name: 'LEAD QUALIFIED', target: 'Sales Pipeline' },
  { name: 'EMAIL SENT', target: 'Customer Inbox' },
  { name: 'CALL BOOKED', target: 'Google Calendar' },
  { name: 'DOC PROCESSED', target: 'QuickBooks AP' },
  { name: 'CUSTOMER ANSWERED', target: 'Zendesk Ticket' },
  { name: 'CRM UPDATED', target: 'HubSpot / Salesforce' }
];

export function ForgeHero({ onNavigate, onLaunchSystemDemo }) {
  const [activeStreamIdx, setActiveStreamIdx] = useState(0);
  const [selectedNodeModal, setSelectedNodeModal] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStreamIdx(prev => (prev + 1) % INBOUND_NODES.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative pt-10 sm:pt-16 pb-20 sm:pb-28 border-b border-slate-800/80 overflow-hidden bg-[#060a12]">
      {/* Background ambient mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b08_1px,transparent_1px),linear-gradient(to_bottom,#1e293b08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[380px] bg-teal-500/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-indigo-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Top Centered Hero Copy */}
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" /> DON'T JUST READ ABOUT AI • USE IT
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] font-sans">
            AI SYSTEMS <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-300 to-indigo-400">
              THAT DO THE WORK.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            Explore, test and deploy intelligent systems built around the workflows that keep your business moving.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => {
                const el = document.getElementById('systems');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else if (onNavigate) onNavigate('systems');
              }}
              className="w-full sm:w-auto px-8 py-4 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl text-xs font-mono transition-all shadow-xl shadow-teal-500/25 flex items-center justify-center gap-2 group"
            >
              <span>EXPLORE SYSTEMS</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('try-ai');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else if (onNavigate) onNavigate('try-ai');
              }}
              className="w-full sm:w-auto px-8 py-4 bg-[#0c1322] hover:bg-slate-850 text-teal-300 border border-teal-500/40 font-bold rounded-xl text-xs font-mono transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current text-teal-400" />
              <span>TRY FORGE</span>
            </button>

            <button
              onClick={() => onNavigate && onNavigate('experience')}
              className="w-full sm:w-auto px-6 py-4 bg-dark-900 hover:bg-slate-850 text-slate-300 border border-slate-700 font-bold rounded-xl text-xs font-mono transition-all flex items-center justify-center gap-2"
            >
              <span>BUILD A CUSTOM SYSTEM</span>
            </button>
          </div>

          <div className="text-xs font-mono text-slate-400 flex items-center justify-center gap-2 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Watch it. Touch it. Run it.</span>
          </div>

        </div>

        {/* Interactive "FORGE ENGINE" Pipeline Architecture Visualization */}
        <div className="p-6 sm:p-10 rounded-3xl bg-[#090e18] border border-slate-800 shadow-2xl relative overflow-hidden font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-white font-bold">
              <Cpu className="w-4 h-4 text-teal-400" />
              <span>THE FORGE ENGINE • CLICK ANY NODE TO INSPECT WORKFLOW</span>
            </div>
            <span className="text-[10px] px-2.5 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 font-bold">
              INTERACTIVE REASONING TOPOLOGY
            </span>
          </div>

          {/* 3-Stage Layout: Inbound Streams -> Engine Core -> Autonomous Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-8">
            
            {/* Left Column: Business Inbound Streams (3 Cols) */}
            <div className="lg:col-span-3 space-y-2">
              <div className="text-[10px] font-bold text-slate-500 uppercase pb-1">01. INBOUND INPUTS (CLICK TO TEST)</div>
              <div className="space-y-1.5">
                {INBOUND_NODES.map((node, idx) => {
                  const isHighlighted = activeStreamIdx === idx;
                  return (
                    <button
                      key={node.id}
                      onClick={() => setSelectedNodeModal(node)}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                        isHighlighted
                          ? 'border-teal-400 bg-teal-500/20 text-white font-bold shadow-md shadow-teal-500/10'
                          : 'border-slate-850 bg-dark-950/60 text-slate-400 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 font-bold">
                        <node.icon className="w-3.5 h-3.5 text-teal-400" />
                        <span>{node.name}</span>
                      </span>
                      <span className="text-[10px] text-teal-400 font-mono">Inspect →</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Center Column: The FORGE Engine Core (6 Cols) */}
            <div className="lg:col-span-6 p-6 rounded-3xl bg-[#0c1424] border border-teal-500/40 shadow-xl space-y-4 text-center relative">
              <div className="w-12 h-12 rounded-2xl bg-teal-500 text-dark-950 font-black text-xl flex items-center justify-center mx-auto shadow-lg shadow-teal-500/25">
                F
              </div>
              <div>
                <div className="text-base font-black text-white tracking-wider">FORGE AUTONOMOUS ENGINE</div>
                <div className="text-[10px] text-teal-300">Continuous Multi-Agent Reasoning & Execution</div>
              </div>

              {/* 6 Engine Sub-Modules */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] pt-2">
                {ENGINE_CORES.map((core, i) => (
                  <div key={core} className="p-2 rounded-lg bg-dark-950 border border-slate-800 text-slate-200">
                    <span className="text-teal-400 font-bold block">0{i + 1}</span>
                    {core}
                  </div>
                ))}
              </div>

              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800 font-sans">
                "Not just AI that answers. <strong>AI that does.</strong>"
              </div>
            </div>

            {/* Right Column: Outbound Dispatched Actions (3 Cols) */}
            <div className="lg:col-span-3 space-y-2">
              <div className="text-[10px] font-bold text-slate-500 uppercase pb-1">02. EXECUTED ACTIONS</div>
              <div className="space-y-1.5">
                {OUTBOUND_ACTIONS.map((action, idx) => {
                  const isHighlighted = activeStreamIdx === idx;
                  return (
                    <div
                      key={action.name}
                      className={`p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                        isHighlighted
                          ? 'border-emerald-400 bg-emerald-500/20 text-white font-bold shadow-md shadow-emerald-500/10'
                          : 'border-slate-850 bg-dark-950/60 text-slate-400'
                      }`}
                    >
                      <span className="text-[10px] text-emerald-400">✓</span>
                      <div className="text-right">
                        <div className="font-bold text-white text-[11px]">{action.name}</div>
                        <div className="text-[9px] text-slate-500">{action.target}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Bottom Brand Statement Bar */}
          <div className="mt-8 pt-4 border-t border-slate-800 text-center text-xs text-slate-300 font-sans">
            <strong className="text-white">FORGE doesn't sell AI software for the sake of AI.</strong> We build systems that turn business inputs into useful actions.
          </div>

        </div>

      </div>

      {/* Node Inspector Modal */}
      {selectedNodeModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-sans animate-fadeIn">
          <div className="w-full max-w-md bg-[#090e18] border border-teal-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl font-mono text-xs text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <selectedNodeModal.icon className="w-4 h-4 text-teal-400" />
                <span className="text-base font-bold text-white font-sans">{selectedNodeModal.name} NODE</span>
              </div>
              <button
                onClick={() => setSelectedNodeModal(null)}
                className="p-1 rounded-lg bg-dark-900 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-[10px] text-teal-400 font-bold uppercase">ASSOCIATED AUTONOMOUS SYSTEM:</div>
              <div className="text-sm font-bold text-white font-sans">{selectedNodeModal.system}</div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">{selectedNodeModal.desc}</p>
            </div>

            <button
              onClick={() => {
                const id = selectedNodeModal.sysId;
                setSelectedNodeModal(null);
                if (onLaunchSystemDemo) onLaunchSystemDemo(id);
                else if (onNavigate) onNavigate('try-ai');
              }}
              className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl text-xs font-mono transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>TRY THIS SYSTEM LIVE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </section>
  );
}
