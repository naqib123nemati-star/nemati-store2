import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FBF9F4",
          100: "#F6F1E7",
          200: "#EDE4CF"
        },
        ink: {
          900: "#1B1712",
          700: "#3A342B"
        },
        gold: {
          400: "#CBA25A",
          500: "#B4884A",
          600: "#8F6A38"
        }
      },
      fontFamily: {
        dari: ["var(--font-dari)", "Tahoma", "sans-serif"],
        pashto: ["var(--font-dari)", "Tahoma", "sans-serif"],
        en: ["var(--font-en)", "sans-serif"]
      },
      borderRadius: {
        xl2: "1.25rem"
      },
      boxShadow: {
        soft: "0 8px 30px -12px rgba(27, 23, 18, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
