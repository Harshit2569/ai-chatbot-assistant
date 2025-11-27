import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [], // no external domains
  },

  // Required for @google/generative-ai to work in Next.js
  experimental: {
    serverComponentsExternalPackages: ["@google/generative-ai"],
  },
};

export default nextConfig;
