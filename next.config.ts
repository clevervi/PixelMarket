import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [],
  },
  // Permitir orígenes adicionales en desarrollo (por ejemplo, acceder al dev server
  // desde otro dispositivo en la red local con IP 10.1.70.5).
  allowedDevOrigins: [
    'localhost:3000',
    '127.0.0.1:3000',
    '10.1.70.5',
    '10.1.70.5:3000',
  ],
};

export default nextConfig;
