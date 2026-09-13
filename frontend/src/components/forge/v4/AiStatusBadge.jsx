import React from 'react';
import { 
  CheckCircle2, AlertTriangle, XCircle, Bot, 
  Loader2, Sparkles, Cpu, Clock, RefreshCw 
} from 'lucide-react';

/**
 * RINE FORGE SYSTEMS — V4 AI STATUS SYSTEM
 * Reusable, accessible status badge indicating AI activity states.
 * 
 * States:
 * - 'online': ● AI ONLINE
 * - 'thinking': ● THINKING...
 * - 'analyzing': ● ANALYZING REQUEST
 * - 'checking': ● CHECKING INFORMATION
 * - 'action': ● TAKING ACTION
 * - 'completed': ✓ COMPLETED
 * - 'needs_human': ! NEEDS HUMAN
 * - 'failed': ✕ FAILED
 */
export function AiStatusBadge({ 
  status = 'online', 
  customLabel = null, 
  size = 'md', // 'sm' | 'md' | 'lg'
  showIcon = true,
  className = '' 
}) {
  const configs = {
    online: {
      label: 'AI ONLINE',
      dotClass: 'bg-emerald-400 animate-ping',
      dotStatic: 'bg-emerald-400',
      badgeClass: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      icon: Bot,
      iconClass: 'text-emerald-400'
    },
    thinking: {
      label: 'THINKING...',
      dotClass: 'bg-amber-400 animate-pulse',
      dotStatic: 'bg-amber-400',
      badgeClass: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      icon: Sparkles,
      iconClass: 'text-amber-400 animate-spin [animation-duration:4s]'
    },
    analyzing: {
      label: 'ANALYZING REQUEST',
      dotClass: 'bg-cyan-400 animate-ping',
      dotStatic: 'bg-cyan-400',
      badgeClass: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
      icon: Cpu,
      iconClass: 'text-cyan-400'
    },
    checking: {
      label: 'CHECKING INFORMATION',
      dotClass: 'bg-indigo-400 animate-pulse',
      dotStatic: 'bg-indigo-400',
      badgeClass: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
      icon: RefreshCw,
      iconClass: 'text-indigo-400 animate-spin [animation-duration:3s]'
    },
    action: {
      label: 'TAKING ACTION',
      dotClass: 'bg-teal-400 animate-ping',
      dotStatic: 'bg-teal-400',
      badgeClass: 'bg-teal-500/15 text-teal-300 border-teal-500/40 shadow-sm shadow-teal-500/20',
      icon: Loader2,
      iconClass: 'text-teal-400 animate-spin'
    },
    completed: {
      label: 'COMPLETED ✓',
      dotClass: 'bg-emerald-400',
      dotStatic: 'bg-emerald-400',
      badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
      icon: CheckCircle2,
      iconClass: 'text-emerald-400'
    },
    needs_human: {
      label: 'NEEDS HUMAN !',
      dotClass: 'bg-amber-400 animate-bounce',
      dotStatic: 'bg-amber-400',
      badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
      icon: AlertTriangle,
      iconClass: 'text-amber-400'
    },
    failed: {
      label: 'FAILED ✕',
      dotClass: 'bg-rose-400',
      dotStatic: 'bg-rose-400',
      badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
      icon: XCircle,
      iconClass: 'text-rose-400'
    }
  };

  const current = configs[status] || configs.online;
  const displayText = customLabel || current.label;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1.5',
    md: 'px-2.5 py-1 text-xs gap-2',
    lg: 'px-3.5 py-1.5 text-xs sm:text-sm gap-2.5'
  };

  const Icon = current.icon;

  return (
    <span 
      role="status"
      aria-label={`AI Status: ${displayText}`}
      className={`inline-flex items-center rounded-full font-mono font-bold tracking-wider uppercase border transition-all duration-300 select-none ${current.badgeClass} ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      {/* Animated Ping Indicator */}
      <span className="relative flex h-2 w-2 shrink-0">
        {current.dotClass && (
          <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${current.dotClass}`} />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${current.dotStatic}`} />
      </span>

      {/* Optional Lucide Icon */}
      {showIcon && Icon && (
        <Icon className={`w-3.5 h-3.5 shrink-0 ${current.iconClass}`} />
      )}

      {/* Status Label */}
      <span className="truncate">{displayText}</span>
    </span>
  );
}
