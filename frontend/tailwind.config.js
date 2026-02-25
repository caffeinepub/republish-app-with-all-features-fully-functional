/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          50:  "oklch(0.97 0.025 180)",
          100: "oklch(0.93 0.055 180)",
          200: "oklch(0.86 0.085 180)",
          300: "oklch(0.76 0.11 180)",
          400: "oklch(0.65 0.13 180)",
          500: "oklch(0.57 0.14 180)",
          600: "oklch(0.50 0.14 180)",
          700: "oklch(0.42 0.12 180)",
          800: "oklch(0.34 0.09 180)",
          900: "oklch(0.26 0.07 180)",
          950: "oklch(0.17 0.05 180)",
        },
        emerald: {
          50:  "oklch(0.97 0.025 155)",
          100: "oklch(0.93 0.055 155)",
          200: "oklch(0.86 0.085 155)",
          300: "oklch(0.76 0.11 155)",
          400: "oklch(0.65 0.13 155)",
          500: "oklch(0.57 0.14 155)",
          600: "oklch(0.50 0.14 155)",
          700: "oklch(0.42 0.12 155)",
          800: "oklch(0.34 0.09 155)",
          900: "oklch(0.26 0.07 155)",
          950: "oklch(0.17 0.05 155)",
        },
        cyan: {
          50:  "oklch(0.97 0.025 200)",
          100: "oklch(0.93 0.055 200)",
          200: "oklch(0.86 0.085 200)",
          300: "oklch(0.76 0.11 200)",
          400: "oklch(0.65 0.13 200)",
          500: "oklch(0.57 0.14 200)",
          600: "oklch(0.50 0.14 200)",
          700: "oklch(0.42 0.12 200)",
          800: "oklch(0.34 0.09 200)",
          900: "oklch(0.26 0.07 200)",
          950: "oklch(0.17 0.05 200)",
        },
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
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
        "3xl": "calc(var(--radius) + 16px)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["'Plus Jakarta Sans'", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        teal: "0 4px 24px oklch(0.50 0.14 180 / 0.18)",
        "teal-lg": "0 8px 40px oklch(0.50 0.14 180 / 0.22)",
        "card": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "card-hover": "0 10px 40px -10px rgb(0 0 0 / 0.15)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.4s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
};
