import React from 'react';
import { ArrowRight, ShieldCheck, Lock, Terminal, Sparkles, Building2, Globe } from 'lucide-react';
import { FORGE_SOLUTIONS, FORGE_INDUSTRIES } from '../../data/siteData';

export function ForgeFooter({ onNavigate }) {
  const handleNav = (target) => {
    if (onNavigate) onNavigate(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-800 bg-[#05080e] text-slate-400 font-sans text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Column 1: Brand & Positioning */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center text-dark-950 font-black text-base font-mono">
                F
              </div>
              <div>
                <div className="font-extrabold text-sm tracking-widest text-white">FORGE SYSTEMS</div>
                <div className="text-[9px] text-teal-400 font-mono">AI SYSTEMS THAT DO THE WORK</div>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              We identify expensive, repetitive business bottlenecks and engineer production-grade autonomous systems that execute them with 99.9% reliability.
            </p>

            <div className="pt-2 flex flex-col gap-2 font-mono text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>Zero Public Model Training / Enterprise API Privacy</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>SOC-2 & GDPR Architectural Alignment</span>
              </div>
            </div>

            <div className="pt-3">
              <button
                onClick={() => handleNav('audit')}
                className="px-4 py-2 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-lg font-bold text-xs flex items-center gap-2 transition-all"
              >
                <span>Request 48-Hour AI Audit</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Column 2: Solutions */}
          <div className="space-y-3">
            <div className="text-white font-bold text-xs uppercase font-mono tracking-wider">Solutions</div>
            <ul className="space-y-2">
              {FORGE_SOLUTIONS.map((sol) => (
                <li key={sol.id}>
                  <button
                    onClick={() => handleNav(`solution-${sol.slug}`)}
                    className="hover:text-teal-300 transition-colors text-left"
                  >
                    {sol.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Industries */}
          <div className="space-y-3">
            <div className="text-white font-bold text-xs uppercase font-mono tracking-wider">Industries</div>
            <ul className="space-y-2">
              {FORGE_INDUSTRIES.slice(0, 6).map((ind) => (
                <li key={ind.id}>
                  <button
                    onClick={() => handleNav(`industry-${ind.slug}`)}
                    className="hover:text-teal-300 transition-colors text-left"
                  >
                    {ind.name.split('&')[0]}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => handleNav('industries')}
                  className="text-teal-400 font-semibold hover:underline"
                >
                  View All 10 Verticals →
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Platform & Proof */}
          <div className="space-y-3">
            <div className="text-white font-bold text-xs uppercase font-mono tracking-wider">Platform</div>
            <ul className="space-y-2">
              <li>
                <button onClick={() => handleNav('audit')} className="hover:text-teal-300 transition-colors text-left">
                  Free Automation Audit
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    const el = document.getElementById('roi-calculator');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    else handleNav('home');
                  }} 
                  className="hover:text-teal-300 transition-colors text-left"
                >
                  B2B ROI Calculator
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    const el = document.getElementById('agents');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    else handleNav('agents');
                  }} 
                  className="hover:text-teal-300 transition-colors text-left"
                >
                  6 Modular AI Agents
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    const el = document.getElementById('showcase');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    else handleNav('case-studies');
                  }} 
                  className="hover:text-teal-300 transition-colors text-left"
                >
                  8 Interactive Demos
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    const el = document.getElementById('tools-forge');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    else handleNav('home');
                  }} 
                  className="hover:text-teal-300 transition-colors text-left text-teal-400 font-medium"
                >
                  15+ Free AI Utilities
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-teal-300 transition-colors text-left">
                  Engineering Team
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="pt-8 border-t border-slate-850/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px] font-mono">
          <div>
            © 2026 FORGE Systems (Rine Forge). All rights reserved. Engineering-grade AI systems for B2B operations.
          </div>
          <div className="flex items-center gap-4">
            <span>TLS 1.3 Encrypted</span>
            <span>•</span>
            <span>Zero Data Retention APIs</span>
            <span>•</span>
            <span>PCI-DSS Aligned</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
