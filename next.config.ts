import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb", // 4 MB
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
    // Set minimum cache TTL to 31 days (2678400 seconds) to reduce image optimization costs
    minimumCacheTTL: 2678400, // 31 days in seconds
  },
  async headers() {
    return [
      {
        // Cache static assets for 1 year
        source: "/(.*)\\.(png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|eot)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2678400, immutable", // 1 year
          },
        ],
      },
      {
        // Cache images in public/images for 31 days
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2678400", // 31 days
          },
        ],
      },
      {
        // Cache specific static assets in public for 31 days
        source: "/:path(logo|hero|social|website-features|win-bg)\\.(png|jpg|jpeg|gif|webp)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2678400", // 31 days
          },
        ],
      },
    ];
  },
  /* config options here */
};

export default nextConfig;
