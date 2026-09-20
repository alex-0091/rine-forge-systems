import React, { useState, useEffect } from 'react';
import { 
  Menu, X, ArrowRight, Sparkles, Layers, 
  Cpu, Building2, ShieldCheck, CheckCircle2, ChevronDown, 
  FlaskConical, LayoutDashboard, Volume2, VolumeX, Briefcase, Bot
} from 'lucide-react';
import { forgeAudioSynth } from '../../utils/forgeAudioSynth';

export function ForgeNavbar({ onNavigate, currentView = 'home' }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(forgeAudioSynth.isMuted);

  useEffect(() => {
    return forgeAudioSynth.subscribe(setIsMuted);
  }, []);

  const handleNav = (target) => {
    setMobileMenuOpen(false);
    if (onNavigate) onNavigate(target);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#080b11]/85 backdrop-blur-xl border-b border-white/[0.08] transition-all shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-4">
        
        {/* Brand Identity */}
        <button 
          onClick={() => handleNav('home')}
          className="flex items-center gap-3 text-left focus:outline-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-sky-500 flex items-center justify-center text-white font-black text-base shadow-[0_0_20px_rgba(99,102,241,0.35)] transition-transform group-hover:scale-105">
            R
          </div>
          <div>
            <div className="font-extrabold text-base tracking-tight text-white flex items-center gap-2">
              RINE FORGE <span className="text-[9px] font-mono px-2 py-0.5 bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 rounded-full font-bold tracking-wider">ENTERPRISE AI</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium tracking-wide">Autonomous Voice & Operations Infrastructure</div>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-300">
          <button
            onClick={() => handleNav('receptionist')}
            className={`px-3 py-2 rounded-lg hover:text-white hover:bg-white/[0.05] transition-colors flex items-center gap-1.5 ${
              currentView === 'receptionist' ? 'text-indigo-400 bg-indigo-500/10 font-bold' : ''
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Concierge</span>
          </button>
          <button
            onClick={() => handleNav('systems')}
            className={`px-3 py-2 rounded-lg hover:text-white hover:bg-white/[0.05] transition-colors ${
              currentView === 'systems' || currentView.startsWith('system-') ? 'text-indigo-400 bg-indigo-500/10 font-bold' : ''
            }`}
          >
            Systems
          </button>
          <button
            onClick={() => handleNav('solutions')}
            className={`px-3 py-2 rounded-lg hover:text-white hover:bg-white/[0.05] transition-colors ${
              currentView.startsWith('solution') ? 'text-indigo-400 bg-indigo-500/10 font-bold' : ''
            }`}
          >
            Solutions
          </button>
          <button
            onClick={() => handleNav('industries')}
            className={`px-3 py-2 rounded-lg hover:text-white hover:bg-white/[0.05] transition-colors ${
              currentView.startsWith('industry') || currentView.startsWith('for-') ? 'text-indigo-400 bg-indigo-500/10 font-bold' : ''
            }`}
          >
            Industries
          </button>
          <button
            onClick={() => handleNav('workbench')}
            className={`px-3 py-2 rounded-lg hover:text-white hover:bg-white/[0.05] transition-colors flex items-center gap-1.5 ${
              currentView === 'workbench' ? 'text-indigo-400 bg-indigo-500/10 font-bold' : ''
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
            <span>Workbench</span>
          </button>
          <button
            onClick={() => handleNav('pricing')}
            className={`px-3 py-2 rounded-lg hover:text-white hover:bg-white/[0.05] transition-colors ${
              currentView === 'pricing' ? 'text-indigo-400 bg-indigo-500/10 font-bold' : ''
            }`}
          >
            Pricing
          </button>
          <button
            onClick={() => handleNav('about')}
            className={`px-3 py-2 rounded-lg hover:text-white hover:bg-white/[0.05] transition-colors ${
              currentView === 'about' ? 'text-indigo-400 bg-indigo-500/10 font-bold' : ''
            }`}
          >
            About
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

          {/* Launch App / Sandbox */}
          <button
            onClick={() => handleNav('app-dashboard')}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 hover:text-white border border-white/[0.09] font-medium text-xs transition-all shadow-sm"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
            <span>Launch Console</span>
          </button>

          {/* Primary High-Conversion Audit CTA */}
          <button
            onClick={() => handleNav('audit')}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] flex items-center gap-1.5 shrink-0"
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
            onClick={() => handleNav('receptionist')}
            className="block w-full text-left py-2.5 px-3 rounded-lg text-indigo-300 hover:bg-white/[0.05] flex items-center gap-2 font-bold"
          >
            <Bot className="w-4 h-4 text-indigo-400" /> Live AI Concierge
          </button>
          <button
            onClick={() => handleNav('systems')}
            className="block w-full text-left py-2.5 px-3 rounded-lg text-slate-200 hover:bg-white/[0.05]"
          >
            Systems Library
          </button>
          <button
            onClick={() => handleNav('solutions')}
            className="block w-full text-left py-2.5 px-3 rounded-lg text-slate-200 hover:bg-white/[0.05]"
          >
            Solutions
          </button>
          <button
            onClick={() => handleNav('industries')}
            className="block w-full text-left py-2.5 px-3 rounded-lg text-slate-200 hover:bg-white/[0.05]"
          >
            Industries
          </button>
          <button
            onClick={() => handleNav('workbench')}
            className="block w-full text-left py-2.5 px-3 rounded-lg text-indigo-400 hover:bg-white/[0.05] flex items-center gap-2"
          >
            <Briefcase className="w-4 h-4" /> AI Workbench
          </button>
          <button
            onClick={() => handleNav('pricing')}
            className="block w-full text-left py-2.5 px-3 rounded-lg text-slate-200 hover:bg-white/[0.05]"
          >
            Pricing
          </button>
          <button
            onClick={() => handleNav('about')}
            className="block w-full text-left py-2.5 px-3 rounded-lg text-slate-200 hover:bg-white/[0.05]"
          >
            About
          </button>
          <div className="pt-3 border-t border-white/[0.08] space-y-2">
            <button
              onClick={() => {
                const nextMuted = forgeAudioSynth.toggleMute();
                if (!nextMuted) forgeAudioSynth.playClick();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-slate-300 text-xs flex items-center justify-center gap-2"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              <span>{isMuted ? 'UI Audio: MUTED (Click to Unmute)' : 'UI Audio: ACTIVE (Click to Mute)'}</span>
            </button>
            <button
              onClick={() => handleNav('app-dashboard')}
              className="w-full py-3 bg-white/[0.05] border border-white/[0.1] text-white font-bold rounded-xl text-center flex items-center justify-center gap-1.5"
            >
              <LayoutDashboard className="w-4 h-4 text-indigo-400" />
              <span>LAUNCH OPERATOR CONSOLE</span>
            </button>
            <button
              onClick={() => handleNav('audit')}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white font-bold rounded-xl text-center flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
            >
              <span>GET YOUR FREE AI ARCHITECTURE AUDIT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
