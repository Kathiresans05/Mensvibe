/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf4f5',
          100: '#fbe8eb',
          200: '#f7d5da',
          300: '#f0b3bc',
          400: '#e58595',
          500: '#d75a71',
          600: '#c03d57',
          700: '#a12e45',
          800: '#86293d',
          900: '#722637',
          950: '#40101b',
        },
        fashion: {
          dark: '#111827',
          gold: '#D4AF37',
          light: '#FAFAFA',
          muted: '#6B7280',
          surface: '#FFFFFF',
          border: '#E5E7EB',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
