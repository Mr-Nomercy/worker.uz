import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        trust: {
          blue: "#0ea5e9",
          dark: "#0369a1",
        },
        verified: {
          green: "#10b981",
          light: "#d1fae5",
        },
        success: "#10b981",
        warning: "#f59e0b",
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { filter: "drop-shadow(0 0 4px rgba(14, 165, 233, 0.4))" },
          "50%": { filter: "drop-shadow(0 0 12px rgba(14, 165, 233, 0.8))" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
