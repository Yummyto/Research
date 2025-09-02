/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // Include all React components
  ],
  theme: {
    extend: {
      colors: {
        dark: '#0f172a',
        darkSecondary: '#1e293b',
        card: '#334155',
        accent: '#facc15',
      },
    },
  },
  plugins: [],
};
