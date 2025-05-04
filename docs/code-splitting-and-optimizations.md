# Code Splitting and Optimizations Documentation

## Overview

This document outlines the code splitting and optimization strategies implemented in the Madarat Alkon website to improve performance, reduce bundle size, and enhance user experience.

## Implemented Optimizations

### 1. Code Splitting with Dynamic Imports

We've implemented code splitting using Next.js's dynamic import functionality to reduce the initial bundle size and improve page load times.

#### Heavy Components Lazy Loading

```javascript
// Dynamic imports for heavy components
const BentoDestinations = dynamic(() => import('@/components/BentoDestinations'), {
  loading: () => <div className={styles.loadingContainer}>جاري تحميل الوجهات...</div>,
  ssr: true
});

const OfferTrips = dynamic(() => import('@/components/OfferTrips'), {
  loading: () => <div className={styles.loadingContainer}>جاري تحميل الرحلات...</div>,
  ssr: true
});

const GoogleReviewsSection = dynamic(() => import('@/components/GoogleReviewsSection'), {
  loading: () => <div className={styles.loadingContainer}>جاري تحميل التقييمات...</div>,
  ssr: false // Client-side render only to reduce initial load
});
```

Key components that were identified as candidates for dynamic loading:
- `BentoDestinations` - Large component for displaying destination cards
- `OfferTrips` - Component with complex animations for trip offers
- `GoogleReviewsSection` - Component that displays Google reviews (loaded client-side only)

#### React.lazy and Suspense for UI Components

For smaller but still substantial UI components, we've used React's lazy loading with Suspense:

```javascript
// Lazy load SparkleButton component
const SparkleButtonLazy = lazy(() => import('./SparkleButton'));

// Exported SparkleButton with Suspense
export const SparkleButton = (props) => (
  <Suspense fallback={<SparkleButtonFallback {...props} />}>
    <SparkleButtonLazy {...props} />
  </Suspense>
);
```

### 2. Icon Library Optimization

We've optimized the loading of React icons by dynamically importing only the specific icons that are needed:

```javascript
// Dynamically import react-icons to reduce initial bundle size
export const FaChevronLeft = dynamic(() => import('react-icons/fa').then(mod => mod.FaChevronLeft));
export const FaChevronRight = dynamic(() => import('react-icons/fa').then(mod => mod.FaChevronRight));
```

This prevents loading the entire icon library when only a few icons are actually used.

### 3. Service Worker Implementation

We've implemented a service worker for:
- Offline support with cached assets
- Different caching strategies for different resource types
- Improved repeated visit performance

### 4. Image Optimization

The following image optimizations were implemented:
- Lazy loading images with Next.js Image component
- Adding placeholder/shimmer effects during loading
- Proper handling of image loading errors
- Prioritizing above-the-fold images

### 5. API Data Fetching Improvements

- Added in-memory caching to reduce repeat API calls
- Implemented proper error handling for API failures
- Set up appropriate revalidation intervals for better ISR performance

## Hybrid Architecture

The website now follows a hybrid architecture approach:

1. **WordPress Integration (Dynamic Content):**
   - Trips data
   - Destinations data
   - Blog posts and categories

2. **Next.js Local Data (Static Content):**
   - Menus
   - Site metadata
   - General pages

This architecture provides better reliability and performance while still allowing content editors to update the most important dynamic content through WordPress.

## Maintenance Guidelines

### Adding New Components

When adding new components:
1. Evaluate if the component should be dynamically imported
2. For large components, use `next/dynamic`
3. For medium components, consider using React.lazy with Suspense
4. Ensure proper loading states are provided

### Managing Icons

1. Add new icons to the `src/components/icons.js` file
2. Always import icons from this file rather than directly from react-icons

### Bundle Analysis

1. Run bundle analysis with `npm run analyze` or `pnpm analyze`
2. Look for:
   - Large dependencies that could be lazy loaded
   - Duplicate dependencies
   - Unused or unnecessary code

### WordPress API Integration

1. Always include proper error handling for API requests
2. Use the in-memory cache system to prevent redundant API calls
3. Set appropriate revalidation intervals based on how frequently content changes 