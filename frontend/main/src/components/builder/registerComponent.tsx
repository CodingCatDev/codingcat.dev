import { Builder, withChildren } from '@builder.io/react';

import AJAlt from '@/components/global/icons/AJAlt';
import AJHeartAlt from '@/components/global/icons/AJHeartAlt';
import AJHeadphones from '@/components/global/icons/AJHeadphones';
import KCAlt from '@/components/global/icons/KCAlt';
import BreakBarLeft from '@/components/home/BreakBarLeft';
import {
  ReactLogo,
  AngularLogo,
  VueLogo,
  SvelteLogo,
  CssLogo,
  HtmlLogo,
} from '@/components/global/icons/VendorLogos';
import Courses from '@/components/global/icons/nav/Courses';
import Tutorials from '@/components/global/icons/nav/Tutorials';
import Podcasts from '@/components/global/icons/nav/Podcasts';
import Blog from '@/components/global/icons/nav/Blog';
import Community from '@/components/global/icons/nav/Community';
import NavLinks from '@/layout/NavLinks';
import Toggle from '@/components/global/icons/Toggle';
import SearchModal from '@/components/algolia/SearchModal';
import { AvatarMenuWrapper } from '@/layout/AppTopbar';
import Footer from '@/layout/Footer';
import PostsCards from '@/components/PostsCards';
import RecentPostsList from '@/components/RecentPostsList';

// import Facebook from '@/components/global/icons/socials/Facebook';
// import GitHub from '@/components/global/icons/socials/GitHub';
// import LinkedIn from '@/components/global/icons/socials/LinkedIn';
// import Mail from '@/components/global/icons/socials/Mail';
// import Medium from '@/components/global/icons/socials/Medium';
// import Twitter from '@/components/global/icons/socials/Twitter';
// import YouTube from '@/components/global/icons/socials/YouTube';

import SocialShare from '@/components/common/SocialShare';
import SponsorCards from '@/components/SponsorCards';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';

/*
 * Builder Drag and Drop Components
 */

Builder.registerComponent(
  dynamic(() =>
    import('@/components/global/icons/AJPrimary').then((res) => res as any)
  ),
  {
    name: 'AJPrimary',
    image:
      'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
    inputs: [
      {
        name: 'className',
        type: 'string',
      },
    ],
  }
);

Builder.registerComponent(
  dynamic(() =>
    import('@/components/global/icons/AJAlt').then((res) => res as any)
  ),
  {
    name: 'AJAlt',
    image:
      'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
    inputs: [
      {
        name: 'className',
        type: 'string',
      },
    ],
  }
);

Builder.registerComponent(
  dynamic(() =>
    import('@/components/global/icons/AJHeartAlt').then((res) => res as any)
  ),
  {
    name: 'AJHeartAlt',
    image:
      'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
    inputs: [
      {
        name: 'className',
        type: 'string',
      },
    ],
  }
);

Builder.registerComponent(
  dynamic(() =>
    import('@/components/global/icons/AJHeadphones').then((res) => res as any)
  ),
  {
    name: 'AJHeadphones',
    image:
      'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
    inputs: [
      {
        name: 'className',
        type: 'string',
      },
    ],
  }
);

Builder.registerComponent(
  dynamic(() =>
    import('@/components/global/icons/KCAlt').then((res) => res as any)
  ),
  {
    name: 'KCAlt',
    image:
      'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
    inputs: [
      {
        name: 'className',
        type: 'string',
      },
    ],
  }
);

Builder.registerComponent(
  withChildren(
    dynamic(() =>
      import('@/components/home/BreakBarLeft').then((res) => res as any)
    )
  ),
  {
    name: 'BreakBarLeft',
    canHaveChildren: true,
    image:
      'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
  }
);

Builder.registerComponent(
  dynamic(() =>
    import('@/components/global/icons/VendorLogos').then(
      (res) => res.ReactLogo as any
    )
  ),
  {
    name: 'ReactLogo',
    image:
      'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
    inputs: [
      {
        name: 'className',
        type: 'string',
      },
    ],
  }
);

