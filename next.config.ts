import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverActions: {
    bodySizeLimit: 3 * 1024 * 1024, // 3 MB
  },
  /* config options here */
};

export default nextConfig;
