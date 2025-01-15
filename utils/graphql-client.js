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

export const GET_TRIPS = gql`
  query GetTrips {
    posts(where: { status: PUBLISH, postType: TRIP }) {
      nodes {
        id
        title
        slug
        date
        featuredImage {
          node {
            sourceUrl
          }
        }
        ... on Trip {
          tripFields {
            price
            duration
            location
          }
        }
      }
    }
  }
`;

export const GET_DESTINATIONS = gql`
  query GetDestinations {
    posts(where: { status: PUBLISH, postType: DESTINATION }) {
      nodes {
        id
        title
        slug
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  }
`;

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

// Add debug query to check schema
export const DEBUG_QUERY = gql`
  query DebugQuery {
    contentTypes {
      nodes {
        name
        graphqlSingleName
        graphqlPluralName
      }
    }
  }
`;

// Run debug query on startup
client.query({
  query: DEBUG_QUERY
}).then(result => {
  console.log('Available Content Types:', result.data?.contentTypes?.nodes);
}).catch(error => {
  console.error('GraphQL Debug Query Error:', {
    message: error.message,
    networkError: error.networkError?.result,
    graphQLErrors: error.graphQLErrors,
  });
}); 