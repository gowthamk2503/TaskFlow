/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aurora: {
          bg: '#0B1020',
          sidebar: '#0F172A',
          card: '#111B30',
          surface: '#17233B',
          border: '#263449',
          violet: '#8B5CF6',
          cyan: '#22D3EE',
          text: '#F8FAFC',
          muted: '#94A3B8',
          success: '#34D399',
          warning: '#FBBF24',
          error: '#FB7185',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-violet': '0 0 25px -5px rgba(139, 92, 246, 0.3)',
        'glow-cyan': '0 0 25px -5px rgba(34, 211, 238, 0.3)',
        'card': '0 8px 30px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
}
