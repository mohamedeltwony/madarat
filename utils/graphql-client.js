import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const graphqlUrl = (process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL || 'https://madaratalkon.com/graphql').trim();
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

// Log any GraphQL errors with more detail
const withErrorLogging = async (promise) => {
  try {
    const result = await promise;
    console.log('GraphQL Response:', {
      data: result.data,
      errors: result.errors,
    });
    if (!result.data) {
      console.error('No data returned from GraphQL');
      throw new Error('No data returned from GraphQL');
    }
    return result;
  } catch (error) {
    console.error('GraphQL Error:', {
      message: error.message,
      networkError: error.networkError?.result,
      graphQLErrors: error.graphQLErrors,
      status: error.networkError?.status,
      statusText: error.networkError?.statusText,
      uri: graphqlUrl,
    });
    throw error;
  }
};

export const GET_TRIPS = gql`
  query GetTrips($first: Int, $after: String) {
    posts(first: $first, after: $after, where: { postType: "trip", status: PUBLISH }) {
      nodes {
        id
        title
        slug
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
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

// Wrap the client query method with error logging
const originalQuery = client.query.bind(client);
client.query = (...args) => withErrorLogging(originalQuery(...args));

export const GET_DESTINATIONS = gql`
  query GetDestinations {
    posts(where: { postType: "destination", status: PUBLISH }) {
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

export const GET_ACTIVITIES = gql`
  query GetActivities {
    posts(where: { postType: "activity", status: PUBLISH }) {
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
  query GetTripBySlug($slug: String!) {
    post(id: $slug, idType: SLUG) {
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
        difficulty
        gallery {
          sourceUrl
        }
        itinerary
        included
        notIncluded
      }
      activities {
        nodes {
          id
          title
          slug
        }
      }
      tags {
        nodes {
          id
          name
          slug
        }
      }
    }
  }
`;

// Add introspection query to check available types
export const GET_POST_TYPES = gql`
  query GetPostTypes {
    __type(name: "PostTypeEnum") {
      enumValues {
        name
        description
      }
    }
  }
`;

// Modify the client to log the schema
client.query({
  query: GET_POST_TYPES
}).then(result => {
  console.log('Available Post Types:', result.data.__type?.enumValues);
}).catch(error => {
  console.error('Error fetching post types:', error);
}); 