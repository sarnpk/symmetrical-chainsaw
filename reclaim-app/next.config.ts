import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    domains: ['localhost'],
    unoptimized: true, // Required for Netlify
  },
  
  // Disable x-powered-by header
  poweredByHeader: false,
  
  // Enable React strict mode
  reactStrictMode: true,
  
  // Trailing slash
  trailingSlash: false,
  
  // Output configuration for Netlify
  output: 'standalone',
  
  // Optimize bundle size
  experimental: {
    optimizeCss: true,
    isrMemoryCacheSize: 0, // Disable ISR memory cache
  },
  
  // Disable incremental static regeneration cache
  onDemandEntries: {
    maxInactiveAge: 0,
    pagesBufferLength: 0,
  },
  
  // Webpack optimization for smaller bundles
  webpack: (config, { isServer }) => {
    // Reduce bundle size
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    };
    
    return config;
  },
  
  // Suppress build warnings for dynamic routes
  typescript: {
    ignoreBuildErrors: false,
  },
  
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // Disable source maps in production to reduce size
  productionBrowserSourceMaps: false,
};

export default nextConfig;
