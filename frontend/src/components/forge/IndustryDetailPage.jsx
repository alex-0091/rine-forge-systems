import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, ArrowRight, Building2, CheckCircle2, AlertTriangle, 
  Sparkles, Layers, Cpu, ShieldCheck, DollarSign, Calculator, Zap 
} from 'lucide-react';
import { FORGE_INDUSTRIES, FORGE_AGENTS } from '../../data/siteData';

export function IndustryDetailPage({ slug, onNavigate, onOpenWorkflowModal }) {
  const [companyName, setCompanyName] = useState('');
  
  // Extract ?company= param
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search) {
      const params = new URLSearchParams(window.location.search);
      const c = params.get('company') || params.get('c');
      if (c) setCompanyName(c);
    }
  }, []);

  const industry = FORGE_INDUSTRIES.find(ind => ind.slug === slug) || FORGE_INDUSTRIES[0];

  // Pre-configured ROI Calculator State for this industry
  const [monthlyLeads, setMonthlyLeads] = useState(industry.monthlyLeadsDefault || 100);
  const [dealValue, setDealValue] = useState(industry.avgDealValueDefault || 2500);
  const [missedPct, setMissedPct] = useState(25);

  const missedInquiries = Math.round(monthlyLeads * (missedPct / 100));
  const recoveredDeals = Math.round(missedInquiries * 0.35);
  const recoveredRevenue = recoveredDeals * dealValue;

  const relevantAgents = FORGE_AGENTS.filter(agent => 
    industry.agents.some(agentName => agent.name.toLowerCase().includes(agentName.toLowerCase()) || agentName.toLowerCase().includes(agent.name.toLowerCase()))
  );

  return (
    <div className="py-12 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Back navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate && onNavigate('industries')}
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-teal-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Industries
        </button>

        <span className="text-xs font-mono px-3 py-1 rounded-md bg-teal-500/10 border border-teal-500/20 text-teal-400 font-bold">
          VERTICAL ARCHITECTURE SPEC
        </span>
      </div>

      {/* Hero Section */}
      <div className="space-y-6 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono font-bold">
          <Building2 className="w-3.5 h-3.5" /> {industry.name}
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          {companyName ? (
            <>AI Automation Systems for <span className="text-teal-400">{companyName}</span></>
          ) : (
            <>AI Systems for <span className="text-teal-400">{industry.name}</span></>
          )}
        </h1>

        <p className="text-lg sm:text-xl text-teal-300/90 font-medium leading-relaxed">
          {industry.tagline}
        </p>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          {industry.heroProblem}
        </p>

        <div className="flex flex-wrap gap-4 pt-2">
          <button
            onClick={() => onNavigate && onNavigate('audit')}
            className="px-6 py-3.5 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl text-xs transition-all shadow-xl shadow-teal-500/20 flex items-center gap-2"
          >
            <span>GET FREE {industry.name.split(' ')[0].toUpperCase()} AI AUDIT</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Problems vs FORGE Solutions Matrix */}
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider">
            Operational Comparison
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Manual Breakdown vs. Autonomous FORGE System
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Manual Bottlenecks */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0b0f19] border border-rose-500/20 space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase">
              <AlertTriangle className="w-4 h-4" /> Typical Manual Bottlenecks
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
              {industry.problems.map((prob, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">✕</span>
                  <span>{prob}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* FORGE System Outcomes */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0b0f19] border border-teal-500/30 space-y-4">
            <div className="flex items-center gap-2 text-teal-400 font-mono text-xs font-bold uppercase">
              <CheckCircle2 className="w-4 h-4" /> What FORGE Engineers & Deploys
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-200">
              {industry.solutions.map((sol, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">✓</span>
                  <span>{sol}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Relevant AI Agents Section */}
      <div className="space-y-6 pt-4">
        <div className="space-y-2">
          <div className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider">
            Recommended Agentic Architecture
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Key Modular Agents for {industry.name.split('&')[0]}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relevantAgents.map((agent) => (
            <div
              key={agent.id}
              className="p-6 rounded-2xl bg-[#0b0f19] border border-slate-800 hover:border-teal-500/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 font-bold">
                  {agent.badge}
                </div>
                <h3 className="text-lg font-bold text-white">{agent.name}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{agent.role}</p>
                <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                  <div><strong className="text-slate-300">Input:</strong> {agent.input}</div>
                  <div><strong className="text-slate-300">Action:</strong> {agent.action}</div>
                </div>
              </div>

              <button
                onClick={() => onOpenWorkflowModal && onOpenWorkflowModal(agent)}
                className="w-full py-2 bg-slate-900 hover:bg-teal-500/10 text-teal-400 border border-slate-800 hover:border-teal-500/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <span>View Full Execution Sequence</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Industry Custom ROI Calculator */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#0a0f19] border border-slate-800 space-y-8">
        <div className="space-y-2">
          <div className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider flex items-center gap-2">
            <Calculator className="w-4 h-4" /> Customized Opportunity Model
          </div>
          <h2 className="text-2xl font-bold text-white">
            Estimate Recovered Revenue for {industry.name.split('&')[0]}
          </h2>
          <p className="text-xs text-slate-400">
            Adjust the sliders below to estimate the commercial impact of sub-60-second response and automated qualification.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Sliders (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-slate-300">
                <span>Monthly Inbound Inquiries / Leads</span>
                <span className="font-bold text-teal-400">{monthlyLeads} leads</span>
              </div>
              <input
                type="range"
                min="20"
                max="500"
                step="10"
                value={monthlyLeads}
                onChange={(e) => setMonthlyLeads(Number(e.target.value))}
                className="w-full accent-teal-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-slate-300">
                <span>Average Deal / Client Value</span>
                <span className="font-bold text-teal-400">${dealValue.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="500"
                max="30000"
                step="500"
                value={dealValue}
                onChange={(e) => setDealValue(Number(e.target.value))}
                className="w-full accent-teal-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-slate-300">
                <span>Estimated Delayed / Uncontacted Rate</span>
                <span className="font-bold text-rose-400">{missedPct}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                step="5"
                value={missedPct}
                onChange={(e) => setMissedPct(Number(e.target.value))}
                className="w-full accent-rose-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Results Display (5 Cols) */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-teal-500/30 space-y-4 text-center">
            <div className="text-xs font-mono text-slate-400 uppercase">Projected Annual Pipeline Recaptured</div>
            <div className="text-3xl sm:text-4xl font-black text-teal-400">
              ${(recoveredRevenue * 12).toLocaleString()}
            </div>
            <div className="text-xs text-slate-300 font-mono">
              ~ ${recoveredRevenue.toLocaleString()} / month in reclaimed deals
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              * Based on recovering 35% of otherwise delayed or abandoned inquiries through sub-60-second autonomous qualification.
            </p>
            <button
              onClick={() => onNavigate && onNavigate('audit')}
              className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl text-xs transition-all shadow-md"
            >
              Get Custom Blueprint For My Business
            </button>
          </div>

        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-teal-950/30 via-slate-900 to-indigo-950/30 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="text-lg font-bold text-white">
            Ready to deploy an autonomous system for your {industry.name.split('&')[0]} operations?
          </div>
          <div className="text-xs text-slate-400">
            Submit your workflow details for a free, fixed-scope 48-hour engineering blueprint.
          </div>
        </div>
        <button
          onClick={() => onNavigate && onNavigate('audit')}
          className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl text-xs transition-all shadow-md shrink-0 flex items-center gap-2"
        >
          <span>Request Free AI Audit</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
