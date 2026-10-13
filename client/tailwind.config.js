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
          DEFAULT: '#5B5FEF',
          hover: '#484BD1',
          light: '#F0EFFF',
          50: '#F0EFFF',
          100: '#E4E2FF',
          500: '#5B5FEF',
          600: '#484BD1',
          700: '#383AB8',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          page: '#F7F9FC',
          sub: '#F7F9FC',
          muted: '#F1F4F9',
          border: '#E5EAF2',
        },
        ink: {
          primary: '#202B42',
          secondary: '#68758B',
          muted: '#96A0B2',
        },
        pastel: {
          lavender: '#F0EFFF',
          blue: '#EAF2FF',
          green: '#E5F7EE',
          orange: '#FFF1E5',
        },
        status: {
          success: '#16A675',
          warning: '#D99118',
          error: '#DC5265',
          info: '#3984E8',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(32, 43, 66, 0.04), 0 1px 2px 0 rgba(32, 43, 66, 0.02)',
        'card': '0 1px 3px 0 rgba(32, 43, 66, 0.04), 0 4px 12px 0 rgba(32, 43, 66, 0.03)',
        'card-hover': '0 6px 16px -2px rgba(32, 43, 66, 0.07), 0 2px 6px -1px rgba(32, 43, 66, 0.04)',
        'dropdown': '0 10px 25px -5px rgba(32, 43, 66, 0.1), 0 8px 10px -6px rgba(32, 43, 66, 0.05)',
      },
      borderRadius: {
        'card': '14px',
        'control': '9px',
      },
      height: {
        'navbar': '72px',
      },
    },
  },
  plugins: [],
}
