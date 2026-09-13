import React, { useState } from 'react';
import { 
  Calculator, Sparkles, CheckCircle2, ArrowRight, 
  Clock, Users, MessageSquare, Building2, Check, RefreshCw 
} from 'lucide-react';
import { forgeAudioSynth } from '../../../utils/forgeAudioSynth';

const BUSINESS_TYPES = [
  'Hotel',
  'Dental',
  'Real Estate',
  'Restaurant',
  'Automotive',
  'Other'
];

const EMPLOYEE_OPTIONS = [
  { label: '1 Employee', value: 1 },
  { label: '2–4 Employees', value: 3 },
  { label: '5–9 Employees', value: 7 },
  { label: '10+ Employees', value: 12 }
];

const ENQUIRY_OPTIONS = [
  { label: '10–25 / day', value: 18 },
  { label: '25–50 / day', value: 38 },
  { label: '50–100 / day', value: 75 },
  { label: '100+ / day', value: 140 }
];

const TIME_OPTIONS = [
  { label: '1–2 hours / day', value: 1.5 },
  { label: '2–3 hours / day', value: 2.5 },
  { label: '3–4 hours / day', value: 3.5 },
  { label: '4+ hours / day', value: 5 }
];

export function HowMuchCouldYouAutomate({ onOpenAuditModal }) {
  const [businessType, setBusinessType] = useState('Dental');
  const [employees, setEmployees] = useState(EMPLOYEE_OPTIONS[1]);
  const [enquiries, setEnquiries] = useState(ENQUIRY_OPTIONS[1]);
  const [timeSpent, setTimeSpent] = useState(TIME_OPTIONS[1]);
  const [hasCalculated, setHasCalculated] = useState(true);

  // Dynamic estimate calculation
  // Conservative estimate: ~40% of repetitive inquiry hours can be automated autonomously
  const calculateHoursPerMonth = () => {
    const rawHoursMonthly = employees.value * timeSpent.value * 22; // 22 working days
    const estimatedSaved = Math.round(rawHoursMonthly * 0.55);
    return Math.max(35, Math.min(estimatedSaved, 420));
  };

  const estimatedHours = calculateHoursPerMonth();

  const handleSelectOption = (setter, val) => {
    forgeAudioSynth.playClick();
    setter(val);
    setHasCalculated(true);
  };

  const handleGetAudit = () => {
    forgeAudioSynth.playSuccess();
    if (onOpenAuditModal) {
      onOpenAuditModal({
        businessType,
        whatToAutomate: `Automating customer enquiries (${enquiries.label}) and eliminating ~${estimatedHours} hours/month of repetitive front-desk tasks.`
      });
    }
  };

  return (
    <section className="py-16 sm:py-24 border-b border-slate-800/80 bg-[#060a14] relative overflow-hidden" id="automation-calculator">
      {/* Subtle Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-indigo-500/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold tracking-wider uppercase shadow-sm">
            <Calculator className="w-3.5 h-3.5 text-teal-400" />
            <span>AI AUTOMATION AUDIT & ESTIMATOR</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            HOW MUCH COULD YOU AUTOMATE?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            Answer 4 quick questions about your business operations to calculate your estimated repetitive workload reduction.
          </p>
        </div>

        {/* Interactive Calculator Box */}
        <div className="rounded-3xl bg-[#090f1e]/90 border-2 border-slate-800 p-6 sm:p-9 shadow-2xl space-y-8 backdrop-blur-md">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Left: The 4 Questions */}
            <div className="space-y-6">
              
              {/* Question 1: What type of business do you run? */}
              <div className="space-y-2.5">
                <label className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-teal-400" />
                  <span>1. What type of business do you run?</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {BUSINESS_TYPES.map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleSelectOption(setBusinessType, type)}
                      className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all border ${
                        businessType === type
                          ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md shadow-teal-500/20 scale-[1.02]'
                          : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: How many employees handle customer enquiries? */}
              <div className="space-y-2.5">
                <label className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span>2. How many employees handle customer enquiries?</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {EMPLOYEE_OPTIONS.map(opt => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => handleSelectOption(setEmployees, opt)}
                      className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all border ${
                        employees.label === opt.label
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20 scale-[1.02]'
                          : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3: How many customer enquiries do you receive per day? */}
              <div className="space-y-2.5">
                <label className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  <span>3. How many customer enquiries do you receive per day?</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ENQUIRY_OPTIONS.map(opt => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => handleSelectOption(setEnquiries, opt)}
                      className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all border ${
                        enquiries.label === opt.label
                          ? 'bg-indigo-500 text-white border-indigo-400 shadow-md shadow-indigo-500/20 scale-[1.02]'
                          : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 4: How much time is spent on repetitive tasks? */}
              <div className="space-y-2.5">
                <label className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>4. How much time is spent on repetitive tasks?</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {TIME_OPTIONS.map(opt => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => handleSelectOption(setTimeSpent, opt)}
                      className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all border ${
                        timeSpent.label === opt.label
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20 scale-[1.02]'
                          : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Right: Dynamic Calculated Estimate */}
            <div className="rounded-2xl bg-gradient-to-b from-[#0b1426] to-[#060c18] border-2 border-teal-500/40 p-6 sm:p-7 space-y-6 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <span className="text-xs font-mono font-bold text-teal-300 uppercase tracking-wider">
                    YOUR AUTOMATION OPPORTUNITY
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    24/7 AVAILABILITY
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <div className="text-[11px] font-mono text-slate-400 uppercase">
                      POTENTIAL REPETITIVE WORK AUTOMATED:
                    </div>
                    <div className="text-3xl sm:text-4xl font-black text-white mt-1">
                      ~{estimatedHours} hours<span className="text-sm font-mono text-teal-300 font-normal"> / month</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Based on {employees.label} receiving {enquiries.label} for a {businessType} operation.
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[11px] font-mono text-slate-300 font-bold uppercase">
                      POTENTIAL AUTOMATION AREAS:
                    </div>
                    <div className="space-y-1.5 text-xs text-slate-200">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Customer enquiries</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Lead qualification</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Scheduling</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Follow-ups</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Requirement: Clearly label calculations as estimates */}
              <div className="pt-4 border-t border-slate-800/80 space-y-3">
                <p className="text-[10px] text-slate-500 font-mono leading-relaxed">
                  * <strong>Estimate only:</strong> Calculations are directional operational projections based on typical workflow distributions and do not represent guaranteed time or cost savings.
                </p>

                <button
                  onClick={handleGetAudit}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-slate-950 font-black text-xs font-mono uppercase tracking-wider transition-all shadow-xl shadow-teal-500/20 flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
                >
                  <span>GET MY FREE AI AUDIT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* Requirement 3: FINAL CTA */}
        <div className="rounded-3xl bg-gradient-to-r from-[#0d1627] via-[#091122] to-[#070d1a] border-2 border-teal-500/40 p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-3">
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              READY TO GIVE REPETITIVE WORK TO AI?
            </h3>
            <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
              Tell us what your business does. We'll show you what Forge could automate.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleGetAudit}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-slate-950 font-black text-xs sm:text-sm font-mono tracking-wider uppercase transition-all shadow-2xl shadow-teal-500/25 hover:scale-105 active:scale-95"
            >
              <span>GET MY FREE AI AUDIT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-400 font-mono">
            Zero commitment • 48-hour delivery • Completely tailored to your software stack
          </p>
        </div>

      </div>
    </section>
  );
}
