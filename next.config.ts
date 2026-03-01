import type { NextConfig } from "next";

const isVercel = process.env.VERCEL === "1";

const nextConfig: NextConfig = {
  /* config options here */
  ...(isVercel ? {} : { distDir: "build" }),
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
