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
    posts {
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
  if (result.data?.categories?.nodes) {
    console.log('Available Categories:', result.data.categories.nodes.map(cat => ({
      name: cat.name,
      slug: cat.slug,
      count: cat.count
    })));
  }
  if (result.data?.posts?.nodes) {
    console.log('Posts with Categories:', result.data.posts.nodes.map(post => ({
      title: post.title,
      categories: post.categories.nodes.map(cat => cat.name)
    })));
  }
}).catch(error => {
  console.error('GraphQL Debug Query Error:', {
    message: error.message,
    networkError: error.networkError?.result?.errors || error.networkError,
    graphQLErrors: error.graphQLErrors,
  });
});

// Query to get all published trips (using travel and adventure categories)
export const GET_TRIPS = gql`
  query GetTrips {
    posts(first: 100, where: { status: PUBLISH, categoryIn: ["travel", "adventure"] }) {
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
        ... on Post {
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
    }
  }
`;

// Query to get all published destinations (using specific location categories)
export const GET_DESTINATIONS = gql`
  query GetDestinations {
    posts(first: 100, where: { status: PUBLISH, categoryIn: ["افضل-الاماكن-السياحية-فى-شرق-اوربا", "البوسنة"] }) {
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
        ... on Post {
          acf {
            location
            rating
            ratingCount
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
      ... on Post {
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
  }
`; 