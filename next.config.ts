import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['d1s8l6ybvn2guu.cloudfront.net', 'via.placeholder.com'],
  },
  async rewrites() {
    return [
      {
        source: "/api/init-payment",
        destination: "http://localhost:3000/api/init-payment",
      },
    ];
  },
  // Turbopack-specific configuration
  experimental: {
    turbo: {
      rules: {
        // Add rule for .txt files
        '*.txt': {
          loaders: ['raw-loader'],
        },
      },
    },
  },
};

export default nextConfig;
