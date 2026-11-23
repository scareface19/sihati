/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sihati: {
          emerald: '#10b981',
          primary: '#0ea5e9',
          danger: '#ef4444',
          dark: '#0f172a',
        },
      },
    },
  },
  plugins: [],
};
