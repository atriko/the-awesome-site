// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // ... your existing config (like reactCompiler: true, etc.)

    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "api.dicebear.com",
                port: "",
                pathname: "/7.x/**", // Allows all paths under /7.x/
            },
        ],
    },
};

export default nextConfig;
