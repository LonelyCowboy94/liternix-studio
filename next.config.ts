/* eslint-disable */
// @ts-nocheck

import type { NextConfig } from "next";

const nextConfig: any = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', 
        pathname: '/**', 
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/**', 
      },
    ],
  },

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;