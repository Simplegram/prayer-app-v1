/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,html}'],
  theme: {
    extend: {
      fontSize: {
        prayer: '24px',
        'prayer-lg': '32px',
      },
      colors: {
        cream: '#FFFDF5',
      },
    },
  },
  plugins: [],
};
