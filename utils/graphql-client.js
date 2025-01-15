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

// First, let's query all available post types
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
  }
`;

// Simpler query to get all published posts
export const GET_TRIPS = gql`
  query GetTrips {
    posts(first: 100, where: { status: PUBLISH, contentType: "tour" }) {
      nodes {
        id
        title
        slug
        date
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

export const GET_DESTINATIONS = gql`
  query GetDestinations {
    posts(first: 100, where: { status: PUBLISH, contentType: "destination" }) {
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

// Run debug queries on startup
client.query({
  query: DEBUG_QUERY
}).then(result => {
  console.log('Available Content Types:', JSON.stringify(result.data?.contentTypes?.nodes, null, 2));
}).catch(error => {
  console.error('GraphQL Debug Query Error:', {
    message: error.message,
    networkError: error.networkError?.result,
    graphQLErrors: error.graphQLErrors,
  });
});

// Test query to get all posts
client.query({
  query: GET_TRIPS
}).then(result => {
  console.log('All Posts:', JSON.stringify(result.data?.posts?.nodes, null, 2));
}).catch(error => {
  console.error('GraphQL Posts Query Error:', {
    message: error.message,
    networkError: error.networkError?.result,
    graphQLErrors: error.graphQLErrors,
  });
}); 