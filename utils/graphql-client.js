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

// Debug query to check available content types and fields
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
    allTrips {
      id
      title
    }
    posts(first: 5) {
      nodes {
        __typename
        id
        title
        status
        contentType {
          node {
            name
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

// Query to get all published trips
export const GET_TRIPS = gql`
  query GetTrips {
    allTrips {
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
      tripFields {
        price
        duration
        location
        difficulty
        gallery
        itinerary
        included
        notIncluded
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

// Query to get a single trip by slug
export const GET_TRIP_BY_SLUG = gql`
  query GetTripBySlug($id: ID!) {
    trip(id: $id) {
      id
      title
      content
      excerpt
      tripFields {
        price
        duration
        location
        difficulty
        gallery
        itinerary
        included
        notIncluded
      }
    }
  }
`;

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
  
  if (result.data?.allTrips) {
    console.log('🎫 Available Trips:', result.data.allTrips.length);
    result.data.allTrips.forEach(trip => {
      console.log(`  - [${trip.id}] ${trip.title}`);
    });
  } else {
    console.warn('⚠️ No trips found or allTrips not available');
  }

  if (result.errors) {
    console.error('❌ GraphQL Query Errors:', JSON.stringify(result.errors, null, 2));
  }
}).catch(error => {
  console.error('❌ GraphQL Debug Query Error:', {
    message: error.message,
    networkError: error.networkError?.result?.errors || error.networkError,
    graphQLErrors: error.graphQLErrors
  });
});

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