import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable React Strict Mode to prevent WalletConnect double initialization warnings
  reactStrictMode: false,

  // Enable experimental features for better Web3 compatibility
  experimental: {
    esmExternals: true,
  },

  // Webpack configuration for Web3 libraries
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

export default nextConfig;
