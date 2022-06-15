module.exports = {
  presets: [require('./ccd-preset.js')],
  content: ['./src/**/*.{js,mdx,jsx,tsx}', './next.config.js'],
  plugins: [require('@tailwindcss/forms')],
};
