import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  distDir: "build",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "eetnews.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
};

export default nextConfig;
