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

// Debug query to show available data
const DEBUG_QUERY = gql`
  query DebugQuery {
    posts(first: 100) {
      nodes {
        id
        title
        status
        categories {
          nodes {
            name
            slug
          }
        }
        acf {
          price
          duration
          location
        }
      }
    }
    categories {
      nodes {
        id
        name
        slug
        count
      }
    }
  }
`;

// Run debug query with better error handling
client.query({
  query: DEBUG_QUERY
}).then(result => {
  console.log('=== WordPress GraphQL Debug Info ===');
  console.log('Raw GraphQL Response:', result);
  
  if (result.errors) {
    console.error('GraphQL Query Errors:', result.errors);
  }
  
  if (result.data?.categories?.nodes) {
    console.log('Available Categories:', result.data.categories.nodes.map(cat => ({
      name: cat.name,
      slug: cat.slug,
      count: cat.count
    })));
  }
  
  if (result.data?.posts?.nodes) {
    console.log('Posts with Categories and ACF:', result.data.posts.nodes.map(post => ({
      title: post.title,
      categories: post.categories?.nodes?.map(cat => cat.name) || [],
      acf: post.acf
    })));
  }
}).catch(error => {
  console.error('GraphQL Debug Query Error:', {
    message: error.message,
    networkError: error.networkError?.result?.errors || error.networkError,
    graphQLErrors: error.graphQLErrors,
    stack: error.stack
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
        acf {
          price
          duration
          location
          rating
          ratingCount
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
        acf {
          location
          rating
          ratingCount
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
      acf {
        price
        duration
        location
        rating
        ratingCount
        difficulty
        included
        notIncluded
        itinerary
        gallery {
          sourceUrl
        }
      }
    }
  }
`; 