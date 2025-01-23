import typography from '@tailwindcss/typography';
import textShadow from 'tailwindcss-textshadow';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      textShadow: {
        sm: '1px 1px 2px rgba(255, 255, 255, 0.5)', // Small white shadow
        md: '2px 2px 4px rgba(255, 255, 255, 0.5)', // Medium white shadow
        lg: '3px 3px 6px rgba(255, 255, 255, 0.5)', // Large white shadow
        none: 'none', // No shadow
      },
      screens: {
        xs: { max: '424px' }, // Custom screen size for below 425px
      },
      colors: {
        'custom-light-blue': 'rgba(60, 130, 246, 1)',
        'custom-red': '#bc382e',
      },
      fontFamily: {
        cursive: ['"Pacifico"', 'cursive'], 
      },
    },
  },
  plugins: [
    typography,
    textShadow, // Use the plugin imported with ES modules
    function ({ addUtilities }) {
      addUtilities({
        '.text-justify': {
          textAlign: 'justify',
        },
      });
    },
  ],
};
