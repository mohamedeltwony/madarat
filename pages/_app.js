import { useEffect, useCallback, Suspense, lazy } from 'react';
import { useRouter } from 'next/router';
import NextApp from 'next/app';
import Script from 'next/script';
import dynamic from 'next/dynamic';

import { SiteContext, useSiteContext } from '@/hooks/use-site';
import { SearchProvider } from '@/hooks/use-search';

import { getSiteMetadata } from '@/lib/site';
import { getRecentPosts } from '@/lib/posts';
import { getCategories } from '@/lib/categories';
import { trackPageView } from '@/utils/facebookTracking';
import { gtmPageView, initializeDataLayer } from '@/lib/gtm';
import { 
  initPerformanceMonitoring, 
  addResourceHints, 
  optimizeImageLoading,
  preloadCriticalResources 
} from '@/utils/performance';

// Import global Snapchat utilities for testing
import '@/utils/snapchatGlobal';

// Lazy load heavy components
const NextNProgress = dynamic(() => import('nextjs-progressbar'), {
  ssr: false,
  loading: () => null,
});

const FloatingButtons = dynamic(() => import('@/components/WhatsAppButton/WhatsAppButton'), {
  ssr: false,
  loading: () => null,
});

const PerformanceMonitor = dynamic(() => import('@/components/PerformanceMonitor'), {
  ssr: false,
  loading: () => null,
});

// Import styles with proper optimization
import '@/styles/globals.scss';
import '@/styles/wordpress.scss';
import '@/styles/global-overrides.css';
import variables from '@/styles/variables';

// Performance monitoring
const reportWebVitals = (metric) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_label: metric.id,
      non_interaction: true,
    });
  }
};

