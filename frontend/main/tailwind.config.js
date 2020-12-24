module.exports = {
  purge: ['./src/**/*.{js,mdx,jsx,tsx}', './next.config.js'],
  darkMode: false, // or 'media' or 'class'
  variants: {
    extend: {
      opacity: ['disabled'],
    },
  },
  theme: {
    fontFamily: {
      sans: ['nunito', 'ui-sans-serif'],
      serif: ['nunito', 'ui-serif'],
      mono: ['nunito', 'ui-monospace'],
      heading: ['Henny Penny', 'nunito', 'ui-monospace'],
      light: ['nunito-light', 'ui-sans-serif'],
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000',
      white: '#fff',
      gray: {
        '050': '#FBFBFB',
        100: '#F1F1F1',
        200: '#DCDCDC',
        300: '#B3AFB5',
        400: '#7F7982',
        500: '#6E6B70',
        600: '#333034',
        700: '#1E1D1F',
        800: '#141214',
        900: '#171717',
      },
      purple: {
        '050': '#EFE4F4',
        100: '#D7BCE3',
        200: '#BD8FD1',
        300: '#A362BE',
        400: '#8F41B0',
        500: '#7B1FA2',
        600: '#731B9A',
        700: '#681790',
        800: '#5E1286',
        900: '#4B0A75',
      },
      red: {
        '050': '#FFEBEC',
        100: '#FFCDCF',
        200: '#FFACAF',
        300: '#FF8B8F',
        400: '#FF7277',
        500: '#FF595F',
        600: '#FF5157',
        700: '#FF484D',
        800: '#FF3E43',
        900: '#FF2E32',
      },
      green: {
        '050': '#F5FDF9',
        100: '#EAFBF2',
        200: '#CBF5E0',
        300: '#ABEFCD',
        400: '#6CE4A7',
        500: '#2DD881',
        600: '#29C274',
        700: '#1B824D',
        800: '#14613A',
        900: '#0E462A',
      },
      pink: {
        '050': '#FDF3F7',
        100: '#FBE6EF',
        200: '#F4C1D6',
        300: '#EE9CBE',
        400: '#E1528D',
        500: '#D11663',
        600: '#BC2261',
        700: '#9D1948',
        800: '#81133B',
        900: '#7B042F',
      },
    },
    extend: {
      boxShadow: {
        outline: '0 0 0 3px #FC5390',
      },
      gridTemplateColumns: {
        sidebar: '1fr minmax(200px, 25%)',
        settings: 'minmax(200px, 20%) 1fr',
        fit: 'repeat(auto-fit, minmax(250px, 1fr))',
        hero: '1.5fr 2fr',
      },
      height: {
        35: '35px',
      },
      width: {
        35: '35px',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#171717',
            a: {
              color: '#4B0A75',
              '&:hover': {
                color: '#D11663',
              },
            },
            h1: {
              fontFamily: 'nunito',
            },
            h2: {
              fontFamily: 'nunito',
            },
            h3: {
              fontFamily: 'nunito',
            },
            h4: {
              fontFamily: 'nunito',
            },
            h5: {
              fontFamily: 'nunito',
            },
            h6: {
              fontFamily: 'nunito',
            },
          },
        },
      },
    },
    customForms: (theme) => ({
      default: {
        'input, textarea, multiselect': {
          // backgroundColor: theme('colors.gray.200'),
          // color: theme('colors.gray.200'),
        },
      },
    }),
  },
  plugins: [
    require('@tailwindcss/typography'),
    // require('@tailwindcss/forms'),
    require('@tailwindcss/custom-forms'),
  ],
};
