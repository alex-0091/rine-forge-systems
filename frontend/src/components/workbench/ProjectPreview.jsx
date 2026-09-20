import React, { useState, useEffect } from 'react';
import { 
  Monitor, Tablet, Smartphone, Code, Eye, Download, 
  ExternalLink, CheckCircle2, ShieldAlert, Sparkles, RefreshCw 
} from 'lucide-react';
import { ModelTransparencyBadge } from './ModelTransparencyBadge';

export function ProjectPreview({ artifact, onConfirmPublish, onUpdateArtifact }) {
  const [viewport, setViewport] = useState('desktop'); // desktop, tablet, mobile
  const [viewMode, setViewMode] = useState('preview'); // preview, code
  const [htmlCode, setHtmlCode] = useState(artifact?.content_text || '');
  const [activePage, setActivePage] = useState('home');
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    if (artifact?.content_text) {
      setHtmlCode(artifact.content_text);
    }
  }, [artifact]);

  const pages = artifact?.data_json?.architecture || [
    { page: 'Home', slug: 'home', description: 'Hero, services overview, lead capture form' }
  ];

  const handleDownload = () => {
    const blob = new Blob([htmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${artifact?.name?.replace(/\s+/g, '_') || 'website'}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveCode = async () => {
    if (!onUpdateArtifact) return;
    setIsSaving(true);
    try {
      await onUpdateArtifact(artifact.id, { content_text: htmlCode });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!onConfirmPublish) return;
    const confirmed = window.confirm(
      "CONFIRM PRODUCTION ACTION:\nAre you sure you want to publish this website live? This action modifies public DNS/hosting routes."
    );
    if (!confirmed) return;

    setIsPublishing(true);
    try {
      await onConfirmPublish(artifact.id, "PUBLISH");
    } finally {
      setIsPublishing(false);
    }
  };

  const getViewportWidth = () => {
    if (viewport === 'mobile') return 'max-w-[390px]';
    if (viewport === 'tablet') return 'max-w-[768px]';
    return 'w-full';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[780px]">
      {/* Top Header Bar */}
      <div className="p-4 border-b border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold text-xs">
            WEB
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              {artifact?.name || 'Responsive Business Website'}
              {artifact?.status === 'PUBLISHED' && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> LIVE PUBLISHED
                </span>
              )}
            </h4>
            <div className="text-[11px] text-slate-400">
              Sandboxed Tailwind CSS Engine • Version v{artifact?.version || 1}
            </div>
          </div>
        </div>

        {/* Center: Viewport & Mode Controls */}
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewport('desktop')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              viewport === 'desktop' ? 'bg-teal-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
            title="Desktop View (100%)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Desktop</span>
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              viewport === 'tablet' ? 'bg-teal-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
            title="Tablet View (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Tablet</span>
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              viewport === 'mobile' ? 'bg-teal-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
            title="Mobile View (390px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Mobile</span>
          </button>

          <div className="h-4 w-[1px] bg-slate-800 mx-1" />

          <button
            onClick={() => setViewMode(viewMode === 'preview' ? 'code' : 'preview')}
            className="px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-bold text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-1.5 transition-all"
          >
            {viewMode === 'preview' ? (
              <>
                <Code className="w-3.5 h-3.5 text-teal-400" />
                <span>Edit Code</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-teal-400" />
                <span>Live View</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <ModelTransparencyBadge
            provider={artifact?.provider_id || 'TAILWIND_SANDBOX_GEN'}
            model={artifact?.model_name || 'TailwindComponentEngine'}
            isFree={artifact?.is_free ?? true}
            costEstimate={artifact?.cost_estimate || 'FREE'}
          />

          <button
            onClick={handleDownload}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all text-xs"
            title="Download Standalone HTML"
          >
            <Download className="w-4 h-4" />
          </button>

          {artifact?.status !== 'PUBLISHED' && (
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 hover:opacity-95 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
            >
              {isPublishing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Confirm & Publish</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Multi-Page Navigation Sub-bar */}
      {pages.length > 1 && (
        <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-950/60 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-mono uppercase text-slate-500 shrink-0">Site Pages:</span>
          {pages.map((p) => (
            <button
              key={p.slug || p.page}
              onClick={() => setActivePage(p.slug || p.page)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all shrink-0 ${
                activePage === (p.slug || p.page)
                  ? 'bg-slate-800 text-teal-300 border border-slate-700 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {p.page}
            </button>
          ))}
        </div>
      )}

      {/* Main Preview / Code Viewport Area */}
      <div className="flex-1 bg-slate-950/90 overflow-hidden flex items-center justify-center p-4">
        {viewMode === 'preview' ? (
          <div className={`w-full h-full transition-all duration-300 mx-auto ${getViewportWidth()} bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-800`}>
            <iframe
              title="Website Sandboxed Preview"
              srcDoc={htmlCode}
              sandbox="allow-scripts allow-same-origin"
              className="w-full h-full border-0"
            />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Direct HTML/CSS Markup Editor</span>
              <button
                onClick={handleSaveCode}
                disabled={isSaving}
                className="px-3 py-1 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all"
              >
                {isSaving ? 'Saving...' : 'Apply & Save Edits'}
              </button>
            </div>
            <textarea
              value={htmlCode}
              onChange={(e) => setHtmlCode(e.target.value)}
              className="flex-1 w-full bg-slate-900 text-teal-300 font-mono text-xs p-4 rounded-xl border border-slate-800 focus:outline-none focus:border-teal-500 resize-none"
              spellCheck={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
