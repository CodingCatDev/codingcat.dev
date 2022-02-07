import '@/styles/globals.css';
import { DefaultSeo } from 'next-seo';
import { config } from '@/config/facebook';
import type { AppProps } from 'next/app';

import { builder, Builder, withChildren } from '@builder.io/react';
import { config as builderConfig } from '@/config/builder';

builder.init(builderConfig.publicApiKey);

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
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

//Builder Drag and Drop Components

import AJPrimary from '@/components/global/icons/AJPrimary';
Builder.registerComponent(AJPrimary, {
  name: 'AJPrimary',
  image:
    'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
  inputs: [
    {
      name: 'className',
      type: 'string',
    },
  ],
});

import AJAlt from '@/components/global/icons/AJAlt';
Builder.registerComponent(AJAlt, {
  name: 'AJAlt',
  image:
    'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
  inputs: [
    {
      name: 'className',
      type: 'string',
    },
  ],
});

import AJHeartAlt from '@/components/global/icons/AJHeartAlt';
Builder.registerComponent(AJHeartAlt, {
  name: 'AJHeartAlt',
  image:
    'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
  inputs: [
    {
      name: 'className',
      type: 'string',
    },
  ],
});

import AJHeadphones from '@/components/global/icons/AJHeadphones';
Builder.registerComponent(AJHeadphones, {
  name: 'AJHeadphones',
  image:
    'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
  inputs: [
    {
      name: 'className',
      type: 'string',
    },
  ],
});

import KCAlt from '@/components/global/icons/KCAlt';
Builder.registerComponent(KCAlt, {
  name: 'KCAlt',
  image:
    'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
  inputs: [
    {
      name: 'className',
      type: 'string',
    },
  ],
});

import BreakBarLeft from '@/components/home/BreakBarLeft';
Builder.registerComponent(withChildren(BreakBarLeft), {
  name: 'BreakBarLeft',
  canHaveChildren: true,
  image:
    'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
});

import {
  ReactLogo,
  AngularLogo,
  VueLogo,
  SvelteLogo,
  CssLogo,
  HtmlLogo,
} from '@/components/global/icons/VendorLogos';

Builder.registerComponent(ReactLogo, {
  name: 'ReactLogo',
  image:
    'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
  inputs: [
    {
      name: 'className',
      type: 'string',
    },
  ],
});

Builder.registerComponent(AngularLogo, {
  name: 'AngularLogo',
  image:
    'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
  inputs: [
    {
      name: 'className',
      type: 'string',
    },
  ],
});

Builder.registerComponent(VueLogo, {
  name: 'VueLogo',
  image:
    'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
  inputs: [
    {
      name: 'className',
      type: 'string',
    },
  ],
});

Builder.registerComponent(SvelteLogo, {
  name: 'SvelteLogo',
  image:
    'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
  inputs: [
    {
      name: 'className',
      type: 'string',
    },
  ],
});

Builder.registerComponent(CssLogo, {
  name: 'CssLogo',
  image:
    'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
  inputs: [
    {
      name: 'className',
      type: 'string',
    },
  ],
});

Builder.registerComponent(HtmlLogo, {
  name: 'HtmlLogo',
  image:
    'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
  inputs: [
    {
      name: 'className',
      type: 'string',
    },
  ],
});

import Courses from '@/components/global/icons/nav/Courses';
Builder.registerComponent(Courses, {
  name: 'Courses',
  image:
    'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
});

import Tutorials from '@/components/global/icons/nav/Tutorials';
Builder.registerComponent(Tutorials, {
  name: 'Tutorials',
  image:
    'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
});

import Podcasts from '@/components/global/icons/nav/Podcasts';
Builder.registerComponent(Podcasts, {
  name: 'Podcasts',
  image:
    'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
});

import Blog from '@/components/global/icons/nav/Blog';
Builder.registerComponent(Blog, {
  name: 'Blog',
  image:
    'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
});

import Community from '@/components/global/icons/nav/Community';
Builder.registerComponent(Community, {
  name: 'Community',
  image:
    'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
});

import NavLinks from '@/layout/NavLinks';
Builder.registerComponent(NavLinks, {
  name: 'NavLinks',
  image:
    'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
});

import Toggle from '@/components/global/icons/Toggle';
Builder.registerComponent(Toggle, {
  name: 'Toggle',
  image:
    'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
});

import SearchModal from '@/components/algolia/SearchModal';
Builder.registerComponent(SearchModal, {
  name: 'SearchModal',
  image:
    'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
});

import { AvatarMenuWrapper } from '@/layout/AppTopbar';
Builder.registerComponent(AvatarMenuWrapper, {
  name: 'AvatarMenuWrapper',
  image:
    'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
});

import Footer from '@/layout/Footer';
Builder.registerComponent(Footer, {
  name: 'Footer',
  image:
    'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
});

// Customized Components
import Link from 'next/link';
const ccdLink = ({ href, children }: { href: string; children: any }) => (
  <Link href={href}>
    <a>{children}</a>
  </Link>
);
Builder.registerComponent(withChildren(ccdLink), {
  name: 'NextLink',
  canHaveChildren: true,
  image:
    'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fc3c7040ad97b4ffeb0dbe3c85938e531?quality=60&width=200&height=200',
  inputs: [
    {
      name: 'href',
      type: 'string',
      required: true,
      defaultValue: '/',
    },
  ],
});
