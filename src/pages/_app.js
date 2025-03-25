import { ApolloProvider } from '@apollo/client';
import { useEffect } from 'react';
import client from '@/lib/apollo-client';
import '@/styles/globals.css';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Remove the server-side injected CSS
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
