/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'sky-blue': '#E1EFF1',
        'navy-blue' : '#30305B',
        'transparent' : '#6D6A71',
        'white-transparent' : '#FFFFFF',
        'primary-orange' : '#FA6342',
        'light-blue' : '#D7E5F2',
        'turquoise-blue' : '#2680A6',
        'lavender-violet' : '#857EC3'
      },
      width: {
        '0.2': '0.2px',
      },
      backgroundImage: {
        'login-custom-gradient': 'linear-gradient(to right, #ff4b2b, #ff416c)',
        'verification-custom-gradient': 'linear-gradient(to right, #3737A9, #17174D)',
      },
    },
  },
  plugins: [],
};
