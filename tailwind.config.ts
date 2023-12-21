/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        main: "url('../public/clouds-bg.svg')",
        filter: 'url(../public/Rectangle.svg)',
        elgoli: 'url(../public/elgoli.svg)',
        tempLow: "url('../public/pexels-lumn.jpg')",
        tempHigh: "url('../public/white-cloud-blue-sky.jpg')",
      },
      backgroundColor: {
        box: 'rgba(255, 255, 255, 0.1)',
        card: 'rgba(29,55,76, .95)',
      },
      colors: {
        primary: '#EDBA4F',
        gray: 'rgba(255, 255, 255, 0.2)',
      },
      backdropBlur: {
        '4xl': '100px',
      },
    },
  },
  plugins: [],
};
