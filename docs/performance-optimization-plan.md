# Website Performance Optimization Plan (Hybrid Approach) - Updated Progress

**Goal:** Improve website performance and reliability by minimizing WordPress dependencies while retaining dynamic content management for Trips, Destinations, and Posts.

**Summary:** This plan involves keeping the WordPress integration for essential dynamic content (Trips, Destinations, Posts) and removing dependencies for static or less frequently updated content (Menus, general Pages, Site Metadata), which will be managed locally within the Next.js project.

## Current Progress Summary

- ✅ **Decoupling Steps (Menus, Site Metadata, General Pages)**: Created local data structures and static pages
- ✅ **Configuration Updates**: Updated `next.config.js` with modern image configuration
- 🟡 **WordPress API Stabilization**: Still need to verify critical API endpoints are fully stable
- 🟡 **Optimization & Cleanup**: Partially completed, with remaining tasks outlined below

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
    
    %% Styling for completed items
    style C fill:#c0ffc0,stroke:#008000;
    style D fill:#c0ffc0,stroke:#008000;
    style E fill:#c0ffc0,stroke:#008000;
    style F fill:#c0ffc0,stroke:#008000;
    style G fill:#c0ffc0,stroke:#008000;
    style H fill:#c0ffc0,stroke:#008000;
```

## Detailed Steps with Progress

1.  **Stabilize Critical WordPress APIs (Highest Priority):** 🟡 In Progress
    *   **Action:** Investigate the `500 Internal Server Error` reported in the logs on the `madaratalkon.com` WordPress backend.
    *   **Verification:** Confirm if this error (or any other issues) affects the required API endpoints:
        *   `/wp/v2/destination` (Used for fetching destination data)
        *   `/wp/v2/trip` (Used for fetching trip data, including filtering by destination)
        *   `/wp/v2/posts` (Used for fetching blog posts)
        *   `/wp/v2/categories` (Used for fetching post categories)
    *   **Resolution:** Fix any identified issues on the WordPress server side for these specific endpoints. **This step is critical before proceeding with Next.js changes.**
    *   **Keep:** Retain the Next.js fetching logic for these endpoints in `src/lib/rest-api.js` and relevant page files (e.g., `src/pages/destinations/[slug]/trips.js`, `src/pages/posts/...`).
    *   **Current Status:** ⚠️ Need to verify stability of these endpoints with tests.

2.  **Remove & Replace Other WP Dependencies (Next.js Changes):** ✅ Mostly Complete
    *   **Menus:** ✅ Complete
        *   ✅ Removed calls to `getAllMenusREST` in `src/lib/rest-api.js` and dependent files.
        *   ✅ Created a local data source for menu structure in `src/data/menus.js`.
        *   ✅ Updated UI components (Header component) to use the local menu data.
    *   **General Pages (Non-Trip/Destination/Post):** ✅ Complete
        *   ✅ Removed calls to `getAllPagesREST` and `getPageByUriREST` from `src/lib/rest-api.js`.
        *   ✅ Identified general pages and implemented them locally in the `src/pages` directory.
        *   ✅ Created stubs in `src/data/pages.js` for backward compatibility.
    *   **Site Metadata:** ✅ Complete
        *   ✅ Created local site metadata in `src/data/site.js`.
        *   ✅ Created local function `getSiteMetadata()` to replace `getSiteMetadataREST()`.

3.  **Optimize & Clean Up:** 🟡 In Progress
    *   **Fetching:** 🟡 In Progress - Review the retained fetching logic (Trips, Destinations, Posts) for potential optimizations (e.g., efficient use of `_embed`, appropriate ISR `revalidate` values).
    *   **Other Issues:** ⏳ Not Started - Address remaining items identified in the logs:
        *   ⏳ Update or remove the invalid Google Places API key integration (`src/pages/api/google-reviews.js`).
        *   ⏳ Fix references to missing image assets (`/images/pattern.png`, `/images/hero-bg.jpg`).
        *   ⏳ Resolve duplicate page warnings (e.g., decide between `src/pages/posts.js` and `src/pages/posts/index.js`).
        *   ✅ Updated `next.config.js` to use `images.remotePatterns` instead of the deprecated `images.domains`.

## Next Steps (Remaining Work)

1. **Verify WordPress API Stability:**
   * Test all critical WordPress API endpoints (`/wp/v2/destination`, `/wp/v2/trip`, `/wp/v2/posts`, `/wp/v2/categories`) to ensure they are stable and returning expected data.
   * Document any errors encountered and apply fixes on the WordPress backend if needed.

2. **Complete Fetching Logic Optimization:**
   * Review all WordPress API calls in `src/lib/rest-api.js` for the kept endpoints (destinations, trips, posts).
   * Optimize data fetching with proper caching strategies and error handling.
   * Implement Incremental Static Regeneration (ISR) with appropriate revalidate intervals where applicable.
   * Add proper fallback mechanisms to handle API failures gracefully.

3. **Address Remaining Cleanup Items:**
   * Fix the Google Places API key issue:
     * Review `src/pages/api/google-reviews.js` and either update with a valid API key or remove the functionality if not needed.
   * Fix missing image assets:
     * Add proper image assets for `/images/pattern.png` and `/images/hero-bg.jpg` or update code to use existing assets.
   * Resolve duplicate page warnings:
     * Review and resolve conflicts between `src/pages/posts.js` and `src/pages/posts/index.js`.
     * Follow the same pattern for any other duplicate pages.
   * Remove any remaining dead code:
     * Clean up any unused functions, imports, or components that are no longer needed after decoupling.

4. **Testing and Performance Verification:**
   * Run comprehensive tests on all pages to ensure proper functionality.
   * Perform Lighthouse analysis on critical pages to measure performance improvements.
   * Test site behavior when WordPress API is slow or unavailable.
   * Document performance metrics before and after optimizations.

**Implementation Priority:**
1. Verify WordPress API stability (Critical)
2. Fix missing image assets (High)
3. Optimize fetching logic (Medium-High)
4. Address Google Places API key issue (Medium)
5. Resolve duplicate page warnings (Medium)
6. Final cleanup and testing (Medium)