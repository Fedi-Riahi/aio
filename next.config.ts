import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['images.unsplash.com','plus.unsplash.com','images.pexels.com','assets.aceternity.com','tunis.events','media.pathe.tn', 'd1s8l6ybvn2guu.cloudfront.net','via.placeholder.com'],
  },
  async rewrites() {
    return [
      {
        source: "/api/init-payment",
        destination: "http://localhost:3000/api/init-payment",
      },
    ];
  },
};

export default nextConfig;
