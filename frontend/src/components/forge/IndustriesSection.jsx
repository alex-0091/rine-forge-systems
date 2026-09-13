import React from 'react';
import { 
  Building2, Stethoscope, HeartPulse, Scale, UtensilsCrossed, 
  ShoppingBag, Briefcase, HardHat, Landmark, Truck, ArrowRight 
} from 'lucide-react';
import { FORGE_INDUSTRIES } from '../../data/siteData';

const INDUSTRY_ICONS = {
  'real-estate': Building2,
  'dental': Stethoscope,
  'healthcare': HeartPulse,
  'legal': Scale,
  'hospitality': UtensilsCrossed,
  'ecommerce': ShoppingBag,
  'construction': HardHat,
  'logistics': Truck,
  'professional-services': Briefcase,
  'finance': Landmark
};

export function IndustriesSection({ onNavigate }) {
  return (
    <section id="industries" className="py-16 sm:py-24 border-b border-slate-800/80 bg-[#080c14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="text-xs font-mono font-bold text-teal-400 tracking-widest uppercase">
            VERTICAL EXPERTISE
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            BUILT FOR REAL BUSINESS.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Every sector has unique data structures, software stacks, and bottlenecks. Explore tailored systems engineered for your industry.
          </p>
        </div>

        {/* 10 Industry Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {FORGE_INDUSTRIES.map((ind) => {
            const Icon = INDUSTRY_ICONS[ind.id] || Building2;
            return (
              <button
                key={ind.id}
                onClick={() => onNavigate(`industry-${ind.slug}`)}
                className="bg-dark-900 border border-slate-800 hover:border-teal-500/40 rounded-2xl p-5 space-y-3 transition-all text-left flex flex-col justify-between shadow-lg group hover:-translate-y-0.5"
              >
                <div className="space-y-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 group-hover:bg-teal-500/20 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
                    {ind.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {ind.tagline}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-[10px] font-mono text-teal-400 font-bold">
                  <span>Explore Architecture</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}
