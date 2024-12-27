/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        palanquin: ["Palanquin", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
      colors: {
        phoenix: "#F1721D",
      },
      boxShadow: {
        label:
          "inset 0px 5px 15px rgba(0, 0, 0, 0.4), inset 0px -5px 15px rgba(255, 255, 255, 0.4)",
        afterlabel: "0px 5px 10px rgba(0, 0, 0, 0.2)",
      },
      backgroundImage: {
        background: "url('assets/images/background.jpg')",
        ball: "url('assets/images/ball.png')",
      },
    },
  },
  plugins: [],
};
