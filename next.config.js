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
}

module.exports = nextConfig
