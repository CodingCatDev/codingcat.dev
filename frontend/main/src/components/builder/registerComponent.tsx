import { Builder, withChildren } from '@builder.io/react';

// import Facebook from '@/components/global/icons/socials/Facebook';
// import GitHub from '@/components/global/icons/socials/GitHub';
// import LinkedIn from '@/components/global/icons/socials/LinkedIn';
// import Mail from '@/components/global/icons/socials/Mail';
// import Medium from '@/components/global/icons/socials/Medium';
// import Twitter from '@/components/global/icons/socials/Twitter';
// import YouTube from '@/components/global/icons/socials/YouTube';

import Link from 'next/link';
import Image, { ImageProps } from 'next/image';
import dynamic from 'next/dynamic';
import { Cloudinary } from '@/models/media.model';

/*
 * Builder Drag and Drop Components
 */

Builder.registerComponent(
  dynamic(
    () =>
      import('@/components/code-block').then(
        (res) => res.CodeBlockComponent as any
      ),
    { ssr: false }
  ),
  {
    name: 'Code Block',
    defaultStyles: {
      paddingLeft: '20px',
      borderRadius: '5px',
      overflow: 'clip',
    },
    inputs: [
      {
        name: 'code',
        type: 'longText',
        defaultValue: 'const incr = num => num + 1',
      },
      {
        name: 'language',
        type: 'string',
        defaultValue: 'javascript',
      },
      {
        name: 'dark',
        type: 'boolean',
        defaultValue: false,
      },
    ],
  }
);

Builder.registerComponent(
  dynamic(() =>
    import('@/components/global/icons/AJPrimary').then((res) => res as any)
  ),
  {
    name: 'AJPrimary',
    image:
      'https://media.codingcat.dev/image/upload/f_auto,q_auto,w_200/main-codingcatdev-photo/builder_io_icons/AJ_Primary.png',
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
      'https://media.codingcat.dev/image/upload/f_auto,q_auto,w_200/main-codingcatdev-photo/builder_io_icons/AJ_Primary.png',
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
      'https://media.codingcat.dev/image/upload/f_auto,q_auto,w_200/main-codingcatdev-photo/builder_io_icons/AJ_Heart_Alt.png',
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
      'https://media.codingcat.dev/image/upload/f_auto,q_auto,w_200/main-codingcatdev-photo/builder_io_icons/AJHeadphones_Primary.png',
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
      'https://media.codingcat.dev/image/upload/f_auto,q_auto,w_200/main-codingcatdev-photo/builder_io_icons/KC_Alt.png',
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
      'https://media.codingcat.dev/image/upload/f_auto,q_auto,w_200/main-codingcatdev-photo/builder_io_icons/breaker_bar_left.png',
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
      'https://media.codingcat.dev/image/upload/f_auto,q_auto,w_200/main-codingcatdev-photo/builder_io_icons/reactjs.png',
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
      'https://media.codingcat.dev/image/upload/f_auto,q_auto,w_200/main-codingcatdev-photo/builder_io_icons/angular.png',
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
      'https://media.codingcat.dev/image/upload/f_auto,q_auto,w_200/main-codingcatdev-photo/builder_io_icons/vuejs.png',
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
      'https://media.codingcat.dev/image/upload/f_auto,q_auto,w_200/main-codingcatdev-photo/builder_io_icons/svelte.png',
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
      'https://media.codingcat.dev/image/upload/f_auto,q_auto,w_200/main-codingcatdev-photo/builder_io_icons/CSS-Logo.png',
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
      'https://media.codingcat.dev/image/upload/f_auto,q_auto,w_200/main-codingcatdev-photo/builder_io_icons/HTML_Logo.png',
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
      'https://media.codingcat.dev/image/upload/f_auto,q_auto,w_200/main-codingcatdev-photo/builder_io_icons/courses.png',
  }
);

Builder.registerComponent(
  dynamic(() =>
    import('@/components/global/icons/nav/Tutorials').then((res) => res as any)
  ),
  {
    name: 'Tutorials',
    image:
      'https://media.codingcat.dev/image/upload/f_auto,q_auto,w_200/main-codingcatdev-photo/builder_io_icons/tutorials.png',
  }
);

Builder.registerComponent(
  dynamic(() =>
    import('@/components/global/icons/nav/Podcasts').then((res) => res as any)
  ),
  {
    name: 'Podcasts',
    image:
      'https://media.codingcat.dev/image/upload/f_auto,q_auto,w_200/main-codingcatdev-photo/builder_io_icons/podcasts.png',
  }
);

Builder.registerComponent(
  dynamic(() =>
    import('@/components/global/icons/nav/Blog').then((res) => res as any)
  ),
  {
    name: 'Blog',
    image:
      'https://media.codingcat.dev/image/upload/f_auto,q_auto,w_200/main-codingcatdev-photo/builder_io_icons/blog.png',
  }
);

Builder.registerComponent(
  dynamic(() =>
    import('@/components/global/icons/nav/Community').then((res) => res as any)
  ),
  {
    name: 'Community',
    image:
      'https://media.codingcat.dev/image/upload/f_auto,q_auto,w_200/main-codingcatdev-photo/builder_io_icons/community.png',
  }
);

