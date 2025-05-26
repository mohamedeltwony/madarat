import { useEffect } from 'react';

const PerformanceMonitor = () => {
  useEffect(() => {
    // Only run in production and if performance API is available
    if (process.env.NODE_ENV !== 'production' || typeof window === 'undefined') {
      return;
    }

    // Track Core Web Vitals
    const trackWebVitals = () => {
      // LCP (Largest Contentful Paint)
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            
            if (lastEntry) {
              console.log('LCP:', lastEntry.startTime);
              
              // Send to analytics if needed
              if (typeof window.gtag !== 'undefined') {
                window.gtag('event', 'web_vitals', {
                  name: 'LCP',
                  value: Math.round(lastEntry.startTime),
                  event_category: 'Performance',
                });
              }
            }
          });
          
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

          // FID (First Input Delay)
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              console.log('FID:', entry.processingStart - entry.startTime);
              
              if (typeof window.gtag !== 'undefined') {
                window.gtag('event', 'web_vitals', {
                  name: 'FID',
                  value: Math.round(entry.processingStart - entry.startTime),
                  event_category: 'Performance',
                });
              }
            });
          });
          
          fidObserver.observe({ entryTypes: ['first-input'] });

          // CLS (Cumulative Layout Shift)
          let clsValue = 0;
          const clsObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            });
            
            console.log('CLS:', clsValue);
            
            if (typeof window.gtag !== 'undefined') {
              window.gtag('event', 'web_vitals', {
                name: 'CLS',
                value: Math.round(clsValue * 1000),
                event_category: 'Performance',
              });
            }
          });
          
          clsObserver.observe({ entryTypes: ['layout-shift'] });

          // Clean up observers on page unload
          window.addEventListener('beforeunload', () => {
            lcpObserver.disconnect();
            fidObserver.disconnect();
            clsObserver.disconnect();
          });

        } catch (error) {
          console.warn('Performance monitoring failed:', error);
        }
      }

      // Track page load time
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0];
          if (navigation) {
            const loadTime = navigation.loadEventEnd - navigation.fetchStart;
            console.log('Page Load Time:', loadTime);
            
            if (typeof window.gtag !== 'undefined') {
              window.gtag('event', 'page_load_time', {
                value: Math.round(loadTime),
                event_category: 'Performance',
              });
            }
          }
        }, 0);
      });
    };

    // Initialize tracking
    trackWebVitals();

    // Track resource loading issues
    const trackResourceErrors = () => {
      window.addEventListener('error', (event) => {
        if (event.target !== window) {
          console.warn('Resource failed to load:', event.target.src || event.target.href);
          
          if (typeof window.gtag !== 'undefined') {
            window.gtag('event', 'resource_error', {
              resource_url: event.target.src || event.target.href,
              event_category: 'Performance',
            });
          }
        }
      }, true);
    };

    trackResourceErrors();

  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceMonitor; 