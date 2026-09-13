import React from 'react';
import { 
  ArrowLeft, ArrowRight, Building2, CheckCircle2, 
  Sparkles, Zap, Calculator, ShieldCheck, Star 
} from 'lucide-react';
import { FORGE_INDUSTRIES, FORGE_AGENTS } from '../../data/siteData';

export function PersonalizedIndustryView({ industrySlug, onNavigate }) {
  const industry = FORGE_INDUSTRIES.find(ind => ind.slug === industrySlug) || FORGE_INDUSTRIES[0];

  return (
    <div className="py-12 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 font-sans">
      
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate && onNavigate('industries')}
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-teal-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Solutions
        </button>

        <span className="text-xs font-mono px-3 py-1 rounded-md bg-teal-500/10 border border-teal-500/20 text-teal-400 font-bold uppercase">
          INDUSTRY SPECIALIZED OS • {industry.name.split('&')[0]}
        </span>
      </div>

      {/* Hero Section */}
      <div className="space-y-6 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono font-bold">
          <Building2 className="w-3.5 h-3.5" /> FORGE FOR {industry.name.toUpperCase()}
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          AI Systems Engineered for <span className="text-teal-400">{industry.name}</span>
        </h1>

        <p className="text-xl text-teal-300 font-semibold leading-relaxed">
          {industry.tagline}
        </p>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          {industry.heroProblem}
        </p>

        <div className="flex flex-wrap gap-4 pt-2">
          <button
            onClick={() => onNavigate && onNavigate('app-onboarding')}
            className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl text-xs font-mono transition-all shadow-xl shadow-teal-500/20 flex items-center gap-2"
          >
            <span>START 14-DAY {industry.name.split(' ')[0].toUpperCase()} TRIAL</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate && onNavigate('audit')}
            className="px-6 py-4 bg-dark-900 hover:bg-slate-850 text-slate-200 border border-slate-700 font-bold rounded-xl text-xs font-mono transition-all"
          >
            Get Free Architecture Audit
          </button>
        </div>
      </div>

      {/* Problems vs Solutions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-[#090e18] border border-rose-500/20 space-y-4">
          <div className="text-xs font-mono font-bold text-rose-400 uppercase">
            Typical Operational Friction
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

        <div className="p-6 sm:p-8 rounded-3xl bg-[#090e18] border border-teal-500/30 space-y-4">
          <div className="text-xs font-mono font-bold text-teal-400 uppercase">
            What FORGE Deploys
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
  );
}
