import React, { useState } from 'react';
import { 
  Layers, ArrowRight, Star, Zap, CheckCircle2, 
  Sparkles, Filter, Activity, Bot, Send, FileText, 
  MessageSquare, Search 
} from 'lucide-react';
import { SYSTEMS_CATALOG } from '../../data/forgePlatformConfig';

export function SystemsMarketplace({ onNavigate }) {
  const [activeCategory, setActiveCategory] = useState('ALL');

  const categories = [
    { id: 'ALL', label: 'All Systems' },
    { id: 'Sales & Growth', label: 'Sales & Inbound' },
    { id: 'Operations & Triage', label: 'Operations & Back-Office' },
    { id: 'Customer Support', label: 'Customer Support' },
    { id: 'Research & Intelligence', label: 'Research & Intelligence' },
    { id: 'FinTech & Intelligence', label: 'FinTech & Quant' }
  ];

  const filteredSystems = activeCategory === 'ALL'
    ? SYSTEMS_CATALOG
    : SYSTEMS_CATALOG.filter(s => s.category === activeCategory);

  return (
    <section id="systems" className="py-24 border-t border-slate-800 bg-[#060a12] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-mono font-bold tracking-wider uppercase">
              <Layers className="w-3.5 h-3.5" /> THE FORGE SYSTEM LIBRARY
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Production AI Systems Catalog
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Explore purpose-built autonomous systems. Test any workflow in sandbox mode, connect your business tools, and launch your 14-day free trial.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate && onNavigate('app-builder')}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Build Custom System</span>
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold shrink-0 transition-all border ${
                  isActive
                    ? 'bg-teal-500 text-dark-950 border-teal-400 shadow-md shadow-teal-500/20'
                    : 'bg-[#090e18] text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Systems Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSystems.map((sys) => (
            <div
              key={sys.id}
              className="p-6 rounded-3xl bg-[#090e18] border border-slate-800/90 hover:border-teal-500/40 transition-all flex flex-col justify-between space-y-6 group relative"
            >
              <div className="space-y-4">
                {/* Top Badge & Metric */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 font-bold">
                    {sys.badge}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold font-mono">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{sys.rating}</span>
                  </div>
                </div>

                {/* Title & Headline */}
                <div className="space-y-1.5">
                  <h3 className="text-xl font-bold text-white group-hover:text-teal-300 transition-colors">
                    {sys.name}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-normal">
                    {sys.headline}
                  </p>
                </div>

                {/* Operational Telemetry Tags */}
                <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800/80 font-mono text-[10px] text-center">
                  <div className="p-1.5 bg-slate-900/80 rounded-lg">
                    <div className="text-slate-400">Target SLA</div>
                    <div className="font-bold text-emerald-400">{sys.successRate}</div>
                  </div>
                  <div className="p-1.5 bg-slate-900/80 rounded-lg">
                    <div className="text-slate-400">Bench Latency</div>
                    <div className="font-bold text-teal-300">{sys.avgLatency}</div>
                  </div>
                  <div className="p-1.5 bg-slate-900/80 rounded-lg">
                    <div className="text-slate-400">Spec Capacity</div>
                    <div className="font-bold text-slate-200">{(sys.executionsTotal / 1000).toFixed(1)}k/mo</div>
                  </div>
                </div>

                {/* Integrations previews */}
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-slate-400">Integrates with:</div>
                  <div className="flex flex-wrap gap-1 text-[10px] font-mono text-slate-300">
                    {sys.supportedIntegrations.slice(0, 4).map((tool, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                        {tool}
                      </span>
                    ))}
                    {sys.supportedIntegrations.length > 4 && (
                      <span className="px-1.5 py-0.5 text-slate-500 font-bold">
                        +{sys.supportedIntegrations.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => onNavigate && onNavigate(`system-${sys.slug}`)}
                  className="w-full py-2.5 bg-dark-900 hover:bg-slate-850 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all text-center"
                >
                  View System
                </button>
                <button
                  onClick={() => onNavigate && onNavigate('app-onboarding')}
                  className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 text-dark-950 font-extrabold rounded-xl text-xs transition-all shadow-md text-center flex items-center justify-center gap-1"
                >
                  <span>Try Free</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
