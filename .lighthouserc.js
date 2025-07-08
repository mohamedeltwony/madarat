module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000',
        'http://localhost:3000/tours',
        'http://localhost:3000/tour-list-1',
        'http://localhost:3000/tour-single-1',
      ],
      startServerCommand: 'npm run start',
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        // Core Web Vitals
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],

        // Performance metrics
        'speed-index': ['error', { maxNumericValue: 3000 }],
        'interactive': ['error', { maxNumericValue: 4000 }],
        
        // Bundle size
        'total-byte-weight': ['warn', { maxNumericValue: 1500000 }], // 1.5MB
        'unused-javascript': ['warn', { maxNumericValue: 200000 }], // 200KB
        'unused-css-rules': ['warn', { maxNumericValue: 50000 }], // 50KB

        // Best practices
        'uses-optimized-images': 'error',
        'uses-webp-images': 'warn',
        'uses-responsive-images': 'error',
        'efficient-animated-content': 'warn',
        'preload-lcp-image': 'warn',

        // Accessibility
        'color-contrast': 'error',
        'image-alt': 'error',
        'heading-order': 'warn',

        // SEO
        'meta-description': 'error',
        'document-title': 'error',
        'robots-txt': 'warn',

        // PWA
        'service-worker': 'off', // Will enable when SW is implemented
        'installable-manifest': 'off',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
    server: {
      port: 9001,
      storage: './lighthouse-reports',
    },
  },
};