/** @type {import('tailwindcss').Config} */
const { fontFamily } = require("tailwindcss/defaultTheme")

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/line-clamp"),
  ],
  theme: {
    extend: {
      colors: {
        course: "#66b8ff",
        coursebg: "#ddefff",
        guideline: "#f1f5f9a",
        maintext: "#333",
        "n-50": "#E5F2FF",
        primary: "#0099D9",
        slack: "#4A154B",
      },
      fontFamily: {
        inter: ["var(--font-inter)"],
        notojp: ["var(--font-noto-sans-jp)"],
        sans: ["var(--font-inter)", "var(--font-noto-sans-jp)", ...fontFamily.sans],
      },
      padding: {
        slide: "56.25%",
        slidet: "35px",
      },
    },
  },
}
