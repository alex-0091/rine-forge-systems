import React, { useState, useEffect } from 'react';
import { 
  Bot, Sparkles, Send, CheckCircle2, ArrowRight, 
  ExternalLink, Layers, ShieldCheck, Zap, MessageSquare, 
  Calendar, RefreshCw, Calculator, Terminal, TrendingUp,
  Cpu, Award, Building2, PhoneCall, Check, ArrowUpRight,
  Activity, Play, Flame, BarChart3, Database, Globe,
  Briefcase, DollarSign, School, CheckCircle, AlertTriangle,
  CreditCard, Wallet, Lock, Landmark, CheckCheck, FlaskConical,
  LayoutDashboard, Video, X
} from 'lucide-react';

// Core Executive B2B Platform Components
import { ForgeNavbar } from './forge/ForgeNavbar';
import { ForgeHeroExecutive } from './forge/v2/ForgeHeroExecutive';
import { CustomerPainSection } from './forge/v2/CustomerPainSection';
import { CoreServicesSection } from './forge/v2/CoreServicesSection';
import { CinematicWorkflowSection } from './forge/v2/CinematicWorkflowSection';
import { ProductShowcasePanels } from './forge/v2/ProductShowcasePanels';
import { HowItWorksTimeline } from './forge/v2/HowItWorksTimeline';
import { WhyRineSection } from './forge/v2/WhyRineSection';
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
const AuditPage = React.lazy(() => import('./forge/AuditPage').then(m => ({ default: m.AuditPage })));
const IndustryDetailPage = React.lazy(() => import('./forge/IndustryDetailPage').then(m => ({ default: m.IndustryDetailPage })));
const SolutionDetailPage = React.lazy(() => import('./forge/SolutionDetailPage').then(m => ({ default: m.SolutionDetailPage })));
const SystemDetailPage = React.lazy(() => import('./forge/SystemDetailPage').then(m => ({ default: m.SystemDetailPage })));
const PersonalizedIndustryView = React.lazy(() => import('./forge/PersonalizedIndustryView').then(m => ({ default: m.PersonalizedIndustryView })));

// FORGE V2 High-Converting Platform Components
import { ForgeV2HeroScene } from './forge/v2/ForgeV2HeroScene';
import { LiveAiReceptionistDemoSection } from './forge/v2/LiveAiReceptionistDemoSection';
import { TransformationSection } from './forge/v2/TransformationSection';
import { OmnichannelSection } from './forge/v2/OmnichannelSection';
import { WatchItWorkSection } from './forge/v2/WatchItWorkSection';
import { IndustrySolutionsSection } from './forge/v2/IndustrySolutionsSection';
import { HowItWorksFlowSection } from './forge/v2/HowItWorksFlowSection';
import { RoiRevenueCalculatorSection } from './forge/v2/RoiRevenueCalculatorSection';
import { TrustAndProofSection } from './forge/v2/TrustAndProofSection';
import { StrongCtaSection } from './forge/v2/StrongCtaSection';
import { ForgeWorkforceMap } from './forge/v2/ForgeWorkforceMap';
import { ChaosToOrderStory } from './forge/v2/ChaosToOrderStory';
import { VisualIndustrySelector } from './forge/v2/VisualIndustrySelector';
import { BeforeAfterComparison } from './forge/v2/BeforeAfterComparison';
import { DontReadJustWatch } from './forge/v2/DontReadJustWatch';
import { ForgeCommandCenter } from './forge/v2/ForgeCommandCenter';
import { WhatForgeCanDo } from './forge/v2/WhatForgeCanDo';
import { InteractiveAiDemoWidget } from './forge/v2/InteractiveAiDemoWidget';
import { TrustAndTechStack } from './forge/v2/TrustAndTechStack';
import { ForgeVideoExperienceLayer } from './forge/v2/videoLayer/ForgeVideoExperienceLayer';
import { MeetAiEmployeesSection } from './forge/v2/MeetAiEmployeesSection';
import { WhatCouldYourBusinessAutomate } from './forge/v2/WhatCouldYourBusinessAutomate';
import { WatchItHappenModal } from './forge/v2/WatchItHappenModal';
import { HowMuchCouldYouAutomate } from './forge/v2/HowMuchCouldYouAutomate';
import { BuiltForRealBusinessWork } from './forge/v2/BuiltForRealBusinessWork';
import { SimpleAuditContactModal } from './forge/v2/SimpleAuditContactModal';
import { RealSystemsProofSection } from './forge/v2/RealSystemsProofSection';
import { AutomationStackArchitecture } from './forge/v2/AutomationStackArchitecture';
import { WhyForgeSection_v2 } from './forge/v2/WhyForgeSection_v2';
import { ProcessTimelineSection } from './forge/v2/ProcessTimelineSection';
import { BuiltWithModernTechnology } from './forge/v2/BuiltWithModernTechnology';
import { AiEmployeeBuilderMini } from './forge/v2/AiEmployeeBuilderMini';
import { VoiceLiveInterface } from './voice/VoiceLiveInterface';

