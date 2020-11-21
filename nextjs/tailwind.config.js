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
    transform: {
      // defaults to this value
      none: "none",
    },
    transformOrigin: {
      // defaults to these values
      t: "top",
      tr: "top right",
      r: "right",
      br: "bottom right",
      b: "bottom",
      bl: "bottom left",
      l: "left",
      tl: "top left",
    },
    translate: {
      // defaults to {}
      "1/2": "50%",
      full: "100%",
      "right-up": ["100%", "-100%"],
      "3d": ["40px", "-60px", "-130px"],
    },
    scale: {
      // defaults to {}
      90: "0.9",
      100: "1",
      110: "1.1",
      "-100": "-1",
      "stretched-x": ["2", "0.5"],
      "stretched-y": ["0.5", "2"],
      "3d": ["0.5", "1", "2"],
    },
    rotate: {
      // defaults to {}
      90: "90deg",
      180: "180deg",
      270: "270deg",
      "3d": ["0", "1", "0.5", "45deg"],
    },
    skew: {
      // defaults to {}
      "-5": "-5deg",
      5: "5deg",
    },
    perspective: {
      // defaults to {}
      none: "none",
      250: "250px",
      500: "500px",
      750: "750px",
      1000: "1000px",
    },
    perspectiveOrigin: {
      // defaults to these values
      t: "top",
      tr: "top right",
      r: "right",
      br: "bottom right",
      b: "bottom",
      bl: "bottom left",
      l: "left",
      tl: "top left",
    },
  },
  variants: {
    // all the following default to ['responsive']
    transform: ["responsive"],
    transformOrigin: ["responsive"],
    translate: ["responsive"],
    scale: ["responsive"],
    rotate: ["responsive"],
    skew: ["responsive"],
    perspective: ["responsive"],
    perspectiveOrigin: ["responsive"],
    transformStyle: ["responsive"],
    backfaceVisibility: ["responsive"],
    transformBox: ["responsive"],
  },
  plugins: [
    require("tailwindcss-transforms")({
      "3d": false, // defaults to false
    }),
    require("tailwindcss-animatecss"),
  ],
};
