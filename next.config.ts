const isGithubPages = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';

const basePath = isGithubPages ? '/finanzwissen' : ''

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Only use export mode for production builds, not development
    ...(isGithubPages && { output: 'export' }),
    images: {
        unoptimized: true,
        // Next.js 16: Add remote patterns for external images if needed
        domains: [],
    },
    basePath,
    assetPrefix: basePath,
    env: {
        NEXT_PUBLIC_USE_PROXYURL: "true",
        NEXT_PUBLIC_BASE_PATH: basePath,
        NEXT_PUBLIC_DOMAIN: isGithubPages ? "https://tomato6966.github.io" : "http://localhost:3000",
    },
    // Next.js 16: Use webpack explicitly to avoid Turbopack conflicts
    ...(isDev && {
        webpack: (config: any, { isServer }: { isServer: boolean }) => {
            config.watchOptions = {
                poll: 1000,
                aggregateTimeout: 300,
            };
            return config;
        },
    }),
    // Next.js 16: Add empty turbopack config to silence warnings
    turbopack: {},
    // Next.js 16: Add experimental features if needed
    experimental: {
        // Enable any experimental features you want to use
    },
};

export default nextConfig;