Builder.registerComponent(
  dynamic(() => import('@/layout/NavLinks').then((res) => res as any)),
  {
    name: 'NavLinks',
    image:
      'https://media.codingcat.dev/image/upload/f_auto,q_auto,w_200/main-codingcatdev-photo/builder_io_icons/NavLinks.png',
  }
);

Builder.registerComponent(
  dynamic(() =>
    import('@/components/global/icons/Toggle').then((res) => res as any)
  ),
  {
    name: 'Toggle',
    image:
      'https://media.codingcat.dev/image/upload/f_auto,q_auto,w_200/main-codingcatdev-photo/builder_io_icons/toggle.png',
  }
);

Builder.registerComponent(
  dynamic(() =>
    import('@/components/algolia/SearchModal').then((res) => res as any)
  ),
  {
    name: 'SearchModal',
    image:
      'https://media.codingcat.dev/image/upload/f_auto,q_auto,w_200/main-codingcatdev-photo/builder_io_icons/search.png',
  }
);

Builder.registerComponent(
  dynamic(() =>
    import('@/layout/AppTopbar').then((res) => res.AvatarMenuWrapper as any)
  ),
  {
    name: 'AvatarMenuWrapper',
    image:
      'https://media.codingcat.dev/image/upload/f_auto,q_auto,w_200/main-codingcatdev-photo/builder_io_icons/avatar.png',
  }
);

Builder.registerComponent(
  dynamic(() => import('@/layout/Footer').then((res) => res as any)),
  {
    name: 'Footer',
    image:
      'https://media.codingcat.dev/image/upload/f_auto,q_auto,w_200/main-codingcatdev-photo/builder_io_icons/Footer.png',
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
      'https://media.codingcat.dev/image/upload/f_auto,q_auto,w_200/main-codingcatdev-photo/builder_io_icons/business-card.png',
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
      'https://media.codingcat.dev/image/upload/f_auto,q_auto,w_200/main-codingcatdev-photo/builder_io_icons/list.png',
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
      'https://media.codingcat.dev/image/upload/f_auto,q_auto,w_200/main-codingcatdev-photo/builder_io_icons/social_share.png',
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
      'https://media.codingcat.dev/image/upload/f_auto,q_auto,w_200/main-codingcatdev-photo/builder_io_icons/Sponsor_Cards.png',
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

Builder.registerComponent(
  dynamic(() =>
    import('@/components/authors/Authors').then((res) => res as any)
  ),
  {
    name: 'Authors',
    image:
      'https://media.codingcat.dev/image/upload/f_auto,q_auto,w_200/main-codingcatdev-photo/builder_io_icons/Authors.png',
    inputs: [
      {
        name: 'authors',
        type: 'list',
      },
    ],
  }
);

Builder.registerComponent(
  dynamic(() =>
    import('@/components/CourseSections').then((res) => res as any)
  ),
  {
    name: 'CourseSections',
    image:
      'https://media.codingcat.dev/image/upload/f_auto,q_auto,w_200/main-codingcatdev-photo/builder_io_icons/Course_Sections.png',
    inputs: [
      {
        name: 'courseData',
        type: 'object',
      },
    ],
  }
);

Builder.registerComponent(
  dynamic(() =>
    import('@/components/PostMediaLocked').then((res) => res as any)
  ),
  {
    name: 'PostMediaLocked',
    image:
      'https://media.codingcat.dev/image/upload/f_auto,q_auto,w_200/main-codingcatdev-photo/builder_io_icons/Locked_Page.png',
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

interface CCDImage extends ImageProps {
  cloudinaryImage: Cloudinary;
}

const ccdImage = ({
  src,
  cloudinaryImage,
  layout,
  height,
  width,
  alt,
  className,
}: CCDImage) => {
  if (!layout) {
    return <></>;
  }
  return ['fixed', 'responsive'].includes(layout) ? (
    <Image
      src={
        src
          ? src
          : cloudinaryImage?.public_id
          ? cloudinaryImage.public_id
          : `main-codingcatdev-photo/builder_io_icons/AJ_Primary`
      }
      alt={alt}
      layout={layout}
      className={className}
      height={height}
      width={width}
    />
  ) : (
    <Image
      src={
        src
          ? src
          : cloudinaryImage?.public_id
          ? cloudinaryImage.public_id
          : `main-codingcatdev-photo/builder_io_icons/AJ_Primary`
      }
      alt={alt}
      layout={layout}
      className={className}
    />
  );
};

Builder.registerComponent(ccdImage, {
  name: 'NextImage',
  image:
    'https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2Fc3c7040ad97b4ffeb0dbe3c85938e531?quality=60&width=200&height=200',
  inputs: [
    {
      name: 'cloudinaryImage',
      type: 'cloudinaryImageEditor',
      required: true,
    },
    {
      name: 'layout',
      type: 'text',
      defaultValue: 'responsive',
    },
    {
      name: 'width',
      type: 'number',
      defaultValue: 1920,
    },
    {
      name: 'height',
      type: 'number',
      defaultValue: 1080,
    },
    {
      name: 'alt',
      type: 'text',
      defaultValue: 'An image description',
    },
    {
      name: 'className',
      type: 'text',
      defaultValue: 'w-12',
    },
  ],
});
