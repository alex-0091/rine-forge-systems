import React, { useState, useEffect } from 'react';
import { 
  Menu, X, ArrowRight, Sparkles, 
  Volume2, VolumeX, Bot, LayoutDashboard, PhoneCall, CheckCircle2
} from 'lucide-react';
import { forgeAudioSynth } from '../../utils/forgeAudioSynth';

export function ForgeNavbar({ onNavigate, onOpenAuditModal, currentView = 'home' }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(forgeAudioSynth.isMuted);

  useEffect(() => {
    return forgeAudioSynth.subscribe(setIsMuted);
  }, []);

  const handleNav = (target) => {
    setMobileMenuOpen(false);
    forgeAudioSynth.playClick();
    if (target === 'audit' && onOpenAuditModal) {
      onOpenAuditModal();
      return;
    }
    if (onNavigate) onNavigate(target);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#070b12]/90 backdrop-blur-xl border-b border-white/[0.08] transition-all shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-4">
        
        {/* Brand Identity */}
        <button 
          onClick={() => handleNav('home')}
          className="flex items-center gap-3 text-left focus:outline-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white font-black text-base shadow-[0_0_20px_rgba(99,102,241,0.35)] transition-transform group-hover:scale-105">
            R
          </div>
          <div>
            <div className="font-extrabold text-base tracking-tight text-white flex items-center gap-2">
              RINE FORGE <span className="text-[10px] font-mono px-2 py-0.5 bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 rounded-full font-bold tracking-wider">SYSTEMS</span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium tracking-wide">AI Systems for Business</div>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-300">
          <button
            onClick={() => handleNav('free-tools')}
            className="px-3 py-2 rounded-lg hover:text-white hover:bg-emerald-500/10 transition-colors flex items-center gap-1.5 text-emerald-400 font-bold border border-emerald-500/25 bg-emerald-500/5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Free AI Tools</span>
          </button>
          <button
            onClick={() => handleNav('see-it-in-action')}
            className="px-3 py-2 rounded-lg hover:text-white hover:bg-white/[0.05] transition-colors flex items-center gap-1.5 text-indigo-300 font-bold"
          >
            <span>Live Simulation</span>
          </button>
          <button
            onClick={() => handleNav('services')}
            className="px-3 py-2 rounded-lg hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            Services
          </button>
          <button
            onClick={() => handleNav('automation-visualizer')}
            className="px-3 py-2 rounded-lg hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            Workflow Engine
          </button>
          <button
            onClick={() => handleNav('live-receptionist')}
            className="px-3 py-2 rounded-lg hover:text-white hover:bg-white/[0.05] transition-colors flex items-center gap-1.5 text-slate-300 hover:text-white font-medium"
          >
            <Bot className="w-3.5 h-3.5 text-slate-400" />
            <span>Voice Receptionist</span>
          </button>
          <button
            onClick={() => handleNav('roi-calculator')}
            className="px-3 py-2 rounded-lg hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            ROI Calculator
          </button>
          <button
            onClick={() => handleNav('how-it-works')}
            className="px-3 py-2 rounded-lg hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            How It Works
          </button>
          <button
            onClick={() => handleNav('why-rine')}
            className="px-3 py-2 rounded-lg hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            Why Rine
          </button>
          <button
            onClick={() => handleNav('pricing')}
            className="px-3 py-2 rounded-lg hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            Pricing
          </button>
          <button
            onClick={() => handleNav('faq')}
            className="px-3 py-2 rounded-lg hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            FAQ
          </button>
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Audio Mute/Unmute Toggle */}
          <button
            onClick={() => {
              const nextMuted = forgeAudioSynth.toggleMute();
              if (!nextMuted) forgeAudioSynth.playClick();
            }}
            title={isMuted ? "Sound effects: MUTED. Click to unmute." : "Sound effects: ACTIVE. Click to mute."}
            className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs ${
              isMuted 
                ? 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-white' 
                : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
            }`}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="hidden xl:inline text-[10px] font-bold uppercase">{isMuted ? 'Muted' : 'Sound On'}</span>
          </button>

          {/* Launch Console */}
          <button
            onClick={() => handleNav('app-dashboard')}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 hover:text-white border border-white/[0.09] font-medium text-xs transition-all shadow-sm"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
            <span>Console</span>
          </button>

          {/* Primary High-Conversion Audit CTA */}
          <button
            onClick={() => handleNav('audit')}
            className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] flex items-center gap-1.5 shrink-0 transform hover:-translate-y-0.5"
          >
            <span>FREE AI AUDIT</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:text-white focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/[0.08] bg-[#0c101a] px-4 pt-3 pb-6 space-y-2 text-xs font-medium text-slate-200">
          <button
            onClick={() => handleNav('free-tools')}
            className="block w-full text-left py-2.5 px-3 rounded-lg text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Free AI Business Tools (Live Tester)</span>
          </button>
          <button
            onClick={() => handleNav('see-it-in-action')}
            className="block w-full text-left py-2.5 px-3 rounded-lg text-indigo-300 font-bold hover:bg-white/[0.05] flex items-center gap-2"
          >
            <span>Live Simulation</span>
          </button>
          <button
            onClick={() => handleNav('services')}
            className="block w-full text-left py-2.5 px-3 rounded-lg hover:bg-white/[0.05]"
          >
            Services
          </button>
          <button
            onClick={() => handleNav('automation-visualizer')}
            className="block w-full text-left py-2.5 px-3 rounded-lg hover:bg-white/[0.05]"
          >
            Workflow Engine
          </button>
          <button
            onClick={() => handleNav('live-receptionist')}
            className="block w-full text-left py-2.5 px-3 rounded-lg hover:bg-white/[0.05] flex items-center gap-2 text-slate-300"
          >
            <Bot className="w-4 h-4 text-slate-400" />
            <span>Voice Receptionist</span>
          </button>
          <button
            onClick={() => handleNav('roi-calculator')}
            className="block w-full text-left py-2.5 px-3 rounded-lg hover:bg-white/[0.05]"
          >
            ROI Calculator
          </button>
          <button
            onClick={() => handleNav('how-it-works')}
            className="block w-full text-left py-2.5 px-3 rounded-lg hover:bg-white/[0.05]"
          >
            How It Works
          </button>
          <button
            onClick={() => handleNav('why-rine')}
            className="block w-full text-left py-2.5 px-3 rounded-lg hover:bg-white/[0.05]"
          >
            Why Rine
          </button>
          <button
            onClick={() => handleNav('pricing')}
            className="block w-full text-left py-2.5 px-3 rounded-lg hover:bg-white/[0.05]"
          >
            Pricing
          </button>
          <button
            onClick={() => handleNav('faq')}
            className="block w-full text-left py-2.5 px-3 rounded-lg hover:bg-white/[0.05]"
          >
            FAQ
          </button>
          <div className="pt-2 border-t border-white/[0.08]">
            <button
              onClick={() => handleNav('audit')}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md"
            >
              <span>Get Your Free AI Audit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
