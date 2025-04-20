import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // 10 MB
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vieoujqdwuxpaalkvomx.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/enjoy-escapes-assets/**", // Allow all images in this bucket
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
