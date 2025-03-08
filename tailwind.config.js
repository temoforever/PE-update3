/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Tajawal", "sans-serif"],
        heading: ["Tajawal", "sans-serif"],
        display: ["Tajawal", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#7C9D32",
          hover: "#6A8829",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#FFD700",
          hover: "#E6C200",
          foreground: "#1A1A1A",
        },
        accent: {
          DEFAULT: "#95B846",
          hover: "#86A73D",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#FF4D4D",
          hover: "#E63939",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F8FAF5",
          hover: "#EEF2E9",
          foreground: "#666666",
        },
        card: {
          DEFAULT: "#FFFFFF",
          hover: "#F8FAF5",
          foreground: "#1A1A1A",
        },
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
      },
      boxShadow: {
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "card-hover":
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-in",
        "slide-up": "slide-up 0.3s ease-out",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      padding: {
        'safe': 'env(safe-area-inset-top)',
      }
    },
  },
  plugins: ["tailwindcss-animate"],
};
