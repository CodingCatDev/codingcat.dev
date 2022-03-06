import '@/styles/globals.css';
import { DefaultSeo } from 'next-seo';
import { config } from '@/config/facebook';
import type { AppProps } from 'next/app';

import { builder } from '@builder.io/react';
import { config as builderConfig } from '@/config/builder';
import { useEffect, useState } from 'react';
import '@/components/builder/registerComponent';

builder.init(builderConfig.publicApiKey);

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const [isBuilder, setIsBuilder] = useState(false);
  useEffect(() => {
    if (builder.editingModel) {
      console.log('Adding Builder.io components');
      setIsBuilder(true);
    }
  }, []);

  return (
    <>
      {/* {isBuilder && <RegisterComponent />} */}
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
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
