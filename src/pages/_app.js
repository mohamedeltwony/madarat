import { ApolloProvider } from '@apollo/client';
import { useEffect } from 'react';
import client from '@/lib/apollo-client';
import '@/styles/globals.css';
import { SiteContext, useSiteContext } from '@/hooks/use-site';

export default function App({ Component, pageProps }) {
  const site = useSiteContext(pageProps.site);

  useEffect(() => {
    // Remove the server-side injected CSS
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <ApolloProvider client={client}>
      <SiteContext.Provider value={site}>
        <Component {...pageProps} />
      </SiteContext.Provider>
    </ApolloProvider>
  );
}
