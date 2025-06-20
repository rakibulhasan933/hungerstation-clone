import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-up-bounce": "slideUpBounce 2s ease-out",
        "sparkle-1": "sparkle1 2s ease-out",
        "sparkle-2": "sparkle2 2s ease-out 0.2s",
        "sparkle-3": "sparkle3 2s ease-out 0.4s",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideUpBounce: {
          "0%": { transform: "translateY(100px)", opacity: "0", scale: "0.8" },
          "50%": { transform: "translateY(-10px)", opacity: "1", scale: "1.1" },
          "70%": { transform: "translateY(5px)", scale: "0.95" },
          "100%": { transform: "translateY(-50px)", opacity: "0", scale: "1" },
        },
        sparkle1: {
          "0%": { transform: "translateY(0) scale(0)", opacity: "0" },
          "50%": { transform: "translateY(-30px) scale(1)", opacity: "1" },
          "100%": { transform: "translateY(-60px) scale(0)", opacity: "0" },
        },
        sparkle2: {
          "0%": { transform: "translateY(0) scale(0)", opacity: "0" },
          "50%": { transform: "translateY(-40px) scale(1)", opacity: "1" },
          "100%": { transform: "translateY(-80px) scale(0)", opacity: "0" },
        },
        sparkle3: {
          "0%": { transform: "translateY(0) scale(0)", opacity: "0" },
          "50%": { transform: "translateY(-25px) scale(1)", opacity: "1" },
          "100%": { transform: "translateY(-50px) scale(0)", opacity: "0" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
