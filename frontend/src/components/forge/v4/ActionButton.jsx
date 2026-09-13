import React, { useState } from 'react';
import { ArrowRight, Loader2, Check, Sparkles } from 'lucide-react';
import { forgeAudioSynth } from '../../../utils/forgeAudioSynth';

/**
 * RINE FORGE SYSTEMS — V4 ACTION BUTTON
 * Tactile, alive, accessible button with hover, press, focus, loading, and success states.
 * 
 * Variants:
 * - 'primary': Dominant high-contrast gradient with subtle teal glow
 * - 'secondary': Deep obsidian surface with clean slate border
 * - 'accent': Electric cyan / violet glow border
 * - 'ghost': Minimal transparent background with hover elevation
 */
export function ActionButton({
  children,
  onClick,
  variant = 'primary', // 'primary' | 'secondary' | 'accent' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon = ArrowRight,
  showIcon = true,
  isLoading = false,
  isSuccess = false,
  disabled = false,
  type = 'button',
  fullWidth = false,
  className = '',
  successText = 'Done ✓',
  loadingText = 'Processing...',
  ariaLabel
}) {
  const [internalLoading, setInternalLoading] = useState(false);
  const [internalSuccess, setInternalSuccess] = useState(false);

  const activeLoading = isLoading || internalLoading;
  const activeSuccess = isSuccess || internalSuccess;

  const handleClick = async (e) => {
    if (disabled || activeLoading || activeSuccess) return;

    forgeAudioSynth.playClick();

    if (onClick) {
      try {
        const result = onClick(e);
        // If onClick returns a Promise, auto-handle loading and success states
        if (result && typeof result.then === 'function') {
          setInternalLoading(true);
          await result;
          setInternalLoading(false);
          setInternalSuccess(true);
          forgeAudioSynth.playSuccess();
          setTimeout(() => setInternalSuccess(false), 2000);
        }
      } catch (err) {
        setInternalLoading(false);
      }
    }
  };

  const baseStyles = 'relative inline-flex items-center justify-center font-mono font-bold tracking-wider uppercase transition-all duration-200 select-none outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050811] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'min-h-[44px] px-4 py-2 text-xs rounded-xl gap-2',
    md: 'min-h-[48px] px-7 py-3.5 text-xs sm:text-sm rounded-2xl gap-2.5',
    lg: 'min-h-[54px] px-9 py-4 text-sm sm:text-base rounded-2xl gap-3 shadow-xl'
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-300 hover:from-teal-300 hover:to-cyan-200 text-slate-950 font-black shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-0.5 border border-teal-200/60',
    secondary: 'bg-[#090e1c] hover:bg-[#0f172a] text-slate-200 hover:text-white border-2 border-slate-700/80 hover:border-slate-500 hover:shadow-md hover:-translate-y-0.5 shadow-slate-950/50',
    accent: 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 hover:text-white border-2 border-cyan-500/40 hover:border-cyan-400 shadow-lg shadow-cyan-500/20 hover:-translate-y-0.5',
    ghost: 'bg-transparent hover:bg-slate-900/60 text-slate-300 hover:text-white border border-transparent hover:border-slate-800'
  };

  const Icon = icon;

  return (
    <button
      type={type}
      disabled={disabled || activeLoading}
      onClick={handleClick}
      aria-label={ariaLabel || (typeof children === 'string' ? children : 'Action')}
      className={`
        ${baseStyles}
        ${sizeStyles[size] || sizeStyles.md}
        ${variantStyles[variant] || variantStyles.primary}
        ${fullWidth ? 'w-full' : 'w-full sm:w-auto'}
        ${activeSuccess ? '!bg-emerald-500 !text-slate-950 !border-emerald-300 shadow-emerald-500/30' : ''}
        ${className}
      `}
    >
      {/* Loading State */}
      {activeLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
          <span>{loadingText}</span>
        </>
      ) : activeSuccess ? (
        /* Success State */
        <>
          <Check className="w-4 h-4 text-current stroke-[3] shrink-0" />
          <span>{successText}</span>
        </>
      ) : (
        /* Normal State */
        <>
          <span>{children}</span>
          {showIcon && Icon && (
            <Icon className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
          )}
        </>
      )}
    </button>
  );
}
