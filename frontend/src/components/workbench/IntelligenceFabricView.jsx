import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Brain,
  Shield,
  Zap,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Play,
  Layers,
  Wrench,
  UserCheck,
  Send,
  Eye,
  RefreshCw,
  Terminal,
  Activity,
  FileText
} from 'lucide-react';

export default function IntelligenceFabricView() {
  const [activeTab, setActiveTab] = useState('tell_forge');
  const [prompt, setPrompt] = useState('');
  const [processing, setProcessing] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [approvals, setApprovals] = useState([]);
  const [governorStatus, setGovernorStatus] = useState(null);
  const [agents, setAgents] = useState([]);
  const [tools, setTools] = useState([]);
  const [events, setEvents] = useState([]);
  const [simulationBlueprint, setSimulationBlueprint] = useState(null);
  const [simulationScorecard, setSimulationScorecard] = useState(null);
  const [simulating, setSimulating] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [govRes, appRes, agRes, toolRes, evRes] = await Promise.all([
        fetch('/api/v1/intelligence/governor').then(r => r.ok ? r.json() : null),
        fetch('/api/v1/intelligence/approvals').then(r => r.ok ? r.json() : []),
        fetch('/api/v1/intelligence/agents').then(r => r.ok ? r.json() : []),
        fetch('/api/v1/intelligence/tools').then(r => r.ok ? r.json() : []),
        fetch('/api/v1/intelligence/events').then(r => r.ok ? r.json() : [])
      ]);
      if (govRes) setGovernorStatus(govRes);
      if (appRes) setApprovals(appRes);
      if (agRes) setAgents(agRes);
      if (toolRes) setTools(toolRes);
      if (evRes) setEvents(evRes);
    } catch (err) {
      console.error('Error fetching intelligence fabric telemetry:', err);
    }
  };

  const handleTellForgeSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || processing) return;

    setProcessing(true);
    setExecutionResult(null);
    setErrorMsg(null);
    setCurrentStep(1);

    // Multi-stage visual progression simulation
    const timer1 = setTimeout(() => setCurrentStep(2), 700);
    const timer2 = setTimeout(() => setCurrentStep(3), 1400);
    const timer3 = setTimeout(() => setCurrentStep(4), 2100);

    try {
      const res = await fetch('/api/v1/intelligence/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request: prompt,
          workspace_id: 'default',
          policy: 'LOCAL_FIRST',
          allow_external_side_effects: false
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Execution error');

      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setCurrentStep(5);
      setExecutionResult(data);

      if (data.requires_approval) {
        fetchInitialData();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Forge encountered an execution constraint.');
    } finally {
      setProcessing(false);
    }
  };

  const handleResolveApproval = async (approvalId, approved) => {
    try {
      const res = await fetch(`/api/v1/intelligence/approvals/${approvalId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved, operator_id: 'current_user' })
      });
      if (res.ok) {
        fetchInitialData();
      }
    } catch (err) {
      console.error('Failed to resolve approval gate:', err);
    }
  };

  const handleGenerateAndSimulateEmployee = async (employeeType) => {
    setSimulating(true);
    setSimulationScorecard(null);
    try {
      const genRes = await fetch('/api/v1/intelligence/employees/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employee_type: employeeType, business_name: 'Austin Premier Practice' })
      });
      const blueprint = await genRes.json();
      setSimulationBlueprint(blueprint);

      const simRes = await fetch('/api/v1/intelligence/employees/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blueprint)
      });
      const scorecard = await simRes.json();
      setSimulationScorecard(scorecard);
    } catch (err) {
      console.error('Simulation failed:', err);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Telemetry Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-lg border border-indigo-500/30">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">Forge Intelligence Fabric</h2>
              <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                LOCAL ONLY
              </span>
            </div>
            <p className="text-xs text-slate-400">
              One coherent intelligence layer above local Ollama models, agents, and sandboxed tools.
            </p>
          </div>
        </div>

        {governorStatus && (
          <div className="flex items-center gap-4 text-xs">
            <div className="bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-700">
              <div className="text-slate-400">RAM Pressure</div>
              <div className="font-semibold text-white">{governorStatus.ram_used_pct}% ({governorStatus.ram_available_gb} GB free)</div>
            </div>
            <div className="bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-700">
              <div className="text-slate-400">Concurrency</div>
              <div className="font-semibold text-white">{governorStatus.active_jobs} / {governorStatus.max_concurrent_jobs} jobs</div>
            </div>
            <div className="bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-700">
              <div className="text-slate-400">Approval Queue</div>
              <div className="font-semibold text-amber-400">{approvals.length} pending</div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab('tell_forge')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'tell_forge'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4" />
          Tell Forge
        </button>
        <button
          onClick={() => setActiveTab('approvals')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'approvals'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Approval Queue ({approvals.length})
        </button>
        <button
          onClick={() => setActiveTab('employees')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'employees'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          AI Employees & Simulation
        </button>
        <button
          onClick={() => setActiveTab('console')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'console'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Terminal className="w-4 h-4" />
          Admin Console ({agents.length} Agents, {tools.length} Tools)
        </button>
      </div>

      {/* TAB 1: TELL FORGE UNIVERSAL INTERFACE */}
      {activeTab === 'tell_forge' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
            <h3 className="text-base font-semibold text-white mb-2">Describe what your business needs</h3>
            <p className="text-sm text-slate-400 mb-4">
              Forge automatically understands intent, chooses the right agent and local model, creates an execution plan, and verifies the deliverable.
            </p>

            <form onSubmit={handleTellForgeSubmit} className="space-y-4">
              <div className="relative">
                <textarea
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. 'Build me a website for my dental clinic in Austin specializing in implants', or 'Reply to this customer asking for Saturday hours'..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>Enforces local-only policy & zero arithmetic hallucinations</span>
                </div>
                <button
                  type="submit"
                  disabled={processing || !prompt.trim()}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg font-medium text-sm flex items-center gap-2 transition-all shadow-md"
                >
                  {processing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Execute with Fabric
                </button>
              </div>
            </form>
          </div>

          {/* Real-time Visual Execution Pipeline */}
          {processing && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md animate-fade-in">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4" /> Orchestration Pipeline Live
              </h4>
              <div className="grid grid-cols-5 gap-3 text-center text-xs">
                <div className={`p-3 rounded-lg border ${currentStep >= 1 ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-slate-800 bg-slate-950 text-slate-500'}`}>
                  <div className="font-semibold mb-1">1. Understanding</div>
                  <div>{currentStep >= 1 ? '✓ Categorized' : '...'}</div>
                </div>
                <div className={`p-3 rounded-lg border ${currentStep >= 2 ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-slate-800 bg-slate-950 text-slate-500'}`}>
                  <div className="font-semibold mb-1">2. Planning</div>
                  <div>{currentStep >= 2 ? '✓ Steps Compiled' : '...'}</div>
                </div>
                <div className={`p-3 rounded-lg border ${currentStep >= 3 ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-slate-800 bg-slate-950 text-slate-500'}`}>
                  <div className="font-semibold mb-1">3. Agent & Tools</div>
                  <div>{currentStep >= 3 ? '✓ Sandboxed' : '...'}</div>
                </div>
                <div className={`p-3 rounded-lg border ${currentStep >= 4 ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300 animate-pulse' : 'border-slate-800 bg-slate-950 text-slate-500'}`}>
                  <div className="font-semibold mb-1">4. Execution</div>
                  <div>{currentStep >= 4 ? '● Inferring' : '...'}</div>
                </div>
                <div className={`p-3 rounded-lg border ${currentStep >= 5 ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-slate-800 bg-slate-950 text-slate-500'}`}>
                  <div className="font-semibold mb-1">5. Verification</div>
                  <div>{currentStep >= 5 ? '✓ Validated' : '...'}</div>
                </div>
              </div>
            </div>
          )}

          {/* Execution Result Card */}
          {executionResult && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  {executionResult.requires_approval ? (
                    <span className="px-2.5 py-1 text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-md flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> APPROVAL REQUIRED
                    </span>
                  ) : executionResult.status === 'COMPLETED' ? (
                    <span className="px-2.5 py-1 text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> COMPLETED & VERIFIED
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30 rounded-md flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5" /> FAILED
                    </span>
                  )}
                  <span className="text-xs text-slate-400">Agent: <strong className="text-white">{executionResult.selected_agent}</strong></span>
                  <span className="text-xs text-slate-400">Model: <strong className="text-white">{executionResult.selected_model?.model}</strong></span>
                </div>
                <div className="text-xs text-slate-500">
                  Latency: {executionResult.latency_ms} ms
                </div>
              </div>

              {/* Message / Response */}
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-sm text-slate-200 whitespace-pre-wrap">
                {executionResult.response_text}
              </div>

              {/* Verification & Tool Breakdown */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-indigo-400" /> Checks Passed
                  </div>
                  <ul className="space-y-1 text-slate-400">
                    {(executionResult.verification?.checks_passed || []).map((chk, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{chk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-indigo-400" /> Sandboxed Tools Invoked
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(executionResult.tools_invoked || []).map((tool, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[11px] border border-slate-700">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Created Artifacts */}
              {executionResult.artifacts_created?.length > 0 && (
                <div className="border-t border-slate-800 pt-3">
                  <h5 className="text-xs font-semibold text-slate-300 mb-2">Created Artifacts ({executionResult.artifacts_created.length})</h5>
                  <div className="space-y-2">
                    {executionResult.artifacts_created.map((art) => (
                      <div key={art.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-indigo-400" />
                          <span className="font-semibold text-white">{art.name}</span>
                          <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-[10px]">
                            {art.artifact_type}
                          </span>
                        </div>
                        <span className="text-slate-400">{art.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm text-red-300 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 text-red-400" />
              <div>
                <strong className="block font-semibold">Execution Blocked</strong>
                <span>{errorMsg}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: APPROVAL QUEUE */}
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-base font-semibold text-white mb-1">Human Approval Queue</h3>
            <p className="text-xs text-slate-400">
              Consequential actions (outbound WhatsApp messages, external emails, CRM updates) are held here until an authorized operator confirms execution.
            </p>
          </div>

          {approvals.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-10 text-center text-slate-500 text-sm">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400 mb-2" />
              Approval queue is clean. No pending consequential actions.
            </div>
          ) : (
            <div className="space-y-3">
              {approvals.map((req) => (
                <div key={req.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded">
                        {req.action_type}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{req.id}</span>
                    </div>
                    <p className="text-sm text-white">{req.description}</p>
                    <div className="text-xs text-slate-500 mt-1">Requested at {req.created_at}</div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleResolveApproval(req.id, true)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-all"
                    >
                      Approve & Execute
                    </button>
                    <button
                      onClick={() => handleResolveApproval(req.id, false)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-all"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: AI EMPLOYEES & SIMULATION */}
      {activeTab === 'employees' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-base font-semibold text-white mb-1">Turnkey AI Employees & Simulation Runner</h3>
            <p className="text-xs text-slate-400">
              Generate a bounded AI employee blueprint and subject it to 10 adversarial customer scenarios before deploying.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              'AI Receptionist',
              'AI Sales Agent',
              'AI Support Agent',
              'AI Lead Qualifier',
              'AI Appointment Agent',
              'AI Voice Receptionist',
              'AI WhatsApp Employee',
              'AI Website Assistant',
              'AI Marketing Assistant'
            ].map((role) => (
              <button
                key={role}
                disabled={simulating}
                onClick={() => handleGenerateAndSimulateEmployee(role)}
                className="p-4 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 rounded-xl text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors">{role}</h4>
                  <Play className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                </div>
                <p className="text-xs text-slate-400">Generate blueprint & run 10 simulation scenarios</p>
              </button>
            ))}
          </div>

          {simulating && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-400" />
              <span>Simulating 10 customer scenarios against employee blueprint...</span>
            </div>
          )}

          {simulationScorecard && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-base font-bold text-white">{simulationScorecard.employee_type} Scorecard</h4>
                  <p className="text-xs text-slate-400">{simulationScorecard.quality_summary}</p>
                </div>
                <div>
                  {simulationScorecard.is_production_ready ? (
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold">
                      PRODUCTION READY
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold">
                      REQUIRES REVIEW
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {simulationScorecard.results.map((scen) => (
                  <div key={scen.scenario_id} className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-300">{scen.scenario_name}</span>
                      <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${scen.verdict === 'PASS' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {scen.verdict}
                      </span>
                    </div>
                    <div className="text-slate-500 italic truncate">"{scen.customer_input}"</div>
                    <div className="text-slate-400">{scen.reason}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: ADMIN CONSOLE & GOVERNOR */}
      {activeTab === 'console' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* 21 Agents */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                Specialized Agents Registry ({agents.length})
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {agents.map((ag) => (
                  <div key={ag.name} className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-white">{ag.name}</strong>
                      <span className="px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded text-[10px]">{ag.risk_level}</span>
                    </div>
                    <p className="text-slate-400">{ag.description}</p>
                    <div className="text-slate-500 flex flex-wrap gap-1 mt-1">
                      {ag.allowed_tools.map((t, idx) => (
                        <span key={idx} className="bg-slate-900 px-1.5 py-0.5 rounded text-[10px] border border-slate-800">{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 18 Tools */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Wrench className="w-4 h-4 text-indigo-400" />
                Declared Tools Registry ({tools.length})
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {tools.map((t) => (
                  <div key={t.name} className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-indigo-300 font-mono">{t.name}</strong>
                      {t.has_side_effects ? (
                        <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded text-[10px]">SIDE EFFECTS</span>
                      ) : (
                        <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px]">READ ONLY</span>
                      )}
                    </div>
                    <p className="text-slate-400">{t.description}</p>
                    <div className="text-slate-500 font-mono text-[10px]">Permission: {t.permission}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Events Log */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              Internal Fabric Event Stream
            </h3>
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs text-slate-300 max-h-48 overflow-y-auto space-y-1">
              {events.length === 0 ? (
                <div className="text-slate-600">No events logged yet.</div>
              ) : (
                events.map((ev, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-slate-900 pb-1">
                    <span className="text-indigo-400 font-semibold">{ev.event_type}</span>
                    <span className="text-slate-500 text-[10px]">{ev.timestamp}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
