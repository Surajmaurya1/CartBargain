/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Core backgrounds ──────────────────────────────────────────
        background: 'var(--color-background)',
        card: 'var(--color-card)',
        'card-inner': 'var(--color-card-inner)',
        'card-item': 'var(--color-card-item)',
        elevated: 'var(--color-elevated)',
        hover: 'var(--color-hover)',

        // ── Navigation ───────────────────────────────────────────────
        nav: 'var(--color-nav)',

        // ── Primary button ───────────────────────────────────────────
        'btn-bg': 'var(--color-btn-bg)',
        'btn-text': 'var(--color-btn-text)',

        // ── Text ─────────────────────────────────────────────────────
        main: 'var(--color-text-main)',
        sub: 'var(--color-text-sub)',
        muted: 'var(--color-text-muted)',

        // ── Status ───────────────────────────────────────────────────
        'status-green': 'var(--color-status-green)',

        // ── Border ───────────────────────────────────────────────────
        border: 'var(--color-border)',
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
        '5xl': '40px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.25)',
        'card-hover-light': '0 4px 20px rgba(0,0,0,0.06)',
        'elevated': '0 12px 40px rgba(0,0,0,0.35)',
        'elevated-light': '0 12px 40px rgba(0,0,0,0.1)',
      },
      transitionDuration: {
        'fast': '150ms',
        'normal': '250ms',
        'slow': '350ms',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'spring-gentle': 'cubic-bezier(0.25, 1, 0.5, 1)',
      },
    },
  },
  plugins: [],
}