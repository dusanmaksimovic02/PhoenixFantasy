import { mtConfig } from "@material-tailwind/react";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        palanquin: ["Palanquin", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
      colors: {
        phoenix: "#F1721D",
        "surface-light": "#f3f4f6",
        "surface-dark": "#111827"
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
      keyframes: {
        growIn: {
          "0%": { transform: "scale(0)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-100vw)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100vw)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInTop: {
          "0%": { transform: "translateY(-100vh)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInRotate: {
          "0%": {
            transform: "translateY(40vh) rotate(0deg)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0) rotate(360deg)",
            opacity: "1",
          },
        },
      },
      animation: {
        growIn: "growIn 3s ease-in-out",
        slideInLeft: "slideInLeft 2s ease-in-out",
        slideInRight: "slideInRight 2s ease-in-out",
        slideInTop: "slideInTop 2s ease-in-out",
        fadeIn: "fadeIn 2.5s ease-in-out",
        slideInRotate: "slideInRotate 1.5s ease-in-out",
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar")({
      nocompatible: true,
      preferredStrategy: "pseudoelements",
    }),
    [mtConfig],
  ],
  variants: {
    scrollbar: ["dark"],
  },
};
