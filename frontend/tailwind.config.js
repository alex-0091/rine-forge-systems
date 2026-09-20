/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        // Light-First Design System Tokens
        canvas: {
          light: '#f8fafc',
          warm: '#fafaf9',
          subtle: '#f1f5f9',
          dark: '#0a0f1d'
        },
        surface: {
          base: '#ffffff',
          card: '#ffffff',
          elevated: '#f8fafc',
          border: '#e2e8f0',
          dark: '#0f172a',
          'dark-card': '#131d33',
          'dark-elevated': '#18243e',
          'dark-border': '#1e293b'
        },
        ink: {
          primary: '#0f172a',
          secondary: '#334155',
          muted: '#64748b',
          subtle: '#94a3b8',
          inverted: '#f8fafc'
        },
        accent: {
          blue: {
            50: '#eff6ff',
            100: '#dbeafe',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
          },
          violet: {
            50: '#f5f3ff',
            100: '#ede9fe',
            500: '#8b5cf6',
            600: '#7c3aed',
            700: '#6d28d9',
          },
          cyan: {
            50: '#ecfeff',
            100: '#cffafe',
            500: '#06b6d4',
            600: '#0891b2',
          },
          coral: {
            50: '#fff7ed',
            100: '#ffedd5',
            500: '#f97316',
            600: '#ea580c',
          },
          emerald: {
            50: '#ecfdf5',
            100: '#d1fae5',
            500: '#10b981',
            600: '#059669',
          }
        },
        // Backward-compatible tokens for operator console
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          900: '#134e4a',
          cyan: '#06b6d4',
          indigo: '#6366f1'
        },
        dark: {
          950: '#050811',
          900: '#090e1c',
          850: '#0f172a',
          800: '#1e293b',
          700: '#334155'
        }
      },
      boxShadow: {
        'soft-sm': '0 1px 3px rgba(15, 23, 42, 0.05)',
        'soft': '0 4px 14px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.04)',
        'soft-md': '0 10px 25px -3px rgba(15, 23, 42, 0.08), 0 4px 10px -2px rgba(15, 23, 42, 0.03)',
        'soft-lg': '0 20px 35px -5px rgba(15, 23, 42, 0.1), 0 8px 16px -4px rgba(15, 23, 42, 0.04)',
        'glow-blue': '0 0 25px -4px rgba(37, 99, 235, 0.25)',
        'glow-violet': '0 0 25px -4px rgba(124, 58, 237, 0.25)',
        'glow-coral': '0 0 25px -4px rgba(234, 88, 12, 0.25)',
      },
      keyframes: {
        flowPacket: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateX(200%)', opacity: '0' }
        },
        gentlePulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(0.98)' }
        },
        orbBreathe: {
          '0%, 100%': { transform: 'scale(1)', filter: 'brightness(1)' },
          '50%': { transform: 'scale(1.06)', filter: 'brightness(1.15)' }
        },
        soundWave: {
          '0%, 100%': { height: '8px' },
          '50%': { height: '36px' }
        },
        floatSubtle: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' }
        }
      },
      animation: {
        'flow-packet': 'flowPacket 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'gentle-pulse': 'gentlePulse 3s ease-in-out infinite',
        'orb-breathe': 'orbBreathe 4s ease-in-out infinite',
        'sound-wave': 'soundWave 1.2s ease-in-out infinite',
        'float-subtle': 'floatSubtle 5s ease-in-out infinite'
      }
    }
  },
  plugins: [],
}
