import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, Sparkles, Send, Calendar, Clock, CheckCircle2, 
  RotateCcw, ShieldCheck, User, MessageSquare, Smartphone, 
  Globe, Zap, ArrowRight, CornerDownLeft, Activity, ShieldAlert
} from 'lucide-react';
import { forgeAudioSynth } from '../../../utils/forgeAudioSynth';
import { processClientReceptionistMessage } from '../../../utils/receptionistClientFallback';
import { ActionButton } from '../v4/ActionButton';
import { AiStatusBadge } from '../v4/AiStatusBadge';
import { ForgeCharacterAvatar } from '../v4/ForgeCharacterAvatar';

const WORKERS = [
  {
    id: 'receptionist',
    name: 'Elena',
    role: 'AI RECEPTIONIST',
    specialty: 'Clinical Triage & Appointments',
    avatarKey: 'receptionist',
    businessContext: 'Rine Dental & Facial Aesthetics • Austin, TX',
    badge: '24/7 CLINICAL TRIAGE',
    activeTabClass: 'bg-teal-500/20 text-teal-300 border-teal-400 shadow-teal-500/10',
    avatarInitialBg: 'bg-teal-900/60 border-teal-500/40 text-teal-300',
    initial: 'E',
    starterPrompts: [
      'How much does laser teeth whitening cost?',
      'I have severe tooth pain, can I come in today?',
      'Do you have appointments available this Friday?',
      'Do you accept Delta Dental insurance or CareCredit?'
    ],
    greeting: "Hello! I am Elena, 24/7 Front Desk AI Receptionist for Rine Dental & Facial Aesthetics. I can provide treatment details, verify doctor availability, explain insurance, and lock in appointments. How may I assist you today?"
  },
  {
    id: 'sales',
    name: 'Marcus',
    role: 'AI SALES AGENT',
    specialty: 'Speed-to-Lead & Pipeline Qualification',
    avatarKey: 'sales',
    businessContext: 'Rine Forge Systems • B2B Inbound Speed',
    badge: '< 45s INBOUND SPEED',
    activeTabClass: 'bg-violet-500/20 text-violet-300 border-violet-400 shadow-violet-500/10',
    avatarInitialBg: 'bg-violet-900/60 border-violet-500/40 text-violet-300',
    initial: 'M',
    starterPrompts: [
      'I run a commercial plumbing firm with 12 vans and we miss 30 calls a week.',
      'How much does your speed-to-lead automation system cost?',
      'Can Marcus sync qualified leads directly into HubSpot and Google Calendar?',
      'What is your average conversion rate increase for local service businesses?'
    ],
    greeting: "Hi! I'm Marcus, AI Inbound Sales Specialist at Rine Forge Systems. I help companies eliminate missed leads, qualify high-value buyers in under 45 seconds, and automate discovery scheduling. What kind of business do you run?"
  },
  {
    id: 'support',
    name: 'Aria',
    role: 'AI CUSTOMER CARE',
    specialty: '24/7 Verified Policies & Care',
    avatarKey: 'support',
    businessContext: '24/7 Grounded Support Core • Verified Knowledge',
    badge: 'ZERO HALLUCINATION',
    activeTabClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-400 shadow-emerald-500/10',
    avatarInitialBg: 'bg-emerald-900/60 border-emerald-500/40 text-emerald-300',
    initial: 'A',
    starterPrompts: [
      'What is your cancellation policy if an emergency comes up?',
      'Do you accept out-of-network PPO insurance plans?',
      'Is free parking and wheelchair access available at the clinic?',
      'Can you reschedule my cleaning appointment from Wednesday to Friday?'
    ],
    greeting: "Hello, I'm Aria from Customer Care. I provide verified answers to service policies, insurance coverage, billing, and scheduling with zero hallucination. What question can I resolve for you?"
  },
  {
    id: 'operations',
    name: 'Kael',
    role: 'AI OPERATIONS AGENT',
    specialty: 'Workflow & Doc Sync',
    avatarKey: 'operations',
    businessContext: 'Atomic Database Sync & API Dispatch',
    badge: 'ATOMIC CONSISTENCY',
    activeTabClass: 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-amber-500/10',
    avatarInitialBg: 'bg-amber-900/60 border-amber-500/40 text-amber-300',
    initial: 'K',
    starterPrompts: [
      'Can you automatically sync new customer intake data into QuickBooks?',
      'How does your atomic double-booking prevention work?',
      'Show me an audit log of today\'s background sync events.',
      'What happens when an external API token expires or fails?'
    ],
    greeting: "Kael here, AI Operations Specialist. I monitor cross-app webhooks, synchronize invoices into QuickBooks, update CRM deal stages, and dispatch emergency alerts to staff with atomic consistency. What operational workflow would you like to inspect?"
  }
];

