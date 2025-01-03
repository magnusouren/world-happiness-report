/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",             // Sørg for å inkludere denne
    "./src/**/*.{js,ts,jsx,tsx}" // Alle filtyper i src-mappen
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
