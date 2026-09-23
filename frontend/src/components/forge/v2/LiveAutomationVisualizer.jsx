import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, Bot, BrainCircuit, Database, 
  Calendar, MessageSquare, ShieldCheck, UserCheck, 
  ArrowRight, CheckCircle2, Sparkles, ChevronRight, Zap, Play, Pause
} from 'lucide-react';
import { forgeAudioSynth } from '../../../utils/forgeAudioSynth';

export function LiveAutomationVisualizer({ onOpenAuditModal }) {
  const [activeNodeIndex, setActiveNodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const nodes = [
    {
      id: 'call',
      label: 'CALL',
      icon: PhoneCall,
      headline: 'Inbound Phone Call Received',
      detail: 'Customer dials your business number. The SIP trunk routes the audio stream directly to the neural voice gateway within 120ms with zero hold time.',
      payload: {
        'Caller Number': '+1 (512) 555-0182',
        'Routing Gateway': 'Twilio Voice / WebRTC',
        'Pickup Status': 'Answered on 1st Ring',
        'Audio Stream': 'Encrypted TLS 1.3'
      }
    },
    {
      id: 'ai',
      label: 'AI',
      icon: Bot,
      headline: 'Neural Voice AI Responds',
      detail: 'The AI answers using your approved greeting and clinic/firm guidelines. It handles questions about services, hours, locations, and procedures.',
      payload: {
        'Voice Model': 'Elena (Front Desk Specialist)',
        'Speech Latency': '240ms Turnaround',
        'Grounding': 'Clinic Approved Knowledge Base',
        'Guardrails': 'Deterministic Safety Filters'
      }
    },
    {
      id: 'qualify',
      label: 'QUALIFY',
      icon: BrainCircuit,
      headline: 'Intent Recognition & Triage',
      detail: 'The system categorizes the call: appointment request vs. general FAQ vs. emergency. It extracts caller name, service desired, and timing preferences.',
      payload: {
        'Detected Intent': 'Emergency Dental Consultation',
        'Severity Level': 'Urgent (Lower Molar Pain)',
        'Extracted Name': 'Sarah Johnson',
        'Confidence': '99.4% intent match'
      }
    },
    {
      id: 'crm',
      label: 'CRM',
      icon: Database,
      headline: 'Lead Profile Synchronized',
      detail: 'Lead information is automatically added to your CRM (HubSpot, GoHighLevel, Dentrix, or Salesforce) with contact tags and full call transcript.',
      payload: {
        'Destination': 'GoHighLevel / HubSpot CRM',
        'Contact Status': 'Active Pipeline Opportunity',
        'Pipeline Stage': 'Consultation Scheduled',
        'Lead Value': '$1,200 Potential Case'
      }
    },
    {
      id: 'calendar',
      label: 'CALENDAR',
      icon: Calendar,
      headline: 'Calendar Slot Reserved',
      detail: 'Two-way calendar sync checks live practitioner availability in real time, reserves the exact 45-minute window, and locks it to avoid double-bookings.',
      payload: {
        'Calendar': 'Google Calendar / Cal.com',
        'Slot Booked': 'Thursday, Oct 30 · 11:00 AM',
        'Doctor Assigned': 'Dr. Scott Miller, DDS',
        'Room': 'Operatory 2'
      }
    },
    {
      id: 'sms',
      label: 'SMS',
      icon: MessageSquare,
      headline: 'Customer SMS Confirmation Sent',
      detail: 'A personalized text message is dispatched immediately with calendar invite, directions, and a link to complete pre-visit digital intake forms.',
      payload: {
        'Recipient': '+1 (512) 555-0182',
        'SMS Content': '"Hi Sarah, you are confirmed for Thu 11:00 AM. Tap here to complete your intake form."',
        'Delivery Time': '0.9 seconds post-call',
        'Intake Link': 'Encrypted Portal URL'
      }
    },
    {
      id: 'owner',
      label: 'OWNER',
      icon: UserCheck,
      headline: 'Business Alert Dispatched',
      detail: 'Your front desk and manager receive an instant Slack, SMS, and email summary with audio recording and caller notes. You remain in complete control.',
      payload: {
        'Channels': 'SMS + Email + Slack Alert',
        'Recipients': 'Office Manager & Lead Doctor',
        'Summary': 'Urgent tooth pain booked for Thu 11 AM',
        'Human Action': 'No manual entry needed'
      }
    }
  ];

  // Auto-cycle through nodes
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveNodeIndex((prev) => (prev + 1) % nodes.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying, nodes.length]);

  const currentNode = nodes[activeNodeIndex];

  return (
    <section id="automation-visualizer" className="py-20 sm:py-28 bg-[#080c14] border-b border-white/[0.08] relative">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-mono font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span>Interactive Workflow Engine</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Live Automation Visualizer
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Click on any node in the graph below to inspect exactly what happens inside our automated execution layer as a call passes through.
          </p>
        </div>

        {/* Visual Graph Pipeline */}
        <div className="max-w-5xl mx-auto bg-[#0c101a] border border-white/[0.1] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl space-y-8">
          
          {/* Node Track Header with Controls */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white font-bold">SEQUENTIAL EXECUTION PIPELINE</span>
            </div>

            <button
              onClick={() => {
                forgeAudioSynth.playClick();
                setIsPlaying(!isPlaying);
              }}
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-indigo-400" /> : <Play className="w-3.5 h-3.5 text-indigo-400" />}
              <span>{isPlaying ? 'Pause Auto-Run' : 'Resume Auto-Run'}</span>
            </button>
          </div>

          {/* Connected Graph Nodes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-2 relative">
            {nodes.map((node, index) => {
              const Icon = node.icon;
              const isActive = index === activeNodeIndex;
              const isPast = index < activeNodeIndex;

              return (
                <button
                  key={node.id}
                  onClick={() => {
                    forgeAudioSynth.playClick();
                    setActiveNodeIndex(index);
                    setIsPlaying(false);
                  }}
                  className={`p-3.5 sm:p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-2 relative group ${
                    isActive
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-[0_0_25px_rgba(99,102,241,0.5)] scale-105 z-10'
                      : isPast
                      ? 'bg-indigo-950/30 text-indigo-300 border-indigo-500/30 hover:border-indigo-400'
                      : 'bg-white/[0.02] text-slate-400 border-white/[0.08] hover:border-white/[0.16] hover:text-white'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isActive ? 'bg-white text-indigo-600' : 'bg-white/[0.04]'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <span className="text-xs font-mono font-bold tracking-wider">
                    {node.label}
                  </span>

                  {/* Node sequence number */}
                  <span className={`text-[9px] font-mono ${isActive ? 'text-indigo-200' : 'text-slate-500'}`}>
                    0{index + 1}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detailed Node Inspector Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4 border-t border-white/[0.08]">
            
            {/* Left: What Happened Explanation (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 font-bold uppercase border border-indigo-500/30">
                  NODE 0{activeNodeIndex + 1} INSPECTOR
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> EXECUTED
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white tracking-tight">
                {currentNode.headline}
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                {currentNode.detail}
              </p>

              <div className="pt-2">
                <button
                  onClick={() => {
                    forgeAudioSynth.playClick();
                    setActiveNodeIndex((prev) => (prev + 1) % nodes.length);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <span>Step to next node</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right: Concrete Production Payload (6 cols) */}
            <div className="lg:col-span-6 bg-[#080b11] border border-white/[0.08] rounded-2xl p-5 space-y-3 font-mono text-xs shadow-inner">
              <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-white/[0.06] pb-2 font-bold">
                <span>SYSTEM PAYLOAD TELEMETRY</span>
                <span className="text-emerald-400">STATUS: 200 OK</span>
              </div>

              <div className="space-y-2 pt-1">
                {Object.entries(currentNode.payload).map(([k, v], idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] gap-1">
                    <span className="text-[10px] text-indigo-300 uppercase">{k}:</span>
                    <span className="text-slate-100 font-sans font-medium text-xs text-right">{v}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom Conversion Prompt */}
          <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div>
              <span>Every single step is deterministic, auditable, and backed by human approval gates.</span>
            </div>
            <button
              onClick={() => {
                forgeAudioSynth.playClick();
                if (onOpenAuditModal) onOpenAuditModal();
              }}
              className="inline-flex items-center gap-2 font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <span>Audit your business workflow</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
