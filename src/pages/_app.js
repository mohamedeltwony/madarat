import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import NextApp from 'next/app';
import Script from 'next/script';

import { SiteContext, useSiteContext } from '../hooks/use-site';
import { SearchProvider } from '../hooks/use-search';

import { getSiteMetadata } from '../lib/site';
import { getRecentPosts } from '../lib/posts';
import { getCategories } from '../lib/categories';
import NextNProgress from 'nextjs-progressbar';
import FloatingButtons from '../components/WhatsAppButton/WhatsAppButton';

import { trackPageView } from '../utils/facebookTracking';
import { gtmPageView, initializeDataLayer } from '../lib/gtm';

import '../styles/globals.scss';
import '../styles/wordpress.scss';
import '../styles/global-overrides.css';
import variables from '../styles/variables';

function App({ Component, pageProps = {} }) {
  // Initialize site context potentially empty or based on pageProps if provided by page
  // Individual pages are now responsible for fetching necessary data (like metadata, menus)
  // and potentially passing it via pageProps if needed by context/layout.
  // For now, initialize with what might come from pageProps, otherwise empty.
  const site = useSiteContext({
    metadata: pageProps.metadata || {},
    recentPosts: pageProps.recentPosts || [],
    categories: pageProps.categories || [],
    menus: pageProps.menus || [],
  });

  const router = useRouter();

  // Check if current page is a trip landing page
  const isTripPage = router.pathname.includes('-trip') || 
                     router.pathname.startsWith('/trips/') ||
                     router.pathname === '/generic-trip' ||
                     router.pathname === '/international-licence-trip' ||
                     router.pathname === '/schengen-visa-trip' ||
                     router.pathname === '/bosnia-trip' ||
                     router.pathname === '/georgia-trip' ||
                     router.pathname === '/azerbaijan-trip' ||
                     router.pathname === '/poland-trip' ||
                     router.pathname === '/italy-trip' ||
                     router.pathname === '/russia-trip' ||
                     router.pathname === '/turkey-trip' ||
                     router.pathname === '/trabzon-wider-north-turkey' ||
                     router.pathname === '/cruise-italy-spain-france' ||
                     router.pathname === '/london-scotland-trip';

  useEffect(() => {
    // Set RTL direction
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';

    // Initialize GTM dataLayer
    initializeDataLayer();

    // Register service worker
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then((registration) => {
            console.log(
              'Service Worker registered with scope:',
              registration.scope
            );
          })
          .catch((error) => {
            console.error('Service Worker registration failed:', error);
          });
      });
    }
    
    // Update Facebook parameters on route change
    if (typeof window !== 'undefined') {
      updateFbParams();
    }
  }, []);
  
  // Listen for route changes to update FB parameters and track page views
  useEffect(() => {
    if (typeof window !== 'undefined') {
      updateFbParams();
      
      // Track page view with Facebook Pixel
      if (window.fbq) {
        // Let the page finish loading before tracking the page view
        const timer = setTimeout(() => {
          trackPageView({
            content_name: document.title,
            content_category: router.pathname.split('/')[1] || 'home'
          });
        }, 500);
        
        return () => clearTimeout(timer);
      }

      // Track page view with GTM
      const gtmTimer = setTimeout(() => {
        gtmPageView({
          page_category: router.pathname.split('/')[1] || 'home',
          page_type: router.pathname === '/' ? 'homepage' : 'page',
          user_language: 'ar'
        });
      }, 300);

      return () => {
        clearTimeout(gtmTimer);
      };
    }
  }, [router.asPath, router.pathname]);

  // Track Google Ads page navigation
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

  // Helper function to get cookie value by name (wrapped in useCallback)
  const getCookieValue = useCallback((name) => {
    if (typeof document === 'undefined') {
      return null; // Return null on server-side
    }
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }, []);

  return (
    <>
      <SiteContext.Provider value={site}>
        {/* Conditionally render SearchProvider */}
        {[
          '/search',
          '/advanced-search',
          '/posts',
          '/blog',
          // Add other paths that need SearchProvider if necessary
        ].some(
          (
            path // Break after arrow
          ) => router.pathname.startsWith(path) // Condition on new line
        ) ? (
          <SearchProvider>
            <NextNProgress height={4} color={variables.progressbarColor} />
            <Component {...pageProps} />
            {!isTripPage && <FloatingButtons />}
          </SearchProvider>
        ) : (
          <>
            {/* Render without SearchProvider for other pages (e.g., landing pages) */}
            <NextNProgress height={4} color={variables.progressbarColor} />
            <Component {...pageProps} />
            {!isTripPage && <FloatingButtons />}
          </>
        )}
      </SiteContext.Provider>



      {/* Facebook Pixel Code */}
      <Script
        id="fb-pixel"
        strategy="lazyOnload"
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
            
            // Initialize with additional parameters for better matching
            fbq('init', '330286163283402', {
              external_id: getUserExternalId()
            });
            
            // Track PageView on all pages with event ID for deduplication
            const pageViewEventId = 'pv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);
            fbq('track', 'PageView', {}, {eventID: pageViewEventId});
            
            // Helper function to get user ID if available
            function getUserExternalId() {
              // Return user ID from your auth system if available
              return localStorage.getItem('userId') || '';
            }
            
            // Capture and store fbp and fbc parameters
            function updateFbParams() {
              try {
                // Get fbp from cookie
                const fbp = document.cookie.split(';').find(c => c.trim().startsWith('_fbp='));
                if (fbp) {
                  localStorage.setItem('_fbp', fbp.split('=')[1]);
                }
                
                // Extract fbc from URL if present
                const url = new URL(window.location.href);
                const fbclid = url.searchParams.get('fbclid');
                if (fbclid) {
                  const fbc = 'fb.1.' + Date.now() + '.' + fbclid;
                  localStorage.setItem('_fbc', fbc);
                  
                  // Also store in cookie for better cross-page tracking
                  document.cookie = '_fbc=' + fbc + '; path=/; max-age=7776000; SameSite=Lax';
                }
                
                // Check for other standard UTM parameters
                const utm_source = url.searchParams.get('utm_source');
                const utm_medium = url.searchParams.get('utm_medium');
                const utm_campaign = url.searchParams.get('utm_campaign');
                
                if (utm_source) localStorage.setItem('utm_source', utm_source);
                if (utm_medium) localStorage.setItem('utm_medium', utm_medium);
                if (utm_campaign) localStorage.setItem('utm_campaign', utm_campaign);
              } catch (e) {
                console.error('Error capturing FB parameters:', e);
              }
            }
            
            // Call on page load
            updateFbParams();
          `,
        }}
      />

      {/* Google tag (gtag.js) */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-16691848441"
        strategy="lazyOnload"
      />
      <Script
        id="google-analytics"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-16691848441');
          `,
        }}
      />
    </>
  );
}

// Add global function for updateFbParams
function updateFbParams() {
  try {
    if (typeof window === 'undefined') return;
    
    // Get fbp from cookie
    const fbp = document.cookie.split(';').find(c => c.trim().startsWith('_fbp='));
    if (fbp) {
      localStorage.setItem('_fbp', fbp.split('=')[1]);
    }
    
    // Extract fbc from URL if present
    const url = new URL(window.location.href);
    const fbclid = url.searchParams.get('fbclid');
    if (fbclid) {
      const fbc = 'fb.1.' + Date.now() + '.' + fbclid;
      localStorage.setItem('_fbc', fbc);
      
      // Also set as cookie for better cross-page tracking
      document.cookie = '_fbc=' + fbc + '; path=/; max-age=7776000; SameSite=Lax';
    }
    
    // Store UTM parameters
    const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
    utmParams.forEach(param => {
      const value = url.searchParams.get(param);
      if (value) localStorage.setItem(param, value);
    });
  } catch (e) {
    console.error('Error capturing FB parameters:', e);
  }
}

export default App;