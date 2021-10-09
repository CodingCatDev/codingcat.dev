/* eslint @typescript-eslint/no-var-requires: "off" */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
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
      {
        source: '/blog/:path*',
        destination: '/post/:path*',
        permanent: true,
      },
    ];
  },
});
