import React, { useEffect } from 'react';
import { 
  X, MessageSquare, Zap, FileText, Mail, 
  Calendar, Workflow, ArrowRight, Sparkles 
} from 'lucide-react';

export function GlobalTryForgeModal({ isOpen, onClose, onSelectDemo }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const demoOptions = [
    {
      id: 'support-agent',
      title: 'Answer a Customer',
      desc: '24/7 zero-hallucination support agent answering from verified docs.',
      icon: MessageSquare,
      badge: 'SUPPORT AGENT',
      color: 'border-indigo-500/30 text-indigo-400 bg-indigo-950/20'
    },
    {
      id: 'lead-agent',
      title: 'Handle an Inbound Lead',
      desc: 'Sub-60s intent classification, ICP lead scoring, and routing.',
      icon: Zap,
      badge: 'LEAD ENGINE',
      color: 'border-teal-500/30 text-teal-400 bg-teal-950/20'
    },
    {
      id: 'document-processor',
      title: 'Process a Document',
      desc: 'Extract line items, validate math, and push to QuickBooks AP.',
      icon: FileText,
      badge: 'DOCUMENT ENGINE',
      color: 'border-cyan-500/30 text-cyan-400 bg-cyan-950/20'
    },
    {
      id: 'email-agent',
      title: 'Answer an Email',
      desc: 'Triage incoming inbox, generate draft replies, and 1-click approve.',
      icon: Mail,
      badge: 'EMAIL AGENT',
      color: 'border-emerald-500/30 text-emerald-400 bg-emerald-950/20'
    },
    {
      id: 'appointment-agent',
      title: 'Book an Appointment',
      desc: 'Check availability, lock calendar slot, and dispatch 2-way SMS.',
      icon: Calendar,
      badge: 'APPOINTMENT AGENT',
      color: 'border-amber-500/30 text-amber-400 bg-amber-950/20'
    },
    {
      id: 'app-builder',
      title: 'Build an AI System',
      desc: 'Visually configure triggers, models, RAG stores, and actions.',
      icon: Workflow,
      badge: 'SYSTEM BUILDER',
      color: 'border-purple-500/30 text-purple-400 bg-purple-950/20'
    }
  ];

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-sans animate-fadeIn"
    >
      <div className="w-full max-w-2xl bg-[#080d16] border border-teal-500/40 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-slate-100 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="space-y-0.5">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-teal-400 uppercase">
              <Sparkles className="w-3 h-3" /> PERSISTENT INTERACTIVE SANDBOX
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">What do you want to see?</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-dark-900 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {demoOptions.map((opt) => {
            const Icon = opt.icon;
            return (
              <div
                key={opt.id}
                onClick={() => {
                  onClose();
                  onSelectDemo(opt.id);
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all hover:scale-[1.02] flex items-start gap-3.5 ${opt.color} hover:border-teal-400`}
              >
                <div className="p-2.5 rounded-xl bg-dark-950/80 border border-slate-800 text-white shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-[10px] font-mono font-bold text-teal-300">{opt.badge}</div>
                  <div className="text-sm font-bold text-white">{opt.title}</div>
                  <p className="text-[11px] text-slate-400 font-sans leading-tight">{opt.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-slate-800/80 text-center text-xs text-slate-400 font-mono">
          Zero signup required for sandbox tests.
        </div>

      </div>
    </div>
  );
}
