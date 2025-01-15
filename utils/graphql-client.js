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
  query GetTripBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
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
  
  if (result.data?.categories?.nodes) {
    console.log('🏷️ Available Categories:');
    result.data.categories.nodes.forEach(cat => {
      console.log(`  - ${cat.name} (${cat.slug}) - ${cat.count} posts`);
    });
  } else {
    console.warn('⚠️ No categories found');
  }
  
  if (result.data?.posts?.nodes) {
    console.log('📝 Sample Posts:');
    result.data.posts.nodes.forEach(post => {
      console.log(`  - ${post.title}`);
      console.log(`    Categories:`, post.categories?.nodes?.map(c => c.name) || []);
    });
  } else {
    console.warn('⚠️ No posts found');
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