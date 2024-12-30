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
            Inter: ["Inter", "serif"],
            Kosugi: ["Kosugi Maru", "serif"],
         },
      },
   },
   plugins: [
      require("tailwind-scrollbar"), // Include the scrollbar plugin first
      function ({ addUtilities }) {
         // Add custom text shadow utilities
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
