import React, { useState } from 'react';
import { 
  Menu, X, ArrowRight, Sparkles, Layers, 
  Cpu, Building2, ShieldCheck, CheckCircle2, ChevronDown, 
  FlaskConical, LayoutDashboard 
} from 'lucide-react';

export function ForgeNavbar({ onNavigate, currentView = 'home' }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (target) => {
    setMobileMenuOpen(false);
    if (onNavigate) onNavigate(target);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#080c14]/95 backdrop-blur-md border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <button 
          onClick={() => handleNav('home')}
          className="flex items-center gap-3 text-left focus:outline-none group"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center text-dark-950 font-black text-base shadow-sm font-mono transition-transform group-hover:scale-105">
            F
          </div>
          <div>
            <div className="font-extrabold text-base tracking-widest text-white flex items-center gap-1.5 font-sans">
              FORGE <span className="text-[9px] font-mono px-1.5 py-0.5 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded font-bold">SYSTEMS</span>
            </div>
            <div className="text-[9px] text-slate-400 font-mono tracking-wider">AI THAT DOES THE WORK</div>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 text-xs font-mono font-semibold text-slate-300">
          <button
            onClick={() => handleNav('systems')}
            className={`px-3 py-2 rounded-lg hover:text-white hover:bg-slate-850 transition-colors ${
              currentView === 'systems' || currentView.startsWith('system-') ? 'text-teal-400 bg-teal-500/10' : ''
            }`}
          >
            Systems Library
          </button>
          <button
            onClick={() => handleNav('solutions')}
            className={`px-3 py-2 rounded-lg hover:text-white hover:bg-slate-850 transition-colors ${
              currentView.startsWith('solution') ? 'text-teal-400 bg-teal-500/10' : ''
            }`}
          >
            Solutions
          </button>
          <button
            onClick={() => handleNav('lab')}
            className={`px-3 py-2 rounded-lg hover:text-white hover:bg-slate-850 transition-colors flex items-center gap-1 ${
              currentView === 'lab' ? 'text-teal-400 bg-teal-500/10' : ''
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5 text-teal-400" />
            <span>AI Lab</span>
          </button>
          <button
            onClick={() => handleNav('experience')}
            className={`px-3 py-2 rounded-lg hover:text-white hover:bg-slate-850 transition-colors flex items-center gap-1 ${
              currentView === 'experience' ? 'text-teal-400 bg-teal-500/10' : ''
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>OS Experience</span>
          </button>
          <button
            onClick={() => handleNav('industries')}
            className={`px-3 py-2 rounded-lg hover:text-white hover:bg-slate-850 transition-colors ${
              currentView.startsWith('industry') || currentView.startsWith('for-') ? 'text-teal-400 bg-teal-500/10' : ''
            }`}
          >
            Industries
          </button>
          <button
            onClick={() => handleNav('pricing')}
            className={`px-3 py-2 rounded-lg hover:text-white hover:bg-slate-850 transition-colors ${
              currentView === 'pricing' ? 'text-teal-400 bg-teal-500/10' : ''
            }`}
          >
            Pricing
          </button>
          <button
            onClick={() => handleNav('about')}
            className={`px-3 py-2 rounded-lg hover:text-white hover:bg-slate-850 transition-colors ${
              currentView === 'about' ? 'text-teal-400 bg-teal-500/10' : ''
            }`}
          >
            About
          </button>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Direct Launch into App / Free Trial */}
          <button
            onClick={() => handleNav('app-dashboard')}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-700 font-mono font-bold text-xs transition-all"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-teal-400" />
            <span>Launch App</span>
          </button>

          {/* Primary Audit CTA */}
          <button
            onClick={() => handleNav('audit')}
            className="px-3.5 sm:px-4 py-2 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black text-xs font-mono rounded-xl transition-all shadow-md shadow-teal-500/15 flex items-center gap-1.5 shrink-0"
          >
            <span>FREE AI AUDIT</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-dark-900 border border-slate-800 text-slate-300 hover:text-white focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#080c14] px-4 pt-3 pb-6 space-y-2 text-xs font-mono font-semibold">
          <button
            onClick={() => handleNav('systems')}
            className="block w-full text-left py-2.5 px-3 rounded-lg text-slate-200 hover:bg-dark-850"
          >
            Systems Library
          </button>
          <button
            onClick={() => handleNav('solutions')}
            className="block w-full text-left py-2.5 px-3 rounded-lg text-slate-200 hover:bg-dark-850"
          >
            Solutions
          </button>
          <button
            onClick={() => handleNav('lab')}
            className="block w-full text-left py-2.5 px-3 rounded-lg text-teal-400 hover:bg-dark-850 flex items-center gap-2"
          >
            <FlaskConical className="w-4 h-4" /> The AI Lab
          </button>
          <button
            onClick={() => handleNav('experience')}
            className="block w-full text-left py-2.5 px-3 rounded-lg text-cyan-400 hover:bg-dark-850 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> OS Experience Simulator
          </button>
          <button
            onClick={() => handleNav('industries')}
            className="block w-full text-left py-2.5 px-3 rounded-lg text-slate-200 hover:bg-dark-850"
          >
            Industries
          </button>
          <button
            onClick={() => handleNav('pricing')}
            className="block w-full text-left py-2.5 px-3 rounded-lg text-slate-200 hover:bg-dark-850"
          >
            Pricing
          </button>
          <button
            onClick={() => handleNav('about')}
            className="block w-full text-left py-2.5 px-3 rounded-lg text-slate-200 hover:bg-dark-850"
          >
            About
          </button>
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <button
              onClick={() => handleNav('app-dashboard')}
              className="w-full py-3 bg-slate-900 border border-slate-700 text-teal-300 font-bold rounded-xl text-center flex items-center justify-center gap-1.5"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>LAUNCH PRODUCT PLATFORM</span>
            </button>
            <button
              onClick={() => handleNav('audit')}
              className="w-full py-3 bg-teal-500 text-dark-950 font-black rounded-xl text-center flex items-center justify-center gap-1.5"
            >
              <span>GET YOUR FREE AI AUTOMATION AUDIT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
