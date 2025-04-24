# TTFB Optimization Plan

## Problem Summary

High Time to First Byte (TTFB) of approximately 4.8 seconds and higher was observed on multiple pages, notably `/georgia-trip`. Analysis of Vercel runtime logs confirmed long lambda function execution durations (ranging from 4 seconds to over 15 seconds, resulting in timeouts) for various pages, including the homepage (`/`), dynamic routes (`/[slugParent]/[[...slugChild]]`), and data routes (`/_next/data/...`). The site is hosted on Vercel Pro.

## Investigation Findings

1.  **Page Code (`src/pages/georgia-trip.js`):** The page component itself does not implement `getStaticProps` or `getServerSideProps`, indicating it's likely rendered via SSG or CSR. No server-side data fetching logic was found within the page component that would explain the initial TTFB delay.
2.  **Middleware (`src/middleware.js`):** The middleware checks if the requested path is in an allowed list. For allowed paths like `/georgia-trip`, it uses `NextResponse.next()` immediately. This logic is lightweight and not the cause of the significant delay.
3.  **Vercel Logs:** Logs showed consistent messages like "Fetching global data for page: ..." preceding the long execution times and timeouts across multiple page types. Specific requests for the homepage (`/`) and dynamic routes (`/[slugParent]/[[...slugChild]]`) frequently timed out after 15 seconds. Requests to `/georgia-trip` consistently showed durations between 4s and 11s+.
4.  **Global App Code (`src/pages/_app.js`):** Analysis confirmed the presence of `App.getInitialProps`. This function executes server-side for almost every page request (excluding thank-you pages) and fetches global data (`getSiteMetadata`, `getRecentPosts`, `getCategories`, `getAllMenus`) before allowing the page to render.

## Root Cause

The primary cause of the high TTFB and server timeouts is the **inefficient fetching of extensive global data within `App.getInitialProps`**. This function blocks the rendering of every page while it waits for multiple data sources (likely including slow WordPress API calls) to respond, leading to long Vercel Function execution times.

## Recommended Solution: Refactor Data Fetching

The most effective solution is to eliminate the blocking nature of `App.getInitialProps`.

```mermaid
graph TD
    A[High TTFB & Timeouts on Vercel] --> B{Analyze Vercel Logs};
    B --> C{Analyze `_app.js`};
    C -- Found `getInitialProps` fetching global data --> D{Root Cause Identified: Inefficient Global Fetching in `_app.js`};
    D --> E{Refactoring Strategies};
    E --> F[Migrate Data Fetching to Pages (getStaticProps/getServerSideProps)];
    E --> G[Fetch Layout Data Client-Side or via Page Props];
    E --> H[Optimize/Cache Backend API Calls (WordPress)];
    E --> I[Implement Incremental Static Regeneration (ISR) for Pages];
    E --> J[Remove `getInitialProps` from `_app.js`];
    F & G & H & I & J --> K[Improved TTFB & Performance];

    style D fill:#f9f,stroke:#333,stroke-width:2px
    style E fill:#ccf,stroke:#333,stroke-width:2px
```

**Refactoring Strategies (Order of Preference):**

1.  **Eliminate `App.getInitialProps`:**
    *   Remove the `App.getInitialProps` function entirely from `src/pages/_app.js`.
    *   Identify the specific data required by each page.
    *   Fetch page-specific data within the page's `getStaticProps` (for static/ISR pages) or `getServerSideProps` (for dynamic per-request data).
2.  **Handle Layout Data:**
    *   For data needed by the main layout (e.g., menus, site metadata for `<Head>`):
        *   **Option A (Preferred for Static):** Fetch it in `getStaticProps`/`getServerSideProps` on *each page* and pass it down as props to the layout component. Next.js optimizes this well.
        *   **Option B (Client-Side):** Fetch it client-side within the layout component using `useEffect` and state management, or libraries like SWR/React Query. This won't block TTFB but might cause layout shifts or require loading states.
3.  **Optimize Backend & Caching:**
    *   Analyze the performance of the WordPress API endpoints used by `getSiteMetadata`, `getAllMenus`, etc.
    *   Implement caching mechanisms on the WordPress side (e.g., object caching, transient API) to speed up responses.
    *   Consider using Vercel's Data Cache for fetched results if appropriate.
4.  **Use Incremental Static Regeneration (ISR):**
    *   For pages where content doesn't need to be real-time (like `/georgia-trip`, blog posts, etc.), use `getStaticProps` with a `revalidate` time (e.g., `revalidate: 600` for 10 minutes). This serves static HTML quickly and updates it in the background.
5.  **(Temporary Fix) Reduce `getInitialProps` Scope:**
    *   If a full refactor is not immediately feasible, fetch only the *absolute minimum* data required for the initial render within `getInitialProps`.
    *   Aggressively cache the results of these minimal fetches.
    *   Load all other "global" data client-side.

## Next Steps

Proceed with the refactoring process, likely starting with a single page (e.g., `/georgia-trip`) to implement `getStaticProps` and remove its reliance on data passed from `App.getInitialProps`. Subsequently, remove `App.getInitialProps` once all pages fetch their own data.