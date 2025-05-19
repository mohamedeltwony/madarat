const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// const indexSearch = require('./plugins/search-index'); // Commented out - unused
// const feed = require('./plugins/feed'); // Commented out - unused
// const sitemap = require('./plugins/sitemap'); // Commented out - unused
// const socialImages = require('./plugins/socialImages'); TODO: failing to run on Netlify

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // i18n configuration for Arabic support
  i18n: {
    locales: ['ar', 'en'],
    defaultLocale: 'ar',
    localeDetection: false,
  },
  
  // Rewrites for API
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://madaratalkon.com/wp-json/:path*',
      },
      // Add more specific rewrite for the trip endpoint
      {
        source: '/api/wp/v2/trip',
        destination: 'https://madaratalkon.com/wp-json/wp/v2/trip',
      },
    ];
  },
  
  // URL encoding settings
  trailingSlash: false,
  
  // Experimental features
  experimental: {
    urlImports: ['https://madaratalkon.com'],
  },
  
  // Image domains
  images: {
    // unoptimized: true, // Re-enable Next.js Image Optimization globally
    domains: ['madaratalkon.com', 'via.placeholder.com', 'placehold.co', 'placeholder.pics', 'placekitten.com', 'picsum.photos', 'loremflickr.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'madaratalkon.com',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placeholder.pics',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placekitten.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'loremflickr.com',
        port: '',
        pathname: '/**',
      }
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
  },
  poweredByHeader: false,
  compress: true,

  // Add webpack configuration for React Icons
  webpack: (config, { isServer }) => {
    // Add specific handling for react-icons to properly chunk it
    config.optimization.splitChunks = {
      ...config.optimization.splitChunks,
      chunks: 'all',
      cacheGroups: {
        ...config.optimization.splitChunks.cacheGroups,
        reactIcons: {
          test: /react-icons/,
          name: 'react-icons',
          priority: 10,
          enforce: true,
          chunks: 'all',
        },
      },
    };
    
    return config;
  },
  
  async headers() {
    return [
      {
        // Apply cache headers to more static assets
        source: '/:all*(svg|jpg|png|webp|woff2)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, must-revalidate',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Set-Cookie',
            value: 'Path=/; HttpOnly; Secure; SameSite=Strict',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, OPTIONS',
          },
        ],
      },
    ];
  },
  env: {
    OG_IMAGE_DIRECTORY: '/images/og',
    POSTS_PRERENDER_COUNT: '5',
    WORDPRESS_API_URL: 'https://madaratalkon.com',
    WORDPRESS_MENU_LOCATION_NAVIGATION:
      process.env.WORDPRESS_MENU_LOCATION_NAVIGATION || 'PRIMARY',
  },
};

// Wrap the config with the analyzer
module.exports = withBundleAnalyzer(nextConfig);

/**
 * parseEnv
 * @description Helper function to check if a variable is defined and parse booleans
 */
// function parseEnvValue(value, defaultValue) { // Commented out - unused
//   if (typeof value === 'undefined') return defaultValue;
//   if (value === true || value === 'true') return true;
//   if (value === false || value === 'false') return false;
//   return value;
// }
