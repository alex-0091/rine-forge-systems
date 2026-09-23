import React, { useState, useEffect, useRef } from 'react';
import { 
  PhoneCall, MessageSquare, Star, Sparkles, Send, 
  Copy, Check, Play, Pause, RotateCcw, Volume2, VolumeX, 
  ArrowRight, ShieldCheck, Zap, Users, Building2, Flame,
  FileCheck, Clock, Award, CheckCircle2, ChevronRight, Sliders, Cpu,
  DollarSign, Calculator, Mic, MicOff, AlertTriangle, HelpCircle, FileText
} from 'lucide-react';
import { speechEngine } from '../../../utils/speechEngine';
import { forgeAudioSynth } from '../../../utils/forgeAudioSynth';

export function FreeBusinessAIToolsSection({ onOpenAuditModal }) {
  const [activeTab, setActiveTab] = useState('voice-tester');
  const [copiedId, setCopiedId] = useState(null);

  // ==========================================
  // 1. VOICE CALL TESTER STATE & DIALOGUE
  // ==========================================
  const [voiceBizName, setVoiceBizName] = useState('Apex Dental & Orthodontics');
  const [voiceIndustry, setVoiceIndustry] = useState('Dental Practice');
  const [isCalling, setIsCalling] = useState(false);
  const [callConnected, setCallConnected] = useState(false);
  const [callTranscript, setCallTranscript] = useState([]);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [userCustomQuestion, setUserCustomQuestion] = useState('');

  // ==========================================
  // 2. MISSED-CALL REVENUE CALCULATOR STATE
  // ==========================================
  const [dailyCalls, setDailyCalls] = useState(18);
  const [missedCallRate, setMissedCallRate] = useState(25); // 25%
  const [avgTicketValue, setAvgTicketValue] = useState(450); // $450
  const [closeRate, setCloseRate] = useState(35); // 35%
  const [isSimulatingRescue, setIsSimulatingRescue] = useState(false);
  const [rescueStep, setRescueStep] = useState(0);

  // Derived revenue calculations
  const dailyMissedCalls = (dailyCalls * (missedCallRate / 100));
  const monthlyMissedCalls = dailyMissedCalls * 26; // 26 business days
  const monthlyLostRevenue = Math.round(monthlyMissedCalls * (closeRate / 100) * avgTicketValue);
  const annualLostRevenue = monthlyLostRevenue * 12;
  const annualRecoveredRevenue = Math.round(annualLostRevenue * 0.92); // 92% AI recovery rate

  // ==========================================
  // 3. SPEED-TO-LEAD SMS GENERATOR STATE
  // ==========================================
  const [inquiryType, setInquiryType] = useState('roof-leak');
  const [leadCustomerName, setLeadCustomerName] = useState('David Miller');
  const [leadServiceNeeded, setLeadServiceNeeded] = useState('Emergency roof leak inspection after storm');
  const [smsTone, setSmsTone] = useState('helpful');
  const [generatedSms, setGeneratedSms] = useState('');
  const [isGeneratingSms, setIsGeneratingSms] = useState(false);

  // ==========================================
  // 4. REVIEW RESPONDER STATE
  // ==========================================
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("Dr. Miller and his staff were incredible! I had acute molar pain and they got me in within 2 hours. Pain-free treatment and super kind front desk.");
  const [reviewResponse, setReviewResponse] = useState('');
  const [isGeneratingReview, setIsGeneratingReview] = useState(false);

  // ==========================================
  // 5. CUSTOM ARCHITECTURE BLUEPRINT STATE
  // ==========================================
  const [blueprintIndustry, setBlueprintIndustry] = useState('HVAC & Plumbing');
  const [blueprintTeamSize, setBlueprintTeamSize] = useState('5 to 15 team members');
  const [blueprintBottleneck, setBlueprintBottleneck] = useState('Missed evening & weekend emergency calls');
  const [generatedBlueprint, setGeneratedBlueprint] = useState(null);

  // ==========================================
  // 6. AI KNOWLEDGEBASE & GUARDRAIL GENERATOR
  // ==========================================
  const [kbBizName, setKbBizName] = useState('Vance Heating & Air');
  const [kbServices, setKbServices] = useState('Furnace repair, AC tune-ups, heat pump installs');
  const [kbPricingPolicy, setKbPricingPolicy] = useState('Free estimate on replacements; $99 diagnostic dispatch fee');
  const [kbEscalationRule, setKbEscalationRule] = useState('Never quote commercial chillers without senior technician inspection');
  const [generatedKb, setGeneratedKb] = useState(null);
  const [isGeneratingKb, setIsGeneratingKb] = useState(false);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      speechEngine.stopSpeaking();
      speechEngine.stopListening();
    };
  }, []);

  // Voice Call Initializer
  const handleStartCall = () => {
    forgeAudioSynth.playClick();
    speechEngine.stopSpeaking();
    setIsCalling(true);
    setCallConnected(false);
    setCallTranscript([
      { speaker: 'system', text: `Dialing virtual SIP trunk for ${voiceBizName}...` }
    ]);

    setTimeout(() => {
      setCallConnected(true);
      const greeting = `Thank you for calling ${voiceBizName}! My name is Elena, your 24/7 AI Receptionist. Are you looking to schedule an urgent appointment, or do you have a question about our services?`;
      
      setCallTranscript(prev => [
        ...prev,
        { speaker: 'ai', text: greeting }
      ]);

      setIsAiSpeaking(true);
      speechEngine.speak(greeting, {
        rate: 0.98,
        pitch: 1.05,
        onEnd: () => {
          setIsAiSpeaking(false);
        }
      });
    }, 1200);
  };

  const handleStopCall = () => {
    forgeAudioSynth.playClick();
    speechEngine.stopSpeaking();
    speechEngine.stopListening();
    setIsCalling(false);
    setCallConnected(false);
    setIsAiSpeaking(false);
    setIsListeningMic(false);
  };

  // Ask Elena a Question & Receive Spoken Audio Answer
  const handleAskElena = (questionText) => {
    if (!questionText || isAiSpeaking) return;
    forgeAudioSynth.playClick();
    speechEngine.stopSpeaking();

    // Add user message to transcript
    setCallTranscript(prev => [
      ...prev,
      { speaker: 'user', text: questionText }
    ]);
    setUserCustomQuestion('');

    // Generate Contextual Answer
    let answer = "";
    const qLower = questionText.toLowerCase();

    if (qLower.includes('appointment') || qLower.includes('opening') || qLower.includes('today') || qLower.includes('friday') || qLower.includes('time') || qLower.includes('slot')) {
      answer = `Yes! We currently have two openings remaining today at 2:30 PM and 4:15 PM with our lead specialist. Would you like me to reserve the 2:30 PM slot for you and text your instant booking confirmation?`;
    } else if (qLower.includes('cost') || qLower.includes('price') || qLower.includes('charge') || qLower.includes('insurance') || qLower.includes('fee')) {
      answer = `Our comprehensive examination and diagnostic review is $149 flat, and we accept all major insurance networks. For treatments, we provide itemized transparent quotes before any work begins. Would you like to lock in a consultation?`;
    } else if (qLower.includes('location') || qLower.includes('where') || qLower.includes('address') || qLower.includes('parking') || qLower.includes('directions')) {
      answer = `We are located at 410 West 6th Street in Downtown, with complimentary patient parking in the attached private garage. Shall I text you the direct Google Maps navigation link right now?`;
    } else {
      answer = `Understood! For ${voiceBizName}, our specialists handle that regularly with same-day priority triage. I can schedule an on-site visit or have our clinical team review your details. What phone number is best to text your confirmation?`;
    }

    setTimeout(() => {
      setCallTranscript(prev => [
        ...prev,
        { speaker: 'ai', text: answer }
      ]);

      setIsAiSpeaking(true);
      speechEngine.speak(answer, {
        rate: 0.98,
        pitch: 1.05,
        onEnd: () => {
          setIsAiSpeaking(false);
        }
      });
    }, 500);
  };

  // Handle Speech-to-Text Microphone
  const handleToggleMic = () => {
    if (isListeningMic) {
      speechEngine.stopListening();
      setIsListeningMic(false);
      return;
    }

    if (!speechEngine.isSupported()) {
      alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari, or click one of the quick questions!");
      return;
    }

    forgeAudioSynth.playClick();
    setIsListeningMic(true);

    speechEngine.startListening({
      onStart: () => setIsListeningMic(true),
      onResult: ({ text, isFinal }) => {
        if (isFinal && text.trim()) {
          setIsListeningMic(false);
          handleAskElena(text);
        }
      },
      onError: (err) => {
        console.warn("Speech mic error:", err);
        setIsListeningMic(false);
      },
      onEnd: () => setIsListeningMic(false)
    });
  };

  // Handle Rescue Sequence Simulation
  const handleRunRescueSimulation = () => {
    forgeAudioSynth.playClick();
    setIsSimulatingRescue(true);
    setRescueStep(1);

    setTimeout(() => setRescueStep(2), 1200);
    setTimeout(() => setRescueStep(3), 2600);
    setTimeout(() => {
      setRescueStep(4);
      forgeAudioSynth.playSuccess();
      setTimeout(() => setIsSimulatingRescue(false), 2000);
    }, 4200);
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

  // Handle Knowledge Base & Guardrail Generation
  const handleGenerateKnowledgebase = () => {
    forgeAudioSynth.playClick();
    setIsGeneratingKb(true);

    setTimeout(() => {
      setGeneratedKb({
        businessName: kbBizName,
        persona: `Professional, courteous, and efficient 24/7 Front Desk Representative for ${kbBizName}. Never guesses; provides grounded facts from approved documentation.`,
        faqMatrix: [
          { q: 'What services do you offer?', a: `We specialize in ${kbServices}.` },
          { q: 'How does your pricing work?', a: `Our policy is: ${kbPricingPolicy}.` },
          { q: 'Can I book an appointment?', a: 'Yes, I can access real-time calendar availability and reserve your slot immediately.' },
          { q: 'What happens in an emergency?', a: 'Emergency inquiries trigger immediate automated priority dispatch to our on-call technician.' }
        ],
        hardGuardrails: [
          `NEVER provide binding warranties without formal inspection.`,
          `RULE: ${kbEscalationRule}.`,
          `Always collect caller name, phone number, and address before committing time slots.`,
          `Escalate immediately to human manager if caller expresses dissatisfaction.`
        ],
        exportJson: JSON.stringify({
          system_name: `${kbBizName} AI Grounding Core`,
          model_temperature: 0.2,
          grounded_services: kbServices.split(',').map(s => s.trim()),
          pricing_rules: kbPricingPolicy,
          escalation_triggers: [kbEscalationRule, "complaint", "legal_threat", "unsupported_scope"]
        }, null, 2)
      });
      setIsGeneratingKb(false);
      forgeAudioSynth.playSuccess();
    }, 500);
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
            We don't make theoretical promises. Use our free interactive business tools below to test live voice receptionist audio, calculate missed-call revenue leaks, generate speed-to-lead SMS, or blueprint your custom automation stack.
          </p>
        </div>

        {/* 6 Tool Selector Tabs */}
        <div className="flex items-center justify-start lg:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none max-w-5xl mx-auto">
          {[
            { id: 'voice-tester', label: '1. AI Voice Tester', icon: PhoneCall, badge: 'REAL AUDIO' },
            { id: 'revenue-calculator', label: '2. Missed-Call Calculator', icon: DollarSign, badge: 'ROI ENGINE' },
            { id: 'speed-sms', label: '3. Speed-to-Lead SMS', icon: MessageSquare, badge: 'SUB-45s' },
            { id: 'review-responder', label: '4. Google Review AI', icon: Star, badge: 'REPUTATION' },
            { id: 'blueprint-gen', label: '5. System Blueprint', icon: Sliders, badge: 'ARCHITECTURE' },
            { id: 'knowledgebase-gen', label: '6. AI Guardrails', icon: ShieldCheck, badge: 'GROUNDING' }
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
                className={`px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-mono font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
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

        {/* ======================================================== */}
        {/* TOOL 1: INTERACTIVE AI VOICE CALL TESTER & REAL AUDIO DIALOGUE */}
        {/* ======================================================== */}
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
                      {voiceBizName} • Virtual SIP Line
                    </div>
                    <div className="text-xs font-mono text-slate-400">
                      {callConnected ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          CALL CONNECTED • {isAiSpeaking ? 'ELENA SPEAKING NOW' : 'LISTENING TO CALLER'}
                        </span>
                      ) : isCalling ? (
                        <span className="text-amber-400">Connecting virtual SIP trunk...</span>
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
                      className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                    >
                      <span>END CALL</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Dynamic Transcript Screen */}
              {callTranscript.length > 0 && (
                <div className="p-4 rounded-xl bg-[#0c101a] border border-white/[0.06] space-y-2 text-xs font-sans max-h-64 overflow-y-auto">
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    Live Call Audio Transcript:
                  </div>
                  {callTranscript.map((t, idx) => (
                    <div key={idx} className={`p-3 rounded-xl transition-all ${
                      t.speaker === 'ai' 
                        ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-100' 
                        : t.speaker === 'user'
                          ? 'bg-emerald-600/20 border border-emerald-500/30 text-emerald-100 ml-6'
                          : 'bg-white/[0.02] text-slate-400 font-mono text-[11px]'
                    }`}>
                      {t.speaker === 'ai' ? `Elena (AI Receptionist): "${t.text}"` : t.speaker === 'user' ? `You (Caller): "${t.text}"` : t.text}
                    </div>
                  ))}
                </div>
              )}

              {/* Interactive Caller Response Triggers (Active when Call is Connected) */}
              {callConnected && (
                <div className="space-y-3 pt-2 border-t border-white/[0.08]">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Ask Elena a caller question to hear her voice respond:</span>
                    {isAiSpeaking && (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Volume2 className="w-3.5 h-3.5 animate-pulse" /> Speaking...
                      </span>
                    )}
                  </div>

                  {/* 3 Quick Chips */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      onClick={() => handleAskElena("Do you have any appointments available today?")}
                      disabled={isAiSpeaking}
                      className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-indigo-600/20 text-slate-300 hover:text-white border border-white/[0.08] hover:border-indigo-500/40 text-left text-xs transition-all cursor-pointer disabled:opacity-50"
                    >
                      📅 "Do you have any openings today?"
                    </button>
                    <button
                      onClick={() => handleAskElena("How much do you charge for a standard visit?")}
                      disabled={isAiSpeaking}
                      className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-indigo-600/20 text-slate-300 hover:text-white border border-white/[0.08] hover:border-indigo-500/40 text-left text-xs transition-all cursor-pointer disabled:opacity-50"
                    >
                      💰 "How much is a standard consultation?"
                    </button>
                    <button
                      onClick={() => handleAskElena("Where are you located and is parking available?")}
                      disabled={isAiSpeaking}
                      className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-indigo-600/20 text-slate-300 hover:text-white border border-white/[0.08] hover:border-indigo-500/40 text-left text-xs transition-all cursor-pointer disabled:opacity-50"
                    >
                      📍 "Where are you located & parking?"
                    </button>
                  </div>

                  {/* Custom Question or Mic Input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={userCustomQuestion}
                      onChange={(e) => setUserCustomQuestion(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAskElena(userCustomQuestion);
                      }}
                      placeholder="Type custom question for Elena..."
                      className="flex-1 bg-[#0c101a] border border-white/[0.1] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={() => handleAskElena(userCustomQuestion)}
                      disabled={!userCustomQuestion.trim() || isAiSpeaking}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Speak Reply
                    </button>
                    <button
                      onClick={handleToggleMic}
                      title="Speak into microphone"
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        isListeningMic 
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/50 animate-pulse'
                          : 'bg-white/[0.04] text-slate-300 hover:text-white border-white/[0.08]'
                      }`}
                    >
                      {isListeningMic ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                  </div>
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

        {/* ======================================================== */}
        {/* TOOL 2: MISSED-CALL REVENUE LEAK & AUTO-RECOVERY CALCULATOR */}
        {/* ======================================================== */}
        {activeTab === 'revenue-calculator' && (
          <div className="max-w-4xl mx-auto bg-[#0c101a] border border-white/[0.12] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 animate-fadeIn">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase mb-1">
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Real-Time Business Loss & Recovery Modeling</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  How Much Revenue Are You Losing To Missed Calls?
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400 bg-white/[0.04] border border-white/[0.08] px-3 py-1 rounded-lg self-start sm:self-auto">
                Deterministic Financial Model
              </span>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Daily Inbound Calls */}
              <div className="p-4 rounded-2xl bg-[#080c14] border border-white/[0.08] space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-300">Daily Inbound Calls:</span>
                  <strong className="text-white text-sm font-sans">{dailyCalls} calls / day</strong>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  value={dailyCalls}
                  onChange={(e) => setDailyCalls(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500 flex justify-between">
                  <span>5 calls</span>
                  <span>60 calls</span>
                </div>
              </div>

              {/* Missed Call Rate */}
              <div className="p-4 rounded-2xl bg-[#080c14] border border-white/[0.08] space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-300">Estimated Missed Call Rate:</span>
                  <strong className="text-rose-400 text-sm font-sans">{missedCallRate}%</strong>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={missedCallRate}
                  onChange={(e) => setMissedCallRate(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500 flex justify-between">
                  <span>10% (Good staff)</span>
                  <span>50% (High missed volume)</span>
                </div>
              </div>

              {/* Average Customer Value */}
              <div className="p-4 rounded-2xl bg-[#080c14] border border-white/[0.08] space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-300">Average Job / Customer Value:</span>
                  <strong className="text-emerald-400 text-sm font-sans">${avgTicketValue} USD</strong>
                </div>
                <input
                  type="range"
                  min="100"
                  max="3000"
                  step="50"
                  value={avgTicketValue}
                  onChange={(e) => setAvgTicketValue(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500 flex justify-between">
                  <span>$100 (Routine visit)</span>
                  <span>$3,000 (Major installation / case)</span>
                </div>
              </div>

              {/* Close Rate */}
              <div className="p-4 rounded-2xl bg-[#080c14] border border-white/[0.08] space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-300">Inbound Lead Close Rate:</span>
                  <strong className="text-teal-400 text-sm font-sans">{closeRate}%</strong>
                </div>
                <input
                  type="range"
                  min="15"
                  max="70"
                  value={closeRate}
                  onChange={(e) => setCloseRate(Number(e.target.value))}
                  className="w-full accent-teal-500 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500 flex justify-between">
                  <span>15% (Competitive)</span>
                  <span>70% (High intent)</span>
                </div>
              </div>

            </div>

            {/* Results Display */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/25 space-y-1">
                <div className="text-rose-300 text-xs font-mono uppercase font-bold">Annual Revenue Lost:</div>
                <div className="text-2xl sm:text-3xl font-black text-rose-400">${annualLostRevenue.toLocaleString()}</div>
                <div className="text-[11px] text-slate-400">~{Math.round(monthlyMissedCalls)} missed opportunities/month going to competitors</div>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                <div className="text-emerald-300 text-xs font-mono uppercase font-bold">Recovered with Rine Forge AI:</div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400">${annualRecoveredRevenue.toLocaleString()}</div>
                <div className="text-[11px] text-emerald-300/80">92% answered & recovered 24/7/365</div>
              </div>

              <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 space-y-1">
                <div className="text-indigo-300 text-xs font-mono uppercase font-bold">Break-Even Time:</div>
                <div className="text-2xl sm:text-3xl font-black text-white">Under 4 Days</div>
                <div className="text-[11px] text-slate-400">On a $199 - $299 starter system setup</div>
              </div>
            </div>

            {/* Simulated Live Rescue Pipeline */}
            <div className="p-5 rounded-2xl bg-[#080c14] border border-white/[0.08] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-white">
                    Simulate The 45-Second AI Rescue Sequence
                  </div>
                  <div className="text-xs text-slate-400">
                    Watch how Rine Forge prevents a missed call from turning into lost revenue.
                  </div>
                </div>

                <button
                  onClick={handleRunRescueSimulation}
                  disabled={isSimulatingRescue}
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-teal-500 hover:from-indigo-500 hover:to-teal-400 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {isSimulatingRescue ? 'Executing Sequence...' : 'Simulate Auto-Rescue →'}
                </button>
              </div>

              {rescueStep > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2 text-xs font-mono">
                  <div className={`p-3 rounded-xl border transition-all ${
                    rescueStep >= 1 ? 'bg-rose-500/15 border-rose-500/40 text-rose-200' : 'bg-white/[0.02] border-white/[0.05] text-slate-600'
                  }`}>
                    <div className="font-bold text-[10px]">00:00s • TRIGGER</div>
                    <div className="mt-1">Inbound call missed during peak shift.</div>
                  </div>

                  <div className={`p-3 rounded-xl border transition-all ${
                    rescueStep >= 2 ? 'bg-amber-500/15 border-amber-500/40 text-amber-200' : 'bg-white/[0.02] border-white/[0.05] text-slate-600'
                  }`}>
                    <div className="font-bold text-[10px]">00:14s • DISPATCH</div>
                    <div className="mt-1">AI texts caller: "Sorry we missed you! How can we help?"</div>
                  </div>

                  <div className={`p-3 rounded-xl border transition-all ${
                    rescueStep >= 3 ? 'bg-sky-500/15 border-sky-500/40 text-sky-200' : 'bg-white/[0.02] border-white/[0.05] text-slate-600'
                  }`}>
                    <div className="font-bold text-[10px]">00:29s • RESPONSE</div>
                    <div className="mt-1">Customer replies with service urgency & address.</div>
                  </div>

                  <div className={`p-3 rounded-xl border transition-all ${
                    rescueStep >= 4 ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200' : 'bg-white/[0.02] border-white/[0.05] text-slate-600'
                  }`}>
                    <div className="font-bold text-[10px]">00:44s • RESOLVED</div>
                    <div className="mt-1">Booking confirmed & lead saved to staff CRM.</div>
                  </div>
                </div>
              )}
            </div>

            <div className="text-center">
              <button
                onClick={() => {
                  forgeAudioSynth.playClick();
                  if (onOpenAuditModal) onOpenAuditModal({ whatToAutomate: `Missed Call Auto-Recovery (${dailyCalls} calls/day, ~$${annualLostRevenue.toLocaleString()} annual leak)` });
                }}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] cursor-pointer"
              >
                Recover My Missed Call Revenue →
              </button>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TOOL 3: SPEED-TO-LEAD SMS GENERATOR */}
        {/* ======================================================== */}
        {activeTab === 'speed-sms' && (
          <div className="max-w-4xl mx-auto bg-[#0c101a] border border-white/[0.12] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 animate-fadeIn">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-mono text-indigo-400 font-bold uppercase mb-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Sub-45s Speed-To-Lead Text Engine</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Generate Instant High-Converting Follow-Up SMS
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400 bg-white/[0.04] border border-white/[0.08] px-3 py-1 rounded-lg self-start sm:self-auto">
                78% Faster Lead Conversion
              </span>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 font-semibold uppercase">
                  Lead Name:
                </label>
                <input
                  type="text"
                  value={leadCustomerName}
                  onChange={(e) => setLeadCustomerName(e.target.value)}
                  className="w-full bg-[#080c14] border border-white/[0.1] focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 font-semibold uppercase">
                  Service Requested:
                </label>
                <input
                  type="text"
                  value={leadServiceNeeded}
                  onChange={(e) => setLeadServiceNeeded(e.target.value)}
                  className="w-full bg-[#080c14] border border-white/[0.1] focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 font-semibold uppercase">
                  Follow-Up Tone:
                </label>
                <select
                  value={smsTone}
                  onChange={(e) => setSmsTone(e.target.value)}
                  className="w-full bg-[#080c14] border border-white/[0.1] focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors font-sans cursor-pointer"
                >
                  <option value="helpful">Helpful & Professional</option>
                  <option value="urgent">Urgent Dispatch (Emergency)</option>
                  <option value="friendly">Friendly & Casual (Scheduling)</option>
                </select>
              </div>
            </div>

            {/* Generate Trigger */}
            <div className="flex justify-center">
              <button
                onClick={handleGenerateSms}
                disabled={isGeneratingSms}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGeneratingSms ? 'Generating High-Converting SMS...' : 'Generate Follow-Up SMS'}</span>
              </button>
            </div>

            {/* Output SMS Preview */}
            {generatedSms && (
              <div className="p-6 rounded-2xl bg-[#080c14] border border-white/[0.08] space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-indigo-400 font-bold uppercase">
                    Ready-To-Send SMS Draft:
                  </span>
                  <button
                    onClick={() => handleCopy(generatedSms, 'sms')}
                    className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] transition-colors cursor-pointer"
                  >
                    {copiedId === 'sms' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'sms' ? 'Copied!' : 'Copy SMS'}</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-[#0c101a] border border-white/[0.06] text-sm text-slate-200 leading-relaxed font-sans">
                  "{generatedSms}"
                </div>

                <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Rine Forge automates this dispatch within 42 seconds of web form submission or missed call.</span>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ======================================================== */}
        {/* TOOL 4: GOOGLE REVIEW AI RESPONDER */}
        {/* ======================================================== */}
        {activeTab === 'review-responder' && (
          <div className="max-w-4xl mx-auto bg-[#0c101a] border border-white/[0.12] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 animate-fadeIn">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase mb-1">
                  <Star className="w-3.5 h-3.5" />
                  <span>AI Reputation & Review Management</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Instant Professional Google & Yelp Review Responses
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400 bg-white/[0.04] border border-white/[0.08] px-3 py-1 rounded-lg self-start sm:self-auto">
                Calibrated De-escalation
              </span>
            </div>

            {/* Inputs: Rating & Review */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-300 font-semibold uppercase">Customer Rating:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-amber-400' : 'text-slate-600'}`} />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-mono text-slate-400">({reviewRating} of 5 Stars)</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 font-semibold uppercase">
                  Customer Review Content:
                </label>
                <textarea
                  rows={3}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full bg-[#080c14] border border-white/[0.1] focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors font-sans"
                />
              </div>
            </div>

            {/* Generate Trigger */}
            <div className="flex justify-center">
              <button
                onClick={handleGenerateReview}
                disabled={isGeneratingReview}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGeneratingReview ? 'Drafting Grounded Response...' : 'Generate Review Response'}</span>
              </button>
            </div>

            {/* Response Output */}
            {reviewResponse && (
              <div className="p-6 rounded-2xl bg-[#080c14] border border-white/[0.08] space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-amber-400 font-bold uppercase">
                    Calibrated Business Response:
                  </span>
                  <button
                    onClick={() => handleCopy(reviewResponse, 'review')}
                    className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] transition-colors cursor-pointer"
                  >
                    {copiedId === 'review' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'review' ? 'Copied!' : 'Copy Response'}</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-[#0c101a] border border-white/[0.06] text-sm text-slate-200 leading-relaxed font-sans">
                  "{reviewResponse}"
                </div>

                <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                  <span>Engineered with defensive guardrails to de-escalate 1-star complaints and amplify 5-star brand loyalty.</span>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ======================================================== */}
        {/* TOOL 5: SYSTEM ARCHITECTURE BLUEPRINT GENERATOR */}
        {/* ======================================================== */}
        {activeTab === 'blueprint-gen' && (
          <div className="max-w-4xl mx-auto bg-[#0c101a] border border-white/[0.12] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 animate-fadeIn">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-mono text-indigo-400 font-bold uppercase mb-1">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Custom Architecture Scanner</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Generate Your Custom AI System Pipeline
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400 bg-white/[0.04] border border-white/[0.08] px-3 py-1 rounded-lg self-start sm:self-auto">
                B2B Production Blueprint
              </span>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 font-semibold uppercase">
                  Industry:
                </label>
                <select
                  value={blueprintIndustry}
                  onChange={(e) => setBlueprintIndustry(e.target.value)}
                  className="w-full bg-[#080c14] border border-white/[0.1] focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors font-sans cursor-pointer"
                >
                  <option value="HVAC & Plumbing">HVAC & Plumbing</option>
                  <option value="Dental Clinic">Dental Clinic</option>
                  <option value="Law Firm">Law Firm</option>
                  <option value="Medical Spa">Medical Spa</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Contractor / Roofing">Contractor / Roofing</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 font-semibold uppercase">
                  Team Size:
                </label>
                <select
                  value={blueprintTeamSize}
                  onChange={(e) => setBlueprintTeamSize(e.target.value)}
                  className="w-full bg-[#080c14] border border-white/[0.1] focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors font-sans cursor-pointer"
                >
                  <option value="1 to 4 team members">1 to 4 team members</option>
                  <option value="5 to 15 team members">5 to 15 team members</option>
                  <option value="16 to 50 team members">16 to 50 team members</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 font-semibold uppercase">
                  Primary Drain:
                </label>
                <select
                  value={blueprintBottleneck}
                  onChange={(e) => setBlueprintBottleneck(e.target.value)}
                  className="w-full bg-[#080c14] border border-white/[0.1] focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors font-sans cursor-pointer"
                >
                  <option value="Missed evening & weekend emergency calls">Missed calls</option>
                  <option value="Slow response to online form leads">Slow lead follow-up</option>
                  <option value="Manual calendar booking back-and-forth">Calendar booking</option>
                  <option value="Manual CRM data entry and billing sync">CRM & data entry</option>
                </select>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-center">
              <button
                onClick={handleGenerateBlueprint}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all cursor-pointer"
              >
                <Cpu className="w-4 h-4" />
                <span>Generate System Architecture Blueprint</span>
              </button>
            </div>

            {/* Blueprint Output Display */}
            {generatedBlueprint && (
              <div className="p-6 sm:p-8 rounded-2xl bg-[#080c14] border border-white/[0.08] space-y-6 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">RECOMMENDED SYSTEM STACK</span>
                    <h4 className="text-lg sm:text-xl font-bold text-white">{generatedBlueprint.systemName}</h4>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-bold">
                      {generatedBlueprint.estHoursSaved}
                    </span>
                  </div>
                </div>

                {/* 4 Pipeline Stages */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {generatedBlueprint.pipeline.map((p, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-[#0c101a] border border-white/[0.06] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-indigo-300 font-bold">{p.stage}</span>
                        <span className="text-[10px] font-mono text-slate-500 bg-white/[0.04] px-2 py-0.5 rounded">{p.tool}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">{p.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-slate-400">
                    Expected annual impact: <strong className="text-emerald-400 font-mono">{generatedBlueprint.annualImpact}</strong>
                  </span>
                  <button
                    onClick={() => {
                      forgeAudioSynth.playClick();
                      if (onOpenAuditModal) onOpenAuditModal({ whatToAutomate: generatedBlueprint.systemName });
                    }}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Deploy This Architecture</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ======================================================== */}
        {/* TOOL 6: AI KNOWLEDGE BASE & GUARDRAIL GENERATOR */}
        {/* ======================================================== */}
        {activeTab === 'knowledgebase-gen' && (
          <div className="max-w-4xl mx-auto bg-[#0c101a] border border-white/[0.12] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 animate-fadeIn">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-mono text-sky-400 font-bold uppercase mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Grounding & Anti-Hallucination Framework</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Generate Production AI Guardrails & FAQ Matrix
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400 bg-white/[0.04] border border-white/[0.08] px-3 py-1 rounded-lg self-start sm:self-auto">
                Zero Guessing Boundary
              </span>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 font-semibold uppercase">
                  Business Name:
                </label>
                <input
                  type="text"
                  value={kbBizName}
                  onChange={(e) => setKbBizName(e.target.value)}
                  className="w-full bg-[#080c14] border border-white/[0.1] focus:border-sky-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 font-semibold uppercase">
                  Primary Services:
                </label>
                <input
                  type="text"
                  value={kbServices}
                  onChange={(e) => setKbServices(e.target.value)}
                  className="w-full bg-[#080c14] border border-white/[0.1] focus:border-sky-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 font-semibold uppercase">
                  Pricing / Estimate Policy:
                </label>
                <input
                  type="text"
                  value={kbPricingPolicy}
                  onChange={(e) => setKbPricingPolicy(e.target.value)}
                  className="w-full bg-[#080c14] border border-white/[0.1] focus:border-sky-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 font-semibold uppercase">
                  Strict Escalation / Refusal Rule:
                </label>
                <input
                  type="text"
                  value={kbEscalationRule}
                  onChange={(e) => setKbEscalationRule(e.target.value)}
                  className="w-full bg-[#080c14] border border-white/[0.1] focus:border-sky-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-center">
              <button
                onClick={handleGenerateKnowledgebase}
                disabled={isGeneratingKb}
                className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(14,165,233,0.3)] transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGeneratingKb ? 'Synthesizing Grounded Matrix...' : 'Generate Production Guardrail Matrix'}</span>
              </button>
            </div>

            {/* KB Output */}
            {generatedKb && (
              <div className="p-6 sm:p-8 rounded-2xl bg-[#080c14] border border-white/[0.08] space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-sky-400 font-bold uppercase">GROUNDED SYSTEM SPECIFICATION</span>
                    <h4 className="text-lg font-bold text-white">{generatedKb.businessName} • Production Manifest</h4>
                  </div>
                  <button
                    onClick={() => handleCopy(generatedKb.exportJson, 'kb-json')}
                    className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] transition-colors cursor-pointer"
                  >
                    {copiedId === 'kb-json' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'kb-json' ? 'Copied JSON!' : 'Copy Config JSON'}</span>
                  </button>
                </div>

                {/* Persona */}
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-slate-300 font-sans space-y-1">
                  <strong className="text-sky-300 font-mono text-[11px] block">SYSTEM PERSONA & BOUNDARY:</strong>
                  <div>{generatedKb.persona}</div>
                </div>

                {/* Guardrails */}
                <div className="space-y-2">
                  <div className="text-xs font-mono text-amber-400 font-bold uppercase flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Deterministic Hard Guardrails (Zero Guessing):</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
                    {generatedKb.hardGuardrails.map((rule, rIdx) => (
                      <div key={rIdx} className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200/90">
                        • {rule}
                      </div>
                    ))}
                  </div>
                </div>

                {/* FAQ Matrix */}
                <div className="space-y-2">
                  <div className="text-xs font-mono text-slate-400 font-bold uppercase">
                    Verified Grounded Q&A Matrix:
                  </div>
                  <div className="space-y-2 text-xs font-sans">
                    {generatedKb.faqMatrix.map((item, fIdx) => (
                      <div key={fIdx} className="p-3 rounded-lg bg-[#0c101a] border border-white/[0.06] space-y-1">
                        <div className="text-white font-bold">Q: {item.q}</div>
                        <div className="text-slate-300">A: {item.a}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
}
