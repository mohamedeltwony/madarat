# Performance Optimization Report (April 24, 2025)

## Goal

Improve the PageSpeed Insights score for the website, particularly addressing high Time to First Byte (TTFB), Largest Contentful Paint (LCP) delays, Cumulative Layout Shift (CLS), and unused JavaScript.

## Initial Problems Identified (via PageSpeed Insights & Vercel Logs)

- **High TTFB:** Server response times were very high (4-15+ seconds) for multiple pages, including landing pages and the homepage.
- **LCP Delay:** The Largest Contentful Paint was significantly delayed, often caused by render-blocking resources or slow element loading (initially the logo image).
- **CLS:** Layout shifts were occurring, primarily attributed to web font loading (`Cairo` font).
- **Image Sizing:** The logo image was flagged as not being properly sized, potentially causing inefficient loading.
- **Unused JavaScript:** Significant amounts of JavaScript, particularly from the main `_app.js` bundle and third-party scripts (Facebook Pixel), were reported as unused on initial page load.

## Actions Taken & Optimizations Implemented

1.  **Data Fetching Refactoring (Primary TTFB Fix):**

    - Identified `App.getInitialProps` in `src/pages/_app.js` as the main cause of high TTFB due to fetching global data (metadata, menus, posts, categories) on nearly every request.
    - Removed `App.getInitialProps` entirely.
    - Refactored key pages (`/`, `/georgia-trip`, `/london-scotland-trip`, `/cruise-italy-spain-france`) to use `getStaticProps` with Incremental Static Regeneration (ISR).
    - Removed unnecessary fetching of `metadata` and `menus` from the `getStaticProps` of the landing pages, as they don't use this data directly.
    - **Result:** This dramatically improved TTFB (e.g., from ~6-11s down to ~600ms for `/georgia-trip`).

2.  **Image Optimization (LCP & Sizing):**

    - Identified the logo image in the hero section as the LCP element.
    - Added the `sizes` prop to the logo `<Image>` components in `src/components/Logo/Logo.js` and relevant pages (e.g., `src/pages/georgia-trip.js`) to provide better hints for responsive image loading.
    - Ensured the `priority` prop was set for LCP image candidates.

3.  **Font Loading Optimization (CLS):**

    - Confirmed the main Google Fonts stylesheet link was correctly placed in `_document.js`.
    - Removed redundant Google Font `<link>` tags from individual page `<Head>` components.
    - Refined `<link rel="preload">` tags in `_document.js` to target specific font weights likely used above the fold.
    - Ensured `font-display: swap` was used (reverted from a brief test with `optional`).

4.  **JavaScript Bundle Size Reduction:**

    - Dynamically imported `ApolloProvider` in `_app.js` (`ssr: false`) to defer its loading client-side.
    - Conditionally rendered `SearchProvider` in `_app.js` so it only wraps pages that require search functionality.

5.  **Build Error Resolution:**
    - Iteratively fixed formatting errors reported by Prettier/ESLint during Vercel builds, primarily related to the conditional rendering logic in `_app.js`.

## Current Status & Results

- The implemented optimizations led to a significant initial improvement in PageSpeed Insights scores (reported jump from 67 to 91/99).
- TTFB has been drastically reduced for the refactored pages.
- Image sizing and font loading have been addressed according to best practices.
- Initial JavaScript load has been reduced.
- The latest code (Commit `6dc17db`) successfully builds on Vercel after resolving formatting issues.

## Remaining Issues & Next Steps

1.  **Refactor Remaining Pages:** The removal of `App.getInitialProps` means any pages _not yet refactored_ to use `getStaticProps` or `getServerSideProps` will likely be broken as they won't receive necessary global data (`metadata`, `menus`, `recentPosts`, `categories`). **This is the highest priority.**
2.  **Add Manual `<Head>` Tags:** Landing pages where `getSiteMetadata` fetching was removed now require manual addition of essential `<Head>` tags (`<title>`, `<meta name="description">`, Open Graph tags, etc.) directly within their component JSX to maintain SEO.
3.  **Investigate Backend Performance:** While TTFB is improved, the underlying `getSiteMetadata` function (calling the WordPress GraphQL API) was identified as slow. Optimizing or caching the WordPress backend response remains a potential area for further improvement, especially for pages that _do_ require global metadata.
4.  **Monitor Performance:** Re-run PageSpeed Insights on the latest deployment to confirm current scores and identify any new bottlenecks after refactoring is complete.
5.  **(Optional) Further JS Optimization:** Analyze the Webpack Bundle Analyzer report (`.next/analyze/client.html`) again after refactoring is complete to see if further dynamic imports are warranted for the `_app.js` bundle.
