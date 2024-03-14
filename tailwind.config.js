/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--p) / <alpha-value>)',
        accent: 'rgb(var(--a) / <alpha-value>)',
        neutral: 'rgb(var(--n) / <alpha-value>)',
        'neutral-content': 'rgb(var(--nc) / <alpha-value>)',
      },
    },
  },
  plugins: [
    require("daisyui"),
    require("@tailwindcss/typography"),
  ],
  daisyui: {
    styled: true,
    themes: [
      {
        "parramattaNorth": {
          "--p": "243 99 27",   // Primary color (RGB values)
          "--a": "0 38 100",    // Accent color (RGB values)
          "--n": "34 39 43",    // Neutral color (RGB values)
          "--nc": "242 242 242", // Neutral content color (RGB values)
        }
      }
    ]
  }
};