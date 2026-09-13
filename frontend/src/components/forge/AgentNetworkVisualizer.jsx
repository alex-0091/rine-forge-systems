import React, { useState } from 'react';
import { 
  Network, ArrowRight, Bot, Zap, Database, 
  MessageSquare, Calendar, FileText, BarChart3, 
  ShieldCheck, Sparkles, CheckCircle2 
} from 'lucide-react';

const NETWORK_NODES = [
  {
    id: 'customer',
    name: 'Customer / Inbound Event',
    role: 'Trigger Ingest',
    icon: Sparkles,
    desc: 'Phone call, website form, email, or portal webhook initiates event stream.',
    color: 'border-slate-600 bg-slate-900 text-white'
  },
  {
    id: 'receptionist',
    name: '24/7 AI Receptionist',
    role: 'Voice & Intent Triage',
    icon: Bot,
    desc: 'Transcribes audio in real-time, categorizes inquiry, and verifies urgency.',
    color: 'border-teal-500/50 bg-teal-950/40 text-teal-300'
  },
  {
    id: 'lead-agent',
    name: 'Lead Qualification Agent',
    role: 'Scoring & Enrichment',
    icon: Zap,
    desc: 'Evaluates budget, authority, and needs; matches ICP scoring matrix.',
    color: 'border-cyan-500/50 bg-cyan-950/40 text-cyan-300'
  },
  {
    id: 'support-agent',
    name: 'Support & Knowledge Agent',
    role: 'Deterministic RAG',
    icon: MessageSquare,
    desc: 'Answers verified technical FAQs strictly from approved company documentation.',
    color: 'border-indigo-500/50 bg-indigo-950/40 text-indigo-300'
  },
  {
    id: 'crm',
    name: 'Central CRM & Data Lake',
    role: 'HubSpot / Salesforce / PostgreSQL',
    icon: Database,
    desc: 'Commits enriched contacts, creates deal records, and logs transcripts.',
    color: 'border-purple-500/50 bg-purple-950/40 text-purple-300'
  },
  {
    id: 'sales-agent',
    name: 'Outreach & Scheduling Agent',
    role: 'Calendar Lock & Follow-Up',
    icon: Calendar,
    desc: 'Dispatches 2-way SMS/email with interactive calendar tour reservation.',
    color: 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300'
  },
  {
    id: 'operations-agent',
    name: 'Operations & Document Agent',
    role: 'Fulfillment & ERP Sync',
    icon: FileText,
    desc: 'Parses contracts, validates POs, updates QuickBooks, and alerts technicians.',
    color: 'border-amber-500/50 bg-amber-950/40 text-amber-300'
  },
  {
    id: 'reporting-agent',
    name: 'Executive Reporting Agent',
    role: 'Daily Telemetry & ROI Brief',
    icon: BarChart3,
    desc: 'Compiles cross-system metrics into concise weekly executive digests.',
    color: 'border-rose-500/50 bg-rose-950/40 text-rose-300'
  }
];

export function AgentNetworkVisualizer({ onNavigate }) {
  const [selectedNodeId, setSelectedNodeId] = useState('lead-agent');
  const selectedNode = NETWORK_NODES.find(n => n.id === selectedNodeId) || NETWORK_NODES[2];

  return (
    <section className="py-24 border-t border-slate-800 bg-[#070b13] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono font-bold tracking-wider uppercase">
            <Network className="w-3.5 h-3.5" /> ONE CONNECTED SYSTEM • NOT ISOLATED CHATBOTS
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            The Autonomous Multi-Agent Network
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            FORGE systems don't operate in silos. They share context, pass enriched data, and coordinate actions across your entire tech stack as a unified operating system.
          </p>
        </div>

        {/* Visual Network Topology Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          {NETWORK_NODES.map((node, idx) => {
            const isSelected = selectedNodeId === node.id;
            const Icon = node.icon;
            return (
              <div
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'border-teal-400 bg-[#0d1626] shadow-xl shadow-teal-500/15 scale-[1.02]'
                    : `${node.color} hover:border-slate-500`
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <span className="text-[10px] text-teal-400 font-bold">NODE 0{idx + 1}</span>
                  <Icon className="w-4 h-4 text-teal-300" />
                </div>

                <div className="pt-3 space-y-1">
                  <div className="text-sm font-bold text-white tracking-tight">{node.name}</div>
                  <div className="text-[10px] text-teal-400 font-medium">{node.role}</div>
                  <p className="text-[11px] text-slate-400 pt-1 leading-snug font-sans">{node.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Node Deep Dive & Data Pipeline Banner */}
        <div className="p-8 rounded-3xl bg-[#090e18] border border-teal-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Multi-Agent Context Protocol
            </div>
            <h3 className="text-xl font-bold text-white">
              Selected: {selectedNode.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {selectedNode.desc} Data generated here is instantly vectorized and passed to downstream CRM, calendar, and operational agents with zero human re-entry.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate && onNavigate('experience')}
              className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl text-xs font-mono transition-all shadow-md flex items-center gap-2"
            >
              <span>Simulate Your Agent Network</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
