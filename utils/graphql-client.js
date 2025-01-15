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

// Simpler debug query to test basic connectivity
const DEBUG_QUERY = gql`
  query DebugQuery {
    # Test if we can get any posts
    posts {
      nodes {
        id
        title
        status
      }
    }
    # Test if categories work
    categories {
      nodes {
        id
        name
      }
    }
  }
`;

// Run debug query with better error handling
client.query({
  query: DEBUG_QUERY
}).then(result => {
  console.log('=== WordPress GraphQL Debug Info ===');
  console.log('Raw Response:', result);
  if (result.data?.posts?.nodes) {
    console.log('Posts found:', result.data.posts.nodes.length);
    console.log('First few posts:', result.data.posts.nodes.slice(0, 3));
  }
  if (result.data?.categories?.nodes) {
    console.log('Categories found:', result.data.categories.nodes.length);
    console.log('Category names:', result.data.categories.nodes.map(cat => cat.name));
  }
}).catch(error => {
  console.error('GraphQL Debug Query Error:', {
    message: error.message,
    networkError: error.networkError?.result?.errors || error.networkError,
    graphQLErrors: error.graphQLErrors,
    stack: error.stack,
  });
});

// Query to get all published trips
export const GET_TRIPS = gql`
  query GetTrips {
    posts(first: 100, where: { status: PUBLISH }) {
      nodes {
        id
        title
        slug
        date
        excerpt
        categories {
          nodes {
            name
            slug
          }
        }
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  }
`;

// Query to get all published destinations
export const GET_DESTINATIONS = gql`
  query GetDestinations {
    posts(first: 100, where: { status: PUBLISH }) {
      nodes {
        id
        title
        slug
        excerpt
        categories {
          nodes {
            name
            slug
          }
        }
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  }
`;

// Query to get a single post by slug
export const GET_TRIP_BY_SLUG = gql`
  query GetTripBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      title
      content
      categories {
        nodes {
          name
          slug
        }
      }
      featuredImage {
        node {
          sourceUrl
        }
      }
    }
  }
`; 