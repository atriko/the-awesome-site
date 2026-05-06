// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactCompiler: true,

    images: {
        dangerouslyAllowSVG: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api.dicebear.com',
                port: '',
                pathname: '/7.x/**',
            },
        ],
    },

    // Critical fix for Server Actions behind reverse proxy
    serverExternalPackages: [],

    // Allow all hosts in production (behind trusted proxy)
    ...(process.env.NODE_ENV === 'production' && {
        allowedDevOrigins: ['*'],
    }),

    // Disable strict host checking for trusted proxy
    experimental: {
        serverActions: {
            allowedOrigins: ['awesome.atriko.dev', '*.atriko.dev', '45.76.57.246'],
        },
    },
};

export default nextConfig;
