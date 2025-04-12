/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

export default nextConfig;
