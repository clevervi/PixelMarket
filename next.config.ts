import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [],
  },
  // Allow additional dev origins in development (e.g. accessing the dev server
  // from another device on the local network such as IP 10.1.70.5).
  allowedDevOrigins: [
    'localhost:3000',
    '127.0.0.1:3000',
    '10.1.70.5',
    '10.1.70.5:3000',
  ],
};

export default nextConfig;
