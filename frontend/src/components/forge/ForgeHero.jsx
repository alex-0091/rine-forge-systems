import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, ArrowDown, Sparkles, CheckCircle2, 
  ShieldCheck, Terminal, Cpu, Database, Send, Calendar,
  MessageSquare, Zap, Activity
} from 'lucide-react';

export function ForgeHero({ onNavigate }) {
  const [activeStep, setActiveStep] = useState(0);

  // Cycle through workflow stages
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 5);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  const workflowSteps = [
    {
      label: '01. Business Input',
      desc: 'Inbound Webhook, Call, PDF Invoice, or CRM Form',
      tag: 'INGEST',
      icon: Terminal,
      color: 'text-cyan-400'
    },
    {
      label: '02. AI Intelligence',
      desc: 'Intent Extraction, RAG Knowledge Retrieval, Verification',
      tag: 'EVALUATE',
      icon: Cpu,
      color: 'text-teal-400'
    },
    {
      label: '03. Decision Engine',
      desc: 'Policy Verification & Human Approval Gating',
      tag: 'GOVERN',
      icon: ShieldCheck,
      color: 'text-indigo-400'
    },
    {
      label: '04. Automated Action',
      desc: 'SMS Response, Schedule Slot, Generate Contract',
      tag: 'EXECUTE',
      icon: Zap,
      color: 'text-emerald-400'
    },
    {
      label: '05. Connected Systems',
      desc: 'HubSpot, Salesforce, Jobber, Stripe, Slack Synced',
      tag: 'COMMIT',
      icon: Database,
      color: 'text-amber-400'
    }
  ];

  return (
    <section className="relative pt-8 sm:pt-14 pb-16 sm:pb-24 border-b border-slate-800/80 overflow-hidden">
      {/* Subtle Background Grid & Ambient Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Core Positioning Copy */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            
            {/* Position Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-teal-400 text-xs font-mono font-medium tracking-wide">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span>B2B AI AUTOMATION & INTELLIGENT SYSTEMS</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1] font-sans">
              AI SYSTEMS THAT <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-300 to-indigo-400">
                DO THE WORK.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              We build intelligent automation systems that handle repetitive business processes, respond to customers, capture leads, and connect your tools — so your team can focus on work that actually requires people.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={() => onNavigate('audit')}
                className="w-full sm:w-auto px-7 py-4 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl text-sm transition-all shadow-xl shadow-teal-500/20 flex items-center justify-center gap-2 group"
              >
                <span>GET YOUR FREE AI AUTOMATION AUDIT</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('solutions')}
                className="w-full sm:w-auto px-7 py-4 bg-dark-900 hover:bg-slate-850 text-slate-200 border border-slate-800 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
              >
                <span>SEE WHAT WE BUILD</span>
                <ArrowDown className="w-4 h-4 text-teal-400" />
              </button>
            </div>

            {/* Trust Statement */}
            <div className="pt-2 text-xs font-mono text-slate-400 flex items-center justify-center lg:justify-start gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Built for businesses that want measurable automation — not another chatbot.</span>
            </div>
          </div>

          {/* Right Column: Animated System Workflow Diagram */}
          <div className="lg:col-span-5">
            <div className="bg-dark-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
                  <Activity className="w-3.5 h-3.5 text-teal-400" />
                  <span>FORGE ARCHITECTURE PIPELINE</span>
                </div>
                <span className="text-[10px] font-mono text-teal-400 px-2 py-0.5 bg-teal-500/10 border border-teal-500/20 rounded">
                  LIVE PIPELINE
                </span>
              </div>

              {/* Step Sequence Container */}
              <div className="space-y-2.5">
                {workflowSteps.map((step, idx) => {
                  const Icon = step.icon;
                  const isActive = activeStep === idx;
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                        isActive
                          ? 'bg-dark-950 border-teal-500/50 shadow-md shadow-teal-500/5'
                          : 'bg-dark-950/50 border-slate-850 opacity-70'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                          isActive ? 'bg-teal-500/15 text-teal-400' : 'bg-slate-800 text-slate-400'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className={`text-xs font-bold font-mono ${isActive ? 'text-white' : 'text-slate-300'}`}>
                            {step.label}
                          </div>
                          <div className="text-[11px] text-slate-400 font-sans truncate max-w-[200px] sm:max-w-[240px]">
                            {step.desc}
                          </div>
                        </div>
                      </div>

                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                        isActive ? 'bg-teal-500 text-dark-950' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {step.tag}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Pipeline Status Footer */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Latency: <strong className="text-teal-400">&lt; 45ms</strong></span>
                <span>Human Gating: <strong className="text-emerald-400">ENABLED</strong></span>
                <span>Zero-Data Retention: <strong className="text-white">ACTIVE</strong></span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
