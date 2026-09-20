import React, { useState } from 'react';
import { 
  Bot, Sparkles, ArrowRight, Check, CheckCircle2, 
  MessageSquare, PhoneCall, Mail, Globe, Shield, RefreshCw
} from 'lucide-react';

const BUSINESS_TYPES = [
  { id: 'dental', label: 'Dental / Medical Clinic', icon: '🦷' },
  { id: 'restaurant', label: 'Hospitality & Dining', icon: '🥩' },
  { id: 'law', label: 'Law Firm / Legal Practice', icon: '⚖️' },
  { id: 'hotel', label: 'Boutique Hotel & Resort', icon: '🏨' },
  { id: 'cleaning', label: 'Aesthetics & Wellness Spa', icon: '✨' },
  { id: 'agency', label: 'Enterprise B2B Consulting', icon: '🚀' },
];

const ROLES = [
  { id: 'reception', label: 'Front-Desk & Voice Concierge', desc: 'Answers calls, explains services, provides hours & directions' },
  { id: 'booking', label: 'Calendar Scheduling & Slot Locking', desc: 'Checks live availability, reserves appointments, syncs CRM' },
  { id: 'leads', label: 'Inbound & Outbound Pipeline Triage', desc: 'Qualifies intent, gathers contact details, scores opportunity' },
  { id: 'support', label: '24/7 Client Care & Protocols', desc: 'Provides instant grounded answers with zero hallucinations' },
];

const CHANNELS = [
  { id: 'voice', label: 'Live Phone & Voice', icon: PhoneCall },
  { id: 'whatsapp', label: 'WhatsApp Direct', icon: MessageSquare },
  { id: 'webchat', label: 'Website Concierge', icon: Globe },
  { id: 'email', label: 'Automated Dispatch', icon: Mail },
];

const TONES = [
  { id: 'prof', label: 'Authoritative & Executive', desc: 'Poised, precise, and reassuring' },
  { id: 'warm', label: 'Warm & High-Touch Hospitality', desc: 'Welcoming, caring, and patient-first' },
  { id: 'direct', label: 'Rapid & Solution-Driven', desc: 'Concise, high-velocity, and results-focused' },
];

