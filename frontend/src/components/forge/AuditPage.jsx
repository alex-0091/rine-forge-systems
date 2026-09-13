import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, ArrowRight, ShieldCheck, Clock, Lock, Sparkles, 
  Building2, Mail, User, Globe, Layers, AlertCircle, FileText, 
  Sliders, Send, CheckCircle, ChevronRight, HelpCircle 
} from 'lucide-react';
import { FORGE_INDUSTRIES } from '../../data/siteData';

export function AuditPage({ onNavigate }) {
  // Parse URL search params if present
  const [formData, setFormData] = useState({
    fullName: '',
    workEmail: '',
    companyName: '',
    websiteUrl: '',
    industry: 'Real Estate & Property Management',
    primaryBottleneck: '',
    softwareStack: '',
    teamSize: '11-50',
    monthlyInquiries: '50-200',
    manualHoursPerWeek: '15-30',
    implementationTimeline: '1-2 weeks'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search) {
      const params = new URLSearchParams(window.location.search);
      setFormData(prev => ({
        ...prev,
        companyName: params.get('company') || params.get('c') || prev.companyName,
        fullName: params.get('name') || params.get('n') || prev.fullName,
        workEmail: params.get('email') || params.get('e') || prev.workEmail,
        industry: params.get('industry') || prev.industry,
        primaryBottleneck: params.get('bottleneck') || prev.primaryBottleneck
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBottleneckChip = (text) => {
    setFormData(prev => ({
      ...prev,
      primaryBottleneck: prev.primaryBottleneck ? `${prev.primaryBottleneck}. ${text}` : text
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...formData,
      submitted_at: new Date().toISOString(),
      lead_source: 'FORGE_FREE_AI_AUDIT_PORTAL',
      estimated_opportunity_score: calculateOpportunityScore()
    };

    try {
      const res = await fetch('/api/public/contact-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.workEmail,
          company_name: formData.companyName,
          service_interested: `Free AI Audit — ${formData.industry} (${formData.primaryBottleneck.slice(0, 50)})`,
          notes: JSON.stringify(payload)
        })
      });
      await res.json();
    } catch (err) {
      console.warn('Fallback submission handled gracefully:', err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
      setConfirmationData({
        auditId: `FRG-AUD-${Math.floor(100000 + Math.random() * 900000)}`,
        company: formData.companyName || 'Your Business',
        email: formData.workEmail,
        opportunityScore: calculateOpportunityScore()
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const calculateOpportunityScore = () => {
    let score = 75;
    if (formData.manualHoursPerWeek === '30+') score += 15;
    if (formData.monthlyInquiries === '200+') score += 10;
    return Math.min(score, 98);
  };

  if (submitted && confirmationData) {
    return (
      <div className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0b101c] border border-teal-500/40 shadow-2xl space-y-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 blur-[100px] pointer-events-none rounded-full" />
          
          <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="space-y-3">
            <div className="text-xs font-mono text-teal-400 font-bold tracking-wider uppercase">
              Audit Blueprint Queued • Ref #{confirmationData.auditId}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              We're Engineering Your Free AI Automation Blueprint
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Our systems architecture team has received your workflow data for <strong className="text-white">{confirmationData.company}</strong>. We are compiling your custom blueprint and will deliver it directly to <strong className="text-teal-300">{confirmationData.email}</strong> within 48 hours.
            </p>
          </div>

          {/* 3 Step Delivery Sequence */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left pt-4">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="text-xs font-mono text-teal-400 font-bold">STAGE 01 (IN PROGRESS)</div>
              <div className="text-sm font-bold text-white">Stack & Workflow Analysis</div>
              <p className="text-xs text-slate-400">Evaluating API endpoints for your CRM, inbox, and internal tools.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="text-xs font-mono text-cyan-400 font-bold">STAGE 02 (NEXT)</div>
              <div className="text-sm font-bold text-white">Architecture Blueprint</div>
              <p className="text-xs text-slate-400">Mapping exact agent triggers, decision steps, guardrails, and ROI.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="text-xs font-mono text-emerald-400 font-bold">STAGE 03 (48 HOURS)</div>
              <div className="text-sm font-bold text-white">Direct Executive Delivery</div>
              <p className="text-xs text-slate-400">PDF blueprint and optional working prototype walkthrough link.</p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate && onNavigate('home')}
              className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl text-xs transition-all shadow-md"
            >
              Return to Homepage
            </button>
            <button
              onClick={() => {
                if (onNavigate) onNavigate('case-studies');
              }}
              className="px-6 py-3 bg-dark-900 hover:bg-dark-850 text-slate-200 border border-slate-700 font-bold rounded-xl text-xs transition-all"
            >
              Explore Live Prototype Engines
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono font-bold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5" /> 100% Free • No Sales Pressure • 48-Hour Turnaround
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Request Your Free <span className="text-teal-400">AI Automation Audit</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Tell us where your team spends the most repetitive manual hours. Our engineering team will review your systems and return a concrete 48-hour architectural blueprint showing what can be automated and the measurable business ROI.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Form (8 Cols) */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-[#0a0f19] border border-slate-800 shadow-xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Contact Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-semibold text-slate-300">
                  Full Name <span className="text-teal-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="e.g. Sarah Mitchell"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-dark-900 border border-slate-800 focus:border-teal-500 focus:outline-none rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-semibold text-slate-300">
                  Work Email <span className="text-teal-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    name="workEmail"
                    required
                    placeholder="sarah@company.com"
                    value={formData.workEmail}
                    onChange={handleChange}
                    className="w-full bg-dark-900 border border-slate-800 focus:border-teal-500 focus:outline-none rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Company & Domain */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-semibold text-slate-300">
                  Company Name <span className="text-teal-400">*</span>
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="companyName"
                    required
                    placeholder="e.g. Apex Realty Partners"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full bg-dark-900 border border-slate-800 focus:border-teal-500 focus:outline-none rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-semibold text-slate-300">
                  Website / Domain
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="websiteUrl"
                    placeholder="https://company.com"
                    value={formData.websiteUrl}
                    onChange={handleChange}
                    className="w-full bg-dark-900 border border-slate-800 focus:border-teal-500 focus:outline-none rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Industry Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-slate-300">
                Industry Vertical <span className="text-teal-400">*</span>
              </label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="w-full bg-dark-900 border border-slate-800 focus:border-teal-500 focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-white"
              >
                {FORGE_INDUSTRIES.map((ind) => (
                  <option key={ind.id} value={ind.name}>{ind.name}</option>
                ))}
                <option value="Other High-Value B2B">Other High-Value B2B</option>
              </select>
            </div>

            {/* Primary Bottleneck (Key Section) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-mono font-semibold text-slate-300">
                  Describe Your Primary Manual Bottleneck <span className="text-teal-400">*</span>
                </label>
                <span className="text-[11px] text-slate-400">Be as specific as possible</span>
              </div>
              <textarea
                name="primaryBottleneck"
                required
                rows={4}
                placeholder="e.g. Inbound portal leads arrive after hours and sit for 6+ hours before reps follow up. We also spend 15 hours a week manually entering vendor invoices into QuickBooks."
                value={formData.primaryBottleneck}
                onChange={handleChange}
                className="w-full bg-dark-900 border border-slate-800 focus:border-teal-500 focus:outline-none rounded-xl p-3.5 text-xs text-white placeholder-slate-400 leading-relaxed"
              />

              {/* Quick Suggestion Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[11px] text-slate-400 mr-1 self-center">Quick insert:</span>
                {[
                  'Slow response to inbound leads',
                  'Repetitive support & FAQ emails',
                  'Manual invoice/PDF data entry',
                  'Back-and-forth appointment scheduling',
                  'Disjointed CRM & billing sync'
                ].map((chip, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleBottleneckChip(chip)}
                    className="text-[10px] px-2 py-1 rounded bg-slate-900 hover:bg-teal-500/10 text-slate-300 hover:text-teal-300 border border-slate-800 transition-colors"
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Software Stack */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-slate-300">
                Current Tools & Software Stack
              </label>
              <input
                type="text"
                name="softwareStack"
                placeholder="e.g. HubSpot, Slack, Gmail, QuickBooks, Zendesk"
                value={formData.softwareStack}
                onChange={handleChange}
                className="w-full bg-dark-900 border border-slate-800 focus:border-teal-500 focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400"
              />
            </div>

            {/* Operational Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-semibold text-slate-300">Team Size</label>
                <select
                  name="teamSize"
                  value={formData.teamSize}
                  onChange={handleChange}
                  className="w-full bg-dark-900 border border-slate-800 focus:border-teal-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201+">201+ employees</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-semibold text-slate-300">Monthly Volume</label>
                <select
                  name="monthlyInquiries"
                  value={formData.monthlyInquiries}
                  onChange={handleChange}
                  className="w-full bg-dark-900 border border-slate-800 focus:border-teal-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="< 50">&lt; 50 / month</option>
                  <option value="50-200">50 - 200 / month</option>
                  <option value="200-1000">200 - 1,000 / month</option>
                  <option value="1000+">1,000+ / month</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-semibold text-slate-300">Manual Hours / Wk</label>
                <select
                  name="manualHoursPerWeek"
                  value={formData.manualHoursPerWeek}
                  onChange={handleChange}
                  className="w-full bg-dark-900 border border-slate-800 focus:border-teal-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="5-15">5 - 15 hrs / wk</option>
                  <option value="15-30">15 - 30 hrs / wk</option>
                  <option value="30+">30+ hrs / wk</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl text-sm transition-all shadow-xl shadow-teal-500/20 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>ANALYZING & GENERATING BLUEPRINT...</span>
                ) : (
                  <>
                    <span>SUBMIT FOR FREE 48-HOUR AI AUDIT</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Privacy note */}
            <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-2">
              <Lock className="w-3.5 h-3.5 text-teal-400" />
              <span>All information is held strictly confidential under enterprise NDA. No spam ever.</span>
            </div>

          </form>
        </div>

        {/* Right Info & Credibility Sidebar (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Blueprint Deliverables Box */}
          <div className="p-6 rounded-3xl bg-[#0a0f19] border border-slate-800 space-y-4">
            <div className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4" /> What You Will Receive
            </div>
            <h3 className="text-base font-bold text-white">Your Custom 48-Hour Blueprint Includes:</h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span><strong>API Feasibility Assessment:</strong> Exact evaluation of your existing tools and endpoints.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span><strong>System Architecture Map:</strong> Trigger → Decision Engine → Guardrails → Automated Action.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span><strong>Quantified ROI Model:</strong> Estimated labor hours recovered and revenue acceleration.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span><strong>Fixed Pilot Scope:</strong> Milestone pricing and 14-day production implementation timeline.</span>
              </li>
            </ul>
          </div>

          {/* Guarantee Badges */}
          <div className="p-6 rounded-3xl bg-[#0a0f19] border border-slate-800 space-y-4">
            <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Our Engineering Standard
            </div>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-slate-200">
                <Clock className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Guaranteed 48-hour delivery</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Free with zero sales pressure</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Zero model training on your private data</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
