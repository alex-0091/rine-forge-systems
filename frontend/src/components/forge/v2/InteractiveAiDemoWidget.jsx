import React, { useState } from 'react';
import { 
  Bot, Sparkles, CheckCircle2, ArrowRight, 
  Clock, DollarSign, Send, RefreshCw, Zap, ShieldCheck, Check
} from 'lucide-react';
import { forgeAudioSynth } from '../../../utils/forgeAudioSynth';

const BUSINESS_PRESETS = [
  {
    id: 'dental',
    name: '🦷 Dental Clinic',
    query: 'I run a busy dental clinic with 3 doctors and 2 front-desk receptionists.',
    hoursSaved: '38 hours / month',
    valueSaved: '$2,280 / month',
    processes: [
      { name: 'Patient Appointment Booking', desc: 'Direct Dentrix / Curve calendar sync via voice & WhatsApp with zero phone hold times.', tag: 'Voice + Web' },
      { name: 'After-Hours Dental Triage', desc: 'Emergency triage identifies tooth pain severity and assigns on-call dentist slots.', tag: '24/7 Voice' },
      { name: 'Intake Forms & PPO Verification', desc: 'Automated SMS forms collection and instant Delta Dental / MetLife verification.', tag: 'SMS Workflow' },
      { name: 'No-Show & Recall Follow-ups', desc: 'Automatic 6-month hygiene recall sequences and 2-way confirmation pings.', tag: 'Re-activation' },
      { name: 'Google Review Collection', desc: 'Post-appointment satisfaction sentiment check that prompts 5-star Google reviews.', tag: 'Reputation' }
    ]
  },
  {
    id: 'hotel',
    name: '🏨 Boutique Hotel',
    query: 'I manage a 45-room boutique hotel and resort.',
    hoursSaved: '44 hours / month',
    valueSaved: '$2,640 / month',
    processes: [
      { name: 'Front Desk AI Concierge', desc: 'Answers guest queries on early check-in, parking, and amenities via WhatsApp & web.', tag: 'WhatsApp' },
      { name: 'Direct Booking Engine', desc: 'Converts website inquiries directly into Opera PMS reservations avoiding OTA fees.', tag: 'PMS Sync' },
      { name: 'Mobile Check-in & Key Delivery', desc: 'Automated digital registration cards and contactless arrival passes.', tag: 'Check-in' },
      { name: 'Amenity & Dining Reservations', desc: 'Spa and rooftop restaurant table bookings with real-time table management.', tag: 'Booking' },
      { name: 'Post-Stay Feedback & VIP Sync', desc: 'Captures TripAdvisor reviews and syncs VIP guest preferences for future visits.', tag: 'Loyalty' }
    ]
  },
  {
    id: 'real-estate',
    name: '🏠 Real Estate Brokerage',
    query: 'I run a residential real estate brokerage with 12 listing agents.',
    hoursSaved: '52 hours / month',
    valueSaved: '$3,120 / month',
    processes: [
      { name: 'Sub-45s Zillow & Web Lead Ingestion', desc: 'Engages inbound buyer leads within 45 seconds via 2-way SMS questionnaire.', tag: 'Speed-to-Lead' },
      { name: '0–100 ICP Pre-Approval Qualification', desc: 'Screens budget, timeline, and mortgage pre-approval before routing to agents.', tag: 'Scoring' },
      { name: 'Private Showing Scheduling', desc: 'Coordinates buyer and seller schedules for open houses and VIP walkthroughs.', tag: 'Calendar' },
      { name: 'CRM Enrichment & Sync', desc: 'Logs notes and tags into Follow Up Boss or HubSpot with zero manual typing.', tag: 'CRM Auto-Sync' },
      { name: 'Past Client Anniversary Pings', desc: 'Automated 1-year home purchase anniversary check-ins and referral requests.', tag: 'Referrals' }
    ]
  },
  {
    id: 'law-firm',
    name: '⚖️ Law Firm',
    query: 'I run a personal injury and estate planning law practice.',
    hoursSaved: '46 hours / month',
    valueSaved: '$3,450 / month',
    processes: [
      { name: '24/7 Confidential Client Intake', desc: 'Collects case facts, accident dates, and injury details with zero hold times.', tag: 'HIPAA Intake' },
      { name: 'Conflict of Interest Check', desc: 'Verifies party names against firm conflict database before consultation booking.', tag: 'Compliance' },
      { name: 'Attorney Consultation Scheduling', desc: 'Direct Clio / Outlook calendar sync with retainer deposit payment collection.', tag: 'Booking' },
      { name: 'Document & Police Report Collection', desc: 'Automated reminder sequences for clients to upload photos, medical bills & records.', tag: 'Doc Parser' },
      { name: 'Case Status SMS Notifications', desc: 'Answers repetitive "what is happening with my case" calls automatically.', tag: 'Client Portal' }
    ]
  },
  {
    id: 'hvac',
    name: '🔧 Plumbing & HVAC',
    query: 'I own an HVAC and plumbing company with 8 service vans.',
    hoursSaved: '48 hours / month',
    valueSaved: '$2,880 / month',
    processes: [
      { name: 'Emergency Night Dispatch', desc: 'Triages heating/cooling outages after hours and pings on-call technician.', tag: 'Emergency Voice' },
      { name: 'Zip Code Territory Routing', desc: 'Ensures technicians only get assigned jobs in their designated service territory.', tag: 'Dispatch' },
      { name: 'ServiceTitan / Housecall Pro Sync', desc: 'Creates job tickets with unit make, model, and customer symptom descriptions.', tag: 'Field ERP' },
      { name: 'Quote Follow-Up Automation', desc: 'Pings homeowners who received a replacement estimate 48 hours ago.', tag: 'Follow-ups' },
      { name: 'Annual Maintenance Club Re-activation', desc: 'Dispatches seasonal tune-up booking links to past customers twice a year.', tag: 'Recurring' }
    ]
  },
  {
    id: 'restaurant',
    name: '🍽️ Restaurant & Hospitality',
    query: 'I run an Italian restaurant with private dining and catering.',
    hoursSaved: '34 hours / month',
    valueSaved: '$2,040 / month',
    processes: [
      { name: 'Large Party & Event Inquiries', desc: 'Collects headcount, prefix menu preferences, and event date in 30 seconds.', tag: 'Events' },
      { name: 'OpenTable / Resy Voice Booking', desc: 'Answers phone calls during busy dinner rush and books tables without human distraction.', tag: 'Phone Res' },
      { name: 'Catering Quote Generation', desc: 'Calculates per-person tray pricing and emails professional PDF quote immediately.', tag: 'Catering' },
      { name: 'Dietary & Allergy FAQ Concierge', desc: 'Answers gluten-free, vegan, and parking queries instantly on WhatsApp.', tag: 'FAQ' },
      { name: 'VIP Dining Club Sequences', desc: 'Sends birthday wine incentives and holiday table booking invites to regular patrons.', tag: 'Retention' }
    ]
  }
];

