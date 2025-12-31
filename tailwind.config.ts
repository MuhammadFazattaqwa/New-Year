import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        ny: "0 24px 70px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)",
      },
      keyframes: {
        nyStar: {
          "0%": { opacity: "0", transform: "translateX(-140px) rotate(12deg)" },
          "12%": { opacity: "0.65" },
          "40%": { opacity: "0.35" },
          "100%": { opacity: "0", transform: "translateX(140vw) rotate(12deg)" },
        },
        nyPulse: {
          "0%, 100%": { opacity: "0.4", filter: "blur(0px)" },
          "50%": { opacity: "0.85", filter: "blur(0.6px)" },
        },
      },
      animation: {
        nyStar: "nyStar var(--d) linear infinite",
        nyPulse: "nyPulse 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
