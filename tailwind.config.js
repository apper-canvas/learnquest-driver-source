/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
colors: {
        primary: "#DC2626",
        secondary: "#F87171",
        accent: "#F59E0B",
        success: "#6BCF7F",
        warning: "#FFA726",
        error: "#EF5350",
        info: "#42A5F5",
        surface: "#FFFFFF",
        background: "#F8F9FA"
      },
      fontFamily: {
        display: ["Fredoka One", "cursive"],
        body: ["Poppins", "sans-serif"]
      },
      boxShadow: {
        card: "0 4px 8px rgba(0, 0, 0, 0.1)",
        lift: "0 8px 16px rgba(0, 0, 0, 0.15)"
      }
    },
  },
  plugins: [],
}