// Interactive Human Interface & 10s Demo Modals
import { ForgeHumanControl } from './forge/ForgeHumanControl';
import { TenSecondDemoModal } from './forge/TenSecondDemoModal';
import { AutonomousReactionBanner } from './forge/AutonomousReactionBanner';
import { GlobalTryForgeModal } from './forge/GlobalTryForgeModal';
import { RealAiReceptionistChat } from './forge/v4/RealAiReceptionistChat';

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

// Ancillary Modals & Lab Views
import { PaymentPortalModal } from './PaymentPortalModal';
import { AIToolsForgeView } from './AIToolsForgeView';
import { ForgeAiLab } from './forge/ForgeAiLab';
import { ForgeExperienceView } from './forge/ForgeExperienceView';
import { WorkbenchView } from './workbench/WorkbenchView';

export function PublicPortfolioView({ onOpenOperatorConsole }) {
  const [currentView, setCurrentView] = useState('home');
  const [selectedAgentForModal, setSelectedAgentForModal] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPackageForModal, setSelectedPackageForModal] = useState('ai-receptionist');
  const [activeTenSecDemoSysId, setActiveTenSecDemoSysId] = useState(null);
  const [isGlobalTryModalOpen, setIsGlobalTryModalOpen] = useState(false);
  const [trialCreditsUsed, setTrialCreditsUsed] = useState(32);
  const [activeWatchItHappenData, setActiveWatchItHappenData] = useState(null);
  const [isSimpleAuditModalOpen, setIsSimpleAuditModalOpen] = useState(false);
  const [simpleAuditPreFill, setSimpleAuditPreFill] = useState({});
  const [isReceptionistChatOpen, setIsReceptionistChatOpen] = useState(false);
  const [receptionistInitialPrompt, setReceptionistInitialPrompt] = useState(null);
  const [receptionistInitialWorker, setReceptionistInitialWorker] = useState('receptionist');
  const [isAppLaunchingModalOpen, setIsAppLaunchingModalOpen] = useState(false);

  const handleOpenSimpleAudit = (preFill = {}) => {
    setSimpleAuditPreFill(preFill);
    setIsSimpleAuditModalOpen(true);
  };

  const handleOpenReceptionistChat = (prompt = null, workerId = 'receptionist') => {
    setReceptionistInitialPrompt(prompt);
    setReceptionistInitialWorker(workerId);
    setIsReceptionistChatOpen(true);
  };

  // Check URL pathname, search params or hash on load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const search = window.location.search;
      const hash = window.location.hash.replace('#', '');

      if (path.startsWith('/app')) {
        const sub = path.replace('/app', '').replace('/', '') || 'dashboard';
        setCurrentView(`app-${sub}`);
      } else if (path.includes('/workbench') || search.includes('workbench=true')) {
        setCurrentView('workbench');
      } else if (path.includes('/lab')) {
        setCurrentView('lab');
      } else if (path.includes('/tools') || path.includes('/toolkit')) {
        setCurrentView('tools');
      } else if (path.includes('/experience')) {
        setCurrentView('experience');
      } else if (path.includes('/audit') || search.includes('audit=true')) {
        setCurrentView('audit');
      } else if (path.includes('/receptionist') || search.includes('receptionist=true') || hash === 'receptionist') {
        setIsReceptionistChatOpen(true);
      } else if (path.includes('/payment') || search.includes('payment=true')) {
        setIsPaymentModalOpen(true);
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
      } else {
        // Enforce opening at the start (top) of the page on initial load
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    }
  }, []);

  const handleNavigate = (target) => {
    if (target === 'try-forge-modal') {
      setIsGlobalTryModalOpen(true);
      return;
    }

    if (target === 'receptionist' || target === 'try-receptionist' || target === 'ai-receptionist' || target === 'live-receptionist') {
      handleOpenReceptionistChat();
      return;
    }

    if (target === 'payment' || target === 'deposit' || target === 'payment-modal') {
      setIsPaymentModalOpen(true);
      return;
    }

    if (target === 'app-dashboard' || target === 'operator-console' || target === 'launch-app') {
      setIsAppLaunchingModalOpen(true);
      return;
    }

    if (target.startsWith('app-')) {
      setIsAppLaunchingModalOpen(true);
      return;
    } else if (target === 'workbench' || target === 'lab' || target === 'tools' || target === 'toolkit' || target === 'experience' || target === 'audit' || target === 'home' || target.startsWith('system-') || target.startsWith('for-') || target.startsWith('industry-') || target.startsWith('solution-')) {
      setCurrentView(target === 'toolkit' ? 'tools' : target);
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
    // Receptionist: open live chat directly
    if (sysId === 'receptionist-agent' || sysId === 'ai-receptionist' || sysId === 'receptionist') {
      handleOpenReceptionistChat();
      return;
    }
    // Audit: navigate to audit page
    if (sysId === 'audit') {
      handleNavigate('audit');
      return;
    }
    // All other systems: open the TenSecondDemoModal (animated 5.5s clip)
    setActiveTenSecDemoSysId(sysId);
  };

  // Called by TenSecondDemoModal "TEST IN LIVE SANDBOX" — performs actual live action
  const handleTryLiveFromDemo = (sysId) => {
    setActiveTenSecDemoSysId(null);
    if (sysId === 'receptionist-agent' || sysId === 'ai-receptionist' || sysId === 'receptionist') {
      handleOpenReceptionistChat();
    } else if (sysId === 'audit') {
      handleNavigate('audit');
    } else {
      // For lead-agent, document-processor, email-agent, support-agent, appointment-agent
      // Open the audit/contact modal pre-filled with what system the user wants to demo
      const sysLabels = {
        'lead-agent': 'Speed-to-Lead Qualifier & CRM Sync',
        'document-processor': 'Document & OCR Automation Engine',
        'email-agent': 'Autonomous Email Triage & Reply Agent',
        'support-agent': 'Support & Knowledge RAG Agent',
        'appointment-agent': 'AI Appointment Booking System',
        'app-builder': 'Custom Multi-Agent System Builder',
      };
      handleOpenSimpleAudit({ whatToAutomate: sysLabels[sysId] || sysId });
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
    <div className="min-h-screen bg-[#070b12] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Universal Navbar */}
      <ForgeNavbar 
        onNavigate={handleNavigate} 
        onOpenAuditModal={() => handleOpenSimpleAudit()}
        currentView={currentView} 
      />

      {/* Main Experience Router */}
      <main>
        {currentView === 'home' && (
          <>
            {/* 1. HERO: Above-the-fold value pitch with realistic business automation product visual */}
            <ForgeHeroExecutive
              onOpenAuditModal={() => handleOpenSimpleAudit()}
              onScrollToDemo={() => handleNavigate('cinematic-workflow')}
            />

            {/* 2. THE PROBLEM: "Your customers don't wait" / 4 friction moments */}
            <CustomerPainSection 
              onOpenAuditModal={(data) => handleOpenSimpleAudit(data)}
            />

            {/* 3. FOUR CORE SERVICES: Problem -> Solution -> Concrete Example -> CTA */}
            <CoreServicesSection 
              onOpenAuditModal={(data) => handleOpenSimpleAudit(data)}
              onSelectService={(svcId) => handleOpenSimpleAudit({ whatToAutomate: svcId })}
            />

            {/* 4. THE "WOW" SECTION: Cinematic workflow from customer call to booked business action */}
            <CinematicWorkflowSection 
              onOpenAuditModal={() => handleOpenSimpleAudit()}
            />

            {/* 5. PRODUCT SHOWCASE: 5 realistic UI panels (AI Call, Lead, Appointment, Automation, Analytics) */}
            <ProductShowcasePanels 
              onOpenAuditModal={() => handleOpenSimpleAudit()}
            />

            {/* 6. LIVE INTERACTIVE AI RECEPTIONIST DEMO: Hands-on conversation with Elena/Marcus/Aria */}
            <section id="live-receptionist">
              <LiveAiReceptionistDemoSection 
                onOpenAuditModal={(data) => handleOpenSimpleAudit(data)}
              />
            </section>

            {/* 7. TARGET INDUSTRIES: Built for businesses where missed opportunities matter */}
            <IndustriesSection 
              onOpenAuditModal={(data) => handleOpenSimpleAudit(data)}
              onNavigate={handleNavigate}
            />

            {/* 8. HOW IT WORKS: 4-stage clear deployment timeline (Discover, Design, Build, Operate) */}
            <HowItWorksTimeline 
              onOpenAuditModal={() => handleOpenSimpleAudit()}
            />

            {/* 9. WHY RINE FORGE: Comparison matrix + 4 core pillars */}
            <WhyRineSection 
              onOpenAuditModal={() => handleOpenSimpleAudit()}
            />

            {/* 10. TRANSPARENT PRICING & 50% MILESTONE SETTLEMENT */}
            <PricingSection 
              onNavigate={handleNavigate}
              onOpenPaymentModal={(pkgId) => {
                setSelectedPackageForModal(pkgId);
                setIsPaymentModalOpen(true);
              }}
            />

            {/* 11. FREQUENTLY ASKED QUESTIONS */}
            <FaqSection 
              onNavigate={handleNavigate} 
              onOpenAuditModal={() => handleOpenSimpleAudit()}
            />

            {/* 12. HIGH-CONVERTING FINAL CTA */}
            <FinalCtaSection 
              onOpenAuditModal={() => handleOpenSimpleAudit()}
              onScrollToDemo={() => handleNavigate('live-receptionist')}
            />
          </>
        )}

        {/* Dedicated Forge AI Toolkit Sandbox Subpage (/tools) */}
        {currentView === 'tools' && (
          <div className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono font-bold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" /> FORGE AI TOOLKIT (SANDBOX)
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Experimental AI Utilities Suite
              </h1>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Test client-side autonomous generators directly in your browser.
                For production B2B revenue and operations automation, return to our{' '}
                <button onClick={() => handleNavigate('home')} className="text-teal-400 underline font-semibold hover:text-teal-300">
                  Core AI Systems
                </button>.
              </p>
            </div>
            <AIToolsForgeView />
          </div>
        )}

        {/* AI Business Workbench Subpage (/workbench) */}
        {currentView === 'workbench' && (
          <WorkbenchView />
        )}

        {/* The AI Lab Subpage (/lab) */}
        {currentView === 'lab' && (
          <ForgeAiLab onNavigate={handleNavigate} />
        )}

        {/* Cinematic OS Experience Simulator (/experience) */}
        {currentView === 'experience' && (
          <ForgeExperienceView onNavigate={handleNavigate} />
        )}

        {/* Lazy-loaded subpages: audit, system-*, for-*, industry-*, solution-* */}
        <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center text-teal-400 font-mono text-sm animate-pulse">Loading...</div>}>
          {currentView === 'audit' && (
            <AuditPage onNavigate={handleNavigate} />
          )}

          {currentView.startsWith('system-') && (
            <SystemDetailPage
              slug={currentView.replace('system-', '')}
              onNavigate={handleNavigate}
            />
          )}

          {currentView.startsWith('for-') && (
            <PersonalizedIndustryView
              industrySlug={currentView.replace('for-', '')}
              onNavigate={handleNavigate}
            />
          )}

          {currentView.startsWith('industry-') && (
            <IndustryDetailPage 
              slug={currentView.replace('industry-', '')} 
              onNavigate={handleNavigate}
              onOpenWorkflowModal={(agent) => setSelectedAgentForModal(agent)}
            />
          )}

          {currentView.startsWith('solution-') && (
            <SolutionDetailPage 
              slug={currentView.replace('solution-', '')} 
              onNavigate={handleNavigate}
            />
          )}
        </React.Suspense>
      </main>

      {/* Global Footer */}
      <ForgeFooter 
        onNavigate={handleNavigate} 
        onOpenOperatorConsole={onOpenOperatorConsole} 
        onOpenAuditModal={() => handleOpenSimpleAudit()} 
      />

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
          onTryLive={handleTryLiveFromDemo}
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

      {/* Universal V3 Phase 2 "Watch It Happen" Modal */}
      <WatchItHappenModal 
        isOpen={Boolean(activeWatchItHappenData)}
        onClose={() => setActiveWatchItHappenData(null)}
        demoData={activeWatchItHappenData}
      />

      {/* V3 Phase 3 Simple Audit Contact Modal */}
      <SimpleAuditContactModal 
        isOpen={isSimpleAuditModalOpen}
        onClose={() => setIsSimpleAuditModalOpen(false)}
        initialData={simpleAuditPreFill}
      />

      {/* Genuine V4 AI Receptionist Live Backend Chat Modal */}
      <RealAiReceptionistChat 
        isOpen={isReceptionistChatOpen}
        onClose={() => {
          setIsReceptionistChatOpen(false);
          setReceptionistInitialPrompt(null);
        }}
        initialPrompt={receptionistInitialPrompt}
        initialWorker={receptionistInitialWorker}
      />

      {/* Operator Console V5 Update Launching Soon Modal */}
      {isAppLaunchingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <div className="bg-[#0c101a] border border-white/[0.12] rounded-3xl max-w-lg w-full p-6 sm:p-8 text-center space-y-5 shadow-[0_25px_60px_rgba(0,0,0,0.7)] relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsAppLaunchingModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/[0.08]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto shadow-[0_0_20px_rgba(99,102,241,0.3)]">
              <Sparkles className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-mono font-bold uppercase">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                V5 Core Update
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Operator Console Launching Soon
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                The internal Rine Forge Operator Console is currently receiving multi-tenant scaling updates. Dedicated access is reserved for verified client deployments.
              </p>
            </div>

            <div className="p-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl text-xs text-slate-300 space-y-1.5 text-left font-mono">
              <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Live Client Production Active
              </div>
              <div className="text-[11px] text-slate-400">All 4 autonomous agents (Elena, Marcus, Aria, Kael) are actively serving clients. Deploy your system below to get instant private staging.</div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  setIsAppLaunchingModalOpen(false);
                  setSelectedPackageForModal('speed-to-lead');
                  setIsPaymentModalOpen(true);
                }}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all"
              >
                Deploy System ($99 Deposit) →
              </button>
              <button
                onClick={() => setIsAppLaunchingModalOpen(false)}
                className="py-3 px-5 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08] rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
