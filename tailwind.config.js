// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // apne src folder ke sare files cover karo
  ],
  theme: {
    extend: {
      fontFamily: {
        dm: ["DM Sans", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
