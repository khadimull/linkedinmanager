/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        linkedin: {
          50: '#f0f7ff',
          100: '#e0effe',
          500: '#0a66c2',
          600: '#004182',
          700: '#00325e',
        },
      },
    },
  },
  plugins: [],
};
