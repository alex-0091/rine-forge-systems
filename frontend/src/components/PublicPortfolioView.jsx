import React, { useState, useEffect } from 'react';
import { 
  Bot, Sparkles, Send, CheckCircle2, ArrowRight, 
  ExternalLink, Layers, ShieldCheck, Zap, MessageSquare, 
  Calendar, RefreshCw, Calculator, Terminal, TrendingUp,
  Cpu, Award, Building2, PhoneCall, Check, ArrowUpRight,
  Activity, Play, Flame, BarChart3, Database, Globe,
  Briefcase, DollarSign, School, CheckCircle, AlertTriangle,
  CreditCard, Wallet, Lock, Landmark, CheckCheck
} from 'lucide-react';

// Forge Master Components
import { ForgeNavbar } from './forge/ForgeNavbar';
import { ForgeHero } from './forge/ForgeHero';
import { ProblemSection } from './forge/ProblemSection';
import { WhatWeBuildSection } from './forge/WhatWeBuildSection';
import { RoiCalculatorSection } from './forge/RoiCalculatorSection';
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

// Ancillary Forge and Utility Views
import { PaymentPortalModal } from './PaymentPortalModal';
import { AIToolsForgeView } from './AIToolsForgeView';
import { FloatingAIAssistant } from './FloatingAIAssistant';
import { InteractiveVideoPlayerModal } from './InteractiveVideoPlayerModal';

export function PublicPortfolioView() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedAgentForModal, setSelectedAgentForModal] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPackageForModal, setSelectedPackageForModal] = useState('ai-receptionist');
  const [activeVideoModal, setActiveVideoModal] = useState(null);

  // Check URL query parameters or hash on load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const search = window.location.search;
      const hash = window.location.hash.replace('#', '');

      if (path.includes('/audit') || search.includes('audit=true')) {
        setCurrentView('audit');
      } else if (path.includes('/industries/') || search.includes('industry=')) {
        const slug = path.split('/industries/')[1] || new URLSearchParams(search).get('industry');
        if (slug) setCurrentView(`industry-${slug}`);
      } else if (path.includes('/solutions/') || search.includes('solution=')) {
        const slug = path.split('/solutions/')[1] || new URLSearchParams(search).get('solution');
        if (slug) setCurrentView(`solution-${slug}`);
      } else if (hash) {
        // Scroll to hash element if exists
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, []);

  const handleNavigate = (target) => {
    if (target === 'audit') {
      setCurrentView('audit');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'home') {
      setCurrentView('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target.startsWith('industry-')) {
      setCurrentView(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target.startsWith('solution-')) {
      setCurrentView(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // If we are currently on a subpage and user clicks a section anchor (e.g. 'solutions', 'industries', 'agents', 'about')
      if (currentView !== 'home') {
        setCurrentView('home');
        setTimeout(() => {
          const el = document.getElementById(target);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.getElementById(target);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 font-sans selection:bg-teal-500 selection:text-dark-950">
      
      {/* Top Universal Navbar */}
      <ForgeNavbar onNavigate={handleNavigate} currentView={currentView} />

      {/* Main View Router */}
      <main>
        {currentView === 'home' && (
          <>
            {/* 1. Hero with 5-stage live system visualization */}
            <ForgeHero onNavigate={handleNavigate} />

            {/* 2. Problem Section: Missed Leads, Repetitive Admin, etc. */}
            <ProblemSection onNavigate={handleNavigate} />

            {/* 3. What We Build: 5 Core Solution Areas */}
            <WhatWeBuildSection onNavigate={handleNavigate} />

            {/* 4. Interactive B2B ROI Opportunity Calculator */}
            <RoiCalculatorSection onNavigate={handleNavigate} />

            {/* 5. 6 Modular Autonomous AI Agents */}
            <AgentsSection 
              onNavigate={handleNavigate} 
              onOpenWorkflowModal={(agent) => setSelectedAgentForModal(agent)} 
            />

            {/* 6. Live Prototype Showcase (Oracle AI, Fact Fuel, Speed-to-Lead, etc.) */}
            <OracleShowcaseSection onNavigate={handleNavigate} />

            {/* 7. Technical Case Studies with Concrete Architectures */}
            <CaseStudiesSection onNavigate={handleNavigate} />

            {/* 8. 5-Stage How It Works (Audit -> Design -> Build -> Deploy -> Optimize) */}
            <HowItWorksSection onNavigate={handleNavigate} />

            {/* 9. Why FORGE: Core Engineering Tenets */}
            <WhyForgeSection />

            {/* 10. Security, Privacy & Compliance Architecture */}
            <SecuritySection />

            {/* 11. 10 Vertical Industry Solutions */}
            <IndustriesSection onNavigate={handleNavigate} />

            {/* 12. 15+ Interactive Free AI Tools */}
            <section id="tools-forge" className="py-20 border-t border-slate-800 bg-[#080d16]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                <div className="text-center space-y-3 max-w-3xl mx-auto">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-mono font-bold tracking-wider uppercase">
                    <Sparkles className="w-3.5 h-3.5" /> 100% Free • No Signup Required
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    The FORGE AI Utility Suite
                  </h2>
                  <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                    Test our autonomous generators directly in your browser. From cold outreach synthesizers and invoice parsers to ROI estimators and regex generators.
                  </p>
                </div>
                <AIToolsForgeView />
              </div>
            </section>

            {/* 13. Transparent Scopes & Pricing Models */}
            <PricingSection onNavigate={handleNavigate} />

            {/* 14. Frequently Asked Questions */}
            <FaqSection onNavigate={handleNavigate} />

            {/* 15. About FORGE & Leadership Team */}
            <AboutSection onNavigate={handleNavigate} />

            {/* 16. Final High-Impact Call to Action */}
            <FinalCtaSection onNavigate={handleNavigate} />
          </>
        )}

        {/* Audit Portal Subpage */}
        {currentView === 'audit' && (
          <AuditPage onNavigate={handleNavigate} />
        )}

        {/* Dynamic Industry Subpages */}
        {currentView.startsWith('industry-') && (
          <IndustryDetailPage 
            slug={currentView.replace('industry-', '')} 
            onNavigate={handleNavigate}
            onOpenWorkflowModal={(agent) => setSelectedAgentForModal(agent)}
          />
        )}

        {/* Dynamic Solution Subpages */}
        {currentView.startsWith('solution-') && (
          <SolutionDetailPage 
            slug={currentView.replace('solution-', '')} 
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Global Footer */}
      <ForgeFooter onNavigate={handleNavigate} />

      {/* Modals & Overlays */}
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

      {isPaymentModalOpen && (
        <PaymentPortalModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          initialService={selectedPackageForModal}
        />
      )}

      {activeVideoModal && (
        <InteractiveVideoPlayerModal
          isOpen={!!activeVideoModal}
          onClose={() => setActiveVideoModal(null)}
          title={activeVideoModal.name}
          videoHighlight={activeVideoModal.videoHighlight}
          videoLength={activeVideoModal.videoLength}
        />
      )}

      {/* Floating 24/7 AI Concierge */}
      <FloatingAIAssistant onOpenPaymentModal={(pkg) => {
        setSelectedPackageForModal(pkg || 'ai-receptionist');
        setIsPaymentModalOpen(true);
      }} />

    </div>
  );
}
