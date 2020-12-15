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
    extend: {
      boxShadow: {
        outline: '0 0 0 3px #FC5390',
      },
      colors: {
        'ccd-basics': {
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
        'ccd-purples': {
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
        'ccd-reds': {
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
        'ccd-yellows': {
          '050': '#FFFCF6',
          100: '#FEFAED',
          200: '#FEF1D1',
          300: '#FDE9B5',
          400: '#FBD97E',
          500: '#F9C846',
          600: '#E0B43F',
          700: '#CDA438',
          800: '#BA9532',
          900: '#9A7B28',
        },
        'ccd-blues': {
          '050': '#F2FEFF',
          100: '#E6FDFF',
          200: '#BFF9FE',
          300: '#FDE9B5',
          400: '#4DEFFD',
          500: '#00E8FC',
          600: '#00D1E3',
          700: '#008B97',
          800: '#00464C',
          900: '#03272B',
        },
        'ccd-greens': {
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
        'ccd-lime-greens': {
          '050': '#FCFEF9',
          100: '#FAFEF2',
          200: '#F2FCDF',
          300: '#E9F9CC',
          400: '#D9F5A6',
          500: '#C9F180',
          600: '#B5D973',
          700: '#86A949',
          800: '#637C35',
          900: '#42561E',
        },
        'ccd-pinks': {
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

        'ccd-social': {
          twitter: '#1da1f1',
          discord: '#7289da',
          github: '#23292d',
          youtube: '#ff0000',
          slack: '#e01e5a',
          linkedin: '#1173b0',
          facebook: '#4166b2',
          instagram: '#f00574',
          hackernews: '#ff6500',
          reddit: '#ff4500',
        },
      },
      gridTemplateColumns: {
        sidebar: '1fr minmax(200px, 25%)',
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
