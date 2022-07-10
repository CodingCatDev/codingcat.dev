/** @type {import('next').NextConfig} */
const withPreact = require('next-plugin-preact');
const nextConfig = {
	reactStrictMode: true
};

module.exports = withPreact(nextConfig);
