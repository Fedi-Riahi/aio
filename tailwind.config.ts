
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
        main: "#D30641",

        dark: {
          background: "rgb(9,17,28)", 
          foreground: "#fff", 
          main: "#D30641", 

        },
      },
    },
  },
  plugins: [],
};