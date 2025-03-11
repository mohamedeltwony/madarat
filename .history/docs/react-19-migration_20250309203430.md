# React 19 Migration Guide

This document outlines the process of upgrading the Next.js WordPress Starter from React 18 to React 19, including the changes made and lessons learned.

## Overview of Changes

The project was successfully updated from:

| Component | Old Version | New Version |
|-----------|-------------|-------------|
| Next.js   | 13.4.0      | 15.2.1      |
| React     | 18.2.0      | 19.0.0      |
| React DOM | 18.2.0      | 19.0.0      |

## Migration Steps

### 1. Dependency Updates

The first step was updating the core dependencies:

```bash
npm install next@15.2.1 react@19.0.0 react-dom@19.0.0 eslint-config-next@15.2.1
```

### 2. React-Helmet Replacement

One of the main breaking changes was compatibility issues with `react-helmet`. To address this:

1. Created a custom `Meta` component using Next.js's `next/head`:

```jsx
// src/components/Meta/index.js
import Head from 'next/head';

const Meta = ({ title, description, link = [], meta = [], script = [], htmlAttributes = {}, bodyAttributes = {} }) => {
  // Apply HTML attributes
  if (typeof window !== 'undefined' && htmlAttributes) {
    Object.keys(htmlAttributes).forEach(key => {
      document.documentElement.setAttribute(key, htmlAttributes[key]);
    });
  }
  
  // Apply body attributes
  if (typeof window !== 'undefined' && bodyAttributes) {
    Object.keys(bodyAttributes).forEach(key => {
      document.body.setAttribute(key, bodyAttributes[key]);
    });
  }

  return (
    <Head>
      {title && <title key="title">{title}</title>}
      {description && <meta name="description" content={description} key="description" />}
      
      {/* Render all meta tags */}
      {meta.map((metaItem, i) => {
        const key = `meta-${i}`;
        if (metaItem.property) {
          return <meta property={metaItem.property} content={metaItem.content} key={key} />;
        }
        return <meta name={metaItem.name} content={metaItem.content} key={key} />;
      })}
      
      {/* Render all link tags */}
      {link.map((linkItem, i) => {
        const key = `link-${i}`;
        return <link {...linkItem} key={key} />;
      })}
      
      {/* Render all script tags */}
      {script.map((scriptItem, i) => {
        const key = `script-${i}`;
        if (scriptItem.innerHTML) {
          return (
            <script 
              type={scriptItem.type} 
              key={key}
              dangerouslySetInnerHTML={{ __html: scriptItem.innerHTML }}
            />
          );
        }
        return <script {...scriptItem} key={key} />;
      })}
    </Head>
  );
};

export default Meta;
```

2. Created a `JsonLd` component for structured data:

```jsx
// src/components/JsonLd/index.js
import Head from 'next/head';

const JsonLd = ({ data }) => {
  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
    </Head>
  );
};

export default JsonLd;
```

3. Updated the `_document.js` file to remove React Helmet dependencies:

```jsx
// src/pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="ar" dir="rtl">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <link 
            href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap" 
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
```

4. Updated components that used React Helmet, including:
   - `Layout.js`
   - JSON-LD components in `src/lib/json-ld.js`

### 3. CSS Module Changes

Fixed CSS module issues, particularly with `:export` syntax:

1. Created a JS file for CSS variables:

```js
// src/styles/variables.js
const variables = {
  progressbarColor: '#1a365d' // Same as $color-primary in _variables.module.scss
};

export default variables;
```

2. Updated SCSS files to use modern syntax:

```scss
// src/styles/_variables.module.scss
@use "sass:color";

// Colors
$color-primary: #1a365d;
// Use color.adjust instead of darken for Sass 3.0 compatibility
$color-primary-dark: color.adjust($color-primary, $lightness: -10%);
```

3. Updated imports to use the JS variables file:

```jsx
// src/pages/_app.js
import variables from '../styles/variables';

// ...
<NextNProgress height={4} color={variables.progressbarColor} />
```

### 4. Turbopack Integration

Enabled Turbopack for faster development:

```json
// package.json
{
  "scripts": {
    "dev": "next dev --turbopack",
    // ...
  }
}
```

## Breaking Changes Addressed

### 1. React Lifecycle Methods

React 19 has stricter handling of legacy lifecycle methods. The project was already using modern patterns like hooks, so no changes were needed.

### 2. Strict Mode Compatibility

React 19 runs in strict mode by default, which can expose issues with:
- Multiple state updates
- Improper useEffect cleanup
- Legacy context API usage

The project was already compatible with strict mode.

### 3. Custom Elements Support

React 19 has improved support for web components and custom elements, but the project doesn't use any, so no changes were needed.

### 4. Concurrent Rendering

React 19 uses concurrent rendering by default. The project's components were already compatible.

## Next.js 15 Changes

Besides React 19 compatibility, the upgrade to Next.js 15 brought changes to:

1. **Caching Behavior**: 
   - `fetch` requests are no longer cached by default
   - `GET` Route Handlers are no longer cached by default
   - Client navigations are no longer cached by default

2. **TypeScript Support**: 
   - Added support for `next.config.ts`

3. **Image Component**: 
   - Improved image loading and optimizations

4. **Self-hosting Control**: 
   - More control over `Cache-Control` headers

## SASS Deprecation Warnings

The project still uses deprecated SASS `@import` syntax. Future updates should replace these with `@use` and `@forward`, but this was not addressed in the current migration.

## Lessons Learned

1. **React Helmet Compatibility**: React Helmet has compatibility issues with React 19. Using Next.js's built-in `next/head` is more reliable.

2. **CSS Modules Export**: The `:export` syntax in SCSS modules has compatibility issues with Turbopack. Using separate JS files for variables is more reliable.

3. **Incremental Migration**: Taking an incremental approach - fixing one issue at a time - made the migration more manageable.

4. **Testing**: Thoroughly testing after each change helped catch issues early.

## Future Recommendations

1. **Update SASS syntax**: Modernize SCSS files by replacing `@import` with `@use` and `@forward`.

2. **TypeScript Migration**: Consider adopting TypeScript for better type safety.

3. **Server Components**: Explore using React Server Components in the App Router for better performance.

4. **New Next.js Features**: Explore new features in Next.js 15, such as:
   - Partial Prerendering
   - Enhanced debugging
   - The `after` API for code execution after response streaming

## Resources

- [React 19 Documentation](https://react.dev/)
- [Next.js 15 Release Notes](https://nextjs.org/blog/next-15)
- [Next.js Upgrade Guide](https://nextjs.org/docs/pages/building-your-application/upgrading)
- [SASS Modern Syntax Guide](https://sass-lang.com/guide) 