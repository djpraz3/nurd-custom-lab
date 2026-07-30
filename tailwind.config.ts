import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#08070B",
        panel: "#121019",
        panel2: "#1A1723",
        border: "#2A2534",
        violet: "#7A4DFF",
        violetDim: "#4A3480",
        gold: "#C9A24B",
        ink: "#F3F1F8",
        inkDim: "#9891AC",
        inkFaint: "#655D78",
        danger: "#EF5350",
        warning: "#E0A857",
        success: "#4ECB8D",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