export function InteractiveAiDemoWidget({ onNavigate, onSelectSystem }) {
  const [selectedPresetId, setSelectedPresetId] = useState('dental');
  const [customInput, setCustomInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const currentPreset = BUSINESS_PRESETS.find(p => p.id === selectedPresetId) || BUSINESS_PRESETS[0];

  const handleSelectPreset = (id) => {
    forgeAudioSynth.playClick();
    setIsAnalyzing(true);
    setSelectedPresetId(id);
    setTimeout(() => {
      setIsAnalyzing(false);
      forgeAudioSynth.playSuccess();
    }, 450);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    forgeAudioSynth.playClick();
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      forgeAudioSynth.playSuccess();
    }, 600);
  };

  return (
    <section className="py-20 sm:py-28 border-b border-slate-800/80 bg-[#070d18] relative" id="interactive-demo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold tracking-wider uppercase shadow-sm">
            <Bot className="w-3.5 h-3.5 text-teal-400" />
            <span>INTERACTIVE AI CONSULTANT</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            TELL ME WHAT YOUR <br />
            <span className="text-teal-400">BUSINESS DOES.</span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Click your industry below or type your business. Our AI system will immediately scan your workflow and identify 5 high-friction tasks you can automate today.
          </p>
        </div>

        {/* 🤖 Interactive Sandbox Card */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-b from-[#0d1628] to-[#080e1a] border-2 border-teal-500/40 p-6 sm:p-9 shadow-2xl space-y-7 relative">
          
          {/* Top Bar: Virtual Agent Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400 flex items-center justify-center text-xl shadow-lg shadow-teal-500/20">
                🤖
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span>FORGE AI WORKFLOW DETECTOR</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-[11px] text-teal-400 font-mono">
                  Autonomous Operational Opportunity Scanner
                </div>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400">
              100% Free Sandbox
            </span>
          </div>

          {/* Quick Clickable Industry Presets */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase font-bold tracking-wider">
              1-Click Industry Presets:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {BUSINESS_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                    selectedPresetId === preset.id
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-400 text-dark-950 border-teal-300 shadow-md font-black'
                      : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Or Type Custom Input Form */}
          <form onSubmit={handleCustomSubmit} className="flex gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Or type your business (e.g. I run a commercial roofing company with 5 estimators)..."
              className="flex-1 px-4 py-3 bg-[#060a12] border border-slate-700 rounded-xl text-white text-xs font-sans placeholder-slate-500 focus:outline-none focus:border-teal-400"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-teal-500 hover:bg-teal-400 text-dark-950 font-mono text-xs font-black rounded-xl transition-all flex items-center gap-1.5 shadow-lg shadow-teal-500/20 shrink-0"
            >
              <span>Scan My Work</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* AI Reasoning State or Results Display */}
          {isAnalyzing ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3 font-mono text-xs text-teal-300 animate-pulse">
              <RefreshCw className="w-6 h-6 animate-spin text-teal-400" />
              <div>Analyzing operations & identifying high-friction manual bottlenecks...</div>
            </div>
          ) : (
            <div className="space-y-6 pt-2">
              
              {/* Output Headline & Hours Saved Badge */}
              <div className="p-4 rounded-2xl bg-[#0a1220] border border-teal-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>FOUND 5 AUTOMATION OPPORTUNITIES:</span>
                  </div>
                  <div className="text-sm font-bold text-white font-sans pt-0.5">
                    {currentPreset.query}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 text-right shrink-0">
                  <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Estimated Savings:</div>
                  <div className="text-sm font-black text-emerald-300 font-mono">
                    {currentPreset.hoursSaved} ({currentPreset.valueSaved})
                  </div>
                </div>
              </div>

              {/* 5 Discovered Processes */}
              <div className="space-y-2.5">
                {currentPreset.processes.map((proc, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#060b14] border border-slate-800/90 hover:border-teal-500/40 transition-all flex items-start justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-white group-hover:text-teal-300 transition-colors font-sans">
                          {proc.name}
                        </div>
                        <div className="text-[11px] text-slate-300 font-sans leading-relaxed">
                          {proc.desc}
                        </div>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400 font-bold shrink-0">
                      {proc.tag}
                    </span>
                  </div>
                ))}
              </div>

              {/* Direct Action Bar */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-950/40 via-[#0a1424] to-[#070d18] border border-teal-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-black text-white font-sans">
                    Ready to build these 5 automated processes?
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Launch a working pilot for your business in 48 hours.
                  </div>
                </div>

                <button
                  onClick={() => {
                    forgeAudioSynth.playSuccess();
                    if (onNavigate) onNavigate('audit');
                  }}
                  className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-dark-950 font-mono text-xs font-black rounded-xl transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 shrink-0"
                >
                  <span>BUILD THIS SYSTEM →</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
}
