/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#eef3fd',
          100: '#d5e2fa',
          200: '#abc5f5',
          300: '#80a7f0',
          400: '#4f7de8',
          500: '#2d5fd4',
          600: '#1e4ec4',
          700: '#164DBC',   // ← màu chủ đạo
          800: '#1240a0',
          900: '#0d3283',
          950: '#081e52',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

