import React, { useState } from 'react';
import { 
  Calculator, DollarSign, TrendingUp, Sparkles, 
  CheckCircle2, XCircle, ArrowRight, Clock, ShieldCheck, UserCheck 
} from 'lucide-react';
import { forgeAudioSynth } from '../../../utils/forgeAudioSynth';
import { ActionButton } from '../v4/ActionButton';

export function RoiRevenueCalculatorSection({ onOpenAuditModal }) {
  const [inquiriesPerMonth, setInquiriesPerMonth] = useState(45);
  const [customerValue, setCustomerValue] = useState(500);

  // Business math:
  // ~25% of inquiries occur after-hours or when staff are busy
  // Elena converts ~20% of otherwise lost leads into booked appointments
  const missedInquiries = Math.round(inquiriesPerMonth * 0.25);
  const recoveredBookings = Math.max(1, Math.round(missedInquiries * 0.20));
  const monthlyRecoveredRevenue = recoveredBookings * customerValue;
  const annualRecoveredRevenue = monthlyRecoveredRevenue * 12;

  const handleSliderChange = (setter, val) => {
    setter(Number(val));
    forgeAudioSynth.playClick();
  };

  return (
    <section className="py-20 sm:py-28 border-b border-slate-800/80 bg-[#070c18] relative" id="roi-calculator">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold tracking-wider uppercase shadow-sm">
            <Calculator className="w-3.5 h-3.5 text-emerald-400" />
            <span>FINANCIAL ROI ENGINE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            What Does One Missed Lead Cost You?
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Move the sliders to calculate how much revenue your business is leaving on the table from missed after-hours calls and delayed WhatsApp replies.
          </p>
        </div>

        {/* The Interactive Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
          
          {/* Sliders Input Panel (7 Cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-[#0b1220] border-2 border-emerald-500/30 p-6 sm:p-9 space-y-8 shadow-2xl flex flex-col justify-between">
            
            <div className="space-y-8">
              
              {/* Slider 1: Inquiries per month */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-white font-sans">
                    Monthly Inquiries & Calls:
                  </label>
                  <span className="text-lg font-black font-mono text-emerald-400">
                    {inquiriesPerMonth} inquiries / mo
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="250"
                  step="5"
                  value={inquiriesPerMonth}
                  onChange={(e) => handleSliderChange(setInquiriesPerMonth, e.target.value)}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>10 (Boutique practice)</span>
                  <span>125 (Busy clinic)</span>
                  <span>250+ (High volume)</span>
                </div>
              </div>

              {/* Slider 2: Average Customer / Booking Value */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-white font-sans">
                    Average Customer Value (Per Booking):
                  </label>
                  <span className="text-lg font-black font-mono text-emerald-400">
                    ${customerValue}
                  </span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="50"
                  value={customerValue}
                  onChange={(e) => handleSliderChange(setCustomerValue, e.target.value)}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>$100 (Hygiene/Cleaning)</span>
                  <span>$500 (Whitening/Exam)</span>
                  <span>$2,000+ (High-ticket)</span>
                </div>
              </div>

              {/* Formula Breakdown Callout */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs font-mono text-slate-300">
                <div className="text-[10px] uppercase text-slate-500 font-bold">Standard Industry Math:</div>
                <div className="text-slate-200">
                  {inquiriesPerMonth} inquiries × 25% after-hours = <strong className="text-white">~{missedInquiries} unassisted inquiries</strong>
                </div>
                <div className="text-slate-200">
                  {missedInquiries} inquiries × 20% Elena conversion = <strong className="text-emerald-400">+{recoveredBookings} recovered appointments / mo</strong>
                </div>
              </div>

            </div>

            <p className="text-[11px] font-mono text-slate-500 italic">
              *Numbers are illustrative examples based on typical dental and service business benchmark data.
            </p>
          </div>

          {/* Revenue Result & Comparison Panel (5 Cols) */}
          <div className="lg:col-span-5 rounded-3xl bg-gradient-to-b from-emerald-950/40 via-[#0a1816] to-[#060e0d] border-2 border-emerald-500/50 p-6 sm:p-9 space-y-6 shadow-2xl flex flex-col justify-between">
            
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                  POTENTIAL RECOVERED REVENUE
                </span>
                <div className="text-4xl sm:text-5xl font-black text-white font-mono mt-1">
                  ${monthlyRecoveredRevenue.toLocaleString()}
                  <span className="text-base text-slate-400 font-normal"> / mo</span>
                </div>
                <div className="text-sm font-mono text-emerald-300 font-bold mt-1">
                  ${annualRecoveredRevenue.toLocaleString()} / year recovered
                </div>
              </div>

              {/* Hiring Cost Comparison Box */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 font-sans text-xs">
                <div className="font-bold text-white uppercase font-mono text-[11px] border-b border-slate-800 pb-2">
                  vs. Hiring Another Full-Time Receptionist:
                </div>
                <div className="flex items-center justify-between text-rose-300">
                  <span>Full-Time Staff Salary + Benefits:</span>
                  <span className="font-mono font-bold">$3,500 – $4,500 / mo</span>
                </div>
                <div className="flex items-center justify-between text-emerald-300 font-bold">
                  <span>Rine Forge 24/7 AI Employee:</span>
                  <span className="font-mono">&lt; 1/10th the cost</span>
                </div>
              </div>

              <ul className="space-y-2 text-xs text-slate-300 font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>24/7 coverage (168 hours / week)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Zero sick days or vacation leave</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Sub-5 second instant replies</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-emerald-900/50">
              <ActionButton
                variant="primary"
                size="md"
                onClick={() => {
                  if (onOpenAuditModal) {
                    onOpenAuditModal({
                      whatToAutomate: `Recover potential $${monthlyRecoveredRevenue.toLocaleString()}/mo with 24/7 AI receptionist`
                    });
                  }
                }}
              >
                CLAIM YOUR RECOVERED REVENUE
              </ActionButton>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
