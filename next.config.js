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
  
  // Modern browsers target
  // swcMinify: true, // Removed as it's deprecated in Next.js 15
  
  // i18n configuration for Arabic support
  i18n: {
    locales: ['default', 'ar', 'en'],
    defaultLocale: 'default',
    localeDetection: false,
  },
  
  // Rewrites for API
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://en4ha1dlwxxhwad.madaratalkon.com/wp-json/:path*',
      },
      // Add more specific rewrite for the trip endpoint
      {
        source: '/api/wp/v2/trip',
        destination: 'https://en4ha1dlwxxhwad.madaratalkon.com/wp-json/wp/v2/trip',
      },
    ];
  },
  
  // URL encoding settings
  trailingSlash: false,
  
  // Experimental features
  experimental: {
    urlImports: ['https://themer.sanity.build/'],
    // Modern browser options (remove incompatible flags)
  },
  
  // Image domains
  images: {
    // unoptimized: true, // Re-enable Next.js Image Optimization globally
    domains: [
      'madaratalkon.com',
      'en4ha1dlwxxhwad.madaratalkon.com',
      'secure.gravatar.com',
      'res.cloudinary.com',
      'wp.example.org',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'madaratalkon.com',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'en4ha1dlwxxhwad.madaratalkon.com',
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
    formats: ['image/avif', 'image/webp'],
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
        // Group common vendor packages together
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // Get the name of the package
            // Handle cases where module.context is null or undefined
            if (!module.context) {
              return 'vendor.unknown';
            }
            
            const match = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
            if (!match) {
              return 'vendor.unknown';
            }
            
            const packageName = match[1];
            
            // Return a chunk name based on the package name
            // npm packages usually use @org/package-name format so convert to org-package-name
            return `vendor.${packageName.replace('@', '').replace('/', '-')}`;
          },
          priority: 20,
        },
        // Facebook events
        facebookEvents: {
          test: /[\\/]node_modules[\\/].*facebook/,
          name: 'facebook-events',
          priority: 30,
          enforce: true,
          chunks: 'all',
        },
        // Google analytics
        googleAnalytics: {
          test: /[\\/]node_modules[\\/].*google/,
          name: 'google-analytics',
          priority: 30,
          enforce: true,
          chunks: 'all',
        },
        // React icons specific optimization
        reactIcons: {
          test: /react-icons/,
          name: 'react-icons',
          priority: 30,
          enforce: true,
          chunks: 'all',
        },
        // Common CSS
        styles: {
          test: /\.css$/,
          name: 'styles',
          enforce: true,
          priority: 30,
        },
      },
    };
    
    return config;
  },
  
  async headers() {
    return [
      {
        // Apply cache headers to more static assets
        source: '/:all*(svg|jpg|png|webp|avif|woff2|woff|ttf|js|css)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
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
    WORDPRESS_API_URL: 'https://en4ha1dlwxxhwad.madaratalkon.com',
    WORDPRESS_MENU_LOCATION_NAVIGATION:
      process.env.WORDPRESS_MENU_LOCATION_NAVIGATION || 'PRIMARY',
    WORDPRESS_GRAPHQL_ENDPOINT: process.env.WORDPRESS_GRAPHQL_ENDPOINT,
    WORDPRESS_REST_API: process.env.WORDPRESS_REST_API,
  },
  // Add exportPathMap to control which paths get pre-rendered
  exportPathMap: async function () {
    // Only export the homepage and other static pages
    // Skip dynamic routes like [slug] that might have errors
    return {
      '/': { page: '/' },
      '/404': { page: '/404' },
      '/500': { page: '/500' },
    };
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
