import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      animation: {
        ripple: "ripple 0.6s linear forwards",
      },
      keyframes: {
        ripple: {
          "0%": { width: "0px", height: "0px", opacity: "0.5" }, // Inicia com 50% de opacidade
          "100%": { width: "500px", height: "500px", opacity: "0" }, // Termina completamente transparente
        },
      },
    },
  },
  plugins: [forms],
};

export default config;
