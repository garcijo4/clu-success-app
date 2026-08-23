import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Official Cal Lutheran heritage palette
        clu: {
          purple: '#3B2360',
          purpleAlt: '#6A4C92',
          gold: '#FFC222',
          goldAlt: '#FFD589',
        },
        // Official CLU secondary palette (chapter accents)
        chapter: {
          deepblue: '#1E5989',
          brightblue: '#4796C1',
          lightblue: '#AADFF1',
          darkgreen: '#00854F',
          brightgreen: '#31B27D',
          lightgreen: '#C5E4CE',
          red: '#E74645',
          orange: '#F0885D',
          peach: '#F4D5BE',
        },
        // Theme-aware tokens driven by CSS variables (see globals.css)
        bg: 'rgb(var(--bg) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        elevated: 'rgb(var(--elevated) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        body: 'rgb(var(--body) / <alpha-value>)',
        brand: 'rgb(var(--brand) / <alpha-value>)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: { '2xl': '1rem' },
    },
  },
  plugins: [],
};

export default config;
