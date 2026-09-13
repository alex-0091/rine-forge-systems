import React, { useState } from 'react';
import { Calculator, ArrowRight, TrendingUp, Clock, Users, DollarSign, MessageSquare, Zap, Sparkles } from 'lucide-react';
import { forgeAudioSynth } from '../../utils/forgeAudioSynth';

export function RoiCalculatorSection({ onNavigate }) {
  const [employees, setEmployees] = useState(4);
  const [messagesPerDay, setMessagesPerDay] = useState(65);
  const [leadsPerMonth, setLeadsPerMonth] = useState(80);
  const [hoursRepetitive, setHoursRepetitive] = useState(12);

  // Dynamic calculations based on user inputs
  // Base repetitive hours = employees * hoursRepetitive * 4.2 weeks
  // Automation factor = ~75% of administrative, scheduling, and data entry can be automated
  const rawMonthlyHours = employees * hoursRepetitive * 4.2;
  const automatedHoursMonth = Math.round(rawMonthlyHours * 0.75);

  // Monetary value saved assuming modest $32/hr loaded cost
  const estimatedSavingsMonth = automatedHoursMonth * 32;

  // Faster response lead capture recovery (typically 15% more leads converted when responded under 1 min)
  const additionalLeadsConverted = Math.max(1, Math.round(leadsPerMonth * 0.15));

  return (
    <section id="opportunity-calculator" className="py-20 sm:py-28 border-b border-slate-800/80 bg-[#080d1a] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold tracking-wider uppercase shadow-sm">
            <Calculator className="w-3.5 h-3.5 text-teal-400" />
            <span>AI OPPORTUNITY CALCULATOR</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            HOW MUCH TIME CAN <br />
            <span className="text-teal-400">YOUR BUSINESS SAVE?</span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Move the sliders below. See your estimated hours recovered and automated revenue capacity in real time.
          </p>
        </div>

        {/* Interactive Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
          
          {/* Left: 4 Interactive Sliders (7 cols) */}
          <div className="lg:col-span-7 bg-[#091120] border-2 border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-400" />
                <span>Your Business Parameters</span>
              </span>
              <span className="text-[10px] font-mono text-teal-400 font-bold bg-teal-500/10 px-2.5 py-0.5 rounded border border-teal-500/20">
                100% Free Estimator
              </span>
            </div>

            {/* Slider 1: Employees */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300 font-semibold font-sans">How many team members?</span>
                <span className="text-teal-400 font-bold">{employees} employees</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                step="1"
                value={employees}
                onChange={(e) => {
                  setEmployees(Number(e.target.value));
                  forgeAudioSynth.playClick();
                }}
                className="w-full accent-teal-400 bg-slate-950 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 2: Customer messages per day */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300 font-semibold font-sans">Customer messages / day (calls + WhatsApp):</span>
                <span className="text-cyan-400 font-bold">{messagesPerDay} inquiries / day</span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                step="5"
                value={messagesPerDay}
                onChange={(e) => {
                  setMessagesPerDay(Number(e.target.value));
                  forgeAudioSynth.playClick();
                }}
                className="w-full accent-cyan-400 bg-slate-950 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 3: Inbound leads per month */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300 font-semibold font-sans">Inbound leads / month:</span>
                <span className="text-violet-400 font-bold">{leadsPerMonth} leads / mo</span>
              </div>
              <input
                type="range"
                min="10"
                max="300"
                step="5"
                value={leadsPerMonth}
                onChange={(e) => {
                  setLeadsPerMonth(Number(e.target.value));
                  forgeAudioSynth.playClick();
                }}
                className="w-full accent-violet-400 bg-slate-950 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 4: Hours spent on repetitive tasks */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300 font-semibold font-sans">Hours spent on repetitive admin / staff / week:</span>
                <span className="text-amber-400 font-bold">{hoursRepetitive} hrs / week</span>
              </div>
              <input
                type="range"
                min="2"
                max="40"
                step="1"
                value={hoursRepetitive}
                onChange={(e) => {
                  setHoursRepetitive(Number(e.target.value));
                  forgeAudioSynth.playClick();
                }}
                className="w-full accent-amber-400 bg-slate-950 h-2 rounded-lg cursor-pointer"
              />
            </div>

          </div>

          {/* Right: Output Card (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#0e1a2a] via-[#09121d] to-[#070c14] border-2 border-teal-500/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl flex flex-col justify-between relative overflow-hidden">
            
            <div className="space-y-6">
              
              <div className="space-y-1">
                <div className="text-[10px] font-mono font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>YOUR ESTIMATED AUTOMATION OPPORTUNITY</span>
                </div>
                <div className="text-4xl sm:text-5xl font-black text-white font-sans tracking-tight">
                  {automatedHoursMonth} hrs <span className="text-teal-400 text-2xl font-bold">/ month</span>
                </div>
                <div className="text-xs text-slate-300 font-mono">
                  Potentially automated with zero human fatigue.
                </div>
              </div>

              {/* Breakdown Metric Pills */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">Recovered Labor Value:</span>
                  <strong className="text-emerald-400 text-sm">~${estimatedSavingsMonth.toLocaleString()} / mo</strong>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">Extra Converted Leads:</span>
                  <strong className="text-cyan-300 text-sm">+{additionalLeadsConverted} booked deals / mo</strong>
                </div>
              </div>

              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Based on an average 75% automation rate across scheduling, CRM updates, invoice parsing, and sub-minute lead engagement.
              </p>

            </div>

            {/* High-Converting CTA Button (#18) */}
            <button
              onClick={() => {
                forgeAudioSynth.playSuccess();
                if (onNavigate) onNavigate('audit');
              }}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-dark-950 font-mono text-xs font-black flex items-center justify-center gap-2 transition-all shadow-xl shadow-teal-500/25 group"
            >
              <span>LET FORGE FIND THE REST →</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}
