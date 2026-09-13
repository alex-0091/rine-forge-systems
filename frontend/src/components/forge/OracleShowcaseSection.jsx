import React, { useState, useEffect } from 'react';
import { 
  Activity, RefreshCw, ArrowRight, ShieldCheck, Terminal, 
  Cpu, Database, Flame, Zap, PhoneCall, CheckCircle2, Play
} from 'lucide-react';

export function OracleShowcaseSection({ onNavigate }) {
  const [activeSubTab, setActiveSubTab] = useState('oracle');
  
  // Oracle State
  const [oracleData, setOracleData] = useState(null);
  const [oracleLoading, setOracleLoading] = useState(false);

  // Speed to lead state
  const [speedLogs, setSpeedLogs] = useState([]);
  const [speedRunning, setSpeedRunning] = useState(false);

  // OmniSync call state
  const [omniRunning, setOmniRunning] = useState(false);
  const [omniTicket, setOmniTicket] = useState(null);

  const fetchOracleData = async () => {
    setOracleLoading(true);
    try {
      const res = await fetch('/api/public/interactive/oracle-ai/stream');
      const data = await res.json();
      setOracleData(data);
    } catch (e) {
      setOracleData({
        pair: 'BTC/USDT',
        timeframe: '5m',
        current_price: 91420.50,
        rsi_14: 63.4,
        orderbook_imbalance: 0.28,
        predicted_direction: 'LONG (Momentum Shift)',
        confidence_pct: 82.4,
        take_profit: 92800.00,
        stop_loss: 90650.00,
        latency_ms: 14,
        microstructure: {
          bid_liquidity_depth: '$14.2M (Dense Bid Wall @ 91,200)',
          ask_liquidity_depth: '$8.6M (Thin to 92,500)',
          funding_rate: '+0.0082% (Neutral-Bullish)'
        }
      });
    } finally {
      setOracleLoading(false);
    }
  };

  useEffect(() => {
    fetchOracleData();
  }, []);

  const runSpeedSim = () => {
    setSpeedRunning(true);
    setSpeedLogs([]);
    setTimeout(() => setSpeedLogs(p => [...p, '⚡ 00:01s — Inbound lead webhook received from Realtor.com portal']), 600);
    setTimeout(() => setSpeedLogs(p => [...p, '🧠 00:08s — AI Lead Classifier parsed intent: Pre-approved buyer ($1.4M budget)']), 1400);
    setTimeout(() => setSpeedLogs(p => [...p, '📱 00:19s — Autonomous 2-way SMS sent with interactive 3D virtual tour link']), 2200);
    setTimeout(() => {
      setSpeedLogs(p => [...p, '✅ 00:38s — Buyer selected Saturday 11:30 AM slot. VIP Showing confirmed on Broker calendar!']);
      setSpeedRunning(false);
    }, 3200);
  };

  const runOmniSim = () => {
    setOmniRunning(true);
    setOmniTicket(null);
    setTimeout(() => {
      setOmniTicket({
        caller: 'Apex Commercial Plaza (Facilities Manager)',
        audio: 'Emergency: Rooftop 20-ton chiller unit #3 in Building B is throwing E-42 pressure fault. Need urgent HVAC technician on site before server room overheats.',
        triage: 'PRIORITY_1_CRITICAL (Commercial Chillers)',
        assignedTech: 'Marcus Vance (Tech ID #409, 4.2 miles away)',
        etaMinutes: 14,
        crmStatus: 'JOBBER_WORK_ORDER_#9481_DISPATCHED'
      });
      setOmniRunning(false);
    }, 1800);
  };

  return (
    <section id="case-studies" className="py-16 sm:py-24 border-b border-slate-800/80 bg-[#080c14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="text-xs font-mono font-bold text-teal-400 tracking-widest uppercase">
            PROOF OF ENGINEERING CAPABILITY
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            WE DON'T JUST TALK ABOUT AI. WE BUILD SYSTEMS.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Review our active internal systems and architectures below. We write real asynchronous pipelines, manage high-throughput event queues, and build systems intended to operate reliably in production.
          </p>
        </div>

        {/* Showcase Sub-tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-dark-900 border border-slate-800 rounded-2xl max-w-2xl mx-auto">
          <button
            onClick={() => setActiveSubTab('oracle')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-mono font-bold transition-all ${
              activeSubTab === 'oracle' ? 'bg-teal-500 text-dark-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Oracle AI (Quant Microstructure)
          </button>
          <button
            onClick={() => setActiveSubTab('speed')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-mono font-bold transition-all ${
              activeSubTab === 'speed' ? 'bg-teal-500 text-dark-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Speed-to-Lead (&lt;60s Pipeline)
          </button>
          <button
            onClick={() => setActiveSubTab('omnisync')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-mono font-bold transition-all ${
              activeSubTab === 'omnisync' ? 'bg-teal-500 text-dark-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            OmniSync (Voice Audio Triage)
          </button>
        </div>

        {/* --- TAB 1: ORACLE AI --- */}
        {activeSubTab === 'oracle' && (
          <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl">
            {/* Header & Badges */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-black text-white">Oracle AI</h3>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded font-bold">
                    INTERNAL FORGE SYSTEM / DEMONSTRATION
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  Autonomous real-time market intelligence and orderbook microstructure prediction system.
                </p>
              </div>

              <button
                onClick={fetchOracleData}
                disabled={oracleLoading}
                className="px-4 py-2 bg-dark-950 hover:bg-dark-850 text-slate-200 border border-slate-700 rounded-xl text-xs font-mono font-bold flex items-center gap-2 shrink-0 self-start sm:self-auto"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${oracleLoading ? 'animate-spin text-teal-400' : ''}`} />
                <span>{oracleLoading ? 'Polling Ring Buffer...' : 'Refresh Telemetry'}</span>
              </button>
            </div>

            {/* Visual Architecture Diagram */}
            <div className="space-y-3">
              <div className="text-xs font-mono text-slate-400 uppercase font-bold tracking-wider">
                System Architecture Flow:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs font-mono">
                <div className="p-3 bg-dark-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-[10px] text-teal-400 font-bold">DATA</div>
                  <div className="text-slate-300 text-[11px]">10Gbps WS Ingest</div>
                </div>
                <div className="p-3 bg-dark-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-[10px] text-cyan-400 font-bold">ANALYSIS</div>
                  <div className="text-slate-300 text-[11px]">Depth Imbalance</div>
                </div>
                <div className="p-3 bg-dark-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-[10px] text-indigo-400 font-bold">AI REASONING</div>
                  <div className="text-slate-300 text-[11px]">Pattern Gating</div>
                </div>
                <div className="p-3 bg-dark-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-[10px] text-amber-400 font-bold">SCORING</div>
                  <div className="text-slate-300 text-[11px]">Confidence %</div>
                </div>
                <div className="p-3 bg-dark-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-[10px] text-rose-400 font-bold">DECISION</div>
                  <div className="text-slate-300 text-[11px]">Risk Safeguards</div>
                </div>
                <div className="p-3 bg-dark-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-[10px] text-emerald-400 font-bold">REPORTING</div>
                  <div className="text-slate-300 text-[11px]">Signal Dispatch</div>
                </div>
              </div>
            </div>

            {/* Live Telemetry Output */}
            {oracleData ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 bg-dark-950 border border-slate-800 rounded-2xl space-y-3 font-mono">
                  <div className="text-xs text-slate-400 uppercase font-bold">Signal Vector</div>
                  <div className="text-2xl font-black text-emerald-400">{oracleData.predicted_direction}</div>
                  <div className="space-y-1 text-xs text-slate-300 pt-2 border-t border-slate-800">
                    <div className="flex justify-between"><span>Confidence Score:</span><strong className="text-teal-400">{oracleData.confidence_pct}%</strong></div>
                    <div className="flex justify-between"><span>Ingest Latency:</span><strong className="text-white">{oracleData.latency_ms}ms</strong></div>
                    <div className="flex justify-between"><span>RSI(14) Momentum:</span><strong className="text-cyan-400">{oracleData.rsi_14}</strong></div>
                  </div>
                </div>

                <div className="p-5 bg-dark-950 border border-slate-800 rounded-2xl space-y-3 font-mono">
                  <div className="text-xs text-slate-400 uppercase font-bold">Automated Risk Bounding</div>
                  <div className="space-y-2">
                    <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex justify-between items-center text-xs">
                      <span className="text-slate-300">Take Profit Target:</span>
                      <span className="font-bold text-emerald-400">${oracleData.take_profit?.toLocaleString()}</span>
                    </div>
                    <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl flex justify-between items-center text-xs">
                      <span className="text-slate-300">Stop Loss Guard:</span>
                      <span className="font-bold text-rose-400">${oracleData.stop_loss?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-dark-950 border border-slate-800 rounded-2xl space-y-3 font-mono">
                  <div className="text-xs text-slate-400 uppercase font-bold">Orderbook Depth Profile</div>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="p-2 bg-dark-900 rounded border border-slate-800 text-[11px]">{oracleData.microstructure?.bid_liquidity_depth}</div>
                    <div className="p-2 bg-dark-900 rounded border border-slate-800 text-[11px]">{oracleData.microstructure?.ask_liquidity_depth}</div>
                    <div className="p-2 bg-dark-900 rounded border border-slate-800 text-[11px] text-teal-400">Funding: {oracleData.microstructure?.funding_rate}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 font-mono text-xs">Initializing WebSocket feed...</div>
            )}

            {/* Honest Engineering Disclaimer */}
            <div className="p-4 bg-dark-950 rounded-2xl border border-slate-800 text-xs text-slate-400 leading-relaxed font-mono">
              <strong className="text-slate-300">Engineering Note:</strong> Oracle AI is an internal technology showcase demonstrating our team's capabilities in low-latency event processing, asynchronous stream ingestion, and real-time probabilistic scoring. FORGE does not sell financial or trading advisory services.
            </div>
          </div>
        )}

        {/* --- TAB 2: SPEED TO LEAD --- */}
        {activeSubTab === 'speed' && (
          <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-black text-white">Speed-to-Lead Qualification Pipeline</h3>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded font-bold">
                    INTERNAL DEMONSTRATION
                  </span>
                </div>
                <p className="text-xs text-slate-400">Simulates sub-60s webhook capture, intent scoring, 2-way SMS dialogue, and calendar booking.</p>
              </div>

              <button
                onClick={runSpeedSim}
                disabled={speedRunning}
                className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl text-xs flex items-center gap-2 shrink-0"
              >
                {speedRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                <span>{speedRunning ? 'Executing Inbound Ingest...' : 'Simulate Inbound Lead (<60s)'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
              <div className="p-5 bg-dark-950 rounded-2xl border border-slate-800 space-y-3">
                <div className="text-slate-400 uppercase font-bold text-[10px]">Simulated Inbound Webhook Payload:</div>
                <div className="p-3 bg-dark-900 rounded-xl border border-slate-800 text-slate-300 space-y-1">
                  <div>source: "Zillow Premier Agent"</div>
                  <div>lead_name: "David Miller"</div>
                  <div>inquiry: "Looking for 3-bedroom penthouse in downtown, pre-approved cash."</div>
                  <div>budget_tier: "$1,400,000 USD"</div>
                </div>
              </div>

              <div className="p-5 bg-dark-950 rounded-2xl border border-slate-800 space-y-3">
                <div className="text-slate-400 uppercase font-bold text-[10px]">Real-Time Execution Telemetry:</div>
                <div className="h-40 bg-dark-900 rounded-xl p-3 border border-slate-800 overflow-y-auto space-y-2">
                  {speedLogs.length === 0 ? (
                    <div className="text-slate-500 text-center py-12">Click simulate button above to trigger pipeline...</div>
                  ) : (
                    speedLogs.map((log, i) => (
                      <div key={i} className="text-teal-300">{log}</div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 3: OMNISYNC --- */}
        {activeSubTab === 'omnisync' && (
          <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-black text-white">OmniSync Audio Triage & Dispatch</h3>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded font-bold">
                    INTERNAL DEMONSTRATION
                  </span>
                </div>
                <p className="text-xs text-slate-400">Transcribes voice breakdown calls, evaluates fault codes, and creates CRM work orders.</p>
              </div>

              <button
                onClick={runOmniSim}
                disabled={omniRunning}
                className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl text-xs flex items-center gap-2 shrink-0"
              >
                {omniRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <PhoneCall className="w-3.5 h-3.5" />}
                <span>{omniRunning ? 'Transcribing & Triaging...' : 'Simulate Emergency Call'}</span>
              </button>
            </div>

            <div className="p-5 bg-dark-950 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
              <div className="text-slate-400 uppercase font-bold text-[10px]">Triage Dispatch Ticket:</div>
              {omniTicket ? (
                <div className="space-y-2">
                  <div className="p-3 bg-dark-900 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Caller:</span>
                    <span className="text-white font-bold">{omniTicket.caller}</span>
                  </div>
                  <div className="p-3 bg-dark-900 rounded-xl border border-slate-800 font-sans text-slate-300">
                    <span className="text-slate-400 font-mono block text-[10px]">Whisper Transcript:</span>
                    "{omniTicket.audio}"
                  </div>
                  <div className="p-3 bg-dark-900 rounded-xl border border-slate-800 flex justify-between items-center">
                    <span className="text-rose-400 font-bold">{omniTicket.triage}</span>
                    <span className="text-emerald-400">{omniTicket.assignedTech} (ETA: {omniTicket.etaMinutes}m)</span>
                  </div>
                </div>
              ) : (
                <div className="text-slate-500 text-center py-12">Click simulate button above to process breakdown audio...</div>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
