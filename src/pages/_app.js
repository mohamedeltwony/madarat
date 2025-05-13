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

  useEffect(() => {
    // Set RTL direction
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';

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
  }, []);

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
            <FloatingButtons />
          </SearchProvider>
        ) : (
          <>
            {/* Render without SearchProvider for other pages (e.g., landing pages) */}
            <NextNProgress height={4} color={variables.progressbarColor} />
            <Component {...pageProps} />
            <FloatingButtons />
          </>
        )}
      </SiteContext.Provider>

      {/* Facebook Pixel Code */}
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
            fbq('init', '275826455249702');
            fbq('track', 'PageView');
          `,
        }}
      />
    </>
  );
}

export default App;
