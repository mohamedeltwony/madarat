# Website Performance Optimization Plan (Hybrid Approach)

**Goal:** Improve website performance and reliability by minimizing WordPress dependencies while retaining dynamic content management for Trips, Destinations, and Posts.

**Summary:** This plan involves keeping the WordPress integration for essential dynamic content (Trips, Destinations, Posts) and removing dependencies for static or less frequently updated content (Menus, general Pages, Site Metadata), which will be managed locally within the Next.js project.

## Plan Visualization

```mermaid
graph TD
    A[Stabilize WP APIs: /destination, /trip, /posts, /categories] --> B(Keep/Optimize Fetching Logic for Dest/Trips/Posts);
    C[Remove WP Menu Dependency] --> D[Implement Static Menu in Next.js];
    E[Remove WP General Page Dependency] --> F[Implement General Pages Locally];
    G[Remove WP Site Metadata Dependency] --> H[Implement Local Site Metadata];
    B --> I{Performance Check};
    D --> I;
    F --> I;
    H --> I;
    I --> J[Address Other Issues (Google API Key, Assets, Config)];
    J --> K{Optimized Site with Minimal WP Dependency};

    subgraph "WordPress Interaction (Keep & Stabilize)"
        A
        B
    end

    subgraph "Decoupling Steps (Remove & Replace)"
        C
        D
        E
        F
        G
        H
    end

    subgraph "Cleanup & Finalization"
        J
    end
```

## Detailed Steps

1.  **Stabilize Critical WordPress APIs (Highest Priority):**
    *   **Action:** Investigate the `500 Internal Server Error` reported in the logs on the `madaratalkon.com` WordPress backend.
    *   **Verification:** Confirm if this error (or any other issues) affects the required API endpoints:
        *   `/wp/v2/destination` (Used for fetching destination data)
        *   `/wp/v2/trip` (Used for fetching trip data, including filtering by destination)
        *   `/wp/v2/posts` (Used for fetching blog posts)
        *   `/wp/v2/categories` (Used for fetching post categories)
    *   **Resolution:** Fix any identified issues on the WordPress server side for these specific endpoints. **This step is critical before proceeding with Next.js changes.**
    *   **Keep:** Retain the Next.js fetching logic for these endpoints in `src/lib/rest-api.js` and relevant page files (e.g., `src/pages/destinations/[slug]/trips.js`, `src/pages/posts/...`).

2.  **Remove & Replace Other WP Dependencies (Next.js Changes):**
    *   **Menus:**
        *   Remove calls to `getAllMenusREST` in `src/lib/rest-api.js` and dependent files.
        *   Create a local data source for menu structure (e.g., `src/data/menus.js`).
        *   Update UI components (`src/components/Header/Header.js`, `src/components/Layout/Layout.js`, etc.) to use the local menu data.
    *   **General Pages (Non-Trip/Destination/Post):**
        *   Remove calls to `getAllPagesREST` and `getPageByUriREST` from `src/lib/rest-api.js`.
        *   Identify general pages (e.g., About Us, Contact).
        *   Implement these pages locally within the Next.js project (e.g., create static files like `src/pages/about.js`).
        *   Remove or significantly refactor the dynamic route `src/pages/[slugParent]/[[...slugChild]].js` if it's no longer needed for these pages.
    *   **Site Metadata:**
        *   Remove calls to `getSiteMetadataREST` from `src/lib/rest-api.js`.
        *   Define site metadata (title, description) locally (e.g., in `src/data/site.js` or `next.config.js`) and update components that use it (e.g., `src/components/Meta/index.js`, `src/pages/_app.js`).

3.  **Optimize & Clean Up:**
    *   **Fetching:** Review the retained fetching logic (Trips, Destinations, Posts) for potential optimizations (e.g., efficient use of `_embed`, appropriate ISR `revalidate` values).
    *   **Other Issues:** Address remaining items identified in the logs:
        *   Update or remove the invalid Google Places API key integration (`src/pages/api/google-reviews.js`).
        *   Fix references to missing image assets (`/images/pattern.png`, `/images/hero-bg.jpg`).
        *   Resolve duplicate page warnings (e.g., decide between `src/pages/posts.js` and `src/pages/posts/index.js`).
        *   Update `next.config.js` to use `images.remotePatterns` instead of the deprecated `images.domains`.

**Implementation Order:**

1.  Complete Step 1 (Stabilize WP APIs).
2.  Implement Step 2 (Decoupling in Next.js).
3.  Implement Step 3 (Optimization & Cleanup).