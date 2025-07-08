const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'madaratalkon.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'eydmsroo88e.exactdn.com',
        pathname: '/**',
      },
    ],
  },

  env: {
    WORDPRESS_API_URL: 'https://madaratalkon.com/wp-json',
    WORDPRESS_GRAPHQL_URL: 'https://madaratalkon.com/graphql',
  },

  // Remove all console.* statements in production builds
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },

  webpack: (config, { isServer }) => {
    // Example placeholder: alias any future heavy libs to lightweight facades
    // config.resolve.alias['heavy-lib'] = path.join(__dirname, 'utils/heavy-lib-facade.js');

    return config;
  },
};

module.exports = nextConfig;
