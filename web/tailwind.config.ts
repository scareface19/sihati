import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Cairo', 'Noto Sans Arabic', 'Segoe UI', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        cairo: ['Cairo', 'sans-serif'],
      },
      colors: {
        sihati: {
          primary: '#0ea5e9',
          emerald: '#10b981',
          danger: '#ef4444',
          dark: '#0f172a',
        },
      },
    },
  },
  plugins: [],
};
export default config;
