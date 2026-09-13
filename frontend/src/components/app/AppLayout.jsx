import React, { useState } from 'react';
import { 
  LayoutDashboard, Layers, Workflow, Database, 
  ShieldCheck, Server, CreditCard, ShieldAlert, 
  Sparkles, Bot, LogOut, ArrowRight, Activity, 
  Settings, Users, ChevronRight, Zap, RefreshCw, 
  CheckCircle2, Globe 
} from 'lucide-react';
import { PRICING_CONFIG } from '../../data/forgePlatformConfig';

export function AppLayout({ 
  currentAppTab = 'dashboard', 
  onNavigateApp, 
  onNavigateMarketing, 
  children,
  trialCreditsUsed = 32,
  trialDaysLeft = 14
}) {
  const [activeOrg, setActiveOrg] = useState('Acme Operations (Demo Tenant)');

  const navItems = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
    { id: 'systems', label: 'Active AI Systems', icon: Layers },
    { id: 'builder', label: 'AI System Builder', icon: Workflow },
    { id: 'knowledge', label: 'AI Knowledge Base', icon: Database },
    { id: 'approvals', label: 'Human Oversight Queue', icon: ShieldCheck, badge: '2 Pending' },
    { id: 'integrations', label: 'Integrations Hub', icon: Server },
    { id: 'control', label: 'AI Control & Health', icon: Activity },
    { id: 'billing', label: 'Plans & Billing', icon: CreditCard },
    { id: 'admin', label: 'Platform Admin', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-[#060a12] text-slate-100 font-sans flex flex-col">
      
      {/* Top Application Bar */}
      <header className="sticky top-0 z-40 bg-[#080d16]/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Org Switcher */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigateMarketing && onNavigateMarketing('home')}
              className="flex items-center gap-2 text-left group"
              title="Return to Marketing Website"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center text-dark-950 font-black text-sm font-mono">
                F
              </div>
              <div>
                <div className="font-extrabold text-sm tracking-wider text-white flex items-center gap-1.5">
                  FORGE <span className="text-[9px] font-mono px-1.5 py-0.5 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded font-bold">OS</span>
                </div>
              </div>
            </button>

            <span className="text-slate-700 hidden sm:inline">|</span>

            <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{activeOrg}</span>
            </div>
          </div>

          {/* Trial Status Gauge & Actions */}
          <div className="flex items-center gap-3 sm:gap-4 font-mono text-xs">
            
            {/* Trial Bar */}
            <div className="hidden md:flex items-center gap-3 p-1.5 px-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Trial Credits</span>
                  <span className="font-bold text-teal-400">{trialCreditsUsed} / {PRICING_CONFIG.trialCredits}</span>
                </div>
                <div className="w-28 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full"
                    style={{ width: `${(trialCreditsUsed / PRICING_CONFIG.trialCredits) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {trialDaysLeft}d Left
              </span>
            </div>

            {/* Upgrade CTA */}
            <button
              onClick={() => onNavigateApp('billing')}
              className="px-3.5 py-1.5 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-lg text-xs transition-all shadow-md shadow-teal-500/15 flex items-center gap-1.5 shrink-0"
            >
              <span>Upgrade Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Return to Public Site */}
            <button
              onClick={() => onNavigateMarketing && onNavigateMarketing('home')}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800"
              title="Return to Public Website"
            >
              <Globe className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Secondary App Sub-Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-800/60 scrollbar-none font-mono text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentAppTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigateApp(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                  isActive
                    ? 'bg-teal-500 text-dark-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                    isActive ? 'bg-dark-950 text-teal-400' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Pane */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

    </div>
  );
}
