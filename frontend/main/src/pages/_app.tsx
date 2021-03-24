import '@/styles/globals.css';
import { DefaultSeo } from 'next-seo';
import { config } from '@/config/facebook';
import TagManager from 'react-gtm-module';
import { useEffect } from 'react';
import { config as gtmConfig } from '@/config/gtm';

function MyApp({
  Component,
  pageProps,
}: {
  Component: any;
  pageProps: any;
}): JSX.Element {
  useEffect(() => {
    if (gtmConfig && gtmConfig.id) {
      TagManager.initialize({ gtmId: gtmConfig.id });
    }
  }, []);
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
              url:
                'https://media.codingcat.dev/image/upload/c_thumb,g_face,w_800,h_600/dev-codingcatdev-photo/v60h88eohd7ufghkspgo.png',
              width: 800,
              height: 600,
              alt: 'AJ Logo Black Cat Face with CodingCat.dev Domain',
            },
            {
              url:
                'https://media.codingcat.dev/image/upload/c_thumb,g_face,w_900,h_800/dev-codingcatdev-photo/v60h88eohd7ufghkspgo.png',
              width: 900,
              height: 800,
              alt: 'AJ Logo Black Cat Face with CodingCat.dev Domain',
            },
            {
              url:
                'https://media.codingcat.dev/image/upload/dev-codingcatdev-photo/v60h88eohd7ufghkspgo.png',
            },
          ],
        }}
        twitter={{
          handle: '@CodingCatDev',
          site: '@CodingCatDev',
          cardType: 'summary_large_image',
        }}
      />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
