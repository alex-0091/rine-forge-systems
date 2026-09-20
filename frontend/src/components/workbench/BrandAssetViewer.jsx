import React, { useState } from 'react';
import { 
  Palette, Download, Copy, Check, Sparkles, Sun, Moon, 
  Type, Sliders, Layers, RefreshCw 
} from 'lucide-react';
import { ModelTransparencyBadge } from './ModelTransparencyBadge';

export function BrandAssetViewer({ artifact, onStyleChange }) {
  const brandData = artifact?.data_json || {};
  const concepts = brandData.concepts || [];
  
  const [selectedConceptIndex, setSelectedConceptIndex] = useState(0);
  const [bgMode, setBgMode] = useState('dark'); // dark, light
  const [copiedHex, setCopiedHex] = useState(null);
  const [copiedSvg, setCopiedSvg] = useState(false);
  const [isChangingStyle, setIsChangingStyle] = useState(false);

  const activeConcept = concepts[selectedConceptIndex] || brandData.active_concept || {
    style: 'MINIMAL',
    name: 'Modern Clean Identity',
    colors: [
      { name: 'Primary Core', hex: '#0ea5e9' },
      { name: 'Accent Teal', hex: '#14b8a6' },
      { name: 'Dark Surface', hex: '#0f172a' }
    ],
    typography: { heading: 'Plus Jakarta Sans', body: 'Inter' },
    logo_svg: artifact?.content_text || ''
  };

  const handleCopyHex = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const handleCopySvg = () => {
    if (!activeConcept.logo_svg) return;
    navigator.clipboard.writeText(activeConcept.logo_svg);
    setCopiedSvg(true);
    setTimeout(() => setCopiedSvg(false), 1800);
  };

  const handleDownloadSvg = () => {
    if (!activeConcept.logo_svg) return;
    const blob = new Blob([activeConcept.logo_svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeConcept.name.replace(/\s+/g, '_').toLowerCase()}_logo.svg`;
    a.click;
    URL.revokeObjectURL(url);
  };

  const handleTriggerStyleChange = async (style) => {
    if (!onStyleChange) return;
    setIsChangingStyle(true);
    try {
      await onStyleChange(style);
    } finally {
      setIsChangingStyle(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xs">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              {artifact?.name || 'Brand Identity & Vector Logos'}
            </h4>
            <div className="text-[11px] text-slate-400">
              Parametric SVG Vector Generator • Mathematical Contrast Ratios
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ModelTransparencyBadge
            provider={artifact?.provider_id || 'BUILTIN_SVG_VECTOR'}
            model={artifact?.model_name || 'RineForgeVectorStudio'}
            isFree={artifact?.is_free ?? true}
            costEstimate={artifact?.cost_estimate || 'FREE'}
          />

          <button
            onClick={handleCopySvg}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all text-xs flex items-center gap-1"
            title="Copy Raw SVG Code"
          >
            {copiedSvg ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleDownloadSvg}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all text-xs flex items-center gap-1"
            title="Download SVG Vector"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Concept Switcher & Style Controls */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 font-bold uppercase">Aesthetic Style:</span>
          {['MINIMAL', 'PREMIUM', 'PLAYFUL', 'BOLD'].map((s) => (
            <button
              key={s}
              onClick={() => handleTriggerStyleChange(s)}
              disabled={isChangingStyle}
              className={`px-3 py-1 rounded-lg text-xs font-semibold font-mono transition-all ${
                activeConcept.style?.toUpperCase() === s
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Dark/Light Background Toggle for Logo Inspection */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setBgMode('dark')}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              bgMode === 'dark' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Dark Stage View"
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setBgMode('light')}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              bgMode === 'light' ? 'bg-slate-200 text-slate-950' : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Light Stage View"
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Vector Display Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[420px]">
        {/* Left: Interactive Vector Canvas */}
        <div className={`lg:col-span-7 flex flex-col items-center justify-center p-8 border-b lg:border-b-0 lg:border-r border-slate-800 transition-colors ${
          bgMode === 'dark' ? 'bg-[#0b0f19]' : 'bg-[#f8fafc]'
        }`}>
          <div 
            className="w-full max-w-[340px] aspect-square flex items-center justify-center p-6 rounded-2xl shadow-xl transition-all"
            dangerouslySetInnerHTML={{ __html: activeConcept.logo_svg }}
          />
          <div className="mt-4 text-center">
            <h5 className={`font-bold text-sm ${bgMode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {activeConcept.name}
            </h5>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              {activeConcept.rationale || 'Engineered vector mark with scalable SVG paths and responsive geometry.'}
            </p>
          </div>
        </div>

        {/* Right: Color Palette & Typography Specifications */}
        <div className="lg:col-span-5 p-6 bg-slate-950/70 flex flex-col justify-between space-y-6">
          {/* Swatches */}
          <div className="space-y-3">
            <h5 className="text-xs font-mono font-bold uppercase text-slate-400 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-indigo-400" />
              <span>Color System & Contrast Swatches</span>
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(activeConcept.colors || []).map((col, idx) => (
                <div
                  key={idx}
                  onClick={() => handleCopyHex(col.hex)}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all flex items-center gap-3 group"
                >
                  <div
                    className="w-9 h-9 rounded-lg shadow-sm border border-white/10 shrink-0"
                    style={{ backgroundColor: col.hex }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-white truncate">{col.name}</div>
                    <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1 group-hover:text-teal-400">
                      <span>{col.hex}</span>
                      {copiedHex === col.hex ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Typography Specimen */}
          <div className="space-y-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <h5 className="text-xs font-mono font-bold uppercase text-slate-400 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-teal-400" />
              <span>Typography Pairing</span>
            </h5>
            <div className="space-y-2">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-500">Display / Headings:</span>
                <div className="text-base font-black text-white">
                  {activeConcept.typography?.heading || 'Plus Jakarta Sans'}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-500">Body & Interfaces:</span>
                <div className="text-xs text-slate-300 font-sans">
                  {activeConcept.typography?.body || 'Inter'} — Engineered for high legibility across mobile displays and enterprise dashboards.
                </div>
              </div>
            </div>
          </div>

          {/* Brand Voice / Positioning Summary */}
          {brandData.brand_guidelines && (
            <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20 text-xs text-slate-300 leading-relaxed">
              <span className="font-bold text-indigo-400">Strategic Positioning: </span>
              {brandData.brand_guidelines.positioning || 'Modern B2B leader with uncompromising technical credibility.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
