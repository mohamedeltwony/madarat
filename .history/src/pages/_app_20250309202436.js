import { useEffect } from 'react';
import { useRouter } from 'next/router';
import NextApp from 'next/app';

import { SiteContext, useSiteContext } from '../hooks/use-site';
import { SearchProvider } from '../hooks/use-search';

import { getSiteMetadata } from '../lib/site';
import { getRecentPosts } from '../lib/posts';
import { getCategories } from '../lib/categories';
import NextNProgress from 'nextjs-progressbar';
import { getAllMenus } from '../lib/menus';

import '../styles/globals.scss';
import '../styles/wordpress.scss';
import variables from '../styles/variables';

function App({ Component, pageProps = {}, metadata, recentPosts, categories, menus }) {
  const site = useSiteContext({
    metadata,
    recentPosts,
    categories,
    menus,
  });

  const router = useRouter();

  useEffect(() => {
    // Set RTL direction
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
  }, []);

  return (
    <SiteContext.Provider value={site}>
      <SearchProvider>
        <NextNProgress height={4} color={variables.progressbarColor} />
        <Component {...pageProps} />
      </SearchProvider>
    </SiteContext.Provider>
  );
}

App.getInitialProps = async function (appContext) {
  const appProps = await NextApp.getInitialProps(appContext);

  const { posts: recentPosts } = await getRecentPosts({
    count: 5,
    queryIncludes: 'index',
  });

  const { categories } = await getCategories({
    count: 5,
  });

  const { menus = [] } = await getAllMenus();

  return {
    ...appProps,
    metadata: await getSiteMetadata(),
    recentPosts,
    categories,
    menus,
  };
};

export default App;
