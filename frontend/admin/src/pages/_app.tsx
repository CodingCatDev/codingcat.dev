import '../styles/globals.css';
import Head from 'next/head';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { CacheProvider } from '@emotion/react';
import CssBaseline from '@material-ui/core/CssBaseline';
import createCache from '@emotion/cache';
import { useState } from 'react';

export const cache = createCache({ key: 'css', prepend: true });

function MyApp({ Component, pageProps }: { Component: any; pageProps: any }) {
  const [darkMode, setDarkMode] = useState(true);
  const mode = darkMode ? 'dark' : 'light';
  const background = darkMode
    ? { paper: '#424242', default: '#303030' }
    : { paper: '#fff', default: '#EFE4F4' };

  const darkTheme = createMuiTheme({
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '@global': {
            a: {
              color: darkMode ? 'white' : '#5e1185',
            },
            '.editor-toolbar': {
              backgroundColor: background.paper,
            },
            '.CodeMirror': {
              backgroundColor: background.paper,
              color: darkMode ? 'white' : 'black',
            },
            '.editor-preview-side': {
              backgroundColor: background.paper,
            },
          },
        },
      },
    },
    palette: {
      mode,
      primary: {
        main: '#5e1185',
      },
      secondary: {
        main: '#D11663',
      },
      background,
    },
  });
  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  return (
    <>
      <CacheProvider value={cache}>
        <Head>
          <title>CodingCatDev</title>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={darkTheme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Component
            {...pageProps}
            handleThemeChange={handleThemeChange}
            darkMode={darkMode}
          />
        </ThemeProvider>
      </CacheProvider>
    </>
  );
}

export default MyApp;
