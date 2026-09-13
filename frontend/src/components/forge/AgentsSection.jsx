import React, { useState } from 'react';
import { 
  Bot, ArrowRight, CheckCircle2, ShieldCheck, 
  Terminal, Eye, UserCheck, Zap, Activity 
} from 'lucide-react';
import { FORGE_AGENTS } from '../../data/siteData';
import { WorkflowModal } from './WorkflowModal';

export function AgentsSection({ onNavigate }) {
  const [activeModalAgent, setActiveModalAgent] = useState(null);

  return (
    <section id="agents" className="py-16 sm:py-24 border-b border-slate-800/80 bg-[#080c14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="text-xs font-mono font-bold text-teal-400 tracking-widest uppercase">
            AUTONOMOUS WORKFORCE
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            MEET THE SYSTEMS THAT WORK WHILE YOUR TEAM DOESN'T HAVE TO.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Deterministic, policy-governed AI agents engineered to execute repetitive tasks with continuous reliability and strict human-in-the-loop checkpoints.
          </p>
        </div>

        {/* 6 Agent Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FORGE_AGENTS.map((agent) => (
            <div
              key={agent.id}
              className="bg-dark-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 sm:p-7 space-y-5 transition-all flex flex-col justify-between shadow-xl group"
            >
              <div className="space-y-4">
                {/* Agent Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/25 flex items-center justify-center text-teal-400 font-mono font-bold">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                        {agent.name}
                      </h3>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 bg-dark-950 text-teal-400 border border-slate-800 rounded font-bold">
                    {agent.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {agent.role}
                </p>

                {/* Structured Step Flow */}
                <div className="space-y-2 pt-2 text-[11px] font-mono">
                  {/* Input */}
                  <div className="p-2.5 bg-dark-950 rounded-lg border border-slate-850">
                    <span className="text-slate-400 font-bold block text-[9px] uppercase">INPUT:</span>
                    <span className="text-slate-300">{agent.input}</span>
                  </div>

                  {/* AI Decision */}
                  <div className="p-2.5 bg-dark-950 rounded-lg border border-teal-500/20">
                    <span className="text-teal-400 font-bold block text-[9px] uppercase">↓ AI DECISION:</span>
                    <span className="text-slate-200">{agent.aiDecision}</span>
                  </div>

                  {/* Action */}
                  <div className="p-2.5 bg-dark-950 rounded-lg border border-slate-850">
                    <span className="text-emerald-400 font-bold block text-[9px] uppercase">↓ ACTION:</span>
                    <span className="text-slate-300">{agent.action}</span>
                  </div>

                  {/* Human Oversight */}
                  <div className="p-2.5 bg-indigo-950/20 rounded-lg border border-indigo-500/20">
                    <span className="text-indigo-400 font-bold block text-[9px] uppercase">↓ HUMAN OVERSIGHT:</span>
                    <span className="text-slate-400">{agent.oversight}</span>
                  </div>
                </div>
              </div>

              {/* View Workflow Action Button */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => setActiveModalAgent(agent)}
                  className="text-xs font-mono font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Full Architecture Flow</span>
                </button>
                <span className="text-[10px] font-mono text-slate-400">SOC-2 Aligned</span>
              </div>
            </div>
          ))}
        </div>

        {/* Workflow Modal */}
        {activeModalAgent && (
          <WorkflowModal
            agent={activeModalAgent}
            onClose={() => setActiveModalAgent(null)}
            onNavigateAudit={() => onNavigate('audit')}
          />
        )}

      </div>
    </section>
  );
}
