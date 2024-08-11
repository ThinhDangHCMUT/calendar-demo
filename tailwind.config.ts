/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "light-blue": "#5684AE",
        "dark-blue": "#0F4C81",
        "light-orange": "#FFE4C8",
        "dark-orange": "#F9BE81",
        "calendar-tile": "#E4F6ED",
      },
    },
  },
  plugins: [],
  corePlugins: {},
};
