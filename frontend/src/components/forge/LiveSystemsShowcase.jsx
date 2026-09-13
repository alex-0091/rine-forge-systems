import React, { useState } from 'react';
import { 
  Zap, Bot, Send, FileText, MessageSquare, Search, 
  Play, ArrowRight, CheckCircle2, RefreshCw, Sparkles, 
  Terminal, ShieldCheck, Check, CornerDownRight, Database 
} from 'lucide-react';
import { SYSTEMS_CATALOG } from '../../data/forgePlatformConfig';

export function LiveSystemsShowcase({ onNavigate }) {
  const [activeSystemId, setActiveSystemId] = useState('lead-agent');
  const activeSystem = SYSTEMS_CATALOG.find(s => s.id === activeSystemId) || SYSTEMS_CATALOG[0];

  const [inputVal, setInputVal] = useState(activeSystem.demoConfig.defaultInput);
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState(activeSystem.demoConfig.sampleOutput);
  const [executionStep, setExecutionStep] = useState(4);

  const handleSystemChange = (id) => {
    setActiveSystemId(id);
    const sys = SYSTEMS_CATALOG.find(s => s.id === id);
    if (sys) {
      setInputVal(sys.demoConfig.defaultInput);
      setExecutionResult(sys.demoConfig.sampleOutput);
      setExecutionStep(4);
    }
  };

  const handleRunDemo = (e) => {
    if (e) e.preventDefault();
    setIsRunning(true);
    setExecutionStep(1);

    setTimeout(() => setExecutionStep(2), 500);
    setTimeout(() => setExecutionStep(3), 1100);
    setTimeout(() => {
      setExecutionStep(4);
      setIsRunning(false);
    }, 1700);
  };

  return (
    <section id="try-ai" className="py-24 border-t border-slate-800 bg-[#070b13] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" /> DON'T TAKE OUR WORD FOR IT • RUN THE SYSTEM
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Interactive AI Systems Playground
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Test our production AI systems right now. Give them real business inputs, watch their reasoning steps, and inspect the structured actions they execute in real time.
          </p>
        </div>

        {/* System Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start lg:justify-center">
          {SYSTEMS_CATALOG.slice(0, 6).map((sys) => {
            const isActive = activeSystemId === sys.id;
            return (
              <button
                key={sys.id}
                onClick={() => handleSystemChange(sys.id)}
                className={`px-4 py-3 rounded-xl text-xs font-mono font-bold shrink-0 transition-all flex items-center gap-2 border ${
                  isActive
                    ? 'bg-teal-500 text-dark-950 border-teal-400 shadow-lg shadow-teal-500/20'
                    : 'bg-[#0a0f1a] text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                <span>{sys.name.replace('FORGE ', '')}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                  isActive ? 'bg-dark-950/20 text-dark-950' : 'bg-slate-900 text-teal-400'
                }`}>
                  {sys.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Live Interactive Playground Box */}
        <div className="p-6 sm:p-10 rounded-3xl bg-[#090e18] border border-slate-800 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 blur-[120px] pointer-events-none rounded-full" />
          
          {/* Top System Summary */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h3 className="text-2xl font-black text-white">{activeSystem.name}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  SANDBOX DEMO MODE
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">{activeSystem.headline}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate && onNavigate(`system-${activeSystem.slug}`)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all"
              >
                View System Specs →
              </button>
              <button
                onClick={() => onNavigate && onNavigate('app-onboarding')}
                className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-dark-950 rounded-xl text-xs font-black transition-all shadow-md"
              >
                Deploy Free Trial →
              </button>
            </div>
          </div>

          {/* 4-Step Execution Pipeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
            {activeSystem.workflowSteps.map((st, i) => {
              const stepNum = i + 1;
              const isCurrent = executionStep === stepNum && isRunning;
              const isDone = executionStep >= stepNum;
              return (
                <div
                  key={i}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-teal-500/20 border-teal-400 text-white animate-pulse'
                      : isDone
                      ? 'bg-slate-900/90 border-slate-800 text-slate-200'
                      : 'bg-slate-950/60 border-slate-900 text-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-teal-400 font-bold">STAGE {st.step}</span>
                    {isCurrent ? (
                      <RefreshCw className="w-3 h-3 animate-spin text-teal-300" />
                    ) : isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : null}
                  </div>
                  <div className="font-bold text-[11px] pt-1">{st.title}</div>
                  <div className="text-[10px] text-slate-400 pt-0.5 leading-tight">{st.desc}</div>
                </div>
              );
            })}
          </div>

          {/* Interactive Input / Output Workbench */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Input Pane (5 cols) */}
            <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-teal-400" /> Test Input
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">Editable Sandbox</span>
                </div>
                <textarea
                  rows={5}
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Enter sample text, inquiry or URL..."
                  className="w-full bg-[#05080f] border border-slate-800 focus:border-teal-500 focus:outline-none rounded-2xl p-4 text-xs font-mono text-slate-200 placeholder-slate-600 leading-relaxed"
                />
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleRunDemo}
                  disabled={isRunning}
                  className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-dark-950 font-black rounded-xl text-xs font-mono transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2"
                >
                  {isRunning ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>EXECUTING SYSTEM REASONING...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>EXECUTE LIVE SANDBOX TEST</span>
                    </>
                  )}
                </button>

                <div className="text-[10px] font-mono text-slate-400 text-center flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  <span>Sandbox execution • No external accounts modified</span>
                </div>
              </div>
            </div>

            {/* Right Output Pane (7 cols) */}
            <div className="lg:col-span-7 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-cyan-400" /> Structured System Output
                </label>
                <span className="text-[10px] font-mono text-emerald-400">● 99.4% Confidence</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#05080f] border border-slate-800 font-mono text-xs space-y-3 min-h-[220px]">
                {Object.entries(executionResult).map(([key, value], i) => (
                  <div key={i} className="space-y-1">
                    <div className="text-[10px] text-teal-400 font-bold uppercase tracking-wider">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </div>
                    {typeof value === 'object' && !Array.isArray(value) ? (
                      <pre className="text-[11px] text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-850 overflow-x-auto">
                        {JSON.stringify(value, null, 2)}
                      </pre>
                    ) : Array.isArray(value) ? (
                      <ul className="text-[11px] text-slate-300 space-y-1 pl-3 border-l border-slate-800">
                        {value.map((item, idx) => (
                          <li key={idx}>• {typeof item === 'object' ? JSON.stringify(item) : item}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-[11px] text-slate-200 bg-slate-900/60 p-2.5 rounded-lg border border-slate-850 leading-relaxed">
                        {value.toString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom Action Strip */}
          <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400 font-mono">
              Supported Integrations: <strong className="text-white">{activeSystem.supportedIntegrations.join(', ')}</strong>
            </div>
            <button
              onClick={() => onNavigate && onNavigate('app-onboarding')}
              className="text-xs font-mono font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1.5 transition-colors"
            >
              <span>Connect this system to your business tools</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
