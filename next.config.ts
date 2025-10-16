import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental features for better performance
  experimental: {
    // Enable server components by default
    serverComponentsExternalPackages: [],
  },
  
  // Optimize images for Vercel
  images: {
    // Allow images from your API and external sources
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5218',
        pathname: '/**',
      },
    ],
  },
  
  // Enable compression
  compress: true,
  
  // Optimize for Vercel deployment
  output: 'standalone',
  
  // Environment variables validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;
