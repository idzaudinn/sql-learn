/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#97c459",
          muted: "rgba(99, 153, 34, 0.18)",
          border: "#639922",
        },
        shell: {
          sidebar: "#1a1f2e",
          card: "#333333",
          panel: "#383838",
          main: "#2c2c2c",
        },
      },
    },
  },
  plugins: [],
};
