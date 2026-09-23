import React from 'react';
import { ArrowRight, ShieldCheck, Lock, Terminal, Sparkles, Building2, Globe, Heart } from 'lucide-react';
import { forgeAudioSynth } from '../../utils/forgeAudioSynth';

export function ForgeFooter({ onNavigate, onOpenOperatorConsole, onOpenAuditModal }) {
  const handleNav = (target) => {
    forgeAudioSynth.playClick();
    if (target === 'operator-console' && onOpenOperatorConsole) {
      onOpenOperatorConsole();
      return;
    }
    if (target === 'audit' && onOpenAuditModal) {
      onOpenAuditModal();
      return;
    }
    if (onNavigate) onNavigate(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/[0.08] bg-[#05080e] text-slate-400 font-sans text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Column 1: Brand & Positioning */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white font-black text-base font-mono shadow-md">
                R
              </div>
              <div>
                <div className="font-extrabold text-sm tracking-wider text-white">RINE FORGE SYSTEMS</div>
                <div className="text-[10px] text-indigo-400 font-mono">AI SYSTEMS FOR GROWING BUSINESSES</div>
              </div>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed max-w-sm">
              We design, build, and operate practical AI systems for small businesses — from 24/7 AI receptionists and lead follow-up to appointment booking and custom workflow automation.
            </p>

            <div className="pt-2 flex flex-col gap-2 font-mono text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Zero Public Model Training / Enterprise API Privacy</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-sky-400" />
                <span>Deterministic Guardrails & Human-in-the-Loop Control</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => handleNav('audit')}
                className="px-4 py-2 bg-indigo-600/15 hover:bg-indigo-600/25 text-indigo-300 border border-indigo-500/30 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-sm"
              >
                <span>Get Free Opportunity Audit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Column 2: Solutions */}
          <div className="space-y-3">
            <div className="text-white font-bold text-xs uppercase font-mono tracking-wider">Solutions</div>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => handleNav('services')} className="hover:text-white transition-colors text-left">
                  24/7 AI Receptionist
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('services')} className="hover:text-white transition-colors text-left">
                  AI Lead Follow-Up
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('services')} className="hover:text-white transition-colors text-left">
                  Appointment Scheduling
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('services')} className="hover:text-white transition-colors text-left">
                  Missed Call Recovery
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('services')} className="hover:text-white transition-colors text-left">
                  Custom AI Automation
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Industries */}
          <div className="space-y-3">
            <div className="text-white font-bold text-xs uppercase font-mono tracking-wider">Industries</div>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => handleNav('industries')} className="hover:text-white transition-colors text-left">
                  Dental & Medical
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('industries')} className="hover:text-white transition-colors text-left">
                  Salons & Med Spas
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('industries')} className="hover:text-white transition-colors text-left">
                  Hotels & Hospitality
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('industries')} className="hover:text-white transition-colors text-left">
                  Home Services & Trades
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('industries')} className="hover:text-white transition-colors text-left">
                  Real Estate & Law Firms
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Platform & Settlement */}
          <div className="space-y-3">
            <div className="text-white font-bold text-xs uppercase font-mono tracking-wider">Company & Trust</div>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => handleNav('how-it-works')} className="hover:text-white transition-colors text-left">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('why-rine')} className="hover:text-white transition-colors text-left">
                  Why Rine Forge
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('pricing')} className="hover:text-white transition-colors text-left">
                  Starter Pricing & Escrow
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('faq')} className="hover:text-white transition-colors text-left">
                  FAQ
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('payment')} className="hover:text-white transition-colors text-left text-emerald-400 font-medium">
                  Verified Payment Terminal
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('operator-console')} className="hover:text-white transition-colors text-left text-indigo-400 font-mono text-[11px]">
                  Operator Console [V5]
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Rine Forge Systems. All rights reserved. Practical AI systems engineered for business.
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => handleNav('why-rine')} className="hover:text-slate-300 transition-colors">Privacy</button>
            <button onClick={() => handleNav('how-it-works')} className="hover:text-slate-300 transition-colors">Terms of Service</button>
            <button onClick={() => handleNav('payment')} className="hover:text-slate-300 transition-colors">Settlement Rails</button>
          </div>
        </div>

      </div>
    </footer>
  );
}
