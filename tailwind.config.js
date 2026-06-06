/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fantasy: {
          dark: '#1a1625',
          darker: '#0f0d15',
          purple: '#7c3aed',
          gold: '#fbbf24',
          red: '#dc2626',
          green: '#22c55e',
          blue: '#3b82f6',
          orange: '#f97316',
        }
      },
      backgroundImage: {
        'fantasy-gradient': 'linear-gradient(135deg, #1a1625 0%, #2d1f47 50%, #1a1625 100%)',
        'card-gradient': 'linear-gradient(145deg, rgba(124,58,237,0.1) 0%, rgba(251,191,36,0.05) 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(124,58,237,0.5), 0 0 10px rgba(124,58,237,0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(124,58,237,0.8), 0 0 30px rgba(124,58,237,0.5)' },
        }
      }
    },
  },
  plugins: [],
}

