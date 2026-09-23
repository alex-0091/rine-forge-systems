import React, { useState } from 'react';
import { 
  PhoneCall, MessageSquare, Star, Sparkles, Send, 
  Copy, Check, Play, Pause, RotateCcw, Volume2, VolumeX, 
  ArrowRight, ShieldCheck, Zap, Users, Building2, Flame,
  FileCheck, Clock, Award, CheckCircle2, ChevronRight, Sliders, Cpu
} from 'lucide-react';
import { speechEngine } from '../../../utils/speechEngine';
import { forgeAudioSynth } from '../../../utils/forgeAudioSynth';

export function FreeBusinessAIToolsSection({ onOpenAuditModal }) {
  const [activeTab, setActiveTab] = useState('voice-tester');
  const [copiedId, setCopiedId] = useState(null);

  // 1. VOICE CALL TESTER STATE
  const [voiceBizName, setVoiceBizName] = useState('Apex Dental & Orthodontics');
  const [voiceIndustry, setVoiceIndustry] = useState('Dental Practice');
  const [isCalling, setIsCalling] = useState(false);
  const [callConnected, setCallConnected] = useState(false);
  const [callTimer, setCallTimer] = useState(0);
  const [callTranscript, setCallTranscript] = useState([]);

  // 2. SPEED-TO-LEAD SMS GENERATOR STATE
  const [inquiryType, setInquiryType] = useState('roof-leak');
  const [leadCustomerName, setLeadCustomerName] = useState('David Miller');
  const [leadServiceNeeded, setLeadServiceNeeded] = useState('Emergency roof leak inspection after storm');
  const [smsTone, setSmsTone] = useState('helpful');
  const [generatedSms, setGeneratedSms] = useState('');
  const [isGeneratingSms, setIsGeneratingSms] = useState(false);

  // 3. REVIEW RESPONDER STATE
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("Dr. Miller and his staff were incredible! I had acute molar pain and they got me in within 2 hours. Pain-free treatment and super kind front desk.");
  const [reviewResponse, setReviewResponse] = useState('');
  const [isGeneratingReview, setIsGeneratingReview] = useState(false);

  // 4. CUSTOM ARCHITECTURE GENERATOR STATE
  const [blueprintIndustry, setBlueprintIndustry] = useState('HVAC & Plumbing');
  const [blueprintTeamSize, setBlueprintTeamSize] = useState('5 to 15 team members');
  const [blueprintBottleneck, setBlueprintBottleneck] = useState('Missed evening & weekend emergency calls');
  const [generatedBlueprint, setGeneratedBlueprint] = useState(null);

  // Handle Voice Call Simulation
  const handleStartCall = () => {
    forgeAudioSynth.playClick();
    speechEngine.stopSpeaking();
    setIsCalling(true);
    setCallConnected(false);
    setCallTimer(0);
    setCallTranscript([
      { speaker: 'system', text: `Dialing virtual SIP trunk for ${voiceBizName}...` }
    ]);

    // Play ringing sound, then connect
    setTimeout(() => {
      setCallConnected(true);
      const greeting = `Thank you for calling ${voiceBizName}! My name is Elena, your 24/7 AI Receptionist. Are you looking to schedule an urgent appointment, or do you have a question about our services?`;
      
      setCallTranscript(prev => [
        ...prev,
        { speaker: 'ai', text: greeting }
      ]);

      // Speak using native Web Speech engine
      speechEngine.speak(greeting, {
        rate: 0.98,
        pitch: 1.05,
        onEnd: () => {
          setIsCalling(false);
        }
      });
    }, 1200);
  };

  const handleStopCall = () => {
    forgeAudioSynth.playClick();
    speechEngine.stopSpeaking();
    setIsCalling(false);
    setCallConnected(false);
  };

  // Handle SMS Generation
  const handleGenerateSms = () => {
    forgeAudioSynth.playClick();
    setIsGeneratingSms(true);

    setTimeout(() => {
      let sms = "";
      if (smsTone === 'urgent') {
        sms = `Hi ${leadCustomerName}, this is Sarah from dispatch! We received your emergency inquiry regarding "${leadServiceNeeded}". We have an on-call technician available in your area today. Please reply with your address or call us back directly to lock in immediate service.`;
      } else if (smsTone === 'friendly') {
        sms = `Hi ${leadCustomerName}! Thanks for reaching out about ${leadServiceNeeded}. We would love to take care of this for you! You can pick an exact time that works best for you right here: rine.link/book-${leadCustomerName.toLowerCase().replace(/\s+/g, '')} — or just text me your preferred day!`;
      } else {
        sms = `Hi ${leadCustomerName}, thank you for contacting us regarding "${leadServiceNeeded}". To ensure we get you an accurate quote and earliest availability, could you confirm your location and best time for a brief 5-minute phone consult? We are here to help!`;
      }
      setGeneratedSms(sms);
      setIsGeneratingSms(false);
      forgeAudioSynth.playSuccess();
    }, 400);
  };

  // Handle Review Response Generation
  const handleGenerateReview = () => {
    forgeAudioSynth.playClick();
    setIsGeneratingReview(true);

    setTimeout(() => {
      let resp = "";
      if (reviewRating >= 4) {
        resp = `Thank you so much for the wonderful feedback! Our entire team takes great pride in delivering fast, comfortable, and compassionate care when you need it most. We truly appreciate your trust and look forward to being here whenever you need us!`;
      } else {
        resp = `Thank you for taking the time to share your candid feedback. We hold ourselves to the highest service standards and regret that your experience did not meet expectations. We would appreciate the opportunity to make this right — please contact our management team directly at feedback@ourclinic.com so we can address your concerns immediately.`;
      }
      setReviewResponse(resp);
      setIsGeneratingReview(false);
      forgeAudioSynth.playSuccess();
    }, 450);
  };

  // Handle Blueprint Generation
  const handleGenerateBlueprint = () => {
    forgeAudioSynth.playClick();
    
    setGeneratedBlueprint({
      industry: blueprintIndustry,
      teamSize: blueprintTeamSize,
      bottleneck: blueprintBottleneck,
      systemName: `${blueprintIndustry.split(' ')[0]} Autonomous Revenue & Dispatch Core`,
      estHoursSaved: '16.5 hrs / week',
      annualImpact: '$42,000+ recovered opportunities',
      pipeline: [
        { stage: '1. Inbound Ingestion', tool: 'Twilio SIP Trunk + Webhooks', desc: 'Captures 100% of missed calls and forms 24/7/365 with zero queue delay.' },
        { stage: '2. Deterministic AI Triage', tool: 'Rine Voice Core + Guardrails', desc: 'Identifies caller emergency severity and verifies service feasibility.' },
        { stage: '3. Real-Time Calendar Lock', tool: 'Google / Outlook / Jobber Sync', desc: 'Reserves appointments with strict double-booking prevention.' },
        { stage: '4. Instant Staff Dispatch', tool: 'SMS + Push + CRM Pipeline', desc: 'Pushes complete caller audio transcript and booking directly to staff phones.' }
      ]
    });
    forgeAudioSynth.playSuccess();
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    forgeAudioSynth.playSuccess();
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="free-tools" className="py-20 sm:py-28 bg-[#060a12] border-b border-white/[0.08] relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[850px] h-[350px] bg-indigo-600/[0.06] blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-14 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Free Live Tools • No Login Required</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Test What Rine Forge Can Build <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-sky-200 to-white">
              For Your Business Right Now.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            We don't make theoretical promises. Use our free interactive business tools below to test live voice receptionist audio, generate instant follow-up SMS text, or blueprint your custom automation stack.
          </p>
        </div>

        {/* 4 Tool Selector Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none max-w-4xl mx-auto">
          {[
            { id: 'voice-tester', label: '1. AI Voice Tester', icon: PhoneCall, badge: 'AUDIO SYNTH' },
            { id: 'speed-sms', label: '2. Speed-to-Lead SMS', icon: MessageSquare, badge: 'SUB-45s' },
            { id: 'review-responder', label: '3. Google Review AI', icon: Star, badge: 'REPUTATION' },
            { id: 'blueprint-gen', label: '4. System Blueprint', icon: Sliders, badge: 'ARCHITECTURE' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  forgeAudioSynth.playClick();
                  setActiveTab(tab.id);
                }}
                className={`px-4 sm:px-5 py-3 rounded-2xl text-xs sm:text-sm font-mono font-bold flex items-center gap-2 shrink-0 transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-[0_0_25px_rgba(99,102,241,0.4)] border border-indigo-400/30 scale-[1.02]'
                    : 'bg-[#0c101a] text-slate-400 hover:text-white border border-white/[0.08] hover:border-white/[0.16]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                  isActive ? 'bg-white/20 text-white' : 'bg-white/[0.04] text-slate-500'
                }`}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* TOOL 1: INTERACTIVE AI VOICE CALL TESTER */}
        {activeTab === 'voice-tester' && (
          <div className="max-w-4xl mx-auto bg-[#0c101a] border border-white/[0.12] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 animate-fadeIn">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Interactive Voice Receptionist Simulator</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Hear How an AI Receptionist Sounds For Your Business
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400 bg-white/[0.04] border border-white/[0.08] px-3 py-1 rounded-lg self-start sm:self-auto">
                100% Free Web Audio API
              </span>
            </div>

            {/* Inputs: Business Name & Industry */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 font-semibold uppercase">
                  Your Business Name:
                </label>
                <input
                  type="text"
                  value={voiceBizName}
                  onChange={(e) => setVoiceBizName(e.target.value)}
                  placeholder="e.g. Metro Plumbers, Apex Dental"
                  className="w-full bg-[#080c14] border border-white/[0.1] focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 font-semibold uppercase">
                  Industry / Trade:
                </label>
                <select
                  value={voiceIndustry}
                  onChange={(e) => setVoiceIndustry(e.target.value)}
                  className="w-full bg-[#080c14] border border-white/[0.1] focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors font-sans cursor-pointer"
                >
                  <option value="Dental Practice">Dental Practice & Orthodontics</option>
                  <option value="Plumbing & HVAC">Plumbing, HVAC & Electrical</option>
                  <option value="Boutique Law Firm">Legal Practice & Attorneys</option>
                  <option value="Med Spa & Salon">Medical Spa & Aesthetics</option>
                  <option value="Real Estate Brokerage">Real Estate & Property Management</option>
                  <option value="Auto Repair Center">Auto Repair & Collision</option>
                  <option value="Local Service Business">Other Local Service Business</option>
                </select>
              </div>
            </div>

            {/* Interactive Call Button & Phone Screen */}
            <div className="p-6 rounded-2xl bg-[#080c14] border border-white/[0.08] space-y-5">
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    callConnected 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                      : isCalling 
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse'
                        : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                  }`}>
                    <PhoneCall className={`w-6 h-6 ${isCalling ? 'animate-bounce' : ''}`} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white font-sans">
                      {voiceBizName} • Live Line
                    </div>
                    <div className="text-xs font-mono text-slate-400">
                      {callConnected ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          CALL CONNECTED • SPEAKING NOW
                        </span>
                      ) : isCalling ? (
                        <span className="text-amber-400">Ringing virtual SIP trunk...</span>
                      ) : (
                        'Ready to simulate live incoming call'
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!callConnected ? (
                    <button
                      onClick={handleStartCall}
                      disabled={isCalling}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all transform active:scale-95 cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>TEST CALL MY BUSINESS (AUDIO ON)</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleStopCall}
                      className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all"
                    >
                      <span>END CALL</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Dynamic Transcript Screen */}
              {callTranscript.length > 0 && (
                <div className="p-4 rounded-xl bg-[#0c101a] border border-white/[0.06] space-y-2 text-xs font-sans">
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    Live Call Audio Transcript:
                  </div>
                  {callTranscript.map((t, idx) => (
                    <div key={idx} className={`p-3 rounded-xl ${
                      t.speaker === 'ai' 
                        ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-100' 
                        : 'bg-white/[0.02] text-slate-400 font-mono text-[11px]'
                    }`}>
                      {t.speaker === 'ai' ? `Elena (AI Receptionist): "${t.text}"` : t.text}
                    </div>
                  ))}
                </div>
              )}

              <div className="text-center pt-2">
                <span className="text-xs text-slate-400">
                  Want this exact AI answering your real phone lines 24/7?{' '}
                  <button
                    onClick={() => {
                      forgeAudioSynth.playClick();
                      if (onOpenAuditModal) onOpenAuditModal({ businessName: voiceBizName, businessType: voiceIndustry });
                    }}
                    className="text-indigo-400 hover:text-indigo-300 underline font-semibold cursor-pointer"
                  >
                    Get your free implementation audit
                  </button>
                </span>
              </div>

            </div>

          </div>
        )}

        {/* TOOL 2: SPEED-TO-LEAD 30-SECOND SMS GENERATOR */}
        {activeTab === 'speed-sms' && (
          <div className="max-w-4xl mx-auto bg-[#0c101a] border border-white/[0.12] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 animate-fadeIn">
            
            <div className="border-b border-white/[0.08] pb-4">
              <span className="text-xs font-mono text-indigo-400 font-bold uppercase">FREE REVENUE TOOL</span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Speed-to-Lead SMS Response Generator
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                78% of customers buy from the first business that responds. Enter a lead scenario to generate a high-converting 30-second follow-up SMS.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-mono text-slate-400 font-semibold uppercase block mb-1">
                  Customer Name:
                </label>
                <input
                  type="text"
                  value={leadCustomerName}
                  onChange={(e) => setLeadCustomerName(e.target.value)}
                  className="w-full bg-[#080c14] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 font-semibold uppercase block mb-1">
                  Customer Inquiry:
                </label>
                <input
                  type="text"
                  value={leadServiceNeeded}
                  onChange={(e) => setLeadServiceNeeded(e.target.value)}
                  className="w-full bg-[#080c14] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 font-semibold uppercase block mb-1">
                  Tone of Response:
                </label>
                <select
                  value={smsTone}
                  onChange={(e) => setSmsTone(e.target.value)}
                  className="w-full bg-[#080c14] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="helpful">Helpful & Professional</option>
                  <option value="urgent">Urgent & Emergency Focused</option>
                  <option value="friendly">Warm & Booking-Oriented</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerateSms}
              disabled={isGeneratingSms}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.35)] transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isGeneratingSms ? 'Generating Perfect Response...' : 'GENERATE 30-SECOND REVENUE SMS'}</span>
            </button>

            {generatedSms && (
              <div className="p-5 rounded-2xl bg-[#080c14] border border-indigo-500/30 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> High-Converting SMS Draft Ready
                  </span>
                  <button
                    onClick={() => handleCopy(generatedSms, 'sms')}
                    className="inline-flex items-center gap-1 text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] px-2.5 py-1 rounded-lg transition-colors text-[11px]"
                  >
                    {copiedId === 'sms' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'sms' ? 'Copied!' : 'Copy SMS'}</span>
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-slate-100 text-xs sm:text-sm leading-relaxed font-sans">
                  "{generatedSms}"
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Rine Forge systems dispatch this automatically via Twilio in under 45 seconds when anyone fills out your form or calls after hours.
                </div>
              </div>
            )}

          </div>
        )}

        {/* TOOL 3: GOOGLE REVIEW AI RESPONDER */}
        {activeTab === 'review-responder' && (
          <div className="max-w-4xl mx-auto bg-[#0c101a] border border-white/[0.12] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 animate-fadeIn">
            
            <div className="border-b border-white/[0.08] pb-4">
              <span className="text-xs font-mono text-amber-400 font-bold uppercase">REPUTATION SHIELD</span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Free AI Google & Yelp Review Responder
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Protect your brand reputation. Paste any customer review to generate a calibrated, professional response in seconds.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">Select Star Rating:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className={`p-1 rounded transition-colors ${
                        star <= reviewRating ? 'text-amber-400' : 'text-slate-600'
                      }`}
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-bold text-white font-mono ml-2">
                  {reviewRating} of 5 Stars
                </span>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 font-semibold uppercase block mb-1">
                  Paste Customer Review:
                </label>
                <textarea
                  rows={3}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full bg-[#080c14] border border-white/[0.1] rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 font-sans"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateReview}
              disabled={isGeneratingReview}
              className="w-full py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGeneratingReview ? 'Drafting Professional Response...' : 'GENERATE REPUTATION RESPONSE'}</span>
            </button>

            {reviewResponse && (
              <div className="p-5 rounded-2xl bg-[#080c14] border border-amber-500/30 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-amber-400 font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Brand-Protective Public Response Ready
                  </span>
                  <button
                    onClick={() => handleCopy(reviewResponse, 'review')}
                    className="inline-flex items-center gap-1 text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] px-2.5 py-1 rounded-lg transition-colors text-[11px]"
                  >
                    {copiedId === 'review' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'review' ? 'Copied!' : 'Copy to Clipboard'}</span>
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-slate-200 text-xs sm:text-sm leading-relaxed font-sans">
                  "{reviewResponse}"
                </div>
              </div>
            )}

          </div>
        )}

        {/* TOOL 4: CUSTOM AUTOMATION BLUEPRINT GENERATOR */}
        {activeTab === 'blueprint-gen' && (
          <div className="max-w-4xl mx-auto bg-[#0c101a] border border-white/[0.12] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 animate-fadeIn">
            
            <div className="border-b border-white/[0.08] pb-4">
              <span className="text-xs font-mono text-sky-400 font-bold uppercase">FEASIBILITY ARCHITECTURE</span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Instant System Architecture Blueprint Generator
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Select your business details to immediately inspect the exact automation infrastructure Rine Forge would deploy for you.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-mono text-slate-400 font-semibold uppercase block mb-1">
                  Industry:
                </label>
                <select
                  value={blueprintIndustry}
                  onChange={(e) => setBlueprintIndustry(e.target.value)}
                  className="w-full bg-[#080c14] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="HVAC & Plumbing">HVAC & Plumbing</option>
                  <option value="Dental Clinic">Dental Clinic</option>
                  <option value="Law Practice">Law Practice</option>
                  <option value="Med Spa & Salon">Med Spa & Salon</option>
                  <option value="Real Estate">Real Estate</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 font-semibold uppercase block mb-1">
                  Team Size:
                </label>
                <select
                  value={blueprintTeamSize}
                  onChange={(e) => setBlueprintTeamSize(e.target.value)}
                  className="w-full bg-[#080c14] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="Solo Owner">Solo Owner</option>
                  <option value="2 to 5 staff">2 to 5 staff</option>
                  <option value="5 to 15 team members">5 to 15 team members</option>
                  <option value="15+ employees">15+ employees</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 font-semibold uppercase block mb-1">
                  Biggest Time Drain:
                </label>
                <select
                  value={blueprintBottleneck}
                  onChange={(e) => setBlueprintBottleneck(e.target.value)}
                  className="w-full bg-[#080c14] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="Missed evening & weekend emergency calls">Missed after-hours calls</option>
                  <option value="Slow lead follow-up & cold inquiries">Slow lead follow-up</option>
                  <option value="Manual calendar booking back-and-forth">Calendar back-and-forth</option>
                  <option value="Answering the same repetitive FAQs">Repetitive FAQ triage</option>
                  <option value="Manual invoice & data entry into CRM">Manual CRM data entry</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerateBlueprint}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-600 via-indigo-600 to-indigo-700 hover:from-sky-500 hover:to-indigo-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Cpu className="w-4 h-4" />
              <span>GENERATE CUSTOM SYSTEM BLUEPRINT</span>
            </button>

            {generatedBlueprint && (
              <div className="p-6 rounded-2xl bg-[#080c14] border border-sky-500/30 space-y-5 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-sky-400 uppercase font-bold">SYSTEM BLUEPRINT GENERATED</span>
                    <h4 className="text-base font-bold text-white mt-0.5">{generatedBlueprint.systemName}</h4>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md font-bold">
                      Saved: {generatedBlueprint.estHoursSaved}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {generatedBlueprint.pipeline.map((p, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                      <div className="text-xs font-bold text-white">{p.stage}</div>
                      <div className="text-[11px] font-mono text-indigo-400">{p.tool}</div>
                      <div className="text-[11px] text-slate-300 leading-tight">{p.desc}</div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-400">
                    Expected ROI: <strong className="text-white">{generatedBlueprint.annualImpact}</strong>
                  </div>
                  <button
                    onClick={() => {
                      forgeAudioSynth.playSuccess();
                      if (onOpenAuditModal) onOpenAuditModal({ whatToAutomate: generatedBlueprint.systemName });
                    }}
                    className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 shrink-0"
                  >
                    <span>Have Rine Forge Build This Blueprint</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
}
