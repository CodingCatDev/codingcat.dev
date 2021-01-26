module.exports = {
  // or 'media' or 'class'
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
      basics: {
        50: '#FBFBFB',
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
      primary: {
        50: '#EFE4F4',
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
      secondary: {
        50: '#FDF3F7',
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
      error: {
        50: '#FFEBEC',
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
      success: {
        50: '#F5FDF9',
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
      yellow: {
        50: '#FFC700',
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
      gridTemplateRows: {
        sidebar: '100px 1fr 100px',
        search: '38px 1fr 68px',
      },
      height: {
        35: '35px',
        500: '500px',
        610: '610px',
      },
      minHeight: {
        '1/2': '50%',
        300: '300px',
        1080: '1080px',
      },
      maxWidth: {
        '8xl': '2000px',
      },
      screens: {
        '3xl': '2000px',
      },
      width: {
        35: '35px',
        80: '80vw',
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
};
