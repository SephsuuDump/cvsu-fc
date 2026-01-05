import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nutten-strings-lie-exams.trycloudflare.com",
        port: "",
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;
