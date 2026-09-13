import React, { useState } from 'react';
import { 
  Workflow, Zap, Bot, Database, ShieldCheck, 
  ArrowRight, Plus, Check, Play, RefreshCw, Terminal, CheckCircle2 
} from 'lucide-react';

export function AppSystemBuilder({ onSaveSystem }) {
  const [triggerType, setTriggerType] = useState('Inbound Webhook (Website Form / CRM)');
  const [agentBrain, setAgentBrain] = useState('FORGE Lead Qualification Engine (Gemini 1.5 Pro)');
  const [knowledgeDoc, setKnowledgeDoc] = useState('Standard Operating Procedures & Service Pricing.pdf');
  const [approvalGate, setApprovalGate] = useState('Require 1-Click Human Approval if Score > 80');
  const [outputAction, setOutputAction] = useState('Commit Deal to HubSpot & Dispatch Calendar Booking SMS');
  
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedSuccess, setDeployedSuccess] = useState(false);

  const handleDeploy = (e) => {
    e.preventDefault();
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      setDeployedSuccess(true);
    }, 1200);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-mono font-bold uppercase">
            <Workflow className="w-3.5 h-3.5" /> VISUAL AI SYSTEM BUILDER
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight pt-1">
            Design Your Custom Business Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Chain event triggers, AI reasoning models, private knowledge RAG, and human approval gates into production automations.
          </p>
        </div>

        <button
          onClick={handleDeploy}
          disabled={isDeploying}
          className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl text-xs font-mono transition-all shadow-md flex items-center gap-2 shrink-0"
        >
          {isDeploying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
          <span>DEPLOY PIPELINE TO STAGING</span>
        </button>
      </div>

      {deployedSuccess && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/40 text-xs font-mono text-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>PIPELINE COMPILED & DEPLOYED SUCCESSFULLY TO SANDBOX</span>
          </div>
          <span className="text-slate-400">Endpoint: https://api.forge.systems/v1/webhook/custom-pipe-99</span>
        </div>
      )}

      {/* Visual Workflow Steps (5 Nodes) */}
      <div className="space-y-4">
        
        {/* Node 1: Trigger */}
        <div className="p-6 rounded-2xl bg-[#090e18] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-teal-400 font-bold flex items-center gap-2">
              <Zap className="w-4 h-4" /> NODE 01 • INGEST TRIGGER
            </span>
            <span className="text-slate-500">Event Ingest</span>
          </div>
          <select
            value={triggerType}
            onChange={(e) => setTriggerType(e.target.value)}
            className="w-full bg-dark-950 border border-slate-800 focus:border-teal-500 rounded-xl p-3 text-xs font-mono text-white"
          >
            <option>Inbound Webhook (Website Form / CRM)</option>
            <option>Incoming Phone Call Audio Stream (Twilio)</option>
            <option>New Unread Email in Support Inbox (Gmail/Outlook)</option>
            <option>Uploaded PDF / Vendor Invoice in Google Drive</option>
            <option>Scheduled Recurring Cron (Every 15 Minutes)</option>
          </select>
        </div>

        {/* Node 2: AI Reasoning Brain */}
        <div className="p-6 rounded-2xl bg-[#090e18] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-cyan-400 font-bold flex items-center gap-2">
              <Bot className="w-4 h-4" /> NODE 02 • AI REASONING MODEL
            </span>
            <span className="text-slate-500">Cognitive Layer</span>
          </div>
          <select
            value={agentBrain}
            onChange={(e) => setAgentBrain(e.target.value)}
            className="w-full bg-dark-950 border border-slate-800 focus:border-teal-500 rounded-xl p-3 text-xs font-mono text-white"
          >
            <option>FORGE Lead Qualification Engine (Gemini 1.5 Pro)</option>
            <option>FORGE 24/7 Voice & Triage NLP Model</option>
            <option>FORGE Vision Document & Line-Item Extractor</option>
            <option>FORGE Deep Research & Multi-Source Cross-Referencer</option>
          </select>
        </div>

        {/* Node 3: Private Knowledge RAG */}
        <div className="p-6 rounded-2xl bg-[#090e18] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-indigo-400 font-bold flex items-center gap-2">
              <Database className="w-4 h-4" /> NODE 03 • PRIVATE KNOWLEDGE BASE (RAG)
            </span>
            <span className="text-slate-500">Deterministic Knowledge</span>
          </div>
          <select
            value={knowledgeDoc}
            onChange={(e) => setKnowledgeDoc(e.target.value)}
            className="w-full bg-dark-950 border border-slate-800 focus:border-teal-500 rounded-xl p-3 text-xs font-mono text-white"
          >
            <option>Standard Operating Procedures & Service Pricing.pdf</option>
            <option>Healthcare Insurance & Billing FAQ.docx</option>
            <option>Emergency Breakdown & Technician Dispatch Rules.txt</option>
            <option>None (Pure Logic Extraction)</option>
          </select>
        </div>

        {/* Node 4: Human Oversight Checkpoint */}
        <div className="p-6 rounded-2xl bg-[#090e18] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-amber-400 font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> NODE 04 • HUMAN APPROVAL GATE
            </span>
            <span className="text-slate-500">Governance Policy</span>
          </div>
          <select
            value={approvalGate}
            onChange={(e) => setApprovalGate(e.target.value)}
            className="w-full bg-dark-950 border border-slate-800 focus:border-teal-500 rounded-xl p-3 text-xs font-mono text-white"
          >
            <option>Require 1-Click Human Approval if Score &gt; 80 or Transaction &gt; $2,500</option>
            <option>Always Require Human Approval Before External Dispatch</option>
            <option>Fully Autonomous Execution (Low-Risk Deterministic Queries Only)</option>
          </select>
        </div>

        {/* Node 5: Output Action */}
        <div className="p-6 rounded-2xl bg-[#090e18] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-emerald-400 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> NODE 05 • DISPATCHED ACTION
            </span>
            <span className="text-slate-500">Tool Execution</span>
          </div>
          <select
            value={outputAction}
            onChange={(e) => setOutputAction(e.target.value)}
            className="w-full bg-dark-950 border border-slate-800 focus:border-teal-500 rounded-xl p-3 text-xs font-mono text-white"
          >
            <option>Commit Deal to HubSpot & Dispatch Calendar Booking SMS</option>
            <option>Create Jobber Work Order & Alert On-Call Tech via SMS</option>
            <option>Post Bill Record into QuickBooks Accounts Payable</option>
            <option>Dispatch Verified Answer to Customer & Close Zendesk Ticket</option>
          </select>
        </div>

      </div>

    </div>
  );
}
