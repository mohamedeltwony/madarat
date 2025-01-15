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
const DEBUG_QUERY = gql`
  query DebugQuery {
    # Check content types
    contentTypes {
      nodes {
        name
        graphqlSingleName
        graphqlPluralName
        label
        isCustom
      }
    }
    # Check taxonomies
    taxonomies {
      nodes {
        name
        graphqlSingleName
        graphqlPluralName
        label
      }
    }
    # Check categories
    categories {
      nodes {
        name
        slug
        count
      }
    }
    # Check all registered types
    types {
      __typename
    }
    # Check if trips post type exists
    trips {
      nodes {
        id
        title
        slug
      }
    }
  }
`;

// Run debug queries on startup
client.query({
  query: DEBUG_QUERY
}).then(result => {
  console.log('=== WordPress GraphQL Debug Info ===');
  console.log('Content Types:', JSON.stringify(result.data?.contentTypes?.nodes, null, 2));
  console.log('Taxonomies:', JSON.stringify(result.data?.taxonomies?.nodes, null, 2));
  console.log('Categories:', JSON.stringify(result.data?.categories?.nodes, null, 2));
  console.log('Available Types:', JSON.stringify(result.data?.types, null, 2));
  if (result.data?.trips) {
    console.log('Trips:', JSON.stringify(result.data?.trips?.nodes, null, 2));
  }
}).catch(error => {
  console.error('GraphQL Debug Query Error:', {
    message: error.message,
    networkError: error.networkError?.result,
    graphQLErrors: error.graphQLErrors,
  });
});

// Query to get all published trips
export const GET_TRIPS = gql`
  query GetTrips {
    posts(first: 100, where: { status: PUBLISH, categoryName: "tours" }) {
      nodes {
        id
        title
        slug
        date
        excerpt
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
    posts(first: 100, where: { status: PUBLISH, categoryName: "destinations" }) {
      nodes {
        id
        title
        slug
        excerpt
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
      featuredImage {
        node {
          sourceUrl
        }
      }
    }
  }
`; 