Builder.registerComponent(
  dynamic(() =>
    import('@/components/global/icons/VendorLogos').then(
      (res) => res.AngularLogo as any
    )
  ),
  {
    name: 'AngularLogo',
    image:
      'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
    inputs: [
      {
        name: 'className',
        type: 'string',
      },
    ],
  }
);

Builder.registerComponent(
  dynamic(() =>
    import('@/components/global/icons/VendorLogos').then(
      (res) => res.VueLogo as any
    )
  ),
  {
    name: 'VueLogo',
    image:
      'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
    inputs: [
      {
        name: 'className',
        type: 'string',
      },
    ],
  }
);

Builder.registerComponent(
  dynamic(() =>
    import('@/components/global/icons/VendorLogos').then(
      (res) => res.SvelteLogo as any
    )
  ),
  {
    name: 'SvelteLogo',
    image:
      'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
    inputs: [
      {
        name: 'className',
        type: 'string',
      },
    ],
  }
);

Builder.registerComponent(
  dynamic(() =>
    import('@/components/global/icons/VendorLogos').then(
      (res) => res.CssLogo as any
    )
  ),
  {
    name: 'CssLogo',
    image:
      'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
    inputs: [
      {
        name: 'className',
        type: 'string',
      },
    ],
  }
);

Builder.registerComponent(
  dynamic(() =>
    import('@/components/global/icons/VendorLogos').then(
      (res) => res.HtmlLogo as any
    )
  ),
  {
    name: 'HtmlLogo',
    image:
      'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
    inputs: [
      {
        name: 'className',
        type: 'string',
      },
    ],
  }
);

Builder.registerComponent(
  dynamic(() =>
    import('@/components/global/icons/nav/Courses').then((res) => res as any)
  ),
  {
    name: 'Courses',
    image:
      'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
  }
);

Builder.registerComponent(
  dynamic(() =>
    import('@/components/global/icons/nav/Tutorials').then((res) => res as any)
  ),
  {
    name: 'Tutorials',
    image:
      'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
  }
);

Builder.registerComponent(
  dynamic(() =>
    import('@/components/global/icons/nav/Podcasts').then((res) => res as any)
  ),
  {
    name: 'Podcasts',
    image:
      'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
  }
);

Builder.registerComponent(
  dynamic(() =>
    import('@/components/global/icons/nav/Blog').then((res) => res as any)
  ),
  {
    name: 'Blog',
    image:
      'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
  }
);

Builder.registerComponent(
  dynamic(() =>
    import('@/components/global/icons/nav/Community').then((res) => res as any)
  ),
  {
    name: 'Community',
    image:
      'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
  }
);

Builder.registerComponent(
  dynamic(() => import('@/layout/NavLinks').then((res) => res as any)),
  {
    name: 'NavLinks',
    image:
      'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
  }
);

Builder.registerComponent(
  dynamic(() =>
    import('@/components/global/icons/Toggle').then((res) => res as any)
  ),
  {
    name: 'Toggle',
    image:
      'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
  }
);

Builder.registerComponent(
  dynamic(() =>
    import('@/components/algolia/SearchModal').then((res) => res as any)
  ),
  {
    name: 'SearchModal',
    image:
      'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
  }
);

Builder.registerComponent(
  dynamic(() =>
    import('@/layout/AppTopbar').then((res) => res.AvatarMenuWrapper as any)
  ),
  {
    name: 'AvatarMenuWrapper',
    image:
      'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
  }
);

Builder.registerComponent(
  dynamic(() => import('@/layout/Footer').then((res) => res as any)),
  {
    name: 'Footer',
    image:
      'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
    inputs: [
      {
        name: 'pageLinks',
        type: 'list',
        subFields: [
          { name: 'title', type: 'string', defaultValue: 'FTC Disclosure' },
          { name: 'slug', type: 'string', defaultValue: 'ftc-disclosure' },
        ],
      },
      {
        name: 'socialLinks',
        type: 'list',
        subFields: [
          { name: 'type', type: 'string', defaultValue: 'github' },
          {
            name: 'href',
            type: 'string',
            defaultValue: 'https://github.com/CodingCatDev',
          },
        ],
      },
    ],
  }
);

Builder.registerComponent(
  dynamic(() => import('@/components/PostsCards').then((res) => res as any)),
  {
    name: 'PostsCards',
    image:
      'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
    inputs: [
      {
        name: 'posts',
        type: 'object',
      },
    ],
  }
);

