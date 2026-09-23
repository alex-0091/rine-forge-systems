import React, { useState } from 'react';
import { Calculator, DollarSign, ArrowRight, ShieldAlert, Sparkles, TrendingUp, HelpCircle } from 'lucide-react';
import { forgeAudioSynth } from '../../../utils/forgeAudioSynth';

export function InteractiveOpportunityCalculator({ onOpenAuditModal }) {
  // 5 Inputs as specified
  const [monthlyCalls, setMonthlyCalls] = useState(120);
  const [missedCallsPct, setMissedCallsPct] = useState(25);
  const [avgCustomerValue, setAvgCustomerValue] = useState(650);
  const [monthlyLeads, setMonthlyLeads] = useState(40);
  const [avgLeadConversion, setAvgLeadConversion] = useState(20);

  // Business calculations:
  // Missed calls per month
  const missedCallsCount = Math.round((monthlyCalls * missedCallsPct) / 100);
  // Recoverable call bookings (assuming modest 25% recovery of previously lost calls)
  const recoveredCallBookings = Math.round(missedCallsCount * 0.25);
  // Recoverable form inquiries (assuming 35% speed-to-lead lift on unconverted leads)
  const unconvertedLeads = Math.round(monthlyLeads * (1 - avgLeadConversion / 100));
  const recoveredLeadBookings = Math.round(unconvertedLeads * 0.20);

  const totalRecoveredOpportunities = recoveredCallBookings + recoveredLeadBookings;
  const estimatedMonthlyOpportunity = totalRecoveredOpportunities * avgCustomerValue;
  const estimatedAnnualOpportunity = estimatedMonthlyOpportunity * 12;

  const handleSlider = (setter, val) => {
    forgeAudioSynth.playClick();
    setter(Number(val));
  };

  return (
    <section id="roi-calculator" className="py-20 sm:py-28 bg-[#080c14] border-b border-white/[0.08] relative">
      
      {/* Background glow accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-500/[0.04] blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5 text-emerald-400" />
            <span>Interactive Financial Model</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Calculate Your Business Opportunity
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Adjust the sliders below to estimate the business revenue left on the table each month from unanswered phone calls and delayed lead response times.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
          
          {/* Left Column: 5 Interactive Sliders (7 cols) */}
          <div className="lg:col-span-7 bg-[#0c101a] border border-white/[0.1] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold border-b border-white/[0.08] pb-3">
              Your Current Monthly Operational Inputs
            </div>

            {/* Slider 1: Monthly Calls */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-semibold text-white">Monthly Inbound Calls:</span>
                <span className="font-mono font-bold text-emerald-400 text-base">{monthlyCalls} calls</span>
              </div>
              <input
                type="range"
                min="20"
                max="500"
                step="10"
                value={monthlyCalls}
                onChange={(e) => handleSlider(setMonthlyCalls, e.target.value)}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>20 calls</span>
                <span>250 calls</span>
                <span>500+ calls</span>
              </div>
            </div>

            {/* Slider 2: Missed Calls % */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-semibold text-white">Estimated Missed Calls %:</span>
                <span className="font-mono font-bold text-amber-400 text-base">{missedCallsPct}% (~{missedCallsCount} missed)</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={missedCallsPct}
                onChange={(e) => handleSlider(setMissedCallsPct, e.target.value)}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>5% (Low)</span>
                <span>25% (Industry Avg)</span>
                <span>50% (High)</span>
              </div>
            </div>

            {/* Slider 3: Average Customer Lifetime Value */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-semibold text-white">Average Customer Value:</span>
                <span className="font-mono font-bold text-indigo-400 text-base">${avgCustomerValue}</span>
              </div>
              <input
                type="range"
                min="100"
                max="3000"
                step="50"
                value={avgCustomerValue}
                onChange={(e) => handleSlider(setAvgCustomerValue, e.target.value)}
                className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>$100</span>
                <span>$1,500</span>
                <span>$3,000+</span>
              </div>
            </div>

            {/* Slider 4: Monthly Form Leads */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-semibold text-white">Monthly Web & Form Leads:</span>
                <span className="font-mono font-bold text-sky-400 text-base">{monthlyLeads} leads</span>
              </div>
              <input
                type="range"
                min="10"
                max="300"
                step="5"
                value={monthlyLeads}
                onChange={(e) => handleSlider(setMonthlyLeads, e.target.value)}
                className="w-full accent-sky-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>10 leads</span>
                <span>150 leads</span>
                <span>300+ leads</span>
              </div>
            </div>

            {/* Slider 5: Average Lead Conversion */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-semibold text-white">Current Lead Close Rate:</span>
                <span className="font-mono font-bold text-slate-300 text-base">{avgLeadConversion}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={avgLeadConversion}
                onChange={(e) => handleSlider(setAvgLeadConversion, e.target.value)}
                className="w-full accent-slate-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>5%</span>
                <span>30%</span>
                <span>60%</span>
              </div>
            </div>

          </div>

          {/* Right Column: Calculated Opportunity Output (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#0c1424] via-[#0a101d] to-[#070b12] border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xl">
            
            <div className="space-y-5">
              
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  ILLUSTRATIVE OPPORTUNITY
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  MONTHLY IMPACT
                </span>
              </div>

              {/* Big Metrics */}
              <div className="space-y-2">
                <div className="text-xs text-slate-400">Estimated Monthly Recoverable Revenue:</div>
                <div className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
                  ${estimatedMonthlyOpportunity.toLocaleString()}
                  <span className="text-xs text-slate-400 font-sans font-normal ml-2">/ month</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Estimated Annual Impact:</span>
                  <span className="text-emerald-400 font-bold font-mono text-sm">${estimatedAnnualOpportunity.toLocaleString()} / yr</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Recovered Opportunities:</span>
                  <span className="text-white font-bold font-mono">~{totalRecoveredOpportunities} clients / mo</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Missed Calls Avoided:</span>
                  <span className="text-white font-bold font-mono">{missedCallsCount} calls</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                By picking up calls on the first ring 24/7 and texting inbound inquiries within 60 seconds, your business protects high-intent clients from going to your competitors.
              </p>

            </div>

            {/* Action CTA */}
            <div className="space-y-4 pt-2">
              <button
                onClick={() => {
                  forgeAudioSynth.playSuccess();
                  if (onOpenAuditModal) {
                    onOpenAuditModal({ 
                      whatToAutomate: `Recovering ~${missedCallsCount} missed calls and ~$${estimatedMonthlyOpportunity.toLocaleString()}/mo opportunity` 
                    });
                  }
                }}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-[0_0_25px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <span>GET FREE AI AUDIT FOR YOUR NUMBERS</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* REQUIRED DISCLAIMER */}
              <div className="text-[11px] text-slate-500 leading-tight border-t border-white/[0.06] pt-3 text-center italic">
                * Illustrative opportunity estimate. Actual results vary by business, lead quality, conversion rates and implementation.
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
