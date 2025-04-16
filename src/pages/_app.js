import { useEffect } from 'react';
import { useRouter } from 'next/router';
import NextApp from 'next/app';
import { ApolloProvider } from '@apollo/client'; // Import ApolloProvider

import { SiteContext, useSiteContext } from '../hooks/use-site';
import { SearchProvider } from '../hooks/use-search';

import { getSiteMetadata } from '../lib/site';
import { getRecentPosts } from '../lib/posts';
import { getCategories } from '../lib/categories';
import NextNProgress from 'nextjs-progressbar';
import { getAllMenus } from '../lib/menus';
import { getApolloClient } from '../lib/apollo-client'; // Import Apollo Client instance

import '../styles/globals.scss';
import '../styles/wordpress.scss';
import variables from '../styles/variables';

function App({
  Component,
  pageProps = {},
  metadata,
  recentPosts,
  categories,
  menus,
}) {
  const site = useSiteContext({
    metadata,
    recentPosts,
    categories,
    menus,
  });

  const router = useRouter();
  const apolloClient = getApolloClient(); // Get Apollo Client instance

  useEffect(() => {
    // Set RTL direction
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
  }, []);

  // Facebook Pixel PageView Tracking

  // Effect for INITIAL PageView
  useEffect(() => {
    // Use a slightly longer delay for the initial load, hoping fbq initializes
    const initialTimer = setTimeout(() => {
      if (typeof window.fbq === 'function' && window.fbq.queue) {
        console.log('[Pixel] Tracking INITIAL PageView (after delay)');
        window.fbq('track', 'PageView');
      } else {
        console.log('[Pixel] fbq not ready for initial PageView');
      }
    }, 150); // 150ms delay for initial load

    return () => clearTimeout(initialTimer); // Cleanup timeout
  }, []); // Empty dependency array ensures this runs only once on mount

  // Effect for SUBSEQUENT PageViews on route change
  useEffect(() => {
    const handleRouteChange = (url) => {
      // Use a shorter delay for subsequent navigations
      const routeChangeTimer = setTimeout(() => {
        if (typeof window.fbq === 'function' && window.fbq.queue) {
          console.log(
            `[Pixel] Tracking PageView for route change: ${url} (after delay)`
          );
          window.fbq('track', 'PageView');
        } else {
          console.log(
            `[Pixel] fbq not ready for route change PageView: ${url}`
          );
        }
      }, 50); // 50ms delay
      // Store timer ID on router object dynamically for potential cleanup
      router.routeChangeTimerId = routeChangeTimer;
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    // Cleanup function
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      // Clear timeout if the component unmounts before the timeout fires
      if (router.routeChangeTimerId) {
        clearTimeout(router.routeChangeTimerId);
      }
    };
  }, [router.events, router]); // Add router to dependency array

  return (
    // Wrap everything with ApolloProvider
    <ApolloProvider client={apolloClient}>
      <SiteContext.Provider value={site}>
        <SearchProvider>
          <NextNProgress height={4} color={variables.progressbarColor} />
          <Component {...pageProps} />
        </SearchProvider>
      </SiteContext.Provider>
    </ApolloProvider>
  );
}

App.getInitialProps = async function (appContext) {
  const appProps = await NextApp.getInitialProps(appContext);
  const { pathname } = appContext.ctx; // Get the current page pathname

  // Default values for props in case we skip fetching
  let recentPosts = [];
  let categories = [];
  let menus = [];
  let metadata = {}; // Assuming getSiteMetadata returns an object

  // Only fetch global data if not on a thank you page
  if (pathname !== '/thank-you-citizen' && pathname !== '/thank-you-resident') {
    console.log(`Fetching global data for page: ${pathname}`);
    try {
      // Fetch metadata first as it might be less prone to failure
      metadata = await getSiteMetadata();

      // Use Promise.allSettled to fetch others concurrently and handle potential errors gracefully
      const results = await Promise.allSettled([
        getRecentPosts({ count: 5, queryIncludes: 'index' }),
        getCategories({ count: 5 }),
        getAllMenus(),
      ]);

      // Assign results if fulfilled
      if (results[0].status === 'fulfilled') {
        recentPosts = results[0].value?.posts || [];
      } else {
        console.error('Failed to get recent posts in _app:', results[0].reason);
      }

      if (results[1].status === 'fulfilled') {
        categories = results[1].value?.categories || [];
      } else {
        console.error('Failed to get categories in _app:', results[1].reason);
      }

      if (results[2].status === 'fulfilled') {
        menus = results[2].value?.menus || [];
      } else {
        console.error('Failed to get menus in _app:', results[2].reason);
      }
    } catch (error) {
      console.error('Error fetching site metadata in _app:', error);
      // Keep default empty metadata object
    }
  } else {
    console.log(`Skipping global data fetch for thank you page: ${pathname}`);
    // Fetch only essential site metadata if needed even on thank you pages
    // Assuming getSiteMetadata is essential for layout/head tags
    try {
      metadata = await getSiteMetadata();
    } catch (error) {
      console.error('Error fetching site metadata on thank you page:', error);
    }
  }

  // const { posts: recentPosts } = await getRecentPosts({ // OLD CODE
  // }); // OLD CODE

  // const { categories } = await getCategories({ // OLD CODE
  //   count: 5, // OLD CODE
  // }); // OLD CODE

  // const { menus = [] } = await getAllMenus(); // OLD CODE

  return {
    ...appProps,
    // metadata: await getSiteMetadata(), // OLD CODE - metadata is now fetched conditionally above
    metadata, // Use the conditionally fetched metadata
    recentPosts, // Add the conditionally fetched or default value
    categories, // Add the conditionally fetched or default value
    menus, // Add the conditionally fetched or default value
  };
};

export default App;
