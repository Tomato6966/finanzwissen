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
        NEXT_PUBLIC_USE_PROXYURL: "true",
        NEXT_PUBLIC_BASE_PATH: basePath,
        NEXT_PUBLIC_DOMAIN: isGithubPages ? "https://tomato6966.github.io" : "http://localhost:3000",
    },
};

module.exports = nextConfig;
