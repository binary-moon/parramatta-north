/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      typography: {
        "parramatta-north": {
          css: {
            p: {
              color: "#22272B",
            },
            li: {
              color: "#22272B",
            },
            "li::marker": {
              color: "#22272B",
            },
            a: {
              color: "#F3631B",
              fontWeight: "bold",
            },
            img: {
              display: "block",
              width: "100%",
              margin: "16px 0",
            },
          },
        },
        rgb: {
          css: {
            p: {
              color: "#22272B",
            },
            li: {
              color: "#22272B",
            },
            "li::marker": {
              color: "#22272B",
            },
            a: {
              color: "#2E808E",
              fontWeight: "bold",
            },
            img: {
              display: "block",
              width: "100%",
              margin: "16px 0",
            },
          },
        },
      },
    },
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
  daisyui: {
    themes: [
      {
        parramattaNorth: {
          primary: "#F3631B",
          accent: "#002664",
          neutral: "#22272B",
          "neutral-content": "#F2F2F2",
          "base-content": "#22272B",
        },
      },
      {
        rgb: {
          primary: "#2E808E",
          accent: "#002664",
          neutral: "#22272B",
          "neutral-content": "#F2F2F2",
          "base-content": "#22272B",
        },
      },
    ],
  },
};
