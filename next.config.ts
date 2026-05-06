// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactCompiler: true,

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api.dicebear.com',
                port: '',
                pathname: '/7.x/**',
            },
        ],
    },

    // Fix for reverse proxy Server Actions
    allowedDevOrigins: ['awesome.atriko.dev', '45.76.57.246'],

    // Also add this to handle proxy headers
    skipTrailingSlashRedirect: true,
};

export default nextConfig;
