/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        caprasimo: ["'Caprasimo', cursive"],
      },
      animation: {
        disappear: "disappear 0.3s ease-in-out",
      },
      keyframes: {
        disappear: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [
    ({ addUtilities }) => {
      addUtilities({
        ".text-stroke-1-white": {
          "-webkit-text-stroke": "1px white",
        },
        ".text-stroke-2-black": {
          "-webkit-text-stroke": "2px black",
        },
      });
    },
  ],
};
