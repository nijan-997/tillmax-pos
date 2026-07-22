/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Segoe UI Variable stack — feels native-Windows in the browser
        sans: ['"Segoe UI Variable"', '"Segoe UI"', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#1F5FD1',
          light: '#3B82F6',
          dark: '#1748A8',
        },
        manager: {
          DEFAULT: '#6B4FCC',
          light: '#8B6FE8',
          dark: '#4C3599',
        },
        destructive: {
          DEFAULT: '#C4314B',
          muted: '#E8A0AA',
        },
        warning: '#F0A30A',
        success: '#107C10',
      },
      // Touch target sizes
      minHeight: {
        touch: '56px',
        'touch-lg': '72px',
      },
      minWidth: {
        touch: '56px',
        'touch-lg': '72px',
      },
    },
  },
  plugins: [],
};
