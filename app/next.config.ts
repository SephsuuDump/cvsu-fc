import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dot-before-eng-dos.trycloudflare.com",
        port: "",
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;