Builder.registerComponent(
  dynamic(() =>
    import('@/components/RecentPostsList').then((res) => res as any)
  ),
  {
    name: 'RecentPostsList',
    image:
      'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
    inputs: [
      {
        name: 'posts',
        type: 'object',
      },
      {
        name: 'title',
        type: 'text',
      },
    ],
  }
);

// Builder.registerComponent(Facebook, {
//   name: 'Facebook',
//   image:
//     'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
//   inputs: [
//     {
//       name: 'className',
//       type: 'string',
//     },
//   ],
// });

// Builder.registerComponent(GitHub, {
//   name: 'GitHub',
//   image:
//     'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
//   inputs: [
//     {
//       name: 'className',
//       type: 'string',
//     },
//   ],
// });

// Builder.registerComponent(LinkedIn, {
//   name: 'LinkedIn',
//   image:
//     'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
//   inputs: [
//     {
//       name: 'className',
//       type: 'string',
//     },
//   ],
// });

// Builder.registerComponent(Mail, {
//   name: 'Mail',
//   image:
//     'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
//   inputs: [
//     {
//       name: 'className',
//       type: 'string',
//     },
//   ],
// });

// Builder.registerComponent(Medium, {
//   name: 'Medium',
//   image:
//     'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
//   inputs: [
//     {
//       name: 'className',
//       type: 'string',
//     },
//   ],
// });

// Builder.registerComponent(Twitter, {
//   name: 'Twitter',
//   image:
//     'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
//   inputs: [
//     {
//       name: 'className',
//       type: 'string',
//     },
//   ],
// });

// Builder.registerComponent(YouTube, {
//   name: 'YouTube',
//   image:
//     'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
//   inputs: [
//     {
//       name: 'className',
//       type: 'string',
//     },
//   ],
// });

Builder.registerComponent(
  dynamic(() =>
    import('@/components/common/SocialShare').then((res) => res as any)
  ),
  {
    name: 'SocialShare',
    image:
      'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
    inputs: [
      {
        name: 'href',
        type: 'text',
      },
      {
        name: 'excerpt',
        type: 'text',
      },
      {
        name: 'title',
        type: 'text',
      },
    ],
  }
);

Builder.registerComponent(
  dynamic(() => import('@/components/SponsorCards').then((res) => res as any)),
  {
    name: 'SponsorCards',
    image:
      'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fd8328e4e1409459fbad3b0cdd1ae950b?quality=60&width=200&height=200',
    inputs: [
      {
        name: 'sponsors',
        type: 'list',
        subFields: [
          { name: 'company', type: 'string', defaultValue: 'Builder.io' },
          {
            name: 'description',
            type: 'string',
            defaultValue: 'Builder.io Rocks',
          },
          { name: 'url', type: 'string', defaultValue: 'https://builder.io' },
          {
            name: 'coverPhoto',
            type: 'object',
            subFields: [
              {
                name: 'public_id',
                type: 'string',
                defaultValue:
                  'main-codingcatdev-photo/sponsors/assets_YJIGb4i01jvw0SRdL5Bt_368e8511120948e4a69d274bc6d594ea',
              },
            ],
          },
        ],
      },
    ],
  }
);

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

Builder.registerComponent(Image, {
  name: 'NextImage',
  image:
    'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fc3c7040ad97b4ffeb0dbe3c85938e531?quality=60&width=200&height=200',
  inputs: [
    {
      name: 'src',
      type: 'text',
      required: true,
      defaultValue: 'ajonp-ajonp-com/authors/alex_headshot',
    },
    {
      name: 'layout',
      type: 'text',
      defaultValue: 'fixed',
    },
    {
      name: 'height',
      type: 'number',
      defaultValue: 50,
    },
    {
      name: 'width',
      type: 'number',
      defaultValue: 50,
    },
    {
      name: 'alt',
      type: 'text',
      defaultValue: 'An image description',
    },
    {
      name: 'className',
      type: 'text',
      defaultValue:
        'w-12 border-2 rounded-full border-primary-50 dark:border-primary-50',
    },
  ],
});
