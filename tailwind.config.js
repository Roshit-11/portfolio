/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      colors: {
        // Editorial "stone + lime" palette (Lando-inspired)
        paper: '#D9D6C7', // warm stone base
        surface: '#FAF9F3', // warm near-white cards
        ink: {
          DEFAULT: '#1B1B18',
          soft: '#46453D',
          // warm deep-taupe scale for dark sections / modals
          950: '#211F19',
          900: '#2A2823',
          850: '#33322C',
          800: '#3D3B33',
        },
        muted: '#6E6C60',
        line: '#C6C2B1',
        // accent = deep olive: legible as text/links/borders on stone
        accent: {
          DEFAULT: '#4B5A16',
          hover: '#3A4712',
          soft: '#E8EFCF',
          ink: '#333E10',
        },
        // lime = the single bright pop (CTA fills, highlights, dark sections)
        lime: '#C6F24E',
        taupe: {
          DEFAULT: '#33322C',
          light: '#3D3A34',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        blink: 'blink 1.1s step-end infinite',
        'spin-slow': 'spin 12s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        twinkle: 'twinkle 3s ease-in-out infinite',
        drift: 'drift 11s ease-in-out infinite',
        'drift-2': 'drift2 14s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.35', transform: 'scale(0.85) rotate(0deg)' },
          '50%': { opacity: '1', transform: 'scale(1.2) rotate(45deg)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '33%': { transform: 'translate(14px, -18px)' },
          '66%': { transform: 'translate(-10px, 10px)' },
        },
        drift2: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(-16px, -14px)' },
        },
      },
    },
  },
  plugins: [],
};
