import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { setContext } from '@apollo/client/link/context';
import { removeLastTrailingSlash } from '@/lib/util';

let client;

/**
 * getApolloClient
 */

export function getApolloClient() {
  if (!client) {
    client = _createApolloClient();
  }
  return client;
}

/**
 * createApolloClient
 */

export function _createApolloClient() {
  const WORDPRESS_GRAPHQL_ENDPOINT = process.env.WORDPRESS_GRAPHQL_ENDPOINT;

  // Create an error link for handling GraphQL and network errors
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        );
      });
    }

    if (networkError) {
      console.error(`[Network error]: ${networkError}`);
    }
  });

  // Create a retry link with exponential backoff
  const retryLink = new RetryLink({
    delay: {
      initial: 300,
      max: 3000,
      jitter: true
    },
    attempts: {
      max: 5,
      retryIf: (error, _operation) => {
        // Retry on network errors or 5xx server errors
        return !!(
          error &&
          error.statusCode &&
          (error.statusCode >= 500 || error.statusCode === 403)
        );
      }
    }
  });

  // Create an HTTP link with timeout
  const httpLink = createHttpLink({
    uri: WORDPRESS_GRAPHQL_ENDPOINT,
    fetchOptions: {
      timeout: 30000, // 30 seconds
    },
    credentials: 'same-origin'
  });

  // Create an auth link to add headers
  const authLink = setContext((_, { headers }) => {
    // Get the authentication token from local storage if it exists
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    // Return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; MadaratBot/1.0; +https://madaratalkon.com)',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    };
  });

  // Create the Apollo Client instance
  const client = new ApolloClient({
    link: from([errorLink, retryLink, authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
        timeout: 30000
      },
      watchQuery: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
        timeout: 30000
      }
    }
  });

  return client;
}
