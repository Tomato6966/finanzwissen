const isGithubPages = process.env.NODE_ENV === 'production';

const basePath = isGithubPages ? '/finanzielle_bildung' : ''

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
    },
    basePath,
    assetPrefix: basePath,
    env: {
        NEXT_PUBLIC_BASE_PATH: basePath,
    },
};

module.exports = nextConfig;
