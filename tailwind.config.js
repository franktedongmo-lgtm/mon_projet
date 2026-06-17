/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gold: {
          50: "#fdf8ee",
          100: "#f9ecc9",
          200: "#f1d68d",
          300: "#e6bb52",
          400: "#dba62f",
          500: "#c8901f",
          600: "#a8721a",
          700: "#825619",
          800: "#5f3f17",
        },
        cream: "#fbf3e3",
        cocoa: "#3b2317",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
