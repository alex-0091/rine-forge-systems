import React, { useState } from 'react';
import { 
  Bot, MessageSquare, X, Send, Sparkles, RefreshCw, 
  CheckCircle2, Lock, ArrowRight, ShieldCheck, Landmark,
  Wallet, DollarSign
} from 'lucide-react';

export function FloatingAIAssistant({ onOpenPaymentModal }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: 'Hi there! I am Alex Rine\'s autonomous AI Architecture Agent. How can I help you? You can test any of our free AI tools, request a custom 48-hour prototype, or get an instant milestone quote.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setIsTyping(true);

    // AI Logic for intelligent sales responses
    setTimeout(() => {
      let replyText = '';
      const lower = userText.toLowerCase();

      if (lower.includes('price') || lower.includes('cost') || lower.includes('pay') || lower.includes('rate') || lower.includes('fee')) {
        replyText = 'Our systems are priced substantially lower than standard US/EU market agencies. Complete bespoke production builds range from $499 to $899, with only a 50% milestone deposit ($249 - $449) to begin development. Would you like to view the official payment and settlement portal?';
      } else if (lower.includes('demo') || lower.includes('prototype') || lower.includes('free') || lower.includes('test')) {
        replyText = 'You can test all 8 of our production engines (Oracle AI, Fact Fuel, MEXC Bot, 24/7 AI Receptionist) directly in the Live Showcases, or use our 9 Free AI Forge Tools above! We also engineer a free 48-hour custom prototype tailored to your business before any contract.';
      } else if (lower.includes('bank') || lower.includes('crypto') || lower.includes('iban') || lower.includes('turkey') || lower.includes('usdt')) {
        replyText = 'We accept official corporate settlements via Albaraka Türk Bank (both Euro & USD IBANs) as well as instantaneous USDT via BNB Smart Chain (BEP20). All deposits include escrow milestone protection.';
      } else if (lower.includes('team') || lower.includes('alex') || lower.includes('engineer')) {
        replyText = 'Rine Forge Systems was founded by Alex Rine (Principal Systems Architect) alongside our research team including Dr. Elena Rostova (Lead Quant AI) and Marcus Thorne (VP Infrastructure). We deliver production-grade code with 100% IP ownership.';
      } else {
        replyText = `Thank you for sharing that! We can definitely engineer that for your workflow. We build custom web platforms, voice triage bots, speed-to-lead pipelines, and quant trading bots. Would you like to launch a custom build or test a free working demo?`;
      }

      setMessages(prev => [...prev, { sender: 'assistant', text: replyText }]);
      setIsTyping(false);
    }, 850);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="p-4 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-indigo-600 text-dark-950 font-black shadow-2xl shadow-teal-500/30 hover:scale-105 transition-all flex items-center gap-2 group"
        >
          <Bot className="w-6 h-6 text-dark-950 animate-bounce" />
          <span className="hidden sm:inline font-bold text-xs">24/7 AI Architecture Agent</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[420px] h-[520px] bg-dark-900 border border-slate-700/90 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
          
          {/* Header */}
          <div className="p-4 bg-dark-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500 text-dark-950 flex items-center justify-center font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  Alex Rine AI Concierge
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <div className="text-[10px] text-teal-400 font-mono">Autonomous Sales & Architecture</div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg bg-dark-900 hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Actions Bar */}
          <div className="px-3 py-2 bg-dark-950/60 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[10px] font-mono">
            <button
              onClick={() => {
                onOpenPaymentModal && onOpenPaymentModal('ai-receptionist');
                setIsOpen(false);
              }}
              className="px-2.5 py-1 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 rounded-md border border-teal-500/20 font-bold shrink-0 flex items-center gap-1"
            >
              <DollarSign className="w-3 h-3" /> 50% Deposit Portal
            </button>
            <a
              href="#showcase"
              onClick={() => setIsOpen(false)}
              className="px-2.5 py-1 bg-dark-900 hover:bg-slate-800 text-slate-300 rounded-md border border-slate-800 shrink-0"
            >
              Free Demos
            </a>
            <a
              href="#team"
              onClick={() => setIsOpen(false)}
              className="px-2.5 py-1 bg-dark-900 hover:bg-slate-800 text-slate-300 rounded-md border border-slate-800 shrink-0"
            >
              Engineering Team
            </a>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-teal-500 text-dark-950 font-medium rounded-br-none'
                      : 'bg-dark-950 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-dark-950 border border-slate-800 p-3 rounded-2xl text-[11px] text-teal-400 font-mono flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Alex Rine AI is drafting solution...
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 bg-dark-950 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              placeholder="Ask anything or request custom project..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-2.5 bg-dark-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500"
            />
            <button
              type="submit"
              disabled={isTyping}
              className="p-2.5 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-dark-950 font-bold rounded-xl transition-all shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
