import '@/styles/globals.css';

import { amplifyConfig } from '@codingcatdev/shared';
amplifyConfig();

function MyApp({ Component, pageProps }: { Component: any; pageProps: any }) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
