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
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        surface: {
          base: '#050811',
          card: '#090e1c',
          elevated: '#0f172a',
          border: '#1e293b'
        },
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
      keyframes: {
        flowPacket: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateX(200%)', opacity: '0' }
        },
        gentlePulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(0.98)' }
        }
      },
      animation: {
        'flow-packet': 'flowPacket 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'gentle-pulse': 'gentlePulse 3s ease-in-out infinite'
      }
    }
  },
  plugins: [],
}
