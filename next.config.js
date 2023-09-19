/** @type {import("next").NextConfig} */
const nextConfig = {
  distDir: '.build',
  output: 'export',
  trailingSlash: true,
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
