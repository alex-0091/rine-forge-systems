import React, { useState, useEffect } from 'react';
import { 
  User, Bot, Cpu, Wrench, CheckCircle2, ArrowRight,
  Sparkles, Zap, MessageSquare, Database, ShieldCheck 
} from 'lucide-react';
import { AiStatusBadge } from './AiStatusBadge';

/**
 * RINE FORGE SYSTEMS — V4 WORKFLOW ANIMATION LANGUAGE
 * Reusable, lightweight visual pipeline illustrating active data packets
 * flowing between system nodes:
 * CUSTOMER → AI AGENT → BUSINESS LOGIC → TOOL/API → RESULT
 */
export function WorkflowPipelineVisual({
  activeStep = 1,
  autoProgress = true,
  intervalMs = 2800,
  title = "REAL-TIME AUTOMATION PIPELINE",
  subtitle = "Watch incoming requests travel from customer to confirmed result in seconds.",
  className = ""
}) {
  const [currentStep, setCurrentStep] = useState(activeStep);

  const nodes = [
    {
      id: 0,
      label: 'CUSTOMER',
      sublabel: 'WhatsApp / Call / Web',
      icon: User,
      color: 'teal',
      glow: 'shadow-teal-500/20',
      status: 'Inbound Message'
    },
    {
      id: 1,
      label: 'AI AGENT',
      sublabel: 'Understands Intent',
      icon: Bot,
      color: 'cyan',
      glow: 'shadow-cyan-500/20',
      status: 'Classified (High Intent)'
    },
    {
      id: 2,
      label: 'BUSINESS LOGIC',
      sublabel: 'Checks Policies & Calendar',
      icon: Cpu,
      color: 'indigo',
      glow: 'shadow-indigo-500/20',
      status: 'Policy Verified'
    },
    {
      id: 3,
      label: 'TOOLS & APIS',
      sublabel: 'Locks Slot & CRM Sync',
      icon: Wrench,
      color: 'violet',
      glow: 'shadow-violet-500/20',
      status: 'Webhook Executed'
    },
    {
      id: 4,
      label: 'RESULT',
      sublabel: 'Appointment Confirmed',
      icon: CheckCircle2,
      color: 'emerald',
      glow: 'shadow-emerald-500/20',
      status: 'Completed ✓'
    }
  ];

  // Auto-progress animation flow
  useEffect(() => {
    if (!autoProgress) return;
    const timer = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % nodes.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [autoProgress, intervalMs, nodes.length]);

  return (
    <div className={`rounded-3xl bg-[#090e1c] border-2 border-slate-800/80 p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden ${className}`}>
      
      {/* Background Subtle Ambient Flow */}
      <div className="absolute inset-0 bg-[radial-gradient(#06b6d408_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-24 bg-gradient-to-r from-teal-500/5 via-cyan-500/10 to-indigo-500/5 blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-teal-300 uppercase tracking-wider">
              {title}
            </span>
            <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 text-[10px] font-mono font-bold border border-teal-500/30">
              LIGHTWEIGHT EXECUTION
            </span>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            {subtitle}
          </p>
        </div>

        <AiStatusBadge 
          status={
            currentStep === 0 ? 'online' :
            currentStep === 1 ? 'analyzing' :
            currentStep === 2 ? 'checking' :
            currentStep === 3 ? 'action' : 'completed'
          }
          size="sm"
        />
      </div>

      {/* Pipeline Nodes Row */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-5 gap-3 sm:gap-2 items-center">
        {nodes.map((node, idx) => {
          const isCurrent = currentStep === idx;
          const isPassed = currentStep > idx;
          const Icon = node.icon;

          return (
            <React.Fragment key={node.id}>
              {/* Node Card */}
              <div 
                onClick={() => setCurrentStep(idx)}
                className={`
                  cursor-pointer p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center text-center space-y-2 relative select-none
                  ${isCurrent 
                    ? 'bg-[#0f172a] border-cyan-400 shadow-xl shadow-cyan-500/20 scale-105 z-20 ring-1 ring-cyan-400/50' 
                    : isPassed 
                      ? 'bg-[#090e1c] border-emerald-500/40 text-slate-300 opacity-90' 
                      : 'bg-[#060a14] border-slate-800/80 text-slate-500 hover:border-slate-700 opacity-60 hover:opacity-80'
                  }
                `}
              >
                {/* Status Dot / Check on top corner */}
                <div className="absolute top-2 right-2">
                  {isPassed ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                  )}
                </div>

                {/* Node Icon */}
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                  ${isCurrent 
                    ? 'bg-gradient-to-tr from-teal-500 to-cyan-400 text-slate-950 font-black shadow-lg shadow-cyan-500/30' 
                    : isPassed
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }
                `}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Node Title & Subtitle */}
                <div>
                  <h4 className="text-xs font-black font-mono tracking-wide text-white uppercase">
                    {node.label}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-sans mt-0.5 leading-tight">
                    {node.sublabel}
                  </p>
                </div>

                {/* Live Micro-Badge */}
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded border mt-1 ${
                  isCurrent 
                    ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300 font-bold'
                    : isPassed 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}>
                  {isCurrent ? node.status : isPassed ? 'Done ✓' : 'Queued'}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Progress Track at bottom */}
      <div className="relative z-10 w-full bg-slate-900/90 h-1.5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 transition-all duration-500 ease-out"
          style={{ width: `${((currentStep + 1) / nodes.length) * 100}%` }}
        />
      </div>

    </div>
  );
}
