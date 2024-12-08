/** @type {import('next').NextConfig} */

const nextConfig = {
  eslint: {
    dirs: ['app', 'components', 'const', 'lib', 'methods', 'store'],
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
