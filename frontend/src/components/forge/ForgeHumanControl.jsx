import React, { useState, useEffect } from 'react';
import { 
  Bot, Sparkles, Send, X, ArrowRight, CheckCircle2, 
  Layers, Zap, MessageSquare, Play, ChevronUp, ChevronDown, 
  Terminal, Building2, ShieldCheck, Flame 
} from 'lucide-react';

export function ForgeHumanControl({ onNavigate, onLaunchSystemDemo }) {
  const [isOpen, setIsOpen] = useState(false);
  const [queryInput, setQueryInput] = useState('');
  const [aiResponse, setAiResponse] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  // Quick suggestion chips
  const suggestionChips = [
    { label: "I'm a dentist", query: "I run a dental clinic and miss after-hours patient calls." },
    { label: "I'm a real estate agent", query: "I run a real estate brokerage and want sub-60s lead response." },
    { label: "I run a hotel", query: "I run a luxury hotel and want 24/7 guest concierge." },
    { label: "Invoice & Paperwork", query: "Our accounting team is overwhelmed entering PDF invoices." },
    { label: "Messy Inbox", query: "I receive hundreds of emails a day and need automated inbox triage." },
    { label: "Try live demo", query: "Show me what FORGE can do right now." },
    { label: "Get an AI audit", query: "I want a free 48-hour automation audit for my company." }
  ];

  const handleProcessQuery = (text) => {
    if (!text.trim()) return;
    setQueryInput(text);
    setIsTyping(true);
    setAiResponse(null);

    setTimeout(() => {
      const lower = text.toLowerCase();
      let res = {};

      if (lower.includes('dent') || lower.includes('clinic') || lower.includes('doctor') || lower.includes('patient')) {
        res = {
          title: 'Healthcare & Dental Automation Suite',
          workflowsFound: [
            '01 Missed-call & after-hours recovery',
            '02 Instant patient appointment booking',
            '03 Dental insurance eligibility lookup (PPO)',
            '04 Post-procedure SMS follow-up'
          ],
          bestStart: 'FORGE 24/7 AI Receptionist',
          workflowSequence: 'CALL → UNDERSTAND → QUALIFY → BOOK → CRM',
          targetSystemId: 'receptionist-agent',
          impact: '+28% after-hours bookings recovered'
        };
      } else if (lower.includes('real estate') || lower.includes('realty') || lower.includes('broker') || lower.includes('property')) {
        res = {
          title: 'Real Estate PropTech Pipeline',
          workflowsFound: [
            '01 Sub-60s portal webhook intake (Zillow/Realtor)',
            '02 Buyer purchasing power & pre-approval scoring',
            '03 VIP private tour calendar booking',
            '04 Automated MLS property match broadcast'
          ],
          bestStart: 'FORGE Lead Engine',
          workflowSequence: 'LEAD → UNDERSTAND → SCORE → RESPOND → BOOK',
          targetSystemId: 'lead-agent',
          impact: '3.4x higher tour conversion rate'
        };
      } else if (lower.includes('invoice') || lower.includes('pdf') || lower.includes('document') || lower.includes('accounting') || lower.includes('paper')) {
        res = {
          title: 'Document & Accounts Payable Automation',
          workflowsFound: [
            '01 Unstructured PDF & invoice vision extraction',
            '02 Line-item sum & tax rate validation',
            '03 Purchase order (PO) cross-referencing',
            '04 Automated QuickBooks / Xero entry'
          ],
          bestStart: 'FORGE Document Engine',
          workflowSequence: 'DOCUMENT → OCR → EXTRACT → VALIDATE → ERP',
          targetSystemId: 'document-processor',
          impact: '85% reduction in manual data entry'
        };
      } else if (lower.includes('email') || lower.includes('inbox') || lower.includes('mail')) {
        res = {
          title: 'Autonomous Email & Inbox Operations',
          workflowsFound: [
            '01 Inbound email intent & urgency classification',
            '02 Hot sales lead auto-routing to top reps',
            '03 Context-aware draft reply generation',
            '04 1-click human approval gating'
          ],
          bestStart: 'FORGE Email Agent',
          workflowSequence: 'INBOX → CLASSIFY → DRAFT → APPROVE → SEND',
          targetSystemId: 'email-agent',
          impact: '2.5 hours saved per employee daily'
        };
      } else if (lower.includes('hotel') || lower.includes('hospitality') || lower.includes('guest')) {
        res = {
          title: 'Hospitality & Guest Concierge OS',
          workflowsFound: [
            '01 24/7 multilingual guest inquiries & room service',
            '02 Instant private event & wedding quote generator',
            '03 Automated banquet event order (BEO) sync',
            '04 Post-stay review generation pipeline'
          ],
          bestStart: 'FORGE Support & Concierge Agent',
          workflowSequence: 'GUEST → INTENT → VERIFY → ANSWER → PMS',
          targetSystemId: 'support-agent',
          impact: 'Instant response across WhatsApp & Web'
        };
      } else if (lower.includes('audit')) {
        res = {
          title: 'Free 48-Hour Architecture Audit',
          workflowsFound: [
            '01 Complete software stack feasibility review',
            '02 Quantified ROI & labor savings blueprint',
            '03 System trigger & decision architecture map',
            '04 14-day fixed pilot scope'
          ],
          bestStart: 'Free AI Automation Audit',
          workflowSequence: 'SUBMIT → ANALYZE → BLUEPRINT → DEPLOY',
          targetSystemId: 'audit',
          impact: 'Delivered in 48 hours with zero sales pitch'
        };
      } else {
        res = {
          title: 'Bespoke Autonomous System',
          workflowsFound: [
            '01 Automated lead qualification in sub-60 seconds',
            '02 24/7 conversational voice & chat support',
            '03 Cross-tool data sync across your CRM & ERP',
            '04 Human-in-the-loop governance checkpoints'
          ],
          bestStart: 'FORGE Lead Agent & Receptionist',
          workflowSequence: 'INPUT → REASON → DECIDE → ACTION → SYNC',
          targetSystemId: 'lead-agent',
          impact: 'Custom architecture deployed in 14 days'
        };
      }

      setAiResponse(res);
      setIsTyping(false);
    }, 600);
  };

  const handleLaunch = (sysId) => {
    if (sysId === 'audit') {
      if (onNavigate) onNavigate('audit');
    } else {
      if (onLaunchSystemDemo) onLaunchSystemDemo(sysId);
      else if (onNavigate) onNavigate('try-ai');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 font-sans max-w-[95vw]">
      
      {/* Minimized Floating Bar */}
      {!isOpen && (
        <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-2xl bg-[#090e18]/95 border border-teal-500/40 shadow-2xl backdrop-blur-md text-slate-100 hover:border-teal-400 transition-all">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 font-mono text-xs font-bold transition-colors"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>FORGE CONTROL • ONLINE</span>
          </button>

          <button
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300 font-medium px-2 hover:text-white"
          >
            <span>What are you trying to automate?</span>
          </button>

          <button
            onClick={() => setIsOpen(true)}
            className="p-2 bg-teal-500 text-dark-950 rounded-xl font-bold hover:bg-teal-400 transition-transform hover:scale-105"
            title="Open FORGE Control"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Expanded Control Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[440px] max-h-[85vh] bg-[#080d16] border border-teal-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100 animate-fadeIn">
          
          {/* Header Bar */}
          <div className="p-4 bg-[#05080e] border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-teal-500 text-dark-950 font-black text-xs flex items-center justify-center font-mono">
                F
              </div>
              <div>
                <div className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                  FORGE OPERATOR
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <div className="text-[10px] text-teal-400 font-mono">Human-AI Interface Engine</div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg bg-dark-900 hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Area */}
          <div className="p-4 overflow-y-auto space-y-4 max-h-[60vh] text-xs">
            
            {/* Introductory Question */}
            {!aiResponse && !isTyping && (
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-200 leading-relaxed font-sans">
                  👋 <strong>Tell FORGE what your business does or where you lose the most time.</strong> We'll immediately structure your automation pipeline.
                </div>

                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">Quick Inquiries:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestionChips.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleProcessQuery(chip.query)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-teal-500/10 text-slate-300 hover:text-teal-300 border border-slate-800 font-mono text-[10px] transition-colors"
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Typing State */}
            {isTyping && (
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-2 font-mono text-xs text-teal-400">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>FORGE is analyzing operational workflows...</span>
              </div>
            )}

            {/* AI Structured Response */}
            {aiResponse && (
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-teal-500/30 space-y-3 font-mono text-xs animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-teal-400 font-bold uppercase">{aiResponse.title}</span>
                  <span className="text-[10px] text-emerald-400 font-bold">{aiResponse.impact}</span>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] text-slate-400 font-bold">DETECTED AUTOMATION WORKFLOWS:</div>
                  <ul className="space-y-1 text-[11px] text-slate-300 font-sans pl-2 border-l border-teal-500/40">
                    {aiResponse.workflowsFound.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-2.5 bg-dark-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400">RECOMMENDED STARTING SYSTEM:</div>
                  <div className="text-white font-bold text-xs">{aiResponse.bestStart}</div>
                  <div className="text-[10px] text-teal-400 font-mono">{aiResponse.workflowSequence}</div>
                </div>

                <div className="pt-1 flex gap-2">
                  <button
                    onClick={() => handleLaunch(aiResponse.targetSystemId)}
                    className="flex-1 py-2.5 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl text-xs font-mono transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <span>LAUNCH SYSTEM DEMO</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setAiResponse(null);
                      setQueryInput('');
                    }}
                    className="px-3 py-2.5 bg-dark-950 hover:bg-slate-800 text-slate-400 rounded-xl text-xs"
                    title="Ask another question"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Input Form Bar */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleProcessQuery(queryInput);
            }} 
            className="p-3 bg-[#05080e] border-t border-slate-800 flex gap-2"
          >
            <input
              type="text"
              placeholder="e.g. I run a plumbing company and need after-hours dispatch..."
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              className="flex-1 px-3 py-2 bg-dark-900 border border-slate-800 focus:border-teal-500 rounded-xl text-white text-xs font-mono focus:outline-none placeholder-slate-500"
            />
            <button
              type="submit"
              disabled={isTyping || !queryInput.trim()}
              className="p-2.5 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-dark-950 font-bold rounded-xl transition-all shadow-md shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
