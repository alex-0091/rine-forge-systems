import React from 'react';
import { Cpu, ShieldCheck, Zap, DollarSign, Cloud, HardDrive } from 'lucide-react';

export function ModelTransparencyBadge({ 
  provider = 'LOCAL_OLLAMA', 
  model = 'standard', 
  isFree = true, 
  costEstimate = 'FREE', 
  isLocal = true,
  className = ''
}) {
  const isCloud = !isLocal && provider.toLowerCase().includes('cloud') || provider.toLowerCase().includes('openai') || provider.toLowerCase().includes('replicate');
  
  return (
    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border text-[11px] font-mono transition-all ${
      isFree 
        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
        : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
    } ${className}`}>
      {/* Local vs Cloud Icon */}
      {isCloud ? (
        <span className="flex items-center gap-1 text-sky-400" title="External Cloud Provider">
          <Cloud className="w-3.5 h-3.5" />
          <span className="text-[10px] font-sans font-semibold">Cloud</span>
        </span>
      ) : (
        <span className="flex items-center gap-1 text-emerald-400" title="Local / On-Premise Engine">
          <HardDrive className="w-3.5 h-3.5" />
          <span className="text-[10px] font-sans font-semibold">Local/Free</span>
        </span>
      )}

      <span className="text-slate-600 dark:text-slate-500">•</span>

      {/* Model Name */}
      <span className="font-bold truncate max-w-[140px]" title={`Model: ${model}`}>
        {model}
      </span>

      <span className="text-slate-600 dark:text-slate-500">•</span>

      {/* Cost & Verification */}
      <span className={`font-semibold flex items-center gap-0.5 ${isFree ? 'text-emerald-400' : 'text-amber-400'}`}>
        {isFree ? (
          <>
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>0.00 (FREE)</span>
          </>
        ) : (
          <>
            <DollarSign className="w-3 h-3 text-amber-400" />
            <span>{costEstimate}</span>
          </>
        )}
      </span>
    </div>
  );
}
