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

// First, let's query all available post types and categories
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
    categories {
      nodes {
        name
        slug
        count
      }
    }
  }
`;

// Query to get all published trips
export const GET_TRIPS = gql`
  query GetTrips {
    trips(first: 100, where: { status: PUBLISH }) {
      nodes {
        id
        title
        slug
        date
        status
        featuredImage {
          node {
            sourceUrl
          }
        }
        tripFields {
          price
          duration
          location
        }
      }
    }
  }
`;

// Query to get all published destinations
export const GET_DESTINATIONS = gql`
  query GetDestinations {
    destinations(first: 100, where: { status: PUBLISH }) {
      nodes {
        id
        title
        slug
        status
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  }
`;

// Query to get a single trip by slug
export const GET_TRIP_BY_SLUG = gql`
  query GetTripBySlug($slug: ID!) {
    trip(id: $slug, idType: SLUG) {
      id
      title
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
        itinerary
        included
        notIncluded
        gallery {
          sourceUrl
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
  console.log('Available Categories:', JSON.stringify(result.data?.categories?.nodes, null, 2));
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