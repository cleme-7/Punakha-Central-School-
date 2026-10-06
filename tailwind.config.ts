import type { Config } from 'tailwindcss';
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: { extend: {
    colors: { brand: { DEFAULT: '#7A1F2B', dark: '#5A1520' }, gold: '#E0A100' },
    fontFamily: { sans: ['var(--font-sans)', 'system-ui', 'sans-serif'], serif: ['var(--font-serif)', 'Georgia', 'serif'] },
  } },
  plugins: [],
} satisfies Config;
