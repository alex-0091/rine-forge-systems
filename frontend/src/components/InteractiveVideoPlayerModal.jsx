import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, 
  ChevronLeft, ChevronRight, X, Sparkles, CheckCircle2, 
  Activity, ArrowRight, ShieldCheck, Zap, Terminal, Lock,
  TrendingUp, Flame, School, Bot, PhoneCall, Building2
} from 'lucide-react';

export function InteractiveVideoPlayerModal({
  activeProject,
  onClose,
  onSelectPackage,
  allProjects = [],
  onSwitchProject
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0); // 0 to 10
  const [speed, setSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Playback timer effect
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= 10) {
            return 10;
          }
          return parseFloat((prev + 0.1 * speed).toFixed(1));
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  // If time hits 10, pause
  useEffect(() => {
    if (currentTime >= 10 && isPlaying) {
      setIsPlaying(false);
    }
  }, [currentTime, isPlaying]);

  if (!activeProject) return null;

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    setCurrentTime(parseFloat((pos * 10).toFixed(1)));
    if (!isPlaying) setIsPlaying(true);
  };

  const handleReplay = () => {
    setCurrentTime(0);
    setIsPlaying(true);
  };

  // Find index for prev / next
  const currentIndex = allProjects.findIndex(p => p.id === activeProject.id);
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentTime(0);
      onSwitchProject(allProjects[currentIndex - 1]);
    }
  };
  const handleNext = () => {
    if (currentIndex < allProjects.length - 1) {
      setCurrentTime(0);
      onSwitchProject(allProjects[currentIndex + 1]);
    }
  };

  // Dynamic Scene Simulation Content
  const renderProjectSkit = () => {
    const t = currentTime;

    switch (activeProject.id) {
      case 'oracle-ai':
        return (
          <div className="space-y-4 font-mono">
            {t < 3.2 ? (
              <div className="space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-xs text-teal-400">
                  <span>[00:0{t.toFixed(1)}s] CONNECTING WEBSOCKET INGEST</span>
                  <span className="animate-pulse">● 14ms LATENCY</span>
                </div>
                <div className="p-3 bg-dark-950/90 rounded-xl border border-teal-500/30 text-xs space-y-1">
                  <div className="text-slate-400">&gt; Ingesting Binance/MEXC BTCUSDT orderbook ring-buffer...</div>
                  <div className="text-teal-300">&gt; Depth scan: 1,420 bid levels / 1,280 ask levels indexed.</div>
                  <div className="text-cyan-400">&gt; Microstructure Imbalance: +68.4% Buyer Bid Liquidity Depth.</div>
                </div>
              </div>
            ) : t < 7.0 ? (
              <div className="space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-xs text-cyan-400">
                  <span>[00:0{t.toFixed(1)}s] MULTI-MODEL PREDICTIVE INFERENCE</span>
                  <span className="text-emerald-400 font-bold">CONFIDENCE: 84.6%</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-dark-950 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400">RSI(14) Momentum:</span>
                    <div className="text-base font-bold text-teal-400 font-mono">64.2 (Bullish Shift)</div>
                  </div>
                  <div className="p-2.5 bg-dark-950 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400">5m Direction Vector:</span>
                    <div className="text-base font-bold text-emerald-400 font-mono">LONG BREAKOUT ↑</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
                  <span>[00:{t.toFixed(1)}s] AUTONOMOUS SIGNAL BROADCAST</span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">LOCKED</span>
                </div>
                <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-500/40 text-xs space-y-1.5">
                  <div className="flex justify-between font-bold">
                    <span className="text-white">Signal: BTC/USDT LONG @ $91,420</span>
                    <span className="text-emerald-400">+1.8% Target</span>
                  </div>
                  <div className="flex justify-between text-slate-300 text-[11px]">
                    <span>Take Profit Target: $92,800</span>
                    <span className="text-rose-400">Stop Loss: $90,650</span>
                  </div>
                  <div className="text-[10px] text-teal-300 pt-1 border-t border-emerald-900/60">
                    ✓ Dispatched to automated trade router in 18ms.
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'fact-fuel':
        return (
          <div className="space-y-4 font-sans">
            {t < 3.2 ? (
              <div className="space-y-2 animate-fadeIn font-mono">
                <div className="flex items-center justify-between text-xs text-amber-400">
                  <span>[00:0{t.toFixed(1)}s] INGESTING BREAKING NEWS WIRE</span>
                  <span className="animate-pulse">● 4 FEEDS QUERIED</span>
                </div>
                <div className="p-3 bg-dark-950/90 rounded-xl border border-amber-500/30 text-xs space-y-1">
                  <div className="text-slate-300">"SpaceX Starship orbital cryogenic propellant transfer test achieved."</div>
                  <div className="text-slate-500 text-[10px]">Cross-checking Reuters, NASA Artemis Feed, Bloomberg, TechCrunch...</div>
                </div>
              </div>
            ) : t < 7.0 ? (
              <div className="space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                  <span>[00:0{t.toFixed(1)}s] GEMINI CROSS-VERIFICATION</span>
                  <span className="text-emerald-400 font-bold font-mono">STATUS: VERIFIED</span>
                </div>
                <div className="p-2.5 bg-dark-950 rounded-xl border border-slate-800 text-xs space-y-1 text-slate-200">
                  <div className="flex items-center gap-1.5 text-teal-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Direct Telemetry Verified
                  </div>
                  <p className="text-[11px] text-slate-400">Propellant transfer mass efficiency verified in low-Earth orbit telemetry.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-mono text-emerald-400 font-bold">
                  <span>[00:{t.toFixed(1)}s] VIRAL SOCIAL SCRIPT SYNTHESIS</span>
                  <span className="text-[10px] text-teal-300 font-mono">0.0% HALLUCINATION</span>
                </div>
                <div className="p-3 bg-dark-950 rounded-xl border border-teal-500/40 text-xs space-y-1.5">
                  <div className="text-amber-300 font-bold text-[11px]">HOOK (0-3s): "Did SpaceX just solve interplanetary refueling?"</div>
                  <div className="text-slate-300 text-[11px]">BODY: Telemetry confirmed cryogenic mass transfer in orbit with zero boiling loss...</div>
                  <div className="text-emerald-400 font-mono text-[10px]">✓ Formatted for TikTok & YouTube Shorts with auto-captions.</div>
                </div>
              </div>
            )}
          </div>
        );

      case 'trading-bot':
        return (
          <div className="space-y-4 font-mono">
            {t < 3.2 ? (
              <div className="space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-xs text-cyan-400">
                  <span>[00:0{t.toFixed(1)}s] MULTI-GRID ORDER ROUTER</span>
                  <span className="text-teal-400">BTC/USDT POOL</span>
                </div>
                <div className="p-3 bg-dark-950 rounded-xl border border-cyan-500/30 text-xs space-y-1">
                  <div className="text-slate-400">&gt; Initializing 24-Level Grid Arbitrage Strategy...</div>
                  <div className="text-cyan-300">&gt; Range: $89,500 - $93,500 | Grid Spread: 0.35%</div>
                </div>
              </div>
            ) : t < 7.0 ? (
              <div className="space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-xs text-emerald-400">
                  <span>[00:0{t.toFixed(1)}s] SUB-50MS ORDER EXECUTION</span>
                  <span className="text-teal-300">FILL LATENCY: 12ms</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                    <span className="text-emerald-400 font-bold">LIMIT BUY: 0.45 BTC @ $90,850</span>
                    <span className="text-teal-300">FILLED (12ms)</span>
                  </div>
                  <div className="flex justify-between p-2 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
                    <span className="text-indigo-400 font-bold">LIMIT SELL: 0.45 BTC @ $91,620</span>
                    <span className="text-teal-300">FILLED (9ms)</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
                  <span>[00:{t.toFixed(1)}s] RISK MANAGEMENT & PNL</span>
                  <span className="text-emerald-400">+18.4% NET ROI</span>
                </div>
                <div className="p-3 bg-dark-950 rounded-xl border border-emerald-500/40 text-xs space-y-1">
                  <div className="flex justify-between"><span className="text-slate-400">Win Rate:</span><span className="text-emerald-400 font-bold">71.3%</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Sharpe Ratio:</span><span className="text-indigo-400 font-bold">2.38</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Max Drawdown:</span><span className="text-rose-400 font-bold">-3.8% (Guarded)</span></div>
                </div>
              </div>
            )}
          </div>
        );

      case 'monopoly-pk':
        return (
          <div className="space-y-4 font-sans">
            {t < 3.2 ? (
              <div className="space-y-2 animate-fadeIn font-mono">
                <div className="flex items-center justify-between text-xs text-indigo-400">
                  <span>[00:0{t.toFixed(1)}s] PAKISTAN METRO REGISTRY SCAN</span>
                  <span>ISLAMABAD F-7 / DHA</span>
                </div>
                <div className="p-3 bg-dark-950 rounded-xl border border-indigo-500/30 text-xs space-y-1 text-slate-300">
                  <div>Plot Size: 1 Kanal Residential • Market Value: PKR 4.5 Cr</div>
                  <div className="text-slate-400 text-[11px]">Indexing rental yields & municipal transfer tax matrices...</div>
                </div>
              </div>
            ) : t < 7.0 ? (
              <div className="space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-mono text-teal-400">
                  <span>[00:0{t.toFixed(1)}s] 5-YEAR CAPITAL GROWTH MODEL</span>
                  <span className="font-mono text-emerald-400">+14.5% / YEAR</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 bg-dark-950 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400">Annual Rental Yield:</span>
                    <div className="text-base font-bold text-emerald-400">6.8% / Year</div>
                  </div>
                  <div className="p-2.5 bg-dark-950 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400">Monthly Cashflow:</span>
                    <div className="text-base font-bold text-teal-300">PKR 255,000</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-mono text-emerald-400 font-bold">
                  <span>[00:{t.toFixed(1)}s] 5-YEAR PROJECTED VALUATION</span>
                  <span className="text-emerald-400">+96.6% 5-YR ROI</span>
                </div>
                <div className="p-3 bg-dark-950 rounded-xl border border-emerald-500/40 text-xs font-mono space-y-1">
                  <div className="text-lg font-black text-emerald-400">PKR 8.85 Crore Valuation</div>
                  <div className="text-[11px] text-slate-300">Net Capital Appreciation: +PKR 4.35 Crore</div>
                  <div className="text-[10px] text-teal-300">✓ High Liquidity Rating (Prime CDA Capital Sector)</div>
                </div>
              </div>
            )}
          </div>
        );

      case 'school-portal':
        return (
          <div className="space-y-4 font-sans">
            {t < 3.2 ? (
              <div className="space-y-2 animate-fadeIn font-mono">
                <div className="flex items-center justify-between text-xs text-emerald-400">
                  <span>[00:0{t.toFixed(1)}s] INBOUND ADMISSION INQUIRY</span>
                  <span>GRADE 9 (O-LEVELS)</span>
                </div>
                <div className="p-3 bg-dark-950 rounded-xl border border-emerald-500/30 text-xs space-y-1 text-slate-300">
                  <div>Student: Ayan Tariq • Prior Academic Record: 88%</div>
                  <div className="text-slate-400 text-[11px]">Evaluating merit scholarship eligibility & sibling discounts...</div>
                </div>
              </div>
            ) : t < 7.0 ? (
              <div className="space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                  <span>[00:0{t.toFixed(1)}s] DYNAMIC TUITION COMPUTATION</span>
                  <span className="text-emerald-400 font-bold font-mono">DISCOUNT: 25%</span>
                </div>
                <div className="p-3 bg-dark-950 rounded-xl border border-slate-800 text-xs space-y-1 font-mono">
                  <div className="flex justify-between"><span className="text-slate-400">Base Tuition:</span><span className="line-through text-slate-400">PKR 18,500</span></div>
                  <div className="flex justify-between"><span className="text-teal-400">Merit + Sibling Discount:</span><span className="text-emerald-400">-PKR 4,625</span></div>
                  <div className="flex justify-between font-bold text-white border-t border-slate-800 pt-1">
                    <span>Final Monthly Tuition:</span>
                    <span className="text-emerald-400">PKR 13,875 / mo</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-mono text-emerald-400 font-bold">
                  <span>[00:{t.toFixed(1)}s] AUTOMATED PROSPECTUS DISPATCH</span>
                  <span>ADMISSION CONFIRMED</span>
                </div>
                <div className="p-3 bg-dark-950 rounded-xl border border-emerald-500/40 text-xs space-y-1">
                  <div className="text-white font-bold">Assessment Scheduled: Saturday, 10:00 AM</div>
                  <p className="text-[11px] text-slate-300">Official prospectus, fee challan, and syllabus dispatched to Parent WhatsApp in 4.2s.</p>
                </div>
              </div>
            )}
          </div>
        );

      case 'ai-receptionist':
        return (
          <div className="space-y-4 font-sans">
            {t < 3.2 ? (
              <div className="space-y-2 animate-fadeIn font-mono">
                <div className="flex items-center justify-between text-xs text-teal-400">
                  <span>[00:0{t.toFixed(1)}s] INCOMING AFTER-HOURS CALL (9:45 PM)</span>
                  <span className="text-rose-400 animate-pulse">● EMERGENCY TRIAGE</span>
                </div>
                <div className="p-3 bg-dark-950 rounded-xl border border-teal-500/30 text-xs text-slate-200">
                  "Hi, I broke my front crown during dinner and have severe pain. Do you take Delta Dental for emergency treatment tomorrow?"
                </div>
              </div>
            ) : t < 7.0 ? (
              <div className="space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                  <span>[00:0{t.toFixed(1)}s] CLINICAL INTENT & INSURANCE VALIDATION</span>
                  <span className="text-emerald-400 font-bold font-mono">VERIFIED IN 180ms</span>
                </div>
                <div className="p-3 bg-dark-950 rounded-xl border border-slate-800 text-xs space-y-1.5">
                  <div className="text-teal-300 font-bold">Apex AI Voice Concierge:</div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    "We can absolutely help with your broken crown! Yes, we accept Delta Dental PPO. Dr. Rivera has an emergency slot tomorrow at 10:30 AM. Shall I lock that in for you?"
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-mono text-emerald-400 font-bold">
                  <span>[00:{t.toFixed(1)}s] APPOINTMENT LOCKED ON CALENDAR</span>
                  <span>SMS DISPATCHED</span>
                </div>
                <div className="p-3 bg-dark-950 rounded-xl border border-emerald-500/40 text-xs space-y-1.5">
                  <div className="flex justify-between font-bold text-white">
                    <span>Dr. Rivera (Emergency Operatory #2)</span>
                    <span className="text-emerald-400">Saturday 10:30 AM</span>
                  </div>
                  <div className="text-[11px] text-slate-300">Patient intake form & GPS clinic directions texted to caller. $1,450 treatment value secured.</div>
                </div>
              </div>
            )}
          </div>
        );

      case 'speed-lead':
        return (
          <div className="space-y-4 font-sans">
            {t < 3.2 ? (
              <div className="space-y-2 animate-fadeIn font-mono">
                <div className="flex items-center justify-between text-xs text-teal-400">
                  <span>[00:0{t.toFixed(1)}s] INBOUND WEBHOOK INGEST</span>
                  <span>ZILLOW LUXURY INQUIRY</span>
                </div>
                <div className="p-3 bg-dark-950 rounded-xl border border-teal-500/30 text-xs text-slate-300 font-mono">
                  <div>Buyer: David Miller • Budget: $1.4M (Pre-Approved Cash/Jumbo)</div>
                  <div className="text-teal-300">&gt; Automated enrichment triggered in 0.8s...</div>
                </div>
              </div>
            ) : t < 7.0 ? (
              <div className="space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                  <span>[00:0{t.toFixed(1)}s] 2-WAY AUTONOMOUS SMS QUALIFICATION</span>
                  <span className="text-emerald-400 font-bold font-mono">RESPONSE IN 18s</span>
                </div>
                <div className="p-3 bg-dark-950 rounded-xl border border-slate-800 text-xs space-y-1">
                  <div className="text-teal-400 font-mono font-bold">Rine AI Lead Concierge:</div>
                  <p className="text-slate-300 text-[11px]">
                    "Hi David! I have the 3D floorplan for the 14th-floor penthouse. Would you like a private showing this Saturday at 11:30 AM or 2:00 PM?"
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-mono text-emerald-400 font-bold">
                  <span>[00:{t.toFixed(1)}s] PRIVATE SHOWING BOOKED (38s TOTAL)</span>
                  <span>GOOGLE CALENDAR SYNCED</span>
                </div>
                <div className="p-3 bg-dark-950 rounded-xl border border-emerald-500/40 text-xs space-y-1">
                  <div className="text-white font-bold">Penthouse Tour Confirmed: Saturday 11:30 AM</div>
                  <div className="text-[11px] text-slate-300">Broker notified via SMS + High-Intent CRM tag assigned. Zero human delay.</div>
                </div>
              </div>
            )}
          </div>
        );

      case 'omnisync':
      default:
        return (
          <div className="space-y-4 font-sans">
            {t < 3.2 ? (
              <div className="space-y-2 animate-fadeIn font-mono">
                <div className="flex items-center justify-between text-xs text-rose-400">
                  <span>[00:0{t.toFixed(1)}s] EMERGENCY CALL TRANSCRIPTION (2:15 AM)</span>
                  <span className="animate-pulse">● WHISPER AI</span>
                </div>
                <div className="p-3 bg-dark-950 rounded-xl border border-rose-500/30 text-xs text-slate-300">
                  "Caller: Facilities Manager at Metro Food Plaza. Our main walk-in chiller is throwing Error E-42. Over $60k of frozen inventory at risk!"
                </div>
              </div>
            ) : t < 7.0 ? (
              <div className="space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-mono text-amber-400">
                  <span>[00:0{t.toFixed(1)}s] URGENCY CLASSIFICATION & FAULT TRIAGE</span>
                  <span className="text-rose-400 font-bold font-mono">PRIORITY 1 CRITICAL</span>
                </div>
                <div className="p-3 bg-dark-950 rounded-xl border border-slate-800 text-xs space-y-1 font-mono">
                  <div className="text-slate-300">Fault: Compressor Pressure Valve Malfunction (Code E-42)</div>
                  <div className="text-teal-300">Assigned: Tech Marcus Vance (3.8 miles away, on-call)</div>
                </div>
              </div>
            ) : (
              <div className="space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-mono text-emerald-400 font-bold">
                  <span>[00:{t.toFixed(1)}s] JOBBER CRM WORK ORDER DISPATCHED</span>
                  <span>ETA 18 MINUTES</span>
                </div>
                <div className="p-3 bg-dark-950 rounded-xl border border-emerald-500/40 text-xs space-y-1">
                  <div className="text-white font-bold">Emergency Ticket #9481 Dispatched with GPS Route</div>
                  <div className="text-[11px] text-slate-300">Client SMS updated with live technician tracker. Incident logged to manager dashboard.</div>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-dark-950/85 backdrop-blur-md">
      <div className="bg-dark-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full p-5 sm:p-7 space-y-5 shadow-2xl relative text-slate-100 animate-fadeIn">
        
        {/* Top Header & Switcher */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center text-dark-950 font-black shadow-md">
              <Play className="w-4 h-4 fill-dark-950 ml-0.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{activeProject.name}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-md font-bold">
                  10s ARCHITECTURE SKIT
                </span>
              </div>
              <div className="text-xs text-slate-400">{activeProject.badge}</div>
            </div>
          </div>

          {/* Controls Right */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-dark-950 border border-slate-800 rounded-lg p-0.5">
              <button
                onClick={handlePrev}
                disabled={currentIndex <= 0}
                className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                title="Previous Demo"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[10px] font-mono text-slate-400 px-1">{currentIndex + 1}/{allProjects.length}</span>
              <button
                onClick={handleNext}
                disabled={currentIndex >= allProjects.length - 1}
                className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                title="Next Demo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-dark-850 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Canvas Stage */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950 p-4 sm:p-6 min-h-[220px] flex flex-col justify-between shadow-inner group">
          {/* Background Image Ambient Glow */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-10 blur-sm pointer-events-none"
            style={{ backgroundImage: `url(${activeProject.image})` }}
          />

          {/* Top Telemetry Header inside player */}
          <div className="flex items-center justify-between text-[11px] font-mono border-b border-slate-800/80 pb-2.5 z-10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-teal-400 font-bold">1080p LIVE STREAM</span>
            </div>
            <div className="flex items-center gap-3">
              {/* Audio Wave Visualizer */}
              <div className="flex items-end gap-0.5 h-3.5 px-2 bg-dark-950 rounded-md border border-slate-800">
                <span className={`w-0.5 bg-teal-400 rounded-full ${isPlaying ? 'animate-wave-1' : 'h-1.5'}`} />
                <span className={`w-0.5 bg-teal-400 rounded-full ${isPlaying ? 'animate-wave-2' : 'h-2'}`} />
                <span className={`w-0.5 bg-teal-400 rounded-full ${isPlaying ? 'animate-wave-3' : 'h-1'}`} />
                <span className={`w-0.5 bg-teal-400 rounded-full ${isPlaying ? 'animate-wave-4' : 'h-2.5'}`} />
                <span className={`w-0.5 bg-teal-400 rounded-full ${isPlaying ? 'animate-wave-5' : 'h-1.5'}`} />
              </div>
              <span className="text-slate-300 font-mono">00:{currentTime < 10 ? `0${currentTime.toFixed(1)}` : '10.0'} / 00:10.0</span>
            </div>
          </div>

          {/* Dynamic Scene Stage Content */}
          <div className="py-4 z-10">
            {renderProjectSkit()}
          </div>

          {/* Interactive Timeline Scrubber */}
          <div className="space-y-2 z-10 pt-2 border-t border-slate-800/80">
            <div 
              onClick={handleSeek}
              className="w-full h-2.5 bg-dark-950 rounded-full overflow-hidden cursor-pointer relative border border-slate-800"
            >
              <div 
                className="h-full bg-gradient-to-r from-teal-500 via-cyan-400 to-indigo-500 rounded-full transition-all"
                style={{ width: `${(currentTime / 10) * 100}%` }}
              />
            </div>

            {/* Sub-timeline cues */}
            <div className="flex justify-between text-[9px] font-mono text-slate-500">
              <span className={currentTime < 3.5 ? 'text-teal-400 font-bold' : ''}>0s: Ingest & Telemetry</span>
              <span className={currentTime >= 3.5 && currentTime < 7.5 ? 'text-cyan-400 font-bold' : ''}>4s: Neural Inference</span>
              <span className={currentTime >= 7.5 ? 'text-emerald-400 font-bold' : ''}>8s: Action Dispatch</span>
            </div>
          </div>
        </div>

        {/* Video Player Control Bar */}
        <div className="flex items-center justify-between gap-2 pt-1 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3.5 py-2 bg-dark-850 hover:bg-dark-800 text-white border border-slate-700 rounded-xl font-bold flex items-center gap-1.5 transition-colors"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={handleReplay}
              className="p-2 bg-dark-850 hover:bg-dark-800 text-slate-300 hover:text-white border border-slate-700 rounded-xl transition-colors"
              title="Replay from start"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setSpeed(s => s === 1 ? 1.5 : s === 1.5 ? 2 : 1)}
              className="px-2.5 py-2 bg-dark-850 hover:bg-dark-800 text-slate-300 border border-slate-700 rounded-xl font-mono text-[11px] font-bold"
              title="Playback Speed"
            >
              {speed}x
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onSelectPackage('ai-receptionist');
              }}
              className="px-5 py-2 bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-dark-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-teal-500/20 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" /> Deploy Custom Engine ($249 - $449 Deposit) →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
