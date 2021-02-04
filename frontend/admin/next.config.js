/* eslint @typescript-eslint/no-var-requires: "off" */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const withTM = require('next-transpile-modules')(['@codingcatdev/shared']);
const path = require('path');

module.exports = withBundleAnalyzer(
  withTM({
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
      config.resolve.alias['react'] = path.resolve(
        __dirname,
        '.',
        'node_modules',
        'react'
      );
      return config;
    },
  })
);
