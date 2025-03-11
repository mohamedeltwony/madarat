# Deployment

This document outlines the various deployment options and configurations for the Next.js WordPress Starter project.

## Deployment Options

The Next.js WordPress Starter project can be deployed to various platforms with different strategies:

1. **Vercel** (Recommended)
2. **Netlify** 
3. **Self-Hosted Node.js** (e.g., AWS, DigitalOcean, etc.)
4. **Static Export** (any static hosting)

## Preparing for Deployment

Before deploying, make sure to:

1. Update your environment variables 
2. Run a production build locally to test
3. Configure the `next.config.js` as needed

## Vercel Deployment

[Vercel](https://vercel.com/) is the platform built by the creators of Next.js and offers the simplest deployment experience.

### Steps for Deploying to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import your repository in Vercel
3. Configure environment variables:
   - `WORDPRESS_GRAPHQL_ENDPOINT`
   - Other variables as needed
4. Deploy

### Using the Vercel CLI

You can also deploy using the Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Configuration

The project includes a `vercel.json` file with recommended configuration:

```json
{
  "cleanUrls": true,
  "trailingSlash": false,
  "env": {
    "WORDPRESS_GRAPHQL_ENDPOINT": "YOUR_WORDPRESS_GRAPHQL_ENDPOINT"
  },
  "build": {
    "env": {
      "WORDPRESS_GRAPHQL_ENDPOINT": "YOUR_WORDPRESS_GRAPHQL_ENDPOINT"
    }
  }
}
```

## Netlify Deployment

[Netlify](https://www.netlify.com/) is another excellent platform for deploying Next.js sites.

### Steps for Deploying to Netlify

1. Push your code to a Git repository
2. Import your repository in Netlify
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Add environment variables
5. Deploy

### Using the Deploy Button

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/colbyfayock/next-wordpress-starter)

### Configuration

The project includes a `netlify.toml` file with recommended settings:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NETLIFY_NEXT_PLUGIN_SKIP = "true"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Using Next.js Plugins with Netlify

Netlify offers the Essential Next.js plugin which handles routing and server-side rendering:

```bash
# Add the plugin
npm install -D @netlify/plugin-nextjs
```

## Static Export Deployment

For simple deployments to static hosts (GitHub Pages, Amazon S3, etc.), you can use Next.js's static export feature.

### Configuration

1. Make sure the `next.config.js` file includes:
```javascript
module.exports = {
  images: {
    unoptimized: true,
  },
  output: 'export',
}
```

2. Update your `package.json` to include:
```json
"scripts": {
  "export": "next build && next export"
}
```

3. Run the export:
```bash
npm run export
```

This will create an `out` directory with static HTML files that can be deployed to any static hosting service.

## Self-Hosted Deployment

For self-hosted deployments on your own server:

1. Build your application:
```bash
npm run build
```

2. Start the production server:
```bash
npm run start
```

This will start a Node.js server that serves your Next.js application.

## Environment Variables

Regardless of deployment platform, you'll need to configure environment variables:

| Name                               | Required | Default | Description                                       |
| ---------------------------------- | -------- | -       | ------------------------------------------------- |
| WORDPRESS_GRAPHQL_ENDPOINT         | Yes      | -       | WordPress WPGraphQL endpoint (ex: host.com/graphl)|
| WORDPRESS_MENU_LOCATION_NAVIGATION | No       | PRIMARY | Configures header navigation Menu Location        |
| WORDPRESS_PLUGIN_SEO               | No       | false   | Enables SEO plugin support (true, false)          |

## Continuous Deployment

For automatic deployments when your WordPress content changes:

1. **Webhooks**: Set up a webhook in your WordPress installation that triggers a build when content changes
2. **Scheduled Builds**: Configure scheduled builds on your hosting platform

### Example Webhook Configuration (Vercel)

1. Get your deploy hook URL from Vercel
2. Install a WordPress webhook plugin
3. Configure the plugin to trigger the deploy hook when content is published or updated

## Caching Strategies

### Incremental Static Regeneration (ISR)

For dynamic content that changes frequently, consider using Next.js's Incremental Static Regeneration:

```javascript
export async function getStaticProps() {
  const { posts } = await getPosts();
  
  return {
    props: {
      posts,
    },
    // Re-generate at most once per hour
    revalidate: 3600,
  };
}
```

### Cache-Control Headers

For fine-grained control of caching, configure the `Cache-Control` headers in `next.config.js`:

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400',
          },
        ],
      },
    ];
  },
};
```

## Performance Monitoring

After deployment, monitor your site's performance using:

1. [Vercel Analytics](https://vercel.com/analytics)
2. [Netlify Analytics](https://www.netlify.com/products/analytics/)
3. [Google PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/)
4. [Web Vitals](https://web.dev/vitals/) 