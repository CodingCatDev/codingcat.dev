/* eslint @typescript-eslint/no-var-requires: "off" */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  images: {
    loader: 'cloudinary',
    path: 'https://media.codingcat.dev/image/upload/',
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (!isServer) {
      config.node = {
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty',
      };
    }
    return config;
  },
  async redirects() {
    return [
      {
        source: '/courses/:permalink*',
        destination: '/course/:permalink*',
        permanent: true,
      },
      {
        source: '/tutorials/:permalink*',
        destination: '/tutorial/:permalink*',
        permanent: true,
      },
      {
        source: '/podcasts/:permalink*',
        destination: '/podcast/:permalink*',
        permanent: true,
      },
      // {
      //   source: '/:permalink',
      //   destination: '/post/:permalink',
      //   permanent: true,
      // },
    ];
  },
});
