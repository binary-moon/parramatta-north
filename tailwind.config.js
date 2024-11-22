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
            iframe: {
              display: "block",
              width: "100%",
              margin: "16px 0",
            },
            h6: {
              fontSize: "14px",
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
              color: "#146CFD",
              fontWeight: "bold",
            },
            img: {
              display: "block",
              width: "100%",
              margin: "16px 0",
            },
            iframe: {
              display: "block",
              width: "100%",
              margin: "16px 0",
            },
            h6: {
              fontSize: "14px",
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
          primary: "#146CFD",
          accent: "#002664",
          neutral: "#22272B",
          "neutral-content": "#F2F2F2",
          "base-content": "#22272B",
        },
      },
    ],
  },
};