export function LiveAiReceptionistDemoSection({ onOpenAuditModal }) {
  const [selectedWorkerId, setSelectedWorkerId] = useState('receptionist');
  const currentWorker = WORKERS.find(w => w.id === selectedWorkerId) || WORKERS[0];
  const [channelMode, setChannelMode] = useState('whatsapp'); // 'whatsapp' | 'web'
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      sender_type: 'AI_RECEPTIONIST',
      content: currentWorker.greeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      intent: 'GREETING',
      latencyMs: 140
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [telemetry, setTelemetry] = useState({
    intent: 'GREETING',
    confidence: 0.99,
    action: `${currentWorker.name} Online & Ready`,
    latencyMs: 140,
    status: 'ONLINE'
  });

  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSwitchWorker = (workerId) => {
    forgeAudioSynth.playClick();
    setSelectedWorkerId(workerId);
    const worker = WORKERS.find(w => w.id === workerId) || WORKERS[0];
    setMessages([
      {
        id: 'welcome_' + Date.now(),
        role: 'assistant',
        sender_type: 'AI_RECEPTIONIST',
        content: worker.greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        intent: 'GREETING',
        latencyMs: 120
      }
    ]);
    setTelemetry({
      intent: 'GREETING',
      confidence: 0.99,
      action: `${worker.name} Online & Ready`,
      latencyMs: 120,
      status: 'ONLINE'
    });
  };

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

    forgeAudioSynth.playClick();
    setInputValue('');

    const userMsg = {
      id: `user_${Date.now()}`,
      role: 'user',
      sender_type: 'CUSTOMER',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    forgeAudioSynth.playScan();

    const startTime = Date.now();

    try {
      // Call production backend with timeout fallback
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const res = await fetch('/api/receptionist/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_id: '00000000-0000-0000-0000-000000000001',
          message: text,
          channel: channelMode === 'whatsapp' ? 'whatsapp' : 'web_chat',
          metadata: { worker_id: selectedWorkerId }
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const latency = data.latency_ms || (Date.now() - startTime);

        setTelemetry({
          intent: data.intent || 'GENERAL_INQUIRY',
          confidence: data.confidence || 0.96,
          action: data.action ? `${data.action} (${data.action_status || 'SUCCESS'})` : 'Knowledge Grounding',
          latencyMs: latency,
          status: data.requires_human ? 'NEEDS_HUMAN' : 'ONLINE'
        });

        setMessages(prev => [
          ...prev,
          {
            id: `ai_${Date.now()}`,
            role: 'assistant',
            sender_type: 'AI_RECEPTIONIST',
            content: data.reply || "Thank you for reaching out. How can I assist you further?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            intent: data.intent,
            latencyMs: latency
          }
        ]);
        forgeAudioSynth.playSuccess();
      } else {
        throw new Error('API non-200');
      }
    } catch (err) {
      // Zero-failure client-side grounding fallback
      const fallbackResult = processClientReceptionistMessage(text, selectedWorkerId);
      const latency = Date.now() - startTime;

      setTelemetry({
        intent: fallbackResult.intent,
        confidence: fallbackResult.confidence,
        action: fallbackResult.action ? `${fallbackResult.action} (RESOLVED)` : 'Knowledge Grounding',
        latencyMs: latency,
        status: fallbackResult.requires_human ? 'NEEDS_HUMAN' : 'ONLINE'
      });

      setMessages(prev => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          role: 'assistant',
          sender_type: 'AI_RECEPTIONIST',
          content: fallbackResult.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          intent: fallbackResult.intent,
          latencyMs: latency
        }
      ]);
      forgeAudioSynth.playSuccess();
    } finally {
      setIsTyping(false);
    }
  };

  const handleResetChat = () => {
    forgeAudioSynth.playClick();
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        sender_type: 'AI_RECEPTIONIST',
        content: currentWorker.greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        intent: 'GREETING',
        latencyMs: 120
      }
    ]);
    setTelemetry({
      intent: 'GREETING',
      confidence: 0.99,
      action: `${currentWorker.name} Online & Ready`,
      latencyMs: 120,
      status: 'ONLINE'
    });
  };

  return (
    <section className="py-16 sm:py-24 border-b border-slate-800/80 bg-[#070c18] relative" id="live-receptionist-demo">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-teal-500/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold tracking-wider uppercase shadow-sm">
            <Bot className="w-3.5 h-3.5 text-teal-400" />
            <span>INTERACTIVE PRODUCT EXPERIENCE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Talk to Your AI Receptionist & Team.
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Select any AI employee below to test them live right now. Ask Elena about clinical appointments, ask Marcus about sales speed-to-lead, Aria about policies, or Kael about system integrations.
          </p>
        </div>

        {/* 4 Specialized AI Worker Selection Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-4xl mx-auto">
          {WORKERS.map((worker) => {
            const isSelected = worker.id === selectedWorkerId;
            return (
              <button
                key={worker.id}
                onClick={() => handleSwitchWorker(worker.id)}
                className={`flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all border ${
                  isSelected
                    ? worker.activeTabClass
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isSelected ? 'animate-pulse bg-emerald-400' : 'bg-slate-600'}`} />
                <span className="font-sans font-bold text-white text-sm">{worker.name}</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">({worker.role.replace('AI ', '')})</span>
              </button>
            );
          })}
        </div>

        {/* The Live Interactive Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start max-w-6xl mx-auto">
          
          {/* Main Chat Interface (8 Cols) */}
          <div className="lg:col-span-8 rounded-3xl bg-[#0b1120] border-2 border-teal-500/30 shadow-2xl overflow-hidden flex flex-col h-[580px] sm:h-[620px]">
            
            {/* Top Bar: Channel Toggle & Reset */}
            <div className="p-4 sm:px-6 border-b border-slate-800 bg-[#0d1527] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ForgeCharacterAvatar characterKey={currentWorker.avatarKey} size="sm" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0d1527]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white font-sans">{currentWorker.name}</span>
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      {currentWorker.role}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {currentWorker.businessContext}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Channel Switcher */}
                <div className="bg-slate-900/80 p-1 rounded-xl border border-slate-700/60 flex items-center gap-1 font-mono text-[10px]">
                  <button
                    onClick={() => {
                      forgeAudioSynth.playClick();
                      setChannelMode('whatsapp');
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                      channelMode === 'whatsapp'
                        ? 'bg-emerald-600 text-white font-bold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Smartphone className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    onClick={() => {
                      forgeAudioSynth.playClick();
                      setChannelMode('web');
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                      channelMode === 'web'
                        ? 'bg-teal-600 text-white font-bold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Globe className="w-3 h-3" />
                    <span>Website</span>
                  </button>
                </div>

                <button
                  onClick={handleResetChat}
                  title="Reset conversation"
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all border border-slate-800"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className={`flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-sans text-sm ${
              channelMode === 'whatsapp' 
                ? 'bg-[#08101a] bg-[radial-gradient(#102138_1px,transparent_1px)] bg-[size:16px_16px]'
                : 'bg-[#080e1a]'
            }`}>
              {messages.map((msg) => {
                const isAI = msg.role === 'assistant';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2.5 ${isAI ? 'justify-start' : 'justify-end'}`}
                  >
                    {isAI && (
                      <div className={`w-7 h-7 rounded-full ${currentWorker.avatarInitialBg} flex items-center justify-center shrink-0 text-xs font-bold`}>
                        {currentWorker.initial}
                      </div>
                    )}
                    <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 shadow-md ${
                      isAI
                        ? channelMode === 'whatsapp'
                          ? 'bg-[#14233a] border border-slate-700/60 text-slate-100 rounded-bl-none'
                          : 'bg-[#111c30] border border-teal-500/30 text-slate-100 rounded-bl-none'
                        : channelMode === 'whatsapp'
                          ? 'bg-[#005c4b] text-white rounded-br-none'
                          : 'bg-teal-600 text-white rounded-br-none'
                    }`}>
                      <div className="leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                      <div className={`mt-1.5 flex items-center justify-end gap-2 text-[10px] font-mono ${
                        isAI ? 'text-slate-400' : 'text-teal-200/80'
                      }`}>
                        {isAI && msg.latencyMs && <span>{msg.latencyMs}ms</span>}
                        <span>{msg.timestamp}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
                  <div className="w-7 h-7 rounded-full bg-teal-900/40 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0 animate-pulse">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-2.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="ml-2 text-[11px] text-teal-300/80">Checking verified knowledge & availability...</span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Quick 1-Click Prompt Chips */}
            <div className="p-3 bg-[#0d1527] border-t border-slate-800/80 overflow-x-auto">
              <div className="flex items-center gap-2 min-w-max">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold mr-1">
                  Try asking {currentWorker.name}:
                </span>
                {currentWorker.starterPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    disabled={isTyping}
                    onClick={() => handleSendMessage(prompt)}
                    className="text-xs font-mono px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-teal-950/60 border border-slate-700/80 hover:border-teal-500/50 text-slate-200 hover:text-teal-200 transition-all disabled:opacity-50"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 sm:p-4 bg-[#0a101d] border-t border-slate-800 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={channelMode === 'whatsapp' ? `Type a WhatsApp message to ${currentWorker.name}...` : `Ask ${currentWorker.name} a question or request availability...`}
                disabled={isTyping}
                className="flex-1 bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 font-sans"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="p-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white disabled:opacity-40 disabled:hover:bg-teal-600 transition-all shrink-0 font-bold shadow-lg"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Sidebar: Real-Time Engine Telemetry (4 Cols) */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Telemetry Card */}
            <div className="rounded-3xl bg-[#0c1322] border border-slate-800 p-6 space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-400" />
                  <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wider">
                    AI Execution Telemetry
                  </h4>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                  <div className="text-[10px] uppercase text-slate-400 font-bold">Detected Customer Intent</div>
                  <div className="text-teal-300 font-bold text-sm">{telemetry.intent}</div>
                  <div className="text-[10px] text-slate-400">Confidence: {(telemetry.confidence * 100).toFixed(0)}%</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                  <div className="text-[10px] uppercase text-slate-400 font-bold">Tool / System Action</div>
                  <div className="text-emerald-300 font-semibold text-xs">{telemetry.action}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
                  <div className="text-[10px] uppercase text-slate-400 font-bold">Response Latency</div>
                  <div className="text-amber-300 font-bold text-sm flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" />
                    <span>{telemetry.latencyMs} ms</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 space-y-2 text-[11px] font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Zero-hallucination grounded knowledge</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>Live calendar slot synchronization</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Deterministic human escalation guard</span>
                </div>
              </div>
            </div>

            {/* Direct CTA Box */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-teal-950/40 via-slate-900/80 to-[#0c1322] border-2 border-teal-500/30 text-center space-y-4">
              <h4 className="text-base font-bold text-white">
                Want {currentWorker.name} for your business?
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                We train {currentWorker.name} on your exact business documents, pricing, and workflows. Live on your WhatsApp and website in under 7 days.
              </p>
              <ActionButton
                variant="primary"
                size="md"
                onClick={() => {
                  if (onOpenAuditModal) {
                    onOpenAuditModal({
                      businessType: 'Custom Business Setup',
                      whatToAutomate: `${currentWorker.name} (${currentWorker.role}) for WhatsApp and Website`
                    });
                  }
                }}
              >
                DEPLOY YOUR AI {currentWorker.name.toUpperCase()}
              </ActionButton>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