export function AiEmployeeBuilderMini({ onConnectToGenerator }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBiz, setSelectedBiz] = useState(BUSINESS_TYPES[0]);
  const [selectedRoles, setSelectedRoles] = useState(['reception', 'booking']);
  const [selectedChannels, setSelectedChannels] = useState(['voice', 'webchat']);
  const [selectedTone, setSelectedTone] = useState(TONES[0]);
  const [employeeName, setEmployeeName] = useState('Elena');

  const toggleRole = (roleId) => {
    if (selectedRoles.includes(roleId)) {
      if (selectedRoles.length > 1) setSelectedRoles(selectedRoles.filter(r => r !== roleId));
    } else {
      setSelectedRoles([...selectedRoles, roleId]);
    }
  };

  const toggleChannel = (chId) => {
    if (selectedChannels.includes(chId)) {
      if (selectedChannels.length > 1) setSelectedChannels(selectedChannels.filter(c => c !== chId));
    } else {
      setSelectedChannels([...selectedChannels, chId]);
    }
  };

  return (
    <div className="bg-[#0e1320]/85 backdrop-blur-2xl rounded-3xl border border-white/[0.09] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 sm:p-10 max-w-4xl mx-auto space-y-8">
      {/* Title & Step Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-mono font-semibold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Interactive Blueprint Studio
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Configure Your Autonomous AI Employee
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Design your custom agent capabilities, communication channels, and persona in 5 simple steps.
        </p>
      </div>

      {/* 5 Step Indicator */}
      <div className="flex items-center justify-between max-w-md mx-auto relative pb-2">
        {[1, 2, 3, 4, 5].map((stepNum) => (
          <button
            key={stepNum}
            onClick={() => setCurrentStep(stepNum)}
            className={`w-9 h-9 rounded-full text-xs font-bold font-mono flex items-center justify-center transition-all relative z-10 ${
              currentStep === stepNum
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-[0_0_16px_rgba(99,102,241,0.5)] ring-4 ring-indigo-500/20'
                : currentStep > stepNum
                ? 'bg-emerald-500/90 text-white'
                : 'bg-white/[0.05] border border-white/[0.08] text-slate-500'
            }`}
          >
            {currentStep > stepNum ? <Check className="w-4 h-4" /> : stepNum}
          </button>
        ))}
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-white/[0.08] z-0" />
      </div>

      {/* Step Content */}
      <div className="min-h-[260px] flex flex-col justify-center">
        {/* Step 1: Business Type */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="text-xs font-semibold text-slate-400 text-center uppercase tracking-wider">
              Step 1: Select Your Industry Sector
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {BUSINESS_TYPES.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBiz(b)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    selectedBiz.id === b.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                      : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.08] text-slate-300'
                  }`}
                >
                  <div className="text-2xl mb-1.5">{b.icon}</div>
                  <div className="text-xs font-bold text-white">{b.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: What should AI handle? */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="text-xs font-semibold text-slate-400 text-center uppercase tracking-wider">
              Step 2: Assign Core Operational Responsibilities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ROLES.map((r) => {
                const isSelected = selectedRoles.includes(r.id);
                return (
                  <button
                    key={r.id}
                    onClick={() => toggleRole(r.id)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                        : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.08] text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-white">{r.label}</div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">{r.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Where should customers contact it? */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="text-xs font-semibold text-slate-400 text-center uppercase tracking-wider">
              Step 3: Select Active Communication Channels
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CHANNELS.map((c) => {
                const Icon = c.icon;
                const isSelected = selectedChannels.includes(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => toggleChannel(c.id)}
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                        : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.08] text-slate-300'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mx-auto mb-2 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <div className="text-xs font-bold text-white">{c.label}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: AI Tone & Name */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200 max-w-xl mx-auto w-full">
            <h3 className="text-xs font-semibold text-slate-400 text-center uppercase tracking-wider">
              Step 4: Configure Persona & Branding
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Assigned Agent Name</label>
                <input
                  type="text"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.12] rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="e.g. Elena, Marcus, Aria"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs text-slate-400 font-medium">Conversational Demeanor</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {TONES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTone(t)}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        selectedTone.id === t.id
                          ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold shadow-sm'
                          : 'bg-white/[0.03] border-white/[0.08] text-slate-300'
                      }`}
                    >
                      <div className="text-white font-semibold">{t.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Preview & Create */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-in fade-in duration-200 max-w-md mx-auto w-full">
            <h3 className="text-xs font-semibold text-slate-400 text-center uppercase tracking-wider">
              Step 5: Architectural Blueprint Review
            </h3>
            <div className="bg-white/[0.04] border border-white/[0.1] rounded-2xl p-5 space-y-3.5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-black text-sm shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                  {employeeName[0]}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{employeeName}</div>
                  <div className="text-xs text-indigo-300">{selectedBiz.icon} {selectedBiz.label}</div>
                </div>
              </div>

              <div className="pt-2.5 border-t border-white/[0.08] space-y-1.5 text-xs text-slate-300">
                <div><span className="text-slate-500 font-medium">Persona:</span> {selectedTone.label}</div>
                <div><span className="text-slate-500 font-medium">Channels:</span> {selectedChannels.join(', ').toUpperCase()}</div>
                <div><span className="text-slate-500 font-medium">Protocols:</span> {selectedRoles.join(', ')}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
        <button
          onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
        >
          Previous
        </button>

        {currentStep < 5 ? (
          <button
            onClick={() => setCurrentStep(prev => Math.min(5, prev + 1))}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all"
          >
            <span>Next Step</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={() => {
              if (onConnectToGenerator) {
                onConnectToGenerator({
                  name: employeeName,
                  category: selectedBiz.label,
                  tone: selectedTone.label
                });
              }
            }}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
          >
            <span>Deploy Architecture Blueprint</span>
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
