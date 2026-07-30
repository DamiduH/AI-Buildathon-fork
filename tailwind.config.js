/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/hooks/**/*.{js,ts,jsx,tsx}',
    './src/context/**/*.{js,ts,jsx,tsx}',
    './src/data/**/*.{js,ts,jsx,tsx}',
    './src/lib/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'primary-orange': '#FF5500',
        'primary-blue': '#FF8800',
        brand: {
          orange: '#FF5500'
        }
      },
      fontFamily: {
        heading: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['Rajdhani', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif']
      }
    }
  },
  corePlugins: {
    preflight: false
  },
  plugins: []
};
