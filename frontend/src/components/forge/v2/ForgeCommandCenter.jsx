import React, { useState } from 'react';
import { 
  PhoneCall, Zap, FileText, Mail, Calendar, Brain, 
  Sparkles, CheckCircle2, ArrowRight, Play, RotateCcw, 
  Check, Volume2, VolumeX, ShieldCheck, Search, Clock, 
  Smartphone, MessageSquare, Database, ArrowUpRight, HandMetal,
  Code2, Terminal, Download, Send, CheckCheck, RefreshCw, HelpCircle
} from 'lucide-react';
import { speechEngine } from '../../../utils/speechEngine';
import { forgeAudioSynth } from '../../../utils/forgeAudioSynth';
import { 
  ReceptionistCharacter, 
  LeadEngineCharacter, 
  SupportCharacter, 
  DocumentCharacter, 
  EmailCharacter, 
  AppointmentCharacter 
} from './ForgeCharacterUniverse';

export const COMMAND_OPTIONS = [
  {
    id: 'answer-customers',
    sysId: 'receptionist-agent',
    title: '📞 Answer Customers',
    subtitle: '24/7 Voice & Web Telephony NLP',
    color: 'border-cyan-400 bg-cyan-950/30 text-cyan-300 hover:border-cyan-300',
    tagColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    buttonColor: 'bg-cyan-500 text-dark-950 hover:bg-cyan-400',
    character: ReceptionistCharacter,
    outcome: 'Stop losing customers because nobody answered.'
  },
  {
    id: 'capture-leads',
    sysId: 'lead-agent',
    title: '🎯 Capture Leads',
    subtitle: 'Sub-45s Webhook to 2-Way SMS',
    color: 'border-violet-400 bg-violet-950/30 text-violet-300 hover:border-violet-300',
    tagColor: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
    buttonColor: 'bg-violet-500 text-white hover:bg-violet-400',
    character: LeadEngineCharacter,
    outcome: 'Respond while the lead is still interested.'
  },
  {
    id: 'customer-support',
    sysId: 'support-agent',
    title: '🔷 Answer Support',
    subtitle: 'Zero-Hallucination Grounded RAG',
    color: 'border-blue-400 bg-blue-950/30 text-blue-300 hover:border-blue-300',
    tagColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    buttonColor: 'bg-blue-500 text-white hover:bg-blue-400',
    character: SupportCharacter,
    outcome: 'Answer customers without making them wait.'
  },
  {
    id: 'process-documents',
    sysId: 'document-processor',
    title: '📄 Process Documents',
    subtitle: 'Laser Optical OCR & ERP Sync',
    color: 'border-orange-400 bg-orange-950/30 text-orange-300 hover:border-orange-300',
    tagColor: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    buttonColor: 'bg-orange-500 text-dark-950 hover:bg-orange-400',
    character: DocumentCharacter,
    outcome: 'Turn paperwork into structured work automatically.'
  },
  {
    id: 'handle-email',
    sysId: 'email-agent',
    title: '📩 Handle Email',
    subtitle: 'Autonomous Inbox Classification & Drafts',
    color: 'border-pink-400 bg-pink-950/30 text-pink-300 hover:border-pink-300',
    tagColor: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
    buttonColor: 'bg-pink-500 text-white hover:bg-pink-400',
    character: EmailCharacter,
    outcome: 'Turn your inbox into completed actions.'
  },
  {
    id: 'book-appointments',
    sysId: 'appointment-agent',
    title: '📅 Book Appointments',
    subtitle: 'Multi-Calendar Conflict Resolver',
    color: 'border-emerald-400 bg-emerald-950/30 text-emerald-300 hover:border-emerald-300',
    tagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    buttonColor: 'bg-emerald-500 text-dark-950 hover:bg-emerald-400',
    character: AppointmentCharacter,
    outcome: 'Turn conversations into booked appointments.'
  }
];

