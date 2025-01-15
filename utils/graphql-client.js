import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const graphqlUrl = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL?.trim() || 'https://madaratalkon.com/graphql';
console.log('🌐 GraphQL URL:', graphqlUrl);

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

console.log('🚀 Apollo Client initialized');

// Debug query to check available content types and post types
const DEBUG_QUERY = gql`
  query DebugQuery {
    contentTypes {
      nodes {
        name
        graphqlSingleName
        graphqlPluralName
        label
      }
    }
    trips(first: 100) {
      nodes {
        id
        title
        status
      }
    }
  }
`;

console.log('🔍 Running debug query to check WordPress setup...');

// Run debug query with better error handling
client.query({
  query: DEBUG_QUERY
}).then(result => {
  console.log('=== WordPress GraphQL Debug Info ===');
  
  if (result.data?.contentTypes?.nodes) {
    console.log('📚 Available Content Types:');
    result.data.contentTypes.nodes.forEach(type => {
      console.log(`  - ${type.label} (${type.name})`);
      console.log(`    GraphQL: Single: ${type.graphqlSingleName}, Plural: ${type.graphqlPluralName}`);
    });
  } else {
    console.warn('⚠️ No content types found');
  }
  
  if (result.data?.trips?.nodes) {
    console.log('🏷️ Available Trips:');
    result.data.trips.nodes.forEach(trip => {
      console.log(`  - ${trip.title} (ID: ${trip.id}) - Status: ${trip.status}`);
    });
  } else {
    console.warn('⚠️ No trips found');
  }
  
  if (result.errors) {
    console.error('❌ GraphQL Query Errors:', result.errors);
  }
}).catch(error => {
  console.error('❌ GraphQL Debug Query Error:', {
    message: error.message,
    networkError: error.networkError?.result?.errors || error.networkError,
    graphQLErrors: error.graphQLErrors,
  });
});

// Query to get all published trips
export const GET_TRIPS = gql`
  query GetTrips {
    trips(first: 100, where: { status: PUBLISH }) {
      nodes {
        id
        title
        slug
        excerpt
        content
        featuredImage {
          node {
            sourceUrl
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

console.log('📦 GET_TRIPS query prepared:', GET_TRIPS.loc?.source.body);

// Query to get all published destinations
export const GET_DESTINATIONS = gql`
  query GetDestinations {
    trips(first: 100, where: { status: PUBLISH }) {
      nodes {
        id
        title
        slug
        excerpt
        content
        featuredImage {
          node {
            sourceUrl
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

console.log('🌍 GET_DESTINATIONS query prepared:', GET_DESTINATIONS.loc?.source.body);

// Query to get a single trip by slug
export const GET_TRIP_BY_SLUG = gql`
  query GetTripBySlug($slug: ID!) {
    trip(id: $slug, idType: SLUG) {
      id
      title
      content
      excerpt
      featuredImage {
        node {
          sourceUrl
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
    }
  }
`;

console.log('🎯 GET_TRIP_BY_SLUG query prepared:', GET_TRIP_BY_SLUG.loc?.source.body);

// Add event listener for unhandled promise rejections
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', event => {
    console.error('❌ Unhandled Promise Rejection:', {
      reason: event.reason,
      message: event.reason?.message,
      stack: event.reason?.stack
    });
  });
} 