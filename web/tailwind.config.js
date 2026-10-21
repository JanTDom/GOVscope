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
        kprm: {
          dark: "#0F172A",
          card: "#1E293B",
          border: "#334155",
          accent: "#DC2626", // Red signal
          warning: "#D97706",
          success: "#059669",
          info: "#2563EB",
          light: "#F8FAFC",
        },
      },
    },
  },
  plugins: [],
};
