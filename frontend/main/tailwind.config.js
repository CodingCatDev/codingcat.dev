module.exports = {
  darkMode: 'class',
  presets: [require('./ccd-preset.js')],
  purge: ['./src/**/*.{js,mdx,jsx,tsx}', './next.config.js'],
  variants: {
    extend: {
      opacity: ['disabled'],
      backgroundOpacity: ['dark'],
    },
  },

  plugins: [
    require('@tailwindcss/typography'),
    // require('@tailwindcss/forms'),
    require('@tailwindcss/custom-forms'),
    require('nightwind'),
  ],
};
