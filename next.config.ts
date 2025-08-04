/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
      unoptimized: true,
    },
    basePath: "/finanzielle_bildung",
    assetPrefix: "/finanzielle_bildung/",
  };

  module.exports = nextConfig;
