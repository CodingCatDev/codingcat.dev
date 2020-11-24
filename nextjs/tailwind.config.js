module.exports = {
  purge: ["./pages/**/*.tsx", "./components/**/*.tsx"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ["nunito"],
      serif: ["nunito"],
      mono: ["nunito"],
    },
    extend: {
      colors: {
        "ccd-primary": {
          "050": "#EFE4F4",
          100: "#D7BCE3",
          200: "#BD8FD1",
          300: "#A362BE",
          400: "#8F41B0",
          500: "#7B1FA2",
          600: "#731B9A",
          700: "#681790",
          800: "#5E1286",
          900: "#4B0A75",
        },
        "ccd-secondary": {
          "050": "#FFEBEC",
          100: "#FFCDCF",
          200: "#FFACAF",
          300: "#FF8B8F",
          400: "#FF7277",
          500: "#FF595F",
          600: "#FF5157",
          700: "#FF484D",
          800: "#FF3E43",
          900: "#FF2E32",
        },
        "ccd-social": {
          twitter: "#1da1f1",
          discord: "#7289da",
          github: "#23292d",
          youtube: "#ff0000",
          slack: "#e01e5a",
          linkedin: "#1173b0",
          facebook: "#4166b2",
          instagram: "#f00574",
          hackernews: "#ff6500",
          reddit: "#ff4500",
        },
      },
    },
    // typography: (theme) => ({
    //   default: {
    //     css: {
    //       "h1,\nh2,\nh3,\nh4,\nh5,\nh6": {
    //         margin: "1.5rem 0 1rem 0",
    //         fontFamily: "nunito",
    //         fontWeight: "normal",
    //         lineHeight: 1.2,
    //         color: theme('colors.ccd-primary.700'),
    //         "&:first-child": { marginTop: "0" }
    //       },
    //       h1: { fontSize: "2.5rem" },
    //       h2: { fontSize: "2rem" },
    //       h3: { fontSize: "1.75rem" },
    //       h4: { fontSize: "1.5rem" },
    //       h5: { fontSize: "1.25rem" },
    //       h6: { fontSize: "1rem" },
    //       mark: {
    //         background: "#fff8e1",
    //         padding: "0.25rem 0.4rem",
    //         borderRadius: "$borderRadius",
    //         fontFamily: "monospace"
    //       },
    //       blockquote: {
    //         margin: "1rem 0",
    //         padding: "0 2rem",
    //         borderLeft: "4px solid #90a4ae"
    //       },
    //       hr: {
    //         borderTop: "solid $dividerColor",
    //         borderWidth: "1px 0 0 0",
    //         margin: "1rem 0"
    //       },
    //       p: {
    //         margin: "0 0 1rem 0",
    //         lineHeight: 1.5,
    //       }
    //     },
    //   },
    // }),
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
