import React, { useState, useEffect } from 'react';
import { 
  Bot, Sparkles, Send, CheckCircle2, ArrowRight, 
  ExternalLink, Layers, ShieldCheck, Zap, MessageSquare, 
  Calendar, RefreshCw, Calculator, Terminal, TrendingUp,
  Cpu, Award, Building2, PhoneCall, Check, ArrowUpRight,
  Activity, Play, Flame, BarChart3, Database, Globe,
  Briefcase, DollarSign, School, CheckCircle, AlertTriangle,
  CreditCard, Wallet, Lock, Landmark, CheckCheck, FlaskConical,
  LayoutDashboard, Video 
} from 'lucide-react';

// Forge Marketing & Discovery Components (Experience A)
import { ForgeNavbar } from './forge/ForgeNavbar';
import { ForgeHero } from './forge/ForgeHero';
import { LiveActivityStream } from './forge/LiveActivityStream';
import { LiveSystemsShowcase } from './forge/LiveSystemsShowcase';
import { ProblemSection } from './forge/ProblemSection';
import { SystemsMarketplace } from './forge/SystemsMarketplace';
import { WhatWeBuildSection } from './forge/WhatWeBuildSection';
import { RoiCalculatorSection } from './forge/RoiCalculatorSection';
import { AgentNetworkVisualizer } from './forge/AgentNetworkVisualizer';
import { AgentsSection } from './forge/AgentsSection';
import { WorkflowModal } from './forge/WorkflowModal';
import { OracleShowcaseSection } from './forge/OracleShowcaseSection';
import { CaseStudiesSection } from './forge/CaseStudiesSection';
import { HowItWorksSection } from './forge/HowItWorksSection';
import { WhyForgeSection } from './forge/WhyForgeSection';
import { SecuritySection } from './forge/SecuritySection';
import { IndustriesSection } from './forge/IndustriesSection';
import { PricingSection } from './forge/PricingSection';
import { FaqSection } from './forge/FaqSection';
import { AboutSection } from './forge/AboutSection';
import { FinalCtaSection } from './forge/FinalCtaSection';
import { ForgeFooter } from './forge/ForgeFooter';
import { AuditPage } from './forge/AuditPage';
import { IndustryDetailPage } from './forge/IndustryDetailPage';
import { SolutionDetailPage } from './forge/SolutionDetailPage';
import { SystemDetailPage } from './forge/SystemDetailPage';
import { ForgeAiLab } from './forge/ForgeAiLab';
import { ForgeExperienceView } from './forge/ForgeExperienceView';
import { PersonalizedIndustryView } from './forge/PersonalizedIndustryView';

// Interactive Human Interface & 10s Demo Modals
import { ForgeHumanControl } from './forge/ForgeHumanControl';
import { TenSecondDemoModal } from './forge/TenSecondDemoModal';
import { AutonomousReactionBanner } from './forge/AutonomousReactionBanner';
import { GlobalTryForgeModal } from './forge/GlobalTryForgeModal';

// Product Platform & Operating System Components (Experience B)
import { AppLayout } from './app/AppLayout';
import { AppDashboard } from './app/AppDashboard';
import { OnboardingWizard } from './app/OnboardingWizard';
import { AppSystemBuilder } from './app/AppSystemBuilder';
import { AppKnowledgeBase } from './app/AppKnowledgeBase';
import { AppApprovals } from './app/AppApprovals';
import { AppIntegrations } from './app/AppIntegrations';
import { AppControlCenter } from './app/AppControlCenter';
import { AppBilling } from './app/AppBilling';
import { AdminPanel } from './app/AdminPanel';

// Ancillary Modals
import { PaymentPortalModal } from './PaymentPortalModal';
import { AIToolsForgeView } from './AIToolsForgeView';

