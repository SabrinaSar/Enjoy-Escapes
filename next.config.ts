import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "3mb", // 3 MB
    },
  },
  /* config options here */
};

export default nextConfig;
