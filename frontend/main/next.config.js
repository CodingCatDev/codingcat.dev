/* eslint @typescript-eslint/no-var-requires: "off" */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const withPWA = require('next-pwa');

module.exports = withPWA(
  withBundleAnalyzer({
    reactStrictMode: true,
    images: {
      loader: 'cloudinary',
      path: 'https://media.codingcat.dev/image/upload/',
    },
    async redirects() {
      return [
        {
          source: '/blog/design-systems-with-web-components',
          destination: '/tutorial/design-systems-with-web-components',
          permanent: true,
        },
        {
          source: '/lessons/:path*',
          destination: '/tutorial/:path*',
          permanent: true,
        },
      ];
    },
    pwa: {
      dest: 'public',
      register: true,
      skipWaiting: true,
      disable: process.env.NODE_ENV === 'development',
    },
  })
);
