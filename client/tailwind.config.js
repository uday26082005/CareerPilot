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
        dark: {
          bg: '#0a0a12',      // page background
          surface: '#0e0d18', // section background (slightly lifted)
          card: '#141222',    // card background
          border: '#26243a',  // hairline borders
        },
        primary: {
          light: '#a78bfa',
          DEFAULT: '#8b5cf6',
          dark: '#7c3aed',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px rgba(139, 92, 246, 0.25)',
      },
    },
  },
  plugins: [],
}