export function PublicPortfolioView() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedAgentForModal, setSelectedAgentForModal] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPackageForModal, setSelectedPackageForModal] = useState('ai-receptionist');
  const [activeTenSecDemoSysId, setActiveTenSecDemoSysId] = useState(null);
  const [isGlobalTryModalOpen, setIsGlobalTryModalOpen] = useState(false);
  const [trialCreditsUsed, setTrialCreditsUsed] = useState(32);

  // Check URL pathname, search params or hash on load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const search = window.location.search;
      const hash = window.location.hash.replace('#', '');

      if (path.startsWith('/app')) {
        const sub = path.replace('/app', '').replace('/', '') || 'dashboard';
        setCurrentView(`app-${sub}`);
      } else if (path.includes('/lab')) {
        setCurrentView('lab');
      } else if (path.includes('/experience')) {
        setCurrentView('experience');
      } else if (path.includes('/audit') || search.includes('audit=true')) {
        setCurrentView('audit');
      } else if (path.includes('/systems/')) {
        const slug = path.split('/systems/')[1];
        if (slug) setCurrentView(`system-${slug}`);
      } else if (path.includes('/for/')) {
        const slug = path.split('/for/')[1];
        if (slug) setCurrentView(`for-${slug}`);
      } else if (path.includes('/industries/')) {
        const slug = path.split('/industries/')[1];
        if (slug) setCurrentView(`industry-${slug}`);
      } else if (path.includes('/solutions/')) {
        const slug = path.split('/solutions/')[1];
        if (slug) setCurrentView(`solution-${slug}`);
      } else if (hash) {
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, []);

  const handleNavigate = (target) => {
    if (target === 'try-forge-modal') {
      setIsGlobalTryModalOpen(true);
      return;
    }

    if (target.startsWith('app-')) {
      setCurrentView(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'lab' || target === 'experience' || target === 'audit' || target === 'home' || target.startsWith('system-') || target.startsWith('for-') || target.startsWith('industry-') || target.startsWith('solution-')) {
      setCurrentView(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Anchor scroll or return to home anchor
      if (currentView.startsWith('app-') || currentView !== 'home') {
        setCurrentView('home');
        setTimeout(() => {
          const el = document.getElementById(target);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.getElementById(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleLaunchSystemSandbox = (sysId) => {
    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(() => {
        const el = document.getElementById('try-ai');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('try-ai');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isAppExperience = currentView.startsWith('app-');

  // EXPERIENCE B: PRODUCT PLATFORM & OS
  if (isAppExperience) {
    const appSubTab = currentView.replace('app-', '');

    // Onboarding Wizard fullscreen mode
    if (appSubTab === 'onboarding') {
      return (
        <div className="min-h-screen bg-[#060a12] text-slate-100 p-4 sm:p-8 flex flex-col justify-center">
          <OnboardingWizard
            onCompleteOnboarding={() => {
              setTrialCreditsUsed(prev => prev + 1);
              setCurrentView('app-dashboard');
            }}
            onCancel={() => setCurrentView('home')}
          />
        </div>
      );
    }

    return (
      <AppLayout
        currentAppTab={appSubTab}
        onNavigateApp={(tab) => setCurrentView(`app-${tab}`)}
        onNavigateMarketing={handleNavigate}
        trialCreditsUsed={trialCreditsUsed}
        trialDaysLeft={14}
      >
        {appSubTab === 'dashboard' && (
          <AppDashboard 
            onNavigateApp={(tab) => setCurrentView(`app-${tab}`)} 
            trialCreditsUsed={trialCreditsUsed}
          />
        )}
        {appSubTab === 'systems' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h1 className="text-2xl font-black text-white">Active AI Systems & Catalog</h1>
              <p className="text-xs text-slate-400">Manage running instances or deploy new systems to your tenant.</p>
            </div>
            <SystemsMarketplace onNavigate={handleNavigate} />
          </div>
        )}
        {appSubTab === 'builder' && (
          <AppSystemBuilder onSaveSystem={() => setCurrentView('app-dashboard')} />
        )}
        {appSubTab === 'knowledge' && <AppKnowledgeBase />}
        {appSubTab === 'approvals' && <AppApprovals />}
        {appSubTab === 'integrations' && <AppIntegrations />}
        {appSubTab === 'control' && <AppControlCenter />}
        {appSubTab === 'billing' && <AppBilling />}
        {appSubTab === 'admin' && <AdminPanel />}
      </AppLayout>
    );
  }

  // EXPERIENCE A: MARKETING & DISCOVERY PLATFORM
  return (
    <div className="min-h-screen bg-[#060a12] text-slate-100 font-sans selection:bg-teal-500 selection:text-dark-950">
      
      {/* Top Universal Navbar */}
      <ForgeNavbar onNavigate={handleNavigate} currentView={currentView} />

      {/* Main Experience Router */}
      <main>
        {currentView === 'home' && (
          <>
            {/* 1. Immersive Hero with Interactive FORGE Engine Visualization & Clickable Nodes */}
            <ForgeHero 
              onNavigate={handleNavigate} 
              onLaunchSystemDemo={handleLaunchSystemSandbox}
            />

            {/* 2. Live System Activity Stream */}
            <LiveActivityStream onNavigate={handleNavigate} />

            {/* 3. Try AI Now / Interactive Live Systems Showcase with 10s Demo Triggers */}
            <LiveSystemsShowcase 
              onNavigate={handleNavigate}
              onWatchTenSecDemo={(sysId) => setActiveTenSecDemoSysId(sysId)}
            />

            {/* 4. Business Problems & Breakdowns */}
            <ProblemSection onNavigate={handleNavigate} />

            {/* 5. The FORGE System Library (Marketplace) */}
            <SystemsMarketplace onNavigate={handleNavigate} />

            {/* 6. What We Build Core Architecture */}
            <WhatWeBuildSection onNavigate={handleNavigate} />

            {/* 7. Interactive B2B ROI Calculator */}
            <RoiCalculatorSection onNavigate={handleNavigate} />

            {/* 8. The Multi-Agent Network Topology */}
            <AgentNetworkVisualizer onNavigate={handleNavigate} />

            {/* 9. 6 Modular Autonomous Agents with Step Execution */}
            <AgentsSection 
              onNavigate={handleNavigate} 
              onOpenWorkflowModal={(agent) => setSelectedAgentForModal(agent)} 
            />

            {/* 10. Flagship Production Demonstrations (Oracle AI, Speed-to-Lead, Fact Fuel, OmniSync) */}
            <OracleShowcaseSection onNavigate={handleNavigate} />

            {/* 11. Technical Architecture Case Studies */}
            <CaseStudiesSection onNavigate={handleNavigate} />

            {/* 12. 5-Stage How It Works Framework */}
            <HowItWorksSection onNavigate={handleNavigate} />

            {/* 13. Why FORGE Core Principles */}
            <WhyForgeSection />

            {/* 14. Security, Privacy & Human Governance */}
            <SecuritySection />

            {/* 15. 10 Industry Vertical Solutions */}
            <IndustriesSection onNavigate={handleNavigate} />

            {/* 16. 15+ Free Interactive AI Utilities */}
            <section id="tools-forge" className="py-20 border-t border-slate-800 bg-[#070c14]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                <div className="text-center space-y-3 max-w-3xl mx-auto">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-mono font-bold tracking-wider uppercase">
                    <Sparkles className="w-3.5 h-3.5" /> 100% Free • Sandbox Browser Tools
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    The FORGE AI Utility Suite
                  </h2>
                  <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                    Test our autonomous generators directly in your browser. From cold outreach synthesizers and invoice parsers to ROI estimators and regex sanitizers.
                  </p>
                </div>
                <AIToolsForgeView />
              </div>
            </section>

            {/* 17. Transparent Pricing & Milestone Scopes */}
            <PricingSection onNavigate={handleNavigate} />

            {/* 18. Frequently Asked Questions */}
            <FaqSection onNavigate={handleNavigate} />

            {/* 19. About FORGE & Engineering Leadership */}
            <AboutSection onNavigate={handleNavigate} />

            {/* 20. Final High-Impact Call to Action */}
            <FinalCtaSection onNavigate={handleNavigate} />
          </>
        )}

        {/* The AI Lab Subpage (/lab) */}
        {currentView === 'lab' && (
          <ForgeAiLab onNavigate={handleNavigate} />
        )}

        {/* Cinematic OS Experience Simulator (/experience) */}
        {currentView === 'experience' && (
          <ForgeExperienceView onNavigate={handleNavigate} />
        )}

        {/* Free AI Automation Audit Portal (/audit) */}
        {currentView === 'audit' && (
          <AuditPage onNavigate={handleNavigate} />
        )}

        {/* Dedicated System Product Pages (/systems/:slug) */}
        {currentView.startsWith('system-') && (
          <SystemDetailPage
            slug={currentView.replace('system-', '')}
            onNavigate={handleNavigate}
          />
        )}

        {/* Tailored Industry Pages (/for/:slug) */}
        {currentView.startsWith('for-') && (
          <PersonalizedIndustryView
            industrySlug={currentView.replace('for-', '')}
            onNavigate={handleNavigate}
          />
        )}

        {/* Dynamic Industry Subpages (/industries/:slug) */}
        {currentView.startsWith('industry-') && (
          <IndustryDetailPage 
            slug={currentView.replace('industry-', '')} 
            onNavigate={handleNavigate}
            onOpenWorkflowModal={(agent) => setSelectedAgentForModal(agent)}
          />
        )}

        {/* Dynamic Solution Subpages (/solutions/:slug) */}
        {currentView.startsWith('solution-') && (
          <SolutionDetailPage 
            slug={currentView.replace('solution-', '')} 
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Global Footer */}
      <ForgeFooter onNavigate={handleNavigate} />

      {/* Persistent Human Interface (FORGE CONTROL) */}
      <ForgeHumanControl 
        onNavigate={handleNavigate}
        onLaunchSystemDemo={handleLaunchSystemSandbox}
      />

      {/* Inactivity Observer Prompt */}
      <AutonomousReactionBanner
        onWatchDemo={(sysId) => setActiveTenSecDemoSysId(sysId)}
        onOpenHumanControl={() => {
          const el = document.getElementById('try-ai');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 10-Second Video Demo Modal */}
      {activeTenSecDemoSysId && (
        <TenSecondDemoModal
          systemId={activeTenSecDemoSysId}
          onClose={() => setActiveTenSecDemoSysId(null)}
          onTryLive={(sysId) => {
            setActiveTenSecDemoSysId(null);
            handleLaunchSystemSandbox(sysId);
          }}
        />
      )}

      {/* Global "TRY FORGE" Modal */}
      {isGlobalTryModalOpen && (
        <GlobalTryForgeModal
          isOpen={isGlobalTryModalOpen}
          onClose={() => setIsGlobalTryModalOpen(false)}
          onSelectDemo={(sysId) => {
            if (sysId === 'app-builder') {
              setCurrentView('app-builder');
            } else {
              handleLaunchSystemSandbox(sysId);
            }
          }}
        />
      )}

      {/* Agent Workflow Modal */}
      {selectedAgentForModal && (
        <WorkflowModal 
          agent={selectedAgentForModal} 
          onClose={() => setSelectedAgentForModal(null)} 
          onNavigateAudit={() => {
            setSelectedAgentForModal(null);
            handleNavigate('audit');
          }}
        />
      )}

      {/* 50% Deposit & Milestone Settlement Modal */}
      {isPaymentModalOpen && (
        <PaymentPortalModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          initialService={selectedPackageForModal}
        />
      )}

    </div>
  );
}
