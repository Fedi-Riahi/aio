
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",

  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "rgb(9,17,28)",
        foreground: "#fff",
        offwhite:'rgb(255,255,255,.1)',
        main: "#D30641",

        dark: {
          background: "rgb(9,17,28)",
          foreground: "#fff",
          main: "#D30641",

        },
      },
      textStroke: {
        'sm': '1px',
        'md': '2px',
        'lg': '3px',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
        const newUtilities = {
          '.text-stroke-sm': {
            '-webkit-text-stroke': '1px black',
          },
          '.text-stroke-md': {
            '-webkit-text-stroke': '2px black',
          },
          '.text-stroke-lg': {
            '-webkit-text-stroke': '3px black',
          },
        };
        addUtilities(newUtilities);
      },
  ],
};
