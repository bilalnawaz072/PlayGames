/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#0284c7",
          sky: "#38bdf8",
          lightSky: "#e0f2fe",
          green: "#65a30d",
          brightGreen: "#84cc16",
          darkGreen: "#3f6212",
          yellow: "#eab308",
          orange: "#f97316",
          darkBg: "#0f172a",
          cardBg: "#ffffff"
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
