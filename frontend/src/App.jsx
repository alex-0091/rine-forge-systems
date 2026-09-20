import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, Megaphone, Send, MessageSquare, 
  Kanban, BarChart3, Shield, Globe, ShieldAlert, ShieldCheck, 
  Sparkles, RefreshCw, Bot, PhoneCall, Briefcase
} from 'lucide-react';

import { PublicPortfolioView } from './components/PublicPortfolioView';

const DashboardView = React.lazy(() => import('./components/DashboardView').then(m => ({ default: m.DashboardView })));
const LeadsView = React.lazy(() => import('./components/LeadsView').then(m => ({ default: m.LeadsView })));
const AgentGeneratorView = React.lazy(() => import('./components/AgentGeneratorView').then(m => ({ default: m.AgentGeneratorView })));
const CampaignsView = React.lazy(() => import('./components/CampaignsView').then(m => ({ default: m.CampaignsView })));
const OutreachQueueView = React.lazy(() => import('./components/OutreachQueueView').then(m => ({ default: m.OutreachQueueView })));
const InboxView = React.lazy(() => import('./components/InboxView').then(m => ({ default: m.InboxView })));
const PipelineView = React.lazy(() => import('./components/PipelineView').then(m => ({ default: m.PipelineView })));
const AnalyticsView = React.lazy(() => import('./components/AnalyticsView').then(m => ({ default: m.AnalyticsView })));
const ComplianceView = React.lazy(() => import('./components/ComplianceView').then(m => ({ default: m.ComplianceView })));
const VoiceAnalyticsView = React.lazy(() => import('./components/voice/VoiceAnalyticsView').then(m => ({ default: m.VoiceAnalyticsView })));
const WorkbenchView = React.lazy(() => import('./components/workbench/WorkbenchView').then(m => ({ default: m.WorkbenchView })));

export function App() {
  const [activeTab, setActiveTab] = useState('public_website');
  const [killSwitchStatus, setKillSwitchStatus] = useState({ kill_switch_active: false });
  const [togglingKillSwitch, setTogglingKillSwitch] = useState(false);

  const fetchKillSwitchStatus = async () => {
    try {
      const res = await fetch('/api/kill-switch/status');
      const data = await res.json();
      setKillSwitchStatus(data);
    } catch (e) {
      console.error("Kill switch fetch error:", e);
    }
  };

  useEffect(() => {
    fetchKillSwitchStatus();
    if (typeof window !== 'undefined' && !window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, []);

  const handleToggleKillSwitch = async () => {
    const newState = !killSwitchStatus.kill_switch_active;
    const confirmMsg = newState
      ? "🚨 EMERGENCY ACTION: Are you sure you want to STOP ALL OUTREACH immediately? This will pause all scheduled messages, campaigns, follow-ups, and auto-replies across the platform."
      : "Resume all outreach sending and automated sequence operations?";

    if (!window.confirm(confirmMsg)) return;

    try {
      setTogglingKillSwitch(true);
      const res = await fetch('/api/kill-switch/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activate: newState,
          reason: newState ? "Emergency Pause Triggered by Owner via Dashboard" : "Operations Resumed by Owner"
        })
      });
      const data = await res.json();
      setKillSwitchStatus(data);
    } catch (e) {
      console.error("Failed to toggle kill switch:", e);
    } finally {
      setTogglingKillSwitch(false);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'workbench', label: 'AI Workbench', icon: Briefcase },
    { id: 'leads', label: 'Leads & Intel', icon: Users },
    { id: 'agent_generator', label: 'Bot Generator', icon: Bot },
    { id: 'voice_analytics', label: 'Voice Intel', icon: PhoneCall },
    { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
    { id: 'outreach', label: 'Outreach Queue', icon: Send },
    { id: 'inbox', label: 'Inbox & Replies', icon: MessageSquare },
    { id: 'pipeline', label: 'Funnel Pipeline', icon: Kanban },
    { id: 'analytics', label: 'AI Analytics', icon: BarChart3 },
    { id: 'compliance', label: 'Compliance & Logs', icon: Shield },
    { id: 'public_website', label: 'Rine Forge Agency Site', icon: Globe }
  ];

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col font-sans">
      {/* Operator Navigation Bar - Shown only in Operator Mode */}
      {activeTab !== 'public_website' && (
        <header className="sticky top-0 z-40 bg-dark-900/90 backdrop-blur-md border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            {/* Brand Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-indigo-600 flex items-center justify-center text-dark-950 font-black text-lg shadow-lg shadow-teal-500/20">
                R
              </div>
              <div>
                <div className="font-extrabold text-sm text-white tracking-wider">RINE FORGE SYSTEMS</div>
                <div className="text-[10px] text-teal-400 font-mono">AUTONOMOUS CLIENT ACQUISITION OS • OPERATOR CONSOLE</div>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1 bg-dark-950/60 p-1 rounded-xl border border-slate-800/80">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-teal-500 text-dark-950 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-dark-850'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Kill Switch & Mode Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('public_website')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold border border-slate-700 transition-all"
              >
                <Globe className="w-3.5 h-3.5 text-teal-400" />
                <span>Live Site</span>
              </button>

              <button
                onClick={handleToggleKillSwitch}
                disabled={togglingKillSwitch}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${
                  killSwitchStatus.kill_switch_active
                    ? 'bg-rose-500 hover:bg-rose-400 text-white animate-pulse shadow-rose-500/30'
                    : 'bg-dark-850 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-slate-700 hover:border-rose-500/40'
                }`}
                title={killSwitchStatus.kill_switch_active ? 'Click to deactivate emergency pause' : 'Emergency Kill Switch: Stop all sending immediately'}
              >
                <ShieldAlert className="w-4 h-4" />
                {killSwitchStatus.kill_switch_active ? 'KILL SWITCH ACTIVE' : 'STOP ALL OUTREACH'}
              </button>
            </div>
          </div>

          {/* Mobile/Tablet Secondary Nav */}
          <div className="xl:hidden flex items-center overflow-x-auto px-4 py-2 border-t border-slate-800/60 gap-1 bg-dark-950/80">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                    isActive
                      ? 'bg-teal-500 text-dark-950'
                      : 'text-slate-400 hover:text-slate-200 bg-dark-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </header>
      )}

      {/* Main Content Area */}
      {activeTab === 'public_website' ? (
        <div className="flex-1 w-full">
          <PublicPortfolioView onOpenOperatorConsole={() => setActiveTab('dashboard')} />
        </div>
      ) : (
        <React.Suspense fallback={<div className="p-12 text-center text-teal-400 font-mono text-sm animate-pulse">Loading Module...</div>}>
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {activeTab === 'dashboard' && (
              <DashboardView
                onNavigate={(tab) => setActiveTab(tab)}
                onTriggerKillSwitch={handleToggleKillSwitch}
                killSwitchStatus={killSwitchStatus}
              />
            )}
            {activeTab === 'workbench' && <WorkbenchView />}
            {activeTab === 'leads' && <LeadsView />}
            {activeTab === 'agent_generator' && <AgentGeneratorView />}
            {activeTab === 'voice_analytics' && <VoiceAnalyticsView />}
            {activeTab === 'campaigns' && <CampaignsView onNavigate={(tab) => setActiveTab(tab)} />}
            {activeTab === 'outreach' && <OutreachQueueView />}
            {activeTab === 'inbox' && <InboxView />}
            {activeTab === 'pipeline' && <PipelineView />}
            {activeTab === 'analytics' && <AnalyticsView />}
            {activeTab === 'compliance' && <ComplianceView />}
          </main>
        </React.Suspense>
      )}
    </div>
  );
}