function App({ Component, pageProps = {} }) {
  // Initialize site context with optimized data
  const site = useSiteContext({
    metadata: pageProps.metadata || {},
    recentPosts: pageProps.recentPosts || [],
    categories: pageProps.categories || [],
    menus: pageProps.menus || [],
  });

  const router = useRouter();

  // Optimized trip page detection
  const isTripPage = useCallback(() => {
    const tripPaths = [
      '-trip', '/trip/', '/generic-trip', '/international-licence-trip',
      '/schengen-visa-trip', '/bosnia-trip', '/georgia-trip', '/azerbaijan-trip',
      '/poland-trip', '/italy-trip', '/russia-trip', '/turkey-trip',
      '/trabzon-wider-north-turkey', '/cruise-italy-spain-france', '/london-scotland-trip'
    ];
    return tripPaths.some(path => router.pathname.includes(path));
  }, [router.pathname]);

  // Check if current page is a thank you page
  const isThankYouPage = useCallback(() => {
    return router.pathname.includes('thank-you');
  }, [router.pathname]);

  // Optimized initialization with performance monitoring
  useEffect(() => {
    // Set RTL direction and language
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';

    // Initialize performance monitoring
    initPerformanceMonitoring();

    // Add resource hints for better performance
    addResourceHints();

    // Preload critical resources
    preloadCriticalResources();

    // Initialize GTM dataLayer
    initializeDataLayer();

    // Register service worker with better error handling (client-side only)
    // Temporarily disabled to fix build issues
    // if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    //   const registerSW = async () => {
    //     try {
    //       const registration = await navigator.serviceWorker.register('/service-worker.js');
    //       console.log('Service Worker registered:', registration.scope);
    //       
    //       // Update service worker when new version is available
    //       registration.addEventListener('updatefound', () => {
    //         const newWorker = registration.installing;
    //         if (newWorker) {
    //           newWorker.addEventListener('statechange', () => {
    //             if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
    //               // New service worker is available, prompt user to refresh
    //               if (confirm('تحديث جديد متاح. هل تريد إعادة تحميل الصفحة؟')) {
    //                 window.location.reload();
    //               }
    //             }
    //           });
    //         }
    //       });
    //     } catch (error) {
    //       console.error('Service Worker registration failed:', error);
    //     }
    //   };
    //   
    //   if (document.readyState === 'complete') {
    //     registerSW();
    //   } else {
    //     window.addEventListener('load', registerSW);
    //   }
    // }
    
    // Update Facebook parameters
    if (typeof window !== 'undefined') {
      updateFbParams();
    }

    // Optimize image loading after page load
    const optimizeImages = () => {
      optimizeImageLoading();
    };

    if (document.readyState === 'complete') {
      optimizeImages();
    } else {
      window.addEventListener('load', optimizeImages);
    }

    // Performance observer for Core Web Vitals
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
              // Track navigation timing
              if (window.gtag) {
                window.gtag('event', 'page_load_time', {
                  event_category: 'Performance',
                  value: Math.round(entry.loadEventEnd - entry.loadEventStart),
                });
              }
            }
          }
        });
        observer.observe({ entryTypes: ['navigation'] });
      } catch (e) {
        console.warn('Performance Observer not supported');
      }
    }

    // Cleanup function
    return () => {
      window.removeEventListener('load', optimizeImages);
    };
  }, []);
  
  // Optimized route change tracking
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleRouteChange = () => {
      // Debounced tracking to avoid multiple calls
      const trackingTimer = setTimeout(() => {
        updateFbParams();
        
        // Facebook Pixel tracking
        if (window.fbq) {
          trackPageView({
            content_name: document.title,
            content_category: router.pathname.split('/')[1] || 'home'
          });
        }

        // GTM tracking
        if (window.gtag) {
          gtmPageView({
            page_category: router.pathname.split('/')[1] || 'home',
            page_type: router.pathname === '/' ? 'homepage' : 'page',
            user_language: 'ar'
          });
        }

        // Re-optimize images on route change
        setTimeout(() => {
          optimizeImageLoading();
        }, 500);
      }, 100);

      return () => clearTimeout(trackingTimer);
    };

    handleRouteChange();
  }, [router.asPath, router.pathname]);

  // Google Ads tracking
  useEffect(() => {
    const handleRouteChange = (url) => {
      if (window.gtag) {
        window.gtag('config', 'AW-16691848441', {
          page_path: url,
        });
      }
    };
    
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  // Optimized cookie helper
  const getCookieValue = useCallback((name) => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
  }, []);

  // Determine if SearchProvider is needed
  const needsSearchProvider = ['/search', '/advanced-search', '/posts', '/blog']
    .some(path => router.pathname.startsWith(path));

  const AppContent = () => (
    <>
      <Suspense fallback={<div style={{ height: '4px', backgroundColor: variables.progressbarColor }} />}>
        <NextNProgress height={4} color={variables.progressbarColor} />
      </Suspense>
      <Component {...pageProps} />
      {!isTripPage() && !isThankYouPage() && (
        <Suspense fallback={null}>
          <FloatingButtons />
        </Suspense>
      )}
      <PerformanceMonitor />
    </>
  );

  return (
    <>
      <SiteContext.Provider value={site}>
        {needsSearchProvider ? (
          <SearchProvider>
            <AppContent />
          </SearchProvider>
        ) : (
          <AppContent />
        )}
      </SiteContext.Provider>

      {/* Optimized Facebook Pixel Code */}
      <Script
        id="fb-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            
            fbq('init', '330286163283402', {
              external_id: getUserExternalId()
            });
            
            const pageViewEventId = 'pv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);
            fbq('track', 'PageView', {}, {eventID: pageViewEventId});
            
            function getUserExternalId() {
              try {
                return localStorage.getItem('userId') || '';
              } catch (e) {
                return '';
              }
            }
          `,
        }}
      />

      {/* Optimized Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-16691848441"
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-16691848441', {
              page_title: document.title,
              page_location: window.location.href,
              send_page_view: true
            });
          `,
        }}
      />
    </>
  );
}

// Optimized Facebook parameters function
function updateFbParams() {
  if (typeof window === 'undefined') return;
  
  try {
    // Get fbp from cookie
    const fbpCookie = document.cookie.split(';').find(c => c.trim().startsWith('_fbp='));
    if (fbpCookie) {
      localStorage.setItem('_fbp', fbpCookie.split('=')[1]);
    }
    
    // Extract fbc from URL if present
    const url = new URL(window.location.href);
    const fbclid = url.searchParams.get('fbclid');
    if (fbclid) {
      const fbc = 'fb.1.' + Date.now() + '.' + fbclid;
      localStorage.setItem('_fbc', fbc);
      document.cookie = `_fbc=${fbc}; path=/; max-age=7776000; SameSite=Lax`;
    }
    
    // Store UTM parameters efficiently
    const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
    utmParams.forEach(param => {
      const value = url.searchParams.get(param);
      if (value) localStorage.setItem(param, value);
    });
  } catch (e) {
    console.error('Error capturing FB parameters:', e);
  }
}

// Export reportWebVitals for Next.js
export { reportWebVitals };
export default App;