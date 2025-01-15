import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const graphqlUrl = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL?.trim() || 'https://madaratalkon.com/graphql';
console.log('Using GraphQL URL:', graphqlUrl);

export const client = new ApolloClient({
  uri: graphqlUrl,
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
});

// Debug query to see what's available
export const DEBUG_QUERY = gql`
  query DebugQuery {
    contentTypes {
      nodes {
        name
        graphqlSingleName
        graphqlPluralName
        label
      }
    }
    posts(first: 100) {
      nodes {
        id
        title
        slug
        status
        contentTypeName
      }
    }
  }
`;

// Simple query to get all posts
export const GET_TRIPS = gql`
  query GetTrips {
    posts(first: 100, where: { status: PUBLISH }) {
      nodes {
        id
        title
        slug
        status
        contentTypeName
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  }
`;

// Run debug query on startup
client.query({
  query: DEBUG_QUERY
}).then(result => {
  console.log('Available Content Types:', JSON.stringify(result.data?.contentTypes?.nodes, null, 2));
  console.log('All Posts:', JSON.stringify(result.data?.posts?.nodes, null, 2));
}).catch(error => {
  console.error('GraphQL Debug Query Error:', {
    message: error.message,
    networkError: error.networkError?.result,
    graphQLErrors: error.graphQLErrors,
  });
}); 