export function ForgeCommandCenter({ onNavigate, onLaunchSandbox, onWatchDemo }) {
  const [activeTabId, setActiveTabId] = useState('answer-customers');
  const [viewMode, setViewMode] = useState('interactive'); // 'interactive' | 'json'
  
  // Interactive Simulation States
  const [receptionistCallerQuery, setReceptionistCallerQuery] = useState('emergency');
  const [dialpadNumber, setDialpadNumber] = useState('555-0199');
  const [leadBudget, setLeadBudget] = useState(1400000);
  const [leadScore, setLeadScore] = useState(96);
  const [supportQuery, setSupportQuery] = useState('sla'); // 'sla' | 'refund' | 'security'
  const [emailStatus, setEmailStatus] = useState('draft_ready'); // 'draft_ready' | 'sent'
  const [appointmentConfirmed, setAppointmentConfirmed] = useState(true);

  const activeOption = COMMAND_OPTIONS.find(o => o.id === activeTabId) || COMMAND_OPTIONS[0];
  const CharacterComp = activeOption.character;

  const getActivePayloadJson = () => {
    switch (activeTabId) {
      case 'answer-customers':
        return JSON.stringify({
          agent: 'AI_RECEPTIONIST_V3',
          session_id: 'call_live_' + Date.now().toString().slice(-6),
          caller: { phone: dialpadNumber, query: receptionistCallerQuery },
          intent: receptionistCallerQuery === 'emergency' ? 'EMERGENCY_DENTAL_TRIAGE' : 'APPOINTMENT_BOOKING',
          insurance_verified: 'Delta Dental PPO (In-Network)',
          operatory_assigned: 'Operatory 2 (Dr. Evans)',
          latency_ms: 18,
          status: 'CONFIRMED_200_OK'
        }, null, 2);
      case 'capture-leads':
        return JSON.stringify({
          agent: 'SPEED_TO_LEAD_V3',
          lead_id: 'lead_crm_' + Date.now().toString().slice(-6),
          budget_usd: leadBudget,
          icp_fit_score: leadScore + '/100',
          auto_actions: [
            'Webhook Ingest: 12ms',
            'ICP Scoring: 18ms',
            'Twilio 2-Way SMS Dispatched: 420ms'
          ],
          sms_delivered: true
        }, null, 2);
      case 'customer-support':
        return JSON.stringify({
          agent: 'SUPPORT_KNOWLEDGE_RAG_V3',
          query: supportQuery === 'sla' ? 'Section 14 SLA early-termination penalty' : 'Security SOC2 compliance bounds',
          rag_source: 'Master_Service_Agreement_2025.pdf',
          citation: 'Page 42, Paragraph 3b',
          hallucination_score: 0.00,
          latency_ms: 12,
          answer: 'Early termination fee is capped at 1.5x monthly retainer within the first 60 days.'
        }, null, 2);
      case 'process-documents':
        return JSON.stringify({
          agent: 'QUANTUM_OCR_V3',
          document_id: 'inv_88491.pdf',
          vendor: 'Apex Hardware Logistics',
          extracted_items: 14,
          total_usd: 4290.00,
          checksum_verification: 'PASS_ZERO_VARIANCE',
          erp_target: 'QuickBooks AP',
          sync_status: 'COMMITTED'
        }, null, 2);
      case 'handle-email':
        return JSON.stringify({
          agent: 'INBOX_INTELLIGENCE_V3',
          inbox_unprocessed: 312,
          buckets: { hot_leads: 18, vendor_invoices: 7, support_vip: 4 },
          draft_prepared: true,
          human_review_required: true,
          status: emailStatus === 'sent' ? 'DISPATCHED_TO_CLIENT' : 'AWAITING_1_CLICK_APPROVAL'
        }, null, 2);
      case 'book-appointments':
        return JSON.stringify({
          agent: 'CALENDAR_SYNCHRONIZER_V3',
          calendars_scanned: ['Google Calendar', 'Dentrix PMS', 'Apple Cal'],
          conflicts_found: 0,
          locked_slot: 'Saturday 11:00 AM - 12:00 PM EST',
          meet_link_generated: 'https://meet.google.com/frg-live-892',
          sms_reminder_scheduled: true
        }, null, 2);
      default:
        return JSON.stringify({
          agent: 'FORGE_CORE_ORCHESTRATOR',
          status: 'ALL_SYSTEMS_NOMINAL',
          telemetry: 'LATENCY_14MS_ZERO_HALLUCINATION'
        }, null, 2);
    }
  };

  return (
    <section className="py-20 sm:py-28 border-b border-slate-800/80 bg-[#060a14] relative" id="command-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold tracking-wider uppercase shadow-md">
            <HandMetal className="w-3.5 h-3.5 text-teal-400" /> TOUCH & EXPERIENCE FORGE LIVE
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            WHAT DO YOU WANT <br />
            <span className="text-teal-400">FORGE TO DO?</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Touch any operational capability below to launch an instant live interactive simulation right in your browser.
          </p>
        </div>

        {/* 6 Large Animated Option Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {COMMAND_OPTIONS.map((opt) => {
            const isSelected = activeTabId === opt.id;
            const Character = opt.character;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  forgeAudioSynth.playClick();
                  setActiveTabId(opt.id);
                }}
                className={`p-6 rounded-3xl border-2 text-left transition-all relative overflow-hidden group flex flex-col justify-between min-h-[170px] ${
                  isSelected
                    ? `${opt.color} shadow-2xl scale-[1.02] font-black`
                    : 'bg-[#090e1a] border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-bold ${opt.tagColor}`}>
                      ACTIVE SIMULATOR
                    </span>
                    <Character size="sm" />
                  </div>

                  <div>
                    <h3 className="text-base font-black text-white group-hover:text-teal-300 transition-colors">
                      {opt.title}
                    </h3>
                    <p className="text-xs text-slate-400 pt-0.5">
                      {opt.subtitle}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-300 font-bold truncate pr-2">
                    {opt.outcome}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-teal-400 shrink-0 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>

        {/* 🌟 THE ACTIVE LIVE SIMULATION WORKSPACE */}
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-[#0b1426] to-[#070c16] border-2 border-teal-500/40 shadow-2xl space-y-6 relative overflow-hidden font-mono text-xs">
          
          {/* Top Bar of Active Simulation */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <div>
                <span className="text-white font-bold text-sm font-sans flex items-center gap-2">
                  <span>FORGE Simulation: {activeOption.title}</span>
                </span>
                <div className="text-[11px] text-teal-300 font-mono">{activeOption.outcome}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex rounded-lg bg-dark-950 p-0.5 border border-slate-800">
                <button
                  onClick={() => {
                    forgeAudioSynth.playClick();
                    setViewMode('interactive');
                  }}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold ${
                    viewMode === 'interactive' ? 'bg-slate-800 text-teal-300' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Interactive UI
                </button>
                <button
                  onClick={() => {
                    forgeAudioSynth.playClick();
                    setViewMode('json');
                  }}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 ${
                    viewMode === 'json' ? 'bg-slate-800 text-teal-300' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Code2 className="w-3 h-3" />
                  <span>JSON Payload</span>
                </button>
              </div>

              {onLaunchSandbox && (
                <button
                  onClick={() => {
                    forgeAudioSynth.playSuccess();
                    onLaunchSandbox(activeOption.sysId);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-md ${activeOption.buttonColor}`}
                >
                  <span>DEEP SANDBOX</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {viewMode === 'json' ? (
            <div className="rounded-2xl bg-[#030712] border-2 border-slate-800 p-6 font-mono text-xs text-emerald-400 overflow-x-auto shadow-inner">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400 mb-3">
                <span className="text-teal-400 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" /> HTTP 200 / FORGE AUTONOMOUS DISPATCH
                </span>
                <span>LATENCY: 14ms</span>
              </div>
              <pre>{getActivePayloadJson()}</pre>
            </div>
          ) : (
            <>
              {/* SIMULATION 1: 📞 ANSWER CUSTOMERS (CYAN) */}
              {activeTabId === 'answer-customers' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-dark-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-slate-300">
                      <span className="font-bold text-white">Simulate Inbound Customer Request:</span> Choose what the caller asks:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          forgeAudioSynth.playPhoneRing();
                          setReceptionistCallerQuery('emergency');
                          speechEngine.speak('Emergency root canal tomorrow at 11 AM. Do you accept Delta Dental?', { accent: 'en-US' });
                        }}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                          receptionistCallerQuery === 'emergency' ? 'bg-cyan-500 text-dark-950 border-cyan-300' : 'bg-slate-900 text-slate-300 border-slate-800'
                        }`}
                      >
                        🚨 "Emergency Root Canal"
                      </button>
                      <button
                        onClick={() => {
                          forgeAudioSynth.playPhoneRing();
                          setReceptionistCallerQuery('price');
                          speechEngine.speak('How much does standard tooth whitening cost?', { accent: 'en-US' });
                        }}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                          receptionistCallerQuery === 'price' ? 'bg-cyan-500 text-dark-950 border-cyan-300' : 'bg-slate-900 text-slate-300 border-slate-800'
                        }`}
                      >
                        💰 "Pricing Schedule"
                      </button>
                      <button
                        onClick={() => {
                          forgeAudioSynth.playPhoneRing();
                          setReceptionistCallerQuery('book');
                          speechEngine.speak('I would like to book a routine cleaning for Saturday morning.', { accent: 'en-US' });
                        }}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                          receptionistCallerQuery === 'book' ? 'bg-cyan-500 text-dark-950 border-cyan-300' : 'bg-slate-900 text-slate-300 border-slate-800'
                        }`}
                      >
                        📅 "Routine Cleaning"
                      </button>
                    </div>
                  </div>

                  {/* Simulation Result Card */}
                  <div className="p-6 rounded-2xl bg-[#09101e] border-2 border-cyan-400/60 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-3 text-center space-y-2">
                      <ReceptionistCharacter size="md" />
                      <div className="text-xs font-bold text-white">FORGE Receptionist</div>
                      <div className="text-[10px] text-cyan-300 font-bold">Latency: 18ms</div>
                    </div>

                    <div className="md:col-span-9 space-y-3 font-sans">
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-1 font-mono">
                        <div className="text-cyan-400 font-bold">🧠 FORGE REAL-TIME EVALUATION:</div>
                        <div>• Intent: {receptionistCallerQuery === 'emergency' ? 'EMERGENCY_DENTAL_TRIAGE (Delta Dental PPO)' : receptionistCallerQuery === 'price' ? 'PRICING_INQUIRY ($299 Standard Fee Schedule)' : 'APPOINTMENT_BOOKING (Routine Cleaning)'}</div>
                        <div>• Verified Policy: Operatory 2 Reserved, Dr. Evans Saturday 11:00 AM</div>
                        <div className="text-emerald-400 font-bold">• Action: Confirmed with caller & SMS dispatched in 18s.</div>
                      </div>
                      <div className="text-xs text-white font-medium bg-cyan-950/40 p-3 rounded-xl border border-cyan-500/30">
                        💬 AI Spoken Reply: "Dr. Evans has an emergency opening this Saturday at 11:00 AM. We accept Delta Dental PPO. I have reserved Operatory 2 and dispatched a confirmation SMS."
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SIMULATION 2: 🎯 CAPTURE LEADS (VIOLET) */}
              {activeTabId === 'capture-leads' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-dark-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="font-bold text-white">Simulate Buyer Budget Slider:</div>
                      <div className="text-xs text-slate-400">Drag to test real-time ICP scoring algorithm:</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={200000}
                        max={2500000}
                        step={100000}
                        value={leadBudget}
                        onChange={(e) => {
                          forgeAudioSynth.playClick();
                          const val = Number(e.target.value);
                          setLeadBudget(val);
                          setLeadScore(val > 1000000 ? 96 : val > 500000 ? 82 : 65);
                        }}
                        className="w-48 accent-violet-400 cursor-pointer"
                      />
                      <span className="font-bold text-violet-300 font-mono">${(leadBudget / 1000000).toFixed(1)}M Budget</span>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#140b24] border-2 border-violet-400/60 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-3 text-center space-y-2">
                      <LeadEngineCharacter size="md" />
                      <div className="text-xs font-bold text-white">FORGE Lead Engine</div>
                      <div className="text-[10px] text-violet-300 font-bold">Speed: 42s Total</div>
                    </div>

                    <div className="md:col-span-9 space-y-3 font-sans">
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-1 font-mono">
                        <div className="text-violet-400 font-bold">🎯 ICP RADAR CALCULATION:</div>
                        <div>• Inbound Asset: Commercial Portfolio (${(leadBudget / 1000000).toFixed(1)}M)</div>
                        <div>• Calculated Score: <span className="text-emerald-400 font-bold">{leadScore}/100 ICP FIT</span></div>
                        <div className="text-emerald-400 font-bold">• Trigger: Automated 2-Way SMS Fired via Twilio in 800ms.</div>
                      </div>
                      <div className="text-xs text-white font-medium bg-violet-950/40 p-3 rounded-xl border border-violet-500/30 flex items-center justify-between">
                        <span>📱 2-Way SMS Sent to Buyer: "Hi Alex, saw your inquiry for the ${(leadBudget/1000000).toFixed(1)}M property. Are you looking to tour this Saturday at 11 AM?"</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500 text-dark-950 font-bold text-[10px] shrink-0 font-mono">DELIVERED</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SIMULATION 3: 🔷 ANSWER SUPPORT (BLUE) */}
              {activeTabId === 'customer-support' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-dark-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-slate-300">
                      <span className="font-bold text-white">Simulate Knowledge Base Query:</span> Choose inquiry:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          forgeAudioSynth.playClick();
                          setSupportQuery('sla');
                          speechEngine.speak('Section 14 SLA early termination fee is capped at 1.5 times monthly retainer.', { accent: 'en-US' });
                        }}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                          supportQuery === 'sla' ? 'bg-blue-500 text-white border-blue-300' : 'bg-slate-900 text-slate-300 border-slate-800'
                        }`}
                      >
                        📄 SLA Termination Clause
                      </button>
                      <button
                        onClick={() => {
                          forgeAudioSynth.playClick();
                          setSupportQuery('security');
                          speechEngine.speak('FORGE enterprise systems are strictly SOC2 Type II compliant with zero data retention for model training.', { accent: 'en-US' });
                        }}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                          supportQuery === 'security' ? 'bg-blue-500 text-white border-blue-300' : 'bg-slate-900 text-slate-300 border-slate-800'
                        }`}
                      >
                        🔒 SOC2 Security Bounds
                      </button>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#09152a] border-2 border-blue-400/60 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-3 text-center space-y-2">
                      <SupportCharacter size="md" />
                      <div className="text-xs font-bold text-white">FORGE Support RAG</div>
                      <div className="text-[10px] text-blue-300 font-bold">Vector RAG Search</div>
                    </div>

                    <div className="md:col-span-9 space-y-3 font-sans">
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-1 font-mono">
                        <div className="text-blue-400 font-bold">🧠 ZERO-HALLUCINATION KNOWLEDGE CITATION:</div>
                        <div>• Indexed Source: Master_Service_Agreement_2025.pdf (Page 42, Para 3)</div>
                        <div>• Hallucination Score: <span className="text-emerald-400 font-bold">0.00% (Strictly Grounded)</span></div>
                        <div className="text-emerald-400 font-bold">• Query Response Time: 12ms</div>
                      </div>
                      <div className="text-xs text-white font-medium bg-blue-950/40 p-3 rounded-xl border border-blue-500/30">
                        💬 Grounded AI Answer: {supportQuery === 'sla' 
                          ? '"According to Section 14.2 of your Master Agreement, early termination fees are capped at 1.5x monthly retainer within the first 60 days of onboarding."' 
                          : '"All client data is encrypted via AES-256 in transit and at rest with dedicated tenant isolation and strict zero-model-training policy."'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SIMULATION 4: 📄 PROCESS DOCUMENTS (ORANGE) */}
              {activeTabId === 'process-documents' && (
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-[#1e1008] border-2 border-orange-400/60 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-3 text-center space-y-2">
                      <DocumentCharacter size="md" />
                      <div className="text-xs font-bold text-white">FORGE Document OCR</div>
                      <div className="text-[10px] text-orange-300 font-bold">Laser OCR Scanner</div>
                    </div>

                    <div className="md:col-span-9 space-y-3 font-sans">
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-1 font-mono">
                        <div className="text-orange-400 font-bold">📄 INVOICE EXTRACTION BREAKDOWN:</div>
                        <div>• Vendor: Apex Hardware Logistics (PO #88491)</div>
                        <div>• Line Items: 14 Hardware Units extracted with 100% OCR confidence</div>
                        <div>• Mathematical Tax Checksum: $4,290.00 (100% Balanced)</div>
                        <div className="text-emerald-400 font-bold">• Synced to QuickBooks AP: Committed in 850ms ($0 Human Errors).</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SIMULATION 5: 📩 HANDLE EMAIL (PINK) */}
              {activeTabId === 'handle-email' && (
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-[#1e0816] border-2 border-pink-400/60 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-3 text-center space-y-2">
                      <EmailCharacter size="md" />
                      <div className="text-xs font-bold text-white">FORGE Email Agent</div>
                      <div className="text-[10px] text-pink-300 font-bold">Zero-Inbox Triage</div>
                    </div>

                    <div className="md:col-span-9 space-y-3 font-sans">
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-1 font-mono">
                        <div className="text-pink-400 font-bold">📩 INBOX TRIAGE COMPLETED:</div>
                        <div>• 300+ incoming emails classified into HOT LEAD, INVOICE, and VIP</div>
                        <div>• Contextual executive reply synthesized from company knowledge base</div>
                        <div className="text-emerald-400 font-bold">• 1-Click Human Approve: Review and dispatch in under 5 minutes.</div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-pink-950/40 border border-pink-500/30">
                        <span className="text-xs text-white">Draft: "Thank you for the proposal. Our security SLA policy requires Section 14 review..."</span>
                        <button
                          onClick={() => {
                            forgeAudioSynth.playSuccess();
                            setEmailStatus('sent');
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1 shrink-0 ${
                            emailStatus === 'sent' ? 'bg-emerald-500 text-dark-950' : 'bg-pink-500 text-white hover:bg-pink-400'
                          }`}
                        >
                          {emailStatus === 'sent' ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                          <span>{emailStatus === 'sent' ? 'Dispatched' : '1-Click Approve & Send'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SIMULATION 6: 📅 BOOK APPOINTMENTS (GREEN) */}
              {activeTabId === 'book-appointments' && (
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-[#081e10] border-2 border-emerald-400/60 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-3 text-center space-y-2">
                      <AppointmentCharacter size="md" />
                      <div className="text-xs font-bold text-white">FORGE Appointment Agent</div>
                      <div className="text-[10px] text-emerald-300 font-bold">Multi-Calendar Sync</div>
                    </div>

                    <div className="md:col-span-9 space-y-3 font-sans">
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-1 font-mono">
                        <div className="text-emerald-400 font-bold">📅 CALENDAR CONFLICT RESOLUTION:</div>
                        <div>• Scanned 3 Doctor Operatories across Google Calendar & Dentrix</div>
                        <div>• Timezone and buffer rules evaluated</div>
                        <div className="text-emerald-400 font-bold">• Confirmed Saturday 11:00 AM slot locked with zero double-booking risk.</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

        </div>

      </div>
    </section>
  );
}
