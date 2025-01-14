/** @type {import('tailwindcss').Config} */
export default {
   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
   theme: {
      extend: {
         textShadow: {
            sm: "1px 1px 2px rgba(0, 0, 0, 0.5)",
            md: "2px 2px 4px rgba(0, 0, 0, 0.5)",
            lg: "3px 3px 6px rgba(0, 0, 0, 0.5)",
         },
         fontFamily: {
            roboto: ["Roboto", "sans-serif"],
            inter: ["Inter", "serif"],
            kosugi: ["Kosugi Maru", "serif"],
         },
         animation: {
            "drop-in": "drop-in 1s ease-out",
            "zoom-in": "zoom-in 0.5s ease-in-out",
            "fade-in-blur": "fade-in-blur 1s ease-out",
            "fade-out": "fade-out 1s ease-in",
         },
         keyframes: {
            "drop-in": {
               "0%": { transform: "translateY(-100%)", opacity: "0" },
               "100%": { transform: "translateY(0)", opacity: "1" },
            },
            "zoom-in": {
               "0%": { transform: "scale(0.5)", opacity: "0" },
               "100%": { transform: "scale(1)", opacity: "1" },
            },
            "fade-in-blur": {
               "0%": { opacity: "0", filter: "blur(10px)" },
               "100%": { opacity: "1", filter: "blur(0)" },
            },
            "fade-out": {
               "0%": { opacity: "1" },
               "100%": { opacity: "0" },
            },
         },
      },
   },
   plugins: [
      require("tailwind-scrollbar")({ nocompatible: true }), // Enhanced scrollbar plugin
      function ({ addUtilities }) {
         // Add custom utilities for text shadows
         addUtilities({
            ".text-shadow-sm": {
               textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
            },
            ".text-shadow-md": {
               textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
            },
            ".text-shadow-lg": {
               textShadow: "3px 3px 6px rgba(0, 0, 0, 0.5)",
            },
         });
      },
   ],
};
