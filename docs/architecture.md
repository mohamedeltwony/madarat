# Architecture

This document provides a detailed overview of the project's architecture, design patterns, and technical decisions.

## High-Level Architecture

The Next.js WordPress Starter follows a headless CMS architecture:

1. **WordPress Backend**: Serves as the content management system
2. **WPGraphQL**: Exposes WordPress data through GraphQL
3. **Next.js Frontend**: Consumes and displays WordPress data
4. **Static Site Generation**: Pre-renders pages at build time

```
┌─────────────────┐     ┌───────────────┐     ┌─────────────────┐
│                 │     │               │     │                 │
│    WordPress    │────▶│   WPGraphQL   │────▶│    Next.js      │
│    (Backend)    │     │    (API)      │     │   (Frontend)    │
│                 │     │               │     │                 │
└─────────────────┘     └───────────────┘     └─────────────────┘
```

## Project Structure

```
.
├── public/            # Static assets
├── src/
│   ├── components/    # React components
│   │   ├── Layout/    # Layout components
│   │   ├── Header/    # Header components
│   │   ├── Footer/    # Footer components
│   │   └── ...        # Other UI components
│   ├── hooks/         # Custom React hooks
│   │   ├── use-site.js    # Site context hook
│   │   ├── use-search.js  # Search functionality hook
│   │   └── ...        # Other custom hooks
│   ├── lib/           # Utility functions and API
│   │   ├── posts.js       # Posts data fetching
│   │   ├── categories.js  # Categories data fetching
│   │   ├── site.js        # Site metadata
│   │   └── ...        # Other utility functions
│   ├── models/        # Data models
│   ├── pages/         # Next.js pages and API routes
│   │   ├── _app.js        # Custom App component
│   │   ├── _document.js   # Custom Document component
│   │   ├── index.js       # Homepage
│   │   ├── posts/         # Posts pages
│   │   ├── categories/    # Category pages
│   │   └── [slugParent]/[[...slugChild]].js  # Dynamic pages
│   ├── styles/        # Global styles and SCSS modules
│   │   ├── globals.scss   # Global styles
│   │   ├── _variables.module.scss  # SCSS variables
│   │   └── ...        # Other style files
│   └── templates/     # Page templates
├── .env.local         # Environment variables (you create this)
├── next.config.js     # Next.js configuration
└── package.json       # Project dependencies
```

## Key Design Patterns

### 1. Pages Router

The project uses Next.js's [Pages Router](https://nextjs.org/docs/pages/building-your-application/routing) for routing.

Key routing files:
- `src/pages/index.js` - Homepage
- `src/pages/posts/[slug].js` - Individual post pages
- `src/pages/categories/[slug].js` - Category pages
- `src/pages/[slugParent]/[[...slugChild]].js` - Nested dynamic pages

### 2. Data Fetching Pattern

The project uses Next.js's `getStaticProps` and `getStaticPaths` for data fetching:

```javascript
// Example from a typical page
export async function getStaticProps({ params = {} } = {}) {
  const { posts, pagination } = await getPosts({
    queryIncludes: 'archive',
  });
  
  return {
    props: {
      posts,
      pagination,
    },
  };
}
```

### 3. Component Organization

Components follow a modular structure with their own scoped styles:

```
ComponentName/
├── ComponentName.js       # Component code
├── ComponentName.module.scss  # Scoped styles
└── index.js               # Export file
```

### 4. Context Providers

The application uses React Context for global state management:

- `SiteContext` - Provides global site data
- `SearchProvider` - Provides search functionality

### 5. Custom Hooks

Custom hooks encapsulate reusable logic:

- `useSite` - Access site data
- `usePageMetadata` - Manage page metadata
- `useSearch` - Handle search functionality

## Data Flow

1. **Build Time**: Next.js fetches data from WordPress via GraphQL
2. **Page Generation**: Pages are pre-rendered with data
3. **Client-Side**: React hydrates the static HTML, making it interactive
4. **Runtime**: Additional data can be fetched client-side for dynamic features

## Technology Stack

- **Frontend Framework**: Next.js 15.2.1
- **UI Library**: React 19.0.0
- **Styling**: SCSS Modules
- **Data Fetching**: Apollo Client (GraphQL)
- **Development Tools**: 
  - ESLint
  - Prettier
  - Husky (Git hooks)
  - Turbopack

## Performance Optimizations

1. **Static Site Generation**: Pre-renders pages for speed
2. **Image Optimization**: Uses Next.js Image component
3. **Code Splitting**: Automatic code splitting by routes
4. **CSS Modules**: Avoids global CSS conflicts
5. **Turbopack**: Faster development experience with incremental compilation 