import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "whats-bought-wed-graduates.trycloudflare.com",
        port: "",
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;
