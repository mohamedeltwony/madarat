// const indexSearch = require('./plugins/search-index'); // Commented out - unused
// const feed = require('./plugins/feed'); // Commented out - unused
// const sitemap = require('./plugins/sitemap'); // Commented out - unused
// const socialImages = require('./plugins/socialImages'); TODO: failing to run on Netlify

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['madaratalkon.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'madaratalkon.com',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
  },
  poweredByHeader: false,
  compress: true,
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, must-revalidate',
          }
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
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
    WORDPRESS_GRAPHQL_ENDPOINT: process.env.WORDPRESS_GRAPHQL_ENDPOINT,
    WORDPRESS_MENU_LOCATION_NAVIGATION: process.env.WORDPRESS_MENU_LOCATION_NAVIGATION || 'PRIMARY',
    WORDPRESS_PLUGIN_SEO: 'false',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://madaratalkon.com/wp-json/:path*',
      },
    ];
  }
};

module.exports = nextConfig;

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
