# Getting Started

This guide will help you set up and run the Next.js WordPress Starter project locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) (v7 or later) or [yarn](https://yarnpkg.com/)
- A WordPress site with [WPGraphQL](https://www.wpgraphql.com/) plugin installed

## Installation

### 1. Clone the Repository

You can start a new project based on this starter using one of the following methods:

```bash
# Using npm
npx create-next-app -e https://github.com/colbyfayock/next-wordpress-starter

# Using yarn
yarn create next-app -e https://github.com/colbyfayock/next-wordpress-starter
```

Alternatively, you can clone this repository directly and then install dependencies:

```bash
git clone https://github.com/colbyfayock/next-wordpress-starter.git my-project
cd my-project
npm install
# or
yarn install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root of your project with the following content:

```
WORDPRESS_GRAPHQL_ENDPOINT="https://your-wordpress-site.com/graphql"
```

Replace `https://your-wordpress-site.com/graphql` with your WordPress GraphQL endpoint URL.

Additional environment variables you can configure (optional):

```
WORDPRESS_MENU_LOCATION_NAVIGATION=PRIMARY
WORDPRESS_PLUGIN_SEO=false
```

### 3. Start the Development Server

Run the development server to see your site in action:

```bash
npm run dev
# or with turbopack (faster)
npm run dev
```

Your site will be available at http://localhost:3000.

## WordPress Setup

### Required WordPress Plugins

1. **WPGraphQL** - Essential for GraphQL API access
   - Installation: Download from [GitHub](https://github.com/wp-graphql/wp-graphql/releases) or WordPress.org
   - Activate in your WordPress admin

### Optional WordPress Plugins

1. **Yoast SEO + WPGraphQL Yoast SEO Integration** - For enhanced SEO features

   - Set `WORDPRESS_PLUGIN_SEO=true` in your `.env.local` after installing

2. **Advanced Custom Fields (ACF) + WPGraphQL for ACF** - For custom fields
   - Allows you to extend content models with custom fields

## Project Structure

Here's a brief overview of the project structure:

```
.
├── public/            # Static assets
├── src/
│   ├── components/    # React components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions and API
│   ├── models/        # Data models
│   ├── pages/         # Next.js pages and API routes
│   ├── styles/        # Global styles and SCSS modules
│   └── templates/     # Page templates
├── .env.local         # Environment variables (you create this)
├── next.config.js     # Next.js configuration
└── package.json       # Project dependencies
```

## Next Steps

- Review the [Architecture](./architecture.md) documentation to understand the project structure
- Explore [Key Components](./components.md) to understand how the UI is built
- Check [Data Fetching](./data-fetching.md) to learn how to work with WordPress data
