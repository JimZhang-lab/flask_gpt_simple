/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./web/static/js/*.{js}", "./web/templates/*.html"],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography"),,require('daisyui'),
  ],
}