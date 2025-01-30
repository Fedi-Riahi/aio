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
        background: "#11192e",
        foreground: "#fff",
        main: "#d40641",
        secondary: "#2d3748",
        dark: {
          background: "#11192e", 
          foreground: "#fff", 
          main: "#ff4d6d", 
          secondary: "#2d3748", 
        },
      },
    },
  },
  plugins: [],
};