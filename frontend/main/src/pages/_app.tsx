import '@/styles/globals.css';
import { DefaultSeo } from 'next-seo';
import { config } from '@/config/facebook';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';

if (process.env.NODE_ENV === 'production') {
  const LogRocket = require('logrocket');
  const setupLogRocketReact = require('logrocket-react');

  if (typeof window !== 'undefined') {
    LogRocket.init('qlm7wr/codingcatdev');
    // plugins should also only be initialized when in the browser
    setupLogRocketReact(LogRocket);
  }
}

const FirebaseProvider = dynamic<any>(
  () =>
    import('@/components/firebase/wrappers').then(
      (mod) => mod.FirebaseProvider
    ),
  {
    ssr: false,
  }
);

const FirebaseAuthProvider = dynamic<any>(
  () =>
    import('@/components/firebase/wrappers').then(
      (mod) => mod.FirebaseAuthProvider
    ),
  {
    ssr: false,
  }
);

const FirebaseFirestoreProvider = dynamic<any>(
  () =>
    import('@/components/firebase/wrappers').then(
      (mod) => mod.FirebaseFirestoreProvider
    ),
  {
    ssr: false,
  }
);

const FirebaseFunctionsProvider = dynamic<any>(
  () =>
    import('@/components/firebase/wrappers').then(
      (mod) => mod.FirebaseFunctionsProvider
    ),
  {
    ssr: false,
  }
);

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <DefaultSeo
        title="CodingCatDev | Purrfect Web Tutorials"
        description="Codingcat.dev is where you can find all the Purrfect Web Tutorials that you will ever need!"
        canonical="https://codingcat.dev/"
        facebook={{
          appId: config.appId || '',
        }}
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: 'https://codingcat.dev/',
          title: 'CodingCatDev | Purrfect Web Tutorials',
          description:
            'Codingcat.dev is where you can find all the Purrfect Web Tutorials that you will ever need!',
          site_name: 'CodingCatDev',
          images: [
            {
              url: 'https://media.codingcat.dev/image/upload/c_thumb,g_face,w_1200,h_630/dev-codingcatdev-photo/v60h88eohd7ufghkspgo.png',
              width: 1200,
              height: 630,
              alt: 'AJ Logo Black Cat Face with CodingCat.dev Domain',
            },
            {
              url: 'https://media.codingcat.dev/image/upload/dev-codingcatdev-photo/v60h88eohd7ufghkspgo.png',
            },
          ],
        }}
        twitter={{
          handle: '@CodingCatDev',
          site: '@CodingCatDev',
          cardType: 'summary_large_image',
        }}
      />
      <FirebaseProvider>
        <FirebaseAuthProvider>
          <FirebaseFirestoreProvider>
            <FirebaseFunctionsProvider>
              <Component {...pageProps} />
            </FirebaseFunctionsProvider>
          </FirebaseFirestoreProvider>
        </FirebaseAuthProvider>
      </FirebaseProvider>
    </>
  );
}

export default MyApp;
