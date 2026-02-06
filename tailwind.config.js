/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'malta-red': '#CF142B',
        'malta-blue': '#0057B7',
        'compliance-green': '#00A859',
        'warning-amber': '#FF8C00',
        'red-light': '#F8D7DA',
        'blue-light': '#CCE5FF', 
        'green-light': '#D4EDDA',
        'gray-900': '#2D3748',
        'gray-700': '#4A5568',
        'gray-500': '#6C757D',
        'gray-300': '#E2E8F0',
        'gray-100': '#F8F9FA',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
