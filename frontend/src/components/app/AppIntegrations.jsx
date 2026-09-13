import React, { useState } from 'react';
import { 
  Server, CheckCircle2, Plus, ExternalLink, 
  Sparkles, RefreshCw, X, Check, Lock 
} from 'lucide-react';
import { INTEGRATIONS_CATALOG } from '../../data/forgePlatformConfig';

export function AppIntegrations() {
  const [integrations, setIntegrations] = useState(INTEGRATIONS_CATALOG);
  const [selectedToolForModal, setSelectedToolForModal] = useState(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleConnect = (tool) => {
    setSelectedToolForModal(tool);
    setApiKeyInput('');
  };

  const handleSaveConnection = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIntegrations(prev => prev.map(item => 
        item.id === selectedToolForModal.id 
          ? { ...item, status: 'CONNECTED' } 
          : item
      ));
      setIsSaving(false);
      setSelectedToolForModal(null);
    }, 800);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto font-sans">
      
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-mono font-bold uppercase">
          <Server className="w-3.5 h-3.5" /> ENTERPRISE INTEGRATIONS HUB
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Connect Your Business Stack
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          FORGE bi-directionally syncs with your CRMs, billing systems, messaging tools, and internal databases.
        </p>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((tool) => {
          const isConnected = tool.status === 'CONNECTED';
          return (
            <div
              key={tool.id}
              className="p-6 rounded-3xl bg-[#090e18] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 font-mono text-xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">{tool.category}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    isConnected
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}>
                    {tool.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white font-sans">{tool.name}</h3>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">{tool.description}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">{tool.authType}</span>
                <button
                  onClick={() => handleConnect(tool)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isConnected
                      ? 'bg-slate-900 text-teal-300 border border-slate-800 hover:bg-slate-850'
                      : 'bg-teal-500 hover:bg-teal-400 text-dark-950 shadow-sm'
                  }`}
                >
                  {isConnected ? 'Configure' : 'Connect'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Connect Integration Modal */}
      {selectedToolForModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#090e18] border border-teal-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl font-mono text-xs text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="space-y-0.5">
                <h3 className="text-lg font-bold text-white font-sans">Connect {selectedToolForModal.name}</h3>
                <div className="text-[10px] text-teal-400">{selectedToolForModal.authType}</div>
              </div>
              <button
                onClick={() => setSelectedToolForModal(null)}
                className="p-1 rounded-lg bg-dark-900 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveConnection} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 block font-bold">API Key or Webhook Endpoint</label>
                <input
                  type="password"
                  required
                  placeholder="live_sk_••••••••••••••••"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="w-full bg-dark-950 border border-slate-800 focus:border-teal-500 rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div className="p-3 bg-dark-950 rounded-xl border border-slate-800 text-[10px] text-slate-400 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Encrypted at rest with AES-256 in private vault.</span>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
              >
                {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>AUTHORIZE & ACTIVATE INTEGRATION</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
