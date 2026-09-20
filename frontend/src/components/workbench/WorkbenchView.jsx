import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Send, ArrowRight, CheckCircle2, Clock, 
  AlertCircle, HelpCircle, Layers, Cpu, ShieldCheck, 
  RefreshCw, Briefcase, FileText, Globe, Palette, 
  Calculator, Search, Bot, Play, Check, ChevronRight,
  Terminal, ShieldAlert, Sliders, HardDrive, Cloud, Brain
} from 'lucide-react';

import { ProjectPreview } from './ProjectPreview';
import { BrandAssetViewer } from './BrandAssetViewer';
import { FinancialModelViewer } from './FinancialModelViewer';
import { WebsiteAuditViewer } from './WebsiteAuditViewer';
import { ModelTransparencyBadge } from './ModelTransparencyBadge';
import IntelligenceFabricView from './IntelligenceFabricView';

export function WorkbenchView({ initialQuery = '' }) {
  const [requestText, setRequestText] = useState(
    initialQuery || 'I run a dental clinic in Austin. Build me a modern website, create a logo concept, audit my current website, prepare a basic marketing strategy, and compute a 12-month financial model.'
  );
  const [commandText, setCommandText] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // overview, artifacts, plan, models

  // Planning & Execution State
  const [isPlanning, setIsPlanning] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isExecutingCommand, setIsExecutingCommand] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [activeArtifactId, setActiveArtifactId] = useState(null);
  const [modelsManifest, setModelsManifest] = useState(null);
  const [hardwareProfile, setHardwareProfile] = useState(null);
  const [isPullingModel, setIsPullingModel] = useState(false);
  const [pullModelName, setPullModelName] = useState('phi3:mini');
  const [pullStatus, setPullStatus] = useState(null);
  const [commandResponse, setCommandResponse] = useState(null);
  const [discoveryCatalog, setDiscoveryCatalog] = useState(null);
  const [confirmRiskModel, setConfirmRiskModel] = useState(null);

  // Quick Chips
  const quickChips = [
    {
      label: 'Dental Clinic in Austin',
      text: 'I run a dental clinic in Austin. Build me a modern website, create a logo concept, audit my website, prepare a marketing plan, and compute a 12-month financial model.'
    },
    {
      label: 'B2B Enterprise SaaS',
      text: 'Build a high-converting B2B SaaS landing page, create minimal brand assets, analyze top competitors, and generate a 24/7 AI customer onboarding agent.'
    },
    {
      label: 'Roofing & Solar Contractor',
      text: 'Create a responsive contractor website for Dallas roofing & solar, run an SEO audit, calculate break-even financials, and create an automated quote qualification bot.'
    },
    {
      label: 'Boutique Law Firm',
      text: 'Design a prestigious law firm website, generate premium vector brand identities, audit client intake conversion, and draft a quarterly acquisition strategy.'
    }
  ];

  // Fetch registered models & hardware profile on mount
  useEffect(() => {
    fetchModelsManifest();
    fetchHardwareProfile();
    fetchDiscoveryCatalog();
  }, []);

  const fetchDiscoveryCatalog = async () => {
    try {
      const res = await fetch('/api/v1/workbench/discovery');
      if (res.ok) {
        const data = await res.json();
        setDiscoveryCatalog(data);
      }
    } catch (e) {
      console.warn('Unable to load discovery catalog:', e);
    }
  };

  const fetchModelsManifest = async () => {
    try {
      const res = await fetch('/api/v1/workbench/models');
      if (res.ok) {
        const data = await res.json();
        setModelsManifest(data);
      }
    } catch (e) {
      console.warn('Unable to load models manifest:', e);
    }
  };

  const fetchHardwareProfile = async () => {
    try {
      const res = await fetch('/api/v1/workbench/hardware');
      if (res.ok) {
        const data = await res.json();
        setHardwareProfile(data);
      }
    } catch (e) {
      console.warn('Unable to load hardware profile:', e);
    }
  };

  const handlePullModel = async (e) => {
    if (e) e.preventDefault();
    if (!pullModelName.trim()) return;
    setIsPullingModel(true);
    setPullStatus({ loading: true, message: `Requesting pull for ${pullModelName}...` });
    try {
      const res = await fetch('/api/v1/workbench/hardware/models/pull', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model_name: pullModelName.trim() })
      });
      const data = await res.json();
      setPullStatus(data);
      await fetchHardwareProfile();
    } catch (e) {
      setPullStatus({ status: 'ERROR', error: String(e) });
    } finally {
      setIsPullingModel(false);
    }
  };

  const handleSafeInstall = async (modelId, confirmRisk = false) => {
    setIsPullingModel(true);
    setPullStatus({ loading: true, message: `Installing ${modelId}...` });
    try {
      const res = await fetch('/api/v1/workbench/models/install', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model_id: modelId, confirm_risk: confirmRisk })
      });
      const data = await res.json();
      setPullStatus(data);
      if (data.status === 'BLOCKED') {
        setConfirmRiskModel(modelId);
      } else {
        setConfirmRiskModel(null);
      }
      await fetchHardwareProfile();
      await fetchDiscoveryCatalog();
    } catch (e) {
      setPullStatus({ status: 'ERROR', error: String(e) });
    } finally {
      setIsPullingModel(false);
    }
  };

  const handleDeleteModel = async (modelName) => {
    if (!window.confirm(`Delete '${modelName}' from local Ollama storage?`)) return;
    try {
      await fetch(`/api/v1/workbench/models/${encodeURIComponent(modelName)}`, { method: 'DELETE' });
      await fetchHardwareProfile();
      await fetchDiscoveryCatalog();
    } catch (e) {
      console.warn('Failed to delete model:', e);
    }
  };

  // Plan request
  const handlePlanRequest = async () => {
    if (!requestText.trim()) return;
    setIsPlanning(true);
    setCommandResponse(null);
    try {
      const res = await fetch('/api/v1/workbench/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ natural_language_request: requestText })
      });
      if (res.ok) {
        const plan = await res.json();
        setCurrentPlan(plan);
        setActiveTab('plan');
      }
    } catch (e) {
      console.error('Failed to plan request:', e);
    } finally {
      setIsPlanning(false);
    }
  };

  // Create and Execute Project
  const handleCreateAndExecute = async () => {
    if (!requestText.trim()) return;
    setIsExecuting(true);
    setCommandResponse(null);
    try {
      // Step 1: Create Project
      const createRes = await fetch('/api/v1/workbench/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ natural_language_request: requestText })
      });
      if (!createRes.ok) throw new Error('Failed to create project');
      const projectData = await createRes.json();
      setCurrentProject(projectData);

      // Step 2: Execute Project Tasks
      const execRes = await fetch(`/api/v1/workbench/projects/${projectData.id}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!execRes.ok) throw new Error('Execution failed');

      // Step 3: Fetch updated project with artifacts
      const freshRes = await fetch(`/api/v1/workbench/projects/${projectData.id}`);
      if (freshRes.ok) {
        const freshData = await freshRes.json();
        setCurrentProject(freshData);
        if (freshData.artifacts && freshData.artifacts.length > 0) {
          setActiveArtifactId(freshData.artifacts[0].id);
          setActiveTab('artifacts');
        }
      }
    } catch (e) {
      console.error('Project creation & execution error:', e);
    } finally {
      setIsExecuting(false);
    }
  };

  // Universal Command Runner ("Ask Rine Forge")
  const handleRunCommand = async (e) => {
    e?.preventDefault();
    if (!commandText.trim()) return;
    setIsExecutingCommand(true);
    try {
      const res = await fetch('/api/v1/workbench/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: commandText,
          project_id: currentProject?.id
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCommandResponse(data);
        setCommandText('');
      }
    } catch (e) {
      console.error('Universal command error:', e);
    } finally {
      setIsExecutingCommand(false);
    }
  };

  // Confirm / Publish Artifact
  const handleConfirmPublish = async (artifactId, action = 'PUBLISH') => {
    try {
      const res = await fetch(`/api/v1/workbench/artifacts/${artifactId}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      if (res.ok) {
        // Refresh project
        if (currentProject?.id) {
          const freshRes = await fetch(`/api/v1/workbench/projects/${currentProject.id}`);
          if (freshRes.ok) {
            const freshData = await freshRes.json();
            setCurrentProject(freshData);
          }
        }
      }
    } catch (e) {
      console.error('Artifact confirm error:', e);
    }
  };

  // Update Artifact Content
  const handleUpdateArtifact = async (artifactId, payload) => {
    try {
      const res = await fetch(`/api/v1/workbench/artifacts/${artifactId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        if (currentProject?.id) {
          const freshRes = await fetch(`/api/v1/workbench/projects/${currentProject.id}`);
          if (freshRes.ok) {
            const freshData = await freshRes.json();
            setCurrentProject(freshData);
          }
        }
      }
    } catch (e) {
      console.error('Update artifact error:', e);
    }
  };

  const activeArtifact = currentProject?.artifacts?.find((a) => a.id === activeArtifactId) || currentProject?.artifacts?.[0];

  const getArtifactIcon = (type) => {
    switch (type) {
      case 'WEBSITE': return Globe;
      case 'LOGO': return Palette;
      case 'SPREADSHEET': return Calculator;
      case 'REPORT': return Search;
      case 'AI_AGENT': return Bot;
      default: return FileText;
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans pb-24">
      {/* 1. HERO SECTION & NATURAL-LANGUAGE PROMPT */}
      <section className="relative pt-10 pb-12 border-b border-slate-800/80 bg-gradient-to-b from-[#090e1c] via-[#070b14] to-[#070b14]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> RINE FORGE AI BUSINESS WORKBENCH
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Tell us what your business needs.
            </h1>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
              We plan the work, select the right specialized models, execute the pipeline, and deliver verified production assets.
            </p>
          </div>

          {/* Large Prompt Input Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4">
            <textarea
              value={requestText}
              onChange={(e) => setRequestText(e.target.value)}
              placeholder="Describe what your business needs (e.g. Build a modern website, generate brand logos, calculate financial models, or deploy an AI receptionist)..."
              className="w-full bg-slate-950/80 text-slate-100 placeholder-slate-500 p-4 rounded-xl border border-slate-800 focus:outline-none focus:border-teal-500 font-sans text-sm sm:text-base resize-none h-32 leading-relaxed"
            />

            {/* Quick Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-[10px] font-mono uppercase text-slate-500 shrink-0 font-bold">Suggested:</span>
              {quickChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => setRequestText(chip.text)}
                  className="px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-teal-300 border border-slate-700/80 text-xs font-medium shrink-0 transition-all"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Free-First Routing</span>
                </span>
                <span>•</span>
                <span>Deterministic Math</span>
                <span>•</span>
                <span>Sandboxed Output</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePlanRequest}
                  disabled={isPlanning || isExecuting}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5"
                >
                  {isPlanning ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Analyzing Plan...</span>
                    </>
                  ) : (
                    <>
                      <Layers className="w-3.5 h-3.5" />
                      <span>Review Plan</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleCreateAndExecute}
                  disabled={isExecuting || isPlanning}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 hover:opacity-95 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
                >
                  {isExecuting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Executing Capabilities...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Execute & Deliver</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. UNIVERSAL COMMAND BAR ("Ask Rine Forge") */}
      <div className="border-b border-slate-800 bg-slate-950/60 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <form onSubmit={handleRunCommand} className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-teal-400 font-bold shrink-0">
              <Terminal className="w-4 h-4" />
              <span className="hidden sm:inline">Ask Rine Forge:</span>
            </div>
            <input
              type="text"
              value={commandText}
              onChange={(e) => setCommandText(e.target.value)}
              placeholder="Enter quick directive (e.g. 'Make the logo more premium', 'Audit my conversion friction', 'Recalculate cash flow')..."
              className="flex-1 bg-slate-900 text-slate-100 placeholder-slate-500 px-3.5 py-1.5 rounded-xl border border-slate-800 focus:outline-none focus:border-teal-500 text-xs font-sans"
            />
            <button
              type="submit"
              disabled={isExecutingCommand || !commandText.trim()}
              className="px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 text-xs font-bold transition-all shrink-0"
            >
              {isExecutingCommand ? 'Running...' : 'Run'}
            </button>
          </form>

          {/* Quick Command Result Banner */}
          {commandResponse && (
            <div className="mt-2.5 p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 text-xs text-slate-200 flex items-center justify-between gap-3 animate-fadeIn">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span><strong className="text-white">{commandResponse.action}:</strong> {commandResponse.summary}</span>
              </div>
              <button 
                onClick={() => setCommandResponse(null)}
                className="text-slate-400 hover:text-white font-mono text-[11px]"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. MAIN NAVIGATION TABS */}
      <div className="border-b border-slate-800 bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center gap-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'overview' ? 'border-teal-400 text-teal-300' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Workspace Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('artifacts')}
            className={`py-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'artifacts' ? 'border-teal-400 text-teal-300' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Deliverables & Artifacts ({currentProject?.artifacts?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('plan')}
            className={`py-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'plan' ? 'border-teal-400 text-teal-300' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Plan & Task Graph</span>
          </button>

          <button
            onClick={() => setActiveTab('models')}
            className={`py-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'models' ? 'border-teal-400 text-teal-300' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Model & Tool Hub</span>
          </button>

          <button
            onClick={() => setActiveTab('fabric')}
            className={`py-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'fabric' ? 'border-indigo-400 text-indigo-300' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>Intelligence Fabric</span>
          </button>
        </div>
      </div>

      {/* 4. TAB CONTENTS */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        {/* TAB 1: WORKSPACE OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Active Project Status Card */}
            {currentProject ? (
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-teal-400 font-bold">Active Initiative</span>
                    <h3 className="text-xl font-bold text-white mt-0.5">{currentProject.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-2xl">{currentProject.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                      currentProject.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-teal-500/10 text-teal-400 border border-teal-500/30'
                    }`}>
                      {currentProject.status}
                    </span>
                    <button
                      onClick={() => setActiveTab('artifacts')}
                      className="px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-1"
                    >
                      <span>View Deliverables</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress Tasks List */}
                <div className="border-t border-slate-800 pt-4 space-y-2">
                  <span className="text-[11px] font-mono text-slate-400 uppercase font-bold">Execution Pipeline:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {(currentProject.tasks || []).map((t) => (
                      <div key={t.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white truncate">{t.task_type}</span>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                            t.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {t.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">{t.progress_step}</div>
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800/60">
                          <span>{t.model_id}</span>
                          <span>P{t.priority}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 rounded-2xl bg-slate-900/50 border border-dashed border-slate-800 text-center space-y-3">
                <Briefcase className="w-10 h-10 text-slate-600 mx-auto" />
                <h4 className="text-base font-bold text-white">No Active Initiative</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Type what your business needs in the prompt box above or select one of the suggested chips to begin.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: DELIVERABLES & ARTIFACTS */}
        {activeTab === 'artifacts' && (
          <div className="space-y-6">
            {currentProject?.artifacts && currentProject.artifacts.length > 0 ? (
              <div className="space-y-6">
                {/* Artifact Selector Ribbon */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {currentProject.artifacts.map((art) => {
                    const Icon = getArtifactIcon(art.artifact_type);
                    const isSelected = (activeArtifact?.id === art.id);
                    return (
                      <button
                        key={art.id}
                        onClick={() => setActiveArtifactId(art.id)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
                          isSelected
                            ? 'bg-teal-500 text-slate-950 shadow-md'
                            : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{art.name}</span>
                        {art.status === 'PUBLISHED' && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Active Deliverable Render Frame */}
                {activeArtifact && (
                  <div className="space-y-4">
                    {activeArtifact.artifact_type === 'WEBSITE' && (
                      <ProjectPreview
                        artifact={activeArtifact}
                        onConfirmPublish={handleConfirmPublish}
                        onUpdateArtifact={handleUpdateArtifact}
                      />
                    )}

                    {activeArtifact.artifact_type === 'LOGO' && (
                      <BrandAssetViewer
                        artifact={activeArtifact}
                        onStyleChange={(s) => handleRunCommand({ preventDefault: () => {}, commandText: `Update logo to ${s} style` })}
                      />
                    )}

                    {activeArtifact.artifact_type === 'SPREADSHEET' && (
                      <FinancialModelViewer artifact={activeArtifact} />
                    )}

                    {activeArtifact.artifact_type === 'REPORT' && (
                      <WebsiteAuditViewer artifact={activeArtifact} />
                    )}

                    {/* Generic Document / Strategic Plan / AI Blueprint fallback */}
                    {!['WEBSITE', 'LOGO', 'SPREADSHEET', 'REPORT'].includes(activeArtifact.artifact_type) && (
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-base font-bold text-white">{activeArtifact.name}</h4>
                          <ModelTransparencyBadge
                            provider={activeArtifact.provider_id}
                            model={activeArtifact.model_name}
                            isFree={activeArtifact.is_free}
                          />
                        </div>
                        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
                          {activeArtifact.content_text || JSON.stringify(activeArtifact.data_json, null, 2)}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 rounded-2xl bg-slate-900/50 border border-dashed border-slate-800 text-center space-y-3">
                <Layers className="w-10 h-10 text-slate-600 mx-auto" />
                <h4 className="text-base font-bold text-white">No Deliverables Generated Yet</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Click "Execute & Deliver" on the prompt box above to generate real websites, brand assets, and financial plans.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PLAN & TASK GRAPH */}
        {activeTab === 'plan' && (
          <div className="space-y-6">
            {currentPlan ? (
              <div className="space-y-6">
                {/* Plan Header */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-teal-400 font-bold">Planned Architecture</span>
                    <h3 className="text-xl font-bold text-white mt-0.5">{currentPlan.project_name}</h3>
                    <div className="text-xs text-slate-400 mt-1">
                      Request Type: <strong className="text-slate-200">{currentPlan.request_type}</strong> • Total Tasks: {currentPlan.tasks?.length || 0}
                    </div>
                  </div>
                  <button
                    onClick={handleCreateAndExecute}
                    disabled={isExecuting}
                    className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Confirm & Execute Plan</span>
                  </button>
                </div>

                {/* Facts vs Deductive Assumptions vs Missing Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Facts Identified */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-xs font-mono font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified Facts ({currentPlan.facts_identified?.length || 0})</span>
                    </span>
                    <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                      {(currentPlan.facts_identified || []).map((fact, i) => (
                        <li key={i}>{fact}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Assumptions Made */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-xs font-mono font-bold uppercase text-indigo-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Assumptions Made ({currentPlan.assumptions_made?.length || 0})</span>
                    </span>
                    <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                      {(currentPlan.assumptions_made || []).map((asmp, i) => (
                        <li key={i}>{asmp}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Missing Info */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-xs font-mono font-bold uppercase text-amber-400 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Missing Information ({currentPlan.missing_information?.length || 0})</span>
                    </span>
                    <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                      {(currentPlan.missing_information || []).map((miss, i) => (
                        <li key={i}>{miss}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Prioritized Task Graph */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <h4 className="text-sm font-bold text-white">Prioritized Task Pipeline</h4>
                  <div className="space-y-3">
                    {(currentPlan.tasks || []).map((t, idx) => (
                      <div key={t.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-mono text-xs font-bold">
                            {idx + 1}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">{t.title}</div>
                            <div className="text-[11px] text-slate-400">{t.description}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                            {t.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 rounded-2xl bg-slate-900/50 border border-dashed border-slate-800 text-center space-y-3">
                <FileText className="w-10 h-10 text-slate-600 mx-auto" />
                <h4 className="text-base font-bold text-white">No Plan Formulated</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Click "Review Plan" to decompose your request into facts, assumptions, and tasks.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: MODEL & TOOL HUB */}
        {activeTab === 'models' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase text-teal-400 font-bold">Model Hub Policy</span>
                  <h3 className="text-xl font-bold text-white mt-0.5">Free-First Model Routing</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                    Rine Forge defaults to high-speed local and open parametric engines for 0-cost generation, truth-checking every external provider fallback.
                  </p>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                  ACTIVE POLICY: FREE_FIRST
                </div>
              </div>

              {/* Registered Providers Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                {(modelsManifest?.providers || []).map((p, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate">{p.name}</span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        p.is_free ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {p.is_free ? '0.00 FREE' : 'PAID API'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">Provider: <span className="font-mono text-slate-300">{p.provider_id}</span></div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800/60">
                      <span>Status: {p.status}</span>
                      <span>Type: {p.type}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Workspace Resource Limits */}
              {modelsManifest?.limits && (
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <span className="text-xs font-mono font-bold uppercase text-slate-400">Workspace Resource Limits:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div className="text-slate-300">Max Tasks: <strong className="text-white">{modelsManifest.limits.max_tasks}</strong></div>
                    <div className="text-slate-300">Max Images: <strong className="text-white">{modelsManifest.limits.max_images}</strong></div>
                    <div className="text-slate-300">Voice Mins: <strong className="text-white">{modelsManifest.limits.max_voice_minutes}</strong></div>
                    <div className="text-slate-300">Max Tokens: <strong className="text-white">{modelsManifest.limits.max_model_tokens?.toLocaleString()}</strong></div>
                  </div>
                </div>
              )}
            </div>

            {/* SERVER HARDWARE & LOCAL AI ENGINE (TRUTHFUL AUDIT) */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-teal-400 font-bold">Host Infrastructure</span>
                    <h3 className="text-lg font-bold text-white">Server Hardware & Local Engine</h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchHardwareProfile}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Probe
                  </button>
                  <span className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border ${
                    hardwareProfile?.ollama?.status === 'AVAILABLE'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  }`}>
                    OLLAMA: {hardwareProfile?.ollama?.status || 'PROBING...'}
                  </span>
                </div>
              </div>

              {hardwareProfile ? (
                <div className="space-y-4">
                  {/* Hardware Specs Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-[10px] font-mono uppercase text-slate-400">OS & Platform</span>
                      <div className="text-xs font-bold text-white truncate" title={hardwareProfile.hardware?.os}>
                        {hardwareProfile.hardware?.os || 'Detecting...'}
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">{hardwareProfile.hardware?.cpu_cores} Logical Cores</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-[10px] font-mono uppercase text-slate-400">Physical Memory</span>
                      <div className="text-xs font-bold text-white">
                        {hardwareProfile.hardware?.ram?.total_gb} GB RAM
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400">{hardwareProfile.hardware?.ram?.available_gb} GB Available</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-[10px] font-mono uppercase text-slate-400">GPU Accelerator</span>
                      <div className="text-xs font-bold text-white truncate" title={hardwareProfile.hardware?.gpu?.model}>
                        {hardwareProfile.hardware?.gpu?.model || 'CPU Only'}
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">{hardwareProfile.hardware?.gpu?.vram_total_gb} GB VRAM</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-[10px] font-mono uppercase text-slate-400">Detected Tier</span>
                      <div className="text-xs font-bold text-teal-400">
                        {hardwareProfile.hardware?.tier?.tier_name || 'Tier 1'}
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">Rec: {hardwareProfile.hardware?.tier?.recommended_parameter_size}</span>
                    </div>
                  </div>

                  {/* Recommended Models for Detected Tier */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold uppercase text-slate-400">
                        Recommended Models for {hardwareProfile.hardware?.tier?.tier_name}:
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        Quantization: {hardwareProfile.hardware?.tier?.recommended_quantization}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(hardwareProfile.hardware?.tier?.recommended_models || []).map((m, idx) => (
                        <div key={idx} className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs flex items-center gap-2">
                          <span className="font-mono font-bold text-teal-300">{m.name}</span>
                          <span className="text-[10px] font-mono text-slate-400">({m.size})</span>
                          <span className="text-[10px] text-slate-500">• {m.purpose}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ollama Live Status & Model Manager */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-white">Local Model Inventory</span>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {hardwareProfile.ollama?.instructions}
                        </p>
                      </div>
                      <span className="text-xs font-mono text-slate-400">
                        Installed: <strong className="text-white">{hardwareProfile.ollama?.models_count || 0}</strong> models
                      </span>
                    </div>

                    {/* Installed models list */}
                    {(hardwareProfile.ollama?.installed_models || []).length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                        {hardwareProfile.ollama.installed_models.map((m, idx) => (
                          <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                            <span className="font-mono font-bold text-white">{m.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-teal-400 text-[11px]">{m.size_gb} GB</span>
                              <button
                                onClick={() => handleDeleteModel(m.name)}
                                className="px-2 py-0.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[10px] font-mono transition"
                                title="Delete model from disk"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Available Open Models Catalog (Model Discovery) */}
                    {discoveryCatalog?.models && (
                      <div className="pt-3 border-t border-slate-900 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-300">Open Model Discovery Catalog</span>
                          <span className="text-[10px] font-mono text-slate-500">
                            Host Hardware: Tier {discoveryCatalog.host_tier}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {discoveryCatalog.models.map((m, idx) => (
                            <div key={idx} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex flex-col justify-between text-xs space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="font-mono font-bold text-white">{m.name}</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                  m.status === 'INSTALLED'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : m.status === 'RECOMMENDED'
                                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                                    : m.status === 'INCOMPATIBLE'
                                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                    : 'bg-slate-800 text-slate-400'
                                }`}>
                                  {m.status}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 line-clamp-1">{m.description}</p>
                              <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-slate-500">
                                <span>Req: {m.memory_requirement_gb} GB RAM</span>
                                {m.status !== 'INSTALLED' && (
                                  <button
                                    onClick={() => handleSafeInstall(m.model_id, false)}
                                    disabled={isPullingModel}
                                    className="px-2 py-1 rounded bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 font-bold transition disabled:opacity-50"
                                  >
                                    Install
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Risk confirmation modal/alert if blocked */}
                    {confirmRiskModel && (
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs space-y-2">
                        <div className="font-bold text-rose-400">Hardware Risk Warning</div>
                        <p className="text-slate-300 text-[11px]">
                          Model '{confirmRiskModel}' exceeds safe memory limits for your current hardware tier and may cause system slowdown or freezing.
                        </p>
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => handleSafeInstall(confirmRiskModel, true)}
                            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition"
                          >
                            Confirm & Install Anyway
                          </button>
                          <button
                            onClick={() => setConfirmRiskModel(null)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Pull model form */}
                    <form onSubmit={handlePullModel} className="pt-2 flex gap-2">
                      <input
                        type="text"
                        value={pullModelName}
                        onChange={(e) => setPullModelName(e.target.value)}
                        placeholder="Custom model name (e.g. phi3:mini, qwen2.5-coder:7b)"
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50"
                      />
                      <button
                        type="submit"
                        disabled={isPullingModel || !pullModelName.trim()}
                        className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition disabled:opacity-50"
                      >
                        {isPullingModel ? 'Pulling...' : 'Install / Verify'}
                      </button>
                    </form>

                    {pullStatus && (
                      <div className={`p-2.5 rounded-lg text-xs font-mono ${
                        pullStatus.status === 'SUCCESS'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : pullStatus.status === 'ERROR' || pullStatus.status === 'OFFLINE' || pullStatus.status === 'BLOCKED'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-slate-900 text-slate-300'
                      }`}>
                        {pullStatus.message || pullStatus.reason || pullStatus.error || JSON.stringify(pullStatus)}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs font-mono text-slate-500">
                  Probing host hardware metrics...
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: INTELLIGENCE FABRIC */}
        {activeTab === 'fabric' && (
          <IntelligenceFabricView />
        )}
      </main>
    </div>
  );
}
