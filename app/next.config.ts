import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "faculty-connect-app-cxk36.ondigitalocean.app",
        port: "",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "juodgawtdmfeqfxiwisb.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
