
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,

    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.markazvl.ir",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/persis-bridge/public/**",
      },
    ],
  },
};

export default nextConfig;