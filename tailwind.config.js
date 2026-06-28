/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './index.tsx',
    './App.tsx',
    './components/**/*.{ts,tsx}',
    './context/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Yekan Bakh', 'Tahoma', 'Arial', 'sans-serif'],
        numeric: ['Yekan Bakh', 'Tahoma', 'Arial', 'sans-serif']
      },
      colors: {
        primary: {
          light: '#0891b2',
          DEFAULT: '#0891b2',
          dark: '#22d3ee'
        },
        secondary: {
          light: '#475569',
          DEFAULT: '#475569',
          dark: '#94a3b8'
        },
        accent: {
          light: '#f59e0b',
          DEFAULT: '#f59e0b',
          dark: '#fcd34d'
        },
        success: {
          light: '#16a34a',
          DEFAULT: '#16a34a',
          dark: '#4ade80'
        },
        danger: {
          light: '#dc2626',
          DEFAULT: '#dc2626',
          dark: '#f87171'
        },
        bkg: {
          light: '#f1f5f9',
          DEFAULT: '#f1f5f9',
          dark: '#1e293b'
        },
        surface: {
          light: 'rgba(255,255,255,0.6)',
          DEFAULT: 'rgba(255,255,255,0.6)',
          dark: 'rgba(30,41,59,0.6)'
        },
        'text-primary': {
          light: '#1e293b',
          DEFAULT: '#1e293b',
          dark: '#e2e8f0'
        },
        'text-secondary': {
          light: '#64748b',
          DEFAULT: '#64748b',
          dark: '#94a3b8'
        }
      }
    }
  }
};
