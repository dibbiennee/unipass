import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
          800: "#3730A3",
          900: "#312E81",
          950: "#1E1B4B",
        },
        accent: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
          950: "#451A03",
        },
        neutral: {
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#E5E5E5",
          300: "#D4D4D4",
          400: "#A3A3A3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0A0A0A",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-lg": ["2.5rem", { lineHeight: "1.1", fontWeight: "800" }],
        "display-md": ["2rem", { lineHeight: "1.15", fontWeight: "700" }],
        "display-sm": ["1.5rem", { lineHeight: "1.2", fontWeight: "700" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6", fontWeight: "400" }],
        "body-md": ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }],
        caption: ["0.75rem", { lineHeight: "1.4", fontWeight: "500" }],
      },
      borderRadius: {
        brand: "12px",
      },
      boxShadow: {
        card: "0 2px 8px rgba(0, 0, 0, 0.08)",
        "card-hover": "0 8px 24px rgba(99, 102, 241, 0.12)",
        button: "0 2px 4px rgba(0, 0, 0, 0.06)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        marquee2: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0%)" },
        },
        "marquee-slow": {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        "marquee-slow2": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
        marquee: "marquee 20s linear infinite",
        marquee2: "marquee2 20s linear infinite",
        "marquee-slow": "marquee-slow 15s linear infinite",
        "marquee-slow2": "marquee-slow2 15s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
