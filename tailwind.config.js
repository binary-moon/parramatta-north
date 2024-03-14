/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
  daisyui: {
    themes: [
      {
        "parramattaNorth": {
          "primary": "#F3631B",
          "accent": "#002664",
          "neutral": "#22272B",
          "neutral-content": "#F2F2F2",
        }
      }
    ]
  }
}