/**
 * RINE FORGE SYSTEMS — V4 DESIGN TOKENS
 * Semantic color, surface, typography, and interaction standards.
 */

export const DESIGN_TOKENS = {
  // Semantic Color Palette
  colors: {
    // Surfaces
    surfaceBase: '#050811',       // Main viewport backdrop
    surfaceCard: '#090e1c',       // Elevated container/card
    surfaceElevated: '#0f172a',   // Hovered / modal container
    surfaceOverlay: 'rgba(5, 8, 17, 0.85)',

    // Primary (Energetic Teal)
    primary: {
      default: '#0d9488',
      hover: '#14b8a6',
      light: '#2dd4bf',
      glow: 'rgba(20, 184, 166, 0.25)',
      subtle: 'rgba(20, 184, 166, 0.1)'
    },

    // Secondary & Accent (Electric Cyan & Violet)
    accentCyan: {
      default: '#06b6d4',
      hover: '#22d3ee',
      glow: 'rgba(6, 182, 212, 0.25)',
      subtle: 'rgba(6, 182, 212, 0.1)'
    },
    accentIndigo: {
      default: '#6366f1',
      hover: '#818cf8',
      glow: 'rgba(99, 102, 241, 0.25)',
      subtle: 'rgba(99, 102, 241, 0.1)'
    },

    // Semantic States
    success: {
      default: '#10b981',
      text: '#34d399',
      border: 'rgba(16, 185, 129, 0.4)',
      bg: 'rgba(16, 185, 129, 0.12)'
    },
    warning: {
      default: '#f59e0b',
      text: '#fbbf24',
      border: 'rgba(245, 158, 11, 0.4)',
      bg: 'rgba(245, 158, 11, 0.12)'
    },
    error: {
      default: '#f43f5e',
      text: '#fb7185',
      border: 'rgba(244, 63, 94, 0.4)',
      bg: 'rgba(244, 63, 94, 0.12)'
    },

    // Typography
    textPrimary: '#ffffff',
    textSecondary: '#cbd5e1',     // slate-300
    textMuted: '#94a3b8',         // slate-400
    textFaint: '#64748b',         // slate-500

    // Borders
    borderSubtle: '#1e293b',      // slate-800
    borderMedium: '#334155',      // slate-700
    borderActive: 'rgba(20, 184, 166, 0.5)'
  },

  // Standard interactive shadow elevations
  shadows: {
    card: '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
    cardHover: '0 20px 40px -12px rgba(20, 184, 166, 0.15)',
    glowTeal: '0 0 25px -5px rgba(20, 184, 166, 0.35)',
    glowCyan: '0 0 25px -5px rgba(6, 182, 212, 0.35)'
  },

  // Transitions
  transitions: {
    smooth: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
    spring: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
  }
};
