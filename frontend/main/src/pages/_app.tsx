import '@/styles/globals.css';

import Amplify from 'aws-amplify';
// eslint-disable-next-line no-restricted-imports
import config from '../../../amplify/aws-exports';

if (typeof window !== 'undefined') {
  config.oauth.redirectSignIn = `${window.location.origin}/`;
  config.oauth.redirectSignOut = `${window.location.origin}/`;
}

Amplify.configure(config);

function MyApp({ Component, pageProps }: { Component: any; pageProps: any }) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
