import React, { useState } from 'react';
import { Calculator, ArrowRight, TrendingUp, Clock, Users, DollarSign, Info } from 'lucide-react';

export function RoiCalculatorSection({ onNavigate }) {
  const [employees, setEmployees] = useState(6);
  const [hoursPerWeek, setHoursPerWeek] = useState(12);
  const [hourlyCost, setHourlyCost] = useState(38);
  const [monthlyLeads, setMonthlyLeads] = useState(140);
  const [customerValue, setCustomerValue] = useState(2200);

  // Calculations
  const totalAnnualHours = employees * hoursPerWeek * 50;
  const estimatedAnnualLabor = totalAnnualHours * hourlyCost;
  
  // Potential lead capture estimate: 20% of inbound leads typically missed/delayed; 25% recovered with sub-60s response
  const missedLeadsPerYear = monthlyLeads * 12 * 0.20;
  const recoveredCustomersPerYear = Math.round(missedLeadsPerYear * 0.25);
  const estimatedRevenueOpportunity = recoveredCustomersPerYear * customerValue;

  // Monthly capacity recovered (hours per month)
  const monthlyHoursRecovered = Math.round((totalAnnualHours / 12) * 0.75);

  return (
    <section id="roi-calculator" className="py-16 sm:py-24 border-b border-slate-800/80 bg-[#080c14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="text-xs font-mono font-bold text-teal-400 tracking-widest uppercase">
            WORKFLOW OPPORTUNITY MODELLING
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            WHAT COULD YOUR BUSINESS AUTOMATE?
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Adjust the parameters below to evaluate how much repetitive labor cost and missed revenue capacity can be recovered through intelligent automation.
          </p>
        </div>

        {/* Interactive Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Inputs Card */}
          <div className="lg:col-span-6 bg-dark-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-white uppercase">
                <Calculator className="w-4 h-4 text-teal-400" />
                <span>Operational Parameters</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Interactive Model</span>
            </div>

            {/* Parameter 1: Employees */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold">Number of team members doing repetitive work:</span>
                <span className="text-teal-400 font-mono font-bold">{employees} employees</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                step="1"
                value={employees}
                onChange={(e) => setEmployees(Number(e.target.value))}
                className="w-full accent-teal-500 bg-dark-950 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Parameter 2: Hours Per Week */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold">Hours per week spent on admin / copy-paste / follow-up:</span>
                <span className="text-teal-400 font-mono font-bold">{hoursPerWeek} hrs / week</span>
              </div>
              <input
                type="range"
                min="2"
                max="30"
                step="1"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                className="w-full accent-teal-500 bg-dark-950 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Parameter 3: Hourly Cost */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Average fully loaded hourly employee cost ($):</label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-slate-500 font-mono text-xs">$</span>
                <input
                  type="number"
                  min="15"
                  max="250"
                  value={hourlyCost}
                  onChange={(e) => setHourlyCost(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 bg-dark-950 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            {/* Parameter 4 & 5: Monthly Leads & Customer Value */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">Monthly Inbound Leads:</label>
                <input
                  type="number"
                  min="10"
                  max="5000"
                  value={monthlyLeads}
                  onChange={(e) => setMonthlyLeads(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-dark-950 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">Average Customer Value ($):</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-500 font-mono text-xs">$</span>
                  <input
                    type="number"
                    min="100"
                    max="100000"
                    value={customerValue}
                    onChange={(e) => setCustomerValue(Number(e.target.value))}
                    className="w-full pl-7 pr-3.5 py-2.5 bg-dark-950 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Calculated Outputs Card */}
          <div className="lg:col-span-6 bg-gradient-to-br from-dark-900 via-dark-950 to-dark-900 border border-teal-500/30 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xl">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider">
                  Modelled Business Opportunity
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-teal-500/10 text-teal-300 border border-teal-500/20 rounded font-bold">
                  ESTIMATED VALUE
                </span>
              </div>

              {/* 4 Output Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-4 bg-dark-950 rounded-2xl border border-slate-800 space-y-1">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Estimated Annual Labor Opportunity</div>
                  <div className="text-2xl sm:text-3xl font-black text-teal-400 font-mono">
                    ${estimatedAnnualLabor.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400">Current annual cost spent on repetitive work</div>
                </div>

                <div className="p-4 bg-dark-950 rounded-2xl border border-slate-800 space-y-1">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Potential Hours Recovered</div>
                  <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">
                    {totalAnnualHours.toLocaleString()} hrs
                  </div>
                  <div className="text-[10px] text-slate-400">Annual capacity redirected to high-value tasks</div>
                </div>

                <div className="p-4 bg-dark-950 rounded-2xl border border-slate-800 space-y-1">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Potential Monthly Capacity</div>
                  <div className="text-2xl sm:text-3xl font-black text-indigo-400 font-mono">
                    +{monthlyHoursRecovered} hrs/mo
                  </div>
                  <div className="text-[10px] text-slate-400">Additional team throughput without new hiring</div>
                </div>

                <div className="p-4 bg-dark-950 rounded-2xl border border-slate-800 space-y-1">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Potential Revenue Opportunity</div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                    ${estimatedRevenueOpportunity.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400">Estimated value of recovered speed-to-lead inquiries</div>
                </div>
              </div>
            </div>

            {/* Disclaimer & Action */}
            <div className="space-y-4 pt-4 border-t border-slate-800/80">
              <div className="flex items-start gap-2 text-[10px] font-mono text-slate-400 leading-relaxed bg-dark-950/80 p-3 rounded-xl border border-slate-850">
                <Info className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Disclaimer:</strong> Illustrative estimate based on the information provided. Actual results depend on workflow design, implementation, and team adoption.
                </span>
              </div>

              <button
                onClick={() => onNavigate('audit')}
                className="w-full py-4 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl text-xs sm:text-sm transition-all shadow-xl shadow-teal-500/20 flex items-center justify-center gap-2"
              >
                <span>FIND OUT WHAT FORGE COULD AUTOMATE →</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
