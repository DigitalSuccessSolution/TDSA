// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#0f172a",
          800: "#1e293b",
          700: "#334155",
        },
        cyan: {
          500: "#06b6d4",
          400: "#22d3ee",
        },
        teal: {
          500: "#14b8a6",
          400: "#2dd4bf",
        },
      },
      animation: {
        "gradient-x": "gradient-x 3s ease infinite",
        "spin-slow": "spin-slow 20s linear infinite",
        marquee: "marquee 40s linear infinite",
        marquee2: "marquee2 40s linear infinite", // Secondary loop for Left Scroll
        "marquee-reverse": "marquee-reverse 40s linear infinite",
        "marquee-reverse2": "marquee-reverse2 40s linear infinite", // Secondary loop for Right Scroll
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        marquee2: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0%)" },
        },
        "marquee-reverse2": {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
